/**
 * FAQ 리스트
 */
$.namespace("mmypage.pnt.list");
mmypage.pnt.list = {
    _ajax : common.Ajax,
    
    init : function(option){
        mmypage.pnt.list.eventSet();
        mmypage.pnt.list.setPagingCaller();
    },
    eventSet : function(){
        $("#searchMon").off("change");
        $("#schMonExtinPlanPnt").off("click");
        
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
            mmypage.pnt.list.getPntListAjax(param);
        });
        $('#schMonExtinPlanPnt').on('click', function(e){
            e.preventDefault();
            
            if (!common.loginChk()) {
                return ;
            }
            
            mmypage.pnt.list.getMonExtinPlanListAjax();
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
                    searchMon : $("#searchMon").val(),
                    appendTo : true
                }
                mmypage.pnt.list.getPntListAjax(param);
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
    getPntListAjax : function (param) {
        this._ajax.sendRequest("GET"
            , _baseUrl + "mypage/getCJOnePointInfoJson.do"
            , param
            , (!param.appendTo ? mmypage.pnt.list.getPntListCallback : mmypage.pnt.list.getPntListNextCallback)
        );
    },
    /**
     * 목록 조회 append Ajax 요청 결과에 대한 callback 처리 함수
     */
    getPntListCallback : function (res) {
        if (res.length < 1) {
            var nodataTag = "<tr>";
            nodataTag    += "   <td colspan='2' class='no_data'>";
            nodataTag    += "       <div class='sch_no_data2 pdzero'>";
            nodataTag    += "           <p>적립/사용한 내역이 없습니다.</p>";
            nodataTag    += "       </div>";
            nodataTag    += "   </td>";
            nodataTag    += "</tr>";
            
            $("tbl_point_data thead").hide();
            $("#pntList").empty().append(nodataTag);
            //응답 결과가 없을 경우 마지막 목록임- 스크롤 이벤트 제거
            PagingCaller.destroy();
            return;
        }
        // 최초 진입시 목록 영역
        $("tbl_point_data thead").show();
        // 템플릿 데이타 세팅
        $("#pntList").empty();
        $("#pagingTemplate").tmpl(res).appendTo("#pntList");
        
        mmypage.pnt.list.init();
    },
    /**
     * 목록 조회 appendTo Ajax 요청 결과에 대한 callback 처리 함수
     */
    getPntListNextCallback : function (res) {
        if (res.length < 1) {
            //응답 결과가 없을 경우 마지막 목록임- 스크롤 이벤트 제거
            PagingCaller.destroy();
            return;
        }
        // 템플릿 데이타 세팅
        $("#pagingTemplate").tmpl(res).appendTo("#pntList");
        
        mmypage.pnt.list.eventSet();
    },
    /**
     * 목록 텍스트 생성
     */
    setListTit : function(pntPayUseSctCd, rsusSctCd, pntConfSctCd, tradeCausCd){
        if('6100|6200'.indexOf(pntPayUseSctCd) > -1){
            if(rsusSctCd == '10' && pntConfSctCd == '10' ){
                return "주문 적립";
            }else if(rsusSctCd == '10' && pntConfSctCd == '20'){
                return "주문 취소/반품으로 인한 적립 취소";
            }else if(rsusSctCd == '20' && pntConfSctCd == '10'){
                return "주문 시 사용";
            }else if(rsusSctCd == '20' && pntConfSctCd == '20'){
                return "주문 취소/반품으로 인한 사용 취소";
            }else{
                return "";
            }
        }
        // 주문 취소
        else if(pntPayUseSctCd == '6210'){
            if(rsusSctCd == '10' && pntConfSctCd == '20' ){
                return "주문 취소/반품으로 인한 적립 취소";
            }else if(rsusSctCd == '20' && pntConfSctCd == '20'){
                return "주문 취소/반품으로 인한 사용 취소";
            }else{
                return "";
            }
        }
        // 이벤트
        else if('6340|6350|6360|6500'.indexOf(pntPayUseSctCd) > -1){
            if(rsusSctCd == '10' && pntConfSctCd == '10'){
                return "이벤트 적립";
            }else{
                return "";
            }
        }
        // 상풍평
        else if('6300|6310|6320|6330'.indexOf(pntPayUseSctCd) > -1){
            if(rsusSctCd == '10' && pntConfSctCd == '10'){
                return "상품평 보상 적립";
            }else{
                return "";
            }  
        }
        // CS보상
        else if('6600'.indexOf(pntPayUseSctCd) > -1){
            if(rsusSctCd == '10' && pntConfSctCd == '10'){
                if(tradeCausCd == '20') {
                    return "이벤트 적립";
                } else {
                    return "CS 보상 적립";
                }
            }else{
                return "";
            }         
        }else{
            return "";
        }
    },
    /**
     * 목록 부과 정보 텍스트 생성
     */
    setListType : function(pntPayUseSctCd, pntSbj, tradeCausCd, pntProcDesc){
        
        if(pntSbj !== null){
            if('6100|6200'.indexOf(pntPayUseSctCd) > -1){
                return "주문번호 : "+pntSbj;
            }
            // 주문 취소
            else if(pntPayUseSctCd == '6210'){
                return "주문번호 : "+pntSbj;
            }
            // 이벤트
            else if('6340|6350|6360|6500'.indexOf(pntPayUseSctCd) > -1){
                return pntSbj;
            }
            // 상풍평
            else if('6300|6310|6320|6330'.indexOf(pntPayUseSctCd) > -1){
                return pntSbj;         
            }
            else{
                return "";
            }
        } else if(pntProcDesc !== null){
            // CS보상
            if('6600'.indexOf(pntPayUseSctCd) > -1){
                if(tradeCausCd == '20') {
                    return pntProcDesc;
                } else {
                    return "";
                }
            }
        }else{
            return "";
        }
    },
    /**
     * 목록 클래스명 설정
     */
    setTrClassNm : function (pntPayUseSctCd, rsusSctCd, pntConfSctCd){
        var pClassNm = "plus";
        var mClassNm = "minus";
        var pArith = "+";
        var mArith = "-";
        
        if('6100|6200'.indexOf(pntPayUseSctCd) > -1){
            if(rsusSctCd == '20' && pntConfSctCd == '10'){
                return mClassNm;
            }
        }
        // 주문 취소
        else if(pntPayUseSctCd == '6210'){
            if(rsusSctCd == '10' && pntConfSctCd == '20' ){
                return mClassNm;
            }
        }else{
            return "";
        }
        return pClassNm;
    },
    /**
     * 목록 포인트 기호 설정
     */
    setArith : function (pntPayUseSctCd, rsusSctCd, pntConfSctCd){
        var pArith = "+";
        var mArith = "-";
        
        if('6100|6200'.indexOf(pntPayUseSctCd) > -1){
            if(rsusSctCd == '20' && pntConfSctCd == '10'){
                return mArith;
            }
        }
        // 주문 취소
        if(pntPayUseSctCd == '6210'){
            if(rsusSctCd == '10' && pntConfSctCd == '20' ){
                return mArith;
            }
        }
        return pArith;
    },
    /**
     * 당월소멸예정포인트 조회 Ajax 요청 함수
     */
    getMonExtinPlanListAjax : function (param) {
        this._ajax.sendRequest("GET"
            , _baseUrl + "mypage/getCjOneMonExtinPlanPntInfoJson.do"
            , param
            , mmypage.pnt.list.getMonExtinPlanListCallback
        );
    },
    /**
     * 당월소멸예정포인트 조회 Ajax 요청 콜백
     */
    getMonExtinPlanListCallback : function(res){
        if(typeof res != 'undefined'){
            var monExtinPntHtml = '당월 소멸 예정 <strong>'+res.numberFormat()+'P</strong>'; 
            $(".delete").html(monExtinPntHtml);
        }
    }
    
};