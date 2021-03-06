$.namespace("monthEvent.detail");
monthEvent.detail = {
    _ajax : common.Ajax,
    snsInitYn : "N",
    friendTotCnt : "",
    friendBuyCnt : "",
    firstYn : "",

    init : function(){        
        if($("input[id='reCommend']:hidden").val() != ""){
            if(!mevent.detail.checkLogin()){
                return;
            }
            monthEvent.detail.addKaKaoTalkFriend();
        };
        
        /* 레이어 닫기 */
        $(".eventHideLayer").click(function(){
            monthEvent.detail.eventCloseLayer();
        });
        
        /* 카카오 친구 추천수 */
        monthEvent.detail.myCntChkJson();
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
              , _baseUrl + "event/20180514_3/addKaKaoFriendJosn.do"
              , param
              , monthEvent.detail._callback_addKaKaoFriendJosn
        );
    },
    _callback_addKaKaoFriendJosn : function(json){
//      console.log(json);
    },
    
    /* 공유하기 */
    shareSns : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }

        var evtNo = $("input[id='evtNo']:hidden").val();
        var reCommend = encodeURIComponent($("input[id='targetNum']:hidden").val());
        var imgUrl = "http:" + _cdnImgUrl + "contents/201805/14big5/big5_kakao_img.jpg";
//        var imgUrl = "";
        var title = "5가지 통-큰 혜택 쏜다!\n통-큰 혜택 같이 받자!";

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
    
    /* 방문한 카카오 친구수 */
    myCntChkJson : function(){
        if(common.isLogin()){
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180514_3/myCntChkJson.do"
                  , {
                          evtNo : $("input[id='evtNo']:hidden").val()
                        , fvrSeq : "1"
                    }
                  , monthEvent.detail._callback_myCntChkJson
            );
        }else{
            //초대한 친구 수
            $("#friendTotCnt").text("0");
            
            //구매한 친구 수
            $("#friendBuyCnt").text("0");
        }
    },
    _callback_myCntChkJson : function(json){
        if(json.ret == "0"){
            //초대한 친구 수 회전목마 이미지
            $("#friendsOn").attr("src", _cdnImgUrl+"contents/201805/14big5/big5_mc_tab3_point0"+json.friendTotCnt+".png");
            
            //방문한 친구 수
            monthEvent.detail.friendTotCnt = json.friendTotCnt.toString();
            $("#friendTotCnt").text(json.friendTotCnt);
            
            //구매한 친구 수
            $("#friendBuyCnt").text(json.friendBuyCnt);
            
        }else{
            alert(json.message);
        }
    },    
    
    // 레이어 숨김
    eventCloseLayer : function(){
        $(".eventLayer").hide();
        $("#eventDimLayer").hide();
        $("#eventDimLayer1").hide();
    },
    
};