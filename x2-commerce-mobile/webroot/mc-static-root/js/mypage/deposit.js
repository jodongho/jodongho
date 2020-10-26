/**
 * FAQ 리스트
 */
$.namespace("mmypage.deposit.list");
mmypage.deposit.list = {
    _ajax : common.Ajax,
    
    init : function(option){
        mmypage.deposit.list.eventSet();
        mmypage.deposit.list.setPagingCaller();
    },
    eventSet : function(){
        $("#searchMon").off("change");
        
        // 검색 개월 선택
        $("#searchMon").on("change", function(e){
            e.preventDefault();
            
            if (!common.loginChk()) {
                return ;
            }
            
            var param = {
                    pageIdx : 1,
                    searchMon : $(this).val(),
                    appendTo : false
            }
            //코드 완료 후 스토어 정보 조회
            mmypage.deposit.list.getDepositListAjax(param);
        })
    },
    /**
     * 목록 표기 문구
     */
    getAstRsusCausCdDspTit : function(astRsusCausCd){
        // 목록 표기 문구
        var cdTxtArr = { S1001 : "주문취소/반품으로 인한 적립", S1012 : "적립",    
                         S1003 : "과다입금으로 인한 적립",     U1001 : "주문 시 사용",          
                         U1008 : "예치금 환불",             U1003 : "예치금 환불 취소"
                        };
        
        var cdTxt = eval("cdTxtArr."+astRsusCausCd);
        if(typeof cdTxt !== "undefined"){
            return cdTxt;
        }else{
            return "";
        }
    },
    /**
     * 목록 표기 문구
     */
    getAstRsusCausCdDspType : function(astRsusCausCd, ordNo){
        
        if('S1001|U1001'.indexOf(astRsusCausCd) > -1 && typeof ordNo !== "undefined"){
            return " 주문번호 : "+ordNo;
        }else{
            return "";
        }
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
                    searchMon : $("#searchMon").val(),
                    appendTo : true
                }
                mmypage.deposit.list.getDepositListAjax(param);
            }
            ,startPageIdx : 1
            ,subBottomScroll : 700
            //초기화 시 최초 목록 call 여부
            ,initCall : false
        });
    },
    /**
     * 목록 조회 Ajax 요청 함수
     */
    getDepositListAjax : function (param) {
        this._ajax.sendRequest("GET"
            , _baseUrl + "mypage/getDepositListJson.do"
            , param
            , (!param.appendTo ? mmypage.deposit.list.getDepositListCallback : mmypage.deposit.list.getDepositListNextCallback)
        );
    },
    /**
     * 목록 조회 append Ajax 요청 결과에 대한 callback 처리 함수
     */
    getDepositListCallback : function (res) {
        if (res.length < 1) {
            var nodataTag = "<tr>";
            nodataTag    += "   <td colspan='2' class='no_data'>";
            nodataTag    += "       <div class='sch_no_data2 pdzero'>";
            nodataTag    += "           <p>적립/사용한 내역이 없습니다.</p>";
            nodataTag    += "       </div>";
            nodataTag    += "   </td>";
            nodataTag    += "</tr>";
            
            $("tbl_point_data thead").hide();
            $("#depositList").empty().append(nodataTag);
            //응답 결과가 없을 경우 마지막 목록임- 스크롤 이벤트 제거
            PagingCaller.destroy();
            return;
        }
        $("tbl_point_data thead").show();
        // 템플릿 데이타 세팅
        $("#depositList").empty();
        $("#pagingTemplate").tmpl(res).appendTo("#depositList");
        // 초기 세팅
        mmypage.deposit.list.init();
    },
    /**
     * 목록 조회 appendTo Ajax 요청 결과에 대한 callback 처리 함수
     */
    getDepositListNextCallback : function (res) {
        if (res.length < 1) {
            //응답 결과가 없을 경우 마지막 목록임- 스크롤 이벤트 제거
            PagingCaller.destroy();
            return;
        }
        // 템플릿 데이타 세팅
        $("#pagingTemplate").tmpl(res).appendTo("#depositList");
        // 초기 세팅
        mmypage.deposit.list.eventSet();
    },
    /**
     * 포인트금액 클래스명 설정
     */
    arithClassNm : function (rsusSctCd){
        var classNm = "plus";
        
        if(rsusSctCd == "20"){
            classNm = "minus";
        }
        return classNm;
    },
    /**
     * 포인트금액 기호 생성
     */
    arithStr : function (rsusSctCd){
        var str = "+";
        
        if(rsusSctCd == "20"){
            str = "-";
        }
        return str;
    }
    
};