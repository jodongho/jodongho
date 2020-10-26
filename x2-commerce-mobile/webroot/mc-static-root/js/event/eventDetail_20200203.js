/**
 * 이벤트명 : 오늘드림 소문내기
 */
$.namespace("monthEvent.detail");
monthEvent.detail = {
    snsInitYn : "N",
    layerPolice : false,
    zipcode : "",
    road_address : "",
    jibun_address : "",
    extra_address : "",
    selected_type : "",
    themeObj : { // 다음 API 색상 설정
            bgColor: "#FFFFFF", //바탕 배경색
            postcodeTextColor: "#9BCE26", //우편번호 글자색
            emphTextColor: "#333333" //강조 글자색
    },
    init : function(){
        var eventSlide_set = {
                slidesPerView: 1,
                initialSlide : 0,
                autoplay: 4000,
                pagination: '.paging',
                nextButton: '.next',
                prevButton: '.prev',
                autoplayDisableOnInteraction: true,
                paginationClickable: true,
                freeMode: false,
                spaceBetween: 0,
                loop: true
        }, visual_swiper = Swiper('.slideType1', eventSlide_set );
        
        $('.todayTime span.counter').attr('data-count', $('#evtTodayTime').val());
        $('.todayUser span.counter').attr('data-count', $('#evtTodayUser').val());
        $('.todayItem span.counter').attr('data-count', $('#evtTodayItem').val());
        
        // 우편번호 찾기 화면을 넣을 element
        monthEvent.detail.addrPop = document.getElementById('postLayer');
        
        monthEvent.detail.fnButtonEvent();
    },
    fnButtonEvent : function() {
        $(".btnSearch_area").unbind("click").click(function(event){
            event.preventDefault();
            if (common.app.appInfo != undefined && common.app.appInfo.isapp) {
                monthEvent.detail.initDaumMapApp();
            }else{
                monthEvent.detail.initDaumMap();
            }
        });
        $(".btn_adressAdd1").unbind("click").click(function(event){// 오늘드림 주문 가능지역 - 배송지 등록버튼
            event.preventDefault();
            mevent.detail.eventCloseLayer();
            
            var url = _baseUrl + "event/20200203/getDeliveryRegistFormAjax.do";
            // 조회한 주소정보를 저장한다
            var data = {
                    zipcode : monthEvent.detail.zipcode
                    , road_address : monthEvent.detail.road_address
                    , jibun_address : monthEvent.detail.jibun_address
                    , extra_address : monthEvent.detail.extra_address
                    , selected_type : monthEvent.detail.selected_type
                    };
            common.Ajax.sendRequest("POST", url, data, common.zipcodequick.pop._callBackDeliveryRegistForm);
        });
        $(".btn_adressAdd2").unbind("click").click(function(event){// 오늘드림 주문 불가지역 - 다시검색버튼
            event.preventDefault();
            mevent.detail.eventCloseLayer();
            if (common.app.appInfo != undefined && common.app.appInfo.isapp) {
                monthEvent.detail.initDaumMapApp();
            }else{
                monthEvent.detail.initDaumMap();
            }
        });
    },
    initDaumMap : function () {
        if(!mevent.detail.checkLogin()){
            return;
        }
        new daum.Postcode({
            theme: monthEvent.detail.themeObj,
            showMoreHName : true,
            oncomplete: function(data) {
                // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.
                //검색결과 데이터 초기화
                monthEvent.detail.zipcode = "";
                monthEvent.detail.road_address = "";
                monthEvent.detail.jibun_address = "";
                monthEvent.detail.extra_address = "";
                monthEvent.detail.selected_type = "";
				var emdNm = "";
				var admrNm = "";
             // 각 주소의 노출 규칙에 따라 주소를 조합한다.
                // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
                var addr = ''; // 주소 변수
                var extraAddr = ''; // 참고항목 변수
                
                //법정동, 행정동 동/리 구분
                if(data.bname1 == ''){ //동 지역
                	emdNm = data.bname;
                	if(data.hname == ''){
                		admrNm = data.bname;
                	} else {
                		admrNm = data.hname;
                	}
                } else {
                	emdNm = data.bname1 + ' ' + data.bname2;
                	if(data.hname == ''){
                		admrNm = data.bname1;
                	} else {
                		admrNm = data.hname;
                	}
                }
                //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
                if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                    addr = data.roadAddress;
                } else { // 사용자가 지번 주소를 선택했을 경우(J)
                    addr = data.jibunAddress;
                }

                // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
                if(data.userSelectedType === 'R'){
                    // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                    // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                    if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                        extraAddr += data.bname;
                    }
                    // 건물명이 있고, 공동주택일 경우 추가한다.
                    if(data.buildingName !== '' && data.apartment === 'Y'){
                        extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                    }
                    // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                    if(extraAddr !== ''){
                        extraAddr = ' (' + extraAddr + ')';
                    }
                    // 조합된 참고항목을 해당 필드에 넣는다.
                    monthEvent.detail.extra_address = extraAddr;
                
                } else {
                    monthEvent.detail.extra_address = '';
                }

                // 우편번호와 주소 정보를 해당 필드에 넣는다.
                monthEvent.detail.zipcode = data.zonecode;
                monthEvent.detail.road_address = data.roadAddress;
                monthEvent.detail.jibun_address = data.jibunAddress;
                monthEvent.detail.selected_type = data.userSelectedType;
                
                var param = {zipcode : monthEvent.detail.zipcode
                 			 ,admrNm : admrNm
		 					,emdNm : emdNm
                			};
                var url = _baseUrl + "event/20200203/getZipcodeCheckJson.do";
                common.Ajax.sendRequest(
                        "POST"
                        ,url
                        ,param
                        ,function(data){
                            
                    var res = (typeof data !== 'object') ? $.parseJSON(data) : data;
                    if(res.message == "succ"){
                        if(res.result > 0){ //오늘드림 주문 가능지역
                            mevent.detail.eventShowLayer('popTodaySearch1');
                        }else{// 오늘드림 주문 불가지역
                            mevent.detail.eventShowLayer('popTodaySearch2');
                        }
                    }else{//error
                        alert("오늘드림 이용 가능지역 조회중 오류가발생했습니다.");
                    }
                });
                
            }
        }).open({
            popupName : "postcodePopup"
        });
    }, 
    initDaumMapApp : function () {
        if(!mevent.detail.checkLogin()){
            return;
        }
        $('#eventDimLayer').show();
        new daum.Postcode({
            theme: monthEvent.detail.themeObj,
            showMoreHName : true,
            oncomplete: function(data) {
             // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.
                //검색결과 데이터 초기화
                monthEvent.detail.zipcode = "";
                monthEvent.detail.road_address = "";
                monthEvent.detail.jibun_address = "";
                monthEvent.detail.extra_address = "";
                monthEvent.detail.selected_type = "";
                var emdNm = "";
				var admrNm = "";
             // 각 주소의 노출 규칙에 따라 주소를 조합한다.
                // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
                var addr = ''; // 주소 변수
                var extraAddr = ''; // 참고항목 변수

                //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
                if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                    addr = data.roadAddress;
                } else { // 사용자가 지번 주소를 선택했을 경우(J)
                    addr = data.jibunAddress;
                }
                
              //법정동, 행정동 동/리 구분
                if(data.bname1 == ''){ //동 지역
                	emdNm = data.bname;
                	if(data.hname == ''){
                		admrNm = data.bname;
                	} else {
                		admrNm = data.hname;
                	}
                } else {
                	emdNm = data.bname1 + ' ' + data.bname2;
                	if(data.hname == ''){
                		admrNm = data.bname1;
                	} else {
                		admrNm = data.hname;
                	}
                }
                
                // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
                if(data.userSelectedType === 'R'){
                    // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                    // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                    if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                        extraAddr += data.bname;
                    }
                    // 건물명이 있고, 공동주택일 경우 추가한다.
                    if(data.buildingName !== '' && data.apartment === 'Y'){
                        extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                    }
                    // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                    if(extraAddr !== ''){
                        extraAddr = ' (' + extraAddr + ')';
                    }
                    // 조합된 참고항목을 해당 필드에 넣는다.
                    monthEvent.detail.extra_address = extraAddr;
                
                } else {
                    monthEvent.detail.extra_address = '';
                }

                // 우편번호와 주소 정보를 해당 필드에 넣는다.
                monthEvent.detail.zipcode = data.zonecode;
                monthEvent.detail.road_address = data.roadAddress;
                monthEvent.detail.jibun_address = data.jibunAddress;
                monthEvent.detail.selected_type = data.userSelectedType;
                
                var param = {
                			zipcode : monthEvent.detail.zipcode
                			,admrNm : admrNm
                			,emdNm : emdNm		
                			};
                var url = _baseUrl + "event/20200203/getZipcodeCheckJson.do";
                common.Ajax.sendRequest(
                        "POST"
                        ,url
                        ,param
                        ,function(data){
                            
                    var res = (typeof data !== 'object') ? $.parseJSON(data) : data;
                    if(res.message == "succ"){
                        if(res.result > 0){ //오늘드림 주문 가능지역
                            mevent.detail.eventShowLayer('popTodaySearch1');
                        }else{// 오늘드림 주문 불가지역
                            mevent.detail.eventShowLayer('popTodaySearch2');
                        }
                    }else{//error
                        alert("오늘드림 이용 가능지역 조회중 오류가발생했습니다.");
                    }
                });
                
                // iframe을 넣은 element를 안보이게 한다.
                // (autoClose:false 기능을 이용한다면, 아래 코드를 제거해야 화면에서 사라지지 않는다.)
                monthEvent.detail.addrPop.style.display = 'none';
            },
            width : '100%',
            height : '100%',
            maxSuggestItems : 5
        }).embed(monthEvent.detail.addrPop);

        // iframe을 넣은 element를 보이게 한다.
        monthEvent.detail.addrPop.style.display = 'block';

        // iframe을 넣은 element의 위치를 화면의 가운데로 이동시킨다.
        monthEvent.detail.initLayerPosition();
    },
    // 브라우저의 크기 변경에 따라 레이어를 가운데로 이동시키고자 하실때에는
    // resize이벤트나, orientationchange이벤트를 이용하여 값이 변경될때마다 아래 함수를 실행 시켜 주시거나,
    // 직접 element_layer의 top,left값을 수정해 주시면 됩니다.
    initLayerPosition : function(){
        monthEvent.detail.addrPop.style.width = '100%';
        monthEvent.detail.addrPop.style.height = '100%';
        monthEvent.detail.addrPop.style.border = '3px solid #000';
        monthEvent.detail.addrPop.style.top = "0px";
    },

    closeDaumPostcode : function(){
        // iframe을 넣은 element를 안보이게 한다.
        monthEvent.detail.addrPop.style.display = 'none';
        $('#eventDimLayer').hide();
    },
    rollingNumber : function() {
        $('.counter').each(function() {
            var $this = $(this),
            countTo = $this.attr('data-count').replace(/,/g, '');
    
        $({ countNum: $this.text() }).animate({
            countNum: countTo}, 
            {
                duration: 1000,
                easing: 'linear',
                step: function() {
                $this.text(monthEvent.detail.numberWithCommas(Math.floor(this.countNum)));
            },
                complete: function() {
                $this.text(monthEvent.detail.numberWithCommas(this.countNum));
            }
            });
        });
    },

    numberWithCommas : function(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
};

//스크롤 다운시 활성화
$(window).scroll( function(){
    if($('.counter:eq(0)').text() == '0'){
        $('.evtCon01').each( function(){
            var bottom_of_object = $(this).offset().top + $(this).outerHeight()-($(this).outerHeight()/2);
            var bottom_of_window = $(window).scrollTop() + $(window).height(); 
            if( bottom_of_window > bottom_of_object ){
                monthEvent.detail.rollingNumber();  
            } else {
            }
        });
    }
});

  
