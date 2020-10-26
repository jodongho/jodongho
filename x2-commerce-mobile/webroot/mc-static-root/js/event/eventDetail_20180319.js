$.namespace("monthEvent.detail");
monthEvent.detail = {
	snsInitYn : "N",

	init : function(){
	    if(common.isLogin()){
            // 발급여부 확인
            monthEvent.detail.getMyBongdalCpnChkJson();
        };
        
        /* 닫기 */
        $(".eventHideLayer").click(function(){
            mevent.detail.eventCloseLayer();
        });
	},
	/* 앱 다운로드 */
	checkApp : function(){
		if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
		    common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/20180319/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
		}else{
		    alert("이미 앱에서 접속 중입니다.");
		}
	},
	
	/* 로그인하러 가기 */
    goLogin : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/20180319/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
        }else{            
            if(common.isLogin() == false){
                common.link.moveLoginPage(null, 'event/20180319/getEventDetail.do?evtNo='+$("#evtNo").val());
            }else{
                alert("이미 로그인 하셨습니다.");
            }
        }
    },
    
    /**
     * 내 봉달이 이모티콘 난수쿠폰 정보 확인
     */
    getMyBongdalCpnChkJson : function(){
        //앱 일 경우만
        if(common.app.appInfo != undefined && common.app.appInfo.isapp){
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
                }
                common.Ajax.sendRequest(
                        "GET"
                      , _baseUrl + "event/20180319/getMyBongdalCpnChkJson.do"
                      , param
                      , this._callback_getMyBongdalCpnChkJson
                );
            }
        }
    },
    _callback_getMyBongdalCpnChkJson : function(json) {
        if(json.ret == "0"){
            $(".coupon_area").css("display", "block");
            $("#rndmVal").text(json.rndmVal);
            $("#layerRndmVal").html("<textarea class='coupon_num2' readonly=''>" + json.rndmVal + "</textarea>");
        }
    },
    
    /**
     * 봉달이 이모티콘 난수쿠폰 발급 이벤트 참여여부 확인
     */
    getBongdalCpnChkJson : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("올리브영 앱에서 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/20180319/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
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
                      , _baseUrl + "event/20180319/getBongdalCpnChkJson.do"
                      , param
                      , this._callback_getBongdalCpnChkJson
                );
            }            
        }        
    },
    _callback_getBongdalCpnChkJson : function(json) {
        if(json.ret == "0"){
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
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/20180319/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
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
                      , _baseUrl + "event/20180319/getBongdalCpnDownJson.do"
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
}
