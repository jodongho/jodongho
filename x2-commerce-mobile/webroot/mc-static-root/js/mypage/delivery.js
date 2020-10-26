_ajax = common.Ajax;

$.namespace('mmypage.deliveryList');
mmypage.deliveryList = {
        init : function(){
            
            $('#go-back').click(function(){
                history.back(); 
            });
            
            //탭 컨텐츠 show/hide
            $('#mTab').find('a').on({'click' : function(e){
                    e.preventDefault();
                    
                    if($(this).parent().index() == 1){
                        // 환불계좌
                        if($("#rfdActn").html().indexOf('div') < 0){
                            if (!common.loginChk()) {
                                return ;
                            }
                            
                            mmypage.deliveryList.getRfdActnInfo();
                        }
                    }
                    $(this).parent().addClass('on').attr('title', '현재 선택된 메뉴').siblings().removeClass('on').removeAttr('title');
                    $('.tab_contents:eq('+ $(this).parent().index() +')').removeClass('hide').siblings('.tab_contents').addClass('hide');
                }
            });
            $('.tabList01 > li').each(function(){
                if(!$(this).hasClass('on')){
                    $('.tab_contents:eq('+ $(this).index() +')').addClass('hide');
                }
            });
            // 해시 tab=1인 경우 환불계좌 탭 이동
            mmypage.deliveryList.setTabSelect();
        },
        
        checkDlvpTotalCount : function(){
            _ajax.sendJSONRequest('GET'
                    ,_baseUrl + 'mypage/getDlvpTotalCountJSON.do'
                    ,{}
                    ,mmypage.deliveryList.getDlvpTotalCountJSONCallback
                    ,false
            );  
        },
        
        getDlvpTotalCountJSONCallback : function(res){
            var data = (typeof res !== 'object') ? $.parseJSON(res) : res;
            
            if(Number(data) >= 20){
                alert(MESSAGE.DLVP_COUNT_MAX);
                return;
            }
                
            $(location).attr('href', _baseUrl + 'mypage/deliveryRegistForm.do');
        },
        
        setTabSelect : function(){
            var deliveryTab = sessionStorage.getItem("deliveryTab");
            
            if(deliveryTab !== null && deliveryTab == "1"){
                $('#mTab a:eq(1)').click();
                sessionStorage.removeItem("deliveryTab");
            }
        },
        
        getDlvpSeq : function(obj){
          return $(obj).parent().data();  
        },
        
        registBaseDelivery : function(obj){
            if (!common.loginChk()) {
                return ;
            }
            
            _ajax.sendJSONRequest('GET'
                    ,_baseUrl + 'mypage/registBaseDeliveryJSON.do'
                    ,mmypage.deliveryList.getDlvpSeq(obj)
                    ,mmypage.deliveryList.registBaseDeliveryCallback
                    ,false
            );  
        },
        
        registBaseDeliveryCallback : function(res) {
            var data = (typeof res !== 'object') ? $.parseJSON(res) : res;
                    
            data.succeeded && alert(data.message); 
            
            location.reload();
        },
        
        deleteDelivery : function(obj){
            if (!common.loginChk()) {
                return ;
            }
            
            if(!confirm(MESSAGE.CONFIRM_DELETE)) return;
            
            _ajax.sendJSONRequest('GET'
                    ,_baseUrl + 'mypage/deleteDeliveryJSON.do'
                    ,mmypage.deliveryList.getDlvpSeq(obj)
                    ,mmypage.deliveryList.deleteDeliveryCallback
                    ,false
            );  
        },
        
        deleteDeliveryCallback : function(res) {
            var data = (typeof res !== 'object') ? $.parseJSON(res) : res;
                    
            data.succeeded && location.reload();
        },
        
        goDeliveryRegistForm : function(obj){
            if (!common.loginChk()) {
                return ;
            }

            if(arguments.length > 0 && typeof obj != 'undefined'){
                $(location).attr('href', _baseUrl + 'mypage/deliveryRegistForm.do?' + $.param(mmypage.deliveryList.getDlvpSeq(obj)));
            }else{
                this.checkDlvpTotalCount();
            }
        },
        
        
        
        ////////////////////////////////// 환불계좌 //////////////////////////////////
        getRfdActnInfo : function(param){
            _ajax.sendRequest('GET'
                    ,_baseUrl + 'mypage/getRfdActnAjax.do'
                    ,param
                    ,mmypage.deliveryList.getRfdActnInfoCallback
            );
        },
        
        getRfdActnInfoCallback : function (res) {
            if (res.length < 1) {
                return;
            }
            // 템플릿 데이타 세팅
            $("#rfdActn").append(res);
        },
        
        getRfdActnForm : function() {
            location.href = _baseUrl + 'mypage/getRfdActnForm.do';
        },
        
        // 삭제
        delRfdActnInfo : function(){
            
            if(!confirm("계좌 정보를 삭제하시겠습니까?")){
                return false;
            }
            var param = {
                    rfdAcctOwnMainNm : '',
                    rfdBnkCd : '',
                    rfdActn : ''
            }
            mmypage.deliveryList.delRfdActnInfoAjax(param);
            
        },
        /**
         * 삭제 Ajax
         */
        delRfdActnInfoAjax : function (param) {
            
            _ajax.sendRequest("POST"
                , _baseUrl + "mypage/delRfdActnInfoJson.do"
                , param
                , mmypage.deliveryList.delRfdActnInfoAjaxCallback
            );
        },
        /**
         *  삭제 callback 처리 함수
         */
        delRfdActnInfoAjaxCallback : function (res) {
            if(typeof res !== "undefined"){
                // 배송지 등록시 생기는 환경변수 제거
                sessionStorage.removeItem("regDeliveryYn");
                
                sessionStorage.setItem("deliveryTab","1");
                document.location.href = _baseUrl + "mypage/getDeliveryInfo.do";
            }
        }
};

$.namespace('mmypage.deliveryForm');
mmypage.deliveryForm = {
        excute : false,

        init : function(){
            common.zipcode.pop.init(mmypage.deliveryForm.selectedZipcodeCallback);
            /*
            $('#search-zipcode-pop').click(function(){
                
                mcommon.popup.zipcode.init(common.zipcode.pop.fnCallback);
                
                common.popFullOpen('우편번호 찾기', '');
                
            });
             */
            this.selectboxInit();
            
            $('#go-back').click(function(){
                mmypage.deliveryForm.cancel();
            });
        },
        
        selectboxInit : function(){
            $('#rmitCellSctNo').css({'width':'30.6%'});
            $('#rmitTelRgnNo').css({'width':'30.6%'});
        },
        
        regist : function(){
            if(!common.loginChk()) return;
            
            var dlvpSeq = $('#mbr-dlvp-seq').val();
            
            if(mmypage.deliveryForm.excute){
                alert('처리중입니다. 잠시만 기다려주세요.');
                return;
            }
            
            mmypage.deliveryForm.excute = true;
            
            if(!this.validator()){
                mmypage.deliveryForm.excute = false;
                return;
            }

            if(dlvpSeq){
                this.doRegistDelivery();
            }else{
                this.checkDlvpTotalCount();
            }
        },
        
        checkDlvpTotalCount : function(){
            _ajax.sendJSONRequest('GET'
                    ,_baseUrl + 'mypage/getDlvpTotalCountJSON.do'
                    ,{}
                    ,mmypage.deliveryForm.checkDlvpTotalCountCallBack
                    ,false
            );  
        },
        
        checkDlvpTotalCountCallBack : function(res){
            var data = (typeof res !== 'object') ? $.parseJSON(res) : res;
            
            if(Number(data) >= 20){
                alert(MESSAGE.DLVP_COUNT_MAX);
                mmypage.deliveryForm.excute = false;
                return;
            }
            
            mmypage.deliveryForm.doRegistDelivery();
        },
        
        doRegistDelivery : function(){
            mmypage.deliveryForm.setBaseDlvpYn();
            
            var values = $('#delivery-form').serializeObject();
            
            _ajax.sendJSONRequest('POST'
                    , _baseUrl + 'mypage/registDelivery.do'
                    , values
                    , mmypage.deliveryForm.registDeliveryJSONCallback
                    , false
            );
        },
        
        registDeliveryJSONCallback : function(res){
            
            // 등록 처리
            sessionStorage.setItem("regDeliveryYn","Y");
            
            var data = (typeof res !== 'object') ? $.parseJSON(res) : res;
            data.succeeded && alert(data.message);
            
            if(common.zipcodequick.pop.cartYn == 'Y'){
                common.zipcodequick.pop.deliveryRegistFormCartClose();
            }else if(common.zipcodequick.pop.quickYn == 'Y') {
                common.zipcodequick.pop.deliveryRegistFormAfterClose();
            }else if(document.referrer) {
                window.location.href = document.referrer;
            }else{
                history.back();
            }
            
        },
        
        
        cancel : function(){
            if(!confirm(MESSAGE.CONFIRM_CANCEL)){
                return;
            }
            
            history.back();
        },
        
        setBaseDlvpYn : function(){
            var baseDlvpYn = $('#base-dlvp-yn-check').is(':checked') ? 'Y' : 'N';
            
            $('#base-dlvp-yn').val(baseDlvpYn);
        },
        
        validator : function(){
            var $dlvpNm          = $('#dlvp-nm')
               ,$rmitNm          = $('#rmit-nm')
               ,$rmitCellSctNo   = $('#rmitCellSctNo')
               ,$rmitCellTxnoNo  = $('#rmit-cell-txno-no')
               ,$rmitCellEndNo   = $('#rmit-cell-end-no')
               ,$rmitTelRgnNo    = $('#rmitTelRgnNo')
               ,$rmitTelTxnoNo   = $('#rmit-tel-txno-no')
               ,$rmitTelEndNo    = $('#rmit-tel-end-no')
               ,$rmitPostNo      = $('#rmit-post-no')
               ,$stnmRmitPostNo  = $('#stnm-rmit-post-no')
               ,$rmitPostAddr    = $('#rmit-base-addr')
               ,$stnmRmitPostAddr= $('#stnm-rmit-post-addr')
               ,$rmitDtlAddr     = $('#rmit-dtl-addr')
               ,$stnmRmitDtlAddr = $('#stnm-rmit-dtl-addr')
               ,$tempRmitDtlAddr = $('#temp-rmit-dtl-addr');

            if(existsXssString($dlvpNm.val())){
                alert(MESSAGE.VALID_DLVP_XSS_STR);
                $dlvpNm.val(replaceStrXssAll($dlvpNm.val()));
                $dlvpNm.focus();
                return false;
            }else{
                if($dlvpNm.val().trim().length < 1){
                    alert(MESSAGE.VALID_DLVP_NM);
                    $dlvpNm.focus();
                    return false;
                }
            }
            
            $rmitNm.val(replaceStrXssAll($rmitNm.val()));
            if($rmitNm.val().trim().length < 1){
                alert(MESSAGE.VALID_MBR_NM);
                $rmitNm.focus();
                return false;
            }
            
            if($rmitCellSctNo.val().isEmpty()){
                alert(MESSAGE.VALID_CELL_SELECT);
                $rmitCellSctNo.focus();
                return false;
            }
            
            if($rmitCellTxnoNo.val().trim().length < 1){
                alert(MESSAGE.VALID_CELL_EMPTY);
                $rmitCellTxnoNo.focus();
                return false;
            }
            
            if($rmitCellTxnoNo.val().trim().length < 3){
                alert(MESSAGE.VALID_CELL_NUMBER);
                $rmitCellTxnoNo.focus();
                return false;
            }
            
            if(!$.isNumeric($rmitCellTxnoNo.val())){
                alert(MESSAGE.VALID_NOT_NUMBER);
                $rmitCellTxnoNo.val('');
                $rmitCellTxnoNo.focus();
                return false;
            }
            
            if($rmitCellEndNo.val().trim().length < 1){
                alert(MESSAGE.VALID_CELL_EMPTY);
                $rmitCellEndNo.focus();
                return false;
            }
            
            if($rmitCellEndNo.val().trim().length < 4){
                alert(MESSAGE.VALID_CELL_NUMBER);
                $rmitCellEndNo.focus();
                return false;
            }
            
            if(!$.isNumeric($rmitCellEndNo.val())){
                alert(MESSAGE.VALID_NOT_NUMBER);
                $rmitCellEndNo.val('');
                $rmitCellEndNo.focus();
                return false;
            }
            
            if(!$rmitTelRgnNo.val().isEmpty() || $rmitTelTxnoNo.val().trim().length > 0 || $rmitTelEndNo.val().trim().length > 0){
                if($rmitTelRgnNo.val().isEmpty()){
                    alert(MESSAGE.VALID_CELL_SELECT);
                    $rmitTelRgnNo.focus();
                    return false;
                }
                
                if($rmitTelTxnoNo.val().trim().length < 3){
                    alert(MESSAGE.VALID_CELL_NUMBER);
                    $rmitTelTxnoNo.focus();
                    return false;
                }
                
                if(!$.isNumeric($rmitTelTxnoNo.val())){
                    alert(MESSAGE.VALID_NOT_NUMBER);
                    $rmitTelTxnoNo.val('');
                    $rmitTelTxnoNo.focus();
                    return false;
                }
                
                if($rmitTelEndNo.val().trim().length < 4){
                    alert(MESSAGE.VALID_CELL_NUMBER);
                    $rmitTelEndNo.focus();
                    return false;
                }
                
                if(!$.isNumeric($rmitTelEndNo.val())){
                    alert(MESSAGE.VALID_NOT_NUMBER);
                    $rmitTelEndNo.val('');
                    $rmitTelEndNo.focus();
                    return false;
                }
                
            }else{
                $rmitTelRgnNo.val('');
                $rmitTelTxnoNo.val('');
                $rmitTelEndNo.val('');
            }
            
            if($rmitPostNo.val().trim().length < 1 || $rmitPostAddr.val().trim().length < 1 || $stnmRmitPostAddr.val().trim().length < 1){
                alert(MESSAGE.VALID_ADDR);
                return false;
            }
            

            $tempRmitDtlAddr.val(replaceStrAddress($tempRmitDtlAddr.val()));
            
            if($tempRmitDtlAddr.css('display') != 'none' && $tempRmitDtlAddr.val().length < 1){
                alert('배송지 상세주소를 입력하세요');
                $rmitDtlAddr.focus();
                return false;
            }
            
            if(!!$tempRmitDtlAddr.val()) {
                var rmitDtlAddr = $rmitDtlAddr.attr("orgvalue");
                var stnmRmitDtlAddr = $stnmRmitDtlAddr.attr("orgvalue");
                if(!!rmitDtlAddr) {
                    rmitDtlAddr += ' ';
                }
                if(!!stnmRmitDtlAddr) {
                    stnmRmitDtlAddr += ' ';
                }
                $rmitDtlAddr.val(rmitDtlAddr + $tempRmitDtlAddr.val());
                $stnmRmitDtlAddr.val(stnmRmitDtlAddr + $tempRmitDtlAddr.val());
            }
            
            return true;
        },
        
        selectedZipcodeCallback : function(param){
            $('#rmit-post-no').val(param.postNo1.toString() + param.postNo2.toString());
            $('#rmit-base-addr').val(param.lotAddr1);
            $('#rmit-dtl-addr').attr("orgvalue", param.lotAddr2);
            $('#rmit-dtl-addr').val(param.lotAddr2);
            $('#stnm-rmit-post-no').val(param.postNo);
            $('#stnm-rmit-post-addr').val(param.roadAddr1);
            $('#stnm-rmit-dtl-addr').attr("orgvalue", param.roadAddr2);
            $('#stnm-rmit-dtl-addr').val(param.roadAddr2);
            $('#emd-nm').val(param.emdNm);
            $('#admr-nm').val(param.admrNm);
            $('#lat').val('');
            $('#lng').val('');
            
            $('#post-no').val(param.postNo);
            $('#rmit-base-addr-text').html('<span>지번</span> : ' + param.lotAddr1+' '+param.lotAddr2);
            $('#stnm-rmit-post-addr-text').html('<span>도로명</span> : ' + param.roadAddr1+' '+param.roadAddr2);
            $('#temp-rmit-dtl-addr').attr('maxlength', (param.roadAddr2.toString().length > param.lotAddr2.toString().length) ? 50 - param.roadAddr2.toString().length -1 : 50 - param.lotAddr2.toString().length -1);
            $('#temp-rmit-dtl-addr').val('');
            $('#temp-rmit-dtl-addr').show();
        }
};