$.namespace("monthEvent.detail");
monthEvent.detail = {
        
    // 현재 날짜 시간을 자바에서 가져와야함 
    // 8/31~9/2 3일간
    // 9/3~9/6 4일간

    currentDay : null, 
    changeDate1 : "201808310800",
    changeDate2 : "201809022359",
    changeDate3 : "201809030000",
    changeDate4 : "201809062359",
    
    init : function(){
        monthEvent.detail.currentDay = $("input[id='imgUrlConnectDay']:hidden").val();
        
        if ( eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate1) && eval(monthEvent.detail.currentDay) <= eval(monthEvent.detail.changeDate2)  ) {
            $("#usemapDiv01").css("display", "block");
            $("#usemapDiv02").css("display", "none");
        }else if ( eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate3) && eval(monthEvent.detail.currentDay) <= eval(monthEvent.detail.changeDate4)  ) { 
            $("#usemapDiv01").css("display", "none");
            $("#usemapDiv02").css("display", "block");
        }   
            
        if(common.isLogin()){
        };
    }, 
};
