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
		/***********************************************
		 *hAnim_Fade( oFadeElem, __bool_FadeIn, float_FadeDuration )
		 ***********************************************
		 *Purpose:
		 *	1.	Fades in or fades out oFadeElem's.
		 *Requires:
		 *	1.	oFadeElem = The element to fade.
		 *	2.	__bool_FadeIn = 'true' fades in
		 *						'false' fades out.
		 *	3.	float_FadeDuration = Specifies
		 ***********************************************/
		function hAnim_Fade( oFadeElem, __bool_FadeIn, float_FadeDuration ){
			if(viewoptions.EnableFadeAnimation == true )
			{
				var float_DefaultFadeDuration = 0.4;
				if(!float_FadeDuration) 
					float_FadeDuration = float_DefaultFadeDuration;
				
				oFadeElem.style.filter="blendtrans(duration=" + float_FadeDuration + ")";
				
				if(__bool_FadeIn == true)
				{	
					//fade in
					if (oFadeElem.filters.blendtrans.status != 2)
					{
						oFadeElem.filters.blendtrans.apply();
						oFadeElem.style.visibility="visible";
						oFadeElem.filters.blendtrans.play();
					}
				}
				else if(__bool_FadeIn == false)
				{	
					//fade out
					if (oFadeElem.filters.blendtrans.status != 2)
					{
						oFadeElem.filters.blendtrans.apply();
						oFadeElem.style.visibility="hidden";
						oFadeElem.filters.blendtrans.play();
					}
				}
			}
		}
		
		
		/*****************************************************
		 *The Slide up and down animation
		 *****************************************************/
		var StartV = 0.5;
		var MidV;
		var EndV = 1;
		var Inc = 0.18;
		var Power = 5;
		var mSec = 5;
		var heightfactor, ClipUpAmount, ClipDownAmount;
		
		
		function GetPower(elemheight)
		{
			if(elemheight <= 50)
				Power = 3.5;
			else if(elemheight > 50 && elemheight <= 100)
				Power = 4.5;
			else if(elemheight > 100 && elemheight <= 150)
				Power = 5;
			else if(elemheight > 150 && elemheight <= 200)
				Power = 5.5;
			else Power = 5;
		}
		function GetInc(elemheight)
		{
			GetPower(elemheight);
			if(Power == 3.5)
				heightfactor = 56;
			else if(Power == 4)
				heightfactor = 43.5;
			else if(Power == 4.5)
				heightfactor = 30;
			else if(Power == 5)
				heightfactor = 22;
			else if(Power == 5.5)
				heightfactor = 17;
			
			Inc = 1000/(heightfactor*elemheight);
		}
		function GetEndV()
		{
			if( EndV > .9999)
			{
				StartV = StartV + Inc;
				MidV = Math.sin( StartV ) + 1;
				EndV = Math.pow( MidV, Power );
			} else 
			{
				StartV = 0.5;
				EndV = 1;
			}
		}
		
		function SlideUp( elem ){
			return elem.style.pixelTop = elem.style.pixelTop - EndV;
		}
		function SlideDown( elem ){
			return elem.style.pixelTop = elem.style.pixelTop + EndV;
		}
		function ClipUp( elem ){
			ClipUpAmount += EndV;
			elem.style.clip = "rect("+ ClipUpAmount +"px, auto, auto, auto)";
		}
		function ClipDown(elem){
			ClipDownAmount -= EndV;
			elem.style.clip = "rect("+ ClipDownAmount +"px, auto, auto, auto)";
		}

		function hAnim_SlideTaskBoxUp( oTaskBox, __IsPremiereCall ){
			oTaskBoxHeight = oTaskBox.offsetHeight - 3;
			copyoTaskBox = oTaskBox;

			// To position the oTaskBox exactly at the edge of g_oCurrTaskBar
			diff = (g_oCurrTaskBar.style.pixelTop + g_oCurrTaskBar.offsetHeight) - (oTaskBox.style.pixelTop + oTaskBox.offsetHeight) + 1;			
			
			if( EndV > .9999 && diff < -9 )
			{
				// Commented because it is now called as preloaded calculation in mouseover.
				//if(__IsPremiereCall == true ) 
					//GetInc( oTaskBoxHeight );
				GetEndV();
				
				if(__IsPremiereCall == true )
					ClipUpAmount = EndV;
				
				//The following order of function calls is important for smoothness.
				hAnim_SlideUpRelatives(oTaskBox.id);
				SlideUp( oTaskBox );
				setTimeout( "ClipUp( copyoTaskBox );hAnim_SlideTaskBoxUp( copyoTaskBox, false );", mSec );
			} else 
			{
				// To position the oTaskBox exactly at the edge of g_oCurrTaskBar
				oTaskBox.style.pixelTop = oTaskBox.style.pixelTop + diff;
				//oTaskBox.style.clip = "rect(" + oTaskBoxHeight + ", auto, auto, auto)";
				if(oTaskBox.id == "TaskBox1"){	
					TaskPane2.style.pixelTop = TaskPane2.style.pixelTop - 6;
					TaskPane3.style.pixelTop = TaskPane3.style.pixelTop - 6;
				} else if(oTaskBox.id == "TaskBox2"){
					TaskPane3.style.pixelTop = TaskPane3.style.pixelTop - 8;
				}
				StartV = 0.5;
				EndV = 1;
				//alert(diff);
			}
		}
		


		function hAnim_SlideTaskBoxDown( oTaskBox, __IsPremiereCall ){
			oTaskBoxHeight = oTaskBox.offsetHeight - 3;
			copyoTaskBox = oTaskBox;

			if(__IsPremiereCall == true ) ClipDownAmount = oTaskBoxHeight;
			// To position the oTaskBox exactly at the edge of g_oCurrTaskBar
			diff = (g_oCurrTaskBar.style.pixelTop + g_oCurrTaskBar.offsetHeight - 3) - (oTaskBox.style.pixelTop - 3) + 1;
			
			if( EndV > .9999 && diff > 9 )
			{

				//if(__IsPremiereCall == true ) 
				//{
				//	GetInc( oTaskBoxHeight );
				//}
				GetEndV();
				ClipDown( oTaskBox );
				
				SlideDown( oTaskBox );
				hAnim_SlideDownRelatives(oTaskBox.id);
				setTimeout( "hAnim_SlideTaskBoxDown( copyoTaskBox, false );", mSec );
				
			} else 
			{
				// To position the oTaskBox exactly at the edge of g_oCurrTaskBar
				oTaskBox.style.pixelTop = oTaskBox.style.pixelTop + diff;
				oTaskBox.style.clip = "rect(auto, auto, auto, auto)";
				StartV = 0.5;
				EndV = 1;
				if(oTaskBox.id == "TaskBox2"){
					TaskPane3.style.pixelTop = TaskPane3.style.pixelTop + 2;
				}
			}
		}
		
		function hAnim_SlideUpRelatives(oTaskBoxID)
		{
			if(oTaskBoxID == "TaskBox1"){ SlideUp(TaskPane2);SlideUp(TaskPane3);  }
			else if(oTaskBoxID == "TaskBox2"){ SlideUp(TaskPane3);}
		}
		function hAnim_SlideDownRelatives(oTaskBoxID)
		{
			if(oTaskBoxID == "TaskBox1"){ SlideDown(TaskPane2); SlideDown(TaskPane3);}
			else if(oTaskBoxID == "TaskBox2"){ SlideDown(TaskPane3); }
		}