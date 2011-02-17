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
		//	PRECACHING MOUSEOVER IMAGES
		var g_img_taskbar_normal_up			= "resources/taskbar_normal_up.png";
		var g_img_taskbar_normal_up_over	= "resources/taskbar_normal_up_over.png";
		var g_img_taskbar_normal_down		= "resources/taskbar_normal_down.png";
		var g_img_taskbar_normal_down_over	= "resources/taskbar_normal_down_over.png";


		//	REQUIRED FOR MANIPULATION OF MOUSE EVENTS
		var g_oCurrTaskBarImg;
		var g_oCurrTaskBar;
		var g_oCurrTaskBox;
		var g_PlayOnSlideDown = true;
		
		var selectedItemsCount = 0;
		var folderItemsCount = 0;
		
		var SlideTimer = 0;

		//EVENT ASSOCIATIONS
		//onmouseout="hEvent_HotArea_MouseOut( this );"
		//onmouseover="hEvent_HotArea_MouseOver( this );"
		//onmousedown="hEvent_HotArea_MouseDown( this );"
		//onblur="this.tabIndex=-1;"
		//oncontextmenu="hEvent_HotArea2_ContextMenu( this );"
		function HotArea1::OnMouseOver(){ hEvent_HotArea_MouseOver( HotArea1 ); }
		function HotArea2::OnMouseOver(){ hEvent_HotArea_MouseOver( HotArea2 ); }
		function HotArea3::OnMouseOver(){ hEvent_HotArea_MouseOver( HotArea3 ); }
		function HotArea1::OnMouseOut(){ hEvent_HotArea_MouseOut( HotArea1 ); }
		function HotArea2::OnMouseOut(){ hEvent_HotArea_MouseOut( HotArea2 ); }
		function HotArea3::OnMouseOut(){ hEvent_HotArea_MouseOut( HotArea3 ); }
		function HotArea1::OnMouseDown(){ hEvent_HotArea_MouseDown( HotArea1 ); }
		function HotArea2::OnMouseDown(){ hEvent_HotArea_MouseDown( HotArea2 ); }
		function HotArea3::OnMouseDown(){ hEvent_HotArea_MouseDown( HotArea3 ); }
		function HotArea1::OnBlur(){ this.tabIndex=-1; }
		function HotArea2::OnBlur(){ this.tabIndex=-1; }
		function HotArea3::OnBlur(){ this.tabIndex=-1; }
		function HotArea2::OnContextMenu(){ hEvent_HotArea2_ContextMenu( this ); }
		function ItemPreview::OnMouseMove(){ if(viewoptions.EnableVideoPreview == true && oWMPlayer6.style.display == "" && viewoptions.EnableControlsOnMouseOver == true) oWMPlayer6.ShowControls = true; } 
		function ItemPreview::OnMouseOut(){ if(viewoptions.EnableVideoPreview == true && oWMPlayer6.style.display == "" && viewoptions.EnableControlsOnMouseOver == true) {oWMPlayer6.ShowControls = false; FileList.focus();} }
/*		function PreviewMe::OnPreviewReady()
		{
			PreviewMe.style.display = "";
			ItemImageDimensions.innerHTML = text.Dimensions + PreviewMe.cxImage + " x " + PreviewMe.cyImage + text.Pixels;
			ItemImageDimensions.style.display = "";
		}
*/		function Preview98::OnThumbnailReady()
		{
			if (Preview98.haveThumbnail()){
				ItemPreview.style.display = "";
				Preview98.style.display = "";
				PanelContent.style.pixelHeight = TaskBox3.offsetTop + TaskBox3.offsetHeight;
				SanitizeScrollbars();
			}
		}
		
		/**************************************************
		 *FileList::SelectionChanged() event
		 **************************************************
		 *Purpose Selection changed event for FileList.
		 **************************************************/
		function FileList::SelectionChanged() 
		{
			SelChanged();
		}
/*		function FileList::VerbInvoked()
		{
			ArrestWMPlayer6();
		}
*/			
		function SelChanged()
		{
			//ArrestWMPlayer6();
			HandleFAFTContent();
			if( FileList.Folder.Items().Count > 0 )
			{
				var focusedItem = FileList.FocusedItem;
				if( FileList.SelectedItems().Count == 1 )	
					var selectedItem = FileList.SelectedItems().Item(0);
				try {
					var fileExtension = GetFileExtension( selectedItem.Path );
				} catch( e )
				{
					try
					{
						var fileExtension = GetFileExtension( focusedItem.Path );
					} catch( e1){}
				}
				selectedItemsCount = FileList.SelectedItems().Count;
				folderItemsCount = FileList.Folder.Items().Count;
			}

			if( folderItemsCount > 0 && selectedItemsCount == 0 ) { NoneSelected(); }
			else if( folderItemsCount > 0 && selectedItemsCount > 1 ) { ManySelected(); }
			else {
					try{
						ShowInfo( selectedItem );
					} catch( e ){}
			}
			PanelContent.style.pixelHeight = TaskBox3.offsetTop + TaskBox3.offsetHeight;
			SanitizeScrollbars();
			FileList.focus();
		}
		function hEvent_ToolButton_MouseOver( oSource )
		{
			event.cancelBubble = true;
			if(ToolbarBack.style.display == "none"){
				if(oSource.className == "ToolbarButton")
				{
					oSource.className = "ToolbarButton_over";
				} else if(oSource.className == "ToolbarButton_over")
				{
					oSource.className = "ToolbarButton";
				}
			} else if(ToolbarBack.style.display == "") {
				if(oSource.className == "ToolbarButton")
				{
					oSource.className = "ToolbarButton_imgover";
				} else if(oSource.className == "ToolbarButton_imgover")
				{
					oSource.className = "ToolbarButton";
				}
			}
		}

		/***********************************************
		 *hEvent_HotArea_MouseOver( oSource ) event handler
		 ***********************************************
		 *Purpose:
		 *	1.	Handles the 'MouseOver' event for the
		 *		HotArea's.
		 ***********************************************/
		function hEvent_HotArea_MouseOver( oSource )
		{
			event.cancelBubble = true;
			GetCurrTaskBarImg( oSource.id );
			GetCurrTaskBar( oSource.id );
			GetCurrTaskBox( oSource.id );
			
			// Condition for execution.
			if( g_oCurrTaskBarImg == TaskBarImg1 || g_oCurrTaskBarImg == TaskBarImg2 || g_oCurrTaskBarImg == TaskBarImg3 )
			{
				if( g_oCurrTaskBar.className == "taskbar_normal_up" )
				{
					g_oCurrTaskBarImg.src = g_img_taskbar_normal_up_over;
					g_oCurrTaskBar.className = "taskbar_normal_up_over";
				}
				else if( g_oCurrTaskBar.className == "taskbar_normal_down" )
				{
					g_oCurrTaskBarImg.src = g_img_taskbar_normal_down_over;
					g_oCurrTaskBar.className = "taskbar_normal_down_over";
				}
			}
			window.status=oSource.title;
			
			// Precalculate and load animation data.
			var oCurrTaskBoxHeight = g_oCurrTaskBox.offsetHeight - 3;
			GetInc( oCurrTaskBoxHeight);
		}

		/***********************************************
		 *hEvent_HotArea_MouseOut( oSource ) event handler
		 ***********************************************
		 *Purpose:
		 *	1.	Handles the 'MouseOut' event for the
		 *		HotArea's.
		 ***********************************************/
		function hEvent_HotArea_MouseOut( oSource )
		{
			event.cancelBubble = true;
			GetCurrTaskBarImg( oSource.id );
			GetCurrTaskBar( oSource.id );
			
			// Condition for execution.
			if(g_oCurrTaskBarImg == TaskBarImg1 || g_oCurrTaskBarImg == TaskBarImg2 || g_oCurrTaskBarImg == TaskBarImg3 )
			{
				if(g_oCurrTaskBar.className == "taskbar_normal_up_over")
				{
					g_oCurrTaskBarImg.src = g_img_taskbar_normal_up;
					g_oCurrTaskBar.className = "taskbar_normal_up";
				}
				else if(g_oCurrTaskBar.className == "taskbar_normal_down_over")
				{
					g_oCurrTaskBarImg.src = g_img_taskbar_normal_down;
					g_oCurrTaskBar.className = "taskbar_normal_down";
				}
			}
		}

		/***********************************************
		 *hEvent_HotArea_MouseDown( oSource ) event handler
		 ***********************************************
		 *Purpose:
		 *	1.	Handles the 'MouseDown' event for the
		 *		HotArea's.
		 ***********************************************/
		function hEvent_HotArea_MouseDown( oSource )
		{
			//event.cancelBubble = true;
			copyoSource = oSource;
			SetSelectionRectangleProc( oSource );
			GetCurrTaskBarImg( oSource.id );
			GetCurrTaskBar( oSource.id );
			GetCurrTaskBox( oSource.id );
			
			// Condition for execution.
			if( g_oCurrTaskBarImg == TaskBarImg1 || g_oCurrTaskBarImg == TaskBarImg2 || g_oCurrTaskBarImg == TaskBarImg3 )
			{
				screen.updateInterval = 10;		// Required for smoother animations	
				SetPanelContentHeight();
				
				
				
				if( g_oCurrTaskBar.className == "taskbar_normal_up_over" )
				{
					if(g_oCurrTaskBox == TaskBox3 ){
						if(oWMPlayer6.PlayState == constant.mpPlaying){
							oWMPlayer6.Pause();
							g_PlayOnSlideDown = true;
						}
						else if(oWMPlayer6.PlayState != constant.mpPlaying)
							g_PlayOnSlideDown = false;
					}
					
					hAnim_SlideTaskBoxUp( g_oCurrTaskBox, true );
					hAnim_Fade( g_oCurrTaskBox, false, 0.375 );
					g_oCurrTaskBarImg.src = g_img_taskbar_normal_down_over;
					g_oCurrTaskBar.className = "taskbar_normal_down_over";
				}
				else if( g_oCurrTaskBar.className == "taskbar_normal_down_over" )
				{
					hAnim_SlideTaskBoxDown( g_oCurrTaskBox, true );
					hAnim_Fade( g_oCurrTaskBox, true, 0.4 );
					g_oCurrTaskBarImg.src = g_img_taskbar_normal_up_over;
					g_oCurrTaskBar.className = "taskbar_normal_up_over";
					g_oCurrTaskBox.style.visibility = "visible";
					if(g_oCurrTaskBox == TaskBox3 && oWMPlayer6.PlayState == constant.mpPaused && g_PlayOnSlideDown == true)
						setTimeout('oWMPlayer6.Play();', 600);
				}
				//screen.updateInterval = 0;
				SlideTimer = setTimeout('screen.updateInterval = 0', 200);
			}
		}
		
		
		/***********************************************
		 *hEvent_Task_MouseOver( oSource ) event handler
		 ***********************************************
		 *Purpose:
		 *	1.	Handles the 'MouseOver' event for the
		 *		TaskCells in order to display the
		 *		title text in the status bar.
		 ***********************************************/
		function hEvent_TaskCell_MouseOver( oSource )
		{
			window.status = oSource.title;
			//return true;				// Not required.
		}
		
		/***********************************************
		 *hEvent_HotArea2_ContextMenu( oSource ) event handler
		 ***********************************************
		 *Purpose:
		 *	1.	Handles the 'MouseOver' event for the
		 *		TaskCells in order to display the
		 *		title text in the status bar.
		 ***********************************************/
		function hEvent_HotArea2_ContextMenu( oSource )
		{
			if( TaskContainer2a.style.display == "" ){
				TaskContainer2b.style.display = "";
				TaskContainer2a.style.display = "none";
			} else if( TaskContainer2b.style.display == "" ) {
				TaskContainer2a.style.display = "";
				TaskContainer2b.style.display = "none";
			}
		}
		
		
		/***********************************************
		 *WaitStatus()
		 ***********************************************
		 *Purpose:
		 *	1.	Wait signal in status bar.
		 ***********************************************/
		function WaitStatus()
		{
			window.status = " ";
		}
		