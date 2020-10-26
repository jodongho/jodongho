$.namespace("mmypage.viplounge");
mmypage.viplounge = {

    init : function(){

        $('.vip_evt_list >li').click(function(){
            common.wlog("vip_event_"+$(this).find("input[name=evtloopCnt]").val() );
            var urlInfo = $(this).find("input[name=urlInfo]").val();
            if(!common.isEmpty(urlInfo)){
                common.link.commonMoveUrl(urlInfo);
            }else{
                var evtNo = $(this).find("input[name*='evtNo']").val();
                common.link.moveEventDetailPage(evtNo);
            }
        });
        
        $(".banner_cont").click(function(){
            //common.link.commonMoveUrl("main/getCouponList.do?tabIdx=1&couponMode=membership");
            common.link.commonMoveUrl("main/getMembership.do");
            common.wlog("vip_morebenefit");
        });
        
        $("#myMembershipInfo").click(function(){
            common.link.commonMoveUrl("customer/getMembershipInfo.do");
            common.wlog("vip_getmybenefit");
         });
        
        $("#winnerMoreBtn").click(function(){
            common.link.commonMoveUrl("counsel/getNoticeList.do?ntcClssCd=03");
            common.wlog("vip_winner");
         });
        
        
    },



};



