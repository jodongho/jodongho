$.namespace("monthEvent.detail");
monthEvent.detail = {
    currentDay : null,
    layerPolice : false,
    firstYn : "N",
    init : function(){

        //작성가능리뷰 수 확인하기
        $("#btnRecomm").click(function(){
            if($("#box_before").hasClass("on")){
                monthEvent.detail.getGoodsAppraisalPossibleCount();
            }
        });

        $("#btnCheck").click(function(){
            if($("#check_before").hasClass("on")){
                monthEvent.detail.getBalloonTotal();
            }
        });

        $("#divPop").click(function(){
            monthEvent.detail.getBalloonTotal();
            mevent.detail.eventShowLayer('layerCheckPoint');
        });

        //나의 당첨내역
        $("div#eMylist").click(function(){
            if(!mevent.detail.checkLogin()){
                return;
            }
            /* 당첨이력조회 */
            monthEvent.detail.getMyWinList();
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

        $("#btn1,#btn2,#btn3,#btn4,#btn5,#btn6").click(function(){
            if(!$("#check_before").hasClass("off")){
                alert("내 풍선 개수를 먼저 확인해주세요");
            }else{
                javascript:monthEvent.detail.checkApply($(this).prop("id").replace("btn",""));
            }
        });

        //상단 고정 scrollFixTab
        var _scrollFixTab = $('.scrollFixTab'),
            _img_h = $('.scrollFixTab').find('.tab_img').height();
        _scrollFixTab.css('height', _img_h);
        $(window).on('scroll', function(){
            var _scrollFixTab = $('.scrollFixTab'),
                _tabTop = _scrollFixTab.offset().top;
                _innerPos = _scrollFixTab.children('.innerPos'),
                _scrollTop = $(document).scrollTop();

            if(_scrollTop>=_tabTop){
                _innerPos.addClass('on');
            }
            if(_scrollTop<_tabTop){
                _innerPos.removeClass('on');
            }
        });
    },

    getGoodsAppraisalPossibleCount : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }else{

            var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
            }

            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20191001_1/getGoodsAppraisalPossibleCount.do"
                  , param
                  , monthEvent.detail._callback_getGoodsAppraisalPossibleCount
            );
        }
    },

    _callback_getGoodsAppraisalPossibleCount : function(json){
        if(json.ret == "0"){
            $("#box_before").removeClass("on");
            $("#box_before").addClass("off");
            $("#box_after").removeClass("off");
            $("#box_after").addClass("on");
            $("#recommCnt").html(json.recommCnt);

            if(json.recommCnt > 0){
                $("#goReview").removeClass("off");
                $("#goReview").addClass("on");
                $("#goToday").removeClass("on");
                $("#goToday").addClass("off");
            }else{
                $("#goReview").removeClass("on");
                $("#goReview").addClass("off");
                $("#goToday").removeClass("off");
                $("#goToday").addClass("on");
            }
        }else{
            alert(json.message);
        }
    },

    getBalloonTotal : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }else{
            var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
            }

            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20191001_1/getBalloonTotal.do"
                  , param
                  , monthEvent.detail._callback_getBalloonTotal
            );
        }
    },

    _callback_getBalloonTotal : function(json){
        if(json.ret == "0"){
            $("#check_before").removeClass("on");
            $("#check_before").addClass("off");
            $("#check_after").removeClass("off");
            $("#check_after").addClass("on");
            $("#sTotal").html(json.totalCnt);
            $("#sApply").html(json.applyCnt);
            $("#sSPossible").html(json.possibleCnt);
            $("#sReceive").html(json.receiveCnt);
            $("#sGive").html(json.giveCnt);
            $("#sSum").html(json.sum);
            $("#sPhoto").html(json.photoCnt);
            $("#sCont").html(json.contCnt);
            $("#sFirst").html(json.firstCnt);
        }else{
            alert(json.message);
        }
    },

    checkApply : function(fvrSeq){
        if(!mevent.detail.checkLogin()){
            return;
        }

        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
                , fvrSeq : fvrSeq
        }
        common.Ajax.sendRequest(
                "GET"
              , _baseUrl + "event/20191001_1/checkApply.do"
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
              , fvrSeq : fvrSeq
              , mbrInfoUseAgrYn : mbrInfoUseAgrYn
              , mbrInfoThprSupAgrYn :mbrInfoThprSupAgrYn
        };
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20191001_1/apply.do"
              , param
              , monthEvent.detail._callback_apply
        );
    },

    _callback_apply : function(json){
        if(json.ret == "0"){
            $(':radio[name="argee1"]:checked').attr("checked", false);
            $(':radio[name="argee2"]:checked').attr("checked", false);
            if(json.winYn=="Y"){
                mevent.detail.eventShowLayer('evtGift'+json.fvrSeq);
                $(".win_number").text("("+json.tgtrSeq+")");
            }else {
                // 실패
                mevent.detail.eventShowLayer('evtGiftFail');
            }
            monthEvent.detail.getBalloonTotal();
        }else{
            alert(json.message);
        }
    },

    /** 나의 당첨내역 */
    getMyWinList : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
        }
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/getMyEvtWinList.do"
              , param
              , monthEvent.detail._callback_getMyWinListJson
        );

    },

    _callback_getMyWinListJson : function(json){
        if(json.ret == "0"){
            //당첨 내역 확인
            var myWinListHtml = "";
            if(json.myEvtWinList.length <= 0){
                myWinListHtml = "<tr><td colspan='3' class='no'>응모 내역이<br/> 없습니다.</td></tr>";
            }else{
                for(var i=0 ; i<json.myEvtWinList.length ; i++){
                     myWinListHtml += "<tr><td>" + json.myEvtWinList[i].strSbscSgtDtime + "</td><td>" + json.myEvtWinList[i].evtGoodsNm + "</td><td>" + json.myEvtWinList[i].evtTgtrSctNm + "</td></tr>";
                }

            }
            $("tbody#myWinListHtml").html(myWinListHtml);

            mevent.detail.eventShowLayer('winCheck');

        }else{
            alert(json.message);
        }
    },
}