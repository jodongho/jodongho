/**
 * 이벤트명 : 고객선정오특
 */

$.namespace("monthEvent.detail");
monthEvent.detail = {
    layerPolice : false,
    init : function(){
        $(':radio[name="voteProudct"]').click(function(){
            if(!$(".btn_vote").hasClass("on") && !$(".btn_vote").hasClass("end")){
                $(".btn_vote").addClass("on");
            }
        });

        monthEvent.detail.getHotdealVoteList();
        if(common.isLogin()){
            monthEvent.detail.getApplyYn();
        }else{
            $(".btn_vote").removeClass("on end");
        }

        $(".btn_vote").click(function(){
            if($(".btn_vote").hasClass("on")){
                monthEvent.detail.checkVote();
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

        /* 유의사항 닫기 */
        $(".eventHideLayer1").click(function(){
            monthEvent.detail.eventCloseLayer1();
        });
    },

    getApplyYn : function(fvrSeq){
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
        }
        common.Ajax.sendRequest(
                "GET"
              , _baseUrl + "event/vote/getApplyYn.do"
              , param
              , monthEvent.detail._callback_getApplyYn
        );
    },

    _callback_getApplyYn : function(json){
        if(json.ret == "0"){
            if(json.applyYn == "N"){
                if($(':radio[name="voteProudct"]:checked').val() == null){
                    $(".btn_vote").removeClass("on end");
                }else{
                    $(".btn_vote").addClass("on");
                }
            }else{
                $(".btn_vote").removeClass("on");
                $(".btn_vote").addClass("end");
            }
        }else{
            alert(json.message);
        }
    },

    // 기프트카드 신청여부
    checkVote : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }

        if($(':radio[name="voteProudct"]:checked').val() == null){
            alert("고객님의 최애 PICK을 골라주세요.");
            return;
        }

        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
        }
        common.Ajax.sendRequest(
                "GET"
              , _baseUrl + "event/vote/checkVote.do"
              , param
              , monthEvent.detail._callback_checkVote
        );
    },

    _callback_checkVote : function(json){
        if(json.ret == "0"){
            if(json.myTotalCnt == 0){
                $("div#Confirmlayer").attr("onClick", "javascript:monthEvent.detail.voteApply('eventLayerPolice')");
                mevent.detail.eventShowLayer('eventLayerPolice'); //위수탁 팝업 호출
                monthEvent.detail.layerPolice = true;
                $(".agreeCont")[0].scrollTop = 0;
            }
        }else{
            alert(json.message);
        }
    },

    // 기프트카드 신청여부
    getHotdealVoteList : function(){
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
        }
        common.Ajax.sendRequest(
                "GET"
              , _baseUrl + "event/vote/getHotdealVoteList.do"
              , param
              , monthEvent.detail._callback_getHotdealVoteList
        );
    },

    _callback_getHotdealVoteList : function(json){
        if(json.ret == "0"){
            $.each(json.voteList, function(idx, obj){
                var html = '';
                html += '<div class="progressbar">';
                html += '<span style="width:'+obj.rate+'%;">'+obj.rate+'%</span>';
                html += '</div>';
                html += '<span class="total">(<em>'+monthEvent.detail.toCurrency(obj.fvrCnt)+'</em>명)</span>';

                $("#progress"+obj.fvrSeq).html(html);
            });
        }else{
            alert(json.message);
        }
    },

    voteApply : function(){
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
              , fvrSeq : $(':radio[name="voteProudct"]:checked').val()
              , mbrInfoUseAgrYn : mbrInfoUseAgrYn
              , mbrInfoThprSupAgrYn :mbrInfoThprSupAgrYn
        };
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/vote/voteApply.do"
              , param
              , monthEvent.detail._callback_voteApply
        );
    },

    _callback_voteApply : function(json){
        if(json.ret == "0"){
            $(':radio[name="voteProudct"]').attr("checked", false);
            mevent.detail.eventShowLayer('evtVote');    //투표완료레이어
            monthEvent.detail.getHotdealVoteList();
            monthEvent.detail.getApplyYn();
        }else{
            alert(json.message);
        }
    },

    toCurrency : function(amount){
        amount = String(amount);
        var data = amount.split('.');
        var sign = "";
        var firstChar = data[0].substr(0,1);

        if(firstChar == "-"){
            sign = firstChar;
            data[0] = data[0].substring(1, data[0].length);
        }

        data[0] = data[0].replace(/\D/g,"");
        if(data.length > 1){
            data[1] = data[1].replace(/\D/g,"");
        }

        firstChar = data[0].substr(0,1);

        //0으로 시작하는 숫자들 처리
        if(firstChar == "0"){
            if(data.length == 1){
                return sign + parseFloat(data[0]);
            }
        }

        var comma = new RegExp('([0-9])([0-9][0-9][0-9][,.])');

        data[0] += '.';
        do {
            data[0] = data[0].replace(comma, '$1,$2');
        } while (comma.test(data[0]));

        if (data.length > 1) {
            return sign + data.join('');
        } else {
            return sign + data[0].split('.')[0];
        }
    }
};