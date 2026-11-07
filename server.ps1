# SunDestin Online - silent local preview. Called by server.bat; can also be run directly:
#   powershell -NoProfile -ExecutionPolicy Bypass -File server.ps1 -start|-stop|-restart|-status [-Port 8765]
param(
  [switch]$start, [switch]$stop, [switch]$restart, [switch]$status,
  [int]$Port = $(if ($env:SDO_PORT) { [int]$env:SDO_PORT } else { 8765 })
)
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root
if (-not (Test-Path logs)) { New-Item -ItemType Directory logs | Out-Null }
$url = "http://127.0.0.1:$Port/"

function Get-Http { try { (Invoke-WebRequest -UseBasicParsing $url -TimeoutSec 3).StatusCode } catch { $null } }
function Get-ServerPid {
  $c = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($c -and $c.OwningProcess -gt 0) { return $c.OwningProcess }
  $p = Get-CimInstance Win32_Process -Filter "name='python.exe'" -ErrorAction SilentlyContinue |
       Where-Object { $_.CommandLine -like "*http.server $Port*" } | Select-Object -First 1
  if ($p) { return $p.ProcessId }
  return $null
}
function Do-Status {
  if ((Get-Http) -eq 200) { "running on $url (PID $(Get-ServerPid)) HTTP 200" } else { "stopped" }
}
function Do-Start {
  if ((Get-Http) -eq 200) { "already running on $url (PID $(Get-ServerPid))"; return }
  Start-Process python -ArgumentList '-u','-m','http.server',"$Port",'--bind','127.0.0.1' `
    -WorkingDirectory $root -WindowStyle Hidden `
    -RedirectStandardOutput (Join-Path $root 'logs\server.out.log') -RedirectStandardError (Join-Path $root 'logs\server.err.log')
  Start-Sleep -Seconds 2
  if ((Get-Http) -eq 200) { "started $url (PID $(Get-ServerPid))" } else { "failed to start - see logs\server.err.log" }
}
function Do-Stop {
  $p = Get-ServerPid
  if (-not $p) {
    if ((Get-Http) -eq 200) { "cannot stop: $url answers but its process is not visible from this shell (started elsewhere). Close that program instead." }
    else { "stopped (nothing on port $Port)" }
    return
  }
  Stop-Process -Id $p -Force -ErrorAction SilentlyContinue
  "stopped PID $p"
}

if ($start) { Do-Start }
elseif ($stop) { Do-Stop }
elseif ($restart) { Do-Stop; Start-Sleep -Seconds 1; Do-Start }
elseif ($status) { Do-Status }
else { "usage: server.bat -start | -stop | -restart | -status" }
