<?php
/* Command-line tool (never served over HTTP, see api/.htaccess).
     php api/cli.php migrate                      create tables
     php api/cli.php seed                         load data/rates.csv, data/availability.csv and the fees from data/properties.js
     php api/cli.php sweep                        release expired holds (what the cron job does)
     php api/cli.php hold 2027-03-10 2027-03-14 [name] [email]   place a hold directly (used by the concurrency test)
     php api/cli.php nights [from] [to]           show occupied nights
     php api/cli.php reset                        empty holds and nights that came from holds (local only) */
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require __DIR__ . '/lib.php';

$root = dirname(__DIR__);
$cmd = $argv[1] ?? 'help';

function csv_rows(string $path): array {
  $fh = fopen($path, 'r'); if (!$fh) throw new RuntimeException("cannot read $path");
  $head = fgetcsv($fh); $rows = [];
  while (($r = fgetcsv($fh)) !== false) { if (count($r) < count($head)) continue; $rows[] = array_combine($head, array_map('trim', $r)); }
  fclose($fh); return $rows;
}

switch ($cmd) {
  case 'migrate':
    migrate(); echo "migrated (" . (is_sqlite() ? 'sqlite' : 'mysql') . ")\n"; break;

  case 'seed':
    migrate();
    /* property settings from data/properties.js (fees, min nights, sleeps) */
    $js = file_get_contents("$root/data/properties.js");
    preg_match('/id:\s*"([^"]+)"/', $js, $mid);
    preg_match('/name:\s*"([^"]+)"/', $js, $mname);
    preg_match('/cleaning:\s*([\d.]+)/', $js, $mclean);
    preg_match('/tax_rate:\s*([\d.]+)/', $js, $mtax);
    preg_match('/min_nights:\s*(\d+)/', $js, $mmin);
    preg_match('/sleeps:\s*(\d+)/', $js, $msleeps);
    $pid = $mid[1] ?? 'sundestin_203';
    $exists = one('SELECT id FROM properties WHERE id = ?', [$pid]);
    $vals = [$mname[1] ?? 'SunDestin #203', 'America/Chicago', 'USD', (int)($mmin[1] ?? 2), 28, (int)($msleeps[1] ?? 6), (int)round(((float)($mclean[1] ?? 0)) * 100), (int)round(((float)($mtax[1] ?? 0)) * 10000), 540, 1];
    if ($exists) q('UPDATE properties SET name=?, timezone=?, currency=?, min_nights=?, max_nights=?, sleeps=?, cleaning_cents=?, tax_rate_bp=?, booking_window_days=?, active=? WHERE id = ?', array_merge($vals, [$pid]));
    else q('INSERT INTO properties (name, timezone, currency, min_nights, max_nights, sleeps, cleaning_cents, tax_rate_bp, booking_window_days, active, id) VALUES (?,?,?,?,?,?,?,?,?,?,?)', array_merge($vals, [$pid]));
    /* rates: replace the property's rows with the CSV */
    q('DELETE FROM rates WHERE property_id = ?', [$pid]);
    $n = 0;
    foreach (csv_rows("$root/data/rates.csv") as $r) {
      if ($r['property_id'] !== $pid) continue;
      q('INSERT INTO rates (id, property_id, start_date, end_date, season, label, nightly_cents, min_nights) VALUES (?,?,?,?,?,?,?,?)',
        [new_id('r_'), $pid, $r['start'], $r['end'], $r['season'], $r['label'], (int)round(((float)$r['nightly']) * 100), (int)$r['min_nights']]);
      $n++;
    }
    /* availability: booked rows become reservations-less 'booked' nights (sample), blocked rows become owner blocks */
    q("DELETE FROM nights WHERE property_id = ? AND kind IN ('booked','block') AND ref LIKE 'seed_%'", [$pid]);
    q("DELETE FROM blocks WHERE property_id = ? AND id LIKE 'seed_%'", [$pid]);
    $m = 0;
    foreach (csv_rows("$root/data/availability.csv") as $r) {
      if ($r['property_id'] !== $pid) continue;
      $kind = $r['status'] === 'blocked' ? 'block' : 'booked';
      $ref = 'seed_' . substr(md5($r['checkin'] . $r['checkout']), 0, 8);
      if ($kind === 'block') q('INSERT INTO blocks (id, property_id, checkin, checkout, kind, note, created_at) VALUES (?,?,?,?,?,?,?)', [$ref, $pid, $r['checkin'], $r['checkout'], 'owner', $r['note'] ?? '', now_utc()]);
      try { occupy_nights($pid, $r['checkin'], $r['checkout'], $kind, $ref); $m++; }
      catch (PDOException $e) { echo "skip {$r['checkin']}..{$r['checkout']}: overlaps\n"; }
    }
    echo "seeded property $pid: $n rate rows, $m availability rows\n"; break;

  case 'sweep':
    echo "released " . sweep_expired_holds() . " expired holds\n"; break;

  case 'hold':
    $p = property('sundestin_203');
    $ci = $argv[2] ?? ''; $co = $argv[3] ?? '';
    try {
      $quote = build_quote($p, $ci, $co, 2, 0);
      if (!$quote['available']) { echo "FAIL unavailable\n"; exit(2); }
      $h = place_hold($p, $quote, ['name' => $argv[4] ?? 'CLI Test', 'email' => $argv[5] ?? 'cli@example.com', 'phone' => ''], 'cli');
      echo "OK {$h['id']} total " . cents_to_money($quote['total_cents']) . " expires {$h['expires_at']}\n";
    } catch (Throwable $e) { echo "FAIL " . $e->getMessage() . "\n"; exit(2); }
    break;

  case 'nights':
    foreach (all('SELECT night, kind, ref, expires_at FROM nights WHERE night >= ? AND night <= ? ORDER BY night', [$argv[2] ?? '2000-01-01', $argv[3] ?? '2099-12-31']) as $r) echo implode("\t", $r) . "\n";
    break;

  case 'reset':
    if (!is_sqlite()) { echo "reset is for the local SQLite database only\n"; exit(1); }
    q("DELETE FROM nights WHERE kind = 'hold'"); q('DELETE FROM holds'); q('DELETE FROM rate_limits');
    echo "holds cleared\n"; break;

  default:
    echo "commands: migrate | seed | sweep | hold <checkin> <checkout> | nights [from] [to] | reset\n";
}
