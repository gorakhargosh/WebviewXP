Option Explicit
On Error Resume Next

Dim FSO, WSHShell
Dim windir
Set FSO = CreateObject( "Scripting.FileSystemObject" )
Set WSHShell = CreateObject( "WScript.Shell" )
windir = LCase( WSHShell.ExpandEnvironmentStrings("%WinDir%") )

If WSHShell.Popup("Are you sure you want to uninstall Webview XP from your computer?", 0, "Uninstall", 4 + 32) = 7 Then
	WScript.Quit()
End If

WSHShell.RegDelete "HKLM\Software\Microsoft\Windows\CurrentVersion\Uninstall\Webview XP"
WSHShell.Run "regsvr32.exe /u /s """ & FSO.BuildPath( windir, "\Web\Blue\resources\controls\SAWZip.dll") & """"
WSHShell.Run "regsvr32.exe /s webvw.dll"
WScript.Sleep 3000
FSO.DeleteFolder windir & "\Web\Blue", true
FSO.DeleteFile windir & "\Web\Uninstall.vbs", true
WSHShell.Popup "Webview XP uninstalled successfully.", 0, "Uninstallation Successful", 0 + 64 
WScript.Quit()