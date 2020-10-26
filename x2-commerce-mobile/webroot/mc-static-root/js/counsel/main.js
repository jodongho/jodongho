$.namespace("mcounsel.main");
mcounsel.main = {
    init : function(){
        $('#go-back').click(function(){
            history.back(); 
        });
        
        $('#faq-more').click(function(){
            mcounsel.main.goFaq();
        });
        
        $('#notice-more').click(function(){
            mcounsel.main.goNoticeList();
        });
        // 검색
        $('#btnSch').on("click", function(e){
            e.preventDefault();
            $("[name='tagYn']").val("N");
            mcounsel.main.searchFaq($("[name='inqTitNm']").val());
        });
        //검색어 글자수제한
        $("[name='inqTitNm']").on("keyup change", function(e){
            if($("[name='inqTitNm']").val().length > 10){
                alert('최대 10자까지 입력 가능합니다.');
                $("[name='inqTitNm']").val($("[name='inqTitNm']").val().substr(0,10));

                $("[name='inqTitNm']").focus();
                return false;
            }
            if(e.keyCode == 13){
            	$("[name='tagYn']").val("N");
                mcounsel.main.searchFaq($("[name='inqTitNm']").val());
                e.preventDefault();
            }
        });
        // 검색 입력영역 초기화
        $('#btnSchDel').on("click", function(e){
            e.preventDefault();
            
            $("#inqTitNm").val('');
        });
        
      //웹로그 바인딩
        setTimeout(function(){
            mcounsel.main.bindWebLog();
        }, 700);
    },
    
    faqSearch : function(obj, code){
        mcounsel.main.buttonActivator(obj);
        
        mcounsel.main.goFaq(code);
    },
    
    buttonActivator : function(obj){
        var $clicked = $(obj)
           ,$faqs    = $('#faq-codes').find('li');
        
        $faqs.filter(function(){
            return $(this).hasClass('on');
        }).removeAttr().removeClass();
        
        $clicked.parent().addClass('on').attr('title','현재 선택된 메뉴');
    },
    
    goFaq : function(code){
        if(arguments.length > 0){
            $(location).attr('href', _baseUrl + 'counsel/getFaqList.do?faqLrclCd=' + code);
        }else{
            $(location).attr('href', _baseUrl + 'counsel/getFaqList.do');
        }
        
    },
    
    // #[3261373] 온라인몰 FAQ 화면 개선 요청 - form 형식 사용으로 변경
    searchFaq : function(inqTitNm){
    	var sForm = $("#sForm");
    	
        if($("[name='inqTitNm']").val().length == 0){
            alert('검색어를 입력해주세요.');
            $("[name='inqTitNm']").focus();
            return false;
        }
        
        if($("[name='inqTitNm']").val().length > 10){
            alert('최대 10자까지 입력 가능합니다.');
            $("[name='inqTitNm']").focus();
            return false;
        }
        
        sForm.attr('action', _baseUrl + "counsel/searchFaqList.do");
        sForm.attr('method', "POST");
        
        sForm.submit();
    },
    
    goQna : function(){
        $(location).attr('href', _baseUrl + 'counsel/getQnaForm.do');
    },
    
    goNoticeList : function(){
        $(location).attr('href', _baseUrl + 'counsel/getNoticeList.do');
    },
    
    goNoticeDetail : function(noticeSeq){
        $(location).attr('href', _baseUrl + 'counsel/getNoticeDetail.do?ntcSeq=' + noticeSeq);
    },

    bindWebLog : function() {
        //faq 탭
        $("#faq-more").bind('click', function(){
            common.wlog("customer_faq");
        });
        //faq 검색
        $(".sch_field2 .btn_sch").bind('click', function(){
            common.wlog("customer_faq_search");
        });
        //faq 회원/멤버십
        $("#faqMembership").bind('click', function(){
            common.wlog("customer_faq_membership");
        });
        //faq 주문/결제
        $("#faqOrder").bind('click', function(){
            common.wlog("customer_faq_order");
        });
        //faq 배송
        $("#faqDelivery").bind('click', function(){
            common.wlog("customer_faq_delivery");
        });
        //faq 교환/반품/환불
        $("#faqRefund").bind('click', function(){
            common.wlog("customer_faq_refund");
        });
        //faq 이벤트
        $("#faqEvent").bind('click', function(){
            common.wlog("customer_faq_event");
        });
        //faq 기타
        $("#faqEtc").bind('click', function(){
            common.wlog("customer_faq_etc");
        });
        //1대1문의
        $(".customerLink li #1to1 ").bind('click', function(){
            common.wlog("customer_1to1");
        });
        //공지사항 탭
        $("#notice-more").bind('click', function(){
            common.wlog("customer_notice");
        });            
    },
    
    /**
     * 태그 검색 - #[3261373] 온라인몰 FAQ 화면 개선 요청
     */
    searchFaqTagList : function (tag) {
    	$("[name='inqTitNm']").val(tag);
    	$("[name='tagYn']").val("Y");
    	
    	//목록 조회
    	mcounsel.main.searchFaq($("[name='inqTitNm']").val());
    }
};