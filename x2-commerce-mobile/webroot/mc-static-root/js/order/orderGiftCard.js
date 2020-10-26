/**
 * 주문서 처리 Interface
 * 
 * :: init  - 초기화 function
 * :: valid - validation function
 */
$.namespace("morder.orderGiftCardForm");
morder.orderGiftCardForm = {
        
    isExcute : false,

    /**
     * 초기화 하는 함수
     */
    init : function() {
            
        var _this = morder.orderGiftCardForm;
        
        //주문자 정보 초기화
        _this.ordManInfo.init();
        
//        if(presentYn == 'Y'){
//            // 선물하기 정보 초기화
//            _this.presentInfo.init();
//        }else{
//            //배송지 정보 초기화
//            _this.dlvpInfo.init();
//        }

//        //결제금액 정보 초기화
//        _this.payAmt.init();

        //결제 수단 초기화
        _this.payMethod.init();

        //금액입력 초기화
        _this.payInput.init();
        
        //받는사람(선물하기) 초기화
        _this.rcvMan.init();

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
        
        // 특수문자 제거
        $("#orderGiftCardForm input, textarea").each(function(){
            var str = $(this).val();
            var regex=/[$]/g;
            if(!!str && regex.test(str)) {
                $(this).val(str.replace(/[$]/g, ""));
            }
        });
        
        $("#orderGiftCardForm input, textarea").on('input paste change', function(){
            _this.checkSpecialCharacter($(this));
        });
    },
    
    checkAgree : function() {
        var _this = morder.orderGiftCardForm;
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

        var _this = morder.orderGiftCardForm;

        // 특수문자 제거
        $("#orderGiftCardForm input, textarea").each(function(){
            var str = $(this).val();
            var regex=/[$]/g;
            if(!!str && regex.test(str)) {
                $(this).val(str.replace(/[$]/g, ""));
            }
        });
        
        // 선물하기인 경우 배송지 체크가 아닌 선물하기 유효성 체크가 필요
//        var validTarget = _this.dlvpInfo.valid();
//        if(presentYn == 'Y'){
//            validTarget = _this.presentInfo.valid();
//        }
        
        // validation 
        var validMsgArray = [
            _this.ordManInfo.valid()            //주문자정보
          , _this.payMethod.valid()             //결제수단선택
          , _this.checkAgree()                  //주문동의
          , _this.payInput.valid()				//금액입력
          , _this.payAmt.valid()				//결제금액
          , _this.rcvMan.valid()				//선물하기
        ];
        
        for (var i = 0 ; i < validMsgArray.length ; i++) {
            if(!validMsgArray[i].isValid) {
                if($("#agreeList").find(validMsgArray[i].element).length > 0
                        && !$("#agreeList").hasClass("open")) {
                    $("#agreeList").addClass("open");
                }else if($("#ordManList").find(validMsgArray[i].element).length > 0
                		&& !$("#ordManList").hasClass("open")) {
                	$("#ordManList").addClass("open");
                }else if($("#rcvManList").find(validMsgArray[i].element).length > 0
                		&& !$("#rcvManList").hasClass("open")) {
                	$("#rcvManList").addClass("open");
                }else if($("#ordGoodsList").find(validMsgArray[i].element).length > 0
                		&& !$("#ordGoodsList").hasClass("open")) {
                	$("#ordGoodsList").addClass("open");
                }else if($("#payMethod").find(validMsgArray[i].element).length > 0
                		&& !$("#payMethod").hasClass("open")) {
                	$("#payMethod").addClass("open");
                }else if(validMsgArray[i].element[0].id == "payMethod"
                		&& !$("#payMethod").hasClass("open")) {
                	$("#payMethod").addClass("open");
                }
                alert(validMsgArray[i].validMsg);
                
                if(validMsgArray[i].element[0].id == "ordManEmailAddr"){
                	$("#ordManEmailAddrId").focus();
                }else{
                	validMsgArray[i].element.focus();
                }
                return false;
            }
        }
        
//        var quickYn = $("#quickYn").val();
//        var quickInfoYn = $("#quickInfoYn").val();
//        
//        if(quickYn == "Y"){
//            if(quickInfoYn == "N"){
//                mgoods.detail.todayDelivery.openQuickPop('order');
//                return;
//            }
//        }

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
            
            var url = _secureUrl + "orderGiftCard/setOrderRequest.do";
            var params = "";
            
            for(var i = 0; i < 5; i++){
         	   $('#rcvNmList'+(i+1)).val("");
            }
            
            $("#rcvMan input[name=rcvNm]").each(function(index, item) {
         	   $('#rcvNmList'+(index+1)).val($(this).val());
//         	   $(this).val($(this).val().replaceAll(",",""));
            });
            
            $.each($('#orderGiftCardForm').serializeArray(), function(i, field) {

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
            
            $('#orderGiftCardForm').attr('method','post');
            $('#orderGiftCardForm').attr('action',url);
            
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
//            var payAmt = (Number(_this.payAmt.totGoodsAmt) 
//                    + Number(_this.payAmt.totDlexAmt) 
//                    - Number(_this.payAmt.imdtDscntAmt) 
//                    - Number(_this.payAmt.cpnDscntAmt));
            // 앱에서 cj one 포인트 전액결제일 때 or 예치금 1만 이상일 때, 기프트카드(올리브영,CJ) 전액결제이면서 1만원이상 결제할때
            
            // 보조결제수단 인증수단 없이 결제시 이중 승인 방지
//            if(_this.payAmt.totPayAmt == 0) {               
//                _this.isExcute = true;
//            }
            
            if(common.app.appInfo.isapp
                    // Android 4.0 이하 버전에서 iOS와 같은 현상 재현으로 인해
                    // app일경우 항상 setTimeout 하도록 수정
//                        && common.app.appInfo.ostype == "10"
                        ) {
                setTimeout(function(){
                    // iOS 앱 이면서 카카오페이 결제시, 앱버전 체크, 하위버전일시 alert 노출
                	$('#orderGiftCardForm').submit();
                }, 200);
            } else {
                $('#orderGiftCardForm').submit();
            }
            return false;
        };
        
        setOrderRequest();
    },
    
    validEmpty : function(_element){
        var validObj = new morder.orderGiftCardForm.validObj();
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
        var validObj = new morder.orderGiftCardForm.validObj();
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
        var validObj = new morder.orderGiftCardForm.validObj();
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

        var validObj = new morder.orderGiftCardForm.validObj();
        validObj.isValid = true;
        validObj.validMsg = "";
        if(!!_element.val()) {
            _element.val(morder.orderGiftCardForm.trim(_element.val()));
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
  
    Base64 : {

        // private property
        _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

        // public method for encoding
        encode : function (input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;

            input = morder.orderGiftCardForm.Base64._utf8_encode(input);

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

            output = morder.orderGiftCardForm.Base64._utf8_decode(output);

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

    }
};

/**
 * 주문자 정보 Interface
 * 
 */
$.namespace("morder.orderGiftCardForm.ordManInfo");
morder.orderGiftCardForm.ordManInfo = {

    events : 'input paste change',
    ordManNmLength : 10,
    ordManEmailAddrIdLength : 50,
    ordManEmailAddrDmnLength : 50,
    
    init : function() {
        
        var _super = morder.orderGiftCardForm;
        var _this = morder.orderGiftCardForm.ordManInfo;

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
        
        var _super = morder.orderGiftCardForm;
        var _this = morder.orderGiftCardForm.ordManInfo;

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
 * 금액입력
 * 
 */
$.namespace("morder.orderGiftCardForm.payInput");
morder.orderGiftCardForm.payInput = {
        events : 'input paste change',
        
        init : function() {
            
            var _super = morder.orderGiftCardForm;
            var _this = morder.orderGiftCardForm.payInput;
//            $("input[name=salePrc]").val("10000");
//            $("input[name=ordPsbMinQty]").val("1");
//            $("input[name=ordPsbMaxQty]").val("50");
//            $("input[name=qtyAddUnit]").val("1");
            
            var salePrc = parseInt($("input[name=salePrc]").val());
            var ordPsbMaxQty = parseInt($("input[name=ordPsbMaxQty]").val());
            var ordPsbMinQty = parseInt($("input[name=ordPsbMinQty]").val());
            var qtyAddUnit = parseInt($("input[name=qtyAddUnit]").val());
            
            _this.payChange("");
//            $("#giftCardAmt").maxlength((salePrc*ordPsbMaxQty+"").length);
            // 금액입력
            $("#giftCardAmt").on(_this.events, function(){
//                _super.checkMaxSize($(this), (salePrc*ordPsbMaxQty+"").length);
//                _super.checkNumber($(this)); 
            });
            
            $("#giftCardAmt").on('keydown', function(event){
                if (event.keyCode == 13){ 
                	$("#giftCardAmt").blur();
//                    var objValid = _this.valid(); 
//                    if(!objValid.isValid){
//                        alert(objValid.validMsg);
//                    }
                }
            });
//            $("#giftCardAmt").mask('###,000');
            $("#giftCardAmt").mask('###,000', {reverse: true}, {placeholder: "0"});
           
//            $("#giftCardAmt").on('keyup', function(){
//            	if($(this).val() !== ''){
//					$(this).parent().find('.gc-reset').show();
//					$('.gc-price-write .input').addClass('is-active');
//				} else {
//					$(this).parent().find('.gc-reset').hide();
//					$('.gc-price-write .input').removeClass('is-active');
//				}
//            });
            
            $('#giftCardAmt').on('focusin', function(){
				$('.gc-price-write .input').addClass('is-active');
			}).on('focusout', function(){
//				alert($("#giftCardAmt").val());
//				if($(this).val() == '') {
//					$('.gc-price-write .input').removeClass('is-active');
//				} else {
//					$('.gc-price-write .input').addClass('is-active');
//				}
				var objValid = _this.valid(); 
                if(!objValid.isValid){
                    alert(objValid.validMsg);
                }
			});
            
            // input 리셋
			$('.gc-price-write .gc-reset').on('click', function(){
				$('.gc-price-write .input').removeClass('is-active');
				//$(this).parent().find('input').val('');
				_this.payChange(0);
				$(this).hide();
			});
			
//            $("#giftCardAmt").click(function(){
//                var currpay = parseInt($("#giftCardAmt").val())
//                
//                if( currpay == 0) {
//                    $("#giftCardAmt").val("");
//                }           
//            });
            
//            $("#giftCardAmt").blur(function(){
//                var objValid = _this.valid(); 
//                if(!objValid.isValid){
//                    alert(objValid.validMsg);
//                }
//            });
            
            $("#addBtnList button").click(function(){
            	var addPay = $(this).attr("data-amount")
//              $("#giftCardAmt").val(currpay);
	             //alert($(this).attr("data-amount"));
	              
	              var salePrc = parseInt($("input[name=salePrc]").val());
	              var ordPsbMaxQty = parseInt($("input[name=ordPsbMaxQty]").val());
	              var amtMax = salePrc * ordPsbMaxQty;
	              
	              var currAmt = $("#giftCardAmt").val().replaceAll(",","");
	              if(currAmt == null || currAmt == ""){
	              	currAmt = "0";
	              }
	              var newAmt = parseInt(currAmt) + parseInt(addPay);
	              if(newAmt > amtMax){
	              	alert("1만원부터 50만원까지 구매 가능하며,\n만원 단위로 입력 가능합니다.");
	              	newAmt = amtMax;
	              }
	              
	              _this.payChange(newAmt);
                var objValid = _this.valid(); 
                if(!objValid.isValid){
                    alert(objValid.validMsg);
                }
            });
            
            $("#addBtnList button").each(function(){
                var i = $(this).attr("index");
                var iAmt = salePrc * (ordPsbMinQty + (i * qtyAddUnit));
                if(iAmt <= salePrc * ordPsbMaxQty){
                    $(this).text("+ " + _this.getAmtMsg(iAmt) + "원");
                    $(this).attr("data-amount",iAmt);
                }else{
                    $(this).hide();
                }
            });
            
            
        },
        
        valid : function(){
            var _this = morder.orderGiftCardForm.payInput;
            var _super = morder.orderGiftCardForm;
            
            var validObj = new _super.validObj();
            
            
            var salePrc = parseInt($("input[name=salePrc]").val());
            var ordPsbMinQty = parseInt($("input[name=ordPsbMinQty]").val());
            var ordPsbMaxQty = parseInt($("input[name=ordPsbMaxQty]").val());
            var qtyAddUnit = parseInt($("input[name=qtyAddUnit]").val());
            
            var amtUnit = salePrc * qtyAddUnit;
            var amtMin = salePrc * ordPsbMinQty;
            var amtMax = salePrc * ordPsbMaxQty;
            amtMax = amtMax - ((amtMax - amtMin)%amtUnit);
            
            var currpay = parseInt($("#giftCardAmt").val().replaceAll(",",""));
            if(currpay == 0){
        		validObj.isValid = false;
                validObj.validMsg = "1만원부터 50만원까지 구매 가능하며,\n만원 단위로 입력 가능합니다.";
                validObj.element = $("#giftCardAmt");
        	}
            if(!currpay){
                currpay = 0;
            }
            
            
            if(currpay > 0){
                if(currpay > amtMax){
//                    var strMsg = _this.getAmtMsg(amtMax);
//                    alert("최대 "+strMsg+"원까지 입력 가능합니다.");
//                    alert(_this.getAmtMsg(amtMin)+"원부터 "+_this.getAmtMsg(amtMax)+"원까지 입력이 가능하며, \n"+_this.getAmtMsg(amtUnit)+"원 단위로만 입력이 가능합니다.");
                    validObj.isValid = false;
                    validObj.validMsg = "1만원부터 50만원까지 구매 가능하며,\n만원 단위로 입력 가능합니다.";
                    validObj.element = $("#giftCardAmt");
                    currpay = 0;
                }else if(currpay < amtMin){
//                    var strMsg = _this.getAmtMsg(amtMin);
//                    alert("최소 "+strMsg+"원부터 입력 가능합니다.");
//                    alert(_this.getAmtMsg(amtMin)+"원부터 "+_this.getAmtMsg(amtMax)+"원까지 입력이 가능하며, \n"+_this.getAmtMsg(amtUnit)+"원 단위로만 입력이 가능합니다.");
                    validObj.isValid = false;
                    validObj.validMsg = "1만원부터 50만원까지 구매 가능하며,\n만원 단위로 입력 가능합니다.";
                    validObj.element = $("#giftCardAmt");
                    currpay = 0;
                }else if((currpay - amtMin)%(amtUnit) > 0){
//                    var strMsg = _this.getAmtMsg(amtUnit);
//                    alert(strMsg+"원 단위로 입력 가능합니다.");
//                    alert(_this.getAmtMsg(amtMin)+"원부터 "+_this.getAmtMsg(amtMax)+"원까지 입력이 가능하며, \n"+_this.getAmtMsg(amtUnit)+"원 단위로만 입력이 가능합니다.");
                    validObj.isValid = false;
                    validObj.validMsg = "1만원부터 50만원까지 구매 가능하며,\n만원 단위로 입력 가능합니다.";
                    validObj.element = $("#giftCardAmt");
                    currpay = 0;
                }
            }
            _this.payChange(currpay);
            return validObj;
        },
        
        payChange : function(currpay){
        	
        	if(!currpay){
        		$('.gc-price-write .input').removeClass('is-active');
        		$("#giftCardAmt").val("");
        		$('.gc-price-write .gc-reset').hide();
        	}else if(currpay==0){
        		$('.gc-price-write .input').removeClass('is-active');
        		$("#giftCardAmt").val("");
        		$('.gc-price-write .gc-reset').hide();
        	}else{
        		$('.gc-price-write .input').addClass('is-active');
        		$("#giftCardAmt").val(currpay.toMoney());
        		$('.gc-price-write .gc-reset').show();
        	}
            
            var payAmt = currpay;
            if($("#giftYn").val()=="Y"){
                payAmt = payAmt * $("#rcvMan [name=rcvNm]").length;
            }
            $("input[name='ordPayAmt']").val(payAmt);
            $("#totPayAmt_sum_span").text(payAmt.toMoney());
            $("#totPayAmt_tit_span").text(payAmt.toMoney());
            $("#totGoodsAmt").text(payAmt.toMoney());
            $("#totPayAmt_btn_span").text(payAmt.toMoney());
            $("input[name='remainAmt']").val(payAmt);
        },
        
        getAmtMsg : function(iAmt){
            var amtUnit = parseInt(iAmt/10000);
            var amtUnitUnder = parseInt(iAmt%10000);
            var strMsg = "";
            if(amtUnit > 0){
                strMsg = amtUnit+"만";
            }
            if(amtUnitUnder > 0){
                strMsg = strMsg + amtUnitUnder;
            }
            return strMsg;
        }
        
        
        
};


/**
 * 결제금액 Interface
 * 
 */
$.namespace("morder.orderGiftCardForm.payAmt");
morder.orderGiftCardForm.payAmt = {
        
//    totGoodsAmt             : 0,
//    totDlexAmt              : 0,
//    imdtDscntAmt            : 0,
//    cpnDscntAmt             : 0,
//    cjonePntAplyAmt         : 0,
//    cafeteriaPntAplyAmt     : 0,
//    csmnAplyAmt             : 0,
//    cjGiftCardAplyAmt       : 0, //2018.02.12 cj기프트 카드 추가
//    oyGiftCardAplyAmt       : 0, //2018.02.12 oy기프트 카드 추가
//    giftBoxAmt              : 0, //2019.11.21 선물포장비 추가
//    totPayAmt               : 0,
//    
//    goodsInfoList           : {},
        
    init : function() {
        
        var _this = morder.orderGiftCardForm.payAmt;

//        //총 상품금액 세팅
//        _this.totGoodsAmt = Number($("input[name='goodsAmt']").val());
//        
//        _this.initPayAmt();
    },

    valid : function() {
        var _super = morder.orderGiftCardForm;
        var validObj = new _super.validObj();
        
        if($("#giftCardAmt").val() == null
        		||$("#giftCardAmt").val() == ""
        		||parseInt($("#giftCardAmt").val()) == 0){
            validObj.isValid = false;
            validObj.validMsg = "금액을 입력해주세요.";
            validObj.element = $("#giftCardAmt");
        }else if($("input[name='ordPayAmt']").val() == null
        		||$("input[name='ordPayAmt']").val() == ""
        		||parseInt($("input[name='ordPayAmt']").val()) == 0){
            validObj.isValid = false;
            validObj.validMsg = "금액을 입력해주세요.";
            validObj.element = $("input[name='ordPayAmt']");
        }
        
        return validObj;
    }
};
        
/**
 * 결제수단 Interface
 * 
 * 초기화 : 
 *      morder.orderGiftCardForm.payMethod.init()
 * 
 * 파라메터 생성 및 Validation : 
 *      morder.orderGiftCardForm.payMethod.makeParameter()
 * 
 */
$.namespace("morder.orderGiftCardForm.payMethod");
morder.orderGiftCardForm.payMethod = {

    payMeathodCnt : 0,
    events : 'input paste change',
    
    init : function() {
        var _super = morder.orderGiftCardForm;
        var _this = morder.orderGiftCardForm.payMethod;
        
        // 결제수단 변경 event
        $("#payMethodList li[paymeancd]").click(function(){
            
            var payMeanCd = $(this).attr("paymeancd");
            
            if(payMeanCd != $("input[name='payMethod']").val()) {
                _this.changePayMethod(payMeanCd, true);
            }
        });

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
//                    var instMmCnt = $("#savePayMethodYn").attr("instmmcnt");
//                    var pntUseYn = $("#savePayMethodYn").attr("pntuseyn");
                    if(!!acqrCd) {
                        $("[name='acqrCd']").val(acqrCd);
                        _this.changeCard(false);
                    }
                } else if(payMeanCd == '21') {
                    //계좌이체
                }
            }
        };
        
        setPayMethod();

        // 상품권 잔액조회
        
        setTimeout(function() {
            //웹로그 바인딩
            _this.bindWebLog();
        },700);
    },
    
    // 결제수단 변경 event
    changePayMethod : function(payMeanCd, checkPaymethodMgmt) {
        var _this = morder.orderGiftCardForm.payMethod;
        
        $("input[name='payMethod']").val(payMeanCd);
        $("#payMethodList li").removeClass('on').siblings("[paymeancd='"+payMeanCd+"']").addClass('on');
        $("#payMethod_div div[paymeancd]").removeClass('on').siblings("[paymeancd='"+payMeanCd+"']").addClass('on');
        _this.initPayMethod();
        //결제금액 재세팅
//        morder.orderGiftCardForm.payAmt.initPayAmt();
        
        if(checkPaymethodMgmt) {
            setTimeout(function(){
                var msg = _this.getPayMethodMgmtJson(payMeanCd, null);
                if(!!msg) {
                    alert(msg);
                    _this.payMeathodCnt = 0;
                }
            }, 200);
        }
    },

    // 카드 변경 event
    changeCard : function(checkPaymethodMgmt) {
        var _this = morder.orderGiftCardForm.payMethod;

        if(checkPaymethodMgmt) {
            setTimeout(function(){
                var msg = _this.getPayMethodMgmtJson($("input[name='payMethod']").val(), $("#acqrCd").val());
                if(!!msg) {
                    alert(msg);
                    _this.payMeathodCnt = 0;
                }
            }, 200);
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
        var _super = morder.orderGiftCardForm;
        var _this = _super.payMethod;
        var validObj = new _super.validObj();
        
        var totPayAmt = morder.orderGiftCardForm.payAmt.totPayAmt;
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
        var _this = morder.orderGiftCardForm.payMethod;

        var payMeathodMsg = "";
        
        if(!!payMeanCd) {
            var url = _secureUrl + "orderGiftCard/getPayMethodMgmtJson.do";
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
    }
    
};


/**
 * 받는사람
 * 
 */
$.namespace("morder.orderGiftCardForm.rcvMan");
morder.orderGiftCardForm.rcvMan = {
        events : 'input paste change',
        
        init : function() {
            
            var _super = morder.orderGiftCardForm;
            var _this = morder.orderGiftCardForm.rcvMan;
            var rcvManMaxQty = 5;
            var textAreaMaxLength = 100;
            
            // 금액입력
            $(document).on(_this.events, '#rcvMan input[name=rcvPhone]',function(){
//                _super.checkMaxSize($(this), 11);
//                _super.checkNumber($(this)); 
            });
            $(document).on(_this.events, '#rcvMan input[name=rcvNm]',function(){
                _super.checkMaxSize($(this), 20);
            });
//            $(document).on('keydown', '#rcvMan input[name=rcvPhone]',function(event){
//                var ctl = event.target;
//                if ((event.keyCode > 47 && event.keyCode < 58) 
//                    || (event.keyCode > 95 && event.keyCode < 106 )){  // backspace 
//                    if (ctl.selectionStart == 0){
//                        if (event.key != "0"){
//                            return false;
//                        }
//                    }else if (ctl.selectionStart == 1){
//                        if (event.key != "1"){
//                            return false;
//                        }
//                    }else if(ctl.selectionStart == 2){
//                        if (!/^(0|1|6|7|8|9)$/.test(event.key)){
//                            return false;
//                        }
//                    }else if(ctl.selectionStart == 3){
//                        if (/^(0)$/.test(event.key)){
//                            return false;
//                        }
//                    }   
//                }
//                return true;
//            });
            
            $(document).on('click', '#rcvMan button',function(){
                var btnType = $(this).attr("data-btnType");
                if(btnType == "add"){
                    if($("#rcvMan button").length >= rcvManMaxQty){
                        alert("최대 "+rcvManMaxQty+"명에게만 선물 가능합니다.");
                        return;
                    }
                    var lastidx = $("#rcvMan input[name=rcvNm]").last().attr("ID").replace("rcvNm","");
                    lastidx = parseInt(lastidx) + 1 ;
                    var html = 
                                '<div class="gc-input-item">' +
                                    '<input class="name" type="text" id="rcvNm' + lastidx + '" name="rcvNm" placeholder="이름"/>' +
                                    '<input class="phone-number" type="text" id="rcvPhone' + lastidx + '" name="rcvPhone" placeholder="휴대폰번호"/>' +
                                    '<button type="button" class="item-del" data-btnType="remove" value="+"><span>삭제</span></button>' +
                                '</span>';
                   
                    $('#rcvMan').append(html);
                    
                }else if(btnType == "remove"){
                    if($("#rcvMan button").length == 1){
                        alert("받는 친구가 최소 1명 이상이어야 합니다.");
                        return;
                    }else{
                        if ($(this).parent().children("input[name='rcvNm']").val() != "" 
                            && $(this).parent().children("input[name='rcvPhone']").val() != ""){
                            if (!confirm("삭제 하시겠습니까?")){
                                return;
                            }
                        }
                        $(this).parent().remove();
                    }
                    
                }
                
                _super.payInput.payChange($("#giftCardAmt").val().replaceAll(",",""));
            });
            
//            // 선물메세지 변경
//			$('.gc-msg-list-wrap .gc-thumb-list a').on('click', function(e){
//				var imgSrc = $(this).find('img').attr('src');
//				$('.gc-msg-list-wrap .gc-thumb-list span').removeClass('is-active');
//				$(this).parent('span').addClass('is-active');
//				$('.gc-select-msg .img img').attr('src', imgSrc);
//				e.preventDefault();
//			});
			
//			// 메시지 이벤트
//			$("#presentMsg").on("keyup",function(e){
//				var  bt = _this.getByteLength($(this).val());
//				var maxlen = parseInt($(this).attr("maxLength"));
//				if (bt > maxlen){
//					$(this).val(_this.getByteMsg($(this).val(), maxlen));
//					bt = _this.getByteLength($(this).val());
//				}
//				$("#giftMsgNum").html(bt);
//			});
            
			// 받는 사람 휴대폰
			$('.gc-input-item .phone-number').mask("000-0000-0000");
			
			
			//메시지 카드 textarea 이벤트
	        var isPresentMsgLengthAlertCalled = false; // ios 얼럿 중복 호출 먹통 방지 플래그 추가
//	        var isMax = false;
	        $("#presentMsg").on("input paste change", function(){
	            // 최대글자수 제한(엔터 포함)
	            var checkLimitTextArea = function(_textarea) {
	                var str = _textarea.val();
	                if(str.length > textAreaMaxLength) {
	                	if(!isPresentMsgLengthAlertCalled){
//	                		isMax = true;
	                        isPresentMsgLengthAlertCalled = true;
	                        alert("입력 글자수를 초과하였습니다.\n"+textAreaMaxLength+"자 내외로 입력 가능합니다.");
	                        setTimeout(function() {
	                        	isPresentMsgLengthAlertCalled = false;
	    	                },300);
	                        
	                    }
	                    var pos = _textarea[0].selectionEnd;
	                    var endStr = str.substr(pos, str.length);
	                    var startStr = str.substr(0, pos-1);
	                    while((startStr+endStr).length > textAreaMaxLength) {
	                        startStr = startStr.substr(0, startStr.length-1);
	                    }
	                    _textarea.val(startStr+endStr);
	                    _textarea[0].setSelectionRange(startStr.length,startStr.length);
	                }else{
//	                	if(str.length < textAreaMaxLength){
//	                		isMax = false;
//	                	}
	                }
	            }
	            checkLimitTextArea($(this));
	            
	            var str = $(this).val();
	            $("#presentMsg").val(str);
	            $("#presentMsgCnt").text(str.length);
	        });
	        
	        if($("#giftYn").val()=="Y"){
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
	        }
	        
//	        $("#contactInfoBtn").on("click",function(){
//	            var isVer = common.app.appInfo.appver.replace(/\./gi, "");
//	            var isOS  = common.app.appInfo.ostype;
//	            
//	            /* ios는 10, android는 20 주소록 없는 구버전은 앱다운로드 유도 */
//	            if ((isOS == "10" && parseInt(isVer) < 224)) {
//	                if(confirm("최신버전 앱으로 업데이트하고\n연락처를 편하게 입력해보세요.")){
//	                    location.href = "oliveyoungapp://openBrowser?url=https://itunes.apple.com/kr/app/ollibeuyeong/id873779010?l=kr&mt=8";
//	                }
//	                
//	            }else if((isOS == "20" && parseInt(isVer) < 222)){
//	                if(confirm("최신버전 앱으로 업데이트하고\n연락처를 편하게 입력해보세요.")){
//	                    location.href = "oliveyoungapp://openBrowser?url=market://details?id=com.oliveyoung";
//	                }
//	                
//	            }else{
//	                location.href = "oliveyoungapp://getContactInfo";
//	            }
//	        });
            
        },
        
//        getByteLength : function(str) {
//    		var len = 0;var max = str.length;
//    		for (var i = 0; i < max; i++)  {
//    			var ch = escape(str.charAt(i));
//    			if(ch.length == 1) len++;
//    			else if (ch.indexOf("%u") != -1) len += 2;
//    			else if (ch.indexOf("%") != -1) len += ch.length / 3;
//    		}
//    		return len;
//    	},
//    	
//    	getByteMsg : function(str, maxlen) {
//    		var len = 0;var max = str.length;
//    		var rtnmsg = "";
//    		for (var i = 0; i < max; i++)  {
//    			var ch = escape(str.charAt(i));
//    			if(ch.length == 1) len++;
//    			else if (ch.indexOf("%u") != -1) len += 2;
//    			else if (ch.indexOf("%") != -1) len += ch.length / 3;
//    			
//    			if (len > maxlen){
//    				break;
//    			}else{
//    				rtnmsg += str.charAt(i);
//    			}
//    		}
//    		return rtnmsg;
//    	},
        
        valid : function(){
            var _this = morder.orderGiftCardForm.payInput;
            var _super = morder.orderGiftCardForm;
            
            var validObj = new _super.validObj();
            var ordManCellNo = $("#ordManCellSctNo").val()+$("#ordManCellTxnoNo").val()+$("#ordManCellEndNo").val();
            ordManCellNo = ordManCellNo.replaceAll(" ","");
            
            var bContinue = true;
            
            $("#rcvMan input[name=rcvNm],#rcvMan input[name=rcvPhone]").each(function(index, item) {
                if(!bContinue){
                	return validObj;
                }
            	if($(this).val() == ""||$(this).val() == null) {
                    validObj.isValid = false;
                    validObj.validMsg = "받는사람 정보를 입력해주세요.";
                    validObj.element = $(this);
                    
//                    alert("받는 사람의 이름과 연락처를 입력해 주세요."); 
//                    $(this).focus();
                    bContinue = false;
                    return validObj;
                }
            });
            
            if(!bContinue){
            	return validObj;
            }
            
            var tmparr = [];
            var arrchkPhone = $("#rcvMan input[name=rcvPhone]");
            
            $("#rcvMan input[name=rcvPhone]").each(function(index, item) {
            	if(!bContinue){
                	return validObj;
                }
                var curPhone = $(this).val().replaceAll(" ","").replaceAll("-","");
                if(curPhone.length < 10 || curPhone.length > 11){
                    validObj.isValid = false;
                    validObj.validMsg = "받는사람 정보를 확인해주세요.";
                    validObj.element = $(this);
//                    alert("전화번호를 올바르게 입력하여주세요.");
//                    $(this).focus();
                    bContinue = false;
                    return validObj;
                }
                
                var currPhoneIdx0 = curPhone.substr(0,1);
                var currPhoneIdx1 = curPhone.substr(1,1);
                var currPhoneIdx2 = curPhone.substr(2,1);
                var currPhoneIdx3 = curPhone.substr(3,1);
                
                if (currPhoneIdx0 != "0" 
                	|| currPhoneIdx1 != "1"
                	|| !/^(0|1|6|7|8|9)$/.test(currPhoneIdx2)
                	|| /^(0)$/.test(currPhoneIdx3)){
                	validObj.isValid = false;
                    validObj.validMsg = "받는사람 정보를 확인해주세요.";
                    validObj.element = $(this);
//                    alert("전화번호를 올바르게 입력하여주세요.");
//                    $(this).focus();
                    bContinue = false;
                    return validObj;
                }
                
                for(var i=0 ; i<tmparr.length ; i++){
                    if (tmparr[i] == curPhone){
                        validObj.isValid = false;
                        validObj.validMsg = "중복된 번호로 선물 할 수 없습니다.";
                        validObj.element = $(this);
//                        alert("중복된 전화번호가 있습니다. 확인 후 다시 시도하여 주세요");
//                        $(this).focus();
                        bContinue = false;
                        return validObj;
                    }
                }
                
//                if(curPhone == ordManCellNo){
//                	validObj.isValid = false;
//                    validObj.validMsg = "본인에게 선물 할 수 없습니다.";
//                    validObj.element = $(this);
////                    alert("중복된 전화번호가 있습니다. 확인 후 다시 시도하여 주세요");
//                    $(this).focus();
//                    return validObj;
//                }
                
                tmparr.push(curPhone);
            });
            
            if(!bContinue){
            	return validObj;
            }
            
            $("#rcvMan textarea[name='presentMsg']").each(function(index, item) {
                var msgLen = $(this).val().length;
                if(msgLen > 100){
                    validObj.isValid = false;
                    validObj.validMsg = "입력 글자수를 초과하였습니다.\n100자 내외로 입력 가능합니다.";
                    validObj.element = $(this);
//                    alert("최대 200자 까지 입력 가능합니다.");
//                    $(this).focus();
                    bContinue = false;
                    return validObj;
//                }else if(msgLen == 0){
//                    $(this).val("기프트카드 선물이 도착했어요!");
//                }else{
//                	$("#giftMsgNum").val(msgLen);
                }
            });
            return validObj;
        }
        
        
};



/**
 * 선물하기 정보 Interface
 * 
 */
//$.namespace("morder.orderGiftCardForm.presentInfo");
//morder.orderGiftCardForm.presentInfo = {
//    events : 'input paste change',
//    rcvManNmLength : 10,
//    textAreaMaxLength : 100,
//    init : function() {
//        //console.log('presentInfo init.........');
//        
//        var _super = morder.orderGiftCardForm;
//        var _this = morder.orderGiftCardForm.presentInfo;
//        
//        // 신규배송지 초기화
//        $(".dlvpInfoLi").hide();
//        $("#btn_dlvp_new").click();
//        
//        $("#dlvpNm_new").val("-");//배송지명
//        $("#rmitNm_new").val("-");//받는분
//        $("#rmitCellSctNo_new").val("0");//연락처1 국번
//        $("#rmitCellTxnoNo_new").val("0");//연락처1 번호1
//        $("#rmitCellEndNo_new").val("0");//연락처1 번호 2
//        $("#stnmRmitPostNo_new").val("0");//도로명우편번호
//        $("#rmitPostNo_new").val("0");//우편번호
//        $("#stnmRmitPostAddr_new").val("-");//도로명
//        $("#rmitBaseAddr_new").val("-");//상세주소
//        
//        // 수령인 연락처 숫자만 입력
//        $("#rcvManCellTxnoNo, #rcvManCellEndNo").on(_this.events, function(){
//            _super.checkNumber($(this)); 
//            _super.checkMaxSize($(this), 4);
//        });
//        
//        // 휴대폰 주소록 스킴 호출
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
//        
//        //메시지 카드 textarea 이벤트
//        var isPresentMsgLengthAlertCalled = false; // ios 얼럿 중복 호출 먹통 방지 플래그 추가
//        $("#presentMsg").on("input paste change", function(){
//            // 최대글자수 제한(엔터 포함)
//            var checkLimitTextArea = function(_textarea) {
//                var str = _textarea.val();
//                if(str.length > _this.textAreaMaxLength) {
//                    if(isPresentMsgLengthAlertCalled == false){
//                        isPresentMsgLengthAlertCalled = true;
//                        alert("선물 메시지는 "+_this.textAreaMaxLength+"자까지만\n입력가능합니다.");
//                        isPresentMsgLengthAlertCalled = false;
//                    }
//                    var pos = _textarea[0].selectionEnd;
//                    var endStr = str.substr(pos, str.length);
//                    var startStr = str.substr(0, pos-1);
//                    while((startStr+endStr).length > _this.textAreaMaxLength) {
//                        startStr = startStr.substr(0, startStr.length-1);
//                    }
//                    _textarea.val(startStr+endStr);
//                    _textarea[0].setSelectionRange(startStr.length,startStr.length);
//                }
//            }
//            checkLimitTextArea($(this));
//            
//            var str = $(this).val();
//            $("#presentMsg").val(str);
//            $("#presentMsgCnt").text(str.length);
//        });
//        
//        // 메시지카드 swipe 적용
//        var msgGiftCardSwiper = new Swiper('.card-thumb-list', {
//                slidesPerView: 3.7,
//                spaceBetween: 10,
//                centeredSlides: true,
//                loopAdditionalSlides: 10,
//                loop :true,
//                loopFillGroupWithBlank: true,
//                slideToClickedSlide: true,
//                onSlideClick: function(s, e) {
//                    msgGiftCardSwiper.slideTo(s.clickedIndex);
//                }
//            });
//
//        msgGiftCardSwiper.on('slideChangeStart', function(){
//             var imgSrc = $('.card-thumb-list').find('.swiper-slide-active').find('img').attr('src');
//             var imgAlt = $('.card-thumb-list').find('.swiper-slide-active').find('img').attr('alt');
//             var dispContsNo = $('.card-thumb-list').find('.swiper-slide-active').find('img').attr('data-disp-conts-no');
//             $('.select-card-image').attr('style', 'background-image:url('+imgSrc+')');
//             $('.select-card-view input[name="dispContsNo"]').val(dispContsNo);
//        })
//    },    
//    /**
//     * validation 처리를 함.
//     * 
//     * @return 오류 메시지 / 정상일때 빈 문자열("")
//     */
//    valid : function() {
//        var _super = morder.orderGiftCardForm;
//        var _this = morder.orderGiftCardForm.presentInfo;
//        var validObj = new _super.validObj();
//        
//        // validation
//        var validMsgArray = [];
//        
//        validMsgArray.push(_super.validEmpty($("#rcvManNm")));
//        validMsgArray.push(_super.validLength($("#rcvManNm"), 0, _this.rcvManNmLength));
//        validMsgArray.push(_super.validEmpty($("#rcvManCellSctNo")));
//        validMsgArray.push(_super.validEmpty($("#rcvManCellTxnoNo")));
//        validMsgArray.push(_super.validEmpty($("#rcvManCellEndNo")));
//        validMsgArray.push(_super.validNumber($("#rcvManCellTxnoNo")));
//        validMsgArray.push(_super.validNumber($("#rcvManCellEndNo")));
//        validMsgArray.push(_super.validLength($("#rcvManCellTxnoNo"), 3, 4));
//        validMsgArray.push(_super.validLength($("#rcvManCellEndNo"), 4, 4));
//        validMsgArray.push(_super.validEmpty($("#presentMsg")));
//        //validMsgArray.push(_super.validLength($("#presentMsg"), 0, _this.textAreaMaxLength)); // 해당 함수에 trim이 있어 제외 처리. 엔터 입력 필요.
//        
//        for (var i = 0 ; i < validMsgArray.length ; i++) {
//            if(validMsgArray[i].validMsg != "") {
//                return validMsgArray[i];
//            }
//        }
//        
//        return validObj;
//    }
//};