/**
 * 	Date 	: 2020.06.26
 *  Auther 	: 허 민 (HEO-MIN) 
 *  Desc 	: 카테고리관 메인 스크립트 내용 초기화 
 */

$.namespace("categoryShop.detail");

categoryShop.detail = {
		
		tag : "",

		firstScriptTag : "",
		
		categoryWlogType : "",
		
		videoPlayer : "",
		
        init : function() {
        	categoryShop.detail.tag = document.createElement('script');
        	categoryShop.detail.tag.src = "https://www.youtube.com/iframe_api";
        	
        	categoryShop.detail.firstScriptTag = document.getElementsByTagName('script')[0];
        	categoryShop.detail.firstScriptTag.parentNode.insertBefore(categoryShop.detail.tag, categoryShop.detail.firstScriptTag);
        	
			// 웹로직 구분 초기화
			categoryShop.detail.bindWlog();
        	
            categoryShop.detail.bindEvent();
            //lazyload 처리
            common.setLazyLoad();
            //찜 처리 초기화
            common.wish.init();
            
            setTimeout(function() {
                //링크 처리
                common.bindGoodsListLink();
            }, 100);
        },
        
        bindWlog : function () {
        	var dispCatNo = $("#dispCatNo").val();        	
        	// 상위 카테고리 번호에 따라 wlog 타입을 초기화한다.
        	categoryShop.detail.categoryWlogType = "category_" + dispCatNo;
        },

        bindEvent : function() {
        	// 카테고리 visual 배너
        	if($('.ct-top-banner .swiper-slide').length > 1) {
        		$('.ct-top-banner .paging').css('display', 'block');

        		$('.ct-top-banner .current').html('1');
        		$('.ct-top-banner .total').html($('.ct-top-banner .swiper-slide').length);

        		var ctTopBanner = new Swiper('.ct-top-banner', {
        			autoplayDisableOnInteraction:false,
					autoplay:5000,		// 다음 배너 보여주기까지 시간 (ms)
					speed:200,			// 다음 배너로 전환되는 속도 (ms)
					loop :true
        		});

        		var $btnPause1 = $('.ct-top-banner .btn-autoplay.pause');
        		var $btnPlay1 = $('.ct-top-banner .btn-autoplay.play');

        		$btnPause1.on('click', function(){
        			$(this).hide();
        			$btnPlay1.show();
        			ctTopBanner.stopAutoplay();
        		});

        		$btnPlay1.on('click', function(){
        			$(this).hide();
        			$btnPause1.show();
        			ctTopBanner.startAutoplay();
        		});

        		ctTopBanner.on('slideChangeStart', function(e){
        			//2020-06-18 인터렉션 변경으로 인한 기능 삭제
        			// $('.ct-top-banner .txt').hide();
        			// $('.ct-top-banner .txt').eq(e.realIndex).show();
        			$('.ct-top-banner .current').html(Number(e.realIndex) + 1);
        		});

        	} else {
        		$('.ct-top-banner .paging').hide();
        	}

        	// 카테고리 배너
        	if ($('.ct-content-banner .swiper-slide').length > 1) {
        		$('.ct-content-banner .paging').css('display', 'block');

        		var $btnPause2 = $('.ct-content-banner .btn-autoplay.pause');
        		var $btnPlay2 = $('.ct-content-banner .btn-autoplay.play');

        		var ctContentBanner = new Swiper('.ct-content-banner', {
        			pagination: '.paging-item',
        			autoplay:5000,
        			autoplayDisableOnInteraction:false,
        			paginationClickable: true,
        			loop :true
        		});

        		$btnPause2.on('click', function() {
					$(this).hide();
					$btnPlay2.show();
					ctContentBanner.stopAutoplay();
				});

				$btnPlay2.on('click', function() {
					$(this).hide();
					$btnPause2.show();
					ctContentBanner.startAutoplay();
				});
        	} else {
        		$('.ct-content-banner .paging').hide();
        	}

        	// 카테고리 상단 메뉴
        	var menuWidth = 0;

        	// 메뉴 가로 사이즈 체크 후 디바이스 길이보다 길 경우 버튼 노출
        	var ctMenu = $(".ct-sticky-menu .ct-menu");
			var checkMenuWidth = setInterval(function(){
				if ( ctMenu.length > 1 && ctMenu.height() >= 38 ) {
					ctMenu.each(function(){
						menuWidth += $(this).outerWidth(true);
					});
					clearInterval(checkMenuWidth);
					checkWidth();
				};
			}, 100);
			
			function checkWidth(){
	        	if ((menuWidth + 26) > window.innerWidth) {
	        		$('.btn-ct-open').addClass('is-active');
	
	        		$('.btn-ct-open, .ct-dim').on('click', function () {
	        			if ($('.btn-ct-open').hasClass('is-open')) {
	        				$('.btn-ct-open').removeClass('is-open');
	        				$('.ct-dim').hide();
	        				$('.ct-sticky-menu').removeClass('is-open');
	        			} else {
	        				$('.btn-ct-open').addClass('is-open');
	        				// $('.ct-dim').height(window.innerHeight).show();		2020-07-23 높이 제어 안하도록 수정 했습니다. 
							$('.ct-dim').show();
	        				$('.ct-sticky-menu').addClass('is-open');
	        			}
	        		});
	        	}
        	}

        	// 카테고리 베스트 tab
        	$('.ct-tab a').on('click', function(e) {
        		e.preventDefault();
        		
        		$(this).css("cursor", "pointer");
        		
        		var idx = $(this).index();

        		$('.ct-tab a').removeClass('is-active');
        		$(this).addClass('is-active');

        		$('.ct-best .detail').hide();
        		$('.ct-best .detail').eq(idx).show();
        	})
        	
        	//2020-06-26 이번 주 추천! 수정
			var ctCuration 		= $("#ctCuration");
			var	slideWidth 		= ctCuration.find("li").length * ctCuration.find("li").eq(0).outerWidth()
			var	wrapperWidth 	= ctCuration.width() - 15;		//category.css 가 나중에 load 되어 css value를 못가져와 15를 씀
			
			if ( wrapperWidth < slideWidth ) {
				var ctCurationSwiper = new Swiper('#ctCuration', {
					slidesPerView					: 'auto',
					scrollbar						: '.swiper-scrollbar',
					scrollbarHide					: false,
					freeMode						: true,
					freeModeMomentumRatio			: 0.5,
					freeModeMomentumVelocityRatio	: 0.5
				});
			} else {
				ctCuration.find(".swiper-scrollbar").hide();
				//2020-07-28 jQuery css -> attr("style") 로 변경
				ctCuration.find(".swiper-wrapper").attr("style", "width:-webkit-fit-content;width:fit-content;margin-left:auto;margin-right:auto;");
			};
        	
        	/*
        	var ctCurationSwiper = new Swiper('#ctCuration', {
				slidesPerView: 'auto',
				scrollbar: '.swiper-scrollbar',
				scrollbarHide: false,
				freeMode:true,
				freeModeMomentumRatio: 0.5,
				freeModeMomentumVelocityRatio: 0.5
			});
			*/
			
			//2020-07-30 상단 탭이 메인배너와 만날때는 보더 제외 -> 보더가 있고, 배너가 위에 있을때만
			var ctsticky = $(".ct-sticky-wrapper");
			var ctbanner = $(".ct-content-wrapper > .ct-content:first-child .ct-top-banner");
			
			if ( ctbanner.length > 0 ) {
				ctsticky.addClass("remove-border");

				var last_known_scroll_position = 0;
				var ticking = false;

				window.addEventListener('scroll', function(e) {
					last_known_scroll_position = window.scrollY;
					
					if (!ticking) {
						window.requestAnimationFrame(function() {
							categoryShop.detail.checkScrollTop(last_known_scroll_position);
							ticking = false;
						});
						
						ticking = true;
					}
				});
			}
			
            // VOD 스타일적용
        	objectFitImages();
        	
	      	var parallaxContainer = $(".parallax-container");
	      	
	        if (parallaxContainer.length > 0) {
	        	var parallaxOption = {
                     element: '.parallax-container',
                     image: parallaxContainer[0].dataset.imgUrl,
                     image_alt: '동영상 배경화면',
                     speed: parallaxContainer[0].dataset.speed,
	            };
	     			
	     		categoryShop.detail.handleParallax(parallaxOption);
	     	}
	        
            // VOD
        	var promotionVideoPlayer = $("#promotion-video-player");
        	
            if (promotionVideoPlayer.length > 0) {
                var videoOption = {
                    element: '.video',
                    provider: promotionVideoPlayer[0].dataset.plyrProvider,
                    embedId: promotionVideoPlayer[0].dataset.plyrEmbedId,
                };
                
                categoryShop.detail.handleVideoPlayer(videoOption);
            }
            
            // 카테고리 메뉴 클릭 이벤트 (리스트)
            var mCategoryList = $("#mCategoryList");
            
            mCategoryList.find(".inner .ct-menu").click(function() {
            	// 클래스 값에 저장되어 있는 카테고리 번호를 접근하여 저장한다.
            	var dispCatNo = $(this).find("a").attr("class");
            	var index = $(this).find("a").attr("data-index");
            	            	            	
            	// WLOG 내용을 축척한다.
            	common.wlog(categoryShop.detail.categoryWlogType + "_mcategory" + index);
            	
            	// 중카테고리 리스트 화면으로 이동한다.
            	setTimeout(function() {
                    location.href = _baseUrl + "display/getSCategoryList.do?dispCatNo=" + dispCatNo;
                }, 300);            	
            });
            
            // 카테고리 펼침 메뉴 클릭 이벤트
            var mCategoryFullList = $("#mCategoryFullList");
            
            mCategoryFullList.find(".inner .ct-menu").click(function() {
            	// 클래스 값에 저장되어 있는 카테고리 번호를 접근하여 저장한다.
            	var dispCatNo = $(this).find("a").attr("class");
            	var index = $(this).find("a").attr("data-index");
            	
            	// WLOG 내용을 축척한다.
            	common.wlog(categoryShop.detail.categoryWlogType + "_mcategory" + index);
            	
            	// 중카테고리 리스트 화면으로 이동한다.
            	setTimeout(function() {
                    location.href = _baseUrl + "display/getMCategoryList.do?dispCatNo=" + dispCatNo;
                }, 300);            	
            });
        },
                
        // VOD 스타일적용
        handleParallax: function(option) {
            if (!option.element || !option || $.isEmptyObject(option)) {
                return;
            }

            if (option.speed <= 0) {
                $(option.element).append($('<div>').addClass('parallax-image'));
            } else {
                $(option.element).append(
                    $('<img>')
                        .attr({ src: option.image, alt:option.image_alt })
                        .addClass('parallax-image')
                );

                $('.parallax-image').each(function() {
                    var img = $(this);
                    var imgParent = $(this).parent();

                    function parallaxImg() {
                        var speed 	= option.speed / 100;
                        var imgY 	= imgParent.offset().top;
                        var winY 	= $(this).scrollTop();
                        var winH 	= $(this).height();
                        var parentH = imgParent.innerHeight();

                        // The next pixel to show on screen
                        var winBottom = winY + winH;
                        var imgPercent;

                        // If block is shown on screen
                        if (winBottom > imgY && winY < imgY + parentH) {
                            // Number of pixels shown after block appear
                            var imgBottom = (winBottom - imgY) * speed;
                            // Max number of pixels until block disappear
                            var imgTop = winH + parentH;
                            // Porcentage between start showing until disappearing
                            imgPercent =
                                (imgBottom / imgTop) * 100 + (50 - speed * 50);
                        }

                        img.css({
                            top: imgPercent + '%',
                            transform: 'translate(-50%, -' + imgPercent + '%)',
                        });
                    }

                    $(document).on({
                        ready: function() {
                            parallaxImg();
                        },
                        scroll: function() {
                            parallaxImg();
                        },
                    });
                });
            }
        },
        
        // VOD
        handleVideoPlayer: function(option) {
            var prefix = 'https://';
            var element = document.querySelector(option.element);

            if (!element || !option || $.isEmptyObject(option)) {
                return;
            }

            var embedId 	= option.embedId;
            var provider 	= option.provider;
            var url 		= (provider == 'youtube') ? prefix + 'www.youtube.com/watch?v=' + embedId : prefix + 'vimeo.com/' + embedId;
            var videoObject = new VideoWorker(url);
            
            if (provider == 'vimeo') {
            	 if (videoObject.isValid()) {
                     // retrieve iframe/video dom element.
                     videoObject.getVideo(function(video) {
                         var $parent = video.parentNode;

                         // insert video in the body.
                         element.appendChild(video);

                         // remove temporary parent video element (created by VideoWorker).
                         $parent.parentNode.removeChild($parent);
                       
                     });
                 }
            }
            
            // 동영상 재생시, 웹 로그 내용을 기록한다.
            videoObject.on('play', function(event) {
                categoryShop.detail.setBindWlogEvent('vod_play', '');
            }); 
        },
        
        // 웹로그 내용을 기록한다.
        setBindWlogEvent : function(code, index) {
        	var wlogCd = categoryShop.detail.categoryWlogType + "_" + code + index;
        	common.wlog(wlogCd);      	
        },
        
        // 유튜브 동영상 초기화
        initYoutubePlayer : function() {
        	// VOD
        	var promotionVideoPlayer = $("#promotion-video-player");
        	var embedId = promotionVideoPlayer[0].dataset.plyrEmbedId;
        	            
        	categoryShop.detail.videoPlayer = new YT.Player('promotion-video-player', {
    			  width : '100%'
    			, height : '100%'
    			, playerVars : {
    				  'version':1			// 버전
    				, 'loop' : 0			// 반복
    				, 'autoplay': 0			// 자동재생
    				, 'controls': 1			// 진행표시창
    				, 'modestbranding': 1	// 유튜브 배너 표시
    				, 'fs': 1				// 전체 화면 버튼이 플레이어에 표시여부
    				, 'rel': 0				// 관련영상 표시
    				, 'playsinline': 1		// iOS의 HTML5 플레이어에서 동영상을 인라인으로 재생할지 전체 화면으로 재생할지 여부를 제어. 
    			  }
    			, videoId : embedId
    			, events : {
    				'onReady': categoryShop.detail.onPlayerReady,
    				'onStateChange': categoryShop.detail.onPlayerStateChange
    			  }
        	});
        },
        
        // 유튜브 영상 초기화
        onPlayerReady : function(e) {
        	// 시작시 (음소거 X)
        	e.target.unMute();
        },
        
        // 유튜브 영상 변경 시 호출
        onPlayerStateChange : function(e) {
        	if (e.data == YT.PlayerState.PLAYING) {
        		// 유튜브 플레이어 재생시, DS 내용을 기록한다.
        		categoryShop.detail.setBindWlogEvent('vod_play', '');
    		}
        	if (e.data == YT.PlayerState.ENDED) {
        		// 유튜브 플레이어 종료시, 영상을 정지한다.
        		categoryShop.detail.videoPlayer.stopVideo();
    		}
        },
        
        checkScrollTop : function(scroll_pos) {
        	var ctsticky = $(".ct-sticky-wrapper");
			var ctbanner = $(".ct-content-wrapper > .ct-content:first-child .ct-top-banner");
			var cttop = ctbanner.offset().top + ctbanner.height() - ctsticky.height();
			
			if ( scroll_pos > cttop ) {
				ctsticky.removeClass("remove-border");
			} else {
				ctsticky.addClass("remove-border");
			}
		}
};