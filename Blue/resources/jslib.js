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
var JSLibrary = new JScriptLibrary();

		/***********************************************
		 *Left/RightSubstringTo/From()
		 ***********************************************
		 *Purpose:
		 *	1.	Returns the substring of the String
		 *		till or from the index of 
		 *		sSearchIndexOf.
		 *Example:
		 *	1.	"WestEnd Corporation".LeftSubstringTo(" Corporation") 
		 *		will return "WestEnd".
		 *	2.	"A flying duck".LeftSubstringTo("uck") will
		 *		return "A flying d".
		 *	3.	"WestEnd Corporation".RightSubstringFrom("End")
		 ***********************************************/
		String.prototype.LeftSubstringTo = function( sSearchIndexOf ){return this.substring(0, this.indexOf( sSearchIndexOf ) );}
		String.prototype.RightSubstringFrom = function( sSearchIndexOf ){return this.substring( this.indexOf( sSearchIndexOf ), this.length );}
		function LeftSubstringTo( sString, sSearchIndexOf ){ return sString.LeftSubstringTo( sSearchIndexOf ); }
		function RightSubstringFrom( sString, sSearchIndexOf ){ return sString.RightSubstringFrom ( sSearchIndexOf ); }
		
		
		/***********************************************
		 *Trim(), LTrim(), and RTrim() (VBScript Equiv.)
		 ***********************************************
		 *Purpose:
		 *	1.	Trims the trailing end whitespace. If
		 *		LTrim then the left end whitespace, else
		 *		if RTrim then the right end whitespace.
		 *
		 *Example:
		 *	1.	"  WestEnd Corporation     " will be
		 *		trimmed to "WestEnd Corporation" by 
		 *		Trim(), and to "WestEnd Corporation     "
		 *		by LTrim(), and to "  WestEnd Corporation"
		 *		by RTrim().
		 *
		 *Last Revision Date:
		 *	Monday, November 4, 2002
		 *
		 *Since:
		 *	Version 1.0
		 ***********************************************/
		String.prototype.Trim = function() {return this.replace(/(^\s*)|(\s*$)/g, "");}
		String.prototype.LTrim = function() {return this.replace(/^\s+/g, "");}
		String.prototype.RTrim = function() {return this.replace(/\s+$/g, "");}
		function Trim( sString ){return sString.Trim();}
		function LTrim( sString ){return sString.LTrim();}
		function RTrim( sString ){return sString.RTrim();}
		
///////////////////////////////////////////////////////////////////
// Library Constructor
	function JScriptLibrary()
	{
		this.Math = new Lib_Math();
		this.Format = new Lib_Format();
		this.String = new Lib_String();
		
		this.FlashMessage = FlashMessage;
		this.GenErr = GenErr;
		this.Hide = Hide;
		this.Show = Show;
	}

	function Lib_Math()
	{
		this.Round = Round;
		this.Max2 = GetMax2Numbers;
		this.Max3 = GetMax3Numbers;
		this.MaxNumArray = GetMaxNumArray;
		this.ConvertSize = ConvertSize;
		this.ConvertDuration = ConvertDuration;
		this.toBinaryString = toBinaryString;
	}
	
	function Lib_Format()
	{
		this.FormatNumber = FormatNumber;
		this.SanitizePath = SanitizePath;
	}

	function Lib_String()
	{
		this.Trim = Trim;
		this.LTrim = LTrim;
		this.RTrim = RTrim;
		this.LeftSubstringTo = LeftSubstringTo;
		this.RightSubstringFrom = RightSubstringFrom;
		this.EncodeString = EncodeString;
		this.UnencodeString = UnencodeString;
	}

///////////////////////////////////////////////////////////////////
//Math Library

/************************************************
 *ConvertDuration( fDuration ) function
 ************************************************
 *Purpose:
 *	1.	Converts the duration to
 *		nearest hour, minute, and seconds.
 *Params:
 *	fDuration = Duration in milliseconds.
 *Last Revision Date:
 *	Monday, November 4, 2002
 *Since:
 *	Version 1.0
 ************************************************/
function ConvertDuration( fDuration )
{
	return Round(fDuration / 60, 2) + "&nbsp;min";			
}
/************************************************
 * ConvertSize( bSize ) function
 ************************************************
 *Purpose:
 *	1.	Converts the file size to
 *		the nearest power of the byte. Returns a
 *		string with the number and appropriate
 *		unit.
 *Params:
 *	1. bSize = size in bytes.
 *Last Revision Date:
 *	Monday, November 4, 2002
 *Since:
 *	Version 1.0
 ************************************************/
function ConvertSize( bSize )
{
	bSize = parseInt(bSize)
	var calcSize, append;
	var kbyte = 1024;
	var mbyte = Math.pow(kbyte, 2);
	var gbyte = Math.pow(kbyte, 3);
	var pbyte = Math.pow(kbyte, 4);
	var tbyte = Math.pow(kbyte, 5);

	if(bSize >= kbyte && bSize < mbyte){
		calcSize = Round(bSize/kbyte, 2);
		append = "&nbsp;KB";
	} else if(bSize >= mbyte && bSize < gbyte) {
		calcSize = Round(bSize/mbyte, 2);
		append = "&nbsp;MB";
	} else if(bSize >= gbyte && bSize < pbyte){
		calcSize = Round(bSize/gbyte, 2);
		append = "&nbsp;GB";
	} else {
		calcSize = bSize;
		append = "&nbsp;bytes";
	}
		return (calcSize + append);
}
/************************************************************
 *toBinaryString( number, int_DecimalPlaces )
 ************************************************************
 *Purpose:
 *	1.	Converts numbers (as float, int, double)
 *		including hex and octal numbers to binary strings.
 *
 *Input:
 *	1.	Integers and floating-point numbers can also be 
 *		specified as strings.
 *	2.	Only hex and octal numbers cannot be specified
 *		as strings.
 *
 *Params:
 *	1.	number ==> <string> / <number>
 *	2.	int_DecimalPlaces ==> decimal places to which
 *		fractional part of binary number should be limited.
 *
 *Last Revision Date:
 *		10/05/2002
 *
 *Since:
 *		Version 1.0
 ************************************************************/
function toBinaryString( number, int_DecimalPlaces )
{
	var result = "";
	number = parseFloat( number );
	
	var mantissa = parseInt( number );
	var str_number = number.toString();

	while( mantissa >= 1 )
	{
		result = (mantissa % 2) + result;
		mantissa = parseInt(mantissa / 2);
	}

	if( str_number.indexOf(".") > -1 ){
		var fraction = parseFloat( str_number.substring( str_number.indexOf("."), str_number.length ) );

		if(!int_DecimalPlaces){
			int_DecimalPlaces = fraction.toString().length - 2;
		} else {
			int_DecimalPlaces = parseInt(int_DecimalPlaces);
		}
		result += "."
		fraction = fraction * 2;

		for( i = 0; i < int_DecimalPlaces; i++ )
		{
			if( parseInt(fraction) == 1){
				result += "1";
				fraction = fraction - 1;
			} else if(parseInt(fraction) == 0){
				result += "0";
			}
			fraction *= 2;
		}
	}
	return result;
}	
		

/***********************************************
 *FormatNumber( str_NumberToFormat )
 ***********************************************
 *Purpose:
 *	1.	Formats a number to include the comma
 *		separators.
 *Example:
 *	1.	"120000" will be fomatted to "120,000"
 ***********************************************/		
function FormatNumber( str_NumberToFormat ) 
{
	// Check if the argument str_NumberToFormat is a valid number and
	// whether it is specified as a string, if a valid number and not a string
	// then convert to a string.
	str_NumberToFormat = parseInt(str_NumberToFormat).toString();
	
	if(isNaN( parseInt(str_NumberToFormat) ) == false )
	{	
		var s = ""; 	var i, j = 0;
		for (i = str_NumberToFormat.length - 1; i >= 0; i--) 
		{ 		
			s = str_NumberToFormat.charAt(i) + s; 
			if (i && ((++j % 3) == 0)){
				s = "," + s;
			}
		}
		return s;
	}
}
/***********************************************
 *SanitizePath( str_Path, __returnWithHash )
 ***********************************************
 *Purpose:
 *	1.	Returns a path with or without the end
 *		Hash, '\'.
 *Example:
 *	1.	fn("C:\\", true) will return "C:\\"
 *		and fn("C:\\", false) will return "C:"
 *		fn("C:", true) will return "C:\\"
 *		and fn("C:", false) will return "C:"
 ***********************************************/
function SanitizePath( str_Path, __returnWithHash )
{
	str_Path = str_Path.Trim();
	var str_PathLength = str_Path.length;
	var hashCode = 0x00005C;
	var __hasEndHash = false;
	var s = "";
		
	if(str_Path.charCodeAt(str_PathLength-1) == hashCode )
		__hasEndHash = true;
			
	if(__returnWithHash == true)
	{
		if(__hasEndHash == true)
			return str_Path;
		else return str_Path + "\\";
	} else if(__returnWithHash == false)
	{
		if(__hasEndHash == true){
			return str_Path.substring(0, str_PathLength - 1);
		} else { 
			return str_Path; 
		}
	}
}
		
/****************************************************
 *Round( dbl_InputNumber, int_DecimalPlaces )
 ****************************************************
 *Purpose:
 *	1.	The default JScript Math.round(x) method
 *		is inefficient.
 *	2.	This function allows for the programmer
 *		to round of floating-point numbers to
 *		the required decimal places.
 *Requires:
 *	1.	dbl_InputNumber = The number to be rounded.
 *	2.	int_DecimalPlaces = Decimal places for
 *		rounded number. '0' will round the number to
 *		an integer.
 ****************************************************/
function Round( dbl_InputNumber, int_DecimalPlaces )
{	
	// Type checking.
	if(!int_DecimalPlaces || int_DecimalPlaces == null){
		int_DecimalPlaces = 0;
	}
	int_DecimalPlaces = parseInt( int_DecimalPlaces );
	dbl_InputNumber = parseFloat( dbl_InputNumber );
	
	var long_PowerOfTen = Math.pow( 10, int_DecimalPlaces );
	var POINT5 = 0.5;
	var result;

	return result = parseFloat( parseInt( (dbl_InputNumber * long_PowerOfTen) + POINT5 )) / long_PowerOfTen;
}
		
/************************************************
 *GetMax3Numbers()
 ************************************************
 *Purpose:
 *	1.	Gets the maximum of three numbers.
 ************************************************/
function GetMax3Numbers( num1, num2, num3 )
{
	var Result;	
	var maxof2numbers = GetMax2Numbers( num1, num2 );
	result = GetMax2Numbers( maxof2numbers, num3 );
	return result;
}

/************************************************
 *GetMax2Numbers()
 ************************************************
 *Purpose:
 *	1.	Gets the maximum of two numbers.
 ************************************************/
function GetMax2Numbers( num1, num2 )
{ 
	if( num1 > num2 )
	{
		return num1;
	} else if( num1 < num2 ) 
	{	
		return num2;
	} else {
		return false;
	}
}

/************************************************
 *GetMaxArray()
 ************************************************
 *Purpose:
 *	1.	Obtains the maximum number of an array of 
 *		numbers and returns the position of the 
 *		maximum number in the array, when 
 *		__returnIndex is true, otherwise returns
 *		the number.
 *Params:
 *	1.	aNum[] = an array of numbers.
 *	2.	__returnIndex = whether the index should
 *		be returned or the maximum number itself.
 *Last Revision Date:
 *	Monday, November 4, 2002.
 ************************************************/
function GetMaxNumArray( aNum, __returnIndex )
{
	// Proceed only if aNum is an array.
	if(aNum.constructor && aNum.constructor == Array)
	{
		var nMaxNum, nMaxIndex = 0;
		if(!__returnIndex || __returnIndex == null){
			__returnIndex = false;
		}

		for (var i = 0; i < aNum.length; i++)
		{
			if(aNum[i] > aNum[i+1])
			{
				nMaxIndex = i;
				nMaxNum = aNum[i];
			} else if( aNum[i] < aNum[i+1])
			{
				nMaxIndex = i+1;
				nMaxNum = aNum[i+1];
			} else {
				continue;
			}
		}
		
		if(__returnIndex == true)
		{
			return nMaxIndex;
		} else if(__returnIndex == false)
		{
			return nMaxNum;
		} else {
			return false;
		}
	} else {
		return false;
	}
}

/***********************************
 *FlashMessage( str_Message )
 ***********************************
 *Purpose:
 *	1. Flashes the message in the
 *		status bar.
 ***********************************/
function FlashMessage( str_Message )
{
	window.status = str_Message;
	setTimeout('window.status=" ";', 2500);
	return true;
}

/***********************************
 *GenErr()
 ***********************************
 *Purpose:
 *	1. 	Generates a function not
 *		defined error to be handled
 *		by a try-catch block to
 *		proceed to catch statements.
 ***********************************/
function GenErr(){
	// call an undefined function.
	abcdefghijklmnopqrstuvwxyz1234567890();
}

//////////////////////////////////////////////////////////////////
// String encoding functions.
/***********************************
 *Un/EncodeString()
 ***********************************
 *Purpose:
 *	Utility functions to encode 
 *	and unencode strings.
 *Input:
 *	nMethod
 *	=======
 *	0 = Plus-Minus algorithm
 *		(very simple).
 *	(default) = none;
 *Params:
 *	1.	sString = the string to be 
 *		encoded or unencoded.
 *	2.	nMethod = the method to be
 *		used to un/encode the string.
 *		(See section input for a
 *		of methods available.)
 ***********************************/
String.prototype.EncodeString = function( nMethod ){return EncodeString( this, nMethod );}
String.prototype.UnencodeString = function(){return UnencodeString( this );}
function EncodeString( sString, nMethod )
{
	// Check and convert to string.
	sString = sString.toString();
	
	// select method.
	switch( nMethod )
	{
	case 0:
		return EncodePlusMinus( sString ) + nMethod;
		break;
	default:
		return sString;
		break;
	}
}
function UnencodeString( sString )
{
	// Get the method from the last character
	var nMethod = parseInt(sString.charAt(sString.length-1));
	
	// select method
	switch( nMethod )
	{
	case 0:
		return UnencodePlusMinus( sString.substring(0, sString.length-1 ) );
		break;
	default:
		return sString;
		break;
	}
}

/***********************************
 *EncodePlusMinus()
 ***********************************
 *Purpose:
 *	Utility function implementing
 *	the "plus-minus algorithm"
 *	to encode strings.
 *Params:
 *	sString = the string to be 
 *	encoded.
 ***********************************/
function EncodePlusMinus( sString )
{
	var s = "";
	var nsStringLen = sString.length;
	var charCode;
	
 	for(i = 0; i < nsStringLen; i++)
 	{
 		charCode = sString.charCodeAt( i );
 		
 		if(charCode % 2 == 0){
 			s += String.fromCharCode( charCode - 1 ); 
 		} else if(charCode % 2 != 0){
 			if(charCode == 65536){
 				s += String.fromCharCode( 0 );
 			} else {
 				s += String.fromCharCode( charCode + 1 );
 			}
 		}
 	}
 	return s;
 }

/***********************************
 *UnencodePlusMinus()
 ***********************************
 *Purpose:
 *	Utility function implementing
 *	the "plus-minus algorithm"
 *	to unencode encoded strings.
 *Params:
 *	sString = encoded string to be 
 *	unencoded.
 ***********************************/
function UnencodePlusMinus( sString )
{
	var s = "";
	var nsStringLen = sString.length;
	var charCode;
	
	for(i = 0; i < nsStringLen; i++)
	{
 		charCode = sString.charCodeAt( i );
 		
 		if(charCode % 2 == 0){
 			if(charCode == 0){
 				s += String.fromCharCode( 65536 );
 			} else {
	 			s += String.fromCharCode( charCode - 1 ); 
	 		}
 		} else if(charCode % 2 != 0){
 			s += String.fromCharCode( charCode + 1 );
 		}
 	}
 	return s;
}

///////////////////////////////////////////////////////////////////////
// Misc
function Hide( aElems )
{
	if(aElems.constructor == Array)
	{	
		for( i = 0; i < aElems.length; i++ )
		{
			aElems[i].style.display = "none";
		}
	} else {
		aElems.style.display = "none";
	}
}
function Show( aElems )
{
	if(aElems.constructor == Array)
	{	
		for( i = 0; i < aElems.length; i++ )
		{
			aElems[i].style.display = "";
		}
	} else {
		aElems.style.display = "";
	}
}