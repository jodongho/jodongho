$.namespace("mplanshop.detail");
mplanshop.detail = {
        
    init : function(){
        // 상단 html영역 style 변경 - width 100% 고정
        $(".main_contents").find("img").removeAttr('style').attr("style","width:100%;")
        
        //페이지 로딩 처리 초기화
        common.loadPage.init("#mContents", "PlanShop");

        //저장된 html 이 있는 경우 저장된 html을 로딩, 아닌 경우 서버에서 신규 호출 처리함.
        common.loadPage.setSavedHtml();
        
        common.setLazyLoad();
        
        mplanshop.detail.addCssClass();

        //찜 처리 초기화
        common.wish.init();
        
        mplanshop.detail.bindEvent();

        setTimeout(function() {
            $(document).resize();
        }, 500);
    },
    
    bindEvent : function() {
        //셀렉트박스 선택이벤트
        $(".temaSoting").change(function(){
            
            $(".temaBox").show();
            var index = $(".temaSoting option").index($(".temaSoting option:selected"))-1;
            
            $(".temaSoting option").each(function() {
                if ($(this).is(":selected")) {
                    $(this).attr("selected", "true");
                } else {
                    $(this).removeAttr("selected");
                }
            });
            
            setTimeout(function() {
                $(document).resize();
            }, 500);
            
            //전체보기가 아닌 경우
            if(index > -1){
                $(".temaBox :not(:eq(" + index + "))").hide();
            }
        });
        
        //찜 체크 처리.
        common.wish.checkWishList();

        setTimeout(function() {
            //링크 처리
            common.bindGoodsListLink();
            //페이지 로딩 처리 클릭 이벤트처리
            common.loadPage.bindEvent();
        }, 100);
        
    },
    
    addCssClass : function(){
        if($(".link-tit .Img a").height() > 20){
            $(".Img").addClass("double");
        }
    }
};

//전문관  
$.namespace("mplanshop.spcShop");
mplanshop.spcShop = {
    nextPageIdx : 1,
    viewMode : "",
    viewStdDate : "",

    previewParam : "",
    
    init : function(){
        //페이지 로딩 처리 초기화
        common.loadPage.init("#mContents", "SpcShop");

        //저장된 html 이 있는 경우 저장된 html을 로딩, 아닌 경우 서버에서 신규 호출 처리함.
        common.loadPage.setSavedHtml();
        
        //LazyLoad
        common.setLazyLoad();
        //Swipe
        mplanshop.spcShop.setSwipe();
        //찜 처리 초기화
        common.wish.init();
        //클릭이벤트 바인드
        mplanshop.spcShop.bindEvent();
        
        var startIdx = 1;
        if ($("#mContents").attr("data-ref-pageIdx") != undefined && $("#mContents").attr("data-ref-pageIdx") != "") {
            startIdx = parseInt($("#mContents").attr("data-ref-pageIdx"));
        }
        
        //최초에는 1페이지를 로딩한 상태이므로 2페이지부터 호출하도록함.
        mplanshop.spcShop.getSpcPplrPagingAjax(startIdx);
        
        setTimeout(function() {
            $(document).resize();
        }, 100);
    },

    getPreviewParam : function(connStr) {
        if (mplanshop.spcShop.previewParam.trim() != "") {
            return connStr + mplanshop.spcShop.previewParam;
        }
        return "";
    },

    setPreviewParam : function(orgObj) {

        if (orgObj != undefined && orgObj != null) {
            if (mplanshop.spcShop.previewParam.trim() != "") {
                var viewParam = {
                        viewMode : mplanshop.spcShop.viewMode,
                        viewStdDate : mplanshop.spcShop.viewStdDate
                };

                orgObj = $.extend(orgObj, viewParam);
            }
        }
    },

    setSwipe : function(){
        if($('.mSlider-area li').length > 1){
            //온리원 & 전문관 배너 2017-01-18 수정
            var only_set = {
                slidesPerView: 1,
                slidesPerView: 1,
                autoplay: 2500,
                pagination: '.paging',
                paginationClickable: true,
                freeMode: false,
                spaceBetween: 0,
                loop: true
            }, only_swiper = Swiper('.mlist-promotion', only_set );
        }
    },
    
    bindEvent : function() {        
        //브랜드배너 클릭이벤트
        $(".mlist-brand > li > a:not(:eq(7))").bind('click', function(){
            var onlBrndCd = $(this).attr("data-ref-dispContsNo");
            common.link.moveBrandShop(onlBrndCd);
        });
        
        //브랜드 더보기 클릭
        $(".mlist-brand li a:eq(7)").bind('click',function(){
            //팝업 세팅
            mplanshop.spcShop.setBrandPopup();
            
            common.popLayerOpen("LAYERPOP01");
            
            //앱 호출 - 앱 내 레이어팝업 스크롤 시 새로고침처리되는 기능 disable 처리
            setTimeout(function() {
                common.app.callMenu("Y");
            },100);
        });
        
        //기획전 배너 클릭이벤트
        $(".submain-onlyone .mlist-promotion").find("li").bind('click', function(){
            var planshopCatNo = $(this).attr("data-ref-dispCatNo");
            common.link.movePlanShop(planshopCatNo);
        });
        
        //찜 체크 처리.
        common.wish.checkWishList();

        setTimeout(function() {
            //링크 처리
            common.bindGoodsListLink();
            //페이지 로딩 처리 클릭 이벤트처리
            common.loadPage.bindEvent();
        }, 100);
    },
    
    //전문관 하단 1단형 상품영역 페이징
    getSpcPplrPagingAjax : function(startIdx, dispCatNo) {
        //연속키 방식
        PagingCaller.init({
            callback : function(){
                mplanshop.spcShop.nextPageIdx = PagingCaller.getNextPageIdx();

                var param = {
                    pageIdx : mplanshop.spcShop.nextPageIdx,
                    dispCatNo : $("#titConts .tit").attr("data-ref-dispCatNo")
                };

                //미리보기 파라미터 추가
                mplanshop.spcShop.setPreviewParam(param);

                common.Ajax.sendRequest(
                        "GET"
                        , _baseUrl + "planshop/getSpcGoodsPagingAjax.do"
                        , param
                        , mplanshop.spcShop.getSpcGoodsPagingAjaxCallback);

                $("#mContents").attr("data-ref-pageIdx", param.pageIdx);
            }
            ,startPageIdx : startIdx
            ,subBottomScroll : 700
            //초기화 시 최초 목록 call 여부
            ,initCall : (startIdx > 0) ? false : true
        });
    },

    getSpcGoodsPagingAjaxCallback : function(res) {

        //최대 100개 온리원 상품 페이징 조회
        if (res.trim() == "" || mplanshop.spcShop.nextPageIdx > 10) {
            //응답 결과가 없을 경우 마지막 목록임- 스크롤 이벤트 제거
            PagingCaller.destroy();

        } else {
            //응답 결과가 있는 경우 append 처리 후 lazyload 처리
            $(".onlyone-hit").next().append(res);

            common.setLazyLoad();

            //찜 체크 처리.
            common.wish.checkWishList();

            setTimeout(function() {
                //링크 처리
                common.bindGoodsListLink();
            }, 100);

        }
    },
    
    setBrandPopup : function(){
        var brandCnt = $(".mlist-brand li a[data-ref-dispcontsno]").size();
        var innerLiSet = "";
        var liCnt = 1;
        
        for(var i = 0; i < brandCnt; i++){
            if(liCnt == 1){
                innerLiSet += "<li>";
            }
            
            innerLiSet += $(".mlist-brand li a[data-ref-dispcontsno]").eq(i).clone().wrapAll('<div/>').parent().html();
            
            if(liCnt == 3){
                innerLiSet +="</li>";
                liCnt = 0;
            }
            liCnt++;
        }

        var innerHtml = "<ul class='listBrandLink'>" + innerLiSet + "</ul>";

        $(".popLayerWrap .popLayerArea .popInner .popContainer .popCont").html(innerHtml);
        $(".popLayerWrap .popLayerArea .popInner .popHeader .popTitle").text("브랜드를 선택해주세요.");
        
        //브랜드 더보기 > 브랜드배너 클릭이벤트
        $(".listBrandLink li a").bind('click', function(){
            var onlBrndCd = $(this).attr("data-ref-dispContsNo");
            common.link.moveBrandShop(onlBrndCd);
        });
    }
};

//기획전 이벤트 
$.namespace("mplanshop.eventDetail")
mplanshop.eventDetail = {
    orgObj : "",
    orgNum : "",
    orgCpn : "",
    evtReqCnt : 0,

    eventShowLayer : function(obj, num, cpn) {
        // 로그인 체크
        if(mplanshop.eventDetail.checkLogin() == true){
            mplanshop.eventDetail.orgObj = obj;
            mplanshop.eventDetail.orgNum = num;
            mplanshop.eventDetail.orgCpn = cpn;
            mplanshop.eventDetail.selectIceBoxChkAjax();

            setTimeout(function() {
                // 얼음 클릭시 선택한 상품으로 문자열 교체
                if(mplanshop.eventDetail.evtReqCnt == 0){
                    mplanshop.eventDetail.itemWordChange(mplanshop.eventDetail.orgObj, num);
                }else{
                    mplanshop.eventDetail.orgObj = "eTapar02";
                    mplanshop.eventDetail.regIceBoxAjax(mplanshop.eventDetail.orgObj, mplanshop.eventDetail.orgNum);
                }
            }, 100);
        }
    },

    // 레이어 열기
    openEventLayer : function(obj) {
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

    checkLogin : function(){
        if(common.isLogin() == false){
            if(!confirm("해당 서비스는 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?")){
                return false;
            }else{
                common.link.moveLoginPage();
                return false;
            }
        }

        return true;
    },

    itemWordChange : function(obj, num){ 
        if(num != null) {
            var itemNm = $(".bubble").eq(num).find("img").attr("alt");
            var lastItemNm = itemNm.charCodeAt(itemNm.length-1) - 0xAC00;
            var index = (lastItemNm)%28;
            var strJosa = "을";
            
            if (index == 0) {
                strJosa = "를";
            }
    
            $(".eventLayer .inner01").find(".ta03 em").text(itemNm);
            $(".eventLayer .inner01").find(".ta03 span").text(strJosa);
            
            // 레이어 열기
            mplanshop.eventDetail.openEventLayer(obj);
        }
    },
    
    // 선택 체크
    choiceItemChk : function(obj) {
        var cNum = mplanshop.eventDetail.orgNum;
        mplanshop.eventDetail.orgObj = obj;
        if (obj == "eTapar03") {           // 나의 아이스박스보기
            mplanshop.eventDetail.getMyIceBoxTotAjax();
        }else if (obj == "eTapar02") {    // 아이템 채우기
            mplanshop.eventDetail.regIceBoxAjax(obj, cNum);
        }
    },
    
    
    /* 이벤트 응모 체크 */
    selectIceBoxChkAjax : function(){
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val(),
                noteCont : mplanshop.eventDetail.orgNum
        };
        
        common.Ajax.sendJSONRequest(
                "GET"
                , _baseUrl + "event/getMyEventTgtrListJson.do"
                , param
                , mplanshop.eventDetail._callback_getMyEventReqCntAjax
        );
    },

    _callback_getMyEventReqCntAjax : function(res){
        if(res.ret == "0"){
            var data = (typeof res.evtWinChkList !== 'object') ? $.parseJSON(res.evtWinChkList) : res.evtWinChkList;
            
            if(data.length > 0){
                for(var i=0; i<data.length; i++){
                    if(data[i].winCnt == 3 && i < 1){
                        mplanshop.eventDetail.evtReqCnt = 0;
                    }else{
                        mplanshop.eventDetail.evtReqCnt = data[i].winCnt;
                    }
                }
            }
        }
    },
    
    /* 얼음 채우기 */
    regIceBoxAjax : function(obj, num){
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val(),
                noteCont : num + "|" + $(".bubble").eq(num).find("img").attr("alt"),
                mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn']:hidden").val(),
                mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn']:hidden").val(),
                cpnNo : mplanshop.eventDetail.orgCpn
        };
        
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/regTaparEventJson.do"
              , param
              , mplanshop.eventDetail._callback_regIceBoxAjax
        );
    },
    _callback_regIceBoxAjax : function(json){
        if (json.ret == "0") {
            mplanshop.eventDetail.eventCloseLayer();

            setTimeout(function() {
                mplanshop.eventDetail.getMyIceBoxAjax();
            }, 100);
        } else if (json.ret == "-1" && json.equalYn == "N") {
            alert("똑같은 얼음 3개만 채울 수 있습니다." + json.itemNm + " 얼음을 잡아주세요!");
            mplanshop.eventDetail.eventCloseLayer();
        } else if (json.ret == "-1" && json.finish == "Y") {
            alert("아이스박스가 가득 찼습니다. 내일 다시 응모해주세요!");
            mplanshop.eventDetail.eventCloseLayer();
        }
    },
    
    /* 얼음 확인 */
    getMyIceBoxAjax : function() {
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val(),
                noteCont : mplanshop.eventDetail.orgNum
        };
        
        common.Ajax.sendJSONRequest(
                "GET"
                , _baseUrl + "event/getMyEventTgtrListJson.do"
                , param
                , mplanshop.eventDetail._callback_getMyIceBoxAjax
          );
    },
    
    _callback_getMyIceBoxAjax : function(res){
        if (res.ret == "0") {
            var data = (typeof res.evtWinChkList !== 'object') ? $.parseJSON(res.evtWinChkList) : res.evtWinChkList;
            var htmlTag = "";
            var boxItemCnt = 0;
            var strCont = new Array();
            var choiceItemCnt = 0;
            var choiceItemNm = new Array();
            var choiceItemNo = new Array();

            $("#eTapar02 .inner02 .talist .buttonBox .sbox img").remove();
            $("#eTapar02 .inner02 .talist").not(".usemapDiv").find("img").remove();
            
            for(var i=0; i< data.length; i++){
                strCont = data[i].noteCont.split('|');
                choiceItemNm[i] = strCont[1];
                choiceItemNo[i] = parseInt(strCont[0])+1;
                for(var j=0; j < data[i].winCnt; j++){
                    choiceItemCnt = choiceItemCnt + 1;
                    htmlTag = "<img alt='" + choiceItemNm[i] + "'ING' class='ing' src='http://image.oliveyoung.co.kr/uploads/contents/201708/event02/tapar_pc_ing" + choiceItemNo[i] + ".gif' />";
                    
                    if(i == 0){
                        $("#eTapar02 .inner02 .talist .buttonBox").eq(i).find(".sbox").eq(j).append(htmlTag);
                    }else if(i == 1){
                        $("#eTapar02 .inner02 .talist .buttonBox").eq(i).find(".sbox").eq(j).append(htmlTag);
                    }
                }
            }
            
            if(choiceItemCnt < 3) {
                $("#eTapar02 .inner02 .talist").eq(0).show();
                $("#eTapar02 .inner02 .talist").eq(1).hide();
                $("#eTapar02 .inner02 .talist").eq(2).hide();
                $("#eTapar02 .inner02 .talist").eq(3).hide();
                $("#eTapar02 .inner02").find(".ta13").hide();
                $("#eTapar02 .inner02").find(".ta14").show();
                $("#eTapar02").find(".btn02").hide();
            }else if(choiceItemCnt == 3){
                htmlTag = "<img alt='" + choiceItemNm[0] + "'END' class='end' src='//image.oliveyoung.co.kr/uploads/contents/201708/event02/tapar_mc_end" + choiceItemNo[0] + ".png' />";
                $("#eTapar02 .inner02").find(".talist").eq(2).append(htmlTag);
                $("#eTapar02 .inner02 .talist").eq(0).hide();
                $("#eTapar02 .inner02 .talist").eq(1).hide();
                $("#eTapar02 .inner02 .talist").eq(3).hide();
                $("#eTapar02 .inner02 .talist").eq(2).show();
                $("#eTapar02 .inner02").find(".ta14").hide();
                $("#eTapar02 .inner02").find(".ta13").show();
                $("#eTapar02").find(".btn02").show();
                $("#eTapar02").find(".btn02 a").eq(0).show();
                $("#eTapar02").find(".btn02 a").eq(1).hide();
            }else if(choiceItemCnt == 6){
                htmlTag = "<img alt='" + choiceItemNm[0] + "'END' class='end' src='//image.oliveyoung.co.kr/uploads/contents/201708/event02/tapar_mc_end" + choiceItemNo[0] + ".png' />";
                $("#eTapar02 .inner02").find(".talist").eq(2).append(htmlTag);
                htmlTag = "<img alt='" + choiceItemNm[1] + "'END' class='end' src='//image.oliveyoung.co.kr/uploads/contents/201708/event02/tapar_mc_end" + choiceItemNo[1] + ".png' />";
                $("#eTapar02 .inner02").find(".talist").eq(3).append(htmlTag);
                $("#eTapar02 .inner02 .talist").eq(0).hide();
                $("#eTapar02 .inner02 .talist").eq(1).hide();
                $("#eTapar02 .inner02 .talist").eq(2).show();
                $("#eTapar02 .inner02 .talist").eq(3).show();
                $("#eTapar02 .inner02").find(".ta14").hide();
                $("#eTapar02 .inner02").find(".ta13").show();
                $("#eTapar02").find(".btn02").show();
                $("#eTapar02").find(".btn02 a").eq(0).hide();
                $("#eTapar02").find(".btn02 a").eq(1).show();
            }else{
                $("#eTapar02 .inner02 .talist").eq(1).show();
                $("#eTapar02 .inner02 .talist").eq(0).hide();
                $("#eTapar02 .inner02 .talist").eq(2).hide();
                $("#eTapar02 .inner02 .talist").eq(3).hide();
                $("#eTapar02 .inner02").find(".ta13").hide();
                $("#eTapar02 .inner02").find(".ta14").show();
                $("#eTapar02").find(".btn02").hide();
            }
        }
        
        mplanshop.eventDetail.openEventLayer(mplanshop.eventDetail.orgObj);
    },
    
    /* 아이스박스 보기 */
    getMyIceBoxTotAjax : function() {
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val(),
                noteCont : mplanshop.eventDetail.orgNum
        };
        
        common.Ajax.sendJSONRequest(
                "GET"
                , _baseUrl + "event/getMyEventTgtrListJson.do"
                , param
                , mplanshop.eventDetail._callback_getMyIceBoxTotAjax
          );
    },
    
    _callback_getMyIceBoxTotAjax : function(res){
        if (res.ret == "0") {
            var data = (typeof res.evtWinChkList !== 'object') ? $.parseJSON(res.evtWinChkList) : res.evtWinChkList;
            var htmlTag = "";
            var boxItemCnt = 0;
            var strCont = new Array();

            $("#eTapar03 .inner02 .talist").not(".usemapDiv").html("");
            $("#eTapar03 .inner02 .talist").find(".sbox").html("");
            for(var i=0; i< data.length; i++){
                for(var j=0; j < data[i].winCnt; j++){
                    strCont = data[i].noteCont.split('|');
                    htmlTag = "<img alt='" + strCont[1] + "'ING' class='ing' src='http://image.oliveyoung.co.kr/uploads/contents/201708/event02/tapar_pc_ing" +(parseInt(strCont[0])+1) + ".gif' />";

                    if(j < 2){
                        $("#eTapar03 .inner02 .talist").eq(i*2).find(".buttonBox .sbox").eq(j).append(htmlTag);
                    }else{
                        if(data[i].winCnt == 3){
                            htmlTag = "<img alt='" + strCont[1] + "'END' class='end' src='//image.oliveyoung.co.kr/uploads/contents/201708/event02/tapar_mc_end" + (parseInt(strCont[0])+1) + ".png' />";
                            $("#eTapar03 .inner02 .talist").eq(i*2+1).append(htmlTag);
                            $("#eTapar03 .inner02 .talist").eq(i*2+1).show();
                            $("#eTapar03 .inner02 .talist").eq(i*2).hide();
                        }
                    }
                }
            }
  
        }
        
        mplanshop.eventDetail.openEventLayer(mplanshop.eventDetail.orgObj);
    },  

    checkLogin : function(){
        if(common.isLogin() == false){

            if(!confirm("해당 서비스는 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?")){
                return false;
            }else{
                common.link.moveLoginPage();
                return false;
            }
        }

        return true;
    },

    downCouponJson : function(cpnNo) {
        if(!mplanshop.eventDetail.checkLogin()){
            return;
        }else{
            if(typeof cpnNo == "undefined" || cpnNo == ""){
                alert("쿠폰 번호가 없습니다.");
                return;
            }
            var param = {cpnNo : cpnNo};
            common.Ajax.sendRequest(
                    "GET"
                    , _baseUrl + "event/downCouponJson.do"
                    , param
                    , this._callback_downCouponJson);
        }
    },
    _callback_downCouponJson : function(strData) {

        if(strData.ret == '0'){
            alert(strData.message);
        }
    },
};

