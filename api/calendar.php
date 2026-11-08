<?php
/* GET api/calendar.php?property=sundestin_203[&from=YYYY-MM-DD&to=YYYY-MM-DD]
   Public. Returns the property's booking settings, published rates and occupied nights.
   Occupied nights carry only their kind (booked, hold, block), never guest details. */
declare(strict_types=1);
require __DIR__ . '/lib.php';
require_method('GET');
rate_limit('calendar', 120);

$p = property($_GET['property'] ?? 'sundestin_203');
$today = today_local($p['timezone']);
$from = $_GET['from'] ?? $today;
$to   = $_GET['to']   ?? (new DateTimeImmutable($today))->modify('+' . (int)$p['booking_window_days'] . ' days')->format('Y-m-d');
if (!is_date($from) || !is_date($to) || $to < $from) fail('bad_dates', 'from/to must be YYYY-MM-DD.');

$rates = all('SELECT start_date AS start, end_date AS "end", season, label, nightly_cents, min_nights FROM rates WHERE property_id = ? AND end_date >= ? AND start_date <= ? ORDER BY start_date', [$p['id'], $from, $to]);
$nights = all("SELECT night, kind FROM nights WHERE property_id = ? AND night >= ? AND night <= ? AND (expires_at IS NULL OR expires_at >= ?) ORDER BY night", [$p['id'], $from, $to, now_utc()]);

json_out([
  'ok' => true, 'api' => SDO_API_VERSION,
  'property' => [
    'id' => $p['id'], 'name' => $p['name'], 'timezone' => $p['timezone'], 'today' => $today, 'currency' => $p['currency'],
    'min_nights' => (int)$p['min_nights'], 'max_nights' => (int)$p['max_nights'], 'sleeps' => (int)$p['sleeps'],
    'cleaning_cents' => (int)$p['cleaning_cents'], 'tax_rate_bp' => (int)$p['tax_rate_bp'], 'booking_window_days' => (int)$p['booking_window_days'],
  ],
  'rates' => array_map(fn($r) => ['start' => $r['start'], 'end' => $r['end'], 'season' => $r['season'], 'label' => $r['label'], 'nightly' => (int)$r['nightly_cents'] / 100, 'min_nights' => (int)$r['min_nights']], $rates),
  'nights' => $nights,
  'hold_minutes' => SDO_HOLD_MINUTES,
]);
