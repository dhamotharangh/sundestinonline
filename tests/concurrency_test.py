"""Concurrency test for the booking hold.

Launches N `php api/cli.php hold` processes at the same instant for the same nights.
Exactly one must succeed; every other one must be refused. Run from the repo root:

    python tests/concurrency_test.py [N] [checkin] [checkout]

This hits the database directly from N separate PHP processes, so it exercises the
nights-table primary key and the BEGIN IMMEDIATE lock, not just a single web server thread.
"""
import os
import subprocess
import sys
import threading
import datetime as dt

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PHP = os.environ.get("PHP", "php")
N = int(sys.argv[1]) if len(sys.argv) > 1 else 20
ci = sys.argv[2] if len(sys.argv) > 2 else (dt.date.today() + dt.timedelta(days=200)).isoformat()
co = sys.argv[3] if len(sys.argv) > 3 else (dt.date.today() + dt.timedelta(days=204)).isoformat()

subprocess.run([PHP, "api/cli.php", "reset"], cwd=ROOT, check=True, capture_output=True)

results = [None] * N
start = threading.Barrier(N)

def worker(i):
    start.wait()
    r = subprocess.run([PHP, "api/cli.php", "hold", ci, co, f"Racer {i}", f"racer{i}@example.com"],
                       cwd=ROOT, capture_output=True, text=True)
    results[i] = (r.returncode, (r.stdout + r.stderr).strip())

threads = [threading.Thread(target=worker, args=(i,)) for i in range(N)]
for t in threads: t.start()
for t in threads: t.join()

ok = [r for r in results if r and r[0] == 0]
refused = [r for r in results if r and r[0] != 0]
print(f"{N} simultaneous holds for {ci} -> {co}: {len(ok)} succeeded, {len(refused)} refused")
for r in results:
    print("  ", r[1].splitlines()[-1] if r[1] else r)
nights = subprocess.run([PHP, "api/cli.php", "nights", ci, co], cwd=ROOT, capture_output=True, text=True).stdout
holders = {line.split("\t")[2] for line in nights.strip().splitlines() if line}
print(f"nights table holds those nights for {len(holders)} hold id(s)")
if len(ok) == 1 and len(holders) == 1:
    print("PASS")
    sys.exit(0)
print("FAIL")
sys.exit(1)
