/**
 * 오픈일자 : 2020.03.11
 * 이벤트명 : 3월 기프트관
 * */
$.namespace("monthEvent.detail");
monthEvent.detail = {
	layerPolice : false,
	currentDay : null,
	init : function(){
		monthEvent.detail.currentDay = $("input[id='imgUrlConnectDay']:hidden").val();

        //배너기간
    	if(monthEvent.detail.currentDay >= $("input[id='bannerStrtDtime']:hidden").val() && monthEvent.detail.currentDay <= $("input[id='bannerEndDtime']:hidden").val()){
    		$("#banner1").addClass("on");
    		$("#banner2").addClass("off");
        }else{
        	$("#banner1").addClass("off");
        	$("#banner1 .sbox a").attr("href","#n");
    		$("#banner2").addClass("on");
        }
		if(common.isLogin()){
            monthEvent.detail.getPresent();
        }
				
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
        
        $(".btn_02_2").click(function(){
        	if(!common.isLogin()){
        		if(!mevent.detail.checkLogin()){
                    return;
                }	
        	}
        });
    },
    
    getPresent : function(){
        var param = {
            evtNo : $("input[id='evtNo']:hidden").val()
        }

        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20200311/getPresent.do"
              , param
              , monthEvent.detail._callback_getPresent
        );
    },

    _callback_getPresent : function(json){
        if(json.ret == "0"){
        	$(".it01").addClass(json.apply1);
        	$(".it02").addClass(json.apply2);
        	$(".it03").addClass(json.apply3);
        	
        	if(json.apply4 == "on"){
        		$("#applyArea1 .sbox").removeClass().addClass("sbox btn_01_2");
        		$('#applyArea1 .sbox img').attr("src", '//image.oliveyoung.co.kr/uploads/contents/202003/11giftevent2/mc_btn_01_2.jpg');
        		$('#applyArea1 .sbox a').attr("href", 'javascript:monthEvent.detail.checkApply(4);');
        	}else if(json.apply4 == "end"){
        		$("#applyArea1 .sbox").removeClass().addClass("sbox btn_01_3");
        		$('#applyArea1 .sbox img').attr("src", '//image.oliveyoung.co.kr/uploads/contents/202003/11giftevent2/mc_btn_01_3.jpg');
        		$('#applyArea1 .sbox a').attr("href", '#n');
        	}
        	
        	if(json.apply5 == "on"){
        		$("#applyArea2 .sbox").removeClass().addClass("sbox btn_02_2 on");
        		$('#applyArea2 .sbox img').attr("src", '//image.oliveyoung.co.kr/uploads/contents/202003/11giftevent2/mc_btn_02_2.jpg');
        		$('#applyArea2 .sbox a').attr("href", 'javascript:monthEvent.detail.checkApply(5);');
        	}else if(json.apply5 == "end"){
        		$("#applyArea2 .sbox").removeClass().addClass("sbox btn_02_3");
        		$('#applyArea2 .sbox img').attr("src", '//image.oliveyoung.co.kr/uploads/contents/202003/11giftevent2/mc_btn_02_3.jpg');
        		$('#applyArea2 .sbox a').attr("href", '#n');
        	}else{
        		$("#applyArea2 .sbox").removeClass().addClass("sbox btn_02_1");
        		$('#applyArea2 .sbox a').attr("href", 'javascript:alert("선물하기 서비스 이용 후 응모해주세요.")');
        		$('#applyArea2 .sbox img').attr("src", '//image.oliveyoung.co.kr/uploads/contents/202003/11giftevent2/mc_btn_02_1.jpg');
        	}
        }
    },
    
    checkApply : function(fvrSeq){
    	if(!mevent.detail.checkLogin()){
            return;
        }
        var param = {
            evtNo : $("input[id='evtNo']:hidden").val()
            ,fvrSeq : fvrSeq
        }

        common.Ajax.sendRequest(
                "GET"
              , _baseUrl + "event/20200311/checkApply.do"
              , param
              , function(json){
                  $(':radio[name="argee1"]:checked').attr("checked", false);
                  $(':radio[name="argee2"]:checked').attr("checked", false);

                    if(json.ret == "0"){
                        if( json.applyCnt  == "0" ) {
                            $("div#Confirmlayer1").attr("onclick", "monthEvent.detail.apply(' " + fvrSeq + "' ,  ' " + json.applyCnt + "'  ); "  );
                            mevent.detail.eventShowLayer('eventLayerPolice');
                            monthEvent.detail.layerPolice = true;
                            $(".agreeCont")[0].scrollTop = 0;
                        }else {
                            monthEvent.detail.apply(fvrSeq, json.applyCnt);
                        }
                    }else{
                        alert(json.message);
                    }
                }
        );
    },

    apply : function(fvrSeq, myTotalCnt){ 
        if(!mevent.detail.checkLogin()){
            return;
        }

        var mbrInfoUseAgrYn =  $(':radio[name="argee1"]:checked').val();
        var mbrInfoThprSupAgrYn =  $(':radio[name="argee2"]:checked').val();

        if(myTotalCnt == 0 ){
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
        }else {
            mbrInfoUseAgrYn = "Y";
            mbrInfoThprSupAgrYn = "Y";
        }

        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
              , fvrSeq : fvrSeq
              , mbrInfoUseAgrYn : mbrInfoUseAgrYn
              , mbrInfoThprSupAgrYn :mbrInfoThprSupAgrYn
        };
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20200311/presentApply.do"
              , param
              , monthEvent.detail._callback_apply
        );
    },

    _callback_apply : function(json){
        if(json.ret == "0"){
            alert($("input[id='evtMessage']:hidden").val());
        }else{
            alert(json.message);
        }
        monthEvent.detail.getPresent();
    }
}