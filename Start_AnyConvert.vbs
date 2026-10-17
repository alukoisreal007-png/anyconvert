Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

appDir = "C:\Users\user\Desktop\allmyapps\anyconvert"
WshShell.CurrentDirectory = appDir

' 1. Start local background engine silently (no black console window)
serverBat = appDir & "\run_server.bat"
WshShell.Run "cmd /c """ & serverBat & """", 0, False

WScript.Sleep 700

' 2. Launch in dedicated standalone Desktop App Window (No address bar, no browser tabs)
appUrl = "http://localhost:8888"
edgePath1 = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
edgePath2 = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"

If fso.FileExists(edgePath1) Then
    WshShell.Run """" & edgePath1 & """ --app=""" & appUrl & """", 1, False
ElseIf fso.FileExists(edgePath2) Then
    WshShell.Run """" & edgePath2 & """ --app=""" & appUrl & """", 1, False
ElseIf fso.FileExists(chromePath) Then
    WshShell.Run """" & chromePath & """ --app=""" & appUrl & """", 1, False
Else
    WshShell.Run "explorer.exe """ & appUrl & """", 1, False
End If
