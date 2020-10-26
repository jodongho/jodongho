    //<![CDATA[
        $(function(){
        //랜덤 숫자 가져오는 함수
            var fnRandomNum = function(max){            //랜덤 숫자 가져오는 함수(0~max사이의 값)
                return Math.floor(Math.random() * max);
            }

            var eventFull_len = $('.swiper-wrapper').children('li').length;       //FULL 배너 slide 갯수
            var eventFull_init_no = fnRandomNum(eventFull_len);                  //FULL 배너 slide  초기번호 

            var slideNo = $("#ref3val").val() - 1;      //일자별 슬라이드 이미지 변경을 위함
            
            for(var i=0; i<7; i++){
                if(i == slideNo){
                    $("#slideBtnImg0"+i).attr("src", _cdnImgUrl+"contents/201805/30today/today_btn_ing.png");
                    $("#slideBtnImg0"+i).attr("class", "try");
                    $("#slideBtnImg0"+i).attr("alt", "응모하기");
                }
                if(i < slideNo){
                    $("#slideBtnImg0"+i).attr("src", _cdnImgUrl+"contents/201805/30today/today_btn_end.png");
                    $("#slideBtnImg0"+i).attr("alt", "응모종료");
                    $("#slideBtnImg0"+i).attr("class", "");
                }
                if(i > slideNo){
                    $("#slideBtnImg0"+i).attr("src", _cdnImgUrl+"contents/201805/30today/today_btn_soon.png");
                    $("#slideBtnImg0"+i).attr("alt", "Coming Soon");
                    $("#slideBtnImg0"+i).attr("class", "");
                }
            }
            
            
            //이벤트 FULL 배너 slide
            var eventSlide_set = {
                slidesPerView: 1,
                initialSlide : slideNo,
                /*autoplay: 4000,*/
				autoplay: false,
                pagination: '.paging',
                autoplayDisableOnInteraction: true,
                paginationClickable: true,
                freeMode: false,
                spaceBetween: 0,
                loop: false,
				nextButton: '.next',
                prevButton: '.prev'
            }, visual_swiper = Swiper('.slideType1', eventSlide_set );
            
           

            
        });

    //]]>