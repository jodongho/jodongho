$.namespace("monthEvent.detail");
monthEvent.detail = {
	_ajax : common.Ajax,
	snsInitYn : "N",
    possibleCnt : "",
	friendTotCnt : "",
	firstYn : "",

	init : function(){
	    // scroll class 변경
	    var tabH = $(".treeTab img").height();
	    $("#eventTabFixed2").css("height",tabH + "px");

	    var tabHeight =$("#eventTabImg").height() + 108 ;
	    var eTab01 = tabHeight + $("#evtConT01").height();
	    var eTab02 = eTab01 + $("#evtConT02").height();
	    var eTab03 = eTab02 + $("#evtConT03").height();
	    var eTab04 = eTab03 + $("#evtConT04").height();
	    var eTab05 = eTab04 + $("#evtConT05").height();

	    var scrollTab  = $(document).scrollTop();

	    if (scrollTab > tabHeight) {
	        $("#eventTabFixed2")
	        .css("position","fixed")
	        .css("top","0px");
	    }
	   if (scrollTab < eTab01) {
	        $("#eventTabFixed2").attr('class','tab01');
	    } else if (scrollTab < eTab02) {
	        $("#eventTabFixed2").attr('class','tab02');
	    } else if (scrollTab < eTab03) {
	        $("#eventTabFixed2").attr('class','tab03');
	    } else if (scrollTab < eTab04) {
	        $("#eventTabFixed2").attr('class','tab04');
	    };
	    
	    $(window).scroll(function(){
	        var scrollTab  = $(document).scrollTop();
	         if (scrollTab < eTab01) {
	            $("#eventTabFixed2").attr('class','tab01');
	        } else if (scrollTab < eTab02) {
	            $("#eventTabFixed2").attr('class','tab02');
	        } else if (scrollTab < eTab03) {
	            $("#eventTabFixed2").attr('class','tab03');
	        } else if (scrollTab < eTab04) {
	            $("#eventTabFixed2").attr('class','tab04');
	        }

	        if (scrollTab > tabHeight) {
	            $("#eventTabFixed2")
	            .css("position","fixed")
	            .css("top","0px");
	        } else {
	            $("#eventTabFixed2")
	            .css("position","absolute")
	            .css("top","");
	        }
	    });
        
		if($("input[id='reCommend']:hidden").val() != ""){
			if(!mevent.detail.checkLogin()){
				return;
			}
			monthEvent.detail.addKaKaoTalkFriend();
		};
		
		/* 레이어 닫기 */
        $(".eventHideLayer").click(function(){
            monthEvent.detail.eventCloseLayer();
        });
        /* 위수탁 레이어 닫기 */
        $(".eventHideLayer1").click(function(){
            monthEvent.detail.eventCloseLayer1();
        });
        
		/* 카카오 친구 추천수 */
		monthEvent.detail.myCntChkJson();
	},
	
	/* 패밀리 20% 쿠폰 다운로드 */
    downFamilyCouponJson : function(cpnNo) {
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 다운 가능한 쿠폰입니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mevent.detail.checkLogin()){
                return;
            }else{
                if(!mevent.detail.checkRegAvailable()){
                    return;
                }
                if(typeof cpnNo == "undefined" || cpnNo == ""){
                    alert("쿠폰 번호가 없습니다.");
                    return;
                }
                var param = {cpnNo : cpnNo};
                common.Ajax.sendRequest(
                        "GET"
                        , _baseUrl + "event/downCouponJson.do"
                        , param
                        , this._callback_downCouponJson
                 );
            }
        }
    },
    
    /* 카톡 초대 수 만큼 쿠폰 다운로드 */
    downFriendCouponJson : function(cpnNo, cpnType) {
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 다운 가능한 쿠폰입니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{            
            if(!mevent.detail.checkLogin()){
                return;
            }else{
                if(!mevent.detail.checkRegAvailable()){
                    return;
                }
                if(cpnType == "f2" || cpnType == "f3" || cpnType == "f4"){
                    if(cpnType == "f2"){
                        if(monthEvent.detail.friendTotCnt.numberFormat() < 2){
                            alert("가족 2명 초대 시 다운로드 가능한 쿠폰입니다.");
                            return;
                        }
                    }
                    if(cpnType == "f3"){
                        if(monthEvent.detail.friendTotCnt.numberFormat() < 3){
                            alert("가족 3명 초대 시 다운로드 가능한 쿠폰입니다.");
                            return;
                        }
                    }
                    if(cpnType == "f4"){
                        if(monthEvent.detail.friendTotCnt.numberFormat() < 4){
                            alert("가족 4명 초대 시 다운로드 가능한 쿠폰입니다.");
                            return;
                        }
                    }
                    if(typeof cpnNo == "undefined" || cpnNo == ""){
                        alert("쿠폰 번호가 없습니다.");
                        return;
                    }
                    var param = {cpnNo : cpnNo};
                    common.Ajax.sendRequest(
                            "GET"
                            , _baseUrl + "event/downCouponJson.do"
                            , param
                            , this._callback_downCouponJson
                     );
                }else{
                    alert("쿠폰을 확인해 주세요.");
                }
            }
        }
    },    
    _callback_downCouponJson : function(json) {
        if(json.ret == '0'){
            alert(json.message);
        }
    },
	
	/* 카카오친구 접속 */
	addKaKaoTalkFriend : function(){
		var param = {
				reCommend : decodeURIComponent($("input[id='reCommend']:hidden").val())
			  , evtNo : $("input[id='evtNo']:hidden").val()
			  , fvrSeq : "1"
		};

		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "event/20180430/addKaKaoFriendJosn.do"
			  , param
			  , monthEvent.detail._callback_addKaKaoFriendJosn
		);
	},
	_callback_addKaKaoFriendJosn : function(json){
//		console.log(json);
	},
	
	/* 공유하기 */
	shareSns : function(){
		if(!mevent.detail.checkLogin()){
			return;
		}

		var evtNo = $("input[id='evtNo']:hidden").val();
		var reCommend = encodeURIComponent($("input[id='targetNum']:hidden").val());
//		var imgUrl = "http:" + _cdnImgUrl + "contents/201706/june1st/june1st_kakao.jpg";
		var imgUrl = "";
		var title = "올리브영 온라인몰 Beautiful FAMILY Life♡ 뭉칠수록 혜택이 팡팡!";

		// 배너 이미지 체크
		var bnrImgUrlAddr = $("#bnrImgUrlAddr").val();
		if(bnrImgUrlAddr == undefined || bnrImgUrlAddr == null || bnrImgUrlAddr == ""){
			bnrImgUrlAddr = "";
		} else {
			bnrImgUrlAddr = _fileUploadUrl + bnrImgUrlAddr;
		}

		// 이미지가 없을 경우만 배너로 교체
		if(imgUrl == undefined || imgUrl == null || imgUrl == ""){
			imgUrl = bnrImgUrlAddr;
		}

		var snsShareUrl = _baseUrl + "KE.do?evtNo=" + evtNo + "&reCommend=" + reCommend;

		/* sns common init 시키기 위해서 한번만 실행 */
		if(monthEvent.detail.snsInitYn == "N"){
			common.sns.init(imgUrl, title, snsShareUrl);
			monthEvent.detail.snsInitYn = "Y";
		}

		common.sns.doShare("kakaotalk");
	},
	
	/* 카카오 친구 추천수, 응모 가능 횟수, 응모한 횟수 */
	myCntChkJson : function(){
		if(common.isLogin()){
			common.Ajax.sendJSONRequest(
					"GET"
				  , _baseUrl + "event/20180430/myCntChkJson.do"
				  , {
						  evtNo : $("input[id='evtNo']:hidden").val()
						, fvrSeq : "1"
					}
				  , monthEvent.detail._callback_myCntChkJson
			);
		}else{
		    //초대한 친구 수
            $("#friendTotCnt").text("0");
            
            //응모 가능 횟수
            $("#possibleCnt").text("0");
            
            //응모한 횟수
            $("#entryCnt").text("0");
		}
	},
	_callback_myCntChkJson : function(json){
		if(json.ret == "0"){
		    //초대한 친구 수 손가락 이미지
            $("#familyOn").attr("src", _cdnImgUrl+"contents/201804/30family/family_mc_family_on"+json.friendTotCnt+".png");
            
		    //초대한 친구 수
		    monthEvent.detail.friendTotCnt = json.friendTotCnt.toString();
		    $("#friendTotCnt").text(json.friendTotCnt);
		    
		    //응모 가능 횟수
		    var possibleCnt = json.friendTotCnt.numberFormat() - json.entryCnt.numberFormat();
		    monthEvent.detail.possibleCnt = possibleCnt.toString();
            $("#possibleCnt").text(possibleCnt);
            
            //응모한 횟수
            $("#entryCnt").text(json.entryCnt);
		}else{
			alert(json.message);
		}
	},
	
	/* 응모 가능 횟수 체크 */
	chkPossibleCnt : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 응모 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mevent.detail.checkLogin()){
                return;
            }
            if($("input[name='ChckName']:radio:checked").val() == "" || $("input[name='ChckName']:radio:checked").val() == undefined){
                alert("경품 선택 후 응모해 주세요!");
                return;
            }
            if(monthEvent.detail.possibleCnt.numberFormat() == 0){
                alert("내가 초대한 가족 수 만큼 응모 가능합니다.");
            }else{                
                var param = {
                        evtNo : $("input[id='evtNo']:hidden").val()
                }
                
                $(':radio[name="argee1"]:checked').attr("checked", false);
                $(':radio[name="argee2"]:checked').attr("checked", false);
                
                common.Ajax.sendRequest(
                        "GET"
                      , _baseUrl + "event/20180430/getFirstChkJson.do"
                      , param
                      , this._callback_getFirstChkJson
                );                
            }
        }
    },    
    _callback_getFirstChkJson : function(json) {        
        if(json.ret == "0"){
            monthEvent.detail.firstYn = "Y";        //최초 참여 여부 변수값
            monthEvent.detail.eventShowLayer1('eventLayerPolice');  //최초 참여는 개인정보 위수탁 동의팝업 생성
        }else{
            monthEvent.detail.firstYn = "N";        //최초 참여 여부 변수값
            monthEvent.detail.goodsEntry();        //즉석당첨 경품 응모
        }
    },
    
    /* 위수탁 동의 팝업 */    
    popLayerConfirm : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 응모 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if($(':radio[name="argee1"]:checked').val() == undefined &&  $(':radio[name="argee2"]:checked').val() == undefined ){
                monthEvent.detail.eventCloseLayer1();
                return;
            }
            if("Y" != $(':radio[name="argee1"]:checked').val()){
                monthEvent.detail.eventCloseLayer1();
                return;
            }
            if("Y" != $(':radio[name="argee2"]:checked').val()){
                monthEvent.detail.eventCloseLayer1();
                return;
            }
            
            if("Y" == $(':radio[name="argee1"]:checked').val() && "Y" == $(':radio[name="argee2"]:checked').val()){
                mevent.detail.eventCloseLayer();
                monthEvent.detail.goodsEntry();        //즉석당첨 경품 응모
            }
        }
    },
    
    /* 즉석당첨 경품 응모 */    
    goodsEntry : function(){
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
              , fvrSeq : $("input[name='ChckName']:radio:checked").val()
              , mbrInfoUseAgrYn : $("input[name='argee1']:radio:checked").val()       //개인정보 이용 동의 여부
              , mbrInfoThprSupAgrYn : $("input[name='argee2']:radio:checked").val()    //개인정보 위탁동의 여부
              , firstYn : monthEvent.detail.firstYn     //최초참여여부
        };
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20180430/goodsEntryJson.do"
              , param
              , monthEvent.detail._callback_goodsEntryJson
        );
    },
    _callback_goodsEntryJson : function(json){
        if(json.ret == "0"){
            if(json.winYn=="Y"){
                switch (json.fvrSeq) {
                case "2":
                    mevent.detail.eventShowLayer('evtGift1');
                    break;
                case "3":
                    mevent.detail.eventShowLayer('evtGift2');
                    break;
                case "4":
                    mevent.detail.eventShowLayer('evtGift3');
                    break;
                case "5":
                    mevent.detail.eventShowLayer('evtGift4');
                    break;
                case "6":
                    mevent.detail.eventShowLayer('evtGift5');
                    break;
                default:
                    break;
                }
            }else{
                mevent.detail.eventShowLayer('evtFail');
            }
        }else{
            alert(json.message);
        }
        $(':radio[name="ChckName"]:checked').attr("checked", false);
        monthEvent.detail.myCntChkJson();
    },
    
    /* 나의 당첨내역 */
    getMyWinList : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
        }
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20180430/getMyWinListJson.do"
              , param
              , monthEvent.detail._callback_getMyWinListJson
        );
    },
    _callback_getMyWinListJson : function(json){
        if(json.ret == "0"){
            if(json.myEvtWinList.length > 0){
                var myWinListHtmlGift = "";

                for(var i=0 ; i<json.myEvtWinList.length ; i++){
                     myWinListHtmlGift += "<tr><td>" + json.myEvtWinList[i].strSbscSgtDtime + "</td><td>" + json.myEvtWinList[i].evtGoodsNm + "</td></tr>";
                }

                if(myWinListHtmlGift != ""){
                    $("tbody#myWinListHtmlGift").html(myWinListHtmlGift);
                }                
            }
            mevent.detail.eventShowLayer('evtPopWinDetail');
        }else{
            alert(json.message);
        }
    },
    
    /**
     * 내 봉달이 이모티콘 난수쿠폰 정보 확인
     */
    getMyBongdalCpnChkJson : function(){
        //앱 일 경우만
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서 다운로드 가능합니다!")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(common.isLogin() == false){
                if(!confirm("로그인 후 참여 가능합니다.")){
                    return false;
                }else{
                    common.link.moveLoginPage();
                    return false;
                }
            }else{
                if(!mevent.detail.checkRegAvailable()){
                    return;
                }
                var param = {
                        evtNo : $("input[id='evtNo']:hidden").val()
                        , fvrSeq : "7" 
                }
                common.Ajax.sendRequest(
                        "GET"
                      , _baseUrl + "event/20180430/getMyBongdalCpnChkJson.do"
                      , param
                      , this._callback_getMyBongdalCpnChkJson
                );
            }
        }
    },
    _callback_getMyBongdalCpnChkJson : function(json) {
        if(json.ret == "0"){
            //이미 참여했으면 발급받은 난수 노출
            $("#layerRndmVal").html("<textarea class='coupon_num2' readonly=''>" + json.rndmVal + "</textarea>");
            mevent.detail.eventShowLayer('evtCouponLink');
        }else{
            //참여한적 없으면 난수 발급 가능 여부 확인
            monthEvent.detail.getBongdalCpnChkJson();
        }
    },
    
    /**
     * 봉달이 이모티콘 난수쿠폰 발급 가능 여부 확인 (구매금액 2만원 이상)
     */
    getBongdalCpnChkJson : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서 다운로드 가능합니다!")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(common.isLogin() == false){
                if(!confirm("로그인 후 참여 가능합니다.")){
                    return false;
                }else{
                    common.link.moveLoginPage();
                    return false;
                }
            }else{
                if(!mevent.detail.checkRegAvailable()){
                    return;
                }
                if(typeof fvrSeq == "undefined" || fvrSeq == ""){
                    alert("쿠폰 정보가 없습니다.");
                    return;
                }
                var param = {
                        fvrSeq : "1"
                      , evtNo : $("input[id='evtNo']:hidden").val()
                };
                common.Ajax.sendRequest(
                        "GET"
                      , _baseUrl + "event/20180430/getBongdalCpnChkJson.do"
                      , param
                      , this._callback_getBongdalCpnChkJson
                );
            }            
        }        
    },
    _callback_getBongdalCpnChkJson : function(json) {
        if(json.ret == "0"){
            //2만원 이상 구매했으면 난수쿠폰 발급
            monthEvent.detail.getBongdalCpnDownJson();
        }else{
            alert(json.message);
        }
    },
    
    /**
     * 봉달이 이모티콘 난수쿠폰 발급
     */
    getBongdalCpnDownJson : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("올리브영 앱에서 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/20180430/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(common.isLogin() == false){
                if(!confirm("로그인 후 참여 가능합니다.")){
                    return false;
                }else{
                    common.link.moveLoginPage();
                    return false;
                }
            }else{
                if(!mevent.detail.checkRegAvailable()){
                    return;
                }
                if(typeof fvrSeq == "undefined" || fvrSeq == ""){
                    alert("쿠폰 정보가 없습니다.");
                    return;
                }
                var param = {
                        fvrSeq : "7"
                      , evtNo : $("input[id='evtNo']:hidden").val()
                };
                common.Ajax.sendRequest(
                        "GET"
                      , _baseUrl + "event/20180430/getBongdalCpnDownJson.do"
                      , param
                      , this._callback_getBongdalCpnDownJson
                );
            }            
        }        
    },
    _callback_getBongdalCpnDownJson : function(json) {
        if(json.ret == "0"){
            monthEvent.detail.getMyBongdalCpnChkJson();
        }else{
            if(json.ret == "051"){
                mevent.detail.eventShowLayer('evtSoldout');
            }else{
                alert(json.message);
            }
        }
    },
    
    // 레이어 숨김
    eventCloseLayer : function(){
        $(".eventLayer").hide();
        $("#eventDimLayer").hide();
        $("#eventDimLayer1").hide();
    },
    
    // 위수탁 레이어 숨김
    eventCloseLayer1 : function(){
        alert("신청되지 않았습니다.");
        $(".eventLayer").hide();
        $("#eventDimLayer").hide();
        $("#eventDimLayer1").hide();
        location.reload();      //위수탁 동의 x일 때 스크롤 맨위로 가게하기 위해 페이지 새로고침
    },
    
    // 레이어 노출
    eventShowLayer1 : function(obj) {
        var layObj = document.getElementById(obj);
        var layDim = document.getElementById('eventDimLayer1');
        layDim.style.display = 'block';
        layObj.style.display = 'block';
        var layObjHeight = layObj.clientHeight  / 2;
        layObj.style.marginTop = "-" + layObjHeight +"px";
    },
    
};