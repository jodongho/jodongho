/**
 * 배포일자 : 2019.06.20
 * 오픈일자 : 2019.06.24
 * 이벤트명 : 닥터지 룰렛
 */
$.namespace("monthEvent.detail");
monthEvent.detail = {
    baseImgPath : _cdnImgUrl + "contents/201906/24Roulette/",
    rotateIng : false,

    init : function(){
        $('#eventLayerPolice .eventHideLayer').click(function(){
            $(".eventLayer").hide();
            $("#eventDimLayer").hide();
            location.reload();//새로고침
        });
    },

    /* 룰렛 돌리기 */
    setRotate : function(){
        if(monthEvent.detail.rotateIng){
            return;
        }else if (common.app.appInfo == undefined || !common.app.appInfo.isapp) {
            if(confirm("모바일 앱에서만 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mevent.detail.checkLogin()){
                return;
            }
            if(!mevent.detail.checkRegAvailable()){
                return;
            }
            monthEvent.detail.rotateIng = true;

            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                   , MbrInfoUseAgrYn : $(':radio[name="argee1"]:checked').val()
                   , MbrInfoThprSupAgrYn : $(':radio[name="argee2"]:checked').val()
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20190624/setRotateJson.do"
                  , param
                  , monthEvent.detail._callback_setRotateJosn
            );
        }
    },
    _callback_setRotateJosn : function(json){
        if(json.ret == "0"){

            var resultItem = json.fvrSeq;
            var resultItemCount = json.itemCount;
            var revision = 360/resultItemCount;

            var duration = 2500;
            var pieAngle = 360*3;
            var angle = 0;

            angle = (pieAngle - ((resultItem*revision)-(revision/2)));

            $("img#roulette_base").rotate({
                duration: duration,
                animateTo: angle,
                callback: function(){
                    //다른 팝업은 닫기
                    mevent.detail.eventCloseLayer();

                    if(json.popImg != 'fail1'){
                        $('#eventLayerWinner_'+json.popImg+' .win_number').text('('+ json.tgtrSeq +')');
                    }
                    mevent.detail.eventShowLayer('eventLayerWinner_'+json.popImg);
                    monthEvent.detail.rotateIng = false;
                }
            });
        }else if(json.ret == "016" || json.ret == "017"){
            //위수탁 동의 팝업
            $(':radio[name="argee1"]:input[value="N"]').attr("checked", true);
            $(':radio[name="argee2"]:input[value="N"]').attr("checked", true);
            mevent.detail.eventShowLayer('eventLayerPolice');
            monthEvent.detail.rotateIng = false;
        }else{
            alert(json.message);
            monthEvent.detail.rotateIng = false;
        }
    },

    /* 위수탁 동의 처리 */
    popLayerConfirm : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 응모 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if($(':radio[name="argee1"]:checked').val() == undefined &&  $(':radio[name="argee2"]:checked').val() == undefined ){
                alert("개인정보 위/수탁 동의 후 참여 가능합니다.");
                return;
            }
            if("N" == $(':radio[name="argee1"]:checked').val() && "N" == $(':radio[name="argee2"]:checked').val() ){
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

            if("Y" == $(':radio[name="argee1"]:checked').val() && "Y" == $(':radio[name="argee2"]:checked').val()){
                mevent.detail.eventCloseLayer();
                monthEvent.detail.setRotate();
            }
        }
    },

    /* 당첨내역 확인 */
    getMyWinList : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
        }
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20190624/getMyWinListJson.do"
              , param
              , monthEvent.detail._callback_getMyWinListJson
        );
    },
    _callback_getMyWinListJson : function(json){
        if(json.ret == "0"){
            var myWinListHtml = "";

            if(json.myEvtWinList.length <= 0){
                myWinListHtml = "<tr><td colspan='2' class='no'>참여이력이<br/> 없습니다.</td></tr>";
            }else{
                for(var i=0 ; i<json.myEvtWinList.length ; i++){
                    myWinListHtml += "<tr><td>" + json.myEvtWinList[i].strSbscSgtDtime + "</td><td>" + json.myEvtWinList[i].evtGoodsNm + "</td></tr>";
                }
            }
            $("tbody#myWinListHtml").html(myWinListHtml);
            mevent.detail.eventShowLayer('winCheck');
        }else{
            alert(json.message);
        }
    }

}