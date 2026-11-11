<?php
/* POST api/stripe_webhook.php  — called by Stripe, never by the browser.
   Verifies the signature on the raw body, processes each event id once, and:
   checkout.session.completed / async_payment_succeeded (paid) -> reservation, nights booked, emails
   checkout.session.expired / async_payment_failed            -> hold released
   Stripe CLI locally:  stripe listen --forward-to 127.0.0.1:8766/api/stripe_webhook.php */
declare(strict_types=1);
require __DIR__ . '/lib.php';
require_method('POST');

$payload = (string)file_get_contents('php://input');
$sig = (string)($_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '');
if (!stripe_verify_signature($payload, $sig, (string)env('STRIPE_WEBHOOK_SECRET', ''))) fail('signature', 'Bad signature.', 400);

$event = json_decode($payload, true);
if (!is_array($event) || empty($event['id']) || empty($event['type'])) fail('bad_event', 'Not a Stripe event.', 400);

/* Idempotency: an event id is processed once. Replays get 200 and do nothing. */
try { q('INSERT INTO stripe_events (id, type, received_at) VALUES (?,?,?)', [$event['id'], $event['type'], now_utc()]); }
catch (PDOException $e) { json_out(['ok' => true, 'duplicate' => true]); }

$obj = $event['data']['object'] ?? [];
$holdId = (string)($obj['metadata']['hold_id'] ?? $obj['client_reference_id'] ?? '');

try {
  switch ($event['type']) {
    case 'checkout.session.completed':
    case 'checkout.session.async_payment_succeeded':
      if (($obj['payment_status'] ?? '') !== 'paid') break;          /* bank payments confirm later */
      try {
        $res = confirm_hold($obj);
      } catch (PDOException $e) {
        $m = $e->getMessage();
        if (!str_contains($m, 'UNIQUE') && !str_contains($m, 'Duplicate')) throw $e;
        /* paid after its nights were taken by someone else: refund in full and tell the owner */
        if (!empty($obj['payment_intent'])) stripe_request('POST', 'refunds', ['payment_intent' => $obj['payment_intent']], 'conflict_' . $obj['id']);
        q("UPDATE holds SET status = 'cancelled' WHERE id = ?", [$holdId]);
        audit('stripe', 'hold.conflict_refund', $holdId, null, ['session' => $obj['id'] ?? '']);
        $owner = (string)env('OWNER_EMAIL', '');
        if ($owner !== '') send_mail($owner, 'Booking refunded: dates were taken', "Hold $holdId was paid after its nights were taken. The payment was refunded in full automatically.");
        break;
      }
      if ($res['new']) reservation_emails($res['reservation']);
      break;

    case 'checkout.session.expired':
    case 'checkout.session.async_payment_failed':
      if (one("SELECT id FROM holds WHERE id = ? AND status = 'open'", [$holdId])) {
        q("DELETE FROM nights WHERE kind = 'hold' AND ref = ?", [$holdId]);
        q("UPDATE holds SET status = 'expired' WHERE id = ? AND status = 'open'", [$holdId]);
        audit('stripe', 'hold.release', $holdId, null, ['event' => $event['type']]);
      }
      break;
  }
} catch (Throwable $e) {
  /* forget the event so Stripe's retry gets processed */
  q('DELETE FROM stripe_events WHERE id = ?', [$event['id']]);
  error_log('stripe_webhook ' . $event['type'] . ': ' . $e->getMessage());
  fail('processing', 'Could not process the event.', 500);
}

json_out(['ok' => true]);
