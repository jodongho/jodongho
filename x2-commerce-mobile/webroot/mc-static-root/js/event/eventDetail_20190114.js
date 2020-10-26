/**
 * 배포일자 : 2019.01.10
 * 오픈일자 : 2019.01.14
 * 이벤트명 : 골드키트
 * */

$.namespace("monthEvent.detail");
monthEvent.detail = {
    cnt : 0,
    search : "N",
    firstYn : "N",
    
    
    init : function(){

        /* 내 골드이력 확인하기 */
        $("#eCheck").click(function(){
            monthEvent.detail.cnt = 0;
            monthEvent.detail.getGoldListJson();
        });

        /* 내 골드키트 신청하기 */
        $("#eApply").click(function(){
            monthEvent.detail.checkGoldKit();
        });

        /* 위수탁동의 닫기 */
        $(".eventHideLayer1").click(function(){
            monthEvent.detail.eventCloseLayer1();
        });
    },

    getGoldListJson : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mevent.detail.checkLogin()){
                return;
            }else{
                if("Y" == mevent.detail.search){
                    alert("이미 조회하셨습니다.");
                    return;
                }else{
                    var param = {
                            evtNo : $("input[id='evtNo']:hidden").val()
                    };
                    common.Ajax.sendJSONRequest(
                            "GET"
                            , _baseUrl + "event/20190114/getGradeGoldHistoryList.do"
                            , param
                            , monthEvent.detail._callback_getGoldListJson
                    );
                }
            }
        }
    },

    _callback_getGoldListJson : function(json){
        if(json.ret == "0"){
            
            // 기존에 있던 on class 모두 삭제
            $("#gold_mth").children().removeClass("on");
            
            for(var i=0 ; i<json.gradeList.length ; i++){
                //$("#month"+Number(i+1)).html(json.gradeList[i].sDtime+" :  "+json.gradeList[i].sYn);
                
                if(json.gradeList[i].sYn == "Y"){
                    monthEvent.detail.cnt++;
                    $(".mth"+Number(i+1)).addClass("on");
                }
            }
            if(monthEvent.detail.cnt == 0){
                // 골드등급 이력이 없습니다.
                mevent.detail.eventShowLayer('c1_eventpop2');
            }else if(monthEvent.detail.cnt > 0){
                // 골드등급 이력이 있는 경우
                mevent.detail.eventShowLayer('c1_eventpop1');
            }

            mevent.detail.search = "Y"; //골드이력확인여부
            
        }else{
            alert(json.message);
        }
    },

    checkGoldKit : function(){
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

            if("Y" != mevent.detail.search){
                alert("상단 골드이력을 확인해주세요.");
                return;
            }

            if(mevent.detail.cnt == 0){
                alert("신청 대상자가 아닙니다.");
                return;
            }

            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                    ,fvrSeq : "1"
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20190114/checkGoldKitJson.do"
                  , param
                  , monthEvent.detail._callback_checkGoldKitJson
            );
        }
    },

    _callback_checkGoldKitJson : function(json){
        $(':radio[name="argee1"]:checked').attr("checked", false);
        $(':radio[name="argee2"]:checked').attr("checked", false);

        if(json.ret == "0"){
            if( json.myTotalCnt  == "0" ) {  //한번도 신청하지 않은경우 위수탁 받기
                $("div#Confirmlayer1").attr("onclick", "monthEvent.detail.goldKitApply('"+json.myTotalCnt+"');");
                mevent.detail.eventShowLayer('eventLayerPolice');
                monthEvent.detail.firstYn = "Y";
            }else {
                monthEvent.detail.firstYn = "N";
                monthEvent.detail.goldKitApply(json.myTotalCnt);
            }
        }else{
              alert(json.message);
        }
    },

    goldKitApply : function(myTotalCnt){
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

            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                    ,fvrSeq : "1"
                    , mbrInfoUseAgrYn : mbrInfoUseAgrYn
                    , mbrInfoThprSupAgrYn :mbrInfoThprSupAgrYn
                    , firstYn :monthEvent.detail.firstYn
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20190114/goldKitApply.do"
                  , param
                  , monthEvent.detail._callback_goldKitApply
            );
        }

    },

    _callback_goldKitApply : function(json){
        if(json.ret == "0"){
            mevent.detail.eventShowLayer('c1_eventpop3');
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