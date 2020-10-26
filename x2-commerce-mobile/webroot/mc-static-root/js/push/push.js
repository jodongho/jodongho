$.namespace("mpush.appPushHistList");
mpush.appPushHistList = {
        init : function() { // 로드시
            
            $("#mFooter").css("padding-top", "0px");
            
            $(document).on('click','.mlist-push li',function(){
                var linkUrl = $(this).attr("data-ref-linkUrl");
                var msgId = $(this).attr("data-msg-id");
                
                if(linkUrl == '' || linkUrl == undefined){
                	linkUrl = '/m/main/main.do';
                }
                
                // 읽음 처리 앱 스킴 호출 후 링크 이동
                location.href = "oliveyoungapp://readcheckpushmsg?msgId="+msgId+"&url="+linkUrl;
            });
            
            // 알림함 리스트 앱스킴 호출
            location.href = "oliveyoungapp://getpushmsg?msgGrpCode=-1&pageNum=1&pageSize=50";
            //var pushListJson = '{     "msgs":[      {         "userMsgId":"140",         "msgGrpNm":"테스트 발송 메시지",         "appLink":"/m/counsel/getNoticeDetail.do?ntcSeq=30540",         "iconName":"icon_msg_1",         "msgId":"157",         "pushTitle":"푸시 타이틀",         "pushMsg":"푸시 메시지",         "msgText":"고객님 안녕하세요!",         "map1":"MAP1",         "map2":"MAP2",         "map3":"MAP3",         "msgType":"T",         "readYn":"Y",         "expireDate":"20990718160949",         "regDate":"20190717160949",         "msgGrpCd":"00001"      }   ],   "code":"000",   "maxUserMsgId":142,   "msg":"success"}';
            //setPushMsg(pushListJson);
        },
        
        oldAppInit : function() { // 구버전 앱인 경우
            
            $("#mFooter").css("padding-top", "0px");
            
            
            $(".mlist-push li").bind("click", function() {
                var linkUrl = $(this).attr("data-ref-linkUrl");
                var key = $(this).attr("data-ref-key");
                
                location.href = _baseUrl + "push/redirectLinkUrl.do?l=" + linkUrl + "&k=" + key;
            });
        },
        
};

// 알림함 리스트 받아오기(앱에서 리스트 생성 후 호출)
function setPushMsg(pushListJson){
    var fileUploadUrl = $('#pushFileUploadUrl').val();
    var yesterDay = $('#pushYesterDay').val();
    if(pushListJson != undefined){
        // push 내용중 개행문자 있는 경우 공백으로 치환 필요, 역슬래시도 슬래시도 치환
        pushListJson = pushListJson.replace(/(?:\r\n|\r|\n|\\n)/g, '<br>').replace(/\\/g, '/');
        var parsedPushListInfo = JSON.parse(pushListJson);
        var pushList = parsedPushListInfo.msgs;
        
        if(pushList.length > 0){
            var htmlStr = '<div class="pushWrap"><p class="type1-txt">수신일로부터 <strong>3일 지난 알림</strong>은<br>확인 여부와 상관 없이 자동으로 삭제됩니다.</p>';
            htmlStr += '<ul class="mlist-push">';
            
            for(var i=0, item; item=pushList[i]; i++){
                var classNm = '';
                if(item.regDate >= yesterDay){
                    classNm = 'new ';
                }
                if(item.readYn == 'Y'){
                    classNm += 'past';
                }
                var regDate = '';
                if(item.regDate != undefined){
                    regDate = item.regDate.substring(0,4) + '-' + item.regDate.substring(4,6) + '-' + item.regDate.substring(6,8);
                }
                
                htmlStr += '<li style="cursor:pointer;" class=" '+ classNm +' " data-ref-linkUrl="'+ item.appLink +'" data-msg-id="'+ item.msgId +'">';
                htmlStr += '<span class="alarm"><span><em>신규</em> 알림</span></span>';
                htmlStr += '<div class="textus">';
                htmlStr += '<p>'+ item.pushMsg +'</p>';
                htmlStr += '<span class="day">'+ regDate +'</span>';
                htmlStr += '<span class="image">';
                
                /*if(item.iconName == undefined || item.iconName == ''){
                    htmlStr += '<img src="'+ fileUploadUrl + item.iconName +'" alt="'+ item.pushMsg +'" stle="width:100%;"/>';
                }else{*/
                    htmlStr += '&nbsp;';
                /*}*/
                
                htmlStr += '</span></div></li>';
            }
            
            htmlStr += '</ul></div>';
            
            $('#mContents').html(htmlStr);
        }else{
         // 결과 없는 경우
            $('#mContents').html('<div class="pushWrap"><p class="type1-txt">수신일로부터 <strong>3일 지난 알림</strong>은<br>확인 여부와 상관 없이 자동으로 삭제됩니다.</p><p class="nodate-push">알림 내역이 없습니다.</p></div>');
        }
    }else{
        // 결과 없는 경우
        $('#mContents').html('<div class="pushWrap"><p class="type1-txt">수신일로부터 <strong>3일 지난 알림</strong>은<br>확인 여부와 상관 없이 자동으로 삭제됩니다.</p><p class="nodate-push">알림 내역이 없습니다.</p></div>');
    }
}
