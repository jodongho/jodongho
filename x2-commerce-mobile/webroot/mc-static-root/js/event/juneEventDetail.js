$.namespace("monthEvent.detail");
monthEvent.detail = {
    _ajax : common.Ajax,
    snsInitYn : "N",

    init : function(){
        if($("input[id='reCommend']:hidden").val() != ""){
            if(!mevent.detail.checkLogin()){
                return;
            }

            monthEvent.detail.addKaKaoTalkFriend();
        };
        // 닫기
        $(".eventHideLayer").click(function(){
            monthEvent.detail.eventCloseLayer();
        });
        /* 카카오 친구 추천수 */
        monthEvent.detail.myFriendCntJson();
    },
    // 레이어 노출
    eventShowLayer : function(obj) {
        var layObj = document.getElementById(obj);
        var layDim = document.getElementById('eventDimLayer');
        layDim.style.display = 'block';
        layObj.style.display = 'block';
        var layObjHeight = layObj.clientHeight  / 2;
        layObj.style.marginTop = "-" + layObjHeight +"px";
    },
    // 레이어 숨김
    eventCloseLayer : function(){
        $(".eventLayer").hide();
        $("#eventDimLayer").hide();
    },
    // 재구매 혜택 참여가능 여부 체크
    checkReOrderBenefitsJson : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }

        if(!mevent.detail.checkRegAvailable()){
            return;
        }

        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
              , fvrSeq : "2"
        };

        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/checkReOrderBenefitsJson.do"
              , param
              , monthEvent.detail._callback_checkReOrderBenefits
        );
    },
    _callback_checkReOrderBenefits : function(json){
        if(json.ret == "0"){
            $("input[id='fvrSeq']:hidden").val(json.fvrSeq);
            monthEvent.detail.popLayerAgrInfo();
        }else{
            alert(json.message);
        }
    },
    /* 개인정보 위탁동의 팝업 */
    popLayerAgrInfo : function(){
        if("" == $("input[id='evtNo']:hidden").val()){
            alert("이벤트 번호가 존재하지 않습니다.");
            return;
        }
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
              , isTermsPopupYn : "N"
              , isType : "10"
              , agrPopupFunction : "monthEvent.detail.eventShowLayer('eventLayerPolice2');"
              , closeFunction : "monthEvent.detail.eventCloseLayer();"
              , confirmFunction : "monthEvent.detail.insertLayerAgrInfoAjax();"
        };
        monthEvent.detail.getLayerPopAgrInfoAjax(param);
    },
    /* 개인정보 수신동의 레이어 */
    getLayerPopAgrInfoAjax : function(param){
        if(param.evtNo == ""){
            alert("이벤트 번호를 확인해주세요.");           return;
        }
        if(param.agrPopupFunction == ""){
            alert("약관 오픈 평션명을 확인해주세요.");        return;
        }
        if(param.closeFunction == ""){
            alert("닫기 평션명을 확인해주세요.");           return;
        }
        if(param.confirmFunction == ""){
            alert("확인 평션명을 확인해주세요.");           return;
        }

        $.ajax({
                type : "POST"
              , dataType : "html"
              , url : _baseUrl + "event/openLayerPopAgrInfoAjax.do"
              , data : param
              , success : this._callback_openLayerPopAgrInfoAjax
        });
    },
    _callback_openLayerPopAgrInfoAjax : function(html){
        $("#eventLayerPolice2").html(html);
    },
    /* 개인정보 위탕 동의 정보 저장 */
    insertLayerAgrInfoAjax : function(){
        if(monthEvent.detail.checkAgrmInfo()){
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                  , fvrSeq : $("input[id='fvrSeq']:hidden").val()
                  , mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn']:hidden").val()
                  , mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn']:hidden").val()
            };

            monthEvent.detail.eventCloseLayer();

            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/insertReOrderBenefitsJosn.do"
                  , param
                  , monthEvent.detail._callback_insertLayerAgrInfoAjax
            );
        }
    },
    _callback_insertLayerAgrInfoAjax : function(json){
        console.log(json);
        if(json.ret == "0"){
            alert("응모되었습니다.");
        }else{
            alert(json.message);
        }
    },
    /* 개인정보 필수값 체크 */
    checkAgrmInfo : function(){
        var agreeVal1 = $(':radio[name="argee1"]:checked').val();
        var agreeVal2 = $(':radio[name="argee2"]:checked').val();

        if("Y" != agreeVal1){
            alert("개인정보 수집 이용 동의를 하셔야 이벤트 참여가 가능합니다.");
            return false;
        } else {
            $("#mbrInfoUseAgrYn").val("Y");
        }

        if("Y" != agreeVal2){
            alert("개인정보 처리 위탁 동의를 하셔야 이벤트 참여가 가능합니다.");
            return false;
        } else {
            $("#mbrInfoThprSupAgrYn").val("Y");
        }

        return true;
    },
    /* 카카오친구 접속 */
    addKaKaoTalkFriend : function(){
        var param = {
                reCommend : decodeURIComponent($("input[id='reCommend']:hidden").val())
              , evtNo : $("input[id='evtNo']:hidden").val()
              , fvrSeq : "1"
        };

        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/addKaKaoTalkFriendJosn.do"
              , param
              , monthEvent.detail._callback_addKaKaoTalkFriendJosn
        );
    },
    _callback_addKaKaoTalkFriendJosn : function(json){
//      console.log(json);
    },
    /* 공유하기 */
    sharingSnsUrl : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }

        var evtNo = $("input[id='evtNo']:hidden").val();
        var reCommend = encodeURIComponent($("input[id='targetNum']:hidden").val());
        var imgUrl = "http:" + _cdnImgUrl + "contents/201706/june1st/june1st_kakao.jpg";
        var title = "핫-한 할인, 쿨-한 혜택 빵빵하게 쏜다!";

        // 배너 이미지 체크
        var bnrImgUrlAddr = $("#bnrImgUrlAddr").val();
        if(bnrImgUrlAddr == undefined || bnrImgUrlAddr == null || bnrImgUrlAddr == ""){
            bnrImgUrlAddr = "";
        } else {
            bnrImgUrlAddr = _fileUploadUrl + bnrImgUrlAddr;
        }

        // 이미지가 없을 경우만 배너로 교체
        if(imgUrl == undefined || imgUrl == null || imgUrl == ""){
            imgUrl = bnrImgUrlAddr;
        }

        var snsShareUrl = _baseUrl + "KE.do?evtNo=" + evtNo + "&reCommend=" + reCommend;

        /* sns common init 시키기 위해서 한번만 실행 */
        if(monthEvent.detail.snsInitYn == "N"){
            common.sns.init(imgUrl, title, snsShareUrl);
            monthEvent.detail.snsInitYn = "Y";
        }

        common.sns.doShare("kakaotalk");
    },
    /* 카카오 친구 추천수 */
    myFriendCntJson : function(){
        if(common.isLogin()){
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/myFriendCntJson.do"
                  , {
                          evtNo : $("input[id='evtNo']:hidden").val()
                        , fvrSeq : "1"
                    }
                  , monthEvent.detail._callback_myFriendCntJson
            );
        }
    },
    _callback_myFriendCntJson : function(json){
        if(json.ret == "0"){
            $("#kakaoPan").find("li").each(function(index){
                if(index < json.friendCnt){
                    $(this).attr("class", "on");
                }
            });
        }else{
            alert(json.message);
        }
    },
    /* 개인정보 수집동의 팝업 */
    popOpenMbrInfoUseAgrYn : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }

        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
              , fvrSeq : "1"
        };
        this._ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/getEvtMbrInfoUseAgrYnCntJson.do"
              , param
              , this._callbock_popOpenMbrInfoUseAgrYn
        );
    },
    _callbock_popOpenMbrInfoUseAgrYn : function(json){
        if(json.ret == "0"){
            if(json.reutnrCnt > 0){
                alert("이미 개인 정보 수집에 동의 되었습니다.");
            }else{
                monthEvent.detail.eventShowLayer('eventLayerPolice');
            }
        }else{
            alert(json.message);
        }
    },
    /* 카톡 친구소환 개인정보 수집동의 */
    okSubmit : function(){
        if($(":radio[name='mbrInfoUseAgrYn']:checked").val() != "Y"){
            alert("개인정보 수집 이용 동의를 하셔야 이벤트 참여가 가능합니다.");
            return;
        }
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
              , fvrSeq : "1"
              , mbrInfoUseAgrYn : $(":radio[name='mbrInfoUseAgrYn']:checked").val()
        };
        this._ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/addMbrInfoUseAgrYnEventJson.do"
              , param
              , this._callback_addMbrInfoUseAgrYnEventJson
        );
    },
    _callback_addMbrInfoUseAgrYnEventJson : function(json){
        monthEvent.detail.eventCloseLayer();
        if(json.ret == "0"){
            alert(json.message);
        }
    }
};