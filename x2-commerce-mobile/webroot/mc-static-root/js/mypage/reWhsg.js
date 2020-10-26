/**
 * 재입고신청 리스트
 */
$.namespace("mmypage.reWhsg.list");
mmypage.reWhsg.list = {
    _ajax : common.Ajax,
    
    init : function(option){
        
        common.setLazyLoad();
        mmypage.reWhsg.list.eventSet();
        common.wish.init();
    },
    eventSet : function(){
        
        $("#reWhsglist .txtus, .img").on("click", function(e){
            e.preventDefault();
            
            if($(this).parent().parent().find(".allsoldOut").length <= 0){
                if(typeof $(this).parent().parent().data("goodsno") !== "undefined"){
                    common.link.moveGoodsDetail($(this).parent().parent().data("goodsno"));
                }
            }
        });
        // 삭제
        $(".delete").on("click", function(e){
            e.preventDefault();
            
            if (!common.loginChk()) {
                return ;
            }
            
            if(!confirm("삭제하시면 재입고 알림 신청이 취소됩니다. 삭제하시겠습니까?")){
                return false;
            }
            var param = {
                    goodsNo : $(this).parent().data("goodsno"),
                    itemNo : $(this).parent().data("itemno"),
                    offYn : $(this).data("offyn"),
                    strNo : $(this).data("strno")
            }
            mmypage.reWhsg.list.delReWhsgInfoAjax(param);
        });
        // 전체 삭제
        $("#allDel").on("click", function(e){
            e.preventDefault();
            
            if (!common.loginChk()) {
                return ;
            }
            
            if(!confirm("삭제하시면 재입고 알림 신청이 취소됩니다. 삭제하시겠습니까?")){
                return false;
            }
            
            var param = {
                    allFlag : "Y"
            };
            
            mmypage.reWhsg.list.delReWhsgInfoAjax(param);
        });
        
    },
    /**
     * 목록 삭제 함수
     */
    delReWhsgInfoAjax : function (param) {
        
        this._ajax.sendRequest("POST"
            , _baseUrl + "mypage/delReWhsgInfoJson.do"
            , param
            , mmypage.reWhsg.list.delReWhsgInfoAjaxCallback
        );
    },
    /**
     *  목록 삭제 callback 처리 함수
     */
    delReWhsgInfoAjaxCallback : function (res) {
        if(res == '000'){
            document.location.reload();
        }else{
            alert("삭제 중 오류가 발생하였습니다.");
        }
    }
};