Set WshShell = CreateObject("WScript.Shell")
scriptPath = WshShell.CurrentDirectory & "\server.py"

' Run Python server silently (window style 0 = hidden window)
WshShell.Run "pyw.exe """ & scriptPath & """", 0, False
