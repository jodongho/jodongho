
$.namespace("mopenEvent.common");
mopenEvent.common = {

    _ajax : common.Ajax,
    _tmpObj : null,

    init : function(){
        //이전화면에서 응모한 탭정보
        var tabIndex = $("nav ul").attr("data-tabIndex");

        if(tabIndex == 2){
            if(!common.isEmpty(location.hash)){
                tabIndex = location.hash.replace("#","");
            }else{
                tabIndex = "evt_0"+tabIndex;
            }

            if( tabIndex.indexOf("evt_0") < 0 ){
                tabIndex = "evt_0"+tabIndex;
            }

            //화면 스크롤 이동 이벤트
            var offset = $("#"+tabIndex).offset();
            $('html, body').animate({scrollTop : offset.top }, 400);
        }

        if(tabIndex == 3){
            var snsImg = $("#snsImg").val();
            var snsTitle = $("#snsTitle").val();
            var evtNo = $("#evt_03").attr("data-evtNo");
            var url = _baseUrl + "O.do?evtNo="+evtNo;
            common.sns.init(snsImg,snsTitle, url);
        }

    },

    moveEventPage : function(tabIndex){
        if(common.isEmpty(tabIndex)){
            tabIndex = 1;
        }
        location.href = _plainUrl + "open/getOpenEvent.do?tabIndex="+tabIndex;
    },

    moveTodayPrice : function(){
        location.href = _plainUrl + "main/main.do#41";
    },
    moveCoupon : function(){
        location.href = _plainUrl + "main/main.do#43";
    },
    moveNews : function(){
        location.href = _plainUrl + "main/main.do#47";
    },
    moveBeauty : function(){
        location.href = _plainUrl + "main/main.do#44_2";
    },
    moveTrand : function(){
        location.href = _plainUrl + "main/main.do#42";
    },
    movePlan : function(){
        location.href = _plainUrl + "main/main.do#45";
    },
    moveCulture : function(){
        location.href = _plainUrl + "main/main.do#44_1";
    },
    moveEventDetail : function(){
        location.href = _plainUrl + "event/getEventDetail.do?evtNo=00000000005032";
    },

    checkLogin : function(){

        if(common.isLogin() == false){

            if(!confirm("로그인시 참여 가능합니다. 로그인 페이지로 이동하시겠습니까?")){
                return false;
            }else{
                common.link.moveLoginPage();
                return false;
            }
        }

        return true;
    },

    checkRegAvailable : function() {
        var regYn = $.trim($("#regYn").val());
        if(regYn == 'N'){
            alert("응모기간이 지났습니다.");
            return false;
        }

        return true;
    },

    checkAgrmInfo : function(){

        if(!$("#inpChkAgree1").is(":checked")){
            alert("개인정보 수집 이용 동의를 하셔야 이벤트 참여가 가능합니다.");
            return false;
        }else{
            events.detail.mbrInfoUseAgrYn = 'Y';
        }

        if(!$("#inpChkAgree2").is(":checked")){
            alert("개인정보 취급 위탁 동의를 하셔야 이벤트 참여가 가능합니다.");
            return false;
        }else{
            events.detail.mbrInfoThprSupAgrYn = 'Y';
        }

        return true;
    },

    areePopup : function (){
        popLayerOpen('lay_pop2');
    },

    areePopupCancel : function (obj){
        //현재 탭 메뉴 번호
        var tindex = $(".evt_201704_open .lnb ul li.on").index() + 1;
        var sid = "#evt_0" + tindex;

        $(obj).parent().siblings(".popCont").find(":radio").each(function(i){
            if(i == 0 || i == 1 ){
                mopenEvent.common._tmpObj.parents(sid).attr("data-mbrInfoUseAgrYn","N");
            }else{
                mopenEvent.common._tmpObj.parents(sid).attr("data-mbrInfoThprSupAgrYn","N");
            }
            $(this).prop("checked",false);
        });

        popLayerClose('lay_pop2');
    },

    areePopupCommit : function (obj){

        var chkval = [];

        //현재 탭 메뉴 번호
        var tindex = $(".evt_201704_open .lnb ul li.on").index() + 1;

        $(obj).parent().siblings(".popCont").find(":radio").each(function(i){
            var chk= $(this).prop("checked");

            if(chk == false){
                if (i == 0){
                    alert("미동의시 이벤트에 응모되지 않습니다. 동의함에 체크해주세요.");
                    return false;
                }
                if (i == 2){
                    alert("미동의시 이벤트에 응모되지 않습니다. 동의함에 체크해주세요.");
                    return false;
                }
            }else{
                if(i == 0 ){
                    mopenEvent.common._tmpObj.parents(".eConWrap").attr("data-mbrInfoUseAgrYn","Y");
                    chkval.push(chk);
                }else if(i == 2 ){
                    mopenEvent.common._tmpObj.parents(".eConWrap").attr("data-mbrInfoThprSupAgrYn","Y");
                    chkval.push(chk);
                }
            }
        });

        if( chkval.length == 2 ){
            mopenEvent.common.regEventAjax(mopenEvent.common._tmpObj);
            popLayerClose('lay_pop2');

            $(obj).parent().siblings(".popCont").find(":radio").each(function(){
                $(this).prop("checked",false);
            });

        }

        return false;

    },

    regEventAjax : function(obj){

        if( mopenEvent.common.checkLogin() ){

            var $obj                = $(obj);

            //현재 탭 메뉴 번호
            var tindex = $(".evt_201704_open .lnb ul li.on").index() + 1;

            var sid = "#evt_0" + tindex;

            /* 약관동의 옵션1 - 개인정보이용동의여부 */
            var mbrInfoUseAgrYn     = $obj.parents(".eConWrap").attr("data-mbrInfoUseAgrYn");
            /* 약관동의 옵션2 - 개인정보3자제공동의여부 */
            var mbrInfoThprSupAgrYn = $obj.parents(".eConWrap").attr("data-mbrInfoThprSupAgrYn");

            //약관동의 1회이상 했는지 체크
            var chkArgee = false;

            //약관동의 체크
            if(tindex == 1 || tindex == 2){
               chkArgee = true;
            }

            if(tindex == 3){
                if( $("#evt_03 .zzim.on").length > 0 ){
                    chkArgee = true;
                    mbrInfoUseAgrYn = "Y";
                    mbrInfoThprSupAgrYn = "Y";
                }
            }

            if(tindex == 4 ){
                if ( $obj.attr("data-argee") > 0 ){
                    chkArgee = true;
                    mbrInfoUseAgrYn = "Y";
                    mbrInfoThprSupAgrYn = "Y";
                }
            }

            if(tindex == 5 ){
                if( $obj.attr("data-agreeCnt") > 0 ){
                    chkArgee = true;
                }else{
                    chkArgee = false;
                }

            }

            if(chkArgee == false && mbrInfoUseAgrYn  != "Y"  && mbrInfoThprSupAgrYn != "Y" ){
                //약관동의 체크
                mopenEvent.common._tmpObj = $obj;
                mopenEvent.common.areePopup();
            }

            if( mbrInfoUseAgrYn  == "Y"  && mbrInfoThprSupAgrYn == "Y"){
                chkArgee = true;
            }

            if(chkArgee == true){

                var evtNo               = $obj.attr("data-evtNo");
                /*
                    찜종류코드
                        01  오늘특가
                        02  쿠폰존
                        03  신상
                        04  뷰티테스터
                        05  트렌드
                */
                var evtWishScrnCd       = $obj.attr("data-evtWishScrnCd");


                evtNo               = common.isEmpty(evtNo) ? "" : evtNo;
                evtWishScrnCd       = common.isEmpty(evtWishScrnCd) ? "" : evtWishScrnCd;
                mbrInfoUseAgrYn     = common.isEmpty(mbrInfoUseAgrYn) ? "N" : mbrInfoUseAgrYn;
                mbrInfoThprSupAgrYn = common.isEmpty(mbrInfoThprSupAgrYn) ? "N" : mbrInfoThprSupAgrYn;

                var param = {
                        evtNo : evtNo,
                        evtWishScrnCd : evtWishScrnCd,
                        mbrInfoUseAgrYn : mbrInfoUseAgrYn,
                        mbrInfoThprSupAgrYn : mbrInfoThprSupAgrYn
                };

                this._ajax.sendJSONRequest(
                        "GET"
                        , _baseUrl + "open/regEventJson.do"
                        , param
                        , this._callback_regEventAjax);
            }
        }

    },

    _callback_regEventAjax : function(strData) {

        if(strData.ret == "0"){

            //현재 탭 메뉴 번호
            var tindex = $(".evt_201704_open .lnb ul li.on").index() + 1;

            if( common.isEmpty(tindex) || tindex == 0 ){
                tindex = "1";
            }


            if(tindex == 3){
                //찜완료 팝업 호출
                $('.zzimCpl').addClass('on');
            }else if(tindex == 4){
                var sid = "#btn_nextApply";
                $('.applend').addClass('on');
                if(strData.message == "당첨을 축하합니다~"){
                    //btn_winner
                    sid = "#btn_winner";
                }else if(strData.message == "응모되었습니다! 당첨자 발표일에 당첨여부를 확인해주세요!"){
                    //btn_appli
                    sid = "#btn_appli";
                }

                $('.applend').find(sid).show().siblings().hide();

            }else if(tindex == 5){
                alert(strData.message);
                mopenEvent.common.pageReload();


            }else{
                alert(strData.message);
            }

        }else{
            common.loginChk();
        }
    },

    pageReload : function (){
        //현재 탭 메뉴 번호
        var tindex = $(".evt_201704_open .lnb ul li.on").index() + 1;

        var $tabIndex = $("<input>").attr("type","hidden")
                            .attr("name","tabIndex")
                            .attr("value", tindex );

        var $sform = $("<form>").append($tabIndex)
        .attr("action", _plainUrl + "open/getOpenEvent.do")
        .appendTo("#mContents")
        .submit();
    },

};

/*
  [탭3] 매일출첵 경품응모
*/
$.namespace("mopenEvent.everyDay");
mopenEvent.everyDay = {


        _ajax : common.Ajax,
        init : function(){

        },
        getWinList : function(){
            if( mopenEvent.common.checkLogin() ){
                this._ajax.sendRequest(
                        "GET"
                        , _baseUrl + "open/getMyWinListJson.do"
                        , null
                        , this._callback_getMyWinListJson);
            }
        },

        _callback_getMyWinListJson : function(strData) {
            if(strData.ret == '0'){
                if(common.isEmpty(strData.message)){

                    $(".winDetail tbody").empty();

                    $.each(strData.myWinList , function( i , obj){
                        var $tr = $("<tr>");
                        var $dayTd = $("<td>").text(obj.sSbscSgtStrtDtime);
                        var $txtTd = $("<td>").text(obj.evtNm);

                        $tr.append($dayTd).append($txtTd);
                        $(".winDetail tbody").append($tr);
                    });

                    $('.winDetail').addClass('on');

                }else{
                    alert(strData.message);
                }
            }else{
                common.loginChk();
            }
        },

};

/*
[탭1] 첫만남 혜택 쿠폰 이벤트
*/
$.namespace("mopenEvent.firstMeet");
mopenEvent.firstMeet = {

    _ajax : common.Ajax,

    init : function(){

    },

    downCoupon : function(obj){
        var cpnNo = $(obj).attr("data-cpnNo");

        if( mopenEvent.common.checkLogin() ){ //로그인 체크 실행
            mopenEvent.firstMeet.downCouponJson(cpnNo);
        }
    },

    downCouponJson : function(cpnNo) {

        var param = {cpnNo : cpnNo};
        this._ajax.sendRequest(
                "GET"
                , _baseUrl + "open/downCouponJson.do"
                , param
                , this._callback_downCouponJson);
    },

    _callback_downCouponJson : function(strData) {
        if(strData.ret == '0'){
            alert(strData.message);
        }else{
            common.loginChk();
        }
    },

};

/*
[탭2] 찜하고 모닝득템
*/
$.namespace("mopenEvent.wish");
mopenEvent.wish = {

        init : function(){

        },

        zzim : function(obj){
            var $obj = $(obj);
            if( !$obj.hasClass("on") ){
                $obj.addClass("on");
                $obj.css({"background-image":"url("+_cssUrl+"../image/comm/ico_zzim_on.png)"});
            }
        }


};


/*
[탭4] 구매고객 단독혜택
*/
$.namespace("mopenEvent.purchaseUserBenefits");
mopenEvent.purchaseUserBenefits = {

        _ajax : common.Ajax,
        _tmpObj : null,
        init : function(){

        },

        downCoupon : function(obj){

            var evtNo = $(obj).attr("data-evtNo");

            mopenEvent.purchaseUserBenefits._tmpObj = $(obj);

            if( mopenEvent.common.checkLogin() ){ //로그인 체크 실행
                mopenEvent.purchaseUserBenefits.downCouponJson(evtNo);
            }
        },

        downCouponJson : function(evtNo) {

            var param = {evtNo : evtNo};
            this._ajax.sendRequest(
                    "GET"
                    , _baseUrl + "open/checkJAJUEvtJson.do"
                    , param
                    , this._callback_downCouponJson);
        },

        _callback_downCouponJson : function(strData) {
            if(strData.ret == '0'){
                // 쿠폰 팝업 띄운다.

                mopenEvent.purchaseUserBenefits._tmpObj.siblings('div').toggleClass('on');
                $('#mContents .dim').addClass('on');

            }else{
                common.loginChk();
            }
        },


};



