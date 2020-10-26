/**
 *  Nethru Script Module
 *  Copyright 2008 nethru, All Rights Reserved.
 *  
 *  WiseLog Online Version 6.0.2.0
 **/

var _n_sid = "07010100000";		/* custid */
var _n_ls = "http://weblog.oliveyoung.co.kr:6100/wlo/Logging"; /* logging server */
var _n_uls = "http://weblog.oliveyoung.co.kr:6100/wlo/UserLogging"; /* user logging server */
var _n_c_field1 = "wl_chlNo";     /*유입채널 쿠키명*/ 
var _n_c_field2 = "wl_chlDtlNo";     /*유입채널 쿠키명*/
var _n_uid = "";			/* uid */
var _n_first_pcid = false;
var _n_click_logging_max = 30;
var _n_click_logging_num = 0;
var _n_click_images = new Object();

var _n_ptype_param="_wl_ptype";
var _n_src_param="_wl_src";
var _n_keyword_param="_wl_keyword";
var _n_mid_param="_wl_mid";
var _n_convday_param="_wl_convday";
var _n_acqmoney_param="_wl_convvalue"

var	_n_src_cookie="NCHANNELSRC";
var _n_keyword_cookie="NCHANNELKWD";
var _n_mid_cookie="NCHANNELMID";
var _n_date_cookie="NCHANNELDATE"

var _n_max_conv_day = 30;

var _n_cookie_convtype="NCONVTYPE";
var _n_cookie_convkwd="NCONVKWD";

var _n_use_subcookie = false;	/* use sub cookie */
var _n_use_channel = false;		/* use inflow channel */
var _n_use_cpc = false;		/* use CPC */

var _n_bank_uid = "";		// bank uid (non cookie uid)
var _n_bank_uid_name = "WLUID";	// bank uid key name (for log's cookie name)

var _n_use_img_timeout = false;
var _n_img_timeout_millis = 3000;

var _n_custom_pipe = "%7C%0B";

/* https logging */
if ( document.location.protocol == "https:" ) {
    _n_ls = "https://weblog.oliveyoung.co.kr:6143/wlo/Logging";
    _n_uls = "https://weblog.oliveyoung.co.kr:6143/wlo/UserLogging";
}

var _n_logging_image = new Image();				/* Common Logging Image */
var _n_user_image = new Image();					/* User Logging  */

for ( var i=0; i<_n_click_logging_max;i++) {
	_n_click_images[i] = new Image();
}

function n_loadImageSimple(img, url) {
	img.src = url;
}

function n_loadImage(img, url, altUrl, timeout) {
	var timer;
	function clearTimer() {
		if ( timer ) {
			clearTimeout(timer);
			timer = null;
		}
	}

	function handleFail() {
		this.onload = this.onabort = this.onerror = function() {};

		clearTimer();

		if ( this.src === url) {
			this.src = altUrl;
		}
	}

	img.onerror = img.onabort = handleFail;
	img.onload = function() {
		clearTimer();
	};

	img.src = url;
	timer = setTimeout(function(theImg) {
		return function() {
			handleFail.call(theImg);
		}
	}(img), timeout);

	return img;
}

function n_getBI()
{
	var str = "";	
	var dt = document;

	var strScreenSize = "";

	var ws = window.screen;													
	
	if ( ws != null && ws != "undefined" ) {
		strScreenSize = screen.width+"x"+screen.height;
	}
	str +="n_ss=" + strScreenSize + "; ";				

	var cs = "-";
	var nv = navigator;

	if ( nv.language ) {  
		cs = nv.language.toLowerCase();				
	} 
	else if ( nv.userLanguage ) {
		cs = nv.userLanguage.toLowerCase();
	}
	
	str +="n_cs=" + cs + "; ";	

	return str;					
}

function n_getSubCV(cv, offset, escapeFlag, delim) 
{
	var endstr = cv.indexOf ( delim, offset);
	
	if ( endstr == -1) endstr = cv.length;
	
	if ( escapeFlag )
		return unescape(cv.substring(offset, endstr));
	else 
		return cv.substring(offset, endstr);
}

function n_getCV(dc, offset,escapeFlag)
{
	var endstr = dc.indexOf (";", offset);
	
	if (endstr == -1) endstr = dc.length;

	if ( escapeFlag )
		return unescape(dc.substring(offset, endstr));
	else
		return dc.substring(offset, endstr);
}

function n_GetSubCookie(name, cv)
{
	var arg = name + "=";
	var alen = arg.length;
	var clen = cv.length;
	var i = 0;

	while (i < clen) 
	{
		var j = i + alen;
		
		if (cv.substring(i, j) == arg) {
			return n_getSubCV (cv,j,false,"&");
		}

		i = cv.indexOf("&", i) + 1;
		
		if (i == 0)
			break;
	}

	return null;
}

function n_GetCookie(name,escapeFlag)
{
	var dc = document.cookie;
	var arg = name + "=";
	var alen = arg.length;
	var clen = dc.length;
	var i = 0;

	while (i < clen) 
	{
		var j = i + alen;
		
		if (dc.substring(i, j) == arg) {
			if ( _n_use_subcookie ) {
				return n_getSubCV(dc, j, escapeFlag, ";");
			} else {
				return n_getCV(dc, j, escapeFlag);
			}
		}

		i = dc.indexOf(" ", i) + 1;
		
		if (i == 0)
			break;
	}

	return null;
}

function n_SetCookie(name, value)
{
	var argv = n_SetCookie.arguments;
	var argc = n_SetCookie.arguments.length;
	var expires = (2 < argc) ? argv[2] : null;
	var path = (3 < argc) ? argv[3] : null;
	var domain = (4 < argc) ? argv[4] : null;
	var secure = (5 < argc) ? argv[5] : false;

	document.cookie = 
		name + "=" + escape (value)
		+ ((expires == null) ? "" : ("; expires="+expires.toGMTString()))
		+ ((path == null) ? "" : ("; path=" + path))
		+ ((domain == null) ? "" : ("; domain=" + domain))
		+ ((secure == true) ? "; secure" : "");
}

function n_DeleteCookie(name, path, domain) {
	if ( n_GetCookie(name, false) ) {
		document.cookie = name + "=" +
			( ( path ) ? ";path=" + path : "") +
			( (domain ) ? ";domain=" + domain : "") +
			";expires=Thu, 01-Jan-1970 00:00:01 GMT";
	}
}

function n_makePersistentCookie(name,length,path,domain)
{
	var today = new Date();
	var expiredDate = new Date(2100,1,1);
	var cookie;
	var value;

	cookie = n_GetCookie(name,true);
	
	if ( cookie ) {
		_n_first_pcid = false;
		return cookie;
	}
	_n_first_pcid = true;

	var values = new Array();

	for ( i=0; i < length ; i++ ) {
		values[i] = "" + Math.random();
	}

	value = today.getTime();

	for ( i=0; i < length ; i++ ) {
		value += values[i].charAt(2);
	}

	n_SetCookie(name,value,expiredDate,path,domain);

	return value;
}

function n_encodeStr(s)
{
	if (typeof(encodeURI) == 'function') {
		s=encodeURI(s);
		s=s.split("#").join("%23");
		return s;
	}
	else
		return escape(s);
}

function n_paramEncodeStr(s)
{
	s=s.split("&").join("|");
	s=s.split("?").join(" ");
	s=s.split("/").join("|");

	return n_encodeStr(s);
}

function n_getDomain()
{
	var _host   = document.domain;
	var so = _host.split('.');
	
	if ( n_isIpType(so)) {
		return ( so[0] + '.' + so[1] + '.' + so[2] + '.' + so[3]);
	}
	
	if ( so.length != 4 && so.length != 3 ) {
		return _host;
	}
	
	var dm  = so[so.length-2] + '.' + so[so.length-1];

	return (so[so.length-1].length == 2) ? so[so.length-3] + '.' + dm : dm;
}

function n_getReferrer()
{
	var my_ref = self.document.referrer;

	var parent_href = "";
	var parent_ref = "";

	try {
		parent_href = top.document.location.href;
		parent_ref = top.document.referrer;
	}
	catch(e) {
		return my_ref;
	}

	if ( my_ref == parent_href )
		return parent_ref;

	return my_ref;
}

function n_getCookieStr() 
{
	/* PCID */
	var pcid = "";
	
	/* Cookie Field */
	var _n_c_f = "";
	
	/* Browser Info */
	var binfo = n_getBI();
	
	/* Domain */
	var domain = "";

	if ( (typeof _n_domain)!="undefined" && _n_domain != "" ) {
		domain = _n_domain;
	}
	else {
		domain = n_getDomain();
	}

	pcid = n_makePersistentCookie("PCID",10,"/",domain);

	if ( pcid != null && pcid != "" ) {
		var cookies = "";

		if ( _n_first_pcid == false )
			cookies += "PCID" + "=" + pcid + "; ";

		if ( (typeof _n_uid_cookie)!="undefined" && _n_uid_cookie != "" ) {
			if ( (typeof _n_f_uid_decode)=="undefined" || _n_f_uid_decode==true ) {
				_n_uid = n_GetCookie(_n_uid_cookie,true);
			}
			else {
				_n_uid = n_GetCookie(_n_uid_cookie,false);
			}
			if ( _n_uid != null && _n_uid != "" ) {	
				if ( _n_use_subcookie && (typeof _n_uid_subcookie) != "undefined" && _n_uid_subcookie != "" ) {
					_n_uid_sub = n_GetSubCookie(_n_uid_subcookie,_n_uid);	
					if ( _n_uid_sub != null && _n_uid_sub != "" ) {
						cookies += _n_uid_subcookie + "=" + _n_uid_sub + "; ";
					}
				} else
					cookies += _n_uid_cookie + "=" + _n_uid + "; ";
			}
		}
		
		if ( (typeof _n_bank_uid) != "undefined" && _n_bank_uid != "" ) {
			cookies += _n_bank_uid_name + "=" + _n_bank_uid + "; ";
		}
		
		if ( (typeof _n_c_field1)!="undefined" && _n_c_field1 != "" ) {
			_n_c_f = n_GetCookie(_n_c_field1, true);
			if ( _n_c_f != null && _n_c_f != "" ) {
				cookies += _n_c_field1 + "=" + _n_c_f + "; ";
			}
		}
		if ( (typeof _n_c_field2)!="undefined" && _n_c_field2 != "" ) {
			_n_c_f = n_GetCookie(_n_c_field2, true);
			if ( _n_c_f != null && _n_c_f != "" ) {
				cookies += _n_c_field2 + "=" + _n_c_f + "; ";
			}
		}
		if ( (typeof _n_c_field3)!="undefined" && _n_c_field3 != "" ) {
			_n_c_f = n_GetCookie(_n_c_field3, true);
			if ( _n_c_f != null && _n_c_f != "" ) {
				cookies += _n_c_field3 + "=" + _n_c_f + "; ";
			}
		}

		return cookies + binfo;
	}
	else {
		return document.cookie + binfo;
	}
}

/* User Attr Logging */
function n_userattr_logging()
{
	var uid_attr1 = "";
	var uid_attr2 = "";
	var uid_attr3 = "";
	var uid_attr4 = "";
	var uid_attr5 = "";
	var uid_attr6 = "";
	var uid_attr7 = "";
	var	uid_url = "";

	if ( _n_uid == null || _n_uid == "" ) {
		if ( _n_bank_uid != null && _n_bank_uid != "" )
			_n_uid = _n_bank_uid;
		else
			return;
	}

	if ( (typeof _n_uid_attr1)!="undefined" && _n_uid_attr1 != "" ) uid_attr1 = _n_uid_attr1;
	if ( (typeof _n_uid_attr2)!="undefined" && _n_uid_attr2 != "" ) uid_attr2 = _n_uid_attr2;
	if ( (typeof _n_uid_attr3)!="undefined" && _n_uid_attr3 != "" ) uid_attr3 = _n_uid_attr3;
	if ( (typeof _n_uid_attr4)!="undefined" && _n_uid_attr4 != "" ) uid_attr4 = _n_uid_attr4;
	if ( (typeof _n_uid_attr5)!="undefined" && _n_uid_attr5 != "" ) uid_attr5 = _n_uid_attr5;
	if ( (typeof _n_uid_attr6)!="undefined" && _n_uid_attr6 != "" ) uid_attr6 = _n_uid_attr6;
	if ( (typeof _n_uid_attr7)!="undefined" && _n_uid_attr7 != "" ) uid_attr7 = _n_uid_attr7;
	if ( uid_attr1!="" || uid_attr2!="" || uid_attr3!="" || uid_attr4!="" || uid_attr5!="" || uid_attr6!="" || uid_attr7!="" ) {
		uid_url = _n_uls +
					"?" +
					"d=" + "001" + 
					_n_custom_pipe + "dv=" + Math.random() +
					_n_custom_pipe + "ver=1.0.0" +
					_n_custom_pipe + "sid=" + n_encodeStr(_n_sid) +
					_n_custom_pipe + "u=" + n_encodeStr(_n_uid) +
					_n_custom_pipe + "a1=" + n_encodeStr(uid_attr1) +
					_n_custom_pipe + "a2=" + n_encodeStr(uid_attr2) +
					_n_custom_pipe + "a3=" + n_encodeStr(uid_attr3) +
					_n_custom_pipe + "a4=" + n_encodeStr(uid_attr4) +
					_n_custom_pipe + "a5=" + n_encodeStr(uid_attr5) +
					_n_custom_pipe + "a6=" + n_encodeStr(uid_attr6) +
					_n_custom_pipe + "a7=" + n_encodeStr(uid_attr7);

		if ( _n_use_img_timeout) {
			n_loadImage(_n_user_image, uid_url, "#", _n_img_timeout_millis);
		} else {
			n_loadImageSimple(_n_user_image, uid_url);
		}

		//_n_user_image.src = uid_url;
	}
}

function n_Logging_M() {

	if ( (typeof _n_m1)!="undefined" && _n_m1 ) return true;
	if ( (typeof _n_m2)!="undefined" && _n_m2 ) return true;
	if ( (typeof _n_m3)!="undefined" && _n_m3 ) return true;
	if ( (typeof _n_m4)!="undefined" && _n_m4 ) return true;
	if ( (typeof _n_m5)!="undefined" && _n_m5 ) return true;
	if ( (typeof _n_m6)!="undefined" && _n_m6 ) return true;
	if ( (typeof _n_m7)!="undefined" && _n_m7 ) return true;

	return false;
}

function n_Logging_P() {

	if ( (typeof _n_p1)!="undefined" && _n_p1 ) return true;
	if ( (typeof _n_p2)!="undefined" && _n_p2 ) return true;
	if ( (typeof _n_p3)!="undefined" && _n_p3 ) return true;
	if ( (typeof _n_p4)!="undefined" && _n_p4 ) return true;
	if ( (typeof _n_p5)!="undefined" && _n_p5 ) return true;
	if ( (typeof _n_p6)!="undefined" && _n_p6 ) return true;
	if ( (typeof _n_p7)!="undefined" && _n_p7 ) return true;

	return false;
}

function n_Logging_P_UID() {
	if ((typeof _n_p_uid ) != "undefined" && _n_p_uid) return true;
	
	return false;
}
	
function n_hasUnsafeCookieValue(cookieValue) {
	if (!cookieValue) {
		return false;
	}

	return cookieValue.indexOf("<script") > -1;
}

function n_makeCookieSafe(cookieStr) {
	var cookieArr = cookieStr.split(';');
	var safeCookieStr = "";

	for (var i=0; i<cookieArr.length; i++) {
		var value = cookieArr[i].split('=')[1];
		
		if (!n_hasUnsafeCookieValue(value) && cookieArr[i] != " ") {
			safeCookieStr += cookieArr[i] + ";";
		}
	}

	return safeCookieStr;
}


/* Click Logging */
function n_click_logging(url)
{
	if ( _n_sid == "07010100000" )
		return;

	var argc = n_click_logging.arguments.length;
	var argv = n_click_logging.arguments;
	
	var _n_request = url;

	var _nr = n_getReferrer();
	var _n_referrer = (1 < argc) ? argv[1] : _nr;
	var c1 = (2 < argc) ? argv[2] : null;
	var _n_cookie = n_makeCookieSafe(n_getCookieStr());
	var _n_agent = navigator.userAgent;

	var _n_target_url = _n_ls +
						"?" +
						"d=" + "001" + 
						_n_custom_pipe + "dv=" + Math.random() +
						_n_custom_pipe + "ver=1.0.0" +
						_n_custom_pipe + "sid=" + n_encodeStr(_n_sid) +
						_n_custom_pipe + "r=" + n_encodeStr(_n_request) +
						_n_custom_pipe + "rf=" + n_encodeStr(_n_referrer) +
						_n_custom_pipe + "c=" + n_encodeStr(_n_cookie) +
						_n_custom_pipe + "a=" + n_encodeStr(_n_agent);

	if ( c1 != null ) {
		_n_target_url += _n_custom_pipe + "_n_p1=" + c1;
	}

	_n_click_logging_num++;

	if ( _n_use_img_timeout ) {
		n_loadImage(_n_click_images[_n_click_logging_num % _n_click_logging_max], _n_target_url, "#", _n_img_timeout_millis);
	} else {
		n_loadImageSimple(_n_click_images[_n_click_logging_num % _n_click_logging_max], _n_target_url);
	}
	//_n_click_images[_n_click_logging_num % _n_click_logging_max].src = _n_target_url;
}

function n_get_channel_cookieparam() {
	var src;
	var keyword;
	var convdate;
	var convday;
	var mid;
		
	var retStr = "";
	
	src = n_GetCookie(_n_src_cookie);
	keyword = n_GetCookie(_n_keyword_cookie);
	convdate = n_GetCookie(_n_date_cookie, true);
	mid = n_GetCookie(_n_mid_cookie);
	
	var current = new Date();
	if ( convdate == null ) {
		convday = 0;
	}
	else {
		convdate = new Date(convdate);
		convday = Math.floor((current.getTime() + 32400000) / 1000 / 60 / 60 / 24) - Math.floor((convdate.getTime() + 32400000) / 1000 / 60 / 60 / 24);
	}
	
	if ( convday <= 0 ) convday = 0;
	if ( mid == null) mid = "0";
	if ( src == null) src = "1";
	
	retStr += _n_custom_pipe + _n_mid_param + "=" + mid;
	retStr += _n_custom_pipe + _n_src_param + "=" + src;
	if ( keyword != null ) retStr += _n_custom_pipe + _n_keyword_param + "=" + keyword;
	retStr += _n_custom_pipe + _n_convday_param + "=" + convday;
		
	return retStr;
}

function n_common_logging(_req, _ref, _title) {

	var _n_request = _req;
	var _n_referrer = _ref;
	var _n_cookie = n_makeCookieSafe(n_getCookieStr());
	var _n_agent = navigator.userAgent;
	var _n_title = _title;

	/* CPC */
	if ( typeof (_n_use_cpc ) != "undefined" && _n_use_cpc ) {
		var convType = "";
		var convKwd = "";
		var requestTemp = "";
		
		/* Domain */
		var domain = "";

		if ( (typeof _n_domain)!="undefined" && _n_domain != "" ) {
			domain = _n_domain;
		}
		else {
			domain = n_getDomain();
		}
		
		convType = n_GetCookie(_n_cookie_convtype, false);
		
		if ( convType != "" && convType != null) {
			requestTemp += _n_cookie_convtype + "=" + n_encodeStr(convType);
			
			n_DeleteCookie(_n_cookie_convtype, "/", domain);
		}
		
		convKwd = n_GetCookie(_n_cookie_convkwd, true);
		
		if ( convKwd != "" && convKwd != null) {
			requestTemp += "&" + _n_cookie_convkwd + "=" + convKwd;
			
			n_DeleteCookie(_n_cookie_convkwd, "/", domain);
		} 
		
		if ( requestTemp != "" ) {
			if ( _n_request.indexOf("?") != -1 ) {
				_n_request += "&" + requestTemp;
			} else {
				_n_request += "?" + requestTemp;	
			}
		}
	}
	
	/* Make URL Parameter */ 
	var _n_target_url = _n_ls +
						"?" +
						"d=" + "001" + 
						_n_custom_pipe + "dv=" + Math.round(Math.random()*1999083012) +
						_n_custom_pipe + "ver=1.0.0" +
						_n_custom_pipe + "sid=" + n_encodeStr(_n_sid) +
						_n_custom_pipe + "r=" + n_encodeStr(_n_request) +
						_n_custom_pipe + "rf=" + n_encodeStr(_n_referrer) +
						_n_custom_pipe + "c=" + n_encodeStr(_n_cookie) +
						_n_custom_pipe + "a=" + n_encodeStr(_n_agent);

	if ( (typeof _n_show_title)!="undefined" && _n_show_title )
		_n_target_url += _n_custom_pipe + "t=" + n_paramEncodeStr(_n_title);


	if ( n_Logging_P_UID() ) {
		_n_target_url += _n_custom_pipe + "_n_p_uid=" + n_paramEncodeStr(_n_p_uid);
	}


	if ( n_Logging_M() ) {
		var nm1 = ""; var nm2 = ""; var nm3 = ""; var nm4 = ""; var nm5 = ""; var nm6 = ""; var nm7 = "";

		if ( (typeof _n_m1)!="undefined" && _n_m1 ) nm1 = n_paramEncodeStr(_n_m1);
		if ( (typeof _n_m2)!="undefined" && _n_m2 ) nm2 = n_paramEncodeStr(_n_m2);
		if ( (typeof _n_m3)!="undefined" && _n_m3 ) nm3 = n_paramEncodeStr(_n_m3);
		if ( (typeof _n_m4)!="undefined" && _n_m4 ) nm4 = n_paramEncodeStr(_n_m4);
		if ( (typeof _n_m5)!="undefined" && _n_m5 ) nm5 = n_paramEncodeStr(_n_m5);
		if ( (typeof _n_m6)!="undefined" && _n_m6 ) nm6 = n_paramEncodeStr(_n_m6);
		if ( (typeof _n_m7)!="undefined" && _n_m7 ) nm7 = n_paramEncodeStr(_n_m7);

		_n_target_url += _n_custom_pipe + "_n_m1=" + nm1;
		_n_target_url += _n_custom_pipe + "_n_m2=" + nm2;
		_n_target_url += _n_custom_pipe + "_n_m3=" + nm3;
		_n_target_url += _n_custom_pipe + "_n_m4=" + nm4;
		_n_target_url += _n_custom_pipe + "_n_m5=" + nm5;
		_n_target_url += _n_custom_pipe + "_n_m6=" + nm6;
		_n_target_url += _n_custom_pipe + "_n_m7=" + nm7;
	}

	if ( n_Logging_P() ) {
		var np1 = ""; var np2 = ""; var np3 = ""; var np4 = ""; var np5 = ""; var np6 = ""; var np7 = ""; 

		if ( (typeof _n_p1)!="undefined" && _n_p1 ) np1 = n_paramEncodeStr(_n_p1);
		if ( (typeof _n_p2)!="undefined" && _n_p2 ) np2 = n_paramEncodeStr(_n_p2);
		if ( (typeof _n_p3)!="undefined" && _n_p3 ) np3 = n_paramEncodeStr(_n_p3);
		if ( (typeof _n_p4)!="undefined" && _n_p4 ) np4 = n_paramEncodeStr(_n_p4);
		if ( (typeof _n_p5)!="undefined" && _n_p5 ) np5 = n_paramEncodeStr(_n_p5);
		if ( (typeof _n_p6)!="undefined" && _n_p6 ) np6 = n_paramEncodeStr(_n_p6);
		if ( (typeof _n_p7)!="undefined" && _n_p7 ) np7 = n_paramEncodeStr(_n_p7);

		 _n_target_url += _n_custom_pipe + "_n_p1=" + np1;
		 _n_target_url += _n_custom_pipe + "_n_p2=" + np2;
		 _n_target_url += _n_custom_pipe + "_n_p3=" + np3;
		 _n_target_url += _n_custom_pipe + "_n_p4=" + np4;
		 _n_target_url += _n_custom_pipe + "_n_p5=" + np5;
		 _n_target_url += _n_custom_pipe + "_n_p6=" + np6;
		 _n_target_url += _n_custom_pipe + "_n_p7=" + np7;
	}

	/* Cookie Information */
	var info_cookie = "";
	if ( (typeof _n_info1_cookie)!="undefined" && _n_info1_cookie != "" ) {
		info_cookie = n_GetCookie(_n_info1_cookie,false);	
		if ( info_cookie != null && info_cookie != "" ) {
			_n_target_url += _n_custom_pipe + _n_info1_cookie + "=" + n_encodeStr(info_cookie);
		}
	}
	if ( (typeof _n_info2_cookie)!="undefined" && _n_info2_cookie != "" ) {
		info_cookie = n_GetCookie(_n_info2_cookie,false);	
		if ( info_cookie != null && info_cookie != "" ) {
			_n_target_url += _n_custom_pipe + _n_info2_cookie + "=" + n_encodeStr(info_cookie);
		}
	}
	if ( (typeof _n_info3_cookie)!="undefined" && _n_info3_cookie != "" ) {
		info_cookie = n_GetCookie(_n_info3_cookie,false);	
		if ( info_cookie != null && info_cookie != "" ) {
			_n_target_url += _n_custom_pipe + _n_info3_cookie + "=" + n_encodeStr(info_cookie);
		}
	}
	if ( (typeof _n_info4_cookie)!="undefined" && _n_info4_cookie != "" ) {
		info_cookie = n_GetCookie(_n_info4_cookie,false);	
		if ( info_cookie != null && info_cookie != "" ) {
			_n_target_url += _n_custom_pipe + _n_info4_cookie + "=" + n_encodeStr(info_cookie);
		}
	}
	if ( (typeof _n_info5_cookie)!="undefined" && _n_info5_cookie != "" ) {
		info_cookie = n_GetCookie(_n_info5_cookie,false);	
		if ( info_cookie != null && info_cookie != "" ) {
			_n_target_url += _n_custom_pipe + _n_info5_cookie + "=" + n_encodeStr(info_cookie);
		}
	}
	if ( (typeof _n_info6_cookie)!="undefined" && _n_info6_cookie != "" ) {
		info_cookie = n_GetCookie(_n_info6_cookie,false);	
		if ( info_cookie != null && info_cookie != "" ) {
			_n_target_url += _n_custom_pipe + _n_info6_cookie + "=" + n_encodeStr(info_cookie);
		}
	}
	if ( (typeof _n_info7_cookie)!="undefined" && _n_info7_cookie != "" ) {
		info_cookie = n_GetCookie(_n_info7_cookie,false);	
		if ( info_cookie != null && info_cookie != "" ) {
			_n_target_url += _n_custom_pipe + _n_info7_cookie + "=" + n_encodeStr(info_cookie);
		}
	}


	/* Inflow Channel */
	if ( (typeof _n_use_channel) != "undefined" && _n_use_channel == true ) { 
	
		var channelparam = "";
		var channelflag = false;
	
		if ( (typeof _n_f_buyconv) != "undefined" && _n_f_buyconv == true) {
			channelparam = n_get_channel_cookieparam()
			_n_target_url += _n_custom_pipe + _n_ptype_param + "=2";
			channelflag = true;
		} else if ( (typeof _n_f_subscriptionconv) != "undefined" && _n_f_subscriptionconv == true) {
			channelparam = n_get_channel_cookieparam()
			_n_target_url += _n_custom_pipe + _n_ptype_param + "=3";
			channelflag = true;
		} else if ( (typeof _n_f_conv1) != "undefined" && _n_f_conv1 == true) {
			channelparam = n_get_channel_cookieparam()
			_n_target_url += _n_custom_pipe + _n_ptype_param + "=4";
			channelflag = true;
		} else if ( (typeof _n_f_conv2) != "undefined" && _n_f_conv2 == true) {
			channelparam = n_get_channel_cookieparam()
			_n_target_url += _n_custom_pipe + _n_ptype_param + "=5";
			channelflag = true;
		} else if ( (typeof _n_f_conv3) != "undefined" && _n_f_conv3 == true) {
			channelparam = n_get_channel_cookieparam()
			_n_target_url += _n_custom_pipe + _n_ptype_param + "=6";
			channelflag = true;
		}
			
		if ( channelflag ) {
			var domain = "";
			if ( (typeof _n_domain)!="undefined" && _n_domain != "" ) {
				domain = _n_domain;
			}
			else {
				domain = n_getDomain();
			}	
			
			//n_DeleteCookie(_n_date_cookie, "/", domain);
			//n_DeleteCookie(_n_mid_cookie, "/", domain);
			//n_DeleteCookie(_n_src_cookie, "/", domain);
			//n_DeleteCookie(_n_keyword_cookie, "/", domain);
			
			_n_target_url += _n_custom_pipe + _n_acqmoney_param + "=" + n_getParam(_n_acqmoney_param);
			
			_n_target_url += channelparam;
			
		}
	
		n_channel_search();
	}
	
	if ( typeof (_n_use_cpc ) != "undefined" && _n_use_cpc ) {
		n_cpc_search();
	}

	if ( _n_use_img_timeout ) {
		n_loadImage(_n_logging_image, _n_target_url, "#", _n_img_timeout_millis);
	} else {
		n_loadImageSimple(_n_logging_image, _n_target_url);
	}

	//_n_logging_image.src = _n_target_url;

	/* Call User Logging Function */ 
	n_userattr_logging();
}


/* Logging Function */
function n_logging() {

	/* Customer ID Test */
	if ( _n_sid == "07010100000" )
		return;
	
	/* Call Common Logging Function */
	if ( document.location.protocol == "file:" ) {
		n_common_logging( document.location.pathname + document.location.search, n_getReferrer(), document.title.toString() );
	} else {
		n_common_logging( document.location.href, n_getReferrer(), document.title.toString() );
	}
}

/* Parent Logging */
function n_parent_logging() {

	if ( _n_sid == "07010100000" )
		return;
	
	var parent_href = "";
	var parent_ref = "";
	var parent_title = "";

	try {
		parent_href = top.document.location.href;
		parent_ref = top.document.referrer;
		parent_title = top.document.title.toString();
		n_common_logging(parent_href, parent_ref, parent_title);
	}
	catch(e) {
		/* Nothing */
	}
}

function n_getParam(name) {
	var param = name + "=";
	var url = "" + self.document.location.search;
	var turl = "";
	
	eval("try{ turl=top.document.location.search; }catch(_e){}");
	
	url = url + "&" + turl;
	
	if ( url.indexOf(param) != -1) {
		var x = url.indexOf(param) + param.length;
		var y = url.substr(x).indexOf("&");
		if ( y != -1 ) return url.substring(x, x+y);
		else return url.substr(x);
	}
	
	return "";
}

/* Channel Search */
function n_channel_search() {
	var ptype = n_getParam(_n_ptype_param);
	
	var keyword = "";
		
	if ( ptype == "1") {
		var currentDate = new Date();
		var mid = n_getParam(_n_mid_param);
		var src = n_getParam(_n_src_param);
	
	
		if ( src == "2" ) {	
			keyword = n_getParam("OVKEY");	
		} else if ( src == "3") {
			keyword = n_getParam("NVKWD");
		} else {
			keyword = n_getParam(_n_keyword_param);
		}
		
		n_create_channel_cookie(mid, src, currentDate, keyword);
	} 
}

function n_create_channel_cookie(mid, src, date, keyword) {
	var domain = "";
	var expiredDate = new Date();

	if ( (typeof _n_domain)!="undefined" && _n_domain != "" ) {
		domain = _n_domain;
	}
	else {
		domain = n_getDomain();
	}	
	
	if ( mid == "") mid = "0";
	if ( src == "") src = "1";
		
	expiredDate.setTime(Math.floor((date.getTime() + 32400000) / 86400000) * 86400000 - 32400000 + 1000 * 60 * 60 * 24 * (_n_max_conv_day + 1) - 1);
	
	n_SetCookie(_n_date_cookie, date, expiredDate, "/", domain);
	n_SetCookie(_n_mid_cookie, mid, expiredDate, "/", domain);
	n_SetCookie(_n_src_cookie, src, expiredDate, "/", domain);
	
	if ( keyword != "") {
		n_SetCookie(_n_keyword_cookie, keyword, expiredDate, "/", domain);
	} else {
		n_DeleteCookie(_n_keyword_cookie, "/", domain);
	}
}


function n_set_conversion(convtype) {
	
	_n_f_conv = true;
	if ( convtype == "BUYCONV") {
		_n_f_buyconv = true;
	} else if ( convtype == "SUBSCRIPTIONCONV") {
		_n_f_subscriptionconv = true;
	} else if ( convtype == "USERDEF1CONV") {
		_n_f_conv1 = true;
	} else if ( convtype == "USERDEF2CONV") {
		_n_f_conv2 = true;
	} else if ( convtype == "USERDEF3CONV") {
		_n_f_conv3 = true;
	}
	
}

/* CPC SEARCH */
function n_cpc_search() {
	
	var ref = n_getReferrer();
	var tref = "";
	
	eval("try{ tref = top.document.referrer; }catch(_e){}");
	
	var bFormat = false;
		
	if ( ref == tref ) {
		ref = tref;
		bFormat = true;
	}
	
	if ( ref == 'undefined' ) ref = "";
	
	var buykeyword = "";
	var nv_ar = "";
	var cpc_src = "";
	
	/* Domain */
	var domain = "";

	if ( (typeof _n_domain)!="undefined" && _n_domain != "" ) {
		domain = _n_domain;
	}
	else {
		domain = n_getDomain();
	}	

	if ( bFormat ) {
		var expiredDate = new Date();
	
		expiredDate.setTime(expiredDate.getTime() + 1000 * 60 * 60 * 24 * _n_max_conv_day);
		 
		buykeyword = n_getParam("OVKEY");
		
		if ( buykeyword != "" ) {
			// ADD COOKIE (OVERTURE)
			n_SetCookie(_n_cookie_convtype, "OVERTURE", expiredDate, "/", domain);
			n_SetCookie(_n_cookie_convkwd, buykeyword, expiredDate, "/", domain);
		}
		
		buykeyword = n_getParam("NVADKWD");
		
		if ( buykeyword != "") {
			nv_ar = n_getParam("NVAR");
			
			n_SetCookie(_n_cookie_convtype, "NAVER_" + nv_ar, expiredDate, "/", domain);
			n_SetCookie(_n_cookie_convkwd, buykeyword, expiredDate, "/", domain);
						
			
//			if ( nv_ar == "PL" || nv_ar == "BZ" ) {
//				// ADD COOKIE ( NAVER CPC );
//				n_SetCookie(_n_cookie_convtype, "NAVERCPC", expiredDate, "/", domain);
//				n_SetCookie(_n_cookie_convkwd, buykeyword, expiredDate, "/", domain);
//			} else if ( nv_ar == "PSLK" ) {
//				// ADD COOKIE ( NAVER CPT );
//				n_SetCookie(_n_cookie_convtype, "NAVERCPT", expiredDate, "/", domain);
//				n_SetCookie(_n_cookie_convkwd, buykeyword, expiredDate, "/", domain);
//			}		
		}
		
		buykeyword = n_getParam("nkwd");
		
		if ( buykeyword != "") {
			cpc_src = n_getParam("nsrc");
			
			if ( cpc_src == "daum") {
				// ADD COOKIE ( DAUM );		
				n_SetCookie(_n_cookie_convtype, "DAUM", expiredDate, "/", domain);
				n_SetCookie(_n_cookie_convkwd, buykeyword, expiredDate, "/", domain);
			} else if ( cpc_src == "google") {
				// ADD COOKIE ( GOOGLE );
				n_SetCookie(_n_cookie_convtype, "GOOGLE", expiredDate, "/", domain);
				n_SetCookie(_n_cookie_convkwd, buykeyword, expiredDate, "/", domain);
			} else if ( cpc_src == "nate") {
				// ADD COOKIE ( NATE );
				n_SetCookie(_n_cookie_convtype, "NATE", expiredDate, "/", domain);
				n_SetCookie(_n_cookie_convkwd, buykeyword, expiredDate, "/", domain);
			}
		}		
	}
}

function n_isIpType(val) {
	if ( val.length != 4 ) return false;
	
	for ( var i=0; i < 4; i++) {
		if ( !n_isInteger(val[i]) ) {
			return false;
		}
	}
	
	return true;
}

function n_isInteger(val) {
	if (n_isBlank(val)) {
		return false;
	}
	
	for ( var i=0; i < val.length;i++) {
		if ( !n_isDigit(val.charAt(i))) {
			return false;
		}
	}
	
	return true;
}

function n_isDigit(num) {
	if ( num.length>1) {
		return false;
	}
	
	var string="1234567890";
	
	if ( string.indexOf(num) != -1) {
		return true;
	}
	
	return false;
}

function n_isBlank(val) {
	if (val == null) {
		return true;
	}
	
	for (var i=0; i < val.length; i++) {
		if ( (val.charAt(i) != ' ') && (val.charAt(i) != "\t")&&(val.charAt(i) != "\n") && (val.charAt(i)!= "\r")) {
			return false;
		}
	}
	
	return true;
}

