_ajax = common.Ajax;

$.namespace('order.popup.optionPresentChange');
order.popup.optionPresentChange = {
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
            //console.log(obj);
            $('.select_opt').html($(obj).html()).click();
            var ordGoodsSeq =  $(obj).data('ordGoodsSeq');
            
            $('.select_opt').data('ord-goods-seq', ordGoodsSeq);
            $('.select_opt').data('exch-item-no', $(obj).data('exchItemNo'));
            $('.select_opt').data('exch-item-nm', $(obj).data('itemNm'));
            $('.select_opt').data('nm-pop', $(obj).data('itemNm'));
            $('.select_opt').data('sale-prom-no', $(obj).data('salePromNo'));
        },
        
        doChange : function(){
        	if(this.isExcute){
        		alert('처리중입니다 잠시만 기다려주세요.');
        		
        		return;
        	}
        	
//            if(!common.loginChk()) return;
        	var ordGoodsSeq =  $('.select_opt').data('ord-goods-seq');
        	var itemNo =  $('.select_opt').data('exch-item-no');
        	var bChk = false;
        	if(itemNo != null && itemNo != "" && ordGoodsSeq != null && ordGoodsSeq != ""){
        		
        		if(presentInfoO2oQuickYn != null && presentInfoO2oQuickYn == "Y" && $('.gp-delivery-type input:checked').val() == "Y"&& $('#strNo_'+target).val() != null && $('#strNo_'+target).val() != "" ){
        			bChk = true;
        			//옵션변경값 세팅
        			var goodsNoArr = [];
        			var modYnArr = [];
        			var ordGoodsSeqArr = [];
        			var exchItemNoArr = [];
        			   
        			// 상품번호 배열 Loop
        			$("input[name=goodsNo]").each(function(idx){
        				var value = $(this).val();
        				goodsNoArr.push(value);
        			});
        			// 수정여부 배열 Loop
        			$("input[name=modYn]").each(function(idx){
        				var value = $(this).val();
        			       modYnArr.push(value);
        			});
        			// 주문상품 순번 배열 Loop
        			$("input[name=ordGoodsSeq]").each(function(idx){
        				var value = $(this).val();
        				ordGoodsSeqArr.push(value);
        			});
        			// 상품 옵션번호 배열 Loop
        			$("input[name=exchItemNo]").each(function(idx){
        				var value = $(this).val();
        				exchItemNoArr.push(value);
        			});

        			
        			
        			var param = $("#orderForm").serialize()+"&addrChangeFlag=Y" 
        			+ "&goodsNoArr=" + goodsNoArr
        			+ "&modYnArr=" + modYnArr 
        			+ "&ordGoodsSeqArr=" + ordGoodsSeqArr 
        			+ "&exchItemNoArr=" + exchItemNoArr 
        			+ "&chgBeforeOrdGoodsSeq=" + ordGoodsSeq
        			+ "&chgBeforeItemNo=" + itemNo
        			; 
        			
        			common.Ajax.sendRequest('POST'
        			       , _baseUrl + 'order/checkStrStock.do'
        			       , param
        			       , function(res){
        						var resultData = res.data;
        						var strDlvInfo = res.strDlvInfo;
        						var nowDate = res.nowDate;
        						if(res.result!="S"){
        							if(confirm("선택하신 옵션은 오늘드림 배송이 불가하며, 일반배송만 가능합니다.")) {
        								//오늘드림 가능여부와 재고 임시저장
        								$('#strNo_'+target).val("");
        								$("#addrResultCode").val(res.result);
        								$("#addrResultMessage").val(res.message);
        								$("#presentGeneralDelivery").trigger("click");
        								//배송구분 숨기기
        								$('.gp-select-delivery').hide();
        								//배송구분에 따른 위탁사 보이기
        								$("#personalInfoDeliveryCompany").html("개인정보처리 위탁사 : ${deliveryNm }");
        								
        								//오늘드림 배송정보 페이지 초기화
        								$("#getOrderPresentO2oDlvpAjaxHtml").empty();
        								$("#getOrderPresentO2oDlvpAjaxHtml").html("");
        								
        			                }else{
        			                	return;
        			                }
        						}
        						
        						var ordGoodsSeq = $('#ord-goods-seq-pop').val();

        						$("#optChangeBtn_"+ ordGoodsSeq).data("item-no", $('.select_opt').data('exch-item-no'));
        			            $('#exch-item-no' + ordGoodsSeq).val($('.select_opt').data('exch-item-no'));
        			            $('#exch-item-nm' + ordGoodsSeq).val($('.select_opt').data('exch-item-nm'));
        			            $('#item-nm-pop').val($('.select_opt').data('nm-pop'));
        			            $('#sale-prom-no' + ordGoodsSeq).val($('.select_opt').data('sale-prom-no'));
        			        	
        			            var ordProcSeq  = $('#ord-proc-seq-pop').val();
        			            var goodsNo     = $('#goods-no-pop').val();
        			            var clmQty      = $('#clm-qty-pop').val();
        			            var itemNm      = $('#item-nm-pop').val()
        			                
        			            this.isExcute = true;
        			            
        			            var exchItemNo = $('#exch-item-no'+ordGoodsSeq).val();
        			            
        			            if(!exchItemNo || itemNm == '' || itemNm.length == 0){
        			                alert('옵션을 선택해주세요.');
        			                
        			                this.isExcute = false;
        			                
        			                return;
        			            }
        			            // savePresentOrderChangeAjax
//        			            $('#option-change-form').attr('method', 'POST').attr('action', _baseUrl + 'order/optionPresentChange.do').submit();
        			            
        			            var param = $("#option-change-form").serialize();
        			            $('#itemNmTxt'+ordGoodsSeq).text($('#item-nm-pop').val());
        			            
        			            
        			            $('#ord-goods-seq'+ordGoodsSeq).val(ordGoodsSeq);
        			            $('#ord-proc-seq'+ordGoodsSeq).val(ordProcSeq);
        			            $('#goods-no'+ordGoodsSeq).val(goodsNo);
        			            $('#clm-qty'+ordGoodsSeq).val(clmQty);
        			            $('#mod-yn'+ordGoodsSeq).val("Y");
//        			            $('#exch-item-no'+ordGoodsSeq).val(clmQty);
//        			            $('#item-nm'+ordGoodsSeq).val(clmQty);
        			            
        			            common.popLayerClose('LAYERPOP01');
        						
        			       	}
        			      ,true       //비동기 제어 
        			   );
        			return;
        		}
        	}
        	
        	$("#optChangeBtn_"+ ordGoodsSeq).data("item-no", $('.select_opt').data('exch-item-no'));
            $('#exch-item-no' + ordGoodsSeq).val($('.select_opt').data('exch-item-no'));
            $('#exch-item-nm' + ordGoodsSeq).val($('.select_opt').data('exch-item-nm'));
            $('#item-nm-pop').val($('.select_opt').data('nm-pop'));
            $('#sale-prom-no' + ordGoodsSeq).val($('.select_opt').data('sale-prom-no'));
        	
            var ordGoodsSeq = $('#ord-goods-seq-pop').val();
            var ordProcSeq  = $('#ord-proc-seq-pop').val();
            var goodsNo     = $('#goods-no-pop').val();
            var clmQty      = $('#clm-qty-pop').val();
            var itemNm      = $('#item-nm-pop').val()
                
            this.isExcute = true;
            
            var exchItemNo = $('#exch-item-no'+ordGoodsSeq).val();
            
            if(!exchItemNo || itemNm == '' || itemNm.length == 0){
                alert('옵션을 선택해주세요.');
                
                this.isExcute = false;
                
                return;
            }
            // savePresentOrderChangeAjax
//            $('#option-change-form').attr('method', 'POST').attr('action', _baseUrl + 'order/optionPresentChange.do').submit();
            
            var param = $("#option-change-form").serialize();
            $('#itemNmTxt'+ordGoodsSeq).text($('#item-nm-pop').val());
            
            
            $('#ord-goods-seq'+ordGoodsSeq).val(ordGoodsSeq);
            $('#ord-proc-seq'+ordGoodsSeq).val(ordProcSeq);
            $('#goods-no'+ordGoodsSeq).val(goodsNo);
            $('#clm-qty'+ordGoodsSeq).val(clmQty);
            $('#mod-yn'+ordGoodsSeq).val("Y");
//            $('#exch-item-no'+ordGoodsSeq).val(clmQty);
//            $('#item-nm'+ordGoodsSeq).val(clmQty);
            
            common.popLayerClose('LAYERPOP01');
            if(!bChk){
            	checkStrStock(false);
            }
            
//            common.showLoadingLayer(false);
//            common.Ajax.sendRequest("POST", _baseUrl + "order/savePresentOrderChangeAjax.do", param,
//                    savePresentOrderChangeAjaxCallback);
            
        },
        
       
};
