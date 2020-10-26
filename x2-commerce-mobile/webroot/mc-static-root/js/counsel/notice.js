_ajax = common.Ajax;

$.namespace("mcounsel.noticeList");
mcounsel.noticeList = {
        init : function(){
            ScrollPager.init({bottomScroll : 700, callback : mcounsel.noticeList.getNoticeListJSON});
            
            $('#ntcClssCd').change(function(){
                $(location).attr('href', _baseUrl + "counsel/getNoticeList.do?ntcClssCd=" + $("#ntcClssCd option:selected").val());
            });
            
            $('#go-back').click(function(){
               history.back(); 
            });

            //웹로그 바인딩
            setTimeout(function(){
                mcounsel.noticeList.bindWebLog();
            }, 700);
        },
        
        getNoticeListJSON : function(){
            var ntcClssCd = $('#ntcClssCd option').is(':selected') ? $("#ntcClssCd option:selected").val() : ''; 
            
            _ajax.sendJSONRequest("GET"
                    , _baseUrl + "counsel/getNoticeListJSON.do"
                    , {
                       pageIdx   : ScrollPager.nextPageIndex()
                      ,ntcClssCd : ntcClssCd
                      }
                    , mcounsel.noticeList.getNoticeListJSONCallback
                );  
        },
        
        getNoticeListJSONCallback : function(res){
            var data = (typeof res !== 'object') ? $.parseJSON(res) : res;
            
            if(data.length < 1){
                ScrollPager.unbindEvent();
                return;
            }
               
            for(var i in data){
                if( typeof data[i] !== 'object' ) continue;
                
                mcounsel.noticeList.appendNewRow(data[i]);
            };
        },
        
        appendNewRow : function(data){
            
            data['iconType'] = Number(data.ntcClssCd);
            
            var strTmpl  = "<li><a href=\"javascript:mcounsel.noticeList.goDetail('\${ntcSeq}');\" title=\"공지상세 바로가기\">";
            strTmpl += "<span class=\"iconType iconType\${iconType}\">\${ntcClssCdNm}</span>";
             if( !common.isEmpty(data.strNm) ) strTmpl += "<span class=\"tx_store\">\${strNm}</span>";
             if( data.ntcClssCd == '01' || data.ntcClssCd == '02' ) strTmpl += "<span>\${sysRegDate}</span>";
             if( data.ntcClssCd == '03' || data.ntcClssCd == '04' ) strTmpl += "<span>\${ntcStrtDtimeTxt}</span>";
            strTmpl += "<strong>\${ntcTitNm}</strong></a></li>";
        
            $.template("add-notice-list-tmpl", strTmpl);
            $.tmpl( "add-notice-list-tmpl", data ).appendTo( "#notice-list" );
            

        },
        
        goDetail : function(noticeSeq){
            if(NTC_CLSS_CD){
                $(location).attr('href', _baseUrl + 'counsel/getNoticeDetail.do?ntcSeq=' + noticeSeq + '&ntcClssCd=' + NTC_CLSS_CD);
            }else{
                $(location).attr('href', _baseUrl + 'counsel/getNoticeDetail.do?ntcSeq=' + noticeSeq);
            }
        },
        
        bindWebLog : function() {
            //공지사항 옵션
            $("#ntcClssCd").change(function(){
                if($("#ntcClssCd").val() == '01'){
                    //일반
                    common.wlog("customer_notice_normal");
                    
                }else if($("#ntcClssCd").val() == '02'){
                    //매장
                    common.wlog("customer_notice_store");
                    
                }else if($("#ntcClssCd").val() == '03'){
                    //이벤트
                    common.wlog("customer_notice_event");
                    
                }else if($("#ntcClssCd").val() == '04'){
                    //뷰티테스터
                    common.wlog("customer_notice_beautytest");
                    
                }else{
                    //전체
                    common.wlog("customer_notice_all");
                }
            });
        }
};

$.namespace("mcounsel.noticeDetail");
mcounsel.noticeDetail = {
        clickCnt : 0,
        
        init : function(){
            $('#go-list').click(function(){
                mcounsel.noticeDetail.goList();
            });
            
            $('#go-back').click(function(){
                history.back(); 
            });
            
            $("#storeBtn").click(function(){
                if($("input[id='visitYn']:hidden").val() == "Y"){
                    mcounsel.noticeDetail.clickCnt ++;
                    if(mcounsel.noticeDetail.clickCnt == 2){
                        
                        if(common.isLogin() == false){
                            mcounsel.noticeDetail.clickCnt = 0;
                            mcounsel.noticeDetail.popLayerOpenNotice("noLoginConfirm");
                        }else{
                            mcounsel.noticeDetail.clickCnt = 0;
                            mcounsel.noticeDetail.popLayerOpenNotice("storeConfirm");
                        }
                        
                    }
                }
            });
            
        },
        
        goList : function(){
            if(NTC_CLSS_CD){
                $(location).attr('href', _baseUrl + 'counsel/getNoticeList.do?ntcClssCd=' + NTC_CLSS_CD);
            }else{
                $(location).attr('href', _baseUrl + 'counsel/getNoticeList.do');
            }
            
        },
        
        getFirstChk : function() {
            var param = {
                    ntcSeq : $("input[id='ntcSeq']:hidden").val()
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "counsel/getFirstChkJson.do"
                  , param
                  , mcounsel.noticeDetail._callback_getFirstChkJson
            );
        },
        _callback_getFirstChkJson : function(json) {
            if(json.ret == "0"){        //최초 저장 시
                mcounsel.noticeDetail.regPrNtcStrHist();
            }else{
                mcounsel.noticeDetail.popLayerOpenNotice("storeConfirmNo");                
            }  
        },
        
        regPrNtcStrHist : function(){
            var param = {
                    ntcSeq : $("input[id='ntcSeq']:hidden").val()
                    , strNo : $("input[id='strNo']:hidden").val()
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "counsel/regPrNtcStrHistJson.do"
                  , param
                  , mcounsel.noticeDetail._callback_regPrNtcStrHistJson
            );
        },
        _callback_regPrNtcStrHistJson : function(json) {
            mcounsel.noticeDetail.popLayerCloseNotice();
        },
        
        movePage : function(){
            mcounsel.noticeDetail.popLayerCloseNotice();
            common.link.moveLoginPage();
        },
        
        popLayerOpenNotice : function(popLayerId){
            var popLayer = $("#"+popLayerId);
            var popPos = $(popLayer).height()/2;
            var popWid = $(popLayer).width()/2;
            $(popLayer).show().css({'left':'50%' , 'margin-left':-(popWid) , 'top':'50%' , 'margin-top':-(popPos)}).show().parents('body').css({'overflow' : 'hidden'});
            $(".dim").show();
        },
        
        popLayerCloseNotice : function(){
            var popLayer = $(".popLayerWrap");
            $(popLayer).hide().parents('body').css({'overflow-y' : 'auto'});
            $(".dim").hide();
        },
};