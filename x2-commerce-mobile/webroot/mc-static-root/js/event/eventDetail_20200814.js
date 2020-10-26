/**
 * 배포일자 : 2020-07-30
 * 오픈일자 : 2020-08-14
 * 이벤트명 : 올-리뷰 행운 티켓
 */
$.namespace("monthEvent.detail");
monthEvent.detail = {
	layerPolice : false,
	applyIng : false,
	serializeData : '',
	init : function(){

		monthEvent.detail.getPsbReviewList();
		monthEvent.detail.getPsbCntReview();
		monthEvent.detail.getMyReviewCoupon();

		$('#popStoreCoupon input:text').prop('placeholder', '직원 확인 코드:').prop('maxlength', 4);

		//나의 당첨내역
		$('.popWin1').click(function(){
			monthEvent.detail.getMyWinList();
		});

		//직원 확인
		$('.btn_confirm').click(function(){
			monthEvent.detail.confirmReviewCoupon();
		});

		//위수탁 동의
		$('.agreeBtn').click(function(){
    		if("Y" != $(':radio[name="argee1"]:checked').val() || "Y" != $(':radio[name="argee2"]:checked').val()){
                alert("두 가지 모두 동의 후 참여 가능합니다.");
                mevent.detail.eventCloseLayer();
                return;
            }

			monthEvent.detail.applyReview();
		});

		//직접 X(닫기) 클릭 or 레이어팝업 이외 영역 클릭 시, 알럿
        $('#eventDimLayer, #eventLayerPolice .close').click(function(){
            if(monthEvent.detail.layerPolice){
                alert('동의 후 참여 가능합니다.');

                monthEvent.detail.layerPolice = false;
                mevent.detail.eventCloseLayer();

                //초기화
                $(':radio[name="argee1"]:input[value="N"]').attr("checked", true);
                $(':radio[name="argee2"]:input[value="N"]').attr("checked", true);
            }
        });


        setTimeout(function() {
        	$('.eventView .txtBox').append($('<script/>', {'src': _cdnImgUrl + 'contents/slide/swiper.min.js'}));
        	setTimeout(function() {
    			//온오프리뷰 슬라이드
    			var slide_review = new Swiper('#slide_review', {
    				loop: true,
    		      	autoHeight: true,
    				pagination: {
    					el: '.swiper-pagination',
    				},
    			});
            }, 800);
        }, 2000);
	},

	//작성 가능한 매장 리뷰 목록 조회
	getPsbReviewList : function(){
		if(!common.isLoginForEvt()){
            return;
        }
		$('#evtReview .list').hide();
		$('#evtReview .con01').addClass('loading').show();
		$('#evtReview .con01 .inner_list ul').remove();

        var param = {
        	evtNo : $("input[id='evtNo']:hidden").val()
        };
        common.Ajax.sendJSONRequest(
       		 "GET"
       	   , _baseUrl + "event/20200814/getPsbReviewList.do"
       	   , param
       	   , monthEvent.detail._callback_getPsbReviewList
        );
    },

    _callback_getPsbReviewList : function(json){
        if(json.ret == "0"){
            if(json.gdasossibleList.length != 0){
                var list = json.gdasossibleList;

                for(var i = 0; i < json.gdasossibleList.length; i++ ){
                    if(i == 20){
                        break;
                    }

					var liClass = 'soldout type_blind';
					var prd_img = $('<p/>', {'class':'prd_img'}).append(
										$('<img/>', {'src': _cdnImgUrl+'images/goods/'+ list[i].thnlPathNm, 'alt':list[i].goodsNm, 'onerror':'common.errorImg(this);'})
									).append(
										$('<span/>', {'class':'soldend'}).text('판매종료')
									);
					if(common.isEmpty(list[i].goodsNo) || list[i].prgsStatCd == '10'){
						//매장 전용
						liClass = '';
						prd_img = $('<p/>', {'class':'prd_img'}).append(
										$('<img/>', {'src': _imgUrl + 'comm/offline_store.png', 'alt':list[i].goodsNm, 'onerror':'common.errorImg(this);'})
									).append(
										$('<span/>', {'class':'only_offline'}).text('매장전용상품')
									);
					}else if(list[i].prgsStatCd == '20' && list[i].itemPrgsStatYn == 'Y'){
						liClass = '';
						prd_img = $('<p/>', {'class':'prd_img'}).append(
										$('<img/>', {'src':_cdnImgUrl+'images/goods/'+ list[i].thnlPathNm, 'alt':list[i].goodsNm, 'onerror':'common.errorImg(this);'})
									)
					}

					var prdInfo = $('<div/>', {'class':'prd_info'}).append(
									prd_img
								).append(
									$('<span/>', {'class':'prd_date'}).text('구매일자')
								).append(
										list[i].operDt.replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3')
								).append(
									$('<span/>', {'class':'offlineStore'}).text('매장')
								).append(
									$('<div/>', {'class':'prd_name'}).append(
										$('<p/>', {'class':'tit'}).text( common.isEmpty(list[i].brndNm) ? '': list[i].brndNm )
									).append(
										$('<p/>', {'class':'tx_short'}).text( list[i].goodsNm )
									)
								)

					var rwInfo = $('<div/>', {'class':'review_info'}).append(
									$('<span/>', {'class':'review_date'}).text('작성 기간')
								).append(
									' ~ ' + list[i].apslPsblDate
								).append(
									$('<p/>', {'class':'btn_area'}).append(
										$('<button/>', {
											  'class':'btnMintH28'
											, 'data-ord-no': list[i].ordNo
											, 'data-goods-no': list[i].goodsNo
											, 'data-gdas-tp-cd':'00'
											, 'data-gdas-sct-cd': list[i].offlineOrderYn == 'Y' ? '60' : '10'
											, 'data-item-no': list[i].itemNo
											, 'data-item-nm': list[i].itemNm
											, 'data-lgc-goods-no': list[i].lgcGoodsNo
											, 'data-ord-goods-seq': list[i].ordGoodsSeq
											, 'data-ord-con-yn': list[i].ordConYn
											, 'data-thnl-path-nm': list[i].thnlPathNm
											, 'data-oper-dt': list[i].operDt
											, 'data-origin-bizpl-cd': list[i].originBizplCd
											, 'data-receipt-no': list[i].receiptNo
											, 'data-pos-no': list[i].posNo
											, 'data-str-no': list[i].strNo
											, 'data-brnd-nm': list[i].brndNm
											, 'data-prgs-stat-cd': list[i].prgsStatCd
											, 'data-used1mm-gdas-yn': list[i].used1mmGdasYn
											, 'onclick':'monthEvent.detail.appraisalRegist(this);'
										}).text('리뷰 작성')
									)
								);

					if($('#evtReview .con01 .inner_list .review_list').length == 0){
						$('#evtReview .con01 .inner_list').append( $('<ul/>', {'class':'review_list new'}) );
					}

					$('#evtReview .con01 .inner_list .review_list').append(
						$('<li/>', {'class':liClass}).append(
							prdInfo
						).append(
							rwInfo
						)
					);
                }
            }
            if($('#evtReview .con01 .review_list li').length > 0){
            	$('#evtReview .con01').removeClass('loading');
            	$('.evtCon03 .txt_review span a').text((list[0].offlinePossibeTotCnt*1) > 999 ? '999' : list[0].offlinePossibeTotCnt);
            }else{
            	$('#evtReview .list').hide();
            	$('#evtReview .con03').show();
            }
        }
    },

	//쿠폰 상태 조회
    getMyReviewCoupon : function(){
    	if(!common.isLoginForEvt()){
            return;
        }
        var param = {
        	evtNo : $("input[id='evtNo']:hidden").val()
        	, startDate : $("input[id='startDate']:hidden").val()
		    , endDate : $("input[id='endDate']:hidden").val()
        };
        common.Ajax.sendJSONRequest(
       		 "GET"
       	   , _baseUrl + "event/20200814/getMyReviewCoupon.do"
       	   , param
       	   , monthEvent.detail._callback_getMyReviewCoupon
        );
    },

    _callback_getMyReviewCoupon : function(json){
        if(json.ret == "0"){
        	$('.evtCon01 .btn2').hide().removeAttr('onclick');
        	if('Y' == json.useCpn){
        		$('#popStoreCoupon p').text('(' + json.downCpnSeq + ')');
            	$('.evtCon01 .used').show();
        	}else if(!common.isEmpty(json.downCpnSeq)){
        		$('#popStoreCoupon p').text('(' + json.downCpnSeq + ')');
            	$('.evtCon01 .using').show().attr('onclick', 'monthEvent.detail.downReviewCoupon();');
        	}else{
            	$('.evtCon01 .down').show().attr('onclick', 'monthEvent.detail.downReviewCoupon();');
        	}
        }
    },

    //쿠폰 발급
    downReviewCoupon : function(){
    	if(monthEvent.detail.applyIng){
    		return;
    	}
		if(!monthEvent.detail.checkLoginEvt()){
            return;
        }
		if(common.app.appInfo == undefined || !common.app.appInfo.isapp) {
        	if(confirm("APP 에서 응모해주세요.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
        	monthEvent.detail.applyIng = true;

	        var param = {
	        	evtNo : $("input[id='evtNo']:hidden").val()
	        	, startDate : $("input[id='startDate']:hidden").val()
	    		, endDate : $("input[id='endDate']:hidden").val()
	        };
	        common.Ajax.sendJSONRequest(
	       		 "GET"
	       	   , _baseUrl + "event/20200814/downReviewCoupon.do"
	       	   , param
	       	   , monthEvent.detail._callback_downReviewCoupon
	        );
        }
    },

    _callback_downReviewCoupon : function(json){
    	monthEvent.detail.applyIng = false;
        if(!common.isEmpty(json.downCpnSeq)){
			$('#popStoreCoupon p').text('(' + json.downCpnSeq + ')');
        	$('#popStoreCoupon input:text').val('');
        	mevent.detail.eventShowLayScroll('popStoreCoupon');

        	$('.evtCon01 .btn2').hide().removeAttr('onclick');
        	$('.evtCon01 .using').show().attr('onclick', 'monthEvent.detail.downReviewCoupon();');
    	}else{
        	alert(json.message);
        	location.reload();
        }
    },

    //쿠폰 직원 확인
    confirmReviewCoupon : function(){
    	if(monthEvent.detail.applyIng){
    		return;
    	}
		if(!monthEvent.detail.checkLoginEvt()){
            return;
        }
		if($('#popStoreCoupon input:text').val().trim() != '5290'
			|| !$('#popStoreCoupon input:text').val().trim().isNumber()){
			alert('올바른 직원 확인 코드를 입력해주세요');
			return;
		}
		if(!confirm('직원 확인 이후 쿠폰 사용 처리되며 재사용 불가합니다. 사용하시겠습니까?')){
			return;
		}
		monthEvent.detail.applyIng = true;
        var param = {
        	evtNo : $("input[id='evtNo']:hidden").val()
        	, startDate : $("input[id='startDate']:hidden").val()
    		, endDate : $("input[id='endDate']:hidden").val()
        };
        common.Ajax.sendJSONRequest(
       		 "GET"
       	   , _baseUrl + "event/20200814/confirmReviewCoupon.do"
       	   , param
       	   , monthEvent.detail._callback_confirmReviewCoupon
        );
    },

    _callback_confirmReviewCoupon : function(json){
    	monthEvent.detail.applyIng = false;
        if(json.ret == "0"){
        	$('#popStoreCoupon .buttonBox').addClass('complete');

        	$('.evtCon01 .btn2').hide().removeAttr('onclick');
        	$('.evtCon01 .used').show();
    	}else{
    		mevent.detail.eventCloseLayer();
        	alert(json.message);
        }
    },

    //응모 가능 수
    getPsbCntReview : function(){
    	if(!common.isLoginForEvt()){
            return;
        }
        var param = {
        	evtNo : $("input[id='evtNo']:hidden").val()
        	, startDate : $("input[id='startDate']:hidden").val()
    		, endDate : $("input[id='endDate']:hidden").val()
        };
        common.Ajax.sendJSONRequest(
       		 "GET"
       	   , _baseUrl + "event/20200814/getPsbCntReview.do"
       	   , param
       	   , monthEvent.detail._callback_getPsbCntReview
        );
    },

    _callback_getPsbCntReview : function(json){
        if(json.ret == "0"){
        	$('.evtCon03 .txt_ticket span').text((json.psbCnt*1) > 999 ? '999' : json.psbCnt);
    	}
    	$('.evtCon03 .login').hide();
    	$('.evtCon03 .gift').attr('onclick', 'monthEvent.detail.applyReview();').show();
    },

    //응모
    applyReview : function(){
    	if(monthEvent.detail.applyIng){
    		return;
    	}
		if(!monthEvent.detail.checkLoginEvt()){
            return;
        }
		if(common.app.appInfo == undefined || !common.app.appInfo.isapp) {
        	if(confirm("APP에서 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
        	monthEvent.detail.applyIng = true;

	        var param = {
	        	evtNo : $("input[id='evtNo']:hidden").val()
				, MbrInfoUseAgrYn : $(':radio[name="argee1"]:checked').val()
				, MbrInfoThprSupAgrYn : $(':radio[name="argee2"]:checked').val()
				, startDate : $("input[id='startDate']:hidden").val()
	        	, startDate2 : $("input[id='startDate2']:hidden").val()
	    		, endDate : $("input[id='endDate']:hidden").val()
	    		, endDate2 : $("input[id='endDate2']:hidden").val()
	        };
	        common.Ajax.sendJSONRequest(
	       		 "GET"
	       	   , _baseUrl + "event/20200814/applyReview.do"
	       	   , param
	       	   , monthEvent.detail._callback_applyReview
	        );
        }
    },

    _callback_applyReview : function(json){
    	mevent.detail.eventCloseLayer();
    	monthEvent.detail.applyIng = false;
    	monthEvent.detail.layerPolice = false;
    	if(json.ret == '016' || json.ret == '017'){
			//위수탁동의 팝업    		
			$(':radio[name="argee1"]:input[value="N"]').attr("checked", true);
			$(':radio[name="argee2"]:input[value="N"]').attr("checked", true);
			mevent.detail.eventShowLayer('eventLayerPolice');
			$(".agreeCont")[0].scrollTop = 0;
			monthEvent.detail.layerPolice = true;    		
		}else if(json.ret == "033"){
			alert(json.message);
			$('html').scrollTop($('#evtReview').position().top);
    	}else if(json.ret == "0"){
    		if(json.popId == 'popGiftFail0'){
    			var reviewCnt = $('.evtCon03 .txt_review span a').text();
				var popNum = '3';	//리뷰 작성 후 응모
    			if(json.psbCnt > 0){
    				popNum = '1'	//한번 더 응모
    			}else if(reviewCnt <= 0){
    				popNum = '2'	//상품 구매 후 응모
    			}
				$('#' + json.popId + popNum).find('.txt_review span').text( reviewCnt );
				$('#' + json.popId + popNum).find('.txt_ticket span').text( (json.psbCnt*1) > 999 ? '999' : json.psbCnt );
				mevent.detail.eventShowLayScroll(json.popId + popNum);
    		}else{
    			$('#' + json.popId).find('.num').text('(' + json.tgtrSeq + ')');
    			mevent.detail.eventShowLayScroll(json.popId);
    		}

    		$('.evtCon03 .txt_ticket span').text((json.psbCnt*1) > 999 ? '999' : json.psbCnt);
    	}else{
    		alert(json.message);
    	}
    },
    
    //응모내역
    getMyWinList : function(){
    	if(!monthEvent.detail.checkLoginEvt()){
            return;
        }
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
        }
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/getMyEvtWinList.do"
              , param
              , monthEvent.detail._callback_getMyWinListJson
        );
    },

    _callback_getMyWinListJson : function(json){
        if(json.ret == "0"){
        	$("#evtPopWinDetail tbody").children().remove();
            var myWinListHtml = "";
            for(var i=0 ; i<json.myEvtWinList.length ; i++){
            	if(json.myEvtWinList[i].fvrSeq != '20' && json.myEvtWinList[i].fvrSeq != '21' ){
            		myWinListHtml = "<tr><td>" + json.myEvtWinList[i].strSbscSgtDtime + "</td><td>" + json.myEvtWinList[i].evtGoodsNm + "</td></tr>";
            		$("#evtPopWinDetail tbody").prepend(myWinListHtml);
            	}
            }
            if($("#evtPopWinDetail tbody tr").length == 0){
                myWinListHtml = "<tr><td colspan='2' class='no'>당첨이력이<br/> 없습니다.</td></tr>";
                $("#evtPopWinDetail tbody").prepend(myWinListHtml);
            }
            mevent.detail.eventShowLayer('evtPopWinDetail');
        }else{
            alert(json.message);
        }
    },

    //리뷰 작성하기
    appraisalRegist : function(obj) {
    	if(!monthEvent.detail.checkLoginEvt()){
            return;
        }
        var params = $(obj).data();
        
        /* 문구 추가 */
        if(params.ordConYn == "Y") {
            alert("해당 상품은 부분 교환된 상품입니다. 교환전 또는 교환후 상품 중 1개의 리뷰만 작성 가능합니다.");
        }
        
        this.setSerializeData(obj);

        $(location).attr(
                'href',
                _baseUrl + 'mypage/getGdasEvalForm.do?' + monthEvent.detail.serializeData + '&retUrl='
                    + _baseUrl + 'event/20200814/getEventDetail.do?evtNo=' + $("input[id='evtNo']:hidden").val());
    },

    setSerializeData : function(obj) {
        this.serializeData = '';

        if (arguments.length < 1 || typeof obj == 'undefined')
            return;

        this.serializeData = $.param($(obj).data());
    },

    checkLoginEvt : function(){
        if(!common.isLoginForEvt()){
            if(!confirm("해당 서비스는 로그인이 필요합니다.로그인 페이지로 이동하시겠습니까?")){
                return false;
            }else{
                common.link.moveLoginPage();
                return false;
            }
        }

        return true;
    },

    focusReview : function(){
    	if(!monthEvent.detail.checkLoginEvt()){
            return;
        }else{
            $('html, body').scrollTop($('#evtReview').offset().top);
        }
    }
}