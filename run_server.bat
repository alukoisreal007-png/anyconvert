@echo off
cd /d "%~dp0"
if exist "%LOCALAPPDATA%\Programs\Python\Python313\python.exe" (
    "%LOCALAPPDATA%\Programs\Python\Python313\python.exe" server.py
) else (
    py -3 server.py
)
