/**
 * 배포일자 : 2019-06-27
 * 오픈일자 : 2019-07-02
 * 이벤트명 : 7월멤버십 이벤트
 */

$.namespace("monthEvent.detail");
monthEvent.detail = {
    staffYn : "N",
    layerPolice : false,

    init : function(){
        if(common.isLogin()){
            monthEvent.detail.getApplyYn();
        }else{
            $(".gift_apply > img:eq(0)").addClass("on");
        }

        $(".gift_apply").click(function(){
            if(!mevent.detail.checkLogin()){
                return;
            }

            if($(".gift_apply > img:eq(0)").hasClass("on")){
                if(monthEvent.detail.staffYn == "N"){
                    mevent.detail.eventShowLayer('eventLayerPolice');
                    monthEvent.detail.layerPolice = true;
                    $(".agreeCont")[0].scrollTop = 0;
                }else{
                    alert("임직원 참여 불가합니다.");
                }
            }
        });

        /* 유의사항 닫기 */
        $(".eventHideLayer1").click(function(){
            monthEvent.detail.eventCloseLayer1();
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

    // 기프트카드 신청여부
    getApplyYn : function(){
        $(".gift_apply > img").removeClass("on");
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
                ,fvrSeq : "1"
        }
        common.Ajax.sendRequest(
                "GET"
              , _baseUrl + "event/20190702_1/getApplyYn.do"
              , param
              , monthEvent.detail._callback_getApplyYn
        );
    },

    _callback_getApplyYn : function(json){
        if(json.ret == "0"){
            if(json.appCnt > 0){
                $(".gift_apply > img:eq(1)").addClass("on");
            }else{
                $(".gift_apply > img:eq(0)").addClass("on");
            }
            monthEvent.detail.staffYn = json.staffYn;
        }else{
            alert(json.message);
        }
    },

    apply : function(){
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
              , fvrSeq : "1"
              , mbrInfoUseAgrYn : mbrInfoUseAgrYn
              , mbrInfoThprSupAgrYn :mbrInfoThprSupAgrYn
        };
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20190702_1/apply.do"
              , param
              , monthEvent.detail._callback_apply
        );
    },

    _callback_apply : function(json){
        if(json.ret == "0"){
            $(':radio[name="argee1"]:checked').attr("checked", false);
            $(':radio[name="argee2"]:checked').attr("checked", false);

            monthEvent.detail.getApplyYn();
        }else{
            alert(json.message);
        }
    },

    /* 앱 푸시 설정 바로가기 */
    goSetting : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서 설정가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }
        }else{
            common.app.callSettings();
        }
    },

    // 위수탁 레이어 숨김
    eventCloseLayer1 : function(){
        $(".eventLayer").hide();
        $("#eventDimLayer").hide();
        location.reload();//새로고침
    }
};