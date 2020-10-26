_ajax = common.Ajax;


var nowCardNo = null;
var nowCardNm = null;
var cancelAllList = "";
var cancelYCnt = 0;
var totPresentDtlCnt = 0;

$.namespace('mmypage.giftBoxList');
mmypage.giftBoxList = {
        isExcute : false,
        isPageSubmit : "000000",

        init : function(){

            if($("#rspCheck") == 'R')
            {
                $('.date.R').show();
                $('.date.S').hide();
                $(".date.R").attr("style","");
                $(".date.S").attr("style","display:none");
            }
            else
            {
                $('.date.S').show();
                $('.date.R').hide();
                $(".date.R").attr("style","display:none");
                $(".date.S").attr("style","");
            }
            ScrollPager.init({bottomScroll : 700, callback : mmypage.giftBoxList.getGiftBoxListJSON});
           /* 2019.10.25 오프라인리뷰관련 수정*/


            $("#divPresentGb a").bind("click", function(){

                $("#divPresentGb a").removeClass("is-active");
                $(this).addClass("is-active");

                var rspCheck = $(this).attr("rspCheck");
                $("#rspCheck").val(rspCheck);
                // form submit!!
                var url = _secureUrl + "mypage/getGiftBoxList.do?rspCheck="+rspCheck;

                window.location.href=url;


            });


            $('#ord-prgs-stat-cd').change(function(){
                $("#stOrdNo").val("");

                $("#dealSp").val($("#ord-prgs-stat-cd").val());

                $(location).attr('href', _baseUrl + 'mypage/getGiftBoxList.do?' + $('#order-list-form').serialize());
            });



        },

        /*일반상품 상세 이동*/
        goDetail : function(ordNo, obj){

            if(!ordNo){
                alert(MESSAGE.INVALID_ORDNO);
            }
            common.wlog("mypage_giftbox_send_orddetail"); // 일반상품 주문내역상세 데이터스토리 등록 CBLIM 20200709
            var params = $(obj).data();
            $(location).attr('href', _baseUrl + 'mypage/getOrderDetail.do?ordNo=' + ordNo);

        },

        getGiftBoxListJSON : function(){
            ScrollPager.unbindEvent();
            var values = $('#order-list-form').serializeObject();

            values.pageIdx = ScrollPager.nextPageIndex();

            _ajax.sendJSONRequest('GET'
                    , _baseUrl + 'mypage/getGiftBoxListJSON.do'
                    , values
                    , mmypage.giftBoxList.getGiftBoxListJSONCallback
                );
        }

        , getGiftBoxListJSONCallback : function(res){
            var data  = (typeof res !== 'object') ? $.parseJSON(res) : res;

            if(data.length < 1){
                ScrollPager.unbindEvent();
                return;
            }

            $('.grayBox6').remove();
         // 2019.10.25 오프라인리뷰관련추가
            //mmypage.giftBoxList.getOnOffLastOrder(data);

            mmypage.giftBoxList.addGiftBoxList(data);

            $('#order-comment-tmpl').tmpl().appendTo('#mContents');
            ScrollPager.init({bottomScroll : 700, pageIndex: ScrollPager.currPageIndex(), callback : mmypage.giftBoxList.getGiftBoxListJSON});
        }

        , addGiftBoxList : function(data){
            var prevOrdNo = '';
            var prevCellNo = '';
            var rspCheck = '';
            if($('#rspCheck').val() == 'S')
            {
                rspCheck = 'S';
            }
            else
            {
                rspCheck = 'R';
            }

            for(var i=0; i<data.length; i++){
                var ordNo      = data[i].ordNo;
                var giftCardYn = data[i].giftCardYn;
                var precentCellNo1 = data[i].precentCellNo1;
                var _displayImgUploadUrl = $('#displayImgUploadUrl').val();


                data[i]._displayImgUploadUrl = _displayImgUploadUrl;

                data[i].prevOrdNo = prevOrdNo;
                data[i].prevCellNo = prevCellNo;
                data[i].totRealQty = data[i].totRealQty.numberFormat();
                data[i].rspCheck = rspCheck;

                if(giftCardYn == 'Y' && prevOrdNo != ordNo){
                    //기프트카드이고, 한 주문에 번호가 다를때
                    $('#order-list-tmpl').tmpl(data[i]).appendTo('.my_order_list');//$('#order-list-tmpl').tmpl(data[i]).appendTo('#mContents');
                }else if(prevOrdNo == ordNo){
                    // 이전주문번호와 지금주문번호가 같을때
                    $('#order-li-list-tmpl').tmpl(data[i]).appendTo($('.my_order_list').children('li').last()); //$('#mContents').children('ul').last()
                }else{
                    //
                    $('#order-list-tmpl').tmpl(data[i]).appendTo('.my_order_list');//$('#order-list-tmpl').tmpl(data[i]).appendTo('#mContents');
                }
                prevOrdNo = ordNo;
                prevCellNo = precentCellNo1;

            };
            if($('#rspCheck').val()=='R')
            {
                //배송정보, 상세정보 .show
                $('.btnAddBk').hide(); //받은선물함일 시 주문조회 불가
                $('.gp-gift-detail-info').show();
                $('.date.S').hide(); //받은선물함일 시 주문조회 불가
                $('.date.R').show();
                $(".date.R").attr("style","");
                $(".date.S").attr("style","display:none");
            }
            else if($('#rspCheck').val()=='S')
            {
                //배송정보, 상세정보 .hide
                $('.tnAddBk').show();
                $('.gp-gift-detail-info').hide(); //보낸선물함 배송지정보, 주문정보 숨기기
                $('.date.R').hide();
                $('.date.S').show();
                $(".date.R").attr("style","display:none");
                $(".date.S").attr("style","");
            }
        }

        , getDeliveryInfoDetailJSON : function(ordNo, index, ordManMbrNo) {

            if($('#rspCheck').val() == 'S') //받은선물에서만 배송지 정보
            {
                common.wlog("mypage_giftbox_send_detail_view"); // 보낸선물 상세펼침 데이터스토리 등록 CBLIM 20200709
                return;
            }

            common.wlog("mypage_giftbox_recv_detail_view"); // 받은선물 상세펼침 데이터스토리 등록 CBLIM 20200709

            $('#selectedDetail').val(index);

            if($('#checkClick_'+index).val()=="false")
            {
                $('#checkClick_'+index).val("true");   // 상세보기 Controller 중복 접근 방지.
                var param = {
                        ordNo   : ordNo
                        ,ordManMbrNo : ordManMbrNo
                        ,rspCheck : $('#rspCheck').val()
                };

            _ajax.sendJSONRequest('GET'
                    , _baseUrl + 'mypage/getDeliveryInfoDetailJSON.do'
                    , param
                    , mmypage.giftBoxList.getDeliveryInfoDetailJSONCallback
                );
            }

        }

        , getDeliveryInfoDetailJSONCallback : function(res){
            var data  = (typeof res !== 'object') ? $.parseJSON(res) : res;
            var selectedDetail = $('#selectedDetail').val()
            $('#delivery-info-tmpl').tmpl(data).appendTo('#delivery_info_'+selectedDetail);//$('#order-list-tmpl').tmpl(data[i]).appendTo('#mContents');


        }
          /*기프트카드 선물내역 상세 이동*/
        , moveGiftCardPresentDtlPage : function(ordNo, ordTm) {
            /*선물 상세 이후 백버튼시, 선물내역 tab 보여주기 위한 flag*/
             /*적용시 주석풀기*/
             //history.replaceState({page: 2}, "title 2", "?tabSetFlag=P");


             $('#ordNo').val(ordNo);
             $('#ordDtime').val(ordTm);

             $("#order-list-form").attr('action', _baseUrl + "myGiftCard/getMyGiftCardPresentDtl.do");
             $("#order-list-form").attr('method', "POST");
             $("#order-list-form").attr('onsubmit', true);
             $("#order-list-form").submit();

         }
        , moveGoodsDetail : function(goodsNo, prgsStatCd){

            if(prgsStatCd == "30" || prgsStatCd == "40"){
                alert("판매종료된 상품입니다.");
                return false;
            } else {
                common.link.moveGoodsDetail(goodsNo);
            }
        }
        /* 기프트카드 상세페이지 이동*/
       , moveGiftCardGuideDtlPage : function(goodsNo, prgsStatCd) {
           if(prgsStatCd == "30" || prgsStatCd == "40"){
               alert("판매종료된 상품입니다.");
               return false;
           }
           var preView = '0';
            location.href = _plainUrl + "giftCardGuide/getGiftCardGuideDtl.do?goodsNo="+goodsNo+"&preView="+preView;
        }
       /* 선물하러 가기 이동(기프트관) */
       , moveGift(){
           //데이터스토리 배송조회 추가 CBLIM 20200709
           if($("#rspCheck").val() == 'R'){
               common.wlog("mypage_giftbox_recv_presentdo");
           }else{
               common.wlog("mypage_giftbox_send_presentdo");
           }
           //데이터스토리 배송조회 추가 CBLIM 20200709
           common.link.moveGift();
       }
};
$.namespace('mmypage.orderCancelStore');
mmypage.orderCancelStore = {
    usrLat : "",
    usrLng : "",
    geoFlag : "Y",
    searchType : "",
    isNearAvail : true,
    isFirstPopup : true,
    isGeoLocationCall : false,
    isGeoLocation : true,
    favorObj : null,
    isProcessing: false,
    dimClickCnt : 0,
    favorCount : 0,
    buttonStarClickCnt : 0, //관심매장 등록 클릭 수
    buttonStarClickPreStoreNo : "", //관심매장 등록 이전 클릭 매장번호
    init : function (){
        mmypage.orderCancelStore.addButtonEvent();
    },
    addButtonEvent : function (){
        $(".returnPop").click(function() {
            if(mmypage.orderCancelStore.isFirstPopup){
                mmypage.orderCancelStore.isFirstPopup = false;
                // 앱여부 확인 및 위치 정보 허용여부 확인[s]
                if(common.app.appInfo.isapp){

                    var tempCompareVersion = "";

                    if (common.app.appInfo.ostype == "10") {
                        tempCompareVersion = '2.1.1'; // ios
                    }else if(common.app.appInfo.ostype == "20"){
                        tempCompareVersion = '2.0.9'; // android
                    }

                    // 앱버전 비교
                    var varCompareVersion = common.app.compareVersion(common.app.appInfo.appver, tempCompareVersion);
                    if(varCompareVersion  ==  "<" || varCompareVersion == "="){

                        mmypage.orderCancelStore.isNearAvail = false;

                    }
                }
                if(common.app.appInfo.isapp){
                    location.href = "oliveyoungapp://getLocationSettings";
                    localStorage.setItem("useLoc", "Y");
                }else{
                    localStorage.setItem("useLoc", "Y");
                }
                // 앱여부 확인 및 위치 정보 허용여부 확인[e]

                if(localStorage.getItem("searchType") != null){
                    $("#searchType").val(localStorage.getItem("searchType"));
                }

                if(localStorage.getItem("tab") != null){
                    $("#tabType").val(localStorage.getItem("tab"));
                }
                if(localStorage.getItem("searchWord") != null){
                    $("#searchWord").val(localStorage.getItem("searchWord"));
                }
                localStorage.removeItem("tab");
                localStorage.removeItem("searchType");

            }
            common.setScrollPos();
            mmypage.orderCancelStore.searchReturnStore();
        });
    },
    //반품 가능 매장 찾기 팝업 오픈
    searchReturnStore : function(obj, prevPopup){
        var params = {};

        if(obj != undefined){
            params = $(obj).data();
        }
        if(prevPopup != undefined){
            params.prevPopup = prevPopup;
        }

        $(".no_stores_div").hide();
        $(".showNearDiv").hide();

        _ajax.sendRequest(
                "POST"
                ,_baseUrl + "mypage/getReturnStorePop.do"
                ,params
                , function(data){
                    $("#pop-full-wrap-retstr").html(data);
                    mmypage.orderCancelStore.popFullOpen();

                    mmypage.orderCancelStore.bindButtonInit();
                    $("#searchAreaButton").click();
                }
                ,false
        );
    },

    closePopup : function(obj, prevPopup, id) {
        if(id != undefined && id != ''){
            mmypage.orderCancelStore.popFullClose(id);
        }else{
            mmypage.orderCancelStore.popFullClose();
        }
        if(obj != undefined && prevPopup != undefined){
            if(prevPopup == 'cancelCausPop'){
                mmypage.common.showCancelCausInfo(obj,'N');
            }else if(prevPopup == 'searchTrackingPop'){
                mmypage.common.searchTrackingPop(obj,'N');
            }
        }
    },

    popFullOpen : function(id, title) {
        $(window).scrollTop(0.0); // 추가부분

        $('body').css({
            'background-color' : '#fff'
        }); /* 2016-12-12 퍼블리싱 수정 반영 */
        if(id != undefined && title != undefined){
            $('#pop-full-title', $("#pop-full-wrap")).html(title);
            $('#'+id+'').show();
        }else{
            $('#pop-full-wrap-retstr').show();
        }
        $('#mWrapper').hide();
    },

    popFullClose : function(id) {
        $('body').css({
            'background-color' : '#eee'
        }); /* 2016-12-12 퍼블리싱 수정 반영 */
        if(id != undefined && id != ''){
            $('#'+id+'').hide();
        }else{
            $('#pop-full-wrap-retstr').hide();
        }
        $('#mWrapper').show();
    },

    //팝업 관련 버튼 이벤트
    bindButtonInit : function (){
        //탭 이동
        $("#mTab > li > a").unbind("click").click(function(e){
            e.preventDefault();

            var id = $(this).attr("id");
            $("#flagSearch").val(id);

            $("#mTab > li > a").removeClass("on");
            $(this).addClass('on');

            $('.reShop_search:eq('+ $(this).parent().index() +')').show().siblings('.reShop_search').hide();
            $('.reShop_con:eq('+ $(this).parent().index() +')').show().siblings('.reShop_con').hide();

            // 지역검색, 직접검색 구분한다
            if(id == "areaSearch"){
                mmypage.orderCancelStore.searchStoreMain('area');
            }else if(id == "wordSearch"){
                mmypage.orderCancelStore.searchStoreMain('word');
            }
        });

        // 지역검색 - 지역 선택시 이벤트
        $("#mainAreaList").change(function(e){
            e.preventDefault();
            mmypage.orderCancelStore.getSubAreaListAjax();
        });
        // 지역검색 - 시/군/구 선택시 이벤트
        $("#subAreaList").change(function(e){
            if ($(this).val() != 'none'){
                $("#subAreaList").addClass("act");
            }
            else {
                $("#subAreaList").removeClass("act");
            }
        });
        // 직접검색 검색버튼 클릭
        $("#searchWordDiv .btn_sch").click(function(e){
            e.preventDefault();
            mmypage.orderCancelStore.searchStoreMain('word');
        });
        // 지역검색 검색버튼 클릭
        $("#searchAreaButton").click(function(e){
            e.preventDefault();
            mmypage.orderCancelStore.searchStoreMain('area');
        });
        //검색어 삭제 버튼 이벤트
        $('.sch_field4').find('.btn_sch_del').on({
            'click' : function(e){
                e.preventDefault();
                $(this).removeClass('on').parent().find('input[type="text"]').val('').focus();
                var _input = $(this).parent().find('input[type="text"]');
                mmypage.orderCancelStore.fnSearchSet(_input);
            }
        });

        // 직접검색, 판매매장 찾기 검색바 이벤트
        $('.sch_field4').find('input[type="text"]').on({
            'keyup' : function(){
                mmypage.orderCancelStore.fnSearchSet($(this));
            },
            'focusin' : function(){
                mmypage.orderCancelStore.fnSearchSet($(this));
            }
        });
    },
    // 검색 이벤트 발생 시 type에 따라 분기하여 매장 리스트 불러오기
    searchStoreMain : function(type){

        PagingCaller.destroy();
        mmypage.orderCancelStore.searchType = type;

        var searchWord = $("#searchWord").val();
        var rgn1 = $("#mainAreaList option:selected").val();
        var rgn2 = $("#subAreaList option:selected").val();
        var useLoc = localStorage.getItem("useLoc") == 'Y' ? true : false;

        var valitation = false;
        if(type == "word" && common.isEmpty(searchWord)){
            valitation = true;
        }else if(type == "area" && rgn1 == 'none'){
            valitation = true;
        }

        if(valitation && useLoc){
            /*검색어 없을 시 전체 매장 조회*/
            if (navigator.geolocation) {
                mmypage.orderCancelStore.isGeoLocationCall = true;
                navigator.geolocation.getCurrentPosition(mmypage.orderCancelStore.onSuccessGeolocation, mmypage.orderCancelStore.onErrorGeolocation, {timeout: 10000});
            } else {
                document.getElementById("map").innerHTML = "<p>사용자의 브라우저는 지오로케이션을 지원하지 않습니다.</p>";
            }
        }else{
            PagingCaller.init({
                callback : function(){
                    var param = {
                            pageIdx    : PagingCaller.getNextPageIdx(),
                            searchType : type,
                            searchWord : searchWord,
                            rgn1 : rgn1,
                            rgn2 : rgn2,
                            usrLat : $("#usrLat").val(),
                            usrLng : $("#usrLng").val(),
                            strRetYn : "Y"
                    }
                    common.Ajax.sendJSONRequest(
                            "GET"
                            , _baseUrl + "store/getStoreListJson.do"
                            , param
                            , mmypage.orderCancelStore._callbackSearchStoreListAjax);
                }
            ,startPageIdx : 0
            ,subBottomScroll : 700
            ,initCall : true
            });
        }
        $('html, body').scrollTop(0);
    },
    //응답받은 데이터를 노출시킨다
    _callbackSearchStoreListAjax : function (strData){
        var type = mmypage.orderCancelStore.searchType;

        if(strData.pageIdx == 1){
            if(type == 'word'){
                $("#searchWordDiv .reShop_result").remove();
            }else if(type == 'area'){
                $("#searchAreaDiv .reShop_result").remove();
            }

            var $dlResult = $("<dl>").addClass("reShop_result");
            $ddCount = $("<dd class='no_ico'>").text(strData.totalCount+_messageCount2);

            $dlResult.append($ddCount);

            if(type == 'word'){
                $("#searchWordDiv").append($dlResult);
                $("#storeListByWord").find(".mlist-reShop").empty();
            }else if(type == 'area'){
                $("#searchAreaDiv").append($dlResult);
                $("#storeListByArea").find(".mlist-reShop").empty();
            }
        }

        $("#noStoreList").hide();

        var length = 0;
        if(!common.isEmpty(strData.storeList)){
            length = strData.storeList.length;
        }

        if(length > 0){
            if(type == 'word'){
                mmypage.orderCancelStore.makeStoreList($("#storeListByWord").find(".mlist-reShop"),strData.storeList,type);
            }else if(type == 'area'){
                mmypage.orderCancelStore.makeStoreList($("#storeListByArea").find(".mlist-reShop"),strData.storeList,type);
            }
        }else{ //조회된 리스트가 없는 경우
            if(strData.pageIdx == 1){
                if(type == 'word'){
                    $("#searchWordDiv").find(".reShop_result > dd").remove();
                }else if(type == 'area'){
                    $("#searchAreaDiv").find(".reShop_result > dd").remove();
                }

                $("#noStoreList").css("display","block");
            }
            PagingCaller.destroy();
        }
    },
    // Ajax로 가져온 매장목록을 그려줌. (직접검색, 지역검색)
    makeStoreList :  function(area, list, type){
        var dispArea = area;
        var dispList = list;
        var dispType = type;

        $.each(dispList, function(index, element){

            var tmpDist;

            tmpDist = Number(element.dist) + "km";

            if(!mmypage.orderCancelStore.isGeoLocation) {
                tmpDist = "";
            }

            var $li = $("<li>");
            var idNmTxt = [element.strNo]
            if(dispType == 'word'){
                idNmTxt.push("li_word");
            }else{
                idNmTxt.push("li_area");
            }
            $li.attr("id",idNmTxt.join(""));
            var $divReInner = $("<div>").addClass("li_reInner");

            var $h4Tit = $("<h4>").addClass("tit");
            var $a = $("<a>").attr("href","javascript:;").text(element.strNm);

            var $buttonMap = $("<button>").addClass("mapOp");
            $buttonMap.click(function(){mmypage.orderCancelStore.storeMapInit(element.lat, element.lng, element.strNo, $(this), dispType)});
            $a.click(function(){mmypage.orderCancelStore.storeMapInit(element.lat, element.lng, element.strNo, $buttonMap, dispType);});

            $h4Tit.append($a);
            $h4Tit.append($buttonMap);

            var $spanDist = $("<span>").addClass("reShop_way").text(tmpDist);
            $h4Tit.append($spanDist);
            $divReInner.append($h4Tit);

            var $pAddr = $("<p>").addClass("addr");
            if(!common.isEmpty(element.addr)){
                $pAddr.text(element.addr);
            }
            $divReInner.append($pAddr);

            var $divArea = $("<div>").addClass("area");
            $divReInner.append($divArea);

            var $divStoreTime = $("<div>").addClass("storeTime").text("영업시간 "+element.strBizInfo);
            $divArea.append($divStoreTime);

            if(!common.isEmpty(element.phon)){
                var $buttonCall = $("<button>").addClass("call").text(element.phon);
//              $buttonCall.click(function(){mmypage.orderCancelStore.setCallEvent($(this));});
                $divArea.append($buttonCall);
            }

            if(!common.isEmpty(element.openYn)){
                var $divOpenYn;
                if(element.openYn == 'Y'){
                    $divOpenYn = $("<div class='time on'>").text("영업중");
                }else{
                    $divOpenYn = $("<div class='time'>").text("영업준비중");
                }
                $divArea.append($divOpenYn);
            }

            var $divMapArea = $("<div class='api_mapArea'>");
            $divMapArea.css('display', 'none');
            var $divStoreWay = $("<div class='store_wayP'>");
            if(dispType == 'word'){
                $divStoreWay.attr('id',element.strNo+'map_word');
            }else{
                $divStoreWay.attr('id',element.strNo+'map_area');
            }

            $divMapArea.append($divStoreWay);
            $divReInner.append($divMapArea);

            var $inputStrNo = $("<input>").attr("type","hidden").attr("name","storeNo").val(element.strNo);
            var $inputStrLat = $("<input>").attr("type","hidden").attr("name","strLat").val(element.lat);
            var $inputStrLng = $("<input>").attr("type","hidden").attr("name","strLng").val(element.lng);
            var $inputDist = $("<input>").attr("type","hidden").attr("name","strDist").val(tmpDist);

            $li.append($divReInner);
            $li.append($inputStrNo);
            $li.append($inputStrLat);
            $li.append($inputStrLng);
            $li.append($inputDist);

            dispArea.append($li);
        });
    },
    // 매장상세 페이지 이동
    setMapEvent : function(strNo, dist, openYn){
        var $tabList = $("#TabsOpenArea li");

        var mainAreaIdx = $("#mainAreaList option").index($("#mainAreaList option:selected"));
        var subAreaIdx = $("#subAreaList option").index($("#subAreaList option:selected"));

        if(mainAreaIdx != 0){
            sessionStorage.setItem("mainAreaIdx", mainAreaIdx);
        }
        if(subAreaIdx != 0){
            sessionStorage.setItem("subAreaIdx", subAreaIdx);
        }

        if($tabList.eq(0).find("a").hasClass("on")){
            localStorage.setItem("tab", "wordTab");
            localStorage.setItem("searchWord", $("#searchWord").val());
        }else if($tabList.eq(1).find("a").hasClass("on")){
            localStorage.setItem("tab", "areaTab");
        }else if($tabList.eq(2).find("a").hasClass("on")){
            localStorage.setItem("tab", "favorTab");
        }else{
            localStorage.setItem("tab", "itemTab");
        }

        localStorage.setItem("searchType", $("#searchType").val());

        localStorage.setItem("openYn", $("#openYn").val());
        localStorage.setItem("tcCd", $("#tcCd").val());
        localStorage.setItem("psCd", $("#psCd").val());

        common.link.moveStoreDetailPage(strNo, dist, openYn);
    },

    // 매장 위치 지도에서 확인하기
    storeMapInit : function(lat, lng, strNo, obj, type) {
        var $listUl;
        var $divMap;
        if(type == 'word'){
            $listUl = $("#storeListByWord").find(".mlist-reShop");
            $divMap = $("#"+strNo + "map_word");
        }else{
            $listUl = $("#storeListByArea").find(".mlist-reShop");
            $divMap = $("#"+strNo + "map_area");
        }

        try {
            if (obj.hasClass("on")) {
                $divMap.parent().slideToggle();
            }
            else {
                if($divMap.hasClass("load")) {
                    $(".mapOp", $listUl).removeClass("on");
                    $(".store_wayP", $listUl).parent().hide();
                    $divMap.parent().slideToggle();
                }
                else {
                    if(!common.isEmpty(lat) && !common.isEmpty(lng)) {
                        $(".mapOp", $listUl).removeClass("on");
                        $(".store_wayP", $listUl).parent().hide();
                        $divMap.parent().slideToggle();
                        var mapContainer = document.getElementById(strNo+'map_'+type) // 지도 영역
                        var mapOption = {
                            center: new daum.maps.LatLng(lat, lng), // 지도 중심좌표(위도,경도)
                            level: 2 // 지도 확대 레벨
                        };
                        var map = new daum.maps.Map(mapContainer, mapOption); // 지도 생성
                        var markerImage = new daum.maps.MarkerImage(_imgUrl + 'comm/point_way.png' , new daum.maps.Size(21, 31)); // 마커 이미지 생성

                        var markerPosition = new daum.maps.LatLng(lat, lng); // 마커 위치
                        var marker = new daum.maps.Marker({
                            map: map, // 마커를 표시할 지도
                            position: markerPosition,
                            image : markerImage // 마커 이미지
                        }); // 마커 생성
                        marker.setMap(map); // 마커 표시
                        $divMap.addClass("load");
                    }
                }
            }
            obj.toggleClass("on");
        }
        catch(e) {
            console.log(e);
            $(".mapOp", $listUl).removeClass("on");
            $(".store_wayP", $listUl).parent().hide();
        }
    },

    // 매장 관심 등록/해제 이벤트
    setStarEvent : function(obj){
        var activeFlag = obj.hasClass('on');
        var strNo = obj.parent().nextAll("input[name*='storeNo']").val();
        if (activeFlag == true){
            mmypage.orderCancelStore.delFavorStoreAjax(strNo , obj);
        }else{
            mmypage.orderCancelStore.regFavorStoreAjax(strNo , obj);
        }
    },
    // 매장 관심 해제 Ajax
    delFavorStoreAjax : function(strNo , obj) {
        if(!mmypage.orderCancelStore.logincheck(strNo)){
            return;
        }

        if(mmypage.orderCancelStore.isProcessing) {
            mmypage.orderCancelStore.isProcessing = true;
            return false;
        }

        mmypage.orderCancelStore.favorObj = $(obj);

        common.Ajax.sendJSONRequest(
                "POST"
                , _baseUrl + "store/delFavorStoreJson.do"
                , "strNo="+ strNo
                , mmypage.orderCancelStore._callback_delFavorStoreAjax
                , false);
    },

    //매장 관심 해제 Callback
    _callback_delFavorStoreAjax : function(strData) {
        if(strData.ret == "0"){
            common.gnb.callSlideMenuAjax();
            var onFlag = mmypage.orderCancelStore.favorObj.hasClass("on");
            var favorCountObj = (mmypage.orderCancelStore.favorObj.parent(".li_reInner").length > 0) ?
                    mmypage.orderCancelStore.favorObj.parent(".li_reInner").find(".fv_reShop_in").find("span") :
                        mmypage.orderCancelStore.favorObj.parents().find(".fv_reShop_in").find("span");
                    if(onFlag) {
                        var cnt = parseInt(replaceAll(favorCountObj.text(), ',', ''))-1;
                        favorCountObj.text(cnt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                        mmypage.orderCancelStore.favorObj.removeClass("on");
                        mmypage.orderCancelStore.favorObj.addClass("active");
                    }

                    mmypage.orderCancelStore.favorCount --;

                    if($(".reShop_favInner").length > 0 ) {
                        var cnt = parseInt($(".reShop_favInner").find("span").find("b").text())-1;
                        $(".reShop_favInner").find("span").find("b").text(cnt);
                    }
        }else{
            common.loginChk();
        }
        mmypage.orderCancelStore.isProcessing = false;
    },
    // 매장 관심 등록 Ajax
    regFavorStoreAjax : function(strNo, obj) {
        mmypage.orderCancelStore.buttonStarClickPreStoreNo = strNo;

        if(mmypage.orderCancelStore.isProcessing){
            mmypage.orderCancelStore.isProcessing = true;
            return false;
        }

        if(!mmypage.orderCancelStore.logincheck(strNo)){
            mmypage.orderCancelStore.buttonStarClickCnt = 0;
            mmypage.orderCancelStore.buttonStarClickPreStoreNo = "";
            return;
        }

        if(mmypage.orderCancelStore.favorCount  >= 3){
            alert(_messageLimit);
            mmypage.orderCancelStore.buttonStarClickCnt = 0;
            mmypage.orderCancelStore.buttonStarClickPreStoreNo = "";
            return;
        }

        mmypage.orderCancelStore.favorObj = $(obj);

        common.Ajax.sendJSONRequest(
                "POST"
                , _baseUrl + "store/regFavorStoreJson.do"
                , "strNo="+ strNo
                , mmypage.orderCancelStore._callback_regFavorStoreAjax
                , false);
    },

    // 매장 관심 등록 Callback
    _callback_regFavorStoreAjax : function(strData) {
        if(strData.ret == "0" || strData.ret == "20" || strData.ret == "30"){
            common.gnb.callSlideMenuAjax();
        }else if(strData.ret == "40"){
            // 관심매장 쿠폰 첫 1회 발급
            mmypage.orderCancelStore.dimClickCnt++;

            $("#linkUrl").prop('href', "javascript:common.link.commonMoveUrl('"+strData.linkUrl+"');");
            $("#layerPop").html($("#storeEvtLayer").html());
            $("#layerPop").removeClass('popInner');

            common.popLayerOpen("LAYERPOP01");
        }else if(strData.ret == "10") {
            var onFlag = mmypage.orderCancelStore.favorObj.hasClass("active");
            var favorCountObj = (mmypage.orderCancelStore.favorObj.parent(".li_reInner").length > 0) ?
                    mmypage.orderCancelStore.favorObj.parent(".li_reInner").find(".fv_reShop_in").find("span") :
                    mmypage.orderCancelStore.favorObj.parents().find(".fv_reShop_in").find("span");
            if(onFlag) {
                var cnt = parseInt(replaceAll(favorCountObj.text(), ',', ''))+1;
                favorCountObj.text(cnt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                mmypage.orderCancelStore.favorObj.removeClass("active");
                mmypage.orderCancelStore.favorObj.addClass("on");
            }

            mmypage.orderCancelStore.favorCount ++;
            if($(".reShop_favInner").length > 0 ) {
                var cnt = parseInt($(".reShop_favInner").find("span").find("b").text())+1;
                $(".reShop_favInner").find("span").find("b").text(cnt);
            }
        } else{
            common.loginChk();
        }
        mmypage.orderCancelStore.isProcessing = false;
    },
    // 전화 아이콘 클릭 이벤트
    setCallEvent :  function(obj){
        var phoneNum = obj.text();
        $(location).attr('href', "tel:"+ phoneNum);
    },
    // GPS 수신유무에 따른 매장목록 불러오기 Ajax
    storeListAjax : function(geoFlag , position){

        if(mmypage.orderCancelStore.isGeoLocationCall){
            mmypage.orderCancelStore.isGeoLocationCall = false;
        }else{
            return;
        }
        var lat = null;
        var lon = null;

        if(geoFlag) {
            lon=  position.coords.longitude;//경도
            lat = position.coords.latitude;//위도
            $("#usrLat").val(lat);
            $("#usrLng").val(lon);
        } else {
            localStorage.setItem("useLoc", "N");
            mmypage.orderCancelStore.isGeoLocation = false;
            $(".useLocRecom").hide();
        }

        PagingCaller.destroy();

        PagingCaller.init({
            callback : function(){
                var param = {
                        pageIdx    : PagingCaller.getNextPageIdx(),
                        searchType : mmypage.orderCancelStore.searchType,
                        usrLat : $("#usrLat").val(),
                        usrLng : $("#usrLng").val(),
                        strRetYn : "Y"
                }
                _ajax.sendJSONRequest(
                        "GET"
                        , _baseUrl + "store/getStoreListJson.do"
                        , param
                        , mmypage.orderCancelStore._callbackSearchStoreListAjax);
            }
        ,startPageIdx : 0
        ,subBottomScroll : 700
        ,initCall : true
        });
    },
    // 직접검색 검색바 엔터 이벤트
    searchStoreList :  function(e){
        if (e.keyCode != 13) {
            return;
        }
        e.preventDefault();
        $("#searchWord").blur();
        $("#searchType").val("word");
        mmypage.orderCancelStore.searchStoreMain('word');
    },
    // 지역검색 지역 선택시 Ajax
    getSubAreaListAjax : function() {
        var rgn1 = $("#mainAreaList option:selected").val();
        if (rgn1 != 'none'){
            $("#mainAreaList").addClass("act");
            common.Ajax.sendJSONRequest(
                    "POST"
                    , _baseUrl + "store/getStoreSubAreaListJson.do"
                    , "rgn1="+ rgn1
                    , mmypage.orderCancelStore._callback_getSubAreaListAjax
                    , false);
        }
        else {
            $("#mainAreaList").removeClass("act");
            $("#subAreaList").find("option:eq(0)").prop("selected", true);
            $("#subAreaList").find("option:eq(0)").siblings().remove();
        }
        $("#subAreaList").removeClass("act");
    },
    // 지역검색 지역 선택시 Callback
    _callback_getSubAreaListAjax : function(retData) {
        $('#subAreaList').attr('disabled', false);
        if(retData == ''){
            $('#subAreaList').attr('disabled', true);
        }
        mmypage.orderCancelStore.makeSelectboxList($("#subAreaList"),_optionRgn2,retData);
    },
    // 서브지역 동적생성
    makeSelectboxList :  function(area, title, list){
        var dispArea = area;
        var dispList = list;
        var rgn2Selected = area.attr("data-rgn2");

        var $option = $("<option>");
        $option.val("none").text(title).prop("selected",true);

        dispArea.empty().append($option);

        $.each(dispList, function(index, element){
            $option = $("<option>");
            $option.val(element).text(element);
            $option.val(element).text(element);
            if(!common.isEmpty(rgn2Selected)){
                if(rgn2Selected == element){
                    $option.prop("selected",true);
                }
            }
            dispArea.append($option);
        });
    },
    // 로그인 체크
    logincheck : function(strNo){
        if(common.isLogin() == false){

            if(!confirm(_messageLoginCheck)){
                return false;
            }else{
                common.link.moveLoginPage();
                return false;
            }
        }
        return true;
    },
    // 지오로케이션 사용O Calback
    onSuccessGeolocation : function(position) { //Geolocation succ
        setTimeout(function() {
            mmypage.orderCancelStore.storeListAjax(true,position);
        }, 500);
    },
    //지오로케이션 사용X Calback
    onErrorGeolocation : function(error) { //Geolocation error
        setTimeout(function() {
            mmypage.orderCancelStore.storeListAjax(false,null);
        }, 500);
    },
    // 검색바 이벤트
    fnSearchSet : function (obj){
        if(obj.val() != '' && obj.val() != null){
            obj.parent().find('.btn_sch_del').addClass('on');
        }
        else{
            obj.parent().find('.btn_sch_del').removeClass('on');
        }
    },
    // 매장반품 서비스 안내 열기
    openQuickPop : function(){
        $(window).scrollTop(0.0); //추가부분
        $('#pop-full-title').html("오늘드림 서비스 안내");
        $('body').css({'background-color' : '#fff'}); /* 2016-12-12 퍼블리싱 수정 반영 */
        $('#infoStoreReturnQuestion').hide();
        $('#pop-full-wrap').empty().html($('#infoStoreReturnQuestion').html());
        $('#pop-full-wrap').show();
        $('#mWrapper').hide();
        $(document).scrollTop(0);
        closeBtnAction = function(){
            $('#mWrapper').css('display','block');
            $('#pop-full-wrap').empty();
            $('#infoStoreReturnQuestion').hide();
        }
    }
};
$.namespace('mmypage.common');
mmypage.common = {
    // firstFlag : 해당 팝업이 켜지는 시점이 주문리스트인지, 반품가능매장팝업이 꺼진 후 실행되는 지, 구분하는 값
    //  - Y : 초기진입 (주문목록에서 진입)에 실행
    //  - N : 반품가능매장팝업 닫기 후 실행
    searchTrackingPop : function(obj, firstFlag){
        if(firstFlag != undefined && firstFlag == 'Y'){
            common.setScrollPos2();//클릭 시, 스크롤 위치값 localstorage 저장
        }
        var params = $(obj).data();
        var trackingUrl = "";

        if (params.ordDtlSctCd == "10") {
            //데이터스토리 배송조회 추가 CBLIM 20200709
            if(params.rspCheck == "R"){
                common.wlog("mypage_giftbox_recv_lookdelivery");
            }else{
                common.wlog("mypage_giftbox_send_lookdelivery");
            }
            //데이터스토리 배송조회 추가 CBLIM 20200709
            trackingUrl = _baseUrl + "mypage/popup/getDeliveryDetail.do";
        } else if (params.ordDtlSctCd == "30" || params.ordDtlSctCd == "40") {
            trackingUrl = _baseUrl + "mypage/popup/getClaimDeliveryDetail.do";
        }

        if (trackingUrl != "") {
            $('#pop-full-contents', $("#pop-full-wrap")).html("");
            $('#pop-full-contents', $("#pop-full-wrap")).load(trackingUrl, params, function() {
                if (params.ordDtlSctCd == "30") {
                    if(params.rtnProcSctCd != "" && params.rtnProcSctCd != null){
                        mmypage.orderCancelStore.popFullOpen('pop-full-wrap','반품정보 조회');
                    }else{
                        mmypage.orderCancelStore.popFullOpen('pop-full-wrap','회수조회');
                    }
                } else if (params.ordDtlSctCd == "40") {
                    mmypage.orderCancelStore.popFullOpen('pop-full-wrap','교환 회수/배송 조회');
                } else {
                    mmypage.orderCancelStore.popFullOpen('pop-full-wrap','배송조회');
                }
            });
        }
    },

    // firstFlag : 해당 팝업이 켜지는 시점이 주문리스트인지, 반품가능매장팝업이 꺼진 후 실행되는 지, 구분하는 값
    //  - Y : 초기진입 (주문목록에서 진입)에 실행
    //  - N : 반품가능매장팝업 닫기 후 실행
    showCancelCausInfo : function(obj, firstFlag){
        var params = $(obj).data();
        var popTitle = {
            20 : '주문취소 상세정보',
            30 : '반품 상세정보',
            40 : '교환 상세정보'
        };

        if(firstFlag != undefined && firstFlag == 'Y'){
            common.setScrollPos2();//클릭 시, 스크롤 위치값 localstorage 저장
        }
        $('#pop-full-contents', $("#pop-full-wrap")).html('');
        $('#pop-full-contents', $("#pop-full-wrap")).load(_baseUrl + 'mypage/popup/getCancelCausPop.do', params, function(){
            mmypage.orderCancelStore.popFullOpen('pop-full-wrap',popTitle[params.chgAccpSctCd == '' ? params.ordDtlSctCd : params.chgAccpSctCd]);

            //자세히보기 버튼 클릭시 매장반품주문에 대한 바코드 처리
            var rtnBarcode = $("#rtnBarcode").text();
            if(rtnBarcode != ""){
                if(rtnBarcode != "N"){
                    $(".barcode").barcode(rtnBarcode, "code128",{barWidth:2, barHeight:75, fontSize:14});
                }else{
                    alert("비정상적인 접근입니다.");
                    mmypage.orderCancelStore.popFullClose('pop-full-wrap');
                }
            }
        });
    },

    hdcOpen : function(p1, p2) {
        try {
            var path = HDC_PATH[p1] + p2;
            window.open(path);
        } catch(e) {
            console.log(e);
        }
    },

    dlvInfoShow : function(obj, ordDtlSctNm) {
        var _this = $(obj);
        var _devInner = _this.siblings('.inner');
        if (_this.hasClass('on')) {
            _this.removeClass('on');
            _this.html(ordDtlSctNm + ' 상세 현황 보기<span>열기</span>');
            _devInner.removeClass('on').scrollTop(0);
        } else {
            _this.addClass('on');
            _this.html(ordDtlSctNm + ' 상세 현황 접기<span>닫기</span>');
            _devInner.addClass('on');
        }
    }
};
