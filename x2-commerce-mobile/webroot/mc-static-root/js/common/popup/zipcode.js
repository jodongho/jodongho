_ajax = common.Ajax;

$.namespace('mcommon.popup.zipcode');
mcommon.popup.zipcode = {
        searchKeyWord : '',
        
        fnCallback    : '',
        
        selectZipcodeData : '',
        
        init : function(_callback){
            mcommon.popup.zipcode.initCallBack(_callback);
            
            mcommon.popup.zipcode.selectboxBindEvent();
            
            mcommon.popup.zipcode.searchKeywordBindEvent();
            
            mcommon.popup.zipcode.pagerInit();
        },
        
        initCallBack : function(_callback){
            mcommon.popup.zipcode.fnCallback = _callback; 
        },
        
        setSearchKeyWord : function(){
            mcommon.popup.zipcode.searchKeyWord = replaceStrAddress($('#search-'+mcommon.popup.zipcode.getTabId()).val());
        },
        
        selectboxBindEvent : function(){
            $('#road-addr-atmp-nm, #zip-addr-atmp-nm').change(function(){
                mcommon.popup.zipcode.skkSelectboxClear();
                
                mcommon.popup.zipcode.skkDisabler();
                
                mcommon.popup.zipcode.searchResultInit();
                /* 
                mcommon.popup.zipcode.searchKeywordInit();
                */
                mcommon.popup.zipcode.getSkkListJSON();
            });
            $('#road-addr-skk-nm, #zip-addr-skk-nm').change(function(){
                mcommon.popup.zipcode.searchResultInit();
                /*
                mcommon.popup.zipcode.searchKeywordInit();
                */
            });
        },
        
        searchKeywordBindEvent : function(){
            $('#search-road-addr, #search-zip-addr').keyup(function(e){
                if(e.keyCode != KEYCODE_ENTER) return;
                
                mcommon.popup.zipcode.searchZipcode();                
            });
        },
        
        pagerInit : function(){
            ScrollPager.init({bottomScroll : 600, callback : mcommon.popup.zipcode.searchZipcode});
        },
        
        getTabId : function(){
            return $('#zipcodeTab').find('li').filter(function(){
                return $(this).hasClass('on')
            }).find('a').attr('id');
        },
        
        getHideAreaId : function(clickedId){
            return $('#' + clickedId).parent().siblings().find('a').attr('id');
        },
        
        tabRevitalizer : function(obj){
            $(obj).parent().addClass('on').attr('title', '현재 선택된 메뉴').siblings().removeClass('on').removeAttr('title');
            
            $('#'+ obj.id + '-area').removeClass('hide');
            $('#'+ this.getHideAreaId(obj.id) + '-area').addClass('hide');
        },
        
        tabToggler : function(obj){
            if(obj.id == this.getTabId()) return;
            
            this.tabRevitalizer(obj);
            
            this.selectboxDisabler();
            
            this.searchConditionInit();
            
            this.skkSelectboxClear();
            
            this.skkDisabler();
            
            this.searchResultInit();
            
            this.pagerInit();
            
            this.searchKeyWord = '';
        },
        
        selectboxDisabler : function(){
            $('#'+ this.getTabId() + '-atmp-nm').removeAttr('disabled');
            $('#'+ this.getTabId() + '-skk-nm').removeAttr('disabled');
            
            $('#'+ this.getHideAreaId(this.getTabId()) + '-atmp-nm').attr('disabled', true);
            $('#'+ this.getHideAreaId(this.getTabId()) + '-skk-nm').attr('disabled', true);
        },
        
        skkSelectboxClear : function(){
            $('[name="skkNm"] option').filter(function(){
                return $(this).val() != ''
            }).remove();
        },
        
        skkDisabler : function(){
            var atmpNm    = $('#'+ this.getTabId() + '-atmp-nm option:selected').val()
               ,doDisable = (atmpNm == '' || atmpNm == '세종특별자치시') ? true : false;
            
            $('#'+ this.getTabId() + '-skk-nm').attr('disabled', doDisable);
        },
        
        getSkkListJSON : function(){
            var atmpNm = $('#'+ this.getTabId() + '-atmp-nm option:selected').val();
        
            if(atmpNm == '' || atmpNm == '세종특별자치시') return;
            
            _ajax.sendJSONRequest('GET'
                    ,_baseUrl + 'common/popup/getSkkListJSON.do'
                    ,{ 
                      atmpNm : atmpNm
                     }
                    ,mcommon.popup.zipcode.getSkkListJSONCallback
                    ,false
            );  
        },
        
        getSkkListJSONCallback : function(res){
            var data = (typeof res !== 'object') ? $.parseJSON(res) : res;
            
            $.template('selectbox-option-tmpl'
                      ,'<option value="${skkNm}">${skkNm}</option>');
            
            $.tmpl('selectbox-option-tmpl', data).appendTo('#'+ mcommon.popup.zipcode.getTabId() + '-skk-nm');
        },
        
        searchZipcode : function(){
            var _this         = mcommon.popup.zipcode
               ,zipcodeValues = $('#zipcode-form').serializeObject();
            
            if(_this.isScroll()){
                
                if(_this.searchKeyWord == '') return;
                
                $('#search-' + _this.getTabId()).val(_this.searchKeyWord);
                
                zipcodeValues.pageIdx = ScrollPager.nextPageIndex();
                
            }else{
                _this.pagerInit();
                
                _this.searchResultInit();
                
                if(!_this.validator()) return;
                
                _this.setSearchKeyWord();
                
                $('#search-' + _this.getTabId()).blur();
                
                zipcodeValues.pageIdx = ScrollPager.currPageIndex();
            }
            
            _ajax.sendJSONRequest('GET'
                    ,_baseUrl + 'common/popup/searchZipcodeListJSON.do'
                    ,zipcodeValues
                    ,mcommon.popup.zipcode.searchZipcodeCallback
                    ,false
            );  
        },
        
        searchZipcodeCallback : function(res){
            var result = (typeof res !== 'object') ? $.parseJSON(res) : res;
            
            if(result.data.length > 0){
                var searchCount = Number(result.message);
                
                mcommon.popup.zipcode.searchResultListShow();
                
                if(searchCount >= 100) mcommon.popup.zipcode.guideInfoAreaShow(searchCount);
                
                $('#' + mcommon.popup.zipcode.getTabId() + '-result-tmpl').tmpl(result.data).appendTo('#' + mcommon.popup.zipcode.getTabId() + '-result-list');
            }else{
                if(mcommon.popup.zipcode.listExists())return;
                
                mcommon.popup.zipcode.searchKeyWord = '';
                
                mcommon.popup.zipcode.searchResultNoDataShow();
            }
        },
        
        isScroll : function(){
            if(event.type == 'scroll' || event.type == 'touchmove'){
                return true;
            }else{
                return false;
            }
        },
        
        listExists : function(){
            if($('#' + mcommon.popup.zipcode.getTabId() + '-result-list').children().length > 0){
                return true;
            }else{
                return false;
            }  
        },
        
        validator : function(){
            var searchArea = mcommon.popup.zipcode.getTabId()
               ,atmpNm     = $('#' + searchArea + '-atmp-nm option:selected').val();
            
            if(atmpNm == ''){
                alert(ZIPCODE_MESSAGE.VALID_ATMP_NM);
                mcommon.popup.zipcode.searchKeyWord = '';
                $('#' + searchArea + '-atmp-nm').focus();
                return false;
            }
            
            if($('#' + searchArea + '-skk-nm option:selected').val() == '' && atmpNm != '세종특별자치시'){
                alert(ZIPCODE_MESSAGE.VALID_SKK_NM);
                mcommon.popup.zipcode.searchKeyWord = '';
                $('#' + searchArea + '-skk-nm').focus();
                return false;
            }
            
            if($('#search-' + searchArea).val().trim().isEmpty()){
                if(searchArea == 'road-addr'){
                    alert(ZIPCODE_MESSAGE.VALID_ROAD_NM);
                }else{
                    alert(ZIPCODE_MESSAGE.VALID_ZIP_NM);
                }
                mcommon.popup.zipcode.searchKeyWord = '';
                $('#search-' + searchArea).focus();
                return false;
            }
            
            if($('#search-' + searchArea).val().trim().length < 2){
                if(searchArea == 'road-addr'){
                    alert(ZIPCODE_MESSAGE.VALID_MIN_LENGTH);
                }else{
                    alert(ZIPCODE_MESSAGE.VALID_MIN_LENGTH);
                }
                mcommon.popup.zipcode.searchKeyWord = '';
                $('#search-' + searchArea).focus();
                return false;
            }
            
            if(searchArea == 'zip-addr'){
                var keyword = $('#search-' + searchArea).val();
                
                if(keyword.indexOf('-') > -1 && !(keyword.split('-')[1]).trim().isEmpty() && !$.isNumeric(keyword.split('-')[1])){
                    alert('지번 상세 주소는 숫자로 입력하세요.');
                    mcommon.popup.zipcode.searchKeyWord = '';
                    return false;
                }
            }
            
            return true;
        },
        
        searchConditionInit : function(){
            document.getElementById('zipcode-form').reset();
        },
        
        searchKeywordInit : function(){
            mcommon.popup.zipcode.searchKeyWord = '';
            
            $('#search-' + mcommon.popup.zipcode.getTabId()).val('');
        },
        
        searchResultInit : function(){
            $('#' + mcommon.popup.zipcode.getTabId() + '-result').addClass('hide');
            
            $('#' + mcommon.popup.zipcode.getTabId() + '-result-list').children().remove();
            
            $('#' + mcommon.popup.zipcode.getTabId() + '-not-exists').addClass('hide');
            
            $('#' + mcommon.popup.zipcode.getTabId() + '-guide-info').addClass('hide');
            $('#' + mcommon.popup.zipcode.getTabId() + '-guide-text').removeClass('hide');
            $('#' + mcommon.popup.zipcode.getTabId() + '-guide-cont').removeClass('hide');
            $('#' + mcommon.popup.zipcode.getTabId() + '-guide-cont-dtl').removeClass('hide');
        },
        
        searchResultListShow : function(){
            $('#' + mcommon.popup.zipcode.getTabId() + '-not-exists').filter(function(){
                return !$(this).hasClass('hide') 
            }).addClass('hide');
            
            $('#' + mcommon.popup.zipcode.getTabId() + '-result').removeClass('hide');
            
            $('#' + mcommon.popup.zipcode.getTabId() + '-guide-text').addClass('hide');
            $('#' + mcommon.popup.zipcode.getTabId() + '-guide-cont').addClass('hide');
        },
        
        guideInfoAreaShow : function(count){
            $('#' + mcommon.popup.zipcode.getTabId() + '-guide-info').removeClass('hide');
            $('#' + mcommon.popup.zipcode.getTabId() + '-guide-keyword').html('\''+mcommon.popup.zipcode.searchKeyWord+'\'');
            $('#' + mcommon.popup.zipcode.getTabId() + '-guide-keyword-count').html('\''+count.numberFormat()+'\'');
            
            $('#' + mcommon.popup.zipcode.getTabId() + '-guide-text').removeClass('hide');
            $('#' + mcommon.popup.zipcode.getTabId() + '-guide-cont').removeClass('hide');
            $('#' + mcommon.popup.zipcode.getTabId() + '-guide-cont-dtl').addClass('hide');
        },
        
        searchResultNoDataShow : function(){
            $('#' + mcommon.popup.zipcode.getTabId() + '-result').filter(function(){
                return !$(this).hasClass('hide') 
            }).addClass('hide');
            
            $('#' + mcommon.popup.zipcode.getTabId() + '-not-exists').removeClass('hide');
            
            $('#' + mcommon.popup.zipcode.getTabId() + '-guide-text').addClass('hide');
            $('#' + mcommon.popup.zipcode.getTabId() + '-guide-cont').addClass('hide');
        },
        
        selectZipcode : function(obj){
            
            if(common.zipcodequick.pop.quickYn == 'Y'){
                
                mcommon.popup.zipcode.selectZipcodeData = $(obj).data();
                mcommon.popup.zipcode.quickStrYn($(obj).data());
                
            } else {
                if(typeof mcommon.popup.zipcode.fnCallback != 'function') return;
                
                mcommon.popup.zipcode.fnCallback($(obj).data());
                
                common.popFullClose();
            }
            
            
        },
        
        popupClear : function(){
            mcommon.popup.zipcode.searchConditionInit();
            
            mcommon.popup.zipcode.skkSelectboxClear();
            
            mcommon.popup.zipcode.skkDisabler();
            
            mcommon.popup.zipcode.searchResultInit();
            
            mcommon.popup.zipcode.pagerInit();
            
            ScrollPager.unbindEvent();
        },
        
        /** 당일배송 가능 지역 확인 **/
        quickStrYn : function(obj){
            var url = _baseUrl + "goods/getTodayDeliveryStrAjax.do";
            var data ={atmpNm : obj.atmpNm, skkNm : obj.skkNm, admrNm : obj.emdNm, emdNm : obj.emdNm2, postNo : obj.postNo};
            common.Ajax.sendRequest("POST",url,data,mcommon.popup.zipcode._callBackQuickStrYn);
        },
        
        /** 당일배송 가능 지역 확인 콜백 **/
        _callBackQuickStrYn : function(res){

            if(res.trim().indexOf('Y') != -1){
                
                if(typeof mcommon.popup.zipcode.fnCallback != 'function') return;
                
                mcommon.popup.zipcode.fnCallback(mcommon.popup.zipcode.selectZipcodeData);
                
                common.popLayerClose('searchZipcode');
                
            } else {
                alert('고객님 죄송합니다. 선택하신 배송지는 오늘드림 서비스 지역이 아닙니다.');
            }
        }
};