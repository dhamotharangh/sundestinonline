<?php
/* GET api/reservation.php?hold=&session_id=   (the Stripe return link, used by booking.html)
   GET api/reservation.php?ref=&email=         (from the confirmation email)
   Reveals nothing without a matching pair. If the webhook has not landed yet, it asks Stripe
   directly, so a booking still confirms when the webhook is slow or not set up. */
declare(strict_types=1);
require __DIR__ . '/lib.php';
require_method('GET');
rate_limit('reservation', 60);

$holdId = (string)($_GET['hold'] ?? '');
$sid    = (string)($_GET['session_id'] ?? '');
$ref    = strtoupper(trim((string)($_GET['ref'] ?? '')));
$email  = strtolower(trim((string)($_GET['email'] ?? '')));
$r = null;

if ($holdId !== '' && $sid !== '') {
  $h = one('SELECT * FROM holds WHERE id = ?', [$holdId]);
  if (!$h || !$h['stripe_session_id'] || !hash_equals((string)$h['stripe_session_id'], $sid)) fail('not_found', 'Booking not found.', 404);
  $r = one('SELECT * FROM reservations WHERE hold_id = ?', [$holdId]);
  if (!$r && $h['status'] === 'open') {
    try {
      $s = stripe_request('GET', 'checkout/sessions/' . rawurlencode($sid));
      if (($s['payment_status'] ?? '') === 'paid') {
        $res = confirm_hold($s);
        if ($res['new']) reservation_emails($res['reservation']);
        $r = $res['reservation'];
      }
    } catch (Throwable $e) { error_log('reservation.php: ' . $e->getMessage()); }
  }
  if (!$r) {
    $h = one('SELECT status, checkin, checkout FROM holds WHERE id = ?', [$holdId]);
    $status = in_array($h['status'], ['open', 'paid'], true) ? 'pending' : $h['status'];   /* expired | cancelled */
    json_out(['ok' => true, 'status' => $status, 'checkin' => $h['checkin'], 'checkout' => $h['checkout']]);
  }
} elseif ($ref !== '' && $email !== '') {
  $r = one('SELECT * FROM reservations WHERE ref = ?', [$ref]);
  if (!$r || !hash_equals(strtolower((string)$r['guest_email']), $email)) fail('not_found', 'Booking not found.', 404);
} else {
  fail('missing', 'Give hold and session_id, or ref and email.');
}

$p = one('SELECT name FROM properties WHERE id = ?', [$r['property_id']]);
json_out(['ok' => true, 'status' => $r['status'], 'reservation' => [
  'ref' => $r['ref'],
  'property' => $p['name'] ?? '',
  'checkin' => $r['checkin'],
  'checkout' => $r['checkout'],
  'guests' => (int)$r['guests'],
  'children' => (int)$r['children'],
  'guest_name' => $r['guest_name'],
  'guest_email' => $r['guest_email'],
  'total_cents' => (int)$r['total_cents'],
  'total' => cents_to_money((int)$r['total_cents']),
  'currency' => $r['currency'],
]]);
