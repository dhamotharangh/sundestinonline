@echo off
rem SunDestin Online - local preview. Serves this folder on http://127.0.0.1:8765
cd /d "%~dp0"
start "" http://127.0.0.1:8765/
python -m http.server 8765 --bind 127.0.0.1
