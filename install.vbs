'This script adds the "Command Prompt &Here"
'verb for folders and drives, the 
'Copy to and Move to verbs, and installs Webview XP.
Option Explicit
On Error Resume Next
Dim WSHShell, FSO
Dim windir, rootdir, IsOSWindows98
Set WSHShell = WScript.CreateObject( "WScript.Shell" )
Set FSO = CreateObject( "Scripting.FileSystemObject" )

SetupCommandPromptHere
windir = LCase( WSHShell.ExpandEnvironmentStrings("%WinDir%") )
If LCase(WSHShell.RegRead("HKLM\Software\Microsoft\Windows\CurrentVersion\Version")) = "windows 98" Then
	IsOSWindows98 = True
Else
	IsOSWindows98 = False
End If
SetRegistryEntries
If InStr(windir, "windows" ) > -1 Then
	rootdir = Replace( windir, "windows", "" )
ElseIf InStr( windir, "winnt" ) > -1 Then
	rootdir = Replace( windir, "winnt", "" )
End If

DeleteDesktopINI FSO.BuildPath(windir, "\desktop.ini")
DeleteDesktopINI FSO.BuildPath(windir, "\System\desktop.ini")
DeleteDesktopINI FSO.BuildPath(windir, "\System32\desktop.ini")
DeleteDesktopINI FSO.BuildPath(rootdir, "\Program Files\desktop.ini")

Dim currFolder
currFolder = Replace( WScript.ScriptFullName, WScript.ScriptName, "" )
If FSO.FolderExists(FSO.BuildPath(currFolder, "Blue")) Then
	FSO.CopyFolder FSO.BuildPath(currFolder, "\Blue"), FSO.BuildPath(windir, "Web\"), True
End If
If FSO.FileExists(FSO.BuildPath(currFolder, "uninstall.vbs")) Then
	FSO.CopyFile FSO.BuildPath(currFolder, "\uninstall.vbs"), FSO.BuildPath(windir, "Web\"), True
End If

WSHShell.Run "regsvr32.exe /s """ & FSO.BuildPath( windir, "\web\Blue\resources\controls\SAWZip.dll") & """"
WSHShell.Popup "Webview XP installation has completed successfully.", 0, "Installation Successful", 0 + 64



Sub SetupCommandPromptHere()
	Dim cmd

	If InStr(windir, "windows" ) > -1 Then
		rootdir = Replace( windir, "windows", "" )
		If FSO.FileExists( rootdir & "command.com" ) Then
			cmd = "command.com"
		Elseif FSO.FileExists( windir & "\system\cmd.exe" ) = True OR FSO.FileExists( windir & "\system32\cmd.exe" ) = True Then
			cmd = "cmd.exe"
		End If
	Elseif InStr( windir, "winnt" ) > -1 Then
		cmd = "cmd.exe"
	End If

	If cmd = "cmd.exe" OR cmd = "command.com" Then
		Call RegCPH( "Directory" , cmd )
		Call RegCPH( "Drive", cmd )
		'My Documents {450D8FBA-AD25-11D0-98A8-0800361B1103}
		Call RegCPH( "CLSID\{450D8FBA-AD25-11D0-98A8-0800361B1103}", cmd )
	End If
End Sub 'SetupCommandPromptHere



Sub RegCPH( foldertype, cmd )
		WSHShell.RegWrite "HKCR\" & foldertype & "\shell\CommandPromptHere\", "Command Prompt &Here", "REG_SZ"
		WSHShell.RegWrite "HKCR\" & foldertype & "\shell\CommandPromptHere\command\", cmd & " /k cd ""%1""", "REG_SZ"
End Sub 'RegCPH

Sub SetRegistryEntries()

	WSHShell.RegWrite "HKLM\System\CurrentControlSet\Control\Update\UpdateMode", 0, "REG_BINARY"
	WSHShell.RegWrite "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced\ShowAttribCol", 1, "REG_DWORD"
	WSHShell.RegWrite "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings\Zones\0\1200", 0, "REG_DWORD"
	WSHShell.RegWrite "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings\Zones\0\1201", 0, "REG_DWORD"
	WSHShell.RegWrite "HKLM\Software\Microsoft\Windows\CurrentVersion\Internet Settings\Zones\0\1200", 0, "REG_DWORD"
	WSHShell.RegWrite "HKLM\Software\Microsoft\Windows\CurrentVersion\Internet Settings\Zones\0\1201", 0, "REG_DWORD"
	If IsOSWindows98 = True Then
		WSHShell.RegWrite "HKCR\.ico\ShellEx\{BB2E617C-0920-11d1-9A0B-00C04FC2D6C1}\", "{7376D660-C583-11d0-A3A5-00C04FD706EC}", "REG_SZ"
		WSHShell.RegWrite "HKCR\.gif\ShellEx\{BB2E617C-0920-11d1-9A0B-00C04FC2D6C1}\", "{7376D660-C583-11d0-A3A5-00C04FD706EC}", "REG_SZ"
	End If
	WSHShell.RegWrite "HKCR\CLSID\{20D04FE0-3AEA-1069-A2D8-08002B30309D}\shellex\ExtShellFolderViews\{5984FFE0-28D4-11CF-AE66-08002B2E1262}\PersistMoniker", windir & "\Web\Blue\MyComp.htt", "REG_SZ"
	WSHShell.RegWrite "HKCR\Directory\shellex\ExtShellFolderViews\{5984FFE0-28D4-11CF-AE66-08002B2E1262}\PersistMoniker", windir & "\Web\Blue\Folder.htt", "REG_SZ"
	WSHShell.RegWrite "HKEY_CLASSES_ROOT\AllFilesystemObjects\shellex\ContextMenuHandlers\Copy To\", "{C2FBB630-2971-11D1-A18C-00C04FD75D13}", "REG_SZ"
	WSHShell.RegWrite "HKEY_CLASSES_ROOT\AllFilesystemObjects\shellex\ContextMenuHandlers\Move To\", "{C2FBB631-2971-11D1-A18C-00C04FD75D13}", "REG_SZ"
	
	'Uninstall entries
	WSHShell.RegWrite "HKLM\Software\Microsoft\Windows\CurrentVersion\Uninstall\Webview XP\DisplayName", "Webview XP 1.0b", "REG_SZ"
	WSHShell.RegWrite "HKLM\Software\Microsoft\Windows\CurrentVersion\Uninstall\Webview XP\DisplayVersion", "1.0", "REG_SZ"
	WSHShell.RegWrite "HKLM\Software\Microsoft\Windows\CurrentVersion\Uninstall\Webview XP\Publisher", "Art Sands", "REG_SZ"
	WSHShell.RegWrite "HKLM\Software\Microsoft\Windows\CurrentVersion\Uninstall\Webview XP\InstallLocation", FSO.BuildPath(windir, "Web\") & "Blue", "REG_SZ"
	WSHShell.RegWrite "HKLM\Software\Microsoft\Windows\CurrentVersion\Uninstall\Webview XP\Comments", "Webview XP for Windows 98/Me/2000/XP", "REG_SZ"
	WSHShell.RegWrite "HKLM\Software\Microsoft\Windows\CurrentVersion\Uninstall\Webview XP\UninstallString", "wscript.exe " & FSO.BuildPath(windir, "Web\uninstall.vbs"), "REG_SZ"
	WSHShell.RegWrite "HKLM\Software\Microsoft\Windows\CurrentVersion\Uninstall\Webview XP\DisplayIcon", FSO.BuildPath(windir, "Web\Blue\resources\setup\setup.ico"), "REG_SZ"

End Sub 'SetRegistryEntries

Sub DeleteDesktopINI( str_Path )
	If FSO.FileExists( str_Path ) = True Then
		FSO.DeleteFile str_Path , true
	End If
End Sub