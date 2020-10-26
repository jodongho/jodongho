$.namespace("monthEvent.detail");
monthEvent.detail = {
        
    
    // 현재 날짜 시간을 자바에서 가져와야함 
    //7/2 8:00 ~ 7/9 07:59
    // 1차 증정 소진 완료 시 ~ 7/9 07:59
    //7/9 8:00 ~ 7/15 23:59
    //2차 증정 소진 완료 시 ~ 7/15 07:59

    currentDay : null, 
    changeDate1 : "201808080900", 
    changeDate2 : "201808100859",      
    changeDate3 : "201808100900",  
    changeDate4 : "201808122359",
    
    
    init : function(){

            monthEvent.detail.currentDay = $("input[id='imgUrlConnectDay']:hidden").val();
        
        //1 
            if ( eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate1) && eval(monthEvent.detail.currentDay) <= eval(monthEvent.detail.changeDate2)  ) {
                     
                $("#usemapDiv01").css("display", "none");
                $("#usemapDiv02").css("display", "block");
                $("#usemapDiv03").css("display", "none");
                      
                      
              }else if ( eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate3) && eval(monthEvent.detail.currentDay) <= eval(monthEvent.detail.changeDate4)  ) { 
                     
                  $("#usemapDiv01").css("display", "none");
                  $("#usemapDiv02").css("display", "none");
                  $("#usemapDiv03").css("display", "block");
                      
              }   
            
        if(common.isLogin()){

        };

    }, 
        

    
};



