@echo off
rem SunDestin Online - silent local preview on http://127.0.0.1:8765 (logic in server.ps1)
rem   server.bat -start     start hidden (no console window); skips if already running
rem   server.bat -stop      stop the server on 8765
rem   server.bat -restart   stop, then start
rem   server.bat -status    running or stopped, PID, HTTP answer
rem Set SDO_PORT to use another port. Output: logs\server.out.log, logs\server.err.log
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1" %*
