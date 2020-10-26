$.namespace("VIPEvent.detail");
VIPEvent.detail = {
	_ajax : common.Ajax,
	snsInitYn : "N",
    mbrInfoUseAgrYn : "N",
    mbrInfoThprSupAgrYn : "N",

	init : function(){
		if($("input[id='reCommend']:hidden").val() != ""){
			if(!VIPEvent.detail.checkLogin()){
				return;
			}

		}
		
		$('.event_agree .tit > a').click(function(e){
			e.preventDefault();
			if($(this).parents('li').hasClass('on')){
				$(this).parents('li').removeClass('on');
			} else {
				$(this).parents('li').addClass('on').siblings().removeClass('on');
			}
		});
	},

	checkVIPInviteJson : function(){

		//1. 로그인여부 체크
		if(!VIPEvent.detail.checkLogin()){
			return;
		}

		//2. 응모기간 체크
		if(!VIPEvent.detail.checkRegAvailable()){
			return;
		}
		
		//3. 매장선택 체크
		if(!VIPEvent.detail.checkStore()){
			return;
		}
		
		//4. 개인정보 수집동의 체크
		if(!VIPEvent.detail.checkAgrmInfo()){
			return;
		}

		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
			  , fvrSeq : "2"
			  , strNo : $(':input[name="storeSelect"]:radio:checked').val()
		      , mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn']:hidden").val()
			  , mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn']:hidden").val()
		};

		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "storeEvent/regVIPInviteEventJson.do"
			  ,  param
			  , VIPEvent.detail._callback_checkVIPInviteJson
		);
	},
	_callback_checkVIPInviteJson : function(json){
		if(json.ret == "0"){
			alert("이벤트에 정상적으로 참여하셨습니다.");
		}else{
			alert(json.message);
		}
	},
	checkLogin : function(){
        if(common.isLogin() == false){

            if(!confirm("해당 서비스는 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?")){
                return false;
            }else{
                common.link.moveLoginPage();
                return false;
            }
        }

        return true;
    },
    checkRegAvailable : function() {
        var regYn = $.trim($("#regYn").val());
        if(regYn == 'N'){
            alert("현재 이벤트 응모 기간이 아닙니다.");
            return false;
        }
        return true;
    },
    checkStore : function() {
        var store = $.trim($(':input[name="storeSelect"]:radio:checked').val());
        if(store != 'D176' && store != 'DA1C'){
            alert("매장을 선택해 주시기 바랍니다.");
            return false;
        }
        return true;
    },
	/* 개인정보 필수값 체크 */
    checkAgrmInfo : function(){
        var regYn = $.trim($("#regYn").val());
        var mbrInfoUseAgrYn = $.trim($("#mbrInfoUseAgrYn").val());
        var mbrInfoThprSupAgrYn = $.trim($("#mbrInfoThprSupAgrYn").val());

        if(regYn == 'Y' && mbrInfoUseAgrYn == 'Y'){

            if(!$("#chk01").is(":checked")){
                alert("개인정보 수집 이용 동의를 하셔야 이벤트 참여가 가능합니다.");
                return false;
            }else{
            	VIPEvent.detail.mbrInfoUseAgrYn = 'Y';
            }
        }else{
        	VIPEvent.detail.mbrInfoUseAgrYn = 'N';
        }


        if(regYn == 'Y' && mbrInfoThprSupAgrYn == 'Y'){
            if(!$("#chk02").is(":checked")){
                alert("개인정보 취급 위탁 동의를 하셔야 이벤트 참여가 가능합니다.");
                return false;
            }else{
            	VIPEvent.detail.mbrInfoThprSupAgrYn = 'Y';
            }
        }else{
        	VIPEvent.detail.mbrInfoThprSupAgrYn = 'N';
        }
        return true;
    },
};