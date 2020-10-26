$.namespace("openEvent.BrandSale");
openEvent.BrandSale = {
	initSnsYn : false,
	run : true,
	month : null,
	day : null,
	hour : null,
	min : null,
	isRunChkTimer : true,
	
	init : function(){
		openEvent.BrandSale.initTimer();
		openEvent.BrandSale.runTimer();
		openEvent.BrandSale.bindEvent();
		openEvent.BrandSale.setLazyLoad();
	},
	
	bindEvent : function() {
		setTimeout(function() {
			//링크 처리
			common.bindGoodsListLink();
			
			/* 상품이미지 클릭 이벤트 - 상품상세로 이동 */
			$("#mmainHotdeal li .imgSmall").click(function(){
				eval($(this).parent().find(".area").attr("onclick"));
			});
		}, 100);
	},
	
	setLazyLoad : function(type) {
		common.setLazyLoad(type);
		
		setTimeout(function() {
			$(document).resize();
		}, 300);
	},
	
	/**
     * 오특 SNS 공유하기(EVT104)
     * 
	 * 코드 ID : 중복되지않게 설정
	 * 참조1:연결링크
	 * 참조2:공유제목
	 * 참조3:공유이미지
	 * 
	 * javascript:openEvent.BrandSale.shareSns('kakaotalk','','http://image.oliveyoung.co.kr/uploads/contents/201709/brandsale/oteuk_sns.png');
     */
    shareSns : function(type, snsTitle, targetImg){
        /*
         * type 값
         * kakaotalk
         * kakaostory
         * facebook
         */
    	if(snsTitle == undefined || snsTitle == null || snsTitle ==""){
    		snsTitle = $("#titConts2 .tit").text();
    	}
    	if(targetImg == undefined || targetImg == null || targetImg == ""){
			return;
		}
    	
		var snsShareUrl = _baseUrl + "snsShare.do?sndVal="+$("#dispCatNo").val();
        if(type == "kakaostory" || type == "kakaotalk" || type == "facebook"){
            if(!openEvent.BrandSale.initSnsYn){
                common.sns.init(targetImg, snsTitle, snsShareUrl);
                openEvent.BrandSale.initSnsYn = true;
            }
            
            common.sns.doShare(type);
        }
    },
	
	/**
	 * 타이머 초기 설정
	 */
	initTimer : function(){
		openEvent.BrandSale.month = Number($("#month").val());
		openEvent.BrandSale.day = Number($("#day").val());
		openEvent.BrandSale.hour = Number($("#hour").val());
		openEvent.BrandSale.min = Number($("#min").val());
		
		openEvent.BrandSale.setTimer();
	},
	
	/**
	 * 타이머 시간 설정
	 */
	setTimer : function(){
		$(".mdsale_time .time .box").eq(0).hide();
		$(".mdsale_time .time .box").eq(2).hide();
		
		for(var i=0; i<10; i++){
			$(".mdsale_time .time .box").removeClass("no_"+i);
			$(".mdsale_time .time .box").removeClass("no2_"+i);
		}
		
		// 월 설정
		var month = openEvent.BrandSale.month;
		if(month < 10){
			$(".mdsale_time .time .box").eq(1).addClass("no_"+month);
		} else {
			$(".mdsale_time .time .box").eq(0).addClass("no_"+parseInt(month/10));
			$(".mdsale_time .time .box").eq(1).addClass("no_"+(month%10));
			$(".mdsale_time .time .box").eq(0).show();
		}
		
		// 일 설정
		var day = openEvent.BrandSale.day;
		if(day < 10){
			$(".mdsale_time .time .box").eq(3).addClass("no_"+day);
		} else {
			$(".mdsale_time .time .box").eq(2).addClass("no_"+parseInt(day/10));
			$(".mdsale_time .time .box").eq(3).addClass("no_"+(day%10));
			$(".mdsale_time .time .box").eq(2).show();
		}
		
		// 시간 설정
		var hour = openEvent.BrandSale.hour;
		if(hour < 10){
			$(".mdsale_time .time .box").eq(4).addClass("no2_0");
			$(".mdsale_time .time .box").eq(5).addClass("no2_"+hour);
		} else {
			$(".mdsale_time .time .box").eq(4).addClass("no2_"+parseInt(hour/10));
			$(".mdsale_time .time .box").eq(5).addClass("no2_"+(hour%10));
		}
		
		// 분 설정
		var min = openEvent.BrandSale.min;
		if(min < 10){
			$(".mdsale_time .time .box").eq(6).addClass("no2_0");
			$(".mdsale_time .time .box").eq(7).addClass("no2_"+min);
		} else {
			$(".mdsale_time .time .box").eq(6).addClass("no2_"+parseInt(min/10));
			$(".mdsale_time .time .box").eq(7).addClass("no2_"+(min%10));
		}
	},
	
	/**
     * 스크립트 시간 체크 및 조정
     */
    chkTimer : function(){
    	if(!openEvent.BrandSale.isRunChkTimer){
    		return;
    	}
    	
    	// 익일 0시 0분 0초
    	var tomorrow = new Date();
    	tomorrow.setDate((tomorrow.getDate() + 1));
    	tomorrow.setHours(0);
    	tomorrow.setMinutes(0);
    	tomorrow.setSeconds(0);
    	
    	// 현재 *시 *분 0초
    	var current = new Date();
    	current.setSeconds(0);
    	
    	var expireTime = (tomorrow.getTime()-current.getTime());
    	var expireHour = parseInt(expireTime / 3600000);
    	var expireMin = parseInt((expireTime % 3600000) / 60000);
    	
    	if(expireHour != openEvent.BrandSale.hour || expireMin != openEvent.BrandSale.min){
//    		openEvent.BrandSale.month = (current.getMonth() + 1);
//    		openEvent.BrandSale.day = current.getDate();
//    		openEvent.BrandSale.hour = expireHour;
//    		openEvent.BrandSale.min = expireMin;
    		openEvent.BrandSale.syncServerTime();
    	}
    },
    
    // 서버 시간 동기화
    syncServerTime : function(){
    	openEvent.BrandSale.isRunChkTimer = false;
    	
    	common.Ajax.sendRequest("POST",_baseUrl + "open/chkTimeJson.do","",function(data){
			if(data != undefined && data != null){
				openEvent.BrandSale.month = Number(data.month);
				openEvent.BrandSale.day = Number(data.day);
				openEvent.BrandSale.hour = Number(data.hour);
				openEvent.BrandSale.min = Number(data.min);
				
				openEvent.BrandSale.setTimer();
				openEvent.BrandSale.isRunChkTimer = true;
			}
		});
    },
	
	/**
	 * 타이머 동작
	 */
	runTimer : function(){
		// 정각 1분에 runTimer 호출
		setTimeout(function(){openEvent.BrandSale.runTimer()}, (60 * 1000) - (new Date().getSeconds()*1000));
		
		if(openEvent.BrandSale.run) {
			// 첫 수행 시, 처음에는 시간설정이 되어있으므로 따로 설정안함
			openEvent.BrandSale.run = false;
		} else {
			// 시간 설정
			var month = openEvent.BrandSale.month;
			var day = openEvent.BrandSale.day;
			var hour = openEvent.BrandSale.hour;
			var min = openEvent.BrandSale.min;
			
			if((min-1) >= 0){
				min--;
				openEvent.BrandSale.min = min;
				
				if((hour-1) < 0){
					hour = 24;
					openEvent.BrandSale.hour = hour;
				}
			} else {
				min = 59;
				openEvent.BrandSale.min = min;
				
				if((hour-1) >= 0){
					hour--;
					openEvent.BrandSale.hour = hour;
				} else {
					hour = 23;
					openEvent.BrandSale.hour = hour;
				}
			}
			
			openEvent.BrandSale.setTimer();
			openEvent.BrandSale.isRunChkTimer = true;
			
			// 시간 동기화 (0분, 30분 서버 시간 동기화)
			if(min == 0 || min == 30){
				// 정각에는 reload
				if(hour == 24){
					location.reload();
				} else {
					openEvent.BrandSale.syncServerTime();
				}
			}
			
			// 단말 pause 시에 시간 멈출경우, 시간 체크
			openEvent.BrandSale.chkTimer();
		}
    },
};