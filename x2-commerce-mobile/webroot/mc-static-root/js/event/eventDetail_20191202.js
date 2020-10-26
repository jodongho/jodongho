$.namespace("monthEvent.detail");
monthEvent.detail = {
    layerPolice : false,
    init : function(){
        if(common.isLogin()){
            monthEvent.detail.getMbrGradeInfo();
            $(".evtCon01").removeClass("user_none");
        }

        $("[id^=btn]").click(function(){
            var num = Number($(this).attr("id").replace("btn",""));
            if(common.isLogin()){
                if($(this).hasClass("on")){
                    monthEvent.detail.checkApply(num);
                }
            }else{
                monthEvent.detail.checkApply(num);
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

        $(".user_none").click(function(){
            if(!mevent.detail.checkLogin()){
                return;
            }
        });

        //배너 설정
        var now = new Date();
        var date = now.getDate();
        var month = now.getMonth()+1;
        if(month == 11 || date <= 8){  //2~8일까진 올영세일
            $("#topBanner").show();
            $(".banner01").addClass("on");
            $(".banner02").removeClass("on");
        }else{  //아닐때는 출석체크
            $(".banner02").addClass("on");
            $(".banner01").html("&nbsp;");
            $(".banner01").removeClass("on");
            $("#topBanner").html("&nbsp;");
        }
    },

    /* 로그인한 회원 출석 현황 조회 */
    getMbrGradeInfo : function(){
        var param = {
            evtNo : $("input[id='evtNo']:hidden").val(),
            purStrtDt : $("input[id='purStrtDt']:hidden").val(),
            purStrtDt2 : $("input[id='purStrtDt2']:hidden").val(),
            purEndDt : $("input[id='purEndDt']:hidden").val()
        }

        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20191202/getMbrGradeInfo.do"
              , param
              , monthEvent.detail._callback_getMbrGradeInfo
        );
    },

    _callback_getMbrGradeInfo : function(json){
        if(json.ret == "0"){
            if(json.gradeNm == "GOLD"){
                $(".txt_nextLevel").hide();
            }
            $(".gradeNm").html(json.gradeNm);
            $(".ordAmt").html(mevent.detail.toCurrency(json.ordAmt));
            $(".progressbar").html("<span style='width:"+json.progress+"%;'>&nbsp;</span>");
            $(".nextGrdAmt").html(mevent.detail.toCurrency(json.nextGrdAmt));
            $("#btn1").addClass(json.apply1);
            $("#btn2").addClass(json.apply2);
            $("#btn3").addClass(json.apply3);
            $("#btn4").addClass(json.apply4);
        }
    },

    checkApply : function(fvrSeq){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mevent.detail.checkLogin()){
                return;
            }

            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val(),
                    purStrtDt : $("input[id='purStrtDt']:hidden").val(),
                    purStrtDt2 : $("input[id='purStrtDt2']:hidden").val(),
                    purEndDt : $("input[id='purEndDt']:hidden").val(),
                    fvrSeq : fvrSeq
            }
            common.Ajax.sendRequest(
                    "GET"
                  , _baseUrl + "event/20191202/checkApply.do"
                  , param
                  , function(json){
                      $(':radio[name="argee1"]:checked').attr("checked", false);
                      $(':radio[name="argee2"]:checked').attr("checked", false);

                        if(json.ret == "0"){
                            if( json.myTotalCnt  == "0" ) {
                                $("div#Confirmlayer1").attr("onclick", "monthEvent.detail.apply(' " + fvrSeq + "' ,  ' " + json.myTotalCnt + "'  ); "  );
                                mevent.detail.eventShowLayer('eventLayerPolice');
                                monthEvent.detail.layerPolice = true;
                                $(".agreeCont")[0].scrollTop = 0;
                            }else {
                                monthEvent.detail.apply(fvrSeq, json.myTotalCnt);
                            }
                        }else{
                            alert(json.message);
                        }
                    }
            );
        }
    },

    apply : function(fvrSeq,myTotalCnt){
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
              ,fvrSeq : fvrSeq
              ,purStrtDt : $("input[id='purStrtDt']:hidden").val()
              ,purStrtDt2 : $("input[id='purStrtDt2']:hidden").val()
              ,purEndDt : $("input[id='purEndDt']:hidden").val()
              , mbrInfoUseAgrYn : mbrInfoUseAgrYn
              , mbrInfoThprSupAgrYn :mbrInfoThprSupAgrYn
        };
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20191202/apply.do"
              , param
              , monthEvent.detail._callback_apply
        );
    },

    _callback_apply : function(json){
        if(json.ret == "0"){
            $(':radio[name="argee1"]:checked').attr("checked", false);
            $(':radio[name="argee2"]:checked').attr("checked", false);
            if(json.fvrSeq == "1"){
                alert("응모완료되었습니다. 1월 13일 쿠폰함을 확인해주세요");
            }else{
                mevent.detail.eventShowLayer('evtGift'+Number(json.fvrSeq-1));
            }
            monthEvent.detail.getMbrGradeInfo();
        }else{
            alert(json.message);
        }
    }
}