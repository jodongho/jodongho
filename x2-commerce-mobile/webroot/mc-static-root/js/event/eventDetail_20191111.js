$.namespace("monthEvent.detail");
monthEvent.detail = {
    layerPolice : false,

    init : function(){

        //로그인시 미션성공여부 경품 응모여부 조회
        if(common.isLogin()){
            monthEvent.detail.getTopReviewerInfo();
        }

        //나의 순위 조회하기
        $(".myRanking").click(function(){
            if(!($(this).hasClass("on") || $(this).hasClass("reviewOn"))){
                monthEvent.detail.getTopReviewerRank();
            }
        });

        //응모하기
        $(".btnGift").click(function(){
            if($(this).hasClass("apply")){
                monthEvent.detail.checkApply('2');
            }
        });

        //프로필 작성방법
        $(".mission01").click(function(){
            mevent.detail.eventShowLayScroll('missionInfo');
        });

        //리뷰쓰러가기
        $(".mission02, .mission03").click(function(){
            common.link.commonMoveUrl('mypage/getGdasList.do');
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
    },

    //나의 순위 확인하기
    getTopReviewerRank : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }else{
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
            }
            common.Ajax.sendRequest(
                    "GET"
                  , _baseUrl + "event/20191111/getTopReviewerRank.do"
                  , param
                  , monthEvent.detail._callback_getTopReviewerRank
            );
        }
    },

    _callback_getTopReviewerRank : function(json){
        if(json.ret == "0"){
            if(json.topRank == 0){
                $(".myRanking").removeClass("on");
                $(".myRanking").addClass("reviewOn");
            }else{
                $(".myRanking").removeClass("reviewOn");
                $(".emRank").html(json.topRank);
                $(".myRanking").addClass("on");
            }
        }else{
            alert(json.message);
        }
    },

    //미션성공여부, 경품 응모여부 조회
    getTopReviewerInfo : function(){
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
                ,fvrSeq : "2"
        }
        common.Ajax.sendRequest(
                "GET"
              , _baseUrl + "event/20191111/getTopReviewerInfo.do"
              , param
              , monthEvent.detail._callback_getTopReviewerInfo
        );
    },

    _callback_getTopReviewerInfo : function(json){
        if(json.ret == "0"){
            console.log("json==="+json);
            //프로필 등록
            if(json.profileYn == "Y"){
                $(".mission01").addClass("on");
            }
            //상세리뷰쓰기
            if(json.contYn == "Y"){
                $(".mission02").addClass("on");
            }
            //포토리뷰쓰기
            if(json.photoYn == "Y"){
                $(".mission03").addClass("on");
            }
            //도움이돼요 받기
            if(json.receiveYn == "Y"){
                $(".mission04").addClass("on");
            }

            if(json.appCnt == 0){
                if(json.missionYn == "Y"){
                    $(".btnGift").addClass("apply");
                }
            }else{
                $(".btnGift").addClass("end");
            }
        }else{
            alert(json.message);
        }
    },

    checkApply : function(fvrSeq){
        if(!mevent.detail.checkLogin()){
            return;
        }else{
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                    ,fvrSeq : fvrSeq
            }
            common.Ajax.sendRequest(
                    "GET"
                  , _baseUrl + "event/20191111/checkApply.do"
                  , param
                  , function(json){
                      $(':radio[name="argee1"]:checked').attr("checked", false);
                      $(':radio[name="argee2"]:checked').attr("checked", false);
                      if(json.ret == "0"){
                          if( json.myTotalCnt  == 0 ) {
                              $("div#Confirmlayer1").attr("onclick", "monthEvent.detail.apply('" + fvrSeq + "' ,  '" + json.myTotalCnt + "'  ); "  );
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
        }else{
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
                  , _baseUrl + "event/20191111/apply.do"
                  , param
                  , monthEvent.detail._callback_apply
            );
        }
    },

    _callback_apply : function(json){
        if(json.ret == "0"){
            $(':radio[name="argee1"]:checked').attr("checked", false);
            $(':radio[name="argee2"]:checked').attr("checked", false);
            if(json.fvrSeq == "1"){
                alert("활발한 리뷰 활동 감사드려요.  리뷰어 프로필 등록 후, 12월 9일 당첨자 게시판을 확인해주세요.");
            }else{
                $(".btnGift").removeClass("apply");
                $(".btnGift").addClass("end");
                setTimeout(function(){
                    alert("응모 완료되었습니다. 12월 9일 당첨자 게시판을 확인해주세요");
                }, 500);
            }
        }else{
            alert(json.message);
        }
    }
}