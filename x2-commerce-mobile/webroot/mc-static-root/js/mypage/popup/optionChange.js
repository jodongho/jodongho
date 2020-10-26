_ajax = common.Ajax;

$.namespace('mmypage.popup.optionChange');
mmypage.popup.optionChange = {
        isExcute : false,

        init : function(){
            this.selectboxBindingEvent();
        },
        
        selectboxBindingEvent : function(){
            $('.select_box .select_opt').click(function(e){
                e.preventDefault();
                if($('.select_box').hasClass('open')){
                    e.preventDefault();
                    $(this).parent('.select_box').removeClass('open').find('ul').hide();
                }else{
                    $(this).parent('.select_box').addClass('open').find('ul').show();
                }
            });
        },
        
        selectOption : function(obj){
            $('.select_opt').html($(obj).html()).click();
            
            $('#exch-item-no').val($(obj).data('exchItemNo'));
        },
        
        doChange : function(){
            if(!common.loginChk()) return;
                
            if(this.isExcute){
                alert('처리중입니다 잠시만 기다려주세요.');
                
                return;
            }
            
            this.isExcute = true;
            
            var exchItemNo = $('#exch-item-no').val();
            
            if(!exchItemNo){
                alert('옵션을 선택해주세요.');
                
                this.isExcute = false;
                
                return;
            }
            
            $('#option-change-form').attr('method', 'POST').attr('action', _baseUrl + 'mypage/orderChange.do').submit();
        }
};