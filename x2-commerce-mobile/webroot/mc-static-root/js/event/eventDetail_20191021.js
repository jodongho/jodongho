$.namespace("monthEvent.detail");
monthEvent.detail = {
    init : function(){

    },

    downBixbyCouponJson : function(){
        if(!mplanshop.eventDetail.checkLogin()){
            return;
        }

        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
                ,chlNo : $("input[id='chlNo']:hidden").val()
                ,chlDtlNo : $("input[id='chlDtlNo']:hidden").val()
        }
        common.Ajax.sendRequest(
                "GET"
              , _baseUrl + "event/20191021/downBixbyCouponJson.do"
              , param
              , monthEvent.detail._callback_downBixbyCouponJson
        );
    },

    _callback_downBixbyCouponJson : function(json){
        if(json.ret == "0"){

        }else{
            alert(json.message);
        }
        monthEvent.detail.appIng = false;
    }
}
