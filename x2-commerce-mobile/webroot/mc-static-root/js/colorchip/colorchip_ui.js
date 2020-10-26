// mobile os 체크
function isDeviceCheck(){
    var varUA = navigator.userAgent.toLowerCase();

    if ( varUA.indexOf('android') > -1) {
        return "android";
    } else if ( varUA.indexOf("iphone") > -1||varUA.indexOf("ipad") > -1||varUA.indexOf("ipod") > -1 ) {
        return "ios";
    } else {
        return "other";
    }
}

if(common.app.appInfo.isapp){
    document.querySelector('html').classList.add('ui-app');
}

var cartCount = 0;

function itemNoFormatter(n, width) {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}

function colorchip_cart(itemNo, qty){
    console.log('aasdas')
    $('.muuri-item .prd_cart').prop('disabled', true);
    var itemNo = itemNoFormatter(itemNo, 3);
    mgoods.detail.cart.checkRegCartColorchip("N","",itemNo, qty);
    setTimeout(function(){
        $('.muuri-item .prd_cart').prop('disabled', false);
        cartCount = 0;
    }, 1000);
}

var ColorChipsLayer = {
    docElem : document.documentElement,
    $itemSwiper : null,
    grid : null,
    gridElement : null,
    selectCnt : 0,
    selectIdx : 0,
    selectInfo : [],
    maxLength : 4,
    tempSelectIdx : 0,
    init : function(){
        common.wlog("goods_cmprcolor");//wlogMjh
        var self = this;
        self.$itemSwiper = $('.add-items-container');
        self.gridElement = $('.grid-area');
        if(!self.gridElement.hasClass('muuri')) {
            self.gridElement.addClass('is-empty');
            self.handleItemsSwiper();
        }

        setTimeout(function(){
            self.$itemSwiper[0].swiper.slideTo(0);
        }, 100);

        if(common.app.appInfo.isapp && isDeviceCheck() == "android"){
            $('#mContainer').show();

            $(document).scrollTop(2);
            $(document).on('scroll touchmove', function(){
                if($(".btnColorchip").css('display') == 'block') {
                    $(document).scrollTop(2);
                }
            })
        }
    },
    handleItemsSwiper : function(){ // 컬러칩 슬라이드
        var self = this;

        var itemSwiper = new Swiper (self.$itemSwiper,{
            slidesPerView: 'auto',
            spaceBetween: 12,
            autoResize: true,
            scrollbar: '.add-items-container .swiper-scrollbar',
            scrollbarHide: false,
            observer: true,
            observeParents: true,
            observeSlideChildren: true
        });

        if(self.$itemSwiper.find('.swiper-slide').length <= 4){
            itemSwiper.params.touchRatio = 0;
        }

        self.$itemSwiper.find('.swiper-slide a').on('click',function(e){ // 컬러칩 클릭 시,
            e.preventDefault();
            common.wlog("goods_cmpr_colorchip");//wlogMjh

            selectIdx = $(this).data('chip-index'); //2020.05.21 위치 수정
            self.$itemSwiper.find('.swiper-slide a').css('pointer-events', 'none');
            if($(this).hasClass('select')){ //2020.05.21 추가
                var $el = $(self.gridElement.find("[data-chip-index='"+selectIdx+"']"));
                $el.find('.card-remove').click();
                self.$itemSwiper.find('.swiper-slide a').css('pointer-events', 'auto');
            } else {


                self.selectCnt++;

                if(self.selectCnt == self.maxLength){
                    tempSelectIdx = selectIdx;
//                    console.log("tempSelectIdx",tempSelectIdx);
                }

                if(self.selectCnt > self.maxLength){

                    /*var $el = $(self.gridElement.find("[data-chip-index='"+tempSelectIdx+"']"));
                    $el.find('.card-remove').trigger('click');
    */
                    tempSelectIdx = selectIdx;

                    self.selectCnt = self.maxLength;


                    //return false;
                }

                //     selectIdx = $(this).data('chip-index');
                itemSwiper.slideTo(selectIdx);


                //     var imgSrc = $(this).find('img').prop('src');
                var imgSrc = $("input[name='colrCmprImgPathNmView_"+selectIdx+"']:hidden").val();
                var optImgSrc = $("input[name='colrOptImgView_"+selectIdx+"']:hidden").val();

                var itemNo = $("input[name='colrCmprItemNoView_"+selectIdx+"']:hidden").val();
                var itemNm = $("input[name='colrCmprItemNmView_"+selectIdx+"']:hidden").val();

                var avalInvQty = $("input[name='colrAcalInvQtyView_"+selectIdx+"']:hidden").val();

                //MJH
                var qty = $("input[name='colrQuiekInvQtyView_"+selectIdx+"']:hidden").val();

                if($(":input:radio[name=qDelive]:checked").val() == 'Y' || $(":input:checkbox[name=qDelive]").prop("checked") == true){
                    self.initGrid(imgSrc, optImgSrc, itemNo, itemNm, qty, $(this));  // 선택한 슬라이드 이미지 src 값을 인자로 넘겨줌
                }
                else{
                    self.initGrid(imgSrc, optImgSrc, itemNo, itemNm, avalInvQty, $(this));  // 선택한 슬라이드 이미지 src 값을 인자로 넘겨줌
                }

                setTimeout(function(){
                    self.$itemSwiper.find('.swiper-slide a').css('pointer-events', 'auto');
                }, 100);
            }

            if(self.$itemSwiper.find('.swiper-slide a.select').length){
                self.gridElement.addClass('is-empty');
            } else {
                self.gridElement.removeClass('is-empty');
            }

        });

    },
    initGrid : function(src, optImgSrc, itemNo, itemNm, qty, swiperTarget){ //
        var self = this;
        var dragCounter = 0;
        var phPool = [];
        var phElem = document.createElement('div');
        var dragFlag = true;

        if(self.selectCnt == 1){ // 최초 drag item 추가
            self.grid = new Muuri('.grid-area',{
                items :  self.generateElements(src, optImgSrc, itemNo, itemNm, qty),
                dragSort: true,
                dragEnabled: dragFlag,
                showEasing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
                dragPlaceholder: {
                    enabled: true,
                    duration: 0,
                    easing: 'ease-out',
                },
                dragSortPredicate: {
                    threshold: 50,
                    action: 'move',
                    migrateAction: 'move'
                },
//                dragStartPredicate: function (item, event) {
//                    var isAction = self.elementMatches(event.target, '.card-remove');
//                    return !isAction ? Muuri.ItemDrag.defaultStartPredicate(item, event) : self.removeItem(event);
//                },
                dragStartPredicate: function (item, event) {
                    var isAction = self.elementMatches(event.target, '.card-remove');
                    var isCartAction = self.elementMatches(event.target, '.prd_cart');

                    if(!isAction && !isCartAction){
                        return Muuri.ItemDrag.defaultStartPredicate(item, event, {
                            distance: 10,
                            delay: 100
                        })
                    }

                    if (isCartAction) {
                        cartCount++;
                        if(cartCount == 1){
                            return colorchip_cart(event.target.dataset.item, event.target.dataset.qty);
                        }
                    }
                },
                dragReleaseDuration: 500,
                dragReleseEasing: 'ease'
            });

            $(swiperTarget).addClass('select');
            $('.cp-icon-notice-wrap').addClass('is-muuri');

        }else if(self.selectCnt == 4){
            self.addItems(src, optImgSrc, itemNo, itemNm, qty, swiperTarget, self.selectCnt); // drag item 추가
        } else {
            self.addItems(src, optImgSrc, itemNo, itemNm, qty, swiperTarget); // drag item 추가
        }

        var count = 0;

        self.gridElement.bind('click', function (e) {  // item 삭제

            if (self.elementMatches(e.target, '.card-remove, .card-remove i')) {
                //self.grid._settings.dragEnabled = false;
                e.preventDefault();
                self.removeItem(e);
            }
        });



    },
    addItems : function(src, optImgSrc, itemNo, itemNm, qty, swiperTarget, isFull){
        var self = this;
        var newElems = self.generateElements(src, optImgSrc, itemNo, itemNm, qty); // grid item 생성함수 호출
        var elem = $('.muuri-item');

        $(swiperTarget).addClass('select');

        if(isFull){
            elem.each(function(idx){
                var tx = document.querySelectorAll('.muuri-item')[idx].style.transform.split(' ')[0].split('translateX')[1].replace(/[^0-9]/g,""),
                    ty = document.querySelectorAll('.muuri-item')[idx].style.transform.split(' ')[1].split('translateY')[1].replace(/[^0-9]/g,"");

                if(tx > 0 && ty > 0){
                    elem.eq(idx).hide();
                    elem.eq(idx).find('.card-remove').click();
                    self.$itemSwiper.find('.swiper-slide').eq(elem.eq(idx).data('chip-index')).find('a').removeClass('select');
                }
            })

        }
        self.grid.add(newElems);
        self.updateIndices();
    },
    removeItem : function(e){
        var self = this;
        var elem = self.elementClosest(e.target, '.item');
        var removeIdx = $(elem).data('chip-index');

        self.$itemSwiper.find('.swiper-slide').eq(removeIdx).find('a').removeClass('select');

        if(e.type == "end") return false;

        self.grid.hide(elem, {onFinish: function (items) {
                var item = items[0];
                self.grid.remove(item, {removeElements: true});
            }});
        self.selectCnt = self.gridElement.find('.muuri-item').length -1;

        self.updateIndices();
    },
    generateElements : function(src, optImgSrc, itemNo, itemNm, qty){ // grid item html 생성
        var self = this;
        var ret = [];
        var itemElem = document.createElement('div');



        if(qty < 1){

            var itemTemplate = '' +
                '<div class="item" data-chip-index="'+selectIdx+'">' +
                '<div class="item-content">' +
                '<div class="card">' +
                '<img src="'+src+'"/>' +
                '<div class="card-remove">X</div>' +
                '</div>' +
                '<div class="item-info">'+
                '<span class="thumb soldout"><img src="' + optImgSrc +'"/></span>' +
                '<span class="prd_name">'+ itemNm + '</span>'+
                '</div>'+
                '</div>' +
                '</div>';
        }else{
            var itemTemplate = '' +
                '<div class="item" data-chip-index="'+selectIdx+'">' +
                '<div class="item-content">' +
                '<div class="card">' +
                '<img src="'+src+'"/>' +
                '<div class="card-remove">X</div>' +
                '</div>' +
                '<div class="item-info">'+
                '<span class="thumb"><img src="' + optImgSrc +'"/></span>' +
                '<span class="prd_name">'+ itemNm + '</span>'+
                '<button class="prd_cart" data-item="'+itemNo+'" data-qty="'+qty+'">장바구니</button>'+
                '</div>'+
                '</div>' +
                '</div>';
        }
        itemElem.innerHTML = itemTemplate;
        ret.push(itemElem.firstChild);
        self.updateIndices();
        return ret;
    },
    updateIndices : function(){
        var self = this;
        if(self.selectCnt == 0){
            //self.gridElement.removeClass('muuri');
            self.gridElement.removeClass('is-empty');
            $('.cp-icon-notice-wrap').removeClass('is-muuri');
            $('.cp-icon-notice-wrap .cp-tooltip').hide();
            return false;
        }
    },
    resetItems : function(){
        var self = this;
        var elem = $('.muuri-item');

        ColorChipsLayer.$itemSwiper.find('.swiper-slide').find('a').removeClass('select');

        if(self.grid) {
            self.grid.hide(elem, {onFinish: function (items) {
                    var item = items[0];
                    self.grid.remove(item, {removeElements: true});
                }});
        }

        var defaultHtml = self.gridElement[0].innerHTML;
        ColorChipsLayer.grid = new Muuri('.grid-area');
        ColorChipsLayer.gridElement[0].innerHTML = defaultHtml;

        self.gridElement.removeClass('is-empty');

        ColorChipsLayer.selectCnt = 0;
        ColorChipsLayer.selectInfo = [];
        ColorChipsLayer.selectIdx = 0;
        ColorChipsLayer.gridElement = null;

        $('.cp-icon-notice-wrap').removeClass('is-muuri');
        $('.cp-icon-notice-wrap .cp-tooltip').hide();
    },
    elementMatches : function(element, selector){
        var self = this;
        var p = Element.prototype;
        return (p.matches || p.matchesSelector || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || p.oMatchesSelector).call(element, selector);
    },
    elementClosest : function(element, selector){
        var self = this;
        if (window.Element && !Element.prototype.closest) {
            var isMatch = self.elementMatches(element, selector);
            while (!isMatch && element && element !== document) {
                element = element.parentNode;
                isMatch = element && element !== document && self.elementMatches(element, selector);
            }
            return element && element !== document ? element : null;
        }
        else {
            return element.closest(selector);
        }
    }
}