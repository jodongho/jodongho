$.namespace("monthEvent.detail");
monthEvent.detail = {
        
    snsInitYn : "N",
    snsTitle : "5/30~6/5 단 일주일! 올리브영 온라인몰 오늘세일#첫구매#하고싶다★",
    
    init : function(){
        
        if(common.isLogin()){
          
        };

        /* 닫기  */
        $(".eventHideLayer").click(function(){
           // mevent.detail.eventCloseLayer(); 공통 
            monthEvent.detail.eventCloseLayer();
        });
        
        /* 위수탁  닫기 */
        $(".eventHideLayer1").click(function(){
            monthEvent.detail.eventCloseLayer1();
        });
  
    },

    // 첫구매 고객 플러스 혜택 상품 선택시 레이어 팝업 호출 
    checkFirstProdutSet : function(fvrSeq) {
       
        $("div#Confirmlayer1").attr("onClick", "monthEvent.detail.applyGetFirstProdutJson(' " + fvrSeq + " ');");
        if(fvrSeq == '1') {
            mevent.detail.eventShowLayer('falgBox1');
        }else   if(fvrSeq == '2') {
            mevent.detail.eventShowLayer('falgBox2');
        }else   if(fvrSeq == '3') {
            mevent.detail.eventShowLayer('falgBox3');
        }else   if(fvrSeq == '4') {
            mevent.detail.eventShowLayer('falgBox4');
        }
    },
    
    
    applyGetFirstProdutJson:function(fvrSeq){
        if(!mevent.detail.checkLogin()){
            return;
        }
        if(!mevent.detail.checkRegAvailable()){
            return;
        }
        
      common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20180530_3/applyGetFirstProdutJson.do" //  첫번째 구매인지 체크 
              , {
                      evtNo : $("input[id='evtNo']:hidden").val() , 
                      fvrSeq : fvrSeq
                }
              , function(json){ 
                  $(':radio[name="argee1"]:checked').attr("checked", false);
                  $(':radio[name="argee2"]:checked').attr("checked", false);
                  
                    if(json.ret == "0"){   // 첫번쨰 구매가 맞으면 위수탁 레이어팝업 노출  확인 클릭 하면 응모하기  
                         $("div#Confirmlayer2").attr("onClick", "monthEvent.detail.applyAddGetFirstProdutJson(' " + fvrSeq + " ');");
                         monthEvent.detail.eventCloseLayer();
                         monthEvent.detail.eventShowLayer1('eventLayerPolice1');
                    }else{
                        alert(json.message);
                    }
                }
        ); 
    },
    
    applyAddGetFirstProdutJson : function(fvrSeq){
       //실제로 응모처리 수행해야함 
        if(!mevent.detail.checkLogin()){
            return;
        }
        if(!mevent.detail.checkRegAvailable()){
            return;
        }
       /* 수신동의  myTotalCnt =0 일때만 수신동의 받고 그이후에는 계속Y */
       var mbrInfoUseAgrYn =  $(':radio[name="argee1"]:checked').val();
       var mbrInfoThprSupAgrYn =  $(':radio[name="argee2"]:checked').val();
       
       if("Y" != mbrInfoUseAgrYn){
           monthEvent.detail.eventCloseLayer1();
           return;
       }
       if("Y" != mbrInfoThprSupAgrYn){
           monthEvent.detail.eventCloseLayer1();
           return;
       }

       monthEvent.detail.eventCloseLayer2();
       
      var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
              , fvrSeq : fvrSeq  
              , mbrInfoUseAgrYn : $(':radio[name="argee1"]:checked').val()
              , mbrInfoThprSupAgrYn : $(':radio[name="argee2"]:checked').val()
        };
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20180530_3/applyAddGetFirstProdutJson.do"  
              , param
              , monthEvent.detail._callback_applyAddGetFirstProdutJson
        );   
    },
    
    _callback_applyAddGetFirstProdutJson : function(json){
         if(json.ret == "0"){
            $(':radio[name="argee1"]:checked').attr("checked", false);
            $(':radio[name="argee2"]:checked').attr("checked", false);
            alert("응모되었습니다");
        }else{
            alert(json.message);
        }
    },
    
    /* sns 공유 */
    shareSns : function(type){
        if(type == "url"){
            $("#linkUrlStr").html("<textarea style='width:100%;' readonly=''>" + _baseUrl + "E.do?evtNo=" + $("#evtNo").val() + "</textarea>");
            mevent.detail.eventShowLayer('eventLayerURL');
        }else{
         // 배너 이미지 체크
            var bnrImgUrlAddr = $("#bnrImgUrlAddr").val();
            if(bnrImgUrlAddr == undefined || bnrImgUrlAddr == null || bnrImgUrlAddr == ""){
                bnrImgUrlAddr = "";
            } else {
                bnrImgUrlAddr = _fileUploadUrl + bnrImgUrlAddr;
            }
            
            var imgUrl = "";
            // 이미지가 없을 경우 배너로 교체
            if(imgUrl == undefined || imgUrl == null || imgUrl == "" || type == "facebook"){
                imgUrl = bnrImgUrlAddr;
            }
            
            if(type == "kakaotalk"){
                //카톡 공유 시 지정 썸네일 이미지로 교체
                imgUrl = "http:" + _cdnImgUrl + "contents/201805/30today/thumb_tab3.jpg";
            }

            // 이미지가 없을 경우 배너로 교체
            if(imgUrl == undefined || imgUrl == null || imgUrl == ""){
                imgUrl = bnrImgUrlAddr;
            }

            var snsShareUrl = _baseUrl + "E.do?evtNo="+$("#evtNo").val();
            var title = monthEvent.detail.snsTitle;
            
            if(monthEvent.detail.snsInitYn == "N"){
                common.sns.init(imgUrl, title, snsShareUrl);
                monthEvent.detail.snsInitYn = "Y";
            }
            
            common.sns.doShare(type);
        }
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
    

    // 레이어 숨김
    eventCloseLayer : function(){ 
        $(".eventLayer").hide();
        $("#eventDimLayer").hide();
    },
    
    // 레이어 숨김
    eventCloseLayer1 : function(){ 
        alert($("input[name='closeMsgTxt']:hidden").val());
        $(".eventLayer").hide();
        $("#eventDimLayer1").hide();
        location.reload();      //위수탁 동의 x일 때 스크롤 맨위로 가게하기 위해 페이지 새로고침
    },
    
    // 레이어 숨김
    eventCloseLayer2 : function(){ 
        $(".eventLayer").hide();
        $("#eventDimLayer1").hide();
        $("#eventDimLayer").hide();  
    },

    
}