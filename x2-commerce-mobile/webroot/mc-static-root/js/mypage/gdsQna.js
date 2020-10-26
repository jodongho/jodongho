/**
 * 상품QNA 리스트
 */
$.namespace("mmypage.gdsQna.list");
mmypage.gdsQna.list = {
    _ajax : common.Ajax,
    
    init : function(reSet){
        mmypage.gdsQna.list.eventSet();
        mmypage.gdsQna.list.setPagingCaller();
    },
    eventSet : function(){
        $('.mypage-qna-list .tab').off("click");
        $("#searchMon").off("change");
        $("#modi").off("click");
        $("#del").off("click");
        
        // 검색 리스트 닫기/펼침
        $('.mypage-qna-list .tab').on("click", function(e){
            e.preventDefault();
            
            if($(this).parents('li').hasClass('open')){
                $(this).parents('li').removeClass('open');
            }else{
                $(this).parents('li').addClass('open').siblings().removeClass('open');
            }
        });
        // 상품 상세 이동
        $('.mypage-qna-list .image').on("click", function(e){
            e.preventDefault();
            
            var prgsStatCd = $(this).parents("li").data("prgsStatCd");
            
            if((typeof prgsStatCd != 'undefiend') && prgsStatCd != "20"){
                alert('판매가 종료된 상품입니다.');
                return;
            }
            common.link.moveGoodsDetail($(this).parents("li").data("goodsNo"));
        });
        // 검색 개월 선택
        $("#searchMon").on("change", function(e){
            e.preventDefault();
            
            if (!common.loginChk()) {
                return ;
            }
            
            var param = {
                    pageIdx : 1,
                    searchMonth : $(this).val(),
                    appendTo : false
            }
            //코드 완료 후 스토어 정보 조회
            mmypage.gdsQna.list.getGdsQnaListAjax(param);
        });
        // 수정
        $(".modi").on("click", function(e){
            e.preventDefault();
            
            if (!common.loginChk()) {
                return ;
            }
            
            var gdasSeq = $(this).parents("li").data("gdasSeq");
            
            document.location.href = _baseUrl + "mypage/getGoodsQnaForm.do?gdasSeq="+gdasSeq+"&retUrl="+ encodeURIComponent(location.href);
        });
        // 삭제
        $(".delete").on("click", function(e){
            e.preventDefault();
            
            if (!common.loginChk()) {
                return ;
            }
            
            if(confirm("상품 Q&A를 삭제하시겠습니까?")){
                var param = {
                        gdasSeq : $(this).parents("li").data("gdasSeq")
                }
                
                mmypage.gdsQna.list.delGoodsQnaAjax(param);
            }
        });
    },
    /**
     * 페이징 세팅
     */
    setPagingCaller : function () {

        if (!common.loginChk()) {
            return ;
        }
        
        PagingCaller.curPageIdx = 1;
        PagingCaller.init({
            callback : function(){
                
                var param = {
                    pageIdx : PagingCaller.getNextPageIdx(),
                    searchMonth : $("#searchMon").val(),
                    appendTo : true
                }
                //코드 완료 후 정보 조회
                mmypage.gdsQna.list.getGdsQnaListAjax(param);
            }
            ,startPageIdx : 1
            ,subBottomScroll : 100
            //초기화 시 최초 목록 call 여부
            ,initCall : false
        });
    },
    /**
     * 목록 조회 Ajax 요청 함수
     */
    getGdsQnaListAjax : function (param) {
        this._ajax.sendRequest("GET"
            , _baseUrl + "mypage/getGoodsQnaListJson.do"
            , param
            , (!param.appendTo ? mmypage.gdsQna.list.getGdsQnaListCallback : mmypage.gdsQna.list.getGdsQnaListNextCallback)
        );
    },
    /**
     * 목록 조회 append Ajax 요청 결과에 대한 callback 처리 함수
     */
    getGdsQnaListCallback : function (res) {
        if (res.length < 1) {
            var nodataTag = "<li  class='nodata'>";
            nodataTag    += "   <p>조회하신 기간 내 작성하신 상품 Q&amp;A가 없습니다.</p>";
            nodataTag    += "</li>";
            
            $("#mypageQnaList").empty().append(nodataTag);
            
            //응답 결과가 없을 경우 마지막 목록임- 스크롤 이벤트 제거
            PagingCaller.destroy();
            return;
        }
        // 템플릿 데이타 세팅
        $("#mypageQnaList").empty();
        $("#pagingTemplate").tmpl(res).appendTo("#mypageQnaList");
        // 초기 세팅
        mmypage.gdsQna.list.init(true);
    },
    /**
     * 목록 조회 appendTo Ajax 요청 결과에 대한 callback 처리 함수
     */
    getGdsQnaListNextCallback : function (res) {
        if (res.length < 1) {
            //응답 결과가 없을 경우 마지막 목록임- 스크롤 이벤트 제거
            PagingCaller.destroy();
            return;
        }
        // 템플릿 데이타 세팅
        $("#pagingTemplate").tmpl(res).appendTo("#mypageQnaList");
        // 이벤트 설정
        mmypage.gdsQna.list.eventSet();
    },
    /**
     * 목록 삭제 함수
     */
    delGoodsQnaAjax : function (param) {
        
        this._ajax.sendRequest("POST"
            , _baseUrl + "mypage/delQnaJson.do"
            , param
            , mmypage.gdsQna.list.delQnaAjaxCallback
        );
    },
    /**
     *  목록 삭제 callback 처리 함수
     */
    delQnaAjaxCallback : function (res) {
        if(res = '000'){
            document.location.reload();
        }else{
            alert("상품Q&A 삭제 중 오류가 발생하였습니다.");
        }
    }
    
};

/**
 * 상품QNA 등록 및 수정
 */
$.namespace("mmypage.gdsQna.form");
mmypage.gdsQna.form = {
    _ajax : common.Ajax,
    isProgressive : false,
    
    init : function(option){
        mmypage.gdsQna.form.eventSet();
        
        $("#gdasCont").keyup();
    },
    eventSet : function(){
        $('#reg').off("click");   
        $('#cansel').off("click");  
        
        $("#gdasCont").bind("keyup change", function() {
            if ($(this).val().length > 250) {
                alert("250자 이내로 작성해주세요.")
                $(this).val($(this).val().substring(0, 250));
            }
            $("#curTxtLength").text($(this).val().length);
           
        });
        $("#gdasCont").on("paste", function() {
            setTimeout(function() {
                $("#gdasCont").keyup();
            }, 50);
           
        });
        // 등록
        $('#reg').on("click", function(e){
            e.preventDefault();
            
            if (!common.loginChk()) {
                return;
            }
            
            var gdasCont = $("#gdasCont").val().trim()
            
            if(gdasCont.length == 0){
                alert("내용을 입력해주세요.");
                return false;
            }
            if(gdasCont.length < 5){
                alert("5자 이상 작성해주세요.");
                return false;
            }
            if(gdasCont.length > 250){
                alert("250자 이내로 작성해주세요.");
                return false;
            }
            
            $("#gdasCont").val(gdasCont);
                    
            mmypage.gdsQna.form.regQnaAjax($("#sForm").serialize());
        });
        // 취소
        $('#cancel').on("click", function(e){
            e.preventDefault();
            
            var retUrl = $("#retUrl").val();
            
            if ( retUrl != undefined && retUrl != '' ){
                document.location.href = retUrl;
            }else{
                document.location.href = _baseUrl + "mypage/getGoodsQnaList.do";
            }
        });
    },
    /**
     * 목록 등록 및 수정
     */
    regQnaAjax : function (param) {
        
        if (!mmypage.gdsQna.form.isProgressive) {
            mmypage.gdsQna.form.isProgressive = true;

            this._ajax.sendRequest("POST"
                    , _baseUrl + "mypage/regQnaJson.do"
                    , param
                    , mmypage.gdsQna.form.regQnaCallback
                );
        }
    },
    /**
     *  목록 등록 및 수정 callback
     */
    regQnaCallback : function (res) {
        if(res.resultCd == '000'){
            if ($("#gdasSeq").val().length > 0) {
                alert("정상적으로 수정되었습니다.");
            } else {
                alert("정상적으로 등록되었습니다.");
            }
            
            if($("#retUrl").val().length > 0){
               document.location.href = $("#retUrl").val();
            } else {
                document.location.href = _baseUrl + "mypage/getGoodsQnaList.do";
            }

        } else if(res.resultCd == '510') {
            alert("[" + res.resultMsg + "] (은)는 금칙어로 입력이 제한됩니다.");
            
        }else{
            alert("상품Q&A 등록 중 오류가 발생하였습니다.");
        }
        
        mmypage.gdsQna.form.isProgressive = false;
    },
};
