$.namespace("mmypage.reviewerInfo");
mmypage.reviewerInfo = {
		pageIdx : 2,
		sort : '01',
		init : function() {
			review_more();
			PagingCaller.destroy();
			
			//정렬
			$('#reviewSort').change(function(e){
				mmypage.reviewerInfo.pageIdx = 1;
				mmypage.reviewerInfo.getReviewerGdasList();
			});
			
			//사진선택
			$('#reviewerGdasList .thum_area_s li.swiper-slide').click(function(e){
				e.preventDefault();
				var data_value = $(this).find('img').attr('data-value').split('_');
				var type = 'photoPlDetail';
				mgoods.gdas.photo.getGdasPhotoPage(type, data_value);
			})
			common.hideLoadingLayer();
			if($('#allReviewCnt').val() != 0){
			    mmypage.reviewerInfo.getReviewerGdasList();
			}
		},
		getReviewerGdasList : function(){
			PagingCaller.init({
	            callback : function(){
	                var param = {
	                	gdasSort : $('#reviewSort').val(),
	                	mbrNo : $('#reviewerMbrNo').val(),
	                    pageIdx : mmypage.reviewerInfo.pageIdx
	                }
	                common.Ajax.sendRequest(
	                        "POST"
	                        , _baseUrl + "mypage/getReviewerGdasListJSON.do"
	                        , param
	                        , mmypage.reviewerInfo.getReviewerGdasListSuccessCallback
	                        , false);
	            }
	        ,startPageIdx : mmypage.reviewerInfo.pageIdx
	        ,subBottomScroll : 700
	        ,initCall : ( mmypage.reviewerInfo.pageIdx > 1 ) ? false : true
	        });
		},
		getReviewerGdasListSuccessCallback : function(res){
			if($.trim(res.allReviewList).length == 0){
				PagingCaller.destroy();
				common.hideLoadingLayer();
	            return;
			}else{
				common.showLoadingLayer(false);
				if(mmypage.reviewerInfo.pageIdx == 1){
					$("#reviewerGdasList").empty();
				}
				for(var i  in res.allReviewList){
	                if(res.allReviewList[i].gdasCont != '' && res.allReviewList[i].gdasCont != null){
	                    var tmpCont = unescape(res.allReviewList[i].gdasCont);
	                    tmpCont = tmpCont.replace(/<img(.*?)>/gi,"");   //이미지 태그 제거
	                    tmpCont = tmpCont.replaceAll(" ","&nbsp;");
	                    tmpCont = tmpCont.replaceAll("<br/>|<br>|<p>|</p>","\n");
	                    tmpCont = tmpCont.replace(/(<h1 style(.*?)>|<h1>|<h1\/>|<\/h1>|<h2 style(.*?)>|<h2>|<h2\/>|<\/h2>|<h3 style(.*?)>|<h3>|<h3\/>|<\/h3>)/g, '');   //h1,h2, h3 태그 제거
	                    tmpCont = tmpCont.replace(/(<span style(.*?)>|<span>|<\/span>|<strong style(.*?)>|<strong>|<\/strong>)/g, '');   //strong, span태그 제거
	                    tmpCont = tmpCont.replace(/(<em style(.*?)>|<em>|<\/em>|<u style(.*?)>|<u>|<\/u>|<s style(.*?)>|<s>|<\/s>)/g, '');   //em, u, s태그 제거
	                    res.allReviewList[i].gdasCont = tmpCont;
	                }
	                
	                if(res.allReviewList[i].recommCnt > 0){
	                	var tmpRecommCnt = res.allReviewList[i].recommCnt
	                	res.allReviewList[i].recommCnt = numberWithCommas(tmpRecommCnt);
	                }
	                
	                if(res.allReviewList[i].itemNm != '' && res.allReviewList[i].itemNm != null){
	                	res.allReviewList[i].typeClass = 'type1';
	                }else if(res.allReviewList[i].shrtGdasCont != '' && res.allReviewList[i].shrtGdasCont !=  null){
	                	res.allReviewList[i].typeClass = 'type2';
	                }else{
	                	res.allReviewList[i].typeClass = 'type3';
	                }
	                
	                if(res.allReviewList[i].addInfoNm != [] && res.allReviewList[i].addInfoNm != null){
	                	 var tmpAddInfoNm = res.allReviewList[i].addInfoNm;
	                	 var addInfoCnt = 0;
	                	 var troubleCnt = 0;
	                	 for(var j = 0; j < tmpAddInfoNm.length; j++){
	                		 if(tmpAddInfoNm[j].colDataCd.substr(0,1) == 'C'){
	                			 troubleCnt++;
	                			//trouble 코드 2개이상일 경우 나머지 제거
	                			 if(troubleCnt == 2){
	                				 tmpAddInfoNm.splice(j+1, tmpAddInfoNm.length-1)
	                			 }
	                		 }
	                	 }
	                	 res.allReviewList[i].addInfoNm = tmpAddInfoNm;
	                }
	            }
				common.hideLoadingLayer();
				$("#reviewerGdasListTmpl").tmpl(res.allReviewList).appendTo("#reviewerGdasList");
				mmypage.reviewerInfo.pageIdx = mmypage.reviewerInfo.pageIdx + 1
				
				var _btn_toggle = $('.review_area .btn_toggle');

				_btn_toggle.each(function(){
					var _txt_area = $(this).parents('.txt_area'),
						_txt_over = _txt_area.find('.txt_over'),
						_txt_show = _txt_area.find('.txt_show'),
						_over_height = _txt_over.height(),
						_show_height = _txt_show.height();
					if(_show_height>_over_height){
						_txt_show.hide();
						$(this).show();
					}
					_txt_show.hide();
				});	
				
				$('.org_file ul li').each(function(){
					$(this).find('img').on('load',function(){
						var thum_index = $(this).parent().index();
						var temp_gdas_url = $(this).attr('src');
						var temp_gdas_width = $(this).width(), temp_gdas_height = $(this).height()
						var rs_gdas_width = temp_gdas_width, rs_gdas_height = temp_gdas_height;

						if(temp_gdas_width > temp_gdas_height){
							rs_gdas_width = temp_gdas_height;
						}else if(temp_gdas_width < temp_gdas_height){
							rs_gdas_height = temp_gdas_width;
						}
						var gdas_thum_r = temp_gdas_url+'?CS='+rs_gdas_width+'x'+rs_gdas_height;
						$('.thum_swipe ul li').eq(thum_index).find('img').attr('src', gdas_thum_r)
					});
				});
				
				var _thum_area_s = $('.thum_area_s');
	               _thum_area_s.each(function(){
	                   var _this = $(this);
	                   var _thisw = _this.width();
	                   var _thum_swipe = _this.find('.thum_swipe');
	                   var _thum_li = _thum_swipe.find('ul.inner > li');
	                   var _thum_liw = _thum_li.outerWidth()+1;
	                   var _thum_length = _thum_li.length;
	                   var _thum_w = _thum_liw*_thum_length;
	                   
	                   if(_thisw<_thum_w){
	                       var list_view = new Swiper(_thum_swipe, {
	                           observer: true, 
	                           observeParents: true,
	                           slidesPerView: 'auto',
	                       });
	                   }
	               });
				
				$('#reviewerGdasList .thum_area_s li.swiper-slide').click(function(e){
					e.preventDefault();
					var data_value = $(this).find('img').attr('data-value').split('_');
					var type = 'photoPlDetail';
					mgoods.gdas.photo.getGdasPhotoPage(type, data_value);
				})
			}
		},
		goReviewDetail : function(gdasSeq){
			location.href = _baseUrl+"mypage/getReviewerGdasDetail.do?gdasSeq="+gdasSeq;
		},
		
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function review_more(){	
	var _btn_toggle = $('.review_area .btn_toggle');

	_btn_toggle.each(function(){
		var _txt_area = $(this).parents('.txt_area'),
			_txt_over = _txt_area.find('.txt_over'),
			_txt_show = _txt_area.find('.txt_show'),
			_over_height = _txt_over.height(),
			_show_height = _txt_show.height();
		if(_show_height>_over_height){
			_txt_show.hide();
			$(this).show();
		}
		_txt_show.hide();
	});	

	_btn_toggle.on('click', function(){
		var _this = $(this);
			_review_area = _this.parents('.review_area');
			_txt_over = _review_area.find('.txt_area .txt_over'),
			_txt_show = _review_area.find('.txt_area .txt_show');			
		if(_review_area.hasClass('open')){
			_review_area.removeClass('open');
			_this.html('더보기');			        
		}else{
			_review_area.addClass('open');
			_this.html('접기');
		}
	});
}

clickMoreBtn = function(element){
	var _review_area = $(element).parent().parent().parent().parent();
	if(_review_area.hasClass('open')){
		_review_area.removeClass('open');
		$(element).html('더보기');
	}else{
		_review_area.addClass('open');
		$(element).html('접기');
	}
}