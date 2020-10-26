$.namespace("SampleKitEventDetail.detail");
SampleKitEventDetail.detail = {
	_ajax : common.Ajax,
    mbrInfoUseAgrYn : "N",
    mbrInfoThprSupAgrYn : "N",

      initEvNo : function(){
      	SampleKitEventDetail.detail.evtNo = $("#evtNo").val();
      },
      
      init : function(){
		 $('.call').click(function(){
	            mstore.common.setCallEvent($(this));
	     });

	     $('#storeNoticeTit').find(':button').click(function(){
	            $(location).attr('href', _baseUrl + "counsel/getNoticeList.do?ntcClssCd=02");
	     });

	     $("#storeNoticeList li").click(function(){

	            var ntcSeq = $(this).find("input[name*='ntcSeq']" ).val();
	            $(location).attr('href', _baseUrl + "counsel/getNoticeDetail.do?ntcSeq="+ntcSeq);
	     });
	        
		
		$('.event_agree .tit > a').click(function(e){
			e.preventDefault();
			if($(this).parents('li').hasClass('on')){
				$(this).parents('li').removeClass('on');
			} else {
				$(this).parents('li').addClass('on').siblings().removeClass('on');
			}
		});
	},
	
	checkSampleKitJson : function(){

		//1. 로그인여부 체크
		if(!SampleKitEventDetail.detail.checkLogin()){
			return;
		}
		
		//2. 응모기간 체크
		if(!SampleKitEventDetail.detail.checkRegAvailable()){
			return;
		}
		
		//3. 매장선택 체크
		if(!SampleKitEventDetail.detail.checkStore()){
			return;
		}
		
		//4. 개인정보 수집동의 체크
		if(!SampleKitEventDetail.detail.checkAgrmInfo()){
			return;
		}
		
		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
			  , fvrSeq : "2"
			  , strNo : $("input[id='storeID']:hidden").val()
		      , mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn']:hidden").val()
			  , mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn']:hidden").val()
		};

		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "storeEvent/regSampleKitEventJson.do"
			  ,  param
			  , SampleKitEventDetail.detail._callback_checkSampleKitJson
		);
	},
	_callback_checkSampleKitJson : function(json){
		var url = location.href;
		var noticeDay = $("input[id='noticeDay']:hidden").val();
		var getSampleNote = $("input[id='getSampleNote']:hidden").val();
		
		if(json.ret == "0"){
			alert("이벤트 응모에 정상적으로 신청되었습니다.  \n" +noticeDay+"\n"+ getSampleNote);
			location.href = url;
		}else{
			alert(json.message);
		}
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
    checkRegAvailable : function() {
        var regYn = $.trim($("#regYn").val());
        if(regYn == 'N'){
            alert("현재 이벤트 응모 기간이 아닙니다.");
            return false;
        }
        return true;
    },
    checkStore : function() {
        var storeID = $.trim($("input[id='storeID']:hidden").val());
        var storeNM = $("#storeNmList").val();
        
        if(storeID == ''){
        	alert("항목을 빠짐없이 선택 후, 신청해 주세요. ");
            return false;
        }if (storeNM == ''){
        	alert("항목을 빠짐없이 선택 후, 신청해 주세요. ");
        	return false;
    	}if (storeNM == 'none'){
    		alert("항목을 빠짐없이 선택 후, 신청해 주세요. ");
    		return false;
		}
        return true;
    },
	/* 개인정보 필수값 체크 */
    checkAgrmInfo : function(){
        var regYn = $.trim($("#regYn").val());
        var mbrInfoUseAgrYn = $.trim($("#mbrInfoUseAgrYn").val());

        if(regYn == 'Y' && mbrInfoUseAgrYn == 'Y'){

            if(!$("#chk01").is(":checked")){
                alert("개인정보 수집동의 항목에 동의해 주세요. ");
                return false;
            }else{
            	SampleKitEventDetail.detail.mbrInfoUseAgrYn = 'Y';
            }
        }else{
        	SampleKitEventDetail.detail.mbrInfoUseAgrYn = 'N';
        }
            
        return true;
    },
  itemChange : function(){
    	
    	var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
		};
    	
    	this._ajax.sendJSONRequest(
    				"POST"
					, _baseUrl + "storeEvent/getEvtTgtrStrMainAreaList.do"
    				, param
    				, this._callback_getEvtTgtrStrMainAreaListAjax
        );
    },
    _callback_getEvtTgtrStrMainAreaListAjax : function(retData) {
        SampleKitEventDetail.detail.makeSelectboxList1($("#mainAreaList"),_optionRgn1,retData);
    },
    makeSelectboxList1 :  function(area, title, list){
        var dispArea = area;
        var dispList = list;
        var rgn1Selected = area.attr("data-rgn1");
        
        var $option = $("<option>");
        $option.val("none").text(title).prop("selected",true);

        dispArea.empty().append($option);

        $.each(dispList, function(index, element){
            $option = $("<option>");
            $option.val(element).text(element);
            if(!common.isEmpty(rgn1Selected)){
                if(rgn1Selected == element){
                    $option.prop("selected", "true");
                }
            }
            dispArea.append($option);
        });
        SampleKitEventDetail.detail.itemChange1();
    },
    itemChange1 : function(){
    	
    	var rgn1 = $("#mainAreaList option:selected").val();
    	
    	var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
			  , rgn1 : $("#mainAreaList").val()
		};
    	
    	this._ajax.sendJSONRequest(
    				"POST"
					, _baseUrl + "storeEvent/getEvtTgtrStrSubAreaList.do"
    				, param
    				, this._callback_getTgtrSubAreaListAjax
        );
    },
    _callback_getTgtrSubAreaListAjax : function(retData) {
        SampleKitEventDetail.detail.makeSelectboxList2($("#subAreaList"),_optionRgn2,retData);
    },
    makeSelectboxList2 :  function(area, title, list){
        var dispArea = area;
        var dispList = list;
        
        var rgn1Selected = $("#mainAreaList").attr("data-rgn1");
        var rgn1 = $("#mainAreaList option:selected").val();
        
        var rgn2Selected = area.attr("data-rgn2");
        
        var $option = $("<option>");
        $option.val("none").text(title).prop("selected",true);

        dispArea.empty().append($option);

        $.each(dispList, function(index, element){
            $option = $("<option>");
            $option.val(element).text(element);
            if(!common.isEmpty(rgn2Selected)){
            	//지역이 다르지만 시/군/구가 동일한 명칭이 있는경우를 default값으로 세팅 하기 위해 비교
            	//서울특별시 - 중구 - 정동점으로 페이지 유입이 된 후 > 대전광역시를 클릭 하였을 때, 동일 시/군/구인 중구가 아니라 default로 셋팅
            	if(rgn1Selected == rgn1){
            		if(rgn2Selected == element){
            			$option.prop("selected",true);
            		}
            	}
            }
            
            dispArea.append($option);
        });
        SampleKitEventDetail.detail.itemChange2();
    },
 itemChange2 : function(){
 		var rgn2 = $("#subAreaList option:selected").val();
 	
    	var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
			  , rgn1 : $("#mainAreaList").val()
			  , rgn2 : $("#subAreaList").val()
		};
    	
            this._ajax.sendJSONRequest(
                    "POST"
                    , _baseUrl + "storeEvent/getEvtTgtrStrNmList.do"
                    , param
                    , this._callback_getTgtrStrNmListAjax
            );
    },
    _callback_getTgtrStrNmListAjax : function(retData) {
        SampleKitEventDetail.detail.makeSelectboxList3($("#storeNmList"),_optionRgn3,retData);
    },
    makeSelectboxList3 :  function(area, title, list){
        var dispArea = area;
        var dispList = list;
        var rgn3Selected = area.attr("data-rgn3");
        
        var $option = $("<option>");
        $option.val("none").text(title).prop("selected",true);

        dispArea.empty().append($option);

        $.each(dispList, function(index, element){
            $option = $("<option>");
            $option.val(element.strNo).text(element.strNm);
            if(!common.isEmpty(rgn3Selected)){
                if(rgn3Selected == element.strNo){
                    $option.prop("selected",true);
                }
            }
            dispArea.append($option);
        });
    },
    itemChange3 : function(){
    	  var _evtNo = $("input[id='evtNo']:hidden").val();
    	
    	  var rgn1 = $("#mainAreaList option:selected").val();
          var rgn2 = $("#subAreaList option:selected").val();
          var strNo = $("#storeNmList option:selected").val();
          
         
          var sRgn1  = encodeURIComponent(rgn1);
          var sRgn2  = encodeURIComponent(rgn2);
          
          if (strNo != 'none'){
      		location.href = _baseUrl + "storeEvent/getSampleKitStoreEventDetail.do?evtNo="+_evtNo+"&rgn1="+sRgn1+"&rgn2="+sRgn2+"&strNo="+strNo;
          }
    },
    itemSearchStrChange : function(){
  	  var _evtNo = $("input[id='evtNo']:hidden").val();
  	
  	  	var rgn1 = $("#mainAreaList option:selected").val();
        var rgn2 = $("#subAreaList option:selected").val();
        var strNo = $("#storeNmList option:selected").val();
        
        
        var sRgn1  = encodeURIComponent(rgn1);
        var sRgn2  = encodeURIComponent(rgn2);
        
        if (strNo != 'none'){
      		location.href = _baseUrl + "storeEvent/getSampleKitStoreSerch2.do?evtNo="+_evtNo+"&rgn1="+sRgn1+"&rgn2="+sRgn2+"&strNo="+strNo;
        }
  },
  mapApInit : function(x,y){
      if(!common.isEmpty(x) && !common.isEmpty(y)){
          var mapContainer = document.getElementById('map') // 지도 영역
          var mapOption = {
                  center: new daum.maps.LatLng(x, y), // 지도 중심좌표(위도,경도)
                  level: 3 // 지도 확대 레벨
              };
          var map = new daum.maps.Map(mapContainer, mapOption); // 지도 생성
          var markerImage = new daum.maps.MarkerImage(_cssUrl + '../image/comm/marker_place_off.png' , new daum.maps.Size(24, 35)); // 마커 이미지 생성
          var markerPosition = new daum.maps.LatLng(x, y); // 마커 위치
          var marker = new daum.maps.Marker({
              map: map, // 마커를 표시할 지도
              position: markerPosition, // 마커를 표시할 위치
              image : markerImage // 마커 이미지
          });
          marker.setMap(map); // 마커 표시
      }
  }
};