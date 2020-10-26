$.namespace("mcustomer");

mcustomer = {
	
    smartReciptCancelBack : function(){
        var referer =parent.document.referrer;
        if (common.app.appInfo.isapp) {
            common.app.callClosePage();
        } else {
            if(referer ==""){
                window.location.replace(_baseUrl + "main/main.do");
            }else{
                history.back();
            }
        }
    },
        
    smartReciptCancel : function(){
	    
	}

};
