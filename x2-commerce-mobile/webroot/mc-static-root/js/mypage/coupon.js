/**
 * 쿠폰 리스트
 */
$.namespace("mmypage.coupon.list");
mmypage.coupon.list = {
    _ajax : common.Ajax,
    
    init : function(option){
        if($("#onCpnList .sch_no_data").length == 0){
            mmypage.coupon.list.sortList("#onCpnList");
        }
        
        $('.tabList01 > li').each(function(){
            if(!$(this).hasClass('on')){
                $('.tab_contents:eq('+ $(this).index() +')').addClass('hide');
            }
        });
        
        mmypage.coupon.list.eventSet();
    },
    eventSet : function(){
        // 탭 컨텐츠 show/hide
//        $('#mTab').find('a').on({'click' : function(e){
//                e.preventDefault();
//                $(this).parent().addClass('on').attr('title', '현재 선택된 메뉴').siblings().removeClass('on').removeAttr('title');
//                $('.tab_contents:eq('+ $(this).parent().index() +')').removeClass('hide').siblings('.tab_contents').addClass('hide');
//                
//                if($("#cjOneCpnArea").html().trim() == ""){
//                    mmypage.coupon.list.getCJOneCouponListAjax();
//                }
//            }
//        });
        // 쿠폰존 바로가기
        $(".btnMiddle").on("click", function(e){
            e.preventDefault();
            
            //BI Renewal. 20190918. nobbyjin. - Link 수정
            //location.href = _baseUrl+"main/main.do#10";
            location.href = _baseUrl+"main/getCouponList.do";
        });
        // 쿠폰 등록 레이어 팝업
        $("#getCouponLPop").on("click", function(e){
            common.coupon.getRegCouponForm(true);
            $('.popFullWrap').addClass('outline');//쿠폰 하이라이트 제거
        });
        // 쿠폰 안내 레이어 팝업
        $(".question_mark").on("click", function(e){
            $("#pop-full-contents").html($("#couponDescInfoLPop").html());
            common.popFullOpen("쿠폰 안내");
        });
        // 쿠폰 다운로드 클릭
        $(".btnDown").on("click", function(){

            mmypage.coupon.list.downCouponJson($(this));
        });
        
    },
    getCJOneCouponListAjax : function(){
        this._ajax.sendRequest(
                "GET"
                , _baseUrl + "mypage/getCJOneCouponListAjax.do"
                , {}
                , mmypage.coupon.list.getCJOneCouponListAjaxCallBack
                );
    },
    getCJOneCouponListAjaxCallBack : function(res) {
        if(typeof res != "undefiend"){
            $("#cjOneCpnArea").empty().append(res);
            
            if($("#cjoneCpList .sch_no_data").length == 0){
                mmypage.coupon.list.sortList("#cjoneCpList");
            }
            mmypage.coupon.list.eventSet();
        }
    },
    // 남은 일수 asc sort
    sortList : function(obj){
        var list = $(obj),
            listLi = list.find("li").clone();
        
        listLi.sort(function(a, b){
                return $(a).data("dayCnt") - $(b).data("dayCnt");
            
        });
        list.empty().append(listLi);
    },
    // cjone 쿠폰 다운로드
    downCouponJson : function(obj) {

        var cpnCd = obj.parents("li").data("cpnCd");
        var cpnNo = obj.parents("li").data("cpnNo");
        var expireSDate = obj.parents("li").data("expireSDate");
        var expireEDate = obj.parents("li").data("expireEDate");

        common.showLoadingLayer(false);
        var param = { certCpnNo    : cpnCd
                     ,cjOneCpnNo   : cpnNo
                     ,useStrtDtime : expireSDate
                     ,useEndDtime  : expireEDate
                     }; 
        this._ajax.sendRequest(
                "GET"
                , _baseUrl + "main/downCouponEncJson.do"
                , param
                , this._callback_downCouponJson);

        common.hideLoadingLayer();
    },

    _callback_downCouponJson : function(strData) {

        if(strData.ret == '-1'){
            common.loginChk();
        }else{
            alert(strData.message);
            location.reload();
        }
    }
};