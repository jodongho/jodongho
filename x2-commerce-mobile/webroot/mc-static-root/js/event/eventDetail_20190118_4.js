/**
 * 배포일자 : 2019.01.17 
 * 오픈일자 : 2019.01.18 
 * 이벤트명 : CJ ONE CPN
 */

$.namespace("monthEvent.detail");
monthEvent.detail = {
        
    init : function() {
        
        //1. 로그인 여부 바코드 노출
        if(common.isLogin()){
            
            // 1.1 바코드 사용 유무 확인
            monthEvent.detail.loginOfflineCpnUseChk();
            
        }else{
            // 2. 혹시나 해서 바코드 지움
            $('.box02').removeClass('on');
            $('.box01').addClass('on');
        };
        
        //2. 쿠폰 받기 버튼 누르는 경우
        $("#cpnDown").click(function(){
            monthEvent.detail.checkBarcode();
        });
        
        //3. 직원확인클릭
        $('#staffConfirm').click(function(){
            var isUseOk = confirm("직원 확인 이후 쿠폰사용 처리 되며, 재사용 불가합니다. \n사용하시겠습니까?");
            
            if(isUseOk){
                monthEvent.detail.confirmStaff();
            }else{
                return;
            }
        });
        
    },
    
    /**
     * 기능 : 올리브영 온라인몰 할인쿠폰 4000원 다운로드 쿠폰
     */
    chkDownCoupon : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }
        
        // 올리브영 온라인몰 할인쿠폰 4000원
        var cpnNo = "";
        if($("#profile").val() == "dev"){
            cpnNo = "g0CzCBI3VCai91dGDGyCYg==";
        }else if($("#profile").val() == "qa"){
            cpnNo = "g0CzCBI3VCai91dGDGyCYg==";
        }else if($("#profile").val() == "prod"){
            cpnNo = "g0CzCBI3VCa514qBt7khoA=="; //7799
        }
        
        // coupon download
        monthEvent.detail.downCouponJson(cpnNo);
    },
    
    /* 
     * 기능 : 1. 쿠폰  다운로드 
     * “모바일 앱에서만 다운 가능한 쿠폰입니다.”알럿>확인>앱분기>취소>알럿 닫고 페이지 유지
     */
    downCouponJson : function(cpnNo) {
        if(!mevent.detail.checkLogin()){
            return;
        }else{
            if(!mevent.detail.checkRegAvailable()){
                return;
            }
            if(typeof cpnNo == "undefined" || cpnNo == ""){
                alert("쿠폰 번호가 없습니다.");
                return;
            }
            var param = {cpnNo : cpnNo};
            common.Ajax.sendRequest(
                    "GET"
                    , _baseUrl + "event/downCouponJson.do"
                    , param
                    , this._callback_downOrdCouponJson
             );
        }
    },
    _callback_downOrdCouponJson : function(json) {
        if(json.ret == '0'){
            alert(json.message);
        }
    },
    
    // 2. 바코드 영역 확인부분
    checkBarcode : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }else{
            monthEvent.detail.offlineCpnUseChk();
//            $('.coupon_down').removeClass('on'); //쿠폰받기 클릭 버튼 삭제
//            $('.box01').removeClass('on'); // 쿠폰받기 클릭 배경 삭제
//            $('.box02').addClass('on'); // 바코드 영역 on
        }
    },
    
    // 3. 직원확인하기
    confirmStaff : function(){
        
        if(!mevent.detail.checkLogin()){
            return;
            
        }else{
            var fvrSeq = "1";
            
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                    , fvrSeq : fvrSeq
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                    , _baseUrl + "event/20190118_4/confirmStaff.do"
                    , param
                    , monthEvent.detail._callback_getStaffConfirmJson
            );
        }
    },
    // 3.2 직원확인하기
    _callback_getStaffConfirmJson : function(json){
        if(json.ret == "0"){
            $('.box02').removeClass('on'); // 바코드 영역 삭제
            $('.box03').addClass('on'); // 바코드 사용 완료 on
            
        }else{
            alert(message);
        }
    },
    
    // 4. 쿠폰 사용 유무 확인
    offlineCpnUseChk : function(){
        if(!mevent.detail.checkLogin()){
            return;
            
        }else{
            var fvrSeq = "1";
            
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                    , fvrSeq : fvrSeq
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                    , _baseUrl + "event/20190118_4/offlineCpnUseChk.do"
                    , param
                    , monthEvent.detail._callback_offlineCpnUseChkJson
            );
        }
    },
    // 4.1 쿠폰 사용 확인
    _callback_offlineCpnUseChkJson : function(json){
        if(json.ret == "0"){
            var offCpnAvailYn = json.offCpnAvailYn;
            
            if("Y" == offCpnAvailYn){
                $('.box01').removeClass('on'); // 바코드 다운받기 제거
                $('.box02').addClass('on'); // 바코드 on
            }else{
                $('.box01').removeClass('on'); // 바코드 다운받기 제거
                $('.box03').addClass('on'); // 바코드 사용완료 on
            }
            
        }else{
            alert(message);
        }
    },
    
    
    // 4. 쿠폰 사용 유무 확인 - 로그인시 체크 요청
    loginOfflineCpnUseChk : function(){
        if(!mevent.detail.checkLogin()){
            return;
            
        }else{
            var fvrSeq = "1";
            
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                    , fvrSeq : fvrSeq
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                    , _baseUrl + "event/20190118_4/offlineCpnUseChk.do"
                    , param
                    , monthEvent.detail._callback_loginOfflineCpnUseChk
            );
        }
    },
    // 4.1 쿠폰 사용 확인
    _callback_loginOfflineCpnUseChk : function(json){
        if(json.ret == "0"){
            var offCpnAvailYn = json.offCpnAvailYn;
            
            if("Y" == offCpnAvailYn){
                //$('.box01').removeClass('on'); // 바코드 다운받기 제거
                $('.box01').addClass('on'); // 바코드 on
            }else{
                $('.box01').removeClass('on'); // 바코드 다운받기 제거
                $('.box03').addClass('on'); // 바코드 사용완료 on
            }
            
        }else{
            alert(message);
        }
    },
};