/*************************************************
 *Webview XP
 *************************************************
 *Author: Art Sands
 *Release Date: 15 November 2002.
 *************************************************
 *COPYRIGHT © 2002 Art Sands
 *************************************************
 *This production code is copyrighted material.
 *You must include this copyright notice "as is" 
 *in any derivative code that you may create.
 *************************************************/
 
 /************************************************
 *CompileJavaFile( item, __DirectCompile )
 ************************************************
 *Purpose:
 *	1.	Compiles java source files to the current
 *		folder.
 *Requires:
 *	1.	item : item spec.
 *	2.	__DirectCompile : 
 *		true => directly compile using WSH.
 *		false => compile using runjavac.bat.
 ************************************************/
function CompileJavaFile( item, __DirectCompile )
{
	try{
		if( selectedItemsCount > 0 ) 
		{
			var javaFileName = item.Name;
			var javaFilePath = item.Path;
			var javaClassName;
			var fileExtension = GetFileExtension( javaFilePath );

			if( fileExtension == "java" )
			{
				var javaFileShortPath, javaFileShortName, javacSourcePath, javacOutputPath, javacbat;
				var f = oFSO.GetFile(javaFilePath);

				javaClassName = javaFileName.substring( 0, javaFileName.indexOf(".java") );
				javaFileShortPath = f.ShortPath;
				javaFileShortName = f.ShortName;
				javacSourcePath = javaFileShortPath.substring( 0, javaFileShortPath.indexOf("\\" + javaFileShortName) );
				javacOutputPath = javacSourcePath;
				javacJClassesPath = javacOutputPath + "\\jclasses";
				
				if(__DirectCompile == true)
				{
					oWSHShell.Run( "javac.exe " + javacSourcePath + "\\" + javaFileName + " -d " + javacOutputPath + " -g" );
				} else 
				{
					javacbat = oFSO.CreateTextFile( envar.ThisDirPath + "\\runjavac.bat", true);
					javacbat.WriteLine( "@echo off" );
					javacbat.WriteLine( "echo *** Copyright (C) 2002 WestEnd Corporation. ");
					javacbat.WriteLine( "echo *** All Rights Reserved." );
					javacbat.WriteLine( "echo." );
					javacbat.WriteLine( "echo *** Compiling " + javaFileName + "..." );
					javacbat.WriteLine( "echo." );
					javacbat.WriteLine( "cd " + javacSourcePath );	//+ "\"" );
					javacbat.WriteLine( "@echo on" );
					javacbat.WriteLine( "javac.exe " + javacSourcePath + "\\" + javaFileName + " -d " + javacOutputPath + " -g");
					javacbat.WriteLine( "@echo off" );
					javacbat.WriteLine( "echo." );
					javacbat.WriteLine( "echo *** Tool completed." );
					javacbat.WriteLine( "echo *** File \"runjavac.bat\" will be automatically deleted" );
					javacbat.WriteLine( "echo *** after the folder is refreshed." );
					javacbat.WriteLine( "exit" );
					javacbat.Close();
					
					setTimeout('ns.ThisDirPath.ParseName("runjavac.bat").InvokeVerb("&Open");', 1000);
				}
			}
		}
	} catch( e )
	{}
}
// Creates a new folder.
function MakeNewFolder( str_NewFolder )
{
	var oFSO = new ActiveXObject("Scripting.FileSystemObject");
	var oNewFolder;
	
	var strPath = envar.ThisDirPath;
	if(foldertype.IsDrive == true)
		strPath = envar.CurrentDriveLetter + ":";

	if(!oFSO.FolderExists(strPath + "\\" + str_NewFolder)) {
		oFSO.CreateFolder( strPath + "\\" + str_NewFolder );
	} else {
		var i = 2;
		while(oFSO.FolderExists(strPath + "\\" + str_NewFolder + " (" + i + ")"  ) == true)
		{
			i++;
		}
		str_NewFolder += " (" + i + ")";
		oFSO.CreateFolder(strPath + "\\" + str_NewFolder );
	}
	oNewFolder = FileList.Folder.ParseName(str_NewFolder);
	RenameNewItem( oNewFolder );
}
// Create a new text document.
function MakeNewTextFile( str_NewTextFile )
{
	var oFSO = new ActiveXObject("Scripting.FileSystemObject");
	var oNewFolder;
	
	var strPath = envar.ThisDirPath;
	if(foldertype.IsDrive == true)
		strPath = envar.CurrentDriveLetter + ":";
	
	if(!oFSO.FileExists(strPath + "\\" + str_NewTextFile + ".txt")) {
		oFSO.CreateTextFile( strPath + "\\" + str_NewTextFile + ".txt" );
	} else {
		var i = 2;
		while(oFSO.FileExists(strPath + "\\" + str_NewTextFile + " (" + i + ").txt"  ) == true)
		{
			i++;
		}
		str_NewTextFile += " (" + i + ")";
		oFSO.CreateTextFile(strPath + "\\" + str_NewTextFile + ".txt" );
	}
	oNewTextFile = FileList.Folder.ParseName(str_NewTextFile + ".txt");
	RenameNewItem( oNewTextFile );
}

// Rename on creating a new item.
function RenameNewItem( oNewItem )
{
	save_oNewItem = oNewItem;
	try{
		FileList.focus();
		FileList.SelectItem(oNewItem, 1);
		FileList.SelectItem(oNewItem, 3);
	} catch(e){
		setTimeout("RenameNewItem(save_oNewItem);", 10);
	}
}

/*******************************************
 *DoSystemTask( str_SystemTask )
 *******************************************
 *Purpose:
 *	1.	Does system tasks like bringing up
 *		the Add/Remove Programs dialog and
 *		the System Properties dialog.
 *Requires:
 *	1.	str_SystemTask = system task.
 *******************************************/
function DoSystemTask( str_SystemTask ){
	//To avoid ERRs or URs in barricaded folders.
	var __IsFileListDisplayed = eval(FileList.style.display == ""); 
	
	switch( str_SystemTask ){
		case 'webviewsetup':
			oWSHShell.Run(JSLibrary.Format.SanitizePath(envar.ResourceDir, true) + "setupdlg.hta");
			break;
		case 'displayproperties':
			//Display properties
			if(__IsFileListDisplayed) FileList.Folder.Application.ControlPanelItem("desk.cpl,,");
			else {
				//ShowHideBarricade();
				setTimeout("DoSystemTask('displayproperties')", 200)
			}
			break;
		case 'folderoptions':
			//Folder Options
			try{
				oShell.ShellExecute("rundll32.exe", "shell32.dll,Options_RunDLL");
			} catch(e){
				oWSHShell.SendKeys(shortkey.ViewFolderOptions);
			}
			break;
		case 'devicemanager':
			//Device Manager -- OnContextMenu on "My Computer" link
			if(__IsFileListDisplayed) FileList.Folder.Application.ControlPanelItem("sysdm.cpl,@0,1");
			else {
				//ShowHideBarricade();
				setTimeout("DoSystemTask('devicemanager')", 200)
			}
			break;
		case 'systeminfo':
			//View System Info -- My Computer
			if(__IsFileListDisplayed) FileList.Folder.Application.ControlPanelItem("sysdm.cpl,@0,0");
			else {
				//ShowHideBarricade();
				setTimeout("DoSystemTask('systeminfo')", 200)
			}
			break;
		case 'addremoveprograms':
			//Add or Remove Programs -- My Computer AND Program Files
			if(__IsFileListDisplayed) FileList.Folder.Application.ControlPanelItem("appwiz.cpl");
			else {
				//ShowHideBarricade();
				setTimeout("DoSystemTask('addremoveprograms')", 200)
			}
			break;
		case 'windowssetup': 
			//Windows Setup -- Windows
			if(__IsFileListDisplayed) FileList.Folder.Application.ControlPanelItem("appwiz.cpl,@0,2");
			else {
				//ShowHideBarricade();
				setTimeout("DoSystemTask('windowssetup')", 200)
			}
			break;
		case 'startupdisk':
			//Create Startup Disk -- Floppy Drives
			if(__IsFileListDisplayed) FileList.Folder.Application.ControlPanelItem("appwiz.cpl,@0,3");
			else {
				//ShowHideBarricade();
				setTimeout("DoSystemTask('startupdisk')", 200)
			}
			break;
		case 'formatfloppy':
			//Format floppy
			if(IsDrive){
				//ns.MyComputer.ParseName(envar.ThisDirPath).InvokeVerb(g_str_FormatFloppy_VERB);
				//setTimeout('location.href("::{20D04FE0-3AEA-1069-A2D8-08002B30309D}")', 100);
			}
			break;
		case 'userprofiles':
			//Password Properties & User Profiles
			if(__IsFileListDisplayed) FileList.Folder.Application.ControlPanelItem("password.cpl,,");
			else {
				//ShowHideBarricade();
				setTimeout("DoSystemTask('userprofiles')", 200)
			}
			break;
		case 'showallfiles':
			try {
				oWSHShell.SendKeys(shortkey.ShowAllFiles);
			} catch( e ) {
				// Registry entries.
				// Autorefresh.
			}
			break;
		case 'hidehiddenfiles':
			try
			{
				oWSHShell.SendKeys(shortkey.HideHiddenFiles);
			} catch( e )
			{
				// Registry entries.
				// Autorefresh
			}
			break;
		case 'hidehiddenandsystemfiles':
			try
			{
				oWSHShell.SendKeys(shortkey.HideHiddenAndSystemFiles);
			} catch( e )
			{
				// Registry entries.
				// Autorefresh.
			}
			break;
		case 'cleanupdrive':
			try
			{
				oWSHShell.Run("cleanmgr.exe /d " + FileList.SelectedItems().Item(0).Path );
			} catch( e )
			{
			
			}
			break;
		case 'ejectcd':
			try
			{
				FileList.SelectedItems().Item(0).InvokeVerb(verb.EjectCD);
			} catch (e)
			{}
			break;
		case 'fullscreen':
			try
			{
				oWSHShell.SendKeys(shortkey.FullScreen);
			} catch( e )
			{
				JSLibrary.FlashMessage( e.description );
			}
			break;
		case 'emptybin':
		case 'emptyrecyclebin':
			//Empty Recycle Bin -- Every Folder
			if(ns.RecycleBin.Items().Count) {
				ns.RecycleBin.ParentFolder.ParseName(clsid.RecycleBin).InvokeVerb(verb.EmptyRecycleBin);
			} else {
				JSLibrary.FlashMessage(text.RecycleBinIsEmpty);
				/*if(oWSHShell.Popup(text.RecycleBinIsEmpty, 0, text.OpenRecycleBin, constant.icoTypeQuestion + constant.btnTypeYesNo) == constant.nBtnYes){
					location.href(clsid.RecycleBin);
				}*/
			}
			break;
		case 'binrestoreall':
			//Restore All Recycle Bin Items
			if(ns.RecycleBin.Items().Count){
				for (var i = ns.RecycleBin.Items().Count; i > 0; i--)
					ns.RecycleBin.Items().Item(i - 1).InvokeVerb(verb.Restore);
			} else {
				JSLibrary.FlashMessage(text.RecycleBinIsEmpty);
				/*if(oWSHShell.Popup(text.RecycleBinIsEmpty, 0, text.OpenRecycleBin, constant.icoTypeQuestion + constant.btnTypeYesNo) == constant.nBtnYes){
					location.href(clsid.RecycleBin);
				}*/
			}
			break;
		case 'binrestore':
		case 'binrestoreitem':
			//Restore Recycle Bin Item
			if(envar.ThisDirName == text.Recycled || envar.ThisDirName == text.RecycleBin){
				for (var i = selectedItemsCount; i > 0; i--)
					FileList.SelectedItems().Item(i - 1).InvokeVerb(verb.Restore);
			}
			break;
		case 'turnoff':
			oShell.ShutdownWindows();
			break;
		default: 
			// Do nothing.
			break;
	}
}

/*******************************************
 *DoItemTask( str_ItemTask )
 *******************************************
 *Purpose:
 *	1.	Does item tasks such as cut, copy,
 *		paste, delete, ...
 *Requires:
 *	1.	str_ItemTask = item task .
 *******************************************/
function DoItemTask( str_ItemTask ){
	var __IsFileListDisplayed = eval(FileList.style.display == ""); //To avoid ERRs or URs in barricaded folders.
	ArrestWMPlayer6();
	switch(str_ItemTask){
		case 'find':	//go to next case -> 'search'
		case 'search':
			//Search for files or folders -- Every Folder except my computer and desktop.
			try{
				oShell.ShowBrowserBar(clsid.SearchPane, true);
			} catch ( e ){
				try{
					oWSHShell.SendKeys(shortkey.FindFiles);
				} catch( e1 )
				{	
					try{
						if(env.IsOSWindows98 == true){
							FileList.Folder.ParentFolder.ParseName(envar.ThisDirName).InvokeVerb(verb.Find);
						} else {
							FileList.Folder.Self.InvokeVerb(verb.Search);
						}
					} catch ( e2 ) {
						try
						{
							if(foldertype.IsMyDocumentsFolder == true){
								oShell.FindFiles();
							} else if(foldertype.IsMyComputerFolder == true) {
								oShell.FindFiles();
							} else if(foldertype.IsDrive){
								if(env.IsOSWindows98 == true){
									ns.MyComputer.ParseName(envar.ThisDirPath).InvokeVerb(verb.Find);
								} else {
									ns.MyComputer.Self.InvokeVerb(verb.Search);
								}
							} else {
								if(env.IsOSWindows98 == true){
									ns.ThisDirPath.ParentFolder.ParseName(envar.ThisDirName).InvokeVerb(verb.Find);
								} else {
									ns.ThisDirPath.Self.InvokeVerb(verb.Search);
								}
							}
						} catch (e3 ){
							oShell.FindFiles();
						}
					}
				}
			}
			break;
		case 'properties':
			try
			{
				if(selectedItemsCount == 1){
					FileList.SelectedItems().Item(0).InvokeVerb(verb.Properties);
				} else { 
					oWSHShell.SendKeys( "%{ENTER}" ); 
				}
			} catch( e ){}
			break;
		case 'editselectall':
		case 'selectall':
			try
			{
				oWSHShell.SendKeys(shortkey.EditSelectAll);
			} catch( e )
			{
				// Enumeration code.
			}
			break;
		case 'editinvertselection':
		case 'invertselection':
			try
			{
				oWSHShell.SendKeys(shortkey.EditInvertSelection);
			} catch( e )
			{
				// Enumeration code.
			}
			break;
		case 'rename':
			if(currdrivetype.IsCDDrive == true) {
				JSLibrary.FlashMessage( "You cannot rename files on a Compact Disc." );
				break;
			}
			try
			{
				//Rename
				FileList.focus();
				FileList.SelectItem(FileList.FocusedItem, constant.SelectItem);
				FileList.SelectItem(FileList.FocusedItem, constant.EditModeItem);
			} catch( e )
			{
				FileList.focus();
				FileList.SelectItem(FileList.FocusedItem, constant.SelectItem);
				oWSHShell.SendKeys(shortkey.ItemRename);	
			} finally{
				if(FileList.SelectedItems().Item(0).IsFolder == false && FileList.SelectedItems().Item(0).Name.indexOf(".")>0){
					var fileExtensionLength = GetFileExtensionLength(FileList.SelectedItems().Item(0).Path) + 1;
					oWSHShell.SendKeys("+({LEFT " + fileExtensionLength + "})");
				}
			}
			break;
		case 'renameext':
			if(currdrivetype.IsCDDrive == true) {
				JSLibrary.FlashMessage( "You cannot rename files on a Compact Disc." );
				break;
			}
			try
			{
				//Rename
				FileList.focus();
				FileList.SelectItem(FileList.FocusedItem, constant.SelectItem);
				FileList.SelectItem(FileList.FocusedItem, constant.EditModeItem);
			} catch( e )
			{
				FileList.focus();
				FileList.SelectItem(FileList.FocusedItem, constant.SelectItem);
				oWSHShell.SendKeys(shortkey.ItemRename);	
			} finally{
				if(FileList.SelectedItems().Item(0).IsFolder == false && FileList.SelectedItems().Item(0).Name.indexOf(".")>0){
					var fileExtensionLength = GetFileExtensionLength(FileList.SelectedItems().Item(0).Name) + 1;
					oWSHShell.SendKeys("+({LEFT " + fileExtensionLength + "}){RIGHT}+({RIGHT "+ fileExtensionLength + "})");
				}
			}
			break;
		case 'open':
			try
			{
				FileList.focus();
				for (i = 0; i < selectedItemsCount; ++i){
					FileList.SelectedItems().Item(i).InvokeVerb(verb.Open);
				}
			} catch( e ){
				
			}
			break;
		case 'move':
			/***************************************************************************
			 * IF MOVE/COPY MALFUNCTIONS *
			 * ===========================
			 * Directions				: To view the error, temporarily disable
			 *							  error handling. Note the error,
			 *							  and restore the error handler.
			 * Possible Errors		 	: Cannot Move/Copy File: File System Error (1026)
			 * References				: MSDN KB Article Q180680
			 ***************************************************************************/
			if(currdrivetype.IsCDDrive == true) {
				JSLibrary.FlashMessage( "You cannot move items from a Compact Disc." );
				DoItemTask( 'copy' );
				break;
			}
			try{
				if(selectedItemsCount == 1){
					//setTimeout('oWSHShell.SendKeys("%( )M{RIGHT 30}{DOWN 20}{ENTER}")', 50);
					FileList.SelectedItems().Item(0).InvokeVerb(verb.MoveToFolder);
				} else { 
					FileList.SelectedItems().InvokeVerb(verb.MoveToFolder);
					//JSLibrary.GenErr(); // Generate an error on purpose -- function undefined.
				}
			} catch( e ){
				try
				{
					//setTimeout('oWSHShell.SendKeys("%( )M{RIGHT 30}{DOWN 20}{ENTER}")', 50);
					var moveFolder = oShell.BrowseForFolder(0, text.MoveHere, constant.ReturnFSAncestors + constant.EditBox + constant.ValidateEditBox );
					
					var fileSpec;
					if(moveFolder){
						for (var i = selectedItemsCount; i > 0; i--){
							moveFolder.MoveHere(FileList.SelectedItems().Item(i-1).Path, 0);
						}
					}
					if(foldertype.IsFloppyDrive == true ){
						NoneSelected();
					}
				} catch (e1)
				{
					
				}
				
			}
			break;
		case 'copy':
			try{
				if(selectedItemsCount == 1){
					//setTimeout('oWSHShell.SendKeys("%( )M{RIGHT 30}{DOWN 20}{ENTER}")', 50);
					FileList.SelectedItems().Item(0).InvokeVerb(verb.CopyToFolder);
				} else {
					FileList.SelectedItems().InvokeVerb(verb.CopyToFolder);
					//JSLibrary.GenErr(); // Generate an error -- function undefined.
				}
			} catch( e ){
				try
				{
					//setTimeout('oWSHShell.SendKeys("%( )M{RIGHT 30}{DOWN 20}{ENTER}")', 50);
					var copyFolder = oShell.BrowseForFolder(0, text.CopyHere, constant.ReturnFSAncestors + constant.EditBox + constant.ValidateEditBox );
					
					var fileSpec;
					if(copyFolder){
						for (var i = selectedItemsCount; i > 0; i--){
							copyFolder.CopyHere(FileList.SelectedItems().Item(i-1).Path, 0);
						}
					}
				} catch( e1 )
				{
				
				}
			}
			break;
		case 'refresh':
			try{
				document.execCommand(verb.Refresh);
			} catch( e ){
				oWSHShell.SendKeys(shortkey.ViewRefresh);
			}
			break;
		case 'delete':
			if(currdrivetype.IsCDDrive == true) {
				JSLibrary.FlashMessage( "You cannot delete files from a Compact Disc." );
				break;
			}
			try{
				FileList.focus();
				oWSHShell.SendKeys("{DEL}");
			} catch( e ){
				try{
					FileList.focus();
					oWSHShell.SendKeys(shortkey.FileDelete);
				} catch( e1 ){
					FileList.SelectedItems().Item(0).InvokeVerb(verb.Delete);
				}
			}
			if(foldertype.IsFloppyDrive == true && FileList.SelectedItems().Count == 0){
					NoneSelected();
			}
			break;
		case 'directdelete':
		case 'forcedelete':
			if(currdrivetype.IsCDDrive == true) {
				JSLibrary.FlashMessage( "You cannot delete files from a Compact Disc." );
				break;
			}
			try
			{
				
				var confirmation;
				if(selectedItemsCount == 1){
					confirmation = oWSHShell.Popup(text.AreYouSurePDelete + "\"" + FileList.SelectedItems().Item(0).Name + "\" from " + envar.ThisDirName + text.QuestionMark, 0, text.ConfirmFilePDelete, constant.icoTypeStop + constant.btnTypeYesNo);
				} else {
					confirmation = oWSHShell.Popup(text.AreYouSureMultiPDelete + selectedItemsCount + text.DeleteItems + " from " + envar.ThisDirName +text.QuestionMark, 0, text.ConfirmMultiFilePDelete, constant.icoTypeStop + constant.btnTypeYesNo);
				}
				if(confirmation == constant.nBtnYes){
					for(i = 0; i < selectedItemsCount; i++)
					{
						if(FileList.SelectedItems().Item(i).IsFolder)
						{
							oFSO.DeleteFolder(FileList.SelectedItems().Item(i).Path, true);
						} else {
							oFSO.DeleteFile(FileList.SelectedItems().Item(i).Path, true);
						}
					}
					if(foldertype.IsFloppyDrive == true ){
						setTimeout('oWSHShell.SendKeys("{F5}");', 1000);
					} else if(ns.ThisDirPath.ParentFolder.Title == "Desktop"){
						setTimeout('NoneSelected();', 1500);
					}

				}	
			} catch( e ){}
			break;
		case 'email':
			try{
				// Generate an error if multiselections.
				if(selectedItemsCount > 1) { JSLibrary.GenError(); }
				var oMessage = new ActiveXObject("MSMAPI.MAPIMessages");
				var oSession = new ActiveXObject("MSMAPI.MAPISession");
				
				oSession.DownLoadMail = false;
				oSession.LogonUI = true;
				oSession.SignOn();
				oSession.NewSession = true;
				oMessage.SessionID = oSession.SessionID;
				oMessage.Compose();
				oMessage.AttachmentName = FileList.SelectedItems().Item(0).Name;
				oMessage.AttachmentPathName = FileList.SelectedItems().Item(0).Path;
				oMessage.Send(true);
				oMessage = null;
				oSession = null;
			} catch(e)
			{
				try
				{
					var oOLK = new ActiveXObject("Outlook.Application");
					var oMAPI = oOLK.GetNameSpace("MAPI");
					var oMessage = oOLK.CreateItem(0);
					
					for (var i = selectedItemsCount; i > 0; i--){
						oMessage.Attachments.Add(FileList.SelectedItems().Item(i-1).Path, 0);
					}
					oMessage.Display();
				} catch( e1 )
				{
					try
					{
						oWSHShell.Run("msimn.exe");
					} catch ( e2 )
					{
					}
				}
			}
			break;
		case 'shortcut':
			try{
				if(currdrivetype.IsCDDrive == true) {
					JSLibrary.FlashMessage( "Cannot create shortcuts on a Compact Disc." );
					DoItemTask('desktopshortcut');
					break;
				}
				if(selectedItemsCount == 1)
				{
					FileList.SelectedItems().Item(0).InvokeVerb(verb.CreateShortcut);
				} else if(selectedItemsCount > 1){
					if(foldertype.IsMyComputerFolder == false)
					{
						var i, oShortcut;
						
						
						for(i = 0; i < selectedItemsCount; i++)	
						{
							oShortcut = oWSHShell.CreateShortcut(JSLibrary.Format.SanitizePath(envar.ThisDirPath, true) + FileList.SelectedItems().Item(i).Name + ".lnk");
							oShortcut.TargetPath = FileList.SelectedItems().Item(i).Path;
							oShortcut.WorkingDirectory = SanitizePath(envar.ThisDirPath, true);
							oShortcut.Save();
						}

					} else JSLibrary.FlashMessage( text.CouldNotCreateShortcut );
				}
			} catch( e ){}
			break;
		case 'desktopshortcut':
			if(foldertype.IsMyComputerFolder == false)
			{
				var i;
				for(i = 0; i < selectedItemsCount; i++)	
				{
					var oShortcut = oWSHShell.CreateShortcut(JSLibrary.Format.SanitizePath(envar.DesktopDir, true) + FileList.SelectedItems().Item(i).Name + ".lnk");
					oShortcut.TargetPath = FileList.SelectedItems().Item(i).Path;
					oShortcut.WorkingDirectory = JSLibrary.Format.SanitizePath(envar.ThisDirPath, true);
					oShortcut.Save();
				}
				if(selectedItemsCount == 1){
					JSLibrary.FlashMessage( text.ShortcutOnDesktop );
				} else if(selectedItemsCount > 1) {
					JSLibrary.FlashMessage( text.ShortcutsOnDesktop );
				}
			} else {
				JSLibrary.FlashMessage( text.CouldNotCreateShortcut );
			}
			break;
		case 'makenewfolder':
		case 'createnewfolder':
		case 'newfolder':
			if(currdrivetype.IsCDDrive == true) {
				JSLibrary.FlashMessage( "You cannot create new items on a Compact Disc." );
				break;
			}
			try
			{
				MakeNewFolder( "New Folder" );
			} catch(e){
				try
				{
					FileList.focus();
					FileList.Folder.NewFolder("New Folder");
					DoItemTask('renamenewfolder');
				} catch(e1)
				{			
					try
					{
						var templatenewfolder = envar.ResourceDir + "\\New Folder";
						FileList.Folder.CopyHere(templatenewfolder, 8);
						DoItemTask('renamenewfolder');
					} catch( e2 ){

						oWSHShell.SendKeys("%fnf");
						//DoItemTask('renamenewfolder');
					}
				}
			}
			break;
		case 'renamenewfolder':
			var thenewfolder = FileList.Folder.ParseName("New Folder");
			try{
				FileList.focus();
				FileList.SelectItem(thenewfolder, 1);
				FileList.SelectItem(thenewfolder, 3);
			} catch(e){
				setTimeout("DoItemTask('renamenewfolder');", 10);
			}
			break;
		case 'winmeslideshow':
			try
			{
				if(!env.IsOSWindows98)
					PreviewMe.SlideShow();
			} catch (e )
			{
				JSLibrary.FlashMessage( e.description );
			}
			break;
		default: 
			// Do nothing.
			break;
	}
}

/*******************************************
 *DoSpecialTask( str_SpecialTask )
 *******************************************
 *Purpose:
 *	1.	Does tasks special to webview, such
 *		as deleting garbage files, and
 *		reading text files.
 *Requires:
 *	1.	str_SpecialTask = str special task.
 *******************************************/
function DoSpecialTask( str_SpecialTask ){
	//var __IsFileListDisplayed = eval(FileList.style.display == ""); //To avoid ERRs or URs in barricaded folders.
	switch(str_SpecialTask){

		case 'garbageout':
			if(currdrivetype.IsCDDrive == true) {
				break;
			}
			try
			{
				if( oFSO.FileExists( envar.ThisDirPath + "\\runjavac.bat" ) == true ){
					oFSO.DeleteFile( envar.ThisDirPath + "\\runjavac.bat" );
					//setTimeout("document.execCommand('refresh');", 2000);
				}
			} catch( e ){
				setTimeout("DoSpecialTask( 'garbageout' )", 200);
			}
		case 'cupofjava':
			try
			{
				if(GetFileExtension(FileList.SelectedItems().Item(0).Path) == "java")
				{
					CompileJavaFile(FileList.SelectedItems().Item(0), true);
				} else if(GetFileExtension(FileList.SelectedItems().Item(0).Path) == "class") {
					oWSHShell.Run("java.exe "+FileList.SelectedItems().Item(0).Name.substring(0, FileList.SelectedItems().Item(0).Name.indexOf(".class")));
				}
			} catch( e ){}
			break;
		case 'notepad':
		case 'openwithnotepad':
			try
			{
				ArrestWMPlayer6();
				if(selectedItemsCount > constant.OpenFilesMAX){
					if(oWSHShell.Popup(text.TryingToOpenTooManyFiles + selectedItemsCount + text.FilesQuestion, 0, text.SystemWarning,  constant.btnTypeYesNo + constant.icoTypeStop) == constant.nBtnNo)
					{
						break;
					}
				}
				if(selectedItemsCount >= 1){
					for(i = 0; i < selectedItemsCount; i++){
						if(FileList.SelectedItems().Item(i).IsFolder == false) {
							if(FileList.SelectedItems().Item(i).Size < 65536){
								oWSHShell.Run("notepad.exe \""+FileList.SelectedItems().Item(i).Path+"\"");
							} else {
								oWSHShell.Run("write.exe \""+FileList.SelectedItems().Item(i).Path +"\"");
								JSLibrary.FlashMessage("File " + FileList.SelectedItems().Item(i).Name + " is too large for Notepad to Open. So opening in WordPad.")
							}
						}
					}
				} else {
					oWSHShell.Run( "notepad.exe");
				}
			} catch( e ){
				oWSHShell.Run( "notepad.exe");
			}
			break;
		case 'textpad':
			try
			{
				ArrestWMPlayer6();
				if(selectedItemsCount > constant.OpenFilesMAX){
					if(oWSHShell.Popup(text.TryingToOpenTooManyFiles + selectedItemsCount + text.FilesQuestion, 0, text.SystemWarning,  constant.btnTypeYesNo + constant.icoTypeStop) == constant.nBtnNo)
					{
						break;
					}
				}
				if(selectedItemsCount >= 1){

					for(i = 0; i < selectedItemsCount; i++){
						if(FileList.SelectedItems().Item(i).IsFolder == false)
						{
							oWSHShell.Run("textpad.exe \""+FileList.SelectedItems().Item(i).Path+"\"");
						} 
					}
				} else {
					oWSHShell.Run( "textpad.exe");
				}
			} catch( e ){
				try
				{					
					oWSHShell.Run( "textpad.exe");
				} catch( e1 )
				{}
			}
			
			break;
		case 'wordpad':
		case 'openwithwordpad':
			try
			{
				ArrestWMPlayer6();
				if(selectedItemsCount > constant.OpenFilesMAX){
					if(oWSHShell.Popup(text.TryingToOpenTooManyFiles + selectedItemsCount + text.FilesQuestion, 0, text.SystemWarning,  constant.btnTypeYesNo + constant.icoTypeStop) == constant.nBtnNo)
					{
						break;
					}
				}
				if(selectedItemsCount >= 1)
				{
					for(i = 0; i < selectedItemsCount; i++){
						if(FileList.SelectedItems().Item(i).IsFolder == false)
						{
							oWSHShell.Run("write.exe \""+FileList.SelectedItems().Item(i).Path+"\"");
						} 
					}
				} else {
					oWSHShell.Run( "write.exe");
				}
			} catch( e ){
				oWSHShell.Run( "write.exe");
			}
			break;
		case 'mspaint':
		case 'openwithmspaint':
			try
			{
				if(selectedItemsCount > constant.OpenFilesMAX){
					if(oWSHShell.Popup(text.TryingToOpenTooManyFiles + selectedItemsCount + text.FilesQuestion, 0, text.SystemWarning,  constant.btnTypeYesNo + constant.icoTypeStop) == constant.nBtnNo)
					{
						break;
					}
				}
				var fileExtension;
				if(selectedItemsCount >= 1){	
					for(i = 0; i < selectedItemsCount; i++)
					{
						if(FileList.SelectedItems().Item(i).IsFolder == false){
							fileExtension = GetFileExtension(FileList.SelectedItems().Item(i).Name);
							if( IsTypeImage( fileExtension ) ){
								oWSHShell.Run("mspaint.exe \""+ FileList.SelectedItems().Item(i).Path + "\"");
							} else if(selectedItemsCount > 1){ oWSHShell.Run( "mspaint.exe" ); break; }
						}
					}
				} else {
					oWSHShell.Run( "mspaint.exe" );
				}
			} catch( e ){
				oWSHShell.Run( "pbrush.exe");
			}
			break;
		case 'windowsmediaplayer':
		case 'wmplayer':
		case 'openwithwmplayer':
			try
			{
				ArrestWMPlayer6();
				if(selectedItemsCount == 1 && FileList.SelectedItems().Item(0).IsFolder == false){
					var fileExtension = GetFileExtension(FileList.SelectedItems().Item(0).Path);
					if( IsTypeWMPlayer( fileExtension ) ){
						oWSHShell.Run("wmplayer.exe /Play \""+FileList.SelectedItems().Item(0).Path + "\"");
					} else oWSHShell.Run( "wmplayer.exe" )
				} else { 
						oWSHShell.Run("wmplayer.exe");
				}
			} catch( e ){
				oWSHShell.Run("mplayer.exe");
			}
			break;
		case 'mplayer2':
			try
			{
				ArrestWMPlayer6();
				if(selectedItemsCount == 1 && FileList.SelectedItems().Item(0).IsFolder == false){
					var fileExtension = GetFileExtension(FileList.SelectedItems().Item(0).Path);
					if( IsTypeWMPlayer( fileExtension ) || fileExtension == "dat" ){
						oWSHShell.Run("mplayer2.exe /Play \""+FileList.SelectedItems().Item(0).Path + "\"");
						setTimeout('oWSHShell.SendKeys(shortkey.WMPFullScreen)', 2000);
					} else oWSHShell.Run( "mplayer2.exe" )
				} else { 
						oWSHShell.Run( "mplayer2.exe" );
				}
			} catch( e ){
				oWSHShell.Run( "mplayer.exe" );
			}
			break;
		case 'winamp':
		case 'playinwinamp':
			ArrestWMPlayer6();
			if(selectedItemsCount == 0) {
				JSLibrary.FlashMessage( "Please select one or more files before you play them." );
				break;
			}
			try
			{
				var fileExtension;
				for(i = 0; i < selectedItemsCount; i++)
				{
					if(FileList.SelectedItems().Item(i).IsFolder == false){
						fileExtension = GetFileExtension(FileList.SelectedItems().Item(i).Name);
					} else {
						fileExtension = "";
					}
					if( (fileExtension != "" && IsTypeWinamp( fileExtension )) || FileList.SelectedItems().Item(i).IsFolder == true){
						FileList.SelectedItems().Item(i).InvokeVerb(verb.PlayInWinamp);
					}
				}
			} catch( e ){}
			break;
		case 'enqueueinwinamp':
			ArrestWMPlayer6();
			if(selectedItemsCount == 0) {
				JSLibrary.FlashMessage( "Please select one or more files before you enqueue them." );
				break;
			}
			try{
				var fileExtension;
				for(i = 0; i < selectedItemsCount; i++)
				{
						if( FileList.SelectedItems().Item(i).IsFolder == false){
							fileExtension = GetFileExtension(FileList.SelectedItems().Item(i).Name);
						} else {
							fileExtension = "";
						}
						if( (fileExtension != "" && IsTypeWinamp( fileExtension )) || FileList.SelectedItems().Item(i).IsFolder == true ){
							FileList.SelectedItems().Item(i).InvokeVerb(verb.EnqueueInWinamp);
						}
				}
			} catch( e ){}
			break;
		case 'dosprompthere':
		case 'msdosprompthere':
		case 'commandprompthere':
			/**********************************
			 *Purpose:
			 *	1.	Opens the Command Prompt to
			 *		the current open folder.
			 *Recommended Requirements:
			 *	1.	Registry Entries:
			 *		A.	[HKCR\Directory\shell\CommandPromptHere] 
			 *			@="Command Prompt &Here"
			 *		B.	[HKCR\Directory\shell\CommandPromptHere\command] 
			 *			@="<command.com or cmd.exe> /k cd "%1""
			 *		C.	[HKCR\Drive\shell\CommandPromptHere] 
			 *			@="Command Prompt &Here"
			 *		D.	[HKCR\Drive\shell\CommandPromptHere\command] 
			 *			@="<command.com or cmd.exe> /k cd "%1""
			 *		E.	Same for My Documents
			 **********************************/
			 if(selectedItemsCount == 1){
				if(FileList.SelectedItems().Item(0).IsFolder){
					try {
						FileList.SelectedItems().Item(0).InvokeVerb(verb.CommandPromptHere);
					} catch( e )
					{
						oWSHShell.Run( env.CommandPrompt + " /k cd \"" + FileList.SelectedItems().Item(0).Path + "\"" );
					}
				} else {
					try
					{
						ns.ThisDirPath.ParentFolder.ParseName(envar.ThisDirPath).InvokeVerb(verb.CommandPromptHere);
					} catch( e )
					{
						try
						{
							ns.ThisDirPath.ParentFolder.ParseName(envar.ThisDirName).InvokeVerb(verb.CommandPromptHere);
						} catch( e1 )
						{
							oWSHShell.Run(env.CommandPrompt + " /k cd \"" + envar.ThisDirPath + "\"");
						}
					}
				}
			 } else {
				try
				{
					ns.ThisDirPath.ParentFolder.ParseName(envar.ThisDirPath).InvokeVerb(verb.CommandPromptHere);
				} catch( e )
				{
					try
					{
						ns.ThisDirPath.ParentFolder.ParseName(envar.ThisDirName).InvokeVerb(verb.CommandPromptHere);
					} catch( e1 )
					{
						oWSHShell.Run(env.CommandPrompt + " /k cd \"" + envar.ThisDirPath + "\"");
					}
				}
			}
			break;
		case 'explore':
		case 'explorefolder':
			 if(selectedItemsCount == 1){
				if(FileList.SelectedItems().Item(0).IsFolder){
					try {
						FileList.SelectedItems().Item(0).InvokeVerb(verb.Explore);
					} catch( e )
					{
						oWSHShell.Run(envar.WindowsDir+"\\explorer.exe /n,/e,"+FileList.SelectedItems().Item(0).Path);
					}
				} else {
					try
					{
						ns.ThisDirPath.ParentFolder.ParseName(envar.ThisDirPath).InvokeVerb(verb.Explore);
					} catch( e )
					{
						try
						{
							ns.ThisDirPath.ParentFolder.ParseName(envar.ThisDirName).InvokeVerb(verb.Explore);
						} catch( e1 )
						{
							oWSHShell.Run(envar.WindowsDir+"\\explorer.exe /n,/e,"+envar.ThisDirPath);
						}
					}
				}
			 } else {
				try
				{
					ns.ThisDirPath.ParentFolder.ParseName(envar.ThisDirPath).InvokeVerb(verb.Explore);
				} catch( e )
				{
					try
					{
						ns.ThisDirPath.ParentFolder.ParseName(envar.ThisDirName).InvokeVerb(verb.Explore);
					} catch( e1 )
					{
						oWSHShell.Run(envar.WindowsDir+"\\explorer.exe /n,/e,"+envar.ThisDirPath);
					}
				}
			}
			break;
		case 'folderspane':
		case 'showfolderspane':
		case 'hidefolderspane':
			try
			{
				if(oShell.ShowBrowserBar(clsid.FoldersPane, true) == true) {
					break;
				} else {
					oShell.ShowBrowserBar(clsid.FoldersPane, false)
				}
			} catch( e )
			{
				oWSHShell.SendKeys(shortkey.ViewFoldersPane);
			}
			break;
		case 'customize':
		case 'customizethisfolder':
			try
			{
				oWSHShell.SendKeys(shortkey.ViewCustomizeThisFolder);
			} catch( e ){
				oWSHShell.Run("ieshwiz.exe " + envar.ThisDirPath)
			}
			break;
		case 'newtextfile':
		case 'createnewtextfile':
			ArrestWMPlayer6();
			if(currdrivetype.IsCDDrive == true)
			{
				JSLibrary.FlashMessage( "You cannot create new items on a Compact Disc" );
				break;
			}
			try
			{
				MakeNewTextFile( "New Text Document" );
			} catch(e)
			{}
			break;
		default:
			// Do nothing.
			break;
	}
}