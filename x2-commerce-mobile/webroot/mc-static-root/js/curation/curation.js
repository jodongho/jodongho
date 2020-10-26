/** 큐레이션 공통 스크립트 실행 순서
 * 1. curation.callCuration 실행으로 api 호출하여 jsonp 형식으로 결과를 리턴받는다.
 * 2. curation.getCurationCallBack 실행하여 서버에서 조회.
 *   app은 curation.getCurationPop을 호출, native modal에서 실행.
 * 3. curation.setCuration 을 통해 각 조건에 따라 html 셋팅.
 * 4. curation.viewScript를 통해 필요한 스크립트를 로드한다.
*/
var curation_title = {
	'a008' : '{0}', // [주문] 주문완료
	'a008_pop' : '함께 구매하면 좋은 추천 상품', 
	'a008_tip' : '{1}',
	'p201' : '<strong>최근 본 상품</strong>과 연관 추천 상품 ', // [홈] 최근 본 상품 연관 상품
	'p201_pop' : '최근 본 상품과 연관 추천 상품',
	'p201_tip' : '고객님의 소비 성향을 분석하여 <br/>최근 본 상품과 가장 연관성 높은 상품 추천해드려요',
	'p001' : '<strong>최근 본 상품</strong>과 연관 추천 상품', // [홈] 최근 본 상품 연관 상품
	'p001_pop' : '최근 본 상품과 연관 추천 상품',
	'p001_tip' : '고객님의 소비 성향을 분석하여 <br/>최근 본 상품과 가장 연관성 높은 상품 추천해드려요',
	'p303' : '<strong>{0}님</strong>과 <strong>유사한 고객님</strong>들이 많이 구매하는 상품이에요', // [홈] 어을리는 상품 추천
	'p303_pop' : '{0}님에게 추천드리는 상품',
	'p303_tip' : 'AI 추천 알고리즘으로 분석하여 <br/>고객님의 성향에 맞게 추천드리는 상품이에요',
	'p301' : '<strong>유사한 고객님</strong>들이 많이 구매하는 상품이에요', // [홈] 어을리는 상품 추천
	'p301_pop' : '고객님에게 추천드리는 상품',
	'p301_tip' : 'AI 추천 알고리즘으로 분석하여 <br/>고객님의 성향에 맞게 추천드리는 상품이에요',
	'm002_pop' : '다른 고객님이 많이 구매한 상품',
	'm002_tip' : '고객님의 소비 성향을 분석하여<br/>최근 본 상품과 가장 연관성 높은 상품 추천해드려요',
	'a007' : '상품이 마음에 안 드셨나요?</br><strong>{0}</strong> 다른 상품이에요', // [주문] 주문취소
	'a007_pop' : '{0} 상품 추천',
	'a007_tip' : '주문 취소한 상품 대신 {1}님에게 어울리는<br/><strong>{0}</strong> 상품을 추천해드려요',
	'a002' : '이런 <strong>{0}</strong> 상품은 어떠세요?', // [상품상세] 함께 구매하면 좋은 상품
	'a002_pop' : '{0} 추천 상품', 
	'a002_tip' : '고객님과 비슷한 성향의 다른 고객님이 많이 구매한<br/><strong>{0}</strong> 상품이에요',
	'n002' : '<strong>{0}</strong> 상품 추천해드려요', // [상품상세] 일시품절 레이어
	'n002_pop' : '{1}님과 어울리는 <strong>{0}</strong>',
	'n002_tip' : '<strong>{0}</strong> 중에 <br/>고객님의 소비 성향과 어울리는 상품을 추천해드려요',
	'a003_pop' : '함께 보면 좋은 상품이에요', // [상품상세] 함께 보면 좋은 상품
	'a003_tip' : '고객님과 비슷한 성향의 다른 고객님이<br/>함께 많이 본 상품이에요',
	'a015_pop' : '함께 구매하면 좋은 추천 상품이에요', // [장바구니 하단] 함께 구매하면 좋은 상품
	'a015_tip' : '고객님과 비슷한 성향의 다른 고객님이<br/>함께 많이 구매한 상품이에요',
	's001_pop' : '{0}', // [검색] 검색 결과 3개 미만,
	's001_tip' : '{1}',
	'a014_pop' : '추천 상품',
	't001' : "이 시간 <strong>올리브영에서 인기 있는</strong> 상품이에요",
	't001_pop' : "{0}",
	't001_tip' : "AI 추천 알고리즘으로 분석하여<br/>고객님의 성향에 맞게 추천하는 상품이에요",
	'p038' : '지금 주목할 만한 세일 상품',
	'p038_pop' : '놓쳐서는 안 될 세일 상품',
	'p038_tip' : '고객님과 비슷한 성향의 다른 고객님이<br/>많이 구매한 세일 상품이에요',
	'a024_pop' : '배송비 무료 달성을 위한 추천 상품',
};

$.namespace("curation");
curation = {
	defaults : {
		size : 40,
		cpage : "",
		cps : "",
		cuid : "",
		userId : "",
		cpcids : "",
		pcid : getCookie_curation("RB_PCID")
	},
	
	popLoad : true,
	callCuration : function(recType, p_param, callBackFunc, callBackFailFunc) {
		p_param.cuid = recoCuid;
		p_param.userId = hashedRecoSsoMbrNo;

		var params = jQuery.extend(curation.defaults, p_param);
		
		var sendParam = {};
		for(keys in params) {
			if(params[keys] != "" && params[keys] != undefined) {
				sendParam[keys] = params[keys];
			}
		}
		
		sendParam.size = 40;
		
		try {
			$.ajaxPrefilter('json', function(options, orig, jqXHR) {
				if (options.crossDomain && !$.support.cors) return 'jsonp'
			});
			
			$.ajax({
				url : 'https://api.rec.eigene.io/rec/' + recType,	
				data : sendParam,
				type : 'GET',
				crossDomain : true,
				dataType : 'json',
				timeout : 3000,
				success : function(data) {
					if(callBackFunc != undefined && callBackFunc != null && callBackFunc != '') {
						var callBackData = jQuery.extend(data, sendParam);
						callBackFunc(data);
					}
				},
				error : function(e) {
					if(p_param.load != "pop") {
						$("#goods_curation_"+recType).parents(".curation_wrap:eq(0)").hide();
					}
					
					// 서버 오류 시 콜백처리가 필요하여 추가.
					if(callBackFailFunc != undefined && callBackFailFunc != null && callBackFailFunc != '') {
						callBackFailFunc();
					}
				}
			});
		} catch(e) {
			
			// 서버 오류 시 콜백처리가 필요하여 추가.
			if(callBackFailFunc != undefined && callBackFailFunc != null && callBackFailFunc != '') {
				callBackFailFunc();
			}
			
		}
	},
	getCurationCallBack : function(data, url) {
		var dataResult = true;
		
		if(data.results == null || data.results == undefined) {
			dataResult = false;
			$("#goods_curation_" + data.recType).parents(".curation_wrap:eq(0)").hide();
			return;
		}
		
		if(data.results.length == 0) {
			dataResult = false;
			$("#goods_curation_" + data.recType).parents(".curation_wrap:eq(0)").hide();
			return;
		}
		
		if(url == undefined || url == "") {
			url = _baseUrl + "curation/getCurationCallBackAjax.do";
		}
		
		var requestParam = {
			recType : data.recType, // url 정보
			viewType : data.viewType, // 가로형, 세로형
			viewSize : data.viewSize, // 최대 노출 수
			styleNo : data.styleNo, // 상품 tag 템블릿 번호
			goodsNo : data.goodsNo || "",
			loginArea : data.loginArea || "Y", // 로그인, 프로필 영역 노출 여부
			extGoodsNo : data.extGoodsNo != "" && data.extGoodsNo != undefined ? data.extGoodsNo.join(",") : "",
			dispCatNo : data.dispCatNo || "",
			quickYn : data.quickYn // 오늘드림 여부
		};
		
		var scriptParam = {
			popupYn : data.popupYn || "", // 팝업 여부
			popLayerYn : data.popLayerYn || "", // 레이어 여부 (상품상세 장바구니 담기, 일시품절)
			popLayerNm : data.popLayerNm || "", // 레이어명(id)
			titlRp : data.titlRp || "",
			appYn : data.appYn || "N",
			viewArea : data.viewArea || "", // 영역
			offset : data.offset || 20, // swiper 앞뒤 간격 (미 설정시 좌우 기본 20)
			// 하위 더보기 팝업 이벤트 생성을 위한 큐레이션 파라미터 전송
			cps : data.cps,
			cpt : data.cpt,
			cpcids : data.cpcids,
			size : data.size,
			iids : data.iids,
			price : data.price,
			rccode : data.rccode || ""
		};
		
		var goodsNo = "";
		var rank = "";
		var egcode = "";
		
		var results = data.results;
		
		for(var i=0; i<results.length; i++) {
			var tempGoodsNo = results[i].product.itemUrl;
			if(tempGoodsNo != "" && tempGoodsNo != undefined) {
				goodsNo += tempGoodsNo.replace("goodsNo=", "");
				rank += results[i].rank == undefined || results[i].rank == "" ? "" : results[i].rank;
				egcode += results[i].egcode == undefined || results[i].egcode == "" ? "" : results[i].egcode;
				
				if(i != (results.length - 1)) {
					goodsNo += ",";
					rank += ",";
					egcode += ",";
				}
			}
		}
		
		requestParam.goodsNoStr = goodsNo;
		requestParam.rankStr = rank;
		requestParam.egcodeStr = egcode;
		
		common.Ajax.sendRequest("POST",url, requestParam, function(html) {
			if($("#loadingBox_" + data.recType).length > 0) {
				$("#loadingBox_" + data.recType).hide();
			}
			
			var obj = jQuery.extend(requestParam, scriptParam);
			if(data.callBackFunc != undefined && data.callBackFunc != "") {
				data.callBackFunc(obj, html);
			} else {
				curation.setCuration(obj, html);
			}
		});
		
		return dataResult;
	},
	getCurationPop : function(data, url) {
		if(url == undefined || url == "") {
			url = _baseUrl + "curation/getCurationPop.do";
		}
		
		var titlRp = common.isEmpty(data.titlRp) ? "" : data.titlRp;
		var closeYn = common.isEmpty(data.closeYn) ? "Y" : data.closeYn;
        var isGet = common.isEmpty(data.isGet) ? "Y" : data.isGet;
        var isBack = common.isEmpty(data.isBack) ? "Y" : data.isBack;
        
        var title = curation_title[data.recType + "_pop"];
        
        var arrReplace = titlRp.split(";");
        for(var i=0; i<arrReplace.length; i++) {
        	title = title.replace('{'+ i +'}', arrReplace[i]);
        }
        
        title = title.replace(/<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig, "");
        
        var extGoodsNoStr = data.extGoodsNo.join(",");
        
        var obj = {
	    	size : data.size,
	    	cps : data.cps,
	    	cpt : data.cpt,
	    	cpcids : data.cpcids || "",
	    	price : data.price,
	    	recType : data.recType,
	    	iids : data.iids || "",
	    	goodsNo : data.goodsNo || "",
	    	titlRp : data.titlRp,
	    	extGoodsNo : extGoodsNoStr,
	    	dispCatNo : data.dispCatNo || "",
	    	loginArea : data.loginArea || "",
	    	rccode : data.rccode || "",
	    	quickYn : data.quickYn || "",
	    };
        
        var tempObj = jQuery.extend(curation.defaults, obj);
        
		var sendParam = {};
		for(keys in tempObj) {
			if(tempObj[keys] != "" && tempObj[keys] != undefined) {
				sendParam[keys] = tempObj[keys];
			}
		}
		
        url = url + '?' + $.param(sendParam);
        curation.popLoad = true;
        location.href = "oliveyoungapp://openPage?" 
            + "title=" + common.app.fixedEncodeURIComponent(title)
            + "&url=" + common.app.fixedEncodeURIComponent(url) 
            + "&closeYn="+common.app.fixedEncodeURIComponent(closeYn) 
            + "&isGet=" + common.app.fixedEncodeURIComponent(isGet) 
            + "&isBack=" + common.app.fixedEncodeURIComponent(isBack)
            + "&isSlideUp=Y";
	},
	setCuration : function(setObj, html) {
		var titlRp = setObj.titlRp;
        
		if(setObj.popupYn != "Y") { // 팝업이 아닐 때
			$("#goods_curation_" + setObj.recType).html("");
			$("#goods_curation_" + setObj.recType).html(html);
			
			var title = curation_title[setObj.recType];
			var arrReplace = titlRp.split(";");
	        for(var i=0; i<arrReplace.length; i++) {
	        	title = title.replace('{'+ i +'}', arrReplace[i]);
	        }
			
			$("#recomm_title_"+setObj.recType).html(title);
		} else if(setObj.appYn == "Y") { //앱 팝업일 때
			$("#curationPopCont").html(html);
			
			var tooltip = curation_title[setObj.recType + "_tip"];
			
			var arrReplace = titlRp.split(";");
	        for(var i=0; i<arrReplace.length; i++) {
	        	if(tooltip != undefined && tooltip != "") {
	        		tooltip = tooltip.replace('{'+ i +'}', arrReplace[i]);
	        	}
	        }
	        
			$("#curationPopCont").find("#tooltipTxt").html(tooltip);
		} else { //일반 팝업일 때
			var title = curation_title[setObj.recType + "_pop"];
			var tooltip = curation_title[setObj.recType + "_tip"];
			
			var arrReplace = titlRp.split(";");
	        for(var i=0; i<arrReplace.length; i++) {
	        	title = title.replace('{'+ i +'}', arrReplace[i]);
	        	
	        	if(tooltip != undefined && tooltip != "") {
	        		tooltip = tooltip.replace('{'+ i +'}', arrReplace[i]);
	        	}
	        }
			
	        $(".crtPopFullWrap").find(".popTitle").html("");
			$(".crtPopFullWrap").find(".popTitle").html(title);
			$(".crtPopFullWrap").find(".popCont").html(html);
			$(".crtPopFullWrap").find("#tooltipTxt").html(tooltip);
		}
		
		if($("#recoGoodsYn").val() == "Y") {
			if(setObj.popLayerYn == "Y") { // 상품상세 장바구니 담기, 일시품절 등 팝업 레이어
				setTimeout(function() {	
					$(".prd_buy_wrap").hide();
					curation.showLayer(setObj.popLayerNm, 'slideUp');
					
					$(".prd_dim").click(function() {
						curation.popLayerClose(setObj.popLayerNm);
						$(".prd_buy_wrap").show();
					});
					
					curation.viewScript(setObj);
					curation.btnMoreEvent(setObj);
				}, 1000);
					
			} else if(setObj.popupYn == "Y") { // 팝업
				if(setObj.appYn == "N") {
					curation.popFullOpen();
				}
				
				curation.viewScript(setObj);
			} else { // 일반화면
				setTimeout(function() {	
					curation.viewScript(setObj);
				}, 100);
				curation.btnMoreEvent(setObj);
			}
		}
	},
	viewScript : function(options) {
		if(options.viewType == "Vert") {
			var curation_swiper = new Swiper('#curation_' + options.recType, {
			      slidesPerView: 2.5,
			      scrollbar: '.swiper-scrollbar',
			      scrollbarHide: false,
			      freeMode:true,
				  freeModeMomentumRatio: 0.5,
				  freeModeMomentumVelocityRatio: 0.5,
				  spaceBetween: 15,
				  slidesOffsetBefore: options.offset,
				  slidesOffsetAfter: options.offset

			});
				
			var width = $(window).width();
			
			if(width <= 320) {
				curation_swiper.params.slidesPerView = 2;
				curation_swiper.params.slidesOffsetBefore = 0;
				curation_swiper.params.slidesOffsetAfter = 0;
				curation_swiper.params.spaceBetween = 10;
				
				curation_swiper.onResize();
			}
		}
		
		// 상품상세 페이지에서.. A태그 클릭 시 해당 상품으로 이동
		$('#goods_curation_'+options.recType+' .curation_list li .a_detail').each(function(i) {
		    var _item = $(this);
		    var _data_goodsno = _item.attr('data-ref-goodsno');
		    var _data_dispCatNo = _item.attr('data-ref-dispCatNo');
		    var egcode = _item.attr("data-egcode");
		    var egrank = _item.attr("data-egrank");
		    
		    var href = "";
			if(options.popupYn == "Y" && common.app != undefined  && common.app.appInfo != undefined && common.app.appInfo.isapp) {
				href = 'javascript:common.wlog("'+options.viewArea+'");curation.moveGoodsDetailCurationApp("'+_data_goodsno+'", "'+_data_dispCatNo+'","'+options.viewArea+'" , "'+options.rccode+'" ,"'+egcode+'" ,"'+egrank+'");';
			} else {
				href = 'javascript:common.wlog("'+options.viewArea+'");common.link.moveGoodsDetailCuration("'+_data_goodsno+'", "'+_data_dispCatNo+'","'+options.viewArea+'" , "'+options.rccode+'","'+egcode+'" ,"'+egrank+'");';
			}
		    
		    _item.attr('href',href);
		});
	},
	moveGoodsDetailCurationApp : function(goodsNo , dispCatNo, curation, rccode, egcode, egrank) {
		var param = "?goodsNo=" + goodsNo;
        if (!common.isEmpty(dispCatNo)) {
            param = param + "&dispCatNo=" + dispCatNo;
        }
        if (!common.isEmpty(curation)) {
            param = param + "&curation=" + curation;
        }
        if (!common.isEmpty(rccode)) {
            param = param + "&rccode=" + rccode;
        }
        if (!common.isEmpty(egcode)) {
            param = param + "&egcode=" + egcode;
        }
        if (!common.isEmpty(egrank)) {
            param = param + "&egrankcode=" + egrank;
        }
       
        var url = _plainUrl + "goods/getGoodsDetail.do" + param;
        	location.href = "oliveyoungapp://callWebUrl?url=" + common.app.fixedEncodeURIComponent(url);
	},
	btnMoreEvent : function(options) {
		$("#crt_more_"+options.recType+", #crt_more_last_"+options.recType).unbind("click").click(function(event) {
		   	event.preventDefault();
		   	
		   	if(curation.popLoad) {
		   		curation.popLoad = false;
		   		if(!common.isLogin() && options.loginArea != "N") {
		   			var redirectUrl = document.location.href;
		   			
		   			if(redirectUrl.indexOf("main/main.do") > -1) {
		   				redirectUrl = "";
		   			}
		   			
		   			localStorage.setItem("loginRedirect", redirectUrl);
		   			localStorage.setItem("curationPopInfo", JSON.stringify(options));
		   		}
		   		
		   		if(options.goodsNos != undefined && options.goodsNos != "") {
		   			var requestUrl = _baseUrl + "curation/getLgcGoodsNoListAjax.do"
		   			common.Ajax.sendRequest("POST", requestUrl, {goodsNos : options.goodsNos}, function(res) {
		   				options.iids = res.data;
		   				curation.popLoadEvent(options);
		   			});
		   		} else {
		   			curation.popLoadEvent(options);
		   		}
		   	}
		   	
		});
	},
	popLoadEvent : function(options) {
	   	var recType = options.recType;
	   	
	   	var param = {
			size : 40,
			cps : options.cps || "",
			cpt : options.cpt || "",
			price : options.price || "",
			iids : options.iids || "",
			st : options.st || "",
			cpcids : options.cpcids || "",
			goodsNo : options.goodsNo || "",
			bids : options.bids || "",
			testSize : options.testSize || "",
			load : "pop"
		};
	   	
	   	var obj = {
		   	viewType : 'HorzPop',
		   	styleNo : 26,
		   	popupYn : "Y",
		   	titlRp : options.titlRp || "",
		   	viewSize : options.size,
		   	viewArea : options.viewArea,
		   	goodsNo : options.goodsNo || "",
		    extGoodsNo : options.extGoodsNo || [],
		    loginArea : options.loginArea || "Y",
		    dispCatNo : options.dispCatNo || "",
		    rccode : options.rccode || "",
		    quickYn : options.quickYn || ""
		};
	   	
	   	var url = "";
	   	
	   	if(options.popLayerYn == "Y") {
	   		$(".prd_dim").click();
	   	}
	   	
	   	if(recType != "a024") { // AB test로 인한 분기 처리. 삭제 예정
		   	if (common.app != undefined  && common.app.appInfo != undefined && common.app.appInfo.isapp) {
		   		url = _baseUrl + "curation/getCurationPop.do";
		   		
		   		var sendObj = jQuery.extend(options, param, obj);
		   		curation.getCurationPop(sendObj, url);
		   	} else {
		   		curation.callCuration(recType, param, function(data) {
		   			var sendObj = jQuery.extend(data, obj);
		   			
		   			url = _baseUrl + "curation/getCurationCallBackAjax.do";
		   			curation.getCurationCallBack(sendObj, url);
		   		});
		   	}
	   	} else { // AB test로 인한 분기 처리. 삭제 예정
	   		var result = false;
	   		curation.callCuration(recType, param, function(data) {
	   			var results = data.results;
	   			
	   			if(results != undefined && results != null && results.length > 0) {
	   				if (common.app != undefined  && common.app.appInfo != undefined && common.app.appInfo.isapp) {
	   			   		url = _baseUrl + "curation/getCurationPop.do";
	   			   		
	   			   		var sendObj = jQuery.extend(options, param, obj);
	   			   		curation.getCurationPop(sendObj, url);
	   			   	} else {
	   			   		var sendObj = jQuery.extend(data, obj);
			   			
			   			url = _baseUrl + "curation/getCurationCallBackAjax.do";
			   			curation.getCurationCallBack(sendObj, url);
	   			   	}
	   			} else {
	   				if(options.quickYn == "Y") {
	   					document.location.href = _baseUrl + "main/getQuickMainList.do";
	   				} else {
	   					document.location.href = _baseUrl + "main/main.do#3";
	   				}
	   			}
	   		});
	   	}
	},
	showLayer : function(IdName, style) {
        var winH = $(window).height() / 2;
        var popLayer = ('#' + IdName);
        $(popLayer).find('.popCont').css({
            'max-height' : winH
        });
        
        var popPos = $(popLayer).height() / 2;
        var popWid = $(popLayer).width() / 2;
        
        $(popLayer).show().css({
            'left' : '50%',
            'margin-left' : -(popWid),
            'top' : '50%',
            'margin-top' : -(popPos)
        }).parents('body').css({
            'overflow' : 'hidden'
        });
        
        if(style == "slideUp") {
        	$(popLayer).find(".prd_sd_inner").hide().css("bottom", -(winH));
        	$(popLayer).find(".prd_sd_inner").show().animate({'bottom' : '0'}, 300);
        } else {
        	$(popLayer).show();
        }
        
        $('.prd_dim').show();

        $('.prd_dim').bind('click', function() {
            common.popLayerClose(IdName);
        });
        // 가세로 변경
        $(window).resize(function() {
            winH = $(window).height() / 2;
            $(popLayer).find('.popCont').css({
                'max-height' : winH
            });
            popPos = $(popLayer).height() / 2;
            popWid = $(popLayer).width() / 2;
            $(popLayer).css({
                'left' : '50%',
                'margin-left' : -(popWid),
                'top' : '50%',
                'margin-top' : -(popPos)
            })
        });
        
        $("body").css("overflow", "hidden");
        // 앱 호출
        setTimeout(function() {
            common.app.callMenu("Y");
        }, 100);
	},
	popLayerClose : function(IdName) {
        
        var popLayer = ('#' + IdName);
        $(popLayer).hide();
        $("body").removeAttr('style');

        try {
            var varNowScrollY = parseInt(sessionStorage.getItem("scrollY_popLayer"));

            if ((varNowScrollY > 0)) {
                $(window).scrollTop(varNowScrollY);
                sessionStorage.removeItem("scrollY_popLayer");
            }
        } catch (e) {
        }

        $('.prd_dim').hide();

        // 웹 접근성 popfocus 삭제 ( 2017-05-11 )
        $("a[data-focus~=on]").focus(); // 표시해둔 곳으로 초점 이동
        $("button[data-focus~=on]").focus(); // 표시해둔 곳으로 초점 이동
        window.setTimeout(function() {
            $("a[data-focus~=on]").removeAttr("data-focus");
            $("button[data-focus~=on]").removeAttr("data-focus");
        }, 100); // 

        // 앱 호출
        setTimeout(function() {
            common.app.callMenu("N");
        }, 100);

    },
    popFullOpen : function() {
    	$(window).scrollTop(0);
    	$('#mWrapper').hide();
    	var winH = $(window).height();
		$('body').css({
			'background-color' : '#fff',
			'overscroll-behavior': 'contain'
		});
		
		$('.crtPopFullWrap').css("margin-top", winH);
		$('.crtPopFullWrap').show().animate({'margin-top' : '0px'}, 400);
    },
    popFullClose : function() {
        localStorage.removeItem("curationPopInfo");
        localStorage.removeItem("curationReload");
    	$('body').css({
            'background-color' : '#eee',
            'overscroll-behavior': 'unset'
        }); /* 2016-12-12 퍼블리싱 수정 반영 */
		$(".crtPopFullWrap").find(".popTitle").html("");
		$(".crtPopFullWrap").find(".popCont").html("");
        $('.crtPopFullWrap').hide();
        $('#mWrapper').show();

        window.scroll(0, common.scrollPos);

        // 웹 접근성 popfocus 삭제( 2017-05-11 )
        $("a[data-focus~=on]").focus(); // 표시해둔 곳으로 초점 이동
        $("button[data-focus~=on]").focus(); // 표시해둔 곳으로 초점 이동
        window.setTimeout(function() {
            $("a[data-focus~=on]").removeAttr("data-focus");
            $("button[data-focus~=on]").removeAttr("data-focus");
            var lyLocalScroll = localStorage.getItem('lyScrollSet');
            if (lyLocalScroll != null) {
                $(document).scrollTop(lyLocalScroll);
                localStorage.removeItem('lyScrollSet');
            }
        }, 100); // 
    },
    popLogin : function() {
    	localStorage.setItem("curationReload", "Y");
    	var referer = localStorage.getItem("loginRedirect");
    	
    	var redirectUrl = "";
    	if(referer != undefined && referer != "") {
    		redirectUrl = "?redirectUrl=" + referer;
    	}
    	
    	if (common.app != undefined  && common.app.appInfo != undefined && common.app.appInfo.isapp) {
    		var url = _secureUrl + "login/loginForm.do" + redirectUrl;
    		location.href = "oliveyoungapp://callWebUrl?"+ "url=" + common.app.fixedEncodeURIComponent(url);
    		localStorage.removeItem("loginRedirect");
    	} else {
    		common.link.moveLoginPage();
    	}
    },
    reloadEvent : function() {
    	setTimeout(function() {
	   		var curationReload = localStorage.getItem("curationReload");
	
	   		if(curationReload == "Y" && _isLogin) {
	   			var curationPopInfo = $.parseJSON(localStorage.getItem("curationPopInfo"));
	   			
	   			if(curationPopInfo != undefined && curationPopInfo != "") {
		   			if(curationPopInfo.loginRecType != undefined && curationPopInfo.loginRecType != "") {
		   				curationPopInfo.recType = curationPopInfo.loginRecType;
		   			}
		   			
	   				curation.popLoadEvent(curationPopInfo);
	   				localStorage.removeItem("curationPopInfo");
	   				localStorage.removeItem("curationReload");
	   			}
	   		}
	   	}, 500);
    },
    regProfile : function(actionFlag) {
	    var url = _baseUrl + "curation/getSkinChoiceAjax.do"
	    common.Ajax.sendRequest("POST", url, {actionFlag : actionFlag}, function(res) {
		   	$("#skinChoiceWrap").find(".skinChoice").html(res);
		   	common.popLayerOpen("skinChoiceWrap");
		});
    },
    profilePageClose : function() {
    	$("#skinChoiceWrap").hide();
		$(".dim").hide();
		
		if(common.app != undefined  && common.app.appInfo != undefined && common.app.appInfo.isapp) {
			$("body").css("overflow-y", "scroll");
		} else {
			$("body").removeAttr('style');
		}

        try {
            var varNowScrollY = parseInt(sessionStorage.getItem("scrollY_popLayer"));
            if ((varNowScrollY > 0)) {
                $(window).scrollTop(varNowScrollY);
                sessionStorage.removeItem("scrollY_popLayer");
            }
        } catch (e) {
        	
        }
    }
};

$.namespace("curation.profileInfo");
curation.profileInfo = {
	saveflag : true,
	init : function() {
		$(".btnCancel").unbind("click").click(function(event) {
			event.preventDefault();
			
			curation.profilePageClose();
		});
		
		$('.termsFoldBtn').on('click',function(){
            $('.termsFold').toggleClass('on');
            if($('.termsFold').hasClass('on')){
                $('.termsFoldBtn span').text('전문 접기')
            }else{
                $('.termsFoldBtn span').text('전문 보기')
            }
        });
		
    	$('#addInfoAgrYn').unbind("click").click(function(){
            if($(this).is(':checked')){
            	$('#addInfoAgrYnVal').val('Y');
            	if($('.radius_box_list input:checked').length == 0){
            		$('#addInfoOpenYn').prop('disabled',true);
            	}else{
            		$('#addInfoOpenYn').prop('disabled',false);
            	}
      
        	}else{
        		$('#addInfoAgrYnVal').val('N');
        		$('#addInfoOpenYnVal').val('N');
        		$('#addInfoAgrYn').prop('checked',false);
        		$('#addInfoOpenYn').prop('checked',false);
	           	$('#addInfoOpenYn').prop('disabled',true);
        	}
    	});
    	
    	$('#addInfoAgrYn').unbind("click").click(function(){
            if($(this).is(':checked')){
            	$('#addInfoAgrYnVal').val('Y');
            	if($('.radius_box_list input:checked').length == 0){
            		$('#addInfoOpenYn').prop('disabled',true);
            	}else{
            		$('#addInfoOpenYn').prop('disabled',false);
            	}
      
        	}else{
        		$('#addInfoAgrYnVal').val('N');
        		$('#addInfoOpenYnVal').val('N');
        		$('#addInfoAgrYn').prop('checked',false);
        		$('#addInfoOpenYn').prop('checked',false);
	           	$('#addInfoOpenYn').prop('disabled',true);
        	}
    	});
    	
    	$('.radius_box_list input').click(function(){
    		if($('.radius_box_list input:checked').length > 0){
    			if($('#addInfoAgrYn').is(':checked')){
    				$('#addInfoOpenYn').prop('disabled',false);
    			}else{
    				$('#addInfoOpenYn').prop('disabled',true);
    			}
    			if($('.radius_box_list input:checked').length > 0){
    				$('#addInfoOpenYn').prop('disabled',false);
    			}
    		}else{
    			$('#addInfoAgrYnVal').val('N');
        		$('#addInfoOpenYnVal').val('N');
        		$('#addInfoAgrYn').prop('checked',false);
        		$('#addInfoOpenYn').prop('checked',false);
	           	$('#addInfoOpenYn').prop('disabled',true);
    		}
    	});
    	
    	if($('#addInfoAgrYnVal').val() == 'Y'){
	       	$('#addInfoOpenYn').prop('disabled',false);
    	}else{
           	$('#addInfoOpenYn').prop('disabled',true);
    	}
    	
    	$(".pinfo_box label").on("click", function() {
    		var _this = $(this);
    		var chk = _this.parent().find("input[type='checkbox']");
    		
    		chk.click();
    	});
		
		$('.radius_box_list label').on('click',function(){
        	
            var _this = $(this),
            	_id = $(this).prop("for");
                _input = $("#" + _id);
                _this_box = _this.parents('.type_box');
                
            if(_input.attr("type") == "radio") {
            	if(_this.hasClass('on')){
            		_input.attr('checked', false);
            		_this.removeClass('on');
            	}else{
            		_this_box.find('input[type=radio]').attr('checked', false);
            		_this_box.find('label').removeClass('on');
            		_input.prop('checked', true);
            		_this.addClass('on');
            	}
            	
            	//라디오 버튼 컨트롤
            	var temp = _this.parents('.type_box').find('input[type=radio]:checked').val();
            	var tfType = $('input:radio[name="skin_type_1"]').is(":checked");
            	var tfTone = $('input:radio[name="skin_type_2"]').is(":checked");
            	
            	//데이터 확인용
            	//alert(temp + "\nType = " + tfType + "\n" + "Tone = " + tfTone);
            	if(temp==null) temp = "0";
            	if(tfType == true){
            		temp = temp.substring(0, 1);
            		if(temp == "A"){
            			$("#compareType").val($(':radio[name="skin_type_1"]:checked').val());
            		}
            	} else {
            		$("#compareType").val("");
            	}
            	
            	if(tfTone == true){
            		temp = temp.substring(0, 1);
            		if(temp == "B"){
            			$("#compareTone").val($(':radio[name="skin_type_2"]:checked').val());
            		}
            	} else {
            		$("#compareTone").val("");
            	}
            }
            
        }); 
	},
	regProfileInfo : function() {
		curation.profileInfo.saveflag = false;
		
		var chkLen = $(".multiChk").find("input[type='checkbox']:checked").length;
		var rdChkLen = $("#compareType").val() == "" && $("#compareTone").val() == "" ? 0 : 1;
		var totalLen = chkLen + rdChkLen;
		
		if($('input[name="addInfoAgrYn"]').is(':checked') || $("#addInfoAgrYnVal").val() == 'Y'){
    		if(totalLen == 0){
    			alert("나의 피부 컨디션 정보를 입력하여 주세요.");
    			curation.profileInfo.saveflag = true;
    			return false;
    		}
    	}
		
		if(totalLen == 0){
			$('#addInfoAgrYnVal').val("N");
    		$('input[name="addInfoAgrYn"]').val("N");
	   	}
		
		if($('input[name="addInfoOpenYn"]').is(':checked')){
			$("#addInfoOpenYnVal").val("N");
    	}else{
    		$("#addInfoOpenYnVal").val("Y");
    	}
    	
		var param = $("#addInfoForm").serialize();
		var url = _baseUrl + "curation/registerAddInfo.do"
		common.Ajax.sendRequest("POST", url, param, function(res) {
			var result = res.message;
			
			if(result == "000") {
				alert("변경사항이 정상적으로 저장되었습니다");
				
				var data = res.data;
				var html = [];
				$(".tagList").html("");
				if(data != undefined && data.length > 0) {
					for(var i=0; i<data.length; i++) {
						$(".tagList").append("<li>#" + data[i].mrkNm + "</li>");
					}
					
					$(".btnProfile").text("수정");
					$(".btnProfile").attr("href", "javascript:curation.regProfile('M');");
					$(".curation_recomendBox .subTtl").html("프로필에 어울리는 상품 추천해드려요");
				} else {
					$(".btnProfile").text("등록");
					$(".btnProfile").attr("href", "javascript:curation.regProfile('R');");
					$(".curation_recomendBox .subTtl").html("프로필 등록하고 맞춤형 추천 받으세요");
				}
				
				curation.profilePageClose();
			} else if(result == "100") {
				curation.popLogin();
			} else {
				alert("저장에 실패하였습니다.");
			}
		});
	}
};

function getCookie_curation(name) {
	var nameOfCookie = name + "=";
	var x = 0;
	while ( x <= document.cookie.length ){
		var y = (x+nameOfCookie.length);
		if ( document.cookie.substring( x, y ) == nameOfCookie ) {
			if ( (endOfCookie=document.cookie.indexOf( ";", y )) == -1 )
				endOfCookie = document.cookie.length;
			return unescape( document.cookie.substring( y, endOfCookie ) );
		}
		x = document.cookie.indexOf( " ", x ) + 1;
		if ( x == 0 )
			break;
	}
	return "";
}
