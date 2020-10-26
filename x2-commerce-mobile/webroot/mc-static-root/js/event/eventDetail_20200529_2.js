/**
 * 배포일자 : 2020-05-26
 * 오픈일자 : 2020-05-29
 * 이벤트명 : 올리뷰 챌린지
 * */
$.namespace("monthEvent.detail");
monthEvent.detail = {
	applyIng : false,
	addYn : '',
	currentDay : '',
	swiper : '',
	layerPolice : false,
	init : function(){
		monthEvent.detail.currentDay = $("input[id='imgUrlConnectDay']:hidden").val();

		if(monthEvent.detail.currentDay >= '20200601'){
		    $('.banner02:eq(0)').hide();
		    $('.banner02:eq(1)').show();
		}else{
		    $('.banner02:eq(0)').show();
		    $('.banner02:eq(1)').hide();
		}

		monthEvent.detail.getMyReviewStatus();

		//챌린지 참여
		$('.mc_btn_join, .btn_cjoin').on('click', function(){
			if('Y' != monthEvent.detail.addYn){
				monthEvent.detail.reviewApply();
			}
		});

		$('.rbSlideArea select option:eq(0)').val('random');
		$('.rbSlideArea select option:eq(1)').val('new');
		//내가 뽑는 챌린지 위너
		$('.rbSlideArea select').on('change', function(){
			if(!common.isEmpty(monthEvent.detail.swiper)){
				monthEvent.detail.swiper.destroy();
			}
			$('.rbSlideArea .rbSlide').find('.swiper-wrapper, .swiper-pagination').children().remove();
			$('.rbSlideArea select').parents('.clrfix').hide();
			$('.rbSlideArea .loading').show();

			var c_val = $(this).val();
			setTimeout(function(){
				monthEvent.detail.getReviewList( c_val );
			}, 300);
		});
		$('.rbSlideArea select').val('random').trigger('change');

		//챌린지 위너 우수 리뷰
		var rbSlide2 = new Swiper('.rbSlide2', {
			slidesPerView:'auto',
			initialSlide: 0,
			autoplay: 5000,
			pagination: '.paging',
			pagination: '.swiper-pagination',
			autoplayDisableOnInteraction: true,
			paginationClickable: true,
			freeMode: false,
			loop: true,
			observer: true,
			observeParents: true,
			
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

	startSwiper : function(){
		//이번 챌린지 위너는 누구
		monthEvent.detail.swiper = new Swiper('.rbSlide', {
			slidesPerView: 1,
			initialSlide: 0,
			autoplay: 5000,
			pagination: '.paging',
			pagination: '.swiper-pagination',
			autoplayDisableOnInteraction: true,
			paginationClickable: true,
			freeMode: false,
			loop: true,
			observer: true,
			observeParents: true,
			
		});
	},

	/* 리뷰 현황 조회 */
	getMyReviewStatus : function(){
		var param = {
			evtNo : $("input[id='evtNo']:hidden").val()
			,startDate : $("input[id='startDate']:hidden").val()
			,endDate : $("input[id='endDate']:hidden").val()
		}
		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "event/20200529_2/getMyReviewStatus.do"
			  , param
			  , monthEvent.detail._callback_getMyReviewStatus
		);
	},

	_callback_getMyReviewStatus : function(json){
		if(json.addYn == "Y"){
			monthEvent.detail.addYn = json.addYn;
			$('.mc_btn_join img').attr('src', '//image.oliveyoung.co.kr/uploads/contents/202005/29challenge/mc_btn_join_1_2.jpg');

			if(!common.isEmpty(json.myProfile.APPX_FILE_PATH_NM) && !common.isEmpty(json.myProfile.MBR_NICK_NM)){
				//이미지
				$('.myChallenge .my1_2 img').attr('src', _profileImgUploadUrl + json.myProfile.APPX_FILE_PATH_NM + '?RS=93x60&CS=60x60');
				$('.myChallenge .my1_2 img').attr('onerror','common.onLoadProfileImg(this, 50);')
				//닉네임, 프로필 등록 후
				$('.myChallenge .my1_2 .nic').text( json.myProfile.MBR_NICK_NM.substring(0,5) );
				if(common.isEmpty(json.myRank) || '0' == json.myRank){
					$('.myChallenge .my1_2 .ratenum').text('현재 -위!');
				}else{
					$('.myChallenge .my1_2 .ratenum').text('현재 ' + ((json.myRank) * 1 > 9999 ? '9,999' : comma(json.myRank))  + '위!');
				}

				$('.myChallenge .my1_1').hide();
				$('.myChallenge .my1_2').show();
			}else{
				//닉네임, 프로필 등록 전
				$('.myChallenge .my1_1 .myp img').attr('src', _imgUrl + '/comm/my_picture_base.jpg');

				$('.myChallenge .my1_2').hide();
				$('.myChallenge .my1_1').show();
			}

			//내가 작성한 평균 글자 수
			$('.myChallenge .icon01 span').text( ((json.myGdas.AVG_GDAS_LEN) * 1 > 9999 ? '9,999' : comma(json.myGdas.AVG_GDAS_LEN))  + '자' );
			//내가 작성한 포토 리뷰 수
			$('.myChallenge .icon02 span').text( ((json.myGdas.PHOTO_CNT) * 1 > 9999 ? '9,999' : comma(json.myGdas.PHOTO_CNT * 1))  + '건' );

			$('.myChallenge .inner:eq(0)').hide();
			$('.myChallenge .inner:eq(1)').show();
		}
	},

	//응모자 리뷰 목록 셋팅
	getReviewList : function(sort){
		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
				,startDate : $("input[id='startDate']:hidden").val()
				,endDate : $("input[id='endDate']:hidden").val()
				,noteCont : sort
			}
			common.Ajax.sendJSONRequest(
					"GET"
				  , _baseUrl + "event/20200529_2/getReviewList.do"
				  , param
				  , monthEvent.detail._callback_getReviewList
			);
	},

	_callback_getReviewList : function(json){
		var targetList = $('.rbSlideArea .rbSlide');
		if(!common.isEmpty(json.applyReviewList) && json.applyReviewList.length != 0){
			for(var i = 0; i < json.applyReviewList.length; i++ ){
				var applyGdas = json.applyReviewList[i];
				if(common.isEmpty(applyGdas) || common.isEmpty(applyGdas.gdasCont)){
					continue;
				}

				var challengeIdx = parseInt($(targetList).find('.item').length / 3);
				if($(targetList).find('.swiper-slide:eq(' + challengeIdx + ')').length == 0){
					$(targetList).find('.swiper-wrapper').append(
						$('<div/>', {'class':'swiper-slide'})
					);
				}

				var itemClass = 'item clrfix';
				if($(targetList).find('.swiper-slide:last .item').length == 1){
					//두번째 아이템 라인 class
					itemClass += ' colr';
				}

				var reviewImg = _gdasImgUploadUrl + applyGdas.gdasImg;
				if(common.isEmpty(applyGdas.gdasImg)){
					reviewImg = _goodsImgUploadUrl + applyGdas.goodsImg;
				}

				$(targetList).find('.swiper-slide:last').append(
						$('<div/>', {'class':itemClass, 'id':'cha_'+i, 'onclick': 'common.link.commonMoveUrl("mypage/getReviewerGdasDetail.do?gdasSeq=' + applyGdas.gdasSeq +'")'})
							.append(
									$('<p/>', {'class':'thum'}).append(
											$('<img/>', {'src':'//image.oliveyoung.co.kr/mc-static-root/image/comm/bg_2_2.png'})
										).append(
											$('<span/>').append($('<img/>', {'src':reviewImg, 'onerror':'common.errorImg(this)', 'alt':'리뷰사진'}))
										)
									
							).append(
									$('<p/>', {'class':'txt'}).text(applyGdas.gdasCont + (applyGdas.gdasLen > 60 ? '..' : ''))
							).append(
									$('<p/>', {'class':'icon'}).text(applyGdas.recommedCnt+'회')
							)
				);
			}
		}
		if($('.rbSlideArea .rbSlide .item').length != 0){
			monthEvent.detail.startSwiper();
			$('.rbSlideArea select').parents('.clrfix').show();
			$('.rbSlideArea .rbSlide').show();
		}else{
			$('.rbSlideArea .rbSlide').hide();
			$('.rbSlideArea .reviewNone').show();
		}
		$('.rbSlideArea .loading').hide();
	},

	/* 참여 */
	reviewApply : function(){
		if(!mevent.detail.checkLogin()){
			return;
		}else if('Y' == monthEvent.detail.addYn){
			alert('이미 응모하셨습니다.');
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
					  , _baseUrl + "event/20200529_2/reviewApply.do"
					  , param
					  , monthEvent.detail._callback_reviewApply
				);
			}
		}
	},

	_callback_reviewApply : function(json){
		if(json.ret == '016' || json.ret == '017'){
			//위수탁동의 팝업
			$(':radio[name="argee1"]:input[value="N"]').attr("checked", true);
			$(':radio[name="argee2"]:input[value="N"]').attr("checked", true);
			mevent.detail.eventShowLayer('eventLayerPolice');
			$(".agreeCont")[0].scrollTop = 0;
			monthEvent.detail.layerPolice = true;
		}else if(json.ret == '0'){
			mevent.detail.eventShowLayer('evtGift'+json.fvrSeq);
			monthEvent.detail.getMyReviewStatus();
		}else if(json.ret == "-1"){
			if(confirm("해당 서비스는 로그인이 필요합니다.로그인 페이지로 이동하시겠습니까?")){
				common.link.moveLoginPage();
				return false;
			}
		}else if(json.ret == '011'){
			alert('50자 이상 리뷰 작성시에만 챌린지 참여 가능해요.');
			common.link.commonMoveUrl('mypage/getGdasList.do');
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

			monthEvent.detail.reviewApply();
		}
	}

}