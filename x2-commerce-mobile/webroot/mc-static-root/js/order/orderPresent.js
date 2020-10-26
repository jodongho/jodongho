/**
 * 주문서 처리 Interface
 * 
 * :: init  - 초기화 function
 * :: valid - validation function
 */
$.namespace("morder.orderForm");
morder.orderForm = {
        
    isExcute : false,
    acqrAlert : false,
    /**
     * 초기화 하는 함수
     */
    init : function() {
        var _this = morder.orderForm;
        
        //주문자 정보 초기화
        _this.ordManInfo.init();
        
        if(presentYn == 'Y'){
            // 선물하기 정보 초기화
            _this.presentInfo.init();
        }else{
            //배송지 정보 초기화
            _this.dlvpInfo.init();
        }

        //배송지 정보 초기화
        _this.dlvpInfo.init();

        //쿠폰 정보 초기화
        _this.coupon.init();

        //포인트 정보 초기화
        _this.point.init();

        //결제금액 정보 초기화
        _this.payAmt.init();

        //결제 수단 초기화
        _this.payMethod.init();

        // 현금영수증 초기화
        _this.receipt.init();

        // OK캐쉬백 초기화
        _this.ocbInfo.init();
        
        // 전체동의
        var _checkAll = $("#agree_all"); 
        // 개별동의
        var _checkEach = $("input[name='agreeChk']");
        
        // 전체동의 체크 이벤트
        _checkAll.change(function(){
            if($(this).is(":checked")){
                _checkEach.prop("checked", true);
            } else {
                _checkEach.prop("checked", false);
            }
        });

        // 개별동의 체크 이벤트
        _checkEach.change(function(){
            if(_this.checkAgree().isValid){
                _checkAll.prop("checked", true);
            } else {
                _checkAll.prop("checked", false);
            }
        });

        // 결재 버튼 클릭 이벤트
        $("button[name=btnPay]").click(this.onClickSubmit);
        
        /* $(window).load 로 이동
        //최대할인 추천 세팅
        _this.coupon.autoSetCoupon();
        */
        
        // 특수문자 제거
        $("#orderForm input, textarea").each(function(){
            var str = $(this).val();
            var regex=/[$]/g;
            if(!!str && regex.test(str)) {
                $(this).val(str.replace(/[$]/g, ""));
            }
        });
        
        $("#orderForm input, textarea").on('input paste change', function(){
            _this.checkSpecialCharacter($(this));
        });
        
        $("#staffDscntLmtPopup #staffAcqrCd").change(function(){
            if($("#staffAcqrCd").val() == "DIN"){
                $("#txtUseAmt").html('현대카드'+'<br>'+'사용금액');
                $("#txtRmndAmt").html('현대카드'+'<br>'+'잔여한도');
             }else{
                $("#txtUseAmt").html('통합'+'<br>'+'사용금액');
                $("#txtRmndAmt").html('통합'+'<br>'+'잔여한도');
             }                
        });
        
        // 주문자명은 한글/영문/숫자만 입력 가능
        $("#ordManNm").on("focusout", function(e){
            if(isStrSpecialChar($(this).val()) == true){
                alert('특수문자를 제외하고 입력해주세요.');
                $(this).val(replaceStrSpecialChar($(this).val()));
                $(this).focus();
            }
        });
        
        // 수령인명은 한글/영문/숫자만 입력 가능
        $("#rmitNm_new, #rmitNm_exist").on("focusout", function(e){
            if(isStrSpecialChar($(this).val()) == true){
                alert('특수문자를 제외하고 입력해주세요.');
                $(this).val(replaceStrSpecialChar($(this).val()));
                $(this).focus();
            }
        });
        
        // 배송지 상세 주소도 한글/영문/숫자만 입력 가능
        $("#tempRmitDtlAddr_new, #tempRmitDtlAddr_exist").on("input paste change", function(e){
            $(this).val(replaceStrAddress($(this).val()));
        });
        
        //주문서 초기화 
        setTimeout(function(){
        	//console.log("주소록활성화");
            $("#contactInfoBtn").attr('disabled', false);
            //$("#contactInfoBtn").show();
        }, 1000);
        
    },
    
    checkAgree : function() {
        var _this = morder.orderForm;
        var validObj = new _this.validObj();
        validObj.isValid = true;  
        validObj.validMsg = "";
        $("input[name='agreeChk']").each(function(i){
            if(!$(this).is(":checked")){
                validObj.isValid = false;
                validObj.validMsg = $(this).attr("title");
                validObj.element = $(this);
                return false;
            }
        });
        return validObj;
    },
    

     /**
     * 주문 요청을 함.
     */
    onClickSubmit : function() {

        var _this = morder.orderForm;

        // 특수문자 제거
        $("#orderForm input, textarea").each(function(){
            var str = $(this).val();
            var regex=/[$]/g;
            if(!!str && regex.test(str)) {
                $(this).val(str.replace(/[$]/g, ""));
            }
        });
        
        // 선물하기인 경우 배송지 체크가 아닌 선물하기 유효성 체크가 필요
        var validTarget = _this.dlvpInfo.valid();
        if(presentYn == 'Y'){
            validTarget = _this.presentInfo.valid();
        }
        
        // validation 
        var validMsgArray = [
            _this.ordManInfo.valid()            //주문자정보
          , validTarget              //배송지정보 or 선물하기
          , _this.coupon.valid()                //쿠폰할인정보
          , _this.point.valid()                 //포인트사용
          , _this.payMethod.valid()             //결제수단선택
          , _this.receipt.valid()               //현금영수증신청
          , _this.ocbInfo.valid()               //OK캐시백
          , _this.checkAgree()                  //주문동의
        ];
        
        for (var i = 0 ; i < validMsgArray.length ; i++) {
            if(!validMsgArray[i].isValid) {
                if($("#agreeList").find(validMsgArray[i].element).length > 0
                        && !$("#agreeList").hasClass("open")) {
                    $("#agreeList").addClass("open");
                }
                alert(validMsgArray[i].validMsg);
                validMsgArray[i].element.focus();
                return false;
            }
        }
        
      //OK캐쉬백 분기처리 confirm
        if($("#ocbTr").css('display') != undefined && $("#ocbTr").css('display') != "none"){
            var ocbChkValid = 'N'; 
            var ocbCardNo = $("#ocbCardNo1").val() + $("#ocbCardNo2").val() + $("#ocbCardNo3").val() + $("#ocbCardNo4").val();
            var ocbCardNo1 = $("#ocbCardNo1");
            var ocbCardNo2 = $("#ocbCardNo2");
            var ocbCardNo3 = $("#ocbCardNo3");
            var ocbCardNo4 = $("#ocbCardNo4");  
            var count = 0;
            
            // OCB 필수 동의 체크
//            $("input[name='ocbChk']").each(function() {           
//                var validObj = new _this.validObj();
//                validObj.isValid = true;  
//                validObj.validMsg = "";
//                
//                if(!$(this).is(':checked')){
//                    ocbChkValid = 'N';                   
//               }else{
//                   ocbChkValid = 'Y';
//                   count++;
//               }                                       
//            });
//     
//            if( count != 2 || $("#ocbValidChk").val() == 'N' || ocbCardNo == ''){
//                if(confirm('적립하시려면 OK캐시백 동의 및 카드번호 인증이 필요합니다. 적립없이 결제 진행하시겠습니까?')){
//                    $("input[name='ocbCardNo']").val('');                   
//                    $("input[name='ocbChk']").prop("checked", false);
//                    $("#pntSaveYn").prop("checked", false);
//                    $("#ocbValidChk").val('Y');     
//                    ocbChkValid = 'Y';
//                    validMsgArray = [];
//                }else{
//                    $("#ocbValidChk").val('N');
//                    ocbChkValid = 'N';                                  
//                    return;
//                }
//            }
            $("input[name='ocbChk']").each(function() {           
                var validObj = new _this.validObj();
                validObj.isValid = true;  
                validObj.validMsg = "";
                
                if(!$(this).is(':checked')){
                    ocbChkValid = 'N';               
                    return;               
               }else{
                   ocbChkValid = 'Y';
                   count++;
               }                    
            });           
            
            if(ocbChkValid != 'Y' && count != 2){
                if(confirm('OK캐쉬백 적립을 위해서는 개인정보 수집이용 및 제3자 제공 동의가 필요합니다. 적립없이 결제 진행하시겠습니까?')){
                    $("input[name='ocbCardNo']").val('');    
                    $("input[name='ocbCardNo']").attr("disabled", true);
                                   
                    $("input[name='ocbChk']").prop("checked", false);
                    $("#pntSaveYn").prop("checked", false);
                    $("#ocbValidChk").val('Y');     
                    ocbChkValid = 'Y';
                    validMsgArray = [];
                    
                    cardNoDisabled = false;
                }else{
                    $("#ocbValidChk").val('N');
                    ocbChkValid = 'N';  
                    validMsgArray = [];
                    return;
                }
            }else{ 
                if($("#ocbValidChk").val() == 'N' ){
                   if(ocbCardNo == "" ){
                        if(confirm('OK캐쉬백 카드번호 확인이 안되었습니다. 적립없이 결제 진행하시겠습니까?')){
                            $("input[name='ocbCardNo']").val('');       
                            $("input[name='ocbCardNo']").attr("disabled", true);
                                        
                            $("input[name='ocbChk']").prop("checked", false);
                            $("#pntSaveYn").prop("checked", false);
                            $("#ocbValidChk").val('Y');
                            ocbChkValid = 'Y';
                            validMsgArray = [];
                            
                            cardNoDisabled = false;
                        }else{
                            $("#ocbValidChk").val('N');
                            ocbChkValid = 'N';   
                            validMsgArray = [];
                            return;
                        }
                    }else{
                        if(confirm('OK캐쉬백 카드번호 인증을 위해 카드번호 옆 [확인]버튼 클릭 시 적립이 진행됩니다. 적립없이 결제 진행하시겠습니까?')){           
                            $("input[name='ocbCardNo']").val('');               
                            $("input[name='ocbCardNo']").attr("disabled", true);
                                
                            $("input[name='ocbChk']").prop("checked", false);
                            $("#pntSaveYn").prop("checked", false);
                            $("#ocbValidChk").val('Y');   
                            ocbChkValid = 'Y'; 
                            validMsgArray = [];
                            
                            cardNoDisabled = false;
                        }else{   
                            $("#ocbValidChk").val('N');
                            ocbChkValid = 'N';
                            $("#ocbCardValid_btn").focus();
                            validMsgArray = [];
                            return;
                        }
                    }                   
                }
            }
        }    
            
        var quickYn = $("#quickYn").val();
        var quickInfoYn = $("#quickInfoYn").val();
        
        if(quickYn == "Y" && Number($("#giftCount").val()) == 0){
        	$("#infoTodayDeliveryOrder").find("#stopGiftToday").hide();
        	$("#infoTodayDeliveryOrder").find("#btnGiftConfirm").hide();
        	$("#infoTodayDeliveryOrder").find("#stopToday").show();
        	$("#infoTodayDeliveryOrder").find("#btnConfirm").show();
    	   
            if(quickInfoYn == "N"){
                mgoods.detail.todayDelivery.openQuickPop('order');
                return;
            }
        }

        var setOrderRequest = function(){
            // 결제 클릭 후 10초 
            $("button[name=btnPay]").off("click");
            var btnPayTimeout = setTimeout(function(){
                $("button[name=btnPay]").off("click").click(_this.onClickSubmit);
            }, 10000);

            if(_this.isExcute){
                alert('이미 결제가 진행중입니다.');
                return false;
            }
            
            var url = _secureUrl + "order/setOrderRequest.do";
            var params = "";
            
            $("input[name='ocbCardNo']").attr("disabled", false);
            $.each($('#orderForm').serializeArray(), function(i, field) {

                // iOS %문자 오류 치환
                if(common.app.appInfo.isapp
                        && common.app.appInfo.ostype == "10" 
                        && field.name == "goodsNm"
                            ) {
                    field.value = field.value.replaceAll("%", "%25");
                }
                
                // 선물하기인 경우 메시지 카드에 엔터가 입력되어 치환 필요. 이렇게 치환하고, DB 인서트시에 다시 줄바꿈으로 수정하여 처리.
                if(field.name == "presentMsg"){
                    field.value = field.value.replace(new RegExp(/(\r\n|\n|\r)/gm), "|LF|");
                }
                
                params += field.name + "=" + field.value + "&";
            });
            
            $('#orderForm').attr('method','post');
            $('#orderForm').attr('action',url);
            
            // history back 접근 체크
            var expireState = function(){
                var state = {
                        isExpire : true
                        , redirectUrl : _baseUrl + "main/main.do"
                };
                try{

                    $("#isExpire").val("Y");
                    window.history.replaceState(state, null);
                } catch(e) {
//                console.error(e);
                }
            }
            expireState();
            
            // 결제금액
            var payAmt = (Number(_this.payAmt.totGoodsAmt) 
                    + Number(_this.payAmt.totDlexAmt) 
                    - Number(_this.payAmt.imdtDscntAmt) 
                    - Number(_this.payAmt.cpnDscntAmt));
            // 앱에서 cj one 포인트 전액결제일 때 or 예치금 1만 이상일 때, 기프트카드(올리브영,CJ) 전액결제이면서 1만원이상 결제할때
            if(_this.payAmt.totPayAmt == 0
                    && (
                            (_this.payAmt.cjonePntAplyAmt == payAmt
                                    && _this.payAmt.cjonePntAplyAmt >= 10000
                            )
                            || (
                                    _this.payAmt.csmnAplyAmt == payAmt
                                    && _this.payAmt.csmnAplyAmt >= 10000
                            )
                            || (
                                    _this.payAmt.oyGiftCardAplyAmt == payAmt
                                    && _this.payAmt.oyGiftCardAplyAmt >= 10000
                            )
                            || (
                                    _this.payAmt.cjGiftCardAplyAmt == payAmt
                                    && _this.payAmt.cjGiftCardAplyAmt >= 10000
                            )
                    )
            ) {
                if(common.app.appInfo.isapp) {
                    // 증정품 있을 경우 증정품 레이어팝업 닫힐때 스킴으로 인한 setTimeout
                    setTimeout(function(){
                        common.app.callOpenPage('본인인증',url+"?"+params,"N","N","N");
                    }, 500);
                } else {
                    var pop = window.open("", "setOrderRequest", "");
                    $('#orderForm').attr('target','setOrderRequest');
                    $('#orderForm').submit();
                }
            } else {
                // 보조결제수단 인증수단 없이 결제시 이중 승인 방지
                if(_this.payAmt.totPayAmt == 0) {               
                    _this.isExcute = true;
                }
                if(common.app.appInfo.isapp
                        // Android 4.0 이하 버전에서 iOS와 같은 현상 재현으로 인해
                        // app일경우 항상 setTimeout 하도록 수정
//                        && common.app.appInfo.ostype == "10"
                            ) {
                    setTimeout(function(){
                        // iOS 앱 이면서 카카오페이 결제시, 앱버전 체크, 하위버전일시 alert 노출
                        var submitPass = false;
                        if(common.app.appInfo.ostype == "10" && $("input[name=payMethod]").val() == "26" && !$("input[name=payMethod]").is(":disabled")) {
                            var kakaoChkUrl = _secureUrl + "order/kakaoiOSAppVerCheck.do";
                            
                            var callback_kakaoiOSAppVerCheck = function(data) {
                                
                                if(data.result == "S") {
                                    var dataMap = data.data;
                                    
                                    if(dataMap.rowVer) {
                                        if(confirm("올리브영앱 ver 2.0.5 업데이트 후 사용 가능합니다.")) {
                                            // 앱스토어로 이동
                                            common.link.commonMoveUrl("common/getAppDownload.do");
                                        }else{
                                            if(btnPayTimeout) {
                                                clearTimeout(btnPayTimeout);
                                                
                                                $("button[name=btnPay]").off("click").click(_this.onClickSubmit);
                                            }
                                        }
                                        submitPass = true;
                                    }
                                    
                                }else{
                                    // 올리브영APP 카카오페이 결제 가능 버전 체크중 오류가 발생했습니다. 
                                    alert(data.message);
                                    submitPass = true;
                                }
                            }
                            
                            common.Ajax.sendJSONRequest("POST", kakaoChkUrl, null, callback_kakaoiOSAppVerCheck, false);
                        }
                        if(!submitPass){
                            $('#orderForm').submit();
                        }
                    }, 200);
                } else {
                    $('#orderForm').submit();
                }
            }
            return false;
        };
        
        // 기존 증정품 장바구니번호 제거
        $("#giftCartNo").html("");
        
        if(Number($("#giftCount").val()) > 0) {
            
            // TODO 레이어 오픈 함수
            common.popLayerOpen("PresentPopup");
            
            var _layer = $("#PresentPopup");
            _layer.find('#btnSubmit').off('click').on('click', function(){
                
                // 중복증정가능 증정품
                var _dupPrstPsbGift = $("input[dupprstpsbyn='Y']:enabled");
                // 중복증정불가능 증정품
                var _dupPrstImpsbGift = $("input[dupprstpsbyn='N']:enabled");
                // 선택한 중복증정가능 증정품
                var _dupPrstPsbGift_checked = $("input[dupprstpsbyn='Y']:enabled:checked");
                // 선택한 중복증정불가능 증정품
                var _dupPrstImpsbGift_checked = $("input[dupprstpsbyn='N']:enabled:checked");
                // 중복증정가능 증정품 개수
                var dupPrstPsbGiftCnt = _dupPrstPsbGift.length;
                // 중복증정불가능 증정품 개수
                var dupPrstImpsbGiftCnt = _dupPrstImpsbGift.length;
                // 선택한 중복증정가능 증정품 개수
                var dupPrstPsbGiftCnt_checked = _dupPrstPsbGift_checked.length;
                // 선택한 중복증정불가능 증정품 개수
                var dupPrstImpsbGiftCnt_checked = _dupPrstImpsbGift_checked.length;
                
                // 총 선택가능 개수
                var totSelectableCnt = dupPrstPsbGiftCnt + (dupPrstImpsbGiftCnt > 0 ? 1 : 0);

                // 중복증정가능 증정품 미선택시
                if(dupPrstPsbGiftCnt > 0
                        && dupPrstPsbGiftCnt > dupPrstPsbGiftCnt_checked){
                    alert("증정품을 선택해주세요.");
                    return false;
                }
                
                // 중복증정불가 증정품 미선택시
                if(dupPrstImpsbGiftCnt > 0
                        && dupPrstImpsbGiftCnt_checked < 1){
                    alert("증정품을 선택해주세요.");
                    return false;
                }
                
                // 선택가능 개수보다 많을 경우
                if(totSelectableCnt < dupPrstPsbGiftCnt_checked + dupPrstImpsbGiftCnt_checked){
                    alert("선택하실 수 있는 증정품 개수가\n초과되었습니다.");
                    return false;
                    
                }else{
                    $(this).off('click');
                    common.popLayerClose("PresentPopup");
                    
                    var cartNoArray = [];
                    var aeEvtNoArray = [];
                    
                    // 장바구니번호
                    $("input[name='cartNo']").each(function(){
                        cartNoArray.push($(this).val()); 
                    });
                    
                    // 중복증정가능 사은행사번호
                    _dupPrstPsbGift_checked.each(function(i){
                        aeEvtNoArray.push($(this).attr("aeevtno"));
                    });

                    // 중복증정불가능 사은행사번호
                    if(dupPrstImpsbGiftCnt_checked > 0) {
                        aeEvtNoArray.push(_dupPrstImpsbGift_checked.attr("aeevtno"));
                    }
                    
                    // 증정품저장 ajax
                    var url = _secureUrl + "order/regGiftAjax.do";
                    var data = {
                            cartNo : cartNoArray.toString()
                          , aeEvtNo : aeEvtNoArray.toString()
                    };
                    
                    if($("#quickYn").val() == "Y") {
                    	data.quickYn = $("#quickYn").val();
                        data.strNo = $("#orderStrNo").val();
                    }
                    
                    for(var i = 0 ; i < morder.orderForm.coupon.couponCnt ; i++){
                        data["couponList["+i+"].promChk"] = $("[name='couponList["+i+"].promChk']").val();
                        data["couponList["+i+"].goodsNo"] = $("[name='couponList["+i+"].goodsNo']").val();
                        data["couponList["+i+"].itemNo"] = $("[name='couponList["+i+"].itemNo']").val();
                        data["couponList["+i+"].promNo"] = $("[name='couponList["+i+"].promNo']").val();
                        data["couponList["+i+"].promAplySeq"] = $("[name='couponList["+i+"].promAplySeq']").val();
                        data["couponList["+i+"].promKndCd"] = $("[name='couponList["+i+"].promKndCd']").val();
                        data["couponList["+i+"].entrNo"] = $("[name='couponList["+i+"].entrNo']").val();
                    }

                    var callback_regGiftAjax = function(data){
                        if(data.result == "S") {
                            var cartNoList = data.data.split(",");
                            for(var i = 0 ; i < cartNoList.length ; i++) {
                                var input = $(document.createElement("input"));
                                input.attr("type", "hidden");
                                input.attr("name", "cartNo");
                                input.val(cartNoList[i]);
                                $("#giftCartNo").append(input);
                            }
                            
                            if($("#quickYn").val() != "Y") { // 오늘드림 주문 이외 이전 로직 동일
                            	setOrderRequest(); 
                            } else { 
                            	// 오늘드림 주문일 경우 증정품 존재 시 증정품 팝업 확인 버튼 누르면, 오늘드림 안내 팝업 로드.
                            	// 오늘드림 안내 팝업에서 확인 버튼 누르면 주문 진행.
                            	if(quickInfoYn == "N"){
                            		var bannInfo = common.bann.getPopInfo("infoTodayDeliveryOrder");
                            		if (bannInfo != null) {
                            			if (new Date() - bannInfo.regDtime >= (1000 * 60 * 60 * 24)) {
                            				common.setScrollPos();
                            				$("#layerPop2").html($("#infoTodayDeliveryOrder").html());
                                            common.popLayerOpen2("LAYERPOP02");
                            			} else {
                            				$("#quickInfoYn").val("Y");
                            				setOrderRequest();
                            			}
                            		} else {
                            			common.setScrollPos();
                        				$("#layerPop2").html($("#infoTodayDeliveryOrder").html());
                                        common.popLayerOpen2("LAYERPOP02");
                            		}

                            		// 오늘드림 증정품용 버튼 노출.
                            		$("#layerPop2").find("#stopToday").hide();
                            		$("#layerPop2").find("#btnConfirm").hide();
                            		$("#layerPop2").find("#stopGiftToday").show();
                            		$("#layerPop2").find("#btnGiftConfirm").show();
                            		
                            		// 오늘드림 증정품용 버튼 이벤트
                            		$("#layerPop2").find("#stopGiftToday").click(function() {
                                        common.bann.setPopInfo("infoTodayDeliveryOrder", $("#infoTodayDeliveryOrder").attr("data-ref-compareKey"));
                                        setTimeout(function() {
                                            $("body").css("overflow", "visible");
                                        }, 100);
                                        $("#quickInfoYn").val("Y");
                                        $(document).scrollTop(0);
                                        common.popLayerClose('LAYERPOP02');
                                        setOrderRequest();
                            		});
                            		
                            		$("#layerPop2").find("#btnGiftConfirm").click(function() {
                                        common.popFullClose();
                                        $("#quickInfoYn").val("Y");
                                        setOrderRequest();
                            		});
                            		
                            	} else {
                            		setOrderRequest();
                            	}
                            }
                        } else {
                            alert("사은품 저장 중 오류가 발생했습니다.");
                            location.href = _secureUrl + "cart/getCart.do";
                        }
                        return false;
                    }
                    common.Ajax.sendJSONRequest("POST", url, data, callback_regGiftAjax, false);
                }
                return false;
            });
        } else {
            setOrderRequest();
        }
    },
    
    validEmpty : function(_element){
        var validObj = new morder.orderForm.validObj();
        validObj.isValid = true;  
        validObj.validMsg = "";
        if(!_element.val() || _element.val().trim() == "") {
            validObj.isValid = false;
            validObj.validMsg = _element.attr("title");
            validObj.element = _element;
        }
        return validObj;
    },
    
    validEmailAddr : function(_element) {
        var validObj = new morder.orderForm.validObj();
        validObj.isValid = true;  
        validObj.validMsg = "";
        var emailAddr = _element.val();
        var regex=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
        
        if(!regex.test(emailAddr)) {
            validObj.isValid = false;
            validObj.validMsg = "이메일 주소를 다시 확인해주세요.";
            validObj.element = _element;
        }
        return validObj;
    },
    
    validNumber : function(_element) {
        var validObj = new morder.orderForm.validObj();
        validObj.isValid = true;
        validObj.validMsg = "";
        var number = _element.val();
        var regex=/[0-9]/g;

        if(!!number && !regex.test(number)) {
            validObj.isValid = false;
            validObj.validMsg = "숫자만 입력가능합니다.";
            validObj.element = _element;
        }
        return validObj;
    },
    
    validLength : function(_element, minLength, maxLength) {

        var validObj = new morder.orderForm.validObj();
        validObj.isValid = true;
        validObj.validMsg = "";
        if(!!_element.val()) {
            _element.val(morder.orderForm.trim(_element.val()));
            var length = _element.val().length;
            
            if(length < minLength || length > maxLength) {
                validObj.isValid = false;
                var elementNm = _element.attr("this");
                if(!!elementNm) {
                    validObj.validMsg = elementNm + " ";
                }
                if(minLength == maxLength) {
                    validObj.validMsg += minLength+"자만 입력가능합니다.";
                } else if(minLength == 0) {
                    validObj.validMsg += maxLength+"자까지만 입력가능합니다.";
                } else {
                    validObj.validMsg += minLength+"자~"+maxLength+"자까지만 입력가능합니다.";
                }
                validObj.element = _element;
            }
        }
        return validObj;
    },

    /**
     * 입력된 문자열을 바이트수만큼 잘라서 리턴
     */
    checkMaxByte : function(_input, byte) {
        var getByte = function(s,b,i,c){
            for(b=i=0;c=s.charCodeAt(i++);b+=c>>11?3:c>>7?2:1);
            return b;
        }
        var getSize = function(s,byte,b,i,c) {
            for(b=i=0;!!(c=s.charCodeAt(i))&&(b+=c>>11?3:c>>7?2:1)<=byte;i++);
            return i;
        }
        var str = _input.val();
        if(getByte(str) > byte) {
            var pos = _input[0].selectionEnd;
            var size = getSize(str,byte);
            var endStr = str.substring(pos, str.length);
            var startStr = str.substr(0, size-endStr.length);
            _input.val(startStr+endStr);
            _input[0].setSelectionRange(startStr.length,startStr.length);
        }
    },
    
    /**
     * 입력된 문자열을 사이즈만큼 잘라서 리턴
     */
    checkMaxSize : function(_input, size) {
        var str = _input.val();
        if(str.length > size) {
            var pos = _input[0].selectionEnd;
            var endStr = str.substring(pos, str.length);
            var startStr = str.substr(0, size-endStr.length);
            _input.val(startStr+endStr);
            _input[0].setSelectionRange(startStr.length,startStr.length);
        }
    },
    
    /**
     * 입력된 문자열 중 숫자만 리턴 
     */
    checkNumber : function(_input) {
        var number = _input.val();
        var regex=/^[0-9]*$/g;
        if(!!number && !regex.test(number)) {
            if(_input.attr("type") == "number") {
                _input.val(number.replace(/[^0-9]/g, ""));
            } else {
                var pos = _input[0].selectionEnd;
                var endStr = number.substring(pos, number.length).replace(/[^0-9]/g, "");
                var startStr = number.substr(0, pos).replace(/[^0-9]/g, "");
                _input.val(startStr+endStr);
                _input[0].setSelectionRange(startStr.length,startStr.length);
            }
        }
    },

    /**
     * 입력된 문자열 중 특수문자 제외
     */
    checkSpecialCharacter : function(_input) {
        var number = _input.val();
        var regex=/[$]/g;
        if(!!number && regex.test(number)) {
            var pos = _input[0].selectionEnd;
            var endStr = number.substring(pos, number.length).replace(/[$]/g, "");
            var startStr = number.substr(0, pos).replace(/[$]/g, "");
            _input.val(startStr+endStr);
            _input[0].setSelectionRange(startStr.length,startStr.length);
        }
    },
    
    // 중복된 공백문자 제거
    trim : function(str) {
        return str.replace(/\s/g, " ").replace(/ +/g, " ");
    },
    
    validObj :function(isValid, validMsg, element) {
        this.isValid = !isValid?true:isValid;
        this.validMsg = !validMsg?"":validMsg;
        this.element = !element?{}:element;
    },
    
    addComma : function(_input) {
        var number = _input.val();
        if(!!number) {
            var pos = _input[0].selectionEnd;
            var rgx = /(\d+)(\d{3})/;
            while (rgx.test(number)) {
                number = number.replace(rgx, '$1' + ',' + '$2');
//                pos++;
            }
            // 추가된 ,만큼 pos이동
            var adj = number.substr(0, pos).match(/,/g);
            if(adj != null){
                pos += adj.length;
            }
            _input.val(number);
            _input[0].setSelectionRange(pos,pos);
        }
    },
    
    getNumber : function(_input) {
        return Number(_input.val().replace(/[^0-9]/g, ""));
    },
    
    openPopup : function(url, title) {
        if(common.app.appInfo.isapp) {
            common.app.callOpenPage(title, url, 'N', 'Y', 'N');
        } else {
            window.open(url, title);
        }
    },
    /** 선물포장서비스 이용여부 (오늘드림 2019.11.21)**/
    giftBoxYn : function () {
        var _payAmt = morder.orderForm.payAmt;
        var count = 0;
        $("input[name='giftBoxYnArr']").each(function() {           
            if($(this).is(':checked')){
                count++;               
           }                    
        }); 

        if(count > 0){
            $("#giftBoxYn").val("Y");
            $("#giftBoxYn_temp").attr("checked", true);
            $("#packingAmt_span").text("1,000");
            _payAmt.giftBoxAmt = 1000;
        }else{
            $("#giftBoxYn").val("N");
            $("#giftBoxYn_temp").attr("checked", false);
            $("#packingAmt_span").text("0");
            _payAmt.giftBoxAmt = 0;
        }
        
        _payAmt.initPayAmt();
    },
    
    /** 선물하기이면서 오늘드림 => 선물포장서비스 이용여부 **/
    ///사용하지 않아도 되면 빼버리기 
    presentO2oGiftBoxYn : function () {
        var _payAmt = morder.orderForm.payAmt;
        
        var df= $("#o2oGiftBoxAmtDf").val();  //조건 도달했을때 포장비 ex:0원
        var dc= $("#o2oGiftBoxAmtDc").val();  //포장비        
     /*   alert(df+"123123"+dc+"////"+$("#presentO2oPackingYn").val()+"///"+$("#packingYn").is("check")
        		
        +"///"+$("#packingYn").prop("checked")+"///"+$("#packingYn").val()
        
        );*/
        
        
        if($("#presentO2oPackingYn").val() == "Y" && $("#packingYn").prop("checked") == true ){
        	$("[name='presentO2oPackingAmt_span']").text(df);
        	$("#packingAmt_span").text(df);
            _payAmt.giftBoxAmt = df;
        }else{
            $("[name='presentO2oPackingAmt_span']").text("0");
            $("#packingAmt_span").text("0");
            _payAmt.giftBoxAmt = 0;
        }
        _payAmt.initPayAmt();
    },
	
    /** 선물포장서비스 안내 **/
    giftBoxPop : function (popDiv) {
        if(popDiv == 'giftChk'){
            common.setScrollPos();
            $("#layerPop4").html($("#infoGiftBoxOrderIcon").html());
            common.popLayerOpen2("LAYERPOP04");
        }else{
            var bannInfo = common.bann.getPopInfo("infoGiftBoxOrder");
            
            if (bannInfo != null) {
                if (new Date() - bannInfo.regDtime >= (1000 * 60 * 60 * 24)) {;
                    common.setScrollPos();
                    $("#layerPop3").html($("#infoGiftBoxOrder").html());
                    common.popLayerOpen2("LAYERPOP03");
                }
            } else {
                common.setScrollPos();
                $("#layerPop3").html($("#infoGiftBoxOrder").html());
                common.popLayerOpen2("LAYERPOP03");
            }
        }
    },
    
    /** 선물포장서비스 오늘 하루 안보기 **/
    giftBoxPopToday : function () {
        common.bann.setPopInfo("infoGiftBoxOrder", $("#infoGiftBoxOrder").attr("data-ref-compareKey"));
        setTimeout(function() {
            $("body").css("overflow", "visible");
        }, 100);

        $(document).scrollTop(0);
        common.popLayerClose('LAYERPOP03');
    },

    Base64 : {

        // private property
        _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

        // public method for encoding
        encode : function (input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;

            input = morder.orderForm.Base64._utf8_encode(input);

            while (i < input.length) {

                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

            }

            return output;
        },

        // public method for decoding
        decode : function (input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            while (i < input.length) {

                enc1 = this._keyStr.indexOf(input.charAt(i++));
                enc2 = this._keyStr.indexOf(input.charAt(i++));
                enc3 = this._keyStr.indexOf(input.charAt(i++));
                enc4 = this._keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

            }

            output = morder.orderForm.Base64._utf8_decode(output);

            return output;

        },

        // private method for UTF-8 encoding
        _utf8_encode : function (string) {
            string = string.replace(/\r\n/g,"\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        },

        // private method for UTF-8 decoding
        _utf8_decode : function (utftext) {
            var string = "";
            var i = 0;
            var c = c1 = c2 = 0;

            while ( i < utftext.length ) {

                c = utftext.charCodeAt(i);

                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                }
                else if((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i+1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                }
                else {
                    c2 = utftext.charCodeAt(i+1);
                    c3 = utftext.charCodeAt(i+2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }

            }

            return string;
        }

    },
};

/**
 * 주문자 정보 Interface
 * 
 */
$.namespace("morder.orderForm.ordManInfo");
morder.orderForm.ordManInfo = {

    events : 'input paste change',
    ordManNmLength : 10,
    ordManEmailAddrIdLength : 50,
    ordManEmailAddrDmnLength : 50,
    
    init : function() {
        
        var _super = morder.orderForm;
        var _this = morder.orderForm.ordManInfo;

        // 주문자명 변경시 주문자정보 타이틀에 세팅
        $("#ordManNm").blur(function(){
            var ordManNm = $(this).val();
            if(ordManNm == "") {
                ordManNm = $(this).attr("title");
            }
            $("#ordManNm_tit_span").text(ordManNm);
        });
        
        // 이메일도메인 변경시 id부분에 입력되었던 도메인 삭제
        $("#ordManEmailAddrDmn").change(function(){
            if($(this).val() != "") {
                var id = $("#ordManEmailAddrId").val();
                id = id.split("@")[0];
                $("#ordManEmailAddrId").val(id);
            }
        });
        
        // 주문자명
        $("#ordManNm").on(_this.events, function(){
//            maxLength로 대체
//            _super.checkMaxSize($(this), _this.ordManNmLength);
        });
        
        // 휴대폰 숫자만 입력
        $("#ordManCellTxnoNo, #ordManCellEndNo").on(_this.events, function(){
            _super.checkNumber($(this)); 
            _super.checkMaxSize($(this), 4);
        });
        
        // 이메일
        $("#ordManEmailAddrId").on(_this.events, function(){
            if($("#ordManEmailAddrDmn").val() != ""
                || $(this).val().indexOf("@") < 0
                ){
                _super.checkMaxSize($(this), _this.ordManEmailAddrIdLength);
            } else {
                var email = $(this).val();
                var id = email.substring(0, email.indexOf("@"));
                var dmn = email.substring(email.indexOf("@")+1, email.length);
                if(id.length > _this.ordManEmailAddrIdLength) {
                    var pos = $(this)[0].selectionEnd;
                    var endStr = email.substring(pos, email.length);
                    var startStr = email.substring(0, pos);
                    if(id.length < startStr.length) {
                        var endStr2 = startStr.substring(startStr.indexOf("@")+1, startStr.length);
                        var startStr2 = startStr.substring(0, _this.ordManEmailAddrIdLength);
                        startStr = startStr2 + "@" + endStr2;
                    } else {
                        var temp = endStr.substring(0, endStr.indexOf("@"));
                        startStr = startStr.substr(0, _this.ordManEmailAddrIdLength - temp.length);
                    }
                    $(this).val(startStr+endStr);
                    $(this)[0].setSelectionRange(startStr.length,startStr.length);
                    email = $(this).val();
                    id = email.substring(0, email.indexOf("@"));
                    dmn = email.substring(email.indexOf("@")+1, email.length);
                }
                if(dmn.length > _this.ordManEmailAddrDmnLength) {
                    var pos = $(this)[0].selectionEnd;
                    var endStr = email.substring(pos, email.length);
                    var startStr = email.substring(0, pos);
                    if(id.length < startStr.length) {
                        startStr = startStr.substring(0, startStr.indexOf("@") + 1 + _this.ordManEmailAddrDmnLength - endStr.length)
                    } else {
                        endStr = endStr.substr(0, endStr.indexOf("@") + _this.ordManEmailAddrDmnLength);
                    }
                    $(this).val(startStr+endStr);
                    $(this)[0].setSelectionRange(startStr.length,startStr.length);
                }
            }
        });
    },
    
    /**
     * validation 처리를 함.
     * 
     * @return 오류 메시지 / 정상일때 빈 문자열("")
     */
    valid : function() {
        
        var _super = morder.orderForm;
        var _this = morder.orderForm.ordManInfo;

        // 이메일주소 세팅
        var ordManEmailAddr = $("#ordManEmailAddrId").val().trim() + $("#ordManEmailAddrDmn").val().trim(); //주문자 이메일
        $("#ordManEmailAddr").val(ordManEmailAddr);
        
        // validation
        var validMsgArray = [];
        
        validMsgArray.push(_super.validEmpty($("#ordManNm")));
        validMsgArray.push(_super.validLength($("#ordManNm"), 0, _this.ordManNmLength));
        validMsgArray.push(_super.validEmpty($("#ordManCellSctNo")));
        validMsgArray.push(_super.validEmpty($("#ordManCellTxnoNo")));
        validMsgArray.push(_super.validEmpty($("#ordManCellEndNo")));
        validMsgArray.push(_super.validNumber($("#ordManCellTxnoNo")));
        validMsgArray.push(_super.validNumber($("#ordManCellEndNo")));
        validMsgArray.push(_super.validLength($("#ordManCellTxnoNo"), 3, 4));
        validMsgArray.push(_super.validLength($("#ordManCellEndNo"), 4, 4));
        validMsgArray.push(_super.validEmpty($("#ordManEmailAddrId")));
        if($("#ordManEmailAddrDmn").val() != ""){
            validMsgArray.push(_super.validLength($("#ordManEmailAddrId"), 0, _this.ordManEmailAddrIdLength));
        } else {
            validMsgArray.push(_super.validLength($("#ordManEmailAddrId"), 0, _this.ordManEmailAddrIdLength + _this.ordManEmailAddrDmnLength + 1));
        }
        validMsgArray.push(_super.validEmpty($("#ordManEmailAddr")));
        validMsgArray.push(_super.validEmailAddr($("#ordManEmailAddr")));
        
        for (var i = 0 ; i < validMsgArray.length ; i++) {
            if(validMsgArray[i].validMsg != "") {
                return validMsgArray[i];
            }
        }
        
        return new _super.validObj();
    }
};

/**
 * 배송지 정보 Interface
 * 
 */
$.namespace("morder.orderForm.dlvpInfo");
morder.orderForm.dlvpInfo = {

    activeTab : "",
    dlvpNmLength : 10,
    rmitNmLength : 10,
    rmitDtlAddrLength : 50,
    textAreaMaxLength : 30,
    textAreaMaxLength2 : 20,
    tempRmitDtlAddrLength : 50,
    events : 'input paste change',
    
    init : function() {
        
        var _super = morder.orderForm;
        var _this = morder.orderForm.dlvpInfo;
        var quickYn = $("#quickYn").val();      //오늘드림 퀵배송여부 2019.11.21
        
        $("#maxLength_exist").text(_this.textAreaMaxLength);
        $("#maxLength_new").text(_this.textAreaMaxLength);
        
        // jwkim 일반배송으로 주문시에 사용하기 위한 변수
        var selectDlvSeq = $("input[name=selectDlvSeq]").val();
        
        $("#dlvpSelect").val(selectDlvSeq);
        
        //배송지가 없을 경우 기본배송지 무조건 체크
        if(Object.keys(deliveryList).length == 0) {
            $("#setBaseDlvpYn_new").attr("onclick", "return false;");
            $("#setBaseDlvpYn_new").prop("checked", true);
        }
        
        //기존배송지 버튼
        $("#btn_dlvp_exist").click();
        
        // 배송지목록 select 이벤트
        $('#dlvpSelect').change(function() {
            
            var delivery = eval('deliveryList.delivery_'+$(this).val());
            
            $("#dlvpNm_exist_span").text(_super.Base64.decode(delivery.dlvpNm).substr(0, _this.dlvpNmLength));//배송지명
            $("#dlvpNm_exist").val(_super.Base64.decode(delivery.dlvpNm).substr(0, _this.dlvpNmLength));//배송지명
            $("#rmitNm_exist").val(replaceStrAddress(_super.Base64.decode(delivery.rmitNm).substr(0, _this.dlvpNmLength)));//받는분 특수문자 막음 처리
            
            $("#rmitCellSctNo_exist").val(_super.Base64.decode(delivery.rmitCellSctNo));//연락처1 국번
            $("#rmitCellTxnoNo_exist").val(_super.Base64.decode(delivery.rmitCellTxnoNo).substr(0, 4));//연락처1 번호1
            $("#rmitCellEndNo_exist").val(_super.Base64.decode(delivery.rmitCellEndNo).substr(0, 4));//연락처1 번호 2
            
            $("#rmitTelRgnNo_exist").val(_super.Base64.decode(delivery.rmitTelRgnNo));//연락처2 국번
            $("#rmitTelTxnoNo_exist").val(_super.Base64.decode(delivery.rmitTelTxnoNo).substr(0, 4));//연락처2 번호1
            $("#rmitTelEndNo_exist").val(_super.Base64.decode(delivery.rmitTelEndNo).substr(0, 4));//연락처2 번호 2
            
            $("#stnmRmitPostNo_exist").val(_super.Base64.decode(delivery.rmitPostNo).substr(0, 6));//도로명우편번호
            $("#rmitPostNo_exist").val(_super.Base64.decode(delivery.stnmRmitPostNo).substr(0, 6));//우편번호
            $("#stnmRmitPostAddr_exist").val(_super.Base64.decode(delivery.stnmRmitPostAddr));//도로명
            $("#rmitBaseAddr_exist").val(_super.Base64.decode(delivery.rmitBaseAddr));//상세주소
            $("#stnmPostAddr_exist").html("도로명 : " + _super.Base64.decode(delivery.stnmRmitPostAddr) + " " + _super.Base64.decode(delivery.stnmRmitDtlAddr).substr(0, _this.rmitDtlAddrLength));//도로명
            $("#baseAddr_exist").html("지번 : " + _super.Base64.decode(delivery.rmitBaseAddr) + " " + _super.Base64.decode(delivery.rmitDtlAddr).substr(0, _this.rmitDtlAddrLength));//상세주소
            $("#stnmRmitDtlAddr_exist").attr("orgvalue", _super.Base64.decode(delivery.stnmRmitDtlAddr).substr(0, _this.rmitDtlAddrLength));//도로명
            $("#rmitDtlAddr_exist").attr("orgvalue", _super.Base64.decode(delivery.rmitDtlAddr).substr(0, _this.rmitDtlAddrLength));//지번
            $("#stnmRmitDtlAddr_exist").val(_super.Base64.decode(delivery.stnmRmitDtlAddr).substr(0, _this.rmitDtlAddrLength));//도로명
            $("#rmitDtlAddr_exist").val(_super.Base64.decode(delivery.rmitDtlAddr).substr(0, _this.rmitDtlAddrLength));//지번

            _this.tempRmitDtlAddrLength = 0;
            $("#tempRmitDtlAddr_exist").attr("maxlength", 0);
            $("#tempRmitDtlAddr_exist").val("");
            $("#tempRmitDtlAddr_exist").hide();
            
            $("#selectedAddr").text(_super.Base64.decode(delivery.stnmRmitPostAddr));//입력된 배송지
            
            //배송비 상세
            morder.orderForm.payAmt.getDlexDtlPopAjax();
        });
        
        //기존배송지 주문자 정보와 동일 checkbox 이벤트
        $("#copyToDlvp_exist, #copyToDlvp_new").change(function(){
            var target = $(this).attr("targetid");
            if($(this).is(":checked")){
                $("#rmitNm_"+target).attr("orgvalue", $("#rmitNm_"+target).val());//받는분
                $("#rmitCellSctNo_"+target).attr("orgvalue", $("#rmitCellSctNo_"+target).val());//연락처1 국번
                $("#rmitCellTxnoNo_"+target).attr("orgvalue", $("#rmitCellTxnoNo_"+target).val());//연락처1 번호1
                $("#rmitCellEndNo_"+target).attr("orgvalue", $("#rmitCellEndNo_"+target).val());//연락처1 번호 2
                $("#rmitNm_"+target).val($("#ordManNm").val());//받는분
                $("#rmitCellSctNo_"+target).val($("#ordManCellSctNo").val());//연락처1 국번
                $("#rmitCellTxnoNo_"+target).val($("#ordManCellTxnoNo").val());//연락처1 번호1
                $("#rmitCellEndNo_"+target).val($("#ordManCellEndNo").val());//연락처1 번호 2
            } else {
                $("#rmitNm_"+target).val($("#rmitNm_"+target).attr("orgvalue"));//받는분
                $("#rmitCellSctNo_"+target).val($("#rmitCellSctNo_"+target).attr("orgvalue"));//연락처1 국번
                $("#rmitCellTxnoNo_"+target).val($("#rmitCellTxnoNo_"+target).attr("orgvalue"));//연락처1 번호1
                $("#rmitCellEndNo_"+target).val($("#rmitCellEndNo_"+target).attr("orgvalue"));//연락처1 번호 2
            }
        });

        // 배송지명
//      maxLength로 대체
//        $("input[name='dlvpNm']").on(_this.events, function(){
//            _super.checkMaxSize($(this), _this.dlvpNmLength);
//        });
        
        // 받는분
//      maxLength로 대체
//        $("input[name='rmitNm']").on(_this.events, function(){
//            _super.checkMaxSize($(this), _this.rmitNmLength);
//        });

        // 연락처 숫자만 입력
        $("input[name='rmitCellTxnoNo'], input[name='rmitCellEndNo'], input[name='rmitTelTxnoNo'], input[name='rmitTelEndNo']").on(_this.events, function(){
            _super.checkNumber($(this));
            _super.checkMaxSize($(this), 4);
        });
        
        // 상세주소
//      maxLength로 대체
//        $("input[name='stnmRmitDtlAddr']").on(_this.events, function(){
//            _super.checkMaxSize($(this), _this.rmitDtlAddrLength);
//        });
        
        /*
        //배송메시지 select 이벤트
        $("#mbrMemoCont_exist, #mbrMemoCont_new").change(function(){
            $("#mbrMemoCont_exist, #mbrMemoCont_new").val($(this).val());
            var _selectedOption = $("option:selected", this);
            if(_selectedOption.val() == "99") {
                $("[name='mbrMemoCont']").val("");
                $("[name='mbrMemoContDiv']").show();
            } else if(_selectedOption.val() == "") {
                $("[name='mbrMemoContDiv']").hide();
                $("[name='mbrMemoCont']").val("");
            } else {
                $("[name='mbrMemoContDiv']").hide();
                $("[name='mbrMemoCont']").val(_selectedOption.text());
            }
        });
        */
        
        /*
        $("#mbrMemoCont_exist, #mbrMemoCont_new").find("li a[cd]").click(function(){
            var cd = $(this).attr("cd");

            if(cd == "99"){
                $("[name='mbrMemoCont']").val("");
                $("#msgCnt_exist, #msgCnt_new").text($("[name='mbrMemoCont']").val().length);
                $("[name='mbrMemoContDiv']").show();
            } else if(!cd || cd == "") {
                $("[name='mbrMemoContDiv']").hide();
                $("[name='mbrMemoCont']").val("");
            } else if(!cd || cd == "O2O") {
                $("[name='mbrMemoCont']").val("");
                $("#msgCnt_exist").text($("[name='mbrMemoCont']").val().length);
                $("[name='mbrMemoContDiv']").show();
            }else {
                $("[name='mbrMemoContDiv']").hide();
                $("[name='mbrMemoCont']").val($(this).text());
                $("#msgCnt_exist, #msgCnt_new").text($("[name='mbrMemoCont']").val().length);
            }
        });
        
        //배송메시지 textarea 이벤트
        var isMemoLengthAlertCalled = false; // ios 얼럿 중복 호출 먹통 방지 플래그 추가
        $("textarea[name='mbrMemoCont']").on("input paste change", function(){

            // 최대글자수 제한
            var checkLimitTextArea = function(_textarea) {
                var str = _textarea.val();
                if(_super.trim(str).length > _this.textAreaMaxLength) {
                    if(isMemoLengthAlertCalled == false){
                        isMemoLengthAlertCalled = true;
                        alert("배송메시지는 "+_this.textAreaMaxLength+"자까지만\n입력가능합니다.");
                        isMemoLengthAlertCalled = false;
                    }     
                    var pos = _textarea[0].selectionEnd;
                    var endStr = str.substr(pos, str.length);
                    var startStr = str.substr(0, pos-1);
                    while(_super.trim(startStr+endStr).length > _this.textAreaMaxLength) {
                        startStr = startStr.substr(0, startStr.length-1);
                    }
                    _textarea.val(startStr+endStr);
                    _textarea[0].setSelectionRange(startStr.length,startStr.length);
                }
            }
            checkLimitTextArea($(this));
            
            var str = $(this).val();
            $("textarea[name='mbrMemoCont']").val(_super.trim(str));
            $("#msgCnt_exist, #msgCnt_new").text(_super.trim(str).length);
        });

        //기타상세내용(2019-11-15 추가 오늘드림배송 시)
        $("textarea[name='o2oVisitTypeDesc']").on("input paste change", function(){
            // 최대글자수 제한
            var checkLimitTextArea = function(_textarea) {
                var str = _textarea.val();
                if(_super.trim(str).length > _this.textAreaMaxLength2) {
                    var o2oVisitTypeSpVal = $("input[type='radio'][name='o2oVisitTypeSp']:checked").val();
                    var title = "";
                    if(o2oVisitTypeSpVal == "1"){
                        title = "공동현관 비밀번호는 ";
                    }else if(o2oVisitTypeSpVal== "2"){
                        title = "경비실 호출 방법은 ";
                    }else{
                        title = "기타 상세 내용은 ";
                    }
                    alert(title + _this.textAreaMaxLength2+"자까지만\n입력가능합니다.");
                    var pos = _textarea[0].selectionEnd;
                    var endStr = str.substr(pos, str.length);
                    var startStr = str.substr(0, pos-1);
                    while(_super.trim(startStr+endStr).length > _this.textAreaMaxLength2) {
                        startStr = startStr.substr(0, startStr.length-1);
                    }
                    _textarea.val(startStr+endStr);
                    _textarea[0].setSelectionRange(startStr.length,startStr.length);
                }
            }
            checkLimitTextArea($(this));
            
            var str = $(this).val();
            $("textarea[name='o2oVisitTypeDesc']").val(_super.trim(str));
        });
        
        //공동현관 출입방법 선택(2019-11-15 추가 오늘드림)
        if($("#o2oVisitTypeVal").val() == "3"){
            $(".pass_info").hide();
            $("#door_type").attr("disabled", true);
        }
        //공동현관 출입방법 선택 radio 이벤트(2019-11-15 추가 오늘드림)
        $("input[name='o2oVisitTypeSp']").change(function(){
            if($(this).val() == "3"){
                $(".pass_info").hide();
                $("#door_type").attr("disabled", true);
                $("#door_type_exist").val("");
            }else{
                if($(this).val() == "2"){
                    $("#door_type_label").html('경비실 호출방법<span class="starImportant">필수 입력사항</span>');
                }else if($(this).val() == "4"){
                    $("#door_type_label").html('기타 상세 내용<span class="starImportant">필수 입력사항</span>');
                }else{
                    $("#door_type_label").html('공동현관 비밀번호<span class="starImportant">필수 입력사항</span>');
                }
                
                $(".pass_info").show();
                $("#door_type").attr("disabled", false);
            }
            
        });
        */
      //배송예정일 오늘일자 Set (2019-11-15 추가 오늘드림)
//        var sysDate = new Date();
//        var to_hours = sysDate.getHours();
        
//        if(quickYn == "Y"){
//            $("#o2oDeliveryScheduleDt").val(sysDate.format("yyyyMMdd"));
//            $("#dlvpDueDate").val(sysDate.format("yyyy년 MM월 dd 일"));
//        }
        
        //배송구분 선택 radio 이벤트(2019-11-15 추가 오늘드림)
        $("input[name='o2oDlvSp']").change(function(){
            var nowDate = $("#dueDt").val();
            var sysDate = new Date(nowDate);
            var to_hours = sysDate.getHours();
            console.log(to_hours);
            //오늘드림 서비스 안내
            $("#todayD").text("오늘드림 빠름 서비스 안내");
            $("#o2oDlvSp1").show();
            $("#o2oDlvSp4").hide();
            $("#o2oDlvSp5").hide();
            
            //배송완료 메시지 전송시점
            $("#o2oMsgSpan").hide();
            $("#o2oMsgUl").hide();
            
            $(".li_dueDt").show();
            
            if($(this).val() == "1"){
                //빠름배송 저녁8시부터 익일정오까지는 선택 불가
                if(to_hours <= 11 || to_hours > 19){
                    if(to_hours <= 19 ){
                        sysDate.setDate(sysDate.getDate());    
                    }else{
                        sysDate.setDate(sysDate.getDate()+1);    
                    }
                    
                    $("#o2oDeliveryScheduleDt").val(sysDate.format("yyyyMMdd")+ "" + "130000");
                    $("#dlvpDueDate").text(sysDate.format("yyyy년 MM월 dd일" + "13시 이내" ));
                }else{
                    sysDate.setHours(sysDate.getHours()+3);
                    $("#o2oDeliveryScheduleDt").val(sysDate.format("yyyyMMddHH")+ "" + "0000");
                    $("#dlvpDueDate").text(sysDate.format("yyyy년 MM월 dd일 HH시 이내"));
                }
                
                $(".time_bb").text("오전 10시~오후8시까지 당일 3시간 이내 오토바이 기사님이 직접 전달합니다.");    
                
                //배송메시지 직접입력하기
                $("[name='mbrMemoCont']").val("");
                $("#msgCnt_exist").text($("[name='mbrMemoCont']").val().length);
                $("[name='mbrMemoContDiv']").hide();
                $('.list_select a').removeClass('on');
                $('.sel_option').html($("#mbrMemoCont_exist").find("li a[cd]").html());
                
                $("#mbrMemoCont_exist").find("li a[cd]").show();
//                $("#mbrMemoCont_exist").find("li a[cd=O2O]").hide();
                $("#span_visitSaveMsg").hide();
            }else if($(this).val() == "5"){
                //미드나잇 배송(PM11~12)당일 PM8 시까지 주문은 당일 배송
                if(to_hours <= 19){
                    $("#o2oDeliveryScheduleDt").val(sysDate.format("yyyyMMdd")+ "" + "213000");
                    $("#dlvpDueDate").text(sysDate.format("yyyy년 MM월 dd일 PM10~12"));
                }else{
                    sysDate.setDate(sysDate.getDate()+1);
                    $("#o2oDeliveryScheduleDt").val(sysDate.format("yyyyMMdd")+ "" + "213000");
                    $("#dlvpDueDate").text(sysDate.format("yyyy년 MM월 dd일 PM10~12"));
                }
                
                $(".time_bb").text("당일 PM8시 까지 주문은 당일 PM10~12 에 집 앞으로 배송됩니다.");      
                //배송메시지 직접입력하기 이외 숨김 처리
                $("[name='mbrMemoCont']").val("");
                $("#msgCnt_exist").text($("[name='mbrMemoCont']").val().length);
                $("[name='mbrMemoContDiv']").hide();
                $('.list_select a').removeClass('on');
                $('.sel_option').html($("#mbrMemoCont_exist").find("li a[cd]").html());
                
                $("#mbrMemoCont_exist").find("li a[cd]").hide();
                $("#mbrMemoCont_exist").find("li a[cd]").eq(0).show();
                $("#mbrMemoCont_exist").find("li a[cd=O2O]").show();
                
                //오늘드림 서비스 안내
                $("#o2oDlvSp1").hide();
                $("#o2oDlvSp4").hide();
                $("#todayD").text("오늘드림 미드나잇 서비스 안내");
                $("#o2oDlvSp5").show();
                
                //배송완료 메시지 전송시점
                $("#o2oMsgSpan").show();
                $("#o2oMsgUl").show();
                
                $("#span_visitSaveMsg").show();
            }else if($(this).val() == "4"){
                //3!4!배송(PM3~4) 당일 정오까지의 주문은 당일 배송
                if(to_hours <= 12){
                    $("#o2oDeliveryScheduleDt").val(sysDate.format("yyyyMMdd")+ "" + "143000");
                    $("#dlvpDueDate").text(sysDate.format("yyyy년 MM월 dd일 PM3~4"));
                }else{
                    sysDate.setDate(sysDate.getDate()+1);
                    $("#o2oDeliveryScheduleDt").val(sysDate.format("yyyyMMdd")+ "" + "143000");
                    $("#dlvpDueDate").text(sysDate.format("yyyy년 MM월 dd일 PM3~4"));
                }
                
                $(".time_bb").text("당일 오후1시까지의 주문은 당일 PM3~4 에 집 앞으로 배송됩니다.");
                //배송메시지 직접입력하기 이외 숨김 처리
                $("[name='mbrMemoCont']").val("");
                $("#msgCnt_exist").text($("[name='mbrMemoCont']").val().length);;
                $("[name='mbrMemoContDiv']").hide();
                $('.list_select a').removeClass('on');
                $('.sel_option').html($("#mbrMemoCont_exist").find("li a[cd]").html());
                
                $("#mbrMemoCont_exist").find("li a[cd]").hide();
                $("#mbrMemoCont_exist").find("li a[cd]").eq(0).show();
                $("#mbrMemoCont_exist").find("li a[cd=O2O]").show();
                
                //오늘드림 서비스 안내
                $("#o2oDlvSp1").hide();
                $("#todayD").text("오늘드림 3!4! 서비스 안내");
                $("#o2oDlvSp4").show();
                $("#o2oDlvSp5").hide();
                
                //배송완료 메시지 전송시점
                $("#o2oMsgSpan").show();
                $("#o2oMsgUl").show();
                
                $("#span_visitSaveMsg").show();
            }
            
            //배송비 상세 조회
            morder.orderForm.payAmt.getDlexDtlPopAjax();
            
            // 배송유형에 따른 쿠폰적용 - 20202010 by KIH
            if($("input[name='Discount_Benefits']").val() == "auto") {
                morder.orderForm.coupon.resetCoupon();
                morder.orderForm.coupon.autoSetCoupon();
            } else if($("input[name='Discount_Benefits']").val() == "manual") {
                morder.orderForm.coupon.resetCoupon();
                morder.orderForm.coupon.aplyCoupon();
            }
        });
        
        // jwkim 오늘드림 구매하기에서 일반으로배송시에 사용 선택한 주소지로 셋팅하기 위해서 사용
        setTimeout(function() {
            $('#dlvpSelect').change();
        },300);
        
        setTimeout(function() {
            //웹로그 바인딩
            _this.bindWebLog();
        },700);
    },
    
    /**
     * validation 처리를 함.
     * 
     * @return 오류 메시지 / 정상일때 빈 문자열("")
     */
    valid : function() {
        
        var _super = morder.orderForm;
        var _this = morder.orderForm.dlvpInfo;
        var validObj = new _super.validObj();

        // 배송지가 없을경우
        if($("#dlvpNm_"+_this.activeTab).length == 0) {
            validObj.isValid = false;
            validObj.validMsg = "배송지 주소를 입력해주세요.";
            validObj.element= $("#selectedAddr");
            return validObj; 
        }
        
        //배송구분(2019-11-15 추가 오늘드림 고도화)
        if($("#quickYn").val() == "Y"){
            //배송구분
            if(!$("input[name='o2oDlvSp']").is(":checked")){
                validObj.isValid = false;
                validObj.validMsg = "배송구분을 선택하세요.";
                validObj.element= $('#btn_dlvp_temp1');
                return validObj;
            }
            
          //배송메시지 직접입력일경우
            if($('textarea[name=mbrMemoCont]').is(':visible') && $('textarea[name=mbrMemoCont]').attr('value').length < 1){
                validObj.isValid = false;
                validObj.validMsg = "배송메시지를 입력하세요.";
                validObj.element= $('textarea[name=mbrMemoCont]');
                return validObj;
            }
            
//          var sysDate = new Date();
//          var to_hours = sysDate.getHours();
//          //배송예정일 체크
//          if($(":input:radio[name=o2oDlvSp]:checked").val() == "4"){
//              //13시 지난경우 배송예정일자 체크
//              sysDate.setDate(sysDate.getDate()+1);
//              if(to_hours >= 13 && $("#o2oDeliveryScheduleDt").val() != (sysDate.format("yyyyMMdd")+ "" + "143000")){
//                  $("#o2oDeliveryScheduleDt").val(sysDate.format("yyyyMMdd")+ "" + "143000");
//                  $("#dlvpDueDate").text(sysDate.format("yyyy년 MM월 dd일 PM3~4"));
//
//                  if(confirm("배송예정일이 변경 되었습니다. 결제를 진행 하시겠습니까?") == false){
//                      validObj.isValid = false;
//                      validObj.validMsg = "";
//                      validObj.element= $('#btn_dlvp_temp1');
//                      return validObj;
//                  }
//              }
//          }else if($(":input:radio[name=o2oDlvSp]:checked").val() == "5"){
//              //20시 지난경우 배송예정일자 체크
//              sysDate.setDate(sysDate.getDate()+1);
//              if(to_hours >= 20 && $("#o2oDeliveryScheduleDt").val() != (sysDate.format("yyyyMMdd")+ "" + "213000")){
//                  $("#o2oDeliveryScheduleDt").val(sysDate.format("yyyyMMdd")+ "" + "213000");
//                  $("#dlvpDueDate").text(sysDate.format("yyyy년 MM월 dd일 PM10~12"));
//                  
//                  if(confirm("배송예정일이 변경 되었습니다. 결제를 진행 하시겠습니까?") == false){
//                      validObj.isValid = false;
//                      validObj.validMsg = "";
//                      validObj.element= $('#btn_dlvp_temp1');
//                      return validObj;
//                  }
//              }
//          }
            
            //공동현관 출입방법 input 체크(2019-11-15 추가 오늘드림 고도화)
            if($("input[name='o2oVisitTypeSp']:checked").val() != "3"){
                if($("#door_type_exist").val() == ""){
                    var o2oVisitTypeSpVal = $("input[name='o2oVisitTypeSp']:checked").val();
                    var msg = "";
                    validObj.isValid = false;
                    
                    if(o2oVisitTypeSpVal == "1"){
                        msg = "공동현관 비밀번호를 입력하세요.";
                    }else if(o2oVisitTypeSpVal== "2"){
                        msg = "경비실 호출 방법을 입력하세요.";
                    }else{
                        msg = "기타 상세 내용을 입력하세요.";
                    }
                    validObj.validMsg = msg;
                    validObj.element= $('#btn_door_manner_temp1');
                    return validObj;    
                }   
            }
            
            //오늘드림 배송완료메시지 전송 시점
            if($("input[name='o2oDlvSp']:checked").val() == "4" || $("input[name='o2oDlvSp']:checked").val() == "5"){
                if(!$("input[name='o2oMsgSendType']").is(":checked")){
                    validObj.isValid = false;
                    validObj.validMsg = "배송완료메시지 전송 시점 선택하세요.";
                    validObj.element= $('#btn_dlvp_complete_msg_temp1');
                    return validObj;
                }                
            }
            
            if(!$("#GoodSale2").prop("disabled") && $("#GoodSale2 option:selected").prop("disabled")) {
                validObj.isValid = false;
                validObj.validMsg = "사용할 수 없는 주문별 쿠폰입니다. 다시 선택해 주세요.";
                validObj.element= $('#GoodSale2');
                return validObj;
            }
            
            if(!$("#GoodSale3").prop("disabled") && $("#GoodSale3 option:selected").prop("disabled")) {
                validObj.isValid = false;
                validObj.validMsg = "사용할 수 없는 배송비 쿠폰입니다. 다시 선택해 주세요.";
                validObj.element= $('#GoodSale3');
                return validObj;
            }
        }
        
        if($('#tempRmitDtlAddr_'+_this.activeTab).css('display') != 'none' && $.trim($('#tempRmitDtlAddr_'+_this.activeTab).val()).length < 1){
            $('#stnmRmitDtlAddr'+_this.activeTab).focus();
            validObj.isValid = false;
            validObj.validMsg = "배송지 상세주소를 입력하세요.";
            validObj.element= $('#stnmRmitDtlAddr'+_this.activeTab);
            return validObj; 
        }

        //연락처2 모두입력되지 않으면 빈값으로 넘김
        var _rmitTelRgnNo = $("#rmitTelRgnNo_"+_this.activeTab);
        var _rmitTelTxnoNo = $("#rmitTelTxnoNo_"+_this.activeTab);
        var _rmitTelEndNo = $("#rmitTelEndNo_"+_this.activeTab);
        if(!((_rmitTelRgnNo.val() != ""
            && _rmitTelTxnoNo.val() != ""
            && _rmitTelEndNo.val() != "")
            || (_rmitTelRgnNo.val() == ""
            && _rmitTelTxnoNo.val() == ""
            && _rmitTelEndNo.val() == "")
            )){
            _rmitTelRgnNo.val("");
            _rmitTelTxnoNo.val("");
            _rmitTelEndNo.val("");
        }

        // 주소2 합침
        var tempRmitDtlAddr = replaceStrAddress($("#tempRmitDtlAddr_"+_this.activeTab).val().substr(0, _this.tempRmitDtlAddrLength)); // 특수문자 막음 처리
        if(!!tempRmitDtlAddr) {
            var stnmRmitDtlAddr = $("#stnmRmitDtlAddr_"+_this.activeTab).attr("orgvalue"); 
            var rmitDtlAddr = $("#rmitDtlAddr_"+_this.activeTab).attr("orgvalue"); 
            if(!!stnmRmitDtlAddr) {
                stnmRmitDtlAddr += " ";
            }
            if(!!rmitDtlAddr) {
                rmitDtlAddr += " ";
            }
            stnmRmitDtlAddr += tempRmitDtlAddr;
            rmitDtlAddr += tempRmitDtlAddr;
            $("#stnmRmitDtlAddr_"+_this.activeTab).val(stnmRmitDtlAddr);
            $("#rmitDtlAddr_"+_this.activeTab).val(rmitDtlAddr);
        }
        
        // validation
        var validMsgArray = [];
        
        validMsgArray.push(_super.validEmpty($("#dlvpNm_"+_this.activeTab)));
        validMsgArray.push(_super.validLength($("#dlvpNm_"+_this.activeTab), 0, _this.dlvpNmLength));
        validMsgArray.push(_super.validEmpty($("#rmitNm_"+_this.activeTab)));
        validMsgArray.push(_super.validLength($("#rmitNm_"+_this.activeTab), 0, _this.rmitNmLength));
        validMsgArray.push(_super.validEmpty($("#rmitCellSctNo_"+_this.activeTab)));
        validMsgArray.push(_super.validEmpty($("#rmitCellTxnoNo_"+_this.activeTab)));
        validMsgArray.push(_super.validEmpty($("#rmitCellEndNo_"+_this.activeTab)));
        validMsgArray.push(_super.validNumber($("#rmitCellTxnoNo_"+_this.activeTab)));
        validMsgArray.push(_super.validNumber($("#rmitCellEndNo_"+_this.activeTab)));
        validMsgArray.push(_super.validNumber($("#rmitTelTxnoNo_"+_this.activeTab)));
        validMsgArray.push(_super.validNumber($("#rmitTelEndNo_"+_this.activeTab)));
        validMsgArray.push(_super.validLength($("#rmitCellTxnoNo_"+_this.activeTab), 3, 4));
        validMsgArray.push(_super.validLength($("#rmitCellEndNo_"+_this.activeTab), 4, 4));
        validMsgArray.push(_super.validLength($("#rmitTelTxnoNo_"+_this.activeTab), 3, 4));
        validMsgArray.push(_super.validLength($("#rmitTelEndNo_"+_this.activeTab), 4, 4));
        validMsgArray.push(_super.validEmpty($("#stnmRmitPostNo_"+_this.activeTab)));
        validMsgArray.push(_super.validEmpty($("#stnmRmitPostAddr_"+_this.activeTab)));
        validMsgArray.push(_super.validEmpty($("#rmitBaseAddr_"+_this.activeTab)));
        validMsgArray.push(_super.validLength($("#tempRmitDtlAddr_"+_this.activeTab), 0, _this.tempRmitDtlAddrLength));
        
        for (var i = 0 ; i < validMsgArray.length ; i++) {
            if(validMsgArray[i].validMsg != "") {
                return validMsgArray[i];
            }
        }
        
        return validObj;
    },
    
 
    /**
     * target에 해당하는 callback함수를 리턴한다.
     */
    getCallback : function(target) {
        var _this = morder.orderForm.dlvpInfo;
        
        var callback_zipcode = function(deliveryInfo) {
          //주소정보 세팅
            $('#stnmRmitPostNo_'+target).val(deliveryInfo.postNo);
            $('#rmitPostNo_'+target).val(deliveryInfo.postNo1.toString() + deliveryInfo.postNo2.toString());
            $('#stnmRmitPostAddr_'+target).val(deliveryInfo.roadAddr1);
            $('#rmitBaseAddr_'+target).val(deliveryInfo.lotAddr1);
            $('#stnmPostAddr_'+target).text(deliveryInfo.roadAddr1+" "+deliveryInfo.roadAddr2);
            $('#baseAddr_'+target).text(deliveryInfo.lotAddr1+" "+deliveryInfo.lotAddr2);
            $('#stnmRmitDtlAddr_'+target).attr("orgvalue", deliveryInfo.roadAddr2);
            $('#rmitDtlAddr_'+target).attr("orgvalue", deliveryInfo.lotAddr2);
            $('#stnmRmitDtlAddr_'+target).val(deliveryInfo.roadAddr2);
            $('#rmitDtlAddr_'+target).val(deliveryInfo.lotAddr2);

            //상세주소 입력란 입력가능길이 세팅
            _this.tempRmitDtlAddrLength = (deliveryInfo.roadAddr2.toString().length > deliveryInfo.lotAddr2.toString().length) ? _this.rmitDtlAddrLength - deliveryInfo.roadAddr2.toString().length -1 : _this.rmitDtlAddrLength - deliveryInfo.lotAddr2.toString().length -1;
            $('#tempRmitDtlAddr_'+target).attr("maxlength", _this.tempRmitDtlAddrLength);
            $('#tempRmitDtlAddr_'+target).val("");
            $('#tempRmitDtlAddr_'+target).show();
            
            $("#selectedAddr").text(deliveryInfo.roadAddr1);//입력된 배송지
            
            //배송비 상세 조회
            morder.orderForm.payAmt.getDlexDtlPopAjax();
        }
        
        return callback_zipcode;
    },
    
    //  웹로그 바인딩
    bindWebLog : function(){
        //  기존 배송지
        $("#btn_dlvp_exist").bind("click", function(){
            common.wlog("order_address_default");
        });
        //  신규 배송지
        $("#btn_dlvp_new").bind("click", function(){
            common.wlog("order_address_new");
        });
        //  기본 배송지 설정
        $("#setBaseDlvpYn_exist, #setBaseDlvpYn_new").bind("change", function(){
            if($(this).is(":checked")) {
                common.wlog("order_address_set");
            }
        });
        //  주문자정보와 동일
        $("#copyToDlvp_exist, #copyToDlvp_new").bind("change", function(){
            if($(this).is(":checked")) {
                common.wlog("order_address_buyer");
            }
        });
    },
};


/**
 * 쿠폰 Interface
 * 
 */
$.namespace("morder.orderForm.coupon");
morder.orderForm.coupon = {

    //사용가능쿠폰개수
    couponCnt : 0,
    
    init : function() {
        var _this = morder.orderForm.coupon;
        
        // CJ ONE 쿠폰 조회
        _this.getCjOneCouponListAjax();
        
        //사용가능쿠폰개수 세팅
        _this.couponCnt = Number($("#couponCnt").val());
        
        // 최대할인 추천받기
        $("input[name='Discount_Benefits']").change(function(){
            if($(this).val() == "auto") {
                _this.resetCoupon();
                _this.autoSetCoupon();
            } else if($(this).val() == "manual") {
                _this.resetCoupon();
                _this.aplyCoupon();
                
             // 혜택 직접 선택의 경우 오늘드림 배송 쿠폰 셋팅
                if($("#quickYn").val() == "Y") { //오늘드림 배송일 경우
                    var select = $("#paymentCouponList select[index]");
                    var _o2ocpns = $("option[rtamtval]", select);
                    if($("input[name='o2oDlvSp']").is(":checked")) { 
                        //오늘드림 배송구분 체크 값이 있으면 배송구분에 따라 배송비 쿠폰 사용 가능 여부를 셋팅한다. 
                        var o2oDlvSpVal = $("input[name='o2oDlvSp']:checked").val();
                        
                        _o2ocpns.each(function(){
                            var str = $(this).attr("o2ocpnsp");

                            if(str == "" || str == null || str == undefined) { // 쿠폰 구분 값이 없으면 사용 가능
                                $(this).prop("disabled", false);
                            } else {
                                if(str.indexOf(o2oDlvSpVal) != -1 || str == "N_N_N") {
                                 // 쿠폰 구분 값에 배송구분이 있거나, 모두 사용 가능일 경우 사용가능
                                    $(this).prop("disabled", false);
                                } else {
                                    $(this).prop("disabled", true);
                                }
                            }
                        });
                    } else { //오늘드림 배송구분 체크 값이 없으면
                        _o2ocpns.each(function(){ 
                            var str = $(this).attr("o2ocpnsp");
                            
                            if(str == "" || str == null || str == undefined || str == "N_N_N") { 
                                // 쿠폰 구분 값이 없거나 모두 사용 가능일 경우 사용 가능
                                $(this).prop("disabled", false);
                            } else {
                                $(this).prop("disabled", true);
                            }
                        });
                    }
                    
                    var o2oDlvSp = $("input[name='o2oDlvSp']");
                    var select = $("#dlexCouponList_hd select[index]");
                    var _o2ocpns = $("option[aplyrank]", select);
                    if(o2oDlvSp.is(":checked")) { 
                        //오늘드림 배송구분 체크 값이 있으면 배송구분에 따라 배송비 쿠폰 사용 가능 여부를 셋팅한다. 
                        var o2oDlvSpVal = $("input[name='o2oDlvSp']:checked").val();
                        
                        _o2ocpns.each(function(){
                            var str = $(this).attr("o2ocpnsp");

                            if(str == "" || str == null || str == undefined) { // 쿠폰 구분 값이 없으면 사용 가능
                                $(this).prop("disabled", false);
                            } else {
                                if(str.indexOf(o2oDlvSpVal) != -1 || str == "N_N_N") {
                                 // 쿠폰 구분 값에 배송구분이 있거나, 모두 사용 가능일 경우 사용가능
                                    $(this).prop("disabled", false);
                                } else {
                                    $(this).prop("disabled", true);
                                }
                            }
                        });
                    } else { //오늘드림 배송구분 체크 값이 없으면
                        _o2ocpns.each(function(){ 
                            var str = $(this).attr("o2ocpnsp");
                            
                            if(str == "" || str == null || str == undefined || str == "N_N_N") {
                             // 쿠폰 구분 값이 없거나 모두 사용 가능일 경우 사용 가능
                                $(this).prop("disabled", false);
                            } else {
                                $(this).prop("disabled", true);
                            }
                        });
                    }
                }
            }
        });

        // 쿠폰 select 이벤트
        for(var i = 0 ; i < _this.couponCnt ; i++){
            $("select[name='couponList["+i+"].promChk']").change(function(){
                var index = $(this).attr("index");
                var _selectedOption = $("option:selected", this);
                setTimeout(function(){
                    _this.changeCoupon(index, _selectedOption);
                }, 200);
            });
        }

        setTimeout(function() {
            //웹로그 바인딩
            _this.bindWebLog();
        },700);
    },

    // 쿠폰 변경
    changeCoupon : function(index, _selectedOption) {
        var _this = morder.orderForm.coupon;

        $("input[name='couponList["+index+"].promNo']").val(_selectedOption.attr("promno"));
        $("input[name='couponList["+index+"].promAplySeq']").val(_selectedOption.attr("promaplyseq"));
        $("input[name='couponList["+index+"].dwnldGoods1DcAmt']").val(_selectedOption.attr("dwnldgoods1dcamt"));
        
        // 쿠폰을 선택하면
        if(_selectedOption.val() == "Y") {
            $("input[name='couponList["+index+"].promKndCd']").val(_selectedOption.attr("promkndcd"));
        }
        $("input[name='Discount_Benefits'][value='manual']").prop("checked", true);
        // 쿠폰젹용
        _this.setCoupon(index, _selectedOption.val());
        var promKndCd = $("select[name='couponList["+index+"].promChk'] option[value='Y']:first").attr("promkndcd");
        var paymentCoupon_size = $("#paymentCouponList select[index]").size();
        var dlexCouponList_hd_size = $("#dlexCouponList_hd select[index]").size();
        var dlexCouponList_entr_size = $("#dlexCouponList_entr select[index]").size();
        if((promKndCd == "C103" 
                && (paymentCoupon_size > 0 
                        || dlexCouponList_hd_size > 0 
                        || dlexCouponList_entr_size > 0 
                        ))
            || promKndCd == "C105"
                && (dlexCouponList_hd_size > 0 
                        || dlexCouponList_entr_size > 0 
                )) {
            _this.getCouponListAjax();
        }
        
        if($("#quickYn").val() == "Y") { //오늘드림 배송일 경우
        	var select = $("#dwnldCouponList select[index]");
        	
        	select.each(function() {
        		var _o2ocpns = $("option[rtamtval]", this);
        		
        		if($("input[name='o2oDlvSp']").is(":checked")) { //배송구분 체크 값이 있으면 배송구분에 따라 주문별 쿠폰 사용 가능 여부를 셋팅한다.
                    var o2oDlvSpVal = $("input[name='o2oDlvSp']:checked").val();
                    
                    _o2ocpns.each(function(){
                        if(!$(this).prop("disabled")) {
                            var str = $(this).attr("o2ocpnsp");
                            if(str == "" || str == null || str == undefined) { // 쿠폰 구분 값이 없으면 사용 가능
                                $(this).prop("disabled", false);
                            } else {
                                if(str.indexOf(o2oDlvSpVal) != -1 || str == "N_N_N") {
                                 // 쿠폰 구분 값에 배송구분이 있거나, 모두 사용 가능일 경우 사용가능
                                    $(this).prop("disabled", false);
                                } else {
                                    $(this).prop("disabled", true);
                                }
                            }
                        }
                    });
                }
        	});
        	
            var select = $("#paymentCouponList select[index]");
            
            var _o2ocpns = $("option[rtamtval]", select);
            
            if($("input[name='o2oDlvSp']").is(":checked")) { //배송구분 체크 값이 있으면 배송구분에 따라 주문별 쿠폰 사용 가능 여부를 셋팅한다.
                var o2oDlvSpVal = $("input[name='o2oDlvSp']:checked").val();
                
                _o2ocpns.each(function(){
                    if(!$(this).prop("disabled")) {
                        var str = $(this).attr("o2ocpnsp");
                        if(str == "" || str == null || str == undefined) { // 쿠폰 구분 값이 없으면 사용 가능
                            $(this).prop("disabled", false);
                        } else {
                            if(str.indexOf(o2oDlvSpVal) != -1 || str == "N_N_N") {
                             // 쿠폰 구분 값에 배송구분이 있거나, 모두 사용 가능일 경우 사용가능
                                $(this).prop("disabled", false);
                            } else {
                                $(this).prop("disabled", true);
                            }
                        }
                    }
                });
            }
            
            var select = $("#dlexCouponList_hd select[index]");
            var _o2ocpns = $("option[aplyrank]", select);
            if($("input[name='o2oDlvSp']").is(":checked")) { //배송구분 체크 값이 있으면 배송구분에 따라 배송비 쿠폰 사용 가능 여부를 셋팅한다.
                var o2oDlvSpVal = $("input[name='o2oDlvSp']:checked").val();
                
                _o2ocpns.each(function(){
                    if(!$(this).prop("disabled")) {
                        var str = $(this).attr("o2ocpnsp");
                        
                        if(str == "" || str == null || str == undefined) { // 쿠폰 구분 값이 없으면 사용 가능
                            $(this).prop("disabled", false);
                        } else {
                            if(str.indexOf(o2oDlvSpVal) != -1 || str == "N_N_N") {
                                // 쿠폰 구분 값에 배송구분이 있거나, 모두 사용 가능일 경우 사용가능
                                $(this).prop("disabled", false);
                            } else {
                                $(this).prop("disabled", true);
                            }
                        }
                    }
                });
            }
        }
        
        _this.aplyCoupon(index);
    },
    
    // 최대할인쿠폰 선택
    autoSetCoupon : function() {
        var _this = morder.orderForm.coupon;
        var _payAmt = morder.orderForm.payAmt;

        // 주문별할인쿠폰 최대할인금액 세팅
        var getMaxRtAmtVal = function(){
            var maxRtAmtVal = 0;
            var _options = $("#paymentCouponList select[index] option[rtamtval]:enabled");
            _options.each(function(){
                maxRtAmtVal = Math.max(maxRtAmtVal, $(this).attr("rtamtval"));
            });
            return maxRtAmtVal;
        };
        
        // 상품쿠폰 최대할인금액
        var goodsCoupon_maxRtAmtVal = 0;
        // 상품쿠폰 최대할인 적용 전 주문별할인쿠폰 최대할인금액
        var paymentCoupon_org_maxRtAmtVal = getMaxRtAmtVal();
        // 상품쿠폰 최대할인 적용 후 주문별할인쿠폰 최대할인금액
        var paymentCoupon_new_maxRtAmtVal = 0;
        
        // 상품 다운로드 쿠폰
        if($("#dwnldCouponList select[index]").size() > 0) {
            
            var dwnldCouponArray = [];
            var maxDscntCouponList = {};
            var temp = {};
            
            //상품 다운로드 쿠폰 배열로 세팅
            $.each(dwnldCouponList, function(key, couponInfo){
                dwnldCouponArray.push(couponInfo);
            });
            
            //할인금액이 가장 큰 순으로 정렬
            dwnldCouponArray.sort(function(a,b){
                // 할인금액
                var rtAmtVal = Number(b.rtAmtVal) - Number(a.rtAmtVal);
                // 협력사 분담률
                var selrShrRt = Number(b.selrShrRt) - Number(a.selrShrRt);
                // 만료일
                var expireDate = (new Date(a.expireDate)).getTime() - (new Date(b.expireDate)).getTime();
                // 모두 같으면 발급순번
                var promAplySeq = Number(a.promAplySeq) - Number(b.promAplySeq);
                return rtAmtVal == 0 ? (selrShrRt == 0 ? (expireDate == 0 ? promAplySeq : expireDate) : selrShrRt) : rtAmtVal;
//                return Number(b.rtAmtVal) - Number(a.rtAmtVal);
            });
            
            // 적용가능한 쿠폰 중에서 상품별로 쿠폰이 중복적용되지 않도록 세팅
            $.each(dwnldCouponArray, function(i, couponInfo){
                if(couponInfo.aplyAvailYn == 'Y') {
                    var goodsNo = couponInfo.goodsNo;
                    var itemNo = couponInfo.itemNo;
                    var promNo = couponInfo.promNo;
                    var promAplySeq = couponInfo.promAplySeq;
                    var goodsKey = goodsNo+"_"+itemNo;
                    var promKey = promNo+"_"+promAplySeq;
                    if(!maxDscntCouponList[goodsKey] && !temp[promKey]) {
                        maxDscntCouponList[goodsKey] = couponInfo;
                        temp[promKey] = couponInfo;
                    }
                    
                    if($("#quickYn").val() == "Y") {
                    	eval('dwnldCouponList.'+goodsNo+'_'+itemNo+'_'+promNo+'_'+promAplySeq).quickAplyYn = "Y";
                    	
                    	var _select = $("select[goodsno='"+goodsNo+"'][itemno='"+itemNo+"']");
                    	var _o2ocpns = $("option[value='Y']", _select);
                    	
                    	if($("input[name='o2oDlvSp']").is(":checked")) { 
                    		var o2oDlvSpVal = $("input[name='o2oDlvSp']:checked").val();
                    		_o2ocpns.each(function(){
                    			var str = $(this).attr("o2ocpnsp");
                    			if(str == "" || str == null || str == undefined) { // 쿠폰 구분 값이 없으면 사용 가능
                    				$(this).prop("disabled", false);
                    			} else {
                    				if(str.indexOf(o2oDlvSpVal) != -1 || str == "N_N_N") {
                    					// 쿠폰 구분 값에 배송구분이 있거나, 모두 사용 가능일 경우 사용가능
                    					$(this).prop("disabled", false);
                    				} else {
                    					$(this).prop("disabled", true);
                    					eval('dwnldCouponList.'+goodsNo+'_'+itemNo+'_'+promNo+'_'+promAplySeq).quickAplyYn = "N";
                    				}
                    			}
                    		});
                    	} else {
                    		_o2ocpns.each(function(){ 
                    			var str = $(this).attr("o2ocpnsp");
                    			
                    			if(str == "" || str == null || str == undefined || str == "N_N_N") { 
                    				// 쿠폰 구분 값이 없거나 모두 사용 가능일 경우 사용 가능
                    				$(this).prop("disabled", false);
                    			} else {
                    				$(this).prop("disabled", true);
                    				eval('dwnldCouponList.'+goodsNo+'_'+itemNo+'_'+promNo+'_'+promAplySeq).quickAplyYn = "N";
                    			}
                    		});
                    	}
                    }
                }
            });
            
            // 각 상품별 최대할인 쿠폰 세팅
            $.each(maxDscntCouponList, function(key, couponInfo) {
                var goodsNo = couponInfo.goodsNo;
                var itemNo = couponInfo.itemNo;
                var promNo = couponInfo.promNo;
                var promAplySeq = couponInfo.promAplySeq;
                var promKndCd = couponInfo.promKndCd;
                var dwnldGoods1DcAmt = couponInfo.dwnldGoods1DcAmt;
                
                var _select = $("select[goodsno='"+goodsNo+"'][itemno='"+itemNo+"']");
                var _option = $("option[promno='"+promNo+"'][promaplyseq='"+promAplySeq+"']:enabled", _select);
                
                var index = _select.attr("index");
                
                _option.prop("selected", true);
                
                $("input[name='couponList["+index+"].promNo']").val(promNo);
                $("input[name='couponList["+index+"].promAplySeq']").val(promAplySeq);
                $("input[name='couponList["+index+"].promKndCd']").val(promKndCd);
                $("input[name='couponList["+index+"].dwnldGoods1DcAmt']").val(dwnldGoods1DcAmt);
                
                goodsCoupon_maxRtAmtVal += Number(couponInfo.rtAmtVal);
                _this.setCoupon(index, "Y");
            });
        }
        
        // 상품쿠폰 최대할인 적용 후 쿠폰 재조회
        _this.getCouponListAjax();
        
        // 상품쿠폰 최대할인 적용 후 주문별할인쿠폰 최대할인금액
        paymentCoupon_new_maxRtAmtVal = getMaxRtAmtVal();
        
        if(goodsCoupon_maxRtAmtVal + paymentCoupon_new_maxRtAmtVal < paymentCoupon_org_maxRtAmtVal) {
            _this.resetCoupon();
            _this.getCouponListAjax();
        }
        
        // 주문별할인쿠폰
        $("#paymentCouponList select[index]").each(function(){
            var i = $(this).attr("index");
            var _options = $("option[rtamtval]:enabled", $(this));
            var maxRtAmtVal = 0;
            _options.each(function(){
                maxRtAmtVal = Math.max(maxRtAmtVal, $(this).attr("rtamtval"));
            });
            if(maxRtAmtVal > 0) {
                if($("#quickYn").val() == "Y") {
                    var o2oDlvSp = $("input[name='o2oDlvSp']:checked").val(); 
                    if(o2oDlvSp != undefined && o2oDlvSp != null && o2oDlvSp != "") {
                        var _o2ocpns = $("option[rtamtval]:enabled", $(this));
                        _o2ocpns.each(function(){
                            if(!$(this).prop("disabled")) { // 상품별 쿠폰 및 주문별 쿠폰으로 배송비 쿠폰 사용 불가가 아닐 경우
                                var str = $(this).attr("o2ocpnsp");
                                
                                if(str == "" || str == null || str == undefined) { // 쿠폰 구분 값이 없으면 사용 가능
                                    $(this).prop("disabled", false);
                                } else {
                                    if(str.indexOf(o2oDlvSp) != -1 || str == "N_N_N") { 
                                        // 쿠폰 구분 값에 배송구분이 있거나, 모두 사용 가능일 경우 사용가능
                                        $(this).prop("disabled", false);
                                    } else {
                                        $(this).prop("disabled", true);
                                    }
                                }
                            }
                        });
                        
                        _options = $("option[rtamtval]:enabled", $(this));
                    }
                }
                
                $("select[name='couponList["+i+"].promChk'] option[rtamtval='"+maxRtAmtVal+"']:enabled:first").prop("selected", true);
                var _selectedOption = $("option:selected", $(this));
                if(_selectedOption.val() == 'Y') {
                    $("input[name='couponList["+i+"].promNo']").val(_selectedOption.attr("promno"));
                    $("input[name='couponList["+i+"].promAplySeq']").val(_selectedOption.attr("promaplyseq"));
                    $("input[name='couponList["+i+"].promKndCd']").val(_selectedOption.attr("promkndcd"));
                    _this.setCoupon(i, "Y");
                }
            }
        });
        
        // 주문별할인쿠폰 최대할인 적용 후 쿠폰 재조회
        _this.getCouponListAjax();
        
        // 배송비 쿠폰 적용하기전 배송비 조회
        _payAmt.getDlexDtlPopAjax();
        
        // 배송비 쿠폰
        $("#dlexCouponList_hd select[index]").each(function(){
            var i = $(this).attr("index");
            var entrNo = $("input[name='couponList["+i+"].entrNo']").val();
            if(_this.checkDlexAmt(entrNo) > 0) {
                var _options = $("option[aplyrank]:enabled", $(this));
                
             // KIH 오늘드림 배송구분에 따른 쿠폰 적용 20200210                
                if($("#quickYn").val() == 'Y') { 
                    var o2oDlvSp = $("input[name='o2oDlvSp']:checked").val();
                    if(o2oDlvSp == undefined || o2oDlvSp == null || o2oDlvSp == "") {                        
                        // AS-IS 쿠폰적용 
                    } else { //배송구분 체크 값이 있으면 배송구분에 따라 배송비 쿠폰 사용 가능 여부를 셋팅한다.
                        var _o2ocpns = $("option[aplyrank]:enabled", $(this));
                        _o2ocpns.each(function(){ 
                            if(!$(this).prop("disabled")) { // 상품별 쿠폰 및 주문별 쿠폰으로 배송비 쿠폰 사용 불가가 아닐 경우
                                var str = $(this).attr("o2ocpnsp");
                                
                                if(str == "" || str == null || str == undefined) { // 쿠폰 구분 값이 없으면 사용 가능
                                    $(this).prop("disabled", false);
                                } else {
                                    if(str.indexOf(o2oDlvSp) != -1 || str == "N_N_N") {
                                     // 쿠폰 구분 값에 배송구분이 있거나, 모두 사용 가능일 경우 사용가능
                                        $(this).prop("disabled", false);
                                    } else {
                                        $(this).prop("disabled", true);
                                    }
                                }
                            }
                        });
                        
                        _options = $("option[aplyrank]:enabled", $(this));
                    }
                }
                                
                var minAplyRank = 0;
                _options.each(function(){
                    minAplyRank = minAplyRank == 0 ? $(this).attr("aplyrank") : Math.min(minAplyRank, $(this).attr("aplyrank"));
                });
                if(minAplyRank > 0) {
                    $("select[name='couponList["+i+"].promChk'] option[aplyrank='"+minAplyRank+"']:enabled:first").prop("selected", true);
                    var _selectedOption = $("option:selected", $(this));
                    if(_selectedOption.val() == 'Y') {
                        $("input[name='couponList["+i+"].promNo']").val(_selectedOption.attr("promno"));
                        $("input[name='couponList["+i+"].promAplySeq']").val(_selectedOption.attr("promaplyseq"));
                        $("input[name='couponList["+i+"].promKndCd']").val(_selectedOption.attr("promkndcd"));
                        _this.setCoupon(i, "Y");
                    }
                }
            }
        });
        
        // 제휴업체 배송비 쿠폰
        $("#dlexCouponList_entr select[index]").each(function(){
            var i = $(this).attr("index");
            var entrNo = $("input[name='couponList["+i+"].entrNo']").val();
            if(_this.checkDlexAmt(entrNo) > 0) {
                var _options = $("option[aplyrank]:enabled", $(this));
                var minAplyRank = 0;
                _options.each(function(){
                    minAplyRank = minAplyRank == 0 ? $(this).attr("aplyrank") : Math.min(minAplyRank, $(this).attr("aplyrank"));
                });
                if(minAplyRank > 0) {
                    $("select[name='couponList["+i+"].promChk'] option[aplyrank='"+minAplyRank+"']:enabled:first").prop("selected", true);
                    var _selectedOption = $("option:selected", $(this));
                    if(_selectedOption.val() == 'Y') {
                        $("input[name='couponList["+i+"].promNo']").val(_selectedOption.attr("promno"));
                        $("input[name='couponList["+i+"].promAplySeq']").val(_selectedOption.attr("promaplyseq"));
                        $("input[name='couponList["+i+"].promKndCd']").val(_selectedOption.attr("promkndcd"));
                        _this.setCoupon(i, "Y");
                    }
                }
            }
        });
        
        // 쿠폰 적용
        _this.aplyCoupon();
    },
    
    setCoupon : function(index, aplyYn) {
        var _this = morder.orderForm.coupon;
        
        var promKndCd = $("input[name='couponList["+index+"].promKndCd']").val();

        // 상품 다운로드 쿠폰
        if(promKndCd == "C103") {
            _this.setDwnldCoupon(index, aplyYn);
        
        // 장바구니(결제) 쿠폰
        } else if(promKndCd == "C105") {
            _this.setPaymentCoupon(index, aplyYn);
        
        // 배송비 쿠폰
        } else if(promKndCd == "C106") {
            _this.setDlexCoupon(index, aplyYn);
        }
    },
    
    // 다운로드 쿠폰 셋팅
    setDwnldCoupon : function(index, aplyYn) {
        var _this = morder.orderForm.coupon;
        
        // 선택한 쿠폰과 중복된 쿠폰 해제
        var checkDuplicate = function(index, promNo, promAplySeq){
            
            for(var i = 0 ; i < _this.couponCnt ; i++) {
                if( i != index
                        && promNo == $("input[name='couponList["+i+"].promNo']").val()
                        && promAplySeq == $("input[name='couponList["+i+"].promAplySeq']").val()
                        ){

                    $("select[name='couponList["+i+"].promChk']").val("N");
                    $("input[name='couponList["+i+"].promNo']").val("");
                    $("input[name='couponList["+i+"].promAplySeq']").val("");
                    $("input[name='couponList["+i+"].dwnldGoods1DcAmt']").val("");
                    
                    $("#cpnDscntAmt_"+i).val(0);
                    $("#cpnDscntAmt_"+i+"_span").text(0);
                    alert("해당 쿠폰은 중복 사용이\n불가하여 이전 상품에서는 제외됩니다.");
                }
            }
        }
        
        var goodsNo = $("input[name='couponList["+index+"].goodsNo']").val();
        var itemNo = $("input[name='couponList["+index+"].itemNo']").val();
        var key = goodsNo + "\\/" + itemNo;
        
        var cpnDscntAmt = 0;
        var orgSalePrc = $("#orgSalePrc_"+key).val();
        
        if(aplyYn == 'Y') {

            var promNo = $("input[name='couponList["+index+"].promNo']").val();
            var promAplySeq = $("input[name='couponList["+index+"].promAplySeq']").val();
            
            if($("#quickYn").val() != "Y") {
            	cpnDscntAmt = eval('dwnldCouponList.'+goodsNo+'_'+itemNo+'_'+promNo+'_'+promAplySeq).rtAmtVal;
            } else {
            	var quickAplyYn = eval('dwnldCouponList.'+goodsNo+'_'+itemNo+'_'+promNo+'_'+promAplySeq).quickAplyYn;
            	
            	if(quickAplyYn == "Y") {
            		cpnDscntAmt = eval('dwnldCouponList.'+goodsNo+'_'+itemNo+'_'+promNo+'_'+promAplySeq).rtAmtVal;
            	} else {
            		cpnDscntAmt = 0;
            	}
            }

            // 선택된 쿠폰과 중복된 쿠폰이 있으면 메시지얼럿 후 해제
            checkDuplicate(index, promNo, promAplySeq);
        }
        
        $("#cpnDscntAmt_"+index).val(cpnDscntAmt);
        $("#cpnDscntAmt_"+index+"_span").text(cpnDscntAmt.toMoney());
    },
    
    // 결제 쿠폰 셋팅
    setPaymentCoupon : function(index, aplyYn) {
        var _this = morder.orderForm.coupon;

        var cpnDscntAmt = 0;
        var acqrCd = "";
        
        if(aplyYn == 'Y') {
            var promNo = $("input[name='couponList["+index+"].promNo']").val();
            var promAplySeq = $("input[name='couponList["+index+"].promAplySeq']").val();
            var couponInfo = eval('paymentCouponList.'+promNo+'_'+promAplySeq);

            if(couponInfo != null) {
                cpnDscntAmt = couponInfo.rtAmtVal;
                acqrCd = couponInfo.acqrCd;
            }
        }
        
        $("#cpnDscntAmt_"+index).val(cpnDscntAmt);
        $("#cpnDscntAmt_"+index+"_span").text(cpnDscntAmt.toMoney());
        
        // 카드사 쿠폰이면 얼럿 후 카드종류 자동세팅
        var quickYn = $("#quickYn").val();
        if(!!acqrCd && (quickYn == "N" || $("input[name='o2oDlvSp']").is(":checked"))) {
            // 해당카드사 쿠폰이 이미 적용되어있지 않았거나
            // 결제수단이 해당카드로 설정되어있지 않은 경우
            if(acqrCd != $("#cardCouponIndex").attr("acqrcd")
                    || ($("input[name='payMethod']").val() != "11" 
                        || acqrCd != $("[name='acqrCd']").val())
                    ) {
                $("#cardCouponIndex").val(index);
                $("#cardCouponIndex").attr("orgacqrcd", $("#cardCouponIndex").attr("acqrcd"));
                $("#cardCouponIndex").attr("acqrcd", acqrCd);
                
                $("[name='acqrCd']").val(acqrCd);
                var acqrNm = $("[name='acqrCd'] option:selected").text();

                morder.orderForm.payMethod.changePayMethod("11", false);
                morder.orderForm.payMethod.changeCard(false);
                if(quickYn == "Y" && !morder.orderForm.acqrAlert) {
                    alert(acqrNm + "로 결제시 할인이 적용됩니다.");
                    morder.orderForm.acqrAlert = true;
                } else if(quickYn != "Y"){
                    alert(acqrNm + "로 결제시 할인이 적용됩니다."); 
                }
            }
        // 카드사 쿠폰 헤제
        } else if(index == $("#cardCouponIndex").val()){
            $("#cardCouponIndex").val("");
            $("#cardCouponIndex").attr("acqrcd", "");
            $("#cardCouponIndex").attr("orgacqrcd", "");
        }
    },
    
    // 배송비 쿠폰 세팅
    setDlexCoupon : function(index, aplyYn) {
        var _this = morder.orderForm.coupon;
        var _payAmt = morder.orderForm.payAmt;
        
        var entrNo = $("input[name='couponList["+index+"].entrNo']").val();

        $("#dlexCpnYn_"+index+"_p").hide();
        
        if(aplyYn == 'Y') {
            if(_this.checkDlexCoupon(index)) {
                $("#dlexCpnYn_"+index+"_p").show();
            }
        }
    },
    
    // 배송비쿠폰 체크
    checkDlexCoupon : function(index) {
        var _this = morder.orderForm.coupon;
        
        var entrNo = $("input[name='couponList["+index+"].entrNo']").val();
        
        if($("li[entrNo='"+entrNo+"'][dlexCpnYn]").attr("dlexCpnYn") == "Y" || _this.checkDlexAmt(entrNo) > 0){
            return true;
        } else {
//            $("select[name='couponList["+index+"].promChk']").val("N");
            $("select[name='couponList["+index+"].promChk'] option[value='N']").prop("selected", true);
            $("input[name='couponList["+index+"].promNo']").val("");
            $("input[name='couponList["+index+"].promAplySeq']").val("");
            
            if(entrNo == "0") {
                alert("올리브영상품 배송비가 이미 무료이므로 해당 쿠폰적용을 해제합니다.");
            } else {
                var maxLength = 20;
                var goodsNm = $("#goodsNm_"+entrNo).val();
                var goodsCnt = $("#goodsCnt_"+entrNo).val();
                var goodsNmLength = goodsNm.length;
                var addGoodsNm = "";
                if(goodsCnt > 1) {
                    addGoodsNm = " 외 " + (goodsCnt - 1) + "건";
                    goodsNmLength = (goodsNm + addGoodsNm).length;
                }
                if(goodsNmLength > maxLength) {
                    var ellipse = ".. ";
                    goodsNm = goodsNm.substr(0, maxLength - ellipse.length - addGoodsNm.length) + ellipse + addGoodsNm;
                }
                alert(goodsNm + " 배송비가 이미 무료이므로 해당 쿠폰적용을 해제합니다.");
            }
            return false;
        }
    },
    
    // 쿠폰적용
    aplyCoupon : function(index) {
        var _this = morder.orderForm.coupon;
        var _payAmt = morder.orderForm.payAmt;

        // 적용된 쿠폰
        _this.setAplyCoupon();
        _this.getGiftListAjax(index);
        _payAmt.getDlexDtlPopAjax();
        _payAmt.setCpnDscntAmt();
        
        var totCpnAplyAmt = _payAmt.cpnDscntAmt;
        
        $("#totCpnAplyAmt").text(totCpnAplyAmt.toMoney().toNegative());
        
        // 배송비쿠폰
        $("#dlexCpnAplyYn").hide();
        $.each(_this.getAplyCouponList("C106"), function(i, index){
            $("#dlexCpnAplyYn").show();
        });
    },
    
    // 증정품조회
    getGiftListAjax : function(index) {
        var _this = morder.orderForm.coupon;
        var _this2 = morder.orderForm.payAmt;

//        var _gift = $("#giftList li[aeevtaplytpcd][aplytgt1no][aplytgt2no][buyqtyatmsctcd][aplyminamt]");
        if((!index
                || $("input[name='couponList["+index+"].promKndCd']").val() == 'C103'
                || $("input[name='couponList["+index+"].promKndCd']").val() == 'C105')
//                && _gift.size() > 0
                ) {
            var cartNoArray = [];
            
            // 장바구니번호
            $("input[name='cartNo']").each(function(){
                cartNoArray.push($(this).val()); 
            });
            //오늘드림 배송구분
            var o2oDlvSp   = $("input[name='o2oDlvSp']:checked").val();
            if(typeof(o2oDlvSp) == "undefined"){
                o2oDlvSp = "1";
            }
            
            var callback_getGiftListAjax = function(data){

                $("#giftCount").val("-1");
                $("#giftCartNo").html("");
                
                if(!!data){
                    $("#getGiftListAjax").html(data);
                    
                    // 중복증정가능 증정품
                    var _dupPrstPsbGift = $("input[dupprstpsbyn='Y']:enabled");
                    // 중복증정불가능 증정품
                    var _dupPrstImpsbGift = $("input[dupprstpsbyn='N']:enabled");
                    // 중복증정가능 증정품 개수
                    var dupPrstPsbGiftCnt = _dupPrstPsbGift.length;
                    // 중복증정불가능 증정품 개수
                    var dupPrstImpsbGiftCnt = _dupPrstImpsbGift.length;

                    // 총 선택가능 개수
                    var totSelectableCnt = dupPrstPsbGiftCnt + (dupPrstImpsbGiftCnt > 0 ? 1 : 0);
                    
                    if(dupPrstImpsbGiftCnt == 1) {
                        _dupPrstImpsbGift.prop("checked", true);
                    }
                    
                    $("#giftCount").val(totSelectableCnt);
                    
                    if(totSelectableCnt > 0) {
//                      $("#giftNoti").show();
                        $("#giftNoti2").show();
                        //$("#giftNoti3").show(); //초기에 뜨는 일반선물의 결제버튼 아래 증정품 문구 안띄움 
                        
                        //초기에 DB 조회했으나 Static으로 바꿈
                        if(	presentYn == "Y" && $("#presentO2oYn").val() == "Y"  ){
                        	//console.log("선물하기이며 오늘드림가능 시 온라인증정품 있을때 증정품 있을때 ");
                            $("#giftChangeO2oComment").show();		//선물하기면서 오늘드림 결제하기 버튼 아래 멘트 
                            $("#giftPopO2oComment").show();			//선물하기면서 오늘드림 결제하기 후 팝업 멘트
                            $("#giftNoti3").hide();
                        }else{
                        	//console.log("선물하기이며 오늘드림 불가능 시 온라인증정품 있을때 증정품 있을때 ");
                            $("#giftChangeO2oComment").hide();		//선물하기면서 오늘드림 결제하기 버튼 아래 멘트 
                            $("#giftPopO2oComment").hide();			//선물하기면서 오늘드림 결제하기 후 팝업 멘트                        	
                        	$("#giftNoti3").show();
                        }
                        
                        $(".ButtonPayment").addClass("gift");
                    } else {
//                        $("#giftNoti").hide();
                        $("#giftNoti2").hide();
                        $("#giftNoti3").hide();
                        $(".ButtonPayment").removeClass("gift");
                    }
                    
                    // 퀵배송 전용
                    /*if($("#giftYn").val() == "Y"){
                        $("#giftNotiQuick").show();
                    }else{
                        $("#giftNotiQuick").hide();
                    }*/
                    
                } else {
                    alert("사은품 조회 중 오류가 발생했습니다.");
                    location.href = _secureUrl + "cart/getCart.do";
                    return false;
                }
            }
            
            var cpnCheckCnt = 0;
            for(var i = 0 ; i < morder.orderForm.coupon.couponCnt ; i++){
            	if(_this2.giftData["couponList["+i+"].promNo"] != $("[name='couponList["+i+"].promNo']").val()){
            		cpnCheckCnt++;
            	}
            }

            //증정품 조회 중복호출 방지 (파라미터가 같은경우 callback_getGiftListAjax 만 호출)
            if(_this2.giftData.cartNo == cartNoArray.toString() && 
            		_this2.giftData.o2oDlvSp == o2oDlvSp && cpnCheckCnt == 0){
            	callback_getGiftListAjax($("#getGiftListAjax").html());
            		
            } else {
            		//증정품조회 ajax
                    var url = _secureUrl + "order/getGiftListAjax.do";
                    _this2.giftData = {
                            cartNo : cartNoArray.toString()
                    };
                    
                    _this2.giftData.o2oDlvSp = o2oDlvSp;
                    
                    if($("#quickYn").val() == "Y") {
                    	_this2.giftData.quickYn = $("#quickYn").val();
                    	_this2.giftData.strNo = $("#orderStrNo").val();
                    	
                    }
                    
                    for(var i = 0 ; i < morder.orderForm.coupon.couponCnt ; i++){
                    	_this2.giftData["couponList["+i+"].promChk"] = $("[name='couponList["+i+"].promChk']").val();
                    	_this2.giftData["couponList["+i+"].goodsNo"] = $("[name='couponList["+i+"].goodsNo']").val();
                    	_this2.giftData["couponList["+i+"].itemNo"] = $("[name='couponList["+i+"].itemNo']").val();
                    	_this2.giftData["couponList["+i+"].promNo"] = $("[name='couponList["+i+"].promNo']").val();
                    	_this2.giftData["couponList["+i+"].promAplySeq"] = $("[name='couponList["+i+"].promAplySeq']").val();
                    	_this2.giftData["couponList["+i+"].promKndCd"] = $("[name='couponList["+i+"].promKndCd']").val();
                    	_this2.giftData["couponList["+i+"].entrNo"] = $("[name='couponList["+i+"].entrNo']").val();
                    	_this2.giftData["couponList["+i+"].immedGoods1DcAmt"] = $("[name='couponList["+i+"].immedGoods1DcAmt']").val();
                    	_this2.giftData["couponList["+i+"].immedOrdQty1"] = $("[name='couponList["+i+"].immedOrdQty1']").val();
                    	_this2.giftData["couponList["+i+"].dwnldGoods1DcAmt"] = $("[name='couponList["+i+"].dwnldGoods1DcAmt']").val();
                    }
                    common.Ajax.sendRequest("POST", url, _this2.giftData, callback_getGiftListAjax, false);
            }
        }
    },
    
    // 쿠폰재설정
    resetCoupon : function(){
        var _this = morder.orderForm.coupon;

        var isRefresh = false;
        for(var i = 0 ; i < _this.couponCnt ; i++){
            var promChk = $("select[name='couponList["+i+"].promChk']").val();
            var promKndCd = $("input[name='couponList["+i+"].promKndCd']").val();
            isRefresh = isRefresh || (promChk == "Y" && (promKndCd == "C103" || promKndCd == "C105"));
            if(promKndCd != "C101"){
                $("select[name='couponList["+i+"].promChk']").val("N");
                $("input[name='couponList["+i+"].promNo']").val("");
                $("input[name='couponList["+i+"].promAplySeq']").val("");
                $("input[name='couponList["+i+"].dwnldGoods1DcAmt']").val("");
                
                _this.setCoupon(i, "N");
            }
        }
        if(isRefresh) {
            _this.getCouponListAjax();
        }
    },
    
    // 적용된 쿠폰 index 조회
    getAplyCouponList : function(promKndCd) {
        var _this = morder.orderForm.coupon;
        
        var indexArray = [];
        
        for(var i = 0 ; i < _this.couponCnt ; i++){
            if($("select[name='couponList["+i+"].promChk']").val() == "Y"){
                if(!promKndCd || promKndCd == $("input[name='couponList["+i+"].promKndCd']").val()) {
                    indexArray.push(i);
                }
            }
        }
        return indexArray;
    },
    
    // 거래처번호에 해당하는 배송비 조회
    checkDlexAmt : function(entrNo) {
        var totDlexAmt = Number($("li[entrNo='"+entrNo+"'] input[name='dlexAmt']:eq(0)").val());
        return totDlexAmt;
    },
    
    /**
     * validation 처리를 함.
     * 
     * @return 오류 메시지 / 정상일때 빈 문자열("")
     */
    valid : function() {
        var _super = morder.orderForm;
        
        return new _super.validObj();
    },
    
    getCouponListAjax : function(){

        var _this = morder.orderForm.coupon;

        var _paymentCouponList = $("#paymentCouponList select option[value='Y']");
        var _dlexCouponList_hd = $("#dlexCouponList_hd select option[value='Y']");
        var _dlexCouponList_entr = $("#dlexCouponList_entr select option[value='Y']");

        if(_paymentCouponList.size() > 0
                || _dlexCouponList_hd.size() > 0
                || _dlexCouponList_entr.size() > 0
                ) {
            var cartNoArray = [];
            
            // 장바구니번호
            $("input[name='cartNo']").each(function(){
                cartNoArray.push($(this).val()); 
            });
            
            // 쿠폰조회 ajax
            var url = _secureUrl + "order/getCouponListAjax.do";
            var data = {
                    cartNo : cartNoArray.toString()
            };
            for(var i = 0 ; i < morder.orderForm.coupon.couponCnt ; i++){
                data["couponList["+i+"].promChk"] = $("[name='couponList["+i+"].promChk']").val();
                data["couponList["+i+"].goodsNo"] = $("[name='couponList["+i+"].goodsNo']").val();
                data["couponList["+i+"].itemNo"] = $("[name='couponList["+i+"].itemNo']").val();
                data["couponList["+i+"].promNo"] = $("[name='couponList["+i+"].promNo']").val();
                data["couponList["+i+"].promAplySeq"] = $("[name='couponList["+i+"].promAplySeq']").val();
                data["couponList["+i+"].promKndCd"] = $("[name='couponList["+i+"].promKndCd']").val();
                data["couponList["+i+"].entrNo"] = $("[name='couponList["+i+"].entrNo']").val();
            }
            
            var callback_getCouponListAjax = function(data){
                if(data.result == "S") {
                    var couponMap = data.data;
                    var paymentCouponList_new = couponMap.C105;
                    var dlexCouponList_new = couponMap.C106;

                    $("#paymentCouponList select:has(option[value='Y'])").off("click").prop("disabled", false);
                    $("#dlexCouponList_hd select:has(option[value='Y'])").off("click").prop("disabled", false);
                    $("#dlexCouponList_entr select:has(option[value='Y'])").off("click").prop("disabled", false);
                    
                    var paymentCouponIndex = $("#paymentCouponList select").attr("index");
                    var hdDlexCouponIndex = $("#dlexCouponList_hd select").attr("index");
                    var entrDlexCouponIndex = $("#dlexCouponList_entr select").attr("index");
                    
                    _paymentCouponList.prop("disabled", false);
                    _dlexCouponList_hd.prop("disabled", false);
                    _dlexCouponList_entr.prop("disabled", false);
                    
                    if($("#quickYn").val() == "Y" && !$("input[name='o2oDlvSp']").is(":checked")) {
                        $("#paymentCouponList select:has(option[value='Y'])").find("option[value='Y']").each(function() {
                           var o2oCpnSp = $(this).attr("o2ocpnsp");
                           
                           if(o2oCpnSp != "" && o2oCpnSp != "N_N_N") {
                               $(this).prop("disabled", true);
                           }
                        });
                    } else if($("#quickYn").val() == "Y" && $("input[name='o2oDlvSp']").is(":checked")) {
                       var o2oDlvSpVal = $("input[name='o2oDlvSp']:checked").val();
                       $("#paymentCouponList select:has(option[value='Y'])").find("option[value='Y']").each(function() {
                            var o2oCpnSp = $(this).attr("o2ocpnsp");
                            
                            if (o2oCpnSp != "" && o2oCpnSp != "N_N_N" && o2oCpnSp.indexOf(o2oDlvSpVal) == -1) {
                                $(this).prop("disabled", true);
                            } 
                         });
                    }
                    
                    // 현재 쿠폰에서 조회한 결제쿠폰 제외
                    $.each(paymentCouponList_new, function(i, couponList){
                        var promNo = couponList[0].promNo;
                        var promAplySeq = couponList[0].promAplySeq;
                        var rtAmtVal = couponList[0].rtAmtVal;
                        var key = promNo+"_"+promAplySeq;
                        
                        paymentCouponList[key].rtAmtVal = rtAmtVal;
                        var cpnList_new = {}; 
                        $.each(couponList, function(i, couponInfo){
                            var goodsNo = couponInfo.goodsNo;
                            var itemNo = couponInfo.itemNo;
                            var goods1DcAmt = couponInfo.goods1DcAmt;
                            var cpnInfo = {};
                            cpnInfo.goodsNo = goodsNo;
                            cpnInfo.itemNo = itemNo;
                            cpnInfo.goods1DcAmt = goods1DcAmt;
                            cpnList_new[goodsNo+"_"+itemNo+"_"+promNo+"_"+promAplySeq] = cpnInfo;
                        });
                        paymentCouponList[key].cpnList = cpnList_new;
                        
                        var couponInfo = _paymentCouponList.filter("[promno='"+promNo+"'][promaplyseq='"+promAplySeq+"']");
                        couponInfo.attr("rtamtval", rtAmtVal);
                        _paymentCouponList = _paymentCouponList.not("[promno='"+promNo+"'][promaplyseq='"+promAplySeq+"']");
                    });

                    // 현재 쿠폰에서 조회한 배송비쿠폰 제외
                    $.each(dlexCouponList_new, function(i, delxCoupon){
                        var promNo = delxCoupon.promNo;
                        var promAplySeq = delxCoupon.promAplySeq;
                        
                        _dlexCouponList_hd = _dlexCouponList_hd.not("[promno='"+promNo+"'][promaplyseq='"+promAplySeq+"']");
                        _dlexCouponList_entr = _dlexCouponList_entr.not("[promno='"+promNo+"'][promaplyseq='"+promAplySeq+"']");
                    });

                    // 적용된 금액 새로고침
                    _this.setPaymentCoupon(paymentCouponIndex, "Y");
                    
                    // 조회되지 않은 쿠폰은 사용 불가처리
                    if(_paymentCouponList.size() > 0){
                        // 이미 선택되어진 쿠폰은 적용 해제
                        if(_paymentCouponList.filter(":selected").size() > 0) {
                            $("select[name='couponList["+paymentCouponIndex+"].promChk']").val("N");
                            //$("select[name='couponList["+paymentCouponIndex+"].promChk']").trigger("change");
                            $("input[name='couponList["+paymentCouponIndex+"].promNo']").val("");
                            $("input[name='couponList["+paymentCouponIndex+"].promAplySeq']").val("");
                            _this.setPaymentCoupon(paymentCouponIndex, "N");
                            alert("적용된 주문별 할인 쿠폰은 조건에 맞지 않아 사용할 수 없습니다.");
                        }
                        _paymentCouponList.prop("disabled", true);
                    }
                    
                    // 조회되지 않은 쿠폰은 사용 불가처리
                    if(_dlexCouponList_hd.size() > 0){
                        // 이미 선택되어진 쿠폰은 적용 해제
                        if(_dlexCouponList_hd.filter(":selected").size() > 0) {
                            $("select[name='couponList["+hdDlexCouponIndex+"].promChk']").val("N");
                            //$("select[name='couponList["+hdDlexCouponIndex+"].promChk']").trigger("change");
                            $("input[name='couponList["+hdDlexCouponIndex+"].promNo']").val("");
                            $("input[name='couponList["+hdDlexCouponIndex+"].promAplySeq']").val("");
                            _this.setDlexCoupon(hdDlexCouponIndex, "N");
                            alert("적용된 배송비 쿠폰은 조건에 맞지 않아 사용할 수 없습니다.");
                        }
                        _dlexCouponList_hd.prop("disabled", true);
                    }
                    
                    // 조회되지 않은 쿠폰은 사용 불가처리
                    if(_dlexCouponList_entr.size() > 0){
                        // 이미 선택되어진 쿠폰은 적용 해제
                        if(_dlexCouponList_entr.filter(":selected").size() > 0) {
                            $("select[name='couponList["+entrDlexCouponIndex+"].promChk']").val("N");
                            //$("select[name='couponList["+entrDlexCouponIndex+"].promChk']").trigger("change");
                            $("input[name='couponList["+entrDlexCouponIndex+"].promNo']").val("");
                            $("input[name='couponList["+entrDlexCouponIndex+"].promAplySeq']").val("");
                            _this.setDlexCoupon(entrDlexCouponIndex, "N");
                            alert("적용된 제휴업체 배송비 쿠폰은 조건에 맞지 않아 사용할 수 없습니다.");
                        }
                        _dlexCouponList_entr.prop("disabled", true);
                    }
                    
                    var setDisabled = function(_select){
                        var size = $("option[value='Y']:enabled", _select).size();
                        if(size < 1) {
//                            _select.prop("disabled", true);
                            _select.on("click", function(e){
                                alert("결제금액이 변경되어 쿠폰을 적용할 수 없습니다.");
                            });
                        }
                    };
                    
                    setDisabled($("#paymentCouponList select:has(option[value='Y'])"));
                    setDisabled($("#dlexCouponList_hd select:has(option[value='Y'])"));
                    setDisabled($("#dlexCouponList_entr select:has(option[value='Y'])"));
                    
                } else {
                    alert("쿠폰 조회 중 오류가 발생했습니다.");
                    location.href = _secureUrl + "cart/getCart.do";
                }
            }
            common.Ajax.sendJSONRequest("POST", url, data, callback_getCouponListAjax, false);
        }
    },
    
    // CJ ONE 쿠폰 조회
    getCjOneCouponListAjax : function() {
        var _this = morder.orderForm.coupon;

        var _cjOneCouponList = $("#paymentCouponList select option[value='Y'][certcpnyn='Y']");
        if(_cjOneCouponList.size() > 0) {
            // CJ ONE 쿠폰조회 ajax
            var url = _secureUrl + "order/getCjOneCouponListAjax.do";
            var data = {
            };
            
            var callback_getCjOneCouponListAjax = function(data){
                if(data.result == "S") {
                    var cjOneCouponList = data.data;
                    
                    // 현재 쿠폰에서 조회한 쿠폰 제외
                    $.each(cjOneCouponList, function(i, cjOneCoupon){
                        _cjOneCouponList = _cjOneCouponList.not("[certcpnno='"+cjOneCoupon.cpnCd+"'][cjonecpnno='"+cjOneCoupon.cpnNo+"']");
                    });
                    
                    // 조회되지 않은 쿠폰은 사용 불가처리
                    if(_cjOneCouponList.size() > 0){
                        // 이미 선택되어진 쿠폰은 적용 해제
                        if(_cjOneCouponList.filter(":selected").size() > 0) {
                            var cpnIndex = $("#paymentCouponList select").attr("index");
                            $("select[name='couponList["+cpnIndex+"].promChk']").val("N");
                            //$("select[name='couponList["+cpnIndex+"].promChk']").trigger("change");
                            $("input[name='couponList["+cpnIndex+"].promNo']").val("");
                            $("input[name='couponList["+cpnIndex+"].promAplySeq']").val("");
                            _this.setPaymentCoupon(cpnIndex, "N");
                            _this.aplyCoupon();
//                            alert("적용된 주문별 할인 쿠폰은 사용할 수 없습니다.");
                        }
//                        _cjOneCouponList.prop("disabled", true);
                        _cjOneCouponList.remove();
                        // CJ ONE 쿠폰 사용처리 ajax
                        var cpnNoArray = []; 
                        var cpnIssuNoArray = []; 
                        var cjOneCpnNoArray = []; 
                        _cjOneCouponList.each(function(i){
                            cpnNoArray.push($(this).attr("promno"));
                            cpnIssuNoArray.push($(this).attr("promaplyseq"));
                            cjOneCpnNoArray.push($(this).attr("cjonecpnno"));
                        });
                        var url = _secureUrl + "order/updateCjOneCouponAjax.do";
                        var data = {
                                cpnNo : cpnNoArray.toString()
                              , cpnIssuNo : cpnIssuNoArray.toString()
                              , cjOneCpnNo : cjOneCpnNoArray.toString()
                        };
                        
                        var callback_updateCjOneCouponAjax = function(data){
                            
                        }
                        common.Ajax.sendJSONRequest("POST", url, data, callback_updateCjOneCouponAjax, true);
                    }
                } else {
                    alert("쿠폰 조회 중 오류가 발생했습니다.");
                    location.href = _secureUrl + "cart/getCart.do";
                }
            }
            common.Ajax.sendJSONRequest("POST", url, data, callback_getCjOneCouponListAjax, true);
        }
    },
    
    // 적용된 쿠폰 세팅
    setAplyCoupon : function() {
        var _this = morder.orderForm.coupon;
        var _payAmt = morder.orderForm.payAmt;

        $.each(_payAmt.goodsInfoList, function(key, couponInfo){
            couponInfo.cpnDscntAmt = 0;
        });
        
        $("select option[promno][promaplyseq][promkndcd='C103']").each(function(){
            $(this).text($(this).attr("promnm"));
        });
        
        for(var i = 0 ; i < _this.couponCnt ; i++){
            if($("select[name='couponList["+i+"].promChk']").val() == "Y"
                && $("input[name='couponList["+i+"].promKndCd']").val() == "C103"
                ){
                var _selectedOption = $("select[name='couponList["+i+"].promChk'] option:selected");
                var promNo = _selectedOption.attr("promno");
                var promAplySeq = _selectedOption.attr("promaplyseq");
                var goodsNo = _selectedOption.attr("goodsno");
                var itemNo = _selectedOption.attr("itemno");
                var goodsNm = _selectedOption.attr("goodsnm");
                $("select option[promno='"+promNo+"'][promaplyseq='"+promAplySeq+"']:not(:selected)").each(function(){
                    $(this).text($(this).attr("promnm") + " (적용중 - " + goodsNm +")");
                });
                _payAmt.goodsInfoList[goodsNo+"_"+itemNo].cpnDscntAmt += Number(_selectedOption.attr("rtamtval"));
                
            } else if($("select[name='couponList["+i+"].promChk']").val() == "Y"
                && $("input[name='couponList["+i+"].promKndCd']").val() == "C105"
                ){
                var _selectedOption = $("select[name='couponList["+i+"].promChk'] option:selected");
                var promNo = _selectedOption.attr("promno");
                var promAplySeq = _selectedOption.attr("promaplyseq");
                var cpnList = paymentCouponList[promNo+"_"+promAplySeq].cpnList;
                $.each(cpnList, function(key, cpnInfo){
                    _payAmt.goodsInfoList[cpnInfo.goodsNo+"_"+cpnInfo.itemNo].cpnDscntAmt += Number(cpnInfo.goods1DcAmt);
                });
            }
        }
    },

    //  웹로그 바인딩
    bindWebLog : function(){
        $("[name='Discount_Benefits']").bind("change", function(){
            // 최대 할인 추천받기
            if($("#autoDiscount").is(":checked")) {
                common.wlog("order_coupon_max");
            // 혜택 직접 선택하기
            } else if($("#manualDiscount").is(":checked")) {
                common.wlog("order_coupon_select");
            }
        });
    },
};


/**
 * 포인트 Interface
 * 
 */
$.namespace("morder.orderForm.point");
morder.orderForm.point = {

    cjonePnt : 0,
    cafeteriaPnt : 0,
    csmnOwnAmt : 0,
    
    maxAplyAmt : 0,
    
    events : 'input paste change',
        
    init : function() {
        
        // -------------------------------
        // UI Object Load
        // -------------------------------
        
        // -------------------------------
        // Event Handler Bind
        // -------------------------------
        
        // -------------------------------
        // Etc Init
        // -------------------------------
        
        var _this = morder.orderForm.point;
        
        // 사용 가능한 포인트 조회
        var fnCallback = function(pointInfo) {
            
            _this.cjonePnt              = pointInfo.CJOnePnt;
            _this.cafeteriaPnt          = pointInfo.cafeteriaPnt > 0 ? pointInfo.cafeteriaPnt * 1000 : pointInfo.cafeteriaPnt;
            _this.csmnOwnAmt            = pointInfo.csmnOwnPntAmt;

            _this.initPoint();
            
            // 임직원 정보가 비정상인 경우
            if(pointInfo.cafeteriaPnt == -9900) {
//                $("#cafeteriaPnt_span").html("사용불가");
            }
            // 임직원이 휴직중인 경우
            if(pointInfo.cafeteriaPnt == -9990) {
                $("#cafeteriaPnt_span").html("휴직자");
            }
            
            if(Object.keys(systemIFMgmtList).length > 0) {
                var cnt = 0;
                var format = "yyyy.MM.dd HH:mm";
                var startDtimeRegex = "startDtime";
                var endDtimeRegex = "endDtime";
                var pointNmRegex = "pointNm";
                var msg = startDtimeRegex + " ~ " + endDtimeRegex + " 까지\n" + pointNmRegex + " 포인트 시스템 점검으로 인하여 해당 결제수단 사용이 불가능합니다.";
                $.each(systemIFMgmtList, function(cd, systemIFMgmtInfo){
                    var startDtime = systemIFMgmtInfo.systemIFExpStartDtime.substr(0, 16).replaceAll("-", ".");
                    var endDtime = systemIFMgmtInfo.systemIFExpEndDtime.substr(0, 16).replaceAll("-", ".");
                    var pointNm = "";
                    // CJ ONE 포인트
                    if(cd == "81") {
                        cnt++;
                        pointNm = "CJ One";
                        setTimeout(function(){
                            alert(msg.replace(startDtimeRegex, startDtime).replace(endDtimeRegex, endDtime).replace(pointNmRegex, pointNm));
                        }, cnt * 200);
                        $("#cjonePnt_span").html("점검중");
                        
                    // 카페테리아 포인트
                    } else if(cd == "61") {
                        cnt++;
                        pointNm = "카페테리아";
                        setTimeout(function(){
                            alert(msg.replace(startDtimeRegex, startDtime).replace(endDtimeRegex, endDtime).replace(pointNmRegex, pointNm));
                        }, cnt * 200);
                        $("#cafeteriaPnt_span").html("점검중");
                    }
                });
            }
        }
        var url = _secureUrl + "order/getAvailPointInfoJson.do";
        var _ajax = common.Ajax;
        _ajax.sendRequest("POST", url, '', fnCallback, true);
        
        // 기프트카드 조회 클릭시,
        $("button[name=giftCard_btn]").on("click",function(){
            
            var target = $(this);
            var _payAmt = morder.orderForm.payAmt;
            var giftCardUrl = _secureUrl + "order/getAvailGiftCardInfoJson.do";
            var isCjGiftCard = target.attr("id").indexOf("cj") > -1 ? true : false;
            
            var giftCardFnCallback = function(giftCardInfo){
                
                if(giftCardInfo.returnCd == 'S'){ // 기프트카드 조회 성공
                    
                    if(isCjGiftCard){
                        _this.cjGiftCardAmt = giftCardInfo.cjGiftCardAmt;
                        
                        if(Number(giftCardInfo.cjGiftCardQty) > 0){
                            $("#cjGiftCardAmt").text(_this.cjGiftCardAmt.toMoney());
                            target.removeClass("search");
                            
                            // cj 기프트카드 초기화
                            _this.initFormObj(
                                    $("input[name='cjGiftCardAplyAmt']")
                                    , target
                                    , _this.cjGiftCardAmt
                                    , _payAmt.cjGiftCardAplyAmt
                                    );
                            
                        } else{
                            alert("등록된 기프트카드가 없습니다.");
                        }
                    }else{
                        _this.oyGiftCardAmt = giftCardInfo.oyGiftCardAmt;
                        
                        if(Number(giftCardInfo.oyGiftCardQty) > 0){
                            $("#oyGiftCardAmt").text(_this.oyGiftCardAmt.toMoney());
                            target.removeClass("search");
                            
                            // 올리브영 기프트카드 초기화
                            _this.initFormObj(
                                    $("input[name='oyGiftCardAplyAmt']")
                                    , target
                                    , _this.oyGiftCardAmt
                                    , _payAmt.oyGiftCardAplyAmt
                                    );
                            
                        } else{
                            alert("등록된 기프트카드가 없습니다.");
                        }
                    }
                } else{ // 기프트카드 조회 실패
                    alert(giftCardInfo.errorMsg);
                    
                    // 로그인이 필요한 경우
                    if(giftCardInfo.isLogin == 'N'){
                        location.href = _secureUrl + "cart/getCart.do";
                    }
                    
                    return false;
                }
            };
            
            _ajax.sendRequest("POST", giftCardUrl,'', giftCardFnCallback, false);
        });
    },
    /**
     * validation 처리를 함.
     * 
     * @return 오류 메시지 / 정상일때 빈 문자열("")
     */
    valid : function() {
        var _super = morder.orderForm;
        
        return new _super.validObj();
    },
    
    /**
     * 포인트 세팅
     */
    initPoint : function() {
        var _this = morder.orderForm.point;
        var _payAmt = morder.orderForm.payAmt;
        
        $("#cjonePnt").text(_this.cjonePnt > 0 ? _this.cjonePnt.toMoney() : "0");
        $("#cafeteriaPnt").text(_this.cafeteriaPnt > 0 ? (_this.cafeteriaPnt/1000).toMoney() : "0");
        $("#csmnOwnAmt").text(_this.csmnOwnAmt > 0 ? _this.csmnOwnAmt.toMoney() : "0");

        // CJ ONE 포인트 초기화
        _this.initFormObj(
                $("input[name='cjonePntAplyAmt']")
                , $("#cjonePnt_btn")
                , _this.cjonePnt
                , _payAmt.cjonePntAplyAmt
                );
        
        // 카페테리아 포인트 초기화
        _this.initFormObj(
                $("input[name='cafeteriaPntAplyAmt']")
                , $("#cafeteriaPnt_btn")
              , _this.cafeteriaPnt
                , _payAmt.cafeteriaPntAplyAmt
                );
        
        // 예치금 초기화
        _this.initFormObj(
                $("input[name='csmnAplyAmt']")
                , $("#csmnAplyAmt_btn")
                , _this.csmnOwnAmt
                , _payAmt.csmnAplyAmt
                );
        
        // CJ 기프트카드 초기화
        _this.initFormObj(
                $("#cjGiftCardAplyAmt")
                , $("#cjGiftCard_btn")
                , _this.cjGiftCardAmt
                , _payAmt.cjGiftCardAplyAmt
        );
        
        // 올리브영 기프트카드 초기화
        _this.initFormObj(
                $("#oyGiftCardAplyAmt")
                , $("#oyGiftCard_btn")
                , _this.oyGiftCardAmt
                , _payAmt.oyGiftCardAplyAmt
        );
        
        // 적용포인트 세팅
        _this.applyPoint();
    },
    
    // 2018.03.19 기프트카드도 쓰기 위해 initPoint 안에서 메소드로 바꿈
    // form 오브젝트 활성화 (공통)
    activateFormObj : function(_input, _btn, ownPnt, aplyAmt) {

        var _super = morder.orderForm;
        var _this = morder.orderForm.point;

        // 입력폼 활성화
        _input.prop("disabled", false).removeClass("al_left").val("");   

        var cjonePntPosAmt = Number($("input[name='cjonePntPosAmt']").val())+ Number($("input[name='dlexPayAmt']").val());
        var cjonePntNonPosCnt = Number($("input[name='cjonePntNonPosCnt']").val());
        
        var fnChangeEvent = function(){

            _super.checkNumber(_input);
            
            var amt = Number(_input.val());
            var maxAmt = _this.maxAplyAmt;
            
            if(amt < 0) {
                _input.val("");
            }
            
            //3275248 bmiy20 cjone point 적립불가건에 대해 사용 불가 처리 추가 amt >= cjonePntPosAmt &&
            if(_input.hasClass("cjonePointNon") &&  cjonePntNonPosCnt > 0) {
            	var prdCpnlist = $.map($("#dwnldCouponList select:not([disabled])"),function( a, b){
                  	 return {
                  		 goodsno: String($(":selected", a).attr('goodsno')),
                  	     rtamtval: parseInt($(":selected", a).attr('rtamtval')) ,
                  	     value: $(":selected", a).attr('value')          	     
                  	 }
                });
            	
            	var goodsList = $.map($("#goodsInfo"),function( a, b){
            		 return {
            			 goodsno: $(a).attr('goodsno'),
            		     pntrsrvyn: $(a).attr('pntrsrvyn') 
            		 }
            	});
            	
            	var totRtamtval = 0;
            	for(var i=0; i < prdCpnlist.length; i++ ) { //상품쿠폰이 cjone 포인트 적용 불가 상품의 쿠폰인지 확인
	        	   if (prdCpnlist[i].value == "Y") {
	        		   for(var j=0; j < goodsList.length; j++) {
	        			   if (prdCpnlist[i].goodsno == goodsList[j].goodsno && goodsList[j].pntrsrvyn == "N"){
	        				   totRtamtval += Number(prdCpnlist[i].rtamtval);	            			 
		            	   }
	        		   }
	        		}
            	}
            	if (amt > 0) {
	           		if (amt > cjonePntPosAmt+ totRtamtval) {
	           			amt = cjonePntPosAmt+ totRtamtval;
	           		}
            	}
            }
            
            if(amt > ownPnt) {
                var ownAmt = ownPnt;
                var unitAmt = Number(_input.attr("unitamt"));
                
                var remainder = ownAmt % unitAmt;
                if(remainder != 0) {
                    ownAmt -= remainder;
                }
                amt = ownAmt;
                _input.val(amt);
                if(!_input.hasClass("giftCard")){
                    alert("보유하신 포인트를\n초과하였습니다.");
                }else{
                    alert("보유하신 기프트카드 금액을\n초과하였습니다.");
                }
            }
            if(amt > maxAmt) {
                amt = maxAmt;
                _input.val(amt);
            }
            _this.toggleBtn(_input, _btn);
            return false;
        };
        
        var fnFocusEvent = function(){
            _this.setMaxAplyAmt(_input);
            
            if(_this.maxAplyAmt == 0) {
                alert("결제하실 금액이 없습니다.");
                _input.blur();
            }
            return false;
        };
        
        var fnBlurEvent = function(){

            var pntNm = _input.attr("this");
            var unitAmt = Number(_input.attr("unitamt"));
            var unit = _input.attr("unit");
            var minAplyAmt = Number(_input.attr("minaplyamt"));

            var amt = Number(_input.val());
                  
            if(_input.hasClass("cjonePointNon") && cjonePntNonPosCnt > 0) {
            	var prdCpnlist = $.map($("#dwnldCouponList select:not([disabled])"),function( a, b){
                  	 return {
                  		 goodsno: String($(":selected", a).attr('goodsno')),
                  	     rtamtval: parseInt($(":selected", a).attr('rtamtval')) ,
                  	     value: $(":selected", a).attr('value')          	     
                  	 }
                });
            	var goodsList = $.map($("#goodsInfo"),function( a, b){
            		 return {
            			 goodsno: $(a).attr('goodsno'),
            		     pntrsrvyn: $(a).attr('pntrsrvyn') 
            		 }
            	});
            	
            	var totRtamtval = 0;
            	for(var i=0; i < prdCpnlist.length; i++ ) { //상품쿠폰이 cjone 포인트 적용 불가 상품의 쿠폰인지 확인
	        	   if (prdCpnlist[i].value == "Y") {
	        		   for(var j=0; j < goodsList.length; j++) {
	        			   if (prdCpnlist[i].goodsno == goodsList[j].goodsno && goodsList[j].pntrsrvyn == "N"){
	        				   totRtamtval += Number(prdCpnlist[i].rtamtval);	            			 
		            	   }
	        		   }
	        		}
            	}
            	if (amt > 0) {
	           		if (amt > cjonePntPosAmt+ totRtamtval) {
	           			amt = cjonePntPosAmt+ totRtamtval;
	           		}
            	}
            }
            
            var remainder = amt % unitAmt;
            if(remainder != 0) {
                amt -= remainder;
                alert(pntNm+unitAmt+unit+" 단위로\n사용하실 수 있습니다.");
            }

            if(amt > 0 && amt < minAplyAmt) {
                amt = 0;
                alert(pntNm+minAplyAmt+unit+" 이상\n사용하실 수 있습니다.");
            }
            
            if(amt == 0) {
                _input.val("");
            } else {
                _input.val(amt);
            }
            _this.toggleBtn(_input, _btn);
            _this.applyPoint();
            return false;
        };
        
        // 입력폼 input, paste, change 이벤트
        _input.off(_this.events).on(_this.events, function(){
            fnChangeEvent();
        });
        
        // 입력폼 focus in 이벤트
        _input.off("focus").focus(function(){
            fnFocusEvent();
        });
        
        // 입력폼 focus out 이벤트
        _input.off("blur").blur(function(){
            fnBlurEvent();
        });
        
        // 버튼 활성화
        _btn.prop("disabled", false).text("전액사용");
        _btn.removeClass("cancel");
        
        // 버튼 클릭 이벤트
        _btn.off("click").click(function(){
            fnFocusEvent();
            
            // 데이터 스토리 바인딩 20180905 전액사용, 취소의 경우엔 기존click event를 off하는 부분이 있어서 여기서도 호출
            var wlogObjs = [
              {"id":"oyGiftCard_btn",   "wlogId":"oygift_button"},  
              {"id":"cjGiftCard_btn",   "wlogId":"cjgift_button"},  
              {"id":"cjonePnt_btn",     "wlogId":"cjone_button"},  
              {"id":"cafeteriaPnt_btn", "wlogId":"cafe_button"} , 
              {"id":"csmnAplyAmt_btn",  "wlogId":"csmn_button"} 
            ];
            
            for(var i=0; i<wlogObjs.length; i++){
                if(_btn.attr("id") == wlogObjs[i].id){
                    common.wlog(wlogObjs[i].wlogId);
                }
            }
            
            var isAply = true;
            var maxAmt = _this.maxAplyAmt > ownPnt ? ownPnt : _this.maxAplyAmt;
            
            if(_input.val() == "" && maxAmt > 0){
                isAply = true;
                _input.val(maxAmt);
            } else {
                isAply = false;
                _input.val("");
            }
            fnChangeEvent();
            fnBlurEvent();

            // 카드사쿠폰 적용 해제시 재적용
            _this.setMaxAplyAmt(_input);
            maxAmt = _this.maxAplyAmt > ownPnt ? ownPnt : _this.maxAplyAmt;
            
            var unitAmt = Number(_input.attr("unitamt"));
            var minAplyAmt = Number(_input.attr("minaplyamt"));

            var remainder = maxAmt % unitAmt;
            if(remainder != 0) {
                maxAmt -= remainder;
            }
            var amt = Number(_input.val());
            if(isAply && _input.val() != "" && maxAmt > amt) {
                _input.val(maxAmt);
                fnBlurEvent();
            }
            return false;
        });
    },

    // form 오브젝트 조건부 활성화 (최소 사용포인트 미만 보유시)
    conditionalActivateFormObj : function(_input, _btn) {
        var _this = morder.orderForm.point;
        
        var pntNm = _input.attr("this");
        var minOwnAmt = _input.attr("minownamt");
        var unit = _input.attr("unit");
        
        // 입력폼 활성화
        _input.prop("disabled", true);
        
        // 입력폼 click 이벤트
        _input.off("click").click(function(){
            alert(pntNm+minOwnAmt+unit+" 이상 보유시\n사용하실 수 있습니다.");
            return false;
        });
        
        // 버튼 활성화
        _btn.prop("disabled", true);
        
        // 버튼 클릭 이벤트
        _btn.off("click").click(function(){
            _input.trigger("focus");
            return false;
        });
    },
    
    // form 오브젝트 조건부 활성화 (임직원정보가 비정상일때)
    conditionalActivateFormObj2 : function(_input, _btn) {
        var _this = morder.orderForm.point;
            
        // 입력폼 활성화
        _input.prop("disabled", false);
            
        // 입력폼 click 이벤트
        _input.off("focus").focus(function(){
            alert("인사팀 확인이 필요합니다. 올리브영 고객센터로 문의 부탁드립니다.");
            _input.blur();
            return false;
        });
            
        // 버튼 활성화
        _btn.prop("disabled", false);
            
        // 버튼 클릭 이벤트
        _btn.off("click").click(function(){
            _input.trigger("focus");
            return false;
        });
    },
    
    // form 오브젝트 비활성화
    deactivateFormObj : function(_input, _btn) {
        var _this = morder.orderForm.point;
        if(!_btn.hasClass("search")){
            _input.val("").prop("disabled", true).off(_this.events).off("blur");
            _btn.text("전액사용").prop("disabled", true).off("click");
        }
    },
    
    // form 오브젝트 초기화
    initFormObj : function(_input, _btn, ownAmt, aplyAmt) {
        var _this = morder.orderForm.point;
        var minOwnAmt = Number(_input.attr("minownamt"));
        
        // 임직원정보가 비정상인 경우
        if(ownAmt == -9900) {
            _this.conditionalActivateFormObj2(_input, _btn);
        // 휴직자인 경우
        } else if(ownAmt == -9990) {
            _this.deactivateFormObj(_input, _btn);
        } else if(ownAmt > 0) {
            if(ownAmt < minOwnAmt) {
                _this.conditionalActivateFormObj(_input, _btn);
            } else {
                _this.activateFormObj(_input, _btn, ownAmt, aplyAmt);
            }
        } else {
            _this.deactivateFormObj(_input, _btn);
        }
    },
    
    /**
     * 포인트 적용
     */
    applyPoint : function() {
        var _this = morder.orderForm.point;
        var _payAmt = morder.orderForm.payAmt;

        //input값을 사용포인트로 세팅
        _payAmt.setPntAplyAmt();
        _payAmt.initPayAmt();
        
        var totPntAplyAmt = Number(_payAmt.oyGiftCardAplyAmt)
                            + Number(_payAmt.cjGiftCardAplyAmt)
                            + Number(_payAmt.cjonePntAplyAmt) 
                            + Number(_payAmt.cafeteriaPntAplyAmt) 
                            + Number(_payAmt.csmnAplyAmt) 
                            ;

        $("#cjonePnt").text((Number(_this.cjonePnt < 0 ? 0 : _this.cjonePnt) - Number(_payAmt.cjonePntAplyAmt)).toMoney());
        $("#cafeteriaPnt").text((Number(_this.cafeteriaPnt < 0 ? 0 : _this.cafeteriaPnt/1000) - Math.round(_payAmt.cafeteriaPntAplyAmt/1000)).toMoney());
        $("#csmnOwnAmt").text((Number(_this.csmnOwnAmt) - Number(_payAmt.csmnAplyAmt)).toMoney());
        
        if(!$("#cjGiftCard_btn").hasClass("search")){
            $("#cjGiftCardAmt").text((Number(_this.cjGiftCardAmt) - Number(_payAmt.cjGiftCardAplyAmt)).toMoney());
        }
        
        if(!$("#oyGiftCard_btn").hasClass("search")){
            $("#oyGiftCardAmt").text((Number(_this.oyGiftCardAmt) - Number(_payAmt.oyGiftCardAplyAmt)).toMoney());
        }
        
        $("#totPntAplyAmt").text(totPntAplyAmt.toMoney().toNegative());
        
        // 현금영수증 신청 가능 여부 체크
        morder.orderForm.receipt.checkCashReceipt();
    },
    
    getInputAmt : function(_input){
        var amt = 0;
        if(_input.length != 0 && _input.val().isNumber()) {
            amt = Number(_input.val());
        }
        return amt;
    },
    
    /**
     * 사용 가능 최대포인트 세팅
     */
    setMaxAplyAmt : function(_input) {
        var _this = morder.orderForm.point;
        var _payAmt = morder.orderForm.payAmt;
        
        _this.maxAplyAmt = _payAmt.totPayAmt + Number(_input.val());
    },
    
    toggleBtn : function(_input, _btn) {
        var ids = _btn.attr('id');
        if(_input.val() == "") {
            _btn.text("전액사용");
            $("#"+ids).removeClass("cancel");
        } else {
            _btn.text("적용취소");
            $("#"+ids).addClass("cancel");
        }
    },

    // CJ 상품권 포인트 전환 링크
    cjPointConversionLink : function(url) {
//        var url = 'https://m.cjone.com:8443/cjmmobile/point/cjgiftchage.do?mid1=my_gift_chage';
        common.app.callOpenBrowser(url);
    },
    
    /**
     * 기프트카드 셋팅
     */
    initGiftCardPrc : function() {
        var _this = morder.orderForm.point;
        var _payAmt = morder.orderForm.payAmt;
        
        if(!$("#cjGiftCard_btn").hasClass("search")){
            $("#cjGiftCardAmt").text(_this.cjGiftCardAmt > 0 ? _this.cjGiftCardAmt.toMoney() : "0");
            
            // cj 기프트카드 초기화
            _this.initFormObj(
                    $("input[name='cjGiftCardAplyAmt']")
                    , $("#cjGiftCard_btn")
                    , _this.cjGiftCardAmt
                    , _payAmt.cjGiftCardAplyAmt
            );
        }
            
        if(!$("#oyGiftCard_btn").hasClass("search")){
            $("#oyGiftCardAmt").text(_this.oyGiftCardAmt > 0 ? _this.oyGiftCardAmt.toMoney() : "0");
            
            // 올리브영 기프트카드 초기화
            _this.initFormObj(
                    $("input[name='oyGiftCardAplyAmt']")
                    , $("#oyGiftCard_btn")
                    , _this.oyGiftCardAmt
                    , _payAmt.oyGiftCardAplyAmt
            );
        }
                
        
    },
    
    // 기프트카드 정보(물음표) 클릭시,
    showGiftCardInfo : function(target) {
        
        var _super = morder.orderForm;
        var _this = morder.orderForm.point;
        var _payAmt = morder.orderForm.payAmt;
        var giftCardUrl = _secureUrl + "order/getAvailGiftCardInfoJson.do";
        var isCjChangePrice = false;
        var isOyChangePrice = false;
        
        var giftCardFnTwoCallback = function(giftCardInfo){
            
            if(giftCardInfo.returnCd == 'S'){ // 기프트카드 조회 성공
                
                // 기프트카드 금액이 변동됐을때, 변경하기
                if(_this.cjGiftCardAmt != giftCardInfo.cjGiftCardAmt) {
                    _this.cjGiftCardAmt = giftCardInfo.cjGiftCardAmt;
                    isCjChangePrice = true;
                }
                
                if(_this.oyGiftCardAmt != giftCardInfo.oyGiftCardAmt) {
                    _this.oyGiftCardAmt = giftCardInfo.oyGiftCardAmt;
                    isOyChangePrice = true;
                }
                
                // 레이어팝업 값 입력
                if(target.indexOf("CJ") > -1){
                    
                    // cj 기프트카드 input 금액
                    var cjOrgAplyAmt = _super.getNumber($("input[name='cjGiftCardAplyAmt']"));
                    
                    $("#"+target).find("#cjGiftQty").text(giftCardInfo.cjGiftCardQty);
                    $("#"+target).find("#cjGiftAmt").text(_this.cjGiftCardAmt.toMoney());
                    
                    // 버튼이 조회버튼이 아닐 때, 기프트카드 금액이 변경되면, cj기프트카드 초기화
                    var cjButtonTarget = $("#cjGiftCard_btn");
                    
                    if(!cjButtonTarget.hasClass("search") && isCjChangePrice) {
                        $("#cjGiftCardAmt").text(_this.cjGiftCardAmt > 0 ? _this.cjGiftCardAmt.toMoney() : "0");
                        cjButtonTarget.removeClass("cancel");
                        
                        _this.initFormObj(
                                $("input[name='cjGiftCardAplyAmt']")
                                , cjButtonTarget
                                , _this.cjGiftCardAmt
                                , _payAmt.cjGiftCardAplyAmt
                                );
                        
                        // 초기화후, input 금액이 기프트카드 잔액보다 적은경우, 다시 input에 넣어준다.
                        if(cjOrgAplyAmt < Number(_this.cjGiftCardAmt) && cjOrgAplyAmt > 0) {
                            $("input[name='cjGiftCardAplyAmt']").val(cjOrgAplyAmt);
                            _this.toggleBtn($("input[name='cjGiftCardAplyAmt']"), cjButtonTarget);
                        }
                        
                        // 적용포인트 세팅
                        _this.applyPoint();
                    }
                }else{
                    
                    // 올리브영 기프트카드 input 금액
                    var oyOrgAplyAmt = _super.getNumber($("input[name='oyGiftCardAplyAmt']"));
                    
                    $("#"+target).find("#oyGiftQty").text(giftCardInfo.oyGiftCardQty);
                    $("#"+target).find("#oyGiftAmt").text(_this.oyGiftCardAmt.toMoney());
                    
                    // 버튼이 조회버튼이 아닐 때, 기프트카드 금액이 변경되면, 올리브영 기프트카드 초기화
                    var oyButtonTarget = $("#oyGiftCard_btn");
                    
                    if(!oyButtonTarget.hasClass("search") && isOyChangePrice) {
                        $("#oyGiftCardAmt").text(_this.oyGiftCardAmt > 0 ? _this.oyGiftCardAmt.toMoney() : "0");
                        oyButtonTarget.removeClass("cancel");
                        
                        _this.initFormObj(
                                $("input[name='oyGiftCardAplyAmt']")
                                , oyButtonTarget
                                , _this.oyGiftCardAmt
                                , _payAmt.oyGiftCardAplyAmt
                                );
                        
                        // 초기화후, input 금액이 기프트카드 잔액보다 적은경우, 다시 input에 넣어준다.
                        if(oyOrgAplyAmt < Number(_this.oyGiftCardAmt) && oyOrgAplyAmt > 0) {
                            $("input[name='oyGiftCardAplyAmt']").val(oyOrgAplyAmt);
                            _this.toggleBtn($("input[name='oyGiftCardAplyAmt']"), oyButtonTarget);
                        }
                        
                        // 적용포인트 세팅
                        _this.applyPoint();
                    }
                }
            } else{ // 기프트카드 조회 실패
                alert(giftCardInfo.errorMsg);
                
                // 로그인이 필요한 경우
                if(giftCardInfo.isLogin == 'N'){
                    location.href = _secureUrl + "cart/getCart.do";
                }
                
                return false;
            }
            
        };
        
        common.Ajax.sendRequest("POST", giftCardUrl,'', giftCardFnTwoCallback, false);
        
        common.popLayerOpen(target);
    }
 
};


/**
 * 결제금액 Interface
 * 
 */
$.namespace("morder.orderForm.payAmt");
morder.orderForm.payAmt = {
        
    totGoodsAmt             : 0,
    totDlexAmt              : 0,
    imdtDscntAmt            : 0,
    cpnDscntAmt             : 0,
    cjonePntAplyAmt         : 0,
    cafeteriaPntAplyAmt     : 0,
    csmnAplyAmt             : 0,
    cjGiftCardAplyAmt       : 0, //2018.02.12 cj기프트 카드 추가
    oyGiftCardAplyAmt       : 0, //2018.02.12 oy기프트 카드 추가
    giftBoxAmt              : 0, //2019.11.21 선물포장비 추가
    totPayAmt               : 0,
    
    goodsInfoList           : {},
    
    dlexData 				: {},
    
    giftData				: {},
    
    excludeCpnTotDscntAmt   : 0, //선물하기이며 오늘드림 쿠폰할인액 제외 = 총 할인금액 
    presentO2oOrdPayAmt 	: 0, //선물하기이며 오늘드림 총 결제금액에서 쿠폰할인액 제외 = 총 주문금액(쿠폰할인액 제외) - 총 사용포인트
    
    init : function() {
        
        var _this = morder.orderForm.payAmt;

        // 상품정보 세팅
        $("div[goodsno][itemno][staffdscntyn]").each(function(){
            
            var goodsInfo = {};
            
            var goodsNo = $(this).attr("goodsno");
            var itemNo = $(this).attr("itemno");
            var staffDscntYn = $(this).attr("staffdscntyn");
            var key = goodsNo + "\\/" + itemNo;
            var salePrc = $("#orgSalePrc_"+key).val();
            
            goodsInfo.goodsNo = goodsNo;
            goodsInfo.itemNo = itemNo;
            goodsInfo.staffDscntYn = staffDscntYn;
            goodsInfo.salePrc = salePrc;
            goodsInfo.cpnDscntAmt = 0;
            
            _this.goodsInfoList[goodsNo + "_" + itemNo] = goodsInfo;
        });
        
        //총 상품금액 세팅
        _this.totGoodsAmt = Number($("input[name='goodsAmt']").val());
        
        //즉시할인금액 세팅
        _this.imdtDscntAmt = Number($("#imdtDscntAmt").val());
        
        //쿠폰적용
        morder.orderForm.coupon.aplyCoupon();
        
        //배송비 상세 보기 버튼 클릭 이벤트
        $("#dlexAmtPopLayer_btn").click(function(){
            $("#LAYERPOP01-title").text("배송비 상세정보");
            common.popLayerOpen('LAYERPOP01');
        });
        _this.initPayAmt();
    },

    // 배송비조회
    getDlexDtlPopAjax : function() {
        
    	var _this = morder.orderForm.payAmt;
        var cartNoArray = [];
        var rmitPostNo = "";
        //오늘드림 배송구분 (2019-11-15 추가 오늘드림)
        var o2oDlvSp   = $("input[name='o2oDlvSp']:checked").val();
        if(typeof(o2oDlvSp) == "undefined"){
            o2oDlvSp = "1";
        }
        
        // 장바구니번호
        $("input[name='cartNo']").each(function(){
           cartNoArray.push($(this).val()); 
        });
        
        // 우편번호
        $("input[name='rmitPostNo']").each(function(){
            if(!$(this).is(':disabled')){
                rmitPostNo = $(this).val();
            }
        });
        
        var callback_getDlexDtlPopAjax = function(data) {
            
            var _coupon = morder.orderForm.coupon;

            if(!data){
                alert("배송비 조회 중 오류가 발생했습니다.");
                location.href = _secureUrl + "cart/getCart.do";
                return false;
            }
            $("#LAYERPOP01-contents").html(data);
            
            // 배송비 조회후 적용된 배송비쿠폰이 무료면 쿠폰적용해제
            $.each(_coupon.getAplyCouponList("C106"), function(i, index){
                if(!_coupon.checkDlexCoupon(index)){
                    _coupon.setCoupon(index, 'N');
                    _this.getDlexDtlPopAjax();
                    return false;
                }
            });
            
            _this.initDlexAmt();
            _this.initPayAmt();
        }
        
        var cpnCheckCnt = 0;
          
        for(var i = 0 ; i < morder.orderForm.coupon.couponCnt ; i++){
        	if(_this.dlexData["couponList["+i+"].promNo"] != $("[name='couponList["+i+"].promNo']").val()){
        		cpnCheckCnt++;
        	}
        }
        
        //배송비 조회 중복호출 방지 (파라미터가 같은경우 callback_getDlexDtlPopAjax 만 호출)
        if(_this.dlexData.rmitPostNo == rmitPostNo 
        	&& _this.dlexData.cartNo == cartNoArray.toString() 
        	&& _this.dlexData.o2oDlvSp == o2oDlvSp && cpnCheckCnt == 0){
        		callback_getDlexDtlPopAjax($("#LAYERPOP01-contents").html());
        	} else {
        		
        		 //배송비조회 ajax
                var url = _secureUrl + "order/getDlexDtlPopAjax.do";
                _this.dlexData = {
                    rmitPostNo : rmitPostNo,    
                    cartNo : cartNoArray.toString(),
                    o2oDlvSp : o2oDlvSp,
                };
                
                for(var i = 0 ; i < morder.orderForm.coupon.couponCnt ; i++){
                	_this.dlexData["couponList["+i+"].promChk"] = $("[name='couponList["+i+"].promChk']").val();
                	_this.dlexData["couponList["+i+"].goodsNo"] = $("[name='couponList["+i+"].goodsNo']").val();
                	_this.dlexData["couponList["+i+"].itemNo"] = $("[name='couponList["+i+"].itemNo']").val();
                	_this.dlexData["couponList["+i+"].promNo"] = $("[name='couponList["+i+"].promNo']").val();
                    _this.dlexData["couponList["+i+"].promAplySeq"] = $("[name='couponList["+i+"].promAplySeq']").val();
                    _this.dlexData["couponList["+i+"].promKndCd"] = $("[name='couponList["+i+"].promKndCd']").val();
                    _this.dlexData["couponList["+i+"].entrNo"] = $("[name='couponList["+i+"].entrNo']").val();
                    _this.dlexData["couponList["+i+"].immedGoods1DcAmt"] = $("[name='couponList["+i+"].immedGoods1DcAmt']").val();
                    _this.dlexData["couponList["+i+"].immedOrdQty1"] = $("[name='couponList["+i+"].immedOrdQty1']").val();
                    _this.dlexData["couponList["+i+"].dwnldGoods1DcAmt"] = $("[name='couponList["+i+"].dwnldGoods1DcAmt']").val();
                }
        		
                common.Ajax.sendRequest("POST", url, _this.dlexData, callback_getDlexDtlPopAjax, false);
        	}
        
    },
    
    // 배송비 초기화
    initDlexAmt : function() {

        var _this = morder.orderForm.payAmt;
        
        var dlexAmt_hd_base = 0;
        var dlexAmt_hd_whsg = 0;
        var dlexAmt_hd_sumPkg = 0;
        var dlexAmt_entr_base = 0;
        var dlexAmt_entr_whsg = 0;
        var dlexAmt_entr_sumPkg = 0;
        
        var totDlexAmt_hd = 0;
        var totDlexAmt_entr = 0;
        
        var totDlexAmt = 0;
        
        $("#hdDlexList li[type='base'] input[name='dlexAmt']").each(function(i) {
            $("#"+$(this).attr("targetid")).text($(this).val().toMoney());
            dlexAmt_hd_base += Number($(this).val());
        });
        $("#hdDlexList li[type='whsg'] input[name='dlexAmt']").each(function(i) {
            $("#"+$(this).attr("targetid")).text($(this).val().toMoney());
            dlexAmt_hd_whsg += Number($(this).val());
        });
        $("#hdDlexList li[type='sumPkg'] input[name='dlexAmt']").each(function(i) {
            $("#"+$(this).attr("targetid")).text($(this).val().toMoney());
            dlexAmt_hd_sumPkg += Number($(this).val());
        });
        $("#entrDlexList li[type='base'] input[name='dlexAmt']").each(function(i) {
            $("#"+$(this).attr("targetid")).text($(this).val().toMoney());
            dlexAmt_entr_base += Number($(this).val());
        });
        $("#entrDlexList li[type='whsg'] input[name='dlexAmt']").each(function(i) {
            $("#"+$(this).attr("targetid")).text($(this).val().toMoney());
            dlexAmt_entr_whsg += Number($(this).val());
        });
        $("#entrDlexList li[type='sumPkg'] input[name='dlexAmt']").each(function(i) {
            $("#"+$(this).attr("targetid")).text($(this).val().toMoney());
            dlexAmt_entr_sumPkg += Number($(this).val());
        });
        
        totDlexAmt_hd = dlexAmt_hd_base + dlexAmt_hd_whsg + dlexAmt_hd_sumPkg;
        totDlexAmt_entr = dlexAmt_entr_base + dlexAmt_entr_whsg + dlexAmt_entr_sumPkg;
        
        totDlexAmt = totDlexAmt_hd + totDlexAmt_entr;

        $("#totDlexAmt_hd").val(totDlexAmt_hd);
        $("#totDlexAmt_entr").val(totDlexAmt_entr);
        $("#totDlexAmt").val(totDlexAmt);
        
        $("#dlexAmt_hd_base").text(dlexAmt_hd_base.toMoney());
        $("#dlexAmt_hd_whsg").text(dlexAmt_hd_whsg.toMoney());
        $("#dlexAmt_hd_sumPkg").text(dlexAmt_hd_sumPkg.toMoney());
        $("#dlexAmt_entr_base").text(dlexAmt_entr_base.toMoney());
        $("#dlexAmt_entr_whsg").text(dlexAmt_entr_whsg.toMoney());
        $("#dlexAmt_entr_sumPkg").text(dlexAmt_entr_sumPkg.toMoney());
        
        $("#totDlexAmt_hd_span").text(totDlexAmt_hd.toMoney());
        $("#totDlexAmt_entr_span").text(totDlexAmt_entr.toMoney());
        
        $("#totDlexAmt_span").text(totDlexAmt.toMoney());

        //배송비 세팅
        _this.totDlexAmt = Number(totDlexAmt);
    },
    
    addComma : function(num)
    {
    	var regexp = /\B(?=(\d{3})+(?!\d))/g;
    	return num.toString().replace(regexp, ',');
    },


    //결제금액 세팅
    initPayAmt : function(){
        var _this = morder.orderForm.payAmt;
        // 총 할인금액 (즉시할인 + 쿠폰할인)
        var totDscntAmt = Number(_this.imdtDscntAmt) + Number(_this.cpnDscntAmt);
        
        /*
        if(presentYn != null && presentYn == 'Y'){
        	// 선물하기이며 오늘드림 쿠폰 할인액 제외  
            // 총 할인금액 (즉시할인) 
            var excludeCpnTotDscntAmt = Number(_this.imdtDscntAmt);
        }
        */
        //console.log("로그>>>>>>>>쿠폰할인액Origin>>>>>>>>>>"+Number(_this.cpnDscntAmt));
        //console.log("로그>>>>>>>>쿠폰할인액present>>>>>>>>>"+excludeCpnTotDscntAmt);
        
        // 총 사용포인트 (올리브영 기프트카드 + CJ 기프트카드 + CJ ONE 포인트 + 카페테리아 포인트 + 예치금 + 컬쳐캐시 + 북앤라이프)
        var totPntAmt = Number(_this.oyGiftCardAplyAmt)
                        + Number(_this.cjGiftCardAplyAmt)
                        + Number(_this.cjonePntAplyAmt) 
                        + Number(_this.cafeteriaPntAplyAmt) 
                        + Number(_this.csmnAplyAmt)
                        ;
                
        //오늘드림 선물포장비 셋팅
        if((Number(_this.totGoodsAmt) - Number(_this.imdtDscntAmt)- Number(_this.cpnDscntAmt))>=30000) {
	        if($("#giftBoxYn").val() == 'Y'){
	        	// 총 주문금액 (총 상품금액 + 총 배송비  - 총 할인금액) 
	            var ordPayAmt = Number(_this.totGoodsAmt) - Number(totDscntAmt);
	        	if($("#o2oGiftBoxAmtRm").val() <= ordPayAmt){
	        		$("#packingAmt_span").text($("#o2oGiftBoxAmtDc").val());
	        		_this.giftBoxAmt = $("#o2oGiftBoxAmtDc").val();
	        		$("#o2oGiftBoxAmt").val($("#o2oGiftBoxAmtDc").val());
	        	} else {
	        		$("#packingAmt_span").text($("#o2oGiftBoxAmtDf").val());
	        		_this.giftBoxAmt = $("#o2oGiftBoxAmtDf").val();
	        		$("#o2oGiftBoxAmt").val($("#o2oGiftBoxAmtDf").val());
	        	}
	        } else {
	        	$("#packingAmt_span").text("0");
	        	_this.giftBoxAmt = 0;
	        	$("#o2oGiftBoxAmt").val(0);
	        	
	        }
        }else{
        	
        	$("#packingAmt_span").text("0");
        	_this.giftBoxAmt = 0;
        	$("#o2oGiftBoxAmt").val(0);    
        	$("#packingYn").prop("checked",false);
        	$("#sndrQuickYn").prop("checked",false);
        	$("#sndrQuickYn").val("N");
        }
	        
        //선물하기이면서 오늘드림이고 선물포장이 가능할때   (컨트롤러 넘어온게 아니라 사람이 선택해야지만 넘어가게 ) 
        //if(	(presentYn != null && presentYn == 'Y') && $("#presentO2oYn").val() == 'Y' && $("#presentO2oPackingYn").val() == 'Y'	){
        if(	(presentYn != null && presentYn == 'Y') && $("#presentO2oYn").val() == 'Y' 
        	&& $("#packingYn").prop("checked") == true     /*$("input[name='packingYn']").val() == 'Y'*/	){
        	
        	// 총 주문금액 (총 상품금액 + 총 배송비  - 총 할인금액) 
            var ordPayAmt = Number(_this.totGoodsAmt) - Number(totDscntAmt);
        	if($("#o2oGiftBoxAmtRm").val() <= ordPayAmt){
        		
        		$("[name='presentO2oPackingAmt_span']").text(_this.addComma($("#o2oGiftBoxAmtDc").val())+"원");	//포장서비스부분
        		$("[name='presentO2oPackingAmt_span']").show();
        		$("#packingAmt_span").text(_this.addComma($("#o2oGiftBoxAmtDc").val()));	//최종결제금액부분
        		
        		_this.giftBoxAmt = $("#o2oGiftBoxAmtDc").val();
        		$("#presentO2oO2oGiftBoxAmt").val($("#o2oGiftBoxAmtDc").val());
        		
        		/*console.log("o2oGiftBoxAmtRm>>>>>"+$("#o2oGiftBoxAmtRm").val()+"\n"+"ordPayAmt>>>>>"+ordPayAmt+"\n"+
        				"o2oGiftBoxAmtDc>>>>>"+$("#o2oGiftBoxAmtDc").val()+"\n"+"o2oGiftBoxAmtDf>>>>>"+$("#o2oGiftBoxAmtDf").val()+"\n"+
        				"_this.giftBoxAmt>>>>>>>>"+_this.giftBoxAmt);*/
        	} else {
        		$("[name='presentO2oPackingAmt_span']").text(_this.addComma($("#o2oGiftBoxAmtDf").val())+"원");	//포장서비스부분
        		$("[name='presentO2oPackingAmt_span']").show();
        		$("#packingAmt_span").text(_this.addComma($("#o2oGiftBoxAmtDf").val()));	//최종결제금액부분
        		
        		_this.giftBoxAmt = $("#o2oGiftBoxAmtDf").val();
        		$("#presentO2oO2oGiftBoxAmt").val($("#o2oGiftBoxAmtDf").val());
        		
        		/*console.log("o2oGiftBoxAmtRm>>>>>"+$("#o2oGiftBoxAmtRm").val()+"\n"+"ordPayAmt>>>>>"+ordPayAmt+"\n"+
        				"o2oGiftBoxAmtDc>>>>>"+$("#o2oGiftBoxAmtDc").val()+"\n"+"o2oGiftBoxAmtDf>>>>>"+$("#o2oGiftBoxAmtDf").val()+"\n"+
        				"_this.giftBoxAmt>>>>>>>>"+_this.giftBoxAmt);*/
        	}
        	
        } else {
        	$("[name='presentO2oPackingAmt_span']").text("0"); // 초기 init 부분
        	$("[name='presentO2oPackingAmt_span']").hide();
        	$("#packingAmt_span").text("0");
        	
        	_this.giftBoxAmt = 0;
        	$("#presentO2oO2oGiftBoxAmt").val(0);
        }
        
        // 총 주문금액 (총 상품금액 + 총 배송비 + 선물포장비 - 총 할인금액) *** 선물포장비 추가 2019.11.21 ***
        var ordPayAmt = Number(_this.totGoodsAmt) + Number(_this.totDlexAmt) + Number(_this.giftBoxAmt) - Number(totDscntAmt);
        // 총 결제금액 (총 주문금액 - 총 사용포인트)
        _this.totPayAmt = Number(ordPayAmt) - Number(totPntAmt);
        
        if(presentYn != null && presentYn == 'Y'){
        	// 총 주문금액 (총 상품금액 + 총 배송비 + 선물포장비 - 총 할인금액(쿠폰할인액 제외) )
	        //var presentO2oOrdPayAmt = Number(_this.totGoodsAmt) + Number(_this.totDlexAmt) + Number(_this.giftBoxAmt) - Number(excludeCpnTotDscntAmt);
        	var presentO2oOrdPayAmt = ordPayAmt-Number(_this.totDlexAmt);
	        // 총 결제금액 (총 주문금액(쿠폰할인액 제외) - 총 사용포인트)
	        _this.presentO2oOrdPayAmt = Number(presentO2oOrdPayAmt) - Number(totPntAmt);
        }
	    
        //실제 쿠폰 할인이 적용된 일반결제 상품의 총 주문금액 That is Real!!
        //console.log("로그>>>>>>>>총주문금액>>>>>>>>>>"+ordPayAmt);
        //console.log("로그>>>>>>>>총결제액>>>>>>>>>>"+_this.totPayAmt);
        
        //console.log("로그>>>>>>>>총주문금액(쿠폰할인액 제외)>>>>>>>>>"+presentO2oOrdPayAmt);
        //console.log("로그>>>>>>>>총결제액(쿠폰할인액 제외)>>>>>>>>>"+_this.presentO2oOrdPayAmt);
	        
	        
        if(Number(_this.totGoodsAmt) + Number(_this.totDlexAmt) < 0) {
            alert("금액 오류로 주문이 불가능합니다.");
            location.href = _secureUrl + "cart/getCart.do";
            return false;
        }
        
        if(ordPayAmt < 0) {
            morder.orderForm.coupon.resetCoupon();
            alert("적용할 수 없는 쿠폰이 있어 적용된 쿠폰을 초기화 합니다.");
            return false;
        }
        
        if(_this.totPayAmt < 0) {
            
            morder.orderForm.point.initGiftCardPrc();
            morder.orderForm.point.initPoint();
            alert("결제금액이 변경되어 적용된 포인트를 초기화 합니다.");
            return false;
        }

        // 카드사쿠폰과 포인트를 동시 적용하였을 경우 전액결제여부와 쿠폰허들체크
        var cardCouponIndex = $("#cardCouponIndex").val();
        if(!!cardCouponIndex && !!cardCouponIndex.isNumber()) {
            /*
            var minPurAmt = Number($("select[name='couponList["+cardCouponIndex+"].promChk'] option:selected").attr("minpuramt"));
            var rtamtval = Number($("select[name='couponList["+cardCouponIndex+"].promChk'] option:selected").attr("rtamtval"));
            if(_this.totPayAmt == 0 || (totPntAmt > 0 && minPurAmt > _this.totPayAmt + rtamtval)) {
                if(confirm("포인트 및 기타 결제수단 사용시 카드사 쿠폰 할인을 받을 수 없습니다.\n포인트 및 기타 결제수단을 사용하시겠습니까?")) {
                    // 카드사 쿠폰 적용 해제
                    $("select[name='couponList["+cardCouponIndex+"].promChk']").val("N");
                    morder.orderForm.coupon.changeCoupon(cardCouponIndex, $("select[name='couponList["+cardCouponIndex+"].promChk'] option:selected"));
                    
                } else {
                    // 포인트 적용 해제
                    morder.orderForm.point.initPoint();
                }
                return false;
            }*/
            
            // 총 사용포인트 (올리브영 기프트카드 + CJ 기프트카드 + CJ ONE 포인트 + 카페테리아 포인트 + 예치금 + 컬쳐캐시 + 북앤라이프)
            var totCheckPoint =   Number(_this.oyGiftCardAplyAmt)   // 올리브영 기프트카드
                                + Number(_this.cjGiftCardAplyAmt)   //  CJ 기프트카드
                                + Number(_this.cjonePntAplyAmt)     // CJ ONE 포인트
                                + Number(_this.cafeteriaPntAplyAmt) // 카페테리아
                                + Number(_this.csmnAplyAmt);         // 예치금
            
            if(_this.totPayAmt == 0 || totCheckPoint > 0) {
                
                if(confirm("포인트/기프트카드 및 기타 결제수단 사용 시 카드사 쿠폰 할인을 받을 수 없습니다. 포인트 및 기타 결제수단을 사용하시겠습니까?")) {
                    // 카드사 쿠폰 적용 해제
                    $("select[name='couponList["+cardCouponIndex+"].promChk']").val("N");
                    morder.orderForm.coupon.changeCoupon(cardCouponIndex, $("select[name='couponList["+cardCouponIndex+"].promChk'] option:selected"));
                    
                } else {
                    // 포인트 적용 해제
                    morder.orderForm.point.initPoint();
                }
                
                return false;
                
            }
            
        }
        
        // 포인트로 전체금액 결제시
        if(_this.totPayAmt == 0) {
            $("#payMethod").addClass("payDisabled").removeClass("open");
            $("#payMethod_tit_span").hide();
            $("input[name='payMethod']").attr("disabled", true);

            // 현금영수증 신청 가능 여부 체크
            morder.orderForm.receipt.checkCashReceipt();
        } else {
            $("#payMethod").removeClass("payDisabled").addClass("open");
            $("#payMethod_tit_span").show();
            $("input[name='payMethod']").attr("disabled", false);
            morder.orderForm.payMethod.initPayMethod();

            // 총결제금액이 5만원미만일시 할부개월수 일시불만 가능
            if(_this.totPayAmt < 50000) {
                if(Number($("#instMmCnt").val()) > 0) {
                    if($("input[name='payMethod']:enabled").val() == "11"){
                        alert("최종 결제금액이 5만원 미만일 경우 일시불만 선택할 수 있습니다.");
                    }
                    $("#instMmCnt").val("00");
                }
                $("#instMmCnt").prop("disabled", true);
            } else {
                $("#instMmCnt").prop("disabled", false);

                if(!!$("#acqrCd").val()) {
                    //무이자정보 조회
                    morder.orderForm.payMethod.getNintInstListJson($("#acqrCd").val());
                }
            }
        }
        
        // 총 배송비
        $("input[name='dlexPayAmt']").val(_this.totDlexAmt);
        $("#dlexPayAmt_span").text(_this.totDlexAmt.toMoney());
        
        // 총 할인금액
        $("input[name='descentAmt']").val(totDscntAmt);
//        $("#totDscntAmt_span").text(totDscntAmt.toMoney().toNegative());
//        $("#imdtDscntAmt_span").text(_this.imdtDscntAmt.toMoney().toNegative());
//        $("#cpnDscntAmt_span").text(_this.cpnDscntAmt.toMoney().toNegative());
        $("#totDscntAmt_span").text(_this.cpnDscntAmt.toMoney().toNegative());
        
        // 총 사용포인트
        $("#oyGiftCardAplyAmt_span").text(_this.oyGiftCardAplyAmt.toMoney().toNegative());
        $("#cjGiftCardAplyAmt_span").text(_this.cjGiftCardAplyAmt.toMoney().toNegative());
        $("#cjonePntAplyAmt_span").text(_this.cjonePntAplyAmt.toMoney().toNegative());
        $("#cafeteriaPntAplyAmt_span").text(_this.cafeteriaPntAplyAmt.toMoney().toNegative());
        $("#csmnAplyAmt_span").text(_this.csmnAplyAmt.toMoney().toNegative());

        // 결제금액 목록에 갱신
        _this.changePoint($("#cafeteriaPntAplyAmt_li"), _this.cafeteriaPntAplyAmt);
        _this.changePoint($("#csmnAplyAmt_li"), _this.csmnAplyAmt);
        _this.changePoint($("#oyGiftAplyAmt_li"), _this.oyGiftCardAplyAmt);
        _this.changePoint($("#cjGiftAplyAmt_li"), _this.cjGiftCardAplyAmt);

        // 총 주문금액
        $("input[name='ordPayAmt']").val(ordPayAmt);
        
        // 총 결제금액
        $("#totPayAmt_tit_span").text(_this.totPayAmt.toMoney());
        $("#totPayAmt_sum_span").text(_this.totPayAmt.toMoney());
        
        if(presentYn != null && presentYn == 'Y'){
        	//presentO2o init시 0원도 돌기에 처음엔 살려줌 
            $("[name='o2oDeliveryInfo_area']").show();
            
            //선물하기 2차 넘겨줄 총결제액(쿠폰할인액제외) 기입
            //$("#presentO2oOrdPayAmt").val(_this.presentO2oOrdPayAmt);
            $("#presentO2oOrdPayAmt").val(presentO2oOrdPayAmt);
            
            //presentO2o 3만원이 넘지 않으면 닫아버리기   --쿠 폰 할인액 빼기 
            if($("#possibleO2oYn").val()=="Y"){
	            if(presentO2oOrdPayAmt < Number(30000)){
	        		$("[name='o2oDeliveryInfo_area']").hide();
	            	$("#presentO2oYn").val("N");
	            	$("input[name='packingYn']").prop("checked", false);
	            	$("#packingYn").val("N");
	            	
	            }else{
	            	//console.log("오늘드림 선택 노출 수");
	            	common.wlog("o2o_present_ord_viewcnt");
	        		$("[name='o2oDeliveryInfo_area']").show();
	            	$("#presentO2oYn").val("Y");
	            }
            }
	            
            //morder.orderForm.presentO2oGiftBoxYn();
            
        	/*
            console.log(">>>>>>presentYn>>>>"+presentYn
        			+">>>>>presentO2oYn>>>>>"+$("#presentO2oYn").val()
        			+">>>>>>presentO2oPackingYn>>>>"+$("#presentO2oPackingYn").val()
        			+">>>>>>sndrQuickYn>>>>"+$("input[name='sndrQuickYn']").val()
        			+">>>>>>sndrQuickYn>>>>"+$("input[name='packingYn']").val()
        	);            
       		*/
        }
        
        // 임직원카드 결제예상금액
        var staffAmt = _this.totPayAmt;
        // 임직원할인율
        var staffDscntRt = Number($("#staffDscntRt").val());
        // 임직원 할인금액 (월 총액)
        var staffDscntLmtAmt = Number($("#staffDscntLmtAmt").val());
        if(!!staffDscntRt
                && staffDscntRt > 0
                && staffDscntRt < 100) {
            
            // 임직원할인가능금액
            var staffDscntPsbAmt = 0;
            // 임직원할인불가능금액
            var staffDscntImpsbAmt = 0;
            $.each(_this.goodsInfoList, function(key, goodsInfo){
                if(goodsInfo.staffDscntYn == "Y") {
                    staffDscntPsbAmt += goodsInfo.salePrc - goodsInfo.cpnDscntAmt;
                } else {
                    staffDscntImpsbAmt += goodsInfo.salePrc - goodsInfo.cpnDscntAmt;
                }
            });
            
            // 포인트 적용 우선 순위
            // 1. 배송비
            // 2. 임직원할인불가능금액
            // 3. 임직원할인가능금액
            var remainPntAmt = totPntAmt - _this.totDlexAmt
            
            if(remainPntAmt > 0) {
                if(staffDscntImpsbAmt > 0) {
                    var usePntAmt = staffDscntImpsbAmt > remainPntAmt ? remainPntAmt : staffDscntImpsbAmt;
                    staffDscntImpsbAmt -= usePntAmt;
                    remainPntAmt -= usePntAmt;
                }
                
                if(remainPntAmt > 0 && staffDscntPsbAmt > 0) {
                    staffDscntPsbAmt -= remainPntAmt;
                }
            }
            if(staffDscntPsbAmt > staffDscntLmtAmt){                
                staffAmt -= Math.ceil( (staffDscntLmtAmt * staffDscntRt/100) + ((staffDscntPsbAmt - staffDscntLmtAmt) * 0.1)  );      
            }else{
                staffAmt -= Math.ceil((staffDscntPsbAmt)*staffDscntRt/100);
            }
        }
        
        $("#totPayAmt_staff_span").text(staffAmt.toMoney());
        $("#totPayAmt_btn_span").text(_this.totPayAmt.toMoney());
        $("input[name='remainAmt']").val(_this.totPayAmt);
        
        // 청구할인 금액
        morder.orderForm.payMethod.setCardDscnt();
        // 카드사포인트
        morder.orderForm.payMethod.setCardcoPnt();
    },
    
    // 쿠폰할인금액 세팅
    setCpnDscntAmt : function() {
        var _coupon = morder.orderForm.coupon;
        var _this = morder.orderForm.payAmt;
        
        var totCpnDscntAmt = 0;
        
        $("input[name='cpnDscntAmt']").each(function(i){
            totCpnDscntAmt += Number($(this).val());
        });
        
        _this.cpnDscntAmt = Number(totCpnDscntAmt);
        _this.initPayAmt();
    },
    
    // 사용포인트 세팅
    setPntAplyAmt : function() {
        var _point = morder.orderForm.point;
        var _this = morder.orderForm.payAmt;
        
        _this.cjonePntAplyAmt = _point.getInputAmt($("input[name='cjonePntAplyAmt']"));
        _this.cafeteriaPntAplyAmt = _point.getInputAmt($("input[name='cafeteriaPntAplyAmt']"));
        _this.csmnAplyAmt = _point.getInputAmt($("input[name='csmnAplyAmt']"));
        _this.cjGiftCardAplyAmt = _point.getInputAmt($("input[name='cjGiftCardAplyAmt']"));
        _this.oyGiftCardAplyAmt = _point.getInputAmt($("input[name='oyGiftCardAplyAmt']"));
    },
    
    // 사용포인트가 있으면 show
    changePoint : function(_li, amt) {
        if(amt > 0) {
            _li.show();
        } else {
            _li.hide();
        }
    },
    
    valid : function() {
        var _super = morder.orderForm;
        
        return new _super.validObj();
    }
};
        
/**
 * 결제수단 Interface
 * 
 * 초기화 : 
 *      morder.orderForm.payMethod.init()
 * 
 * 파라메터 생성 및 Validation : 
 *      morder.orderForm.payMethod.makeParameter()
 * 
 */
$.namespace("morder.orderForm.payMethod");
morder.orderForm.payMethod = {

    giftType_cultureLand : "CultureLand",
    giftType_bookAndLife : "BookAndLife",
    payMeathodCnt : 0,
    events : 'input paste change',
    
    init : function() {
        var _super = morder.orderForm;
        var _this = morder.orderForm.payMethod;
        
        // 결제수단 변경 event
        $("#payMethodList li[paymeancd]").click(function(){
            
            var payMeanCd = $(this).attr("paymeancd");
            
            if(payMeanCd != $("input[name='payMethod']").val()) {
                _this.changePayMethod(payMeanCd, true);
            }
        });

        // CJ PG 가상계좌 코드 변경
        var setCjBnkCd = function(){
            $("select[name='bnkCd']").val($("select[name='cjBnkCd'] option:selected").attr("targetid"));
        }
        
        // CJ PG 가상계좌 코드 초기화
        setCjBnkCd();
        
        // 가상계좌 은행 변경시 CJPG가상계좌코드 변경
        $("select[name='cjBnkCd']").change(function(){
            var payMeanCd = $("input[name='payMethod']").val();
            var cjBnkCd = $(this).val();
            
            setTimeout(function(){
                setCjBnkCd();
            }, 200);
            
            setTimeout(function(){
                var msg = _this.getPayMethodMgmtJson(payMeanCd, cjBnkCd);
                if(!!msg) {
                    alert(msg);
                    _this.payMeathodCnt = 0;
                }
            }, 400);
        });

//      maxLength로 대체
//        $("#NameDepositor").on("input paste change", function(){
//            morder.orderForm.checkMaxSize($(this), 10);
//        });
        
        // 카드목록 select change event
        $("[name='acqrCd']").change(function(){
            setTimeout(function(){
                _this.changeCard(true);
            }, 200);
        });

        //저장된 결제수단 세팅
        var setPayMethod = function() {
            var payMeanCd = $("#savePayMethodYn").attr("paymeancd");
            if(!!payMeanCd){
                _this.changePayMethod(payMeanCd, false);
                if(payMeanCd == '11') {
                    //신용카드
                    var acqrCd = $("#savePayMethodYn").attr("acqrcd");
                    var instMmCnt = $("#savePayMethodYn").attr("instmmcnt");
                    var pntUseYn = $("#savePayMethodYn").attr("pntuseyn");
                    if(!!acqrCd) {
                        $("[name='acqrCd']").val(acqrCd);
                        _this.changeCard(false);
                    }
                    if(!!instMmCnt){
                        $("#instMmCnt").val(instMmCnt);
                    }
                    if(!!pntUseYn && pntUseYn=='Y') {
                        $("#pntUseYn").prop("checked", true);
                    }
                } else if(payMeanCd == '21') {
                    //계좌이체
                } else if(payMeanCd == '61') {
                    //무통장입금
                    var bnkCd = $("#savePayMethodYn").attr("bnkcd");
                    var morcManNm = $("#savePayMethodYn").attr("morcmannm");
                    if(!!bnkCd){
                        $("#VirDepositBank").val(bnkCd);
                        setTimeout(function(){
                            $("select[name='bnkCd']").val($("select[name='cjBnkCd'] option:selected").attr("targetid"));
                        }, 200);
//                        $("#VirDepositBank").trigger("change");
                    }
                    if(!!morcManNm) {
                        $("#NameDepositor").val(morcManNm);
                    }
                } else if(payMeanCd == '22') {
                    //휴대폰결제
                } else if(payMeanCd == '23') {
                    //문화상품권
                } else if(payMeanCd == '24') {
                    //도서상품권
                } else if(payMeanCd == '25') {
                    //PAYCO
                }
            }
        };
        
        //카드사쿠폰을 적용하지 않으면 선택한 결제수단 기본 세팅
        if(!$("#cardCouponIndex").val() || !$("#cardCouponIndex").val().isNumber()) {
            setPayMethod();
        }

        // 상품권 잔액조회
        var inquireCash = function(type, loginId, loginPw) {
            // 조회해온 잔액을 세팅
            var setCash = function(returnType, ownCash){
                if(returnType == _this.giftType_cultureLand) {
                    $("#cultureLandLoginId").val("");
                    $("#cultureLandLoginPw").val("");
                    $("#cultureLandOwnCash").val(ownCash);
                    $("#cultureLandOwnCash_span").text(ownCash.toMoney());
                    $("#cultureLandBeforeLogin").hide();
                    $("#cultureLandAfterLogin").show();
                    common.popLayerClose('cultureLandLoginPop');
                } else if(returnType == _this.giftType_bookAndLife) {
                    $("#bookAndLifeLoginId").val("");
                    $("#bookAndLifeLoginPw").val("");
                    $("#bookAndLifeOwnCash").val(ownCash);
                    $("#bookAndLifeOwnCash_span").text(ownCash.toMoney());
                    $("#bookAndLifeBeforeLogin").hide();
                    $("#bookAndLifeAfterLogin").show();
                    common.popLayerClose('bookAndLifeLoginPop');
                } else {
                    
                }
            };
            var ownCash = 0;
            var url = _secureUrl + "order/getAvailGiftPointInfoJson.do";
            var data = {
                    giftType    : type
                  , id          : loginId
                  , pw          : loginPw
            };
            var callback_inquireCash = function(jsonObj){
                if(jsonObj.result == "S"
                    && jsonObj.type == type
                    && jsonObj.cash >= 0
                    ) {
                    setCash(type, Number(jsonObj.cash));
                } else {
                    if(jsonObj.code == "0011" // 컬쳐랜드
                        || jsonObj.code == "5001" // 북앤라이프 ID 오류
                        || jsonObj.code == "5002" // 북앤라이프 PW 오류
                        ) {
                        alert("입력하신 로그인정보가 일치하지 않습니다.\n다시 한번 확인해주세요.");
                    } else {
                        alert(jsonObj.message);
                    }
                    return false;
                }
            };
            common.Ajax.sendJSONRequest("POST", url, data, callback_inquireCash, false);
        };
        
        var validLogin = function(_id, _pw) {
            var validId = _super.validEmpty(_id);
            var validPw = _super.validEmpty(_pw);
            
            if(validId.isValid) {
                if(validPw.isValid) {
                    return true;
                } else {
                    alert(validPw.validMsg);
                    validPw.element.focus();
                    return false;
                }
            } else {
                alert(validId.validMsg);
                validId.element.focus();
                return false;
            }
        }

        // 컬처랜드 조회 버튼
        $("#cultureLandLoginPop_btn").click(function(){
            common.popLayerOpen("cultureLandLoginPop");
        });

        //컬처랜드 로그인 버튼
        $("#cultureLandLogin_btn").click(function() {
            if(validLogin($("#cultureLandLoginId"), $("#cultureLandLoginPw"))) {
                inquireCash(_this.giftType_cultureLand, $("#cultureLandLoginId").val(), $("#cultureLandLoginPw").val());
            }
        });
        
        //컬처랜드 다시조회 버튼
        $("#cultureLandInquire_btn").click(function() {
            inquireCash(_this.giftType_cultureLand, null, null);
        });

        // 북앤라이프 조회 버튼
        $("#bookAndLifeLoginPop_btn").click(function(){
            common.popLayerOpen("bookAndLifeLoginPop");
        });
        
        // 북앤라이프 로그인 버튼
        $("#bookAndLifeLogin_btn").click(function() {
            if(validLogin($("#bookAndLifeLoginId"), $("#bookAndLifeLoginPw"))) {
                inquireCash(_this.giftType_bookAndLife, $("#bookAndLifeLoginId").val(), $("#bookAndLifeLoginPw").val());
            }
        });
        
        //북앤라이프 다시조회 버튼
        $("#bookAndLifeInquire_btn").click(function() {
            inquireCash(_this.giftType_bookAndLife, null, null);
        });
        
        // 컬처랜드 로그인 레이어에서 엔터누르면 로그인 처리
        $("#cultureLandLoginId, #cultureLandLoginPw").on("keyup", function(e){
            if(e.keyCode == 13) {
                if(validLogin($("#cultureLandLoginId"), $("#cultureLandLoginPw"))) {
                    inquireCash(_this.giftType_cultureLand, $("#cultureLandLoginId").val(), $("#cultureLandLoginPw").val());
                }
            }
        });
        
        // 북앤라이프 로그인 레이어에서 엔터누르면 로그인 처리
        $("#bookAndLifeLoginId, #bookAndLifeLoginPw").on("keyup", function(e){
            if(e.keyCode == 13) {
                if(validLogin($("#bookAndLifeLoginId"), $("#bookAndLifeLoginPw"))) {
                    inquireCash(_this.giftType_bookAndLife, $("#bookAndLifeLoginId").val(), $("#bookAndLifeLoginPw").val());
                }
            }
        });
        
        // 임직원 한도조회
        if($("#btnCjDscntLmt").length > 0) {
            
            // CJ 임직원 할인 잔여한도 조회 버튼 클릭
            $("#staffDscntLmtPopup_btn").click(function(){
                common.popLayerOpen("staffDscntLmtPopup");                              
            });

            // 카드번호, 유효기간 숫자만 입력
            $("#staffCardNo1, #staffCardNo2, #staffCardNo3, #staffCardNo4, #cardAvalTermYm1, #cardAvalTermYm2").on(_this.events, function(){
                var nextId = $(this).attr("next");
                var maxlength = $(this).attr("maxlength");
                _super.checkNumber($(this)); 
                _super.checkMaxSize($(this), maxlength);
                if(!!nextId && $(this).val().length == maxlength) {
                    $("#"+nextId).focus().select();
                }
            });
            
            // 임직원 한도조회 레이어에서 엔터누르면 조회 처리
            $("#staffCardNo1, #staffCardNo2, #staffCardNo3, #staffCardNo4, #cardAvalTermYm1, #cardAvalTermYm2").on("keyup", function(e){
                if(e.keyCode == 13) {
                    _this.getCjDscntLmtJson();
                }
            });
            
            $("#btnCjDscntLmt").click(function(){
                _this.getCjDscntLmtJson();
            });
        }

        setTimeout(function() {
            //웹로그 바인딩
            _this.bindWebLog();
        },700);
    },
    
    // 카드사쿠폰 적용시 결제수단 변경할 경우 - true : 변경 / false : 변경안함
    checkCardCoupon : function(){
        var _this = morder.orderForm.payMethod;
        if(!!$("#cardCouponIndex").val()
                && !$("#cardCouponIndex").attr("orgacqrcd")
                && ($("input[name='payMethod']").val() != "11"
                    || $("[name='acqrCd']").val() != $("#cardCouponIndex").attr("acqrcd"))
        ) {
            if(confirm("결제수단 변경시 카드사 쿠폰 할인을 받을수 없습니다.\n결제수단을 변경하시겠습니까?")){
                $("select[name='couponList["+$("#cardCouponIndex").val()+"].promChk']").val("N");
                $("select[name='couponList["+$("#cardCouponIndex").val()+"].promChk']").trigger("change");
                return true;
            } else {
                $("input[name='payMethod']").val("11");
                $("[name='acqrCd']").val($("#cardCouponIndex").attr("acqrcd"));
                return false;
            }
        } else {
            $("#cardCouponIndex").attr("orgacqrcd", "");
            return true;
        }
    },

    // 결제수단 변경 event
    changePayMethod : function(payMeanCd, checkPaymethodMgmt) {
        var _this = morder.orderForm.payMethod;
        
        $("input[name='payMethod']").val(payMeanCd);
        if(_this.checkCardCoupon()) {
            $("#payMethodList li").removeClass('on').siblings("[paymeancd='"+payMeanCd+"']").addClass('on');
            $("#payMethod_div div[paymeancd]").removeClass('on').siblings("[paymeancd='"+payMeanCd+"']").addClass('on');
            _this.initPayMethod();
            //결제금액 재세팅
            morder.orderForm.payAmt.initPayAmt();
            // 현금영수증 신청 가능 여부 체크
            morder.orderForm.receipt.checkCashReceipt();
            
            if(checkPaymethodMgmt) {
                setTimeout(function(){
                    var msg = _this.getPayMethodMgmtJson(payMeanCd, null);
                    if(!!msg) {
                        alert(msg);
                        _this.payMeathodCnt = 0;
                    }
                }, 200);
            }
        }
    },

    // 카드 변경 event
    changeCard : function(checkPaymethodMgmt) {
        var _this = morder.orderForm.payMethod;
        if(_this.checkCardCoupon()){
            _this.setCardDscnt();
            _this.setCardcoPnt();
//            showCartDscnt($(this).val());
            //무이자정보 조회
            _this.getNintInstListJson($("#acqrCd").val());

            if(checkPaymethodMgmt) {
                setTimeout(function(){
                    var msg = _this.getPayMethodMgmtJson($("input[name='payMethod']").val(), $("#acqrCd").val());
                    if(!!msg) {
                        alert(msg);
                        _this.payMeathodCnt = 0;
                    }
                }, 200);
            }
        }
    },
    
    // 결제수단 선택 초기화
    initPayMethod : function(){
        var payMethod = $("input[name='payMethod']").val();
        $("#payMethod_div div[paymeancd]").find("input, select").attr("disabled", true);
        $("#payMethod_div div[paymeancd='"+payMethod+"']").find("input, select").attr("disabled", false);
        $("#payMethod_tit_span").text($("#payMethodList li[paymeancd='"+payMethod+"']").text());
    },
    
    /**
     * validation 처리를 함.
     * 
     * @return 오류 메시지 / 정상일때 빈 문자열("")
     */
    valid : function() {
        var _super = morder.orderForm;
        var _this = _super.payMethod;
        var validObj = new _super.validObj();
        
        var totPayAmt = morder.orderForm.payAmt.totPayAmt;
        if(totPayAmt != 0){
            // validation
            var validMsgArray = [];
            
            var payMeanCd = $("input[name='payMethod']").val();
            if(!payMeanCd){
                validObj.isValid = false;
                validObj.validMsg = "결제 수단을 선택하세요.";
                validObj.element = $("#payMethod");
            } else {
                // 최소결제금액
                var minPayAmt = 0;

                // 하위 결제수단 - 카드사, 은행
                var subPayMethod = null;
                
                // 신용카드
                if(payMeanCd == "11") {
                    minPayAmt = 1000;
                    if(totPayAmt < minPayAmt) {
                        validObj.isValid = false;
                        validObj.validMsg = "신용카드는 " + minPayAmt + "원 이상 결제 가능합니다.";
                        validObj.element = $("#payMethod");
                        validMsgArray.push(validObj);
                    }
                    validMsgArray.push(_super.validEmpty($("[name='acqrCd']")));
                    subPayMethod = $("[name='acqrCd']").val();
                    
                // 실시간 계좌이체
                } else if(payMeanCd == "21") {
                    minPayAmt = 200;
                    if(totPayAmt < minPayAmt) {
                        validObj.isValid = false;
                        validObj.validMsg = "계좌이체는 " + minPayAmt + "원 이상 결제 가능합니다.";
                        validObj.element = $("#payMethod");
                        validMsgArray.push(validObj);
                    }
                // 무통장입금
                } else if(payMeanCd == "61") {
                    validMsgArray.push(_super.validEmpty($("#VirDepositBank")));
                    validMsgArray.push(_super.validEmpty($("#NameDepositor")));
                    subPayMethod = $("#VirDepositBank").val();
                // 휴대폰결제
                } else if(payMeanCd == "22") {
                    minPayAmt = 1000;
                    if(totPayAmt < minPayAmt) {
                        validObj.isValid = false;
                        validObj.validMsg = "휴대폰결제는 " + minPayAmt + "원 이상 결제 가능합니다.";
                        validObj.element = $("#payMethod");
                        validMsgArray.push(validObj);
                    }
                // 문화상품권
                } else if(payMeanCd == "23") {
                    var cultureLandOwnCash = $("#cultureLandOwnCash").val();
                    if(!cultureLandOwnCash || !cultureLandOwnCash.isNumber()) {
                        validObj.isValid = false;
                        validObj.validMsg = "컬쳐캐쉬 내역 조회 후 결제를 하실 수 있습니다.";
                        validObj.element = $("#cultureLandLoginPop_btn");
                    } else if(cultureLandOwnCash < totPayAmt) {
                        validObj.isValid = false;
                        validObj.validMsg = "컬쳐캐쉬 잔액이 부족하여 결제를 하실 수 없습니다.\n다른 결제수단을 선택해주세요.";
                        validObj.element = $("#payMethod");
                    }
                    
                // 도서상품권
                } else if(payMeanCd == "24") {
                    var bookAndLifeOwnCash = $("#bookAndLifeOwnCash").val();
                    if(!bookAndLifeOwnCash || !bookAndLifeOwnCash.isNumber()) {
                        validObj.isValid = false;
                        validObj.validMsg = "북앤라이프 캐쉬 내역 조회 후 결제를 하실 수 있습니다.";
                        validObj.element = $("#bookAndLifeLoginPop_btn");
                    } else if(bookAndLifeOwnCash < totPayAmt) {
                        validObj.isValid = false;
                        validObj.validMsg = "북앤라이프 캐쉬 잔액이 부족하여 결제를 하실 수 없습니다.\n다른 결제수단을 선택해주세요.";
                        validObj.element = $("#payMethod");
                    }
                // PAYCO
                } else if(payMeanCd == "25") {
                    
                 // 카카오페이    
                } else if(payMeanCd == "26") {
                    minPayAmt = 100;
                    if(totPayAmt < minPayAmt) {
                        validObj.isValid = false;
                        validObj.validMsg = "카카오페이는 " + minPayAmt + "원 이상 결제 가능합니다.";
                        validObj.element = $("#payMethod_"+payMeanCd);
                        validMsgArray.push(validObj);
                    }
                }

                // 결제수단 안내문구 조회
                // 결제하기 버튼 2회이상 눌렀을 때 조회하지 않음
                if(_this.payMeathodCnt < 2) {
                    var msg = _this.getPayMethodMgmtJson(payMeanCd, subPayMethod);
                    if(!!msg) {
                        _this.payMeathodCnt += 1;
                        validObj.isValid = false;
                        validObj.validMsg = msg;
                        validObj.element = $("#payMethodList");
                        return validObj;
                    }
                }
                
                for (var i = 0 ; i < validMsgArray.length ; i++) {
                    if(validMsgArray[i].validMsg != "") {
                        return validMsgArray[i];
                    }
                }
            }
        }
        return validObj;
    },
    
    // 청구할인 세팅
    setCardDscnt : function() {
        var _payAmt = morder.orderForm.payAmt;
        // 청구할인 금액
        $("#cardDscnt_N_li").hide();
        $("#cardDscnt_Y1_li, #cardDscnt_Y2_li").hide();
        
        $("#tblCreditcard").find("div.txtus").each(function(){
            $(this).hide();
            if($(this).attr("acqrCd") != undefined) {
                var acqrCd = $(this).attr("acqrcd");
                var rtAmtVal = $(this).attr("rtamtval");
                var tgtAmt = $(this).attr("tgtamt");
                var aplyRtAmtSctCd = $(this).attr("aplyrtamtsctcd");
                var maxDscntAmt = $(this).attr("maxdscntamt");
                
                var cardDscntAmt = _payAmt.totPayAmt;
                
                // 총결제금액이 청구할인 조건금액보다 많은경우
                if(_payAmt.totPayAmt >= tgtAmt) {
                    if(aplyRtAmtSctCd == '10') {
                        cardDscntAmt = _payAmt.totPayAmt - rtAmtVal;
                    } else if(aplyRtAmtSctCd == '20') {
                        var dscntAmt = Math.floor(_payAmt.totPayAmt*rtAmtVal/100);
                        cardDscntAmt = _payAmt.totPayAmt - (dscntAmt > maxDscntAmt ? maxDscntAmt : dscntAmt);
                    }
                    $(this).find("#cardDscntAmt_"+acqrCd+"_div").show();
                    $(this).find("#cardDscntAmt_"+acqrCd+"_div").attr("showyn", "Y");
                    
                    // 총결제금액이 청구할인 조건금액보다 적은경우
                } else {
                    $(this).find("#cardDscntAmt_"+acqrCd+"_div").hide();
                    $(this).find("#cardDscntAmt_"+acqrCd+"_div").attr("showyn", "N");
                }
                $(this).find("#cardDscntAmt_"+acqrCd+"_span").text(cardDscntAmt.toMoney());

                if($("[name='acqrCd']").val() == acqrCd) {
                    $(this).show();
                    if($(this).find("#cardDscntAmt_"+acqrCd+"_div").attr("showyn") == "Y"){
                        $("#cardDscnt_N_li").hide();
                        $("#cardDscnt_Y1_li, #cardDscnt_Y2_li").show();
                    } else {
                        $("#cardDscnt_N_li").show();
                        $("#cardDscnt_Y1_li, #cardDscnt_Y2_li").hide();
                    }
                }
            }
        });
    },

    // 카드사 포인트 세팅
    setCardcoPnt : function() {
        var _payAmt = morder.orderForm.payAmt;
        // 포인트 사용 체크박스 초기화
        $("#pntUseYn_li").hide();
        $("#pntUseYn").prop("checked", false);
        // 안내메시지 레이어 초기화
        $("#pntInfoMsgLayer").html("");
        
        $("#tblCreditcard").find("div.mh_point").each(function() {
            // 요약메시지 초기화
            $(this).hide();
            if($(this).attr("acqrcd") == $("#acqrCd").val()
                    && ($(this).attr("staffyn") != "Y" 
                        || $(this).attr("salepointflg") != "S")
                        ) {
                // 요약메시지 노출
                $(this).show();
                
                // 총결제금액이 카드사포인트 조건금액보다 많은경우
                // 임직원이 아니거나 임직원일때 카드포인트 사용가능한 경우
                if($(this).attr("pntusestdamt") <= _payAmt.totPayAmt) {
                    // 카드사포인트명 세팅
                    $("#cardcoPntNm").text($(this).attr("pntnm") + " 사용");
                    // 안내메시지 레이어 세팅
                    if($("#pntInfoMsg").html() != "") {
                        $("#pntInfoMsgLayerTitle").text($(this).attr("pntnm") + " 사용안내");
                        $("#pntInfoMsgLayer").html($("#"+$(this).attr("acqrcd")+"_pntInfoMsg").html());
                    }
                    // 포인트 사용 체크박스 노출
                    $("#pntUseYn_li").show();
                }
            }
        });
    },
    
    // 무이자정보 조회
    getNintInstListJson : function(acqrCd) {
        var _this = morder.orderForm.payMethod;

        // 무이자정보 세팅
        var setNintInst = function(nintInstInfo) {
            if(!nintInstInfo) {
                $("#instMmCnt option[targetid]").each(function(){
                    var text = Number($(this).val()) + "개월";
                    $(this).text(text);
                });
            } else {
                $("#instMmCnt option[targetid]").each(function(){
                    var text = Number($(this).val()) + "개월";
                    var nintMmYn = eval("nintInstInfo."+$(this).attr("targetid"));
                    if(nintMmYn == 'Y') {
                        text = text + " [무이자]";
                    }
                    $(this).text(text);
                });
            }
        };
        
        if(!!acqrCd) {
            var url = _secureUrl + "order/getNintInstListJson.do";
            var data = {
                    acqrCd : acqrCd
                  , tgtAmt : morder.orderForm.payAmt.totPayAmt
            };
            var callback_getNintInstListJson = function(jsonObj){
                if(jsonObj.result){
                    setNintInst(jsonObj.nintInstInfo);
                } else {
                    setNintInst(null);
                }
            };
            common.Ajax.sendJSONRequest("POST", url, data, callback_getNintInstListJson, false);
        } else {
            setNintInst(null);
        }
    },

    //  웹로그 바인딩
    bindWebLog : function(){
        // 선택한 결제 수단 저장하기
        $("#savePayMethodYn").bind("change", function(){
            if($(this).is(":checked")) {
                common.wlog("order_way");
            }
        });
    },

    // 결제수단 안내문구 조회
    getPayMethodMgmtJson : function(payMeanCd, subPayMeanCd) {
        var _this = morder.orderForm.payMethod;

        var payMeathodMsg = "";
        
        if(!!payMeanCd) {
            var url = _secureUrl + "order/getPayMethodMgmtJson.do";
            var data = {
                    payMeanCd   : payMeanCd
                  , cd          : subPayMeanCd
            };
            var callback_getPayMethodMgmtJson = function(data){
                if(data.result == "S") {
                    payMeathodMsg = data.message;
                }
            };
            common.Ajax.sendJSONRequest("POST", url, data, callback_getPayMethodMgmtJson, false);
        }
        return payMeathodMsg;
    },
    
    // CJ 할인 한도 조회
    getCjDscntLmtJson : function() {
        var _super = morder.orderForm;
        
        var _acqrCd = $("#staffAcqrCd");
        var _cardNo1 = $("#staffCardNo1");
        var _cardNo2 = $("#staffCardNo2");
        var _cardNo3 = $("#staffCardNo3");
        var _cardNo4 = $("#staffCardNo4");
        var _cardAvalTermYm1 = $("#cardAvalTermYm1");
        var _cardAvalTermYm2 = $("#cardAvalTermYm2");
        
        var validMsgArray = [];

        validMsgArray.push(_super.validEmpty(_acqrCd));
        validMsgArray.push(_super.validEmpty(_cardNo1));
        validMsgArray.push(_super.validNumber(_cardNo1));
        validMsgArray.push(_super.validLength(_cardNo1, 4, 4));
        validMsgArray.push(_super.validEmpty(_cardNo2));
        validMsgArray.push(_super.validNumber(_cardNo2));
        validMsgArray.push(_super.validLength(_cardNo2, 4, 4));
        validMsgArray.push(_super.validEmpty(_cardNo3));
        validMsgArray.push(_super.validNumber(_cardNo3));
        validMsgArray.push(_super.validLength(_cardNo3, 4, 4));
        validMsgArray.push(_super.validEmpty(_cardNo4));
        validMsgArray.push(_super.validNumber(_cardNo4));
        validMsgArray.push(_super.validLength(_cardNo4, 4, 4));
        validMsgArray.push(_super.validEmpty(_cardAvalTermYm1));
        validMsgArray.push(_super.validNumber(_cardAvalTermYm1));
        validMsgArray.push(_super.validLength(_cardAvalTermYm1, 2, 2));
        if(!!_cardAvalTermYm1.val() 
                && (parseInt(_cardAvalTermYm1.val()) < 1 || parseInt(_cardAvalTermYm1.val()) > 12)
                ) {
            var validObj = new _super.validObj();
            validObj.isValid = false;
            validObj.validMsg = "카드 유효기간은 12월까지만 입력가능합니다.";
            validObj.element = _cardAvalTermYm1;
            
            validMsgArray.push(validObj);
        }
        validMsgArray.push(_super.validEmpty(_cardAvalTermYm2));
        validMsgArray.push(_super.validNumber(_cardAvalTermYm2));
        validMsgArray.push(_super.validLength(_cardAvalTermYm2, 2, 2));

        for (var i = 0 ; i < validMsgArray.length ; i++) {
            if(!validMsgArray[i].isValid) {
                alert(validMsgArray[i].validMsg);
                validMsgArray[i].element.focus();
                return false;
            }
        }

        var url = _secureUrl + "order/getCjDscntLmtJson.do";
        var data = {
                acqrCd          : _acqrCd.val()
              , cardNo          : _cardNo1.val()+_cardNo2.val()+_cardNo3.val()+_cardNo4.val()
              , cardAvalTermYm  : _cardAvalTermYm2.val()+_cardAvalTermYm1.val()
        };
        var callback_getCjDscntLmtJson = function(data){
            var maxLimitAmt = $("#staffDscntLmtAmt").val();
            if(data.result == "S") {
                $("#remainLimitAmt").val((data.data).toMoney());                
                
                // 현대카드 최대한도 변경 (50만원 → 20만원으로 변경) - 2019.11.01 기준
                if($("#staffAcqrCd").val() == "DIN"){
                   $("#useLimitAmt").val((200000 - parseInt(data.data)).toMoney());                   
                }else{
                   $("#useLimitAmt").val((maxLimitAmt - parseInt(data.data)).toMoney());
                }                
            } else {
                alert(data.message);
                $("#useLimitAmt").val(0);
                $("#remainLimitAmt").val(0);
            }
        };
        common.Ajax.sendJSONRequest("POST", url, data, callback_getCjDscntLmtJson, false);
        return false;
    }
};

/**
 * 현금영수증 Interface
 * 
 * 초기화 : 
 *      morder.orderForm.receipt.init()
 * 
 */
$.namespace("morder.orderForm.receipt");
morder.orderForm.receipt = {

    init : function() {
        
        var _super = morder.orderForm;
        // 현금영수증 발급유형 변경
        $("#crIssuCd").change(function(){
            $("#lbCashReceiptStat").text($("option:selected", this).text());
            $("#receipt_list li[crIssuCd]").hide();
            $("#receipt_list li[crIssuCd]").find("input, select").prop("disabled", true);
            if($(this).val() == "10") {
                $("#receipt_list li[crIssuCd='10']").show();
                $("#receipt_list li[crIssuCd='10']").find("input, select").prop("disabled", false);
                $("#receipt_list li[crIssuCd][crIssuMeanSctCd]").hide();
                $("#receipt_list li[crIssuCd][crIssuMeanSctCd]").find("input, select").prop("disabled", true);
                $("#receipt_list li[crIssuMeanSctCd='"+$("input[type='radio'][name='crIssuMeanSctCd']:checked").val()+"']").show();
                $("#receipt_list li[crIssuMeanSctCd='"+$("input[type='radio'][name='crIssuMeanSctCd']:checked").val()+"']").find("input, select").prop("disabled", false);
            } else if($(this).val() == "20") {
                $("#receipt_list li[crIssuCd='20']").show();
                $("#receipt_list li[crIssuCd='20']").find("input, select").prop("disabled", false);
            }
        });
        
        // 현금영수증 발급방법 변경
        $("input[type='radio'][name='crIssuMeanSctCd']").change(function(){
            $("#receipt_list li[crIssuCd][crIssuMeanSctCd]").hide();
            $("#receipt_list li[crIssuCd][crIssuMeanSctCd]").find("input, select").prop("disabled", true);
            $("#receipt_list li[crIssuMeanSctCd='"+$(this).val()+"']").show();
            $("#receipt_list li[crIssuMeanSctCd='"+$(this).val()+"']").find("input, select").prop("disabled", false);
        });
        
        $("#crIssuCd").val("");
        $("#crIssuCd").trigger("change");

        var events = 'input paste change';
        
        // 연락처 숫자만 입력
        $("#dispCashReceiptInfo12, #dispCashReceiptInfo13").on(events, function(){
            _super.checkNumber($(this));
            _super.checkMaxSize($(this), 4);
        });

        // 카드번호 숫자만 입력
        $("#CashReceipts").on(events, function(){
            _super.checkNumber($(this));
            _super.checkMaxSize($(this), 18);
        });
        
        // 사업자번호 숫자만 입력
        $("#BusinessNumber").on(events, function(){
            _super.checkNumber($(this));
            _super.checkMaxSize($(this), 10);
        });
    },
    
    valid : function() {
        var _super = morder.orderForm;
        var _this = morder.orderForm.receipt;
        var validMsgArray = [];
        
        if($("#crIssuCd").val() == "10") {
            if($("input[type='radio'][name='crIssuMeanSctCd']:checked").val() == "3") {
                validMsgArray.push(_super.validEmpty($("#dispCashReceiptInfo11")));
                validMsgArray.push(_super.validEmpty($("#dispCashReceiptInfo12")));
                validMsgArray.push(_super.validEmpty($("#dispCashReceiptInfo13")));
                validMsgArray.push(_super.validNumber($("#dispCashReceiptInfo12")));
                validMsgArray.push(_super.validNumber($("#dispCashReceiptInfo13")));
                validMsgArray.push(_super.validLength($("#dispCashReceiptInfo12"), 3, 4));
                validMsgArray.push(_super.validLength($("#dispCashReceiptInfo13"), 4, 4));
                $("#crPhoneNumber").val($("#dispCashReceiptInfo11").val()+$("#dispCashReceiptInfo12").val()+$("#dispCashReceiptInfo13").val());
                
            } else if($("input[type='radio'][name='crIssuMeanSctCd']:checked").val() == "5" ) {
                validMsgArray.push(_super.validEmpty($("#CashReceipts")));
                validMsgArray.push(_super.validNumber($("#CashReceipts")));
                // 모바일카드
                if(!!$("#CashReceipts").val() && $("#CashReceipts").val().substr(0, 3) == "126") {
                    $("#CashReceipts").attr("this", "현금영수증 모바일 카드번호는");
                    validMsgArray.push(_super.validLength($("#CashReceipts"), 12, 12));
                } else if(!!$("#CashReceipts").val() && $("#CashReceipts").val().substr(0, 8) == "15442020") {
                    $("#CashReceipts").attr("this", "현금영수증 카드번호는");
                    validMsgArray.push(_super.validLength($("#CashReceipts"), 18, 18));
                } else {
                    var validObj = new _super.validObj();
                    validObj.isValid = false;
                    validObj.validMsg = "현금영수증 카드번호를 확인해주세요.";
//                    validObj.validMsg += "\n - 1544-2020-****-******\n - 126*-****-**** (모바일)";
                    validObj.element = $("#CashReceipts");
                    validMsgArray.push(validObj);
                }
            }
        } else if($("#crIssuCd").val() == "20") {
            validMsgArray.push(_super.validEmpty($("#BusinessNumber")));
            validMsgArray.push(_super.validNumber($("#BusinessNumber")));
            validMsgArray.push(_super.validLength($("#BusinessNumber"), 10, 10));
        }
        
        if(_this.checkCashReceipt()) {
            for (var i = 0 ; i < validMsgArray.length ; i++) {
                if(validMsgArray[i].validMsg != "") {
                    return validMsgArray[i];
                }
            }
        }
        return new _super.validObj();
    },

    checkCashReceipt : function() {
        // 포인트로 전체금액 결제시
        var _payAmt = morder.orderForm.payAmt;
        var isReceipt = false;
        var payMethod = $("input[name='payMethod']:enabled").val();
        //카페테리아포인트,예치금 포함되어 있으면 현금영수증 신청 가능
        if(_payAmt.cafeteriaPntAplyAmt != 0
                || _payAmt.csmnAplyAmt != 0
                || _payAmt.cjGiftCardAplyAmt != 0
                || _payAmt.oyGiftCardAplyAmt != 0
                ) {
            isReceipt = true;
        } else {
            isReceipt = $("#payMethodList").find("li[paymeancd='"+payMethod+"']").attr("cashreceipt") == 'Y' ? true : false;
        }
        if(isReceipt) {
            $("#receipt_list").find("input, select").prop("disabled", false);
            $("#crIssuCd").trigger("change");
            $("#cashReceipt").show();
        } else {
            $("#cashReceipt").hide();
            $("#receipt_list").find("input, select").prop("disabled", true);
        }
        return isReceipt;
    }
};

/**
 * OK CASH BAG 정보 Interface
 * 
 */
$.namespace("morder.orderForm.ocbInfo");
morder.orderForm.ocbInfo = {
    events : 'input paste change',
    init : function() {
        var form = morder.orderForm;
        var _this = morder.orderForm.ocbInfo;     
        
        // OCB 카드번호 숫자만 입력
        $('#ocbCardNo1, #ocbCardNo2, #ocbCardNo3, #ocbCardNo4').on(_this.events, function(){
            var nextId = $(this).attr("next");
            var maxlength = $(this).attr("maxlength");
            form.checkNumber($(this)); 
            form.checkMaxSize($(this), maxlength);
            if(!!nextId && $(this).val().length == maxlength) {
                $("#"+nextId).focus().select();
            }
        });

        $("#ocbCardValid_btn").click(function(){
            if( $("#ocbCardValid_btn").text() == '확인' ){
                _this.getOcbCardValidJson();
            }else{
                $("#ocbValidChk").val('N');
                $("input[name='ocbCardNo']").attr("disabled", false);         
                $("#ocbCardValid_btn").text('확인');
            }
        });
        
        $('.accordion_item').find('button').click(function(){            
            var item = $(this).parent().parent();
            if(item.hasClass('active')){
                item.removeClass('active');
            }else{
                item.addClass('active');
            }
        });  
        
        $("input[name='ocbChk']").change(function() {            
            if($("input[name='ocbChk']:checked").length == $("input[name='ocbChk']").length){
                $("input[name='ocbCardNo']").attr("disabled", false); 
                $("#ocbCardValid_btn").text('확인');
            }else{
                $("input[name='ocbCardNo']").attr("disabled", true);
            }
            $("#ocbValidChk").val('N');
        });
        
        if($("#ocbCardNo1").val() != ''){
            $("#pntSaveYn").prop("checked", true);
        }
    },    
    // OCB 카드번호 유효성 체크
    getOcbCardValidJson : function() {
        var form = morder.orderForm;
        var ocbCardNo1 = $("#ocbCardNo1");
        var ocbCardNo2 = $("#ocbCardNo2");
        var ocbCardNo3 = $("#ocbCardNo3");
        var ocbCardNo4 = $("#ocbCardNo4");
        
        var validMsgArray = [];
        
        validMsgArray.push(form.validEmpty(ocbCardNo1));
        validMsgArray.push(form.validNumber(ocbCardNo1));
        validMsgArray.push(form.validLength(ocbCardNo1, 4, 4));
        validMsgArray.push(form.validEmpty(ocbCardNo2));
        validMsgArray.push(form.validNumber(ocbCardNo2));
        validMsgArray.push(form.validLength(ocbCardNo2, 4, 4));
        validMsgArray.push(form.validEmpty(ocbCardNo3));
        validMsgArray.push(form.validNumber(ocbCardNo3));
        validMsgArray.push(form.validLength(ocbCardNo3, 4, 4));
        validMsgArray.push(form.validEmpty(ocbCardNo4));
        validMsgArray.push(form.validNumber(ocbCardNo4));
        validMsgArray.push(form.validLength(ocbCardNo4, 4, 4));
        
        for (var i = 0 ; i < validMsgArray.length ; i++) {
            if(!validMsgArray[i].isValid) {
                alert(validMsgArray[i].validMsg);
                validMsgArray[i].element.focus();
                return false;
            }
        }

        var url = _secureUrl + "order/getOcbCardValidJson.do";
        var data = {
              cardNo  : ocbCardNo1.val() + ocbCardNo2.val() + ocbCardNo3.val() + ocbCardNo4.val()
        };
        var callback_getOcbCadValidJson = function(data){            
            if(data.result == "S") {
                $("#ocbValidChk").val('Y');
                $("input[name='ocbCardNo']").attr("disabled", true);
                $("#ocbCardValid_btn").text('재입력');                
            } else {
                $("#ocbValidChk").val('N');
                if(Object.keys(systemIFMgmtList).length > 0) {
                    var cnt = 0;
                    var format = "yyyy.MM.dd HH:mm";
                    var startDtimeRegex = "startDtime";
                    var endDtimeRegex = "endDtime";
                    var pointNmRegex = "pointNm";
                    var msg = "" + startDtimeRegex + " ~ " + endDtimeRegex + " 까지\n" + pointNmRegex + " 시스템 점검으로 인하여 이용이 불가능합니다. 점검 이후 이용해주세요.";
                    $.each(systemIFMgmtList, function(cd, systemIFMgmtInfo){
                        var startDtime = systemIFMgmtInfo.systemIFExpStartDtime.substr(0, 16).replaceAll("-", ".");
                        var endDtime = systemIFMgmtInfo.systemIFExpEndDtime.substr(0, 16).replaceAll("-", ".");
                        var pointNm = "";
                        // OK캐쉬백
                        if(cd == "83") {
                            cnt++;
                            pointNm = "OK캐쉬백";
                            setTimeout(function(){
                                alert(msg.replace(startDtimeRegex, startDtime).replace(endDtimeRegex, endDtime).replace(pointNmRegex, pointNm));
                            }, cnt * 200);
                        } 
                    });
                }else{
                    alert(data.message); 
                }               
            }
        };
        common.Ajax.sendJSONRequest("POST", url, data, callback_getOcbCadValidJson, false);
        return false;
    },
    /**
     * validation 처리를 함.
     * 
     * @return 오류 메시지 / 정상일때 빈 문자열("")
     */
    valid : function() {
        var form = morder.orderForm;    
        var validMsgArray = [];             

        // OK캐시백 링크로 이동한 경우에만 체크
        if($("#ocbTr").css('display') != undefined && $("#ocbTr").css('display') != "none" && (ocbCardNo != '' || $("input[name='ocbChk']").is(":checked")) ){
            var ocbCardNo = $("#ocbCardNo1").val() + $("#ocbCardNo2").val() + $("#ocbCardNo3").val() + $("#ocbCardNo4").val();
            var ocbCardNo1 = $("#ocbCardNo1");
            var ocbCardNo2 = $("#ocbCardNo2");
            var ocbCardNo3 = $("#ocbCardNo3");
            var ocbCardNo4 = $("#ocbCardNo4");  
              
        }  
        
        for (var i = 0 ; i < validMsgArray.length ; i++) {
            if(validMsgArray[i].isValid != true) {
                return validMsgArray[i];
            }
        }
        
        return new form.validObj(); 
    }
};

/**
 * 선물하기 정보 Interface
 * 
 */
$.namespace("morder.orderForm.presentInfo");
morder.orderForm.presentInfo = {
    events : 'input paste change',
    rcvManNmLength : 10,
    textAreaMaxLength : 100,
    init : function() {
        //console.log('presentInfo init.........');
        
        var _super = morder.orderForm;
        var _this = morder.orderForm.presentInfo;
        
        // 신규배송지 초기화
        $(".dlvpInfoLi").hide();
        $("#btn_dlvp_new").click();
        
        $("#dlvpNm_new").val("-");//배송지명
        $("#rmitNm_new").val("-");//받는분
        $("#rmitCellSctNo_new").val("0");//연락처1 국번
        $("#rmitCellTxnoNo_new").val("0");//연락처1 번호1
        $("#rmitCellEndNo_new").val("0");//연락처1 번호 2
        $("#stnmRmitPostNo_new").val("0");//도로명우편번호
        $("#rmitPostNo_new").val("0");//우편번호
        $("#stnmRmitPostAddr_new").val("-");//도로명
        $("#rmitBaseAddr_new").val("-");//상세주소
        
        // 수령인 연락처 숫자만 입력
        $("#rcvManCellTxnoNo, #rcvManCellEndNo").on(_this.events, function(){
            _super.checkNumber($(this)); 
            _super.checkMaxSize($(this), 4);
        });
        
        //2020-03-19 common.app.js 호출
        // 휴대폰 주소록 스킴 호출
//        $("#contactInfoBtn").on("click",function(){
//            var isVer = common.app.appInfo.appver.replace(/\./gi, "");
//            var isOS  = common.app.appInfo.ostype;
//            
//            /* ios는 10, android는 20 주소록 없는 구버전은 앱다운로드 유도 */
//            if ((isOS == "10" && parseInt(isVer) < 224)) {
//                if(confirm("최신버전 앱으로 업데이트하고\n연락처를 편하게 입력해보세요.")){
//                    location.href = "oliveyoungapp://openBrowser?url=https://itunes.apple.com/kr/app/ollibeuyeong/id873779010?l=kr&mt=8";
//                }
//                
//            }else if((isOS == "20" && parseInt(isVer) < 222)){
//                if(confirm("최신버전 앱으로 업데이트하고\n연락처를 편하게 입력해보세요.")){
//                    location.href = "oliveyoungapp://openBrowser?url=market://details?id=com.oliveyoung";
//                }
//                
//            }else{
//                location.href = "oliveyoungapp://getContactInfo";
//            }
//        });
		// 수령인명은 한글/영문/숫자만 입력 가능
        $("#rcvManNm").on("focusout", function(e){
            if(isStrSpecialChar($(this).val()) == true){
                alert('특수문자를 제외하고 입력해주세요.');
                $(this).val(replaceStrSpecialChar($(this).val()));
                $(this).focus();
            }
        });
        
        //메시지 카드 textarea 이벤트
        var isPresentMsgLengthAlertCalled = false; // ios 얼럿 중복 호출 먹통 방지 플래그 추가
        $("#presentMsg").on("input paste change", function(){
            // 최대글자수 제한(엔터 포함)
            var checkLimitTextArea = function(_textarea) {
                var str = _textarea.val();
                if(str.length > _this.textAreaMaxLength) {
                    if(isPresentMsgLengthAlertCalled == false){
                        isPresentMsgLengthAlertCalled = true;
                        alert("선물 메시지는 "+_this.textAreaMaxLength+"자까지만\n입력가능합니다.");
                        isPresentMsgLengthAlertCalled = false;
                    }
                    var pos = _textarea[0].selectionEnd;
                    var endStr = str.substr(pos, str.length);
                    var startStr = str.substr(0, pos-1);
                    while((startStr+endStr).length > _this.textAreaMaxLength) {
                        startStr = startStr.substr(0, startStr.length-1);
                    }
                    _textarea.val(startStr+endStr);
                    _textarea[0].setSelectionRange(startStr.length,startStr.length);
                }
            }
            checkLimitTextArea($(this));
            
            var str = $(this).val();
            $("#presentMsg").val(str);
            $("#presentMsgCnt").text(str.length);
        });
        
        // 메시지카드 swipe 적용
        var msgGiftCardSwiper = new Swiper('.card-thumb-list', {
                slidesPerView: 3.7,
                spaceBetween: 10,
                centeredSlides: true,
                loopAdditionalSlides: 10,
                loop :true,
                loopFillGroupWithBlank: true,
                slideToClickedSlide: true,
                onSlideClick: function(s, e) {
                    msgGiftCardSwiper.slideTo(s.clickedIndex);
                }
            });

        msgGiftCardSwiper.on('slideChangeStart', function(){
             var imgSrc = $('.card-thumb-list').find('.swiper-slide-active').find('img').attr('src');
             var imgAlt = $('.card-thumb-list').find('.swiper-slide-active').find('img').attr('alt');
             var dispContsNo = $('.card-thumb-list').find('.swiper-slide-active').find('img').attr('data-disp-conts-no');
             $('.select-card-image').attr('style', 'background-image:url('+imgSrc+')');
             $('.select-card-view input[name="dispContsNo"]').val(dispContsNo);
        })
    },    
    /**
     * validation 처리를 함.
     * 
     * @return 오류 메시지 / 정상일때 빈 문자열("")
     */
    valid : function() {
        var _super = morder.orderForm;
        var _this = morder.orderForm.presentInfo;
        var validObj = new _super.validObj();
        
        // validation
        var validMsgArray = [];
        
        validMsgArray.push(_super.validEmpty($("#rcvManNm")));
        validMsgArray.push(_super.validLength($("#rcvManNm"), 0, _this.rcvManNmLength));
        validMsgArray.push(_super.validEmpty($("#rcvManCellSctNo")));
        validMsgArray.push(_super.validEmpty($("#rcvManCellTxnoNo")));
        validMsgArray.push(_super.validEmpty($("#rcvManCellEndNo")));
        validMsgArray.push(_super.validNumber($("#rcvManCellTxnoNo")));
        validMsgArray.push(_super.validNumber($("#rcvManCellEndNo")));
        validMsgArray.push(_super.validLength($("#rcvManCellTxnoNo"), 3, 4));
        validMsgArray.push(_super.validLength($("#rcvManCellEndNo"), 4, 4));
        //validMsgArray.push(_super.validEmpty($("#presentMsg"))); // 메시지 카드 선택 입력으로 변경
        //validMsgArray.push(_super.validLength($("#presentMsg"), 0, _this.textAreaMaxLength)); // 해당 함수에 trim이 있어 제외 처리. 엔터 입력 필요.
        
        for (var i = 0 ; i < validMsgArray.length ; i++) {
            if(validMsgArray[i].validMsg != "") {
                return validMsgArray[i];
            }
        }
        
        return validObj;
    }
};