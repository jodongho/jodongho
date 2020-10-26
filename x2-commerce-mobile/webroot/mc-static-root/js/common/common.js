var console = window.console || {
    log : function() {
    },
    info : function() {
    },
    warn : function() {
    },
    error : function() {
    }
};

// 바로구매 장바구니에서 프로모션 자세히보기레이어의 장바구니 버튼을 눌렀을때 응답 카트번호 저장
var cartNosForDirectCart = "";
var beautyLoginCnt = sessionStorage.getItem("lCnt");
var optionScrollTop = 0;
var giftPlusItemYn = "";
var recoCart = "N";
var callOrg = "";
var giftTrackCode = "";

$.namespace = function() {
    var a = arguments, o = null, i, j, d;
    for (i = 0; i < a.length; i = i + 1) {
        d = a[i].split(".");
        o = window;
        for (j = 0; j < d.length; j = j + 1) {
            o[d[j]] = o[d[j]] || {};
            o = o[d[j]];
        }
    }
    return o;
}

$.namespace("common");
common = {

    scrollPos : 0,

    cannotAccess : function() {
        alert('접근할 수 없습니다. 권한이 부족합니다.');
    },
    validateFieldNotEmpty : function(id, message) {
        var loginId = $(id).val();
        if ($.trim(loginId) == '') {
            alert(message);
            return false;
        }

        return true;
    },
    convertSystemToJtmpl : function(str) {
        if (str) {
            str = str.replace(/\n/gi, "<br/>");
            str = str.replace(/ /gi, "&nbsp;");
            return str;
        }
    },
    splitToEnterKey : function(str) {
        if (str) {
            var patt = /\n/g;

            if (patt.test(str)) {
                str = str.split(/\r|\n/)[0];
            }
            return str;
        }
    },
    
    chgMemJoinUrl : function(originUrl, type) {
    	var nowDate = new Date();
     	var yyyyMMdd = nowDate.format('yyyyMMdd');    	
     	var url = originUrl;
     	
    	if(type == 'evt_00000000006705'){
    		if(yyyyMMdd >= "20200701" && yyyyMMdd <= "20201231"){
         		url = _cjEaiUrl + _memJoinUrl + "&coop_url=" + encodeURIComponent(_baseUrl + "event/getEventDetail.do?evtNo=00000000006705");
         	}	
    	}
    	return url;
    },
    
    sessionClear : function() {
        var url = _baseUrl + "login/sessionClear.do";
        common.Ajax.getAjaxObj("POST", url, "");
        console.log("sessionClear=======");
    },
    
    loginChkForEvt : function(){
        var url= _baseUrl + "login/loginCheckJson.do";
        var loginResult = false;

        $.ajax({
            type: "POST",
            url: url,
            data: null,
            dataType : 'json',
            async: false,
            cache: false,
            success: function(data) {

                if(!data.result && data.url!=null){
                    window.location.href = _secureUrl + data.url + "?redirectUrl=" + encodeURIComponent(location.href);
                }

                loginResult = data.result;
            },
            error : function(a, b, c) {
                console.log(a);
                console.log(b);
                console.log(c);
            }
        });

        return loginResult;
    },

    isLoginForEvt : function(){
        var url= _baseUrl + "login/loginCheckJson.do";
        var loginResult = false;

        $.ajax({
            type: "POST",
            url: url,
            data: null,
            dataType : 'json',
            async: false,
            cache: false,
            success: function(data) {
                loginResult = data.result;
                sessionStorage.setItem("checkLoginStatus", data.result);
            },
            error : function() {
                loginResult = false;
                sessionStorage.removeItem("checkLoginStatus");
            }
        });

        return loginResult;
    },    

    loginChk : function(){
    	
        /* 3273769 로그인체크 중복 제거 추가 진행 요청 
         * "login/loginCheckJson.do" 중복 호출을 막기 위한 SessionStorage내, checkLoginStatus등록
         * 만약 checkLoginStatus내에 값이 존재할 경우, 값을 반환한다.
         * false일 경우에는 checkLoginStatus값을 제거한다.
         */
    	var url= _baseUrl + "login/loginCheckJson.do";
    	var loginResult = false;
        var checkLoginStatus = sessionStorage.getItem("checkLoginStatus");
        if(checkLoginStatus == null || checkLoginStatus == "undefined"){
    	
	
	        $.ajax({
	            type: "POST",
	            url: url,
	            data: null,
	            dataType : 'json',
	            async: false,
	            cache: false,
	            success: function(data) {
	
	                if(!data.result && data.url!=null){
	                    window.location.href = _secureUrl + data.url + "?redirectUrl=" + encodeURIComponent(location.href);
	                }
	
	                loginResult = data.result;
	            },
	            error : function(a, b, c) {
	                console.log(a);
	                console.log(b);
	                console.log(c);
	            }
	        });
        }else{
        	loginResult = JSON.parse(sessionStorage.getItem("checkLoginStatus"));
        	if(loginResult == false){
        		window.location.href = _secureUrl + "login/loginForm.do" + "?redirectUrl=" + encodeURIComponent(location.href);
        	}
        }
        return loginResult;
    },


    isLogin : function(){
        
        /* 3212592 12월올영세일_온라인몰 특이현상 점검 및 개선 요청의 件 
         * "login/loginCheckJson.do" 중복 호출을 막기 위한 SessionStorage내, checkLoginStatus등록
         * 만약 checkLoginStatus내에 값이 존재할 경우, 값을 반환한다.
         * false일 경우에는 checkLoginStatus값을 제거한다.
         */
    	
    	var url= _baseUrl + "login/loginCheckJson.do";
        var loginResult = false;
        
        var checkLoginStatus = sessionStorage.getItem("checkLoginStatus");
        if(checkLoginStatus == null || checkLoginStatus == "undefined"){
        	
            $.ajax({
                type: "POST",
                url: url,
                data: null,
                dataType : 'json',
                async: false,
                cache: false,
                success: function(data) {
                    loginResult = data.result;
                    sessionStorage.setItem("checkLoginStatus", data.result);
                },
                error : function() {
                    loginResult = false;
                    sessionStorage.removeItem("checkLoginStatus");
                }
            });
        }else{
        	loginResult = JSON.parse(sessionStorage.getItem("checkLoginStatus"));
        }
        return loginResult;
    },
    
    isBeautyLoginCnt : function(){
        /* 3273769 로그인체크 중복 제거 추가 진행 요청 
         * "login/loginCheckJson.do" 중복 호출을 막기 위한 SessionStorage내, checkLoginStatus등록
         * 만약 checkLoginStatus내에 값이 존재할 경우, 값을 반환한다.
         * false일 경우에는 checkLoginStatus값을 제거한다.
         */
        var checkLoginStatus = sessionStorage.getItem("checkLoginStatus");
        
        var url= _baseUrl + "login/loginCheckJson.do";
        var loginResult = false;
        
        if(checkLoginStatus == null || checkLoginStatus == "undefined"){
        	
        	$.ajax({
        		type: "POST",
        		url: url,
        		data: null,
        		dataType : 'json',
        		async: false,
        		cache: false,
        		success: function(data) {
        			beautyLoginCnt++;
        		},
        		error : function() {
        			beautyLoginCnt = 0;
        		}
        	});
        }else{
        	loginResult = JSON.parse(sessionStorage.getItem("checkLoginStatus"));
        	if(loginResult == true){//로그인 여부 확인
        		beautyLoginCnt++;
        	}else{
        		beautyLoginCnt = 0;
        	}
        }

        return beautyLoginCnt;
    },

    fileChk : function(file) {
        var maxSize = 5 * 1024 * 1024; // 5MB
        // var maxSize = 0 ;
        var fileFilter = /.(jpg|gif|png|jpeg)$/i;
        var fileType = "";
        var fileSize = 0;

        if (file != null && file != undefined) {
            for (i = 0; i < file.size(); i++) {
                if (file[i].value != "") {
                    fileType = file[i].files[0].name.slice(file[i].files[0].name.lastIndexOf("."));
                    fileSize = file[i].files[0].size;

                    /*
                     * console.log("파일["+i+"]>>"+file);
                     * console.log("파일Type["+i+"]>>"+fileType);
                     */

                    if (!fileType.match(fileFilter)) {
                        alert("등록할 수 없는 파일 형식입니다.");
                        return false;
                    }

                    if (fileSize > maxSize) {
                        alert("5MB미만의 이미지 파일만 첨부할 수 있습니다.");
                        return false;
                    }
                } else {
                    console.log("첨부된 파일이 없습니다.[" + file[i].name + "]");
                    return false;
                }
            }
            return true;
        }
    },
    getNowScroll : function() {
        var de = document.documentElement;
        var b = document.body;
        var now = {};
        now.X = document.all ? (!de.scrollLeft ? b.scrollLeft : de.scrollLeft)
                : (window.pageXOffset ? window.pageXOffset : window.scrollX);
        now.Y = document.all ? (!de.scrollTop ? b.scrollTop : de.scrollTop) : (window.pageYOffset ? window.pageYOffset
                : window.scrollY);
        return now;
    },
    isEmpty : function(str) {
        if (str == undefined || str == null || str === "" || str == "undefined" || str == "null") {
            return true;
        } else {
            return false;
        }
    },
    /**
     * Validation 처리를 위한 Object
     */
    Validator : {
        /**
         * common.Validator.isNumber()
         * 
         * 해당 필드 값이 숫자인지 여부를 검사 함.
         * 
         * 사용 예) common.Validator.isNumber("#elId", "값을 확인 하세요."); 일때 다음의 동작 실행
         * if($("#elId").val() != 숫자) { alert("값을 확인 하세요."); $("#elId").focus(); }
         * 
         * 
         * 
         * @param jqPath :
         *            Element의 Jquery Path
         * @param message :
         *            입력값 오류일때 표시할 Message 값
         * 
         * @return true(정상) or false(오류)
         * 
         * 
         */
        isNumber : function(jqPath, message) {
            var obj = $(jqPath);
            var value = obj.val();
            var isNumber = value.isNumber();
            if (!(isNumber)) {
                alert(message);
                obj.focus();
            }
            return isNumber;
        }
    },
    /**
     * timeStamp 데이타를 날짜 포맷으로 변환
     */
    formatDate : function(timeStamp, format) {
        var newDate = new Date();
        newDate.setTime(timeStamp);
        var formatDate = newDate.format(format);

        return formatDate;
    },

    loadingLayerIntervalId : 0,

    showLoadingLayer : function(isOpacity) {

        // if (common.app.appInfo != undefined && common.app.appInfo.isapp) {
        // //앱인 경우 앱에서 띄우도록 함
        // common.app.callShowLoadingBar("Y");
        // return;
        // }

        if ($("#mLoading").length > 0) {
            return;
        }

        var style = "";
        if (isOpacity == false) {
            style = " style=\"opacity:0;\"";
        }

        var loadingHtml = "<div id=\"mLoading\"><span class=\"loading_ico\">로딩중</span></div>";// dim
                                                                                                // 관련
                                                                                                // 내용
                                                                                                // 삭제
        $("body").append(loadingHtml);

        // 로딩이미지 배열
        var img_arr = [ _imgUrl + 'comm/loading_1.png', _imgUrl + 'comm/loading_2.png', _imgUrl + 'comm/loading_3.png',
                _imgUrl + 'comm/loading_4.png', _imgUrl + 'comm/loading_5.png', _imgUrl + 'comm/loading_6.png' ];

        var load_val = true;
        var arr_no = 1;
        var show = $('.loading_ico').show()

        $('.loading_ico').css({
            'background-image' : 'url(' + img_arr[0] + ')'
        });
        common.loadingLayerIntervalId = setInterval(function() {
            // console.log("showLoadingLayer");
            if (load_val) {
                $('.loading_ico').css({
                    'transform' : 'rotateY(0deg)'
                });
                load_val = false;
            } else {
                if (arr_no >= 6)
                    arr_no = 0;
                $('.loading_ico').css({
                    'background-image' : 'url(' + img_arr[arr_no] + ')',
                    'transform' : 'rotateY(0)'
                });
                arr_no++;
                load_val = true;
            }
        }, 90);

        setTimeout(function() {
            common.hideLoadingLayer();
        }, 15000);
    },

    hideLoadingLayer : function() {
        // if (common.app.appInfo != undefined && common.app.appInfo.isapp) {
        // setTimeout(function() {
        // //앱인 경우 앱에서 띄우도록 함
        // common.app.callShowLoadingBar("N");
        // }, 500);
        // return;
        // }

        if ($("#mLoading").length < 1) {
            return;
        }

        setTimeout(function() {
            clearInterval(common.loadingLayerIntervalId);
            $("#mLoading").remove();
        }, 500);
    },
    // showLoadingLayer : function(isOpacity) {
    //        
    // // if (common.app.appInfo != undefined && common.app.appInfo.isapp) {
    // // //앱인 경우 앱에서 띄우도록 함
    // // common.app.callShowLoadingBar("Y");
    // // return;
    // // }
    //        
    // if ($("#mLoading").length > 0) {
    // return;
    // }
    //
    // var style = "";
    // if (isOpacity == false) {
    // style = " style=\"opacity:0;\"";
    // }
    //
    // var loadingHtml = "<div id=\"mLoading\"><span class=\"loading_ico\"><img
    // src=\"" + _imgUrl + "comm/loading_64x64.gif\"/></span><div class=\"dim\""
    // + style + "></div></div>";
    // $("body").append(loadingHtml);
    //
    //
    // },
    //
    // hideLoadingLayer : function() {
    // // if (common.app.appInfo != undefined && common.app.appInfo.isapp) {
    // // setTimeout(function() {
    // // //앱인 경우 앱에서 띄우도록 함
    // // common.app.callShowLoadingBar("N");
    // // }, 500);
    // // return;
    // // }
    //        
    // if ($("#mLoading").length < 1) {
    // return;
    // }
    //
    // setTimeout(function() {
    // $("#mLoading").remove();
    // }, 500);
    // },

    popupCallback : '',

    popFullOpen : function(title, _popCallback) {
        $(window).scrollTop(0.0); // 추가부분

        $('#pop-full-title').html(title);
        $('body').css({
            'background-color' : '#fff'
        }); /* 2016-12-12 퍼블리싱 수정 반영 */
        $('#pop-full-wrap').show();
        $('#mWrapper').hide();

        this.popupCallback = _popCallback;
    },

    popFullClose : function() {
        $('body').css({
            'background-color' : '#eee'
        }); /* 2016-12-12 퍼블리싱 수정 반영 */
        $('.popFullWrap').hide();
        $('.popFullWrap').removeClass('outline');// 쿠폰 하이라이트 제거
        $('#mWrapper').show();

        window.scroll(0, common.scrollPos);

        // 웹 접근성 popfocus 삭제( 2017-05-11 )
        $("a[data-focus~=on]").focus(); // 표시해둔 곳으로 초점 이동
        $("button[data-focus~=on]").focus(); // 표시해둔 곳으로 초점 이동
        window.setTimeout(function() {
            $("a[data-focus~=on]").removeAttr("data-focus");
            $("button[data-focus~=on]").removeAttr("data-focus");
            var lyLocalScroll = localStorage.getItem('lyScrollSet');
            if (lyLocalScroll != null) {
                $(document).scrollTop(lyLocalScroll);
                localStorage.removeItem('lyScrollSet');
            }
        }, 100); // 

        if (this.popupCallback == '' || typeof this.popupCallback != 'function')
            return;

        this.popupCallback();
    },

    popLayerOpen : function(IdName) {

        sessionStorage.setItem("scrollY_popLayer", common.getNowScroll().Y);
        console.log(sessionStorage.getItem("scrollY_popLayer"));

        var winH = $(window).height() / 2;
        var popLayer = ('#' + IdName);
        $(popLayer).find('.popCont').css({
            'max-height' : winH
        });

        var popPos = $(popLayer).height() / 2;
        var popWid = $(popLayer).width() / 2;
        $(popLayer).css({
            'left' : '50%',
            'margin-left' : -(popWid),
            'top' : '50%',
            'margin-top' : -(popPos)
        }).show().parents('body').css({
            'overflow' : 'hidden'
        });
        $('.dim').show();

        $('.dim').bind('click', function() {
            common.popLayerClose(IdName);
        });
        // 가세로 변경
        $(window).resize(function() {
            winH = $(window).height() / 2;
            $(popLayer).find('.popCont').css({
                'max-height' : winH
            });
            popPos = $(popLayer).height() / 2;
            popWid = $(popLayer).width() / 2;
            $(popLayer).css({
                'left' : '50%',
                'margin-left' : -(popWid),
                'top' : '50%',
                'margin-top' : -(popPos)
            })
        });
        // sns 별도처리
        if (IdName == 'SNSLAYER') {
            $(popLayer).css({
                'left' : '0',
                'margin-left' : '0'
            })
        }
        ;

        $("body").css("overflow", "hidden");

        // 앱 호출
        setTimeout(function() {
            common.app.callMenu("Y");
        }, 100);
    },

    /* 0001063: MO_상품 상세 페이지 > 레이어창 팝업시 화면 밀림 현상 */
    popLayerOpen2 : function(IdName) {

        sessionStorage.setItem("scrollY_popLayer", common.getNowScroll().Y);
        console.log(sessionStorage.getItem("scrollY_popLayer"));
        
        if($('#toprvPoph').length > 0){
        	winH = $(window).height() / 2;
        }else{
        	var winH = $(window).height()-100;
        }//탑리뷰어 레이어 높이 조정 2020.07.09
        
        //var winH = $(window).height() / 2;
        //var winH = $(window).height()-100; //레이어 팝업 높이 계산 수정 2020.06.24
        
        var popLayer = ('#' + IdName);
        var popInHd = $(popLayer).find('.popHeader').innerHeight();
        var winH_type = $(window).height() - (popInHd + 40);
        var popContCls = $(popLayer).find('.popCont');

        if (popContCls.hasClass('type_h') == true) {
            $(popLayer).find('.popCont').css({
                'max-height' : winH_type
            });
        } else {
            $(popLayer).find('.popCont').css({
                'max-height' : winH
            });
        }

        var popPos = $(popLayer).height() / 2;
        var popWid = $(popLayer).width() / 2;
        // $(popLayer).css({'left':'50%' , 'margin-left':-(popWid) , 'top':'50%'
        // , 'margin-top':-(popPos)}).show().parents('body').css({'overflow' :
        // 'hidden'});
        $(popLayer).css({
            'left' : '50%',
            'margin-left' : -(popWid),
            'top' : '50%',
            'margin-top' : -(popPos)
        }).show();
        $('.dim').show();

        if(IdName == 'prdOptionPopup'){ //큐레이션 장바구니 영역은 팝업 종료시 별도의 함수 호출을 통해 종료 처리 
        	$('.dim').bind('click', function() {
        		common.popLayerClose('prdOptionPopup');
        		return false;
        	});
        }else{
        	$('.dim').bind('click', function() {
        		common.popLayerClose(IdName);
        	});
        }
        // 가세로 변경
        $(window).resize(function() {
            winH = $(window).height() / 2;
            var popInHd = $(popLayer).find('.popHeader').innerHeight();
            var winH_type = $(window).height() - (popInHd + 40);
            var popContCls = $(popLayer).find('.popCont');

            if (popContCls.hasClass('type_h') == true) {
                $(popLayer).find('.popCont').css({
                    'max-height' : winH_type
                });
            } else {
                $(popLayer).find('.popCont').css({
                    'max-height' : winH
                });
            }
            popPos = $(popLayer).height() / 2;
            popWid = $(popLayer).width() / 2;
            $(popLayer).css({
                'left' : '50%',
                'margin-left' : -(popWid),
                'top' : '50%',
                'margin-top' : -(popPos)
            })
        });
        // sns 별도처리
        if (IdName == 'SNSLAYER') {
            $(popLayer).css({
                'left' : '0',
                'margin-left' : '0'
            })
        }
        ;

        // $("body").css("overflow", "hidden");

        // 앱 호출
        setTimeout(function() {
            common.app.callMenu("Y");
        }, 100);
    },
    
    prdOptPopLayerOpen : function(IdName, pageId) {
    	
    	var winH = $(window).height()-100; //수정함	  
	    var popLayer = ('#'+IdName);
		$(popLayer).find('.popCont').css({'max-height': winH});
	
		var popPos = $(popLayer).height()/2;
		var popWid = $(popLayer).width()/2;
		
		if (pageId == "giftMain") { // 기프트관만 별도 처리
            $(popLayer).css({'left':'50%', 'margin-left':-(popWid), 'top':'50%', 'margin-top':-(popPos)}).show();
        } else {
            $(popLayer).css({'left':'50%', 'margin-left':-(popWid), 'top':'50%', 'margin-top':-(popPos)}).show().parents('body').css({'overflow' : 'hidden'});
        }

		$('.dim').show();
		
		$('.dim').bind('click', function(){
			common.popLayerClose(IdName);
		});
	
	
		$(window).resize(function(){
			winH = $(window).height()/2;
		   $(popLayer).find('.popCont').css({'max-height': winH});
			popPos =$(popLayer).height()/2;
			popWid = $(popLayer).width()/2;
			$(popLayer).css({'left':'50%' , 'margin-left':-(popWid) , 'top':'50%' , 'margin-top':-(popPos)})
		});
	 
		
		//sns 별도처리
		if(IdName =='SNSLAYER'){
		   $(popLayer).css({'left':'0' , 'margin-left': '0'})
		};
    },

    popLayerClose : function(IdName) {
        // 선물하기 옵션변경 팝업인 경우 분기 처리
        if($('#' + IdName).hasClass("popupLayerWrapGift")){
            common.popLayerClosePresentOption(IdName);
        }
        
        var popLayer = ('#' + IdName);
        // $(popLayer).hide().parents('body').css({'overflow' : 'visible'});
        $(popLayer).hide();
        //$("body").css("overflow", "visible");
        $("body").removeAttr('style');

        try {
            var varNowScrollY = parseInt(sessionStorage.getItem("scrollY_popLayer"));

            if ((varNowScrollY > 0)) {
                $(window).scrollTop(varNowScrollY);
                sessionStorage.removeItem("scrollY_popLayer");
            }
        } catch (e) {
        }

        $('.dim').hide();

        // 웹 접근성 popfocus 삭제 ( 2017-05-11 )
        $("a[data-focus~=on]").focus(); // 표시해둔 곳으로 초점 이동
        $("button[data-focus~=on]").focus(); // 표시해둔 곳으로 초점 이동
        window.setTimeout(function() {
            $("a[data-focus~=on]").removeAttr("data-focus");
            $("button[data-focus~=on]").removeAttr("data-focus");
        }, 100); // 

        // 앱 호출
        setTimeout(function() {
            common.app.callMenu("N");

            // 바이오 로그인 팝업 닫은 경우 앱에 푸시 수신 동의 팝업 오픈 요청
            setTimeout(function() {
                if (IdName == 'touchLogin') {
                    common.app.callBioLoginAgrCallBack();
                }
            }, 400);
        }, 100);

    },
    
    popLayerClosePresentOption : function(IdName){
        var popLayer = ('#' + IdName);
        //$(popLayer).hide().parents('body').css({'overflow-y' : 'auto'});
        common.unlockBody();
        $(popLayer).hide();
        $('.dim').hide();
        
        // 선물하기인 경우 클래스 삭제 필요
        $(popLayer).removeClass("popupLayerWrapGift");
    },
    
    popLayerRecoOffset : function() {
    	/*var winH = $(window).height() / 2;
        var popLayer = ('#cardBenefitInfo');*/
        
        var wHeight = $(window).height();
        var popLayer = $("#cardBenefitInfo");
        var popinner = popLayer.find('.popCont');
        var popHeight = $(popLayer).height();
        var popPos = popHeight/2;
        var popWid = $(popLayer).width()/2;
        if(popHeight>=wHeight){
            var inHeight = wHeight - 50;
            popinner.css({'max-height': inHeight});
            var popPos = $(popLayer).height()/2;
        }
        /*var popPos = $(popLayer).height() / 2;
        var popWid = $(popLayer).width() / 2;*/
        $(popLayer).css({
            'left' : '50%',
            'margin-left' : -(popWid),
            'top' : '50%',
            'margin-top' : -(popPos)
        });
    },
   
    popLayerOpenNoReSize : function(IdName) {

        sessionStorage.setItem("scrollY_popLayer", common.getNowScroll().Y);
        console.log(sessionStorage.getItem("scrollY_popLayer"));

        var winH = $(window).height() / 2;
        var popLayer = ('#' + IdName);

        var popPos = $(popLayer).height() / 2;
        var popWid = $(popLayer).width() / 2;
        $(popLayer).css({
            'left' : '50%',
            'margin-left' : -(popWid),
            'top' : '50%',
            'margin-top' : -(popPos)
        }).show().parents('body').css({
            'overflow' : 'hidden'
        });
        $('.dim').show();

        $('.dim').bind('click', function() {
            common.popLayerClose(IdName);
        });
        // 가세로 변경
        $(window).resize(function() {
            winH = $(window).height() / 2;
            popPos = $(popLayer).height() / 2;
            popWid = $(popLayer).width() / 2;
            $(popLayer).css({
                'left' : '50%',
                'margin-left' : -(popWid),
                'top' : '50%',
                'margin-top' : -(popPos)
            })
        });
        // sns 별도처리
        if (IdName == 'SNSLAYER') {
            $(popLayer).css({
                'left' : '0',
                'margin-left' : '0'
            })
        }
        ;

        $("body").css("overflow", "hidden");

        // 앱 호출
        setTimeout(function() {
            common.app.callMenu("Y");
        }, 100);
    },
    
    popLayerOpenPresentOption : function(IdName){
        var winH = $(window).height()/2;
        var popLayer = ('#' + IdName);
        var popWid = $(popLayer).width()/2;
        var popPos = $(popLayer).height()/2;
        
        // 선물하기인 경우 클래스 추가 필요
        $(popLayer).addClass("popupLayerWrapGift");

        common.lockBody();

        $(popLayer).css('opacity', '0').show();
        
        setTimeout(function(){
            popPos = $(popLayer).height()/2;
            $(popLayer).css({'left':'50%' , 'margin-left':-(popWid) , 'top':'50%' , 'margin-top':-(popPos), 'opacity' : '1'});
        }, 50);

        var heightSetting = function(){
            var winH = $(window).height()/2;
            $(popLayer).find('.popCont').removeAttr('style');
            var popLayerH = $(popLayer).find(".popCont").outerHeight();
            
            if (window.innerWidth > window.innerHeight) {
                $(popLayer).find('.popCont').css({'max-height': winH, 'height' : 'auto'});
            } else {
                $(popLayer).find('.popCont').css({'max-height': '', 'height' : popLayerH});
            }
        }
        
        heightSetting();
        
        $(popLayer).find('.select_box a').on('click', function(){
            winH = $(window).height()/2;
            heightSetting();
            popPos =$(popLayer).height()/2;
            popWid = $(popLayer).width()/2;
            $(popLayer).css({'left':'50%' , 'margin-left':-(popWid) , 'top':'50%' , 'margin-top':-(popPos)})
        })

        $('.dim').show();
        $('.dim').bind('click', function(){
            common.popLayerClose(IdName);
        });

        $(window).resize(function(){
            winH = $(window).height()/2;
            heightSetting();
            popPos =$(popLayer).height()/2;
            popWid = $(popLayer).width()/2;
            $(popLayer).css({'left':'50%' , 'margin-left':-(popWid) , 'top':'50%' , 'margin-top':-(popPos)})
        });
    },
    
    popLayerCloseOption : function(IdName){ 
    	/*
        var popLayer = ('#' + IdName);
        $(popLayer).find(".choice").html('상품을 선택해주세요.');
     	$("#"+IdName+" input[name='goodsNo'").val('');
     	$("#"+IdName+" input[name='itemNo'").val('');
        common.unlockBody();
        $(popLayer).hide();
        $('.dim').hide();
        */
		var popLayer = $(".popLayerWrap").not("#prdSdLayer"); // 상품상세 - 장바구니 담기 후 큐레이션 레이어 제외
		$(popLayer).hide().parents('body').css({'overflow' : 'visible'});
		
		$("body").removeAttr('style');
		
		$('.dim').hide();
    },
    
    lockBody : function() {
        var $docEl = $('html, body');
        var $wrap = $('#mWrapper');

        if(window.pageYOffset) {
            optionScrollTop = window.pageYOffset;

            $wrap.css({
                position: 'fixed',
                top: - (optionScrollTop)
            });
        }

        $docEl.css({
            height: "100%",
            overflow: "hidden"
        });
    },

    unlockBody : function() {
        var $docEl = $('html, body');
        var $wrap = $('#mWrapper');

        $docEl.css({
            height: "",
            overflow: ""
        });

        $wrap.css({
            position: '',
            top: ''
        });

        window.scrollTo(0, optionScrollTop);
        window.setTimeout(function () {
            optionScrollTop = null;
        }, 0);
    },

    popFocus : function() {

        // 초기 실행시 data-focus 삭제
        $("a[data-focus~=on]").removeAttr("data-focus");
        $("button[data-focus~=on]").removeAttr("data-focus");

        $("a, button").click(function() {
            var el = $(this);
            el.attr('data-focus', 'on'); // 레이어 팝업이 닫힐 때를 위한 표시 - 웹접근성

            /* modalPopup팝업 위치조정 */
            window.setTimeout(function() {

                if ($("#pop-full-wrap").css("display") == 'block') {
                    var target = $("#pop-full-wrap");
                } else if ($("#LAYERPOP01").css("display") == 'block') {
                    var target = $("#LAYERPOP01");
                } else if ($("#SNSLAYER").css("display") == 'block') {
                    var target = $("#SNSLAYER");
                } else if ($("#allMenu").hasClass("show")) {
                    var target = $("#allMenu");
                } else if ($("#fulsizePop").css("display") == 'block') {
                    var target = $("#fulsizePop");
                } else {
                }

                if (target != undefined) {

                    var win_height = $(window).height();
                    var pop_height = target.height();
                    var top_value = $(window).scrollTop() + (win_height - pop_height) / 2;

                    target.attr("tabindex", "0");
                    target.focus();
                }
            }, 500);// ajax 팝업을 고려한 딜레이 추가
            /* [end]: modalPopup팝업 위치조정 */
        });

    },

    /** 현재 스크롤 위치 저장 * */
    setScrollPos : function(scrollPos) {
        common.scrollPos = $(document).scrollTop();
    },
    /** 레이어팝업 클릭 시, 스크롤 위치값 localstorage 저장 * */
    setScrollPos2 : function() {
        var scrollT = $(document).scrollTop();
        localStorage.setItem('lyScrollSet', scrollT);
    },
    /** 히스토리 백 버튼 Bind * */
    historyBackBind : function() {
        $("#backBtn").click(function() {
            // if(common.app.appInfo != undefined && common.app.appInfo.isapp){
            // common.app.historyBack();
            // }
            history.back();
        });
    },

    isLoginPageChk : function(url) {
        if (history.state == null) {
            history.replaceState({
                status : "login"
            }, null, null);
            history.pushState({
                status : "loginCheck"
            }, null, null);
        }
        $(window).bind("popstate", function() {
            if (history.state != null && history.state.status == "login") {
                // if(!common.isEmpty(url)){
                // console.log("url존재:"+url);
                // location.href= url;
                // }else{
                // console.log("url없음:"+url);
                location.href = _baseUrl + "main/main.do";
                // }
            }
        });
    },

    setLazyLoad : function(type) {

        if (type == undefined || type == "seq") {
            // lazyload - 이미지스크롤이벤트
            // $(document).find("img.seq-lazyload").lazyload({
            // //effect : "fadeIn",
            // event : "sequential"
            // });

            // 로딩 된 이미지에 중복으로 lazyload를 바인드하지 않도록 하기 위해 클래스명 변경
            // $(document).find("img.seq-lazyload").removeClass("seq-lazyload").addClass("completed-seq-lazyload");

            lazyloadSeq.load("img.seq-lazyload", "seq-lazyload");
        }

        if (type == undefined || type == "scr") {
            lazyloadSeq.load("img.scroll-lazyload", "scroll-lazyload");

            // // lazyload - 이미지스크롤이벤트
            // $(document).find("img.scroll-lazyload").lazyload({
            // effect : "fadeIn",
            // threshold : 1000
            // });
            //
            // //로딩 된 이미지에 중복으로 lazyload를 바인드하지 않도록 하기 위해 클래스명 변경
            // $(document).find("img.scroll-lazyload").removeClass("scroll-lazyload").addClass("completed-scroll-lazyload");
        }

        $(document).resize();

    },

    // 재입고 알림 팝업 오픈
    openStockAlimPop : function(goodsNo, itemNo) {
        if (common.loginChk()) {
            var url = _baseUrl + "goods/getAlertStockAjax.do";
            var data = {
                goodsNo : goodsNo,
                itemNo : itemNo
            };
            common.Ajax.sendRequest("POST", url, data, common._callBackAlearStockForm);
        }
    },

    // 재입고 알림 콜백
    _callBackAlearStockForm : function(res) {
        $("#pop-full-wrap").html(res);
        common.popFullOpen("재입고알림 신청", "");

        // 재입고 팝업 닫기 버튼 클릭 시 이미지 기술서 pinchZoom Init
        $(".btnClose").click(function() {
            $(".controlHolder").empty();
            $("div#timpHtml").find("div#TEMP_HTML").attr("style", "");
            $("div#test00").html($("div#timpHtml").html().replace("TEMP_HTML", "markerTest"));
            $("#markerTest").pinchzoomer();
        });

    },

    // 오프라인 재입고 알림 팝업 오픈 오늘드림 고도화 2019-12-30
    openStockOffStoreAlimPop : function(goodsNo, itemNo, strNo) {
        if (common.loginChk()) {
            var url = _baseUrl + "goods/regAlertStockOffStoreJson.do";
            var data = {
                goodsNo : goodsNo,
                itemNo : itemNo,
                strNo : strNo
            };
            common.Ajax.sendRequest("POST", url, data, common._callBackAlearOffStoreStockForm);
        }
    },

    // 오프라인 재입고 알림 콜백 오늘드림 고도화  2019-12-30
    _callBackAlearOffStoreStockForm : function(res) {
        alert(res);
    },
    
    // 행사안내 팝업 오픈
    openEvtInfoPop : function(promNo, promKndCd, promCond, goodsNo, itemNo) {

        var quickYn = $(":input:radio[name=qDelive]:checked").val();
        if (typeof (quickYn) == "undefined") {
            quickYn = $("#quickYn").val();
        }

        var url = _baseUrl + "goods/getGoodsPromEvtInfoAjax.do";
        var data = {
            promNo : promNo,
            promKndCd : promKndCd,
            promCond : promCond,
            goodsNo : goodsNo,
            itemNo : itemNo,
            quickYn : quickYn
        };
        if (promCond == '1+1' || promCond == 'A+B' || promCond == 'GIFT') {
            common.Ajax.sendRequest("POST", url, data, common._callBackSimpleGoodsEvtInfo);
        } else {
            common.Ajax.sendRequest("POST", url, data, common._callBackGoodsEvtInfo);
        }
    },

    // 행사안내 콜백 ( 1+1 이 아닐 경우 )
    _callBackGoodsEvtInfo : function(res) {
        $("#pop-full-wrap").html(res);
        common.popFullOpen("행사안내", "");
    },

    // 행사안내 콜백 ( 1+1 일 경우 )
    _callBackSimpleGoodsEvtInfo : function(res) {
        $("#layerPop").html(res);
        common.popLayerOpen("LAYERPOP01");
    },

    isMainHome : function() {
        try {
            if (location.href.endWith("/main/main.do#0")) {
                return true;
            }

            return false;
        } catch (e) {
            return false;
        }
    },

    bindGoodsListLink : function(filterSelectorStr) {
        var classNm = filterSelectorStr == undefined ? "" : filterSelectorStr + " ";
        $(classNm + ".goodsList").unbind("click");
        $(classNm + ".goodsList").bind("click", function(e) {
            e.preventDefault();
            
            var trackingCd = $(this).attr("name");
            // 판매종료 여부체크
            var allSoldOutChk = $(this).find(".img").children("span").hasClass("allsoldOut");
            if (allSoldOutChk == false) {
            	if(trackingCd != null && trackingCd != undefined ){
            		common.link.moveGoodsDetail($(this).attr("data-ref-goodsNo"), $(this).attr("data-ref-dispCatNo"), trackingCd);
            	}else{
            		common.link.moveGoodsDetail($(this).attr("data-ref-goodsNo"), $(this).attr("data-ref-dispCatNo"));
            	}
            }
        });
        
        // 추천/인기 기획전 UI 개선으로 class 추가 - [3336021] (메인 페이지 개편) 기획전 개선 건(CHY)
        $(classNm + ".newGoodsList").unbind("click");
        
        $(classNm + ".newGoodsList").bind("click", function(e) {
        	e.preventDefault();
        	
        	common.link.moveGoodsDetail($(this).attr("data-ref-goodsNo"), $(this).attr("data-ref-dispCatNo"));
        });
        
        // [3383769] (메인 페이지 개편) 올알랭 신규 건 (CSH)
        $(classNm + ".allalainGoodsList").unbind("click");
        
        $(classNm + ".allalainGoodsList").bind("click", function(e) {
        	e.preventDefault();
        	
        	// [3389141] (영역별 매출분석) 오특, 검색, 베스트, 메인 추가(CHY)
        	var trackingCd = $(this).attr("name");
        	common.link.moveGoodsDetail($(this).attr("data-ref-goodsNo"), $(this).attr("data-ref-dispCatNo"), trackingCd);
        });
        // [3383769] END

        $(classNm + ".item").unbind("click");

        $(classNm + ".item").bind("click", function(e) {
            e.preventDefault();

            // 판매종료 여부체크
            var allSoldOutChk = $(this).find(".img").children("span").hasClass("allsoldOut");

            if (allSoldOutChk == false) {
                common.link.moveGoodsDetail($(this).attr("data-ref-goodsNo"), $(this).attr("data-ref-dispCatNo"));
            }
        });

        $(classNm + ".goodsListLogin").bind("click", function(e) {
            e.preventDefault();
            // 로그인 성인체크 로그인성인
            common.link.moveGoodsDetail($(this).attr("data-ref-goodsNo"), $(this).attr("data-ref-dispCatNo"));
        });

        $(classNm + ".goodsListAuth").bind("click", function(e) {
            e.preventDefault();
            // 로그인 성인체크
            common.link.moveGoodsDetail($(this).attr("data-ref-goodsNo"), $(this).attr("data-ref-dispCatNo"));
        });
    },

    /* 2018.12.18 바코드 스캔 추가 */
    bindGoodsListBarcodeLink : function(filterSelectorStr) {
        var classNm = filterSelectorStr == undefined ? "" : filterSelectorStr + " ";

        $(classNm + ".goodsList").unbind("click");

        $(classNm + ".goodsList").bind("click", function(e) {
            e.preventDefault();

            // 판매종료 여부체크
            var allSoldOutChk = $(this).find(".img").children("span").hasClass("allsoldOut");

            if (allSoldOutChk == false) {
                common.link.moveGoodsDetailBarcode($(this).attr("data-ref-itemNo"));
            }
        });

        $(classNm + ".goodsListLogin").bind("click", function(e) {
            e.preventDefault();
            // 로그인 성인체크 로그인성인
            common.link.moveGoodsDetailBarcode($(this).attr("data-ref-itemNo"));
        });

        $(classNm + ".goodsListAuth").bind("click", function(e) {
            e.preventDefault();
            // 로그인 성인체크
            common.link.moveGoodsDetailBarcode($(this).attr("data-ref-itemNo"));
        });
    },

    /** 상품평 삭제 전 처리 **/
    // 오프라인리뷰관련추가
       moveGoodsGdasDel : function(gdasSeq, goodsNo, lgcGoodsNo, pntPayYn, retUrl, gdasSctCd){
           
           var loginCheck = common.loginChk();
           
//           var deleteMessage = '작성하신 상품평을 삭제하시겠습니까?';
           var deleteMessage = '작성한 리뷰를 삭제하시겠습니까?';
           
           if(!loginCheck) return;
           
           if(!confirm(deleteMessage)) return;
           
           common.delGdasProceess(gdasSeq, goodsNo, lgcGoodsNo, retUrl, gdasSctCd);
       },
       
       /** 상품평 삭제 처리 **/
    // 오프라인리뷰관련추가
       delGdasProceess : function(gdasSeq, goodsNo, lgcGoodsNo, retUrl, gdasSctCd){
               
           var data = {gdasSeq : gdasSeq, goodsNo:goodsNo, retUrl: retUrl, gdasSctCd : gdasSctCd, lgcGoodsNo : lgcGoodsNo};
           //jsTemplet
           common.Ajax.sendJSONRequest("POST"
               , _baseUrl + "mypage/delGdasJson.do?gdasSeq="+gdasSeq
               , data
               , common.afterDelGoodsGdasSuccess
           );
       },

    /** 상품평 삭제 후 처리 * */
    afterDelGoodsGdasSuccess : function(data) {

        if (data.resultCd == "000") {
            // alert("성공적으로 삭제하였습니다.");
            alert("삭제 완료");

            if (data.retUrl == "") {
                location.href = _baseUrl + '/index.do';
            } else {
                location.href = data.retUrl;
            }
        } else {
            alert("삭제가 실패하였습니다.");
        }
    },

    /** 개인정보취급방침 * */
    getPrivacy : function() {

    },

    /** 상품 사이즈별 이미지경로 생성 * */
    getSizeImgUrl : function(size, imgUrl) {

        var goodsPath = "", imgSctCd = "", sizePath = "", prefixPath = _goodsImgUploadUrl;

        var pathArr = imgUrl.split("/");

        // 이미지 구분 코드를 구별하기 위한 Split
        if (pathArr.length > 1) {
            imgSctCd = pathArr[0];
        }

        // 상세 이미지일 경우 사이즈 패스 필요 없음
        if (imgSctCd != "40") {
            sizePath = size + "/";
        }

        // imgUrl + sizePath + goodsImgUrl 형식의 타입으로 Return
        // 상세 sizePath가 ""로 들어감
        goodsPath = prefixPath + sizePath + imgUrl;

        return goodsPath;
    },

    // 드래그 이벤트 막기
    preventDrag : function() {
        $('.userSelectnone').css('use-select', 'none');
    },

    // 행사안내 팝업 닫기
    closePromEvtPop : function() {

        common.popFullClose();

        if (location.href.indexOf("getCart.do") > 0 && common.cart.regCartCnt > 0) {
            var linkCartNo = location.href.substring(location.href.indexOf("cartNo=") + 7);
            var sumCartNo = "";

            if (linkCartNo != "") {
                if (cartNosForDirectCart != "") {
                    sumCartNo = linkCartNo + "," + cartNosForDirectCart;
                } else {
                    sumCartNo = linkCartNo;
                }
            }

            cartNosForDirectCart = "";
            common.cart.regCartCnt = 0;

            if (location.href.indexOf("cartNo=") > 0) {
                location.href = _secureUrl + "cart/getCart.do?cartNo=" + sumCartNo;
            } else {
                window.location.reload();
            }
        }
    },

    /**
     * 이미지 공통 처리
     */
    errorImg : function(obj) {
        obj.src = _imgUrl + "/comm/noimg_550.gif";
        obj.onerror = '';
    },
    errorProfileImg : function(obj) {
        obj.src = _imgUrl + "/comm/my_picture_base.jpg";
        obj.onerror = '';
    },
    errorBrandImg : function(obj) {
        obj.src = _imgUrl + "/comm/noimage_brandshop.png";
        obj.onerror = '';
    },
    errorCatImg : function(obj) {
    	obj.src = _imgUrl + "/comm/noimg_550.gif";
        obj.onerror = '';
        obj.parentElement.className = 'img no-img';
    },
    errorCrcImg : function(obj) {
    	obj.src = _imgUrl + "/category/brand_default.png";
    	obj.onerror = '';
    	obj.parentElement.className = 'img no-img';
    },
    imgLoads : function(obj,size){
        var _thisImg = $(obj);
        if(_thisImg.attr('src').indexOf('?') == -1){
            _thisImg.attr('src',common.resizeImg(obj, size));
        }
    },
    errorResizeImg : function(obj, size) {
        obj.src = _fileUploadUrl + "comm/noimg_550.gif?RS="+size;
        obj.onerror = '';
    },
    errorResizeProfileImg : function(obj, size) {
        obj.src = _fileUploadUrl + "comm/my_picture_base.jpg?RS="+size;
        obj.onerror = '';
    },
    resizeImg : function(obj, thum_size){
        $('#reviewBestDiv').show();//CS 높이 체크 위해 추가
        var _thisImg = $(obj);  
        var _thisImgUrl = _thisImg.attr('src');
        var _thiswidth = _thisImg.width(), _thisHeight = _thisImg.height();
        var _resize_size = thum_size, _resize_ratio = 2;
        var rs_width = 0, rs_height = 0, cs_width = 0, cs_height = 0;

        if(_thiswidth > _thisHeight){
            if(_thisHeight > _resize_size){
                rs_width = _resize_size * _resize_ratio, rs_height = 0; 
                cs_width = _resize_size, cs_height = _resize_size;
            }else if(_thisHeight <= _resize_size){
                //rs_width = _resize_size * _resize_ratio, rs_height = _resize_size * _resize_ratio;
                //cs_width = _resize_size, cs_height = _resize_size;
                rs_width = _resize_size * _resize_ratio, rs_height = 0;
                cs_width = _thisHeight, cs_height = _thisHeight;
            }
        }else if(_thiswidth < _thisHeight){
            if(_thiswidth > _resize_size){
                rs_width = _resize_size * _resize_ratio, rs_height = 0; 
                cs_width = _resize_size, cs_height = _resize_size;
            }else if(_thiswidth <= _resize_size){
                //rs_width = _resize_size * _resize_ratio, rs_height = _resize_size * _resize_ratio;
                //cs_width = _resize_size, cs_height = _resize_size;
                rs_width =_thiswidth, rs_height = 0;
                cs_width = _thiswidth, cs_height = _thiswidth;
            }
        }else if(_thiswidth == _thisHeight){
            rs_width = _resize_size, rs_height = _resize_size;
            cs_width = _resize_size, cs_height = _resize_size;
        }
        return_url = _thisImgUrl+'?RS='+parseInt(rs_width)+'x'+parseInt(rs_height)+'&CS='+parseInt(cs_width)+'x'+parseInt(cs_height);
        setTimeout(function() {
            //웹로그 바인딩
            //_thisImg.css('visibility','visible')
        }, 100);

        // 2020-07-28 ---- 강제로 show를하는 거지같은경우
        try{
            let tabClass = "#main-swiper-tab3" + " ";
            let dispCatNo = $(tabClass+"#mTab li.on").attr("data-ref-dispCatNo");
            if(dispCatNo == '900000100100002'){
                // 리뷰 베스트인 경우
                $(tabClass+"#reviewBestDiv").show();
            }else{
                // 판매 베스트인 경우
                $(tabClass+"#reviewBestDiv").hide();
            }
        }catch(e){
        	console.error("[2020-07-28]", e);
        }
        /////// ----

        return return_url;
    },
    onLoadProfileImg : function(obj, size){
        var _thisProfileImg = $(obj);
        if($(obj)[0].src.indexOf("?CS=") > -1){
            var temp = $(obj)[0].src.substring(0,$(obj)[0].src.indexOf("?CS="));
            $(obj)[0].src = temp;
        }
        _thisProfileImg.siblings('div.thum').find('img.profileThum_s').attr('src',common.profileImgResize(obj, size));
    },
    profileImgResize :  function(obj, thum_size){
        var _thisImg = $(obj);  
        var _thisImgUrl = _thisImg.attr('src');
        var _thiswidth = _thisImg.width(), _thisHeight = _thisImg.height();
        var _resize_size = thum_size, _resize_ratio = 0;
        var rs_width = 0, rs_height = 0, cs_width = 0, cs_height = 0;
        
        if(_thiswidth > _thisHeight){
            if(_thisHeight > _resize_size){
                _resize_ratio = _resize_size / _thisHeight;
                rs_width = _thiswidth * _resize_ratio, rs_height = _resize_size;
                cs_width = _resize_size, cs_height = _resize_size;
            }else if(_thisHeight < _resize_size){
                rs_width = _thiswidth, rs_height = _thisHeight;
                cs_width = _thisHeight, cs_height = _thisHeight;
            }
        }else if(_thiswidth < _thisHeight){
            if(_thiswidth > _resize_size){
                _resize_ratio = _resize_size / _thiswidth;
                rs_width = _resize_size, rs_height = _thisHeight * _resize_ratio;
                cs_width = _resize_size, cs_height = _resize_size;
            }else if(_thiswidth < _resize_size){
                rs_width = _thiswidth, rs_height = _thisHeight;
                cs_width = _thiswidth, cs_height = _thiswidth;
            }
        }else if(_thiswidth == _thisHeight){
            if(_thiswidth > _resize_size){
                rs_width = _resize_size, rs_height = _resize_size;
                cs_width = _resize_size, cs_height = _resize_size;
            }else if(_thiswidth < _resize_size){
                rs_width = _thiswidth, rs_height =_thiswidth;
                cs_width = _thiswidth, cs_height = _thiswidth;
            }
        }
        return_url = _thisImgUrl+'?RS='+parseInt(rs_width)+'x'+parseInt(rs_height)+'&CS='+parseInt(cs_width)+'x'+parseInt(cs_height);
        return return_url;
    },
    /** EP 쿠폰 오픈 * */
    epCouponOpen : function() {
        $("#layerPop").html($("#epCouponLayerPop").html());
        common.popLayerOpenNoReSize("LAYERPOP01");
    },

    /**
     * 웹로그
     */
    wlog : function(wlKey) {
        setTimeout(function() {
            try {
                try {
                    if (wlKey == "goods_cart") {
                        n_click_logging(_baseUrl + "cart/regCartJson.do", _baseUrl + "goods/getGoodsDetail.do");
                    } else if (wlKey == "goods_buy") {
                        n_click_logging(_baseUrl + "order/getOrderForm.do", _baseUrl + "goods/getGoodsDetail.do");
                    } else if (wlKey == "home_curation_area") {
                        n_click_logging(_baseUrl + "?clickarea=" + wlKey);
                    }
                } catch (e) {
                }
                n_click_logging(_baseUrl + "?clickspace=" + wlKey);
            } catch (e) {
            }
        }, 10);

        // setTimeout(function() {
        // $.ajax({
        // type: "GET",
        // url: _baseUrl + "common/dummyJson.do?wl_log=" + wlKey,
        // contentType: "application/json;charset=UTF-8",
        // dataType : 'json',
        // async: true,
        // cache: false,
        // success: function(data) {
        // }
        // });
        // }, 10);
    },

    // 정상적인 상태에서 세션스토리지 정보를 리셋함.
    resetSessionStorage : function() {
        var popInfo = sessionStorage.getItem("urgentNoticePop");
        var bannerCloseYn = sessionStorage.getItem("bannerCloseYn");
        var subDispCatNo = sessionStorage.getItem("subDispCatNo");
        var fullPopDispYn = sessionStorage.getItem("fullPopDispYn")
        // 기프트관 2차 jwkim
        var sessionVoteClose = sessionStorage.getItem("sessionVoteClose");
        
        var presentOptionTextCloseYn = sessionStorage.getItem("presentOptionTextCloseYn");
        
        var manBanInfo = sessionStorage.getItem("manBanInfo");
        
        var appBanInfo = sessionStorage.getItem("appBanInfo");
        
        sessionStorage.clear();

        if (popInfo != undefined && popInfo != "undefined") {
            sessionStorage.setItem("urgentNoticePop", popInfo);
        }
        if (bannerCloseYn != undefined && bannerCloseYn != "undefined") {
            sessionStorage.setItem("bannerCloseYn", bannerCloseYn);
        }
        if (subDispCatNo != undefined && subDispCatNo != "undefined") {
            sessionStorage.setItem("subDispCatNo", subDispCatNo);
        }
        // 기프트관 2차 jwkim
        if (sessionVoteClose != undefined && sessionVoteClose != "undefined") {
            sessionStorage.setItem("sessionVoteClose", sessionVoteClose);
        }
        if (presentOptionTextCloseYn != undefined && presentOptionTextCloseYn != "undefined") {
            sessionStorage.setItem("presentOptionTextCloseYn", presentOptionTextCloseYn);
        }
        
        if (fullPopDispYn != undefined && fullPopDispYn != "undefined") {
            sessionStorage.setItem("fullPopDispYn", fullPopDispYn);
        }

        if (manBanInfo != undefined && manBanInfo != "undefined") {
            sessionStorage.setItem("manBanInfo", manBanInfo);
        }
        
        if (appBanInfo != undefined && appBanInfo != "undefined") {
            sessionStorage.setItem("appBanInfo", appBanInfo);
        }

    },

    /**
     * 2019.12.09 | jp1020 장바구니 담기(공통) 상품상세 이외 전역에서 사용 가능
     * 
     */
    gf_regCart : function(obj) {
        var params = $(obj).data();
        if(callOrg == undefined || callOrg == ""){
        	callOrg = $(obj).context.className;
        }
        
        giftPlusItemYn = $(obj).attr('iconClass');
        if (common.loginChk()) {
            // 옵션선택이 있거나, 없거나 일단 화면 진입
            var url = _baseUrl + "common/getCartOptionSelectAjax.do";
            
            // 마이페이지 주문/배송조회 장바구니 기능 개선으로 분기 처리 - [3330196] 올리브영 모바일 주문목록 개선 요청(CHY)
            if(params.loadPage != null && params.loadPage != ""){
            	url += "?loadPage=" + params.loadPage;
            	
            	if(params.totalQty != null && params.totalQty != ""){
            		url += "&totalQty=" + params.totalQty;
            	}
            	
            	// 마이페이지 주문/배송조회 페이지와 자주 구매 상품 페이지 DS 분기 처리 - [3330196] 올리브영 모바일 주문목록 개선 요청(CHY)
            	if(params.loadPage == "order"){
            		common.wlog("mypage_orderlist_addcart");
            	}if(params.loadPage == "often"){
            		common.wlog("mypage_oftenlist_addcart");
            	}
            }

            var tmpItemNo = params.itemNo;

            if (tmpItemNo.length > 3) {
                tmpItemNo = "001";
            }

            var data;

            // 오늘드림 전문관 리스트인 경우 장바구니 클릭시 오늘드림 장바구니에 추가되게끔 하기위해 값 추가
            // quickInfo class는 오늘드림 전문관에서만 사용함
            if ($(this).closest("li").hasClass("quickInfo")) {
                data = {
                    goodsNo : params.goodsNo,
                    itemNo : tmpItemNo,
                    quickYn : "Y"
                };
            } else {
                data = {
                    goodsNo : params.goodsNo,
                    itemNo : tmpItemNo
                };
                
                if(params.quickYn == "Y") {
                    data.quickYn = "Y";
                }
                
                if(callOrg == 'btnbag') {
                	recoCart = "Y";
                }
                
                // 20200827 기프트관 장바구니 분기처리 CBLIM
                if(callOrg == 'btn_basket') {
                	recoCart = "G";
                	giftTrackCode = "Gift_Main_Set";
                } else {
                    giftTrackCode = "";
                }
                
                // 메인페이지 UI 분기처리 - [3383750] (메인 페이지 개편) OY추천상품 개선 건(CSH)
                if(callOrg == 'cart btnbag') {
                	recoCart = "Y";
                }
                
                // 올알랭 추가 - [3383769] (메인 페이지 개편) 올알랭 신규 건 (CSH)
                if(callOrg == 'prd-cart') {
                	recoCart = "Y";
                }

            }
            
            var curaImg = $(obj).closest(".inner").find(".curaimg"); //메인페이지 레코벨 하단
            var curaImg2 = $(obj).closest("li").find(".curaimg"); //메인페이지 레코벨 상단
            var curaImg3 = $(obj).closest("div").find("a.prd_img").find("img"); //마이페이지 주문취소내역
            
            // 마이페이지 주문/배송조회 UI 개선으로 분기 처리 - [3330196] 올리브영 모바일 주문목록 개선 요청(CHY)
            var imgStr = "#" + params.goodsNo + "_" + tmpItemNo;
            var curaImg4 = $(imgStr).find("p.thum").find("a.prd_img").find("img");
            
            // 메인페이지 UI 분기처리 - [3383750] (메인 페이지 개편) OY추천상품 개선 건(CSH)
            var curaImg5 = $(obj).closest(".prod-inner").find(".pic-thumb");
            
            // 올알랭 추가 - [3383769] (메인 페이지 개편) 올알랭 신규 건 (CSH)
            var curaImg6 = $(obj).closest(".prd-item").find(".thumb");
            
            // [3407293] 주목해야 할 브랜드/카테고리 랭킹 개선 건
            var curaImg7 = $(obj).closest(".prod-wrap").find(".pic-thumb");
            
            if (curaImg.length > 0) { //장바구니 옵션 팝업 이미지 호출 용 
            	data.imgSrc = curaImg.attr("src");
            }else if (curaImg.length <= 0 && curaImg2.length > 0 && curaImg3.length <= 0){
            	data.imgSrc = curaImg2.attr("src");
            }else if (curaImg.length <= 0 && curaImg2.length <= 0 && curaImg3.length > 0){
            	data.imgSrc = curaImg3.attr("src");
            }else if (curaImg.length <= 0 && curaImg2.length <= 0 && curaImg4.length > 0){
            	data.imgSrc = curaImg4.attr("src");
            }else if (curaImg.length <= 0 && curaImg2.length <= 0 && curaImg5.length > 0){
            	data.imgSrc = curaImg5.attr("src");
            }else if (curaImg.length <= 0 && curaImg2.length <= 0 && curaImg6.length > 0){
            	data.imgSrc = curaImg6.attr("src");
            }else if (curaImg.length <= 0 && curaImg2.length <= 0 && curaImg7.length > 0){
            	data.imgSrc = curaImg7.attr("src");
            }
            
            if(params.optSelectYn == 'Y'){ //큐레이션 장바구니 옵션팝업에서 선택 버튼 클릭 했을 경우  
            	data.optSelectYn = 'Y';
            }
            
            common.Ajax.sendRequest("POST", url, data, common._callCartOptionSelect);
        }
    },

    // 상품 옵션에 유무에 따른 분기 로직
    _callCartOptionSelect : function(data) {
    	common.cart.scroll = $(window).scrollTop(); // 담기 후 스크롤 위치 이동을 위하여
    	
        var tmpOption = $("<div id=\"tmpOption\">" + data + "</div>");
        // 프로모션 정보 가져오기
        common.cart.promKndCd = tmpOption.find("#promKndCd").val();
        common.cart.promNo = tmpOption.find("#promNo").val();
        common.cart.buyCnt = tmpOption.find("#buyCnt").val();
        common.cart.getItemAutoAddYn = tmpOption.find("#getItemAutoAddYn").val();

        // 옵션 상품의 경우 옵션 레이어 노출 후 옵션상품 선택하는 로직이지만, 기획 요구사항으로 우선 이기능은 제외하고 적용함
        // 2019.12.08 | jp1020
        // if (tmpOption.find("#dupYn").val() != 'Y') {

        // 옵션이 없는 상품일 경우 바로 장바구니 등록
        var cartGoodsNo = tmpOption.find("#paramGoodsNo").val();
        var cartItemNo = tmpOption.find("#paramItemNo").val();
        var ordPsbMinQty = tmpOption.find("#ordPsbMinQty").val();

        // 오늘드림  장바구니 저장하기 위한 값 
        var cartQuickYn = tmpOption.find("#quickYn").val();

        // Y가 아닌경우는 오늘드림 관련 제어가 필요 없기 때문에 N으로 초기화
        if (cartQuickYn != "Y") {
            cartQuickYn = "N";
        }
        
        // 주문/베송조회, 취소/반품/교환 페이지와 자주 구매 상품 페이지에서는 구매한 수량 그대로 장바구니에 추가 - [3330196] 올리브영 모바일 주문목록 개선 요청(CHY)
        if(tmpOption.find("#paramLoadPage").val() == "order" || tmpOption.find("#paramLoadPage").val() == "often" ){
        	ordPsbMinQty = tmpOption.find("#paramTotalQty").val();
        }

       /*    	 	
   	 	  TODO 큐레이션 영역일 경우의 분기 추가 필요
                 주문내역쪽에서도 해당 펑션을 사용하지만 옵션팝업 호출이 불필요함
                 혹시 오늘 드림 장바구니에 넣어달라는 요구사항이 올수 있으나 해당 처리는 안되어 있음
       */
        /* [3330196] 올리브영 모바일 주문목록 개선 요청(CHY)
         * 마이페이지 주문/배송조회 장바구니 기능 개선으로 조건문 추가
         * loadPage가 order(주문/배송조회)이나 often(자주 구매 상품)이 아닐 때만 옵션 레이어 팝업 노출
         */
        if(tmpOption.find("#dupYn").val() == "Y" && tmpOption.find("#optSelectYn").val() == "N" && tmpOption.find("#paramLoadPage").val() != "order" && tmpOption.find("#paramLoadPage").val() != "often"){ //옵션 있는 상품의 경우 AND 옵션 선택팝업에서 장바구니 담기로 호출 된 경우가 아닐 때
           
           if (recoCart == "G") {
               common.prdOptPopLayerOpen('prdOptionPopup','giftMain');
           } else {
               common.prdOptPopLayerOpen('prdOptionPopup');
           }
        
        $("#prdOptionPopup .choice").html('상품을 선택해주세요.'); //[3401377] 장바구니 담기시 옵션 상품일 경우 이전 선택 값 초기화 진행   | 2020.09.15 | -by jp1020
       	$("#prdOptionPopup .item-box img").attr("src", tmpOption.find("#optImgSrc").val()); 
       	$("#prdOptionPopup .bname").text(tmpOption.find("#onlBrandName").val()); 
       	$("#prdOptionPopup .iname").text(tmpOption.find("#goodsNm").val());
       	$("#prdOptionPopup .item-box img").attr("alt", tmpOption.find("#goodsNm").val());
       	
       	tmpOption.find("#onlBrandName").val()
       	
       	var optionHtml = ""; //옵션 리스트 영역
       	tmpOption.find("li").each(function(){
       		var optInfo = $(this).find('a');
       		optionHtml += "<li>"
       		optionHtml += '<a href="#" class="price-box" data-ref-goodsNo="'+optInfo.attr("data-ref-goodsNo")
       												   +'" data-ref-itemNo="'+optInfo.attr("data-ref-itemNo")+'">';
       		optionHtml += 	'<div class="txt-opt">';
       		optionHtml += 		'<p class="oname">'+$(this).find(".optItemName").text()+'</p>';
       		if($(this).find(".icon").length > 0){
       			optionHtml += 		'<p class="icon">';
       			if($(this).find(".plus").length > 0){
       				optionHtml += 			'<span class="plus">'+$(this).find(".plus").text()+'</span>';
       			}
       			if($(this).find(".delivery").length > 0){
       				optionHtml += 			'<span class="delivery">오늘드림</span>';
       			}
       			optionHtml += 		'</p>';
       		}
       		optionHtml += 	'</div>';
       		optionHtml +=  	'<span class="price">' + $(this).find(".price").text() + '</span>';
       		optionHtml += '</a>';
       		optionHtml += '</li>';        		
       	});
       	
       	$("#reco_option_area").html(optionHtml); //옵션 선택 영역 생성
       	
       	//20200901 기프트관 일 시 안내문구 추가 및 퍼블 적용 CBLIM
        if(callOrg == 'btn_basket') {
        	$("#gift_guidance_txt").empty();
           	$("#reco_option_area").closest(".select-type").after('<div class="txt_info_gift" id="gift_guidance_txt">'
           															+'<p class="txt_1">선물 받는 분이 같은 가격의 옵션으로 직접 변경할 수 있어요!</p>'
           														+'</div>'
           	);
           	$("#prdOptionPopup").find(".btnLineGreen").attr('class','btnLineGreen mgTz');
           	$("#prdOptionPopup").find(".btnGreen").attr('class','btnGreen mgTz');
        }
       	//20200901 기프트관 일 시 안내문구 추가 CBLIM
       	
       	$("#reco_option_area").find('li').click(function(){ //옵션 선택시 이벤트
       		var target = $(this).closest(".select-type");
       		var optName = $(this).find(".oname").text();
       		var optPrice = $(this).find(".price").text();
       		var selectHtml = '<p class="txt">'+optName+'<em class="pri">'+optPrice+'</em></p>';
       		target.find(".choice").html(selectHtml);
       		console.log( $(this).find('a')[0] );
       		var goodsNo = $(this).find('a').attr("data-ref-goodsNo");
       		var itemNo = $(this).find('a').attr("data-ref-itemNo");
       		$("#prdOptionPopup input[name='goodsNo']").val(goodsNo);
       		$("#prdOptionPopup input[name='itemNo']").val(itemNo);
       	});
       	
       	$('.select-type').unbind('click');
       	
       	$('.select-type').click(function(e){//셀렉트 박스 오픈 이벤트  퍼블 작업	
   			var _this = $(this),
   				_inner = _this.find('.inner');
   		
   			if(_inner.hasClass('open')){
   			    _inner.removeClass('open');
   			}else{
   			    _inner.addClass('open');
   			}
   			return false;
   		});

       }else if (cartGoodsNo != undefined && cartGoodsNo != "" && cartItemNo != undefined && cartItemNo != "") {
            var resultData = new Array();
            var param = {
                goodsNo : cartGoodsNo,
                itemNo : cartItemNo,
                ordQty : ordPsbMinQty,
                quickYn : cartQuickYn
            }
            resultData.push(param);

            // 프로모션이 동일(P201), A+B(P203) 이고, N+1 중 N이 1인 경우, FreeGift 가 1종류인 경우
            // Get상품 추가
            var promNo = common.cart.promNo;
            var promKndCd = common.cart.promKndCd;

            var buyGoodsNo = cartGoodsNo;
            var buyItemNo = cartItemNo;
            var buyOrdQty = 1;
            var samePrdSumOrdQty = buyOrdQty;
            var buyCondStrtQtyAmt = common.cart.buyCnt;

            var getItemAutoAddYn = common.cart.getItemAutoAddYn;
            var getGoodsNo = (promKndCd == "P201") ? cartGoodsNo : tmpOption.find("#getItemGoodsNo").val();
            var getItemNo = (promKndCd == "P201") ? cartItemNo : tmpOption.find("#getItemItemNo").val();

            if (promNo != undefined && promNo != '' && buyCondStrtQtyAmt == 1) {
                if (promKndCd == "P201"
                        || (promKndCd == "P203" && getItemAutoAddYn == "Y" && getGoodsNo != undefined
                                && getGoodsNo != '' && getItemNo != undefined && getItemNo != '')) {
                    var getGoodsData = {
                        goodsNo : getGoodsNo,
                        itemNo : getItemNo,
                        ordQty : buyOrdQty,
                        rsvGoodsYn : "N", // 예약상품여부
                        dispCatNo : "", // 전시카테고리 번호
                        drtPurYn : "N", // 바로구매여부
                        promKndCd : promKndCd, // 프로모션구분
                        crssPrstNo : promNo, // 프로모션번호
                        prstGoodsNo : buyGoodsNo, // 타겟buy군의 상품번호
                        prstItemNo : buyItemNo, // 타겟buy군의 아이템번호
                        buyCondStrtQtyAmt : buyCondStrtQtyAmt,
                        samePrdSumOrdQty : samePrdSumOrdQty, // 상품번호 아이템번호가
                                                                // 같은상품의 수량을 합한값
                        getItemAutoAddYn : getItemAutoAddYn
                    };
                    
                    resultData.push(getGoodsData);
                }
            }
            // N+1 동일 일 경우 장바구니에 자동 추가 (끝)

            // 장바구니 적재
            var resultData = common.cart.regCart(resultData, 'N', '', 'Y');

            if (resultData.result) {
                // 장바구니 담기 완료 메세지
            	// 2020-08-27 옴니채널 서비스 구축 - 큐레이션 : 장바구니 담기 후 토스트 팝업으로 전체 변경
            	/*if(recoCart == 'Y') {
            		common.cart.showBasket2(cartGoodsNo);
            	}else if(recoCart == 'G'){						//20200827 기프트관 장바구니 분기처리 CBLIM
            		common.cart.showBasket3(cartGoodsNo);
            	}else{
            		common.cart.showBasket();
            	}*/
            	
            	if(recoCart == 'G'){						//20200827 기프트관 장바구니 분기처리 CBLIM
            		common.cart.showBasket3(cartGoodsNo);
            	}else{
            		common.cart.showBasket();
            	}
            }
        } else {
            alert("판매종료된 상품입니다. 다른 상품을 담아주세요.");
        }
        /*
         * } else { //옵션이 있는경우 $("#basketOption").html(data);
         *  // 옵션변경일 경우 선택된 옵션은 음영처리 var optChgYn =
         * (common.cart.regCartRecoBellGoodsInCartYn == "Y") ? "N" :
         * $("#optChgYn").val(); var selGoodsNo = $("#paramGoodsNo").val(); var
         * selPkgGoodsObj = $("table.tbl_prd_list").find("tr[pkgGoodsNo=" +
         * selGoodsNo + "]").attr("goodsNo"); var selItemNo =
         * $("#paramItemNo").val();
         * 
         * if(selPkgGoodsObj != undefined) selGoodsNo = selPkgGoodsObj;
         *  // [START 오늘드림 옵션상품 개선:jwkim] var cartQuickYn =
         * tmpOption.find("#quickYn").val();
         *  // 오늘드림인 경우 오늘드림이 아닌 옵션상품을 품절처리 // (품절 문구는 없으나 품절처럼 선택할 수 없게 하기위해서
         * 사용) if(cartQuickYn == "Y"){ $("#basketOption
         * .nonQuick").addClass("soldout"); } // [END 오늘드림 옵션상품 개선:jwkim]
         * 
         * if(optChgYn == "Y"){ $("ul.sel_option_list li").each(function(){ var
         * curGoodsNo = $(this).find("a").attr("data-ref-goodsNo"); var
         * curItemNo = $(this).find("a").attr("data-ref-itemNo");
         * 
         * if( selGoodsNo == curGoodsNo && selItemNo == curItemNo ){
         * $(this).addClass("on");
         * $("a#mainCartSelect").text($(this).find("span.option_value").text()); }
         * });
         * 
         * if($("ul.sel_option_list li").length <= 1)
         * $("a#mainCartSelect").text("선택 가능한 상품이 없습니다."); }
         * 
         * fnLayerSet('basketOption', 'open');
         * 
         * //닫기버튼 클릭이벤트 $("#basketOption").find(".layer_close").bind('click',
         * function(){ fnLayerSet('basketOption', 'close'); }); }
         */
    },
    
    before_regCart : function(idName){
    	var goodsNo = $("#"+idName+" input[name=goodsNo]").val();
    	var itemNo = $("#"+idName+" input[name=itemNo]").val();
    	if (goodsNo != undefined && goodsNo != "") {
    		common.gf_regCart($("<span data-goods-no='"+goodsNo+"' data-opt-select-Yn='Y' data-item-no='"+itemNo+"'>"));
    		common.popLayerClose(idName);
    	}else{
    		alert("상품을 선택해주세요"); //TODO 메시지 확인할 것 
    	}    	
   
    },
    
    _giftCardCheck : function(data) {
    	var retStr = 'N';
    	
    	var giftcardText = ['기프트카드', '기푸트카드', '기프드카드', '기프투카드', '기프트가드', '기프트카두', '기푸드카드', '기푸투카드', '기푸트가드', '기푸트카두', '기프드가드', 
				    		'기프드카두', '기프투가드', '기프투카두', '기프트가두', '기푸드가드', '기푸드카두', '기프드가두', '기프투가두', '기푸투카두', '기푸드가두', '기푸투가두',
				    		'기프트카트', '키프트카드', '기츠트카드', '기프티카드', '기프트칻ㅡ', '기브트카드', '기푸트카트', '기프투카트', '기프트가트', '기프트카투', '기푸투카트',
				    		'기푸트가트', '기푸트카투', '기프투가트', '기프투카투', '기프트가투', '기프투가투', '기푸투카투', '기푸트가투', '기푸투가투', '키푸트카드', '키프드카드',
				    		'키프투카드', '키프트가드', '키프트카두', '키푸드카드', '키푸투카드', '키푸트가드', '키푸트카두', '키프드가드', '키프드카두', '키프투가드', '키프투카두',
				    		'키프트가두', '키푸드가드', '키푸드카두', '키프드가두', '키프투가두', '키푸투카두', '키푸드가두', '키푸투가두'];
    	
    	data = data.replaceAll(' ','');
    	
    	if( giftcardText.indexOf(data) > -1){
    		retStr = 'Y';
    	}
    	
    	return retStr;
    },
    
    /** 쿠폰 다운로드 콜백 함수 liveCommerce 제공하기위해 공통영역에 생성  
     *  -by jp1020 2020-05-19
     * * */
    _callBackCouponDownload : function(data){
        if( data.ret == '-1'){
            common.link.moveLoginPage();                
        }else{
            alert(data.message);
            //common.popLayerClose('LAYERPOP01');
        }

    },

    /** 쿠폰 다운로드 클릭 * */
    couponDownload : function(cpnNo){
        var url = _baseUrl + "main/downCouponJson.do";
        var data = {cpnNo : cpnNo};
        common.Ajax.sendRequest("POST",url,data,common._callBackCouponDownload); 
    },
    sendRecobell : function(item_id, track) {
	    var src = (('https:'==document.location.protocol)?'https':'http')+'://logger.eigene.io/js/logger.min.js';
	    var scriptLen = $("script").filter("[src='"+src+"']").length;
	    
	    if(scriptLen == 0) {
	    	(function(s,x){s=document.createElement('script');s.type='text/javascript';
		    s.async=true;s.defer=true;s.src=(('https:'==document.location.protocol)?'https':'http')+
		    '://logger.eigene.io/js/logger.min.js';
		    x=document.getElementsByTagName('script')[0];x.parentNode.insertBefore(s, x);})();
	    }
	    
	    eglc.op('setVar', 'cuid', recoCuid);
	    eglc.op('setVar', 'itemId', item_id);
	    eglc.op('setVar', 'userId', hashedRecoSsoMbrNo);
	    eglc.op('track', track);
    },
    
    //oy 레이어팝업 S
    oyLayerOpen : function(id){
        var oylayId, oyPosY;
        $htmlBody = $('html, body');
        oyWrapper = $('#mWrapper');
        
        common.oylayId = $('#'+id);    
        common.scrollOff();
        common.dimShow();
        common.oylayId.show();
        common.popPos();
    },
    dimShow : function(){
        common.oylayId.append('<div class="oyDimmed"></div>');
        $('.oyDimmed').on('click', function(){
            common.oyLayerClose(common.oylayId);
        });
    },
    popPos : function(){
        var height = $(window).height(),
            lay = common.oylayId.children('.oyLayerContainer'),
            layConts = common.oylayId.find('.oyContents'),
            layContsh = layConts.height(),
            layCont = lay.find('.oyCont'),
            layConth = height-90,    
            layh = lay.height(),
            layhban = layh/2;
        if(height<=layh){
            if(layCont.hasClass('oyBtnFix')){
                layCont.css({
                    'max-height':layConth-70,
                    'touch-action':'auto',
                });
                layhban = common.oylayId.children('.oyLayerContainer').height()/2
            }else{
                layCont.css({
                    'max-height':layConth,
                    'touch-action':'auto',
                });
                layhban = common.oylayId.children('.oyLayerContainer').height()/2
            }
        }
        layCont.scrollTop(0);
        lay.css('margin-top', -layhban);
    },
    oyLayerClose : function(id){
        common.scrollOn();
        common.oylayId.hide();
        $('.oyDimmed').remove();
    },
    scrollOff : function(){
        oyPosY = window.pageYOffset;
        var varUA = navigator.userAgent.toLowerCase();
        
        if(common.oylayId.hasClass('oyFullLayer')){
            oyWrapper.css({position:'fixed','top': -oyPosY});
            $htmlBody.addClass('scrollfix');
            console.log(0);
        }else{
            if(varUA.indexOf('android') > -1) {
                $htmlBody.addClass('scrollOff');
            }else if( varUA.indexOf("iphone") > -1||varUA.indexOf("ipad") > -1||varUA.indexOf("ipod") > -1 ) {
                $htmlBody.addClass('scrollfix');
                oyWrapper.css({position:'fixed','top': -oyPosY});
            }else{
                $htmlBody.addClass('scrollfix');
                oyWrapper.css({position:'fixed','top': -oyPosY});
            }
        }       
    },
    scrollOn : function(){
        $htmlBody.removeClass('scrollfix scrollOff');
        oyWrapper.removeAttr('style');
        $(window).scrollTop(oyPosY);
    },
    oyFullOpen : function(id){
        $htmlBody = $('html, body');
        oyWrapper = $('#mWrapper');
        common.oylayId = $('#'+id);     
        common.scrollOff();
        common.oylayId.show();
        common.oylayId.find('.oyContents').scrollTop(0);       
    },
    oyFullClose : function (id){
        common.scrollOn();
        common.oylayId.hide();
    },
    //oy 레이어팝업 E
};

$.namespace("common.header");
common.header = {

    bindFlag : "N",
    scpClickFlag : "N",
    suddenClickFlag : "N",
    
    init : function() {
        common.header.bindEvent();
        if (common.app.appInfo.isapp) {
            $(".mAllSearch").addClass("app");
        }
    },
    //2020.07.21 slideSearchAjax.do Click Event 변경
    initSwiperSrcCnt : 1,
    clickSearchEvent : function(){

    	var textArea = $(".searchScpInput").val();

    	
    	//setTimeout(function () {
    		common.gnb.initSearchPop();
          //[상세검색개선] 최근본 상품 조회 2020-09-10
            common.recentGoods.getList('search');
            //[상세검색개선] 최근본 상품 조회 2020-09-10 - end
            common.header.getScpGoodsListAjax();
            common.header.callSuddenKeyWord();            
            getMyNewKeyword();
            
            $("#mWrapper").hide();
            $("#mSearchWrapper").show();
            $("#mSearchWrapper").find("#query").focus();
            $("#mSearchWrapper").find("#query").val(textArea);
            $(document).scrollTop(0);  
            if (textArea != null && textArea != "") {
            	request_M_ArkJson($("#mSearchWrapper").find("#query").val());
            }
        
            
//            var textArea = $(".searchScpInput").val();
//            if (textArea != undefined && textArea != "") {
//            	//common.header.initSearchSwiper();
//            	
//            	 $("#mSearchWrapper").find('.search_auto_area').removeClass('off');
//                 $("#mSearchWrapper").find('.search_swiper_area').hide();
//                 $("#mSearchWrapper").find('.btn_sch_del').addClass('on');
//                 $("#mSearchWrapper").find('#mContainer').addClass('fix');
//                 $(".scp_cont").css("display", 'none');
//            }
    
            //common.header.initSearchSwiper();
            //$("#mSearchWrapper").find("#query").keyup();
    	//}, 100);

    },
    
    initSearchSwiper : function() {
        // [상세검색개선] 최근 검색어, 급상승, 최근본상품 swiper 2020-09-10   
    		var cookie = new Cookie(365);
    		var cookieSwiperIndex = 1;
    		if (getCookie_search("myswiperindex") != undefined && getCookie_search("myswiperindex") != "") {
    			cookieSwiperIndex = parseInt(getCookie_search("myswiperindex"));
    		}
    		
//    		if($('.dsearch')[0] && $('.dsearch')[0].swiper){
//            	$('.dsearch')[0].swiper.destroy();
//            }
    		
    		//alert(cookieSwiperIndex);
    		//if (common.header.initSwiperSrcCnt == 0) {
				var swiperSrc = new Swiper('.dsearch', {
					initialSlide : cookieSwiperIndex,
					slidesPerView: '1.3',
					centeredSlides: true,
					spaceBetween: 15,
					pagination: '.paging',
					paginationClickable: true,
					loopAdditionalSlides: 1,
					loop :true			
				});
				//common.header.initSwiperSrcCnt = 1;
			//}
			
			// 마지막으로 이동한 슬라이드를 저장한다.
			swiperSrc.on('slideChangeStart', function(e){
				//alert(swiperSrc.realIndex);
				//alert("realIndex : " + swiperSrc.realIndex);
				//cookie.set('swiperIndex', swiperSrc.realIndex);
				setCookie_search("myswiperindex", swiperSrc.realIndex, 365);
				// DS 처리
				if (swiperSrc.realIndex == 0) {
					common.wlog("home_header_search_recent"); //최근 검색어 탭
				} else if (swiperSrc.realIndex == 1) {
					common.wlog("home_header_search_populoar"); //급상승 검색어탭
				} else if (swiperSrc.realIndex == 2) {
					common.wlog("home_header_search_recentgoods"); //최근본 상품
				}
				//common.wlog();
				// 앱 쿠키 동기화
				common.app.syncCookie();
			});
			
			
			// 저장된 슬라이드로 이동
			//swiperSrc.slideTo(cookieSwiperIndex);
			
		// [상세검색개선] 최근 검색어, 급상승, 최근본상품 swiper 2020-09-10 - end
    },

    bindEvent : function() {
        $(".mAllSearch").find(".m_btn_barcode").bind("click", function() {
            location.href = "oliveyoungapp://scanBarcode";
            common.wlog("header_barcode_btn");
        });
        //2020.07.21 slideSearchAjax.do Click Event 변경
        $(".searchScp").bind("click", function() {
            common.header.clickSearchEvent();
        });
        
        // 2020-07-17 검색어 백버튼 분기처리용 플래그
        $("#sHeaderBackBtn_SearchMain").bind("click", function(){
            
            try{
                var osType = common.app.parser.getOS().name;
                if(osType == "android" || common.isEmpty(osType)){
                    
                    if(history.state === "isFirst"){
                        $("#mWrapper").hide();
                        $("#mSearchWrapper").show();
                        $(document).scrollTop(0);
                        $("#mSearchWrapper").find("#query").val('');
                        setTimeout(function() {                        	
                        	request_M_ArkJson($("#query").val());
                        }, 10);
//             	       $("#mSearchWrapper").find("#query").focus();  
                        if(common.header.scpClickFlag=="N"){
                            common.header.getScpGoodsListAjax();
                            suddenKeyword();
                            //[상세검색개선] 최근본 상품 조회 2020-09-10
                            common.recentGoods.getList('search');
                            //[상세검색개선] 최근본 상품 조회 2020-09-10 - end
                            getMyNewKeyword();
                            common.header.scpClickFlag="Y";
                        }
                    }else{
                         history.back();                        
                    }
                    
                }else{
                    history.back(); // isIOS
                }
            }catch(e){
                history.back(); // exception
                console.log("SearchMain", e);
            }
        });
        
        $("#sHeaderBackBtn").bind("click", function(){
            var dsId = $(this).attr("data-ref-clickId");
            var cUrl = location.href;
           
            if (dsId == "other") {
                if (cUrl.indexOf("/planshop/getSpcShopDetail.do?dispCatNo=500000200080001") > -1) {
                    common.wlog("premiumshop_header_back");
                    history.back();
                } else if (cUrl.indexOf("/main/getGiftMainList") > -1) {
                    common.wlog("giftmain_header_back");
                    display.gift.goHistoryBack();
                } else if (cUrl.indexOf("/counsel/getQnaForm") > -1) {
                    common.wlog("3type_header_back");
                    mcounsel.back();
                } else if (cUrl.indexOf("/mypage/getMySkinCondition") > -1) {
                    common.wlog("3type_header_back");
                    location.href= _baseUrl + 'mypage/myPageMain.do';
                } else if (cUrl.indexOf("/mypage/getGdasList") > -1) {
                    common.wlog("3type_header_back");
                   location.href= _baseUrl + 'mypage/myPageMain.do';
                } else if (cUrl.indexOf("/display/getSCategoryList") > -1) {
                    history.back();
                    // displaysearch/display.js 에서 history.pushState({status:"MCategoryMain"},null,null); 하기 때문에 뒤로 가려면 두번 가야함
                    //if ( history.state != null && history.state.status == "MCategoryMain" ) {
                        //common.wlog("3type_header_back");
                        //history.go(-2);
                    //}
                } else if (cUrl.indexOf("/main/getSaleList") > -1) {
                    common.wlog("sale_header_back");
                    history.back();
                } else if (cUrl.indexOf("/main/getMembership") > -1) {
                    common.wlog("membership_header_back");
                    history.back();
                } else if (cUrl.indexOf("/giftCardGuide/getGiftCardGuide") > -1) {
                    common.wlog("giftcard_header_back");
                    history.back();
                } else if (cUrl.indexOf("/planshop/getSpcShopDetail.do?dispCatNo=500000200090001") > -1) {
                    common.wlog("petshop_header_back");
                    history.back();
                } else if (cUrl.indexOf("/counsel/main") > -1) {
                    common.wlog("counselmain_header_back");
                    history.back();
                } else if (cUrl.indexOf("/mypage/getReviewerLounge") > -1) {
                    common.wlog("reviewerlounge_header_back");
                    history.back();
                } else {
                    common.wlog("3type_header_back");
                    history.back();
                }
            } else {
                common.wlog(dsId);
                
                if (cUrl.indexOf("/mypage/myPageMain") > -1) {
                    location.href = _baseUrl + 'main/main.do';
                } else {
                   history.back();
                }
            }
        });
        $("#mypageAlarmBtn").bind("click", function() {
            common.wlog("mypage_main_alarm");
            common.link.moveAppPushHistList();
        });
    },
    callSuddenKeyWord : function(){
    	
    	
    	/* [상세검색개선] 삭제 
    	if($(".searchFix #mTab11 li:eq(1)").hasClass("on")){
    		suddenKeyword();
    		common.header.suddenClickFlag = "Y";
    	}
    	
    	$(".searchFix #mTab11 li:eq(1)").on("click", function(){
    		if (common.header.suddenClickFlag == "N") {
    			suddenKeyword();
    			common.header.suddenClickFlag = "Y";
    		}
        });
    	[상세검색개선] 삭제 - end */ 
        
    	//[상세검색개선] 급상승 키워드 2020-09-02
    	suddenKeyword();
		//[상세검색개선] 급상승 키워드 2020-09-02 - end
    },
    appDownBannerMainInit : function() {
        // 배너를 종료여부
        if (sessionStorage.getItem("bannerCloseYn") != "Y") {
            // 유입채널이 있으면
            // if($("#chlNoBanner")!=undefined && $("#chlNoBanner")!="" &&
            // $("#chlNoBanner")!=null && $("#chlNoBanner").val().length>0){
            // 앱이 아니면
            if (common.app.appInfo == undefined || !common.app.appInfo.isapp) {
                $('#webBanner_main').css("display", "block");
            }
            // }
        }

        setTimeout(function() {
            // 앱다운로드 배너 추가건
            /*
             * BI Renewal. 20190918. nobbyjin. Start
             * if($('#webBanner_main').css("display") == 'block'){
             * $('#webBanner_main').parent().css('height', '190px');
             * $('#mHome-visual').css({'padding-top':'48px'}); }else
             * if($('#webBanner_main').css("display") == 'none'){
             * $('#webBanner_main').parent().css('height', '142px');
             * $('#mHome-visual').css({'padding-top':'0'}); } BI Renewal.
             * 20190918. nobbyjin. End
             */
            if ($('#webBanner_main').css("display") == 'block') {
                $('#mContainer.mMain').css({
                    'padding-top' : '135px'
                });
            } else if ($('#webBanner_main').css("display") == 'none') {
                $('#mContainer.mMain').css({
                    'padding-top' : '87px'
                });
            }
        }, 200);
        common.header.appDownBannerMainBindEvent();
    },

    appDownBannerMainBindEvent : function() {
        if (common.header.bindFlag == "N") {
            $("#banner_close_main").bind("click", function() {
                common.wlog("appDownClose");
                $('#webBanner_main').css('display', 'none');
                $('#webBanner_main').parent().css('height', '87px');
                // BI Renewal. 20190918. nobbyjin. Start
                // $('#mHome-visual').css({'padding-top':'0'});
                $('#mContainer.mMain').css({
                    'padding-top' : '87px'
                });
                // BI Renewal. 20190918. nobbyjin. End
                sessionStorage.setItem("bannerCloseYn", "Y");

            });
            $("#hd_banner_cont_main").bind("click", function() {
                common.header.appDownLink();
            });

        }
        common.header.bindFlag = "Y";

    },
    getScpGoodsListAjax : function() {
        var url = _baseUrl + "common/getScpGoodsListAjax.do";
        var loginResult = false;

        $.ajax({
            type : "POST",
            url : url,
            data : null,
            async : false,
            cache : false,
            success : function(data) {
                common.header.getScpGoodsListAjaxCallBack(data);
            },
            error : function() {
                    
            }
        });
    },
    getScpGoodsListAjaxCallBack : function(data) {

        $("#scp_cont_id").html(data);
        common.gnb.initScpSwiper();

    },
    appDownBannerInit : function() {
        // 배너를 종료여부
        if (sessionStorage.getItem("bannerCloseYn") != "Y") {
            // 유입채널정보가 있으면
            // if($("#chlNoBanner")!=undefined && $("#chlNoBanner")!="" &&
            // $("#chlNoBanner")!=null && $("#chlNoBanner").val().length>0){
            // 앱이 아니면
            if (common.app.appInfo == undefined || !common.app.appInfo.isapp) {
                $('#webBanner_detail').css("display", "block");
            }
            // }
        }

        if ($('#webBanner_detail').css("display") == 'block') {
            $('#mHeader.subHead.detail').css("height", "auto");
            $('#mHgroup').css("height", "auto");
        } else if ($('#webBanner_detail').css("display") == 'none') {
            $('#mHeader.subHead.detail').css("height", "60px");
            // BI Renewal. 20190918. nobbyjin.
            // $('#mHgroup').css("height","97px");
        }
        common.header.appDownBannerBindEvent();
    },
    appDownBannerBindEvent : function() {
        $("#banner_close_detail").bind("click", function() {
            $('#webBanner_detail').css('display', 'none');
            $('#mHeader.subHead.detail').css("height", "60px");
            // BI Renewal. 20190918. nobbyjin.
            // $('#mHgroup').css("height","97px");
            $('#mHeader.sHeader').css({
                'margin-top' : '0px'
            });
            sessionStorage.setItem("bannerCloseYn", "Y");
            common.wlog("appDownClose");
        });
        $("#hd_banner_cont_detail").bind("click", function() {
            common.header.appDownLink();
        });
    },

    appDownLink : function() {

        common.wlog("appDownLink");
        // var linkUrl =
        // window.location.href.substring(window.location.href.indexOf("/m/")+3,window.location.href.length);
        // BI Renewal. 20190918. nobbyjin. - Link 수정
        // var linkUrl = "main/getCouponList.do?tabIdx=0&couponMode=coupon"
        // var today = new Date().format("yyyyMMdd");
        var linkUrl = "event/getEventDetail.do?evtNo=00000000006705";

        // if (today <= 20191231) {
        // linkUrl = "main/getCouponList.do";
        //        }
        common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=" + linkUrl);
    }
};

$.namespace("common.gnb");
common.gnb = {
    hasExe : false,
    // 2020.07.22 유틸바 제어 초기화 (카테고리관)
    hasTabHome : false,
    hasTabMypage : false,
    hasTabRecentGoods : false,
   

    init : function() {
        /*
         * BI Renewal. 20190918. nobbyjin. Start. if (!common.gnb.hasExe &&
         * $(".allmenuOpen").length > 0) { common.gnb.bindEvent();
         * 
         * setTimeout(function() { common.gnb.initSearchPop(); }, 600);
         *  // setTimeout(function() { common.gnb.initSlideMenu(); // }, 100);
         * 
         * 
         * common.gnb.hasExe = true; } BI Renewal. 20190918. nobbyjin. End.
         */
        if (!common.gnb.hasExe && $("#footerTabCategoy").length > 0) {
            common.gnb.bindSearchPop();
            common.gnb.bindEvent();
            common.gnb.initSlideMenu();
            common.gnb.hasExe = true;
        }
    },

    bindEvent : function() {
        /*
         * BI Renewal. 20190918. nobbyjin. Start.
         * $(".allmenuOpen").click(function(){ //타이틀영역 숨기기
         * $("#titConts").hide();
         * 
         * var num=$(".allmenu").hasClass("show");
         * 
         * if(!num){ common.setLazyLoad();
         * $(".allmenu").addClass("show").stop().animate({left:
         * 0},240).parents("body").css({"overflow" : "hidden"})
         * $(".dim").show(); //앱 호출 setTimeout(function() {
         * common.app.callMenu("Y"); },100); }else {
         * $(".allmenu").removeClass("show").stop().animate({left:
         * '-85%'},200).parents("body").css({"overflow" : "visible"})
         * $(".dim").hide(); //앱 호출 setTimeout(function() {
         * common.app.callMenu("N"); },100); } }); BI Renewal. 20190918.
         * nobbyjin. End.
         */
        $(document).on('click', '.dim', function() {
            // 타이틀영역 보이기
            $("#titConts").show();

            if ($(".allmenu").hasClass("show") || $("#footerTab").length > 0) {
                try {
                    // BI Renewal. 20190918. nobbyjin.
                    $("#footerTab").show();

                    var scollH = $(".allmenu div").scrollTop();
                    if (scollH > 0) {
                        $(".allmenu div").scrollTop(0.0);
                    }
                    $(".allmenu").stop().animate({
                        left : '-100%'
                    }, 200).delay(2000).parents("body").removeAttr('style');
                    setTimeout(function() {
                    	// 2020.07.01 드로우 화면 속성 내용 수정 (카테고리관)
                        $(".allmenu").removeClass("show new");
                        //2020-07-29 공통으로 body 속성 변경
                        $("body").removeClass("visible-allmenu");
                        $(window).scrollTop($("body").attr("data-scrolltop"));
                        $("#footerTab").removeClass("visible-allmenu");
                        $("body").removeAttr("data-scrolltop");
                    }, 150);
                    $(".dim").hide();
                    // 앱 호출
                    setTimeout(function() {
                        common.app.callMenu("N");
                    }, 100);
                } catch (e) {
                }

            } else if ($(".popLayerWrap").hide()) {// 추가부분
                $("body").css({
                    "overflow" : "visible"
                });
                try {
                    var varNowScrollY = parseInt(sessionStorage.getItem("scrollY_popLayer"));

                    if ((varNowScrollY > 0)) {
                        $(window).scrollTop(varNowScrollY);
                        sessionStorage.removeItem("scrollY_popLayer");
                    }
                } catch (e) {
                }

                $('.dim').hide();
            }
        });

        // 탭 컨텐츠 show/hide
        $('#mTab').find('button').on(
                {
                    'click' : function(e) {
                        e.preventDefault();
                        $(this).parent().addClass('on').attr('title', '현재 선택된 메뉴').siblings().removeClass('on')
                                .removeAttr('title');
                        $('.tab_contents:eq(' + $(this).parent().index() + ')').removeClass('hide').siblings()
                                .addClass('hide');
                    }
                });

        // 장바구니 버튼
        $("#headerBasket").click(function() {
            var dsId = $(this).attr("data-ref-clickId");
            var cUrl = location.href;
            
            if (dsId == "other") {
                if (cUrl.indexOf("/planshop/getSpcShopDetail.do?dispCatNo=500000200080001") > -1) {
                    common.wlog("premiumshop_header_cart");
                } else if (cUrl.indexOf("/main/getGiftMainList") > -1) {
                    common.wlog("giftmain_header_cart");
                } else if (cUrl.indexOf("/main/getSaleList") > -1) {
                    common.wlog("sale_header_cart");
                } else if (cUrl.indexOf("/main/getMembership") > -1) {
                    common.wlog("membership_header_cart");
                } else if (cUrl.indexOf("/giftCardGuide/getGiftCardGuide") > -1) {
                    common.wlog("giftcard_header_cart");
                } else if (cUrl.indexOf("/planshop/getSpcShopDetail.do?dispCatNo=500000200090001") > -1) {
                    common.wlog("petshop_header_cart");
                } else if (cUrl.indexOf("/counsel/main") > -1) {
                    common.wlog("counselmain_header_cart");
                } else if (cUrl.indexOf("/mypage/getReviewerLounge") > -1) {
                    common.wlog("reviewerlounge_header_cart");
                } else {
                    common.wlog("3type_header_cart");
                }
            } else {
                common.wlog(dsId);
            }
            
            common.link.moveCartPage();
        });

        $(".mAllSearch").find("button").click(function() {
            if ($(this).attr("data-ref-linkurl") != undefined && $(this).attr("data-ref-linkurl") != "") {
                location.href = $(this).attr("data-ref-linkurl");
            }
        });

        //2020.07.21 slideSearchAjax.do Click Event 변경
        $(".searchScpInput").click(function() {
            common.header.clickSearchEvent();
        });

        // 검색 버튼
        if ($("#mContainer").find(".mAllSearch a").length > 0) {
            $("#mContainer").find(".mAllSearch a").click(function() {
                history.replaceState({
                    status : "search",
                    scrollY : common.getNowScroll().Y
                }, null, null);

                $("#mWrapper").hide();
                $("#mSearchWrapper").show();
                $(document).scrollTop(0);

                $("#mSearchWrapper").find("#query").focus();

                history.pushState({
                    status : "SearchPop"
                }, null, null);
                common.wlog("detailsrch_input");
                // common.gnb.initScpSwiper();
            });
        }

        // 검색 버튼
        $("#mHeader").find(".mAllSearch a").click(function() {
            history.replaceState({
                status : "search",
                scrollY : common.getNowScroll().Y
            }, null, null);

            $("#mWrapper").hide();
            $("#mSearchWrapper").show();
            $(document).scrollTop(0);

            $("#mSearchWrapper").find("#query").focus();

            history.pushState({
                status : "SearchPop"
            }, null, null);
            common.wlog("detailsrch_input");
            // common.gnb.initScpSwiper();
        });

        $("#mHeader").find(".mSearch").click(function() {
            history.replaceState({
                status : "search",
                scrollY : common.getNowScroll().Y
            }, null, null);

            $("#mWrapper").hide();
            $("#mSearchWrapper").show();
            $(document).scrollTop(0);

            $("#mSearchWrapper").find("#query").focus();

            history.pushState({
                status : "SearchPop"
            }, null, null);
            common.wlog("detailsrch_input");
            // common.gnb.initScpSwiper();
            if (common.header.scpClickFlag == "N") {
                common.header.getScpGoodsListAjax();
                suddenKeyword();
                //[상세검색개선] 최근본 상품 조회 2020-09-10
                common.recentGoods.getList('search');
                //[상세검색개선] 최근본 상품 조회 2020-09-10 - end
                //[상세검색개선] 최근 검색어 new 2020-09-04
                //getMyKeyword();                
                getMyNewKeyword();
                //[상세검색개선] 최근 검색어 new 2020-09-04 - end
                common.header.scpClickFlag = "Y";
            }
        });
        
        $("#footerTabSearch").click(function() {
        	history.replaceState({
                status : "search",
                scrollY : common.getNowScroll().Y
            }, null, null);

        	var textArea = $(".searchScpInput").val();
            $("#mWrapper").hide();
            $("#mSearchWrapper").show();
            $(document).scrollTop(0);

            $("#mSearchWrapper").find("#query").focus();
            $("#mSearchWrapper").find("#query").val(textArea);
            request_M_ArkJson(textArea);

            history.pushState({
                status : "SearchPop"
            }, null, null);

        });
        
        $("#goodsHeaderSearch").click(function() {
        	history.replaceState({
                status : "search",
                scrollY : common.getNowScroll().Y
            }, null, null);

            $("#mWrapper").hide();
            $("#mSearchWrapper").show();
            $(document).scrollTop(0);

            $("#mSearchWrapper").find("#query").focus();

            history.pushState({
                status : "SearchPop"
            }, null, null);
        });

        $('#fixedSearch  input').click(function() {
            common.header.clickSearchEvent();
            common.wlog("detailsrch_input");
            // common.gnb.initScpSwiper();
        });

        // BI Renewal. 20190918. nobbyjin. Start.
        // 유틸바 카테고리
        $("#footerTabCategoy").click(function() {
            common.gnb.clickSlideMenu("footer");
        });
        $("#quickMenuCategoy").click(function() {
            common.gnb.clickSlideMenu("quickmenu");
        });

        // 유틸바 검색
        $("#footerTabSearch").click(function() {
            //2020.07.21 slideSearchAjax.do Click Event 변경
            common.header.clickSearchEvent();
            
            // 2020.07.22 드로우 화면 종료시, 이전 내용이 홈(유틸바) 일 경우, 홈(유틸바)의 클릭표시를 전환한다. (카테고리관)
            if (common.gnb.hasTabHome == true) {
            	$(".item03").addClass("in");
            }
            
            // 2020.07.22 드로우 화면 종료시, 이전 내용이 마이페이지(유틸바) 일 경우, 마이페이지(유틸바)의 클릭표시를 전환한다. (카테고리관)
            if (common.gnb.hasTabMypage == true) {
            	$(".item04").addClass("in");
            }
            
            // 2020.07.22 드로우 화면 종료시, 이전 내용이 최근 본 상품(유틸바) 일 경우, 최근 본 상품(유틸바)의 클릭표시를 전환한다. (카테고리관)
            if (common.gnb.hasTabRecentGoods == true) {
            	$(".item05").addClass("in");
            }
            
            // 2020.07.22 유틸바 속성 값 초기화 (카테고리관)
            common.gnb.hasTabHome = false;
            common.gnb.hasTabMypage = false;
            common.gnb.hasTabRecentGoods = false;
            
            // 2020.07.22 
            // 1) 드로우 화면에서 클릭시, 드로우 클래스 속성 내용을 제거한다. (카테고리관)
            // 2) 카테고리 메뉴(유틸바) 표시 내용을 변경한다.
            // 3) 유틸바 내용을 숨김처리한다. (카테고리관)
            // 4) 앱에 호출하여 해당 내용을 반영한다. (카테고리관)
            $(".allmenu").removeClass("show new").stop().animate({
                left : '-85%'
            }, 200);
            //2020-07-29 공통으로 body 속성 변경
            $("body").removeClass("visible-allmenu");
            $(window).scrollTop($("body").attr("data-scrolltop"));
            $("#footerTab").removeClass("visible-allmenu");
            $("body").removeAttr("data-scrolltop");

            $(".item01").removeClass("in");

            $(".dim").hide();
            
            setTimeout(function() {
                common.app.callMenu("N");
            }, 100);
            
            // =========================================================================
            
            common.wlog("mFooterTabSearch");
        });

        // 유틸바 홈
        $("#footerTabHome").click(function() {
            common.wlog("mFooterTabHome");
            common.link.moveMainHome();
        });

        // 유틸바 마이페이지
        $("#footerTabMypage").click(function() {
            common.wlog("mFooterTabMypage");
            common.link.moveMyPageMain();
        });

        // 유틸바 최근 본 상품
        $("#footerTabRecentGoods").click(function() {
            common.wlog("mFooterTabRecentGoods");
            common.link.moveRecentList();
        });
        // BI Renewal. 20190918. nobbyjin. End.
        
        // 상품상세 헤더 검색
        $("#goodsHeaderSearch").click(function() {
            //2020.07.21 slideSearchAjax.do Click Event 변경
            common.header.clickSearchEvent();
        });

        // 검색 결과 페이지 검색
        /*
        $("#searchResult .searchScpInput, #searchResult .btn_sch_del").click(function() {
            //common.gnb.clickSlideSearch();
        });
        */
        $(window).bind(
                "popstate",
                function() {

                    // 팝업 닫는시점인 경우
                    if (history.state != null && history.state.status == "search") {
                        $("#mSearchWrapper").hide();
                        $("#mWrapper").show();
                        setTimeout(function() {
                            var _mainCheck = $('#mHome-visual');
                            var _btnPlay = $('#mHome-visual').find('#swiper-autoplay').attr('class');
                            $(document).scrollTop(1);
                            $(document).scrollTop(history.state.scrollY);
                            $(document).scroll();
                            if (_mainCheck.length > 0) {
                                if (_btnPlay) {
                                    var _dot = $('#mHome-visual').find(
                                            '.control_box .paging .swiper-pagination-bullet-active');
                                    _dot.next('span').click();
                                }
                            }
                        }, 100);
                    }

                });

        // 웹로그 바인드
        setTimeout(function() {
            common.gnb.bindWebLog();
        }, 200);

    },
    
    clickSlideSearch : function() {
        history.replaceState({
            status : "search",
            scrollY : common.getNowScroll().Y
        }, null, null);

        $("#mWrapper").hide();
        $("#mSearchWrapper").show();
        $(document).scrollTop(0);

        $("#mSearchWrapper").find("#query").focus();

        history.pushState({
            status : "SearchPop"
        }, null, null);
        common.wlog("goodsdetail_header_search");
        // common.gnb.initScpSwiper();
        if (common.header.scpClickFlag == "N") {
            common.header.getScpGoodsListAjax();
            common.header.callSuddenKeyWord(); 
			//[상세검색개선] 최근본 상품 조회 2020-09-10
            common.recentGoods.getList('search');
            //[상세검색개선] 최근본 상품 조회 2020-09-10 - end 
            //[상세검색개선] 최근 검색어 new 2020-09-04
            //getMyKeyword();                          
            getMyNewKeyword();
            //[상세검색개선] 최근 검색어 new 2020-09-04 - end
            common.header.scpClickFlag = "Y";
        }
    },
    
    clickSlideMenu : function(eventFrom) {
        var connectedTime = "";
        var status = false;
        try {
            connectedTime = sessionStorage.getItem("slideSavedTime");
            status = sessionStorage.getItem("slideStatus");
        } catch (e) {
        }

        if (!common.isEmpty(connectedTime)) {
            var currentTime = (new Date()).getTime();
            var connectMin = Math.floor((currentTime - connectedTime) / (60 * 1000));

            if (connectMin > 5 || (status == "true") != _isLogin) {
                try {
                    sessionStorage.removeItem("slideMenu");
                } catch (e) {
                }

            }
        } else {
            sessionStorage.removeItem("slideMenu");
        }

        // 시간 업뎃
        // 사파리 private mode 예외처리용
        try {
            sessionStorage.setItem("slideStatus", _isLogin);
        } catch (e) {
        }
        // 5분 세션 저장 timeout 끝

        // 슬라이드 html 조회
        var html;
        try {
            html = sessionStorage.getItem("slideMenu");
        } catch (e) {
        }
        

        // 화면 HTML 조회 처리
        if (!common.isEmpty(html)) {
            $("#allMenu #mLnb").html(html);                
        } else {
            // 저장된 화면이 없을 경우 html 조회
            common.gnb.callSlideMenuAjax();
        }
        
        // 2020.07.22 홈(유틸바)의 버튼 내용이 클릭 속성으로 있을 경우, 그 속성내용을 저장한다. (카테고리관)
        if ($(".item03").hasClass("in")) {
        	common.gnb.hasTabHome = true;
        	$(".item03").removeClass("in");
        }
        
        // 2020.07.22 마이페이지(유틸바)의 버튼 내용이 클릭 속성으로 있을 경우, 그 속성내용을 저장한다. (카테고리관)
        if ($(".item04").hasClass("in")) {
        	common.gnb.hasTabMypage = true;
        	$(".item04").removeClass("in");
        }
        
        // 2020.07.22 최근 본 상품(유틸바)의 버튼 내용이 클릭 속성으로 있을 경우, 그 속성내용을 저장한다. (카테고리관)
        if ($(".item05").hasClass("in")) {
        	common.gnb.hasTabRecentGoods = true;
        	$(".item05").removeClass("in");
        }
        
        $(".allmenuClose").click(function() {
            // 타이틀영역 숨기기
            //$("#titConts").show();

            var scollH = $(".allmenu div").scrollTop();
            if (scollH > 0) {
                $(".allmenu div").scrollTop(0.0)
            }
            if (eventFrom == "footer") {
                $(".allmenu").stop().animate({
                    left : '-100%'
                }, 200);
            } else if (eventFrom == "quickmenu") { // 닫을때 좌에서 우로
                $(".allmenu").stop().animate({
                    left:'100%'
                }, 200);
            } else {
                $(".allmenu").stop().animate({
                    left : '-100%'
                }, 200);
            }
            setTimeout(function() {
            	// 2020.07.22 드로우(유틸바) 화면 속성 내용 수정 (카테고리관)
            	$(".item01").removeClass("in");
            	// 2020.07.01 드로우 화면 속성 내용 수정 (카테고리관)
                $(".allmenu").removeClass("show new");
                //2020-07-29 공통으로 body 속성 변경
                $("body").removeClass("visible-allmenu");
                $(window).scrollTop($("body").attr("data-scrolltop"));
                $("#footerTab").removeClass("visible-allmenu");
                $("body").removeAttr("data-scrolltop");
            }, 150);
            
            // 2020.07.22 드로우 화면 종료시, 이전 내용이 홈(유틸바) 일 경우, 홈(유틸바)의 클릭표시를 전환한다. (카테고리관)
            if (common.gnb.hasTabHome == true) {
            	$(".item03").addClass("in");
            }
            
            // 2020.07.22 드로우 화면 종료시, 이전 내용이 마이페이지(유틸바) 일 경우, 마이페이지(유틸바)의 클릭표시를 전환한다. (카테고리관)
            if (common.gnb.hasTabMypage == true) {
            	$(".item04").addClass("in");
            }
            
            // 2020.07.22 드로우 화면 종료시, 이전 내용이 최근 본 상품(유틸바) 일 경우, 최근 본 상품(유틸바)의 클릭표시를 전환한다. (카테고리관)
            if (common.gnb.hasTabRecentGoods == true) {
            	$(".item05").addClass("in");
            }
            
            // 2020.07.22 유틸바 속성 값 초기화 (카테고리관)
            common.gnb.hasTabHome = false;
            common.gnb.hasTabMypage = false;
            common.gnb.hasTabRecentGoods = false;

            $(".dim").hide();

            // 웹 접근성 popfocus 삭제 ( 2017-05-11 )
            $("a[data-focus~=on]").focus(); // 표시해둔 곳으로 초점 이동
            window.setTimeout(function() {
                $("a[data-focus~=on]").removeAttr("data-focus");
            }, 100); // 

            // 앱 호출
            setTimeout(function() {
                common.app.callMenu("N");
            }, 100);
        });
        
        // 타이틀영역 숨기기
        $("#titConts").hide();
        
        // 2020.07.01 드로우 화면 속성 내용 수정 (카테고리관)
        var num = $(".allmenu").hasClass("show new");
        common.wlog("mFooterTabCategoy");

        if (!num) {
            common.setLazyLoad();
            if (eventFrom == "footer") {
            	// 2020.07.01 드로우 화면 속성 내용 수정 (카테고리관)
                $(".allmenu").css("left", "-100%").addClass("show new").stop().animate({
                    left : 0
                }, 240);
            } else if (eventFrom = "quickmenu") {
                $(".allmenu").css("left", "100%").addClass("show").stop().animate({ // 열때 우에서 좌로
                    left : 0
                }, 240);
            } else {
            	// 2020.07.01 드로우 화면 속성 내용 수정 (카테고리관)
                $(".allmenu").css("left", "-100%").addClass("show new").stop().animate({
                    left : 0
                }, 240);
            }
            //2020-07-29 공통으로 body 속성 변경
            let windowScrollTop = $(window).scrollTop();
            $("body").attr("data-scrolltop", windowScrollTop).addClass("visible-allmenu");
            $("#footerTab").addClass("visible-allmenu");
            
            // 2020.07.22 유틸바(카테고리) 클릭시, in 클래스 추가하여 표시 (카테고리관)
            $(".item01").addClass("in");
            $(".dim").show();
            
            // 앱 호출
            setTimeout(function() {
                common.app.callMenu("Y");
            }, 100);

            if (common.app.appInfo.isapp) {
                // 앱일 경우 새로운 푸시 있는지 확인하는 스킴 호출
                location.href = "oliveyoungapp://getpushnewmsgyn";
            }
        } else {
        	// 2020.07.01 드로우 화면 속성 내용 수정 (카테고리관)
            $(".allmenu").removeClass("show new").stop().animate({
                left : '-85%'
            }, 200);

            //2020-07-29 공통으로 body 속성 변경
            $("body").removeClass("visible-allmenu");
            $(window).scrollTop($("body").attr("data-scrolltop"));
            $("#footerTab").removeClass("visible-allmenu");
            $("body").removeAttr("data-scrolltop");
            
            // 2020.07.22 드로우 화면 종료시, 이전 내용이 홈(유틸바) 일 경우, 홈(유틸바)의 클릭표시를 전환한다. (카테고리관)
            if (common.gnb.hasTabHome == true) {
            	$(".item03").addClass("in");
            }
            
            // 2020.07.22 드로우 화면 종료시, 이전 내용이 마이페이지(유틸바) 일 경우, 마이페이지(유틸바)의 클릭표시를 전환한다. (카테고리관) 
            if (common.gnb.hasTabMypage == true) {
            	$(".item04").addClass("in");
            }
            
            // 2020.07.22 드로우 화면 종료시, 이전 내용이 최근 본 상품(유틸바) 일 경우, 최근 본 상품(유틸바)의 클릭표시를 전환한다. (카테고리관)
            if (common.gnb.hasTabRecentGoods == true) {
            	$(".item05").addClass("in");
            }
            
            // 2020.07.22 유틸바 속성 값 초기화 (카테고리관)
            common.gnb.hasTabHome = false;
            common.gnb.hasTabMypage = false;
            common.gnb.hasTabRecentGoods = false;
            
            // 2020.07.22 유틸바(카테고리) 클릭시, in 클래스 제거 (카테고리
            $(".item01").removeClass("in");
            $(".dim").hide();
            // 앱 호출
            setTimeout(function() {
                common.app.callMenu("N");
            }, 100);
        }
        
        setTimeout(function() {
            common.gnb.bindSlideMenu();
        }, 200);
        
        //최근 본 상품
        setTimeout(function() {
            try {
                common.recentGoods.init();
            } catch (e) {
            }
        }, 300);
    },

    initSlideMenu : function() {
        // drawer메뉴 ajax처리하지 않아 다음 코드 주석처리.
        // 5분 세션 저장 timeout 시작
        /*
        var connectedTime = "";
        var status = false;
        try {
            connectedTime = sessionStorage.getItem("slideSavedTime");
            status = sessionStorage.getItem("slideStatus");
        } catch (e) {
        }

        if (!common.isEmpty(connectedTime)) {
            var currentTime = (new Date()).getTime();
            var connectMin = Math.floor((currentTime - connectedTime) / (60 * 1000));

            if (connectMin > 5 || (status == "true") != _isLogin) {
                try {
                    sessionStorage.removeItem("slideMenu");
                } catch (e) {
                }

            }
        } else {
            sessionStorage.removeItem("slideMenu");
        }

        // 시간 업뎃
        // 사파리 private mode 예외처리용
        try {
            sessionStorage.setItem("slideStatus", _isLogin);
        } catch (e) {
        }
        // 5분 세션 저장 timeout 끝

        // 슬라이드 html 조회
        var html;
        try {
            html = sessionStorage.getItem("slideMenu");
        } catch (e) {
        }
        

        // 화면 HTML 조회 처리
        if (!common.isEmpty(html)) {

            $("#allMenu #mLnb").html(html);

            setTimeout(function() {
                $('#footerTab').show();
            }, 600);
        } else {
            // 저장된 화면이 없을 경우 html 조회
            common.gnb.callSlideMenuAjax();
        }

        // 최근 본 상품
        setTimeout(function() {
            try {
                common.recentGoods.init();
            } catch (e) {
            }
        }, 300);

        setTimeout(function() {
            common.gnb.bindSlideMenu();
        }, 200);
        
        */
/*        setTimeout(function() {
            $('#footerTab').show();
            var mManban = $('#man_sticky'),
            	mAppban = $('#appPush_sticky'),
    		    mFooterTab = $('#footerTab'),
    		    mBanHeight = mManban.height(),
    		    mAppBanHeight = mAppban.height();
            if($("#footerTab #man_sticky").length > 0 && $("#footerTab #appPush_sticky").length > 0){
            	$('#man_sticky').css({
            		top:mAppban.position().top,
            	});
            	
                mFooterTab.css({
                    height:mBanHeight+mAppBanHeight+50,
                });
            }else if($("#footerTab #man_sticky").length < 1 && $("#footerTab #appPush_sticky").length > 0){
            	mFooterTab.css({
                    height:mAppBanHeight+50,
                });
            }else if($("#footerTab #man_sticky").length > 0 && $("#footerTab #appPush_sticky").length < 1){
            	mFooterTab.css({
                    height:mBanHeight+50,
                });
            }
            
        }, 600);*/
    },
    
    callFooterBann : function() {
    	setTimeout(function() {
            $('#footerTab').show();
            var mManban = $('#man_sticky'),
            	mAppban = $('#appPush_sticky'),
    		    mFooterTab = $('#footerTab'),
    		    mBanHeight = mManban.height(),
    		    mAppBanHeight = mAppban.height();
            
            var checkHeight = 0;
            if($('#footerTab .btmBan_area img').length > 0){
            	checkHeight = $('#footerTab .btmBan_area img')[0].naturalHeight;
            }
            if($("#footerTab #man_sticky").length > 0 && $("#footerTab #appPush_sticky").length > 0 && checkHeight == 208){
            	$('#man_sticky').css({
            		top:mAppban.position().top,
            	});
            	
                mFooterTab.css({
                    height:mBanHeight+mAppBanHeight+50,
                });
            }else if($("#footerTab #man_sticky").length < 1 && $("#footerTab #appPush_sticky").length > 0 && checkHeight == 208){
            	mFooterTab.css({
                    height:mAppBanHeight+50,
                });
            }else if($("#footerTab #man_sticky").length > 0 && $("#footerTab #appPush_sticky").length < 1 && checkHeight == 208){
            	mFooterTab.css({
                    height:mBanHeight+50,
                });
            }
            
        }, 600);
    },

    callSlideMenuAjax : function() {
        // 앱 버전 체크 위해 파라미터 추가
        var data = {};
        if (common.app.appInfo.isapp) {
            var osType = common.app.appInfo.ostype;
            var appVer = common.app.appInfo.appver.replace(/\./gi, "");
            data = {
                osType : osType,
                appVer : appVer,
            };
        }
        // 저장된 화면이 없을 경우 html 조회
        $.ajax({
            type : "GET",
            url : _baseUrl + "common/slideMenuAjax.do",
            data : data,
            dataType : 'text',
            async : false,
            cache : false,
            success : function(data) {

                $("#allMenu #mLnb").html(data);

                // 세션에 저장
                // 사파리 private mode 예외처리용
                try {
                    sessionStorage.setItem("slideMenu", $("#allMenu #mLnb").html());
                    sessionStorage.setItem("slideSavedTime", (new Date()).getTime());
                } catch (e) {
                }
            },
            error : function() {

            },
            complete : function() {
                setTimeout(function() {
                    $('#footerTab').show();
                }, 600);
            }
        });
    },

    bindSlideMenu : function() {
    	/*
        $(".lnb_sec .lnb_dep3 li a").each(function() {
            $(this).bind("click", function() {
                common.app.callTrackEvent("category", {
                    "af_content_nm" : $(this).children("span").text()
                });
                // left 메뉴 > 카테고리 > 서브카테고리 선택시 저장된 서브카테고리 제거
                sessionStorage.removeItem("subDispCatNo");

                var dispCatNo = $(this).attr("data-ref-dispCatNo");
                setTimeout(function() {
                    location.href = _baseUrl + "display/getSCategoryList.do?dispCatNo=" + dispCatNo;
                }, 300);
            });
        });
        */
    	
    	// 대카테고리 클릭 시, 해당 카테고리관으로 이동한다. (2020.07.29 카테고리관)
    	$(".lnb_sec .lnb_dep1 .link-full a").each(function() {
            $(this).bind("click", function() {
                common.app.callTrackEvent("category", {
                    "af_content_nm" : $(this).children("span").text()
                });
                
                // left 메뉴 > 카테고리 > 서브카테고리 선택시 저장된 서브카테고리 제거
                sessionStorage.removeItem("subDispCatNo");

                var dispCatNo = $(this).attr("data-ref-dispCatNo");
                
                setTimeout(function() {
                    location.href = _baseUrl + "display/getCategoryShop.do?dispCatNo=" + dispCatNo;
                }, 300);
            });
        });
    	
    	// 카테고리 관 클릭 시, 해당 카테고리관으로 이동한다. 
    	$(".lnb_sec .lnb_dep2 .link-full a").each(function() {
            $(this).bind("click", function() {
                common.app.callTrackEvent("category", {
                    "af_content_nm" : $(this).children("span").text()
                });
                
                // left 메뉴 > 카테고리 > 서브카테고리 선택시 저장된 서브카테고리 제거
                sessionStorage.removeItem("subDispCatNo");

                var dispCatNo = $(this).attr("data-ref-dispCatNo");
                
                setTimeout(function() {
                    location.href = _baseUrl + "display/getCategoryShop.do?dispCatNo=" + dispCatNo;
                }, 300);
            });
        });
    	
    	// 중 카테고리 메뉴 클릭 시, 해당 중 카테고리 리스트 내용으로 이동한다. 
    	$(".lnb_sec .lnb_dep2 .link-sub a").each(function() {
            $(this).bind("click", function() {
                common.app.callTrackEvent("category", {
                    "af_content_nm" : $(this).children("span").text()
                });
                
                // left 메뉴 > 카테고리 > 서브카테고리 선택시 저장된 서브 카테고리 제거
                sessionStorage.removeItem("subDispCatNo");

                var dispCatNo = $(this).attr("data-ref-dispCatNo");
                
                setTimeout(function() {
                    location.href = _baseUrl + "display/getMCategoryList.do?dispCatNo=" + dispCatNo;
                }, 300);
            });
        });
    	
        /*
        $('.lnb_dep1 > li > a').click(function() {
            if ($(this).parents('li').hasClass('on')) {
                $(this).parents().find('li').removeClass('on');
            } else {
                common.app.callTrackEvent("category", {
                    "af_content_nm" : $(this).children("span").text()
                });
                $(this).parents('li').addClass('on').siblings(".lnb_dep1 li").removeClass('on');
                $('.lnb_dep2 li').removeClass('on');
            }
        });
        $('.lnb_dep2 > li > a').click(function() {
            if ($(this).parents('.lnb_dep2 li').hasClass('on')) {
                $(this).parents('.lnb_dep2 li').removeClass('on');
            } else {
                common.app.callTrackEvent("category", {
                    "af_content_nm" : $(this).children("span").text()
                });
                $(this).parents('.lnb_dep2 li').addClass('on').siblings('.lnb_dep2 li').removeClass('on');
            }
        });
        */
        
        $('.lnb_dep1 > li > a').click(function() {
    		if ($(this).parents('li').hasClass('on')) {
    			$(this).parents().find('li').removeClass('on');
    		} else {
    			$(this).parents('li').addClass('on').siblings(".lnb_dep1 li").removeClass('on');
    			$('.lnb_dep2 li').removeClass('on');
    		}
    	});
        
    	$('.lnb_dep2 > li > a').click(function() {
    		if ($(this).parents('.lnb_dep2 li').hasClass('on')) {
    			$(this).parents('.lnb_dep2 li').removeClass('on');
    		} else {
    			$(this).parents('.lnb_dep2 li').addClass('on').siblings('.lnb_dep2 li').removeClass('on');
    		}
    	});

        // 전문관 클릭 이벤트
        $(".lnb-jeonmungwan ul li a[data-ref-dispCatNo]").bind("click", function() {
            var dispCatNo = $(this).attr("data-ref-dispCatNo");
            common.link.moveSpcShop(dispCatNo);
        });

        // slideMenu Top 프리미엄관 new 클릭 이벤트
        $(".subLink .mlink a[data-ref-dispCatNo]").bind("click", function() {
            var dispCatNo = $(this).attr("data-ref-dispCatNo");
            common.link.moveSpcShop(dispCatNo);
        });
        
        // 2020.06.30 slideMenu Top 프리미엄관 new 클릭 이벤트 (개정내용) (카테고리관)
        $(".sub-link a[data-ref-dispCatNo]").bind("click", function() {
        	var dispCatNo = $(this).attr("data-ref-dispCatNo");
        	common.wlog("home_draver_premium");
            common.link.moveSpcShop(dispCatNo);        	
        });
           
        // 2020.07.27 전시배너 스크립트 내용 수정 (카테고리관)
        var drawPaging = $('.drawer-banner-wrap .paging');
        
        if ($('.drawer-banner .swiper-slide').length > 1) {
        	drawPaging.show();

			var $btnPause2 = drawPaging.find('.btn-autoplay.pause');
			var $btnPlay2 = drawPaging.find('.btn-autoplay.play');

			var ctContentBanner = new Swiper('.drawer-banner', {
				pagination: '.paging-item',
				autoplay: 5000,
				autoplayDisableOnInteraction: false,
				paginationClickable: true,
				loop: true
			});

			$btnPause2.on('click', function () {
				$(this).hide();
				$btnPlay2.show();
				ctContentBanner.stopAutoplay();
			});

			$btnPlay2.on('click', function () {
				$(this).hide();
				$btnPause2.show();
				ctContentBanner.startAutoplay();
			});
		} else {
			drawPaging.hide();
		}

        /*
        $(".allmenuClose").click(function() {
            // 타이틀영역 숨기기
            $("#titConts").show();

            var scollH = $(".allmenu div").scrollTop();
            if (scollH > 0) {
                $(".allmenu div").scrollTop(0.0)
            }
            $(".allmenu").stop().animate({
                left : '-100%'
            }, 200).delay(2000).parents("body").css({
                "overflow" : "visible"
            });
            setTimeout(function() {
                $(".allmenu").removeClass("show");
            }, 150);

            $(".dim").hide();

            // 웹 접근성 popfocus 삭제 ( 2017-05-11 )
            $("a[data-focus~=on]").focus(); // 표시해둔 곳으로 초점 이동
            window.setTimeout(function() {
                $("a[data-focus~=on]").removeAttr("data-focus");
            }, 100); // 

            // 앱 호출
            setTimeout(function() {
                common.app.callMenu("N");
            }, 100);
        });
        */

        /*
         * $('.lnbTab').find('li').on('click', function(){ var idx =
         * $(this).index();
         * $('.lnbTab').find('li').removeClass('on').eq(idx).addClass('on');
         * $('.lnbSmenu').find('.tab_contents').removeClass('on').eq(idx).addClass('on');
         * });
         */

        // 2020.07.01 공지사항 롤링 추가 (카테고리관)
		if ($('#contactNotice .swiper-slide').length > 1) {
			$('#contactNotice .paging').css('display', 'block');

			$('#contactNotice .current').html('1');
			$('#contactNotice .total').html($('#contactNotice .swiper-slide').length);

			var contactNoticeBanner = new Swiper('#contactNotice .contact-notice', {
				direction: 'vertical',
				autoplay: 5000,
				autoplayDisableOnInteraction: false,
				loop: true
			});

			contactNoticeBanner.on('slideChangeStart', function(e){
				$('#contactNotice .current').html(Number(e.realIndex) + 1);
			});

		} else {
			$('#contactNotice .paging').hide();
		}

        // 웹로그 바인드
        setTimeout(function() {
            common.gnb.bindWebLog("slide");
        }, 200);

    },

    initSearchPop : function() {
        // 저장된 화면이 없을 경우 html 조회
        $.ajax({
            type : "GET",
            url : _baseUrl + "common/slideSearchAjax.do",
            data : null,
            dataType : 'text',
            async : false,
            cache : false,
            success : function(data) {

                $("#mSearchWrapper").html(data);
                
                setTimeout(function() {
                    common.header.initSearchSwiper(); //                	
                    common.gnb.bindSearchPop();
                    
                    var textArea = $(".searchScpInput").val();     
                    if (textArea != undefined && textArea != "") {
                    	//common.header.initSearchSwiper();
                    	
                    	 $("#mSearchWrapper").find('.search_auto_area').removeClass('off');
                    	 $("#mSearchWrapper").find('.search_swiper_area').hide();
                         $("#mSearchWrapper").find('.btn_sch_del').addClass('on');
                         $("#mSearchWrapper").find('#mContainer').addClass('fix');
                         //$(".scp_cont").css("display", 'none');
                    }
                    
                }, 10);


                // 세션에 저장
                // 사파리 private mode 예외처리용
                try {
                    sessionStorage.setItem("searchPopMenu", $("#mSearchWrapper").html());
                } catch (e) {
                }
            },
            error : function() {

            }
        });

//        setTimeout(function() {
//            common.gnb.bindSearchPop();
//        }, 200);

        try {
            ark_init();
            // popkeyword();
            // suddenKeyword();
            // getMyKeyword();

            // [상세검색개선] 최근 검색어, 급상승, 최근본 상품 2020-09-04
            //$("#mSearchWrapper").find(".search_tab_area").find(".tab_contents").show();
            
            $("#mSearchWrapper").find(".search_swiper_area").show();

            //var myKeyword = getCookie_search("mykeyword");

            /*if (myKeyword == undefined || myKeyword.trim() == "") {
                $("#mSearchWrapper").find('#mTab11 > li').removeClass("on");
                $("#mSearchWrapper").find('#mTab11 > li:eq(1)').addClass("on");

                $("#mSearchWrapper").find('.tab_contents:eq(1)').removeClass('hide').siblings('.tab_contents')
                        .addClass('hide');

            }*/
            // [상세검색개선] 최근 검색어, 급상승, 최근본 상품 2020-09-04 - end            
        } catch (e) {
            console.log(e);
        }
    },

    bindSearchPop : function() {

        $("#searchResult .search_tit").find("#sHeaderBackBtn_SearchMain").bind("click", function() {
        	common.header.clickSearchEvent();
        });

        $("#mSearchWrapper").find("#schBackBtn").bind("click", function() {
        	$("#mWrapper").attr("style", "display:block");
        	$("#mSearchWrapper").attr("style", "display:none");
        	if ( $("#main-swiper-tab0 .mVisual-slide").length ) {
        		  mmain.home.mVisual.ixOverlayList('resize');
        	};
        	history.back();
        });

        $("#mSearchWrapper").find(".btn_sch").bind(
                "click",
                function() {
                    if ($("#mSearchWrapper").find("#query").val() == '')
                        return;

                    var giftYn = common._giftCardCheck($("#mSearchWrapper").find("#query").val());
                    
                    location.href = _baseUrl + "search/getSearchMain.do?query="
                            + encodeURIComponent($("#mSearchWrapper").find("#query").val())+"&giftYn=" + giftYn;
                });

        $("#mSearchWrapper").find(".btn_sch_barcode").bind("click", function() {
            location.href = "oliveyoungapp://scanBarcode";
            common.wlog("header_barcode_btn");
        });
        
        $("#searchResult").find(".btn_sch_barcode").bind("click", function() {
            location.href = "oliveyoungapp://scanBarcode";
            common.wlog("detailsrch_barcode_btn");
        });
/*

        $(".searchScpInput").bind("click", function() {
            common.header.clickSearchEvent();
        });
*/
        /**
         * 퍼블 작성 스크립트
         */
        $("#mSearchWrapper").find('#mTab11 > li').find('a').on(
                {
                    'click' : function(e) {
                        e.preventDefault();
                        $(this).parent().addClass('on').attr('title', '현재 선택된 메뉴').siblings().removeClass('on')
                                .removeAttr('title');
                        $("#mSearchWrapper").find('.tab_contents:eq(' + $(this).parent().index() + ')').removeClass(
                                'hide').siblings('.tab_contents').addClass('hide');
                    }
                });
        $("#mSearchWrapper").find('.tabList01 > li').each(function() {
            if (!$(this).hasClass('on')) {
                $("#mSearchWrapper").find('.tab_contents:eq(' + $(this).index() + ')').addClass('hide');
            }
        });

        $("#mSearchWrapper").find('.sch_field5').find('.btn_sch_del').on({
            'click' : function(e) {
                e.preventDefault();
                $(this).removeClass('on').parent().find('input[name="query"]').val('');
                var _input = $(this).parent().find('input[name="query"]');
                fnSearchSet(_input);
                $(this).parent().find('input[name="query"]').focus();
                blurGb = 1;
                $(this).blur();
                $("#query").keyup();
            }
        });        
        $("#mSearchWrapper").find('.sch_field5').find('input[type="text"]').on({
            'keyup' : function() {
                fnSearchSet($(this));
            },
            'focusin' : function() {
                fnSearchSet($(this));
            }
        })
        $("#mSearchWrapper").find('.sch_field2').find('.btn_sch_del').on({
            'click' : function(e) {
                e.preventDefault();
                $(this).removeClass('on').parent().find('input[type="text"]').val('').focus();
                var _input = $(this).parent().find('input[type="text"]');
                fnSearchSet(_input);
                $("#query").keyup();
            }
        });
        $("#mSearchWrapper").find('.sch_field2').find('input[type="text"]').on({
            'keyup' : function() {
                fnSearchSet($(this));
            },
            'focusin' : function() {
                fnSearchSet($(this));
            }
        })

        function fnSearchSet(obj) {
            if (obj.val() != '' && obj.val() != null) { // 페이지 확인을 위한 스크립트
                                                        // 처리(개발시 삭제하셔도됩니다)
                $("#mSearchWrapper").find('.search_auto_area').removeClass('off');
                // [상세검색개선] 최근검색어, 급상승, 최근본 상품 new 2020-09-10
                //$("#mSearchWrapper").find('.search_tab_area').addClass('off');
                $("#mSearchWrapper").find('.search_swiper_area').hide();
                // [상세검색개선] 최근검색어, 급상승, 최근본 상품 new 2020-09-10 - end
                obj.parent().find('.btn_sch_del').addClass('on');// 2017-01-11
                                                                    // 추가
                $("#mSearchWrapper").find('#mContainer').addClass('fix');
                // [상세검색개선] 최근검색어, 급상승, 최근본 상품 new 2020-09-10
                //$("#mSearchWrapper").find('#mTab11').hide();
                // [상세검색개선] 최근검색어, 급상승, 최근본 상품 new 2020-09-10 - end
            } else {
                $("#mSearchWrapper").find('.search_auto_area').addClass('off');
                // [상세검색개선] 최근검색어, 급상승, 최근본 상품 new 2020-09-10
                //$("#mSearchWrapper").find('.search_tab_area').removeClass('off');
                $("#mSearchWrapper").find('.search_swiper_area').show();
                // [상세검색개선] 최근검색어, 급상승, 최근본 상품 new 2020-09-10 - end
                obj.parent().find('.btn_sch_del').removeClass('on');
                $("#mSearchWrapper").find('#mContainer').removeClass('fix');
                // [상세검색개선] 최근검색어, 급상승, 최근본 상품 new 2020-09-10
                //$("#mSearchWrapper").find('#mTab11').show();
                // [상세검색개선] 최근검색어, 급상승, 최근본 상품 new 2020-09-10 - end

            }
        }
        /**
         * 퍼블 작성 스크립트 - 끝
         */

        // 웹로그 바인드
        setTimeout(function() {
            common.gnb.bindWebLog("search");
        }, 200);

    },

    // 웹로그 바인딩
    bindWebLog : function(type) {

        if (type == undefined || type == null || type == "") {
            // 올리브영 BI
            $("#mHgroup h1 a").bind("click", function() {
                common.wlog("home_header_bi");
            });
            // 햄버거메뉴
            $(".allmenuOpen").bind("click", function() {
                common.wlog("home_header_drawer");
            });
            // 장바구니 버튼
            $(".mBasket .basket").bind("click", function() {
                common.wlog("home_header_cart");
            });

            // footer 영역
            $("#login, #logout").bind("click", function() {
                common.wlog("home_footer_login");
            });
            $("#customer").bind("click", function() {
                common.wlog("home_footer_customer");
            });
            $("#onlinePhone").bind("click", function() {
                common.wlog("home_footer_onlinephone");
            });
            $("#1to1").bind("click", function() {
                common.wlog("home_footer_1to1");
            });
            $("#storePhone").bind("click", function() {
                common.wlog("home_footer_storephone");
            });
            $("#email").bind("click", function() {
                common.wlog("home_footer_email");
            });
            $(".mlist-sns .facebook").bind("click", function() {
                common.wlog("home_footer_sns_facebook");
            });
            $(".mlist-sns .instagram").bind("click", function() {
                common.wlog("home_footer_sns_instagram");
            });
            $(".threeConts .sns .youtube").bind("click", function() {
                common.wlog("home_footer_youtube");
            });
            $(".mlist-sns .kakao").bind("click", function() {
                common.wlog("home_footer_sns_kakao");
            });
            /*$(".mlist-sns .twitter").bind("click", function() {
                common.wlog("home_footer_sns_twitter");
            });
            $(".mlist-sns .ribyoung").bind("click", function() {
                common.wlog("home_footer_sns_navercafe");
            });*/
        }

        if (type == "search") {
            // 검색
            $("#mSearchWrapper #mTab11 li:eq(0)").bind("click", function() {
                common.wlog("home_header_search_recent");
            });
            // 검색
            $("#mSearchWrapper #mTab11 li:eq(1)").bind("click", function() {
                common.wlog("home_header_search_populoar");
            });
        }

        if (type == "slide") {
            // 로그인
            $(".linkLogin").bind("click", function() {
                common.wlog("home_drawer_login");
            });
            // 설정
            $(".intro .setup").bind("click", function() {
                common.wlog("home_drawer_setting");
            });
            // 알림
            $(".intro .notice.new").bind("click", function() {
                common.wlog("home_drawer_alarm");
            });
            // 마이페이지
            $(".shortcuts .mypage").bind("click", function() {
                common.wlog("home_drawer_mypage");
            });
            // 주문배송
            $(".shortcuts .order").bind("click", function() {
                common.wlog("home_drawer_delivery");
            });
            // 매장안내
            $(".shortcuts .burial").bind("click", function() {
                common.wlog("home_drawer_store");
            });
            // 고객센터
            $(".shortcuts .customer").bind("click", function() {
                common.wlog("home_drawer_customer");
            });
            // 관심매장 로그인
            $(".notice-list .notice-type button.login").bind("click", function() {
                common.wlog("home_drawer_interest_login");
            });
            // 관심매장 공지
            $(".notice-list .storeNtcList").bind("click", function() {
                common.wlog("home_drawer_interestnews_" + $(this).attr("data-ref-ntcSeq"));
            });
            // 공지사항
            $(".notice-area a").bind("click", function() {
                common.wlog("home_drawer_notice");
            });
            /*
             * //뷰티 $(".lnbSmenu .lnbTab li:eq(0)").bind("click", function() {
             * common.wlog("home_drawer_beauty"); }); //푸드 $(".lnbSmenu .lnbTab
             * li:eq(1)").bind("click", function() {
             * common.wlog("home_drawer_food"); }); //라이프탭 $(".lnbSmenu .lnbTab
             * li:eq(2)").bind("click", function() {
             * common.wlog("home_drawer_life"); });
             */
            // 전문관
            $(".lnb-jeonmungwan li").each(function(idx) {
                $(this).find("a").bind("click", function() {
                    common.wlog("home_drawer_special_menu" + (idx + 1));
                });
            });
            // 최근본상품에 대한 웹로그는 common.recentGoods에서 처리함.
            // 최근본상품 더보기
            $(".late-conts a.btnMore").bind("click", function() {
                common.wlog("home_drawer_recent_more");
            });
            // 하위 카테고리
            $(".lnb_sec li a").bind("click", function() {
                common.wlog("home_drawer_category_" + $(this).attr("data-ref-dispCatNo"));
            });
            // 프리미엄관
            $(".subLink > p > a.premium").bind("click", function() {
                common.wlog("home_draver_premium");
            });
            // 기프트관
            $(".subLink > p > a.gift").bind("click", function() {
                common.wlog("home_draver_gift");
            });
            
            /**
             * 	일시   : 2020.07.13
             *  내용   : 카테고리관 드로우 화면 개정으로 웹로그 바인딩 클릭 내용 수정
             *  작성자 : 허민 (Heo-Min)
             */
            
            // 멤버쉽 (2020.07.13 드로우 화면 개편으로 내용 수정)
            $(".rank").bind("click", function() {
                common.wlog("home_drawer_membership");
            });
            // 공지사항 (2020.07.13 드로우 화면 개편으로 내용 수정)
            $(".contact-notice .ntc a.link").bind("click", function() {
                common.wlog("home_drawer_notice");
            });
            // 관심매장 공지 (2020.07.13 드로우 화면 개편으로 내용 수정)
            $(".contact-notice .sto a.link").bind("click", function() {
                common.wlog("home_drawer_interestnews_" + $(this).attr("data-ref-ntcSeq"));
            });
            // 카테고리관 (2020.08.04 드로우 화면 개편으로 주석 처리)
            $(".lnb_sec li.link-full a").bind("click", function() {
                //common.wlog("home_drawer_category_" + $(this).attr("data-ref-dispCatNo") + "_categoryshop");
            });
            // 중위 카테고리 (2020.07.13 드로우 화면 개편으로 내용 수정)
            $(".lnb_sec li li.link-sub a").bind("click", function() {
                commonlog("home_d.wrawer_category_" + $(this).attr("data-ref-dispCatNo"));
            });
            // 기프트관 (2020.07.13 드로우 화면 개편으로 내용 수정)
            $(".sub-link > a.item02").bind("click", function() {
            	common.wlog("home_draver_gift");
            });
            // 기프트카드 (2020.07.13 드로우 화면 개편으로 내용 수정)
            $(".sub-link > a.item03").bind("click", function() {
            	common.wlog("home_draver_gift");
            });
            // 전시배너 (2020.07.13 드로우 화면 개편으로 내용 수정)
            $(".drawer-banner .swiper-slide a").bind("click", function() {
            	common.wlog("home_drawer_dispbanner_banner" + $(this).attr("data-index"));
            });
            // 브랜드관 (2020.07.13 드로우 화면 개편으로 내용 수정)
            $(".drawer-brand a.item").bind("click", function() {
            	common.wlog("home_drawer_brand_brandshop" + $(this).attr("data-index"));
            });
            // 고객센터 (2020.07.13 드로우 화면 개편으로 내용 수정)
            $(".inner .contact-1 a.link").bind("click", function() {
            	common.wlog("home_drawer_customer");
            });
            // 매장안내 (2020.07.13 드로우 화면 개편으로 내용 수정)
            $(".inner .contact-2 a.link").bind("click", function() {
            	common.wlog("home_drawer_store");
            });
        }
    },
    initScpCnt : 0,
    // SCP상품 swiper init
    initScpSwiper : function() {
        if (common.gnb.initScpCnt == 0) {
            // SCP
            // 랜덤 숫자 가져오는 함수
            var fnRandomNum = function(max) { // 랜덤 숫자 가져오는 함수(0~max사이의 값)
                return Math.floor(Math.random() * max);
            }

            var eventFull_len = $('.scp_slide .swiper-wrapper').children('li').length; // FULL
                                                                                        // 배너
                                                                                        // slide
                                                                                        // 갯수
            var eventFull_init_no = fnRandomNum(eventFull_len); // FULL 배너 slide
                                                                // 초기번호

            // 이벤트 FULL 배너 slide
            var scpSlide_set = {
                slidesPerView : 1,
                initialSlide : 0,
                autoplay : false,
                pagination : '.paging',
                nextButton : '.next',
                prevButton : '.prev',
                autoplayDisableOnInteraction : true,
                paginationClickable : true,
                freeMode : false,
                spaceBetween : 0,
                loop : false
            }, visual_swiper = Swiper('.scp_slide', scpSlide_set);
            //common.gnb.initScpCnt = 1;

            $(".swiper-slide.move-goods").bind("click", function() {

                common.wlog("search_scp_idx_" + visual_swiper.clickedIndex);
                var goodsNo = $(this).find("input[name*='goodsNo']").val();
                common.link.moveGoodsDetail(goodsNo);
            });

        }
    }
};

$.namespace("common.list");
common.list = {
    /**
     * 리스트의 checkbox 클릭 이벤트 바인딩 : 전체선택, 일부 선택에 대한 checkbox 선택 동작 이벤트
     * 
     * 1. 전체선택 선택/해제 시 리스트에 있는 체크박스 모두가 선택/해제 됨
     * 
     * 2. 목록의 체크박스 선택/해제시 2.1 모두 선택되었을 경우 전체선택 체크박스가 선택 됨. 2.2 일부만 선택 되거나 모두 해제
     * 되었을 경우 전체선택 체크박스가 해제 됨.
     * 
     * 사용법 : // --------------------------------------------------------- //
     * 리스트의 체크박스를 선택/해제 하는 이벤트 바인딩 //
     * --------------------------------------------------------- // >> 전체선택 체크박스 :
     * id="inp_all" // >> 목록의 체크박스 : class="chkSmall" //
     * --------------------------------------------------------- <table>
     * <tr>
     * <th><input type="checkbox" id="inp_all">헤더체크박스</th>
     * ... </tr>
     * <tr>
     * <th><input type="checkbox" class="chkSmall">목록체크박스1</th>
     * ... </tr>
     * <tr>
     * <th><input type="checkbox" class="chkSmall">목록체크박스2</th>
     * ... </tr>
     * ... </table> common.list.bindListCheckboxEvent('#inp_all', '.chkSmall');
     * 
     * @param allChkboxJqSelector
     *            "전체선택" 체크박스의 JQuery Selector
     * @param listChkboxJqSelector
     *            리스트에 있는 체크박스의 JQuery Selector
     * 
     * 
     */
    bindListCheckboxEvent : function(allChkboxJqSelector, listChkboxJqSelector) {
        // 전체선택 체크박스(id=inp_all) 클릭시 동작
        $(allChkboxJqSelector).change(function() {
            $(listChkboxJqSelector).prop('checked', this.checked)
        });
        // 목록 체크박스("class=chkSmall") 클릭 시 동작
        $(listChkboxJqSelector).click(function() {
            var uncheckedEa = $(listChkboxJqSelector + ':not(:checked)').length;
            $(allChkboxJqSelector).prop('checked', uncheckedEa == 0);

        });
    }
};

/*--------------------------------------------------------------------------------*\
 * SNS 공통 script
 \*--------------------------------------------------------------------------------*/
$.namespace("common.sns");
common.sns = {

    /**
     * 공통 SNS 공유 방법
     * 
     * 1. 공유를 원하는 페이지에서 common.sns.init 함수를 호출한다.
     * 
     * 2. init 함수 호출에 필요한 인자는 이미지URL, 공유제목, 공유할 URL이 된다.
     * 
     * 3. init후에는 각 공유 버튼 마다 common.sns,doShare 함수를 호출한다.
     * 
     * 4. doShare에 필요한 호출인자는 공유할 서비스 명이다. (kakaotalk, kakaostory, facebook)
     * 
     */

    imgUrl : '', // 이미지 URL
    title : '', // 공유 제목
    shareUrl : '', // 공유할 URL

    imgUrlKakaoEvt : '', // 이미지 URL
    titleKakaoEvt : '', // 공유 제목
    shareUrlKakaoEvt : '', // 공유할 URL

    // SNS 공유 Init 함수(페이지 상단 공통 공유용)
    init : function(imgUrl, title, shareUrl) {

        // 카카오톡 Init
        // 개인계정의 카카오톡 자바스크립트 앱키로 적용해야함
        Kakao.init('24077b12ac18b11a96696382ccaa7138');
        // Kakao.init('0305c586bcd3328a207f11633e65717a');

        common.sns.imgUrl = imgUrl;
        common.sns.title = '[Oliveyoung]' + title;
        common.sns.shareUrl = shareUrl;

        // https-> http로 변경
        common.sns.imgUrl = common.sns.imgUrl.replaceAll("https://", "http://");
        common.sns.shareUrl = common.sns.shareUrl.replaceAll("https://", "http://");

        // URL INPUT BOX 세팅
        // $("#shareUrlTxt").attr("value",shareUrl);
        // $(".input-url").html(shareUrl);
        $("#CopyUrl").text(shareUrl);
        $("#btnShare").css("display", "block");
    },

    // 페이스북 공유를 위한 메타 태그 세팅
    metaTagInit : function() {
        $("meta[property='og:title']").attr("content", common.sns.title);
        $("meta[property='og:url']").attr("content", common.sns.shareUrl);
        $("meta[property='og:image']").attr("content", common.sns.imgUrl);
    },

    // 공유 처리
    doShare : function(type, appYn) {

        // 메타 태그 INIT
        common.sns.metaTagInit();

        // 카카오톡
        if (type == "kakaotalk") {

            Kakao.Link.sendDefault({
                objectType : 'feed',
                content : {
                    title : common.sns.title,
                    imageUrl : common.sns.imgUrl,
                    link : {
                        webUrl : common.sns.shareUrl,
                        mobileWebUrl : common.sns.shareUrl,
                        androidExecParams : common.sns.shareUrl,
                        iosExecParams : common.sns.shareUrl
                    }
                },
                buttons : [ {
                    title : '앱으로 보기',
                    link : {
                        mobileWebUrl : common.sns.shareUrl,
                        webUrl : common.sns.shareUrl
                    }
                } ]
            });

        } else if (type == "kakaostory") { // 카카오스토리
            Kakao.Story.open({
                url : common.sns.shareUrl,
                text : common.sns.title
            });
        } else if (type == "facebook") { // 페이스북

            var facebook_url = "";
            facebook_url += "http://m.facebook.com/sharer.php?";
            facebook_url += "u=" + common.sns.shareUrl;

            // 앱일경우와 앱이 아닐 경우
            if (common.app.appInfo.isapp) {
                common.app.callOpenPage("페이스북", facebook_url, '', 'Y');
            } else {
                window.open(facebook_url);
            }

        } else if (type == "url") {

            if ($("#SNSLAYER").find("#urlInfo").hasClass("on")) {
                $("#SNSLAYER").find("#urlInfo").hide();
                $("#SNSLAYER").find("#urlInfo").removeClass("on");
            } else {
                $("#SNSLAYER").find("#urlInfo").addClass("on");
                $("#SNSLAYER").find("#urlInfo").show();
                // $("#SNSLAYER").find("#shareUrlTxt").focus();
                $("#SNSLAYER").find("#CopyUrl").focus();
            }
        }
    },

    // SNS 공유 Init 함수(카톡공유를 통한 이벤트용)
    initKakaoEvt : function(imgUrl, title, shareUrl) {

        common.sns.imgUrlKakaoEvt = imgUrl;
        common.sns.titleKakaoEvt = '[Oliveyoung]' + title;
        common.sns.shareUrlKakaoEvt = shareUrl;

        // https-> http로 변경
        common.sns.imgUrlKakaoEvt = common.sns.imgUrlKakaoEvt.replaceAll("https://", "http://");
        common.sns.shareUrlKakaoEvt = common.sns.shareUrlKakaoEvt.replaceAll("https://", "http://");

    },

    metaTagInitKakaoEvt : function() {
        $("meta[property='og:title']").attr("content", common.sns.titleKakaoEvt);
        $("meta[property='og:url']").attr("content", common.sns.shareUrlKakaoEvt);
        $("meta[property='og:image']").attr("content", common.sns.imgUrlKakaoEvt);
    },

    // 공유 처리
    doShareKakaoEvt : function(type, appYn) {

        // 메타 태그 INIT
        common.sns.metaTagInitKakaoEvt();

        // 카카오톡
        if (type == "kakaotalk") {
            Kakao.Link.sendDefault({
                objectType : 'feed',
                content : {
                    title : common.sns.titleKakaoEvt,
                    imageUrl : common.sns.imgUrlKakaoEvt,
                    link : {
                        webUrl : common.sns.shareUrlKakaoEvt,
                        mobileWebUrl : common.sns.shareUrlKakaoEvt,
                        androidExecParams : common.sns.shareUrlKakaoEvt,
                        iosExecParams : common.sns.shareUrlKakaoEvt
                    }
                },
                buttons : [ {
                    title : '앱으로 보기',
                    link : {
                        mobileWebUrl : common.sns.shareUrlKakaoEvt,
                        webUrl : common.sns.shareUrlKakaoEvt
                    }
                } ]
            });

        }
    },

    // 공유 처리 (버튼2용)
    doShareKakaoEvt2 : function(mainBtnNm, subBtnNm, subUrl) {

        // 메타 태그 INIT
        common.sns.metaTagInitKakaoEvt();

        // 카카오톡
        Kakao.Link.sendDefault({
            objectType : 'feed',
            content : {
                title : common.sns.titleKakaoEvt,
                imageUrl : common.sns.imgUrlKakaoEvt,
                link : {
                    webUrl : common.sns.shareUrlKakaoEvt,
                    mobileWebUrl : common.sns.shareUrlKakaoEvt,
                    androidExecParams : common.sns.shareUrlKakaoEvt,
                    iosExecParams : common.sns.shareUrlKakaoEvt
                }
            },
            buttons : [ {
                title : mainBtnNm,
                link : {
                    mobileWebUrl : common.sns.shareUrlKakaoEvt,
                    webUrl : common.sns.shareUrlKakaoEvt
                }
            },
            {
                title : subBtnNm,
                link : {
                    mobileWebUrl : subUrl.replaceAll("https://", "http://"),
                    webUrl : subUrl.replaceAll("https://", "http://")
                }
            } ]
        });
    }
};

/*--------------------------------------------------------------------------------*\
 * 장바구니 공통 script
 \*--------------------------------------------------------------------------------*/
$.namespace("common.cart");
common.cart = {
    /* 레코벨 장바구니 담기 추가하면서 추가 S */
    cartNo : '',
    promKndCd : '',
    promNo : '',
    buyCnt : 0,
    getItemAutoAddYn : 'N', // 프로모션 Get군 상품 자동증가 여부 (Get군의 상품 종류가 1가지일 경우)
    getItemGoodsNo : '', // Get 상품 종류가 1가지인 goods_no
    getItemItemNo : '', // Get 상품 종류가 1가지인 item_no
    /* 레코벨 장바구니 담기 추가하면서 추가 E */
    regCartCnt : 0,
    jsonParam : undefined,
    scroll : 0,
    
    cartSelValid : function(goodsNo, itemNo, goodsSctCd) {
        var msg = "옵션을 선택해주시기 바랍니다.";

        if (goodsSctCd == "20") {
            msg = "상품을 선택해주시기 바랍니다.";
        }

        if ((goodsNo != undefined && goodsNo != "") || (itemNo != undefined && itemNo != "")) {
            return true;
        } else {
            alert(msg);
            return false;
        }
    },

    urlParams : function(){
        var params = {};
        window.location.search.replace(
        	/[?&]+([^=&]+)=([^&]*)/gi,
        	function(str, key, value) {params[key] = value;}
        );
        return params;
    },

    // jwkim 오늘드림 옵션상품 개편후 mbrDlvpSeq 값 추가
    regCart : function(cartSelGetInfoList, directYn, saveTp, listYn, optChgYn, cartYn, mbrDlvpSeq) {

        var url = _baseUrl + "cart/regCartJson.do";

        var callBackResult = "";

        var quickYn = "N";

        var dlvpSeq = ""; // 오늘드림 배송지 선택한 배송seq 번호 jwkim

        var callback = function(data) {
            var result = data.result;
            callBackResult = data;

            if (result) {
                // 장바구니 수량 업데이트
            	//3310497 (Action Item) 중복호출 제거 - 장바구니 수량 카운트
            	var cookie = new Cookie('local', 1, 'D');
            	if(cookie.get('cartTotCnt') != undefined && cookie.get('cartTotCnt') != ""
            		&& cookie.get('cartTotCnt') != "null" && cookie.get('cartTotCnt') != null){
            		var cartTotCnt = cookie.get('cartTotCnt');
            		if (data != 0) {
            			$("#mHeader .basket").append('<span class="cnt">');
            			$("#mHeader").find(".basket .cnt").css('display', 'block');
            			$("#mHeader").find(".basket .cnt").text(cartTotCnt);
            		} else {
            			$("#mHeader").find(".basket .cnt").css('display', 'none');
            		}
            		common.app.syncCookie();//모바일 싱크 동기
            	}else{
            		$.ajax({
            			type : "POST",
            			url : _baseUrl + "common/getCartCntJson.do",
            			contentType : "application/json;charset=UTF-8",
            			dataType : 'json',
            			async : false,
            			cache : false,
            			success : function(data) {
            				if (data != 0) {
            					$("#mHeader .basket").append('<span class="cnt">');
            					$("#mHeader").find(".basket .cnt").css('display', 'block');
            					$("#mHeader").find(".basket .cnt").text(data);
            				} else {
            					$("#mHeader").find(".basket .cnt").css('display', 'none');
            				}
            				common.app.syncCookie();//모바일 싱크 동기
            			}
            		});
            	}
            	

                // 바로구매시 사용할 return cartNo
                if (directYn == 'Y') {
                    if (listYn == 'A' || listYn == 'S')
                        return false;

                    // 오늘드림 배송지 선택한 배송seq 번호 jwkim
                    if (mbrDlvpSeq != "" && mbrDlvpSeq != undefined) {
                        dlvpSeq = mbrDlvpSeq;
                    }
                    
                    // 선물하기 여부
                    var presentYn = window['presentYn'] == 'Y' ? 'Y' : 'N';

                    //넷퍼넬 상품상세 바로구매 act_05
                    NetFunnel_Action({action_id:"act_05"},function(ev,ret){                      
	                    
                    	// 장바구니로 이동
	                    setTimeout(function() {
	                        // jwkim 오늘드림배송에서 일반으로 배송하는 로직에서 사용하는 mbrDlvpSeq(배송지seq)
	                        // 값추가
	                        location.href = _secureUrl + "cart/getCart.do?cartNo=" + data.rCartNo + "&quickYn=" + quickYn
	                                + "&mbrDlvpSeq=" + dlvpSeq + "&presentYn=" + presentYn;
	                        // location.href = _secureUrl +
	                        // "cart/getCart.do?cartNo=" + data.rCartNo +
	                        // "&quickYn=" + quickYn; // as-is 소스
	                    }, 500);
	                    
                    }); // 넷퍼넬 End act_05

                } else {
                	//큐레이션
                	try {
            			if(data != null && data != undefined && data != "" && data.rStockQtyInfo != "") {
            				var lgcGoodsNo = data.rStockQtyInfo[0].split("@=@")[4];

            				if(lgcGoodsNo != undefined && lgcGoodsNo != null && lgcGoodsNo != "") {
            					common.sendRecobell(lgcGoodsNo, 'cart');
            				}
            			}
            		} catch(e) {
            			
            		}
            		
                    // GTM
                    var goodsInfoList = callBackResult.goodsInfoList;

                    if (!!goodsInfoList && goodsInfoList.length > 0) {
                    	// productid2 변수 추가 - [3388239] 페이스북 카달라고 Data Layer 수정 요청(CHY)
                        var goodsNos = [];
                        var goodsNos2 = [];
                        var goodsNms = "";
                        var salePrc = 0;
                        for (var i = 0; i < goodsInfoList.length; i++) {
                            if (i > 0) {
                                goodsNms += "|";
                            }
                            goodsNos.push(goodsInfoList[i].goodsNo + goodsInfoList[i].itemNo);
                            goodsNos2.push(goodsInfoList[i].goodsNo);
                            goodsNms += goodsInfoList[i].goodsNm;
                            salePrc += (parseInt(goodsInfoList[i].salePrc) - parseInt(goodsInfoList[i].cpnRtAmtVal));
                        }
                        dataLayer.push({
                            'productId' : goodsNos, // 상품ID + 옵션번호
                            'productId2' : goodsNos2, // 상품ID
                            'productName' : goodsNms, // 상품명
                            'productAmt' : salePrc.toString()
                        // 상품가격
                        });
                    }

                    if (optChgYn == 'Y') {
                        location.reload();
                        return false;
                    }

                    // 메인 목록에서 장바구니 담기 했을 시
                    // 2020-08-27 옴니채널 서비스 구축 - 큐레이션 : 장바구니 담기 후 토스트 팝업으로 전체 변경
                    if (listYn == 'Y') {
                        // 기존 화면 닫기
                        common.popLayerClose('basketOption');

                        // 장바구니 등록 완료 화면으로 이동
                        var url = _baseUrl + "common/getCartCompleteAjax.do";
                        common.Ajax.sendRequest("POST", url, data, common._callCartComplete);
                    } else if (listYn == 'A' || listYn == 'S') {
                        common.cart.regCartCnt += 1;
                    } else {
                        common.cart.showBasket(); // 기존 모바일은 분기없이 해당처리만 함
                    }
                }

            } else {
                if (listYn == 'A')
                    return false;

                if (!!data.message && data.message.length < 100) {
                    alert(data.message);
                } else {
                    alert("장바구니 등록에 실패하였습니다.");
                }
                // if (data.message == "-9990") {
                // alert("판매중지된 상품은 장바구니에 담을 수 없습니다.");
                // } else if (data.message == "0") {
                // alert("재고가 부족하여 상품을 장바구니에 담을 수 없습니다.");
                // } else if (data.message == "99") {
                // alert("장바구니는 99개까지만 담으실 수 있습니다");
                // } else {
                // alert("장바구니 등록에 실패하였습니다.");
                // }
            }
        };

        // 퀵배송변수 quickYn SET
        try {
            quickYn = cartSelGetInfoList[0].quickYn;
            if (quickYn != "Y" && quickYn != "N") {
                quickYn = "N";
            }
        } catch (e) {
            quickYn = "N";
        }

        var isValid = this.validation(cartSelGetInfoList, directYn, saveTp, optChgYn, cartYn);

        if (isValid) {
            $.ajax({
                type : "POST",
                url : url,
                data : JSON.stringify(this.jsonParam),
                contentType : "application/json;charset=UTF-8",
                dataType : 'json',
                async : false,
                cache : false,
                success : callback,
                error : function(e) {
                    console.log(e);
                    alert("장바구니 등록에 실패하였습니다.");
                }
            });
        }

        return callBackResult;
    },

    validation : function(cartSelGetInfoList, directYn, saveTp, optChgYn, cartYn) {
        // 파라메터의 validation 처리
        // console.log("ins.validation :: cartSelGetInfoList=" +
        // JSON.stringify(cartSelGetInfoList, null, 2));
        var isValid = true;
        if (cartSelGetInfoList == null) {
            var msg = "죄송합니다. 고객센터에 문의해 주세요.";

            this.jsonParam = false;
            isValid = false;
        }

        // 행사안내레이어 장바구니버튼 진입시사용
        if (location.href.indexOf("getCart.do?cartNo=") > 0) {
            directYn = "Y";
        }
        
        // 오늘드림 상품상세 장바구니 담기 추가.
        var prodView = cartSelGetInfoList.prodView;
        if(prodView == undefined || prodView == "") {
            prodView = "N";
        }
        
     // 오늘드림 상품상세 장바구니 담기 추가.
        var strNo = cartSelGetInfoList.strNo;
        if(strNo == undefined || strNo == null) {
        	strNo = "";
        }

        if (isValid) {

            var qDeliveVal = $("input[name=qDelive]:checked").val();

            if (qDeliveVal == undefined || qDeliveVal == null || qDeliveVal == "") {
                qDeliveVal = "N";
            }

            var urlParams = common.cart.urlParams();
            var trackingCd = ""; 
            if(urlParams.trackingCd != undefined){
            	trackingCd = urlParams.trackingCd;
            } else {
                if (!common.isEmpty(giftTrackCode)) {
                    trackingCd = giftTrackCode;
                }
            }

            this.jsonParam = {
                drtPurYn : directYn,
                saveTp : saveTp,
                optChgYn : optChgYn,
                cartYn : cartYn,
                quickYn : qDeliveVal,
                prodView : prodView,
                strNo : strNo,
                opCartBaseList : cartSelGetInfoList,
                presentYn : window['presentYn'] == 'Y' ? 'Y' : 'N',
                trackingCd : trackingCd
            };
        }
        return isValid;
    },

    showBasket : function() {

        common.cart.regCartCnt += 1;

        // 찜 알림레이어 On
        $(".layerAlim").removeClass("Basket");
        $(".layerAlim").removeClass("zzimOn");
        $(".layerAlim").removeClass("zzimOff");
        $(".layerAlim").removeClass("brand");
        
        $(".layerAlim").addClass("Basket");
        $(".layerAlim > p").removeClass("one");
        $(".layerAlim > p").html("<p>나의 장바구니에 <br />담았어요</p>");
        $(".layerAlim").fadeIn(500);

        setTimeout(function() {
            $(".layerAlim").fadeOut(800);
        }, 1200);
        
        if(common.cart.scroll > 0) { //토스트 팝업 노출 후 기존 위치 이동을 위해..
     		$(window).scrollTop(common.cart.scroll);
    		common.cart.scroll = 0;
        }

        // mantis : 0000561 로 인한 class 제거 주석처리 필요
        // setTimeout(function(){
        // $(".layerAlim").removeClass("Basket");
        // }, 2000);
    },
    
    showBasket2 : function(goodsNo) {
        common.cart.regCartCnt += 1;
        common.cart.recoPopLayerOpen();
        common.cart.callRecoBellGoodsInCart(goodsNo);
        
    },
    
    //20200827 기프트관 장바구니 분기처리 CBLIM
    showBasket3 : function(goodsNo) {
        common.cart.regCartCnt += 1;
        common.cart.recoPopLayerOpen("giftMain");
        $("#curation_area_a003").html("");
    },
    callRecoBellGoodsInCart : function(goodsNo) {
        var goodsNos = [];
        goodsNos.push(goodsNo);
        
        var url = _baseUrl + "cart/getRecoBellGoodsInCartLayerAjax.do";
        var param = {
                goodsNos : goodsNos.toString(),
                quickYn : $("#quickYn").val() || null
        };
        
        var _callBackRecoBellGoodsInCartInfo = function(data) {
            $("#curation_area_a003").html("");
            $("#curation_area_a003").html(data);
            common.popLayerRecoOffset();
        };
        
        common.Ajax.sendRequest("POST",url,param,_callBackRecoBellGoodsInCartInfo);
    },
    

    recoPopLayerOpen : function(pageId){	
		$("#cardBenefitInfo").show();
		/*
		if(giftPlusItemYn == 'Y'){
			$("#cardBenefitInfo .popLayerArea .popCont .txt_onbag").html("<p class='txt_onbag'>행사 상품입니다.<br>장바구니에서 상품을 선택해주세요.</p>");
		}
		*/
		var wHeight = $(window).height();
        var popLayer = $("#cardBenefitInfo");
        var popinner = popLayer.find('.popCont');
        var popHeight = $(popLayer).height();
        var popPos = popHeight/2;
        var popWid = $(popLayer).width()/2;
        if(popHeight>=wHeight){
            var inHeight = wHeight - 50;
            popinner.css({'max-height': inHeight});
            var popPos = $(popLayer).height()/2;
        }
        
        if (pageId == "giftMain") { // 기프트관만 별도 처리
            $(popLayer).css({'left':'50%', 'margin-left':-(popWid), 'top':'50%', 'margin-top':-(popPos)}).show();
        } else {
            $(popLayer).css({'left':'50%', 'margin-left':-(popWid), 'top':'50%', 'margin-top':-(popPos)}).show().parents('body').css({'overflow' : 'hidden'});
        }
		
		$('.dim').show();		

        $('.dim').bind('click', function() {
            common.popLayerClose('cardBenefitInfo');
            return false;
        });
		common.cart.completeMsg();
	},

    updHeaderCartCnt : function() {
        if (common.isLogin()) {
            // 장바구니 수량 업데이트
        	//3310497 (Action Item) 중복호출 제거 - 장바구니 수량 카운트
        	var cookie = new Cookie('local', 1, 'D');
        	if(cookie.get('cartTotCnt') != undefined && cookie.get('cartTotCnt') != ""
        		&& cookie.get('cartTotCnt') != "null" && cookie.get('cartTotCnt') != null){
        		var cartTotCnt = cookie.get('cartTotCnt');
        		if (cartTotCnt == 0) {
        			$("#mHeader").find(".basket .cnt").css('display', 'none');
        		} else {
        			$("#mHeader .basket").append('<span class="cnt">');
        			$("#mHeader").find(".basket .cnt").css('display', 'block');
        			$("#mHeader").find(".basket .cnt").text(cartTotCnt);
        			//common.app.syncCookie();//모바일 싱크 동기
        		}
        	}else{
        		$.ajax({
        			type : "POST",
        			url : _baseUrl + "common/getCartCntJson.do",
        			contentType : "application/json;charset=UTF-8",
        			dataType : 'json',
        			async : false,
        			cache : false,
        			success : function(data) {
        				if (typeof data != 'undefined' && data != null) {
        					if (data == 0) {
        						$("#mHeader").find(".basket .cnt").css('display', 'none');
        					} else {
        						$("#mHeader .basket").append('<span class="cnt">');
        						$("#mHeader").find(".basket .cnt").css('display', 'block');
        						$("#mHeader").find(".basket .cnt").text(data);
        					}
        				}
        			}
        		});
        		//common.app.syncCookie();//모바일 싱크 동기
        	}
        }
    },

    updStonArea : function() {
        var _footerLoginAreaHtml = "";
        if (common.isLogin()) {
            _footerLoginAreaHtml = "<a href=\"javascript:common.link.moveLogoutPage();\" id=\"logout\" title=\"페이지 이동\" fromAttr=\"common.js\">로그아웃</a>";
        } else {
            _footerLoginAreaHtml = "<a href=\"javascript:common.link.moveLoginPage('','','Y');\" id=\"login\" title=\"페이지 이동\" fromAttr=\"common.js\">로그인</a>";
        }
        $("#footerLoginArea").html(_footerLoginAreaHtml);

        try{
        	common.cart.sendRedirectDevice(); // device에 따라 redirect 처리
        }catch(e){
        	console.log(">>>>> sendRedirectDevice catch = " + e);
        }
        

    },

    sendRedirectDevice : function() {

        var _parser = new UserAgentUtil(navigator.userAgent);
        var _appInfo = _parser.getAppInfo();
        var _isMobileApp = _appInfo.isapp;
        var _isMobile = _parser.isMobile(); // 계속 호출하면 return 값이 변해서 변수선언
        var _currUrl = window.location.href;
        var _toUrl = _baseUrl;
        // console.log(">>>>> _isMobileApp = " + _isMobileApp);

        // redirect url protocol 제거
        _redirectMoBaseUrl = _redirectMoBaseUrl.replace("https:", "").replace("http:", "");
        _redirectMaBaseUrl = _redirectMaBaseUrl.replace("https:", "").replace("http:", "");
        _redirectFoBaseUrl = _redirectFoBaseUrl.replace("https:", "").replace("http:", "");

        if (_isMobile) {
            // 모바일 일때

            // http 일경우 https로 redirect
            if (_currUrl.indexOf("http://") > -1) {
                _toUrl = _currUrl.replace("http://", "https://");
                window.location.href = _toUrl;
            }

            if (_isMobileApp) {
                // 모바일app
                if (_currUrl.indexOf(_redirectMoBaseUrl) > -1) {
                    _toUrl = _currUrl.replace(_redirectMoBaseUrl, _redirectMaBaseUrl);
                    window.location.href = _toUrl;
                }
            } else {
                // 모바일web
                if (_currUrl.indexOf(_redirectMaBaseUrl) > -1) {
                    _toUrl = _currUrl.replace(_redirectMaBaseUrl, _redirectMoBaseUrl);
                    window.location.href = _toUrl;
                    // console.log(">>>>> web _toUrl = " + _toUrl);
                }
            }

        } else {

            // 모바일이 아닐때 PC Redirect
            // MOBILE, MOBILEAPP 분기 추가
            if (_currUrl.indexOf(_redirectMoBaseUrl) > -1) {
                _toUrl = _currUrl.replace(_redirectMoBaseUrl, _redirectFoBaseUrl);
                window.location.href = _toUrl;
            } else if (_currUrl.indexOf(_redirectMaBaseUrl) > -1) {
                _toUrl = _currUrl.replace(_redirectMaBaseUrl, _redirectFoBaseUrl);
                window.location.href = _toUrl;
            }

        }

    },
    
    completeMsg : function(){
        var addMsg = "";
        if(common.cart.buyCnt >= 1){     // 프로모션 N+1 조건 중 N이 1일 경우
            if(common.cart.promKndCd == "P201"){
                addMsg = "<br>" + common.cart.buyCnt + "+1상품도 함께 추가되었습니다!";
            } if(common.cart.promKndCd == "P202"){
                    addMsg = "<br>" + common.cart.buyCnt + "+1행사상품이므로, 장바구니에서<br>추가상품을 선택해주세요!";
            } if(common.cart.promKndCd == "P203"){
                if(common.cart.getItemAutoAddYn == "Y")
                    addMsg = "<br>Gift상품도 함께 추가되었습니다!";
                else
                    addMsg = "<br>Gift행사상품이므로, 장바구니에서<br>추가상품을 선택해주세요!";
            }
        }
        
        if(common.cart.promNo != undefined && common.cart.promNo != ""){
            $("#cardBenefitInfo .popLayerArea .popCont .txt_onbag").html("<p class='txt_onbag'>"+addMsg+"</p>");
        }else{
        	$("#cardBenefitInfo .popLayerArea .popCont .txt_onbag").html("<p class='txt_onbag'>장바구니에 추가되었습니다.</p>");
        }
    },
};

/*--------------------------------------------------------------------------------*\
 * 최근 본 상품 공통
 \*--------------------------------------------------------------------------------*/
$.namespace("common.recentGoods");
common.recentGoods = {

    param : "",

    init : function() {
        common.recentGoods.getList('slide');

        // 더보기 버튼 이벤트 처리
        $('.late-conts > .btnMore').on('click', function() {
            common.link.moveRecentList();
        });
    },

    getGoodsList : function(goodsCnt) {
        var goodsNo = "";
        // default : 최대 5개

        // BI Renewal. 20190918. nobbyjin. - 쿠키설정오류 수정
        // cookie = new Cookie('local', 1, 'M');
        cookie = new Cookie(30);

        if (cookie.get('productHistory') != undefined && cookie.get('productHistory') != "") {

            var jsonStr = JSON.parse(cookie.get('productHistory'));
            var cnt = jsonStr.length;

            if (goodsCnt != undefined && goodsCnt != null && goodsCnt != "") {
                cnt = goodsCnt
            }

            for (var i = 0; i < jsonStr.length && i < 10; i++) {
                if (i < cnt && jsonStr[i].goodsNo != null && jsonStr[i].goodsNo != "") {
                    if (i == jsonStr.length - 1 || i == 9) {
                        goodsNo += jsonStr[i].goodsNo;
                    } else {
                        goodsNo += jsonStr[i].goodsNo + ",";
                    }
                }

                if (i == cnt) {
                    break;
                }
            }
        }
        return goodsNo;
    },

    getList : function(type, callback) {

        // 메인 - drawer메뉴 하단 - 최근본상품 5개 제한
        var goodsNo;

        if (type == "slide") {
            goodsNo = common.recentGoods.getGoodsList(5);
        //[상세검색개선] 최근본 상품 10개 가져오기 2020-09-10
        } else if (type == "search") {
        	goodsNo = common.recentGoods.getGoodsList(10);
       	//[상세검색개선] 최근본 상품 10개 가져오기 2020-09-10 - end
        } else {
            goodsNo = common.recentGoods.getGoodsList();
        }

        if (goodsNo != null && goodsNo != "") {
            param = {
                goodsInfo : goodsNo,
                type : type,
                pagingFlag : "N"
            };

            common.Ajax.sendRequest("get", _baseUrl + "mypage/getRecentListAjax.do", param, function(res) {
                common.recentGoods.getRecentListAjaxCallback(res, type, callback);
            });
        } else {
            if (type == "slide") {
                // BI Renewal. 20190918. nobbyjin. - nodata 영역 수정
                // $(".nodataTxt").show();
                if ($(".nodataTxt").length > 0) {
                    $(".nodataTxt").show();
                } else {
                    $(".late-conts .mlist3v-goods").append("<li class='nodataTxt'>최근 본 상품이 없어요</li>");
                }
            //[상세검색개선] 최근본 상품 10개 가져오기 2020-09-10
            } else if ( type == "search") {
            	$("#recentgoods .list_wrap").hide();
            	$("#recentgoods .btn_clear_wrap").hide();
            	$("#recentgoods .info_none").show();
       	    //[상세검색개선] 최근본 상품 10개 가져오기 2020-09-10 - end
            } else {
                $(".sch_no_data2").show();
            }
        }

    },

    /**
     * 최근 본 상품 정보조회
     */
    getRecentListAjaxCallback : function(res, type, callback) {

    	if (res.trim() == "") {
        	//[상세검색개선] 최근본 상품 10개 가져오기 2020-09-10
        	if (type == "slide") {
        		$(".sch_no_data2").show();
        	} else if (type == "search") {
        		$("#recentgoods .list_wrap").hide();
            	$("#recentgoods .btn_clear_wrap").hide();
            	$("#recentgoods .info_none").show();
        	}
        	//[상세검색개선] 최근본 상품 10개 가져오기 2020-09-10 - end        	
        } else {
            if (type == "slide") {
                $(".late-conts .mlist3v-goods").append(res);

                /** 이미지 속성 교체 (LazyLoad 사용 안함) * */
                $(".late-conts .mlist3v-goods > li img").each(function() {
                    $(this).attr("src", $(this).attr("data-original"));
                });

                common.wish.init();

                $(document).resize();
            //[상세검색개선] 최근본 상품 10개 가져오기 2020-09-10
            } else if (type == "search") {
            	$("#recentgoods .list_wrap").html(res);
            	$("#recentgoods .info_none").hide();
            	$("#recentgoods .list_wrap").show();
            	$("#recentgoods .btn_clear_wrap").show();
            	common.setLazyLoad();
           	//[상세검색개선] 최근본 상품 10개 가져오기 2020-09-10 - end          	
            } else {
                $("#mContents div.totalBox").show();
                $("#mContents").append(res);
                $(".totalBox > .cnt strong").text($(".mlist5v-goods li").length);
                common.setLazyLoad();
            }

            var jsonStr = JSON.parse(cookie.get('productHistory'));
            var chkChg = false;

            // 쿠키 30개 넘어가는 상품번호 삭제처리
            for (var j = 0; j < jsonStr.length; j++) {
                if (j >= 30) {
                    delete jsonStr.splice(j, 1);
                    chkChg = true;
                }
            }
            // 쿠키에 값 셋팅
            // cookie.set('productHistory', JSON.stringify(jsonStr));
            if (chkChg)
                cookie.set('productHistory', JSON.stringify(jsonStr));

            setTimeout(function() {
                // 링크 처리
                common.bindGoodsListLink(".late-conts .mlist3v-goods");
                
                //[상세검색개선] 최근본상품 링크 연결 2020-09-10
                common.bindGoodsListLink("#recentgoods .list_wrap");
                //[상세검색개선] 최근본상품 링크 연결 2020-09-10 - end

                common.recentGoods.bindWebLog();
            }, 100);
        }

        if (callback != undefined) {
            callback();
        }
    },

    // 웹로그 바인드
    bindWebLog : function() {

    	// 공지사항
        $(".late-conts .mlist3v-goods li").each(function(idx) {
            $(this).find(".goodsList").bind("click", function() {
                common.wlog("home_drawer_recent_goods" + (idx + 1));
            });
        });
        
        //[상세검색개선] 최근본 상품 DS추가 2020-09-17
        $("#recentgoods > div.list_wrap > a").each(function(idx) {
            $(this).bind("click", function() {
            	var num = $(this).attr("data-ref-num"); 
                common.wlog("home_header_search_recentgoods" + num);
            });
        });
        //[상세검색개선] 최근본 상품 DS추가 2020-09-17 - end        
        
    },

    // BI Renewal. 20190918. nobbyjin. - 유틸바 최근본 상품 셋팅.
    getLast : function() {
        var cookie = new Cookie();
        var sHistory = cookie.get('productHistoryL') || '', jsonStr = sHistory == '' ? '' : JSON.parse(cookie
                .get('productHistoryL'));
        if (jsonStr != '') {
            $("#footerTabRecentGoods .thum").show();
            $("#footerTabRecentGoods .thum").html(
                    "<img src='" + jsonStr.goodsImg + "' onerror='common.errorImg(this);' alt='최근 본 상품'/>");
        } else {
            $("#footerTabRecentGoods .thum").hide();
        }
    }
};

/*--------------------------------------------------------------------------------*\
 * 찜 클릭 공통
 \*--------------------------------------------------------------------------------*/
$.namespace("common.wish");
common.wish = {

    init : function() {
        // 체크 처리.
        common.wish.checkWishList();
    },

    bindEvent : function() {

        $('.jeem').unbind("click");

        // 찜 클릭 이벤트
        $('.jeem').bind('click', function() {
            // 로그인 체크
            // if(common.loginChk()){
            var param = {
                goodsNo : $(this).attr("data-ref-goodsNo")
            };

            if ($(this).hasClass("mClick")) {
                // off
            	if($(this)[0].tagName == "BUTTON"){
            		$(this).text("찜하기전");
            	}
                common.wish.delWishLst(param, $(this));
            } else {
                // on
            	if($(this)[0].tagName == "BUTTON"){
            		$(this).text("찜하기후");
            	}
                common.wish.regWishLst(param, $(this));
            }
            // }
        });
        
        //브랜드 좋아요 클릭
        $('.brand_like > a').unbind("click");

        //브랜드 좋아요 클릭 이벤트
        $('.brand_like > a').bind('click', function(){
            //로그인 체크
//            if(common.loginChk()){
                var param = {
                		onlBrndCd : $(this).attr("data-ref-onlBrndCd")
                };

                if($(this).hasClass("on")){
                    common.wish.delBrndWishLst(param, $(this));
                }else{                        
                    common.wish.regBrndWishLst(param, $(this));
                }
//            }
        });

    },

    loadData : function() {
        // 로그인 여부에 따라 찜목록 저장.
        if (common.isLogin()) {
            var wishListJson = sessionStorage.getItem("wishList");

            // 없으면 조회
            if (wishListJson == null || wishListJson.trim() == "") {

                common.wish.isLoading = false;

                // 저장된 화면이 없을 경우 html 조회
                $.ajax({
                    type : "POST",
                    url : _baseUrl + "mypage/getWishListJson.do",
                    data : null,
                    dataType : 'text',
                    async : false,
                    cache : false,
                    success : function(data) {

                        try {
                            var jsonObject = $.parseJSON(data);
                            sessionStorage.setItem("wishList", data);

                        } catch (e) {
                        }

                        common.wish.isLoading = true;
                    },
                    error : function() {
                        common.wish.isLoading = true;
                    }
                });
            }

        } else {
            // 제거
            sessionStorage.removeItem("wishList");
        }
    },
    
    
    loadBrndData : function(brndCds) {
    	var data = {};
    	data.onlBrndCdList = brndCds;
    	jQuery.ajaxSettings.traditional = true; 
        // 로그인 여부에 따라 찜목록 저장.
        if(brndCds){
        	$.ajax({
        		type : "POST",
        		url : _baseUrl + "mypage/getBrndWishListJson.do",
        		data : data,
        		dataType : 'json',
        		async : false,
        		cache : false,
        		success : function(data) {
        			try {
        				var brndsList = data;
        				for (var i = 0; i < brndsList.length; i++) {
        					var brndJJimEle = $(".brand_like.searchpage a[data-ref-onlBrndCd='" + brndsList[i].onlBrndCd + "']");
        					if(brndJJimEle.length > 0){
        						if(brndsList[i].likeYn == 'Y'){
        							brndJJimEle.addClass("on");
        						}
        						if(brndsList[i].likeCnt == 0){
        							brndJJimEle.find(".icon").html("브랜드의 상품 안내 및 추천을 받으실 수 있습니다.");
        						}else{
        							brndJJimEle.find(".icon").html("<span class='fw400'>"+brndsList[i].likeCnt+"</span>명이 "+$(".brand_like a").attr("data-ref-onlBrndNm")+"를 좋아합니다.");
        						}
        					}
        				}
        			}catch (e) {
        			}
        			
        		}
        	});
        }

         
    },
    
    checkWishList : function() {

        common.wish.bindEvent();

        setTimeout(function() {
            // 정보 조회
            common.wish.loadData();

            var wishListJson = sessionStorage.getItem("wishList");

            $('.jeem').removeClass("mClick");
            $('.jeem').text("찜하기전");
            
            if (wishListJson != null && wishListJson.trim() != "") {
                try {
                    var jsonObject = $.parseJSON(wishListJson);

                    var goodsList = jsonObject.goodsList;

                    for (var i = 0; i < goodsList.length; i++) {
                        $(".jeem[data-ref-goodsNo='" + goodsList[i] + "']").addClass("mClick");
                        $(".jeem[data-ref-goodsNo='" + goodsList[i] + "']").text("찜하기후");
                    }
                } catch (e) {
                }
            }

        }, 100);
    },

    regWishLst : function(param, obj) {
        if (param.goodsNo == undefined || param.goodsNo == "") {
            alert("등록이 실패하였습니다.\n상품정보가 없습니다.");
            return;
        }

        var callBackResult = "";

        common.Ajax.sendRequest("POST", _baseUrl + "mypage/regWishLstAjax.do", param, function(res) {
            callBackResult = res.message;
            common.wish.regWishLstAjaxCallback(res.message, obj);
            
            try {
            	var lgcGoodsNo = res.data.lgcGoodsNo;
            	if(lgcGoodsNo != undefined && lgcGoodsNo != null && lgcGoodsNo != "") {
            		common.sendRecobell(lgcGoodsNo, 'like');
            	}
            } catch(e) {
            	
            }
        }, false);

        return callBackResult;
    },

    regWishLstAjaxCallback : function(res, obj) {

        setTimeout(function() {
            // 목록 갱신을 위해 제거
            sessionStorage.removeItem("wishList");
            common.wish.checkWishList();
        }, 100);

        var result = res.trim();
        if (result != '000') {
            if (result == '100') {
                // 로그인 실패
                if (!common.loginChk()) {
                    return;
                }
            } else if (result == '200') {
                if (common.isLogin()) {
                    // 성인상품인데 로그인은 되어 있으나 성인인증이 안되었을 경우
                    common.link.moveRegCertPage("Y", location.href);
                } else {
                    // 성인인증필요
                    // 로그인 성인체크
                    common.link.moveLoginPage("Y", location.href);
                }
                return;
            } else if (result == '500') {
                // 개수 초과
                alert("쇼핑 찜은 99개 까지만 담으실 수 있습니다.");
                return;
            } else if (result == '600') {
                // 개수 초과
                // alert("이미 찜한 상품입니다.");
                alert("쇼핑찜리스트에 저장된 상품입니다.");
                return;
            }
        }

        if (obj != undefined) {
            obj.addClass("mClick");
        }
        // 찜 알림레이어 On
        $(".layerAlim").removeClass("Basket");
        $(".layerAlim").removeClass("zzimOff");
        $(".layerAlim").removeClass("zzimOn");
        $(".layerAlim").removeClass("brand");
        
        $(".layerAlim").removeClass("zzimOn");
        $(".layerAlim > p").addClass("one");
        $(".layerAlim > p").html("<strong>좋아요</strong>");
        $(".layerAlim").fadeIn(500);

        setTimeout(function() {
            $(".layerAlim").fadeOut(800);
        }, 1200);

        // setTimeout(function(){
        // $(".layerAlim").removeClass("zzimOn");
        // }, 2300);
    },

    delWishLst : function(param, obj) {
        if (param.goodsNo == undefined || param.goodsNo == "") {
            alert("삭제가 실패하였습니다.\n상품정보가 없습니다.");
            return;
        }

        var callBackResult = "";

        common.Ajax.sendRequest("POST", _baseUrl + "mypage/delWishLstAjax.do", param, function(res) {
            callBackResult = res;
            common.wish.delWishLstAjaxCallback(res, obj)
        }, false);

        return callBackResult;
    },

    delWishLstAjaxCallback : function(res, obj) {
        // 목록 갱신을 위해 제거
        sessionStorage.removeItem("wishList");
        common.wish.checkWishList();

        var result = res.trim();
        if (result != '000') {
            if (result == '100') {
                // 로그인 실패
                if (!common.loginChk()) {
                    return;
                }
            }
        }

        if (obj != undefined) {
            obj.removeClass("mClick");
        }
        // 찜 알림레이어 Off
        $(".layerAlim").removeClass("Basket");
        $(".layerAlim").removeClass("zzimOff");
        $(".layerAlim").removeClass("zzimOn");
        $(".layerAlim").removeClass("brand");
        
        $(".layerAlim").addClass("zzimOff");
        $(".layerAlim > p").addClass("one");
        $(".layerAlim > p").html("<strong>좋아요</strong>");
        $(".layerAlim").fadeIn(500);

        setTimeout(function() {
            $(".layerAlim").fadeOut(800);
        }, 1200);

        // setTimeout(function(){
        // $(".layerAlim").removeClass("zzimOff");
        // }, 2000);
    },
    
    regBrndWishLst : function(param, obj){
        if (param.onlBrndCd == undefined || param.onlBrndCd == "" ) {
            alert("등록이 실패하였습니다.\n브랜드정보가 없습니다.");
            return;
        }
        
        var callBackResult = "";

        common.Ajax.sendRequest(
                  "POST"
                , _baseUrl + "mypage/regBrndWishLstAjax.do"
                , param
                , function(res) {                    	
                    callBackResult = res;
                    common.wish.regBrndWishLstAjaxCallback(res, obj, param);
                    
                    if(res.resultCd == '000') {
                    	try {
                    		common.wish.sendBrdLikeRecobell(param.onlBrndCd);
                    	} catch(e) {
                    	}
                    }
                }
                , false
        );
        
        return callBackResult;
    },

    regBrndWishLstAjaxCallback : function(res, obj, param){

        var result = res.resultCd;
        if (result != '000') {
            if (result == '100') {
                //로그인 실패
                if (!common.loginChk()) {
                    return;
                }
            }else if (result == '600') {
                //이미 찜
                //alert("이미 찜한 상품입니다.");
                alert("이미 좋아요에 저장된 브랜드입니다."); 
                return;
            }
        }

        if (obj != undefined) {
            obj.addClass("on");
        }
        
        if(res.brndCnt > 0){
			$(".brand_like span.icon").not("#brnd_prd").html("<span class='fw400'>"+res.brndCnt+"</span>명이 "+$(".brand_like a").attr("data-ref-onlBrndNm")+"를 좋아합니다.");
		}else{
			$(".brand_like span.icon").not("#brnd_prd").html("브랜드의 상품 안내 및 추천을 받으실 수 있습니다.");
		}
        
        
        // 찜 알림레이어 On
        if(param.layerYn != 'N'){
        	$(".layerAlim").removeClass("Basket");
        	$(".layerAlim").removeClass("zzimOff");
        	$(".layerAlim").removeClass("zzimOn");
        	$(".layerAlim").removeClass("brand");
        	
        	$(".layerAlim").addClass("brand");
        	$(".layerAlim").addClass("zzimOn");
        	$(".layerAlim > p").html("브랜드<strong>좋아요</strong>");
        	$(".layerAlim").fadeIn(500);
        	
        	setTimeout(function() {
        		$(".layerAlim").fadeOut(800);
        	}, 1200);
        }
    },
    
    delBrndWishLst : function(param, obj){
        if (param.onlBrndCd == undefined || param.onlBrndCd == "" ) {
            alert("삭제가 실패하였습니다.\n브랜드정보가 없습니다.");
            return;
        }        
        var callBackResult = "";

        common.Ajax.sendRequest(
                "POST"
              , _baseUrl + "mypage/delBrndWishLstAjax.do"
              , param
              , function(res) {                	
                  callBackResult = res;
                  common.wish.delBrndWishLstAjaxCallback(res, obj, param);
              }
              , false
        );
        
        return callBackResult;
        
    },

    delBrndWishLstAjaxCallback : function(res, obj, param){
        //목록 갱신을 위해 제거
//        common.wish.checkWishList();

        var result = res.resultCd;
        if (result != '000') {
            if (result == '100') {
                //로그인 실패
                if (!common.loginChk()) {
                    return ;
                }
            }
        }

        if (obj != undefined) {
            obj.removeClass("on");
        }
        
        if(res.brndCnt > 0){
        	$(".brand_like span.icon").not("#brnd_prd").html("<span class='fw400'>"+res.brndCnt+"</span>명이 "+$(".brand_like a").attr("data-ref-onlBrndNm")+"를 좋아합니다.");
		}else{
			$(".brand_like span.icon").not("#brnd_prd").html("브랜드의 상품 안내 및 추천을 받으실 수 있습니다.");
		}
        
     // 찜 알림레이어 Off
        if(param.layerYn != 'N'){
        	$(".layerAlim").removeClass("Basket");
        	$(".layerAlim").removeClass("zzimOff");
        	$(".layerAlim").removeClass("zzimOn");
        	$(".layerAlim").removeClass("brand");
        	
        	$(".layerAlim").addClass("brand");
        	$(".layerAlim").addClass("zzimOff");
        	$(".layerAlim > p").html("브랜드<strong>좋아요</strong>");
        	$(".layerAlim").fadeIn(500);
        	
        	setTimeout(function() {
        		$(".layerAlim").fadeOut(800);
        	}, 1200);
        }
    
    },
    
    delAllBrndWishLst : function(param){
        common.Ajax.sendRequest(
                "POST"
              , _baseUrl + "mypage/delBrndWishLstAjax.do"
              , param
              , common.wish.delBrndWishLstAjaxCallback
        );
    },
    
    delAllWishLst : function(param) {
        common.Ajax.sendRequest("POST", _baseUrl + "mypage/delWishLstAjax.do", param,
                common.wish.delWishLstAjaxCallback);
    },
    sendBrdLikeRecobell : function(brand_id) {
	    var src = (('https:'==document.location.protocol)?'https':'http')+'://logger.eigene.io/js/logger.min.js';
	    var scriptLen = $("script").filter("[src='"+src+"']").length;
	    
	    if(scriptLen == 0) {
	    	(function(s,x){s=document.createElement('script');s.type='text/javascript';
		    s.async=true;s.defer=true;s.src=(('https:'==document.location.protocol)?'https':'http')+
		    '://logger.eigene.io/js/logger.min.js';
		    x=document.getElementsByTagName('script')[0];x.parentNode.insertBefore(s, x);})();
	    }
	    
	    eglc.op('setVar', 'cuid', recoCuid);
	    eglc.op('setVar', 'brandId', brand_id);
	    eglc.op('setVar', 'userId', hashedRecoSsoMbrNo);
	    eglc.op('track', 'like');
    }
};

$.namespace("common.coupon");
common.coupon = {
    /**
     * **** 쿠폰 등록 레이어 팝업 *****
     * 
     * 팝업 호출 및 쿠폰 등록
     * 
     * getRegCouponForm : arg = true 이면 화면 갱신 arg 없으면 화면 갱신하지 않음
     */
    reload : false,
    getRegCouponForm : function(reload) {
        if (typeof reload != "undefined") {
            if (reload) {
                common.coupon.reload = true;
            }
        } else {
            common.coupon.reload = false;
        }
        common.Ajax.sendRequest("POST", _baseUrl + "common/popup/getRegCouponFormPop.do", null, function(res) {
            $("#pop-full-contents").html(res);
            common.popFullOpen("쿠폰 등록");
        });
    },
    regCouponAjax : function() {
        if (!common.isLogin() && confirm("로그인 후 신청하실 수 있습니다.\r\n로그인 페이지로 이동하시겠습니까?")) {
            common.link.moveLoginPage("", location.href);
        } else {
            var rndmVal = $("#rndmVal").val();

            if (rndmVal.length <= 0) {
                alert("쿠폰번호를 입력해주세요.");
                return false;
            }
            common.Ajax.sendRequest("POST", _baseUrl + "common/regCouponJson.do", {
                rndmVal : rndmVal
            }, common.coupon.regCouponAjaxCallback);
        }
    },
    regCouponAjaxCallback : function(res) {
        if (typeof res != "undefined") {
            if (res == '000') {
                alert("쿠폰이 등록되었습니다. 등록된 쿠폰은 'MY>쿠폰'에서 확인 가능합니다.");

                if (common.coupon.reload) {
                    document.location.reload();
                } else {
                    common.popFullClose();
                }
            } else {
                alert(res);
            }
        }
    }
};

$.namespace("common.zipcode.pop");
common.zipcode.pop = {
    daumApiYn : 'Y', //DAUM 주소팝업 사용여부 Y:사용, Y가 아닌경우 구 주소팝업 호출
        
    fnCallback : '',

    defaultId : "search-zipcode-pop",

    init : function(popCallback, id) {
        common.zipcode.pop.fnCallback = popCallback;

        if (arguments.length == 1 || !id) {
            id = common.zipcode.pop.defaultId;
        }
        
        if(common.zipcode.pop.daumApiYn == 'Y'){
            $('#' + id).click(function() {
                common.setScrollPos2();// 클릭 시, 스크롤 위치값 localstorage 저장
                $('#pop-full-contents').html('');
                $('#pop-full-contents').load(_baseUrl + 'common/popup/searchZipcodePopApi.do', function() {

                    common.popFullOpen('우편번호 찾기');

                    mcommon.popup.zipcodeApi.init(common.zipcode.pop.fnCallback);
                });
            });
        } else {
            $('#' + id).click(function() {
                common.setScrollPos2();// 클릭 시, 스크롤 위치값 localstorage 저장
                $('#pop-full-contents').html('');

                $('#pop-full-contents').load(_baseUrl + 'common/popup/searchZipcodePop.do', function() {

                    common.popFullOpen('우편번호 찾기');

                    mcommon.popup.zipcode.init(common.zipcode.pop.fnCallback);
                });
            });
        }
        
    }
};

$.namespace("common.zipcodequick.pop");
common.zipcodequick.pop = {
    fnCallback : '',

    defaultId : "search-zipcode-pop",

    init : function(popCallback, id) {
        common.zipcodequick.pop.fnCallback = popCallback;
        common.zipcodequick.pop.quickYn = 'Y'; // 당인배송에서 호출하는 경우 추가

        if (arguments.length == 1 || !id) {
            id = common.zipcodequick.pop.defaultId;
        }

        if(common.zipcode.pop.daumApiYn == 'Y'){
            $('#' + id).click(
                function() {

                common.setScrollPos();
                $('#searchZipcode').find('#LAYERPOP01-contents-quick').html('');
                $('#searchZipcode').find('#LAYERPOP01-title').html('우편번호 찾기');

                $('#searchZipcode').find('#LAYERPOP01-contents-quick').load(
                        _baseUrl + 'common/popup/searchZipcodePopApi.do?popYn=N', function() {
                            common.setScrollPos();
                            common.popLayerOpen2("searchZipcode");

                            mcommon.popup.zipcodeApi.init(common.zipcodequick.pop.fnCallback);
                        });
                });
        } else {
            $('#' + id).click(
                function() {

                common.setScrollPos();
                $('#searchZipcode').find('#LAYERPOP01-contents-quick').html('');
                $('#searchZipcode').find('#LAYERPOP01-title').html('우편번호 찾기');

                $('#searchZipcode').find('#LAYERPOP01-contents-quick').load(
                        _baseUrl + 'common/popup/searchZipcodePop.do', function() {
                            common.setScrollPos();
                            common.popLayerOpen2("searchZipcode");

                            mcommon.popup.zipcode.init(common.zipcodequick.pop.fnCallback);
                        });
                });
        }
        
        
    },

    /** 배송지 등록 폼 * */
    deliveryRegistForm : function() {
        var url = _baseUrl + "goods/getDeliveryRegistFormAjax.do";
        var data = {};
        common.Ajax.sendRequest("POST", url, data, common.zipcodequick.pop._callBackDeliveryRegistForm);
    },

    /** 배송지 등록(장바구니) 폼 * */
    deliveryRegistCartForm : function() {
        common.zipcodequick.pop.cartYn = 'Y';
        var url = _baseUrl + "cart/getDeliveryRegistFormCartAjax.do";
        var data = {};
        common.Ajax.sendRequest("POST", url, data, common.zipcodequick.pop._callBackDeliveryRegistForm);
    },

    /** 배송지 등록 폼 콜백 * */
    _callBackDeliveryRegistForm : function(res) {
        common.setScrollPos();
        var cDiv = $(res.trim());
        $("#pop-full-wrap").html(cDiv);
        $('#rmitCellSctNo').css({
            'width' : '30.6%'
        });
        $('#rmitTelRgnNo').css({
            'width' : '30.6%'
        });

        common.popFullOpen("배송지 추가");
        common.zipcodequick.pop.init(mmypage.deliveryForm.selectedZipcodeCallback);
    },

    /** 배송지 등록 닫기 * */
    deliveryRegistFormClose : function() {
        common.popFullClose();
        common.zipcodequick.pop.quickYn = '';

        mgoods.detail.todayDelivery.todayDeliveryList();
    },

    /** 배송지 등록 후 닫기 * */
    deliveryRegistFormAfterClose : function() {
        common.popFullClose();
        common.zipcodequick.pop.quickYn = '';

        mgoods.detail.todayDelivery.registTodayDeliverySelect();
    },

    /** 배송지 등록 닫기 * */
    deliveryRegistFormCartClose : function() {
        common.popFullClose();
        common.zipcodequick.pop.quickYn = '';
        common.zipcodequick.pop.cartYn = '';
        window.location.reload();
        // mgoods.detail.todayDelivery.todayDeliveryList();
    }

};

$.namespace("common.bann");
common.bann = {

    getPopInfo : function(popType) {
        // var cookie = new Cookie('local', 1, 'D');
        var cookie = new Cookie(1);

        if (cookie.get('popBannHistory') != undefined && cookie.get('popBannHistory') != "") {
            var popBannHistoryStr = cookie.get('popBannHistory');
            var jsonStr = JSON.parse(popBannHistoryStr);

            for (var i = 0; i < jsonStr.length; i++) {
                if (jsonStr[i].popType == popType) {
                    return jsonStr[i];
                }
            }
        }
        return null;
    },

    setPopInfo : function(popType, compareKey) {
        // var cookie = new Cookie('local', 1, 'D');
        var cookie = new Cookie(1);
        var bannArr = new Array();

        if (cookie.get('popBannHistory') != undefined && cookie.get('popBannHistory') != "") {
            var popBannHistoryStr = cookie.get('popBannHistory');

            // 신규
            if (popBannHistoryStr == "") {
                var bannInfo = new Object();

                bannInfo.popType = popType;
                bannInfo.compareKey = compareKey;
                bannInfo.regDtime = new Date();

                bannArr.push(bannInfo);

            } else {
                var jsonStr = JSON.parse(popBannHistoryStr);

                var hasInfo = false;

                for (var i = 0; i < jsonStr.length; i++) {
                    if (jsonStr[i].popType == popType) {
                        jsonStr[i].compareKey = compareKey;
                        jsonStr[i].regDtime = new Date();
                        hasInfo = true;
                    }

                    bannArr.push(jsonStr[i]);
                }

                if (!hasInfo) {
                    var bannInfo = new Object();

                    bannInfo.popType = popType;
                    bannInfo.compareKey = compareKey;
                    bannInfo.regDtime = new Date();

                    bannArr.push(bannInfo);

                }
            }

        } else {
            var bannInfo = new Object();

            bannInfo.popType = popType;
            bannInfo.compareKey = compareKey;
            bannInfo.regDtime = new Date();

            bannArr.push(bannInfo);
        }
        cookie.set('popBannHistory', JSON.stringify(bannArr));
    },
}

/*
 * 행사사은품선택팝업띄우기
 */
$.namespace('common.popLayer.promGift');
common.popLayer.promGift = {
    jsonParam : false,

    openPromGiftPop : function(vGoodsNo, vItemNo, vPromNo) {
        var url = _baseUrl + "cart/promGiftPopAjax.do";

        var callback = function(res) {
            $("#layerPop").html(res);
            common.popLayerOpen("LAYERPOP01");

            // mcart.base.setLazyLoad('seq');
            var popPos = $('#LAYERPOP01').height() / 2;
            $('#LAYERPOP01').css('margin-top', -(popPos));

            // GET레이어의 상품 수가 1인경우 자동실행
            if ($('li[name=selPopInfo]').length == 1) {
                var stockQty = parseInt($('li[name=selPopInfo]').eq(0).attr('stockQty'));

                if (stockQty > 0) {
                    var setItemCnt = 0;
                    if (stockQty > getItemCnt)
                        setItemCnt = getItemCnt;
                    else
                        setItemCnt = stockQty;

                    $('li[name=selPopInfo]').eq(0).find('input[name=promGiftAmount]').val(setItemCnt);
                    $('li[name=selPopInfo]').eq(0).attr("class", "on");

                    // 기 선택한 추가상품 수량
                    $("p.choiceTxt span i").text(setItemCnt);
                }
            } else {
                // buy상품군의 수량정보를 가져와 품절체크추가
                // 레이어창의 상품군
                var totalCnt = 0;
                $('li[name=selPopInfo]').each(function() {
                    var layerPopObj = $(this);

                    // $("div.prd_item_box").each(function(){
                    $("p.item_number").each(function() {
                        var buyObj = $(this);
                        var buyGoodsNo = buyObj.find("input[name=sGoodsNo]").val();
                        var buyItemNo = buyObj.find("input[name=itemNo]").val();

                        buyGoodsNo = (buyGoodsNo == undefined) ? $("#goodsNo").val() : buyGoodsNo;
                        buyItemNo = (buyItemNo == undefined) ? $("#itemNo").val() : buyItemNo;

                        // buy상품군의 상품정보와 레이어창의 상품정보가 같으면
                        if (layerPopObj.attr('goodsNo') == buyGoodsNo && layerPopObj.attr('itemNo') == buyItemNo) {
                            var buyGoodsCnt = parseInt(buyObj.find('input[type=tel].num').val());
                            var getGoodsCnt = parseInt(layerPopObj.attr('stockQty'));

                            // 상품상세에서 오늘드림 여부가 선택된 경우 오늘드림 재고를 보고 판단해야함 jwkim
                            if ($("#deliveDay").prop("checked") == true) {
                                getGoodsCnt = $("#quickAvalInvQty").val();
                            }

                            // buy상품군의 수량이 실재고 수량보다 크거나 같으면
                            if (buyGoodsCnt >= getGoodsCnt) {
                                // 조건만족시 수량0으로 셋팅하고 품절처리
                                layerPopObj.find('input[name=promGiftAmount]').val(0);
                                layerPopObj.attr('class', 'soldout');
                                layerPopObj.find('div.img').append("<span>일시품절</span>");
                                layerPopObj.find('input[name=promGiftAmount]').attr('disabled', 'disabled');
                                layerPopObj.find('input[name=promGiftAmount]').siblings().attr('disabled', 'disabled');
                                layerPopObj.removeClass("on");
                            } else {
                                layerPopObj.attr('stockQty', getGoodsCnt - buyGoodsCnt);
                            }
                        }
                    });

                    totalCnt += parseInt(layerPopObj.find("input[name=promGiftAmount]").val());
                });

                // 현재 선택된 수량 갱신
                $("p.choiceTxt span i").text(totalCnt); // 기 선택한 추가상품 수량

                // 일시품절 상품 하단 정렬 시작
                var getItemList = [];
                var getItemSoldOutList = [];

                $("ul.listPlusPrd li[name=selPopInfo]").each(function() {
                    if ($(this).hasClass("soldout")) {
                        getItemSoldOutList.push($(this));
                    } else {
                        getItemList.push($(this));
                    }
                });

                $("ul.listPlusPrd").html();

                $(getItemList).each(function() {
                    $("ul.listPlusPrd").append($(this));
                });

                $(getItemSoldOutList).each(function() {
                    $("ul.listPlusPrd").append($(this));
                });
                // 일시품절 상품 하단 정렬 끝
            }
        };

        var isValid = this.validation(vGoodsNo, vItemNo, vPromNo);

        if (isValid) {
            _ajax.sendRequest("GET", url, this.jsonParam, callback);
        }
    },
    /**
     * 파라메터의 validation 처리
     */
    validation : function(vGoodsNo, vItemNo, vPromNo) {
        var isValid = true;
        if (vGoodsNo == null || vGoodsNo == '' || vItemNo == null || vItemNo == '' || vPromNo == null || vPromNo == '') {
            var msg = "죄송합니다. 고객센터(1522-0882)로 문의해 주세요.";

            this.jsonParam = false;
            isValid = false;
            return isValid;
        }

        var buyItemCnt = 0;
        $("div.prd_cnt_box[promNo=" + vPromNo + "]").each(function() {
            buyItemCnt += parseInt($(this).find("input.num").val());
        });

        var buyCondStrtQtyAmt = parseInt($("div.event_info.item_" + vGoodsNo + vItemNo).attr("buyCondStrtQtyAmt"));
        var getItemCnt = parseInt(buyItemCnt / buyCondStrtQtyAmt);

        var quickYn = $(":input:radio[name=qDelive]:checked").val();
        if (typeof (quickYn) == "undefined") {
            quickYn = $("#quickYn").val();
        }

        if (isValid) {
            this.jsonParam = {
                "goodsNo" : vGoodsNo,
                "itemNo" : vItemNo,
                "promNo" : vPromNo,
                "buyItemCnt" : buyItemCnt,
                "getItemCnt" : getItemCnt,
                "quickYn" : quickYn
            };
        }
        return isValid;
    },
    /**
     * 추가상품의 수량 조절
     */
    calcQty : function(optionKey, operator) {
        if (mcart.popLayer.promGift.focusOutFlag) {
            mcart.popLayer.promGift.focusOutFlag = false;
            return false;
        }

        var oldVal = parseInt($("input[name=promGiftAmount]#cartCnt_" + optionKey).val());
        $("input[name=promGiftAmount]#cartCnt_" + optionKey).data('old', oldVal);

        if (operator == "plus") {
            if (oldVal >= getItemCnt) {
                alert('선택하실 수 있는 추가 상품은 최대 ' + getItemCnt + '개 입니다.');
                return false;
            }

            $("input[name=promGiftAmount]#cartCnt_" + optionKey).val(++oldVal).trigger("focusout");
        } else if (operator == "minus") {
            if (oldVal <= 0)
                return false;

            $("input[name=promGiftAmount]#cartCnt_" + optionKey).val(--oldVal).trigger("focusout");
        } else {
            return false;
        }
    }
};

/*--------------------------------------------------------------------------------*\
 * String Object Prototype
 \*--------------------------------------------------------------------------------*/
String.prototype.isEmpty = function() {
    return (this == null || this == '' || this == 'undefined' || this == 'null');
};
// alert("isEmpty="+"".isEmpty());

/**
 * 
 * 숫자여부 체크 함. 사용 예)
 * 
 * "100".isNumber() "-100,000".isNumber(1)
 * 
 * @param opt
 *            1 : (Default)모든 10진수 2 : 부호 없음 3 : 부호/자릿수구분(",") 없음 4 :
 *            부호/자릿수구분(",")/소숫점
 * 
 * @return true(정상) or false(오류-숫자아님)
 * 
 */
String.prototype.isNumber = function(opt) {
    // 좌우 trim(공백제거)을 해준다.
    value = String(this).replace(/^\s+|\s+$/g, "");

    if (typeof opt == "undefined" || opt == "1") {
        // 모든 10진수 (부호 선택, 자릿수구분기호 선택, 소수점 선택)
        var regex = /^[+\-]?(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+){1}(\.[0-9]+)?$/g;
    } else if (opt == "2") {
        // 부호 미사용, 자릿수구분기호 선택, 소수점 선택
        var regex = /^(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+){1}(\.[0-9]+)?$/g;
    } else if (opt == "3") {
        // 부호 미사용, 자릿수구분기호 미사용, 소수점 선택
        var regex = /^[0-9]+(\.[0-9]+)?$/g;
    } else {
        // only 숫자만(부호 미사용, 자릿수구분기호 미사용, 소수점 미사용)
        var regex = /^[0-9]$/g;
    }

    if (regex.test(value)) {
        value = value.replace(/,/g, "");
        return isNaN(value) ? false : true;
    } else {
        return false;
    }
};
// alert("isNumber="+("1-00".isNumber()));

String.prototype.nvl = function(s) {
    return this.isEmpty() ? (s ? s : '') : this + '';
};
String.prototype.startWith = function(str) {
    if (this === str)
        return true;

    if (str.length > 0)
        return str === this.substr(0, str.length);
    else
        return false;
};
String.prototype.endWith = function(str) {
    if (this == str)
        return true;

    if (String(str).length > 0)
        return str === this.substr(this.length - str.length, str.length);
    else
        return false;
};
String.prototype.bytes = function() { // 바이트 계산.
    var b = 0;
    for (var i = 0; i < this.length; i++)
        b += (this.charCodeAt(i) > 128) ? 2 : 1;
    return b;
};
String.prototype.nl2br = function() {
    return this.replace(/\n/g, "<br />");
};
String.prototype.toMoney = function() {
    var s = (this.nvl('0')).trim();
    if (isFinite(s)) {
        while ((/(-?[0-9]+)([0-9]{3})/).test(s)) {
            s = s.replace((/(-?[0-9]+)([0-9]{3})/), "$1,$2");
        }
        return s;
    } else {
        return this;
    }
};
String.prototype.toNegative = function() {
    return this == '0' ? this : "- " + this;
};

/**
 * val 문자열을 len 길이만큼 왼쪽에 char 문자를 붙여서 반환 한다.
 * 
 * 사용 예) "A".lpad(5, "0") => "0000A"
 * 
 * @param val
 *            문자열
 * @param len
 *            생성할 문자열 길이
 * @param char
 *            해당 길이만큼 왼쪽에 추가할 문자
 */
String.prototype.lpad = function(len, char) {
    var val = String(this);
    if (typeof (char) != "string" && typeof (len) != "number") {
        return val;
    }
    char = String(char);
    while (val.length + char.length <= len) {
        val = char + val;
    }

    return val;
};
// alert("A".lpad(5, "0"));

/**
 * val 문자열을 len 길이만큼 오른쪽에 char 문자를 붙여서 반환 한다.
 * 
 * 사용 예) "A".rpad(5, "0") => "A0000"
 * 
 * @param val
 *            문자열
 * @param len
 *            생성할 문자열 길이
 * @param char
 *            해당 길이만큼 오른쪽에 추가할 문자
 */
String.prototype.rpad = function(len, char) {
    var val = String(this);
    if (typeof (char) != "string" && typeof (len) != "number") {
        return val;
    }
    char = String(char);
    while (val.length + char.length <= len) {
        val = val + char;
    }

    return val;
};
// alert("A".rpad(5, "0"))

String.prototype.numberFormat = function() {
    // return this;
    // return $.number(this);
    return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

String.prototype.getBytesLength = function() {
    var s = this;
    for (b = i = 0; c = s.charCodeAt(i++); b += c >> 11 ? 3 : c >> 7 ? 2 : 1)
        ;
    return b;
};

String.prototype.getTransSpace = function() {
    return this.split(" ").join("&nbsp;");
};

/*--------------------------------------------------------------------------------*\
 * Number Object Prototype
 \*--------------------------------------------------------------------------------*/
Number.prototype.toMoney = function() {
    return String(this).toMoney();
};

Number.prototype.numberFormat = function() {
    // return this
    // return $.number(this);
    return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * val 문자열을 len 길이만큼 왼쪽에 char 문자를 붙여서 반환 한다.
 * 
 * 사용 예) (123).lpad(5,"0") => "00123"
 * 
 * @param val
 *            문자열
 * @param len
 *            생성할 문자열 길이
 * @param char
 *            해당 길이만큼 왼쪽에 추가할 문자
 */
Number.prototype.lpad = function(len, char) {
    return String(this).lpad(len, char);
};
// alert((123).lpad(5,"0"));

/**
 * val 문자열을 len 길이만큼 오른쪽에 char 문자를 붙여서 반환 한다.
 * 
 * 사용 예) (123).rpad(5,"0") => "12300"
 * 
 * @param val
 *            문자열
 * @param len
 *            생성할 문자열 길이
 * @param char
 *            해당 길이만큼 오른쪽에 추가할 문자
 */
Number.prototype.rpad = function(len, char) {
    return String(this).rpad(len, char);
}
// alert((123).rpad(5,"0"));

/*--------------------------------------------------------------------------------*\
 * Date Object Prototype
 \*--------------------------------------------------------------------------------*/
/**
 * 
 * 포멧에 맞는 날짜 문자열을 꺼낸다.
 * 
 * 사용 예) > new Date().format("yyyy-MM-dd hh:mm:ss E a/p") > => 2016-11-24
 * 11:00:31 목요일 오전
 * 
 * 
 * 
 */
Date.prototype.format = function(format) {
    var weekName = [ "일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일" ];
    var d = this;

    if (!d.valueOf())
        return " ";
    if (format == undefined)
        return " ";
    format = String(format);

    return format.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
        switch ($1) {
        case "yyyy":
            return d.getFullYear();
        case "yy":
            return (d.getFullYear() % 1000).lpad(2, "0");
        case "MM":
            return (d.getMonth() + 1).lpad(2, "0");
        case "dd":
            return d.getDate().lpad(2, "0");
        case "E":
            return weekName[d.getDay()];
        case "HH":
            return d.getHours().lpad(2, "0");
        case "hh":
            return ((h = d.getHours() % 12) ? h : 12).lpad(2, "0");
        case "mm":
            return d.getMinutes().lpad(2, "0");
        case "ss":
            return d.getSeconds().lpad(2, "0");
        case "a/p":
            return d.getHours() < 12 ? "오전" : "오후";
        default:
            return $1;
        }
    });
};
// alert(new Date().format("yyyy-MM-dd hh:mm:ss E a/p"));

/**
 * 일수를 계산한 날짜를 반환 한다.
 * 
 * 사용 예) new Date().addDate(1); : 내일날짜 반환 new Date().addDate(0); : 오늘날짜 반환 new
 * Date().addDate(-1); : 어제날짜 반환
 * 
 * @param dateCount
 *            더할 일수
 * 
 * @return 계산되어 생성된 Date Object
 * 
 */
Date.prototype.addDate = function(dateCount) {
    return new Date(this.valueOf() + (dateCount * (24 * 60 * 60 * 1000)));
};
// alert(new Date().addDate(1).addDate(1));

/*--------------------------------------------------------------------------------------*\
 * Cookie object
 * 2019.08.13_신종민_(SR : 3033094)_cName 분기처리 추가
 *  요구사항 : 모바일 홈 팝업배너 '하루동안 보지않기' 당일 23시 59분까지 보이지 않게 수정    
 \*--------------------------------------------------------------------------------------*/
var Cookie = function(expiresDay) {
    var expdate = (typeof expiresDay == 'number') ? expiresDay : 1;
    return {
        get : function(cName) {
            cName = cName + '=';
            var cookieData = document.cookie;
            var start = cookieData.indexOf(cName);
            var cValue = '';
            if (start != -1) {
                start += cName.length;
                var end = cookieData.indexOf(';', start);
                if (end == -1)
                    end = cookieData.length;
                cValue = cookieData.substring(start, end);
            }
            return unescape(cValue);
        },
        set : function(cName, cValue, expireDays) {

            if (cName == 'popBannHistory') {

                // 현재일의 23시 59분을 파라미터로 던지기
                var d = new Date();
                var dY = d.getFullYear();
                var dM = (d.getMonth()).lpad(2, "0");
                var dD = d.getDate().lpad(2, "0");
                var hExpr = (((23 * 60) + 59) * 60 * 1000);

                var dt = new Date(dY, dM, dD);
                var param = dt.getTime() + hExpr;

                this.setOwner(cName, cValue, param)

            } else {
                this.setOwner(cName, cValue,
                        ((typeof expireDays == 'number' ? expireDays : expdate) * 24 * 60 * 60 * 1000))
            }
            return this;
        },
        setOwner : function(cName, cValue, expire) {
            var expdate = new Date();

            if (cName == 'popBannHistory') {                
                expdate.setTime(expire);
                /* 3201008 안드로이드 앱, 모바일 팝업배너 '하루보지 않기' 동작 오류 */
                common.app.syncCookie(); //앱-웹간 Cookie등 동기화 수행                
            } else {
                expdate.setTime(expdate.getTime()
                        + (typeof expire == 'number' ? expire : (expdate * 24 * 60 * 60 * 1000)));
            }

            document.cookie = cName + "=" + cValue + "; path=/; domain=" + document.domain + "; expires="
                    + expdate.toGMTString();
        },
        remove : function(name) {
            return this.set(name, '', -1);
        },
        getItem : function(name) {
            return this.get(name);
        },
        setItem : function(name, value) {
            this.set(name, value);
        },
        removeItem : function(name) {
            this.remove(name);
        },
        clear : function() {
            return;
        }
    };
};

/*--------------------------------------------------------------------------------*\
 * Cache object
 \*--------------------------------------------------------------------------------*/
var Cache = function(type, span/* integer */, format/* s, m, h, d, M, y, w */) {
    var _cacheType = (typeof type != 'string' || type == '') ? 'cache' : type; // cache
    // ||
    // local
    // ||
    // session
    var _span = (typeof span == 'number') ? span : 0;
    var _format = (typeof format == 'string') ? format : '';
    var _storage = null;
    var _expires = getCacheExpires(_span, _format);
    var _default = {
        set : function() {
            return;
        },
        get : function() {
            return '';
        },
        isStatus : function() {
            return false;
        },
        remove : function() {
            return;
        },
        clear : function() {
            return;
        }
    };

    if (_cacheType == 'session') {
        if (!window.sessionStorage)
            return _default;
        _storage = window.sessionStorage;
        _expires = (_span != 0) ? _expires : getCacheExpires(12, 'h'); // 12
        // hours
    } else if (_cacheType == 'cache') {
        if (!window.localStorage)
            return _default;
        _storage = window.sessionStorage;
        _expires = (_span != 0) ? _expires : getCacheExpires(5, 'm'); // 5
        // minutes
    } else if (_cacheType == 'local') {
        if (!window.localStorage)
            return _default;
        _storage = window.localStorage;
        _expires = (_span != 0) ? _expires : getCacheExpires(7, 'd'); // 7
        // days
    } else if (_cacheType == 'cookie') {
        _storage = com.lotte.smp.Cookie(1);
        _expires = (_span != 0) ? _expires : getCacheExpires(1, 'd'); // 1
        // days
    } else {
        return _default;
    }

    function getCacheExpires(s, f) {
        var exp = 0;
        switch (f) {
        case 's':
            exp = 1;
            break;
        case 'm':
            exp = 60;
            break;
        case 'h':
            exp = 3600;
            break; // 60 * 60
        case 'd':
            exp = 86400;
            break; // 60 * 60 * 24
        case 'w':
            exp = 604800;
            break; // 60 * 60 * 24 * 7
        case 'M':
            exp = 2592000;
            break; // 60 * 60 * 24 * 30
        case 'y':
            exp = 31536000;
            break; // 60 * 60 * 24 * 365
        }
        return s * exp;
    }

    return {
        type : _cacheType,
        storage : _storage,
        expires : _expires,
        set : function(name, value, expires) {
            if (typeof name != 'string' || name == '')
                return;
            if (value == 'undefined')
                return;
            if (expires == 'undefined' || typeof expires != 'number') {
                expires = this.expires;
            }

            var date = new Date();
            var schedule = Math.round((date.setSeconds(date.getSeconds() + expires)) / 1000);

            this.storage.setItem(this.type + '@' + name, value);
            this.storage.setItem(this.type + '@time_' + name, schedule);

            return this;
        },
        get : function(name) {
            if (this.isStatus(name)) {
                return this.storage.getItem(this.type + '@' + name);
            } else {
                return '';
            }
        },
        isStatus : function(name) {
            if (this.storage.getItem(this.type + '@' + name) == null
                    || this.storage.getItem(this.type + '@' + name) == '')
                return false;

            var date = new Date();
            var current = Math.round(+date / 1000);

            // Get Schedule
            var stored_time = this.storage.getItem(this.type + '@time_' + name);
            if (stored_time == 'undefined' || stored_time == 'null') {
                stored_time = 0;
            }

            // Expired
            if (stored_time < current) {
                this.remove(name);
                return false;
            } else {
                return true;
            }
        },
        remove : function(name) {
            this.storage.removeItem(this.type + '@' + name);
            this.storage.removeItem(this.type + '@time_' + name);
        },
        clear : function() {
            for ( var item in this.storage) {
                if (String(item).startWith(this.type)) {
                    this.storage.removeItem(item);
                }
            }
            // this.storage.clear();
        }
    };
};

jQuery.fn.serializeObject = function() {
    var obj = null;
    try {
        if (this[0].tagName && this[0].tagName.toUpperCase() == "FORM") {
            var arr = this.serializeArray();
            if (arr) {
                obj = {};
                jQuery.each(arr, function() {
                    obj[this.name] = this.value;
                });
            }
        }
    } catch (e) {
    } finally {
    }

    return obj;
};

var lazyloadSeq = {
    data_attribute : "original",
    selector : "",
    replaceClassNm : "",

    load : function(selector, classNm) {
        lazyloadSeq.selector = selector;
        lazyloadSeq.replaceClassNm = classNm;

        var imgList = $(lazyloadSeq.selector);
        var imgCnt = imgList.length;

        lazyloadSeq.loadRecursive(0, imgCnt, imgList);
    },

    loadRecursive : function(curImgIdx, imgCnt, list) {
        if (curImgIdx == undefined || curImgIdx == null) {
            curImgIdx = 0;
        }

        var targetImgCnt = imgCnt;

        if (targetImgCnt > curImgIdx) {
            var dstImg = list.eq(curImgIdx);
            var imgSrc = dstImg.attr("data-" + lazyloadSeq.data_attribute);

            if (dstImg.is("img")) {
                dstImg.attr("src", imgSrc);
            } else {
                dstImg.css("background-image", "url('" + imgSrc + "')");
            }

            dstImg.removeClass(lazyloadSeq.replaceClassNm).addClass("completed-" + lazyloadSeq.replaceClassNm);
            // console.log("img load : " + imgSrc);
            // setTimeout(function() {
            lazyloadSeq.loadRecursive(++curImgIdx, targetImgCnt, list);
            // }, 10);
        }
    }

};

var scrollTrigger = {
    scrollStarted : false,
    scrollLooper : null,

    init : function() {
        document.addEventListener('touchmove', function() {

            if (scrollTrigger.scrollLooper != null) {
                clearInterval(scrollTrigger.scrollLooper);
            }

            scrollTrigger.scrollStarted = true;
            scrollTrigger.scrollLooper = setInterval(function() {
                $(window).trigger("scroll");
                // console.log("trigger scroll");
            }, 200)
        });
        document.addEventListener('touchend', function() {
            scrollTrigger.scrollStarted = false;
            $(window).trigger("scroll");
            setTimeout(function() {
                if (scrollTrigger.scrollStarted == false) {
                    clearInterval(scrollTrigger.scrollLooper);
                    console.log("end trigger scroll");

                    scrollTrigger.scrollLooper = null;
                }
            }, 1000);
        });
    }
};
