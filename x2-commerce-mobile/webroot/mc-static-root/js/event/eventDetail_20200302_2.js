/**
 * 배포일자 : 2020-02-25
 * 오픈일자 : 2020-03-02
 * 이벤트명 : 3월 리뷰 - 올리브 챌린지
 * */
$.namespace("monthEvent.detail");
monthEvent.detail = {
	gdasSeq : '',
	applyIng : false,
	addYn : '',
	snsInitYn : "N",
	swiper : '',
	layerPolice : false,
	init : function(){
		/* 리뷰 현황 조회 */
		monthEvent.detail.getPhotoReviewStatus();
		monthEvent.detail.getMyPhotoReviewStatus();

		//챌린지 참여
		$('.myChallenge').on('click', function(){
			if($(this).hasClass('on')){
				monthEvent.detail.photoReviewApply();
			}
		});

		//카카오톡 공유
		$('.shareKakao').on('click', function(){
			monthEvent.detail.kakaoShareSns();
		});

		//나의 리뷰 더보기
		$('.moreView').on('click', function(){
			if($('.evtCon03 .AllreviewList:eq(0)').is(':visible')
				&& !common.isEmpty(monthEvent.detail.gdasSeq)){
				common.link.commonMoveUrl('mypage/getReviewerProfile.do?key=' + monthEvent.detail.gdasSeq);
			}
		});

		$('.challengeType option:eq(0)').val('new');
		$('.challengeType option:eq(1)').val('recommed');
		//내가 뽑는 챌린지 위너
		$('.challengeType').on('change', function(){
			if(!common.isEmpty(monthEvent.detail.swiper)){
				monthEvent.detail.swiper.destroy();
			}
			$('.evtCon05').find('.swiper-wrapper, .swiper-pagination').children().remove();
			$('.evtCon05 .challengeType').hide();
			$('.evtCon05 .challengeWinnerList:eq(0)').show();
			$('.evtCon05 .evtLoading').show();

			var c_val = $(this).val();
			setTimeout(function(){
				monthEvent.detail.setApplyReviewList( c_val );
			}, 300);
		});
		$('select.challengeType').val('recommed').trigger('change');

		//챌린지 위너  수상 TIP
		  var swiper = new Swiper('.evtCon06 .review-swiper-container', {
			slidesPerView: 1,
			initialSlide: 0,
			autoplay: 4000,
			pagination: '.paging',
			nextButton: '.next',
			prevButton: '.prev',
			autoplayDisableOnInteraction: true,
			paginationClickable: true,
			freeMode: false,
			spaceBetween: 0,
			loop: true,
			pagination: target +' .swiper-pagination',
			navigation: {
			  nextEl: target +' .swiper-button.next',
			  prevEl: target +' .swiper-button.prev',
			},
		  });

		//직접 X(닫기) 클릭 or 레이어팝업 이외 영역 클릭 시, 알럿
		$('#eventDimLayer, #eventLayerPolice .eventHideLayer').click(function(){
			if(monthEvent.detail.layerPolice){
				alert('동의 후 참여 가능합니다.');

				monthEvent.detail.layerPolice = false;
				mevent.detail.eventCloseLayer();

				//초기화
				$(':radio[name="argee1"]:input[value="N"]').attr("checked", true);
				$(':radio[name="argee2"]:input[value="N"]').attr("checked", true);
			}
		});
	},

	startSwiper : function(target){
		monthEvent.detail.swiper = new Swiper(target +' .review-swiper-container', {
			slidesPerView: 1,
			initialSlide: 0,
			autoplay: 4000,
			pagination: '.paging',
			nextButton: '.next',
			prevButton: '.prev',
			autoplayDisableOnInteraction: true,
			paginationClickable: true,
			freeMode: false,
			spaceBetween: 0,
			loop: true,
			pagination: target +' .swiper-pagination',
			navigation: {
			  nextEl: target +' .swiper-button.next',
			  prevEl: target +' .swiper-button.prev',
			},
	  });
	},

    /* 공유하기 */
    kakaoShareSns : function(){
        if (common.app.appInfo == undefined || !common.app.appInfo.isapp) {
            if(confirm("APP에서만 공유 가능해요")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else if(!mevent.detail.checkLogin()){
            return;
        }else if(common.isEmpty(monthEvent.detail.gdasSeq)){
            alert('리뷰를 쓴 뒤에 도움을 요청할 수 있어요.');
        }else{
            var evtNo = $("input[id='evtNo']:hidden").val();
            var imgUrl = "http:" + _cdnImgUrl + "contents/202003/02review/shareKakao.jpg";
            var title = " 친구가 작성한 리뷰 구경하고"
            	+"\n"+ "‘도움이 돼요’를 눌러"
            	+"\n"+ "친구를 응원해주세요👍❤️";

            // 배너 이미지 체크
            var bnrImgUrlAddr = $("#bnrImgUrlAddr").val();
            if(bnrImgUrlAddr == undefined || bnrImgUrlAddr == null || bnrImgUrlAddr == ""){
                bnrImgUrlAddr = "";
            } else if($.trim(bnrImgUrlAddr).indexOf(_fileUploadUrl) == -1){
                bnrImgUrlAddr = _fileUploadUrl + bnrImgUrlAddr;
            }

            // 이미지가 없을 경우만 배너로 교체
            if(imgUrl == undefined || imgUrl == null || imgUrl == ""){
                imgUrl = bnrImgUrlAddr;
            }

            var snsShareUrl = _baseUrl + "mypage/getReviewerProfile.do?key=" + monthEvent.detail.gdasSeq;
            snsShareUrl = _baseUrl + "common/runApp.do?redirectLinkUrl="+ snsShareUrl

            /* sns common init 시키기 위해서 한번만 실행 */
            if(monthEvent.detail.snsInitYn == "N"){
                common.sns.initKakaoEvt(imgUrl, title, snsShareUrl);
                monthEvent.detail.snsInitYn = "Y";
            }

            common.sns.doShareKakaoEvt("kakaotalk");
        }
    },

	/* 응모자 리뷰 현황 조회 */
    getPhotoReviewStatus : function(){
		var param = {
			evtNo : $("input[id='evtNo']:hidden").val()
			,startDate : $("input[id='startDate']:hidden").val()
			,endDate : $("input[id='endDate']:hidden").val()
		}
		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "event/20200302_2/getPhotoReviewStatus.do"
			  , param
			  , monthEvent.detail._callback_getPhotoReviewStatus
		);
	},

	_callback_getPhotoReviewStatus : function(json){
		if(json.ret == "0"){
			$('.challengeNum span').text(json.totAddCnt.toString().length > 4 ? '99,999+' : comma(json.totAddCnt));
			$('.topReviwNum span').text(json.topRecommedCnt.toString().length > 4 ? '99,999+' : comma(json.topRecommedCnt));
		}
	},

	/* 나의 리뷰 현황 조회 */
    getMyPhotoReviewStatus : function(){
		var param = {
			evtNo : $("input[id='evtNo']:hidden").val()
			,startDate : $("input[id='startDate']:hidden").val()
			,endDate : $("input[id='endDate']:hidden").val()
		}
		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "event/20200302_2/getMyPhotoReviewStatus.do"
			  , param
			  , monthEvent.detail._callback_getMyPhotoReviewStatus
		);
	},

	_callback_getMyPhotoReviewStatus : function(json){
		$('.reviewCon').children().remove();
		if(json.ret == "0"){
			monthEvent.detail.addYn = json.addYn;	//응모 여부

			if(common.isEmpty(json.gdasInfo)){
				$('.totalReviewNum span').text('0');
			}else{
				monthEvent.detail.gdasSeq = json.gdasInfo.MBR_GDAS_SEQ;
				$('.totalReviewNum span').text(json.gdasInfo.MBR_RECOMMED_CNT.toString().length > 4 ? '99,999+' : comma(json.gdasInfo.MBR_RECOMMED_CNT));
			}

			//나의 리뷰 목록
			if(json.myReviewList.length != 0){
				for(var i = 0; i < json.myReviewList.length; i++ ){
					if(common.isEmpty(json.myReviewList[0])){
						break;
					}
					var myGdas = json.myReviewList[i];
					if(common.isEmpty(myGdas)){
						continue;
					}
					var gdasImg = _cdnImgUrl+'images/gdasEditor/' + myGdas.GDAS_IMG;
					$('.reviewCon').append(
						$('<div/>', {'class':'reviewItem'})
							.append($('<div/>', {'class':'itemThumb'}).append($('<img/>', {'src':gdasImg, 'alt':'포토리뷰사진', 'onerror':'common.errorResizeImg(this,90)'})))
							.append($('<div/>', {'class':'itemDes'})
								.append($('<div/>', {'class':'txt_rvDate'}).append('작성일자: ').append($('<span/>').text( myGdas.REVIEW_SYS_REG_DTIME )))
								.append($('<div/>', {'class':'txt_rvBrand'}).append($('<span/>').text( myGdas.GOODS_NM )))
								)
								.append($('<div/>', {'class':'itemSupport'}).append($('<span/>').text( myGdas.RECOMMED_CNT )).append('회'))
					);
				}
			}
		}
		if($('.reviewCon .reviewItem').length != 0){
			$('.evtCon03 .reviewEmpty').hide();
			$('.evtCon03 .AllreviewList:eq(0)').show();

			if('Y' == monthEvent.detail.addYn){
				$('.myChallenge').removeClass('on');
			}
		}else{
			$('.evtCon03 .AllreviewList:eq(0)').hide();
			$('.evtCon03 .reviewEmpty').show();
		}
	},

	//응모자 리뷰 목록 셋팅
	setApplyReviewList : function(sort){
		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
				,startDate : $("input[id='startDate']:hidden").val()
				,endDate : $("input[id='endDate']:hidden").val()
				,noteCont : sort
			}
			common.Ajax.sendJSONRequest(
					"GET"
				  , _baseUrl + "event/20200302_2/getPhotoReviewList.do"
				  , param
				  , monthEvent.detail._callback_setApplyReviewList
			);
	},

	_callback_setApplyReviewList : function(json){
		if(json.applyReviewList.length != 0){
			for(var i = 0; i < json.applyReviewList.length; i++ ){
				if(common.isEmpty(json.applyReviewList[0])){
					break;
				}
				var applyGdas = json.applyReviewList[i];
				if(common.isEmpty(applyGdas)){
					continue;
				}
				var gdasImg = _cdnImgUrl+'images/gdasEditor/' + applyGdas.GDAS_IMG;

				var challengeIdx = parseInt($('.evtCon05 .challengeWinner').length / 9);
				if($('.evtCon05 .swiper-slide:eq(' + challengeIdx + ')').length == 0){
					$('.evtCon05 .swiper-wrapper').append(
						$('<div/>', {'class':'swiper-slide'})
					);
				}

				$('.evtCon05 .swiper-slide:last').append(
						$('<div/>', {'class':'challengeWinner', 'id':'cha_'+i, 'alt':'포토리뷰사진', 'onclick': 'common.link.commonMoveUrl("mypage/getReviewerGdasDetail.do?gdasSeq=' + applyGdas.GDAS_SEQ +'")'})
							.append($('<img/>', {'src':gdasImg, 'onerror':'common.errorResizeImg(this,90)'}))
							.append($('<span/>').text( applyGdas.RECOMMED_CNT+'회'))
				);
			}
		}
		if($('.evtCon05 .challengeWinner').length != 0){
			monthEvent.detail.startSwiper('.evtCon05');
			$('.evtCon05 .challengeType').show();
			$('.evtCon05 .evtLoading').hide();
		}else{
			$('.evtCon05 .challengeWinnerList:eq(0)').hide();
			$('.evtCon05 .reviewEmpty').show();
		}
	},

	/* 참여 */
	photoReviewApply : function(){
		if(!mevent.detail.checkLogin()){
			return;
		}else if(monthEvent.detail.possibleApply == 'N'){
			alert('기간 내 신규 수신동의 고객이 아닙니다.');
		}else if('Y' == monthEvent.detail.addYn){
			alert('이미 응모하셨습니다.');
		}else if(0 == $('.reviewCon .reviewItem').length){
			alert('포토 리뷰 작성 후 참여해 주세요.');
			common.link.commonMoveUrl('mypage/getGdasList.do');
		}else{
			if(!monthEvent.detail.applyIng){
				monthEvent.detail.applyIng = true;

				var param = {
						evtNo : $("input[id='evtNo']:hidden").val()
						,startDate : $("input[id='startDate']:hidden").val()
						,endDate : $("input[id='endDate']:hidden").val()
						,MbrInfoUseAgrYn : $(':radio[name="argee1"]:checked').val()
						,MbrInfoThprSupAgrYn : $(':radio[name="argee2"]:checked').val()
				}
				common.Ajax.sendJSONRequest(
						"GET"
					  , _baseUrl + "event/20200302_2/photoReviewApply.do"
					  , param
					  , monthEvent.detail._callback_photoReviewApply
				);
			}
		}
	},

	_callback_photoReviewApply : function(json){
		if(json.ret == '016' || json.ret == '017'){
			//위수탁동의 팝업
			$(':radio[name="argee1"]:input[value="N"]').attr("checked", true);
			$(':radio[name="argee2"]:input[value="N"]').attr("checked", true);
			mevent.detail.eventShowLayer('eventLayerPolice');
			$(".agreeCont")[0].scrollTop = 0;
			monthEvent.detail.layerPolice = true;
		}else if(json.ret == '0'){
            $('#evtGift'+json.fvrSeq+' .win_number').text(json.tgtrSeq);
            mevent.detail.eventShowLayer('evtGift'+json.fvrSeq);
            $('.myChallenge').removeClass('on');
		}else{
			alert(json.message);
		}
		monthEvent.detail.applyIng = false;
	},

	/* 위수탁 동의 팝업 */
	popLayerConfirm : function(){
		if("Y" != $(':radio[name="argee1"]:checked').val() || "Y" != $(':radio[name="argee2"]:checked').val()){
			alert("2가지 모두 동의 후 참여 가능합니다.");
			return;
		}

		if("Y" == $(':radio[name="argee1"]:checked').val() && "Y" == $(':radio[name="argee2"]:checked').val()){
			monthEvent.detail.layerPolice = false;
			mevent.detail.eventCloseLayer();

			monthEvent.detail.photoReviewApply();
		}
	}

}