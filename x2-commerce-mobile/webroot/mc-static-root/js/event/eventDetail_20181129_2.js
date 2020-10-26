/** 
 * 배포일자 : 2018.11.22
 * 오픈일자 : 2018.11.29
 * 이벤트명 : OLIVE YOUNG BRAND SALE TAB1
 * */ 

$.namespace("monthEvent.detail"); 
monthEvent.detail = {
        
        itemNum : null, //선택한 아이템 번호
        chkTotalAmt : 0,
        amtChkYn : "N",    //누적 구매금액 확인 여부
        
        init : function(){
            
            if($("#eventTabFixed").length == 1) {
                $(window).scroll(function(){
                    var scrollTop = $(document).scrollTop();
                    //var tabHeight =$("#eventTabImg").height() + 203;
                    var tabHeight = 202;
                    if (scrollTop > tabHeight) {
                        $("#eventTabFixed")
                        .css("position","fixed")
                        .css("top","0px");
                    } else {
                        $("#eventTabFixed")
                        .css("position","absolute")
                        .css("top","");
                    }
                });
            }
            
            // 2. base layer close
            $(".eventHideLayer1").click(function(){
                $('.eventLayer').hide();
                $('#eventDimLayer').hide();
            });
            
            //그래프초기화
            $(".bar_wrap").children(".bar").css("width","0%");
            
            //미로그인 시 신청하기 버튼 클릭 학인 gift_btn1
            $(".p_gift").children(".gift_btn1").click(function(){
                if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
                    if(confirm("모바일 앱에서만 참여 가능합니다.")){
                        common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
                    }else{
                        return;
                    }
                }else{
                    // 로그인 체크
                    if(!mevent.detail.checkLogin()){
                        return;
                        
                    }else{
                        // 누적금액 확인하기 버튼 클릭 체크
                        if("N"==monthEvent.detail.amtChkYn){
                            alert("결제 금액을 확인 후 신청해 주세요.");
                            return;
                        }else if("Y"==monthEvent.detail.amtChkYn){
                            if( !( $(".p_gift").children(".gift_btn1").hasClass("end") ) && !( $(".p_gift").children(".gift_btn1").hasClass("on")) ){
                                alert("누적 결제 금액이 3만원 이상일 때 신청가능합니다.");
                                return;
                            }
                            else if($(".p_gift").children(".gift_btn1").hasClass("end")){
                                alert("이미 신청 완료하였습니다. 12월 17일 당첨자발표일에 확인하세요!");
                                return;
                            }
                        }
                    }
                }
            });
            
            //미로그인 시 신청하기 버튼 클릭 학인 gift_btn2
            $(".p_gift").children(".gift_btn2").click(function(){
                if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
                    if(confirm("모바일 앱에서만 참여 가능합니다.")){
                        common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
                    }else{
                        return;
                    }
                }else{
                    // 로그인 체크
                    if(!mevent.detail.checkLogin()){
                        return;

                    }else{
                        // 누적금액 확인하기 버튼 클릭 체크
                        if("N"==monthEvent.detail.amtChkYn){
                            alert("결제 금액을 확인 후 신청해 주세요.");
                            return;
                            
                        }else if("Y"==monthEvent.detail.amtChkYn){
                            if( !( $(".p_gift").children(".gift_btn2").hasClass("end") ) && !( $(".p_gift").children(".gift_btn2").hasClass("on")) ){
                                alert("누적 결제 금액이 5만원 이상일 때 신청가능합니다.");
                                return;
                                
                            }
                            else if($(".p_gift").children(".gift_btn2").hasClass("end")){
                                alert("이미 신청 완료하였습니다. 12월 17일 당첨자발표일에 확인하세요!");
                                return;
                            }
                        }
                    }
                }
            });
            
            //미로그인 시 신청하기 버튼 클릭 학인 gift_btn3
            $(".p_gift").children(".gift_btn3").click(function(){
                if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
                    if(confirm("모바일 앱에서만 참여 가능합니다.")){
                        common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
                    }else{
                        return;
                    }
                }else{
                    // 로그인 체크
                    if(!mevent.detail.checkLogin()){
                        return;

                    }else{
                        // 누적금액 확인하기 버튼 클릭 체크
                        if("N"==monthEvent.detail.amtChkYn){
                            alert("결제 금액을 확인 후 신청해 주세요.");
                            return;
                            
                        }else if("Y"==monthEvent.detail.amtChkYn){
                            if( !( $(".p_gift").children(".gift_btn3").hasClass("end") ) && !( $(".p_gift").children(".gift_btn3").hasClass("on")) ){
                                alert("누적 결제 금액이 7만원 이상일 때 신청가능합니다.");
                                return;
                                
                            }
                            else if($(".p_gift").children(".gift_btn3").hasClass("end")){
                                alert("이미 신청 완료하였습니다. 12월 17일 당첨자발표일에 확인하세요!");
                                return;
                            }
                        }
                    }
                }
            });
        },
        
        /* 누적 구매금액 확인 */
        ordAmtChk : function(){
            if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
                if(confirm("모바일 앱에서만 참여 가능합니다.")){
                    common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
                }else{
                    return;
                }
            }else{
                
                if(!mevent.detail.checkLogin()){
                    return;
                }else{
                    
                    var param = {
                            evtNo : $("input[id='evtNo']:hidden").val()
//                            , evtStrtDt : "20181101" //운영 올릴 때 바꿔야함!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 20181129
//                            , evtEndDt : "20181205" //운영 올릴 때 바꿔야함!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 20181205
                    };
                    common.Ajax.sendRequest(
                            "GET"
                            , _baseUrl + "event/20181129_2/getOrdAmtChkJson.do"
                            , param
                            , this._callback_getOrdAmtChkJson
                    );
                }
            }
        },
        _callback_getOrdAmtChkJson : function(json){
            if(json.ret == '0'){
                
                monthEvent.detail.chkTotalAmt = parseInt(json.totalPayAmt); 
                var chkTotalAmt = parseInt(monthEvent.detail.chkTotalAmt);
                
                //금액설정
                $(".money_text").html($.number(json.totalPayAmt)+"<span>원</span>");
                
                //금액 노출
                $(".p_confirm").children("#off").css("display","none");
                $(".p_confirm").children("#on").css("display","block");
                
                var tempAmt = Math.floor(chkTotalAmt/100000*100); // 소수점버림
                $(".bar_wrap").children(".bar").css("width",parseInt(tempAmt)+"%");

                monthEvent.detail.amtChkYn = "Y"; // 누적금액 버튼 클릭 활성화

                /**   1번, 2번, 3번 신청여부 확인   */
                monthEvent.detail.getEventItemApplyChk();
                
            }else{
                alert(json.message);
                monthEvent.detail.amtChkYn = "N"; // 누적금액 버튼 실패시
                
            }
        },
        
        
        //브랜드 세일 : 경품 응모 신청여부 체크
        getEventItemApplyChk : function() {
            if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
                if(confirm("모바일 앱에서만 참여 가능합니다.")){
                    common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
                }else{
                    return;
                }
            }else{
                
                if(!mevent.detail.checkLogin()){
                    return;
                }else{
                    
                    var param = {
                            evtNo : $("input[id='evtNo']:hidden").val()
                    }
                    common.Ajax.sendJSONRequest(
                            "GET"
                            , _baseUrl + "event/20181129_2/getApplyEventJson.do"
                            , param
                            , monthEvent.detail._callback_getApplyEventJson
                    );
                }
            }
        },
        _callback_getApplyEventJson : function(json){
            if(json.ret == "0"){
                console.log("#one : "+json.applyOne+"#two : "+json.applyTwo+"#three : "+json.applyThree);
                
                /* 신청되었으면 비활성화 */
                if(json.applyOne == 1){ //3만원
                        $(".p_gift").children(".gift_btn1").addClass("end");
                        $(".p_gift").children(".gift_btn1").removeAttr("onclick");
                }
                if(json.applyTwo == 1){ //5만원
                        $(".p_gift").children(".gift_btn2").addClass("end");
                        $(".p_gift").children(".gift_btn2").removeAttr("onclick");
                }
                if(json.applyThree == 1){ //7만원
                        $(".p_gift").children(".gift_btn3").addClass("end");
                        $(".p_gift").children(".gift_btn3").removeAttr("onclick");
                }
                
                /** 신청버튼처리*/
                monthEvent.detail.changeBtnChk();
                
            } else {
                alert(json.message);
            }
        },
        
        /**
         * 신청하기 버튼 활성화
         * 단, class end 가 있으면 이미 신청했으므로 신청완료로 처리
         */
        changeBtnChk : function(){
            if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
                if(confirm("모바일 앱에서만 참여 가능합니다.")){
                    common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
                }else{
                    return;
                }
            }else{
                
                if(!mevent.detail.checkLogin()){
                    return;
                }else{
                    
                    var chkAmount = parseInt(monthEvent.detail.chkTotalAmt);
                    
                    //신청버튼 처리
                    if(30000 <=chkAmount){ //30000 같거나 크고, 40000보다 작을때
                        if( !( $(".p_gift").children(".gift_btn1").hasClass("end") ) ){
                            $(".p_gift").children(".gift_btn1").addClass("on");
                            $(".p_gift").children(".gift_btn1").attr("onClick", "javascript:monthEvent.detail.getEventApplyCheck(1)");
                        }else{
                            $(".p_gift").children(".gift_btn1").removeClass("on");
                        }
                    }
                    if(50000 <=chkAmount){ //40000 같거나 크고, 50000보다 작을때
                        if( !( $(".p_gift").children(".gift_btn2").hasClass("end") ) ){
                            $(".p_gift").children(".gift_btn2").addClass("on");
                            $(".p_gift").children(".gift_btn2").attr("onClick", "javascript:monthEvent.detail.getEventApplyCheck(2)");
                        }else{
                            $(".p_gift").children(".gift_btn2").removeClass("on");
                        }
                    }
                    if(70000 <=chkAmount){ //70000 같거나 크다
                        if( !( $(".p_gift").children(".gift_btn3").hasClass("end") ) ){
                            
                            $(".p_gift").children(".gift_btn3").addClass("on");
                            $(".p_gift").children(".gift_btn3").attr("onClick", "javascript:monthEvent.detail.getEventApplyCheck(3)");
                        }else{
                            $(".p_gift").children(".gift_btn3").removeClass("on");
                        }
                    }else{
                        // TODO 
                    }
                }
            }
        },
        
        /*  기능 : 위수탁 체크 할 지 말 지를 위한 참여여부 확인    */
        getEventApplyCheck : function(obj){
            
            monthEvent.detail.itemNum = obj; //선택한 ITEM
            
            if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
                if(confirm("모바일 앱에서만 참여 가능합니다.")){
                    common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
                }else{
                    return;
                }
            }else{
                if(!mevent.detail.checkLogin()){
                    return;
                    
                }else{
                    var inFvrSeqArr = ["1","2","3"];
                    var param = {
                            evtNo : $("input[id='evtNo']:hidden").val()
                            , inFvrSeqArr : inFvrSeqArr.toString()
                    }
                    common.Ajax.sendRequest(
                            "GET"
                          , _baseUrl + "event/20181129_2/getEventApplyCheck.do"
                          , param
                          , monthEvent.detail._callback_getFirstChkJson
                    );
                }
            }
        },
        _callback_getFirstChkJson : function(json){
            
            //variable 
            var result = json.ret; // 응답 성공유무
            var totalCount = json.myTotalCnt; // 위수탁 - 이벤트참여여부 확인 
            
            if(result == 0){
                if(totalCount > 0){
                    //위수탁 동의했던 사람으로 체크
                    $(':radio[name="argee1"]:input[value="Y"]').attr("checked", true);
                    $(':radio[name="argee2"]:input[value="Y"]').attr("checked", true);
                    
                    /** 원하는 function 을 입력하면 됨 */
                    monthEvent.detail.itemApplyJson(monthEvent.detail.itemNum);
                    
                }else{
                    //위수탁처리
                    $("div#Confirmlayer").attr("onClick", "javascript:monthEvent.detail.popLayerConfirm()");
                    mevent.detail.eventShowLayer('eventLayerPolice'); //위수탁 팝업 호출
                }
                
            }else{
                alert(json.message);
            }
        },
        
        
        /* 위수탁 동의 팝업 */    
        popLayerConfirm : function(){
            
            if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
                if(confirm("모바일 앱에서만 참여 가능합니다.")){
                    common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
                }else{
                    return;
                }
            }else{
                if($(':radio[name="argee1"]:checked').val() == undefined &&  $(':radio[name="argee2"]:checked').val() == undefined ){
                    alert("개인정보 위/수탁 동의 후 참여 가능합니다.");
                    return;
                }
                if("N" == $(':radio[name="argee1"]:checked').val() && "N" == $(':radio[name="argee2"]:checked').val() ){
                    alert("개인정보 위/수탁 동의 후 참여 가능합니다.");
                    return;
                }
                if("Y" != $(':radio[name="argee1"]:checked').val()){
                    alert("개인정보 수집 이용 동의 후 참여 가능합니다.");
                    return;
                }
                if("Y" != $(':radio[name="argee2"]:checked').val()){
                    alert("개인정보 처리 위탁 동의 후 참여 가능합니다.");
                    return;
                }
                
                if("Y" == $(':radio[name="argee1"]:checked').val() && "Y" == $(':radio[name="argee2"]:checked').val()){
                    mevent.detail.eventCloseLayer();
                    
                    /** 원하는 function 을 입력하면 됨 */
                    monthEvent.detail.itemApplyJson(monthEvent.detail.itemNum);
                    
                }
            }
        },
        
        
        /**     이벤트 응모 하기       */
        itemApplyJson : function(obj){
            
            if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
                if(confirm("모바일 앱에서만 참여 가능합니다.")){
                    common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
                }else{
                    return;
                }
            }else{
                
                if(!mevent.detail.checkLogin()){
                    return;

                }else{
                    var fvrSeq = obj;
                    
                    var param = {
                            evtNo : $("input[id='evtNo']:hidden").val()
                            , fvrSeq : fvrSeq
                            , mbrInfoUseAgrYn : $("input[name='argee1']:radio:checked").val()       //개인정보 이용 동의 여부
                            , mbrInfoThprSupAgrYn : $("input[name='argee2']:radio:checked").val()    //개인정보 위탁동의 여부
                            , firstYn : monthEvent.detail.firstYn     //최초참여여부
                    };
                    common.Ajax.sendJSONRequest(
                            "GET"
                            , _baseUrl + "event/20181129_2/itemApplyJson.do"
                            , param
                            , monthEvent.detail._callback_itemApplyJson
                    );
                }
            }
        },
        _callback_itemApplyJson : function(json){
            if(json.ret == "0"){
                // 중복 클릭 방지
                monthEvent.detail.doubleSubmitFlag = false;
                
                // 이벤트 당첨여부 체크 후 버튼 설정하기
                monthEvent.detail.getEventItemApplyChk();
                
                alert("신청 완료 되었습니다! 12월 17일 당첨자발표일에 확인하세요!");
                
            }else{
                alert(json.message);
            }
        },
};