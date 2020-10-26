/**
 * 오픈일자 : 2019.01.25
 * 이벤트명 : 3월_구매스탬프 프로모션
 * */

$.namespace("monthEvent.detail");
monthEvent.detail = {
    firstYn : "N",
    init : function(){
        monthEvent.detail.getStamp();

        $(".stamp_list2 li").click(function(){
            if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
                if(confirm("모바일 앱에서만 신청 가능합니다.")){
                    common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
                }else{
                    return;
                }
            }else{
                if(!mevent.detail.checkLogin()){
                    return;
                }

                if($(this).hasClass("end")){
                    alert("이미 신청하셨습니다.");
                }else if(!$(this).hasClass("on")){
                    alert("혜택 대상자가 아닙니다. 스탬프를 찍고 응모해주세요.");
                }else{
                    monthEvent.detail.checkApply(Number($(this).index()+1));
                }
            }
        });

        $("#eApply").click(function(){
            if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
                if(confirm("모바일 앱에서만 신청 가능합니다.")){
                    common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
                }else{
                    return;
                }
            }else{
                if(!mevent.detail.checkLogin()){
                    return;
                }

                if(!$(".my_total_store").hasClass("on")){
                    alert("나의 구매 매장수를 확인하세요!");
                }else{
                    monthEvent.detail.checkApply("4");
                }
            }
        });

        /* 나의 구매매장수 확인하기 */
        $(".my_total_store").click(function(){
            if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
                if(confirm("모바일 앱에서만 확인 가능합니다.")){
                    common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
                }else{
                    return;
                }
            }else{
                if(!mevent.detail.checkLogin()){
                    return;
                }else{
                    if(!$(this).hasClass("on")){
                        monthEvent.detail.getBuyStrCnt();
                    }
                }
            }
        });

        /* 위수탁동의 닫기 */
        $(".eventHideLayer1").click(function(){
            monthEvent.detail.eventCloseLayer1();
        });


        $(".link2").click(function(){
            if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
                if(confirm("모바일 앱에서만 확인 가능합니다.")){
                    common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
                }else{
                    return;
                }
            }else{
                if(!mevent.detail.checkLogin()){
                    return;
                }
                common.link.commonMoveUrl('mypage/getSmartRecipt.do?mbr_no='+$("#ssoMbrNo").val());
            }
        });
    },

    getStamp : function(){
        if(common.isLogin()){
            $(".stamp_list1 li").removeClass("on");
            $(".stamp_list2 li").removeClass("on end");

            mevent.detail.eventShowLayer('loadingBar');
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
            }
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20190304/getStamp.do"
                  , param
                  , monthEvent.detail._callback_getStamp
            );
        }
    },

    _callback_getStamp : function(json){
        mevent.detail.eventCloseLayer();
        if(json.ret == "0"){
            $(".stamp_list1 li").each(function(index){
                $(this).addClass(eval("json.stamp"+Number(index+1)));
            });

            $(".stamp_list2 li").each(function(index){
                $(this).addClass(eval("json.btn"+Number(index+1)));
            });
        }else{
            alert(json.message);
        }
    },

    getBuyStrCnt : function(){
        mevent.detail.eventShowLayer('loadingBar');
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
        }

        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20190304/getBuyStrCnt.do"
              , param
              , monthEvent.detail._callback_getBuyStrCnt
        );
    },

    _callback_getBuyStrCnt : function(json){
        mevent.detail.eventCloseLayer();
        if(json.ret == "0"){
            $(".my_total_store").addClass("on");
            $(".my_total_store > span").text(json.strCnt);
        }else{
            alert(json.message);
        }
    },

    checkApply : function(fvrSeq){
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
                ,fvrSeq : fvrSeq
        }

        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20190304/checkOnOffStamp.do"
              , param
              , function(json){
                  $(':radio[name="argee1"]:checked').attr("checked", false);
                  $(':radio[name="argee2"]:checked').attr("checked", false);

                  if(json.ret == "0"){
                      if( json.myTotalCnt  == "0" ) {
                            $("div#Confirmlayer1").attr("onclick", "   monthEvent.detail.onOffstampApply(' " + fvrSeq + "' ,  ' " + json.myTotalCnt + "'  ); " );
                            mevent.detail.eventShowLayer('eventLayerPolice');
                            monthEvent.detail.firstYn = "Y";
                        }else {
                            monthEvent.detail.onOffstampApply(fvrSeq, json.myTotalCnt);
                            monthEvent.detail.firstYn = "N";
                        }
                  }else{
                      alert(json.message);
                  }
              }
        );
    },

    onOffstampApply : function(fvrSeq,myTotalCnt){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 신청 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mevent.detail.checkLogin()){
                return;
            }

            if(myTotalCnt == 0 ){
                /* 수신동의  myTotalCnt =0 일때만 수신동의 받고 그이후에는 계속Y */
                var mbrInfoUseAgrYn =  $(':radio[name="argee1"]:checked').val();
                var mbrInfoThprSupAgrYn =  $(':radio[name="argee2"]:checked').val();

                if($(':radio[name="argee1"]:checked').val() == undefined &&  $(':radio[name="argee2"]:checked').val() == undefined ){
                    alert("개인정보 위/수탁 동의 후 참여 가능합니다.");
                    return;
                }
                if("N"==$(':radio[name="argee1"]:checked').val() &&  "N"==$(':radio[name="argee2"]:checked').val()){
                    alert("개인정보 위/수탁 동의 후 참여 가능합니다.");
                    return;
                }
                if("Y" != $(':radio[name="argee1"]:checked').val()){
                    alert("개인정보 수집 이용 동의 후 참여 가능합니다.");
                    return;
                }
                if("Y" != $(':radio[name="argee2"]:checked').val()){
                    alert("개인정보 처리 위탁 동의 후 참여 가능합니다.");
                    return;
                }

                if("Y" != mbrInfoUseAgrYn){
                    mevent.detail.eventCloseLayer();
                    return;
                }
                if("Y" != mbrInfoThprSupAgrYn){
                    mevent.detail.eventCloseLayer();
                    return;
                }
            }else {
                mbrInfoUseAgrYn = "Y";
                mbrInfoThprSupAgrYn = "Y";
            }

            mevent.detail.eventCloseLayer();
            mevent.detail.eventShowLayer('loadingBar');
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                  , fvrSeq : fvrSeq
                  , firstYn : monthEvent.detail.firstYn
                  , mbrInfoUseAgrYn : mbrInfoUseAgrYn
                  , mbrInfoThprSupAgrYn :mbrInfoThprSupAgrYn
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20190304/onOffstampApply.do"
                  , param
                  , monthEvent.detail._callback_onOffstampApply
            );
        }
    },

    _callback_onOffstampApply : function(json){
        mevent.detail.eventCloseLayer();
        if(json.ret == "0"){
            $(':radio[name="argee1"]:checked').attr("checked", false);
            $(':radio[name="argee2"]:checked').attr("checked", false);

            if(json.fvrSeq == "4"){
                alert("응모 되셨습니다. 3월 20일 당첨자 발표 게시판을 확인하세요");
            }else{
                alert("신청 완료 되었습니다. 3월 20일 당첨자발표일에 확인하세요!");
            }
            monthEvent.detail.getStamp();
        }else{
            alert(json.message);
        }
    },

    // 위수탁 레이어 숨김
    eventCloseLayer1 : function(){
        $(".eventLayer").hide();
        $("#eventDimLayer").hide();
        location.reload();//새로고침
    },
};