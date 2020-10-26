/**
 * 나의 기프트카드 
 * 
 */
var timerX;

var myGiftCardList = null;
var myCardIdx = 0;
var nowCardNo = null;
var nowCardNm = null;
var cancelAllList = "";
var cancelYCnt = 0;
var totPresentDtlCnt = 0;
var reqIdx = 0;
var reqPresentIdx = 0;
var bOnload = false;
var bMyGiftTab = false;

var gcMyCardSwiper = new Swiper('.gc-mycard-swiper', {
    slidesPerView: 1.3,
    spaceBetween: 25,
    centeredSlides: true,
    slideToClickedSlide: true,
    pagination: '.gc-swiper-pagination',
    paginationClickable: true
});

/**
 * 나의 기프트카드
 */
$.namespace("mypage.myGiftCard.search");
    mypage.myGiftCard.search = {
    _ajax : common.Ajax,
   
    init : function(option){
        bMyGiftTab = false;
        
        
        /*
         * 3319403 기프트카드 잔여결함
         * 새로고침 시 최근 조회 날짜를 담고 있는 세션스토리지 데이터 초기화  
         */
        sessionStorage.removeItem("giftStrtDt");
        sessionStorage.removeItem("giftEndDt");

        if($('#tabSetFlag').val() == "P"){
            history.replaceState({page: 2}, "title 2", "?tabSetFlag=M");
            mypage.myGiftCard.search.setPagingCaller("P");
            mypage.myGiftCard.search.getPresentList(1); 
        }else{
            mypage.myGiftCard.search.getMyGiftCardList();
        }
        
    }
    
    
    /*나의 기프트카드 페이지 이동*/
    ,moveMyGiftCardPage : function() {
         location.href = _plainUrl + "myGiftCard/getMyGiftCard.do";
     }
    /*나의 기프트카드 카드등록 페이지 이동*/
    ,moveMyGiftCardRegPage : function() {
         location.href = _plainUrl + "myGiftCard/getMyGiftCardReg.do";
     }
    /*나의 기프트카드 카드등록안내 페이지 이동*/
    ,moveMyGiftCardRegInfoPage : function() {
         location.href = _plainUrl + "myGiftCard/getMyGiftCardRegInfo.do";
     }
    /*기프트카드 안내페이지 이동*/
    ,moveGiftCardGuidePage : function(themeNo, themeNm, themeType) {
        location.href = _plainUrl + "giftCardGuide/getGiftCardGuide.do";
    }
    /* 기프트카드 상세페이지 이동*/
    ,moveGiftCardGuideDtlPage : function() {
        var goodsNo = $("#dtl_goodsNo").val();
        var preView = '0';
         location.href = _plainUrl + "giftCardGuide/getGiftCardGuideDtl.do?goodsNo="+goodsNo+"&preView="+preView;
     }
    /*선물내역 상세 이동*/
    ,moveGiftCardPresentDtlPage : function(ordNo, ordTm) {
       /*선물 상세 이후 백버튼시, 선물내역 tab 보여주기 위한 flag*/ 
        /*적용시 주석풀기*/
        history.replaceState({page: 2}, "title 2", "?tabSetFlag=P");

        
        $('#ordNo').val(ordNo);
        $('#ordDtime').val(ordTm);
        
        $("#nowMyGCForm").attr('action', _baseUrl + "myGiftCard/getMyGiftCardPresentDtl.do");
        $("#nowMyGCForm").attr('method', "POST");
        $("#nowMyGCForm").attr('onsubmit', true);
        $("#nowMyGCForm").submit();
    
    }
    /*나의 기프트카드 사용내역 페이지 이동*/
    ,moveMyGiftCardUseList : function() {
        
        history.replaceState({page: 2}, "title 2", "?cardSwipeFlag="+myCardIdx);
        $('#cardNo').val(myGiftCardList[myCardIdx].cardNo);
        $('#maskCardNo').val(myGiftCardList[myCardIdx].encCardNo);
        $('#cardNm').val(myGiftCardList[myCardIdx].cardNm);
        $('#imgPathNm').val(myGiftCardList[myCardIdx].imgPathNm);
        $('#conBalanceAmount').val(myGiftCardList[myCardIdx].conBalanceAmount);
        $("#nowMyGCForm").attr('action', _baseUrl + "myGiftCard/getMyGiftCardUseList.do");
        $("#nowMyGCForm").attr('method', "POST");
        $("#nowMyGCForm").attr('onsubmit', true);
        $("#nowMyGCForm").submit();
     }
    /*나의 기프트카드 사용내역 상세 페이지 이동*/
    ,moveMyGiftCardUseListDtl : function(ordNo, ordTm, ordGoodsSeq, cancelFlag) {
        
        $('#ordNo').val(ordNo);
        $('#ordDtime').val(ordTm.substr(0,16));
        $('#ordGoodsSeq').val(ordGoodsSeq);
        $('#cancelFlag').val(cancelFlag);
    //  window.history.replaceState('forward', null, 'getMyGiftCardUseList.do');    
        $("#useMyGCForm").attr('action', _baseUrl + "myGiftCard/getMyGiftCardUseListDtl.do");
        $("#useMyGCForm").attr('method', "POST");
        $("#useMyGCForm").attr('onsubmit', true);
        $("#useMyGCForm").submit();
    }
    /*나의 기프트카드 사용내역 상세 페이지 이동*/
    ,moveMyGiftCardUsePresentDtl : function(ordNo, ordTm, ordGoodsSeq) {
        
        $('#ordNo').val(ordNo);
        $('#ordDtime').val(ordTm.substr(0,16));
        $('#ordGoodsSeq').val(ordGoodsSeq);
    //  window.history.replaceState('forward', null, 'getMyGiftCardUseList.do');    
        $("#useMyGCForm").attr('action', _baseUrl + "myGiftCard/getGiftCardPresentUseDtl.do");
        $("#useMyGCForm").attr('method', "POST");
        $("#useMyGCForm").attr('onsubmit', true);
        $("#useMyGCForm").submit();
    }
    
    , moveMyGiftCardUseListDtlBack : function(){
    //      window.history.replaceState('forward', null, 'getMyGiftCard.do');   
        $("#useMyDtlGCForm").attr('action', _baseUrl + "myGiftCard/getMyGiftCardUseList.do");
        $("#useMyDtlGCForm").attr('method', "POST");
        $("#useMyDtlGCForm").attr('onsubmit', true);
        $("#useMyDtlGCForm").submit();
    }
    
    
    //여기
    , clickMyGiftCardTab : function() {
        if(!bOnload){
            return;
        }
        $('#tabBtn_myGiftCard').addClass('is-active');
        $('#tabBtn_giftList').removeClass('is-active');
        $('#myGiftCardTab').show();
        $('#giftListTab').hide();
        mypage.myGiftCard.search.getMyGiftCardList();
     }
    , clickGiftListTab : function() {
        if(!bOnload){
            return;
        }
        $('#tabBtn_myGiftCard').removeClass('is-active');
        $('#tabBtn_giftList').addClass('is-active');
        $('#giftListTab').show();
        $('#myGiftCardTab').hide();
        //선물내역 조회
        mypage.myGiftCard.search.setPagingCaller("P");
        mypage.myGiftCard.search.getPresentList(1); 
     }
    
    /***********************************************************************
     * 
     * 카드 등록시작
     * 
     **********************************************************************/
    
    ,giftCardReg : function(){
       var inputCardNo =  $('#cardNumber').val().replaceAll(" - ","");
       var inputScratchNo = $('#cardScratchNumber').val();
      
       if(inputCardNo.length < 16 || inputScratchNo.length<6){
           alert("카드 등록정보를 확인해주세요");
           return false;
       }
       if(inputCardNo.substr(0,4)!='8611'&&inputCardNo.substr(0,4)!='8613'){
           alert("올리브영 또는 CJ기프트카드만 등록 할 수 있습니다.");
           return false;
       }
       
       var param = {
               cardNo  : inputCardNo
             , pinNo     : inputScratchNo
       }; 
       this._ajax.sendRequest("GET"
               , _baseUrl + "myGiftCard/getMyGiftCardSave.do"
               , param
               , mypage.myGiftCard.search.getMyGiftCardSaveCallback
           );
    }
    ,getMyGiftCardSaveCallback : function (res){
        mypage.myGiftCard.search.getGiftCardSaveAfter(res);
       
    }
    /*등록된 카드 상세 조회*/
    ,getGiftCardSaveAfter: function(res){
        if(common.isEmpty(res)||res.userCardArray == undefined){
            alert("카드 정보를 다시 한번 확인해주세요");
            return false;
        }else{
            var param = {
                    issCd   : res.userCardArray[0].issCd
                  , cardNo  : res.userCardArray[0].cardNo
                  , imgCd      : res.userCardArray[0].imgCd
                  , conBalanceAmount : res.userCardArray[0].conBalanceAmount             
            }; 
            
            this._ajax.sendRequest("GET"
                    , _baseUrl + "myGiftCard/getMyGiftCardDtl.do"
                    , param
                   , mypage.myGiftCard.search.getGiftCardSaveAfterCallback
                );
        }
        
    }
    /*등록완료 페이지 이동*/
    ,getGiftCardSaveAfterCallback : function (res){
        $("#searchForm").attr('action', _baseUrl + "myGiftCard/getMyGiftCardRegDone.do");
        
        $('#cardNo').val(res[0].cardNo);
        $('#cardNm').val(res[0].cardNm);
        $('#imgPathNm').val(res[0].imgPathNm);
        $('#conBalanceAmount').val(res[0].conBalanceAmount);
        
        $("#searchForm").attr('method', "POST");
        $("#searchForm").submit();
       
    }// 등록된 카드 유통기한 조회
    , getGiftCardRegValid : function(searchCardNo) {
        var param = {
               cardNo  : searchCardNo
               ,getType : 'R'
        }; 
        
        this._ajax.sendRequest("GET"
                , _baseUrl + "myGiftCard/getMyGiftCardDtm.do"
                , param
                , mypage.myGiftCard.search.getGiftCardRegValidCallback
            );

     }, getGiftCardRegValidCallback : function (res){
         var valTm = res.availableTime.substr(0,4)+"."+res.availableTime.substr(4,2)+"."+res.availableTime.substr(6,2);
         $("#reg_valid").text(valTm);
         
     }
    /***********************************************************************
     * 카드 등록끝
     **********************************************************************/
    
    /***********************************************************************
     * 나의 기프트카드 조회 시작
     **********************************************************************/
    ,getMyGiftCardList : function(param){
        if(bMyGiftTab){
            return;
        }
        
        bOnload = false;    
        bMyGiftTab = true;
        $("#C_gcListLoading").show();
        
        this._ajax.sendRequest("GET"
                , _baseUrl + "myGiftCard/getMyGiftCardList.do"
                , param
                , mypage.myGiftCard.search.getMyGiftCardListCallback
            );
    }

    , getMyGiftCardListCallback : function (res){

        myGiftCardList = res;
          var cont = '';
        var myCardImg = '';
        var myCardNm = '';
        
        if(common.isEmpty(res)||res == undefined||res.length<1){
            
           /* cont += '   <div class="gc-tab">';
            cont += '<a href="#" class="is-active" id = "tabBtn_myGiftCard" onclick="javascript:mypage.myGiftCard.search.clickMyGiftCardTab();">나의 기프트카드</a>';
            cont += '<a href="#" onclick="javascript:mypage.myGiftCard.search.clickGiftListTab();">선물내역</a>';
            cont += '</div>';
    */
            cont += '<div class="gc-my-util">';
            cont += '    <span class="btn"><button type="button" class="card-add" onclick="javascript:mypage.myGiftCard.search.moveMyGiftCardRegPage();"><span>카드등록</span></button></span>';
            cont += '    <span class="btn"><button type="button" class="card-buy" onclick="javascript:display.dispGiftCardGuide.search.moveGiftCardGuidePage();"><span>카드구매</span></button></span>';
            cont += '</div>';
    
            cont += '<div class="sch_no_data">';
            cont += '    <p>보유한 기프트카드가<br>없습니다.</p>';
            cont += '</div>';
           
            $('#myGiftCardTab').html(cont);
            $("#C_gcListLoading").hide();
        }
        else{//보유 카드 있을경우
            /*이미지 부분*/
            for(var i=0;i<res.length;i++){
            	
                /*******************************카드이미지*******************************************/
                myCardImg += '<div class="swiper-slide">';
                if(res[i].bl  == "N"){//분실카드
                    myCardImg +=  '<div class="card-inner lock"><!-- 분실카드일 경우 lock 추가 -->';
                    myCardImg +=  '     <div class="lock-block gc-flex-center">';
                    myCardImg +=  '        <span>분실카드</span>';
                    myCardImg +=  '     </div>';
                }else if(res[i].bl == "D"){//사용불가
                    myCardImg +=  '<div class="card-inner lock"><!-- 분실카드일 경우 lock 추가 -->';
                    myCardImg +=  '     <div class="lock-block gc-flex-center">';
                    myCardImg +=  '        <span class="not-available">사용 불가 카드</span>';
                    myCardImg +=  '     </div>';
                }else if(res[i].bl == "E"){//사용불가
                    myCardImg +=  '<div class="card-inner lock"><!-- 분실카드일 경우 lock 추가 -->';
                    myCardImg +=  '     <div class="lock-block gc-flex-center">';
                    myCardImg +=  '        <span class="not-available">유효기간만료</span>';
                    myCardImg +=  '     </div>';
                }else{
                    myCardImg +=  '<div class="card-inner">';
                }
                    myCardImg +=  '  <div class="front">';
                if(i == 0){//대표여부
                    myCardImg +=  '      <button type="button" class="btn-main-card is-active" id="rep_card_yn_'+i+'"  onclick="javascript:mypage.myGiftCard.search.alreadyRep();"><span class="icon-star">주카드</span></button>';
                }else{
                    myCardImg +=  '      <button type="button" class="btn-main-card" id="rep_card_yn_'+i+'" onclick="javascript:mypage.myGiftCard.search.setRepCard();"><span class="icon-star">카드</span></button>';
                }
                
                    myCardImg +=  '      <span class="card-img img"><img src="'+_goodsImgUploadUrl+res[i].imgPathNm+'"></span>';
                    myCardImg +=  '      <div class="touch-alert"><span>결제시 카드 터치</span></div>';
                    myCardImg +=  '  </div>';
            
                    myCardImg +=  '  <div class="back">';
                    
                    myCardImg +=  '<div class="inner" id="'+i+'-refresh" style="display:none">';
                    myCardImg +=  '    <span class="time">유효시간이 초과되었습니다.</span>';
                    myCardImg +=  '    <button type="button" class="gc-btn-refresh" onclick="javascript:mypage.myGiftCard.search.getMyGiftCardOtp(myGiftCardList[myCardIdx]);" >';
                    myCardImg +=  '        <span>새로고침</span>';
                    myCardImg +=  '    </button>';
                    myCardImg +=  '          <button type="button" class="back-close">닫기</button>';
                    myCardImg +=  '</div>';
                    
                    myCardImg +=  '      <div class="inner" id="'+i+'-back">';
                    myCardImg +=  '          <span class="time">유효시간 <span id="'+i+'-time-detail" class="time-detail">04:30</span></span>';
                    myCardImg +=  '          <div class="barcode">';
                    myCardImg +=  '              <div class="img">';
                    myCardImg +=  '                  <img id="'+i+'-fullBarcode" src="">';
                    myCardImg +=  '              </div>';
                    myCardImg +=  '              <div class="number">';
                    myCardImg +=  '                  <span id="'+i+'-cardNo1"></span>';
                    myCardImg +=  '                  <span id="'+i+'-cardNo2"></span>';
                    myCardImg +=  '                  <span id="'+i+'-cardNo3"></span>';
                    myCardImg +=  '                  <span id="'+i+'-cardNo4"></span>';
                    myCardImg +=  '                  <span id="'+i+'-cardOtp"></span>';
                    myCardImg +=  '              </div>';
                    myCardImg +=  '          </div>';
                    myCardImg +=  '          <button type="button" class="back-close">닫기</button>';
                    myCardImg +=  '      </div>';
                    myCardImg +=  '  </div>';
                    myCardImg +=  '</div>';
                    myCardImg +=  '</div>';
                
                /*******************************카드명*******************************************/
                
                
                   if(i==0){
                       myCardNm +=  '<div class="gc-card-info is-active">';
                   }else{
                       myCardNm +=  '<div class="gc-card-info">';
                   }
                    myCardNm +=  '<p class="card-name">';
                    myCardNm +=  '    <span class="txt">'+res[i].cardNm+'</span>';
                    myCardNm +=  '</p>';
                    myCardNm +=  '<input type="hidden" id="now_cardNo_'+i+'" name="cardNo" value="'+res[i].cardNo+'" />';
        
                    var balance = res[i].conBalanceAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    myCardNm +=  '<p class="card-price">'+balance+'<span>원</span></p>';
        
                    myCardNm +=  '<div class="card-btn">';
                    myCardNm +=  '    <button class="btn-icon card-use-list" type="button" onclick="javascript:mypage.myGiftCard.search.moveMyGiftCardUseList(); return false;">';
                    myCardNm +=  '        <span>이용내역</span>';
                    myCardNm +=  '    </button>';
                    myCardNm +=  '    <button class="btn-icon card-del" type="button" onclick="javascript:mypage.myGiftCard.search.getMyGiftCardWaste();">';
                    myCardNm +=  '        <span>카드삭제</span>';
                    myCardNm +=  '    </button>';
                    myCardNm +=  '    <button class="btn-icon card-refund" type="button" onclick="javascript:mypage.myGiftCard.search.moveRefund();">';
                    myCardNm +=  '        <span>환불신청</span>';
                    myCardNm +=  '    </button>';
                if(res[i].bl == "N"){//분실카드
                    myCardNm +=  '    <button class="btn-icon card-lost lock" type="button" onclick="javascript:mypage.myGiftCard.search.getMyGiftCardMissingCncl();">';
                    myCardNm +=  '        <span>분실해지</span>';
                    myCardNm +=  '    </button>';                  
                }else{
                    myCardNm +=  '    <button class="btn-icon card-lost" type="button" onclick="javascript:mypage.myGiftCard.search.getMyGiftCardMissing();">';
                    myCardNm +=  '        <span>분실신고</span>';
                    myCardNm +=  '    </button>';
                }
                    myCardNm +=  '</div>';
        
                    myCardNm +=  '</div>';     
                
                    
                    
            }
         // console.log(myCardImg);
          $('#mygiftcard_show').empty();
          $('#gcMyCardInfo').empty();
            $('#mygiftcard_show').html(myCardImg);
            $('#gcMyCardInfo').html(myCardNm);
            $("#C_gcListLoading").hide();
           
           

      
        
        if(!$('.gc-mycard-swiper').hasClass('swiper-container-horizontal')){
            gcMyCardSwiper = new Swiper('.gc-mycard-swiper', {
                slidesPerView: 1.3,
                spaceBetween: 25,
                centeredSlides: true,
                slideToClickedSlide: true,
                pagination: '.gc-swiper-pagination',
                paginationClickable: true
            });
                
        } else {
            gcMyCardSwiper.update();
            gcMyCardSwiper.slideTo(0);
        }
        
        // 카드가 하나일 경우 페이징 숨김 및 터치 슬라이드 disabled
        if($('.gc-mycard-swiper .swiper-slide').length == 1){
            $('.gc-mycard-swiper .gc-swiper-pagination').hide();
            gcMyCardSwiper.params.touchRatio = 0;
        }

        gcMyCardSwiper.on('slideChangeStart', function(e, t){
            // 터치로 슬라이드 인덱스가 변경됬을 때 : 개발 진행 필요 시 사용
            $('#gcMyCardInfo .gc-card-info').removeClass('is-active');
            $('#gcMyCardInfo .gc-card-info').eq(e.activeIndex).addClass('is-active');
            myCardIdx = e.activeIndex;
            
            nowCardNo = res[myCardIdx].cardNo;
            nowCardNm = res[myCardIdx].cardNm;
         
        })

        // 카드 터치 시
        $('.gc-mycard-swiper .card-img').on('click', function(){
            
            if( myGiftCardList[myCardIdx] != null ){
             
                mypage.myGiftCard.search.getMyGiftCardOtp(myGiftCardList[myCardIdx]);
            }
            
            var $slide = $(this).parents('.swiper-slide');
            var $t = $slide.find('.card-img');

            // 모서리만 보이는 카드 터치 시에는 작동하지 않음
            if($(this).parents('.swiper-slide').hasClass('swiper-slide-active') && ($t.offset().left - $t.width()) < 0) {
                $('.gc-mycard-swiper').find('.back').hide();
                $slide.find('.card-inner').find('.back').fadeIn();
            }
        })

        // 카드 닫기
        $('.gc-mycard-swiper .back-close').on('click', function() {
            var $slide = $(this).parents('.swiper-slide');
            $slide.find('.card-inner').find('.back').fadeOut();
            
            clearInterval(timerX); 
        });

        $('.gc-card-info .card-edit').on('click', function() {
            var $txt = $(this).parent().find('.txt').text();
            $('.gc-layer-card-eidt').find('.input input').val($txt);
            $('.gc-layer-card-eidt').show();
        });

        $('.gc-layer-card-eidt .gc-layer-close, .gc-layer-card-eidt .gc-mask').on('click', function(){
            $('.gc-layer-card-eidt').hide();
        });
        
        if( $('#cardSwipeFlag').val() != null &&  $('#cardSwipeFlag').val()!= ""){
            gcMyCardSwiper.slideTo($('#cardSwipeFlag').val());
            history.replaceState({page: 2}, "title 2", "?cardSwipeFlag="+0);
            $('#cardSwipeFlag').val(0);
        }
        }//보유 카드 있을경우 끝
        bOnload = true;
        
       /* if($('#tabSetFlag').val() == "P"){
            history.replaceState({page: 2}, "title 2", "?tabSetFlag=M");
            mypage.myGiftCard.search.clickGiftListTab();
        }*/
    }
    /***********************************************************************
     * 나의 기프트카드 조회 끝
     **********************************************************************/
    
    // 나의기프트카드 상세내역 조회
   /*, getMyGiftCardDtl : function(idx) {
       
       console.log("기명기프트카드 상세내역 조회!!!");
       
       var param = {
               issCd   : myGiftCardList[idx].issCd
             , cardNo  : myGiftCardList[idx].cardNo
             , imgCd      : myGiftCardList[idx].imgCd
             , conBalanceAmount : myGiftCardList[idx].conBalanceAmount                  
       }; 
       
       this._ajax.sendRequest("GET"
               , _baseUrl + "myGiftCard/getMyGiftCardDtl.do"
               , param
               , mypage.myGiftCard.search.getMyGiftCardDtlCallback
           );

    }, getMyGiftCardDtlCallback : function (res){
        console.log("기명기프트카드 상세콜백!!!!!!!!!!!!");
        
        
        
    }*/
    
    /*****************************************************************************************
     * 나의 기프트카드 버튼 기능 (대표카드설정, 삭제, 환불신청, 분실신고, 분실신고취소 
     *************************************************************************************/
    , alreadyRep: function() {
        alert("이미 대표카드로 지정되어 있습니다. 변경하시려면 다른 카드를 대표카드로 지정해주세요");
    }
    , setRepCard: function() {
        if ( confirm(nowCardNm+" 카드를 대표카드로 변경할까요?") ){
            var param = {
                   cardNo  : myGiftCardList[myCardIdx].cardNo
            }; 
            this._ajax.sendRequest("GET"
                    , _baseUrl + "myGiftCard/updateRepCard.do"
                    , param
                    , mypage.myGiftCard.search.updateRepCardCallback
                );
        }else{
            return;
        }
        
    },
    updateRepCardCallback : function (){
        bMyGiftTab = false;
        mypage.myGiftCard.search.getMyGiftCardList();
    }
     
      // 나의기프트카드 분실신고
      , getMyGiftCardMissing : function(idx) {
          if(myGiftCardList[myCardIdx].bl  == "E"){
              alert("유효기간 만료된 카드로 분실신고가 불가능합니다.");
              return false;
          }
          if(myGiftCardList[myCardIdx].bl  == "D"){
              alert("폐기된 카드로 분실신고가 불가능합니다.");
              return false;
          }
          
        if ( confirm("기프트카드 사용을 정지 하시겠습니까?") ){
          var param = { 
                  issCd   : myGiftCardList[myCardIdx].issCd
                , cardNo  : myGiftCardList[myCardIdx].cardNo
                , imgCd      : myGiftCardList[myCardIdx].imgCd
                , conBalanceAmount : myGiftCardList[myCardIdx].conBalanceAmount                  
          }; 
          
          this._ajax.sendRequest("GET"
                  , _baseUrl + "myGiftCard/getMyGiftCardMissing.do"
                  , param
                  , mypage.myGiftCard.search.getMyGiftCardMissingCallback
              );
        }else{
            return false;
        }

       }, getMyGiftCardMissingCallback : function (res){
         
           alert("분실신고가 정상적으로 완료되었습니다.");
           bMyGiftTab = false;
           mypage.myGiftCard.search.getMyGiftCardList();
           
       }
       // 나의기프트카드 분실신고 취소
       , getMyGiftCardMissingCncl : function(idx) {
           
           if ( confirm("분실신고를 해지하시겠습니까?") ){
           
               var param = {
                   
                    cardNo  : myGiftCardList[myCardIdx].cardNo
                                     
               }; 
               
               this._ajax.sendRequest("GET"
                       , _baseUrl + "myGiftCard/getMyGiftCardMissingCncl.do"
                       , param
                       , mypage.myGiftCard.search.getMyGiftCardMissingCnclCallback
                   );
           }
           else{
               return false;
           }
        }, getMyGiftCardMissingCnclCallback : function (res){
            
            alert("분실신고가 정상적으로 해지되었습니다.");
            bMyGiftTab = false;
            mypage.myGiftCard.search.getMyGiftCardList();
        }
      
     // 나의기프트카드 폐기
        , getMyGiftCardWaste : function(idx) {
           /* if(myGiftCardList[myCardIdx].pinNo ==" "){
                alert("삭제 불가능한 카드입니다.");
                return false;
            }*/
            
            if(myGiftCardList[myCardIdx].conBalanceAmount !="0"){
                alert("카드 잔액이 있을경우 삭제가 불가능합니다.");
                return false;
            }  
            if(myGiftCardList[myCardIdx].bl  == "N"){
                alert("분실 신고처리 카드는 삭제가 불가능합니다.");
                return false;
            }
            
            if ( confirm("카드를 삭제 하시겠습니까?") ){
                var param = {
                        issCd   : myGiftCardList[myCardIdx].issCd
                      , bl :   myGiftCardList[myCardIdx].bl
                      , cardNo  : myGiftCardList[myCardIdx].cardNo
                     // , pinNo : myGiftCardList[myCardIdx].pinNo
                      , conBalanceAmount : myGiftCardList[myCardIdx].conBalanceAmount                  
                }; 
                
                this._ajax.sendRequest("GET"
                        , _baseUrl + "myGiftCard/getMyGiftCardWaste.do"
                        , param
                        , mypage.myGiftCard.search.getMyGiftCardWasteCallback
                    );
            }else{
                return false;
            }
         }, getMyGiftCardWasteCallback : function (res){
             
             alert("카드가 정상적으로 삭제되었습니다.");
             bMyGiftTab = false;
             mypage.myGiftCard.search.getMyGiftCardList();
           
         }
         /** 환불신청 * */
         ,moveRefund : function(){
             
             if ( confirm("환불신청시 기프트카드는 삭제되며, 구매내역이 있는경우 반품이 불가합니다. 환불신청하시겠습니까?") ){
                // window.open('about:blank').location.href = "https://www.ennice.co.kr/m/nonUser/refundVoucher.do?null";
                
                 common.app.callOpenBrowser("https://www.ennice.co.kr/m/nonUser/refundVoucher.do");
               
                 //테스트용 url
                // common.app.callOpenBrowser("http://st.ennice.co.kr/m/nonUser/refundVoucher.do?null#noback");
               
             }else{
                 return;
             }
             
         }
         /*****************************************************************************************
          * 나의 기프트카드 버튼 기능 (대표카드설정, 삭제, 환불신청, 분실신고, 분실신고취소 끝 
          *************************************************************************************/
         
         
         /*****************************************************************************************
          * 나의 기프트카드 사용내역 시작 
          *************************************************************************************/
         , clickRecentList : function() {
             
             $('#recentList').addClass('is-active');
             $('#termList').removeClass('is-active');
             $('#recentTab').show();
             $('#termTab').hide();
             mypage.myGiftCard.search.setPagingCaller("R");
             var card_no =  $('#cardNo').val();
             mypage.myGiftCard.search.getMyGiftCardRecUseInfo(1);
          }
         , clickTermList : function() {
             
             $('#recentList').removeClass('is-active');
             $('#termList').addClass('is-active');
             $('#termTab').show();
             $('#recentTab').hide();
             mypage.myGiftCard.search.setPagingCaller("T");
             var card_no =  $('#cardNo').val();
             mypage.myGiftCard.search.getMyGiftCardTermUseInfo(1);
             
          }
         
         /*나의기프트카드 사용내역_카드 유통기한 조회*/
         , getGiftCardUseListValid : function(searchCardNo) {
             var param = {
                    cardNo  : searchCardNo
                    ,getType : 'U'
             }; 
             
            /* this._ajax.sendRequest("GET"
                     , _baseUrl + "myGiftCard/getMyGiftCardDtm.do"
                     , param
                     , mypage.myGiftCard.search.getGiftCardUseListValidCallback
                 );*/

             $.ajax({
                 data:param,
                 url:_baseUrl + "myGiftCard/getMyGiftCardDtm.do",
                 type:'GET',
                 dataType : 'json',
                 timeout:10000,
                 success:function(data){
                     mypage.myGiftCard.search.getGiftCardUseListValidCallback(data)
                 },
                 error:function(data) {
                     $('#refresh_btn').show();
                     
                 }
             });
             
             
          }, getGiftCardUseListValidCallback : function (res){
              var valTm = "유효기간 : ~ "+res.availableTime.substr(0,4)+"."+res.availableTime.substr(4,2)+"."+res.availableTime.substr(6,2);
              $("#useList_validDt").text(valTm);
              $("#conBalanceAmount").val(res.conBalanceAmount);
              $("#lastBalanceAmount").val(res.lastBalanceAmount);
             
          }
          
          // 나의기프트카드 최근내역 조회
          , getMyGiftCardRecUseInfo : function(pageIdx) {
              $('#gcListLoading').show();
              reqIdx = pageIdx;
              if(pageIdx==1){
                  $('#useList_cont').empty();
              }
              var param = {
                     cardNo  : $('#cardNo').val()
                     ,pageIdx : pageIdx
              }; 
              
              this._ajax.sendRequest("GET"
                      , _baseUrl + "myGiftCard/getGiftCardTrade1List.do"
                      , param
                      , mypage.myGiftCard.search.getMyGiftCardRecUseInfoCallback
                  );

           }, 
           
           // 나의기프트카드 최근내역 조회 콜백함수
           getMyGiftCardRecUseInfoCallback : function (res){
        	   $('#gcListLoading').hide();
               if(reqIdx==1){
                   $('#useList_cont').empty();
               }
               
               if(res.length<1){
                   
                   if(trim($('#useList_cont').html())==""){
                       $('#useList_cont').hide();
                       $('#no_Data').show();
                       $('#refresh_btn').hide();
                       PagingCaller.destroy(); 
                   }
                  
                   PagingCaller.destroy();
                   
               }else{
                   $('#useList_cont').show();
                   $('#no_Data').hide();
                   $('#refresh_btn').hide();
                   //4_2_5_2 적용
                 
                   //dealSpCd 거래유형 (5:사용, 6:사용 취소, 7:판매/충전, 8:판매/충전 취소)
                   var UseStr = '';
                   for(var i=0;i<res.length;i++){
                       UseStr +=  '    <div class="gc-list-item">';
                       if((res[i].dealSpCd =="8"||res[i].dealSpCd =="7")&&res[i].dtlYn =="Y"){
                           if(res[i].giftYn=="Y"){
                               UseStr +=  '        <a  class="link" onclick="javascript:mypage.myGiftCard.search.moveMyGiftCardUsePresentDtl(\''+res[i].ordNo+'\',\''+res[i].ordDtime+'\',\''+res[i].ordGoodsSeq+'\'); return false;">';
                           }else{
                               UseStr +=  '        <a  class="link" onclick="javascript:mypage.myGiftCard.search.moveMyGiftCardUseListDtl(\''+res[i].ordNo+'\',\''+res[i].ordDtime+'\',\''+res[i].ordGoodsSeq+'\',\''+res[i].cancelFlag+'\'); return false;">';    
                           }
                       }else{
                           UseStr +=  '        <div class="link">';
                       }
                       UseStr +=  '            <div>';
                       var day = res[i].ordDtime.substr(0,10);
                       UseStr +=  '                 <p class="date">'+day+'</p>';
                       UseStr +=  '                <div class="inner">';
                      
                       //SR_3319556케이스 구별
                       if(res[i].giftYn=="Y"){
                    	   UseStr +=  '                    <p class="store">선물</p>';
                       }else{
                    	   UseStr +=  '                    <p class="store">'+res[i].dealSpNm+'</p>';
                       }
                       
                       var price = res[i].salePrc.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                       if(res[i].dealSpCd =="6"||res[i].dealSpCd =="8"||res[i].dealSpCd =="22"){
                           UseStr +=  '                    <span class="price cancel">'+price+'</span>';
                       }else{
                           UseStr +=  '                    <span class="price">'+price+'</span>';
                       }
                       if(res[i].dealSpCd =="8"||res[i].dealSpCd =="6"||res[i].dealSpCd =="22"){
                           UseStr +=  ' <span class="cancel-txt">취소완료</span>';
                       }
                       UseStr +=  '                </div>';
                       UseStr +=  '            </div>';
                       if(res[i].dealSpCd =="8"||res[i].dealSpCd =="7"){
                           UseStr +=  '        </a>';
                       }else{
                           UseStr +=  '        </div>';
                       }
                       UseStr +=  '    </div>';
                   }
                   $('#useList_cont').append(UseStr);
               }
              
           }
           
           // 나의기프트카드 기간별 내역 조회
           , getMyGiftCardTermUseInfo : function(pageIdx) {
               $('#T_gcListLoading').show();
               reqIdx = pageIdx;
              
             
              if( $('#fromDt').val()==null || $('#fromDt').val()==""||  $('#toDt').val()==null||$('#toDt').val()==""){
                  alert("조회 일자를 선택해주세요.");
                  mypage.myGiftCard.search.setTermUseSearchDate();
                  $('#T_gcListLoading').hide();
                  PagingCaller.destroy(); 
                  return false;
              }
               
             var diff=  mypage.myGiftCard.search.dateDiff($('#fromDt').val(),$('#toDt').val());
             if(diff>366){
                 alert("최근 1년 이내 이용내역만 조회됩니다.");
                 $('#T_gcListLoading').hide();
                 PagingCaller.destroy(); 
                 return false;
             }
             
             var chkStrDt =  parseInt($('#fromDt').val().replaceAll('-',''));
             var chkEndDt =  parseInt($('#toDt').val().replaceAll('-',''));
             if(chkStrDt>chkEndDt){
                 alert('검색종료일이 검색시작일 이전입니다.');
                 $('#T_gcListLoading').hide();
                 mypage.myGiftCard.search.setTermUseSearchDate();
                 PagingCaller.destroy(); 
                 return false;
             }  
             if(pageIdx==1){
                 $('#term_useList_cont').empty();
             }
             
               var param = {
                      cardNo  : $('#cardNo').val()
                      ,strDt : $('#fromDt').val()
                      ,endDt : $('#toDt').val()
                      ,pageIdx : pageIdx
               }; 
               
               this._ajax.sendRequest("GET"
                       , _baseUrl + "myGiftCard/getGiftCardTrade2List.do"
                       , param
                       , mypage.myGiftCard.search.getMyGiftCardTermUseInfoCallback
                   );

            }
           , getMyGiftCardTermUseInfoCallback : function (res){
               $('#T_gcListLoading').hide();
               
               if(reqIdx==1){
                   $('#term_useList_cont').empty();
               }
               
               if(res.length<1){
                   if(trim($('#term_useList_cont').html())==""){
                       $('#term_useList_cont').hide();
                       $('#term_noData').show();
                       $('#term_refresh_btn').hide();
                       PagingCaller.destroy(); 
                   }
                   
                  
                   PagingCaller.destroy();
                   
               }else
               {
                   $('#term_useList_cont').show();
                   $('#term_noData').hide();
                   $('#term_refresh_btn').hide();
                   //4_2_5_2 적용
                 
                // dealSpCd  거래유형 ''5' : 사용, '6' : 사용 취소, 판매/충전: '7', 판매/충전 취소: '8'
                   
                   
                   var UseStr = '';
                   for(var i=0;i<res.length;i++){
                       UseStr +=  '    <div class="gc-list-item">';
                       if((res[i].dealSpCd =="8"||res[i].dealSpCd =="7")&&res[i].dtlYn =="Y"){
                           if(res[i].giftYn=="Y"){
                               UseStr +=  '        <a class="link" onclick="javascript:mypage.myGiftCard.search.moveMyGiftCardUsePresentDtl(\''+res[i].ordNo+'\',\''+res[i].ordDtime+'\',\''+res[i].ordGoodsSeq+'\'); return false;">';    
                           }else{
                               UseStr +=  '        <a class="link" onclick="javascript:mypage.myGiftCard.search.moveMyGiftCardUseListDtl(\''+res[i].ordNo+'\',\''+res[i].ordDtime+'\',\''+res[i].ordGoodsSeq+'\',\''+res[i].cancelFlag+'\'); return false;">';    
                           }
                       }else{
                           UseStr +=  '        <div class="link">';
                       }
                       UseStr +=  '            <div>';
                       var day = (res[i].ordDtime.substr(0,10)).replaceAll('-','.');
                       UseStr +=  '                 <p class="date">'+day+'</p>';
                       UseStr +=  '                <div class="inner">';
                       UseStr +=  '                    <p class="store">'+res[i].dealSpNm+'</p>';
                       var price = res[i].salePrc.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                       if(res[i].dealSpCd =="6"||res[i].dealSpCd =="8"||res[i].dealSpCd =="22"){
                           UseStr +=  '                    <span class="price cancel">'+price+'</span>';
                       }else{
                           UseStr +=  '                    <span class="price">'+price+'</span>';
                       }
                       if(res[i].dealSpCd =="8"||res[i].dealSpCd =="6"||res[i].dealSpCd =="22"){
                           UseStr +=  ' <span class="cancel-txt">취소완료</span>';
                       }
                       UseStr +=  '                </div>';
                       UseStr +=  '            </div>';
                       if(res[i].dealSpCd =="8"||res[i].dealSpCd =="7"){
                           UseStr +=  '        </a>';
                       }else{
                           UseStr +=  '        </div>';
                       }
                       UseStr +=  '    </div>';
                   }
                  
                   $('#term_useList_cont').append(UseStr);
               }
              
           }
           
           /*이용내역 상세*/
        // 나의기프트카드 상세내역 조회
           , getMyGiftCardDtlUseInfo : function(searchOrdNo, cardNo) {
               
               var param = {
                      ordNo  : searchOrdNo,
                      cardNo : cardNo
               }; 
               
               this._ajax.sendRequest("GET"
                       , _baseUrl + "myGiftCard/getGiftCardTradeDtlList.do"
                       , param
                       , mypage.myGiftCard.search.getMyGiftCardDtlUseInfoCallback
                   );

            }
           , getMyGiftCardDtlUseInfoCallback : function (res){
               
               /*if(res.length<1){
                   return false;
               }
               */
               
               
               var data = res[0];
               var salePrc = res[0].salePrc.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
               var OrderStr = '';
               OrderStr +=  '<li>';
               OrderStr +=  '<div class="order_prd_info">';
               OrderStr +=  '    <a  class="prd_img" onclick="javascript:mypage.myGiftCard.search.moveGiftCardGuideDtlPage();">';
               OrderStr +=  '        <img src="'+_goodsImgUploadUrl+res[0].imgPathNm+'" alt="썸네일 이미지">';
               OrderStr +=  '    </a>';
               OrderStr +=  '    <a class="prd_tit" onclick="javascript:mypage.myGiftCard.search.moveGiftCardGuideDtlPage();">';
               OrderStr +=  '        <span class="brand">'+res[0].cardGbnNm+'</span>';
               OrderStr +=  '        <span class="name">'+res[0].goodsNm+'</span>';
               OrderStr +=  '    </a>';
               OrderStr +=  '   <p class="prd_price"><span class="current"><span>'+salePrc+'</span>원</span></p>';
               OrderStr +=  '    <button type="button" id="btnReceipt" class="gc-btn-receipt" onclick="javascript:iframePopLayerOpen(\'gcReceiptPopup\'); return false;" >영수증 확인</button>';
              // OrderStr +=  '    <button type="button" id="btnReceipt" class="gc-btn-receipt" onclick="javascript:mypage.myGiftCard.search.moveGiftCardPresentDtlPage(\''+res[i].ordNo+'\',\''+res[i].ordDtime+'\');" >영수증 확인</button>';
               OrderStr +=  '</div>';
               OrderStr +=  '</li>';
               $('#dtl_goodsNo').val(res[0].goodsNo);  
               $('#order_List').html(OrderStr);
               
               
             //판매/충전: '7', 판매/충전 취소: '8'
             if(data.dealSpCd=="7" && data.cancelFlag=="Y" && $('#cancelFlag').val()=="Y"){
                 $('#btn_cancel').show();
             }
             if(data.dealSpCd=="8"){
                 $('#cancel_done').show();
             }
             
             var sum ='';
             sum +=  '<span class="tit"><strong>총 결제금액</strong></span>';
             sum +=  '<span class="won">'+salePrc+'<em>원</em></span>';
             
             var mtd = '';
             mtd +=  '<span class="tit"><strong>결제수단</strong></span>';
            // mtd +=  '<span class="won">'+res[0].acqrNm+'<br>일시불</span>';
             
             if(res[0].payMeanCd =="11"){
                 mtd +=  '<span class="won">'+res[0].acqrNm+'<br>일시불</span>';
             }else{
                 mtd +=  '<span class="won">계좌이체<br>'+res[0].acqrNm+'</span>';
             }
             
             
             $('#use_sum').html(sum);
             $('#use_mtd').html(mtd);
             
               
           }
           
   /*****************************************************************************************
    * 나의 기프트카드 사용내역 끝
    *************************************************************************************/
   /*****************************************************************************************
    * 선물내역 시작
    *************************************************************************************/ 
           
           // 나의기프트카드 선물내역 조회
           , getPresentList : function(pageIdx) {
              
               
               $('#P_gcListLoading').show();
              
              
               if( $('#presentStrDt').val()==null || $('#presentStrDt').val()==""||  $('#presentEndDt').val()==null||$('#presentEndDt').val()==""){
                   alert("조회 일자를 선택해주세요.");
                   mypage.myGiftCard.search.setPresentSearchDate();
                   $('#P_gcListLoading').hide();
                   PagingCaller.destroy();
                   return false;
               }  
             var chkStrDt =  parseInt($('#presentStrDt').val().replaceAll('-',''));
             var chkEndDt =  parseInt($('#presentEndDt').val().replaceAll('-',''));
             if(chkStrDt>chkEndDt){
                 alert('검색종료일이 검색시작일 이전입니다.');
                 sessionStorage.removeItem("giftStrtDt");
                 sessionStorage.removeItem("giftEndDt");
                 mypage.myGiftCard.search.setPresentSearchDate();
                 $('#P_gcListLoading').hide();
                 PagingCaller.destroy();
                 return false;
             }  
             reqPresentIdx = pageIdx;
             if(pageIdx==1){
                 $('#yes_present').empty();
             }
             
               var param = {
                    fromDt :  $('#presentStrDt').val()
                    , toDt : $('#presentEndDt').val()
                    ,pageIdx : pageIdx
               }; 
               bOnload = false; 
               

               /*
               this._ajax.sendRequest("GET"
                       , _baseUrl + "myGiftCard/getGiftCardPresentList.do"
                       , param
                       , mypage.myGiftCard.search.getPresentListCallback
                   );
               */
               
               /**
                *  3319403 선물내역 수정 건 - leesh
                *  getMyGiftCard.jsp 에서 no cache를 선언했지만 IOS에선 소용이 없다.
                *  $('#yes_present')가 IOS에선 완전히 비워지지 않았고 getGiftCardPresentList.do 또한 호출하지 않았다.
                *  IOS의 ajax 호출 시 no cache를 강제하기 위해 호출 방식을 변경했고 callback 함수 호출 방식 또한 변경했다. 
                */
               $.ajax({
            	   data : param,
            	   cache : false,
            	   url : _baseUrl + "myGiftCard/getGiftCardPresentList.do",
            	   type : 'GET',
            	   dataType : 'json',
            	   success : function(res){
            		   $('#P_gcListLoading').hide();
                       
                       if(reqPresentIdx==1){
                           $('#yes_present').empty();
                       }
                       
                       if(res.length<1){
                           
                           if(trim($('#yes_present').html())==""){
                               $('#yes_present').hide();
                               $('#no_present').show();
                               PagingCaller.destroy(); 
                           }
                           PagingCaller.destroy();
                       }else{
                           $('#yes_present').show();
                           $('#no_present').hide();
                       }

                       var PresentStr = '';
                       for(var i=0;i<res.length;i++){
                           PresentStr +=  '<div class="gc-list-item">';
                           PresentStr +=  '    <a class="link">';
                           PresentStr +=  '        <div onclick="javascript:mypage.myGiftCard.search.moveGiftCardPresentDtlPage(\''+res[i].ordNo+'\',\''+res[i].ordDtime+'\');">';
                           var day = (res[i].ordDtime.substr(0,10)).replaceAll('-','.');
                           PresentStr +=  '             <p class="date">'+day+'</p>';
                           if(res[i].receiverCnt>0){
                               PresentStr +=  '            <p class="msg">'+res[i].receiverNm+' 외 '+res[i].receiverCnt+'명 에게 선물을 보냈습니다.</p>';
                           }else{
                               PresentStr +=  '            <p class="msg">'+res[i].receiverNm+'님에게 선물을 보냈습니다.</p>';    
                           }
                           
                           PresentStr +=  '            <div class="inner">';
                           if(res[i].receiverCnt>0){
                               PresentStr +=  '                <p class="status">'+res[i].acceptStatNm+' 외 '+res[i].receiverCnt+'건</p>';
                           }else{
                               PresentStr +=  '                <p class="status">'+res[i].acceptStatNm+'</p>';
                           }
                           var salePrice = res[i].salePrc.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                           PresentStr +=  '                <span class="price">'+salePrice+'</span>';
                           PresentStr +=  '            </div>';
                           PresentStr +=  '        </div>';
                           PresentStr +=  '    </a>';
                           PresentStr +=  '</div>';
                       }
                       
                       $('#yes_present').append(PresentStr);
                       bOnload = true;
            	   },
            	   error : function(data){
            		   console.log("getGiftCardPresentList failed");
            	   }
               });

            }, getPresentListCallback : function (res){
                $('#P_gcListLoading').hide();
               
                if(reqPresentIdx==1){
                    $('#yes_present').empty();
                }
                
                if(res.length<1){
                    
                    if(trim($('#yes_present').html())==""){
                        $('#yes_present').hide();
                        $('#no_present').show();
                        PagingCaller.destroy(); 
                    }
                    PagingCaller.destroy();
                }else{
                    $('#yes_present').show();
                    $('#no_present').hide();
                }
                
                
                var PresentStr = '';
                for(var i=0;i<res.length;i++){
                    PresentStr +=  '<div class="gc-list-item">';
                    PresentStr +=  '    <a class="link">';
                    PresentStr +=  '        <div onclick="javascript:mypage.myGiftCard.search.moveGiftCardPresentDtlPage(\''+res[i].ordNo+'\',\''+res[i].ordDtime+'\');">';
                    var day = (res[i].ordDtime.substr(0,10)).replaceAll('-','.');
                    PresentStr +=  '             <p class="date">'+day+'</p>';
                    if(res[i].receiverCnt>0){
                        PresentStr +=  '            <p class="msg">'+res[i].receiverNm+' 외 '+res[i].receiverCnt+'명 에게 선물을 보냈습니다.</p>';
                    }else{
                        PresentStr +=  '            <p class="msg">'+res[i].receiverNm+'님에게 선물을 보냈습니다.</p>';    
                    }
                    
                    PresentStr +=  '            <div class="inner">';
                    if(res[i].receiverCnt>0){
                        PresentStr +=  '                <p class="status">'+res[i].acceptStatNm+' 외 '+res[i].receiverCnt+'건</p>';
                    }else{
                        PresentStr +=  '                <p class="status">'+res[i].acceptStatNm+'</p>';
                    }
                    var salePrice = res[i].salePrc.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    PresentStr +=  '                <span class="price">'+salePrice+'</span>';
                    PresentStr +=  '            </div>';
                    PresentStr +=  '        </div>';
                    PresentStr +=  '    </a>';
                    PresentStr +=  '</div>';
                }
                
                $('#yes_present').append(PresentStr);
                bOnload = true;
            }
            
            , getPresentListDtl : function(ordNo) {
                var param = {
                        ordNo   : ordNo
                }; 
                this._ajax.sendRequest("GET"
                        , _baseUrl + "myGiftCard/getGiftCardPresentDtlList.do"
                        , param
                        , mypage.myGiftCard.search.getPresentListDtlCallback
                    );
            }
            , getPresentListDtlCallback : function (res){
                if(res[0].presentMsg==null || trim(res[0].presentMsg)==""){
                    $('#card_view').addClass('no-msg');
                    $('#card_text').hide();
                }
                $('#giftMessage').text(res[0].presentMsg);
                var totPrice = 0;
                var refundYn = 'N';
                
                cancelYCnt = 0;
                
                totPresentDtlCnt = res.length;
                var Dtl = '';
                for(var i=0;i<res.length;i++){
                    totPrice = totPrice + parseInt(res[i].salePrc);
                   
                    if(i==0){
                        Dtl +=  '<p class="tit">선물 정보</p>';    
                    }
                    Dtl +=  '<div class="row">';
                    Dtl +=  '<div class="inner">';
                    Dtl +=  '    <span class="name">'+res[i].receiverNm+'</span>';
                    Dtl +=  '    <span class="phone">'+res[i].presentCellNo1+'</span>';
                    if(res[i].acceptStatCd=="10"){
                        Dtl +=  '    <span class="status"><strong>' + res[i].acceptStatNm + '</strong></span>';
                        Dtl +=  '    </div>';
                        if(res[i].cancelFlag =='Y'){
                            cancelYCnt = cancelYCnt+1;
                            cancelAllList += res[i].ordGoodsSeq +'-';
                            Dtl +=  '    <div class="btn">';
                            Dtl +=  '        <button type="button" onclick="javascript:mypage.myGiftCard.search.setCancelR(\''+res[i].ordNo+'\',\''+res[i].ordGoodsSeq+'\',\'R\');">선물취소</button>'; /*취소붙이기*/
                            Dtl +=  '        <button type="button" onclick="javascript:mypage.myGiftCard.search.reSendMms(\''+res[i].ordNo+'\',\''+res[i].ordGoodsSeq+'\');">재전송</button>';/*재전송 붙이기*/
                            Dtl +=  '    </div>';
                        }
                    }else if(res[i].acceptStatCd=="20"){
                        Dtl +=  '    <span class="status"><strong>' + res[i].acceptStatNm + '</strong></span>';
                        Dtl +=  '    </div>';
                        if(res[i].cancelFlag =='Y'){
                            cancelYCnt = cancelYCnt+1;
                            cancelAllList += res[i].ordGoodsSeq +'-';
                            Dtl +=  '    <div class="btn">';
                            Dtl +=  '        <button type="button" onclick="javascript:mypage.myGiftCard.search.setCancelR(\''+res[i].ordNo+'\',\''+res[i].ordGoodsSeq+'\',\'R\');">선물취소</button>';   /*취소붙이기*/
                            Dtl +=  '        <button type="button" onclick="javascript:mypage.myGiftCard.search.reSendMms(\''+res[i].ordNo+'\',\''+res[i].ordGoodsSeq+'\');">재전송</button>';/*재전송 붙이기*/
                            Dtl +=  '    </div>';
                        }
                    }else if(res[i].acceptStatCd=="30"){
                        Dtl +=  '    <span class="status"><b>' + res[i].acceptStatNm + '</b></span>';
                        Dtl +=  '    </div>';
                    }else if(res[i].acceptStatCd=="40"){
                        refundYn = 'Y';
                        Dtl +=  '    <span class="status"><em>' + res[i].acceptStatNm + '</em></span>';
                        Dtl +=  '    </div>';
                    }else if(res[i].acceptStatCd=="50"){
                        refundYn = 'Y';
                        Dtl +=  '    <span class="status">' + res[i].acceptStatNm + '</span>';
                        Dtl +=  '    </div>';
                    }
                    
                    Dtl +=  '</div>';
                   // Dtl +=  '</div>';
                    if(res[i].cancelFlag =='Y'){
                        $('#cancelAllBtn').show();
                    }
                    
                }
               
                //acqrNm;          //카드사명
                //  private String payMeanCd;       // 결제수단
                //private String payMeanNm;       // 결제수단명
                var payMtd = '';
                    payMtd +=  '<li>';
                    payMtd +=  '<span class="tit"><strong>결제수단</strong></span>';
                    if(res[0].payMeanCd =="11"){
                        payMtd +=  '<span class="won">'+res[0].acqrNm+'<br>일시불</span>';
                    }else{
                        payMtd +=  '<span class="won">계좌이체<br>'+res[0].acqrNm+'</span>';
                    }
                    payMtd +=  '</li>';
                
                var Img = '';
                    Img += '<img src="'+_goodsImgUploadUrl+res[0].imgPathNm+'" alt="썸네일 이미지" onclick="javascript:mypage.myGiftCard.search.moveGiftCardGuideDtlPage();">';
                    
                    
                    totPrice =  totPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); 
                $('#dtl_goodsNo').val(res[0].goodsNo);  
                $('#totPresentPrc').text(totPrice);
                $('#totPrc').html(totPrice+'<em>원</em>');  
                $('#presentPayMtd').html(payMtd);
                $('#giftDtlCont').html(Dtl);
                
                $('#presentBrand').text(res[0].cardGbnNm);
                $('#presentCardNm').text(res[0].goodsNm);
                $('#presentCardImg').html(Img);
                var ImgBack = '';
              
                var displayImgUploadUrl = $('#displayImgUploadUrl').val();
               // var displayImgUploadUrl = $('#displayImgUploadUrl').val();
                ImgBack += '<div class="select-card-image" style="background-image:url('+displayImgUploadUrl+res[0].msgCardImgNm+')"></div>';
                //ImgBack += '<div class="select-card-image" style="background-image:url('+_goodsImgUploadUrl+res[0].msgCardImgNm+')"></div>';
                $('#back_img').html(ImgBack);
                
                
                if(refundYn == 'Y'){ //환불 있을경우
                    
                    var refundPrice = res[0].refundAmt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    var refStr = '';
                        refStr +=  '<div class="order_info_area lineTc">';
                        refStr +=  '    <p class="tx_order_tit">환불내역</p>';
                        refStr +=  '</div>';
                        
                        refStr +=  '<ul class="mlist-payment">';
                        refStr +=  '    <li class="total">';
                        refStr +=  '        <ul class="area">';
                        refStr +=  '            <li class="sum">';
                        refStr +=  '                <span class="tit"><strong>환불금액</strong></span>';
                        
                        refStr +=  '                <span class="won">'+refundPrice+'<em>원</em></span>';
                        refStr +=  '            </li>';
                        refStr +=  '        </ul>';
                        refStr +=  '    </li>';
                        refStr +=  '    <li class="pay">';
                        refStr +=  '        <ul class="area" >';
                        refStr +=  '            <li>';
                        refStr +=  '                <span class="tit"><strong>환불수단</strong></span>';
                        if(res[0].payMeanCd =="11"){
                            refStr +=  '                <span class="won">신용카드 승인취소</span>';
                        }else{
                            refStr +=  '                <span class="won">계좌이체 환불</span>';
                        }
                        
                        refStr +=  '            </li>';
                        refStr +=  '        </ul>';
                        refStr +=  '   </li>';
                        refStr +=  '</ul>';
                    
                        $('#presentRefund').html(refStr);
                        
                }
                
                
                
            }
    /*****************************************************************************************
     * 선물내역 끝
     *************************************************************************************/           
         
         
        
    
          
  /*****************************************************************************************
   * 바코드 시작
   *************************************************************************************/
          
          , getMyGiftCardOtp : function(param){
              common.wlog("giftcard_barcode_param");
              $('#'+myCardIdx+'-back').show();
              $('#'+myCardIdx+'-refresh').hide();
              
              param.myCardIdx = myCardIdx;
              //param.pinNo = "310088";
             // param.pinNo = myGiftCardList[myCardIdx].pinNo;
             // console.log(myGiftCardList[myCardIdx].pinNo);
              this._ajax.sendRequest("GET"
                      , _baseUrl + "myGiftCard/getMyGiftCardOtp.do"
                      , param
                      , mypage.myGiftCard.search.getMyGiftCardOtpCallback
                  );
              
          }
          , getMyGiftCardOtpCallback : function (res){
              if( res.resultCode == '0000' ){
                  var resCardNo = res.cardNo;
                  var varcodeno = res.cardNo+res.conPin;
                  $('#'+myCardIdx+'-cardNo1').text(resCardNo.substring(0,4));
                  $('#'+myCardIdx+'-cardNo2').text(resCardNo.substring(4,8));
                  $('#'+myCardIdx+'-cardNo3').text(resCardNo.substring(8,12));
                  $('#'+myCardIdx+'-cardNo4').text(resCardNo.substring(12,16));
                  $('#'+myCardIdx+'-cardOtp').text(res.conPin);
                  
                  $('#'+myCardIdx+'-time-detail').text("04:30");
                  
                  // 타이머 강제 종료 (다른카드에서 돌고 있는 타이머가 있다면 초기화 한다.);
                  clearInterval(timerX); 
                  
                  var ss = 30;
                  //var ss = 05;
                  var mm = 4;
                  //var mm = 0;
                  
                  var tStr, tMm, tSs;
                  
                  // 타이머 시작 1초마다 
                  timerX = setInterval(function() {
                      tMm = mm < 10 ? '0'+mm : ''+mm;
                      tSs = ss < 10 ? '0'+ss : ''+ss;
                      tStr = tMm+':'+tSs;
                      // 1초씩 감소
                      ss--;
                      // 0초 이하로 내려가면 mm을 감소 시키고 ss를 초기화
                      if( ss < 0 ){
                          mm--;
                          ss = 59
                      }
                      
                      // mm 이 0이면 타이머 종료.
                      if( mm < 0){
                          // 강제 타이머 종료.
                          clearInterval(timerX); 
                          tStr = "00:00";
                          $('#'+myCardIdx+'-back').hide();
                          $('#'+myCardIdx+'-refresh').show();
                          
                          
                          //재클릭시    mypage.myGiftCard.search.getMyGiftCardOtp(myGiftCardList[myCardIdx]);
                          
                      }
                      $('#'+myCardIdx+'-time-detail').text(tStr);
                  }, 1000);
                  $('#'+myCardIdx+'-fullBarcode').JsBarcode(varcodeno, {displayValue : false, background : "#f8f8f8"});
              }
              
              
          }
  /*****************************************************************************************
   * 바코드 끝
   *************************************************************************************/
         , getMyGiftCardReceipt : function(searchOrdNo, receiptUrl) {
              
               this._ajax.sendRequest("GET"
                       , _baseUrl + "myGiftCard/getMyGiftCardReceipt.do"
                       , { ordNo  : searchOrdNo , receiptUrl : receiptUrl}
                       , mypage.myGiftCard.search.getMyGiftCardReceiptCallback
                   );

            }
           , getMyGiftCardReceiptCallback : function (res){
               
               //$('#btnReceipt').hide();
               
               if( res == null ){
                   return false;
               }
               
//             if( res.PAY_GRP_ID != null && res.MERS_NO != null && res.TRADE_NO != null ){
               if(res.PAY_GRP_ID != null && res.MERS_NO != null && res.TRADE_NO != null ){
                //   $('#btnReceipt').show();
                   
                   var iframeUrl = "";
                   iframeUrl += res.receiptUrl+'?SHOP_SYS_NO='+res.TRADE_NO+'&SHOP_ID='+res.MERS_NO;
                   iframeUrl += '&PAY_GRP_ID='+res.PAY_GRP_ID+'&mode=R&footer=N';

                //   iframeUrl = "https://cjpay.cjsystems.co.kr/cjs/pg/adj/receipt.fo?SHOP_SYS_NO=293301577489394&SHOP_ID=CJ1610130001&mode=R";
                       
                   $('#iframeReceipt').attr('src',iframeUrl);
               }
               $('#btnReceipt').show();
               
               
               function iOS_version() {
                   if (navigator.userAgent.match(/ipad|iphone|ipod/i)) { //if the current device is an iDevice
                       var ios_info = {};
                       ios_info.User_Agent = navigator.userAgent;
                       ios_info.As_Reported = (navigator.userAgent).match(/OS (\d)?\d_\d(_\d)?/i)[0];
                       ios_info.Major_Release = (navigator.userAgent).match(/OS (\d)?\d_\d(_\d)?/i)[0].split('_')[0];
                       ios_info.Full_Release = (navigator.userAgent).match(/OS (\d)?\d_\d(_\d)?/i)[0].replace(/_/g, ".");
                       ios_info.Major_Release_Numeric = +(navigator.userAgent).match(/OS (\d)?\d_\d(_\d)?/i)[0].split('_')[0].replace("OS ", "");
                       ios_info.Full_Release_Numeric = +(navigator.userAgent).match(/OS (\d)?\d_\d(_\d)?/i)[0].replace("_", ".").replace("_", "").replace("OS ", "");   //converts versions like 4.3.3 to numeric value 4.33 for ease of numeric comparisons
                       return (ios_info);
                   }
               }
               var iOS = iOS_version();

               if (iOS) {
                   if (iOS.Major_Release_Numeric > 12) {
                       document.getElementById("gcReceiptPopup").classList.add('is-new');
                   }
               }
               
               
           },openReceiptLayerPop : function(){
               common.setScrollPos();
               $("#layerPop").html($("#gcReceiptPopup").html());
               // 0001063: MO_상품 상세 페이지 > 레이어창 팝업시 화면 밀림 현상
               common.popLayerOpen2("LAYERPOP01");
           }
        
           /**
            * 페이징 세팅
            */
          , setPagingCaller : function (type) {
               PagingCaller.curPageIdx = 1;
               PagingCaller.init({
                   callback : function(){
                       
                       var param = {
                           pageIdx : PagingCaller.getNextPageIdx(),
                           appendTo : true
                       }
                           //mcounsel.faq.list.getFaqListAjax(param);
                       
                       if(type=="T"){//사용내역 기간별 검색
                           mypage.myGiftCard.search.getMyGiftCardTermUseInfo(PagingCaller.getNextPageIdx());    
                       }else if(type=="R"){//최근 사용내역 검색
                           mypage.myGiftCard.search.getMyGiftCardRecUseInfo(PagingCaller.getNextPageIdx());    
                       }else if(type=="P"){//선물내역 검색
                           mypage.myGiftCard.search.getPresentList(PagingCaller.getNextPageIdx());    
                       }
                       
                       
                   }
                   ,startPageIdx : 1
                   ,subBottomScroll : 700
                   //초기화 시 최초 목록 call 여부
                   ,initCall : false
               });
           }

          // 두개의 날짜를 비교하여 차이를 알려준다.
          , dateDiff : function(_date1, _date2) {
              var diffDate_1 = _date1 instanceof Date ? _date1 :new Date(_date1);
              var diffDate_2 = _date2 instanceof Date ? _date2 :new Date(_date2);
           
              diffDate_1 =new Date(diffDate_1.getFullYear(), diffDate_1.getMonth()+1, diffDate_1.getDate());
              diffDate_2 =new Date(diffDate_2.getFullYear(), diffDate_2.getMonth()+1, diffDate_2.getDate());
           
              var diff = Math.abs(diffDate_2.getTime() - diffDate_1.getTime());
              diff = Math.ceil(diff / (1000 * 3600 * 24));
          /* if(diff>366){
               alert("최근 1년 이내 이용내역만 조회됩니다.");
               return false;
           }*/
            return diff;  
          }
    
          
          /*****************취소********************/
          , setCancel : function(ordNo, ordGoodsSeq,type) {
              var txt = "취소 하시겠습니까?";
              if(type =="R"){
                  var txt = "선물을 취소 하시겠습니까?";
              }
              if ( confirm(txt) ){
                  var param = {
                          ordNo :  ordNo
                       , ordGoodsSeqs : ordGoodsSeq
                      
                  }; 
                  
                  this._ajax.sendRequest("GET"
                          , _baseUrl + "orderGiftCard/cancelOrder.do"
                          , param
                          , mypage.myGiftCard.search.setCancelCallback
                      );
              }else{
                  return false;
              }
             
           }
         ,setCancelCallback: function(res){
             alert(res.resultMsg);
             $("#btn_cancel").hide();
             history.replaceState({page: 2}, "title 2", "?cardSwipeFlag="+0);
             mypage.myGiftCard.search.moveMyGiftCardPage();
             var srcOrdNo = $("#ordNo").val();
             var srcCardNo = $("#cardNo").val();
             //mypage.myGiftCard.search.getMyGiftCardDtlUseInfo(srcOrdNo, srcCardNo);
         }
         
         /*****************취소********************/
         , setCancelR : function(ordNo, ordGoodsSeq,type) {
             var txt = "취소 하시겠습니까?";
             if(type =="R"){
                 var txt = "선물을 취소 하시겠습니까?";
             }
             if ( confirm(txt) ){
                 var param = {
                         ordNo :  ordNo
                      , ordGoodsSeqs : ordGoodsSeq
                     
                 }; 
                 
                 this._ajax.sendRequest("GET"
                         , _baseUrl + "orderGiftCard/cancelOrder.do"
                         , param
                         , mypage.myGiftCard.search.setCancelRCallback
                     );
             }else{
                 return false;
             }
            
          }
        ,setCancelRCallback: function(res){
          
            alert(res.resultMsg);
            $('#cancelAllBtn').hide();
            var srcOrdNo = $("#ordNo").val();
            mypage.myGiftCard.search.getPresentListDtl(srcOrdNo);
        }
        
        /*****************전체취소********************/
        , setCancelT : function() {
            var txt = "취소 가능한 선물은"+cancelYCnt+"건 입니다. "+cancelYCnt+"건을 전체취소 하시겠습니까?";
            if(cancelYCnt ==totPresentDtlCnt){
                var txt = "선물을 전체 취소 하시겠습니까?";
            }
            if ( confirm(txt) ){
                var param = {
                        ordNo :  $("#ordNo").val()
                     , ordGoodsSeqs : cancelAllList
                    
                }; 
             
                this._ajax.sendRequest("GET"
                        , _baseUrl + "orderGiftCard/cancelOrder.do"
                        , param
                        , mypage.myGiftCard.search.setCancelTCallback
                    );
            }else{
                return false;
            }
           
         }
       ,setCancelTCallback: function(res){
           
           if(cancelYCnt == totPresentDtlCnt){
               alert("전체취소 되었습니다.");
           }else{
               alert("부분취소 되었습니다.");
           }
           $('#cancelAllBtn').hide();
           var srcOrdNo = $("#ordNo").val();
          
           mypage.myGiftCard.search.getPresentListDtl(srcOrdNo);
       }
       
       
       , reSendMms : function(ordNo,ordGoodsSeq) {
        
               var param = {
                       ordNo : ordNo
                       , ordGoodsSeq : ordGoodsSeq
                   
               }; 
          
               this._ajax.sendRequest("GET"
                       , _baseUrl + "myGiftCard/setMmsResend.do"
                       , param
                       , mypage.myGiftCard.search.reSendMmsCallback
                   );
           
          
        }
       ,reSendMmsCallback: function(res){
           alert("재전송 되었습니다.");
           var srcOrdNo = $("#ordNo").val();
           mypage.myGiftCard.search.getPresentListDtl(srcOrdNo);
       }
       
       
       , getGiftCardRegNm : function(cardNo) {
           var param = {
                   cardNo : cardNo
               
           }; 
      
           this._ajax.sendRequest("GET"
                   , _baseUrl + "myGiftCard/getGiftCardRegNm.do"
                   , param
                   , mypage.myGiftCard.search.getGiftCardRegNmCallback
               );
       }
       ,getGiftCardRegNmCallback: function(res){
           $("#reg_card_nm").text(res);
       }
       
       /*시작전 api health check!*/
       , healthChk : function() {
//           $("#C_gcListLoading").show();
           var param = {
                
           }; 
      
           this._ajax.sendRequest("GET"
                   , _baseUrl + "myGiftCard/getGiftCardHealthCheck.do"
                   , param
                   , mypage.myGiftCard.search.healthChkCallback
               );
       }
       ,healthChkCallback: function(res){
          if(res.prgsStatCd=="40"){
              alert('시스템 점검중으로 \n일시적 사용이 불가합니다.');
              $("#C_gcListLoading").hide();
              return false;
          }
          bMyGiftTab = false;
          mypage.myGiftCard.search.init();
       }
       
       ,setPresentSearchDate : function(){
           var today = new Date();
           var dd = today.getDate();
           var mm = today.getMonth()+1; //January is 0!
           var yyyy = today.getFullYear();
           if(dd<10) {
               dd='0'+dd
           } 

           if(mm<10) {
               mm='0'+mm
           } 
           today = yyyy+'-'+mm+'-'+dd;
          
           $('#presentEndDt').val(today);
           
           var d = new Date()
           var dayOfMonth = d.getDate()
           d.setDate(dayOfMonth -6)
           var fdd = d.getDate();
           var fmm = d.getMonth()+1; //January is 0!
           var fyyyy = d.getFullYear();
           if(fdd<10) {
               fdd='0'+fdd
           } 

           if(fmm<10) {
               fmm='0'+fmm
           } 
           fromDay = fyyyy+'-'+fmm+'-'+fdd;
           $('#presentStrDt').val(fromDay);
       }
       ,setTermUseSearchDate : function(){
           var today = new Date();
           var today2 = today.getDate();
           today.setDate(today2-1);    
           var dd = today.getDate();
           var mm = today.getMonth()+1; //January is 0!
           var yyyy = today.getFullYear();
           if(dd<10) {
               dd='0'+dd
           } 

           if(mm<10) {
               mm='0'+mm
           } 
           today = yyyy+'-'+mm+'-'+dd;
          
           $('#toDt').val(today);
           
           var d = new Date()
           var dayOfMonth = d.getDate()
           d.setDate(dayOfMonth -7)
           var fdd = d.getDate();
           var fmm = d.getMonth()+1; //January is 0!
           var fyyyy = d.getFullYear();
           if(fdd<10) {
               fdd='0'+fdd
           } 

           if(fmm<10) {
               fmm='0'+fmm
           } 
           fromDay = fyyyy+'-'+fmm+'-'+fdd;
           $('#fromDt').val(fromDay);
       }
       , searchPresentList : function() {
    	   sessionStorage.setItem("giftStrtDt", $('#presentStrDt').val());
    	   sessionStorage.setItem("giftEndDt", $('#presentEndDt').val());
           //선물내역 조회
           mypage.myGiftCard.search.setPagingCaller("P");
           mypage.myGiftCard.search.getPresentList(1); 
        }
       , searchTermUseList : function() {
           mypage.myGiftCard.search.setPagingCaller("T");
           mypage.myGiftCard.search.getMyGiftCardTermUseInfo(1);
           
        }
       
};
