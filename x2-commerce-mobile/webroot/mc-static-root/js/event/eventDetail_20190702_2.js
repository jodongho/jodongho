/**
 * 배포일자 : 2019.06.27
 * 오픈일자 : 2019.07.02
 * 이벤트명 : 7월 멤버십
 */
$.namespace("monthEvent.detail");
monthEvent.detail = {
    snsInitYn : "N",
    layerPolice : false,

    init : function(){
        if($("input[id='reCommend']:hidden").val() != ""){
            //카카오 친구 접속
            monthEvent.detail.addKaKaoTalkFriend();
        }else{
            //카카오 친구 트리 셋팅
            monthEvent.detail.friendTreeJson();
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

    },

    /* 카카오 친구 접속 */
    addKaKaoTalkFriend : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }

        var param = {
                reCommend : decodeURIComponent($("input[id='reCommend']:hidden").val())
              , evtNo : $("input[id='evtNo']:hidden").val()
        };
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20190702_2/addKaKaoFriendJosn.do"
              , param
              , monthEvent.detail._callback_addKaKaoFriendJosn
        );
    },
    _callback_addKaKaoFriendJosn : function(json){
        monthEvent.detail.friendTreeJson();

        if(json.ret.indexOf('non') == -1){
            alert(json.message);
        }
    },

    /* 카카오 친구 트리 셋팅 */
    friendTreeJson : function(){
        if(!common.isLogin()){
            return;
        }
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
        }
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20190702_2/friendTreeJson.do"
              , param
              , monthEvent.detail._callback_friendTreeJson
        );
    },
    _callback_friendTreeJson : function(json){
        if(json.ret == "0"){
            $.each(json.friendsList, function(idx, obj){
                $('.member_tree li:eq('+ idx +')').addClass('on ' + obj.mbrGradeNm.toLowerCase()).children('em').text(obj.mbrNm);
            });
        }else{
            alert(json.message);
        }
    },

    /* 공유하기 */
    shareSns : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }
        if($('.member_tree li[class^=on]').length > 4){
            alert('이미 5명의 친구를 모았습니다. 하단 경품 응모하기를 클릭해주세요.');
            return;
        }

        var evtNo = $("input[id='evtNo']:hidden").val();
        var reCommend = encodeURIComponent($("input[id='targetNum']:hidden").val());
        var imgUrl = "http:" + _cdnImgUrl + "contents/201907/02member/kakao_member.jpg";
//        var imgUrl = "";
        var title = "올리브영 온라인몰 모여라 올리브! 5명이 모이면 100% 선물!🎁";

        // 배너 이미지 체크
        var bnrImgUrlAddr = $("#bnrImgUrlAddr").val();
        if(bnrImgUrlAddr == undefined || bnrImgUrlAddr == null || bnrImgUrlAddr == ""){
            bnrImgUrlAddr = "";
        } else if($.trim(bnrImgUrlAddr).indexOf(_fileUploadUrl) == -1){
            bnrImgUrlAddr = _fileUploadUrl + bnrImgUrlAddr;
        }

        // 이미지가 없을 경우만 배너로 교체
        if(imgUrl == undefined || imgUrl == null || imgUrl == ""){
            imgUrl = bnrImgUrlAddr;
        }

        var snsShareUrl = _baseUrl + "KE.do?evtNo=" + evtNo + "&reCommend=" + reCommend;

        /* sns common init 시키기 위해서 한번만 실행 */
        if(monthEvent.detail.snsInitYn == "N"){
            common.sns.initKakaoEvt(imgUrl, title, snsShareUrl);
            monthEvent.detail.snsInitYn = "Y";
        }

        common.sns.doShareKakaoEvt("kakaotalk");
    },

    /* 경품 응모 */
    goodsEntryJson : function() {
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 응모 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else if(!mevent.detail.checkLogin()){
            return;
        }else{
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                    , MbrInfoUseAgrYn : $(':radio[name="argee1"]:checked').val()
                    , MbrInfoThprSupAgrYn : $(':radio[name="argee2"]:checked').val()
            }
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20190702_2/goodsEntryJson.do"
                  , param
                  , monthEvent.detail._callback_goodsEntryJson
            );
        }
    },
    _callback_goodsEntryJson : function(json) {
        if(json.ret == '0'){
            $('#eventLayerWinner'+json.fvrSeq+' .win_number').text('('+ json.tgtrSeq +')');
            mevent.detail.eventShowLayer('eventLayerWinner'+json.fvrSeq);
        }else if(json.ret == "016" || json.ret == "017"){
            //위수탁 동의 팝업
            $(':radio[name="argee1"]:input[value="N"]').attr("checked", true);
            $(':radio[name="argee2"]:input[value="N"]').attr("checked", true);
            mevent.detail.eventShowLayer('eventLayerPolice');
            $(".agreeCont")[0].scrollTop = 0;
            monthEvent.detail.layerPolice = true;
        }else{
            alert(json.message);
        }
    },

    /* 위수탁 동의 팝업 */
    popLayerConfirm : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 응모 가능합니다.")){
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
                monthEvent.detail.goodsEntryJson();
            }
        }
    },

    /* 나의 당첨내역 */
    getMyWinList : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
        }
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20190702_2/getMyWinListJson.do"
              , param
              , monthEvent.detail._callback_getMyWinListJson
        );
    },
    _callback_getMyWinListJson : function(json){
        if(json.ret == "0"){
            var myWinListHtml = "";

            if(json.myEvtWinList.length <= 0){
                myWinListHtml = "<tr><td colspan='2' class='no'>응모 이력이<br/> 없습니다.</td></tr>";
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

};