// Copyright © 2002 WestEnd Corporation.
	
	var fso = new ActiveXObject("Scripting.FileSystemObject");
	var wshshell = new ActiveXObject("WScript.Shell");
	var assoc = new ActiveXObject("Scripting.Dictionary");
	assoc.Add( "viewoptions.EnableFolderMediaTypeCheck", chkFolderMediaTypeCheck );
	assoc.Add( "viewoptions.EnableFolderContents", chkFolderContents);
	assoc.Add( "viewoptions.EnableItemAttributes", chkItemAttributes);
	assoc.Add( "viewoptions.EnableFolderSize", chkFSOFolderSize);
	assoc.Add( "viewoptions.EnableFSOFolderCount", chkFSOFolderCount);
	assoc.Add( "viewoptions.EnableFSODateModified", chkFSODateModified);
	assoc.Add( "viewoptions.EnableFSOFileVersion", chkFSOFileVersion);
	assoc.Add( "viewoptions.EnableCompressedFolderInfo", chkCompressedFolderInfo);
	assoc.Add( "viewoptions.EnableMediaInformation", chkMediaInformation);
	assoc.Add( "viewoptions.EnableImagePreview", chkImagePreview);
	assoc.Add( "viewoptions.EnableVideoPreview", chkVideoPreview);
	assoc.Add( "viewoptions.EnableRepeatPlayback", chkRepeatPlayback);
	assoc.Add( "viewoptions.EnableControlsOnMouseOver", chkControlsOnMouseOver);
	assoc.Add( "viewoptions.EnableWinamp2", chkWinamp);
	assoc.Add( "viewoptions.EnableSizeInBytes", chkSizeInBytes);
	assoc.Add( "viewoptions.ImagePreviewSize", txtboxImagePreviewSize);
	var associtem = (new VBArray(assoc.Items())).toArray();
	var assockey = (new VBArray(assoc.Keys())).toArray();
	var orig_checkedlist = new Array();

	var ForReading = 1;
	var ForWriting = 2;
	var WINDOWSFOLDER = 0;
	var IsOSWindows98 = navigator.appVersion.toLowerCase().indexOf("windows 98") >= 0;

	var WinDir = JSLibrary.Format.SanitizePath(fso.GetSpecialFolder(WINDOWSFOLDER).Path, false);
	var installationexists = eval(fso.FolderExists( WinDir + "\\Web\\Blue\\resources" ) && fso.FileExists(WinDir + "\\Web\\Blue\\Folder.htt") && fso.FileExists(WinDir + "\\Web\\Blue\\MyComp.htt"));

	var L_Prompt_TEXT = "Hover the mouse pointer over a region to view its description here.";
	var L_InformationDesc_TEXT = "Shows a description of a region when your mouse pointer moves over it."
	var L_ExclamationMark_TEXT = "!";
	var L_WelcomeDesc_TEXT = "Welcome to Blue Webview" + L_ExclamationMark_TEXT;
	var L_LADesc_TEXT = "Click here to view the license agreement."
	var L_OptionsDesc_TEXT = "You can change settings for the webview here."
	var L_ManageDesc_TEXT = "You can restore or remove the webview here."
	var L_Empty_TEXT = "";
	var L_BtnOKDesc_TEXT = "Applies the changes and closes this dialog. (Refresh all open folders for the settings to take effect.)";
	var L_BtnApplyDesc_TEXT = "Applies the specified changes. (Refresh all open folders for the settings to take effect.)"
	var L_BtnCancelDesc_TEXT = "Closes the Setup dialog without saving any changes."
	var L_PrevDesc_TEXT = "Shows the previous information."
	var L_NextDesc_TEXT = "Shows more information.";
	var L_Close_TEXT = "Close";
	var L_OptStartComment_TEXT = "// This file is required by Blue Webview\n// to function properly. Please do not\n// edit this file, if you do not know\n// why you should.\n";
	
	function Load()
	{
		// [[START

		// Show the dialog only when compeletely loaded.
		document.body.style.display = "";

		// END]]

		if(!installationexists){
			miOptions.style.visibility = "hidden";
			BtnApply.style.display = "none";
			BtnOK.style.display = "none";
			BtnCancel.value = L_Close_TEXT;
		}
		Information.innerHTML = L_Prompt_TEXT;
		ParseOptions();
		if(chkVideoPreview.checked == true){
			chkRepeatPlayback.disabled = false;
			chkControlsOnMouseOver.disabled = false;
		}
		if(chkImagePreview.checked == true)
		{
			txtboxImagePreviewSize.disabled = false;
		} else if(chkImagePreview.checked == false){
			txtboxImagePreviewSize.disabled = true;
		}
	
	}

	function ParseOptions()
	{
		var f = fso.OpenTextFile( WinDir + "\\Web\\Blue\\resources\\opt.js", ForReading, false);
		var thecheckbox, line;
		var i = 0;
		while(!f.AtEndOfLine)
		{
			line=f.ReadLine();
			line=line.Trim();
			if(line == ""){
				continue;
			} else if(	line.indexOf("//") == 0 || 
						line.indexOf("*") == 0 || 
						line.indexOf("/*") == 0 || 
						line.indexOf("*/") == 0){
				continue;
			} else {
				var varname = line.substring(0, line.indexOf("=")).Trim();
				theinput = assoc.Item( varname );
				if(line.indexOf("=") >= 0 && line.indexOf("true") < 0 && line.indexOf("false") < 0){ 
					theinput.value = line.substring(line.indexOf("=")+1, (line.indexOf(";")>0) ? line.indexOf(";"): line.length ).Trim();
				} else if(line.indexOf("true") >= 0)
				{
					theinput.checked = true;
					orig_checkedlist[i] = thecheckbox;
				} else if(line.indexOf("false" >= 0)){
					theinput.checked = false;
				}
			}
			i++;
		}
		f.Close();
		
	}


	function Install()
	{
		wshshell.RegWrite( "HKLM\\Software\\Blue Webview\\Settings\\Installed", "1", "REG_SZ" );
		
	}
function SetRegistryEntries()
{
	wshshell.RegWrite( "HKLM\\System\\CurrentControlSet\\Control\\Update\\UpdateMode", 0, "REG_BINARY" );
	wshshell.RegWrite( "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced\\ShowAttribCol", 1, "REG_DWORD");
	wshshell.RegWrite( "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\0\\1200", 0, "REG_DWORD");
	wshshell.RegWrite( "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\0\\1201", 0, "REG_DWORD");
	wshshell.RegWrite( "HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\0\\1200", 0, "REG_DWORD");
	wshshell.RegWrite( "HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\0\\1201", 0, "REG_DWORD");
	if( IsOSWindows98 == true ){
		wshshell.RegWrite( "HKCR\\.ico\\ShellEx\\{BB2E617C-0920-11d1-9A0B-00C04FC2D6C1}\\", "{7376D660-C583-11d0-A3A5-00C04FD706EC}", "REG_SZ");
		wshshell.RegWrite( "HKCR\\.gif\\ShellEx\\{BB2E617C-0920-11d1-9A0B-00C04FC2D6C1}\\", "{7376D660-C583-11d0-A3A5-00C04FD706EC}", "REG_SZ");
	}
	wshshell.RegWrite("HKEY_CLASSES_ROOT\\AllFilesystemObjects\\shellex\\ContextMenuHandlers\\Copy To\\", "{C2FBB630-2971-11D1-A18C-00C04FD75D13}", "REG_SZ");
	wshshell.RegWrite("HKEY_CLASSES_ROOT\\AllFilesystemObjects\\shellex\\ContextMenuHandlers\\Move To\\", "{C2FBB631-2971-11D1-A18C-00C04FD75D13}", "REG_SZ");

}

	function ApplySettings()
	{
/*		if(chkItemAttributes.checked == true){
			wshshell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced\\ShowAttribCol", 1, "REG_DWORD")
		}	
*/		
		SetRegistryEntries();
		if(txtboxImagePreviewSize.value < 100){
			txtboxImagePreviewSize.value = 100;
		} else if(txtboxImagePreviewSize.value > 150)
		{
			txtboxImagePreviewSize.value = 150;
		}
		var s = L_OptStartComment_TEXT;
		for( i in associtem )
		{
			if(associtem[i].type == "checkbox")	{
				s += assockey[i] + " = " + associtem[i].checked + ";\n";
			} else if(associtem[i].type == "text"){
				s += assockey[i] + " = " + associtem[i].value + ";\n";
			}
		}
		
		// Replace existing file if it exists, and create a new one if it don't.
		var fileSpec = WinDir + "\\Web\\Blue\\resources\\opt.js";
		if(fso.FileExists( fileSpec ) == true && fso.GetFile(fileSpec).Attributes != 0)
		{
			fso.GetFile(fileSpec).Attributes = 0;
		}
		var f2 = fso.CreateTextFile( fileSpec, true );
		f2.WriteLine( s );
		f2.Close();
	}
	
	function Main::OnClick()
	{
		var src = event.srcElement;
		var srcid = src.id;
		if(chkVideoPreview.checked == true)
		{
			chkRepeatPlayback.disabled = false;
			chkControlsOnMouseOver.disabled = false;
		} else if(chkVideoPreview.checked == false)
		{
			chkRepeatPlayback.disabled = true;
			chkControlsOnMouseOver.disabled = true;
		}
		if(chkImagePreview.checked == true)
		{
			txtboxImagePreviewSize.disabled = false;
		} else if(chkImagePreview.checked == false){
			txtboxImagePreviewSize.disabled = true;
		}
		switch(srcid)
		{
			case 'miWelcome':
				ContentWelcome.style.display = "";
				ContentFAQ.style.display = "none";
				ContentManage.style.display = "none";
				ContentOptions.style.display = "none";
				PageTitle.innerHTML = "Webview";
				break;
			case 'miOptions':
				ContentOptions.style.display = "";
				ContentWelcome.style.display = "none";
				ContentFAQ.style.display = "none";
				ContentManage.style.display = "none";
				PageTitle.innerHTML = "Options";
				break;
// For later versions.
/*			case 'miFAQ':
				ContentFAQ.style.display = "";
				ContentWelcome.style.display = "none";
				ContentManage.style.display = "none";
				ContentOptions.style.display = "none";
				break;
			case 'miManage':
				ContentManage.style.display = "";
				ContentWelcome.style.display = "none";
				ContentFAQ.style.display = "none";
				ContentOptions.style.display = "none";
				break; */
			case 'BtnApply':
				ApplySettings();
				break;
			case 'BtnOK':
				ApplySettings();
				window.close();
				break;
			case 'BtnCancel':
				window.close();
				break;
			default:
				break;
		}
	}
	function Main_OnMouseOver()
	{
		var src = event.srcElement;
		var srcid = src.id;

		switch(srcid)
		{
			case 'miWelcome':
				Information.innerHTML = L_WelcomeDesc_TEXT;
				break;
			case 'lnkLicenseAgreement':
				Information.innerHTML = L_LADesc_TEXT;
				break;
			case 'miOptions':
				Information.innerHTML = L_OptionsDesc_TEXT;
				break;
			case 'miManage':
				Information.innerHTML = L_ManageDesc_TEXT;
				break;
			case 'BtnPrev':
				Information.innerHTML = L_PrevDesc_TEXT;
				break;
			case 'BtnNext':
				Information.innerHTML = L_NextDesc_TEXT;
				break;
			case 'Information':
				Information.innerHTML = L_InformationDesc_TEXT;
				break;
			case 'BtnOK':
				Information.innerHTML = L_BtnOKDesc_TEXT;
				break;
			case 'BtnApply':
				Information.innerHTML = L_BtnApplyDesc_TEXT;
				break;
			case 'BtnCancel':
				Information.innerHTML = L_BtnCancelDesc_TEXT;
				break;
			case 'Main':
				Information.innerHTML = L_Prompt_TEXT;
				break;
			case 'idFolderMediaTypeCheck':
				Information.innerHTML = "Detect whether the open or selected folder is a music, movies, pictures, or any other folder.";break;
			case 'idFolderContents':
				Information.innerHTML = "Display a numbered list of some of the selected folder's contents.";break;
			case 'idItemAttributes':
				Information.innerHTML = "Show attributes, such as Hidden or System, in the Details pane.";break;
			case 'idFSOFolderSize':
				Information.innerHTML = "Show a folder's calculated size.";break;
			case 'idFSOFolderCount':
				Information.innerHTML = "Show actual number of items in a folder (incl. hidden and system items).";break;
			case 'idFSODateModified':
				Information.innerHTML = "Show item's modification date and time in convenient, easily-read format.";break;
			case 'idFSOFileVersion':
				Information.innerHTML = "Show version information for selected program file.";break;
			case 'idCompressedFolderInfo':
				Information.innerHTML = "Show information about a compressed folder.";break;
			case 'idMediaInformation':
				Information.innerHTML = "Show duration, author, and copyright information about a media file.";break;
			case 'idImagePreview':
				Information.innerHTML = "Enable previewing picture files.";break;
			case 'idVideoPreview':
				Information.innerHTML = "Enable playable preview of selected movie file.";break;
			case 'idRepeatPlayback':
				Information.innerHTML = "Loop playback of a movie file when previewing it in the Details pane.";break;
			case 'idControlsOnMouseOver':
				Information.innerHTML = "Display video playback and navigation controls when mouse pointer hovers over preview.";break;
			case 'idWinamp':
				Information.innerHTML = "Enable the Winamp tool on the webview toolbar. Requires Winamp as default player to work.";break;
			case 'idImagePreviewSize':
				Information.innerHTML = "Set a size between 100 to 150 pixels for the picture preview.";break;
			case 'idSizeInBytes':
				Information.innerHTML = "Display the size of an item in bytes next to the normal size.";break;
			default:
				Information.innerHTML = L_Prompt_TEXT;
				break;
		}
		
	}
