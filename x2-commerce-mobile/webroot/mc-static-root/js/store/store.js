$.namespace("mstore.common"); 
mstore.common = {

    _ajax : common.Ajax,
    favorCount : 0,
    viewMode : 'main',
    buttonStarClickCnt : 0, //관심매장 등록 클릭 수
    buttonStarClickPreStoreNo : "", //관심매장 등록 이전 클릭 매장번호
    dimClickCnt : 0,
    isProcessing: false,
    favorObj : null,
    isGeoLocation : true,
    isGeoLocationCall : false,
    
    // 로그인 체크
    logincheck : function(strNo){
        var viewMode = mstore.common.viewMode;
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

    // 관심매장 리스트 가져오기 Ajax
    getFavorStoreListAjax : function(){
        var useLoc = localStorage.getItem("useLoc") == 'Y' ? true : false;
        
        if(useLoc){//위치정보 허용
            if (navigator.geolocation) {
                mstore.common.isGeoLocationCall = true;
                navigator.geolocation.getCurrentPosition(mstore.main.onSuccessGeolocation, mstore.main.onErrorGeolocation, {timeout: 10000});
            } else {
                document.getElementById("map").innerHTML = "<p>사용자의 브라우저는 지오로케이션을 지원하지 않습니다.</p>";
                mstore.common.isGeoLocation = false;
            }           
        }else{//불허용
            var param = {
                    openYn : $("#openYn").val(),
                    tcCd :   $("#tcCd").val(),
                    psCd :   $("#psCd").val(),
                    usrLat : $("#usrLat").val(),
                    usrLng : $("#usrLng").val()
            }
            common.Ajax.sendJSONRequest(
                    "POST"
                    , _baseUrl + "store/getFavorStoreListJson.do"
                    , param
                    , mstore.common._callback_getFavorStoreListAjax);
        }
    },

    // 관심매장 리스트 가져오기 Callback
    _callback_getFavorStoreListAjax : function(strData) {
        mstore.common.favorCount = strData.totalCount;
        var list = strData.storeList;
        
        $(".reShop_favInner").remove();
        $("#storeListByFavor").find(".mlist-reShop").empty();
        $("#noFavorList").hide();
        $("#noSearchOptionFavorList").hide();
        
        if(common.isLogin() == true){
            if(mstore.common.favorCount > 0){
                
                var $divSearchFavor = $('#searchFavorDiv');
                var $divFavInner = $("<div>").addClass("reShop_favInner");
                var $pResult = $("<p>");
                var $mbrNm = $("<b>").text($("#mbrNm").val());
                $pResult.append($mbrNm).append("님이<br>등록하신");
                var $spanTmp = $("<span>").text(" 관심매장은 총 ");
                var $fvCnt = $("<b>").text(mstore.common.favorCount);
                $spanTmp.append($fvCnt).append("개");
                $pResult.append($spanTmp);
                $pResult.append(" 입니다.");

                $divFavInner.append($pResult);
                $divSearchFavor.append($divFavInner);
                
                mstore.main.makeStoreList($("#storeListByFavor").find(".mlist-reShop"),strData.storeList,"favorStoreArea");

            }else{
                
                var openYn = $("#openYn").val();
                var tcCd = $("#tcCd").val();
                var psCd = $("#psCd").val();
                
                if($("#searchFavorTab").find("a").hasClass("on")){
                    if((tcCd == "" || tcCd == null) && (psCd == "" || psCd == null)) {
                        if(openYn == "Y"){
                            $("#noSearchOptionFavorList").css("display","block");
                        }else{
                            var $divNoFavorList = $("#noFavorList");
                            var $dlNoList = $divNoFavorList.find(".no_list");
                            if($("#noFavorList .no_list>dt").length < 1){
                                var $dtResult = $("<dt>").text($("#mbrNm").val()).append(" 님이<br />등록하신 관심매장이 없습니다.")
                                $dlNoList.prepend($dtResult);
                            }
                            $divNoFavorList.css("display","block");
                        }
                    }else {
                        $("#noSearchOptionFavorList").css("display","block");
                    }
                }
            }
        }else{
            $('#loginCheck').css("display","block");
        }
    },

    // 매장 관심 등록 Ajax
    regFavorStoreAjax : function(strNo, obj) {
        mstore.common.buttonStarClickPreStoreNo = strNo;
        
        if(mstore.common.isProcessing){
            mstore.common.isProcessing = true;
            return false;
        }
        
        if(!mstore.common.logincheck(strNo)){
            mstore.common.buttonStarClickCnt = 0;
            mstore.common.buttonStarClickPreStoreNo = "";
            return;
        }

        if(mstore.common.favorCount  >= 3){
            alert(_messageLimit);
            mstore.common.buttonStarClickCnt = 0;
            mstore.common.buttonStarClickPreStoreNo = "";
            return;
        }
        
        mstore.common.favorObj = $(obj);
        
        common.Ajax.sendJSONRequest(
                "POST"
                , _baseUrl + "store/regFavorStoreJson.do"
                , "strNo="+ strNo
                , mstore.common._callback_regFavorStoreAjax
                , false);
    },
    
    // 매장 관심 등록 Callback
    _callback_regFavorStoreAjax : function(strData) {
        var viewMode = mstore.common.viewMode;

        if(strData.ret == "0" || strData.ret == "20" || strData.ret == "30"){
            common.gnb.callSlideMenuAjax();
        }else if(strData.ret == "40"){
            // 관심매장 쿠폰 첫 1회 발급
            mstore.common.dimClickCnt++;
            
            $("#linkUrl").prop('href', "javascript:common.link.commonMoveUrl('"+strData.linkUrl+"');");
            $("#layerPop").html($("#storeEvtLayer").html());
            $("#layerPop").removeClass('popInner');
            
            common.popLayerOpen("LAYERPOP01");
        }else if(strData.ret == "10") {
            var onFlag = mstore.common.favorObj.hasClass("active");
            var favorCountObj = (mstore.common.favorObj.parent(".li_reInner").length > 0) ?
                    mstore.common.favorObj.parent(".li_reInner").find(".fv_reShop_in").find("span") :
                    mstore.common.favorObj.parents().find(".fv_reShop_in").find("span");
            if(onFlag) {
                var cnt = parseInt(replaceAll(favorCountObj.text(), ',', ''))+1;
                favorCountObj.text(cnt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                mstore.common.favorObj.removeClass("active");
                mstore.common.favorObj.addClass("on");
            }
            
            mstore.common.favorCount ++;
            if($(".reShop_favInner").length > 0 ) {
                var cnt = parseInt($(".reShop_favInner").find("span").find("b").text())+1;
                $(".reShop_favInner").find("span").find("b").text(cnt);
            }
            // 관심매장 리스트 갱신
            mstore.common.getFavorStoreListAjax();
        } else{
            common.loginChk();
        }
        mstore.common.isProcessing = false;
    },

    // 매장 관심 해제 Ajax
    delFavorStoreAjax : function(strNo , obj) {
        if(!mstore.common.logincheck(strNo)){
            return;
        }
        
        if(mstore.common.isProcessing) {
            mstore.common.isProcessing = true;
            return false;
        }
        
        mstore.common.favorObj = $(obj);

        common.Ajax.sendJSONRequest(
                "POST"
                , _baseUrl + "store/delFavorStoreJson.do"
                , "strNo="+ strNo
                , mstore.common._callback_delFavorStoreAjax
                , false);
    },

    //매장 관심 해제 Callback
    _callback_delFavorStoreAjax : function(strData) {
        var viewMode = mstore.common.viewMode;

        if(strData.ret == "0"){
            common.gnb.callSlideMenuAjax();
            var onFlag = mstore.common.favorObj.hasClass("on");
            var favorCountObj = (mstore.common.favorObj.parent(".li_reInner").length > 0) ?
                    mstore.common.favorObj.parent(".li_reInner").find(".fv_reShop_in").find("span") :
                    mstore.common.favorObj.parents().find(".fv_reShop_in").find("span");
            if(onFlag) {
                var cnt = parseInt(replaceAll(favorCountObj.text(), ',', ''))-1;
                favorCountObj.text(cnt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                mstore.common.favorObj.removeClass("on");
                mstore.common.favorObj.addClass("active");
            }
            
            mstore.common.favorCount --;
            
            if($(".reShop_favInner").length > 0 ) {
                var cnt = parseInt($(".reShop_favInner").find("span").find("b").text())-1;
                $(".reShop_favInner").find("span").find("b").text(cnt);
            }

            // 관심매장 리스트 갱신
            mstore.common.getFavorStoreListAjax();
        }else{
            common.loginChk();
        }
        mstore.common.isProcessing = false;
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
    
    // 201912 fixed
    // 매장 관심 등록/해제 이벤트
    setStarEvent : function(obj,viewMode){
        var activeFlag = obj.hasClass('on');
        var strNo = obj.parent().nextAll("input[name*='storeNo']").val();
        if (activeFlag == true){
            mstore.common.delFavorStoreAjax(strNo , obj);
        }else{
            mstore.common.regFavorStoreAjax(strNo , obj);
        }
    },
    
    // 전화 아이콘 클릭 이벤트
    setCallEvent :  function(obj){
        var phoneNum = obj.text();
        $(location).attr('href', "tel:"+ phoneNum);
    },

    // 매장 갯수 반환
    getLength : function(list){
        var length = 0;
        if(!common.isEmpty(list)){
            length = list.length;
        }
        return length;
    },

};

$.namespace("mstore.main");
mstore.main.searchType = 'new';
mstore.main = {
    _ajax : common.Ajax,
    globalStrNo : "",
    _totalPageCount : 999,
    
    wordTabActivateFlag : 'N',
    areaTabActivateFlag : 'N',
    favorTabActivateFlag : 'N',
    itemTabActivateFlag : 'N',
    
    isAjaxProcessing : false,
    isAutoComplete : false,

    // 매장정보 초기화
    init : function(){
        mstore.main.fnBeforeSet();
        mstore.main.fnEventSet();
        mstore.main.fnSearchContents();
        
        if(starCount == null || starCount == undefined || starCount == "") {
            starCount = 0;
        }
        
        mstore.common.favorCount = starCount;
    } ,
    
    //mstore.main init 시 최초 세팅
    fnBeforeSet : function (){
        // 주변매장 가능 여부
        var isNearAvail = true;
        
        // 앱여부
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
                
                isNearAvail = false;
                
            }
        }
        
        if(common.app.appInfo.isapp){
            location.href = "oliveyoungapp://getLocationSettings";
        }else{
            localStorage.setItem("useLoc", "Y");
        }
        
        if(localStorage.getItem("searchType") != null){
            $("#searchType").val(localStorage.getItem("searchType"));
        }else{
        	if($("#searchType").val() == 'favor'){
        		localStorage.setItem("searchType", "favor");
        	}
        }
        
        if(localStorage.getItem("tab") != null){
            $("#tabType").val(localStorage.getItem("tab"));
        }else{
        	if($("#tabType").val() == 'favorTab'){
        		localStorage.setItem("tab", "favorTab");
        	}
        }
        
        if(localStorage.getItem("openYn") != null){
            $("#openYn").val(localStorage.getItem("openYn"));
        }
        
        if(localStorage.getItem("tcCd") != null){
            $("#tcCd").val(localStorage.getItem("tcCd"));
        }
        
        if(localStorage.getItem("psCd") != null){
            $("#psCd").val(localStorage.getItem("psCd"));
        }
        
        if(sessionStorage.getItem("searchItemNo") != null){
            $("#searchItemNo").val(sessionStorage.getItem("searchItemNo"));
        }
        
        if(sessionStorage.getItem("searchItemLgcNo") != null){
            $("#searchItemLgcNo").val(sessionStorage.getItem("searchItemLgcNo"));
        }
        
        if(sessionStorage.getItem("mainAreaIdx") != null){
            $("#mainAreaList option:eq("+sessionStorage.getItem("mainAreaIdx")+")").attr("selected","selected");
            mstore.main.getSubAreaListAjax();
        }
        if(sessionStorage.getItem("subAreaIdx") != null){
            $("#subAreaList option:eq("+sessionStorage.getItem("subAreaIdx")+")").attr("selected","selected");
        }
        
        if(localStorage.getItem("searchWord") != null){
            $("#searchWord").val(localStorage.getItem("searchWord"));
        }
        
//------------------------------------------------------------------------------------------------------------------------------        
        
        if(localStorage.getItem("tab") == null || localStorage.getItem("tab") == 'wordTab'){
            $("#searchWordTab > a").addClass("on");
            $("#searchWordDiv").css("display" , "block");
            $("#storeListByWord").show();
            
            if($("#searchType").val() == 'new'){
                mstore.main.isAjaxProcessing = true;
                mstore.main.getNewStoreListByWordAjax();
            }else{
                if($("#searchWord").val() != '' && $("#searchWord").val() != null){
                    mstore.main.isAjaxProcessing = true;
                    mstore.main.getSearchWordStoreListAjax();
                }else{
                    mstore.main.isAjaxProcessing = true;
                    mstore.main.getNewStoreListByWordAjax();
                }
            }
            
            localStorage.removeItem("searchWord");
        }
        else if(localStorage.getItem("tab") == 'areaTab'){
            $("#searchAreaTab > a").addClass("on");
            $("#searchAreaDiv").css("display" , "block");
            $("#storeListByArea").show();
            
            $("#mainAreaList").val('none');
            $("#subAreaList").val('none');
            
            mstore.main.isAjaxProcessing = true;
            mstore.main.getSearchAreaStoreListAjax();
            
        }else if(localStorage.getItem("tab") == 'favorTab'){
            $("#searchFavorTab > a").addClass("on");
            $("#searchFavorDiv").css("display" , "block");
            $("#storeListByFavor").show();
            mstore.main.isAjaxProcessing = true;
            mstore.common.getFavorStoreListAjax();
        }else{
            $("#searchItemTab > a").addClass("on");
            $("#searchItemDiv").css("display" , "block");
            $("#storeListByItem").show();
            
            mstore.main.getSearchItemStoreListAjax();
        }
        
        localStorage.removeItem("tab");
        localStorage.removeItem("searchType");
        localStorage.removeItem("openYn");
        localStorage.removeItem("tcCd");
        localStorage.removeItem("psCd");
        
        //load시 추가제어 - 파라메타 없을때 디폴트값 제어
        var $mainAreaList = $("#mainAreaList");
        if( common.isEmpty($mainAreaList.attr("data-rgn1")) ){
            $mainAreaList.find("option:eq(0)").prop("selected",true);
        }
        var $subAreaList = $("#subAreaList");
        if( common.isEmpty($subAreaList.attr("data-rgn2")) ){
            $subAreaList.find("option:eq(0)").prop("selected",true);
        }
    },
    
    // 이벤트 세팅
    fnEventSet : function (){
        // 직접검색 탭 클릭 이벤트
        $("#searchWordTab").click(function(e){
            e.preventDefault();
            
            if($(".auto_reSch").length > 0){
                $(".auto_reSch").hide();
            }
            
            $('html').scrollTop(0);
            
            $("#tabType").val("wordTab");
            $("#searchType").val('word');
            
            $("#searchWordTab > a").addClass("on");
            $("#searchWordTab").siblings().find("a").removeClass("on");
            
            if($("#searchWord").val() != ''){
                mstore.main.isAjaxProcessing = true;
                mstore.main.getSearchWordStoreListAjax();
            }else{
                mstore.main.isAjaxProcessing = true;
                mstore.main.getNewStoreListByWordAjax();
            }
            
            $("#noStoreList").hide();
            $("#noFavorList").hide();
            $("#noSearchOptionFavorList").hide();
            $("#loginCheck").hide();
            
            // 직접검색 div 영역을 제외한 나머지 div 숨김처리
            $("#searchAreaDiv").hide();
            $("#storeListByArea").hide();
            
            $("#searchFavorDiv").hide();
            $("#storeListByFavor").hide();
            
            $("#searchItemDiv").hide();
            $("#storeListByItem").hide();
            
            // 직접검색 div 활성화
            $("#searchWordDiv").show();
            $("#storeListByWord").show();
        });

        // 지역검색 탭 클릭 이벤트
        $("#searchAreaTab").click(function(e){
            e.preventDefault();
            
            $('html').scrollTop(0);
            
            $("#tabType").val("areaTab");
            $("#searchType").val('area');
            
            $("#searchAreaTab > a").addClass("on");
            $("#searchAreaTab").siblings().find("a").removeClass("on");
            
            if($("#mainAreaList option:selected").val() != 'none'){
                mstore.main.isAjaxProcessing = true;
                mstore.main.getSearchAreaStoreListAjax();
            }else{
                mstore.main.isAjaxProcessing = true;
                mstore.main.getNewStoreListByAreaAjax();
            }
            
            $("#noStoreList").hide();
            $("#noFavorList").hide();
            $("#noSearchOptionFavorList").hide();
            $("#loginCheck").hide();
            
            // 지역검색 div 영역을 제외한 나머지 div 숨김처리
            $("#searchWordDiv").hide();
            $("#storeListByWord").hide();
            
            $("#searchFavorDiv").hide();
            $("#storeListByFavor").hide();
            
            $("#searchItemDiv").hide();
            $("#storeListByItem").hide();
            
            // 지역검색 div 활성화
            $("#searchAreaDiv").show();
            $("#storeListByArea").show();
        });
        
        // 관심매장 탭 클릭 이벤트
        $("#searchFavorTab").click(function(e){
            e.preventDefault();
            
            $('html').scrollTop(0);
            
            $("#tabType").val("favorTab");
            $("#searchType").val('favor');
            
            $("#searchFavorTab > a").addClass("on");
            $("#searchFavorTab").siblings().find("a").removeClass("on");
            
            mstore.main.isAjaxProcessing = true;
            mstore.common.getFavorStoreListAjax();
            
            $("#noStoreList").hide();
            $("#loginCheck").hide();
            
            // 관심매장 div 영역을 제외한 나머지 div 숨김처리
            $("#searchWordDiv").hide();
            $("#storeListByWord").hide();
            
            $("#searchAreaDiv").hide();
            $("#storeListByArea").hide();
            
            $("#searchItemDiv").hide();
            $("#storeListByItem").hide();
            
            // 관심매장 div 활성화
            $("#searchFavorDiv").show();
            $("#storeListByFavor").show();
        });
        
        // 판매매장 찾기 탭 클릭 이벤트
        $("#searchItemTab").click(function(e){
            e.preventDefault();
            
            if($(".auto_reSch").length > 0){
                $(".auto_reSch").show();
                $('#searchItemDiv .sch_field4').addClass('on');
            }
            
            $('html').scrollTop(0);
            
            if(mstore.main.isAjaxProcessing == false){
                $("#tabType").val("itemTab");
                $("#searchType").val('item');
            }
            
            $("#searchItemTab > a").addClass("on");
            $("#searchItemTab").siblings().find("a").removeClass("on");
            
            if(common.isEmpty($("#searchItemNo").val()) == false){
                mstore.main.getSearchItemStoreListAjax();
            }
            
            $("#noStoreList").hide();
            $("#noFavorList").hide();
            $("#noSearchOptionFavorList").hide();
            $("#loginCheck").hide();
            
            // 판매매장 찾기 div 영역을 제외한 나머지 div 숨김처리
            $("#searchWordDiv").hide();
            $("#storeListByWord").hide();
            
            $("#searchAreaDiv").hide();
            $("#storeListByArea").hide();
            
            $("#searchFavorDiv").hide();
            $("#storeListByFavor").hide();
            
            // 판매매장 찾기 div 활성화
            $("#searchItemDiv").show();
            $("#storeListByItem").show();
        });

        // 지역검색 - 지역 선택시 이벤트
        $("#mainAreaList").change(function(e){
            e.preventDefault();
            mstore.main.getSubAreaListAjax();
        });
        
        $("#subAreaList").change(function(e){
            if ($(this).val() != 'none'){
                $("#subAreaList").addClass("act");
            }
            else {
                $("#subAreaList").removeClass("act");
            }
        });

        // 매장안내 > 직접검색 검색버튼 클릭
        $("#searchWordDiv .btn_sch").click(function(e){
            e.preventDefault();
            mstore.main.searchStoreMain('word');
        });
        
        // 매장안내 > 판매매장 찾기 검색버튼 클릭
        $("#searchItemDiv .btn_sch").click(function(e){
            e.preventDefault();
            
            var $auto_reSch = $(".auto_reSch");
            var goodsNo = $auto_reSch.find("ul").find("li").eq(0).find("a").attr("id");
            var lgcNo = $auto_reSch.find("ul").find("li").eq(0).find("a").attr("data-lgcgoodsno");
            var itemNo = $auto_reSch.find("ul").find("li").eq(0).find("a").attr("data-itemno");
            
            if(mstore.main.isAutoComplete && !common.isEmpty(goodsNo) && !common.isEmpty(lgcNo)){
                
                $("#searchItemNo").val(goodsNo);
                $("#searchItemNo2").val(itemNo);
                $("#searchItemLgcNo").val(lgcNo);
                $(".auto_reSch").remove();
                $('#searchItemDiv .sch_field4').removeClass('on');
                $("#tabType").val("itemTab");
                $("#searchType").val('item');
                mstore.main.searchStoreMain2('item');
            }
        });

        // 지역검색 검색버튼 클릭
        $("#searchAreaButton").click(function(e){
            e.preventDefault();
            mstore.main.searchStoreMain('area');
        });

        //검색어 삭제 버튼 이벤트
        $('.sch_field4').find('.btn_sch_del').on({
            'click' : function(e){
                e.preventDefault();
                $(this).removeClass('on').parent().find('input[type="text"]').val('').focus();
                var _input = $(this).parent().find('input[type="text"]');
                mstore.main.fnSearchSet(_input);
            }
        });
        
        // 직접검색, 판매매장 찾기 검색바 이벤트
        $('.sch_field4').find('input[type="text"]').on({
            'keyup' : function(){
                mstore.main.fnSearchSet($(this));
            },
            'focusin' : function(){
                mstore.main.fnSearchSet($(this));
            }
        });
        
        $(".fvPop_search").click(function(e) {
            e.preventDefault();
            common.popLayerOpen("reShop_op");
            var openYn = $("#openYn").val();
            var tcCd = $("#tcCd").val();
            var psCd = $("#psCd").val();
            
            if(openYn == 'Y'){
                $("input:checkbox[id='reShop_chk']").prop("checked", true);
            }else{
                $("input:checkbox[id='reShop_chk']").prop("checked", false);
            }
            
            var $tcUl = $("#tc_list > ul");
            var $tcLiList = $tcUl.find("li");
            
            var $psUl = $("#ps_list > ul");
            var $psLiList = $psUl.find("li");
            
            for(var i = 0; i < $tcLiList.length; i++) {
                if(tcCd.indexOf($tcLiList.eq(i).find("input").val()) > -1){
                    $tcLiList.eq(i).find("button").addClass("on");
                }else {
                    $tcLiList.eq(i).find("button").removeClass("on");
                }
            }
            
            for(var i = 0; i < $psLiList.length; i++) {
                if(psCd.indexOf($psLiList.eq(i).find("input").val()) > -1){
                    $psLiList.eq(i).find("button").addClass("on");
                }else {
                    $psLiList.eq(i).find("button").removeClass("on");
                }
            }
        });
        
        $(".reShop_opList button").click(function(e) {
            e.preventDefault();
           $(this).toggleClass('on');
        });
        
        /* 적용하기 버튼 클릭시 옵션 적용 */
        $(".reShop_opSm").click(function(e) {
            e.preventDefault();
            
            var tmpArr = [];
            
            var $tcListLi = $("#tc_list li");
            
            if($("input:checkbox[id='reShop_chk']").is(":checked")){
                $("#openYn").val("Y");
            }else{
                $("#openYn").val("N");
            }
            
            if($tcListLi.find("button.on").length > 0) {
                for(var i=0; i < $tcListLi.length; i++) {
                    if($tcListLi.eq(i).find("button").hasClass("on")){
                        tmpArr.push($tcListLi.eq(i).find("input").val());
                    }
                }
                $("#tcCd").val(tmpArr.toString().replace(/,/g, ""));
            }else {
                $("#tcCd").val("");
            }
            
            tmpArr = [];
            
            var $psListLi = $("#ps_list li");
            
            if($psListLi.find("button.on").length > 0) {
                for(var i=0; i < $psListLi.length; i++) {
                    if($psListLi.eq(i).find("button").hasClass("on")){
                        tmpArr.push($psListLi.eq(i).find("input").val());
                    }
                }
                $("#psCd").val(tmpArr.toString().replace(/,/g, ""));
            }else {
                $("#psCd").val("");
            }
            
            common.popLayerClose('reShop_op');
            
            var tabType = $("#tabType").val();
            if(tabType == 'wordTab'){
                mstore.main.searchStoreMain2('word');
            }else if(tabType == 'areaTab') {
                mstore.main.searchStoreMain2('area');
            }else if(tabType == 'favorTab') {
                mstore.main.searchStoreMain2('favor');
            }else {
                mstore.main.searchStoreMain2('item');
            }
            
        });
        
        /* 초기화 버튼 클릭시 옵션 적용 */
        $(".reShop_init").click(function(e) {
            e.preventDefault();
            
            var $tcListLi = $("#tc_list li");
            
            if($tcListLi.find("button.on").length > 0) {
                for(var i=0; i < $tcListLi.length; i++) {
                    $tcListLi.eq(i).find("button").removeClass("on");
                }
            }
            
            var $psListLi = $("#ps_list li");
            
            if($psListLi.find("button.on").length > 0) {
                for(var i=0; i < $psListLi.length; i++) {
                    $psListLi.eq(i).find("button").removeClass("on");
                }
            }
            
            if($("input:checkbox[id='reShop_chk']").is(":checked")){
                $("input:checkbox[id='reShop_chk']").prop("checked", false)
            }
            
            $("#openYn").val("N");
            $("#tcCd").val("");
            $("#psCd").val("");
            
            var tabType = $("#tabType").val();
            if(tabType == 'wordTab'){
                mstore.main.searchStoreMain2('word');
            }else if(tabType == 'areaTab') {
                mstore.main.searchStoreMain2('area');
            }else if(tabType == 'favorTab') {
                mstore.main.searchStoreMain2('favor');
            }else {
                mstore.main.searchStoreMain2('item');
            }
        });
        
        $(".dim").click(function(e){
            e.preventDefault();
            // 관심매장 쿠폰 발급 -> dim 영역 선택 시
            if(mstore.common.dimClickCnt > 0){
                mstore.common.dimClickCnt = 0;
                common.gnb.callSlideMenuAjax();
                location.reload();
            }
        });
        
        $("#searchWord").on(
            "focusin focusout", function() {
                $(this).nextAll("a.btn_sch").toggleClass("on");
            }
        );
        
        $("#searchItem").on(
                "focusin focusout", function() {
                    $(this).nextAll("a.btn_sch").toggleClass("on");
                }
            );
    },
    
    //매장 재고 검색 시 상품 자동완성
    fnSearchContents : function () {
        $("input[name='searchItem']").keydown(function(e) {
            if(e.keyCode != '8'){
                
                $(this).autocomplete({
                    source: function(request, response) {
                        $.ajax({
                            type : "POST",
                            dataType : "json",
                            url : _baseUrl+"store/getAutoCompleteItemListJson.do",
                            data : { "keyword" : request.term},
                            success : function (data) {
                                mstore.main.isAutoComplete = false;
                                $(".auto_reSch").remove();
                                $('#searchItemDiv .sch_field4').removeClass('on');
                                //서버에서 json 데이터 response 후 목록에 뿌려주기 위함
                                var res = typeof data !== 'object' ? $.parseJSON(data) : data;
                                
                                if(res.itemList.length > 0) {
                                    var $divAuto = $("<div>").addClass("auto_reSch").height("150px").css("overflow","auto");
                                    var $ulAuto = $("<ul>");
                                    
                                    $.map(res.itemList, function (item) {
                                        var $li = $("<li>");
                                        var $a = $("<a>");
                                        
                                        var replaceKeyword = item.goodsNm.replace(request.term, '<span>'+request.term+'</span>');
                                        
                                        $a.html(replaceKeyword);
                                        $a.attr("href","javascript:;");
                                        $a.attr("id", item.goodsNo);
                                        $a.attr("data-lgcgoodsno", item.lgcGoodsNo);
                                        $a.attr("data-itemno", item.itemNo);
                                        
                                        $a.on("click", function() {
                                                $("input[name='searchItem']").val($a.text());
                                                $("input[name='searchItem']").focus();
                                                $("input[name='searchItemNo']").val($a.attr("id"));
                                                $("input[name='searchItemNo2']").val($a.attr("data-itemno"));
                                                $("input[name='searchItemLgcNo']").val($a.attr("data-lgcgoodsno"));
                                                $(".auto_reSch").remove();
                                                $('#searchItemDiv .sch_field4').removeClass('on');
                                                
                                                /*localStorage.setItem("searchItemNo", $("#searchItemNo").val());
                                                localStorage.setItem("searchItemLgcNo", $("#searchItemLgcNo").val());*/
                                                sessionStorage.setItem("searchItemNo", $("#searchItemNo").val());
                                                sessionStorage.setItem("searchItemLgcNo", $("#searchItemLgcNo").val());
                                                
                                                $("#tabType").val("itemTab");
                                                $("#searchType").val('item');
                                                
                                                mstore.main.getSearchItemStoreListAjax();
                                            }
                                        );
                                        $li.append($a);
                                        $ulAuto.append($li);
                                    });
                                    
                                    $divAuto.append($ulAuto);
                                    $(".sch_field4").append($divAuto);
                                    $('#searchItemDiv .sch_field4').addClass('on');
                                }
                                mstore.main.isAutoComplete = true;
                            },
                            error: function(jqxhr, status, error){
                                alert("에러가 발생하였습니다.");
                           }
                        });
                    },
                    autoFocus:true,
                    autoFocus:true,             //첫번째 값을 자동 focus한다.
                    matchContains:true,
                    minLength:2,               //1글자 이상 입력해야 autocomplete이 작동한다.
                    delay:100                 //milliseconds
                });
            }
        });
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
    
    // 지오로케이션 사용O Calback
    onSuccessGeolocation : function (position) { //Geolocation succ
        setTimeout(function() { 
            mstore.main.storeListAjax(true,position);
        }, 500);
    },

    // 지오로케이션 사용X Calback
    onErrorGeolocation : function (error) { //Geolocation error
        setTimeout(function() {
            mstore.main.storeListAjax(false,null);
        }, 500);
    },

    // 직접검색 검색바 엔터 이벤트
    searchStoreList :  function(e){
        if (e.keyCode != 13) {
            return;
        }
        e.preventDefault();
        $("#searchWord").blur();
        $("#searchType").val("word");
        mstore.main.searchStoreMain('word');
    },

    // 판매매장 찾기 검색바 엔터 이벤트
    searchStoreList2 :  function(e){
        if (e.keyCode == 13) {
            e.preventDefault();
            $("#searchItem").blur();
            
            var $auto_reSch = $(".auto_reSch");
            var goodsNo = $auto_reSch.find("ul").find("li").eq(0).find("a").attr("id");
            var lgcNo = $auto_reSch.find("ul").find("li").eq(0).find("a").attr("data-lgcgoodsno");
            
            if(mstore.main.isAutoComplete && !common.isEmpty(goodsNo) && !common.isEmpty(lgcNo)){
                $("#searchItemNo").val(goodsNo);
                $("#searchItemLgcNo").val(lgcNo);
                $(".auto_reSch").remove();
                $('#searchItemDiv .sch_field4').removeClass('on');
                $("#tabType").val("itemTab");
                $("#searchType").val('item');
                mstore.main.searchStoreMain2('item');
            }else{
                $("#searchItem").focus();
            }
        }
    },

    // 검색 이벤트 발생 시 type에 따라 분기하여 리스트 불러오기
    searchStoreMain : function(type){

        PagingCaller.destroy();
        mstore.main.searchType = type;

        if(type == 'near'){
            /*mstore.main.getSearchNearStoreHref(1);*/
        }else if(type == 'word'){
            mstore.main.getSearchWordStoreHref(1);
        }else if(type == 'area'){
            mstore.main.getSearchAreaStoreHref(1);
        }else {
            $("#tabType").val("itemTab");
            $("#searchType").val("item");
            
            $("#searchItemNo").val('');
            $("#searchItemLgcNo").val('');
            
            mstore.main.getSearchItemStoreListAjax();
        }
        $('html, body').scrollTop(0);
    },
    
    // 검색 이벤트 발생시 type에 따라 분기하여 리스트 불러오기 (매장 검색 옵션 적용하기 클릭 시 발생)
    searchStoreMain2 : function(type){
        PagingCaller.destroy();
        mstore.main.searchType = type;

        if(type == 'word'){
            mstore.main.getSearchWordStoreHref(1);
        }else if(type == 'area'){
            mstore.main.getSearchAreaStoreHref(1);
        }else if(type == 'favor'){
            mstore.common.getFavorStoreListAjax();
        }else {
            mstore.main.getSearchItemStoreListAjax();
        }
        $('html, body').scrollTop(0);
    },
    
    // 재입고 알림 버튼 클릭 이벤트 (추후 사용 예정)
    regAlimStock : function(_strNo) {
        common.openStockOffStoreAlimPop($("#searchItemNo").val(),$("#searchItemNo2").val(),_strNo);
    },

    // 201912 fixed
    // Ajax로 가져온 매장목록을 그려줌. (직접검색, 지역검색, 관심매장)
    makeStoreList :  function(area, list,viewMode){
        var dispArea = area;
        var dispList = list;

        $.each(dispList, function(index, element){
            
            var tmpDist;
            
            tmpDist = Number(element.dist) + "km";
            
            if(!mstore.common.isGeoLocation) {
                tmpDist = "";
            }
            
            var $li = $("<li>");
            
            // 201912
            var idNmTxt = [element.strNo]
            idNmTxt.push("li");
            $li.attr("id",idNmTxt.join(""));
            var $divReInner = $("<div>").addClass("li_reInner");
            
            var $buttonStar = $("<button>").addClass('star');
            if(element.favorYn == 'Y'){
                $buttonStar.addClass('on');
            }else {
                $buttonStar.addClass('active');
            }
            $buttonStar.unbind("click").click(function(){mstore.common.setStarEvent($(this),viewMode);});
            $divReInner.append($buttonStar);
            
            var $h4Tit = $("<h4>").addClass("tit");
            var $a = $("<a>").attr("href","javascript:;").text(element.strNm);
            $a.click(function(){mstore.common.setMapEvent(element.strNo, tmpDist, element.openYn);});
            
            $h4Tit.append($a);
            
            var $spanDist = $("<span>").addClass("reShop_way").text(tmpDist);
            $h4Tit.append($spanDist);
            $divReInner.append($h4Tit);

            var $pAddr = $("<p>").addClass("addr");
            if(!common.isEmpty(element.addr)){
                $pAddr.text(element.addr);
            }
            $divReInner.append($pAddr);

            // 201912

            var $divArea = $("<div>").addClass("area");
            $divReInner.append($divArea);

            if(!common.isEmpty(element.phon)){
                var $buttonCall = $("<button>").addClass("call").text(element.phon);
                $buttonCall.click(function(){mstore.common.setCallEvent($(this));});
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
            
            var $divFvInfo = $("<div>").addClass("fv_reShop_in");
            var $spanFvCount = $("<span>").text(element.intCnt.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
            $divFvInfo.append($spanFvCount);
            $($divFvInfo).append(_messageFavorInfo);
            $divReInner.append($divFvInfo);

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
    
    // 201912 fixed
    // Ajax로 가져온 매장목록을 그려줌. (판매매장 찾기)
    makeStoreList2 :  function(area, list, goodsNo, lgcGoodsNo, mbrNo, viewMode){
        var dispArea = area;
        var dispList = list;
        
        var _goodsNo = goodsNo;
        var _lgcGoodsNo = lgcGoodsNo;
        var _mbrNo = mbrNo;
        
        $.each(dispList, function(index, element){
            
            var tmpDist;

            tmpDist = Number(element.dist) + "km";
            
            if(!mstore.common.isGeoLocation) {
                tmpDist = "";
            }
            
            var $li = $("<li>");
            
            // 201912
            var idNmTxt = [element.strNo]
            idNmTxt.push("li");
            $li.attr("id",idNmTxt.join(""));
            var $divReInner = $("<div>").addClass("li_reInner");
            
            var $buttonStar = $("<button>").addClass('star');
            if(element.favorYn == 'Y'){
                $buttonStar.addClass('on');
            }else {
                $buttonStar.addClass('active');
            }
            $buttonStar.unbind("click").click(function(){mstore.common.setStarEvent($(this),viewMode);});
            $divReInner.append($buttonStar);
            
            var $h4Tit = $("<h4>").addClass("tit");
            var $a = $("<a>").attr("href","javascript:;").text(element.strNm);
            $a.click(function(){mstore.common.setMapEvent(element.strNo, tmpDist, element.openYn);});
            
            $h4Tit.append($a);
            
            var $spanDist = $("<span>").addClass("reShop_way").text(tmpDist);
            $h4Tit.append($spanDist);
            $divReInner.append($h4Tit);

            var $pAddr = $("<p>").addClass("addr");
            if(!common.isEmpty(element.addr)){
                $pAddr.text(element.addr);
            }
            $divReInner.append($pAddr);

            // 201912
            var $divArea = $("<div>").addClass("area");
            $divReInner.append($divArea);

            if(!common.isEmpty(element.phon)){
                var $buttonCall = $("<button>").addClass("call").text(element.phon);
                $buttonCall.click(function(){mstore.common.setCallEvent($(this));});
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
            
            var $divAreaInner = $("<div>").addClass("area_inner");
            if(element.invCd == '03') {
                var $pStockInfo = $("<p class='amount_chk0'>").text("해당상품 미운영 매장입니다.");
                $divAreaInner.append($pStockInfo);
            }else if(element.invCd == '02'){
                var $pStockInfo = $("<p class='amount_chk0'>").text("현재 품절입니다.");
                $divAreaInner.append($pStockInfo);
                var $btnAlimStk = $("<button class='alertPd'>").text("입고 알림 신청");
                $btnAlimStk.click(function() {
                    mstore.main.regAlimStock(element.strNo);
                });
                $divAreaInner.append($btnAlimStk);
            }else if(element.stkProbability > 0 && element.stkProbability < 2){
                var $pStockInfo = $("<p class='amount_chk1'>").text("현재 재고보유 가능성이 낮습니다.");
                $divAreaInner.append($pStockInfo);
            }else if(element.stkProbability >= 2 && element.stkProbability < 8){
                var $pStockInfo = $("<p class='amount_chk2'>").text("현재 재고보유 가능성이 있습니다.");
                $divAreaInner.append($pStockInfo);
            }else{
                var $pStockInfo = $("<p class='amount_chk3'>").text("현재 재고보유 가능성이 높습니다.");
                $divAreaInner.append($pStockInfo);
            }
                        
            $divArea.append($divAreaInner);

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
    
    // 직접검색 탭 초기 진입시 Ajax 
    getNewStoreListByWordAjax : function(){
        var useLoc = localStorage.getItem("useLoc") == 'Y' ? true : false;
        
        PagingCaller.destroy();
        
        if(useLoc){//위치정보 허용
            if (navigator.geolocation) {
                mstore.common.isGeoLocationCall = true;
                navigator.geolocation.getCurrentPosition(mstore.main.onSuccessGeolocation, mstore.main.onErrorGeolocation, {timeout: 10000});
            } else {
                document.getElementById("map").innerHTML = "<p>사용자의 브라우저는 지오로케이션을 지원하지 않습니다.</p>";
            }
        }else {
            PagingCaller.init({
                callback : function(){
                    var param = {
                            pageIdx    : PagingCaller.getNextPageIdx(),
                            openYn : $("#openYn").val(),
                            tcCd :   $("#tcCd").val(),
                            psCd :   $("#psCd").val(),
                            usrLat : $("#usrLat").val(),
                            usrLng : $("#usrLng").val()
                    }
                    common.Ajax.sendJSONRequest(
                            "POST"
                            , _baseUrl + "store/getStoreListJson.do?searchType=new"
                            , param
                            , mstore.main._callback_getSearchWordStoreListAjax);
                }
            ,startPageIdx : 0
            ,subBottomScroll : 700
            ,initCall : true
          });
        }
    },
    
    // 지역검색 탭 초기 진입시 Ajax 
    getNewStoreListByAreaAjax : function(){
        var useLoc = localStorage.getItem("useLoc") == 'Y' ? true : false;
        
        PagingCaller.destroy();
        
        if(useLoc){//위치정보 허용
            if (navigator.geolocation) {
                mstore.common.isGeoLocationCall = true;
                navigator.geolocation.getCurrentPosition(mstore.main.onSuccessGeolocation, mstore.main.onErrorGeolocation, {timeout: 10000});
            } else {
                document.getElementById("map").innerHTML = "<p>사용자의 브라우저는 지오로케이션을 지원하지 않습니다.</p>";
            }
        }else {
            PagingCaller.init({
                callback : function(){
                    var param = {
                            pageIdx    : PagingCaller.getNextPageIdx(),
                            openYn : $("#openYn").val(),
                            tcCd :   $("#tcCd").val(),
                            psCd :   $("#psCd").val(),
                            usrLat : $("#usrLat").val(),
                            usrLng : $("#usrLng").val()
                    }
                    common.Ajax.sendJSONRequest(
                            "POST"
                            , _baseUrl + "store/getStoreListJson.do?searchType=new"
                            , param
                            , mstore.main._callback_getSearchAreaStoreListAjax);
                }
            ,startPageIdx : 0
            ,subBottomScroll : 700
            ,initCall : true
          });
        }
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
                    , mstore.main._callback_getSubAreaListAjax
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
        mstore.common.makeSelectboxList($("#subAreaList"),_optionRgn2,retData);
    },
    
    getSearchAreaStoreHref : function(pageIndex) {
        PagingCaller.destroy();
        
        var openYn = $("#openYn").val();
        var tcCd = $("#tcCd").val();
        var psCd = $("#psCd").val();
        
        var rgn1 = $("#mainAreaList option:selected").val();
        if(rgn1 == 'none'){
            /*검색어 없을 시 전체 매장 조회*/
            mstore.main.getNewStoreListByAreaAjax();
        }else{
            var rgn2 = $("#subAreaList option:selected").val();
            
            PagingCaller.init({
                callback : function(){
                    var param = {
                            pageIdx    : PagingCaller.getNextPageIdx(),
                            searchType : 'area',
                            rgn1 : rgn1,
                            rgn2 : rgn2,
                            openYn : $("#openYn").val(),
                            tcCd :   $("#tcCd").val(),
                            psCd :   $("#psCd").val(),
                            usrLat : $("#usrLat").val(),
                            usrLng : $("#usrLng").val()
                    }
                    common.Ajax.sendJSONRequest(
                            "GET"
                            , _baseUrl + "store/getStoreListJson.do"
                            , param
                            , mstore.main._callback_getSearchAreaStoreListAjax);
                }
            ,startPageIdx : 0
            ,subBottomScroll : 700
            ,initCall : true
            });
        }
    },
    
    getSearchAreaStoreListAjax : function() {
        PagingCaller.destroy();
        
        var useLoc = localStorage.getItem("useLoc") == 'Y' ? true : false;
        
        if(useLoc){//위치정보 허용
            if (navigator.geolocation) {
                mstore.common.isGeoLocationCall = true;
                navigator.geolocation.getCurrentPosition(mstore.main.onSuccessGeolocation, mstore.main.onErrorGeolocation, {timeout: 10000});
            } else {
                document.getElementById("map").innerHTML = "<p>사용자의 브라우저는 지오로케이션을 지원하지 않습니다.</p>";
            }           
        }else{//불허용
            PagingCaller.init({
                callback : function(){
                    var param = {
                            pageIdx    : PagingCaller.getNextPageIdx(),
                            searchType : 'area',
                            rgn1 : $("#mainAreaList option:selected").val(),
                            rgn2 : $("#subAreaList option:selected").val(),
                            openYn : $("#openYn").val(),
                            tcCd :   $("#tcCd").val(),
                            psCd :   $("#psCd").val(),
                            usrLat : $("#usrLat").val(),
                            usrLng : $("#usrLng").val()
                    }
                    common.Ajax.sendJSONRequest(
                            "GET"
                            , _baseUrl + "store/getStoreListJson.do"
                            , param
                            , mstore.main._callback_getSearchAreaStoreListAjax);
                }
            ,startPageIdx : 0
            ,subBottomScroll : 700
            ,initCall : true
            });
        }
    },
    
    _callback_getSearchAreaStoreListAjax : function(strData) {
        if(strData.pageIdx == 1){
            // 201912
            $("#searchAreaDiv .reShop_result").remove();
            
            var $dlResult = $("<dl>").addClass("reShop_result");
            var $dtResult = $("<dt>");
            $spanCount = $("<span>").text(strData.totalCount);
            $dtResult.append($spanCount);
            $dtResult.append(_messageCount2);
            var $ddFavor = $("<dd>").text(_messageRegFavor);
            
            $dlResult.append($dtResult);
            $dlResult.append($ddFavor);
            
            $("#searchAreaDiv").append($dlResult);
            
            $("#searchAreaDiv").find(".reShop_result").empty();
            $("#searchAreaDiv").find(".reShop_result").append($dtResult);
            $("#searchAreaDiv").find(".reShop_result").append($ddFavor);
            
            $("#storeListByArea").find(".mlist-reShop").empty();
        }
        
        $("#noStoreList").hide();
        
        var lengh = mstore.common.getLength(strData.storeList);
        if(lengh >0){
            mstore.main.makeStoreList($("#storeListByArea").find(".mlist-reShop"),strData.storeList,"storeArea");
            /*$("#storeListByArea").show();*/
        }else{
            if(strData.pageIdx == 1){
                
                $("#searchAreaDiv").find(".reShop_result > dt").remove();
                $("#searchAreaDiv").find(".reShop_result > dd").remove();
                
                $("#noStoreList").css("display","block");
                
            }
            PagingCaller.destroy();
        }
    },

    getSearchWordStoreHref : function(pageIndex) {
        PagingCaller.destroy();

        var searchWord = $("#searchWord").val();
        var openYn = $("#openYn").val();
        var tcCd = $("#tcCd").val();
        var psCd = $("#psCd").val();

        var retValidated = common.isEmpty(searchWord);
        if(retValidated){
            /*검색어 없을 시 전체 매장 조회*/
            mstore.main.getNewStoreListByWordAjax();
        }else{
            PagingCaller.init({
                callback : function(){
                    var param = {
                            pageIdx    : PagingCaller.getNextPageIdx(),
                            searchType : 'word',
                            searchWord : searchWord,
                            openYn : $("#openYn").val(),
                            tcCd :   $("#tcCd").val(),
                            psCd :   $("#psCd").val(),
                            usrLat : $("#usrLat").val(),
                            usrLng : $("#usrLng").val()
                    }
                    common.Ajax.sendJSONRequest(
                            "GET"
                            , _baseUrl + "store/getStoreListJson.do"
                            , param
                            , mstore.main._callback_getSearchWordStoreListAjax);
                }
            ,startPageIdx : 0
            ,subBottomScroll : 700
            ,initCall : true
            });
        }
    },

    // 직접검색 매장목록 불러오기 Ajax
    getSearchWordStoreListAjax : function() {
        PagingCaller.destroy();
        var useLoc = localStorage.getItem("useLoc") == 'Y' ? true : false;
        
        var searchWord = $("#searchWord").val();

        var retValidated = common.isEmpty(searchWord);
        if(retValidated){
            alert(_messageInput);
            $("#searchWord").focus();
            return;
        }
        
        if(useLoc){//위치정보 허용
            if (navigator.geolocation) {
                mstore.common.isGeoLocationCall = true;
                navigator.geolocation.getCurrentPosition(mstore.main.onSuccessGeolocation, mstore.main.onErrorGeolocation, {timeout: 10000});
            } else {
                document.getElementById("map").innerHTML = "<p>사용자의 브라우저는 지오로케이션을 지원하지 않습니다.</p>";
            }           
        }else{//불허용
            PagingCaller.init({
                callback : function(){
                    var param = {
                            pageIdx    : PagingCaller.getNextPageIdx(),
                            searchType : 'word',
                            openYn : $("#openYn").val(),
                            tcCd :   $("#tcCd").val(),
                            psCd :   $("#psCd").val(),
                            usrLat : $("#usrLat").val(),
                            usrLng : $("#usrLng").val(),
                            searchWord : $("#searchWord").val()
                    }
                    common.Ajax.sendJSONRequest(
                            "GET"
                            , _baseUrl + "store/getStoreListJson.do"
                            , param
                            , mstore.main._callback_getSearchWordStoreListAjax);
                }
            ,startPageIdx : 0
            ,subBottomScroll : 700
            ,initCall : true
          });
        }
    },

    // 직접검색 매장목록 불러오기 Callback
    _callback_getSearchWordStoreListAjax : function(strData) {
        if(strData.pageIdx == 1){
            // 201912
            $("#searchWordDiv .reShop_result").remove();
            
            var $dlResult = $("<dl>").addClass("reShop_result");
            var $dtResult = $("<dt>");
            $spanCount = $("<span>").text(strData.totalCount);
            $dtResult.append($spanCount);
            $dtResult.append(_messageCount2);
            var $ddFavor = $("<dd>").text(_messageRegFavor);
            
            $dlResult.append($dtResult);
            $dlResult.append($ddFavor);
            $("#searchWordDiv").append($dlResult);
            $("#storeListByWord").find(".mlist-reShop").empty();
            
        }
        
        $("#noStoreList").hide();
        
        var lengh = mstore.common.getLength(strData.storeList);
        if(lengh >0){
            mstore.main.makeStoreList($("#storeListByWord").find(".mlist-reShop"),strData.storeList,"storeListByWord");
        }else{
            if(strData.pageIdx == 1){
                
                $("#searchWordDiv").find(".reShop_result > dt").remove();
                $("#searchWordDiv").find(".reShop_result > dd").remove();
                
                $("#noStoreList").css("display","block");
            }
            PagingCaller.destroy();
        }
    },
    
    // 판매매장 찾기 매장목록 불러오기 Ajax
    getSearchItemStoreListAjax : function() {
        PagingCaller.destroy();
        
        var useLoc = localStorage.getItem("useLoc") == 'Y' ? true : false;

        var isGoodsNo = common.isEmpty($("#searchItemNo").val());
        var isLgcNo = common.isEmpty($("#searchItemLgcNo").val());
        
        if(isGoodsNo && isLgcNo){
//            alert("선택한 제품의 정보가 올바르지 않습니다.");
            return;
        }
        
        // cjone 점검 체크
        common.Ajax.sendRequest("GET",_baseUrl + "goods/getCjoneAvailableJson.do","",function(data){
            var res =(typeof data !== 'object') ? $.parseJSON(data) : data;
            if(res != null && res.result){
                
                if(useLoc){//위치정보 허용
                    if (navigator.geolocation) {
                        mstore.common.isGeoLocationCall = true;
                        navigator.geolocation.getCurrentPosition(mstore.main.onSuccessGeolocation, mstore.main.onErrorGeolocation, {timeout: 10000});
                    } else {
                        document.getElementById("map").innerHTML = "<p>사용자의 브라우저는 지오로케이션을 지원하지 않습니다.</p>";
                    }           
                }else{//불허용
                    PagingCaller.init({
                        callback : function(){
                            var param = {
                                    pageIdx    : PagingCaller.getNextPageIdx(),
                                    searchType : 'item',
                                    goodsNo : $("#searchItemNo").val(),
                                    lgcGoodsNo : $("#searchItemLgcNo").val(),
                                    openYn : $("#openYn").val(),
                                    tcCd :   $("#tcCd").val(),
                                    psCd :   $("#psCd").val(),
                                    usrLat : $("#usrLat").val(),
                                    usrLng : $("#usrLng").val()
                            }
                            common.Ajax.sendJSONRequest(
                                    "GET"
                                    , _baseUrl + "store/getStoreListJson2.do"
                                    , param
                                    , mstore.main._callback_getSearchItemStoreListAjax);
                        }
                    ,startPageIdx : 0 
                    ,subBottomScroll : 700
                    ,initCall : true
                  });
                }
            }else{
                mgoods.detail.offstore.searchYn = 'N';
                alert("죄송합니다. 시스템 점검으로 이용이 불가합니다.");
            }
        });
    },
    
    // 판매매장 찾기 매장목록 불러오기 Callback
    _callback_getSearchItemStoreListAjax : function(strData) {
        
        if(strData.pageIdx == 1){
            // 201912
            var $divResult = $("<div>").addClass("reShop_resultPd").attr("id",$("#searchItemNo").val());
            var $dtResult = $("<dt>");
            var $imgResult = $("<img>").attr("src",_goodsImgUploadUrl+strData.imgPathNm).attr("alt","상품이미지");
            $dtResult.append($imgResult);
            var $ddResult = $("<dd>");
            var $pResult = $("<p>").addClass("pd_brand").text(strData.onlBrandName);
            $ddResult.append($pResult);
            /*$pResult = $("<p>").addClass("pd_name").text($('#searchItem').val());*/
            $pResult = $("<p>").addClass("pd_name").text(strData.goodsNm);
            $ddResult.append($pResult);
            
            $divResult.append($dtResult);
            $divResult.append($ddResult);
            
            $("#searchItemDiv").find(".reShop_resultPd").remove();
            $(".reShop_msg", $("#searchItemDiv")).remove();
            
            $("#searchItemDiv").append($divResult);
            $("#searchItemDiv").append($("<p class='reShop_msg'>").text("실제 수량과 다를 수 있어 정확한 재고는 매장으로 확인해 주세요."));
            $('#searchItem').val("");
            $('#searchItem').blur();
            $(".btn_sch_del").removeClass("on");
            $("#storeListByItem").find(".mlist-reShop").empty();
            
            $(".reShop_resultPd").click(function(e){
                e.preventDefault();
                var goodsNo = $(this).attr("id");
                if(!common.isEmpty(goodsNo)){
                    common.link.moveGoodsDetail(goodsNo);
                }
            });
        }
        
        $("#noStoreList").hide();
        
        var lengh = mstore.common.getLength(strData.storeList);
        if(lengh >0){
            mstore.main.makeStoreList2($("#storeListByItem").find(".mlist-reShop"),strData.storeList,strData.goodsNo,strData.lgcGoodsNo,strData.mbrNo,"storeArea");
        }else{
            if(strData.pageIdx == 1){
                $(".reShop_msg", $("#searchItemDiv")).remove();
                $("#noStoreList").css("display","block");
            }
            PagingCaller.destroy();
        }
    },
    
    // GPS 수신유무에 따른 매장목록 불러오기 분기처리 Ajax
    storeListAjax : function(geoFlag , position){
        
        if(mstore.common.isGeoLocationCall){
            mstore.common.isGeoLocationCall = false;
        }else{
            return;
        }
        var lat = null;
        var lon = null;
        var listParam = {
                tcCd :   $("#tcCd").val()
                , psCd :   $("#psCd").val()
                , openYn : $("#openYn").val()
        };
        
        if(geoFlag) {
            lon=  position.coords.longitude;//경도
            lat = position.coords.latitude;//위도
            $("#usrLat").val(lat);
            $("#usrLng").val(lon);
            
            $.extend(listParam, {usrLat : $("#usrLat").val(),usrLng : $("#usrLng").val()});
        } else {
            localStorage.setItem("useLoc", "N");
            mstore.common.isGeoLocation = false;
            $(".useLocRecom").hide(); 
            $.extend(listParam, { usrLat : $("#usrLat").val(), usrLng : $("#usrLng").val()});
        }
        
        PagingCaller.destroy();
        
        var searchType = $("#searchType").val();
        var tabTypeVal = $("#tabType").val();
        
        var url = "";
        var pageSize = 15;
        var callback = null;
        
        if(searchType == 'new'){
            url = _baseUrl + "store/getStoreListJson.do?searchType=new";
            if(tabTypeVal == "wordTab"){
                callback = mstore.main._callback_getSearchWordStoreListAjax;
            }else{
                callback = mstore.main._callback_getSearchAreaStoreListAjax;
            }
        }else if(tabTypeVal == "wordTab") {
            $.extend(listParam,{searchType : 'word' , searchWord : $("#searchWord").val()})
            url = _baseUrl + "store/getStoreListJson.do";
            callback = mstore.main._callback_getSearchWordStoreListAjax;
        }else if(tabTypeVal == "areaTab"){
            $.extend(listParam,{searchType : 'area' , rgn1 : $("#mainAreaList option:selected").val(), rgn2 : $("#subAreaList option:selected").val()});
            url = _baseUrl + "store/getStoreListJson.do";
            callback = mstore.main._callback_getSearchAreaStoreListAjax;
        }else if(tabTypeVal == "itemTab"){ // 201912
            var pageSize = 9;
            url = _baseUrl + "store/getStoreListJson2.do";
            $.extend(listParam,{searchType : 'item' , goodsNo : $("#searchItemNo").val() , lgcGoodsNo : $("#searchItemLgcNo").val()});
            callback = mstore.main._callback_getSearchItemStoreListAjax;
        }
        
        if(tabTypeVal == "favorTab"){ // 201912
            $.extend(listParam, {searchType : 'favor'});
            
            common.Ajax.sendJSONRequest(
                    "POST"
                    , _baseUrl + "store/getFavorStoreListJson.do"
                    , listParam
                    , mstore.common._callback_getFavorStoreListAjax
                    , false);
            
        }else{
            if (callback == null) return;
            common.Ajax.sendJSONRequest(
                    "POST"
                    , _baseUrl + "store/getStoreListCntJson.do"
                    , listParam
                    , function (strData){
                        pageCnt = parseInt(strData.list_cnt)/ pageSize;
                        mstore.main._totalPageCount =  Math.floor(pageCnt)+1;
                        PagingCaller.init({
                            callback : function(){
                                $.extend(listParam, {pageIdx    : PagingCaller.getNextPageIdx()});
                                common.Ajax.sendJSONRequest(
                                        "POST"
                                        , url
                                        , listParam
                                        , callback
                                        , false);
                            }
                        ,startPageIdx : 0
                        ,subBottomScroll : 700
                        ,initCall : true
                        });
                    }
                    , false);
        }
        mstore.main.isAjaxProcessing = false;
    }
};

var markers = [];

$.namespace("mstore.detail");
mstore.detail = {
        
    // 매장상세 초기화
    init : function(){
        
        $('.call').click(function(){
            mstore.common.setCallEvent($(this));
        });

        $("#storeNoticeList div.rb_time").click(function(){

            var ntcSeq = $(this).find("input[name*='ntcSeq']" ).val();
            $(location).attr('href', _baseUrl + "counsel/getNoticeDetail.do?ntcSeq="+ntcSeq);
        });

        mstore.common.viewMode = 'detail';

        // 2019
        // 취급카테고리 리스트 동적생성
        if(storeTcDtlList.length > 0) {
            var $divInner = $(".rb_pdList .inner");
            for(var i = 0; i < storeTcDtlList.length; i++){
                
                var $spanResult = $("<span>").addClass("tag").text(storeTcDtlList[i]);
                
                $divInner.append($spanResult);
            }
        }
        
        // 제공서비스 리스트 동적생성
        if(storePsDtlList.length > 0) {
            
            var $ulResult = $(".reShop_sv");
            
            for(var i = 0; i < storePsDtlList.length; i++) {
                var $liResult = $("<li>");
                
                var $dlResult = $("<dl>").addClass("ico_rss_"+storePsDtlList[i].dtlCd);
                
                var $dtResult = $("<dt>").text(storePsDtlList[i].mrkNm);
                $dlResult.append($dtResult);
                if(storePsDtlList[i].cdDesc != "" && storePsDtlList[i].cdDesc != null) {
                    var $ddResult = $("<dd>").html(storePsDtlList[i].cdDesc);
                    $dlResult.append($ddResult);
                }
                
                $liResult.append($dlResult);
                $ulResult.append($liResult);
            }
        }
    },
    
    mapApInit : function(x,y){
        if(!common.isEmpty(x) && !common.isEmpty(y)){
            var mapContainer = document.getElementById('map') // 지도 영역
            var mapOption = {
                    center: new daum.maps.LatLng(x, y), // 지도 중심좌표(위도,경도)
                    level: 3 // 지도 확대 레벨
                };
            var map = new daum.maps.Map(mapContainer, mapOption); // 지도 생성
            var markerImage = new daum.maps.MarkerImage(_cssUrl + '../image/comm/point_way.png' , new daum.maps.Size(24, 35)); // 마커 이미지 생성
            var markerPosition = new daum.maps.LatLng(x, y); // 마커 위치
            var marker = new daum.maps.Marker({
                map: map, // 마커를 표시할 지도
                position: markerPosition, // 마커를 표시할 위치
                image : markerImage // 마커 이미지
            });
            marker.setMap(map); // 마커 표시
        }
    }
};
