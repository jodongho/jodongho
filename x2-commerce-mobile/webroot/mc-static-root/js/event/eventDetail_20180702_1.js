$.namespace("monthEvent.detail");
monthEvent.detail = {
        
    checkStampYn : "N",
    checkSelectYn : "N",
    currentDay : null,
    changeDate : "201807090800",

    init : function(){
        
        if(common.isLogin()){
                    
        };
        
        /* START  */
        $(".btn_start").click(function(){
            if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
                if(confirm("올리브영 앱에서 참여해 주세요.")){
                    common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
                }else{
                    return;
                }
            }else{
                monthEvent.detail.getDayFirstChk();     //1일1회 참여를 위해 참여여부 체크
            }            
        });
        
        //1.5초 후 쿠폰 다운로드가 떠야되서 한번만 실행되고 막는거 추가해야됨
        $(".pang_board ul li").click(function(){
            if(common.isLogin() == false){
                if(!confirm("로그인 후 참여해 주세요.")){
                    return false;
                }else{
                    common.link.moveLoginPage();
                    return false;
                }
            }else{
                $(".pang_board ul li").off("click");                
                var index = $(".pang_board ul li").index(this) + 1;
                
                $(".pang_board ul li").removeClass("active");
                $(".b"+index).addClass("active");
                
                setTimeout(function() {     //1.5초 후 쿠폰 다운로드
                    monthEvent.detail.setRndmCpnDown();
                }, 1500);
            }
        });

        /* 닫기  */
        $(".eventHideLayer").click(function(){
           // mevent.detail.eventCloseLayer(); 공통 
            monthEvent.detail.eventCloseLayer();
        });

        /* 위수탁  닫기 */
        $(".eventHideLayer1").click(function(){
            monthEvent.detail.eventCloseLayer1();
        });
        
        /* 상단 디자인 변경을 위한 일자 체크 */
        monthEvent.detail.changeImg();
        
    },
    
    //일일 참여 여부 확인
    getDayFirstChk : function() {
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("올리브영 앱에서 참여해 주세요.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{     
            if(common.isLogin() == false){
                if(!confirm("로그인 후 참여해 주세요.")){
                    return false;
                }else{
                    common.link.moveLoginPage();
                    return false;
                }
            }else{
                if(!mevent.detail.checkRegAvailable()){
                    return;
                }
                var param = {
                        evtNo : $("input[id='evtNo']:hidden").val()
//                        , index : index
                };
                common.Ajax.sendJSONRequest(
                        "GET"
                      , _baseUrl + "event/20180702_1/getDayFirstChkJson.do"
                      , param
                      , monthEvent.detail._callback_getDayFirstChkJson
                );
            }
        }
    },
    _callback_getDayFirstChkJson : function(json) {
        if(json.ret == "0"){        //일일 최초 참여 시            
            $(".btn_start").css("display", "none");
            $(".pang_board ul li").css('animation-play-state','running');
        }else{
            alert("오늘은 이미 참여하셨습니다.");
        }        
    },
    
    /* 랜덤 쿠폰 다운로드 */
    setRndmCpnDown : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("올리브영 앱에서 참여해 주세요.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{     
            if(!mevent.detail.checkLogin()){
                return;
            }
            if(!mevent.detail.checkRegAvailable()){
                return;
            }

            var param = {
                      evtNo : $("input[id='evtNo']:hidden").val()
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180702_1/setRndmCpnDownJson.do"
                  , param
                  , monthEvent.detail._callback_setRndmCpnDownJson
            );
        }
    },
    _callback_setRndmCpnDownJson : function(json){
        if(json.ret == "0"){
            var evtGift = "evtGift"+json.fvrSeq;
            mevent.detail.eventShowLayer(evtGift);
        }
    },
    
    goMyPage : function(){        
        if(common.isLogin() == false){
            if(!confirm("해당 서비스는 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?")){
                return false;
            }else{
                common.link.moveLoginPage();
                return false;
            }
        }else{
            common.link.commonMoveUrl('mypage/getCouponList.do');
        }
    },
    
    // 레이어 숨김
    eventCloseLayer : function(){
       // alert($("input[name='closeMsgTxt']:hidden").val());
        $(".eventLayer").hide();
        $("#eventDimLayer").hide();
//        location.reload();
    },    

    changeImg : function(){
        monthEvent.detail.currentDay = $("input[id='imgUrlConnectDay']:hidden").val();
        if ( eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate)  ) {
            $("#bannerA").attr("href", "https://m.oliveyoung.co.kr/m/main/main.do#1");
            $("#eventTabImg").html("<div class='imgBox'><img src='"+_cdnImgUrl+"contents/201807/02pangpang/pangpang_mc_tit2.jpg' alt='팡팡! 터지는 시원한 여름! 핫해? 우리는 매일 더 쿨해질거야!' /></div>");
            $("#pangpangBanner").attr("src", _cdnImgUrl+"contents/201807/02pangpang/pangpang_mc_banner2.png");
        }else{
            $("#bannerA").attr("href","javaScript:common.link.commonMoveUrl('planshop/getPlanShopDetail.do?dispCatNo=500000100060110');");            
            $("#eventTabImg").html("<div class='imgBox'><img src='"+_cdnImgUrl+"contents/201807/02pangpang/pangpang_mc_tit.jpg' alt='팡팡! 터지는 시원한 여름! 핫해? 우리는 매일 더 쿨해질거야!' /></div>");
            $("#pangpangBanner").attr("src", _cdnImgUrl+"contents/201807/02pangpang/pangpang_mc_banner1.png");
        }
    },
};
