@echo off
rem SunDestin Online - silent background start, then open the site.
call "%~dp0server.bat" -start
start "" http://127.0.0.1:8765/
