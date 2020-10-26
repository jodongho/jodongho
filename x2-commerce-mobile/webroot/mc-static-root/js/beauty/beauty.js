$.namespace("mbeauty.detail");
mbeauty.detail = {

    _ajax : common.Ajax,
    mbrInfoUseAgrYn : "N",
    mbrInfoThprSupAgrYn : "N",
    url : "",
    evtNo : "",
    initSns : function(){
//        mbeauty.detail.url = window.location.protocol + "//" + window.location.host + window.location.pathname + "?evtNo="+$("#evtNo").val();
        mbeauty.detail.url = _baseUrl + 'B.do?evtNo=' + $("#evtNo").val();
        common.sns.init( $("#bnrImgUrlAddr").val(),$("#shareTxt").val(), mbeauty.detail.url);
    },
    initEvNo : function(){
        mbeauty.detail.evtNo = $("#evtNo").val();
    },
    init : function(){

        $('.event_agree .tit > a').click(function(e){
            e.preventDefault();
            if($(this).parents('li').hasClass('on')){
                $(this).parents('li').removeClass('on');
            }else{
                $(this).parents('li').addClass('on').siblings().removeClass('on');
            }
        });

        common.bindGoodsListLink();

        $('#inpTxBox').on({
            'keydown' : function(){
                $('#inTxCnt').text($(this).val().length);
            }
        });

        $(".btn_modify").click(function(){

            if(!mbeauty.detail.checkLogin()){
                return;
            }

            common.link.moveMyDeliveryInfoPage();
        });

        $("#commmentHeader > .more").click(function(){
            PagingCaller.destroy();
            mbeauty.detail.getBeautyMyCommentListAjax();

        });

        $("#commmentHeader > .tit").click(function(){
            $('#commentList').empty();
            mbeauty.detail.getBeautyCommentListAjax();
        });


        $("#myCommmentHeader > .more").click(function(){
            $('#commentList').empty();
            mbeauty.detail.getBeautyCommentListAjax();
        });

        $('.btnShare').click(function(){
            mbeauty.detail.dispSnsPopup();
            //  드래그 방지 허용
            $.fn.enableSelection();
            common.popLayerOpen("SNSLAYER");
        });

        $('.btnGreen').click(function(){
            if(!mbeauty.detail.checkLogin()){
                return;
            }

            mbeauty.detail.regBeautyCommentAjax();

        });

        $("#moveNtc").click(function(){
           var ntcSeq =  $(this).parent().find("input[name*=ntcSeq]").val();
           if(common.isEmpty(ntcSeq)){
               alert("당첨자 발표 페이지가 없습니다");
               return;
           }
           common.link.moveNtcDetail('',ntcSeq);
        });

        if( common.isEmpty(sessionStorage.getItem("mEventMain") ) ){
            sessionStorage.setItem("mEventMain", "Y");
        }

        mbeauty.detail.initEvNo();
        mbeauty.detail.initSns();
        mbeauty.detail.initCommentList();
        common.wish.init();
        common.setLazyLoad();
    },

    initCommentList : function(){
        mbeauty.detail.getBeautyCommentListAjax();
    },

    getBeautyCommentListAjax : function(){

        PagingCaller.destroy(); // 기존 페이징 해지

          PagingCaller.init({
              callback : function(){
                  var param = {
                          evtNo : mbeauty.detail.evtNo,
                          pageIdx    : PagingCaller.getNextPageIdx() // 페이징 인덱스
                  };
                  common.Ajax.sendRequest(
                          "GET"
                          , _baseUrl + "beauty/getBeautyCommentListJson.do"
                          , param
                          , mbeauty.detail._callback_getBeautyCommentListAjax);
              }
          ,startPageIdx : 0
          ,subBottomScroll : 700
          ,initCall : true
          });
    },

    _callback_getBeautyCommentListAjax : function(strData) {

        var listCount = strData.totalCount;
        var list = strData.beautyCommList;
        var pageIdx = strData.pageIdx;
        var dispArea = $('#commentList');

        $("#myCommentList").hide();
        dispArea.show();

        if(pageIdx == 1){
            dispArea.empty();
            $("#commmentHeader").show();

            var textCount = [];
            textCount.push("(");
            textCount.push(listCount);
            textCount.push(")");
            $("#commmentHeader > .tit > span").text(textCount.join(""));
            $("#myCommmentHeader").hide();
        }

        if(listCount == 0){
            if(pageIdx == 1){
                $("#commmentHeader > .more").hide();
                var $liEmpty = $("<li>").addClass("no_txt_data").text("등록된 댓글이 없습니다.");
                dispArea.append($liEmpty);
            }else{
                PagingCaller.destroy(); // 기존 페이징 해지
            }
        }else{
            if(pageIdx == 1){
                $("#commmentHeader > .more").show();
            }
            $.each(list, function(index, element){
                var $li = $("<li>");
                dispArea.append($li);

                var fcont = element.bbcFcont;
                var $p = $("<p>").html(fcont.replaceAll('\n','<br/>' ));
                $li.append($p);

                var $spanId = $("<span>").text(element.sysRegrId);
                $li.append($spanId);

                var $spanTime = $("<span>").text(element.sDtime);
                $li.append($spanTime);

            });
        }

    },

    getBeautyMyCommentListAjax : function(){

        if(!mbeauty.detail.checkLogin()){
            return;
        }

        var evtNo = $("#evtNo").val();
        var param = {
                evtNo : evtNo
            };

        this._ajax.sendJSONRequest(
                "GET"
                , _baseUrl + "beauty/getBeautyMyCommentListJson.do"
                , param
                , this._callback_getBeautyMyCommentListAjax);

    },

    _callback_getBeautyMyCommentListAjax : function(strData) {

        var listCount = strData.totalCount;
        var list = strData.beautyCommList;
        var dispArea = $('#myCommentList');


        if(listCount == 0){
            alert("등록한 댓글이 없습니다.");
        }else{

            $("#commmentHeader").hide();
            $("#myCommmentHeader").show();

            $("#commentList").hide();
            dispArea.show();
            dispArea.empty();
            $.each(list, function(index, element){
                var $li = $("<li>");
                dispArea.append($li);

                var fcont = element.bbcFcont;
                var $p = $("<p>");
                if(!common.isEmpty(fcont)){
                    $p.html(fcont.replaceAll('\n','<br/>' ));
                }
                $li.append($p);

                var $spanId = $("<span>").text(element.sysRegrId);
                $li.append($spanId);

                var $spanTime = $("<span>").text(element.sDtime);
                $li.append($spanTime);

                var $divBox = $("<div>").addClass("btn_box");
                $li.append($divBox);

            });
        }

    },

    regBeautyCommentAjax: function(){

        var bbcFcont = $("#inpTxBox").val();
        var evtNo = $("#evtNo").val();

        if(!mbeauty.detail.checkRegAvailable()){
            return;
        }
        if(!mbeauty.detail.checkAgrmInfo()){
            return;
        }

        if(!mbeauty.detail.checkCommentInfo(bbcFcont)){
            return;
        }

        var param = {
            bbcTitNm : bbcFcont,
            bbcFcont : bbcFcont,
            evtNo : evtNo,
            mbrInfoUseAgrYn : mbeauty.detail.mbrInfoUseAgrYn,
            mbrInfoThprSupAgrYn : mbeauty.detail.mbrInfoThprSupAgrYn
        };


        this._ajax.sendJSONRequest(
                "GET"
                , _baseUrl + "beauty/regBeautyMyCommentJson.do"
                , param
                , this._callback_regBeautyCommentAjax);

    },

    _callback_regBeautyCommentAjax : function(strData) {
        if(strData.ret != -1){
            alert(strData.message);
            location.reload();
        }else{
            common.loginChk();
        }
    },


    checkLogin : function(){

        if(common.isLogin() == false){

            if(!confirm("해당 서비스는 로그인이 필요합니다.로그인 페이지로 이동하시겠습니까?")){
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
            alert("현재 뷰티테스터 응모 기간이 아닙니다.");
            return false;
        }

        return true;
      },

    checkCommentInfo : function(str){

        var sStr = $.trim(str);

        if(common.isEmpty(sStr)){
            alert("내용을 입력해주세요.");
            return false;
        }else if(sStr.length < 5){
            alert("내용을 5자 이상 입력해주세요");
            return false;
        }

        return true;
    },

    checkAgrmInfo : function(){
        var evtPrgsStatName = $.trim($("#evtPrgsStatName").val());
        var mbrInfoUseAgrYn = $.trim($("#mbrInfoUseAgrYn").val());
        var mbrInfoThprSupAgrYn = $.trim($("#mbrInfoThprSupAgrYn").val());

        if(evtPrgsStatName != 'ING'){
            mbeauty.detail.mbrInfoUseAgrYn = mbrInfoUseAgrYn;
            mbeauty.detail.mbrInfoThprSupAgrYn = mbrInfoThprSupAgrYn;

            return true;

        }

        if(mbrInfoUseAgrYn == 'Y'){

            if(!$("#chk01").is(":checked")){
                alert("개인정보 수집 이용 동의를 하셔야 뷰티테스터 참여가 가능합니다.");
                return false;
            }else{
                mbeauty.detail.mbrInfoUseAgrYn = 'Y';
            }
        }else{
            mbeauty.detail.mbrInfoUseAgrYn = 'N';
        }

        if(mbrInfoThprSupAgrYn == 'Y'){
            if(!$("#chk02").is(":checked")){
                alert("개인정보 취급 위탁 동의를 하셔야 뷰티테스터 참여가 가능합니다.");
                return false;
            }else{
                mbeauty.detail.mbrInfoThprSupAgrYn = 'Y';
            }
        }else{
            mbeauty.detail.mbrInfoThprSupAgrYn = 'N';
        }

        return true;
    },

    dispSnsPopup : function(){

        var $popLayer = $("<div>").addClass("popLayerArea");
        $("#SNSLAYER").html($popLayer);

        var $dimLayer = $("<div>").addClass("dimLayer");
        $popLayer.append($dimLayer);

        var $ul = $("<ul>").addClass("shareSNS");
        $dimLayer.append($ul);

        var $liKaka = $("<li>").addClass("kaka");
        $ul.append($liKaka);

        var $aKaka = $("<a>").addClass("snsShareDo").text("카카오톡");
        $aKaka.click(function(){common.sns.doShare("kakaotalk");});
        $liKaka.append($aKaka);


        var $liKakaS = $("<li>").addClass("kakaoS");
        $ul.append($liKakaS);

        var $aKakaS = $("<a>").addClass("snsShareDo").text("카카오스토리");
        $aKakaS.click(function(){common.sns.doShare("kakaostory");});
        $liKakaS.append($aKakaS);


        var $liFb = $("<li>").addClass("fb");
        $ul.append($liFb);

        var $aFb = $("<a>").addClass("snsShareDo").text("페이스북");
        $aFb.click(function(){common.sns.doShare("facebook");});
        $liFb.append($aFb);


        var $liUrl = $("<li>").addClass("url");
        $ul.append($liUrl);
        var $aUrl = $("<a>").addClass("snsShareDo").text("URL");
        $aUrl.click(function(){common.sns.doShare("url");});
        $liUrl.append($aUrl);
        var $divUrl = $("<div>").addClass("urlCopy").attr("id","urlInfo");
        $liUrl.append($divUrl);
        var $pUrl = $("<p>").text("아래의 URL을 복사해주세요.");
        $divUrl.append($pUrl);
        var $inputUrl = $("<div>").attr("class","input-url")
                                .attr("id","shareUrlTxt")
                                .attr("style","word-break:break-all;word-wrap:break-word;min-height:26px;max-height:51px;height:auto;");

        $inputUrl.html(mbeauty.detail.url);

        $divUrl.append($inputUrl);


        var $aClose = $("<a>").addClass("btnClose").text("닫기");
        $aClose.click(function(){
            //  드래그 방지 막기
            $.fn.disableSelection();
            common.popLayerClose("SNSLAYER");
        });
        $dimLayer.append($aClose);

    },

};


