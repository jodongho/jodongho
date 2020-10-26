/**
 * 배포일자 : 2019.09.26
 * 오픈일자 : 2019.10.01
 * 이벤트명 : 구매스탬프 - 도전 릴레이 박스
 * */
$.namespace("monthEvent.detail");
monthEvent.detail = {
    layerPolice : false,
    boxCnt : 0,
    inBtn : '',
    init : function(){

        monthEvent.detail.getBox();

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

    },

    /* 박스 셋팅 */
    getBox : function(){
        if(common.isLogin()){
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                    , startDate : $("input[id='imgUrlConnectDay']:hidden").val()
            }
            common.Ajax.sendRequest(
                    "GET"
                  , _baseUrl + "event/20191001_2/getBoxJson.do"
                  , param
                  , monthEvent.detail._callback_getBoxJson
            );
        }
    },

    _callback_getBoxJson : function(json){

        if(json.ret == '0'){
            if(json.ordList.length > 0){
                //박스 채우기
                monthEvent.detail.boxCnt = json.ordList[0].CNT;
                for(var i=0 ; i<json.ordList.length ; i++){
                    for(var j=0 ; j<json.ordList[i].CNT ; j++){
                        $('.relStamp'+(json.ordList[i].START_DT*1+j-9)).addClass('on');
                    }
                }

                //응모 버튼 셋팅
                if(monthEvent.detail.boxCnt >= '2'){
                    $('.btn_area').addClass('on').attr('onClick', "javascript:monthEvent.detail.onBoxBtn('1');");
                }if(monthEvent.detail.boxCnt == '3'){
                    $('.bonusStamp1').addClass('on').attr('onClick', "javascript:monthEvent.detail.onBoxBtn('2');");
                    $('.bonusStamp2').addClass('on').attr('onClick', "javascript:monthEvent.detail.onBoxBtn('3');");
                }
                if(json.myEvtWinList.length > 0){
                    for(var i=0 ; i<json.myEvtWinList.length ; i++){
                        if(json.myEvtWinList[i] == '1' || json.myEvtWinList[i] == '2'){
                            $('.btn_area').removeClass('on').addClass('end').removeAttr('onClick');
                        }else if(json.myEvtWinList[i] == '3'){
                            $('.bonusStamp1').removeClass('on').addClass('end').removeAttr('onClick');
                        }else if(json.myEvtWinList[i] == '4'){
                            $('.bonusStamp2').removeClass('on').addClass('end').removeAttr('onClick');
                        }
                    }
                }
            }

        }
    },

    onBoxBtn : function(idx){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("APP에서만 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mevent.detail.checkLogin()){
                return;
            }

            monthEvent.detail.inBtn = idx;
            monthEvent.detail.boxApply();
        }
    },

    /* 위수탁 동의 팝업 */
    popLayerConfirm : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("APP에서만 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if("Y" != $(':radio[name="argee1"]:checked').val() || "Y" != $(':radio[name="argee2"]:checked').val()){
                alert("2가지 모두 동의 후 참여 가능합니다.");
                return;
            }

            if("Y" == $(':radio[name="argee1"]:checked').val() && "Y" == $(':radio[name="argee2"]:checked').val()){
                monthEvent.detail.layerPolice = false;
                mevent.detail.eventCloseLayer();

                monthEvent.detail.boxApply();
            }
        }
    },

    /* 응모하기 */
    boxApply : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("APP에서만 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mevent.detail.checkLogin()){
                return;
            }

            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                    , startDate : $("input[id='imgUrlConnectDay']:hidden").val()
                    , MbrInfoUseAgrYn : $(':radio[name="argee1"]:checked').val()
                    , MbrInfoThprSupAgrYn : $(':radio[name="argee2"]:checked').val()
                    , inBtn : monthEvent.detail.inBtn
            }
            common.Ajax.sendRequest(
                    "GET"
                  , _baseUrl + "event/20191001_2/boxApplyJson.do"
                  , param
                  , monthEvent.detail._callback_boxApplyJson
            );
        }
    },

    _callback_boxApplyJson : function(json){
        if(json.ret == '016'){
            //위수탁 동의 팝업
            $(':radio[name="argee1"]:input[value="N"]').attr("checked", true);
            $(':radio[name="argee2"]:input[value="N"]').attr("checked", true);
            mevent.detail.eventShowLayer('eventLayerPolice');
            $(".agreeCont")[0].scrollTop = 0;
            monthEvent.detail.layerPolice = true;
        }else if(json.ret == '0'){
            if(json.winYn != 'Y'){
                mevent.detail.eventShowLayer('evtFail');
            }else{
                if(json.fvrSeq == '1'){
                    $('#evtStamp1').find('span.win_number').text('('+json.tgtrSeq+')').end().find('.txtNotice span').text('12월 11일');
                    mevent.detail.eventShowLayer('evtStamp1');
                }else if(json.fvrSeq == '2'){
                    $('#evtStamp1').find('span.win_number').text('('+json.tgtrSeq+')').end().find('.txtNotice span').text('1월 15일');
                    mevent.detail.eventShowLayer('evtStamp1');
                }else if(json.fvrSeq == '3'){
                    $('#evtStamp2 .win_number').text('('+json.tgtrSeq+')');
                    mevent.detail.eventShowLayer('evtStamp2');
                }else if(json.fvrSeq == '4'){
                    $('#evtStamp3 .win_number').text('('+json.tgtrSeq+')');
                    mevent.detail.eventShowLayer('evtStamp3');
                }
            }

            if(json.fvrSeq == '1'){
                $('.btn_area').removeClass('on').addClass('end').removeAttr('onClick');
            }else if(json.fvrSeq == '2'){
                $('.btn_area').removeClass('on').addClass('end').removeAttr('onClick');
            }else if(json.fvrSeq == '3'){
                $('.bonusStamp1').removeClass('on').addClass('end').removeAttr('onClick');
            }else if(json.fvrSeq == '4'){
                $('.bonusStamp2').removeClass('on').addClass('end').removeAttr('onClick');
            }
        }else{
            alert(json.message);
        }
    },

    /* 당첨내역 확인 */
    getStmpMyWinList : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }

        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
        }
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/getStmpMyWinListJson.do"
              , param
              , monthEvent.detail._callback_getStmpMyWinListJson
        );
    },

    _callback_getStmpMyWinListJson : function(json){
        if(json.ret == "0"){
            var myWinListHtml = "";
            if(json.myEvtWinList.length <= 0){
                myWinListHtml = "<tr><td colspan='2' class='no'>당첨이력이<br/> 없습니다.</td></tr>";
            }else{
                for(var i=0 ; i<json.myEvtWinList.length ; i++){
                    myWinListHtml += "<tr><td>" + json.myEvtWinList[i].strSbscSgtDtime + "</td><td>" + json.myEvtWinList[i].evtGoodsNm + "</td></tr>";
                }
            }
            $("tbody#myWinListHtml").html(myWinListHtml);

            mevent.detail.eventShowLayer('evtPopWinDetail');
        }else{
            alert(json.message);
        }
    }

}