$.namespace("NewMemberInvite.detail");
NewMemberInvite.detail = {
	_ajax : common.Ajax,
	snsInitYn : "Y",
    url : "",
	mbrInfoUseAgrYn : "N",
    checkID : "",

    
    initSns : function(){
//        events.detail.url = window.location.protocol + "//" + window.location.host + window.location.pathname + "?evtNo="+$("#evtNo").val();
        url = _baseUrl + 'E.do?evtNo=' + $("#evtNo").val();
        common.sns.init( $("#bnrImgUrlAddr1").val(),$("#evtNm").val(), url);
    },

	init : function(){
		$('.event_agree .tit > a').click(function(e){
			e.preventDefault();
			if($(this).parents('li').hasClass('on')){
				$(this).parents('li').removeClass('on');
			} else {
				$(this).parents('li').addClass('on').siblings().removeClass('on');
			}
		});
		
		$('.btnShare').click(function(){
			NewMemberInvite.detail.dispSnsPopup();
            common.popLayerOpen("SNSLAYER");
            $.fn.enableSelection();
        });

        $("#winner").click(function(){
            common.link.moveNtcList('03');
        });
        
	    
		/* SNS 활성화 */
		NewMemberInvite.detail.initSns();

	},
	JoinMemberJson : function(){
		//1. 로그인여부 체크
		if(!NewMemberInvite.detail.checkLogin()){
			return;
		}else{
			alert("이미 올리브영 회원이시군요. 이벤트 기간(3/25~27) 내 신규 가입을 하신 경우라면 다음 단계를 진행해주세요.");
		}
	},
	checkNewMemberJson1 : function(){

		//1. 로그인여부 체크
		if(!NewMemberInvite.detail.checkLogin()){
			return;
		}
		//2. 응모기간 체크
		if(!NewMemberInvite.detail.checkRegAvailable()){
			return;
		}
		//3. 개인정보 수집동의 체크
		if(!NewMemberInvite.detail.checkAgrmInfo()){
			return;
		}
		//4. 추천인 ID 작성 확인
		if(!NewMemberInvite.detail.checkInsertID()){
			return;
		}
		//5. 추천인 ID 입력 후 확인 버튼 클릭 여부 확인
		if(!NewMemberInvite.detail.checkConfirmID()){
			return;
		}
		//6. 신규 회원 여부 확인
		if(!NewMemberInvite.detail.checkNewMember()){
			return;
		}

		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
			  , member_id : $.trim($("#member_id").val())
			  , mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn']:hidden").val()
			  ,mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn']:hidden").val()
		};

		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "storeEvent/regNewMemberInviteEventJson.do"
			  ,  param
			  , NewMemberInvite.detail._callback_checkNewMemberJson1
		);
	},
	_callback_checkNewMemberJson1 : function(json){
		if(json.ret == "0"){
			alert("정상적으로 이벤트 참여 되었습니다. 포인트는 4/2(월)에 적립됩니다.");
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
    checkInsertID : function() {
        var member_id = $.trim($("#member_id").val());
        if(member_id == ''){
            alert("추천인 ID를 입력해주세요");
            return false;
        }
        return true;
    },
    checkConfirmID : function() {
    	var member_id = $.trim($("#member_id").val());
    	if(NewMemberInvite.detail.checkID != member_id){
            alert("입력하신 추천인ID를 확인해주세요.");
            return false;
        }
        return true;
    },
    checkNewMember : function() {
        var newMemberYn = $.trim($("#newMemberYn").val());
    	if(newMemberYn == 'N'){
            alert("신규 회원이 아니므로 이벤트 참여가 어렵습니다.");
            return false;
        }
        return true;
    },checkChangeID : function() {
    	NewMemberInvite.detail.checkID = 'N';
    },checkMemberIDJSON : function() {
    	var member_id = $.trim($("#member_id").val());
    	
    	//1. 로그인여부 체크
		if(!NewMemberInvite.detail.checkLogin()){
			return;
		}
		//2. 추천인 ID 입력 여부 체크 
        if(member_id == ''){
            alert("추천인 ID를 입력해주세요");
            return;
        }		
        var param = {
        		member_id : $.trim($("#member_id").val())
			};
		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "storeEvent/checkNewMemberInviteEventJson.do"
			  ,  param
			  , NewMemberInvite.detail._callback_checkMemberIDJSON
		);
    },
    _callback_checkMemberIDJSON : function(json){
		if(json.ret == "0"){
			var member_id = $.trim($("#member_id").val());
			NewMemberInvite.detail.checkID = member_id;
			alert("이벤트 응모 후 추천인 수정은 불가하오니 입력하신 ID '"+member_id+"'가 맞는지 다시 한번 확인하신 후 다음 단계를 진행해 주세요.");
		}else{
			alert(json.message);
		}
	},
    checkAgrmInfo : function(){
        var regYn = $.trim($("#regYn").val());
        var mbrInfoUseAgrYn = $.trim($("#mbrInfoUseAgrYn").val());

        if(regYn == 'Y' && mbrInfoUseAgrYn == 'Y'){

            if(!$("#inpChkAgree1").is(":checked")){
                alert("개인정보 수집 이용 동의를 하셔야 이벤트 참여가 가능합니다.");
                return false;
            }else{
            	NewMemberInvite.detail.mbrInfoUseAgrYn = 'Y';
            }
        }else{
        	NewMemberInvite.detail.mbrInfoUseAgrYn = 'N';
        }
        return true;
    },
    dispSnsPopup : function(){

        var $popLayer = $("<div>").addClass("popLayerArea");
        $("#SNSLAYER").html($popLayer);

        var $dimLayer = $("<div>").addClass("dimLayer");
        $popLayer.append($dimLayer);

        var $ul = $("<ul>").addClass("shareSNS");
        $dimLayer.append($ul);

        var $liKaka = $("<li>").addClass("kaka");
        $ul.append($liKaka);

        var $aKaka = $("<a>").addClass("snsShareDo").text("카카오톡");
        $aKaka.click(function(){common.sns.doShare("kakaotalk");});
        $liKaka.append($aKaka);


        var $liKakaS = $("<li>").addClass("kakaoS");
        $ul.append($liKakaS);

        var $aKakaS = $("<a>").addClass("snsShareDo").text("카카오스토리");
        $aKakaS.click(function(){common.sns.doShare("kakaostory");});
        $liKakaS.append($aKakaS);


        var $liFb = $("<li>").addClass("fb");
        $ul.append($liFb);

        var $aFb = $("<a>").addClass("snsShareDo").text("페이스북");
        $aFb.click(function(){common.sns.doShare("facebook");});
        $liFb.append($aFb);


        var $liUrl = $("<li>").addClass("url");
        $ul.append($liUrl);
        var $aUrl = $("<a>").addClass("snsShareDo").text("URL");
        $aUrl.click(function(){common.sns.doShare("url");});
        $liUrl.append($aUrl);
        var $divUrl = $("<div>").addClass("urlCopy").attr("id","urlInfo");
        $liUrl.append($divUrl);
        var $pUrl = $("<p>").text("아래의 URL을 복사해주세요.");
        $divUrl.append($pUrl);
//        var $inputUrl = $("<input>").attr("type","text")
//                                     .attr("title","url")
//                                     .attr("id","shareUrlTxt")
//                                     .attr("name","shareUrlTxt")
//                                     .attr("style","width:100%")
//                                     .attr("value",location.href)
//                                     .attr("readonly",true);
//        
        var $inputUrl = $("<div>").attr("class","input-url")
                                    .attr("id","shareUrlTxt")
                                    .attr("style","word-break:break-all;word-wrap:break-word;min-height:26px;max-height:51px;height:auto;");
        $inputUrl.html(url);
        $divUrl.append($inputUrl);


        var $aClose = $("<a>").addClass("btnClose").text("닫기");
        $aClose.click(function(){
            //  드래그 방지 막기
            $.fn.disableSelection();
            common.popLayerClose("SNSLAYER");
        });
        $dimLayer.append($aClose);

    }
    
};