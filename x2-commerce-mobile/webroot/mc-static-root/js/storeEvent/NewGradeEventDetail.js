$.namespace("VIPEvent.detail");
VIPEvent.detail = {
	_ajax : common.Ajax,
	snsInitYn : "N",
    mbrInfoUseAgrYn : "N",
    mbrInfoThprSupAgrYn : "N",

	init : function(){
		$('.agree_tit > a').click(function(e){
			e.preventDefault();
			$(this).parents('.agree_box').toggleClass('show');
		});
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
    searchMyGradeJson : function(){
    	
    	//1. 로그인여부 체크
		if(!VIPEvent.detail.checkLogin()){
			return;
		}
    	
		$('.event-btn').attr('style','display:none');
		
    	var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
		};
    	
    	this._ajax.sendJSONRequest(
    				"POST"
					, _baseUrl + "storeEvent/searchMyGradeJson.do"
    				, param
    				, this._callback_getsearchMyGradeAjax
        );
    },
    _callback_getsearchMyGradeAjax : function(json) {
    	if(json.ret == "2"){
    		var staffYn = json.staffYn;
    		var mbrPay = json.mbrPay;
    		
    		var percent = 0; //바 퍼센트 표시
			var Pay = mbrPay;   //바 퍼센트 계산을 위한 포인트 가져옴
			var memPay = mbrPay; //금액 3자리수 , 표시를 위함
			var nextGradePay = 0; //다음 등급 달성까지 잔여 실적
			
			var greenOlive = 400000;
			var blackOlive = 700000;
			var goldOlive = 1000000;
			
    		
			//1. 고객 이름 표시
			$("#memName").text($("input[id='mbrNm']:hidden").val());
			
			//2. 고객 예정 등급 및 다음 등급 달성 까지 잔여 실적
			if(mbrPay>=greenOlive && mbrPay < blackOlive){
				$("#mbrGrade").text('Green Olive');
				nextGradePay = blackOlive - mbrPay;
			}else if(mbrPay>=blackOlive && mbrPay < goldOlive){
				$("#mbrGrade").text('Black Olive');
				nextGradePay = goldOlive - mbrPay;
			}else if(mbrPay>=goldOlive){
				$("#mbrGrade").text('Gold Olive');
				nextGradePay = 0;
			}else{
				$("#mbrGrade").text('Baby Olive');
				nextGradePay = greenOlive - mbrPay;
			}
			
			nextGradePay = nextGradePay.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			$("#nextGradePay").text(nextGradePay); // 다음 등급  잔여 실적
			
			//3. 임직원 공지 내용 표기 
			if(staffYn == "Y"){
				$('.staff-notice').attr('style','display:block');
			}
			
			//4.금액 3자리수 , 표시
			memPay = memPay.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			$("#mbrPay").text(memPay);
    		
			//5.포인트 바 계산
			percent = (Pay/1000000) * 100;
			$('.grade-bg').find('span').css('width', percent+'%');

			$('.logincheck').attr('style','display:none');
			$('.login').attr('style','display:block');

		}else{
			alert(json.message);
			$('.event-btn').attr('style','display:block');
		}
    },
};