<?php
/* POST api/hold.php  {property, checkin, checkout, guests, children, name, email, phone, agree, expected_total_cents}
   Public (guest checkout, no account needed). Re-validates everything, recomputes the quote,
   locks the nights, then opens a Stripe Checkout session for the exact total and returns its URL.
   The booking is only confirmed by the signed webhook (api/stripe_webhook.php), never by the browser. */
declare(strict_types=1);
require __DIR__ . '/lib.php';
require_method('POST');
require_same_origin();
rate_limit('hold', 10);

$in = json_in();
$p = property((string)($in['property'] ?? 'sundestin_203'));

$name  = trim((string)($in['name'] ?? ''));
$email = strtolower(trim((string)($in['email'] ?? '')));
$phone = trim((string)($in['phone'] ?? ''));
if (mb_strlen($name) < 2 || mb_strlen($name) > 120) fail('name', 'Please give your name.');
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 200) fail('email', 'Please give a valid email address.');
if (strlen($phone) > 40) fail('phone', 'Phone number is too long.');
if (empty($in['agree'])) fail('agree', 'Please accept the terms and cancellation policy.');
rate_limit('hold_email', 5, 3600, $email);

$quote = build_quote($p, (string)($in['checkin'] ?? ''), (string)($in['checkout'] ?? ''), (int)($in['guests'] ?? 2), (int)($in['children'] ?? 0));
if (!$quote['available']) fail('unavailable', 'Some of those nights are no longer free.', 409, ['nights' => $quote['unavailable_nights']]);

/* The browser sends the total it showed; if the price changed since, say so instead of charging silently. */
if (isset($in['expected_total_cents']) && (int)$in['expected_total_cents'] !== $quote['total_cents']) {
  fail('price_changed', 'The price for those dates has changed. Please review the new total.', 409, ['quote' => $quote]);
}

$hold = place_hold($p, $quote, ['name' => $name, 'email' => $email, 'phone' => $phone], client_ip());

/* Stripe Checkout (hosted card page; card details never touch this site).
   Stripe requires a session to live at least 30 minutes, so the session and the hold
   share one expiry a couple of minutes past SDO_HOLD_MINUTES. */
$site = rtrim((string)env('SITE_URL', 'https://sundestinonline.com'), '/');
$expiresTs = time() + (SDO_HOLD_MINUTES + 2) * 60;
$expiresAt = gmdate('Y-m-d H:i:s', $expiresTs);
try {
  $session = stripe_request('POST', 'checkout/sessions', [
    'mode' => 'payment',
    'client_reference_id' => $hold['id'],
    'customer_email' => $email,
    'expires_at' => $expiresTs,
    'success_url' => $site . '/booking.html?hold=' . rawurlencode($hold['id']) . '&session_id={CHECKOUT_SESSION_ID}',
    'cancel_url' => $site . '/index.html?canceled=1#rates',
    'metadata' => ['hold_id' => $hold['id'], 'property_id' => $p['id']],
    'payment_intent_data' => [
      'metadata' => ['hold_id' => $hold['id']],
      'description' => $p['name'] . ', ' . $quote['checkin'] . ' to ' . $quote['checkout'],
    ],
    'line_items' => [[
      'quantity' => 1,
      'price_data' => [
        'currency' => strtolower($p['currency']),
        'unit_amount' => (int)$quote['total_cents'],
        'product_data' => ['name' => $p['name'] . ' (' . $quote['checkin'] . ' to ' . $quote['checkout'] . ')',
                           'description' => 'All-in total: nightly rate, cleaning and taxes'],
      ],
    ]],
  ], 'hold_' . $hold['id']);
} catch (Throwable $e) {
  /* no payment page means no hold: give the nights straight back */
  q("DELETE FROM nights WHERE kind = 'hold' AND ref = ?", [$hold['id']]);
  q("UPDATE holds SET status = 'cancelled' WHERE id = ?", [$hold['id']]);
  error_log('hold.php stripe: ' . $e->getMessage());
  fail('payment_unavailable', 'Online payment is not available right now. Please try again in a few minutes or contact us.', 503);
}

q('UPDATE holds SET stripe_session_id = ?, expires_at = ? WHERE id = ?', [$session['id'], $expiresAt, $hold['id']]);
q("UPDATE nights SET expires_at = ? WHERE kind = 'hold' AND ref = ?", [$expiresAt, $hold['id']]);

json_out([
  'ok' => true,
  'hold' => ['id' => $hold['id'], 'expires_at' => $expiresAt, 'hold_minutes' => SDO_HOLD_MINUTES + 2],
  'quote' => $quote,
  'checkout_url' => $session['url'],
]);
