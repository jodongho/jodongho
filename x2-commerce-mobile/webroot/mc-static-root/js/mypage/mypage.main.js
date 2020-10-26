$.namespace("mypage.main");
mypage.main = {
        _ajax : common.Ajax,
        
        init : function (){
            mypage.main.getProfileImg(); // 탑리뷰어
            mypage.main.getAvailPointInfoAjax();
            
            //웹로그 바인딩
            setTimeout(function(){
                mypage.main.bindWebLog();
            }, 700);
            
            // 2019.11.25 오프라인리뷰관련추가
            if(_isLogin) {
                var lastCheckDtime = localStorage.getItem("lastCheckDtime");
                common.Ajax.sendJSONRequest(
                        "POST"
                      , _baseUrl + "mypage/getNewGdasPossibleCnt.do"
                      , {"lastCheckDtime" : lastCheckDtime}
                      , function(res) {
                          if(res.result > 0) {
                            $("#_newGdasPossible").show();
                          } else {
                              $("#_newGdasPossible").hide();
                          }
                  });
            }
        },
        
        mktRcvInit : function(){

    		// 서비스 이벤트 정보 수신 동의(선택) 동의합니다 체크 시
    		$("#svcEvtAgrYn").click(function(){
    		    if(!$("#svcEvtAgrYn").is(":checked")){
    		        $(".chk18").prop("checked",false)
    		    }
    		});
            
            $("#smsRcvAgrYn,#pushMsgRcvYn").click(function(){
                if(!$("#svcEvtAgrYn").is(":checked")){
                    alert("SMS 또는 APP PUSH 수신에 동의하시려면 반드시 서비스·이벤트 정보 수신에 동의하셔야 합니다.");
                    $("#smsRcvAgrYn,#pushMsgRcvYn").prop("checked",false);
                }
            });

           /* $(".chkSmall").change(function(){
               if($("#no").is(":checked")&&$(".chkSmall").is(":checked")){
                   alert("SMS 또는 이메일 수신에 동의하시려면 반드시 개인정보 수집 및 활용에 동의하셔야 합니다.");
                   $(".chkSmall").prop("checked",false);
                   return false;

               }
            });*/

            $('#kakaologin').on('change', function(){
	        	if(!$('#kakaologin').is(":checked")){
	        		common.popLayerOpen('lay_loginka');
	        	}else{
	        		mypage.main.changeKakaologinFlag("Y");
	        		//$('#kakaologin').prop("checked",true);
	        	}
            });
        },
        kakaologinPopClose : function(){
        	common.popLayerClose('lay_loginka');
        	$('#kakaologin').prop("checked",true);
        	return false;
        },

        kakaologinPopSave : function(){
        	common.popLayerClose('lay_loginka');
        	mypage.main.changeKakaologinFlag("N");
        	//$('#kakaologin').prop("checked",false);
        	return false;
        },

        changeKakaologinFlag : function(kakaologinFlag){
        	var data = {
        					mbrNo		   : $("#mbrNo").val()
        				,	kakaologinFlag : kakaologinFlag
    				};
        	this._ajax.sendRequest("POST"
                    , _baseUrl + "mypage/changeKakaologinFlag.do"
                    , data
                    , mypage.main.changeKakaologinFlagCallback
                );
        },
        changeKakaologinFlagCallback : function(res){
            if(res.kakaologinFlag == "Y"){
            	$('#kakaologin').prop("checked",true);
            }else{
            	$('#kakaologin').prop("checked",false);
            }
        },

        getProfileImg : function(){
            this._ajax.sendRequest("POST"
                    , _baseUrl + "mypage/getReviewerProfileImg.do"
                    , null
                    , mypage.main.getProfileImgCallback
                );
        },
        getProfileImgCallback : function(res){
            if(res.profileImage != undefined && res.profileImage != null){
                $('#profileImg').attr('src',_profileImgUploadUrl+res.profileImage.appxFilePathNm);
            }else{
                $('#profileImg').attr('src',_imgUrl+"comm/my_picture_base.jpg");
            }
        },
        /**
         * 부가정보 조회 Ajax 요청 함수
         */
        getAvailPointInfoAjax : function () {
            this._ajax.sendRequest("POST"
                , _baseUrl + "order/getAvailPointInfoJson.do"
                , null
                , mypage.header.getAvailPointInfoCallback
            );
        },
        /**
         * 부가정보 조회 Ajax 요청 함수
         */
        getAvailPointInfoAjax : function () {
            this._ajax.sendRequest("POST"
                , _baseUrl + "order/getAvailPointInfoJson.do"
                , null
                , mypage.main.getAvailPointInfoCallback
            );
        },
        /**
         * 부가정보 조회 append Ajax 요청 결과에 대한 callback 처리 함수
         * [3235186] 마이페이지 기빙스탬프 노출 구좌 추가 및 GUI 개선 (CHY) - UI 개선으로 mylinkList01 class -> id 변경
         * [3320682] 온라인몰 마이페이지 UX 개선 - 전체 UI 개선으로 selector 수정(CHY)
         */
        getAvailPointInfoCallback : function (res) {
            if((typeof res != 'undefiend') && res.returnCd == 'S'){
                if(res.CJOnePnt && res.CJOnePnt == -9999){
                    var format = "yyyy.MM.dd HH:mm";
                    var startDtime = new Date(res.CJOneSystemIFExpStartDtime).format(format);
                    var endDtime = new Date(res.CJOneSystemIFExpEndDtime).format(format); 
                    
                    alert(startDtime+" ~ "+endDtime+"까지 \nCJ ONE 시스템 점검으로 CJ ONE 포인트 조회가 불가합니다.");
                    
                    $("#myOnePoint").find('em').html('<span>점검중</span>');
                }else{
                    $("#myOnePoint").find('span').html(res.CJOnePnt && res.CJOnePnt > 0?res.CJOnePnt.numberFormat():"0");
                }
                $("#myCoupon").find('span').html(res.cpnListCnt?res.cpnListCnt:"0");
                $("#myDeposit").find('em').html(res.csmnOwnPntAmt?res.csmnOwnPntAmt.numberFormat():"0");
                var cafeteriaPntObj = $("#cafeteria").find('em');
                if(res.cafeteriaPnt && res.cafeteriaPnt == -9999){
                    var format = "yyyy.MM.dd HH:mm";
                    var startDtime = new Date(res.cafeteriaSystemIFExpStartDtime).format(format);
                    var endDtime = new Date(res.cafeteriaSystemIFExpEndDtime).format(format); 
                    
                    alert(startDtime+" ~ "+endDtime+"까지 \n카페테리아 시스템 점검으로 카페테리아 조회가 불가합니다.");
                    
                    cafeteriaPntObj.html("점검중");
                // 임직원이 휴직중인 경우
                }else if(res.cafeteriaPnt == -9990){
                    cafeteriaPntObj.html("휴직자");
                }else{
                    cafeteriaPntObj.html((res.cafeteriaPnt && res.cafeteriaPnt > 0 ? res.cafeteriaPnt.numberFormat() : "0") );
                }

                if (common.app.appInfo.isapp && res.isSmartReceiptError) {
                    var format = "yyyy.MM.dd HH:mm";
                    var startDtime = new Date(res.smartReceiptSystemIFExpStartDtime).format(format);
                    var endDtime = new Date(res.smartReceiptSystemIFExpEndDtime).format(format); 
                    $(".smartReceipt").attr("href","javascript:alert('"+startDtime+" ~ "+endDtime+"까지 \n스마트영수증 시스템 점검으로 스마트영수증 조회가 불가합니다.');");

                }
            }
        },
        modMemInfo : function (){
            if(common.app.appInfo.isapp){
                common.app.callOpenPage("회원정보 수정", _cjEaiUrl + _mbrMdfUrl +"&coop_url="+ encodeURIComponent(_secureUrl + "main/main.do"));
            }else{
                window.open(_cjEaiUrl + _mbrMdfUrl + "&coop_url="+ encodeURIComponent(_secureUrl + "main/main.do"));
            }
        },
        
        modMemPasswd : function(){
            if(common.app.appInfo.isapp){
                common.app.callOpenPage("비밀번호 변경", _cjEaiUrl + _cngPwdUrl);
            }else{
                window.open(_cjEaiUrl + _cngPwdUrl);
            }
            
        },
        
        mktRcvSend : function(){
            if($("#svcEvtAgrYn").is(":checked") && !$("#smsRcvAgrYn").is(":checked") && !$("#pushMsgRcvYn").is(":checked")){
            	alert("서비스·이벤트 알림 수신 동의를 동의 하신 경우 알림 수신 채널을 최소 1개 필수로 선택하셔야 합니다.");
            	return false;

            } else {

            	if( $("#svcEvtAgrYnVal").val() == "Y" && !$("#svcEvtAgrYn").is(":checked") ){
            		if(!confirm("서비스·이벤트 정보 수신 동의를 미동의 시 모든 혜택 알림을 받을 수 없게 됩니다. 변경 하시겠습니까?")){
            			return false;
            		}
            	}

                var smsRcvAgrYn = $("#smsRcvAgrYn").is(":checked") ? "Y" : "N";
                var pushMsgRcvYn = $("#pushMsgRcvYn").is(":checked") ? "Y" : "N";
                var agr40 = $("#svcEvtAgrYn").is(":checked") ? "Y" : "N";

                var url = _baseUrl+"mypage/setMktReceiptInfoJson.do"
                var data = {agr40 : agr40
                        , smsRcvAgrYn : smsRcvAgrYn
                        , pushMsgRcvYn : pushMsgRcvYn };
            
                common.Ajax.sendRequest("POST", url, data, mypage.main._callBack_mktRcvSend);
            }
        },
        
        _callBack_mktRcvSend : function (data){
            if (data.result) {

            	var agr40 = $("#svcEvtAgrYn").is(":checked") ? "Y" : "N";
            	$("#svcEvtAgrYnVal").val(agr40);

            	if( data.pushChgYn == "Y" ){
            		mypage.main.sendTmsPush(data.pushYn); // TMS 푸시동의정보 송신
            	}
                alert(data.rcvInfoChgMsg);

            } else {
                alert("서비스가 원활하지 않아 수신정보 변경에 실패하였습니다.");
                return false;
            }
        },

        goTab1Page : function(idx,storNo){
            var urlArr = [  _baseUrl + "mypage/getMemberInfoChangeForm.do"       // 정보수정
                           , _baseUrl + "customer/getMembershipInfo.do"          // 등급헤택
                           , _baseUrl + "store/getStoreMain.do"                  // 관심매장 메인
                           , _baseUrl + "store/getStoreDetail.do?strNo="         // 관심매장 상세
                           , _baseUrl + "main/getMembership.do"                  // 멤버십 라운지 개편
                           , _baseUrl + "mypage/getMySkinCondition.do" // 나의프로필 -to-be_lsy
                           ]
            $(location).attr('href', urlArr[idx] + (typeof storNo != "undefined" ? storNo : ""));
        },
        
        goTab2Page : function(idx, key){
            var urlArr = [  _secureUrl + "mypage/getOrderList.do"          // 주문/배송조회
                                , _secureUrl + "mypage/getOrderDetail.do?ordNo="+key        // 주문상세 - 마이페이지 개선(CHY)
                ]
            $(location).attr('href', urlArr[idx]);
        },
        
        goTab3Page : function(idx, key){
            var urlArr = [ _baseUrl + "mypage/getSmartRecipt.do?mbr_no="+key           // 스마트 영수증
                           , _baseUrl + "mypage/getOrderCancelList.do"    // 취소/반품/교환
                           ]
            $(location).attr('href', urlArr[idx]);
            
        },
        
        goTab4Page : function(idx){
            var urlArr = [  _baseUrl + "mypage/getCJOnePointInfo.do"      // CJ ONE 포인트
                           , _baseUrl + "mypage/getCouponList.do"         // MY 쿠폰 페이지
                           , _baseUrl + "mypage/getDepositList.do"        // 예치금   
                           ]
            $(location).attr('href', urlArr[idx]);
        },
        
        goTab5Page : function(idx){
            if(idx == 7){
                // 배송지 등록시 생기는 환경변수 제거
                sessionStorage.removeItem("regDeliveryYn");
            } else if(idx == 2) {
                sessionStorage.removeItem("gdasTabId"); // 상품평 초기 진입시 남아있는 TAB정보 초기화
            }
            
            var urlArr = [  _baseUrl + "mypage/getWishList.do"         // 쇼핑찜 
                           , _secureUrl + "cart/getCart.do"              // 장바구니
                           , _baseUrl + "mypage/getGdasList.do"        // 상품평   
                           , _baseUrl + "mypage/getGoodsQnaList.do"    // 상품 Q&amp;A
                           , _baseUrl + "counsel/getQnaForm.do"        // 1:1문의
                           , _baseUrl + "mypage/getMyEventList.do"     // 이벤트
//                           , _baseUrl + "mypage/getMyBeautyList.do"    // 뷰티테스터
                           , _baseUrl + "mypage/getMyOllyoungList.do"    // 올영체험단
                           , _baseUrl + "mypage/getDeliveryInfo.do"    // 배송지/환불계좌
                           , _baseUrl + "mypage/getReWhsgList.do"      // 재입고
                           , _baseUrl + "mypage/getVipLounge.do"       // VIP라운지
                           , _plainUrl + "store/getStoreMain.do?searchType=favor&tabType=favorTab" //관심매장 -- to-be 탑리뷰어_lsy
//                           , _baseUrl + "mypage/getMySkinCondition.do" // 나의피부컨디션 -- as-is 탑리뷰어_lsy
                           , _baseUrl + "myGiftCard/getMyGiftCard.do"   // 기프트카드 - [3320682] 온라인몰 마이페이지 UX 개선(CHY)
                           , _baseUrl + "mypage/getGiftBoxList.do?rspCheck=R"   // 선물함 추가 CBLIM 20200622
                           ]
            $(location).attr('href', urlArr[idx]);
        },
        
        goBenefitPage : function(){
            //BI Renewal. 20190918. nobbyjin. - Link 수정
            //location.href = _baseUrl + "main/main.do#43_1";
            location.href = _baseUrl + "main/getMembership.do";
        },
        
        /* [3235186] 마이페이지 기빙스탬프 노출 구좌 추가 및 GUI 개선 (CHY) */
        goEventPage : function(idx, key){
            var urlArr = [  _baseUrl + "event/20200201_1/getEventDetail.do?evtNo="+key+"#myGivingStamp"         // 기빙스탬프 이벤트 페이지 지정 앵커 이동
                            , _baseUrl + "event/20200201_1/getEventDetail.do?evtNo="+key                        // 기빙스탬프 이벤트 페이지 이동
                            ]
             $(location).attr('href', urlArr[idx]);
        },
        
        // [3343779] TMS 앱푸시수신동의값 변경 송신
        sendTmsPush : function(push){
    		var url = _secureUrl + 'customer/getUserSsoMbrNo.do';
    		var data = {"push" : push};

    		common.Ajax.sendRequest("POST",url,data,mypage.main._callbackSendTmsPush);
        },

        _callbackSendTmsPush : function(res){

    		$.ajax({
    			type: "POST" ,
    			url: _tmsPushUrl,
    			dataType : "json",
    			data: res,
    			contentType: "application/json",
    			error: function (request, status, error) {
//    				console.log(error);
    			}, success: function (res) {
//    				console.log(res);
    			}
    		});

    		return false;
        },

        // [3314018] DS 마이페이지 영역분석 추가 件 - 클릭 지표 추가 및 UI 개선에 따른 수정 작업(CHY)
        bindWebLog : function() {
            //정보수정
            $("#user").bind("click", function() {
                common.wlog("mypage_edit");
            });
            //등급혜택
            // [3363877] 온라인몰 모바일 마이페이지 DS 수정 요청(CHY)
            $("#benefit").bind("click", function() {
                common.wlog("mypage_membership");
            });
            //관심매장
            $(".myPageNav li #interestStore").bind("click", function() {
                common.wlog("mypage_intereststore");
            });
            // [3235186] 마이페이지 기빙스탬프 노출 구좌 추가 및 GUI 개선 (CHY) - UI 개선으로 mylinkList01 class -> id 변경
            //CJ ONE 포인트
            $(".myPoint .inner li #myOnePoint").bind("click", function() {
                common.wlog("mypage_onepoint");
            });
            //쿠폰
            $(".myPoint .inner li #myCoupon").bind("click", function() {
                common.wlog("mypage_coupon");
            });
            //예치금
            $(".myPageNav li #myDeposit").bind("click", function() {
                common.wlog("mypage_deposit");
            });
            //주문배송조회
            $(".odstep_box a#orderList").bind("click", function() {
                common.wlog("mypage_orderlist");
            });
            //더보기
            $(".odview_box a#odmore").bind("click", function() {
                common.wlog("mypage_odmore");
            });
            //취소/반품/교환
            $(".myPageNav li #odCnacle").bind("click", function() {
                common.wlog("mypage_cancle");
            });
            // 선물함 데이터스토리 추가 CBLIM 20200709
            $(".myPageNav li #giftBoxList").bind("click", function() {
            	common.wlog("mypage_giftbox_main");
            });
            //카페테리아
            /*$(".myPageNav li #cafeteria").bind("click", function() {
                common.wlog("mypage_cafeteria");
            });*/
            //쇼핑찜
            $(".myPageNav li #wishList").bind("click", function() {
                common.wlog("mypage_wishlist");
            });
            //장바구니
            $(".mylinkList02 li #cart").bind("click", function() {
                common.wlog("mypage_myshop_cart");
            });
            //상품평
            $(".myPoint .inner li #reputation").bind("click", function() {
                common.wlog("mypage_reputation");
            });
            //상품QnA내역
            $(".myPageNav li #qna").bind("click", function() {
                common.wlog("mypage_qna");
            });
            //1대1문의내역
            $(".myPageNav li #1to1").bind("click", function() {
                common.wlog("mypage_1to1");
            });
            //기프트 카드
            $("#giftCard").bind("click", function() {
                common.wlog("mypage_myshop_giftcard");
            });
            //이벤트
            $(".myPageNav li #event").bind("click", function() {
                common.wlog("mypage_event");
            });  
//            //뷰티테스터
//            $(".mylinkList02 li #beautyTest").bind("click", function() {
//                common.wlog("mypage_beautytest");
//            });
            //올영체험단
            $(".mylinkList02 li #ollyoung").bind("click", function() {
                common.wlog("mypage_ollyoung");
            });
            //배송지/환불계좌
            $(".myPageNav li #refund").bind("click", function() {
                common.wlog("mypage_refund");
            });
            //재입고알림
            $(".myPageNav li #rewhsglist").bind("click", function() {
                common.wlog("mypage_rewhsglist");
            });
            //VIP라운지
            $("#bannerVip").bind("click", function() {
                common.wlog("mypage_vipLounge");
            });
            //나의프로필
            $('#myprofile').bind('click',function(){
                common.wlog("mypage_profile");
            });
            //기빙스탬프
            $(".myPageNav li #givingStamp").bind("click", function() {
                common.wlog("mypage_giving");
            });
            //랜덤리워드
            $("#randomMain > a").bind("click", function() {
                common.wlog("mypage_random");
            });
            //기빙스탬프란 물음표 선택
            $("#givingMain > button").bind("click", function() {
                common.wlog("mypage_giving_qmark");
            });
            //랜덤리워드란 물음표 선택
            $("#randomMain > button").bind("click", function() {
                common.wlog("mypage_random_qmark");
            });
            //기빙스탬프 안내팝업 내 이벤트 안내 바로가기 버툰
            $("#lay_stamp_go_event").bind("click", function() {
                common.wlog("mypage_giving_go_event");
            });
            //랜덤리워드 안내팝업 내 이벤트 안내 바로가기 버툰
            $("#lay_ranre_go_event").bind("click", function() {
                common.wlog("mypage_random_go_event");
            });
            //스마트영수증
            $(".myPageNav li #smartReceipt").bind("click", function() {
                common.wlog("mypage_smartbill");
            });
        }
};
