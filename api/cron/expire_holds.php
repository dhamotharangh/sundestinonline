<?php
/* GET api/cron/expire_holds.php?key=<CRON_KEY>   (Hostinger cron, every 5 minutes)
   or  php api/cron/expire_holds.php               (command line, no key needed)
   Releases holds whose time is up and expires their Stripe Checkout sessions so they cannot be paid. */
declare(strict_types=1);
require dirname(__DIR__) . '/lib.php';

if (PHP_SAPI !== 'cli') {
  $want = (string)env('CRON_KEY', '');
  $got  = (string)($_GET['key'] ?? '');
  if ($want === '' || $want === 'change-me' || !hash_equals($want, $got)) fail('forbidden', 'Forbidden.', 403);
}

$stale = all("SELECT id, stripe_session_id FROM holds WHERE status = 'open' AND expires_at < ?", [now_utc()]);
tx_begin();
try { $released = sweep_expired_holds(); tx_commit(); }
catch (Throwable $e) { tx_rollback(); throw $e; }

$expired = 0; $errors = 0;
foreach ($stale as $h) {
  if (!$h['stripe_session_id']) continue;
  try { stripe_request('POST', 'checkout/sessions/' . rawurlencode($h['stripe_session_id']) . '/expire'); $expired++; }
  catch (Throwable $e) { $errors++; }       /* usually "already expired": fine */
}
if ($released) audit('cron', 'holds.expire', 'holds', null, ['released' => $released, 'stripe_expired' => $expired]);

json_out(['ok' => true, 'released' => $released, 'stripe_sessions_expired' => $expired, 'stripe_errors' => $errors]);
