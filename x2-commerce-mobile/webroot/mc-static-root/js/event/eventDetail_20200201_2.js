/**
 * 배포일자 : 2020.01.30
 * 오픈일자 : 2020.02.01
 * 이벤트명 : 오늘드림 1주차 포인트 지급 (배송지)
 * */
$.namespace("monthEvent.detail");
monthEvent.detail = {
    baseImgPath : _cdnImgUrl + "contents/202002/01todaySearch/",
    endDt : '',
    currDt : '',
    addrPop : '',
    init : function(){
        monthEvent.detail.endDt = $('#reCommend').val();
        monthEvent.detail.currDt = $('#imgUrlConnectDay').val();

        // 우편번호 찾기 화면을 넣을 element
        monthEvent.detail.addrPop = document.getElementById('postLayer');

        //우편번호 검색 팝업
        $('.evtCon01 .btnSearch_area').click(function() {
            monthEvent.detail.applyAddrCheck();
        });
        $('#evtPoint1 .conts_inner div.btn_today').click(function() {
            monthEvent.detail.getAddressInfo();
        });

        //닫기 X
        $('#postLayer #btnCloseLayer').click(function() {
            monthEvent.detail.closeDaumPostcode();
        });
    },

    /* 응모 가능 조회 */
    applyAddrCheck : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }else{
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
            }
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20200201_2/applyAddrCheck.do"
                  , param
                  , monthEvent.detail._callback_applyAddrCheck
            );
        }
    },

    _callback_applyAddrCheck : function(json){
        mevent.detail.eventCloseLayer();
        if(json.ret == '0'){
            monthEvent.detail.getAddressInfo();
        }else if(json.ret == '039'){
            if(monthEvent.detail.currDt < monthEvent.detail.endDt){
                alert('선착순이 마감되었습니다.\n내일 다시 참여해주세요!');
            }else{
                alert('선착순이 마감되었습니다.');
            }
        }else {
            alert(json.message);
        }
    },

    getAddressInfo : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }
        $('#eventDimLayer').show();
        new daum.Postcode({
            oncomplete: function(data) {
                // 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

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
                }

                //주소 | 참고항목 | 우편번호
                $('#noteCont').val(data.zonecode);
                monthEvent.detail.applyAddr();

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

    /* 응모하기 */
    applyAddr : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }else{
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val(),
                    noteCont : $("input[id='noteCont']:hidden").val()
            }
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20200201_2/applyAddr.do"
                  , param
                  , monthEvent.detail._callback_applyAddr
            );
        }
    },

    _callback_applyAddr : function(json){
        if(json.ret == '039'){
            $('#eventDimLayer').hide();
            if(monthEvent.detail.currDt < monthEvent.detail.endDt){
                alert('선착순이 마감되었습니다.\n내일 다시 참여해주세요!');
            }else{
                alert('선착순이 마감되었습니다.');
            }
        }else{
            if(json.ret == '0'){
                $('#evtPoint1 .inner h6 img').attr('src', monthEvent.detail.baseImgPath + 'pop_tit01.png');
            }else if(json.ret == '013'){
                $('#evtPoint1 .inner h6 img').attr('src', monthEvent.detail.baseImgPath + 'pop_tit02.png');
            }
            if(json.deliveryYn == 'Y'){
                $('#evtPoint1 .conts_inner').children('p:eq(0), a.btn_today').show();
                $('#evtPoint1 .conts_inner').children('p:eq(1), div.btn_today').hide();
            }else{
                $('#evtPoint1 .conts_inner').children('p:eq(0), a.btn_today').hide();
                $('#evtPoint1 .conts_inner').children('p:eq(1), div.btn_today').show();
            }
            mevent.detail.eventShowLayer('evtPoint1');
        }
    }
}