<?php
/* POST api/hold.php  {property, checkin, checkout, guests, children, name, email, phone, expected_total_cents}
   Public (guest checkout, no account needed). Re-validates everything, recomputes the quote,
   and locks the nights for SDO_HOLD_MINUTES. Session 2 adds the Stripe Checkout session here. */
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

json_out([
  'ok' => true,
  'hold' => ['id' => $hold['id'], 'expires_at' => $hold['expires_at'], 'hold_minutes' => SDO_HOLD_MINUTES],
  'quote' => $quote,
  /* session 2: 'checkout_url' => Stripe Checkout session URL */
  'next' => 'checkout_not_wired_yet',
]);
