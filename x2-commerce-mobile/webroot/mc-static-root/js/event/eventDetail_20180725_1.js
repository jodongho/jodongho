$.namespace("monthEvent.detail");
monthEvent.detail = {
        
    clickCnt : 0,

    init : function(){
        
        if(common.isLogin()){       //로그인 되어 있으면 참여여부 확인
            monthEvent.detail.getApplyChk();     //참여이력 있으면 선택한 카테고리 고정
        };
        
        $("input[name='chkList']").each(function(i) {
            $(".cate"+(i+1)).click(function(){
                if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
                    if(confirm("모바일 앱에서만 참여 가능합니다.")){
                        $("#chkList"+(i+1)).attr('checked', false);
                        common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
                    }else{
                        $("#chkList"+(i+1)).attr('checked', false);
                        return;
                    }
                }else{
                    if(!mevent.detail.checkLogin()){
                        $("#chkList"+(i+1)).attr('checked', false);
                        return;
                    }else{
                        var chkLen = $(":checkbox[name='chkList']:checked").length;
                        if(chkLen > 3){
                            alert("3가지만 선택 가능합니다.");
                            $("#chkList"+(i+1)).attr('checked', false);
                        }
                    }
                    
                }
            });
        });

        /* 닫기  */
        $(".eventHideLayer").click(function(){
            monthEvent.detail.eventCloseLayer();
        });
        
    },
    
    getApplyChk : function(){     //참여이력 있으면 선택한 카테고리 고정
        if(!mevent.detail.checkRegAvailable()){
            return;
        }
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
        }
        
        common.Ajax.sendRequest(
                "GET"
                , _baseUrl + "event/20180725_1/applyChkJson.do"
                , param
                , this._callback_applyChkJson
         );
    },
    _callback_applyChkJson : function(json) {
        if(json.ret == '-1'){
            if(json.myEvtApplyList.length > 0){
                for(var i=0 ; i<json.myEvtApplyList.length ; i++){
                    $("#chkList"+json.myEvtApplyList[i].fvrSeq).attr('checked', true);
                }
            }
            
            $("input[name='chkList']").attr('disabled', true);
        }
    },
    
    getApplyChk2 : function(){     //참여이력 있을때 확정하기 누르면 안내 알럿 노출
        if(!mevent.detail.checkRegAvailable()){
            return;
        }
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
        }
        
        common.Ajax.sendRequest(
                "GET"
                , _baseUrl + "event/20180725_1/applyChkJson.do"
                , param
                , this._callback_applyChkJson2
         );
    },
    _callback_applyChkJson2 : function(json) {
        if(json.ret == '-1'){
            alert("이미 확정 하셨습니다.");      //참여 이력 있는데 확정하기 누를 경우 안내 알럿
        }else{
            monthEvent.detail.goCateApply();        //참여 이력 없으면 확정하기 진행
        }
    },
    
    goConfirm : function(){        
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
                monthEvent.detail.getApplyChk2();       //참여 여부 확인
            }
        }
    },
    
    //카테고리 확정하기
    goCateApply : function(){        
        var chkLen = $(":checkbox[name='chkList']:checked").length;
        if(chkLen < 3){
            alert("3가지 카테고리 선택 후 확정해 주세요.");
            return;
        }
        
        $("input[name='chkList']:checked").each(function(i, elements) {
            var cpnNo = "";
            var cpnDownCnt = i+1;
            var fvrSeq = "";
            index = $(elements).index("input:checkbox[name='chkList']");
            
            if($("#profile").val() == "dev"){
                if(index == 0){
                    cpnNo = "g0CzCBI3VCam8k+BrM4BZw==";
                    fvrSeq = "1";
                }else if(index == 1){
                    cpnNo = "g0CzCBI3VCbx8CF8bC1ITw==";
                    fvrSeq = "2";
                }else if(index == 2){
                    cpnNo = "g0CzCBI3VCZRvY7Osq+yww==";
                    fvrSeq = "3";
                }else if(index == 3){
                    cpnNo = "g0CzCBI3VCYOzijQCUFtew==";
                    fvrSeq = "4";
                }else if(index == 4){
                    cpnNo = "g0CzCBI3VCYdEanuQBWjgw==";
                    fvrSeq = "5";
                }else if(index == 5){
                    cpnNo = "g0CzCBI3VCaLl5sgrVCORg==";
                    fvrSeq = "6";
                }else if(index == 6){
                    cpnNo = "g0CzCBI3VCaLO0QRoqllLQ==";
                    fvrSeq = "7";
                }else if(index == 7){
                    cpnNo = "g0CzCBI3VCaDoRMcsoGV3A==";
                    fvrSeq = "8";
                }else if(index == 8){
                    cpnNo = "g0CzCBI3VCbB60wcYUx/iw==";
                    fvrSeq = "9";
                }
            }else if($("#profile").val() == "qa"){
                if(index == 0){
                    cpnNo = "g0CzCBI3VCZlf0E8qOAY/g==";
                    fvrSeq = "1";
                }else if(index == 1){
                    cpnNo = "g0CzCBI3VCaXXVgoE5BmXg==";
                    fvrSeq = "2";
                }else if(index == 2){
                    cpnNo = "g0CzCBI3VCYbiP8DrjTvbA==";
                    fvrSeq = "3";
                }else if(index == 3){
                    cpnNo = "g0CzCBI3VCad/7+E77qGuA==";
                    fvrSeq = "4";
                }else if(index == 4){
                    cpnNo = "g0CzCBI3VCbSiAuGOOsiEg==";
                    fvrSeq = "5";
                }else if(index == 5){
                    cpnNo = "g0CzCBI3VCaDH4ac1U3U7g==";
                    fvrSeq = "6";
                }else if(index == 6){
                    cpnNo = "g0CzCBI3VCZpUj3edDYCoA==";
                    fvrSeq = "7";
                }else if(index == 7){
                    cpnNo = "g0CzCBI3VCbyDiiIQkO3rw==";
                    fvrSeq = "8";
                }else if(index == 8){
                    cpnNo = "g0CzCBI3VCZ+ZO3iuI3b0A==";
                    fvrSeq = "9";
                }
            }else if($("#profile").val() == "prod"){
                if(index == 0){
                    cpnNo = "g0CzCBI3VCYl2QOEg/qP9Q==";     //마스크팩
                    fvrSeq = "1";
                }else if(index == 1){
                    cpnNo = "g0CzCBI3VCYtaR1vum32gA==";     //클렌징
                    fvrSeq = "2";
                }else if(index == 2){
                    cpnNo = "g0CzCBI3VCbryBS/jL3m2A==";     //썬케어
                    fvrSeq = "3";
                }else if(index == 3){
                    cpnNo = "g0CzCBI3VCZdYzMSpnzIzg==";     //색조/메이크업
                    fvrSeq = "4";
                }else if(index == 4){
                    cpnNo = "g0CzCBI3VCYc01MkZF++uw==";     //바디/스크럽
                    fvrSeq = "5";
                }else if(index == 5){
                    cpnNo = "g0CzCBI3VCZd8wKX/dc9NQ==";     //데오/제모
                    fvrSeq = "6";
                }else if(index == 6){
                    cpnNo = "g0CzCBI3VCaTefHEnN09Yw==";     //헤어케어
                    fvrSeq = "7";
                }else if(index == 7){
                    cpnNo = "g0CzCBI3VCaelBngqsylrQ==";     //향수/디퓨저
                    fvrSeq = "8";
                }else if(index == 8){
                    cpnNo = "g0CzCBI3VCbxu8tZmJYm4g==";     //건강/위생
                    fvrSeq = "9";
                }
            }
            monthEvent.detail.cateCouponDownJson(cpnNo, cpnDownCnt, fvrSeq);
        });
    },
    
    //카테고리 확정 쿠폰 다운로드
    cateCouponDownJson : function(cpnNo, cpnDownCnt, fvrSeq){
        if(!mevent.detail.checkRegAvailable()){
            return;
        }
        if(typeof cpnNo == "undefined" || cpnNo == ""){
            alert("쿠폰 번호가 없습니다.");
            return;
        }
        var param = {
                cpnNo : cpnNo
                , cpnDownCnt : cpnDownCnt
                , fvrSeq : fvrSeq
        }
        
        common.Ajax.sendRequest(
                "GET"
                , _baseUrl + "event/20180725_1/cateCouponDownJson.do"
                , param
                , this._callback_cateCouponDownJson
         );
    },
    _callback_cateCouponDownJson : function(json) {        
        if(json.ret == '0'){
            monthEvent.detail.myEventReg(json.fvrSeq);
            if(json.cpnDownCnt == 3){
                mevent.detail.eventShowLayer('evtGift1');
//                alert(json.message);
            }
        }
    },
    
    myEventReg : function(fvrSeq){
        if(!mevent.detail.checkRegAvailable()){
            return;
        }
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
                , fvrSeq : fvrSeq
        }
        
        common.Ajax.sendRequest(
                "GET"
                , _baseUrl + "event/20180725_1/myEventRegJson.do"
                , param
                , this._callback_myEventRegJson
         );
    },
    _callback_myEventRegJson : function(json) {
//        if(json.ret == '0'){
//            
//        }
    },
    
    /* 
     * 쿠폰  다운로드 
       “모바일 앱에서만 다운 가능한 쿠폰입니다.”알럿>확인>앱분기>취소>알럿 닫고 페이지 유지
      */
    downCouponJson : function(cpnNo) {
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 다운 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{     
            if(!mevent.detail.checkLogin()){
                return;
            }else{
                if(!mevent.detail.checkRegAvailable()){
                    return;
                }
                if(typeof cpnNo == "undefined" || cpnNo == ""){
                    alert("쿠폰 번호가 없습니다.");
                    return;
                }
                var param = {cpnNo : cpnNo};
                common.Ajax.sendRequest(
                        "GET"
                        , _baseUrl + "event/downCouponJson.do"
                        , param
                        , this._callback_downCouponJson
                 );
            }
        }
    },
    _callback_downCouponJson : function(json) {
        if(json.ret == '0'){
            alert(json.message);
        }
    },
    
    goMyPage : function(){        
        if(common.isLogin() == false){
            if(!confirm("해당 서비스는 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?")){
                return false;
            }else{
                common.link.moveLoginPage();
                return false;
            }
        }else{
            common.link.commonMoveUrl('mypage/getCouponList.do');
        }
    },
    
    // 레이어 숨김
    eventCloseLayer : function(){
        $(".eventLayer").hide();
        $("#eventDimLayer").hide();
        location.reload();
    },    

};
