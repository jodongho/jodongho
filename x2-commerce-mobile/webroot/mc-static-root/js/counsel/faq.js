/**
 * FAQ 리스트
 */
$.namespace("mcounsel.faq.list");
mcounsel.faq.list = {
    _ajax : common.Ajax,
    
    init : function(option){
        
        // 멀티 셀렉트박스 설정
        mcounsel.faq.list.multiSelectboxAutoSel("전체", "larCd", "midCd");
        mcounsel.faq.list.eventSet();
        mcounsel.faq.list.setPagingCaller();
        // FAQ 도움 여부 조회 - #[3261373] 온라인몰 FAQ 화면 개선 요청
        mcounsel.faq.list.getFaqTagList();
    },
    eventSet : function(){
        
        $(".faq_list .faq_tit > a").off("click");
        $(".sch_link").off("click");
        $("#larCd").off("click");
        $("#qna").off("click");
        
        // 검색 리스트 닫기/펼침
        $('.faq_list .faq_tit > a').click(function(e){
            e.preventDefault();
            
            if($(this).parents('li').hasClass('on')){
                $(this).parents('li').removeClass('on');
            }else{
                $(this).parents('li').addClass('on').siblings().removeClass('on');
            }
        });
        // 검색
        $('#btnSch').on("click", function(e){
            e.preventDefault();
            $("[name='tagYn']").val("N");
            mcounsel.faq.list.searchFaq($("[name='inqTitNm']").val());
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
                mcounsel.faq.list.searchFaq($("[name='inqTitNm']").val());
                e.preventDefault();
            }
        });
        // 검색 입력영역 초기화
        $('#btnSchDel').on("click", function(e){
            e.preventDefault();
            
            $("#inqTitNm").val('');
        });
        // 대카 클릭시 중카선택된 경우 중카 전체선택으로 변경 후 필터
        var larCdClickCnt = 0;
        // 도큐멘트 클릭시 대카영역이 아닌 경우 대카 클릭수 초기화
        $(document).click(function(e){
            // 대카영역이 아닌 경우 대카 클릭수 초기화
            if (!$(e.target).is('#larCd')) {
                larCdClickCnt = 0;
            }

        });
        // 선택된 대카 클릭시 중카선택된 경우 중카 전체선택으로 변경 후 필터
        $('#larCd').click(function(e){
            e.preventDefault();
            
            larCdClickCnt++;
            
            if(larCdClickCnt == 2){
                larCdClickCnt = 0;
                
                if($("#midCd").val() != "전체"){
                    $("#midCd").val("전체");
                    var param = {
                            pageIdx : 1,
                            faqLrclCd : $(this).val(),
                            appendTo : false
                        }
                    //대카 선택 하위 전체 리스트 가져오기
                    mcounsel.faq.list.getFaqListAjax(param);
                }
            }
        });
        // 1:1 문의 이동
        $("#qna").on("click", function(e){
            e.preventDefault();
            
            document.location.href = _baseUrl + "counsel/getQnaForm.do?idx=qnaForm";
        });
        // 히스토리백으로 온 경우 2depth 전체선택으로 갱신
        var hsFaqListYn = sessionStorage.getItem("hsFaqList");
        
        if(hsFaqListYn != null && hsFaqListYn == "Y"){
            sessionStorage.removeItem("hsFaqList");
            $("#larCd").change();
        }
        
        mcounsel.faq.list.getFaqTagList();
    },
    /**
     * 페이징 세팅
     */
    setPagingCaller : function () {
        
        PagingCaller.curPageIdx = 1;
        PagingCaller.init({
            callback : function(){
                
                var param = {
                    pageIdx : PagingCaller.getNextPageIdx(),
                    faqLrclCd : $("#larCd").val(),
                    faqMdclCd : $("#midCd").val() != null ? $("#midCd").val() : null,
                    appendTo : true
                }
                if($("#larCd").val() != "99"){
                    //코드 완료 후 스토어 정보 조회
                    mcounsel.faq.list.getFaqListAjax(param);
                }
            }
            ,startPageIdx : 1
            ,subBottomScroll : 700
            //초기화 시 최초 목록 call 여부
            ,initCall : false
        });
    },
    
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
        
        sessionStorage.setItem("hsFaqList","Y");
        
        sForm.attr('action', _baseUrl + "counsel/searchFaqList.do");
        sForm.attr('method', "POST");
        
        sForm.submit();
    },
    /**
     * 목록 조회 Ajax 요청 함수
     */
    getFaqList : function () {
        e.preventDefalut();
        
        document.location.href = _baseUrl + "counsel/getQnaList.do";
    },
    /**
     * 목록 조회 Ajax 요청 함수
     */
    getFaqListAjax : function (param) {
        this._ajax.sendRequest("POST"
            , _baseUrl + "counsel/getFaqListJson.do"
            , param
            , (!param.appendTo ? mcounsel.faq.list.getFaqListCallback : mcounsel.faq.list.getFaqListNextCallback)
        );
        
        // FAQ 도움 여부 조회
        mcounsel.faq.list.getFaqTagList();
    },

    /**
     * 카타고리 선택 조회 Ajax 요청 결과에 대한 callback 처리 함수
     */
    getFaqListCallback : function (res) {
        if (res.length < 1) {
            var noDataHtml  =  "<li class='nodata'>";
                noDataHtml  += " <p>검색 결과가 없습니다.</p>";
                noDataHtml  += "</li>";
            $("#faq_list").empty().html(noDataHtml);
            //응답 결과가 없을 경우 마지막 목록임- 스크롤 이벤트 제거
            PagingCaller.destroy();
            return;
        }
        $("#faq_list").empty();
        $("#pagingTemplate").tmpl(res).appendTo("#faq_list");
        // 이벤트 재설정
        mcounsel.faq.list.eventSet();
        
    },
    
    getFaqListNextCallback : function (res) {
        if (res.length < 1) {
            //응답 결과가 없을 경우 마지막 목록임- 스크롤 이벤트 제거
            PagingCaller.destroy();
            return;
        }
        // 템플릿 데이타 세팅
        $("#pagingTemplate").tmpl(res).appendTo("#faq_list");
        
        mcounsel.faq.list.eventSet();
    },
    /**
     * 목록 조회 Ajax 요청 함수
     */
    getFaqCateListAjax : function (param) {
        this._ajax.sendRequest("POST"
            , _baseUrl + "counsel/getFaqCateListJson.do"
            , param
            , mcounsel.faq.list.getFaqCateListCallback
        );
        
        // FAQ 도움 여부 조회
        mcounsel.faq.list.getFaqTagList();
    },
    getFaqCateListCallback : function (res) {
        var optionTag = "<option name='전체' value='' >전체</option>";
        
        if($("#larCd").val() != "99"){
            for(i = 0; i < res.length; i++){
                optionTag += "<option name='"+res[i].grpSctCd+"' value='"+res[i].cd+"'>"+res[i].mMrkNm+"</option>/n";
            }
        }
        // 템플릿 데이타 세팅
        $("#midCd").empty().append(optionTag);
    },
    /**
     * 대카 선택시 중카 자동 필터
     */
    multiSelectboxAutoSel : function(fOptNm, s1, s2){
        var dept2 = $("#"+s2),
            pFaqLrclCd = $("#pFaqLrclCd").val(),
            chageTp = "";
        
        // 1depth 선택시 2depth 필터
        $("#"+s1).change(function(){
            // 2depth 카테고리 세팅
            var param = {
                    cd : $(this).val(),
                }
            mcounsel.faq.list.getFaqCateListAjax(param);
            
            if(chageTp != "main"){
                var param = {
                        pageIdx : 1,
                        faqLrclCd : $(this).val(),
                        appendTo : false
                    }
                //대카 선택 하위 전체 리스트 가져오기
                mcounsel.faq.list.getFaqListAjax(param);
                // 페이징 세팅
                mcounsel.faq.list.setPagingCaller();
            }else{
                chageTp = "";
            }
        });
        // 고객센터에서 대카선택하여 넘어 온 경우 
        if(pFaqLrclCd != null && pFaqLrclCd.length > 0){
            $("#"+s1).val(pFaqLrclCd).prop("selected", true);
            chageTp = "main";
            
            var e = jQuery.Event("change");
            jQuery("#"+s1).trigger(e);
        }
        // 중카 선택
        $("#"+s2).change(function(){
            var param = {
                    pageIdx : 1,
                    faqLrclCd : $("#"+s1).val(),
                    faqMdclCd : $(this).children("option:selected").val(),
                    appendTo : false
                }
            //대카 선택 하위 전체 리스트 가져오기
            mcounsel.faq.list.getFaqListAjax(param);
            // 페이징 세팅
            mcounsel.faq.list.setPagingCaller();
        });
        
        mcounsel.faq.list.getFaqTagList();
    },
    /**
     * FAQ 목록 모두 닫기
     */
    reSetFaqList : function(){
        $("#faq_list").find('li').each(function(idx){
            $(this).removeClass('on');
        })
    },
    /**
     * 문의 문구 Q 넘버 생성
     */
    setFaqListQSeqMark : function(idx){
        var qIdx = 1;
        $("#faq_list").find('li').each(function(idx){
            var inq = $(this).find(".faq_tit");
            
            if($(this).css("display") != "none"){
                var fChild = inq.children().eq(0),
                    fChildNm = fChild.attr("name");
                
                if(typeof fChildNm != "undefined" && fChildNm.indexOf('qNo') > -1){
                    fChild.remove();
                }
                inq.prepend("<span name='qNo'>Q"+(qIdx++)+"</span>");
            }
        })
    },
    
    /**
     * 태그 검색 - #[3261373] 온라인몰 FAQ 화면 개선 요청
     */
    searchFaqTagList : function(tag) {
    	$("[name='inqTitNm']").val(tag);
    	$("[name='tagYn']").val("Y");
    	
    	//목록 조회
    	mcounsel.faq.list.searchFaq($("[name='inqTitNm']").val());
    },
    
    /**
     * 쿠키 내 저장 된 도움이 돼요 버튼 활성화 - #[3261373] 온라인몰 FAQ 화면 개선 요청
     */
    getFaqTagList : function(){
    	cookie = new Cookie('local', 1, 'M');
    	
    	if(cookie.get('faqTagList') != undefined && cookie.get('faqTagList') != "" ){
    		var jsonStr = JSON.parse(cookie.get('faqTagList'));
    		
    		for(var i=0; i < jsonStr.length; i++){
    			if(jsonStr[i].faqSeq != null && jsonStr[i].faqSeq != ""){
    				var faqSeqId = "#btn_faq_good_" + jsonStr[i].faqSeq;
    				var typeId = "#faqTagType" + jsonStr[i].faqSeq;
    				
    				$(faqSeqId).attr('title', '현재 활성화').addClass('on');
    				$(typeId).val('delete');
    			}
    		}
    	}
    },
    
    /**
     * 도움이 돼요 쿠키 저장/삭제 및 버튼 활성화/비활성화 - #[3261373] 온라인몰 FAQ 화면 개선 요청
     */
    setFaqTagList : function(faqSeq){
    	var cookie = new Cookie();
    	var oResult = "";
    	var sTagList = cookie.get('faqTagList') || '',
    	oTagList = sTagList == '' ? [] : $.parseJSON(sTagList);
        var typeId = "#faqTagType" + faqSeq;
        var type = $(typeId).val();
        
        if(type == '' || type == null){
        	type = "update";
        }
        
        if(type == 'update'){
            oResult  = [{
                faqSeq  : faqSeq
            }];
        }else{
        	oResult  = [];
        }
        
        if(oTagList instanceof Array){
        	for(var i = 0; i < oTagList.length; i++){
        		var item = oTagList[i];
        		
        		if(item != null) {
        			if (item.faqSeq != faqSeq) {
        				oResult[oResult.length] = item;
            		}
        		}
        	}
        }
        
        cookie.set('faqTagList', JSON.stringify(oResult));
    	
    	$.ajax({
            type: "POST",
            url: _baseUrl + "counsel/setFaqTagList.do",
            data: {type : type, faqSeq : faqSeq},
            dataType : 'text',
            async: false,
            cache: false,
            success: function(data) {
                try {
                } catch (e) {}
            },
            error: function() {
            }
        });
    	
    	var faqSeqId = "#btn_faq_good_" + faqSeq;
    	
    	if(type == 'update'){
    		$(faqSeqId).attr('title', '현재 활성화').addClass('on');
    		$(typeId).val('delete');
    	}else{
    		$(faqSeqId).removeAttr('title').removeClass('on');
    		$(typeId).val('update');
    	}
    }
};
/**
 * FAQ 검색
 */
$.namespace("mcounsel.faq.search");
mcounsel.faq.search = {
    _ajax : common.Ajax,
    
    init : function(option){
        // 리스트 검색어 볼드 처리
        mcounsel.faq.search.setFaqListTxtBold();
        // 검색어입력영역 포커스
        mcounsel.faq.search.setSearchFocus();
        // 이벤트 설정
        mcounsel.faq.search.eventSet();
        // FAQ 도움 여부 조회 - #[3261373] 온라인몰 FAQ 화면 개선 요청
        mcounsel.faq.search.getFaqTagList();
        // 페이징 설정
        if($("#inqTitNm").val() != ''){
            PagingCaller.init({
                callback : function(){
                    
                    var inqTitNm = $("#inqTitNm").val();
                    var tagYn = $("#tagYn").val();
                    
                    var param = {
                        pageIdx : PagingCaller.getNextPageIdx(),
                        inqTitNm : inqTitNm,
                        tagYn : tagYn
                    }
                    //코드 완료 후 스토어 정보 조회
                    mcounsel.faq.search.getFaqListAjax(param);
                }
                ,startPageIdx : 1
                ,subBottomScroll : 700
                //초기화 시 최초 목록 call 여부
                ,initCall : false
            });
        }
        //검색어 글자수제한
        $("[name='inqTitNm']").bind("input", function(){
            if($("[name='inqTitNm']").val().length > 10){
                alert('최대 10자까지 입력 가능합니다.');
                $("[name='inqTitNm']").val($("[name='inqTitNm']").val().substr(0,10));

                $("[name='inqTitNm']").focus();
                return false;
            }
        });
    },
    /**
     * 이벤트 세팅
     */
    eventSet : function(){
        // 이벤트 제거
        $('.faq_list .faq_tit > a').off("click");
        $('#btnSch').off("click");
        $('#btnSchDel').off("click");
        $('#qnaListGo').off("click");
        $('#faqListGo').off("click");
        
        // 검색 목록 닫기/펼칩 
        $('.faq_list .faq_tit > a').on("click", function(e){
            e.preventDefault();
            
            if($(this).parents('li').hasClass('on')){
                $(this).parents('li').removeClass('on');
            }else{
                $(this).parents('li').addClass('on').siblings().removeClass('on');
            }
        });
        // 검색 엔터
        $("input[name=inqTitNm]").on("keydown", function(e){
        	$("[name='tagYn']").val("N");
            if(e.keyCode == 13){
                //목록 조회 Ajax 요청 함수
                if(!mcounsel.faq.search.getFaqList()){
                    e.preventDefault();
                }
            }
        });
        // 검색
        $('#btnSch').on("click", function(e){
            e.preventDefault();
            //목록 조회 Ajax 요청 함수
            mcounsel.faq.search.getFaqList();
        });
        // 검색 입력영역 초기화
        $('#btnSchDel').on("click", function(e){
            e.preventDefault();
            
            $("#inqTitNm").val('');
        });
        // 1:1 문의 이동
        $("#qnaGo").on("click", function(e){
            e.preventDefault();
            
            document.location.href = _baseUrl + "counsel/getQnaForm.do?idx=qnaForm";
        });
        // FAQ 리스트 이동
        $("#faqListGo").on("click", function(e){
            e.preventDefault();
            
            document.location.href = _baseUrl + "counsel/getFaqList.do";
        });
        
        // FAQ 도움 여부 조회
        mcounsel.faq.search.getFaqTagList();
    },
    /**
     * 목록 조회 요청 함수
     * #[3261373] 온라인몰 FAQ 화면 개선 요청 - form 형식 사용으로 변경
     */
    getFaqList : function () {
        var sForm = $("#sForm");
        
        if($("#inqTitNm").val().length == 0){
            alert('검색어를 입력해주세요.');
            return false;
        }
        if($("#inqTitNm").val().length > 10){
            alert('최대 10자까지 입력 가능합니다.');
            return false;
        }
        
        sForm.attr('action', _baseUrl + "counsel/searchFaqList.do");
        sForm.attr('method', "POST");
        
        sForm.submit();
    },
    /**
     * 목록 조회 Ajax 요청 함수
     */
    getFaqListAjax : function (param) {
        this._ajax.sendRequest("POST"
            , _baseUrl + "counsel/searchFaqListJson.do"
            , param
            , mcounsel.faq.search.getFaqListCallback
        );
        
        // FAQ 도움 여부 조회
        mcounsel.faq.search.getFaqTagList();
    },

    /**
     * 목록 조회 Ajax 요청 결과에 대한 callback 처리 함수
     */
    getFaqListCallback : function (res) {
        if (res.length < 1) {
            //응답 결과가 없을 경우 마지막 목록임- 스크롤 이벤트 제거
            PagingCaller.destroy();
            return;
        }
        // 템플릿 데이타 세팅
        $("#pagingTemplate").tmpl(res).appendTo("#faq_list");
        // 목록 검색어 복트 처리
        mcounsel.faq.search.setFaqListTxtBold();
        // 이벤트 세팅
        mcounsel.faq.search.eventSet();
    },
    /**
     * 목록 내 검색 문구 볼트 처리
     */
    setFaqListTxtBold : function() {
        var inqTitNm = $("#inqTitNm").val();
        
        $("#faq_list").find('a, .inner_cont').each(function(){
            var html = $(this).html();
            
            if(html.indexOf("span") < 0){
                var reHtml = html.replace(new RegExp("("+inqTitNm+")","gi"),"<span class='txt_bold'>$1</span>");
                $(this).html(reHtml);
            }
        })
    },
    /**
     * 검색어입력영역 포커스
     */
    setSearchFocus : function() {
        if($("#inqTitNm").val().length <= 0){
            $("#inqTitNm").focus();
        }
    },
    
    /**
     * 태그 검색 - #[3261373] 온라인몰 FAQ 화면 개선 요청
     */
    searchFaqTagList : function(tag) {
    	$("[name='inqTitNm']").val(tag);
    	$("[name='tagYn']").val("Y");
    	
    	//목록 조회
    	mcounsel.faq.search.getFaqList($("[name='inqTitNm']").val());
    },
    
    /**
     * 쿠키 내 저장 된 도움이 돼요 버튼 활성화 - #[3261373] 온라인몰 FAQ 화면 개선 요청
     */
    getFaqTagList : function(){
    	cookie = new Cookie('local', 1, 'M');
    	
    	if(cookie.get('faqTagList') != undefined && cookie.get('faqTagList') != "" ){
    		var jsonStr = JSON.parse(cookie.get('faqTagList'));
    		
    		for(var i=0; i < jsonStr.length; i++){
    			if(jsonStr[i].faqSeq != null && jsonStr[i].faqSeq != ""){
    				var faqSeqId = "#btn_faq_good_" + jsonStr[i].faqSeq;
    				var typeId = "#faqTagType" + jsonStr[i].faqSeq;
    				
    				$(faqSeqId).attr('title', '현재 활성화').addClass('on');
    				$(typeId).val('delete');
    			}
    		}
    	}
    },
    
    /**
     * 도움이 돼요 쿠키 저장/삭제 및 버튼 활성화/비활성화 - #[3261373] 온라인몰 FAQ 화면 개선 요청
     */
    setFaqTagList : function(faqSeq){
    	var cookie = new Cookie();
    	var oResult = "";
    	var sTagList = cookie.get('faqTagList') || '',
    	oTagList = sTagList == '' ? [] : $.parseJSON(sTagList);
        var typeId = "#faqTagType" + faqSeq;
        var type = $(typeId).val();
        
        if(type == '' || type == null){
        	type = "update";
        }
        
        if(type == 'update'){
            oResult  = [{
                faqSeq  : faqSeq
            }];
        }else{
        	oResult  = [];
        }
        
        if(oTagList instanceof Array){
        	for(var i = 0; i < oTagList.length; i++){
        		var item = oTagList[i];
        		
        		if(item != null) {
        			if (item.faqSeq != faqSeq) {
        				oResult[oResult.length] = item;
            		}
        		}
        	}
        }
        
        cookie.set('faqTagList', JSON.stringify(oResult));
    	
    	$.ajax({
            type: "POST",
            url: _baseUrl + "counsel/setFaqTagList.do",
            data: {type : type, faqSeq : faqSeq},
            dataType : 'text',
            async: false,
            cache: false,
            success: function(data) {
                try {
                } catch (e) {}
            },
            error: function() {
            }
        });
    	
    	var faqSeqId = "#btn_faq_good_" + faqSeq;
    	
    	if(type == 'update'){
    		$(faqSeqId).attr('title', '현재 활성화').addClass('on');
    		$(typeId).val('delete');
    	}else{
    		$(faqSeqId).removeAttr('title').removeClass('on');
    		$(typeId).val('update');
    	}
    }
    
};