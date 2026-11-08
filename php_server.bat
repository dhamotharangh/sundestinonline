@echo off
rem SunDestin Online: site + booking API on PHP's built-in server (local testing only).
rem server.bat (Python, port 8765) serves the static site without the API.
set PHP=C:\dev\tools\php\php.exe
if not exist "%PHP%" (
  echo PHP not found at %PHP%. See docs\BOOKING_PLAN.md section 9.
  exit /b 1
)
cd /d "%~dp0"
if not exist var\sdo.sqlite (
  "%PHP%" api\cli.php migrate
  "%PHP%" api\cli.php seed
)
echo Site + API at http://127.0.0.1:8766/   (Ctrl+C stops it)
"%PHP%" -S 127.0.0.1:8766 -t .
