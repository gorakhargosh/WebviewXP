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
	//////////////////////////////////////////////////////////////////////
	//DECLARATIONS AND INITIALIZATIONS
		//Dim oShell, oFSO
		var oShell 			= new ActiveXObject( "Shell.Application" );
		var oFSO 			= new ActiveXObject( "Scripting.FileSystemObject" );
		var oWSHShell		= new ActiveXObject( "WScript.Shell" );
		//var oWMPlayer		= null;			// init after load in Main() routine.

		var g_NS_MyComputer 			= oShell.NameSpace( "::{20D04FE0-3AEA-1069-A2D8-08002B30309D}" );
		var g_NS_MyDocuments 			= oShell.NameSpace( "::{450D8FBA-AD25-11D0-98A8-0800361B1103}" );
		var g_NS_ThisDirPath			= oShell.NameSpace( g_ThisDirPath );
		var dirtype = "";

		var clsid			= new SHClsid();
		var constant		= new SHConstant();
		var env				= new SHEnvironment();
		var envar			= new SHEnvironmentVariable();
		var ns				= new SHNameSpace();
		var verb			= new SHFolderItemVerb();
		var viewoptions		= new SHWebviewOptions(); //Set to SHWebviewOptionsOptimum(); for optimum fast performance.
		var tooltip			= new SHToolTip();
		var foldertype		= new SHFolderType();
		var parenttype		= new SHParentType();
		var currdrivetype	= new SHCurrDriveType();
		var text			= new SHText();
		var imgcache		= new SHImageCache();
		var shortkey		= new SHShortcutKey98();
			//if(env.IsOsWindowsNT) shortkey = new SHShortcutKeyNT();

		//Safety measure 
		//just-in-case some inveterate geek has an idea!
		if(viewoptions.EnableFadeAnimation == false)
			viewoptions.EnableFadeAnimation = true;


		
	///////////////////////////////////////////////////////////////////////////
	// Object Constructors
		function SHWebviewOptions()
		{
			this.EnableFolderMediaTypeCheck = true;
			this.EnableFolderContents = true;
			this.EnableItemAttributes = true;
			this.EnableFolderSize = true;
			this.EnableFSOFolderCount = true;
			this.EnableFSODateModified = true;
			this.EnableFSOFileVersion = true;
			this.EnableCompressedFolderInfo = true;

			this.EnableImagePreview = true;
			this.ImagePreviewSize = 100;
			this.EnableVideoPreview = true;
			this.EnableControlsOnMouseOver = true;

			this.EnableWinamp2 = true;
			
			
			// not yet implemented
			this.EnableSizeInBytes = true;
			this.EnableMediaInformation = true;
				this.VideoVolume = true;
				this.RepeatPlayback = true;
			
			// DO NOT EDIT BEYOND THIS LINE.
			this.EnableFadeAnimation = true;
		}
	
		// SHShortcutKey98 -- Sets the shortcuts for Windows 98.
		function SHShortcutKey98()
		{
			// Explorer
			this.ViewFolderOptions			= "%(vo)";
			this.ViewLargeIcons				= "%(vg)";
			this.ViewSmallIcons				= "%(vm)";
			this.ViewList					= "%(vl)";
			this.ViewDetails				= "%(vd)";
			this.ViewLineUpIcons			= "%(vu)";
			this.ViewRefresh				= "%(vr)";
			this.ViewFoldersPane			= "%(veo)";
			this.ViewStatusBar				= "%(vb)";
			this.ViewCustomizeThisFolder	= "%(vc)";
			
			this.EditSelectAll				= "^a"; //"%(ea)";
			this.EditInvertSelection		= "%(ei)";
			
			this.FileNewFolder				= "%(fnf)";
			this.FileNewTextFile			= "%(fnt)";
			this.FileClose					= "%(fc)";
			this.FileDelete					= "%(fd)";
			
			this.AutoAndTypeAddress			= "{F4}";
			this.FullScreen					= "{F11}";
			this.GoUpOneLevel				= "%(gu)";
			this.UpOneLevel					= "{BACKSPACE}";
			
			this.ArrangeIconsAuto			= "%via";
			this.WMPFullScreen				= "%{ENTER}";

			
			// Special
			this.StartMenu					= "^{ESC}";
			this.ShortcutMenu				= "+{F10}";
			this.ItemProperties				= "%{ENTER}";
			this.ItemRename					= "{F2}";
			this.FindFiles					= "{F3}";
				this.FindAllFiles			= this.FindFiles;
			this.ShiftDelete				= "+{DEL}";
			
			// System
			this.ShowAllFiles				= "%(vo){TAB 4}{RIGHT}{TAB 3}{DOWN 6} {ENTER}";
			this.HideHiddenAndSystemFiles	= "%(vo){TAB 4}{RIGHT}{TAB 3}{DOWN 5} {ENTER}";
			this.HideHiddenFiles			= "%(vo){TAB 4}{RIGHT}{TAB 3}{DOWN 4} {ENTER}";
		}

		// SHFolderItemVerb -- Stores the verbs for folder items.
		function SHFolderItemVerb()
		{
			this.AutoPlay				= "Auto&Play";
			this.Backup					= "&Backup";
			this.CommandPromptHere		= "Command Prompt &Here";
			this.Copy					= "&Copy";
			this.CopyDisk				= "Cop&y Disk...";
			this.CopyToFolder			= "Copy To &Folder..."
			this.CreateShortcut			= "Create &Shortcut";
			this.Cut					= "Cu&t";
			this.Delete					= "&Delete";
			this.EjectCD				= "E&ject";
			this.EmptyRecycleBin		= "Empty Recycle &Bin";
			this.EnqueueInWinamp		= "&Enqueue in Winamp";
			this.Explore				= "&Explore";
			this.Find					= "&Find...";
			this.FormatDrive			= "For&mat...";
			this.MoveToFolder			= "Mo&ve To Folder...";
			this.Open					= null;
			this.Play					= "&Play";
			this.PlayInWinamp			= "&Play in Winamp";
			this.Print					= "&Print";
			this.Properties				= "P&roperties";
			this.Refresh				= "Refresh";
			this.Restore				= "R&estore";
			this.Search					= "&Search...";
		}
		// SHClsid -- Stores the CLSIDs.
		function SHClsid()
		{
			this.MyComputer				= "::{20D04FE0-3AEA-1069-A2D8-08002B30309D}";
			this.MyDocuments			= "::{450D8FBA-AD25-11D0-98A8-0800361B1103}";
			this.MyNetworkPlaces		= "::{208D2C60-3AEA-1069-A2D7-08002B30309D}";
			this.RecycleBin				= "::{645FF040-5081-101B-9F08-00AA002F954E}";
			this.DialUpNetworking		= "::{20D04FE0-3AEA-1069-A2D8-08002B30309D}/::{992CFFA0-F557-101A-88EC-00DD010CCC48}";
			this.Printers				= "::{20D04FE0-3AEA-1069-A2D8-08002B30309D}/::{2227A280-3AEA-1069-A2DE-08002B30309D}";
			this.ControlPanel			= "::{20D04FE0-3AEA-1069-A2D8-08002B30309D}/::{21EC2020-3AEA-1069-A2DD-08002B30309D}";
			this.FoldersPane			= "{EFA24E64-B078-11d0-89E4-00C04FC9E26E}";
			this.SearchPane				= "{C4EE31F3-4768-11D2-BE5C-00A0C9A83DA1}";
			//this.Desktop				= "::{00021400-0000-0000-C000-000000000046}";
		}
		// SHNameSpace -- Stores the namespaces.
		function SHNameSpace()
		{
			this.MyComputer 			= oShell.NameSpace( clsid.MyComputer );
			this.MyDocuments 			= oShell.NameSpace( clsid.MyDocuments );
			this.MyNetworkPlaces		= oShell.NameSpace( clsid.MyNetworkPlaces );
			this.RecycleBin				= oShell.NameSpace( clsid.RecycleBin );
			this.TemplateDir			= oShell.NameSpace( envar.TemplateDir );
			this.ResourceDir			= oShell.NameSpace( envar.ResourceDir );
			this.DUN					= oShell.NameSpace( clsid.DUN );
			this.DesktopDir				= oShell.NameSpace( envar.DesktopDir );
			this.WindowsDir				= oShell.NameSpace( envar.WindowsDir );
			this.ThisDirPath			= oShell.NameSpace( envar.ThisDirPath );
				try
				{
					if( this.ThisDirPath.ParentFolder )
					{
						this.ParentFolder = this.ThisDirPath.ParentFolder;
						this.ThisFolderItem = this.ParentFolder.ParseName( envar.ThisDirName );
					}
				} catch( e ){
					
				}
		}
		// SHEnvironmentVariable -- Stores all environment variables.
		function SHEnvironmentVariable()
		{
			this.ThisDirPath				= g_ThisDirPath;
			this.ThisDirName				= g_ThisDirName;
			this.TemplateDir				= g_TemplateDir;
			this.ResourceDir				= g_ResourceDir;
			this.OpicoDir					= g_ResourceDir + "\\opico";
			this.ToolbarDir					= g_ResourceDir + "\\toolbar";
			this.WindowsDir					= g_TemplateDir.toLowerCase().LeftSubstringTo("\\web");
			this.System16Dir					= this.WindowsDir + "\\system";
			this.System32Dir				= this.WindowsDir + "\\system32";
			this.DesktopDir					= this.WindowsDir + "\\desktop";
			this.Winamp;
			this.MyDocumentsDir				= g_NS_MyDocuments.ParentFolder.ParseName(g_NS_MyDocuments.Title).Path
			
			this.RootDriveLetter			= this.TemplateDir.substring(0, this.TemplateDir.indexOf(":"));
			
			if(g_NS_MyComputer.Title != g_ThisDirName)
			{
				this.CurrentDriveLetter			= this.ThisDirName.substring( this.ThisDirName.indexOf(":") - 1, this.ThisDirName.indexOf(":"));
				this.CurrentDriveType			= g_NS_MyComputer.GetDetailsOf(g_NS_MyComputer.ParseName(this.ThisDirPath), constant.GetSize);
				try{	
					this.ParentFolderTitle			= g_NS_ThisDirPath.ParentFolder.Title;
					this.ParentDriveLetter			= this.ParentFolderTitle.substring(this.ParentFolderTitle.indexOf("(")+1, this.ParentFolderTitle.indexOf(":)") );
					this.ParentDriveType			= g_NS_MyComputer.GetDetailsOf(g_NS_MyComputer.ParseName(this.ParentDriveLetter + ":\\"), constant.GetSize);
				} catch(e)
				{
				}
			}
			
			this.ProgramFilesDir			= this.RootDriveLetter + ":\\Program Files";
		}
		// SHFolderType -- Checks the folder type.
		function SHFolderType()
		{
			//Active Current Drives
			this.IsDrive					= ( envar.ThisDirName.indexOf( ":)" ) > 0 );
				this.IsFloppyDrive			= this.IsDrive && ( envar.ThisDirName.toLowerCase().indexOf( "floppy" ) > 0 );
				this.IsRootDrive			= this.IsDrive && ( envar.CurrentDriveLetter == envar.RootDriveLetter );
				this.IsCDDrive				= this.IsDrive && ( envar.CurrentDriveType == "CD-ROM Disc" || envar.CurrentDriveType == "Compact Disc" || envar.CurrentDriveType == "CD Drive" || envar.CurrentDriveType == "CD-ROM Drive");
				this.IsFixedDrive			= this.IsDrive && !this.IsFloppyDrive && !this.IsCDDrive && ( envar.CurrentDriveType == "Local Disk" ); // || envar.CurrentDriveType == "Local Volume" || envar.CurrentDriveType == "Fixed Drive" );
			
			//Active Current Folders
			this.IsSystemFolder				= false;
			this.IsMyDocumentsFolder		= eval(envar.ThisDirName == ns.MyDocuments.Title && envar.MyDocumentsDir == envar.ThisDirPath );
			this.IsWindowsFolder			= eval(envar.WindowsDir.length == envar.ThisDirPath.length && envar.WindowsDir.toLowerCase().indexOf(envar.ThisDirPath.toLowerCase()) == 0);
			this.IsMyComputerFolder			= eval(envar.ThisDirName == ns.MyComputer.Title);
			this.IsSystem16Folder			= eval(envar.System16Dir.length == envar.ThisDirPath.length && envar.System16Dir.toLowerCase().indexOf(envar.ThisDirPath.toLowerCase()) == 0);
			this.IsSystem32Folder			= eval(envar.System32Dir.length == envar.ThisDirPath.length && envar.System32Dir.toLowerCase().indexOf(envar.ThisDirPath.toLowerCase()) == 0);
			this.IsProgramFilesFolder		= eval(envar.ProgramFilesDir.length == envar.ThisDirPath.length && envar.ProgramFilesDir.toLowerCase().indexOf(envar.ThisDirPath.toLowerCase()) == 0);
			this.IsAltProgramFilesFolder	= eval(envar.ThisDirName == "Program Files" && g_NS_ThisDirPath.ParentFolder.Title.indexOf(":)") >= 0 );
			this.IsAltWindowsFolder			= eval((envar.ThisDirName.toLowerCase() == "windows" || envar.ThisDirName.toLowerCase() == "winnt") && g_NS_ThisDirPath.ParentFolder.Title.indexOf(":)") >= 0 );
			this.IsSystemVolumeInformationFolder	= eval(envar.ThisDirName == "System Volume Information" && g_NS_ThisDirPath.ParentFolder.Title.indexOf(":)") >= 0 );
			this.IsRestoreFolder			= eval(envar.ThisDirName == "_Restore" && g_NS_ThisDirPath.ParentFolder.Title.indexOf(":)") >= 0 );
			
			if( this.IsMyDocumentsFolder == true || 
				this.IsWindowsFolder == true || 
				this.IsMyComputerFolder == true ||
				this.IsSystem16Folder == true ||
				this.IsSystem32Folder == true ||
				this.IsProgramFilesFolder == true ||
				this.IsAltProgramFilesFolder == true ||
				this.IsAltWindowsFolder == true ||
				this.IsSystemVolumeInformationFolder == true ||
				this.IsRestoreFolder == true)
			{ 
				this.IsSystemFolder = true;
			}
		}
		function SHParentType()
		{
			// My Computer has no parent folder.
			if(g_NS_MyComputer.Title != g_ThisDirName)
			{
				//Parent Drives
				this.IsDrive					= eval(envar.ParentFolderTitle.indexOf( ":)" ) > 0 );
					this.IsFloppyDrive			= this.IsDrive && ( envar.ParentFolderTitle.toLowerCase().indexOf( "floppy" ) > 0 );
					this.IsRootDrive			= this.IsDrive && ( envar.ParentDriveLetter == envar.RootDriveLetter );
					this.IsCDDrive				= this.IsDrive && ( envar.ParentDriveType == "CD-ROM Disc" || envar.ParentDriveType == "Compact Disc" || envar.ParentDriveType == "CD Drive" || envar.ParentDriveType == "CD-ROM Drive");
					this.IsFixedDrive			= this.IsDrive && !this.IsFloppyDrive && !this.IsCDDrive && ( envar.ParentDriveType == "Local Disk" ); // || envar.ParentDriveType == "Local Volume" || envar.ParentDriveType == "Fixed Drive" );
				
				//Parent Folders
				this.IsMyDocumentsFolder		= eval(envar.ParentFolderTitle == ns.MyDocuments.Title && envar.ThisDirPath.indexOf(envar.MyDocumentsDir) == 0 );
				this.IsWindowsFolder			= eval(envar.ParentFolderTitle == ns.WindowsDir.Title && envar.TemplateDir.toLowerCase().indexOf(envar.WindowsDir) == 0 );
			}
		}
		function SHCurrDriveType()
		{
			if(g_NS_MyComputer.Title != g_ThisDirName)
			{

				var driveSpec = envar.ThisDirPath.substring(envar.ThisDirPath.indexOf(":")-1, envar.ThisDirPath.indexOf(":")+1)
				var oDrive = oFSO.GetDrive(driveSpec);
				this.IsFloppyDrive				= false;
				this.IsCDDrive					= false;
				this.IsFixedDrive				= false;
				
				if(oDrive.DriveType == 4)
					this.IsCDDrive = true;
				else if(oDrive.DriveType == 2)
					this.IsFixedDrive = true;
				else if(oDrive.DriveType == 1 && oDrive.VolumeName.toLowerCase().indexOf("floppy") >= 0 )
					this.IsFloppyDrive = true;
			}
		}
		
		// SHEnvironment -- Checks the Operating System and related environment.
		function SHEnvironment()
		{
			this.IsOSWindows98				= ( navigator.appVersion.toLowerCase().indexOf( "windows 98" ) > 0 );
			this.IsOSWindowsME				= ( navigator.appVersion.toLowerCase().indexOf( "windows me" ) > 0 );
			this.IsOSWindowsNT				= ( navigator.appVersion.toLowerCase().indexOf( "windows nt" ) > 0 );
			this.CommandPrompt				= "command.com";
				if(!this.IsOSWindows98 && !this.IsOSWindowsME) 
					this.CommandPrompt = "cmd.exe";
		}

		// SHConstant - Stores all the flags and constants.		
		function SHConstant()
		{
			//	GetDetailsOf() iColumn Flags
			this.GetName			= 0x000000;
			this.GetSize			= 0x000001;
			this.GetType			= 0x000002;
			this.GetDateModified	= 0x000003;
			this.GetAttributes		= 0x000004;
			this.GetTips			= 0x000000 - 0x000001;
			
			// SelectItem() dwFlags Flags
			this.DeselectItem			= 00;
			this.SelectItem				= 01;
			this.EditModeItem			= 03;
			this.DeselectAllButSpec		= 04;
			this.EnsureItemDisplayed	= 010;
			this.FocusItem				= 020;
			
			
			// BrowseForFolder() ulFlags Flags
			this.BrowseForComputer		= 0;
			this.BrowseForPrinter		= 1;
			this.BrowseIncludeFiles		= 2;
			this.DontGoBelowDomain		= 3;
			this.EditBox				= 4;
			this.ReturnFSAncestors		= 5;
			this.ReturnOnlyFSDirs		= 6;
			this.StatusText				= 7;
			this.ValidateEditBox		= 8;
			
			// GetFolderMediaType() Return Value
			this.NormalType			= 0;
			this.AudioType			= 1;
			this.ImageType			= 2;
			this.VideoType			= 3;
			
			// TaskPane Width and Height constant incAmount and decAmounts
			this.IncHAmount = 0x02;
			this.IncWAmount = 0x0F; //if small scrollbars the 0x0C
			this.DecHAmount = this.IncHAmount;
			this.DecWAmount	= this.IncWAmount;
			
			// oFSO DriveType
			this.dtUnknown		= 0x000000;
			this.dtRemovable	= 0x000001;
			this.dtFixed		= 0x000002;
			this.dtNetwork		= 0x000003;
			this.dtCDDrive		= 0x000004;
			this.dtRAMDisk		= 0x000005;
			
			// Name limits
			this.ItemNameMAX = 0024;
			this.FolderItemListMAX = 0005;
			this.FolderItemNameMAX = 0026;
			this.OpenFilesMAX = 0017;
			
			// oWMPlayer6.PlayState values
			this.mpStopped = 0x000000;
			this.mpPaused = 0x000001;
			this.mpPlaying = 0x000002;
			this.mpWaiting = 0x000003;
			this.mpScanForward = 0x000004;
			this.mpScanReverse = 0x000005;
			this.mpSkipForward = 0x000006;
			this.mpSkipReverse = 0x000007;
			this.mpClosed = 0x000008;
			
			// Shell Special Folder Constants
			this.ssfDESKTOP = 0x0000;
			this.ssfPROGRAMS = 0x0002;
			this.ssfCONTROLS = 0x0003;
			this.ssfPRINTERS = 0x0004;
			this.ssfPERSONAL = 0x0005;
			this.ssfFAVORITES = 0x0006;
			this.ssfSTARTUP = 0x0007;
			this.ssfRECENT = 0x0008;
			this.ssfSENDTO = 0x0009;
			this.ssfBITBUCKET = 0x000a;
			this.ssfSTARTMENU = 0x000b;
			this.ssfDESKTOPDIRECTORY = 0x0010;
			this.ssfDRIVES = 0x0011;
			this.ssfNETWORK = 0x0012;
			this.ssfNETHOOD = 0x0013;
			this.ssfFONTS = 0x0014;
			this.ssfTEMPLATES = 0x0015;
			
			// oWSHShell.Popup -> btnType
			this.btnTypeOK = 0x000000;
			this.btnTypeOKCancel = 0x000001;
			this.btnTypeAbortRetryIgnore = 0x000002;
			this.btnTypeYesNoCancel = 0x000003;
			this.btnTypeYesNo = 0x000004;
			this.btnTypeRetryCancel = 0x000005;
			
			// oWSHShell.Popup -> iconType
			this.icoTypeStop = 0x000010;
			this.icoTypeQuestion = 0x000020;
			this.icoTypeExclamation = 0x000030;
			this.icoTypeInformation = 0x000040;
			
			// oWSHShell.Popup -> nBtn
			this.nBtnOK = 0x000001;
			this.nBtnCancel = 0x000002;
			this.nBtnAbort = 0x000003;
			this.nBtnRetry = 0x000004;
			this.nBtnIgnore = 0x000005;
			this.nBtnYes = 0x000006;
			this.nBtnNo = 0x000007;
			
			// Image Preview Sizes;
			this.ImageSizeMAX = 150;
			this.ImageSizeMIN = 100;
		}
		// SHToolTip -- Stores tooltips.
		function SHToolTip()
		{
			this.NormalItemsInFolder = "The&nbsp;number&nbsp;of&nbsp;items&nbsp;(excluding&nbsp;hidden&nbsp;and&nbsp;system&nbsp;items)&nbsp;in&nbsp;the&nbsp;folder.";
		}
		// SHText -- Stores all required text strings.
		function SHText()
		{
			this.Bytes											= "&nbsp;bytes";
			this.KB												= "&nbsp;KB";
			this.MB												= "&nbsp;MB";
			this.GB												= "&nbsp;GB";
			this.Prompt											= "";
			this.More											= "...";
			this.Delimiter										= ",";
			this.SystemFolder									= "System Folder";
			this.FileFolder										= "File Folder";
			this.MoviesFolder									= "Movies Folder";
			this.MusicFolder									= "Music Folder";
			this.PicturesFolder									= "Pictures Folder";
			this.Dimensions										= "Dimensions:&nbsp;"
			this.Pixels											= " pixels"
			this.TotalFilesSize									= "Total Files Size:&nbsp;"
			this.TotalItemsSize									= "Total Size:&nbsp;"
			this.RegHive										= "HKCU\\Software\\WestEnd\\Webview";
			
			this.Attributes		 								= "Attributes";
			this.AttributeCodes									= "RHSaCE";		//SUPPRESS THE ARCHIVE FLAG (Readonly, Hidden, System, archive, Compressed, Encrypted)
			this.ReadOnly 										= "<nobr>Read-Only</nobr>";
			this.Hidden											= "Hidden";
			this.System 										= "System";
			this.Archive										= "Archive";
			this.Encrypted	  									= "Encrypted";
			this.Normal											= "(Normal)";	// No attributes.
			this.Compressed										= "Compressed";
			
			this.MyDocuments									= "My Documents";
			this.ProgramFiles									= "Program Files";
			this.RecycleBin										= "Recycle Bin";
			this.Recycled										= "Recycled";
			this.SystemVolumeInformation						= "System Volume Information";
			this.DocumentsAndSettings							= "Documents and Settings";
			this.Windows										= "Windows";
				if( env.IsOSWindowsNT == true ) this.Windows	= "WINNT";
				
			this.CopyHere		= "Copy the item(s) to the selected folder:"; 
			this.MoveHere		= "Move the item(s) to the selected folder:";
			this.TryingToOpenTooManyFiles = "You are trying to open too many files at once. \nYour system could become unstable and may stop responding.\n\nDo you still want to proceed opening ";
			this.FilesQuestion = " files?";
			this.SystemWarning = "System Warning";
			this.MultipleItemsSelected = " items selected.";
			
			this.OpenThisFile			= "Open this file";
			this.RenameThisFile			= "Rename this file";
			this.MoveThisFile			= "Move this file";
			this.CopyThisFile			= "Copy this file";
			this.DeleteThisFile			= "Delete this file";
			this.EmailThisFile			= "Email this file";
			
			this.OpenThisFolder			= "Open this folder";
			this.RenameThisFolder		= "Rename this folder";
			this.MoveThisFolder			= "Move this folder";
			this.CopyThisFolder			= "Copy this folder";
			this.DeleteThisFolder		= "Delete this folder";
			this.EmailThisFolder		= "Email this folder's files";

			this.OpenTheseItems			= "Open these items";
			this.RenameTheseItems		= "Rename these items";
			this.MoveTheseItems			= "Move these items";
			this.CopyTheseItems			= "Copy these items";
			this.DeleteTheseItems		= "Delete these items";
			this.EmailTheseItems		= "Email these items";
			
			this.NewTextDocument		= "New Text Document.txt";
			
			this.ShortcutOnDesktop			= "The new shortcut is placed on the Desktop.";
			this.ShortcutsOnDesktop			= "The new shortcuts are placed on the Desktop.";
			this.CouldNotCreateShortcut		= "Could not create shortcut(s).";
			this.AreYouSurePDelete			= "Are you sure you want to permanently delete ";
			this.AreYouSureMultiPDelete		= "Are you sure you want to permanently delete these ";
			this.QuestionMark				= "?";
			this.DeleteItems				= " items"
			this.ConfirmMultiFilePDelete	= "Confirm Multiple File Delete (Permanent)";
			this.ConfirmFilePDelete			= "Confirm File Delete (Permanent)";
			this.RecycleBinIsEmptyWhetherOpen	= "The Recycle Bin is already empty. Do you want to open it instead?";
			this.RecycleBinIsEmpty			= "The Recycle Bin is already empty.";
			this.OpenRecycleBin				= "Open Recycle Bin?"
			
			this.Preview98					= "<object id=\"Preview\" style=\"display:none;width:150;height:150;\" classid=\"clsid:1D2B4F40-1F10-11D1-9E88-00C04FDCAB92\"></object>";
			this.PreviewMe					= "<object id=\"Preview\" style=\"display:none;width:150;height:150;\" classid=\"clsid:50F16B26-467E-11D1-8271-00C04FC3183B\"></object>";
			
		}
		// SHImageCache -- Stores and caches images.
		function SHImageCache()
		{
			this.FolderIco				= envar.OpicoDir + "\\folderico.gif";
			this.HardDriveIco			= envar.OpicoDir + "\\harddriveico.gif";
			this.FloppyDriveIco			= envar.OpicoDir + "\\floppydriveico.gif";
			this.CDDriveIco				= envar.OpicoDir + "\\cddriveico.gif";

			this.MyComputerIco			= envar.OpicoDir + "\\mycompico.gif";
			this.MyDocumentsIco			= envar.OpicoDir + "\\mydocsico.gif";
			this.MyMusicIco				= envar.OpicoDir + "\\mymusicico.gif";
			this.MyPicturesIco			= envar.OpicoDir + "\\mypicturesico.gif";
			this.MyVideosIco			= envar.OpicoDir + "\\myvideosico.gif";

			this.DesktopIco				= envar.OpicoDir + "\\desktopico.gif";
			this.ControlPanelIco		= envar.OpicoDir + "\\cpico.gif";
			this.PrintersIco			= envar.OpicoDir + "\\printersico.gif";
			this.RecycleBinIco			= envar.OpicoDir + "\\binico.gif";
			this.MyNetworkPlacesIco		= envar.OpicoDir + "\\mynetplacesico.gif";
			this.DialUpNetworkingIco	= envar.OpicoDir + "\\dunico.gif";
			
			this.ToolBack				= envar.ToolbarDir + "toolback.gif";
		}