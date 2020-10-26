/**
 * 배포일자 : 2019.01.17 
 * 오픈일자 : 2019.01.18 
 * 이벤트명 : 올리브영 어워드 12가지 증정의 법칩 탭3
 */

$.namespace("monthEvent.detail");
monthEvent.detail = {
        
    //변수설정
    selectVoteNum : null, //투표상품번호
        
    init : function() {
        
        //투표영역
        $('#votelist li').on('click', function(){
           $(":radio[name='voteName']").change(function(){
               var _tabBox = $('.tabBox');
               var _voteName = $(this).prop("checked",true).attr("id");
               _tabBox.removeClass('on');
               $('.'+_voteName).addClass('on');
           });
        });
        
        //실시간 득표 현황 확인 초기화
        if( !($('#voteResultDiv').is(":hidden"))){
            $('#voteResultDiv').hide();
        };
        
        //실시간 득표 현황 확인 클릭
        $('#rTimeVoteResult').click(function(){
            console.log("realTimeVoteClick");
            //슬라이드가 닫혔는지 열렸는지 유무 확인
            if( $('#voteResultDiv').is(":hidden")){
                monthEvent.detail.voteRank();
                $('#voteResultDiv').slideDown(1000);
            }else{
                monthEvent.detail.voteRank();
            }

        });
        
        $('#voteStart').click(function(){
            console.log("######## VoteStart ########");
            monthEvent.detail.applyBtn(); //투표하기 버튼 눌렀을 때 응모하기로 가기
        });
        
        //최초, 재접속 시 랭킹 정보 받아오도록 설정
        monthEvent.detail.voteRank();
        
        //동영상 재생
//        $('.mov_area').on('click', function(){
//            $(this).addClass('on');
//            $(".oy_mov iframe")[0].src += "?autoplay=1&amp;rel=0&amp;controls=0";
//        });
        
        // Youtube 
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        
        var player;
        $(".mov_area").click(function(){
            $(this).addClass('on');
            if($("#player").is("div")){
                player = new YT.Player('player', {
                    playerVars: { 'controls': 0,'autohide':1},
                    videoId: $("input[id='youtubeId']:hidden").val(), //J5fTwou3Y4c
                    events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                    }   
                }); 
            }else {
                player.autohide=1;
                player.playVideo();
            }
            // when video ends
            function onPlayerReady(event) {
                event.target.playVideo();
            }
            
            function onPlayerStateChange(event) {
                if(event.data === 0) {
                    $("#player").remove(); 
                    $("#playerContainer").append('<div id="player" width="100%" height="100%" >&nbsp;</div>');
                    location.reload();
                }
            }
        });
    },
    
    
    /** 1. 투표하기 버튼 누를 때. */
    applyBtn : function(){
        
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
                
                var selectVoteNum = $("input[name='voteName']:checked").val();
                
                //1. 선택한 상품 정보 없는 경우
                if(null == selectVoteNum || "" == selectVoteNum){
                    alert("최애 브랜드 선택 후 투표해주세요.");
                    return;
                }
                //1. 선택한 상품 저장
                monthEvent.detail.selectVoteNum =$("input[name='voteName']:checked").val();
                
                //2. 1일 1회 참여 여부 확인 - 기획서에 앱 푸시가 없어서 바로 넘어감!!
                monthEvent.detail.getFirstChk();

                //2. 앱 푸시 체크로 넘어감
//                monthEvent.detail.appPushJsonApplyChk();
            }
        }
    },
    
    
    /** 2. 참여여부 확인 1일 1회 참여 가능 체크 */
    getFirstChk : function(){
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
                var inFvrSeqArr = ["1","2","3","4","5","6","7","8","9","10","11","12"];
                var param = {
                        evtNo : $("input[id='evtNo']:hidden").val()
                        , inFvrSeqArr : inFvrSeqArr.toString()
                }
                common.Ajax.sendRequest(
                        "GET"
                      , _baseUrl + "event/20190118_3/setConfirmJson.do"
                      , param
                      , monthEvent.detail._callback_getFirstChkJson
                );
            }
        }
    },
    _callback_getFirstChkJson : function(json){
        
        //variable 
        var result = json.ret; // 응답 성공유무
        var totalCount = parseInt(json.myTotalCnt); // 위수탁 - 이벤트참여여부 확인 

        if(result == 0){
            if(totalCount == 0){
//                $(':radio[name="argee1"]:input[value="Y"]').attr("checked", true);
//                $(':radio[name="argee2"]:input[value="Y"]').attr("checked", true);
                
                //위수탁처리
                $("div#Confirmlayer").attr("onClick", "javascript:monthEvent.detail.popLayerConfirm()");
                mevent.detail.eventShowLayer('eventLayerPolice'); //위수탁 팝업 호출

                //바로 기능으로 넘어감.
//                monthEvent.detail.instantWin(); // 원하는 기능으로 입력해야함
                
                
            }else{
                
                //1. 기 참여자 중복 클릭시 이미 투표하셨습니다.
                alert("이미 투표하셨습니다!");
                //위수탁 기능이 없어서 바로 기능으로 넘어가긴 하나 요청 할 수 있으므로 남겨둠
//                monthEvent.detail.instantWin(); // 원하는 기능으로 입력해야함 : 즉석당첨
                
                //위수탁처리
//                $("div#Confirmlayer").attr("onClick", "javascript:monthEvent.detail.popLayerConfirm()");
//                mevent.detail.eventShowLayer('eventLayerPolice'); //위수탁 팝업 호출
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
                monthEvent.detail.instantWin();
                
            }
        }
    },
    
    
    /** 응모 step2 : 응모하기 */
    instantWin : function(){
        
        //클릭한 ITEM 셋팅
        var selectVoteNum = monthEvent.detail.selectVoteNum;
        
        var mbrInfoUseAgrYn =  $(':radio[name="argee1"]:checked').val();
        var mbrInfoThprSupAgrYn =  $(':radio[name="argee2"]:checked').val();
        
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 참여 가능합니다.")){
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
            
            var inFvrSeqArr = ["1","2","3","4","5","6","7","8","9","10","11","12"];
            
            var param = {
                        evtNo : $("input[id='evtNo']:hidden").val()
                      , mbrInfoUseAgrYn : mbrInfoUseAgrYn
                      , mbrInfoThprSupAgrYn :mbrInfoThprSupAgrYn
                      , inFvrSeqArr : inFvrSeqArr.toString()
                      , selectVoteNum : selectVoteNum
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20190118_3/eventApplyJson.do"
                  , param
                  , monthEvent.detail._callback_setApplyJson
            );
        }
    },
    /** 응모 step3. 응모결과 보여주기 */
    _callback_setApplyJson : function(json){
        if(json.ret == "0"){
            
            alert("감사합니다!");
//            mevent.detail.eventShowLayer('evtCm');
            
            // 라디오 버튼 체크 초기화
//            $(':radio[name="ChckName"]:checked').attr("checked", false);
            
        }else{
            alert(json.message);
        }
    },
    
    /** 투표한 브랜드 순위처리     */
    voteRank : function(){
//        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
//            if(confirm("모바일 앱에서만 참여 가능합니다.")){
//                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
//            }else{
//                return;
//            }
//        }else{
//            if(!mevent.detail.checkLogin()){
//                return;
//            }else{
                var param = {
                        evtNo : $("input[id='evtNo']:hidden").val()
                }
                common.Ajax.sendRequest(
                        "GET"
                      , _baseUrl + "event/20190118_3/voteRankJson.do"
                      , param
                      , monthEvent.detail._callback_voteRankJson
                );
//            }
//        }
    },
    
    /** 투표 순위 보여주기 */
    _callback_voteRankJson : function(json){
        
        if(json.ret == "0"){
            // 투표 화면 뿌려주기
//            var rankList = "${voteResult}";
            var rankList = json.voteResult;
            var voteTotalCnt = json.totalVoteCnt;
            
            // 총 투표 인원 수 노출
            $('.total_num').text("총 참여자 : "+voteTotalCnt+"명");
            
            // 순위 보여주기전 class 클리어
            $('.vote_rank_wrap').children().remove();
            
            $.each(rankList, function(key, value){
//                alert('key : '+key + ' /' + 'value : '+value.VOTERANK);
                
                var brandImg=""; //주소초기화
                brandImg="'display/getBrandShopDetail.do?onlBrndCd="+$("input[id='brandUrl"+value.FVRSEQ+"']:hidden").val()+"'";
                
                var html ="";
                if("0" == key){
                    
                    html = '<div class="listbox">' ;
                    html += '<div class="conbox fl_left">' ;
                    html += '<a class="thumb" href="javascript:common.link.commonMoveUrl('+brandImg+')">' ;
                    html += '<img src="//qa.oliveyoung.co.kr/uploads/contents/201901/18oyawards/mc_vote_list0'+value.FVRSEQ+'.jpg" alt="브랜드 로고"/>' ;
                    html += '</a>' ;
                    html += '</div>' ;
                    html += '<div class="conbox fl_right">' ; 
                    html += '<div class="ranking"><span class="c4">'+value.VOTERANK+'위</span>('+value.VOTECNT+'명)</div>' ;
                    html += '<div class="progress ranktop">' ;
                    html += '<span style="width:'+value.PERCENT+'%;">'+value.PERCENT+'%</span>' ; 
                    html += '</div>' ;
                    html += '</div>' ;
                    html += '</div>' ;
                    
                }else{
                    
                    html = '<div class="listbox">' ;
                    html += '<div class="conbox fl_left">' ;
                    html += '<a class="thumb" href="javascript:common.link.commonMoveUrl('+brandImg+')">' ;
                    html += '<img src="//qa.oliveyoung.co.kr/uploads/contents/201901/18oyawards/mc_vote_list0'+value.FVRSEQ+'.jpg" alt="브랜드 로고"/>' ;
                    html += '</a>' ;
                    html += '</div>' ;
                    html += '<div class="conbox fl_right">' ; 
                    html += '<div class="ranking"><span>'+value.VOTERANK+'위</span>('+value.VOTECNT+'명)</div>' ;
                    html += '<div class="progress">' ;
                    html += '<span style="width:'+value.PERCENT+'%;">'+value.PERCENT+'%</span>' ; 
                    html += '</div>' ;
                    html += '</div>' ;
                    html += '</div>' ;
                    
                }
                $('.vote_rank_wrap').append(html);
            });
            
        }else{
            alert(json.message);
        }
    },
};

$(window).on('load', function(){
    
    //scroll class 변경
    if($("#eventTabFixed2").length == 1) {
        var tabH = $(".scrollTab .imgBox img").height();
        $("#eventTabFixed2").css("height",tabH + "px");

        var tabHeight =$("#eventTabImg").height() + 203;
        var eTab01 = tabHeight + $("#evtConT01").height(); //- 5;
        var eTab02 = eTab01 + $("#evtConT02").height(); //- 5;
        var eTab03 = eTab02 + $("#evtConT03").height(); //- 5;
        var eTab04 = eTab03 + $("#evtConT04").height();

        var scrollTab  = $(document).scrollTop();

        if (scrollTab > tabHeight) {
            $("#eventTabFixed2")
            .css("position","fixed")
            .css("top","0px");
        }
        if (scrollTab < eTab01) {
            $("#eventTabFixed2").attr('class','tab03');
        }
        
        $(window).scroll(function(){
            var scrollTab  = $(document).scrollTop();
            if (scrollTab < eTab01) {
                $("#eventTabFixed2").attr('class','tab02');
            }
            //console.log('eTab03 :' + eTab03);
            //console.log(scrollTab);

            if (scrollTab > tabHeight) {
                $("#eventTabFixed2")
                .css("position","fixed")
                .css("top","0px");
            } else {
                $("#eventTabFixed2")
                .css("position","absolute")
                .css("top","");
            }
            
            if (scrollTab < eTab01) {
                $("#eventTabFixed2").attr('class','tab03');
            } else if (scrollTab < eTab02) {
                $("#eventTabFixed2").attr('class','tab02');
            } else if (scrollTab < eTab03) {
                $("#eventTabFixed2").attr('class','tab03');
            } else if (scrollTab > eTab04) {
                $("#eventTabFixed2").attr('class','tab04');
            }
        });
    }
    
});
