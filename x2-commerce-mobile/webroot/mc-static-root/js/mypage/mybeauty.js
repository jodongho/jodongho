$.namespace("mmypage.beauty");
mmypage.beauty = {

    termType : -1,
    _ajax : common.Ajax,
    init : function(){


        mmypage.beauty.checkTermType();
//        $("#term").change(function(){
//            mmypage.beauty.termType = $("#term option:selected").val();
//            location.href = _baseUrl + "mypage/getMyBeautyList.do?termType="+ mmypage.beauty.termType;
//        });
    },

    checkTermType : function(){
//        var termType = $("#termType").val();
//
//        if(common.isEmpty(termType)){
//            termType = -1;
//        }
//
//        mmypage.beauty.termType = termType;
        common.setLazyLoad();
        mmypage.beauty.getMyOllyoungListAjax();
    },

    getMyBeautyListAjax : function(){

        PagingCaller.destroy();

        PagingCaller.init({
            callback : function(){
                var param = {
                    pageIdx : PagingCaller.getNextPageIdx(),
                    termType : mmypage.beauty.termType
                }

                common.Ajax.sendJSONRequest(
                        "GET"
                        , _baseUrl + "mypage/getMyBeautyListJson.do"
                        , param
                        , mmypage.beauty._callback_getMyBeautyListAjax);
            }
            ,startPageIdx : 0
            ,subBottomScroll : 700
            ,initCall : true
        });

    },

    _callback_getMyBeautyListAjax : function(strData){

        if(strData.ret == "0"){
            mmypage.beauty.dispMyBeautyList(strData);
        }else{
            common.loginChk();
        }

    },

    dispMyBeautyList : function(strData){

        var dispArea = $(".inBox5");

        var myBeautyList = strData.myBeautyList;
        var listCount = myBeautyList.length;
        var pageIdx = strData.pageIdx;
        var term = strData.termType;

        if(pageIdx == 1){
           dispArea.empty();
        }

        if(listCount <= 0 ){
            if(pageIdx == 1){
                var $divNo = $("<div>").addClass("sch_no_data2 pdzero");
                var $p = $("<p>");
                $p.text("신청하신 뷰티테스터가 없습니다");
                $divNo.append($p);
                dispArea.append($divNo);
            }else{
                PagingCaller.destroy();
            }

        }else {
            var $ulEvent = $("<ul>").addClass("myEventList");
            dispArea.append($ulEvent);

            $.each(myBeautyList, function(index, element){
                var $li = $("<li>");
                $ulEvent.append($li);

                var $aTag = $("<a>").attr("href","javascript:;");
                $li.append($aTag);

                var $span = $("<span>").addClass("type");
                $aTag.append($span);


                var $spanTag = $("<span>").addClass(element.evtPrgsStatClssName).text(element.evtPrgsStatName);
                $span.append($spanTag);
                var $spanTime = $("<span>").addClass("data").append(element.eDtime).append(element.sDtime);
                $span.append($spanTime);

                var $strong = $("<strong>").text(element.evtNm);
                $aTag.append($strong);
                $aTag.click(function(){
                    if(!common.isEmpty(element.frdmCmpsUrlAddr)){
                        common.link.commonMoveUrl(element.frdmCmpsUrlAddr);
                    }else{
                        common.link.moveBeautyDetailPage(element.evtNo);
                    }

                });

                if(element.evtPrgsStatClssName == 'end'){

                    var $divBtn = $("<div>").addClass("btnBox");

                    var $buttonWin = $("<button>").addClass("btnGrayH30")
                                              .attr("type","button")
                                              .text("당첨자 발표");
                    if(element.myWinFlag == 'Y'){
                        $buttonWin.addClass("win")
                    }
                    $buttonWin.click(function(){
                        if(common.isEmpty(element.ntcSeq)){
                            alert("당첨자 발표 페이지가 없습니다");
                            return;
                        }

                        common.link.moveNtcDetail('',element.ntcSeq);
                    });
                    $divBtn.append($buttonWin);

                    if(element.myWinFlag == 'Y' && element.myWirteFlag == 'Y'){
                        var $buttonRegGdas = $("<button>").addClass("btnGrayH30")
                                                           .attr("type","button")
                                                           .text("후기등록");
                        $buttonRegGdas.click(function(){
                            var retUrl = _baseUrl + "mypage/getMyBeautyList.do";
                            common.link.moveMyBeautyWritePage(element.evtNo,element.goodsNo,retUrl);
                        });
                        $divBtn.append($buttonRegGdas);
                    }

                    if(element.myWinFlag == 'N' && element.evtPrgsStatCd=="11"){
                        $divBtn = "";
                    }
                    $li.append($divBtn);
                }

            });
        }

    },

    getMyOllyoungListAjax : function(){

        PagingCaller.destroy();

        PagingCaller.init({
            callback : function(){
                var param = {
                    pageIdx : PagingCaller.getNextPageIdx()
                }

                common.Ajax.sendJSONRequest(
                        "GET"
                        , _baseUrl + "mypage/getMyOllyoungListJson.do"
                        , param
                        , mmypage.beauty._callback_getMyOllyoungListAjax);
            }
            ,startPageIdx : 0
            ,subBottomScroll : 700
            ,initCall : true
        });

    },

    _callback_getMyOllyoungListAjax : function(strData){

        if(strData.ret == "0"){
            mmypage.beauty.dispMyOllyoungList(strData);
        }else{
            common.loginChk();
        }

    },

    dispMyOllyoungList : function(strData){

        var dispArea = $(".tab_contents");
        var myOllyoungList = strData.myOllyoungList;
        var listCount = myOllyoungList.length;
        var pageIdx = strData.pageIdx;
        if(pageIdx == 1){
           dispArea.empty();
        }
        if(listCount <= 0 ){
            if(pageIdx == 1){
                var $divNo = $("<div>").addClass("notiBox");
                var $ul = $("<ul>").addClass("buldot_list");
                var $li3 = $("<li>").text("올영체험단 신청내역은 아래에서 확인하실 수 있습니다. 상품을 받으신 후 리뷰 작성해주세요");
                var $li1 = $("<li>").text("올영체험단 리뷰는 작성 기간 중에만 수정/삭제 가능합니다.");
                var $li2 = $("<li>").text("올영체험단 신청 후 리뷰 미작성시, 다음 올영 체험단 초대에 제한을 받을 수 있습니다.");
                $divNo.append($ul);
                $ul.append($li3);
                $ul.append($li1);
                $ul.append($li2);
                dispArea.append($divNo);
                var $ul1 = $("<ul>").addClass("review_list new");
                var $li3 = $("<li>");
                var $p1 = $("<p>").addClass("item_none").html("올영체험단 신청이력 및<br>작성된 리뷰가 없습니다.");
                dispArea.append($ul1);
                $ul1.append($li3);
                $li3.append($p1);
//                var $div1 = $("<div>").addClass("banner_ex");
//                $div1.click(function(){
//                  common.wlog("event_topreviewer_banner");
//                  mmypage.beauty.dispTopRvrPopup();
//                  common.setScrollPos();
//                  common.popLayerOpen("lay_top_reviewer");
//              });
//                var $aTag = $("<a>").attr("href","#n");
//                $div1.append($aTag);
//              var imgUrl = [];
//              imgUrl.push(_imgUrl);
//              imgUrl.push("event/ban_top_reviewer_2.jpg");
//              var $img = $("<img>").attr("src",imgUrl.join("")).attr('onerror',"common.errorImg(this);")
//                                .attr("alt","내가 이 구역의 탑리뷰어! 대체 얼마나 잘 썼길래 올리브영 탑이예요?");
//              $aTag.append($img);
                
                var $banner = mmypage.beauty.topRnkBanner();
                
                dispArea.append($banner);
            }else{
                PagingCaller.destroy();
            }

        }else {
            var $divNo = $("<div>").addClass("notiBox");
            var $ul = $("<ul>").addClass("buldot_list");
            var $li3 = $("<li>").text("올영체험단 신청내역은 아래에서 확인하실 수 있습니다. 상품을 받으신 후 리뷰 작성해주세요");
            var $li1 = $("<li>").text("올영체험단 리뷰는 작성 기간중에만 수정 가능합니다. ");
            var $li2 = $("<li>").text("올영체험단 신청 후 리뷰 미작성시, 다음 올영 체험단 초대에 제한을 받을 수 있습니다.");
            $divNo.append($ul);
            $ul.append($li3);
            $ul.append($li1);
            $ul.append($li2);
            dispArea.append($divNo);
            var $ulEvent = $("<ul>").addClass("review_list new");
            dispArea.append($ulEvent);

            $.each(myOllyoungList, function(index, element){
                var tmpStrtDate = element.startDate;
                var tmpEndDate =  element.endDate;
                var strtArr = tmpStrtDate.split("/");
                var endArr = tmpEndDate.split("/");
                var strtDate = new Date(strtArr[0], strtArr[1], strtArr[2]);
                var endDate = new Date(endArr[0], endArr[1], endArr[2]);
                var tmpNowDate = new Date();
                var year = tmpNowDate.getFullYear();
                var month =  tmpNowDate.getMonth();
                var day = tmpNowDate.getDate();
                var nowDate = new Date(tmpNowDate.getFullYear() , tmpNowDate.getMonth().toString().length == 1 ? "0"+(tmpNowDate.getMonth()+1).toString() : tmpNowDate.getMonth() , tmpNowDate.getDate().toString().length == 1 ? "0"+tmpNowDate.getDate().toString() : tmpNowDate.getDate());
                var $li = $("<li>");
//                if(element.gdasYn =='N' && endDate > nowDate){
//                    $li.addClass("lineBz")
//                }
                if(element.prgsStatCd == '30'){
                    $li.addClass("soldout type2");
                }
                if(element.soldOutYn =='Y'){
                    $li.addClass("soldout");
                }
                $ulEvent.append($li);
                var $prd_info = $("<div>").addClass("prd_info");
                $li.append($prd_info);
                var $prd_img = $("<p>").addClass("prd_img");
                
                $prd_info.append($prd_img);
                var url = [];
                url.push($("#_goodsImgUploadUrl").val()+"220/");
                url.push(element.imgPathNm);
                var $img = $("<img>").attr("src",url.join("")).attr('onerror',"common.errorImg(this);").attr("alt","상품 이미지");
                $prd_img.append($img);
                if(element.prgsStatCd == '30'){
                    var $soldend = $("<span>").addClass("soldend").text("판매종료");
                    $prd_img.append($soldend);
                }
                if(element.soldOutYn == 'Y'){
                    var $soldend = $("<span>").addClass("soldout").text("일시품절");
                    $prd_img.append($soldend);
                }
                
                var $prd_name = $("<div>").addClass("prd_name");
                $prd_info.append($prd_name);
                var $p1 = $("<p class='tit'>").text(element.onlBrndNm);
                var $p2 = $("<p>").addClass("tx_short").text(element.custFvrAplyTgtVal);
//                var $p3 = $("<p>").addClass("txt_option");
//                var $line = $("<em>").addClass("line")
                $prd_name.append($p1);
                $prd_name.append($p2);
//                $prd_name.append($p3);
//                $p3.append($line);
                var $review_info = $("<div>").addClass("review_info");
                $li.append($review_info);
                var $review_date = $("<span>").addClass("review_date").text('작성 기간');
                $review_info.append($review_date);
                $review_info.append(element.sDtime);
                var $btn_area = $("<p>").addClass("btn_area");
                $review_info.append($btn_area);
                var $btn = $("<button>");
                
                var $dlvpBtn = $("<button>");
                
                if( element.dlvpViewYn == 'Y' ){
                    $dlvpBtn.addClass('btnGray2H28').attr('id','dlvpBtn').text('배송지 확인');
                }

                if(element.gdasYn == 'Y' && element.gdasSeq != null){
                    $btn.addClass('btnMintH28').attr("id",'gdasViweBtn').text("리뷰 보기");
                    
                    /* [수정 시작] / [리뷰고도화] / [2020.06.25] / [junydad] / 올영체험단 리뷰 등록/상세 화면 들어가기 */
                    $btn.attr("data-ord-no", "");
                    $btn.attr("data-gdas-seq", element.gdasSeq);
                    $btn.attr("data-goods-no", element.goodsNo);
                    $btn.attr("data-gdas-tp-cd", "00");
                    $btn.attr("data-gdas-sct-cd", "50");
                    $btn.attr("data-item-no", "");
                    $btn.attr("data-item-nm", "");
                    $btn.attr("data-lgc-goods-no", "");
                    $btn.attr("data-ord-goods-seq", "");
                    $btn.attr("data-ord-con-yn", "");
                    $btn.attr("data-thnl-path-nm", "");
                    $btn.attr("data-oper-dt", "");
                    $btn.attr("data-origin-bizpl-cd", "");
                    $btn.attr("data-receipt-no", "");
                    $btn.attr("data-pos-no", "");
                    $btn.attr("data-str-no", "");
                    $btn.attr("data-brnd-nm", "");
                    $btn.attr("data-prgs-stat-cd", element.prgsStatCd);
                    $btn.attr("data-used1mm-gdas-yn", "");
                    $btn.attr("data-evt-no", element.evtNo);
                    $btn.attr("data-my-wirte-flag", element.myWirteFlag);
                    $btn.attr("onclick", "mmypage.gdasList.appraisalRegist(this);");
                    /* [수정 종료] / [리뷰고도화] / [2020.06.25] / [junydad] / 올영체험단 리뷰 등록/상세 화면 들어가기 */
                    
                }else{
                    if(element.gdasYn == 'N' && element.myWirteFlag == 'Y'){
                        $btn.addClass('btnMintH28').attr("id",'gdasAddBtn').text("리뷰 작성");
                        
                        /* [수정 시작] / [리뷰고도화] / [2020.06.25] / [junydad] / 올영체험단 리뷰 등록/상세 화면 들어가기 */
                        $btn.attr("data-ord-no", "");
                        $btn.attr("data-gdas-seq", element.gdasSeq);
                        $btn.attr("data-goods-no", element.goodsNo);
                        $btn.attr("data-gdas-tp-cd", "00");
                        $btn.attr("data-gdas-sct-cd", "50");
                        $btn.attr("data-item-no", "");
                        $btn.attr("data-item-nm", "");
                        $btn.attr("data-lgc-goods-no", "");
                        $btn.attr("data-ord-goods-seq", "");
                        $btn.attr("data-ord-con-yn", "");
                        $btn.attr("data-thnl-path-nm", "");
                        $btn.attr("data-oper-dt", "");
                        $btn.attr("data-origin-bizpl-cd", "");
                        $btn.attr("data-receipt-no", "");
                        $btn.attr("data-pos-no", "");
                        $btn.attr("data-str-no", "");
                        $btn.attr("data-brnd-nm", "");
                        $btn.attr("data-prgs-stat-cd", element.prgsStatCd);
                        $btn.attr("data-used1mm-gdas-yn", "");
                        $btn.attr("data-evt-no", element.evtNo);
                        $btn.attr("data-my-wirte-flag", element.myWirteFlag); 
                        $btn.attr("onclick", "mmypage.gdasList.appraisalRegist(this);");
                        /* [수정 종료] / [리뷰고도화] / [2020.06.25] / [junydad] / 올영체험단 리뷰 등록/상세 화면 들어가기 */
                        
                    }else if(element.gdasYn == 'N' && element.myWirteFlag == 'N'){
                        $btn.addClass('btnGeenH28 dis').attr("id",'gdasAddBtn').text("리뷰 미작성");
                    }
//                  if(strtDate.getTime() <= nowDate.getTime() && endDate.getTime() >= nowDate.getTime() && element.gdasYn == 'N'){
//                     $btn.addClass('btnGeenH28 w100').attr("id",'gdasAddBtn').text("리뷰 작성");
//                  }else if(endDate.getTime() < nowDate.getTime() && element.gdasYn == 'N'){
//                     $btn.addClass('btnGeenH28 w100 dis').attr("id",'gdasAddBtn').text("리뷰 미작성");
//                  }
                } 
                
                $prd_info.click(function(){
                    if(element.prgsStatCd == '30'){
                        alert('판매종료된 상품입니다.');
                    }else{
                        location.href = _baseUrl+"goods/getGoodsDetail.do?goodsNo="+element.goodsNo;
                    }
                });
                
                /* [삭제 시작] / [리뷰고도화] / [2020.06.25] / [junydad] / 올영체험단 리뷰 등록/상세 화면 들어가기 */
                /*$btn.click(function(){
                    if(element.myWirteFlag == 'Y'){
                        var retUrl = _baseUrl + "mypage/getMyOllyoungList.do";
                        var gdasSeq = 0;
                        if($.trim(element.gdasSeq).length > 0){
                            gdasSeq = element.gdasSeq;
                        }
                        common.link.moveMyOllyoungWritePage(element.evtNo,element.goodsNo,gdasSeq,retUrl);
                    }else{
                        if(element.gdasYn == 'N'){
                            return false;
                        }else{
                            location.href = _baseUrl+"mypage/getGdasDetail.do?gdasSeq="+element.gdasSeq;    
                        }
                    }
                });*/
                /* [삭제 종료] / [리뷰고도화] / [2020.06.25] / [junydad] / 올영체험단 리뷰 등록/상세 화면 들어가기 */
                
                $dlvpBtn.click(function(){
                    mmypage.beauty.getDlvpInfoPop(element.evtNo,element.goodsNo);
                });
                                
                $btn_area.append($dlvpBtn);
                
                $btn_area.append($btn);
            });
        }

    },
//    dispTopRvrPopup : function(){
//        var $popLayerArea = $('<div>').addClass('popLayerArea');
//        $('#lay_top_reviewer').empty().append($popLayerArea);
//        var $popInner = $('<div>').addClass('popInner');
//        $popLayerArea.append($popInner);
//        var $popHeader = $('<div>').addClass('popHeader');
//        $popInner.append($popHeader);
//        var $poptitle = $('<h1>').addClass('popTitle').text('탑리뷰어 소개');
//        $popHeader.append($poptitle);
//        var $aBtn = $('<a>').addClass('btnClose').attr('href','#none').attr("onclick","common.popLayerClose('lay_top_reviewer');return false;").text('닫기');
//        $popHeader.append($aBtn);
//        var $popContainer = $('<div>').addClass('popContainer');
//        var $popCont= $('<div>').addClass('popCont');
//        $popInner.append($popContainer);
//        $popContainer.append($popCont);
//        //ex_info_box start!!
//        var $layerInner = $("<div>").addClass("layerInner pdLR15");
//        $popCont.append($layerInner);
//        
//        $p1 = $("<p>").addClass("txt_01 str").text('매주 월요일 리뷰 작성과 평가 활동을 활발하게 한 리뷰어 ');
//        $span1 = $("<span>").addClass("colr").text('TOP 1,000');
//        $layerInner.append($p1);
//        $p1.append($span1);
//        $p1.append(" 위를 공개합니다.");
//        $box_tline01 = $('<div>').addClass('box_tline01 mgT15');
//        
//        $layerInner.append($box_tline01);
//        
//        $dl1 = $('<dl>').addClass('txt_info');
//        $dt1 = $('<dt>').text('리뷰어 랭킹 올리는 TIP!');
//        $dd1 = $('<dd>').html('아래 활동을 많이 하실수록 리뷰어 랭킹이 UP! UP!<br>게다가 보너스 점수까지!');
//        $dd2 = $('<dd>').addClass('gbox');
//        
//        $box_tline01.append($dl1);
//        $dl1.append($dt1);
//        $dl1.append($dd1);
//        $dl1.append($dd2);
//        
//        $ul1 = $('<ul>').addClass('list clrfix');
//        $li1 = $('<li>').text('1. 리뷰 작성 수');
//        $li2 = $('<li>').text('2. 리뷰에 포토 추가 등록');
//        $li3 = $('<li>').text('3. 도움이 돼요 받은 수');
//        $li4 = $('<li>').text('4. 도움이 돼요 평가한 수');
//        
//        $dd2.append($ul1);
//        $ul1.append($li1);
//        $ul1.append($li2);
//        $ul1.append($li3);
//        $ul1.append($li4);
//        
//        
//        $dl2 = $('<dl>').addClass('txt_info');
//        $dt2 = $('<dt>').text('추가 보너스!');
//        $dd3 = $('<dd>').html('리뷰없는 상품의 첫 리뷰를 작성 시 추가 보너스<br/>매일 활동할수록 추가 보너스');
//        $box_tline01.append($dl2);
//        $dl2.append($dt2);
//        $dl2.append($dd3);
//        
//        
//        $dl3 = $('<dl>').addClass('txt_info');
//        $dt3 = $('<dt>').text('올영체험단 기회');
//        $dd4 = $('<dd>').text('탑리뷰어 선정 시, 올영체험단 초대 확률이 올라갑니다.');
//        $box_tline01.append($dl3);
//        $dl2.append($dt3);
//        $dl2.append($dd4);
//        
//    },
    topBannerOpen : function(){
         common.wlog("event_topReviewer_banner");
         
         $("#layerPop").html($('#topReveiwerInfoPop').html());
         common.popLayerOpen2("LAYERPOP01");
         closeBtnAction = function(layerNm){
             common.popLayerClose(layerNm);
         }
    },
    
    topRnkBanner : function(){
        var $banner_ex = $("<div>").addClass("banner_ex");
        $banner_ex.click(function(){
            common.wlog("event_topReviewer_banner");
            mmypage.beauty.bannerOpen(); 
         });
        var $aLink = $("<a>").attr("href","javascript:;").attr("title","올영체험단 소개페이지 이동");
        $banner_ex.append($aLink);


        //올영체험단 배너 세팅
        var dispImgUrl = $('#dispImgUrl').val();
        var bnrImgUrl = $('#bnrImgUrl').val();
        var bnrImgTxtCont = $('#bnrImgTxtCont').val();
        var imgUrl = dispImgUrl + bnrImgUrl;
        $img = $("<img>").attr("src", imgUrl).attr('onerror',"common.errorImg(this);")
                         .attr("alt", bnrImgTxtCont);
        $aLink.append($img);
        return $banner_ex;
    },
    
    
    bannerOpen : function(){
//       common.wlog("event_ollyoung_banner");
//        mmain.event.dispOyPopup();
//        common.setScrollPos();
//        common.popFullOpen("올영체험단 소개", "");
        $(window).scrollTop(0.0); //추가부분
        $('#pop-full-title').html("올영체험단 소개");
        $('body').css({'background-color' : '#fff'}); /* 2016-12-12 퍼블리싱 수정 반영 */
        $('#oyExperienceInfoPop').hide();
        $('#pop-full-wrap').empty().html($('#oyExperienceInfoPop').html());
        $('#mWrapper').hide();
        $('.popFullWrap').show();
//        $('#pop-full-wrap').show();
        
        $(document).scrollTop(0);
         closeBtnAction = function(){
             $('#mWrapper').css('display','block');
             $('#pop-full-wrap').empty();
             $('#oyExperienceInfoPop').hide();
         }
    
         
         $('button[name=appPushBtn]').click(function(){
            if (common.app.appInfo == undefined || !common.app.appInfo.isapp) {
                if(confirm('모바일앱 설치 후 APP PUSH 수신동의 해주세요!')){
                    common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=main/getOllyoungList.do");
                }else{
                    return;
                }
            } else {
                location.href = "oliveyoungapp://settings"; 
            } 
         });
         
         $('button[name=smsBtn]').click(function(){
            var loginCheck = common.loginChk();
            if(loginCheck){
               common.link.moveMemberInfoChangePage();
            }else{
               common.link.moveLoginPage("N", location.href);
            }   
         });
        
    },

    // [3170253]올영체험단 신청배송지 팝업
    getDlvpInfoPop : function(evtNo,goodsNo){
        var param = {
            evtNo : evtNo,
            goodsNo : goodsNo
        }
//        common.Ajax.sendRequest("POST",_baseUrl + "mypage/getOliveyoungTesterDlvpInfo.do",param, mmypage.beauty.getDlvpInfoPopSuccessCallback);
        
    	$('#pop-full-contents').html('');
        
        $('#pop-full-contents').load(_baseUrl + "mypage/getOliveyoungTesterDlvpInfo.do", param, function(){
        	common.popFullOpen('신청배송지','');
        });
        
    },
    
    showCancelCausInfo : function(obj){
        var params = $(obj).data()
           ,popTitle = {
            20 : '주문취소 상세정보',
            30 : '반품 상세정보',
            40 : '교환 상세정보'
        };

        common.setScrollPos2();//클릭 시, 스크롤 위치값 localstorage 저장
        $('#pop-full-contents').html('');
        
        $('#pop-full-contents').load(_baseUrl + 'mypage/popup/getCancelCausPop.do', params, function(){
            
            common.popFullOpen(popTitle[params.chgAccpSctCd == '' ? params.ordDtlSctCd : params.chgAccpSctCd]);
        });
    },
    
    
    
    // [3170253]올영체험단 신청배송지 팝업 Callback
    getDlvpInfoPopSuccessCallback : function(data){
    	common.popFullOpen('신청배송지','');
    	$('#pop-full-contents').html('');
    	$('#pop-full-contents').html(data);
//        $("#layerPop").html(data);
//        common.popLayerOpen2("LAYERPOP01");
//        $("#footerTab").hide();
    },
};
