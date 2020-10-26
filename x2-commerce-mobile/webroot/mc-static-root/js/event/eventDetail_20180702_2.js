$.namespace("monthEvent.detail");
monthEvent.detail = {
    
    // 현재 날짜 시간을 자바에서 가져와야함 
    //7/2 8:00 ~ 7/9 07:59
    // 1차 증정 소진 완료 시 ~ 7/9 07:59
    //7/9 8:00 ~ 7/15 23:59
    //2차 증정 소진 완료 시 ~ 7/15 07:59

    currentDay : null, 
    changeDate1 : "201807020800", 
    changeDate2 : "201807080759",  
    changeDate3 : "201807080800",  
    changeDate4 : "201807150759",  
    changeDate5 : "201807090800", // 메인이미지  & 띠배너 
    show1Cnt : 0,
    show2Cnt : 0,
    
    init : function(){

            monthEvent.detail.currentDay = $("input[id='imgUrlConnectDay']:hidden").val();  
            monthEvent.detail.show1Cnt = $("input[id='show1Cnt']:hidden").val(); 
            monthEvent.detail.show2Cnt = $("input[id='show2Cnt']:hidden").val(); 
        
        //1 
            if ( eval(monthEvent.detail.currentDay) < eval(monthEvent.detail.changeDate5)  ) {
                      var htmlStr = "";   
                      htmlStr =  "<img src='"+_cdnImgUrl + "contents/201807/02pangpang/pangpang_mc_tit.jpg' alt='팡팡! 터지는 시원한 여름! 핫해? 우리는 매일 더 쿨해질거야!'>";
                      $("div#imgBoxAB").find("span").html(htmlStr);
                      
                      //js href 링크 하기
                      $("#bannerA").attr("href","https://m.oliveyoung.co.kr/m/planshop/getPlanShopDetail.do?dispCatNo=500000100060110");
                      $("#bannerB").attr("src"," "+_cdnImgUrl+"contents/201807/02pangpang/pangpang_mc_banner1.png");
                      
              }else if ( eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate5) ) {   // 201807090800 크거나 같으면 
                      var htmlStr = "";
                      htmlStr =  "<img src='"+_cdnImgUrl + "contents/201807/02pangpang/pangpang_mc_tit2.jpg' alt='팡팡! 터지는 시원한 여름! 핫해? 우리는 매일 더 쿨해질거야!'>";
                      $("div#imgBoxAB").find("span").html(htmlStr);
                      
                      //js href 링크 하기
                      $("#bannerA").attr("href","https://m.oliveyoung.co.kr/m/main/main.do#1");
                      $("#bannerB").attr("src"," "+_cdnImgUrl+"contents/201807/02pangpang/pangpang_mc_banner2.png");

              }  

        if(common.isLogin()){

        };

        /* 닫기  */
        $(".eventHideLayer").click(function(){
           // mevent.detail.eventCloseLayer(); 공통 
            monthEvent.detail.eventCloseLayer();
        });
        
        /* 유의사항 닫기 */
        $(".eventHideLayer1").click(function(){
            monthEvent.detail.eventCloseLayer1();
        });
        
        // 나의 당첨내역
        $("div#eMylist").click(function(){
            if(!mevent.detail.checkLogin()){
                return;
            }
            /* 당첨이력조회 */
            monthEvent.detail.getMyWinList();
            mevent.detail.eventShowLayer("evtPopWinDetail");
        });
 
    },
    
    /* 당첨내역 확인 */
    getMyWinList : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
        }
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20180702_2/getStmpMyWinListJson.do" // "event/getStmpMyWinListJson.do"
              , param
              , monthEvent.detail._callback_getStmpMyWinListJson
        );
    },
    _callback_getStmpMyWinListJson : function(json){
        if(json.ret == "0"){
            var myWinListHtml = "";
            if(json.myEvtWinList.length <= 0){
                myWinListHtml = "<tr><td colspan='2'>당첨이력이 없습니다.</td></tr>";
            }else{
                for(var i=0 ; i<json.myEvtWinList.length ; i++){
                    myWinListHtml += "<tr><td>" + json.myEvtWinList[i].strSbscSgtDtime + "</td><td>" + json.myEvtWinList[i].evtGoodsNm + "</td></tr>";
                }
            }
            $("tbody#myWinListHtml").html(myWinListHtml);
        }else{
            alert(json.message);
        }
    },
    
    // 룰렛 전 위수탁 확인 
    applyJson : function(){

        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("올리브영 앱에서 참여해주세요.")){
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
            
          common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180702_2/setApplyJson.do" //  최초 1회 위수탁 팝업 호출  and 당일 룰렛 참여 했는지 조회 
                  , {
                          evtNo : $("input[id='evtNo']:hidden").val() 
                    }
                  , function(json){ 
                      $(':radio[name="argee1"]:checked').attr("checked", false);
                      $(':radio[name="argee2"]:checked').attr("checked", false);
                      
                        if(json.ret == "0"){   
                            if( json.myTotalCnt  == "0" ) {  //  한번도 룰렛을 돌리지 않은경우 
                                  $("div#Confirmlayer1").attr("onClick", "   monthEvent.detail.setRotate(' " + json.myTotalCnt + " '  ); "         );
                                  monthEvent.detail.eventShowLayer1('eventLayerPolice2');
                                  $(".agreeCont").scrollTop(0);  // 상단이동 
                              }else {
                                  monthEvent.detail.setRotate(json.myTotalCnt);
                              }
                          }else{
                              alert(json.message);
                          }
                      
                    }
            ); 
        }
    },
    
    
    /* 룰렛 돌리기 */
    setRotate : function(myTotalCnt){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("올리브영 앱에서 참여해주세요.")){
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
            
            /* 수신동의  myTotalCnt =0 일때만 수신동의 받고 그이후에는 계속Y */
            var mbrInfoUseAgrYn =  $(':radio[name="argee1"]:checked').val();
            var mbrInfoThprSupAgrYn =  $(':radio[name="argee2"]:checked').val();
            
            if(myTotalCnt == 0 ){ 
                if("Y" != mbrInfoUseAgrYn){
                    monthEvent.detail.eventCloseLayer1();
                    return;
                }
                if("Y" != mbrInfoThprSupAgrYn){
                    monthEvent.detail.eventCloseLayer1();
                    return;
                }
            }else {
                mbrInfoUseAgrYn = "Y";
                mbrInfoThprSupAgrYn = "Y";
            }
            

            monthEvent.detail.eventCloseLayer2();
            
            var param = {
                        evtNo : $("input[id='evtNo']:hidden").val()
                      , mbrInfoUseAgrYn : mbrInfoUseAgrYn
                      , mbrInfoThprSupAgrYn :mbrInfoThprSupAgrYn
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180702_2/setRotateJson.do"
                  , param
                  , monthEvent.detail._callback_setRotateJosn
            );
        }
    },
    _callback_setRotateJosn : function(json){
        if(json.ret == "0"){
            var resultItem = json.fvrSeq;
            var resultItemCount = json.itemCount;
            var revision = 360/resultItemCount;

            var duration = 2500;
            var pieAngle = 360*3;
            var angle = 0;

            angle = (pieAngle - ((resultItem*revision)-(revision/2)));

            $("img#roulette_base").rotate({
                duration: duration,
                animateTo: angle,
                callback: function(){
                    if(resultItem == "1") { // 
                        monthEvent.detail.getMyWinList();
                        $(".mem_id").html(json.custId);
                        mevent.detail.eventShowLayer('evtGift1');
                    }else if(resultItem == "2") { // 25%
                        monthEvent.detail.getMyWinList();
                        $(".mem_id").html(json.custId);
                        mevent.detail.eventShowLayer('evtGift2');
                    }else if(resultItem == "3") { // 다음기회에
                        monthEvent.detail.getMyWinList();
                        $(".mem_id").html(json.custId);
                        mevent.detail.eventShowLayer('evtGift3');
                    }else if(resultItem == "4") { // 30%
                        monthEvent.detail.getMyWinList();
                        $(".mem_id").html(json.custId);
                        mevent.detail.eventShowLayer('evtGift4');
                    }else  if(resultItem == "5") { // 15%
                        monthEvent.detail.getMyWinList();
                        $(".mem_id").html(json.custId);
                        mevent.detail.eventShowLayer('evtGift5');
                    }else  if(resultItem == "6") { // 15%
                        mevent.detail.eventShowLayer('evtGift_fail');
                    }else { // 다음기회에
                        mevent.detail.eventShowLayer('evtGift_fail');
                    }
                }
            });
            
        }else{
            if(json.ret == "013"){ // 이미응모한사람 
                mevent.detail.eventShowLayer('evtFail2');
            }else{
                alert(json.message);
            }
        }
    },
 
    // 레이어 숨김
    eventCloseLayer : function(){ 
        $(".eventLayer").hide();
        $("#eventDimLayer").hide();
    },
    
    // 레이어 숨김
    eventCloseLayer1 : function(){ 
        alert("신청되지 않았습니다.");
        $(".eventLayer").hide();
        $("#eventDimLayer1").hide();
      //  location.reload();      //위수탁 동의 x일 때 스크롤 맨위로 가게하기 위해 페이지 새로고침
    },
    
    // 레이어 숨김
    eventCloseLayer2 : function(){ 
        $(".eventLayer").hide();
        $("#eventDimLayer1").hide();
        $("#eventDimLayer").hide();  
    },

    // 레이어 노출
    eventShowLayer1 : function(obj) {
        var layObj = document.getElementById(obj);
        var layDim = document.getElementById('eventDimLayer1');
        layDim.style.display = 'block';
        layObj.style.display = 'block';
        var layObjHeight = layObj.clientHeight  / 2;
        layObj.style.marginTop = "-" + layObjHeight +"px";
    },
};



