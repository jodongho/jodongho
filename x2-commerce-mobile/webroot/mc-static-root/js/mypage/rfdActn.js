/**
 * FAQ 리스트
 */
$.namespace("mmypage.rfdActn.form");
mmypage.rfdActn.form = {
    _ajax : common.Ajax,
    
    init : function(option){
        
        mmypage.rfdActn.form.eventSet();
    },
    eventSet : function(){
        $("#hBack, #cancel").off("click");
        
        // 등록 및 수정
        $("#reg").on("click", function(e){
            e.preventDefault();

            if (!common.loginChk()) {
                return ;
            }
            
            if($("#rfdBnkCd").val().length <= 0){
                alert("은행명을 선택하세요.");
                $("#rfdBnkCd").focus();
                return false;
            }
            if($("#rfdActn").val().length <= 0){
                alert("계좌 번호를 입력하세요.");
                $("#rfdActn").focus();
                return false;
            }
            var param = {
                    rfdAcctOwnMainNm : $("#rfdAcctOwnMainNm").val(),
                    rfdBnkCd : $("#rfdBnkCd").val(),
                    rfdActn : $("#rfdActn").val()
            }
            mmypage.rfdActn.form.updateRfdActnInfoAjax(param);
        });
        // 이전 이동
        $("#hBack, #cancel").on("click", function(e){
            e.preventDefault();
            
            sessionStorage.setItem("deliveryTab","1");
            history.back(-1);
        });
        // 계좌 숫자만 입력
        $("#rfdActn").on("keydown", function(e){
            e = e || window.event;
            var keyCode = (e.which)? e.which : e.keyCode;
            if( keyCode == 8 || keyCode == 46 || keyCode == 37 || keyCode == 39
                    || (keyCode >=48 && keyCode <= 57 ) || ( keyCode >=96 && keyCode <= 105 ) ){
                return;
            }else{
                return false;
            }
        });
        // 계좌 숫자만 입력
        $("#rfdActn").on("keyup", function(e){
            e = e || window.event;
            var keyCode = (e.which)? e.which : e.keyCode;
            if( keyCode == 8 || keyCode == 46 || keyCode == 37 || keyCode == 39){
                return;
            }else{
                e.target.value = e.target.value.replace(/[^0-9]/g,"");
            }
        });
        
        // 은행변경시 점검 체크
        $("#rfdBnkCd").change(function() {
            mmypage.rfdActn.form.checkRfdActnSystemJson($(this).val());
        });
        
    },
    /**
     * 등록 및 수정
     */
    updateRfdActnInfoAjax : function (param) {
        
        this._ajax.sendRequest("POST"
            , _baseUrl + "mypage/updateRfdActnInfoJson.do"
            , param
            , mmypage.rfdActn.form.updateRfdActnInfoAjaxCallback
        );
    },
    /**
     *  등록 및 수정 callback 처리 함수
     */
    updateRfdActnInfoAjaxCallback : function (res) {
        var data = (typeof res !== 'object') ? $.parseJSON(res) : res;

        // 성공
        if(data.returnCd == '0000') {
        	// 배송지 등록시 생기는 환경변수 제거
			sessionStorage.removeItem("regDeliveryYn");
			
            alert("계좌 정보가 저장되었습니다.");
            sessionStorage.setItem("deliveryTab","1");
            document.location.href = _baseUrl + "mypage/getDeliveryInfo.do";
            
        // 로그인
        } else if(data.returnCd == '100') {
            alert("로그인이 필요합니다.");
            location.href = _secureUrl + "login/loginForm.do";
            
        // 은행서비스 운영시간이 아닌경우 
        } else if(data.returnCd == 'CA07') {
            alert(data.errorMsg);
        } else {
            alert(data.errorMsg);
        }
    },
    
    /**
     *  결제수단 점검 확인
     */
    checkRfdActnSystemJson : function (rfdBnkCd) {
        if(!!rfdBnkCd) {
            var param = {
                    rfdBnkCd : rfdBnkCd
            };
            
            this._ajax.sendRequest("POST"
                    , _baseUrl + "mypage/checkRfdActnSystemJson.do"
                    , param
                    , mmypage.rfdActn.form.checkRfdActnSystemJsonCallback
            );
        }
    },
    

    /**
     *  결제수단 점검 확인
     */
    checkRfdActnSystemJsonCallback : function (res) {
        var data = (typeof res !== 'object') ? $.parseJSON(res) : res;
            
        // 로그인
        if(data.returnCd == '100') {
            alert("로그인이 필요합니다.");
            location.href = _secureUrl + "login/loginForm.do";
            
        // 실패
        } else if(data.returnCd != '000' && !!data.errorMsg) {
            alert(data.errorMsg);
        }
    }
};