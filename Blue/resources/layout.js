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
		//	ABSOLUTE TOP POSITIONS AND HEIGHTS
		var g_arr_TaskBar_Top		= new Array();		g_arr_TaskBar_Top[0] = 0;
		var g_arr_TaskBox_Top		= new Array();		g_arr_TaskBox_Top[0] = 0;
		var g_arr_TaskBox_Height	= new Array();		g_arr_TaskBox_Height[0] = 0;
		var TASKBARHEIGHT			= 38;			//specifies the height of each Task Bar.
		var TASKPANESGAP			= 13;			//specifies the gap (in pixels) between two Task Panes.
		

		
		/***********************************************
		 *SetTaskPanesProc() routine
		 ***********************************************
		 *Purpose:
		 *	1.	Absolutely positions the Task Panes and
		 *		their elements. Absolute positioning is
		 *		required for clipping of Task Boxes during
		 *		ShoveUp (Hide/Show) Task Box motion
		 *		animations. 
		 *	2.	Records the positions and heights of the
		 *		Task Panes, Task Bars, and Task Boxes
		 *		in arrays declared in 
		 *		"ABSOLUTE TOP POSITIONS AND HEIGHTS"
		 ***********************************************/		
		function SetTaskPanesProc( __bool_IsPremiereCall )
		{
			TaskBar1.style.pixelTop = 0;		// <- Normally '0', but if SpecTaskPanes' present then decided according to their positions.
			TaskBox1.style.pixelTop = TaskBar1.style.pixelTop + TASKBARHEIGHT;
			
			TaskBar2.style.pixelTop = TaskBar1.style.pixelTop + TASKBARHEIGHT + TaskBox1.offsetHeight;
			TaskBox2.style.pixelTop = TaskBar2.style.pixelTop + TASKBARHEIGHT;
			
			TaskBar3.style.pixelTop = TaskBar2.style.pixelTop + TASKBARHEIGHT + TaskBox2.offsetHeight;
			TaskBox3.style.pixelTop = TaskBar3.style.pixelTop + TASKBARHEIGHT;
			
			if( __bool_IsPremiereCall == true )
			{
				g_arr_TaskBar_Top[1] = TaskBar1.style.pixelTop;
				g_arr_TaskBar_Top[2] = TaskBar2.style.pixelTop;
				g_arr_TaskBar_Top[3] = TaskBar3.style.pixelTop;
				
				g_arr_TaskBox_Top[1] = TaskBox1.style.pixelTop;
				g_arr_TaskBox_Top[2] = TaskBox2.style.pixelTop;
				g_arr_TaskBox_Top[3] = TaskBox3.style.pixelTop;
				
				g_arr_TaskBox_Height[1] = TaskBox1.offsetHeight;
				g_arr_TaskBox_Height[2] = TaskBox2.offsetHeight;
				g_arr_TaskBox_Height[3] = TaskBox3.offsetHeight;
				PanelContent.style.visibility = "visible";
			}
			PanelContent.style.pixelHeight = TaskBox3.style.pixelTop + TaskBox3.offsetHeight;
		}
		
		/**********************************************
		 *SetPanelContentHeight()
		 **********************************************
		 *Purpose:
		 *	1.	Sets the panel content height when
		 *		Taskbar is clicked, and then .
		 **********************************************/
		function SetPanelContentHeight()
		{
			if( g_oCurrTaskBar.className == "taskbar_normal_up_over" )
			{
				PanelContent.style.pixelHeight = PanelContent.offsetHeight - g_oCurrTaskBox.offsetHeight;
				setTimeout('SanitizeScrollbars()', 0);
			}
			else if( g_oCurrTaskBar.className == "taskbar_normal_down_over" )
			{
				PanelContent.style.pixelHeight = PanelContent.offsetHeight + g_oCurrTaskBox.offsetHeight;
				SanitizeScrollbars();
			}
			//SanitizeScrollbars();
		}
		/***********************************************
		 *SetSelectionRectangleProc( oSource )
		 ***********************************************
		 *Purpose:
		 *	1.	Sets the selection rectangle if enabled.
		 *Requires:
		 *	1.	oSource = The source element.
		 ***********************************************/
		function SetSelectionRectangleProc( oSource )
		{
			if( oSource )
			{
				if( oSource.id == "HotArea1" || oSource.id == "HotArea2" || oSource.id == "HotArea3" )
				{
					oSource.tabIndex = 0;
				}
				switch( oSource.id )
				{
					case 'HotArea1':
						HotArea2.tabIndex = -1;
						HotArea3.tabIndex = -1;
						break;
					case 'HotArea2':
						HotArea1.tabIndex = -1;
						HotArea3.tabIndex = -1;
						break;
					case 'HotArea3':
						HotArea1.tabIndex = -1;
						HotArea2.tabIndex = -1;
						break;
					default: 
						HotArea1.tabIndex = -1;
						HotArea2.tabIndex = -1;
						HotArea3.tabIndex = -1;
						break;
				}
			}
		}
		
		/***********************************************
		 *FixSizeProc()
		 ***********************************************
		 *Purpose:
		 *	1.	Fixes the sizes of windows and controls.
		 ***********************************************/
		function FixSizeProc()
		{
			var ch = document.body.clientHeight;
			var cw = document.body.clientWidth;
			
			FileList.style.pixelLeft = Panel.style.pixelWidth;
			FileList.style.pixelWidth = cw - FileList.style.pixelLeft;
			FileList.style.pixelHeight = ch - 30;
			Toolbar.style.pixelWidth = cw - FileList.style.pixelLeft;
			if(ToolbarBack.style.display == ""){
				ToolbarBack.style.pixelWidth = cw - FileList.style.pixelLeft;
			} else {
				Toolbar.style.borderLeft = "1px solid ButtonHighlight";
				Toolbar.style.borderTop = "1px solid ButtonHighlight";
				Toolbar.style.borderRight = "1px solid ButtonShadow";
				Toolbar.style.borderBottom = "1px solid ButtonShadow";
			}
			setTimeout('SanitizeScrollbars();FileList.focus();', 0);
						
		}
		
		
		/***********************************************
		 *GetCurrTaskBarImg( oSourceID ) function
		 ***********************************************
		 *Purpose:
		 *	1.	Returns the Current TaskBarImg for
		 *		hEvent procs.
		 *Requires:
		 *	1.	oSourceID = The Event Source's unique ID.
		 ***********************************************/
		function GetCurrTaskBarImg( oSourceID )
		{
			switch( oSourceID )
			{
				case 'HotArea1': return g_oCurrTaskBarImg = TaskBarImg1;	break;
				case 'HotArea2': return g_oCurrTaskBarImg = TaskBarImg2;	break;
				case 'HotArea3': return g_oCurrTaskBarImg = TaskBarImg3;	break;
				default: return false; break;	
			}
		}

		/***********************************************
		 *GetCurrTaskBar( oSourceID ) function
		 ***********************************************
		 *Purpose:
		 *	1.	Returns the Current TaskBar for
		 *		hEvent procs.
		 *Requires:
		 *	1.	oSourceID = The Event Source's unique ID.
		 ***********************************************/
		function GetCurrTaskBar( oSourceID )
		{
			switch( oSourceID )
			{
				case 'HotArea1': return g_oCurrTaskBar = TaskBar1; break;
				case 'HotArea2': return g_oCurrTaskBar = TaskBar2; break;
				case 'HotArea3': return g_oCurrTaskBar = TaskBar3; break;
				default: return false; break;	
			}
		}
		/***********************************************
		 *GetCurrTaskBox( oSourceID ) function
		 ***********************************************
		 *Purpose:
		 *	1.	Returns the Current TaskBox for
		 *		hEvent procs.
		 *Requires:
		 *	1.	oSourceID = The Event Source's unique ID.
		 ***********************************************/
		function GetCurrTaskBox( oSourceID )
		{
			switch( oSourceID )
			{
				case 'HotArea1': return g_oCurrTaskBox = TaskBox1; break;
				case 'HotArea2': return g_oCurrTaskBox = TaskBox2; break;
				case 'HotArea3': return g_oCurrTaskBox = TaskBox3; break;
				default: return false; break;	
			}
		}

		/***********************************************
		 *SanitizeScrollbars()
		 ***********************************************
		 *Purpose:
		 *	1.	Sanatizes the insane scrollbars.
		 ***********************************************/
		function SanitizeScrollbars()
		{	
			// Temporary adjustments for width of task pane when scrolling
			// will be set later in terms of scrollWidth and clientWidth.
			// alert(Panel.scrollWidth + " " + PanelContent.clientWidth );
			if( PanelContent.clientHeight > document.body.scrollHeight && PanelContent.clientWidth == 185)
			{
				DecW(TaskPane1);
				DecW(TaskPane2);
				DecW(TaskPane3);
				DecreaseWidth(PanelContent, constant.DecWAmount);
			} else if( PanelContent.clientHeight <= document.body.scrollHeight && PanelContent.clientWidth == (185 - constant.IncWAmount) ) // Panel.offsetHeight
			{
				IncreaseWidth(PanelContent, constant.IncWAmount);
				IncW(TaskPane1);
				IncW(TaskPane2);
				IncW(TaskPane3);
			}
		}
		/***********************************************
		 *SanitizeScrollbars() Container functions
		 ***********************************************
		 *Purpose:
		 *	1.	Sanatizes the insane scrollbars.
		 ***********************************************/
		function DecW(elem)
		{
			if(elem.id == "TaskPane1")
			{
				taskpane = TaskPane1;
				taskbar = TaskBar1;
				taskbox = TaskBox1;
				taskbarimg = TaskBarImg1;
				hotarea = HotArea1;
				hotperimeter = HotPerimeter1;
			} else if(elem.id == "TaskPane2")
			{
				taskpane = TaskPane2;
				taskbar = TaskBar2;
				taskbox = TaskBox2;
				taskbarimg = TaskBarImg2;
				hotarea = HotArea2;
				hotperimeter = HotPerimeter2;
			} else if(elem.id == "TaskPane3")
			{
				taskpane = TaskPane3;
				taskbar = TaskBar3;
				taskbox = TaskBox3;
				taskbarimg = TaskBarImg3;
				hotarea = HotArea3;
				hotperimeter = HotPerimeter3;
			}

				DecreaseWidth(taskpane, constant.DecWAmount)
				DecreaseWidth(taskbar, constant.DecWAmount);
				DecreaseWidth(hotarea, constant.DecWAmount);
				DecreaseWidth(hotperimeter, constant.DecWAmount);
				DecreaseWidth(taskbox, constant.DecWAmount);
				DecreaseWidth(taskbarimg, constant.DecWAmount);

		}
		function IncW(elem)
		{
			if(elem.id == "TaskPane1")
			{
				taskpane = TaskPane1;
				taskbar = TaskBar1;
				taskbox = TaskBox1;
				taskbarimg = TaskBarImg1;
				hotarea = HotArea1;
				hotperimeter = HotPerimeter1;
			} else if(elem.id == "TaskPane2")
			{
				taskpane = TaskPane2;
				taskbar = TaskBar2;
				taskbox = TaskBox2;
				taskbarimg = TaskBarImg2;
				hotarea = HotArea2;
				hotperimeter = HotPerimeter2;
			} else if(elem.id == "TaskPane3")
			{
				taskpane = TaskPane3;
				taskbar = TaskBar3;
				taskbox = TaskBox3;
				taskbarimg = TaskBarImg3;
				hotarea = HotArea3;
				hotperimeter = HotPerimeter3;
			}
				// The order is important. 'hotperimeter' must come before 'taskbar'
				// when the in SetPanelHeight() SanitizeScrollbars() is called as
				// setTimeout( ..., 75).
				IncreaseWidth(hotperimeter, constant.IncWAmount); 
				IncreaseWidth(taskbar, constant.IncWAmount);
				IncreaseWidth(taskbarimg, constant.IncWAmount);
				IncreaseWidth(taskbox, constant.IncWAmount);
				IncreaseWidth(taskpane, constant.IncWAmount)
				IncreaseWidth(hotarea, constant.IncWAmount);
		}
		
		function DecreaseWidth(obj_Element, int_DecAmount)
		{
			obj_Element.style.pixelWidth = obj_Element.offsetWidth - int_DecAmount;
		}
		function IncreaseHeight(obj_Element, int_IncAmount)
		{
			obj_Element.style.pixelHeight = obj_Element.offsetHeight + int_IncAmount;
		}
		function DecreaseHeight(obj_Element, int_DecAmount)
		{
			obj_Element.style.pixelHeight = obj_Element.offsetHeight - int_DecAmount;
		}
		function IncreaseWidth(obj_Element, int_IncAmount)
		{
			obj_Element.style.pixelWidth = obj_Element.offsetWidth + int_IncAmount;
		}
		
