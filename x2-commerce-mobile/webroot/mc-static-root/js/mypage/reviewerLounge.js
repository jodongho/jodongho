$.namespace("mmypage.reviewerLounge");
mmypage.reviewerLounge = {
	topReviewerPageIdx : 1,
	bestReviewPageIdx : 2,
	init : function() {
		PagingCaller.destroy();
		
		$('#topReviewerList li div.user').bind('click',function(){
			var index = $(this).parent().index()+1;
			common.wlog("lounge_reviewer_"+index);
		});
		
		$('.recom_review ul').each(function(){
			$(this).find('li').bind('click',function(){
				var classname = $(this).find('a').attr('class')
				common.wlog(classname);
			})
		});
		
		$('.banner_reviewer').bind('click',function(){
			common.wlog('lounge_oy_banner');
		})
		
		$('#moreReviewerBtn').click(function(){
			common.wlog('lounge_reviewer_more');
			mmypage.reviewerLounge.getTopReviewerList();
		});
		
		mmypage.reviewerLounge.getBestReviewList();
		
	},
	bannerOpen : function(pageNm){
    	var param = {
			pageNm : pageNm,
        }
		common.Ajax.sendRequest("POST",_baseUrl + "mypage/getReviewerPop.do",param, mmypage.reviewerLounge.bannerOpenSuccessCallback);
    },
    bannerOpenSuccessCallback : function(data){
        $("#layerPop").html(data);
        common.popLayerOpen2("LAYERPOP01");
        $("#footerTab").hide();
    },
    fullBannerOpen : function(pageNm){
    	var param = {
			pageNm : pageNm,
        }
		common.Ajax.sendRequest("POST",_baseUrl + "mypage/getReviewerPop.do",param, mmypage.reviewerLounge.fullBannerOpenSuccessCallback);
    },
    fullBannerOpenSuccessCallback : function(data){
    	if($(location).attr('href').indexOf('&oyBanner=Y') < 0){
            history.pushState(null, null, window.location.href + '&oyBanner=Y');
        }
        $('.gdasPopCont').css('display','block');
        
        setTimeout(function(){
            $('#mWrapper').css('display','none');
        }, 100)
        
 	   $('body').addClass('bgw');
        $('.gdasPopCont').html(data);
    },
	getTopReviewerList : function(){
		common.showLoadingLayer(false);
		var url = _baseUrl + "mypage/getTopReviewerListJSON.do";
        var param = {
            pageIdx : mmypage.reviewerLounge.topReviewerPageIdx,
        }
        common.Ajax.sendRequest("POST",url,param, mmypage.reviewerLounge.getTopReviewerListSuccessCallback,false);
	},
	getTopReviewerListSuccessCallback : function(res){
		if($.trim(res.topReviewerList).length == 0){
            return;
		}else{
			var html = '';
			for(var i  in res.topReviewerList){
				var data = res.topReviewerList[i];
				if(data.mbrNo != undefined && data.mbrNo != null && data.mbrNo != ''){
					html += '<li>';
					html += '<p class="gnum">';
					html += '<span class="num">';
					if(data.rnk < 10){
						html += '0'+data.rnk;
					}else{
						html += data.rnk;
					}
					html += '</span>';
					html += '<br>';
					var rnkType = '';
					if(res.topReviewerList[i].rnkVrType == '10'){
						rnkType = 'up';
					}else if(res.topReviewerList[i].rnkVrType == '20'){
						rnkType = 'dw';
					}else if(res.topReviewerList[i].rnkVrType == '30'){
						rnkType = '';
					}else{
						rnkType = 'new';
					}
					html += '<span class="updw '+rnkType+'">';
					if(data.rnkVrType == '10'){
						html += '↑'+data.rnkVr;
					}else if(data.rnkVrType == '20'){
						html += '↓'+data.rnkVr;
					}else if(data.rnkVrType == '30'){
						html += '-';
					}else{
						html += 'NEW';
					}
					html += '</span>';
					html += '</p>';
					if(data.gdas != null && data.gdas != 'null'){
					    html += '<div class="user clrfix" onClick="mmypage.reviewerLounge.goReviewAll('+data.gdas.gdasSeq+');">';
					}else{
                        html += '<div class="user clrfix">';					    
					}
					html += '<a href="javascript:;">';
					if(data.profileImg != null && data.profileOpenYn == 'Y'){
                        html += '<img src="'+_profileImgUploadUrl+data.profileImg+'"  onerror="common.errorProfileImg(this);" style="display:none;" onload="common.onLoadProfileImg(this, 50);">';
                    }
                    html += '<div class="thum">';
                    html += '<span class="bg"></span>';
                    if(data.profileImg != null && data.profileOpenYn == 'Y'){
                        html += '<img src=""  class="profileThum_s" style="background:url(<%=_imgUrl%>comm/my_picture_base.jpg) no-repeat 0 0;background-size:50px">';
                    }else{
                        html += '<img src="'+_imgUrl+'comm/my_picture_base.jpg">';
                    }
                    html += '</div>';
					html += '<ul class="id_txt">';
					html += '<li class="id">'+data.mbrNm+'</li>';
					html += '<li><span class="go">작성한 리뷰 보러 가기</span></li>';
					html += '</ul>';
					html += '</a>';
					html += '</div>';
					html += '<div class="view">';
					html += '<ul>';
					var gdascnt = 0;
					if(res.topReviewerList[i].gdasCount != 0){
						if(res.topReviewerList[i].gdasCount > 0){
							gdascnt =numberWithCommas(res.topReviewerList[i].gdasCount); 
						}
					}
					html += '<li class="w">'+gdascnt+'건</li>';
					var recommcnt = 0;
					if(res.topReviewerList[i].recommedActiveCnt != 0){
						if(res.topReviewerList[i].recommedActiveCnt > 0){
							recommcnt =numberWithCommas(res.topReviewerList[i].recommedActiveCnt); 
						}
					}
					html += '<li class="k">'+recommcnt+'회</li>';
					html += '</ul>';
					html += '</div>';
					html += '</li>';
				}
            }
			common.hideLoadingLayer();
			$('#topReviewerList').append(html)
			mmypage.reviewerLounge.topReviewerPageIdx = mmypage.reviewerLounge.topReviewerPageIdx +1;
		}
	},
	getBestReviewList : function(){
		common.hideLoadingLayer();
		PagingCaller.init({
            callback : function(){
                var param = {
                    pageIdx : mmypage.reviewerLounge.bestReviewPageIdx
                }
                common.Ajax.sendRequest(
                        "POST"
                        , _baseUrl + "mypage/getBestReviewListJSON.do"
                        , param
                        , mmypage.reviewerLounge.getBestReviewListSuccessCallback
                        , false);
            }
	        ,startPageIdx : mmypage.reviewerLounge.bestReviewPageIdx
	        ,subBottomScroll : 700
	        ,initCall : ( mmypage.reviewerLounge.bestReviewPageIdx > 1 ) ? false : true
        });
	},
	getBestReviewListSuccessCallback : function(res){
		common.showLoadingLayer(false);
		if($.trim(res.bestReviewList).length == 0){
			common.hideLoadingLayer();
			PagingCaller.destroy();
            return false;
		}else{
			var html_odd = '';
			var html_even = '';
			var html = '';
			var data = '';
			for(var i  in res.bestReviewList){
				data = res.bestReviewList[i]; 
				if(data.gdasSeq != undefined && data.gdasSeq != null && data.gdasSeq != ''){
					html = '';
					html += '<li>';
					html += '<a href="#;" onClick="mmypage.reviewerLounge.goReviewDetail('+data.gdasSeq+')" class="lounge_todays_review_'+data.rnk+'">';
					html += '<div class="thum">';
					html += '<img src="'+_imgUrl+'comm/bg_2_2.png" class="set" alt="">';
					if(data.gdasImg != null){
					        html += '<img src="'+_gdasImgUploadUrl+data.gdasImg+'" onload="common.imgLoads(this,165);"  class="photo" alt="" onError="common.errorResizeImg(this,165)">';
					}else{
						html += '<img src="'+_goodsImgUploadUrl+data.goodsImg+'" alt="" onerror="common.errorImg(this);" class="photo bothum" />';
						
					}
					html += '<span class="num">리뷰 '+data.rnk+'위</span>';
					html += '</div>';
					html += '<dl class="txt">';
					if(data.shrtGdasCont != null && data.shrtGdasCont != ''){
						html += '<dt>'+data.shrtGdasCont+'</dt>';
					}
					if(data.gdasCont != null && data.gdasCont != ''){
						var tmpCont = unescape(data.gdasCont);
						tmpCont = tmpCont.replace(/<img(.*?)>/gi,"");   //이미지 태그 제거
						tmpCont = tmpCont.replaceAll("<br/>|<br>|<p>|</p>","\n");
						tmpCont = tmpCont.replaceAll(" ","&nbsp;");
						tmpCont = tmpCont.replace(/(<h1 style(.*?)>|<h1>|<h1\/>|<\/h1>|<h2 style(.*?)>|<h2>|<h2\/>|<\/h2>|<h3 style(.*?)>|<h3>|<h3\/>|<\/h3>)/g, '');   //h1,h2, h3 태그 제거
						tmpCont = tmpCont.replace(/(<span style(.*?)>|<span>|<\/span>|<strong style(.*?)>|<strong>|<\/strong>)/g, '');   //strong, span태그 제거
						tmpCont = tmpCont.replace(/(<em style(.*?)>|<em>|<\/em>|<u style(.*?)>|<u>|<\/u>|<s style(.*?)>|<s>|<\/s>)/g, '');   //em, u, s태그 제거
						html += '<dd>'+tmpCont+'</dd>';
					}
					html += '</dl>';
					html += '</a>';
					html += '</li>';
					if((data.rnk % 2) == 0){
						html_even += html;
					}else{
						html_odd += html;
					}
				}
            }
			common.hideLoadingLayer();
			$('#bestReviewList_odd').append(html_odd);
			$('#bestReviewList_even').append(html_even);
			mmypage.reviewerLounge.bestReviewPageIdx = mmypage.reviewerLounge.bestReviewPageIdx +1;
			
			$('.recom_review ul').each(function(){
				$(this).find('li').bind('click',function(){
					var classname = $(this).find('a').attr('class')
					common.wlog(classname);
				})
			});
		}
	},
	goReviewAll : function(gdasSeq){
		location.href = _baseUrl+"mypage/getReviewerProfile.do?key="+gdasSeq;
	},
	goReviewDetail : function(gdasSeq){
		location.href = _baseUrl+"mypage/getReviewerGdasDetail.do?gdasSeq="+gdasSeq;
	},
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function topReviewerPopClose(layerNm) {
	common.popLayerClose(layerNm);
	$("#footerTab").show()
}
