$.namespace("monthEvent.detail");
monthEvent.detail = { 
    _ajax : common.Ajax,  
    
    totalAmt : "0",
    firstEvtYn : "N",
    secondEvtYn : "N",
    thirdEvtYn : "N",
    firstYn : "",
    firstChk : "",
    checkStampBtn : "N",
    mbrInfoUseAgrYnChk : "N",
    mbrInfoThprSupAgrYnChk : "N",
    doubleSubmitFlag : false,

    init : function(){
        // scroll class 변경
        var tabH = $(".treeTab img").height();
        $("#eventTabFixed2").css("height",tabH + "px");

        var tabHeight =$("#eventTabImg").height() + 203;
        var eTab01 = tabHeight + $("#evtConT01").height() - 10;
        var eTab02 = eTab01 + $("#evtConT02").height() - 10;
        var eTab03 = eTab02 + $("#evtConT03").height() - 10;
        var eTab04 = eTab03 + $("#evtConT04").height();

        var scrollTab  = $(document).scrollTop();

        if (scrollTab > tabHeight) {
            $("#eventTabFixed2")
            .css("position","fixed")
            .css("top","0px");
        }
       if (scrollTab < eTab01) {
            $("#eventTabFixed2").attr('class','tab01');
        } else if (scrollTab < eTab02) {
            $("#eventTabFixed2").attr('class','tab02');
        } else if (scrollTab < eTab03) {
            $("#eventTabFixed2").attr('class','tab03');
        };
        
        $(window).scroll(function(){
            var scrollTab  = $(document).scrollTop();
             if (scrollTab < eTab01) {
                $("#eventTabFixed2").attr('class','tab01');
            } else if (scrollTab < eTab02) {
                $("#eventTabFixed2").attr('class','tab02');
            } else if (scrollTab < eTab03) {
                $("#eventTabFixed2").attr('class','tab03');
            } 

            if (scrollTab > tabHeight) {
                $("#eventTabFixed2")
                .css("position","fixed")
                .css("top","0px");
            } else {
                $("#eventTabFixed2")
                .css("position","absolute")
                .css("top","");
            }
        });
        
        // 라디오 버튼 체크 초기화
        $(':radio[name="ChckName"]:checked').attr("checked", false);
        
        // 라디오 버튼 비활성화
        $("input[name=ChckName]").attr("disabled", true);

        /* 위수탁  닫기 */
        $(".eventHideLayer1").click(function(){
            alert("개인정보 위수탁 약관 동의 후 응모 가능합니다.");
            monthEvent.detail.eventCloseLayer1();
        });
        
        /* 닫기  */
        $(".eventHideLayer").click(function(){
            monthEvent.detail.eventCloseLayer();            
        });
        
        $(".gift1").click(function(){
            if(monthEvent.detail.checkStampBtn == "N"){
                alert("’내 스탬프 확인하기’를 눌러주세요");
                return;
            }else{
                $(':radio[name="ChckName"]:checked').attr("checked", true);
                $("input[name=ChckName]").attr("disabled", false); // 라디오버튼 활성화
            }
        });
        
        $(".gift2").click(function(){
            if(monthEvent.detail.checkStampBtn == "N"){
                alert("’내 스탬프 확인하기’를 눌러주세요");
                return;
            }else{
                $(':radio[name="ChckName"]:checked').attr("checked", true);
                $("input[name=ChckName]").attr("disabled", false); // 라디오버튼 활성화
            }
        });
        
        $(".gift3").click(function(){
            if(monthEvent.detail.checkStampBtn == "N"){
                alert("’내 스탬프 확인하기’를 눌러주세요");
                return;
            }else{
                $(':radio[name="ChckName"]:checked').attr("checked", true);
                $("input[name=ChckName]").attr("disabled", false); // 라디오버튼 활성화
            }
        });
        
        $(".gift4").click(function(){
            if(monthEvent.detail.checkStampBtn == "N"){
                alert("’내 스탬프 확인하기’를 눌러주세요");
                return;
            }else{
                $(':radio[name="ChckName"]:checked').attr("checked", true);
                $("input[name=ChckName]").attr("disabled", false); // 라디오버튼 활성화
            }
        });
        
        $(".gift5").click(function(){
            if(monthEvent.detail.checkStampBtn == "N"){
                alert("’내 스탬프 확인하기’를 눌러주세요");
                return;
            }else{
                $(':radio[name="ChckName"]:checked').attr("checked", true);
                $("input[name=ChckName]").attr("disabled", false); // 라디오버튼 활성화
            }
        });
    },
    
    /**
     * 중복서브밋 방지
     * 
     * @returns {Boolean}
     */
    doubleSubmitCheck : function(){
        if(monthEvent.detail.doubleSubmitFlag){
            return monthEvent.detail.doubleSubmitFlag;
        }else{
            monthEvent.detail.doubleSubmitFlag = true;
            return false;
        }
    },
    
    /* 꿀이득 쿠폰 */
    chkDownCoupon : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 다운 가능한 쿠폰입니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{     
            if(!mevent.detail.checkLogin()){
                return;
            }
            
            var cpnNo = "";
            if($("#profile").val() == "dev"){
                cpnNo = "g0CzCBI3VCZPcdfnEwRHYw==";
            }else if($("#profile").val() == "qa"){
                cpnNo = "g0CzCBI3VCYl8q6wSEtHmg==";
            }else if($("#profile").val() == "prod"){
                cpnNo = "g0CzCBI3VCagvSOT51CekA==";
            }
            monthEvent.detail.downCouponJson(cpnNo);
        }
    },
    /* 쿠폰 사용 확인 */
    getCpnUseChk : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 다운 가능한 쿠폰입니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{     
            if(!mevent.detail.checkLogin()){
                return;
            }else{
                var param = {
                        evtNo : $("input[id='evtNo']:hidden").val()
                }
                common.Ajax.sendRequest(
                        "GET"
                      , _baseUrl + "event/20180820/getCpnUseChkJson.do"
                      , param
                      , this._callback_getCpnUseChkJson
                );
            }
        }
    },
    _callback_getCpnUseChkJson : function(json) {
        if(json.cpnUseYnCnt == "0"){        //cpnUseYnCnt(0:사용이력 없음, 0이 아닌 경우:사용이력 있음)
            //핵꿀 쿠폰 다운로드
            var cpnNo = "";
            if($("#profile").val() == "dev"){
                cpnNo = "g0CzCBI3VCbK8QVfwkQIyw==";
            }else if($("#profile").val() == "qa"){
                cpnNo = "g0CzCBI3VCbqy7EgdGcKLg==";
            }else if($("#profile").val() == "prod"){
                cpnNo = "g0CzCBI3VCaRwkjnBz5eRw==";
            }
            monthEvent.detail.downCouponJson(cpnNo);
        }else if(json.cpnUseYnCnt > "0"){
            alert("1단계 쿠폰 사용 고객만 발급 가능합니다.");
        }
    },
    
    /* 
     * 쿠폰  다운로드 
       “모바일 앱에서만 다운 가능한 쿠폰입니다.”알럿>확인>앱분기>취소>알럿 닫고 페이지 유지
      */
    downCouponJson : function(cpnNo) {
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 다운 가능한 쿠폰입니다.")){
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
                        , this._callback_downOrdCouponJson
                 );
            }
        }
    },
    _callback_downOrdCouponJson : function(json) {
        if(json.ret == '0'){
            alert(json.message);
        }
    },
    
    /* 누적구매금액확인
     * 이력 체크 : 기간 내의 실 결제금액 합산(배송비, 쿠폰할인금액 제외)
     * */
    checkMyEventBuyAmt:function(){
        // 웹인지 앱인지 체크
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{     
            if(!mevent.detail.checkLogin()){ // 로그인 체크
                return;
            }
            if(!mevent.detail.checkRegAvailable()){ // 이벤트 응모 기간 체크
                return;
            }

            var param = {
                      evtNo : $("input[id='evtNo']:hidden").val()
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180820/checkMyEventBuyAmtJson.do"
                  , param
                  , monthEvent.detail._callback_checkMyEventBuyAmtJson
            );
        }
    },
    _callback_checkMyEventBuyAmtJson : function(json) {
        if(json.ret == "0"){
            var myTotalAmt = json.myTotalAmt.numberFormat();
            var chkTotalAmt = parseInt(json.myTotalAmt); 
            monthEvent.detail.totalAmt =  chkTotalAmt;
            monthEvent.detail.checkStampBtn = "Y";
//          $("#rndmVal").text(myTotalAmt + "원");
          if(chkTotalAmt < 20000){
              $(".stamp1").addClass("");
              $(".stamp2").addClass("");
              $(".stamp3").addClass("");
          }else if(chkTotalAmt >= 20000 && chkTotalAmt < 40000){
              $(".stamp1").addClass("on");
              $(".stamp2").addClass("");
              $(".stamp3").addClass("");
              monthEvent.detail.firstEvtYn = "Y";
              $("input[name=ChckName]").attr("disabled", false); // 라디오버튼 활성화
          }else if(chkTotalAmt >= 40000 && chkTotalAmt < 60000){
              $(".stamp1").addClass("on");
              $(".stamp2").addClass("on");
              $(".stamp3").addClass("");
              monthEvent.detail.firstEvtYn = "Y";
              monthEvent.detail.secondEvtYn = "Y";
              $("input[name=ChckName]").attr("disabled", false); // 라디오버튼 활성화
          }else if(chkTotalAmt >= 60000){
              $(".stamp1").addClass("on");
              $(".stamp2").addClass("on");
              $(".stamp3").addClass("on");
              monthEvent.detail.firstEvtYn = "Y";
              monthEvent.detail.secondEvtYn = "Y";
              monthEvent.detail.thirdEvtYn = "Y";
              $("input[name=ChckName]").attr("disabled", false); // 라디오버튼 활성화
          }
          monthEvent.detail.eventApplyYnCheckJson();
        }else{
            alert(json.message);
        }
    },
    
    /* 경품 응모여부 확인 */    
    eventApplyYnCheckJson : function(){
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
                , firstEvtYn : monthEvent.detail.firstEvtYn
                , secondEvtYn : monthEvent.detail.secondEvtYn
                , thirdEvtYn : monthEvent.detail.thirdEvtYn
        }
        
        common.Ajax.sendRequest(
                "GET"
              , _baseUrl + "event/20180820/eventApplyYnCheckJson.do"
              , param
              , this._callback_eventApplyYnCheckJson
        );
    },
    _callback_eventApplyYnCheckJson : function(json){
        
        monthEvent.detail.firstChk = json.ret;
        
        if(json.ret == "1"){
            $(".stamp1").addClass("end");
            $(".stamp2").addClass("");
            $(".stamp3").addClass("");
        }else if(json.ret == "2"){
            $(".stamp1").addClass("end");
            $(".stamp2").addClass("end");
            $(".stamp3").addClass("");
        }else if(json.ret == "3"){
            $(".stamp1").addClass("end");
            $(".stamp2").addClass("end");
            $(".stamp3").addClass("end");
        }
    },
    
    /* 위수탁동의 팝업 노출을 위한 응모여부 확인 */
    getFirstChk : function(){
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
                if(monthEvent.detail.checkStampBtn == "N"){
                    alert("’내 스탬프 확인하기’를 눌러주세요");
                    return;
                }else{
                    // 누적금액 2만원 이상인 경우만
                    if(monthEvent.detail.firstEvtYn == "Y" || monthEvent.detail.secondEvtYn == "Y" || monthEvent.detail.thirdEvtYn == "Y"){
                        var fvrSeq = $("[name='ChckName']:checked").val();
                        if(fvrSeq=='undefined' || fvrSeq == null){
                            alert("응모할 상품을 선택해주세요");
                            return;
                        }
                        var param = {
                                evtNo : $("input[id='evtNo']:hidden").val()
//                                , fvrSeq : fvrSeq
                                , firstEvtYn : monthEvent.detail.firstEvtYn
                                , secondEvtYn : monthEvent.detail.secondEvtYn
                                , thirdEvtYn : monthEvent.detail.thirdEvtYn
                        }
                        
                        common.Ajax.sendRequest(
                                "GET"
                              , _baseUrl + "event/20180820/getFirstChkJson.do"
                              , param
                              , this._callback_getFirstChkJson
                        );
                    }else{
                        alert("대상자가 아닙니다. 기간 내 누적금액을 달성하지 못했습니다.");
                    }
                }
            }
        }
    },
    _callback_getFirstChkJson : function(json) {
        
        if(monthEvent.detail.doubleSubmitCheck()) return; // 중복체크
        
        if(monthEvent.detail.firstEvtYn == "Y" && monthEvent.detail.secondEvtYn == "N" && monthEvent.detail.thirdEvtYn == "N"){
            if(json.ret == "0"){
                monthEvent.detail.firstYn = "Y";        //참여여부 변수값
                monthEvent.detail.eventShowLayer1('eventLayerPolice');  //최초 참여는 개인정보 위수탁 동의팝업 생성
            }else{
                monthEvent.detail.doubleSubmitFlag = false; // 중복 클릭 방지
                monthEvent.detail.firstYn = "N";        //참여여부 변수값
                alert("참여 가능 스탬프를 확인해주세요.");
            }
        }else if(monthEvent.detail.firstEvtYn == "Y" && monthEvent.detail.secondEvtYn == "Y" && monthEvent.detail.thirdEvtYn == "N"){
            if(json.ret == "0"){
                monthEvent.detail.firstYn = "Y";        //참여여부 변수값
                monthEvent.detail.eventShowLayer1('eventLayerPolice');  //최초 참여는 개인정보 위수탁 동의팝업 생성
            }else if(json.ret < "2"){
                monthEvent.detail.firstYn = "N";
                monthEvent.detail.eventApplyJson();
            }else{
                monthEvent.detail.doubleSubmitFlag = false; // 중복 클릭 방지
                monthEvent.detail.firstYn = "N";        //참여여부 변수값
                alert("참여 가능 스탬프를 확인해주세요.");
            }
        }else if(monthEvent.detail.firstEvtYn == "Y" && monthEvent.detail.secondEvtYn == "Y" && monthEvent.detail.thirdEvtYn == "Y"){
            if(json.ret == "0"){
                monthEvent.detail.firstYn = "Y";        //참여여부 변수값
                monthEvent.detail.eventShowLayer1('eventLayerPolice');  //최초 참여는 개인정보 위수탁 동의팝업 생성
            }else if(json.ret < "3"){
                monthEvent.detail.firstYn = "N";
                monthEvent.detail.eventApplyJson();
            }else{
                monthEvent.detail.doubleSubmitFlag = false; // 중복 클릭 방지
                monthEvent.detail.firstYn = "N";        //참여여부 변수값
                alert("참여 가능 스탬프를 확인해주세요.");
            }
        }
    },
    
    /* 위수탁 동의 팝업 */
    popLayerConfirm : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if($(':radio[name="argee1"]:checked').val() == undefined &&  $(':radio[name="argee2"]:checked').val() == undefined ){
                alert("개인정보 위수탁 약관 동의 후 응모 가능합니다.");
                return;
            }
            if("Y" != $(':radio[name="argee1"]:checked').val()){
                alert("'개인정보 수집동의'에 동의해주셔야 응모 가능합니다.");
                return;
            }
            if("Y" != $(':radio[name="argee2"]:checked').val()){
                alert("'개인정보 처리 위탁'에 동의해주셔야 응모 가능합니다.");
                return;
            }
            
            if("Y" == $(':radio[name="argee1"]:checked').val() && "Y" == $(':radio[name="argee2"]:checked').val()){
                monthEvent.detail.eventCloseLayer();
                monthEvent.detail.eventApplyJson();
            }
        }
    },
    
    /* 경품 응모 */    
    eventApplyJson : function(){
        var fvrSeq = $("[name='ChckName']:checked").val();
        
        if(fvrSeq=='undefined' || fvrSeq == null){
            alert("응모할 상품을 선택해주세요");
            return;
        }
        
        if(monthEvent.detail.firstChk == 0){
            mbrInfoUseAgrYnChk = $("input[name='argee1']:radio:checked").val();
            mbrInfoThprSupAgrYnChk = $("input[name='argee2']:radio:checked").val();
        }else{
            mbrInfoUseAgrYnChk = "Y";
            mbrInfoThprSupAgrYnChk = "Y";
        }
        
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
              , fvrSeq : fvrSeq
              , mbrInfoUseAgrYn : mbrInfoUseAgrYnChk       //개인정보 이용 동의 여부
              , mbrInfoThprSupAgrYn : mbrInfoThprSupAgrYnChk    //개인정보 위탁동의 여부
              , firstYn : monthEvent.detail.firstYn     //참여여부
              , firstEvtYn : monthEvent.detail.firstEvtYn
              , secondEvtYn : monthEvent.detail.secondEvtYn
              , thirdEvtYn : monthEvent.detail.thirdEvtYn
        };
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20180820/eventApplyJson.do"
              , param
              , monthEvent.detail._callback_eventApplyJson
        );
    },
    _callback_eventApplyJson : function(json){
        if(json.ret == "0"){
            // 중복 클릭 방지
            monthEvent.detail.doubleSubmitFlag = false;
            
            alert("응모 되었습니다.");
            // 라디오 버튼 체크 초기화
            $(':radio[name="ChckName"]:checked').attr("checked", false);
            // 스탬프 재조회
            monthEvent.detail.checkMyEventBuyAmt();
        }else{
            alert(json.message);
        }
    },
    
    // 레이어 숨김
    eventCloseLayer : function(){
        $(".eventLayer").hide();
        $("#eventDimLayer").hide();
        $("#eventDimLayer1").hide();
        // 중복 클릭 방지
        monthEvent.detail.doubleSubmitFlag = false;
    },
    
    // 레이어 숨김
    eventCloseLayer1 : function(){
        $(':radio[name="argee1"]:checked').attr("checked", false);
        $(':radio[name="argee2"]:checked').attr("checked", false);
        $(".eventLayer").hide();
        $("#eventDimLayer").hide();        
        $("#eventDimLayer1").hide();
        // 중복 클릭 방지
        monthEvent.detail.doubleSubmitFlag = false;
    },
    
    // 레이어 노출
    eventShowLayer1 : function(obj) {
        var layObj = document.getElementById(obj);
        var layDim = document.getElementById('eventDimLayer1');
        layDim.style.display = 'block';
        layObj.style.display = 'block';
        var layObjHeight = layObj.clientHeight  / 2;
        layObj.style.marginTop = "-" + layObjHeight +"px";
    },
    
};
  