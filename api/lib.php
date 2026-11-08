<?php
/* SunDestin Online — booking API library.
   Plain PHP 8 + PDO. Same code runs on SQLite (local development) and MySQL (Hostinger).
   Nothing here trusts the browser: dates, totals and availability are recomputed on every call. */
declare(strict_types=1);

/* This file is a library. Asking for it directly gets a 404 even where .htaccess is not honoured. */
if (PHP_SAPI !== 'cli' && basename($_SERVER['SCRIPT_FILENAME'] ?? '') === 'lib.php') { http_response_code(404); exit; }

const SDO_HOLD_MINUTES = 30;          /* Stripe Checkout sessions live at least 30 minutes, so holds match */
const SDO_API_VERSION  = 1;

/* ── configuration: api/.env (never committed) or real environment variables ── */
function env(string $key, ?string $default = null): ?string {
  static $file = null;
  if ($file === null) {
    $file = [];
    $p = __DIR__ . '/.env';
    if (is_file($p)) {
      foreach (file($p, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#' || !str_contains($line, '=')) continue;
        [$k, $v] = explode('=', $line, 2);
        $file[trim($k)] = trim($v, " \t\"'");
      }
    }
  }
  $v = getenv($key);
  if ($v !== false) return $v;
  return $file[$key] ?? $default;
}

/* ── database ── */
function db(): PDO {
  static $pdo = null;
  if ($pdo) return $pdo;
  $dsn = env('DB_DSN');
  if (!$dsn) {
    $path = env('SQLITE_PATH', dirname(__DIR__) . '/var/sdo.sqlite');
    if (!is_dir(dirname($path))) mkdir(dirname($path), 0770, true);
    $dsn = 'sqlite:' . $path;
  }
  $pdo = new PDO($dsn, env('DB_USER'), env('DB_PASS'), [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
  ]);
  if (is_sqlite()) {
    $pdo->exec('PRAGMA journal_mode=WAL');
    $pdo->exec('PRAGMA busy_timeout=8000');
    $pdo->exec('PRAGMA foreign_keys=ON');
  } else {
    $pdo->exec("SET NAMES utf8mb4");
    $pdo->exec("SET time_zone = '+00:00'");
  }
  return $pdo;
}
function is_sqlite(): bool { return db()->getAttribute(PDO::ATTR_DRIVER_NAME) === 'sqlite'; }

function migrate(): void {
  $sql = file_get_contents(__DIR__ . '/schema.sql');
  $sql = preg_replace('/--[^\n]*/', '', $sql);               /* drop SQL comments first; they may contain ; */
  foreach (array_filter(array_map('trim', explode(';', $sql))) as $stmt) {
    if ($stmt === '') continue;
    if (!is_sqlite()) $stmt = preg_replace('/CREATE INDEX IF NOT EXISTS (\w+) ON (\w+)/', 'CREATE INDEX $1 ON $2', $stmt);
    try { db()->exec($stmt); }
    catch (PDOException $e) { if (!str_contains($e->getMessage(), 'Duplicate key name')) throw $e; }
  }
}

/* "BEGIN IMMEDIATE" takes SQLite's write lock up front so two holds serialize instead of
   both reading "free" and then colliding. MySQL/InnoDB handles this with row locks. */
function tx_begin(): void { if (is_sqlite()) db()->exec('BEGIN IMMEDIATE'); else db()->beginTransaction(); }
function tx_commit(): void { if (is_sqlite()) db()->exec('COMMIT'); else db()->commit(); }
function tx_rollback(): void { try { if (is_sqlite()) db()->exec('ROLLBACK'); else db()->rollBack(); } catch (Throwable $e) {} }

function q(string $sql, array $args = []): PDOStatement { $st = db()->prepare($sql); $st->execute($args); return $st; }
function one(string $sql, array $args = []): ?array { $r = q($sql, $args)->fetch(); return $r === false ? null : $r; }
function all(string $sql, array $args = []): array { return q($sql, $args)->fetchAll(); }

/* ── ids, time, money ── */
function new_id(string $prefix = ''): string { return $prefix . bin2hex(random_bytes(10)); }
function new_ref(): string {
  $alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';         /* no 0/O/1/I */
  do {
    $s = '';
    for ($i = 0; $i < 5; $i++) $s .= $alphabet[random_int(0, strlen($alphabet) - 1)];
    $ref = 'SD-' . $s;
  } while (one('SELECT ref FROM reservations WHERE ref = ?', [$ref]));
  return $ref;
}
function now_utc(): string { return gmdate('Y-m-d H:i:s'); }
function utc_plus(int $seconds): string { return gmdate('Y-m-d H:i:s', time() + $seconds); }
function today_local(string $tz): string { return (new DateTimeImmutable('now', new DateTimeZone($tz)))->format('Y-m-d'); }
function is_date(string $s): bool { return (bool)preg_match('/^\d{4}-\d{2}-\d{2}$/', $s) && checkdate((int)substr($s, 5, 2), (int)substr($s, 8, 2), (int)substr($s, 0, 4)); }
function nights_between(string $checkin, string $checkout): array {
  $out = [];
  for ($d = new DateTimeImmutable($checkin); $d->format('Y-m-d') < $checkout; $d = $d->modify('+1 day')) $out[] = $d->format('Y-m-d');
  return $out;
}
function cents_to_money(int $c): string { return '$' . number_format($c / 100, 2); }

/* ── HTTP helpers ── */
function client_ip(): string { return $_SERVER['REMOTE_ADDR'] ?? 'cli'; }
function json_out(array $data, int $status = 200): never {
  http_response_code($status);
  header('Content-Type: application/json; charset=utf-8');
  header('Cache-Control: no-store');
  header('X-Content-Type-Options: nosniff');
  echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
  exit;
}
function fail(string $code, string $message, int $status = 400, array $extra = []): never {
  json_out(['ok' => false, 'error' => $code, 'message' => $message] + $extra, $status);
}
function json_in(): array {
  $raw = file_get_contents('php://input');
  if ($raw === '' || $raw === false) return $_POST;
  $d = json_decode($raw, true);
  if (!is_array($d)) fail('bad_json', 'The request body is not valid JSON.');
  return $d;
}
function require_method(string $m): void {
  if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== $m) fail('method', "Use $m.", 405);
}
/* Same-origin only: a browser elsewhere cannot call the API, the site itself can. */
function require_same_origin(): void {
  $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
  if ($origin === '') return;                                   /* non-browser or same-origin GET */
  $host = $_SERVER['HTTP_HOST'] ?? '';
  if (parse_url($origin, PHP_URL_HOST) !== explode(':', $host)[0]) fail('origin', 'Cross-site requests are not allowed.', 403);
}

/* Fixed-window rate limit. Returns silently or fails with 429. */
function rate_limit(string $bucket, int $max, int $windowSeconds = 60, ?string $who = null): void {
  $who = $who ?? client_ip();
  $key = substr($bucket . ':' . $who, 0, 160);
  $win = intdiv(time(), $windowSeconds) * $windowSeconds;
  $row = one('SELECT window_start, hits FROM rate_limits WHERE rl_key = ?', [$key]);
  if (!$row || (int)$row['window_start'] !== $win) {
    if ($row) q('UPDATE rate_limits SET window_start = ?, hits = 1 WHERE rl_key = ?', [$win, $key]);
    else q('INSERT INTO rate_limits (rl_key, window_start, hits) VALUES (?, ?, 1)', [$key, $win]);
    return;
  }
  if ((int)$row['hits'] >= $max) fail('rate_limited', 'Too many requests. Please wait a minute and try again.', 429);
  q('UPDATE rate_limits SET hits = hits + 1 WHERE rl_key = ?', [$key]);
}

function audit(string $actor, string $action, string $target, ?array $before = null, ?array $after = null): void {
  q('INSERT INTO audit_log (id, actor, action, target, before_json, after_json, at) VALUES (?,?,?,?,?,?,?)',
    [new_id('a_'), $actor, $action, $target, $before === null ? null : json_encode($before), $after === null ? null : json_encode($after), now_utc()]);
}

/* ── property, rates, availability ── */
function property(string $id): array {
  $p = one('SELECT * FROM properties WHERE id = ? AND active = 1', [$id]);
  if (!$p) fail('no_property', 'Unknown property.', 404);
  return $p;
}
function rate_for(string $propertyId, string $night): ?array {
  return one('SELECT * FROM rates WHERE property_id = ? AND start_date <= ? AND end_date >= ? ORDER BY start_date DESC LIMIT 1', [$propertyId, $night, $night]);
}

/* Drop holds whose time is up. Called inside the hold transaction and by cron. */
function sweep_expired_holds(): int {
  $now = now_utc();
  $expired = all("SELECT id FROM holds WHERE status = 'open' AND expires_at < ?", [$now]);
  foreach ($expired as $h) {
    q("DELETE FROM nights WHERE kind = 'hold' AND ref = ?", [$h['id']]);
    q("UPDATE holds SET status = 'expired' WHERE id = ? AND status = 'open'", [$h['id']]);
  }
  return count($expired);
}

/* Validate a stay request. Returns [checkin, checkout, nights[]] or fails. */
function validate_stay(array $p, string $checkin, string $checkout, int $guests, int $children): array {
  if (!is_date($checkin) || !is_date($checkout)) fail('bad_dates', 'Dates must be YYYY-MM-DD.');
  if ($checkout <= $checkin) fail('order', 'Check-out must be after check-in.');
  $today = today_local($p['timezone']);
  if ($checkin < $today) fail('past', 'Check-in is in the past.');
  $horizon = (new DateTimeImmutable($today))->modify('+' . (int)$p['booking_window_days'] . ' days')->format('Y-m-d');
  if ($checkout > $horizon) fail('too_far', 'Those dates are further ahead than the booking window.');
  $nights = nights_between($checkin, $checkout);
  $n = count($nights);
  if ($n < (int)$p['min_nights']) fail('min_nights', 'Stays are a minimum of ' . $p['min_nights'] . ' nights.', 400, ['min' => (int)$p['min_nights']]);
  if ($n > (int)$p['max_nights']) fail('max_nights', 'Stays are at most ' . $p['max_nights'] . ' nights.', 400, ['max' => (int)$p['max_nights']]);
  if ($guests < 1) fail('guests', 'At least one adult.');
  if ($children < 0) fail('guests', 'Children cannot be negative.');
  if ($guests + $children > (int)$p['sleeps']) fail('sleeps', 'This condo sleeps ' . $p['sleeps'] . '.', 400, ['sleeps' => (int)$p['sleeps']]);
  return [$checkin, $checkout, $nights];
}

/* Server-side quote. The only place totals are computed. */
function build_quote(array $p, string $checkin, string $checkout, int $guests, int $children): array {
  [$checkin, $checkout, $nights] = validate_stay($p, $checkin, $checkout, $guests, $children);
  $lines = []; $order = []; $sub = 0; $seasonMin = 0; $missing = [];
  foreach ($nights as $night) {
    $r = rate_for($p['id'], $night);
    if (!$r) { $missing[] = $night; continue; }
    $sub += (int)$r['nightly_cents'];
    $seasonMin = max($seasonMin, (int)$r['min_nights']);
    if (!isset($lines[$r['label']])) { $lines[$r['label']] = ['label' => $r['label'], 'season' => $r['season'], 'nightly_cents' => (int)$r['nightly_cents'], 'nights' => 0]; $order[] = $r['label']; }
    $lines[$r['label']]['nights']++;
  }
  if ($missing) fail('no_rate', 'No rate is published yet for part of those dates. Ask the owner.', 409, ['nights' => $missing]);
  $taken = all("SELECT night, kind FROM nights WHERE property_id = ? AND night >= ? AND night < ? AND (expires_at IS NULL OR expires_at >= ?)", [$p['id'], $checkin, $checkout, now_utc()]);
  $cleaning = (int)$p['cleaning_cents'];
  $tax = (int)round(($sub + $cleaning) * (int)$p['tax_rate_bp'] / 10000);
  $total = $sub + $cleaning + $tax;
  return [
    'property_id' => $p['id'], 'checkin' => $checkin, 'checkout' => $checkout, 'nights' => count($nights),
    'guests' => $guests, 'children' => $children,
    'lines' => array_values(array_map(fn($l) => $l + ['subtotal_cents' => $l['nightly_cents'] * $l['nights']], array_replace(array_flip($order), $lines))),
    'subtotal_cents' => $sub, 'cleaning_cents' => $cleaning, 'tax_rate_bp' => (int)$p['tax_rate_bp'], 'tax_cents' => $tax,
    'total_cents' => $total, 'currency' => $p['currency'],
    'available' => count($taken) === 0, 'unavailable_nights' => array_column($taken, 'night'),
    'season_min_nights' => $seasonMin, 'min_nights' => (int)$p['min_nights'],
  ];
}

/* Place a hold: sweep, then insert one nights row per night inside one transaction.
   A duplicate primary key means someone else holds or booked a night; the whole hold fails. */
function place_hold(array $p, array $quote, array $guest, string $ip): array {
  $id = new_id('h_');
  $expires = utc_plus(SDO_HOLD_MINUTES * 60);
  tx_begin();
  try {
    sweep_expired_holds();
    q('INSERT INTO holds (id, property_id, checkin, checkout, guests, children, guest_name, guest_email, guest_phone, quote_json, total_cents, currency, status, expires_at, created_at, ip) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [$id, $p['id'], $quote['checkin'], $quote['checkout'], $quote['guests'], $quote['children'], $guest['name'], $guest['email'], $guest['phone'], json_encode($quote), $quote['total_cents'], $quote['currency'], 'open', $expires, now_utc(), $ip]);
    $ins = db()->prepare("INSERT INTO nights (property_id, night, kind, ref, expires_at) VALUES (?,?,'hold',?,?)");
    foreach (nights_between($quote['checkin'], $quote['checkout']) as $night) $ins->execute([$p['id'], $night, $id, $expires]);
    tx_commit();
  } catch (PDOException $e) {
    tx_rollback();
    $m = $e->getMessage();
    if (stripos($m, 'UNIQUE') !== false || stripos($m, 'Duplicate') !== false || stripos($m, 'PRIMARY') !== false || stripos($m, 'constraint') !== false) {
      fail('unavailable', 'Someone else just took one of those nights. Please pick other dates.', 409);
    }
    throw $e;
  }
  audit('anon:' . $ip, 'hold.create', $id, null, ['checkin' => $quote['checkin'], 'checkout' => $quote['checkout'], 'total_cents' => $quote['total_cents']]);
  return ['id' => $id, 'expires_at' => $expires];
}

/* Convert an owner block or a confirmed booking into nights rows (same collision rule). */
function occupy_nights(string $propertyId, string $checkin, string $checkout, string $kind, string $ref): void {
  $ins = db()->prepare("INSERT INTO nights (property_id, night, kind, ref, expires_at) VALUES (?,?,?,?,NULL)");
  foreach (nights_between($checkin, $checkout) as $night) $ins->execute([$propertyId, $night, $kind, $ref]);
}
