$.namespace("mlogin.login");
mlogin.login = {

    choiceTermQFlag : "Y",
    
    init : function () {
    	
        $("#loginId").focus();
      
        //자동로그인
        $("[name='autoLoginAgrYn']").click(function(){
        	
        	/* 3317215 DS 클릭지표 추가 */
        	common.wlog("auto_login_mc");
        	
            if ($("[name='autoLoginAgrYn']").is(":checked")) {
                $("[name='saveLoginIdYn']").prop("checked", true);
            } else {
                try {
                    if (common.app.appInfo.isapp) {
                        $('.dim').show();
                        common.popLayerOpen("DIV_AUTO_LOGIN_YN");
                        $("[name='autoLoginAgrYn']").prop("checked", true);
                    } else {
                        if (!confirm("자동 로그인 해제 시 30분간 서비스를 이용하지 않으면 자동로그아웃합니다. 정말 해제하시겠습니까?")) {
                            $("[name='autoLoginAgrYn']").click();
                        } 
                    }
                } catch(e) {}
            }
        });
        
        //아이디저장
        $("[name='saveLoginIdYn']").click(function(){
        	
        	/* 3317215 DS 클릭지표 추가 */
        	common.wlog("save_loginid_mc");
        	
            if(!$("[name='saveLoginIdYn']").is(":checked") && $("[name='autoLoginAgrYn']").is(":checked")){
                $("[name='autoLoginAgrYn']").prop("checked",false);
            }
        });
        
        
        
    },
    
    memberJoin : function(flag, evtNo){
        
        /* 3317215 DS 클릭지표 추가 */
    	common.wlog("member_join_mc");

    	var url = _cjEaiUrl + _memJoinUrl + "&coop_return_url=" + encodeURIComponent(_baseUrl + "main/main.do");
    	
    	if(flag == "Y"){
    		if(evtNo == "00000000006705"){
    			url = _cjEaiUrl + _memJoinUrl + "&coop_url=" + encodeURIComponent(_baseUrl + "event/getEventDetail.do?evtNo=" + evtNo);
    		}else{
    			url = _cjEaiUrl + _memJoinUrl + "&coop_return_url=" + encodeURIComponent(_baseUrl + "event/20200201_1/getEventDetail.do?evtNo=" + evtNo)
    		}
    	}
    	
        if(common.app.appInfo.isapp){
            common.app.callOpenPage("회원가입",url);
        }else{
            window.open(url);
        }
    },
    
    //로그인화면에서 x키를 누른경우(화면상에는 창 닫기지만 실제 동작은 historyback임.
    back : function(){
    	/* 3317215 DS 클릭지표 추가 */
    	common.wlog("back_mc");
        var referer =parent.document.referrer;
        if (common.app.appInfo.isapp) {
            common.app.callClosePage();
        } else {
            if(referer =="" || referer.indexOf("kauth.kakao.com") > 0){	//카카오로그인 약관동의 레퍼러 제거 
                window.location.replace(_baseUrl + "main/main.do");
            }else{
                history.back();
            }
        }
    },
    
    //비밀번호 변경 화면에서 back한경우
    layerBack : function(_smart){
        if(!common.isEmpty(_smart)){
            //cjone에서 들어온 케이스. cjone close스킴을 준다.
            common.app.callCjoneClose();
        }else{
            if (common.app.appInfo.isapp) {
                common.app.callClosePopup();
            }
            
            setTimeout(function(){
                if(_referer !=""&&!(_referer.indexOf("regCertification.do") > -1)&&!(_referer.indexOf("loginForm.do") > -1)&&!(_referer.indexOf("/mypage/") > -1)){
                    if(_referer.indexOf(_baseUrl)> -1){ 
                        window.location.replace(_referer);
                    }else{
                        window.location.replace(_baseUrl + _referer);
                    }
                }else{
                    window.location.replace(_baseUrl + "main/main.do?ssoCheck=N");
                }
            },200);
        }
        
        
    },
    
    //성인인증에서 back한경우
    certBack : function (){
        if (common.app.appInfo.isapp) {
            common.app.callWebScript("certHistoryBack();");
        }else{
            history.back();
        }
        
    },
    
    
    custInit : function (idx){ 
        if(idx == "agreeY"){ //약관
            if($("#chk02").is(":checked")&&$("#chk03").is(":checked")&&$("#chk04").is(":checked")&&$("#chk05").is(":checked")){
                if(($("#svcEvtAgrYn").is(":checked") && ($("#smsRcvAgrYn").is(":checked") || $("#pushMsgRcvYn").is(":checked")))
                        ||!$("#svcEvtAgrYn").is(":checked")){
                	
                	// 체크한 선택약관항목이 없는 경우
                	if(!$("#svcEvtAgrYn").is(":checked") && !$("#mbrCurAgrYn").is(":checked") && mlogin.login.choiceTermQFlag == "Y"){
                		if(!confirm("올리브영의 다양한 서비스와 혜택알림을 받으실 수 있는 선택 정보 이용동의를 설정하지 않으셨습니다.\n이대로 진행 하시겠습니까?\n\n마이페이지>회원정보 수정에서 변경가능합니다.")){
                			return false;
                		} else {
                			mlogin.login.choiceTermQFlag = "N";
                		}
                	}
                	
                    var url = _secureUrl +"customer/agreeTermJson.do";
                    var agr10 = ($("[type='checkbox'][value='10']").is(":checked"))?"Y":"N";
                    var agr20 = ($("[type='checkbox'][value='20']").is(":checked"))?"Y":"N";
                    var agr40 = ($("#svcEvtAgrYn").is(":checked"))?"Y":"N";
                    var agr50 = ($("#mbrCurAgrYn").is(":checked"))?"Y":"N";
                    var sms = ($("#smsRcvAgrYn").is(":checked"))?"Y":"N";
                    var push = ($("#pushMsgRcvYn").is(":checked"))?"Y":"N";
                    
                    if(_newAgrYn=="Y"){
                    	//NEW_AGRM_AGR_YN 가 null이거나 N인경우
                        $.ajax({
                            url: url,
                            type: 'POST',
                            data: {"agr10": agr10, "agr20": agr20, "agr40": agr40, "agr50": agr50, "sms": sms, "push": push, "evtYn": "N", "isSetting": "N"},
                            async: false,
                            success: function(data){
                                mlogin.login.loginSuccess(data);
                            }
                        });
                    }else{
                        //첫방문약관처리
                        var data = mlogin.login.agreeSetting();
                        $.ajax({
                            type   : "GET"
                           ,url    : _agrSvcUrl
                           ,data   : {params:JSON.stringify(data)}
                           ,dataType : "jsonp"
                           ,jsonp : "callback"
                           ,async : false
                           ,cache : false
                           ,success: function(data){
                               
                               // 선택약관동의처리
                               $.ajax({
                                   url: url,
                                   type: 'POST',
                                   data: {"agr10": "X", "agr20": "X", "agr40": agr40, "agr50": agr50, "sms": sms, "push": push, "evtYn": "N", "isSetting": "N"},
                                   async: false,
                                   success: function(r){
	                                   mlogin.login.sendTmsPush(push); // TMS 푸시동의정보 송신
	                                   mlogin.login.loginSuccess(data);
                                   }
                                   ,error  : function (request,status,error){
                                       console.log("code:" + request.status + "\nmessage:" + request.responseText + "\nerror :" + error);
                                       alert(error);
                                       common.link.moveLogoutPage();
                                   }
                               });
                               
                               mlogin.login.loginSuccess(data); 
                           }
                           ,error  : function (request,status,error){
                               console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
                               alert(error);
                               window.location.replace(_baseUrl+"logout.do"); 
                           }
                        });
                    }
                    
                }else{
                  //마케팅동의 체크 안한경우
                    alert("서비스·이벤트 알림 수신 동의를 동의 하신 경우 알림 수신 채널을 최소 1개 필수로 선택하셔야 합니다.");
                    return false;
                }
            }else{
                alert("필수 동의 항목 미 동의 시 회원가입을 하실 수 없습니다.");
                if(!$("#chk02").is(":checked")){
                    $("#chk02").focus();
                }else if(!$("#chk03").is(":checked")){
                    $("#chk03").focus();
                }else if(!$("#chk04").is(":checked")){
                    $("#chk04").focus();
                }else if(!$("#chk05").is(":checked")){
                    $("#chk05").focus();
                }
                return false;
            }
        }else if( idx =="agreeN"){ //약관미동의
            if(_smart=="Y"){
                //cjone에서 들어온 케이스. cjone close스킴을 준다.
                common.app.callCjoneClose();
                setTimeout(function() {
                    common.app.callCjoneClose();
                }, 200);
                return false;
            }else if(confirm("서비스 미동의 시 CJ ONE 포인트 적립, 사용, 이벤트 참여 등 회원 혜택을 받을 수 없습니다. 비회원으로 올리브영 온라인샵을 이용하시겠습니까?")){
                if (common.app.appInfo.isapp) {
                    common.app.callClosePopup();
                }
                setTimeout(function() {
                    common.link.moveLogoutPage();
                }, 200);
            }
        }else if( idx =="restY"){ //휴면해제
            if(!common.isEmpty(_target)){
                if(_target =="A"){
                    window.location.href = _baseUrl + "customer/clearRestingCustomer.do?agree=Y";
                }else if(_target =="C"){
                    if(common.app.appInfo.isapp){
                        common.app.callOpenPage("휴면해제" , _cjEaiUrl + _clrRstUrl + "&coop_return_url=" + encodeURIComponent(_secureUrl + "login/loginForm.do?agree=Y"));
                    }else{
                        window.open(_cjEaiUrl + _clrRstUrl + "&coop_return_url=" + encodeURIComponent(_secureUrl + "login/loginForm.do?agree=Y"));
                    }
                    return false;
                }else if(_target =="O"){
                    window.location.href = _baseUrl + "customer/clearRestingCustomer.do?agree=Y";
                }else{
                    if (common.app.appInfo.isapp) {
                        common.app.callClosePopup();
                    }
                    setTimeout(function() {
                        common.link.moveMainHome();
                    }, 200); 
                }
            }else{
                if (common.app.appInfo.isapp) {
                    common.app.callClosePopup();
                }
                setTimeout(function() {
                    common.link.moveMainHome();
                }, 200);
            }
        }else if( idx =="restN"){ //휴면미동의
            if (common.app.appInfo.isapp) {
                common.app.callClosePopup();
            }
            setTimeout(function() {
                common.link.moveMainHome();
            }, 200);
        }else if(idx =="changePwY"){ //비밀번호변경
            if(common.app.appInfo.isapp){
                common.app.callOpenPage("비밀번호변경", _cjEaiUrl + _cngPwdUrl + "&coop_return_url=" + encodeURIComponent(_baseUrl + "main/main.do"));
            }else{
                window.open(_cjEaiUrl + _cngPwdUrl + "&coop_return_url=" + encodeURIComponent(_baseUrl + "main/main.do"),"_blank"); 
            }
        }else if(idx =="changePwN"){ //다음에변경
            //회원정보 업데이트 필요?
            var ajaxUrl = _baseUrl + "customer/changePwDyJson.do";
            common.Ajax.sendRequest("POST", ajaxUrl, "", mlogin.login._callBackChangePwDy, false);
        } 
    },
    
    // [3281039] 이용약관 동의 후 팝업 생성 요청의 件(CHY)
    // layerPop 창을 띄우기 위해 함수 분리 - flag : Y/N, evtYn : N/이벤트 번호
    agreeY : function (flag, evtYn, isSetting){
    	if($("#chk02").is(":checked")&&$("#chk03").is(":checked")&&$("#chk04").is(":checked")&&$("#chk05").is(":checked")){
            if(($("#svcEvtAgrYn").is(":checked") && ($("#smsRcvAgrYn").is(":checked") || $("#pushMsgRcvYn").is(":checked")))
                    ||!$("#svcEvtAgrYn").is(":checked")){
            	
            	// 체크한 선택약관항목이 없는 경우
            	if(!$("#svcEvtAgrYn").is(":checked") && !$("#mbrCurAgrYn").is(":checked") && mlogin.login.choiceTermQFlag == "Y"){
            		if(!confirm("올리브영의 다양한 서비스와 혜택알림을 받으실 수 있는 선택 정보 이용동의를 설정하지 않으셨습니다.\n이대로 진행 하시겠습니까?\n\n마이페이지>회원정보 수정에서 변경가능합니다.")){
            			return false;
            		} else {
            			mlogin.login.choiceTermQFlag = "N";
            		}
            	}
            	
                var push = ($("#pushMsgRcvYn").is(":checked"))?"Y":"N";
                
            	if(flag == "N" && _smart != "Y"){
            		$('.dim').show();
            		common.popLayerOpen('newJoinEvt');
            	}else{
                    var url = _secureUrl +"customer/agreeTermJson.do";
                    var agr10 = ($("#chk02").is(":checked"))?"Y":"N";
                    var agr20 = ($("#chk03").is(":checked"))?"Y":"N";
                    var agr40 = ($("#svcEvtAgrYn").is(":checked"))?"Y":"N";
                    var agr50 = ($("#mbrCurAgrYn").is(":checked"))?"Y":"N";
                    var sms = ($("#smsRcvAgrYn").is(":checked"))?"Y":"N";
                    
            		if(_newAgrYn=="Y"){
                    	//NEW_AGRM_AGR_YN 가 null이거나 N인경우
                        $.ajax({
                            url: url,
                            type: 'POST',
                            data: {"agr10": agr10, "agr20": agr20, "agr40": agr40, "agr50": agr50, "sms": sms, "push": push, "evtYn": evtYn, "isSetting": isSetting},
                            async: false,
                            success: function(data){
                            	mlogin.login.sendTmsPush(push); // TMS 푸시동의정보 송신
                                mlogin.login.loginSuccess(data);
                            }
                        });
                    }else{
                        //첫방문약관처리
                        var data = mlogin.login.agreeSetting();
                        $.ajax({
                            type   : "GET"
                           ,url    : _agrSvcUrl
                           ,data   : {params:JSON.stringify(data)}
                           ,dataType : "jsonp"
                           ,jsonp : "callback"
                           ,async : false
                           ,cache : false
                           ,success: function(data){
                               
                               // 선택약관동의처리
                               $.ajax({
                                   url: url,
                                   type: 'POST',
                                   data: {"agr10": "X", "agr20": "X", "agr40": agr40, "agr50": agr50, "sms": sms, "push": push, "evtYn": evtYn, "isSetting": isSetting},
                                   async: false,
                                   success: function(r){
	                                   mlogin.login.sendTmsPush(push); // TMS 푸시동의정보 송신
	                                   mlogin.login.loginSuccessNew(data, evtYn, isSetting); 
                                   }
                                   ,error  : function (request,status,error){
                                       console.log("code:" + request.status + "\nmessage:" + request.responseText + "\nerror :" + error);
                                       alert(error);
                                       common.link.moveLogoutPage();
                                   }
                               });
                           }
                           ,error  : function (request,status,error){
                               console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
                               alert(error);
                               window.location.replace(_baseUrl+"logout.do"); 
                           }
                        });
                    }
            	}
            }else{
              //마케팅동의 체크 안한경우
                alert("서비스·이벤트 알림 수신 동의를 동의 하신 경우 알림 수신 채널을 최소 1개 필수로 선택하셔야 합니다.");
                return false;
            }
        }else{
            alert("필수 동의 항목 미 동의 시 회원가입을 하실 수 없습니다.");
            if(!$("#chk02").is(":checked")){
                $("#chk02").focus();
            }else if(!$("#chk03").is(":checked")){
                $("#chk03").focus();
            }else if(!$("#chk04").is(":checked")){
                $("#chk04").focus();
            }else if(!$("#chk05").is(":checked")){
                $("#chk05").focus();
            }
            return false;
        }
    },
    
    agreeN : function (){
    	if(_smart=="Y"){
            //cjone에서 들어온 케이스. cjone close스킴을 준다.
            common.app.callCjoneClose();
            setTimeout(function() {
                common.app.callCjoneClose();
            }, 200);
            return false;
        }else if(confirm("서비스 미동의 시 CJ ONE 포인트 적립, 사용, 이벤트 참여 등 회원 혜택을 받을 수 없습니다. 비회원으로 올리브영 온라인샵을 이용하시겠습니까?")){
            if (common.app.appInfo.isapp) {
                common.app.callClosePopup();
            }
            setTimeout(function() {
                common.link.moveLogoutPage();
            }, 200);
        }
    },
    
    _callBackChangePwDy : function(data){
        console.log("_callBackChangePwDy:"+data.result);
        if(data.result){
            if (common.app.appInfo.isapp) {
                common.app.callClosePopup();
            }else{
                if(common.isEmpty(_referer)){
                    window.location.replace(_baseUrl +"main/main.do");
                }else{
                    window.location.replace(_referer);
                }
            }
        }else{
            alert("서비스가 원활하지 않아 비밀번호 변경에 실패하였습니다.");
        }

        if(_isPopup != "Y"){
            setTimeout(function(){
                window.location.replace(_referer);
            },200);
        }else{
            return false;
        }
    },
    
    loginSuccess : function(data){
        var res =(typeof data !== 'object') ? $.parseJSON(data) : data;
        //성공인경우 로그인처리
        if(res != null){
            if((!common.isEmpty(res.CODE) && (res.CODE.indexOf("S") == 0)) || (!common.isEmpty(res.IM_CODE) && (res.IM_CODE.indexOf("S") == 0 )) || res.result ){
                if(_smart=='Y'){
                    window.location.replace(_secureUrl + "mypage/getSmartRecipt.do");
                }else{
                    /* 3212592 12월올영세일_온라인몰 특이현상 점검 및 개선 요청의 件 
                     * "login/loginCheckJson.do" 중복 호출을 막기 위한 SessionStorage내, checkLoginStatus등록
                     * 만약 checkLoginStatus내에 값이 존재할 경우, 값을 반환한다.
                     * 인증 후, 최초 인증을 받기 위해, 존재하는 checkLoginStatus 제거 한다.
                     */
                	sessionStorage.removeItem("checkLoginStatus");
                    var url = _secureUrl + "login/loginSuccess.do";
                    
                    window.location.replace(url);
                }
            }else if(res.strMsg!=null&&res.respon =="N"){
                if(_smart=='Y'){
                    alert("올리브영 약관 동의에 실패하셨습니다.");
                    window.close();
                }else{
                    alert(res.strMsg);
                    common.link.moveLogoutPage();
                }
            }else{
                if(_smart=='Y'){
                    alert("올리브영 약관 동의에 실패하셨습니다.");
                    window.close();
                }else{
                    alert("올리브영 약관 동의에 실패하셨습니다.");
                    common.link.moveLogoutPage();
                }
            }
        }else{
            if(_smart=='Y'){
                alert("올리브영 약관 동의에 실패하셨습니다.");
                window.close();
            }else{
                alert("로그인에 실패하였습니다.");
                common.link.moveLogoutPage();
            }
        }
    },
    
    loginSuccessNew : function(data, evtYn, isSetting){
        var res =(typeof data !== 'object') ? $.parseJSON(data) : data;
        //성공인경우 로그인처리
        if(res != null){
            if((!common.isEmpty(res.CODE) && (res.CODE.indexOf("S") == 0)) || (!common.isEmpty(res.IM_CODE) && (res.IM_CODE.indexOf("S") == 0 )) || res.result ){
                if(_smart=='Y'){
                    window.location.replace(_secureUrl + "mypage/getSmartRecipt.do");
                }else{
                    /* 3212592 12월올영세일_온라인몰 특이현상 점검 및 개선 요청의 件 
                     * "login/loginCheckJson.do" 중복 호출을 막기 위한 SessionStorage내, checkLoginStatus등록
                     * 만약 checkLoginStatus내에 값이 존재할 경우, 값을 반환한다.
                     * 인증 후, 최초 인증을 받기 위해, 존재하는 checkLoginStatus 제거 한다.
                     */
                	sessionStorage.removeItem("checkLoginStatus");
                    var url = _secureUrl + "login/loginSuccess.do";
                    
                    if(evtYn != "N"){
                    	url = url + "?agreeYn=Y&evtNo=" + evtYn + "&isSetting=" + isSetting;
                    }else{
                    	url = url + "?agreeYn=N&isSetting=" + isSetting;
                    }
                    
                    window.location.replace(url);
                }
            }else if(res.strMsg!=null&&res.respon =="N"){
                if(_smart=='Y'){
                    alert("올리브영 약관 동의에 실패하셨습니다.");
                    window.close();
                }else{
                    alert(res.strMsg);
                    common.link.moveLogoutPage();
                }
            }else{
                if(_smart=='Y'){
                    alert("올리브영 약관 동의에 실패하셨습니다.");
                    window.close();
                }else{
                    alert("올리브영 약관 동의에 실패하셨습니다.");
                    common.link.moveLogoutPage();
                }
            }
        }else{
            if(_smart=='Y'){
                alert("올리브영 약관 동의에 실패하셨습니다.");
                window.close();
            }else{
                alert("로그인에 실패하였습니다.");
                common.link.moveLogoutPage();
            }
        }
    },
    
    agreeInit : function(){
        //약관동의화면에서 back
        $("#agreeBtn").click(function(){
            if(_smart=='Y'){
                window.close();
            }else{
                history.back();
            }
        });
        //전체동의 클릭시
        $("#chk01").click(function(){
            if($("#chk01").is(":checked")){
                $("[name='agrList']").prop("checked",true);
                $("#svcEvtAgrYn").prop("checked",true);
                $("#mbrCurAgrYn").prop("checked",true);
            }else{
                $("[name='agrList']").prop("checked",false);
                $("#svcEvtAgrYn").prop("checked",false);
                $("[name='svcEvtAgrYnList']").prop("checked",false);
                $("#mbrCurAgrYn").prop("checked",false);
            }
        });
        
        //개별 약관 체크시
        $("[name='agrList'], #svcEvtAgrYn, #mbrCurAgrYn").click(function(){
            var chkLeng = $("#agreementChk [type='checkbox']:checked").length;
            var svcEvt = $("#svcEvtAgrYn").is(":checked");
            var mbrCur = $("#mbrCurAgrYn").is(":checked");
            if(chkLeng == 4 && svcEvt && mbrCur){
                $("#chk01").prop("checked",true); 
            }else{
                $("#chk01").prop("checked",false);
            }
        });
        
        //마케팅 약관 체크시
        $("#svcEvtAgrYn").click(function(){
            if(!$("#svcEvtAgrYn").is(":checked")){
                $("#smsRcvAgrYn,#pushMsgRcvYn").prop("checked",false);
            }
        });
        
        $("#smsRcvAgrYn,#pushMsgRcvYn").click(function(){
            if(!$("#svcEvtAgrYn").is(":checked")){
                alert("SMS 또는 APP PUSH 수신에 동의하시려면 반드시 서비스·이벤트 정보 수신에 동의하셔야 합니다.");
                $("#smsRcvAgrYn,#pushMsgRcvYn").prop("checked",false);
            }
        });
    },
    
    // [3343779] 선택약관 init
    choiceTermAgreeInit : function(){
        
        //서비스 이벤트 정보 수신 동의 체크 시
        $("#svcEvtAgrYn").click(function(){
            if(!$("#svcEvtAgrYn").is(":checked")){
                $("#smsRcvAgrYn,#pushMsgRcvYn").prop("checked",false);
            }
        });
        
        // sms, push 동의 체크 시
        $("#smsRcvAgrYn,#pushMsgRcvYn").click(function(){
            if(!$("#svcEvtAgrYn").is(":checked")){
                alert("SMS 또는 APP PUSH 수신에 동의하시려면 반드시 서비스·이벤트 정보 수신에 동의하셔야 합니다.");
                $("#smsRcvAgrYn,#pushMsgRcvYn").prop("checked",false);
            }
        });
    },
    
    // [3343779] 선택약관 동의
    choiceTermAgreeY : function (isSetting){

    	// 아무것도 선택하지 않았을 때
    	if( !$("#svcEvtAgrYn").is(":checked") && !$("#mbrCurAgrYn").is(":checked") ){
    		
    		alert("선택된 항목이 없습니다. 다시 확인 후 동의 바랍니다.");
    		return false;
    	}else{
    	
	        if(($("#svcEvtAgrYn").is(":checked") && ($("#smsRcvAgrYn").is(":checked") || $("#pushMsgRcvYn").is(":checked")))
	                ||!$("#svcEvtAgrYn").is(":checked")){
	        	
	            var url = _secureUrl +"customer/agreeTermJson.do";
	            var agr40 = ($("#svcEvtAgrYn").is(":checked"))?"Y":"N";
	            var agr50 = ($("#mbrCurAgrYn").is(":checked"))?"Y":"N";
	            var sms = ($("#smsRcvAgrYn").is(":checked"))?"Y":"N";
	            var push = ($("#pushMsgRcvYn").is(":checked"))?"Y":"N";
	            
	            // 선택약관동의처리
	            $.ajax({
	                url: url,
	                type: 'POST',
	                data: {"agr10": "X", "agr20": "X", "agr40": agr40, "agr50": agr50, "sms": sms, "push": push, "evtYn": "N", "isSetting": isSetting},
	                async: false,
	                success: function(data){
	                	mlogin.login.sendTmsPush(push); // TMS 푸시동의정보 송신
						mlogin.login.loginSuccess(data);
	                }
	                ,error  : function (request,status,error){
	                    console.log("code:" + request.status + "\nmessage:" + request.responseText + "\nerror :" + error);
	                    alert(error);
	                    common.link.moveLogoutPage();
	                }
	            });
	        }else{
	          //마케팅동의 체크 안한경우
	            alert("서비스·이벤트 알림 수신 동의를 동의 하신 경우 알림 수신 채널을 최소 1개 필수로 선택하셔야 합니다.");
	            return false;
	        }
    	}
    },
    
    // [3343779] 선택약관 취소 시 모든 항목 N 처리
    choiceTermAgreeN : function (isSetting){
    	
    	if( confirm("올리브영의 다양한 서비스와 혜택알림을 받으실 수 있는 선택 정보 이용동의를 설정하지 않으셨습니다. 이대로 진행하시겠습니까?\n\n마이페이지>회원정보 수정에서 변경 가능합니다.") ){

            var url = _secureUrl +"customer/agreeTermJson.do";
            $.ajax({
                url: url,
                type: 'POST',
                data: {"agr10": "X", "agr20": "X", "agr40": "N", "agr50": "N", "sms": "N", "push": "N", "evtYn": "N", "isSetting": isSetting},
                async: false,
                success: function(data){
                	mlogin.login.sendTmsPush("N"); // TMS 푸시동의정보 송신
                    mlogin.login.loginSuccess(data);
                }
	            ,error  : function (request,status,error){
	                console.log("code:" + request.status + "\nmessage:" + request.responseText + "\nerror :" + error);
	                alert(error);
	                common.link.moveLogoutPage();
	            }
            });
    	}
    },
    
    // [3343779] TMS 앱푸시수신동의값 변경 송신
    sendTmsPush : function(push){
    	
		var url = _secureUrl + 'customer/getUserSsoMbrNo.do';
		var data = {"push" : push};
		
		common.Ajax.sendRequest("POST",url,data,mlogin.login._callbackSendTmsPush);
    },
    
    _callbackSendTmsPush : function(res){
    	
    	console.log(res);
    	
		$.ajax({
			type: "POST" ,
			url: _tmsPushUrl,
			dataType : "json",
			data: res,
			contentType: "application/json",
			error: function (request, status, error) {
//				console.log(error);
			}, success: function (res) {
//				console.log(res);
			}
		});
    },
    
    agreeSetting : function(){
        var obj = new Object();
        obj.agr_typ_onln = new Array(); // 약관 수신동의 항목 저장을 위한 object 생성
        obj.mkt_rcv = new Array();      // 마케팅 수신동의 항목 저장을 위한 object 생성

        var objagree1 = new Object();
        var objagree2 = new Object();
        var objmktrcv = new Object();
        
        obj.mbr_no = _mbrNo;
        obj.coopco_cd = _coopcoCd;  //참여사 코드
        obj.brnd_cd = _brndCd;      //브랜드 코드
        obj.agr_rcv_yn = "Y";       //CJ ONE 서비스 이용을 위한 정보 제공 및 활용 동의여부?

        // 참여사 약관 동의 여부
        // 참여사 약관 유형코드가 사전 정의 되어야 합니다.
        var agr1 = ($("[type='checkbox'][value='10']").is(":checked"))?"Y":"N";
        var agr2 = ($("[type='checkbox'][value='20']").is(":checked"))?"Y":"N";
        
        objagree1["10"] = agr1;  // 약관유형코드 : 10 -> 서비스 이용약관(필수동의항목) 
        objagree2["20"] = agr2;  // 약관유형코드 : 20 -> 개인정보 수집/이용 동의 약관(필수동의항목)

        obj.agr_typ_onln.push(objagree1);
        obj.agr_typ_onln.push(objagree2);

        //마케팅 수신동의값 배열 [3343779]선택약관, CJ ONE 마케팅수신동의 연동 중단으로 모두 N 세팅
//        objmktrcv.brnd_cd  = _brndCd ;
//        objmktrcv.coopco_cd = _coopcoCd;
//        objmktrcv.email_rcv = "N";
//        objmktrcv.sms_rcv  = "N";
//        objmktrcv.tm_rcv  = "N";
//        objmktrcv.dm_rcv  = "N"; // 개인정보 최소화 정책에 의해 DM항목 삭제
        obj.mkt_rcv.push(objmktrcv);

        return obj;
    },
    
    chkEmail : function(email){
        var regExp = /[0-9a-zA-Z][_0-9a-zA-Z-]*@[_0-9a-zA-Z-]+(\.[_0-9a-zA-Z-]+){1,2}$/;
        if(!regExp.test(email)){
            return false;
        }else{
            return true;
        }
        
    },
    
    tabSelect : function(id){
        if($("#"+id).attr("class")!="on"){
            $("#"+id).attr("class","on");
            $("#"+id).attr("title","현재 선택된 메뉴");
            $("#"+id).siblings().removeAttr("class");
            $("#"+id).siblings().removeAttr("title");
            
            var onTab = $(".twoSet li.on").attr("id");
            if(onTab == "mem"){
                $(".loginBox:eq(0)").show();
                $(".loginBox:eq(1)").hide();
            }else {
                $(".loginBox:eq(0)").hide();
                $(".loginBox:eq(1)").show();

            }
        }
    },
    
    tryLogin : function(event) {
        if (event.keyCode != 13) {
            return;
        }

        mlogin.login.doLogin();
    },

    doLogin : function() {
    	
        /* 3212592 12월올영세일_온라인몰 특이현상 점검 및 개선 요청의 件 
         * "login/loginCheckJson.do" 중복 호출을 막기 위한 SessionStorage내, checkLoginStatus등록
         * 만약 checkLoginStatus내에 값이 존재할 경우, 값을 반환한다.
         * 인증 후, 최초 인증을 받기 위해, 존재하는 checkLoginStatus 제거 한다.
         */
    	sessionStorage.removeItem("checkLoginStatus");
    	
    	/* 3317215 DS 클릭지표 추가 */
    	common.wlog("do_login_mc");
    	
        var formLogin = $("#formLogin");

        var login_id = $("#loginId").val();
        var password = $("#password").val();
        
        var validated1 = common.validateFieldNotEmpty("#loginId", "아이디를 입력해주세요.");
        if(!validated1){
            $("#loginId").focus();
            return;
        }
        
        var validated2 = common.validateFieldNotEmpty("#password", "비밀번호를 입력해 주세요");
        if (!validated2) {
            $("#password").focus();
            return;
        }
        
        if(_captchaSession){
            if ( !$('#autoBlockText').val()) {
                alert('자동입력 방지 문자를 입력해주세요.');
                mlogin.captcha.changeCaptcha(cwid, chei, csize);
                $("#autoBlockText").focus();
                return false;
            } else if($('#autoBlockText').val().length != 6){
                alert('아이디, 비밀번호 혹은 자동입력 방지문자를 잘못 입력하셨습니다.');
                $("#password").val("");
                $("#autoBlockText").val("");
                mlogin.captcha.changeCaptcha(cwid, chei, csize);
                $("#password").focus();
                return false;
            }else if(mlogin.login.passwdChk()){
                var url = _baseUrl + "login/getCaptChaChk.do";
                $.ajax({
                    url: url,
                    type: 'POST',
                    data   : $("#formLogin").serialize(),
                    async: false,
                    success: function(data) {
                        var jsonData =JSON.parse(data);
                        if(jsonData=="000"){
                            formLogin.attr('action', _secureUrl + "login/login.do");
                            formLogin.attr('method', "POST");
                            formLogin.submit();
                        }else{
                            alert('아이디, 비밀번호 혹은 자동입력 방지문자를 잘못 입력하셨습니다.');
                            $("#password").val("");
                            $("#autoBlockText").val("");
                            mlogin.captcha.changeCaptcha(cwid, chei, csize);
                            $("#password").focus();
                            return false;
                        }
                    }
                });

            }
        }else{
            if(mlogin.login.passwdChk()){
                formLogin.attr('action', _secureUrl + "login/login.do");
                formLogin.attr('method', "POST");
                formLogin.submit(); 
            }
        }
    },
    
    doKakaoLogin : function() {
        /* 3212592 12월올영세일_온라인몰 특이현상 점검 및 개선 요청의 件 
         * "login/loginCheckJson.do" 중복 호출을 막기 위한 SessionStorage내, checkLoginStatus등록
         * 만약 checkLoginStatus내에 값이 존재할 경우, 값을 반환한다.
         * 인증 후, 최초 인증을 받기 위해, 존재하는 checkLoginStatus 제거 한다.
         */
    	sessionStorage.removeItem("checkLoginStatus");
    	
        var formLogin = $("#formLogin");
        var login_id = $("#loginId").val();
        
        var validated1 = common.validateFieldNotEmpty("#loginId", "아이디를 다시 확인해주세요.");
        if(!validated1){
            $("#loginId").focus();
            return;
        }
        
        formLogin.attr('action', _secureUrl + "login/login.do");
        formLogin.attr('method', "POST");
        formLogin.submit(); 
    },
    
    passwdChk : function(){
        var rs = false;
        $.ajax({
             type   : "POST"
            ,url    : _secureUrl + "login/passwdChkJson.do"
            ,data   : $("#formLogin").serialize()
            ,async  : false
            ,success: function(res){
                var json = $.parseJSON(res);
                if(json.result){
                    rs = true;
                } else {
                    if(json.captcha){
                        mlogin.captcha.init();
                        alert(json.showMessage);
                        _captchaSession = true;
                        $("#password").val("");
                        $("#autoBlockText").val("");
                        mlogin.captcha.changeCaptcha(cwid, chei, csize);
                        $("#password").focus();
                        rs = false;
                    }else if(json.passwdChk){
                        alert(json.showMessage);
                        $("#password").val("");
                        $("#autoBlockText").val("");
                        mlogin.captcha.changeCaptcha(cwid, chei, csize);
                        $("#password").focus();
                        rs = false;
                    }else{
                        alert(json.showMessage);
                        $("#password").val("");
                        $("#autoBlockText").val("");
                        mlogin.captcha.changeCaptcha(cwid, chei, csize);
                        $("#password").focus();
                        rs = false;
                    }
                }
             }
        });
        return rs;
       
    },
    
    findId : function(){
    	/* 3317215 DS 클릭지표 추가 */
    	common.wlog("find_id_mc");
    	
        if(common.app.appInfo.isapp){
            common.app.callOpenPage("아이디 찾기", _cjEaiUrl + _findIdUrl);
        }else{
            window.open(_cjEaiUrl + _findIdUrl);
        }
    },
    
    findPasswd : function(){
    	/* 3317215 DS 클릭지표 추가 */
    	common.wlog("find_passwd_mc");
    	
        if(common.app.appInfo.isapp){
            common.app.callOpenPage("비밀번호 찾기", _cjEaiUrl + _findPwdUrl);
        }else{
            window.open(_cjEaiUrl + _findPwdUrl);
        }
    },
    
    accountLock : function(idx){
        if(common.app.appInfo.isapp){
            var url = _cjEaiUrl + _accLockUrl;
            url + "?mbrNo=" + idx + "brnd_cd" + _brndCd + "coopcoCd" + _coopcoCd + "mchtNo" + _mchtNo;
            common.app.callOpenPage("잠금해제",url);
        }else{
            var lockWindow = window.open("","lockAccount");
            if($("[name='lockInfo']").size()==0){
                var form = document.createElement("form");
                form.setAttribute("name","lockInfo");
                form.setAttribute("method","post");
                form.setAttribute("target","lockAccount");
                form.setAttribute("action", _cjEaiUrl + _accLockUrl);
                document.body.appendChild(form);
                
                var inputMbrNo = document.createElement("input");
                inputMbrNo.setAttribute("type","hidden")
                inputMbrNo.setAttribute("name","mbr_no")
                inputMbrNo.setAttribute("value",idx);
                
                var inputBrndCd = document.createElement("input");
                inputBrndCd.setAttribute("type","hidden")
                inputBrndCd.setAttribute("name","brnd_cd")
                inputBrndCd.setAttribute("value",_brndCd);
                
                var inputCoopcoCd = document.createElement("input");
                inputCoopcoCd.setAttribute("type","hidden")
                inputCoopcoCd.setAttribute("name","coopco_cd")
                inputCoopcoCd.setAttribute("value",_coopcoCd);
                
                var inputMchtNo = document.createElement("input");
                inputMchtNo.setAttribute("type","hidden")
                inputMchtNo.setAttribute("name","mcht_no")
                inputMchtNo.setAttribute("value",_mchtNo);
                
                form.appendChild(inputMbrNo);
                form.appendChild(inputBrndCd);
                form.appendChild(inputCoopcoCd);
                form.appendChild(inputMchtNo);
            }
            var frm = document.lockInfo;
            frm.submit();
        }
    },
    
    //바이오정보 스캔 팝업 오픈
    biometricPopup : function (p) {
        if (common.app.appInfo.isapp) {
            var isLogin = common.isLogin();
            if (!isLogin) {
                var isBiometricsInfo = common.bio.biometricsInfoAjax();
                if (isBiometricsInfo.biometricYn == "Y") {
                    common.app.biometricShow(p);
                }
            }
        }
    }
};

$.namespace("mlogin.captcha");
mlogin.captcha = {
    init : function () {
        mlogin.captcha.changeCaptcha(cwid, chei, csize);
        $(".boxCertify").show();
        $('#reLoad').click(function(){
            mlogin.captcha.changeCaptcha(cwid, chei, csize);
        });
        $('#soundOnHna').click(function(){ 
            mlogin.captcha.audioCaptcha(); 
        });
        $("#autoBlockText").val("");
        $("#memJoinBtn").addClass("captcha");
        $("input:hidden[name='captchaYn']", "#formLogin").val("Y");
    },

    audioCaptcha : function(){
        var url = _baseUrl + 'login/getCaptChaAudio.do';
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'text',
            data: 'rand=' + rand,
            async: false,       
            success: function(resp) {
                var uAgent = navigator.userAgent;
                var soundUrl = _baseUrl + 'login/getCaptChaAudio.do?rand=' + rand ;
                
                if (uAgent.indexOf('Trident') > -1 || uAgent.indexOf('MSIE') > -1) {
                    mlogin.captcha.winPlayer(soundUrl+'&agent=msie');
                
                } else if (!!document.createElement('audio').canPlayType) {
                    try {
                        new Audio(soundUrl).play(); 
                    } catch(e) {
                        mlogin.captcha.winPlayer(soundUrl);
                    }
                } else window.open(soundUrl, '', 'width=1,height=1');
            }
        });
    },
        
    changeCaptcha : function(wid,hei,font) {
        rand = Math.random();
        var widhei = ( wid > 0 && hei > 0 ) ? 'wid=' + wid + '&hei=' + hei + '&' : '';
        var size = ( font > 0 ) ? 'size=' + font + '&' : '';
        var url = _baseUrl + "login/getCaptChaImg.do?" + widhei + size + "rand=" + rand;
        
        //웹 접근성 관련 alt 문구 변경 ( 2017-05-11 )
        $('#captcha').html('<img src="'+url+'" width="100%" height="100%" alt="자동 입력방지 문자 입력 이미지"/>'); 

        return false;
    },
        
    winPlayer : function (objUrl) {
        $('#audiocatpch').html(' <bgsound src="' + objUrl + '">');
    }

};
$.namespace("mlogin.login.Cert");
mlogin.login.Cert = {
        
    /*아이핀*/
    openCBAWindow :function() {
        var ordYn = $("#ordYn").val();
        if(common.app.appInfo.isapp || !!ordYn && ordYn == "Y"){
    
            document.reqCBAForm.action = 'https://ipin.siren24.com/i-PIN/jsp/ipin_j10.jsp';

            
            var retUrl = $("[name='reqCBAForm']").find("[name='retUrl']").val();
            
            if(retUrl == ""){
                var defaultUrl = "23"+_baseUrl+"customer/ipinResult.do";
                if(!!ordYn && ordYn == "Y") {
                    defaultUrl = "23"+_secureUrl+"customer/ipinResult.do?ordYn=Y";
                }
                $("[name='reqCBAForm']").find("[name='retUrl']").val(defaultUrl);
            }else{
                if(retUrl.indexOf("23") == -1){
                    $("[name='reqCBAForm']").find("[name='retUrl']").val("23"+retUrl);
                }
            }
            document.reqCBAForm.submit();
        }else{
            CBA_window = window.open('', 'IPINWindow', 'width=450, height=500, resizable=0, scrollbars=no, status=0, titlebar=0, toolbar=0, left=300, top=200' );

            if(CBA_window == null){ 
                alert(" ※ 윈도우 XP SP2 또는 인터넷 익스플로러 7 사용자일 경우에는 \n    화면 상단에 있는 팝업 차단 알림줄을 클릭하여 팝업을 허용해 주시기 바랍니다. \n\n※ MSN,야후,구글 팝업 차단 툴바가 설치된 경우 팝업허용을 해주시기 바랍니다.");
            }

            document.reqCBAForm.action = 'https://ipin.siren24.com/i-PIN/jsp/ipin_j10.jsp';
            document.reqCBAForm.target = 'IPINWindow';
            
            var retUrl = $("[name='reqCBAForm']").find("[name='retUrl']").val();
            
            if(retUrl == ""){
                var defaultUrl = "23"+_baseUrl+"customer/ipinResult.do";
                $("[name='reqCBAForm']").find("[name='retUrl']").val(defaultUrl);
            }else{
                if(retUrl.indexOf("23") == -1){
                    $("[name='reqCBAForm']").find("[name='retUrl']").val("23"+retUrl);
                }
            }

            document.reqCBAForm.submit();
        }
           
      
    },
    
    /*본인인증*/
    openPCCWindow : function(){
        var ordYn = $("#ordYn").val();
        if(common.app.appInfo.isapp || !!ordYn && ordYn == "Y"){
            
            document.reqPCCForm.action = 'https://pcc.siren24.com/pcc_V3/jsp/pcc_V3_j10.jsp';
            
            var retUrl = $("[name='reqPCCForm']").find("[name='retUrl']").val();
            if(retUrl == ""){
                var defaultUrl = "32"+_baseUrl+"customer/pccResult.do";
                if(!!ordYn && ordYn == "Y") {
                    defaultUrl = "32"+_secureUrl+"customer/pccResult.do?ordYn=Y";
                }
                $("[name='reqPCCForm']").find("[name='retUrl']").val(defaultUrl);
            }else{
                if(retUrl.indexOf("32") == -1){
                    $("[name='reqPCCForm']").find("[name='retUrl']").val("32"+retUrl);  
                }
            }
            
            document.reqPCCForm.submit(); 
        }else{
        
            var PCC_window = window.open('', 'PCCV3Window', 'width=430, height=560, resizable=1, scrollbars=no, status=0, titlebar=0, toolbar=0, left=300, top=200' );
    
            if(PCC_window == null){ 
                 alert(" ※ 윈도우 XP SP2 또는 인터넷 익스플로러 7 사용자일 경우에는 \n    화면 상단에 있는 팝업 차단 알림줄을 클릭하여 팝업을 허용해 주시기 바랍니다. \n\n※ MSN,야후,구글 팝업 차단 툴바가 설치된 경우 팝업허용을 해주시기 바랍니다.");
            }
    
            document.reqPCCForm.action = 'https://pcc.siren24.com/pcc_V3/jsp/pcc_V3_j10.jsp';
            document.reqPCCForm.target = 'PCCV3Window';
            
            var retUrl = $("[name='reqPCCForm']").find("[name='retUrl']").val();
            if(retUrl == ""){
                $("[name='reqPCCForm']").find("[name='retUrl']").val("32"+_baseUrl+"customer/pccResult.do");
            }else{
                if(retUrl.indexOf("32") == -1){
                    $("[name='reqPCCForm']").find("[name='retUrl']").val("32"+retUrl);
                }
            }

            document.reqPCCForm.submit(); 
        }
    }
};