/**
 * 배포일자 : 2020-04-23
 * 오픈일자 : 2020-04-25
 * 이벤트명 : 4월 기프트카드 론칭 이벤트
 */
$.namespace("monthEvent.detail");
monthEvent.detail = {
	layerPolice : false,
	currentDay : null,
	baseImgPath : _cdnImgUrl + "contents/202004/25giftCard/",
	init : function(){
		monthEvent.detail.currentDay = $("input[id='imgUrlConnectDay']:hidden").val();

		//매장구매검증요청
		$(".btn_request").click(function(){
			if($(".btn_giftCard").hasClass("on")){
				monthEvent.detail.checkStoreOrder();
			}else{
				alert("이미 응모되었습니다. 6월 10일 이벤트 공지를 확인해주세요.");
			}
		});

		//직접 X(닫기) 클릭 or 레이어팝업 이외 영역 클릭 시, 알럿
        $('#eventDimLayer, #eventLayerPolice .eventHideLayer').click(function(){
            if(monthEvent.detail.layerPolice){
                alert('동의 후 참여 가능합니다.');

                monthEvent.detail.layerPolice = false;
                mevent.detail.eventCloseLayer();

                //초기화
                $(':radio[name="argee1"]:input[value="N"]').attr("checked", true);
                $(':radio[name="argee2"]:input[value="N"]').attr("checked", true);
            }
        });

        //감사애 -> 축하애
        if(monthEvent.detail.currentDay >= $("input[id='strtDtime1']:hidden").val() && monthEvent.detail.currentDay <= $("input[id='endDtime1']:hidden").val()){
        	$(".banner01 img").attr("src", monthEvent.detail.baseImgPath + 'mc_banner01_1.jpg');
        	$('.banner01 a').attr("href", "javascript:common.link.commonMoveUrl('"+$("input[id='evtUrl1']:hidden").val()+"');");
        }else if(monthEvent.detail.currentDay > $("input[id='strtDtime1']:hidden").val()){	//5월19일~
        	$(".banner01").html("");
        }

        //출석체크 배너 변경 4->5월
        if(monthEvent.detail.currentDay >= $("input[id='strtDtime2']:hidden").val()){
        	$(".banner02 img").attr("src", monthEvent.detail.baseImgPath + 'mc_banner02_1.jpg');
        	$('.banner02 a').attr("href", "javascript:common.link.commonMoveUrl('"+$("input[id='evtUrl2']:hidden").val()+"');");
        }

		//응모하기 클릭시
		$(".btn_giftCard").click(function(){
            if($(this).hasClass("on")){
                monthEvent.detail.checkApply();
            }
		});

		setTimeout(function(){
			//로그인시
			if(common.isLogin()){
				monthEvent.detail.getApplyStatus();
			}else{
				$(".btn_giftCard").addClass("on");
			}
		}, 300);
	},

	//응모여부조회
	getApplyStatus : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }
        var param = {
        	evtNo : $("input[id='evtNo']:hidden").val()
       		,fvrSeq : "1"
       		,goodsNo : $("input[id='evtGoodsNo']:hidden").val()
        };
        common.Ajax.sendJSONRequest(
       		 "GET"
       	   , _baseUrl + "event/20200425/getApplyStatus.do"
       	   , param
       	   , monthEvent.detail._callback_getApplyStatus
        );
    },

    _callback_getApplyStatus : function(json){
        if(json.ret == "0"){
        	if(json.result == "end"){	//온라인 구매로 인한 응모완료
        		$(".btn_giftCard").removeClass("on");
        	}else if(json.result == "storend"){	//오프라인 구매로 인한 응모 완료
        		$(".btn_giftCard").addClass("storend");
        	}else{
        		$(".btn_giftCard").addClass("on");
        	}
        }else if(json.ret == "-1"){
    		if(confirm("해당 서비스는 로그인이 필요합니다.로그인 페이지로 이동하시겠습니까?")){
        		common.link.moveLoginPage();
        		return false;
            }
    	}else{
        	$(".btn_giftCard").addClass("on");
        }
    },

    //매장구매검증요청
    checkStoreOrder : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }
        var param = {
        	evtNo : $("input[id='evtNo']:hidden").val()
       		,fvrSeq : "2"
        };
        common.Ajax.sendJSONRequest(
       		 "GET"
       	   , _baseUrl + "event/checkStoreOrder.do"
       	   , param
       	   , monthEvent.detail._callback_checkStoreOrder
        );
    },

    _callback_checkStoreOrder : function(json){
    	if(json.ret == "0"){
    		alert("요청되었습니다. 매장 응모 검증 후 추첨 진행됩니다.");
    	}else if(json.ret == "013"){
    		alert("이미 요청하셨습니다. 매장 응모 검증 후 추첨 진행됩니다.");
    	}else if(json.ret == "-1"){
    		if(confirm("해당 서비스는 로그인이 필요합니다.로그인 페이지로 이동하시겠습니까?")){
        		common.link.moveLoginPage();
        		return false;
            }
    	}else{
    		alert(json.message);
    	}
    },

    //응모체크
    checkApply : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }
        var param = {
        	evtNo : $("input[id='evtNo']:hidden").val()
       		,fvrSeq : "1"
        };
        common.Ajax.sendJSONRequest(
       		 "GET"
       	   , _baseUrl + "event/20200425/checkApply.do"
       	   , param
       	   , monthEvent.detail._callback_checkApply
        );
    },

    _callback_checkApply : function(json){
    	if(json.ret == "0"){
    		if(json.ordCnt == 0){
    			if(confirm("응모 대상자가 아닙니다. 올리브영 기프트카드 구매/선물하고 이벤트 응모해주세요.")){
    				common.link.commonMoveUrl('giftCardGuide/getGiftCardGuide.do');
    			}
    		}else{	//구매건수 있으면
    			$("div#Confirmlayer1").attr("onclick", "monthEvent.detail.giftCardApply();");
                mevent.detail.eventShowLayer('eventLayerPolice');
                monthEvent.detail.layerPolice = true;
                $(".agreeCont")[0].scrollTop = 0;
    		}
    	}else if(json.ret == "-1"){
    		if(confirm("해당 서비스는 로그인이 필요합니다.로그인 페이지로 이동하시겠습니까?")){
        		common.link.moveLoginPage();
        		return false;
            }
    	}else{
    		alert(json.message);
    	}
    },

    giftCardApply : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }

        var mbrInfoUseAgrYn =  $(':radio[name="argee1"]:checked').val();
        var mbrInfoThprSupAgrYn =  $(':radio[name="argee2"]:checked').val();

        if("Y" != $(':radio[name="argee1"]:checked').val() || "Y" != $(':radio[name="argee2"]:checked').val()){
            alert("2가지 모두 동의 후 참여 가능합니다.");
            return;
        }

        if("Y" != mbrInfoUseAgrYn){
            monthEvent.detail.layerPolice = false;
            mevent.detail.eventCloseLayer();
            return;
        }
        if("Y" != mbrInfoThprSupAgrYn){
            monthEvent.detail.layerPolice = false;
            mevent.detail.eventCloseLayer();
            return;
        }

        monthEvent.detail.layerPolice = false;
        mevent.detail.eventCloseLayer();
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
              , fvrSeq : "1"
              , mbrInfoUseAgrYn : mbrInfoUseAgrYn
              , mbrInfoThprSupAgrYn :mbrInfoThprSupAgrYn
        };
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20200425/giftCardApply.do"
              , param
              , monthEvent.detail._callback_giftCardApply
        );
    },

    _callback_giftCardApply : function(json){
        if(json.ret == "0"){
        	mevent.detail.eventShowLayer("popGift1");
            $(".btn_giftCard").removeClass("on");
        }else if(json.ret == "095"){
        	if(confirm("응모 대상자가 아닙니다. 기프트카드 구매/선물하고 이벤트 응모해주세요.")){
				common.link.commonMoveUrl('giftCardGuide/getGiftCardGuide.do');
			}
        }else if(json.ret == "-1"){
    		if(confirm("해당 서비스는 로그인이 필요합니다.로그인 페이지로 이동하시겠습니까?")){
        		common.link.moveLoginPage();
        		return false;
            }
    	}else{
        	alert(json.message);
        }

    }
}