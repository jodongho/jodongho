_ajax = common.Ajax;

$.namespace('mcommon.popup.zipcodeApi');
mcommon.popup.zipcodeApi = {
       
        fnCallback : '',
        
        selectZipcodeData : '',
        
        init : function(_callback){      
            mcommon.popup.zipcodeApi.initCallBack(_callback);
        },
        
        initCallBack : function(_callback){
            mcommon.popup.zipcodeApi.fnCallback = _callback; 
        },
        
        initMap : function(popYn){
            
            var element_layer = '';
            
            if(popYn !== '' && popYn == 'N'){
                element_layer = document.getElementById('LAYERPOP01-contents-quick');
                element_layer.style.position = 'relative';
            } else {
                element_layer = document.getElementById('pop-full-contents');
                element_layer.style.position = 'relative';
                element_layer.style.WebkitOverflowScrolling  = 'touch';
                element_layer.style.overflow = 'auto';
            }
            
            /*var width = 450; //우편번호서비스가 들어갈 element의 width
            var height = 500; //우편번호서비스가 들어갈 element의 height
            var borderWidth = 5; //샘플에서 사용하는 border의 두께

            // 위에서 선언한 값들을 실제 element에 넣는다.
            element_layer.style.width = width + 'px';
            element_layer.style.height = height + 'px';
            element_layer.style.border = borderWidth + 'px solid';*/
            
            var themeObj = {
                    bgColor: "#FFFFFF", //바탕 배경색
                    searchBgColor: "#FFFFFF", //검색창 배경색
                    contentBgColor: "#FFFFFF", //본문 배경색(검색결과,결과없음,첫화면,검색서제스트)
                    //pageBgColor: "", //페이지 배경색
                    //textColor: "", //기본 글자색
                    //queryTextColor: "", //검색창 글자색
                    postcodeTextColor: "#9BCE26", //우편번호 글자색
                    emphTextColor: "#333333" //강조 글자색
                    //outlineColor: "", //테두리
                 };
            
            var currentScroll = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
            
            new daum.Postcode({
                oncomplete: function(data) {
                    // 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.
                    // 각 주소의 노출 규칙에 따라 주소를 조합한다.
                    // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
                    var extraAddr = ''; // 참고항목 변수
                    var emdNm = ''; //법정동
                    var admrNm = ''; //행정동
                    
                    // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                    // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                    if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                        extraAddr += data.bname;
                    }
                    // 건물명이 있고, 공동주택일 경우 추가한다.
                    if(data.buildingName !== ''){    
                        extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                    }
                    // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                    if(extraAddr !== ''){
                        extraAddr = ' (' + extraAddr + ')';
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
                    
                    data.extraAddr = extraAddr;
                    data.postNo = data.zonecode;
                    data.postNo1 = data.zonecode;
                    data.postNo2 = '';
                    data.lotAddr1 = '';
                    data.lotAddr2 = '';
                    data.roadAddr1 = '';
                    data.roadAddr2 = '';
                    //법정동, 행정동 추가 
                    data.emdNm = emdNm;
                    data.admrNm  = admrNm;
                    
                    if(data.jibunAddress !== ''){
                        data.lotAddr1 = data.jibunAddress;
                    } else {
                        data.lotAddr1 = data.autoJibunAddress;
                    }
                    if(data.roadAddress !== ''){
                        data.roadAddr1 = data.roadAddress+data.extraAddr;
                    } else {
                        data.roadAddr1 = data.autoRoadAddress+data.extraAddr;
                    }

                    if(common.zipcodequick.pop.quickYn == 'Y'){
                        
                        mcommon.popup.zipcodeApi.selectZipcodeData = data;
                        
                        mcommon.popup.zipcodeApi.quickStrYn(data);
                        
                    } else {
                        if(typeof mcommon.popup.zipcodeApi.fnCallback != 'function') return;
                        
                        mcommon.popup.zipcodeApi.fnCallback(data);
                        
                        common.popFullClose();
                    }
                    
                    document.body.scrollTop = currentScroll;
                    
               },
               /*onresize : function(size) {
                   element_layer.style.height = size.height+'px';
               },*/
               width : '100%',
               height : '100%',
               maxSuggestItems : 5,
               showMoreHName : true,
            theme: themeObj,
            
            }).embed(element_layer, {autoClose : false});

            
            // iframe을 넣은 element를 보이게 한다.
            //element_layer.style.display = 'block';

            // iframe을 넣은 element의 위치를 화면의 가운데로 이동시킨다.
            mcommon.popup.zipcodeApi.initLayerPosition(element_layer);
            
            
        },
        
        initLayerPosition : function(element_layer){
            var width = 100; //우편번호서비스가 들어갈 element의 width
            var height = 100; //우편번호서비스가 들어갈 element의 height
            //var borderWidth = 5; //샘플에서 사용하는 border의 두께

            // 위에서 선언한 값들을 실제 element에 넣는다.
            element_layer.style.width = width + '%';
            element_layer.style.height = height + 'vh';
            //element_layer.style.border = borderWidth + 'px solid';
            // 실행되는 순간의 화면 너비와 높이 값을 가져와서 중앙에 뜰 수 있도록 위치를 계산한다.
            //element_layer.style.left = (((window.innerWidth || document.documentElement.clientWidth) - width)/2 - borderWidth) + 'px';
            //element_layer.style.top = (((window.innerHeight || document.documentElement.clientHeight) - height)/2 - borderWidth) + 'px';
        },
        
        /** 당일배송 가능 지역 확인 **/
        quickStrYn : function(obj){
            var url = _baseUrl + "goods/getTodayDeliveryStrAjax.do";
            var data ={atmpNm : obj.atmpNm, skkNm : obj.skkNm, admrNm : obj.emdNm, emdNm : obj.emdNm2, postNo : obj.zonecode};
            common.Ajax.sendRequest("POST",url,data,mcommon.popup.zipcodeApi._callBackQuickStrYn);
        },
        
        /** 당일배송 가능 지역 확인 콜백 **/
        _callBackQuickStrYn : function(res){

            if(res.trim().indexOf('Y') != -1){
                if(typeof mcommon.popup.zipcodeApi.fnCallback != 'function') return;
                
                mcommon.popup.zipcodeApi.fnCallback(mcommon.popup.zipcodeApi.selectZipcodeData);
                
                common.popLayerClose('searchZipcode');

                
            } else {
                alert('고객님 죄송합니다. 선택하신 배송지는 오늘드림 서비스 지역이 아닙니다.');
            }
        }
        
};