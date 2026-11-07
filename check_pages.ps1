# Quick smoke check of the local preview: status code and size of each page.
& "$PSScriptRoot\server.bat" -start
foreach ($p in @("", "properties.html", "terms.html", "privacy.html", "register.html", "admin/", "data/rates.csv")) {
  try { $r = Invoke-WebRequest -UseBasicParsing ("http://127.0.0.1:8765/" + $p) -TimeoutSec 5; "{0,-18} {1} {2,7} bytes" -f ($p -eq "" ? "index.html" : $p), $r.StatusCode, $r.Content.Length }
  catch { "{0,-18} FAIL {1}" -f $p, $_.Exception.Message }
}
