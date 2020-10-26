/**
 * 배포일자 : 2020-05-21
 * 오픈일자 : 2020-05-29
 * 이벤트명 : 올리브 레벨업
 */
$.namespace("monthEvent.detail");
monthEvent.detail = {
    layerPolice : false,
    currentDay : null,
    baseImgPath : _cdnImgUrl + "contents/202005/29levelup/",
    init : function(){
    	monthEvent.detail.currentDay = $("input[id='imgUrlConnectDay']:hidden").val();
        if(common.isLoginForEvt()){
            monthEvent.detail.getMbrGradeInfo();
            $(".evtCon01").removeClass("user_none");
        }

        $(".user_none").click(function(){
        	if(!monthEvent.detail.checkLoginEvt()){
                return;
            }
        });

        $(".btn_level").click(function(){
        	if($(this).hasClass("on")){
                monthEvent.detail.checkApply();
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

        if(monthEvent.detail.currentDay.substring(0,6) == "202005"){	//5월출석체크
        	$('.evtBan:eq(1) a').attr("href", "javascript:common.link.commonMoveUrl('"+$("input[id='attendUrl5']:hidden").val()+"');");
        	$(".evtBan:eq(1) img").attr("src", monthEvent.detail.baseImgPath + 'mc_banner02.jpg');
        }else if(monthEvent.detail.currentDay.substring(0,6) == "202006"){	//6월출석체크
        	$('.evtBan:eq(1) a').attr("href", "javascript:common.link.commonMoveUrl('"+$("input[id='attendUrl6']:hidden").val()+"');");
        	$(".evtBan:eq(1) img").attr("src", monthEvent.detail.baseImgPath + 'mc_banner03.jpg');
        }else if(monthEvent.detail.currentDay.substring(0,6) == "202007"){	//7월출석체크
        	$('.evtBan:eq(1) a').attr("href", "javascript:common.link.commonMoveUrl('"+$("input[id='attendUrl7']:hidden").val()+"');");
        	$(".evtBan:eq(1) img").attr("src", monthEvent.detail.baseImgPath + 'mc_banner04.jpg');
        }
    },

    /* 로그인한 회원 출석 현황 조회 */
    getMbrGradeInfo : function(){
        var param = {
            evtNo : $("input[id='evtNo']:hidden").val()
            ,strtDtime : $("input[id='strtDtime']:hidden").val()
            ,endDtime : $("input[id='endDtime']:hidden").val()
            ,fvrSeq : "1"
        }

        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20200529_1/getMbrGradeInfo.do"
              , param
              , monthEvent.detail._callback_getMbrGradeInfo
        );
    },

    _callback_getMbrGradeInfo : function(json){
        if(json.ret == "0"){
        	if(json.applyCnt > 0){
        		$(".btn_level").removeClass("on");
        	}
        	$(".txt_myLevel").addClass("level_"+json.gradeNm);
        	$(".txt_myLevel").html(json.gradeNm+" OLIVE!");
        	if(json.gradeNm == "gold"){
                $(".txt_nextLevel").hide();
            }
            $(".gradeNm").html(json.gradeNm);
            $(".ordAmt").html(mevent.detail.toCurrency(json.ordAmt));
            $(".progressbar").html("<span style='width:"+json.progress+"%;'>&nbsp;</span>");
            $(".nextGrdAmt").html(mevent.detail.toCurrency(json.nextGrdAmt));
        }else if(json.ret == "99"){
        	alert(json.message);
        }
    },

    checkApply : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!monthEvent.detail.checkLoginEvt()){
                return;
            }

            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                    ,strtDtime : $("input[id='purStrtDt']:hidden").val()
                    ,endDtime : $("input[id='purEndDt']:hidden").val()
                    ,fvrSeq : "1"
            }
            common.Ajax.sendRequest(
                    "GET"
                  , _baseUrl + "event/20200529_1/checkApply.do"
                  , param
                  , function(json){
                      $(':radio[name="argee1"]:checked').attr("checked", false);
                      $(':radio[name="argee2"]:checked').attr("checked", false);

                        if(json.ret == "0"){
                        	$(".agreeBtn").attr("onclick", "monthEvent.detail.apply();");
                            mevent.detail.eventShowLayer('eventLayerPolice');
                            monthEvent.detail.layerPolice = true;
                            $(".agreeCont")[0].scrollTop = 0;
                        }else{
                            alert(json.message);
                        }
                    }
            );
        }
    },

    apply : function(fvrSeq,myTotalCnt){
        if(!monthEvent.detail.checkLoginEvt()){
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
              ,strtDtime : $("input[id='purStrtDt']:hidden").val()
              ,endDtime : $("input[id='purEndDt']:hidden").val()
              ,fvrSeq : "1"
              ,mbrInfoUseAgrYn : mbrInfoUseAgrYn
              ,mbrInfoThprSupAgrYn :mbrInfoThprSupAgrYn
        };
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20200529_1/apply.do"
              , param
              , monthEvent.detail._callback_apply
        );
    },

    _callback_apply : function(json){
        if(json.ret == "0"){
            $(':radio[name="argee1"]:checked').attr("checked", false);
            $(':radio[name="argee2"]:checked').attr("checked", false);
            mevent.detail.eventShowLayer('evtGift1');
            $(".btn_level").removeClass("on");
        }else{
            alert(json.message);
        }
    },

    checkLoginEvt : function(){
        if(!common.isLoginForEvt()){
            if(!confirm("해당 서비스는 로그인이 필요합니다.로그인 페이지로 이동하시겠습니까?")){
                return false;
            }else{
                common.link.moveLoginPage();
                return false;
            }
        }

        return true;
    }
}