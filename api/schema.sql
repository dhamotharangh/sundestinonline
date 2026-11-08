-- SunDestin Online booking schema. Portable SQL: runs unchanged on SQLite (local) and MySQL (Hostinger).
-- Dates are property-local 'YYYY-MM-DD' text; timestamps are UTC 'YYYY-MM-DD HH:MM:SS' text; money is integer cents.

CREATE TABLE IF NOT EXISTS properties (
  id            VARCHAR(40)  NOT NULL PRIMARY KEY,
  name          VARCHAR(120) NOT NULL,
  timezone      VARCHAR(60)  NOT NULL DEFAULT 'America/Chicago',
  currency      VARCHAR(3)   NOT NULL DEFAULT 'USD',
  min_nights    INTEGER      NOT NULL DEFAULT 1,
  max_nights    INTEGER      NOT NULL DEFAULT 28,
  sleeps        INTEGER      NOT NULL DEFAULT 6,
  cleaning_cents INTEGER     NOT NULL DEFAULT 0,
  tax_rate_bp   INTEGER      NOT NULL DEFAULT 0,      -- basis points: 1200 = 12.00%
  booking_window_days INTEGER NOT NULL DEFAULT 540,   -- how far ahead guests may book
  active        INTEGER      NOT NULL DEFAULT 1
);

-- Nightly rates by inclusive date range. Same columns as data/rates.csv.
CREATE TABLE IF NOT EXISTS rates (
  id            VARCHAR(40)  NOT NULL PRIMARY KEY,
  property_id   VARCHAR(40)  NOT NULL,
  start_date    VARCHAR(10)  NOT NULL,
  end_date      VARCHAR(10)  NOT NULL,
  season        VARCHAR(40)  NOT NULL,
  label         VARCHAR(80)  NOT NULL,
  nightly_cents INTEGER      NOT NULL,
  min_nights    INTEGER      NOT NULL DEFAULT 1
);
CREATE INDEX IF NOT EXISTS rates_property_dates ON rates (property_id, start_date, end_date);

-- Owner blocks (owner stay, cleaning, maintenance, external booking). Check-out exclusive.
CREATE TABLE IF NOT EXISTS blocks (
  id            VARCHAR(40)  NOT NULL PRIMARY KEY,
  property_id   VARCHAR(40)  NOT NULL,
  checkin       VARCHAR(10)  NOT NULL,
  checkout      VARCHAR(10)  NOT NULL,
  kind          VARCHAR(20)  NOT NULL DEFAULT 'owner',
  note          VARCHAR(200) NOT NULL DEFAULT '',
  created_at    VARCHAR(19)  NOT NULL
);

-- THE inventory table. One row per occupied night. The primary key makes overlap impossible:
-- a hold that tries to insert a night already present fails, and the whole transaction rolls back.
CREATE TABLE IF NOT EXISTS nights (
  property_id   VARCHAR(40)  NOT NULL,
  night         VARCHAR(10)  NOT NULL,
  kind          VARCHAR(10)  NOT NULL,                -- hold | booked | block
  ref           VARCHAR(40)  NOT NULL,                -- hold id, reservation ref or block id
  expires_at    VARCHAR(19)  NULL,                    -- holds only
  PRIMARY KEY (property_id, night)
);
CREATE INDEX IF NOT EXISTS nights_ref ON nights (ref);

CREATE TABLE IF NOT EXISTS holds (
  id            VARCHAR(40)  NOT NULL PRIMARY KEY,
  property_id   VARCHAR(40)  NOT NULL,
  checkin       VARCHAR(10)  NOT NULL,
  checkout      VARCHAR(10)  NOT NULL,
  guests        INTEGER      NOT NULL,
  children      INTEGER      NOT NULL DEFAULT 0,
  guest_name    VARCHAR(120) NOT NULL DEFAULT '',
  guest_email   VARCHAR(200) NOT NULL DEFAULT '',
  guest_phone   VARCHAR(40)  NOT NULL DEFAULT '',
  quote_json    TEXT         NOT NULL,
  total_cents   INTEGER      NOT NULL,
  currency      VARCHAR(3)   NOT NULL DEFAULT 'USD',
  status        VARCHAR(12)  NOT NULL DEFAULT 'open', -- open | paid | expired | cancelled
  stripe_session_id VARCHAR(120) NULL,
  expires_at    VARCHAR(19)  NOT NULL,
  created_at    VARCHAR(19)  NOT NULL,
  ip            VARCHAR(45)  NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS holds_status_exp ON holds (status, expires_at);

CREATE TABLE IF NOT EXISTS reservations (
  ref           VARCHAR(12)  NOT NULL PRIMARY KEY,    -- human code, e.g. SD-7K3M
  property_id   VARCHAR(40)  NOT NULL,
  hold_id       VARCHAR(40)  NOT NULL,
  checkin       VARCHAR(10)  NOT NULL,
  checkout      VARCHAR(10)  NOT NULL,
  guests        INTEGER      NOT NULL,
  children      INTEGER      NOT NULL DEFAULT 0,
  guest_name    VARCHAR(120) NOT NULL,
  guest_email   VARCHAR(200) NOT NULL,
  guest_phone   VARCHAR(40)  NOT NULL DEFAULT '',
  quote_json    TEXT         NOT NULL,
  total_cents   INTEGER      NOT NULL,
  currency      VARCHAR(3)   NOT NULL DEFAULT 'USD',
  status        VARCHAR(12)  NOT NULL DEFAULT 'confirmed', -- confirmed | cancelled | refunded
  created_at    VARCHAR(19)  NOT NULL,
  cancelled_at  VARCHAR(19)  NULL
);
CREATE INDEX IF NOT EXISTS reservations_email ON reservations (guest_email);

CREATE TABLE IF NOT EXISTS payments (
  id            VARCHAR(40)  NOT NULL PRIMARY KEY,
  reservation_ref VARCHAR(12) NOT NULL,
  stripe_payment_intent VARCHAR(120) NOT NULL,
  stripe_session_id VARCHAR(120) NOT NULL DEFAULT '',
  amount_cents  INTEGER      NOT NULL,
  refunded_cents INTEGER     NOT NULL DEFAULT 0,
  currency      VARCHAR(3)   NOT NULL,
  status        VARCHAR(20)  NOT NULL,
  created_at    VARCHAR(19)  NOT NULL
);

-- Webhook idempotency: an event id seen once is never processed again.
CREATE TABLE IF NOT EXISTS stripe_events (
  id            VARCHAR(120) NOT NULL PRIMARY KEY,
  type          VARCHAR(80)  NOT NULL,
  received_at   VARCHAR(19)  NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id            VARCHAR(40)  NOT NULL PRIMARY KEY,
  email         VARCHAR(200) NOT NULL UNIQUE,
  name          VARCHAR(120) NOT NULL DEFAULT '',
  role          VARCHAR(10)  NOT NULL DEFAULT 'guest', -- guest | owner
  created_at    VARCHAR(19)  NOT NULL,
  last_login_at VARCHAR(19)  NULL
);

CREATE TABLE IF NOT EXISTS otp_codes (
  id            VARCHAR(40)  NOT NULL PRIMARY KEY,
  email         VARCHAR(200) NOT NULL,
  code_hash     VARCHAR(64)  NOT NULL,
  expires_at    VARCHAR(19)  NOT NULL,
  attempts      INTEGER      NOT NULL DEFAULT 0,
  used          INTEGER      NOT NULL DEFAULT 0,
  created_at    VARCHAR(19)  NOT NULL
);
CREATE INDEX IF NOT EXISTS otp_email ON otp_codes (email, created_at);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash    VARCHAR(64)  NOT NULL PRIMARY KEY,
  user_id       VARCHAR(40)  NOT NULL,
  expires_at    VARCHAR(19)  NOT NULL,
  created_at    VARCHAR(19)  NOT NULL,
  ip            VARCHAR(45)  NOT NULL DEFAULT '',
  user_agent    VARCHAR(200) NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS audit_log (
  id            VARCHAR(40)  NOT NULL PRIMARY KEY,
  actor         VARCHAR(200) NOT NULL,               -- user id, 'stripe', 'cron' or 'anon:<ip>'
  action        VARCHAR(60)  NOT NULL,
  target        VARCHAR(120) NOT NULL,
  before_json   TEXT         NULL,
  after_json    TEXT         NULL,
  at            VARCHAR(19)  NOT NULL
);

-- Fixed-window rate limiting per key (ip:endpoint or email:endpoint).
CREATE TABLE IF NOT EXISTS rate_limits (
  rl_key        VARCHAR(160) NOT NULL PRIMARY KEY,
  window_start  INTEGER      NOT NULL,
  hits          INTEGER      NOT NULL
);
