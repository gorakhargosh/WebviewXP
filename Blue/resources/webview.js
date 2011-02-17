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
document.body.onload = Main;
document.body.oncontextmenu= new Function("return false");
var g_dirtype = "";

// Executes as soon as the body loads.
function Main()
{
	Toolbar.style.visibility = "visible";
	FixSizeProc();
	window.onresize = FixSizeProc;
	setTimeout("SetTaskPanesProc( true );", 0);
	SetUOLLink();
	try{
		// Fire selectionchanged if items are selected at load.
		if(FileList.SelectedItems().Count > 0){
			setTimeout('SelChanged();', 0);
		} 
		PanelContent.style.pixelHeight = TaskBox3.offsetTop + TaskBox3.offsetHeight;
		setTimeout('SanitizeScrollbars();', 0);
	} catch ( e ){
		JSLibrary.FlashMessage( e.description );
	}
	LoadSettings();
	Toolbar.style.visibility = "visible";
	ShowDefaultInfo();
}
// Load some of the  settings specified in the Webview Setup.
function LoadSettings()
{
	if(foldertype.IsMyComputerFolder == false && viewoptions.EnableWinamp2 == false){
		ToolWinamp2.style.display = "none";
	}
	if(g_dirtype == "Pictures Folder")
	{
		viewoptions.ImagePreviewSize = constant.ImageSizeMAX;
	}
	if(foldertype.IsMyComputerFolder == false && viewoptions.ImagePreviewSize <= constant.ImageSizeMAX && viewoptions.ImagePreviewSize >= constant.ImageSizeMIN){
		Preview98.style.pixelHeight = viewoptions.ImagePreviewSize;
		Preview98.style.pixelWidth = viewoptions.ImagePreviewSize;
		//PreviewMe.style.pixelHeight = viewoptions.ImagePreviewSize;
		//PreviewMe.style.pixelWidth = viewoptions.ImagePreviewSize;
	}
	if(foldertype.IsMyComputerFolder == false && env.IsOSWindows98 == true)
	{
		ToolSlideShow.style.display = "none";
	}
}
// Determine and set the op-one-level link in Other Places.
function SetUOLLink()
{
	if(ns.MyComputer.Title == envar.ThisDirName )
	{
		UpOneLevelText.innerHTML = "Desktop";
		task_UpOneLevel.href = "javascript:oWSHShell.SendKeys('%{F4}');oShell.Open(constant.ssfDESKTOP);";
		UpOneLevelIco.src = imgcache.DesktopIco;
	} 
	else 
	{
		// 18 refers to the number of letters to be displayed.
		UpOneLevelText.innerHTML = envar.ParentFolderTitle.substring(0, 18);
		if( envar.ParentFolderTitle == ns.MyComputer.Title)
		{
			task_UpOneLevel.href = clsid.MyComputer;
			UpOneLevelIco.src = imgcache.MyComputerIco;
		} else if( parenttype.IsMyDocumentsFolder == true )
		{
			task_UpOneLevel.href = clsid.MyDocuments;
			UpOneLevelIco.src = imgcache.MyDocumentsIco;
		} else if( parenttype.IsFixedDrive == true )
		{
			task_UpOneLevel.href = envar.ThisDirPath.substring( 0, envar.ThisDirPath.indexOf("\\") );
			UpOneLevelIco.src = imgcache.HardDriveIco;
		} else if( parenttype.IsCDDrive == true)
		{
			task_UpOneLevel.href = envar.ThisDirPath.substring( 0, envar.ThisDirPath.indexOf("\\") );
			UpOneLevelIco.src = imgcache.CDDriveIco;
		} else if( parenttype.IsFloppyDrive == true)
		{
			task_UpOneLevel.href = envar.ThisDirPath.substring( 0, envar.ThisDirPath.indexOf("\\") );
			UpOneLevelIco.src = imgcache.FloppyDriveIco;
		}else if( parenttype.IsWindowsFolder == true )
		{
			task_UpOneLevel.href = envar.WindowsDir;
		} else 
		{
			task_UpOneLevel.href = envar.ThisDirPath.replace(envar.ThisDirName, "");
		}
	}
}
////////////////////////////////////////////////////////////////////////////////////////
// FILE EXTENSIONS AND TYPES
function GetFileExtension			( fileNameSpec )  {		var fileExtension = fileNameSpec.substring(fileNameSpec.lastIndexOf(".") + 1, fileNameSpec.length);  return  fileExtension .toLowerCase();  }
function GetFileExtensionLength		( fileNameSpec )  {		var fileExtension = GetFileExtension(fileNameSpec); return fileExtension.length; }
function IsTypeVideo				( fileExtension ) {     var types = ",asf,asx,avi,dat,m1v,mov,mp2,mpa,mpe,mpeg,mpg,mpv2,qt,wmv,rm,"; var temp = ","+ fileExtension +","; return types.indexOf(temp) > -1; 	}
function IsTypeAudio				( fileExtension ) { 	var types = ",aif,aiff,ape,asx,au,mid,midi,m3u,mp3,ogg,ra,rmi,snd,wav,wma,pcm,wm,wmp,wmx,"; var temp = ","+ fileExtension +","; return types.indexOf(temp) > -1;  	}
function IsTypeAudioVideo			( fileExtension ) {		var types = ",asf,asx,avi,m1v,mov,mp2,mpa,mpe,mpeg,mpg,mpv2,qt,wmv,aif,aiff,au,mid,midi,m3u,mp3,ra,ram,rm,rmi,snd,wav,wma,pcm,wm,wmp,wmx,"; var temp = ","+ fileExtension +","; return types.indexOf(temp) > -1; 	}
function IsTypeImage				( fileExtension ) { 	var types = ",art,awd,bmp,dcx,dib,gif,ico,jfif,jpg,jpeg,jpe,mac,pct,pcx,pic,pict,png,pntg,psd,qti,qtif,svg,tif,tiff,wif,xbm,xif,"; var temp = ","+ fileExtension +","; return types.indexOf(temp) > -1; 	}
function IsTypeWebDoc				( fileExtension ) { 	var types = ",alx,asp,css,fla,hta,htc,htm,html,htt,htx,mshtml,mhtml,mht,jar,plg,sct,shtm,shtml,spa,stm,swf,xml,xsl"; var temp = ","+ fileExtension +","; return types.indexOf(temp) > -1; 	}
function IsTypeOfficeDoc			( fileExtension ) { 	var types = ",doc,dochtml,docmhtml,dot,dothtml,exc,fphtml,fpweb,mdb,mix,obd,obt,pdf,pot,pothtml,pps,ppt,ppthtml,pptmhtml,ppz,pub,rtf,txt,xls,"; var temp = ","+ fileExtension +","; return types.indexOf(temp) > -1; 	}
function IsTypeProgram				( fileExtension ) { 	var types = ",bat,com,class,dll,exe,js,jse,ls,mocha,msi,ocx,pe,pl,ps,rc,vbe,vbs,wsc,wsh,"; var temp = ","+ fileExtension +","; return types.indexOf(temp) > -1; 	}
function IsTypeSourceCode			( fileExtension ) {		var types = ",alx,asm,asp,c,cc,cpp,css,cxx,dsm,frm,frt,frx,fxp,h,hpp,hta,htc,htm,html,htt,htx,hxx,java,js,jsl,php,php3,phtml,pl,res,rc,rct,sql,ssq,shtml,stm,tsq,tli,tlh,vb,vbs,wsc,wsh,xml,xsl,"; var temp = ","+ fileExtension +","; return types.indexOf(temp) > -1; 	}
function IsTypeCompressed			( fileExtension ) { 	var types = ",arc,arj,b64,bhx,cab,gz,hqx,lzh,mim,tar,taz,tgz,tz,uu,uue,xxe,z,zip,rar,sit,"; var temp = ","+ fileExtension +","; return types.indexOf(temp) > -1; 	}
function IsTypeSAWZipCompressed		( fileExtension ) {		var types = ",jar,zip,"; var temp = ","+ fileExtension +","; return types.indexOf(temp) > -1; 	}
function IsTypeFont					( fileExtension ) { 	var types = ",fon,ttf,"; var temp = ","+ fileExtension +","; return types.indexOf(temp) > -1; 	}
function IsTypeTheme				( fileExtension ) { 	var types = ",theme,wmz,wsz,"; var temp = ","+ fileExtension +","; return types.indexOf(temp) > -1; 	}
function IsTypeSystem				( fileExtension ) { 	var types = ",bat,bin,cab,cfg,com,cpl,crl,dll,dos,drv,dat,db,exe,fixed,fon,htt,inf,ini,ocx,prv,sys,ttf,vxd,win,"; var temp = ","+ fileExtension +","; return types.indexOf(temp) > -1; 	}
function IsTypeWMPlayer				( fileExtension ) {		var types = ",aif,aifc,aiff,asf,asx,avi,au,cda,dat,ivf,m1v,m3u,mid,midi,mp2,mp3,mp2v,mpa,mpe,mpeg,mpg,mpv2,rmi,snd,wav,wax,wm,wma,wmv,wmx,wvx,wmp,"; var temp = ","+ fileExtension +","; return types.indexOf(temp) > -1; 	}
function IsTypeWinamp				( fileExtension ) {		var types = ",669,ogg,cda,wav,voc,au,snd,aif,aiff,m3u,mp3,pls,mp2,mp1,wma,mid,midi,rmi,kar,miz,mod,mdz,stm,stz,s3m,s3z,it,itz,xm,xmz,mtm,ult,"; var temp = ","+ fileExtension +","; return types.indexOf(temp) > -1; 	}
function IsTypePreview98			( fileExtension ) {		var types = ",gif,ico,max,nws,eml,tga,pct,pcd,dfx,drw,cgm,cdr,mpp,fpx,mix,mic,obt,obd,xml,mht,mhtml,html,htm,DOT,URL,dib,art,emf,wmf,png,jfif,jpe,jpg,jpeg,xif,wpg,pcx,bmp,doc,lnk,eps,tif,tiff,"; var temp = ","+ fileExtension +","; return types.indexOf(temp) > -1; 	}

////////////////////////////////////////////////////////////////////////////////////////		
// DETAILS
// Shows the default information about a folder.
function ShowDefaultInfo() 
{
/*	var dirname = envar.ThisDirName;
	if(dirname.length > constant.ItemNameMAX )
		dirname = envar.ThisDirName.substring(0, constant.ItemNameMAX - 3).Trim() + text.More;
*/
	// Name handling.
	var dirname = "";
	var name = envar.ThisDirName;
	if( name.length > constant.ItemNameMAX ) {
		var nTimes = Math.ceil(name.length / constant.ItemNameMAX);
		for(i = 0; i < nTimes; i++)
		{
			if(i > 0){
				dirname += "<br>";
			}
			dirname += name.substring(i * (constant.ItemNameMAX), (i+1) * (constant.ItemNameMAX));
		}
	} else {
		dirname = name;
	}
	
	if(g_dirtype == ""){
		if( ns.MyComputer.Title == envar.ThisDirName || foldertype.IsSystemFolder == true )
		{
			g_dirtype = text.SystemFolder;
		} else if(foldertype.IsDrive == true)
		{
			g_dirtype = ns.MyComputer.GetDetailsOf(ns.MyComputer.ParseName(envar.ThisDirPath), constant.GetSize);
		} else {	
			if(viewoptions.EnableFolderMediaTypeCheck == true){
				g_dirtype = HandleFolderMediaType( envar.ThisDirPath, 200 );
			} else {
				g_dirtype = ns.ThisDirPath.ParentFolder.GetDetailsOf(ns.ThisDirPath.ParentFolder.ParseName(envar.ThisDirName), constant.GetType);
			}
		}
	}
	
	// File system, free space, total size, and label for current drive.
	if(foldertype.IsDrive){
		var currDrive = oFSO.GetDrive(envar.ThisDirPath);
		ItemFileSystem.innerHTML = "File System:&nbsp;" + currDrive.FileSystem;
		ItemFreeSpace.innerHTML = "Free Space:&nbsp;" + JSLibrary.Math.ConvertSize(currDrive.FreeSpace);
		ItemTotalSize.innerHTML = "Total Size:&nbsp;" + JSLibrary.Math.ConvertSize(currDrive.TotalSize);
		ItemVolumeLabel.innerHTML = "Label:&nbsp;" + currDrive.VolumeName;
		JSLibrary.Show( new Array(ItemFileSystem, ItemFreeSpace, ItemTotalSize, ItemVolumeLabel) );
		if(currDrive.VolumeName.Trim() == ""){
			ItemVolumeLabel.style.display = "none";
		}
	} else {
		JSLibrary.Hide( new Array(ItemFileSystem, ItemFreeSpace, ItemTotalSize, ItemVolumeLabel));
	}
	
	// Folder Size
	/*if(viewoptions.EnableFolderSize == true && foldertype.IsMyComputerFolder == false && foldertype.IsDrive == false)
	{
		if(!foldertype.IsSystemFolder){
			HandleSize( oFSO.GetFolder(envar.ThisDirPath) );
		}
	}*/
	
	//Details information.
	ItemName.innerHTML = dirname;
	if(g_dirtype != ""){
		ItemType.innerHTML = g_dirtype;
		ItemType.style.display = "";
	}

	ItemList.innerHTML = "";
	ItemFileVersion.innerHTML = "";

	JSLibrary.Hide( new Array(ItemSize, ItemAttributes, ItemPreview, ItemFolderContents, ItemImageDimensions, ItemMediaDuration, ItemMediaTitle, ItemMediaArtist, ItemMediaAlbum, ItemTips, ItemList, ItemDateModified, ItemFileVersion, ItemZipComment, ItemZipCount));
}
		
// Shows the name of the selected item.	
function HandleName( item, __changeNameInfo ) {
	var name;
	ItemName.innerHTML = "";
	
	try {	
		name = item.Name;
	} catch( e ) {
		name = FileList.Folder.GetDetailsOf(item, constant.GetName);
	}
	
	if( __changeNameInfo ) {
		if( name.length > constant.ItemNameMAX ) { // && name.indexOf(" ") < 0){// name.substring(0, constant.ItemNameMAX - 3).Trim().indexOf(" ") < 0) {
			var nTimes = Math.ceil(name.length / constant.ItemNameMAX);
			for(i = 0; i < nTimes; i++)
			{
				if(i > 0){
					ItemName.innerHTML += "<br>";
				}
				ItemName.innerHTML += name.substring(i * (constant.ItemNameMAX), (i+1) * (constant.ItemNameMAX));
			}
		} else {
			ItemName.innerHTML = /*"<div style=\"width:150px;\">" +*/ name; // + "</div>";
		}
	}
	return name;
}
		
// Shows the size of the selected item.	
function HandleSize( item ) {
	// FIXED BUGBUG -- Shows illegal non-FSO KB size for Compact Disc Folders.
	// FIXED BUGBUG -- Comma formatting for bytes sizes between 999 and 1025.
	
	var sizeInBytes;
	sizeInBytes = item.Size;
		
	// Get a folder's size if it is not a blocked (incl. common system folders) folder.
	// The predefined blocked folders tend to be pretty large.			
	if(viewoptions.EnableFolderSize == true) {
		if( item.IsFolder && item.Name != "Windows" && item.Name != "Program Files" && item.Name != "System Volume Information" && item.Name != "System" && item.Name != "System32" && item.Name != "Microsoft Office" && item.Name != "Microsoft Visual Studio" && item.Name != "Microsoft Visual Studio .NET" && item.Name != "_Restore" && item.Name != "Documents and Settings" && item.Name != "My Documents" && item.Name != "Desktop" && item.Name != "Common Files" && envar.ThisDirName != "Documents and Settings") {
			sizeInBytes = oFSO.GetFolder(item.Path).Size;
		}
	} else if(viewoptions.EnableFolderSize == false) {
		// Fix below for illegal folder size BUGBUG -- set to 0 so no display.
		if(item.IsFolder && currdrivetype.IsCDDrive == true) {
			sizeInBytes = 0;
		}
	}

	// Convert the size to nearest unit.
	if(sizeInBytes) {
		var size = JSLibrary.Math.ConvertSize( sizeInBytes );
	}
	
	// Comma formatting for bytes size between 999 and 1025.
	if(size && parseInt(size) > 999 && parseInt(size) <= 1024) {
		size = JSLibrary.Format.FormatNumber( size ) + size.substring(size.indexOf("&nbsp;"), size.length);
	}
	
	// Display the size if it is not 0 bytes.
	if( size && size.indexOf("0") != 0) {
		ItemSize.style.display = "";
		ItemSize.innerHTML = "Size:&nbsp;" + size;
		if( viewoptions.EnableSizeInBytes == true && size.indexOf( text.Bytes ) < 0 ) {
			ItemSize.innerHTML += " (" + JSLibrary.Format.FormatNumber( sizeInBytes ) + text.Bytes + ")";
		}
		return size;
	} else {
		ItemSize.innerHTML = "";
		ItemSize.style.display = "none";
		return false;
	}
}

//	Display the file system, free space, total size, and label of selected drive.
function HandleDriveInformation( item )
{
	if(foldertype.IsMyComputerFolder == true) {
		if(item.Name.indexOf(":)") >= 0) {
			var selDrive = oFSO.GetDrive(item.Path);
			if(selDrive.IsReady == true) {
				ItemFileSystem.innerHTML = "File System:&nbsp;" + selDrive.FileSystem;
				ItemFreeSpace.innerHTML = "Free Space:&nbsp;" + JSLibrary.Math.ConvertSize(selDrive.FreeSpace);
				ItemTotalSize.innerHTML = "Total Size:&nbsp;" + JSLibrary.Math.ConvertSize(selDrive.TotalSize);
				ItemVolumeLabel.innerHTML = "Label:&nbsp;" + selDrive.VolumeName;
				JSLibrary.Show( new Array(ItemFileSystem, ItemFreeSpace, ItemTotalSize, ItemVolumeLabel));
				if(selDrive.VolumeName.Trim() == "") {
					ItemVolumeLabel.style.display = "none";
				}
			} else {
				JSLibrary.Hide( new Array(ItemFileSystem, ItemFreeSpace, ItemTotalSize, ItemVolumeLabel));
			}
			return true;
		} else {
			return false;
		}
	}
}

// Shows the type of the selected item.
function HandleType( item, __changeTypeInfo )
{
	var type, itemname = item.Name, itempath = item.Path;
	
	// Display either System Folder or the type of drive.
	if(foldertype.IsMyComputerFolder)
	{
		if( itemname.indexOf(":)") >= 0 ) {
			type = FileList.Folder.GetDetailsOf(item, constant.GetSize);
		} else {
			type = text.SystemFolder;
		}
	
	// Display Compressed (zipped) Folder
	} else if ( env.IsOSWindows98 == true && GetFileExtension( itemname ) == "zip" ){
		type = "Compressed (zipped) Folder";

	// Display System Folder for system folders
	} else if( (itemname == text.MyDocuments && ns.MyDocuments.ParentFolder.ParseName( text.MyDocuments ).Path.indexOf(envar.ThisDirPath) == 0) || 
				(itemname == text.ProgramFiles && envar.ThisDirPath.indexOf(":\\" + text.ProgramFiles)) || 
				(itemname == text.Windows && envar.ThisDirPath.indexOf(":\\" + text.Windows)) ||
				(itemname == text.SystemVolumeInformation && envar.ThisDirPath.indexOf(":\\" + text.SystemVolumeInformation)) || 
				(itemname == text.DocumentsAndSettings && envar.ThisDirPath.indexOf(":\\" + text.DocumentsAndSettings)) ) {
		type = text.SystemFolder;
	
	// Display plain item type or System Folder for Recycle Bin
	} else {
		try {
			type = item.Type;
		} catch( e ) {
			type = FileList.Folder.GetDetailsOf( item, constant.GetType );
		}
		if( (itemname == "Recycled" || itemname == text.RecycleBin) && type == text.RecycleBin) {
			type = text.SystemFolder;
		}
		if(item.IsFolder == true && viewoptions.EnableFolderMediaTypeCheck == true){
			type = HandleFolderMediaType( itempath, 200 );
		}
	}
	
	// If function should display the information and return then display and return.
	if( __changeTypeInfo )
	{
		ItemType.style.display = "";
		ItemType.innerHTML = type;
	}
	
	return type;
}

// Shows the attributes of the selected item.		
function HandleAttributes( item )
{
	var fileExtension = GetFileExtension( item.Name );
	var s = "", code;
	if( viewoptions.EnableItemAttributes == true ) {
		
		// attribsIndex Usually the 4th, however, scan all 10 columns, if ShowAttribCol is enabled.
		for(attribsIndex = 4; attribsIndex < 10; attribsIndex++)
		{
			attribsTitle = FileList.Folder.GetDetailsOf(null, attribsIndex);
			
			// Quit if the column doesn't have a name, because going any further is worthless.
			if(!attribsTitle){
				break;
			}
					
			// attribsData contains one or more characters from AttributeCodes (for example, HA for hidden and Archive).	
			attribsData = FileList.Folder.GetDetailsOf(item, attribsIndex);		
			
			// if the columns name name is Attributes proceed.
			if(attribsTitle == text.Attributes)
			{
				for(i = 0; i < text.AttributeCodes.length; i++)
				{
					code = text.AttributeCodes.charAt(i);
					if(attribsData.indexOf(code) > -1)
					{
						// Add a comma and a non-breaking space for every "" (i.e., every new letter of code present in attribsData).
						if(s)
							s += ",&nbsp;";
						
						// If index = 0, then R, 1 => H, 2 => S, 3 => a, 
						if(i == 0)
							s += text.ReadOnly;
						else if(i == 1)
							s += text.Hidden;
						else if(i == 2)
							s += text.System;
						else if(i == 3)
							s += text.Archive;
						else if(i == 4)
							s += text.Compressed;
						else if(i == 5)
							s += text.Encrypted;
					}
					
					// Show attributes only if they exist.
					if(s) {
						ItemAttributes.style.display = "";
						ItemAttributes.innerHTML = attribsTitle + ":&nbsp;" + s;
					} else {
						ItemAttributes.innerHTML = "";
						ItemAttributes.style.display = "none";
					}
				}
			} else {
				ItemAttributes.innerHTML = "";
				ItemAttributes.style.display = "none";
			}
		}	
	} 
}


// Shows the contents of the selected folder.	
function HandleFolderContents( item, fiUBound )
{
	if( item.IsFolder == true ) {
	
		var selFolder = oShell.NameSpace(item.Path);		// Get the folder object.
		var fiCount = selFolder.Items().Count;				
		var fiColl = new Enumerator(selFolder.Items());
		var fiList = "<br>";
		var fldrItem, fiName;
		var fileExtension = GetFileExtension( item.Path );		
		
		// If folder count limit is not spec'd then use default.
		if( !fiUBound ) { 
			fiUBound = 300;
		}
		
		// Count and display the number of items.
		ItemFolderContents.style.display = "";
		if(fileExtension != "zip"){
			if(viewoptions.EnableFSOFolderCount == true){
				var oFSOFolder = oFSO.GetFolder(item.Path);		// The FSO folder object.
				var fiFilesCount = oFSOFolder.Files.Count;
				var fiSubFoldersCount = oFSOFolder.SubFolders.Count;
				fiCount = fiFilesCount + fiSubFoldersCount ; //selFolder.Items().Count;
				var fiHiddenCount = fiCount - selFolder.Items().Count;
				
				if(viewoptions.EnableFolderContents == true || viewoptions.EnableAttributes == true)
				{
					ItemFolderContents.innerHTML = "<div style='padding-bottom: 7px;'>Items: <b>" + fiCount + "</b> <span style=\"font-size:7pt;\">(" + fiSubFoldersCount + " folders, " + fiFilesCount + " files, " + fiHiddenCount + " hidden)</span></div>";
				} else {
					ItemFolderContents.innerHTML = "<div>Items: <b>" + fiCount + "</b> <span style=\"font-size:7pt;\">(" + fiSubFoldersCount + " folders, " + fiFilesCount + " files, " + fiHiddenCount + " hidden)</span></div>";
				}
			}else {
				if(viewoptions.EnableFolderContents == true || viewoptions.EnableAttributes == true)
				{
					
					ItemFolderContents.innerHTML = "<div style='padding-bottom: 7px;' title=" + tooltip.NormalItemsInFolder + ">Normal Items in Folder: <strong>" + fiCount + "</strong></div>";
				} else {
					ItemFolderContents.innerHTML = "<div title=" + tooltip.NormalItemsInFolder + ">Normal Items in Folder: <strong>" + fiCount +"</strong></div>";
				}
			}
		}
		
		// Display the folders contents
		if(viewoptions.EnableFolderContents == true && (fiHiddenCount != fiCount) ) {
			if(fiCount <= fiUBound && fiCount > 0){
				for(fiNum = 1; fiNum == fiCount, !fiColl.atEnd(); fiColl.moveNext(), ++fiNum){
					fldrItem = fiColl.item();
					fiName = fldrItem.Name;
					
					if(fiNum <= constant.FolderItemListMAX) {
						if(fiName.length > constant.FolderItemNameMAX) {
							fiNameTruncated = fiName.substring(0, constant.FolderItemNameMAX - 3).Trim() + text.More;
							fiName = fiNameTruncated;
						} else fiName = fiName;
						fiList += '<span style=\"padding-left: 0px;font-size:7pt;\"><b style=\"color: rgb(127, 157, 185);\">';
						fiList += fiNum;
						fiList += '</b>';
						if(fiNum >= 10) {
							fiList += "&nbsp;&nbsp;&nbsp;";
						} else {
							fiList += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
						}
						if(constant.FolderItemListMAX != fiCount && fiNum == constant.FolderItemListMAX) {
							fiList += fiName;
							//fiList += " <b style=\"color: red;\" onclick=\"DoItemTask('open');\">" + text.More + "</b>";
							fiList +="</small>";
						} else {
							fiList += fiName + "</span>";
						}
						if(fiCount != 1) {
							fiList += "<br>";
						}
					}
				}
				ItemFolderContents.innerHTML += "Contents:" + fiList;
			} else {
				ItemFolderContents.style.display = "none";
			}
		}
	} else {
		ItemFolderContents.style.display = "none";
	}
}
// Shows the modification date of the selected item.
function HandleDateModified( item )
{
	try {
		var fileExtension = GetFileExtension(item.Path);
		
		// Don't show modification dates for folders and wmp movie files.
		if(item.IsFolder == false && (IsTypeWMPlayer(fileExtension) == false && IsTypeVideo(fileExtension) == false) ) {
			
			// Show the easy-read format date if allowed
			if(viewoptions.EnableFSODateModified == true ) {
				var oFSODateModified = oFSOItem.DateLastModified;
				var oDateMod = new Date(Date.parse(oFSODateModified));
				ItemDateModified.innerHTML = "Date Modified:&nbsp;" + oDateMod.toLocaleDateString() + " " + oDateMod.toLocaleTimeString();
				ItemDateModified.style.display = "";
			
			// Show the direct date if easy-read date is not allowed.
			} else {
				var DateModified = FileList.Folder.GetDetailsOf(item, constant.GetDateModified);
				ItemDateModified.innerHTML = "Date Modified:&nbsp;" + DateModified;
				ItemDateModified.style.display = "";
			}
		} else {
			ItemDateModified.innerHTML = "";
			ItemDateModified.style.display = "none";
		}
	} catch( e ){}
}
		
//Shows the file version of the selected prpgram.
function HandleFileVersion( item )
{
	try
	{
		// Display a program file's version information if allowed.
		if(viewoptions.EnableFSOFileVersion == true) {
			var fileExtension = GetFileExtension( item.Path );
			if(IsTypeProgram(fileExtension) == true) {
				var fileVersion = oFSO.GetFileVersion(item.Path);
				if(fileVersion.Trim() != ""){
					ItemFileVersion.style.display="";
					ItemFileVersion.innerHTML = "Version: " + fileVersion;
				} else {
					ItemFileVersion.innerHTML = "";
					ItemFileVersion.style.display="none";
				}
			} else {
				ItemFileVersion.innerHTML = "";
				ItemFileVersion.style.display = "none";
			}
		}
	} catch( e ){}
}

// Execute when no item is selected.
function NoneSelected()
{ 		// NOTHING IS SELECTED

	// Stop and reset the media player
	ArrestWMPlayer6();
	
	// Set the default information in the Details pane.
	ShowDefaultInfo();
	
	// Disable the preview.
	if(!env.IsOSWindows98){
		PreviewMe.Show( false );
		PreviewMe.style.display = "none";
	} else {
		Preview98.style.display = "none";
	}
}

// Execute when many items are selected.
function ManySelected() 
{
	// Stop and reset the media player
	ArrestWMPlayer6();
	
	// Set elems to be hidden and those to be displayed.
	ItemList.innerHTML = "";
	ItemList.style.display = "";

	JSLibrary.Hide( new Array(ItemType, ItemSize, ItemPreview, ItemFolderContents, ItemImageDimensions, ItemMediaDuration, ItemMediaTitle, ItemMediaArtist, ItemMediaAlbum, ItemTips, ItemFileVersion, ItemAttributes, ItemDateModified, ItemFileSystem, ItemFreeSpace, ItemTotalSize, ItemVolumeLabel, ItemZipComment, ItemZipCount));
	
	var byteSize;
	try{
		
		// Get folder sizes if allowed, otherwise if not allowed set to 0
		if(FileList.SelectedItems().Item(0).IsFolder == true)
		{
			if(viewoptions.EnableFolderSize == true){
				byteSize = oFSO.GetFolder(FileList.SelectedItems().Item(0).Path).Size;
			} else { 
				byteSize = 0; 
			}
		} else if(FileList.SelectedItems().Item(0).IsFolder == false){
			byteSize = FileList.SelectedItems().Item(0).Size;
		}
	} catch ( e ){};
	
	// Show the number of items selected.
	ItemName.innerHTML = selectedItemsCount + text.MultipleItemsSelected;
	
	// Total size and items
	try{
		// Show total size for only 99 or less items.
		if (selectedItemsCount <= 100 && selectedItemsCount > 1) {
			for (i = 1; i < selectedItemsCount; i++){
			
				// Get folder sizes if allowed.
				if(viewoptions.EnableFolderSize == true && FileList.SelectedItems().Item(i).IsFolder == true)
				{
					byteSize += oFSO.GetFolder(FileList.SelectedItems().Item(i).Path).Size;
				} else
				{
					byteSize += FileList.SelectedItems().Item(i).Size;
				}
			}
			
			// Show the total size if folder sizes are allowed, otherwise show total files size.
			if (byteSize)
			{
				if(viewoptions.EnableFolderSize == true){
					ItemList.innerHTML += text.TotalItemsSize + JSLibrary.Math.ConvertSize(byteSize) + " (" + FormatNumber(byteSize.toString()) + text.Bytes + ")";
				} else {
					ItemList.innerHTML += text.TotalFilesSize + JSLibrary.Math.ConvertSize(byteSize) + " (" + FormatNumber(byteSize.toString()) + text.Bytes + ")";
				}
			}
			
			// Show at least 4 selected items.
			if (selectedItemsCount <= constant.FolderItemListMAX){
				if(byteSize)							ItemList.innerHTML +=  "<br><br>";
				
				for (i = 0, j = selectedItemsCount; i < selectedItemsCount; i++, --j){
					//VARIABLE j SHOWS THE ORDER IN WHICH ITEMS ARE SELECTED.
					var name = FileList.SelectedItems().Item(i).Name;
					ItemList.innerHTML += "<small style='font-size:7pt;'><b style='color: rgb(127, 157, 185);'>"+ j; 
					if (j < 10)							ItemList.innerHTML += "</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
					else								ItemList.innerHTML += "</b>&nbsp;&nbsp;&nbsp;";
					
					if(name.length > constant.ItemNameMAX){ 			
						truncatedName = name.substring(0, constant.ItemNameMAX - 3).Trim() + text.More;	
						ItemList.innerHTML += truncatedName + "</small><br>";
					} else {	ItemList.innerHTML += name + "</small><br>";	}
				}
			}
		}
	} catch( e ){};
/*	if(!env.IsOSWindows98){
		PreviewMe.Show( FileList.SelectedItems() );
	} */
	FileList.focus();
}
		

//Handles display of FAFT contextual to selection.
function HandleFAFTContent()
{
	if(FileList.SelectedItems().Count == 0){
		TaskContainer1a.style.display = "none";
		TaskContainer1b.style.display = "";
	} else if(FileList.SelectedItems().Count == 1){
		if( (foldertype.IsMyComputerFolder == true && FileList.SelectedItems().Item(0).Name.indexOf(":)") >= 0) || foldertype.IsMyComputerFolder == false)
		{
			if(foldertype.IsMyComputerFolder == true && oFSO.GetDrive(FileList.SelectedItems().Item(0).Path).DriveType == constant.dtCDDrive)
			{
				BlockEjectCD.style.display = "";
				BlockCleanupDrive.style.display = "none";
			} else if(foldertype.IsMyComputerFolder == true){
				BlockEjectCD.style.display = "none";
				BlockCleanupDrive.style.display = "";
			}
			TaskContainer1a.style.display = "";
			TaskContainer1b.style.display = "none";
		} else
		{
			TaskContainer1a.style.display = "none";
			TaskContainer1b.style.display = "";	
		}
	} else if(FileList.SelectedItems().Count > 0){
		if(foldertype.IsMyComputerFolder == true)
		{
			TaskContainer1a.style.display = "none";
			TaskContainer1b.style.display = "";	
			return;
		}	
		TaskContainer1a.style.display = "";
		TaskContainer1b.style.display = "none";
	}
}

// Show a preview of an image or video clip.
function HandlePreview( item )
{
	if(item.IsFolder == false && item.IsLink == false){
		var byteSize = item.Size;
		var fileExtension = GetFileExtension( item.Path );
			if(byteSize){
			if(viewoptions.EnableVideoPreview == true && IsTypeWMPlayer(fileExtension) == true && IsTypeVideo(fileExtension) == true ){
				// Open dat files only if on CD.
				if(fileExtension == "dat" && (!currdrivetype.IsCDDrive)){
				} else {
					ItemPreview.style.display = "";
					oWMPlayer6.style.display = "";
					oWMPlayer6.FileName = item.Path;
					Preview98.style.display = "none";
					//PreviewMe.style.display = "none";
				}
			} else if(IsTypePreview98( fileExtension ) && viewoptions.EnableImagePreview == true){
				ItemPreview.style.display = "none";
				oWMPlayer6.style.display = "none";
				if(env.IsOSWindows98 == true && byteSize < 10000000 ) {
					Preview98.displayFile( item.Path );
				} /*else {
					PreviewMe.Show( item );
				} */
			} else {
				ItemPreview.style.display = "none";
				oWMPlayer6.style.display = "none";
			}				
		} else {
			ItemPreview.style.display = "none";
			oWMPlayer6.style.display = "none";
		}
		FileList.focus();
	}
}

// Release media file from media player for other programs to have read/write permissions.
function ReleaseMediaFile()
{
	oWMPlayer6.FileName = "";
	oWMPlayer6.Cancel();
}

// Stop and unload file from WMPlayer6 Control when unnecessary. Also reset settings.
function ArrestWMPlayer6()
{
	with( oWMPlayer6 )
	{
		Stop();
		FileName = "";
		Cancel();
		ShowControls = false;
		AutoStart = false;
		AutoSize = false;
		AutoRewind = true;
		ShowPositionControls = false;
		ShowAudioControls = true;
		Volume = 0;
	}
}

// Show compressed folder information.
function HandleCompressedFolders( item )
{
	var fileExtension = GetFileExtension( item.Path );
	try	{
		// cab files not supported.
		if(viewoptions.EnableCompressedFolderInfo && IsTypeSAWZipCompressed(fileExtension) == true){
			var oZarch = new ActiveXObject( "SAWZip.Archive" );
			oZarch.Open( item.Path );
			if(oZarch.Files.Count > 0){
				ItemZipCount.style.display = "";
				ItemZipCount.innerHTML = "Items in Compressed Folder:&nbsp;<b>" + oZarch.Files.Count + "</b>";
			} else {
				ItemZipCount.style.display = "none";
			}
			oZarch.Close();
			oZarch = null;
		}
	} catch( e ){
		JSLibrary.FlashMessage( e.description );
	}
}
/***********************************************
 *HandleFolderMediaType()
 ***********************************************
 *Purpose:
 *	1.	Get's the media ratio and determines
 *		oFolder type.
 *Returns:
 *	1.	String folderType (Capitalized)
 *		* "Music Folder"
 *		* "Pictures Folder"
 *		* "Videos Folder"
 *		* "File Folder"
 *		* "Entertainment Folder"
 *		* "Multimedia Folder"
 *		* "Drive"
 ***********************************************/
 // Not production code, has to be revised and shortened.
function HandleFolderMediaType( sFolderSpec, oFolderItemsUBound )
{
	if(!sFolderSpec || sFolderSpec == null || sFolderSpec.Trim() == ""){
		return "File Folder";
	} else {
		if(oFSO.FolderExists(sFolderSpec) == true){
			oFolder = oFSO.GetFolder( sFolderSpec );
		} else {
			return false;
		}
	}
	var oFolderItemsCount = oFolder.Files.Count;          //Items().Count;
	
	if( !oFolderItemsUBound ) {
		oFolderItemsUBound = 200; 
	}
	
	if ( oFolder == ns.ThisDirPath && foldertype.IsDrive ){
		return "Drive";
	}
	
	if( oFolderItemsCount > 0 && oFolderItemsCount <= oFolderItemsUBound )
	{
		var oFolderItems = new Enumerator( oFolder.Files );
		var oFolderItem, oFolderItemPath;
		var audioCounter = 0, 
			videoCounter = 0,
			avCounter = 0, 
			imageCounter = 0, 
			normalCounter = 0,
			docCounter = 0,
			webDocCounter = 0,
			progCounter = 0,
			codeCounter = 0,
			mediaCounter,
			docCounter,
			itemCounter;
		var fileExtension, folderType;

		for( ; !oFolderItems.atEnd(); oFolderItems.moveNext() )
		{
			oFolderItem = oFolderItems.item();
			if(oFolderItem.IsFolder == true){
				continue;
			}

			// Don't change path to name, because when
			// file extensions are not shown extensions cannot be
			// extracted.
			oFolderItemPath = oFolderItem.Path;
			fileExtension = GetFileExtension( oFolderItemPath );

			if( IsTypeAudio( fileExtension ) == true )
			{
				audioCounter++;
			} else if( IsTypeVideo( fileExtension ) == true )
			{
				videoCounter++;
			} else if( IsTypeAudioVideo(fileExtension) == true)
			{
				avCounter++;
			} else if( IsTypeImage( fileExtension ) == true )
			{
				imageCounter++;
			} else if( IsTypeWebDoc(fileExtension) == true)
			{
				webDocCounter++;
			} else if( IsTypeOfficeDoc(fileExtension) == true)
			{
				docCounter++;
			} else if( IsTypeProgram(fileExtension) == true )
			{
				progCounter++;
			} else if( IsTypeSourceCode(fileExtension) == true )
			{
				codeCounter++;
			} else if( !IsTypeAudio( fileExtension ) && !IsTypeVideo( fileExtension ) && !IsTypeImage( fileExtension ) )
			{
				normalCounter++;
			}
		}
		mediaCounter = JSLibrary.Math.Max3( audioCounter, videoCounter, imageCounter );
		mediaCounter = JSLibrary.Math.Max2( avCounter, mediaCounter );
		docCounter = JSLibrary.Math.Max3( progCounter, docCounter, webDocCounter );
		docCounter = JSLibrary.Math.Max2( codeCounter, docCounter );
		itemCounter = JSLibrary.Math.Max2( docCounter, mediaCounter );
		itemCounter = JSLibrary.Math.Max2( itemCounter, normalCounter );

		switch( itemCounter )
		{
		case normalCounter:
			folderType = "File Folder";
			break;
		case avCounter:
			folderType = "Entertainment Folder";
			break;
		case audioCounter:
			if( audioCounter == videoCounter && videoCounter == imageCounter )
			{
				folderType = "Entertainment Folder";
			}
			else if(audioCounter == videoCounter)
			{
				folderType = "Multimedia Folder";	
			} else {
				folderType = "Music Folder";
			}
			break;
		case imageCounter:
			folderType = "Pictures Folder";
			break;
		case videoCounter:
			folderType = "Movies Folder";
			break;
		case webDocCounter:
			folderType = "Web Documents Folder";
			break;
		case progCounter:
			folderType = "Programs Folder";
			break;
		case codeCounter:
			folderType = "Source Code Folder";
			break;
		case docCounter:
			folderType = "Documents Folder";
			break;
		default:
			folderType = "File Folder";
			break;
		}
		return folderType;
	} else {
		return "File Folder";
	}
}
		
// Shows the information collected in Details.
function ShowInfo( item )
{
	/*if(oWMPlayer6.PlayState == constant.mpPlaying){
		// Trick to persist playstate for next selection and release 
		// but gens urs so commenting out.
		ReleaseMediaFile();
	}*/
	ArrestWMPlayer6();
	
	// empty itemlists and hide unrequired elems.
	ItemList.innerHTML = "";
	JSLibrary.Hide(new Array(ItemList, ItemFileSystem, ItemFreeSpace, ItemTotalSize, ItemVolumeLabel, ItemMediaDuration, ItemMediaTitle, ItemMediaArtist, ItemMediaAlbum, ItemZipComment, ItemZipCount, ItemPreview));

	try{
		if( foldertype.IsMyComputerFolder == false && (viewoptions.EnableFSOFileVersion == true || viewoptions.EnableFSODateModified == true )){
			if(item.IsFolder == true){	
				oFSOItem = oFSO.GetFolder(item.Path);
			} else {
				oFSOItem = oFSO.GetFile(item.Path);
			}
		}
		HandleName( item, true );
		HandleType( item, true );
		if(foldertype.IsMyComputerFolder == false){
			HandlePreview( item );
			HandleSize( item );
			HandleDateModified( item );
			HandleAttributes( item );
			// Commenting out because component causes explorer to crash
			// when the selected item is playing.
			//HandleID3Information( item );
			HandleFileVersion( item );
			HandleFolderContents( item, 300 );
			HandleCompressedFolders( item );
		} else if(foldertype.IsMyComputerFolder == true){
			HandleDriveInformation( item );
		}
	} catch( e ){
		try {
			ShowInfo( FileList.FocusedItem );
		} catch( e ){
			ShowInfo( FileList.SelectedItems().Item(0) );
		}
	}
}

// Show ID3 tag information about an mp3 file.		
/*function HandleID3Information( item )
{
	var fileExtension = GetFileExtension( item.Path );
	if(fileExtension == "mp3")
	{
		var oID3 = new ActiveXObject("Randem.ID3");
		var mediafile = oID3.Open(item.Path);
		if(oID3.Title.Trim() != "" )
		{
			ItemMediaTitle.innerHTML = "Title:&nbsp;" + oID3.Title;
			ItemMediaTitle.style.display = "";
		}
		if(oID3.Artist.Trim() != "")
		{
			ItemMediaArtist.innerHTML = "Artist:&nbsp;" + oID3.Artist;
			ItemMediaArtist.style.display = "";
		}
		if(oID3.Album.Trim() != "")
		{
			ItemMediaAlbum.innerHTML = "Album:&nbsp;" + oID3.Album;
			ItemMediaAlbum.style.display = "";
		}
	}
} */