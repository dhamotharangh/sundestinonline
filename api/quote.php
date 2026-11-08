<?php
/* POST api/quote.php  {property, checkin, checkout, guests, children}
   Public. Returns the all-in price computed on the server, and whether the nights are free. */
declare(strict_types=1);
require __DIR__ . '/lib.php';
require_method('POST');
require_same_origin();
rate_limit('quote', 60);

$in = json_in();
$p = property((string)($in['property'] ?? 'sundestin_203'));
$quote = build_quote($p, (string)($in['checkin'] ?? ''), (string)($in['checkout'] ?? ''), (int)($in['guests'] ?? 2), (int)($in['children'] ?? 0));
json_out(['ok' => true, 'quote' => $quote]);
