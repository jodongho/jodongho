$.namespace("commerce.mobile.sample.Index");
commerce.mobile.sample.Index = {
	gotoNormalPage : function(){
		var requestURL = _baseUrl + "sample/getDual.do";
		var parameter = "customerId=1&login_id=admin&name=이름&password=1234&zipCode=135281&addr1=seoul&addr2=korea&nickname=aaa&nickname=bbb";
		
		location.href = requestURL + "?" + parameter;
	},
	
	invalidDataErrorOccurred : function(){
		var requestURL = _baseUrl + "sample/getDual.do";
		var parameter = "customerId=abcd&name=1234";
		
		location.href = requestURL + "?" + parameter;
	},
	
	showLoginNeedPage : function(){
		location.href = _baseUrl + "sample/needLogin.do";
	},
	
	_gf_netfunnel : function(){
	    NetFunnel_Action( {action_id : "act_1"}, function(ev, ret){
	        var msg = {
	                code         : ret.code,
	                key    : ret.data.key,
	                ip   : ret.data.ip,
	                port : ret.data.port,
	                nnext        : ret.data.nnext,
	                nwait   : ret.data.nwait,
	                ttl   : ret.data.tps,
	                tps  : ret.data.ttl
                }
	      
	        //console.log("ret: " + JSON.stringify(msg, null, 3));
    	    
	        $("#netFunnelresult").html("<p>" + JSON.stringify(msg, null, 3) + "</p>"); 
	        
    	    $.ajax({
    	        type: "POST",
    	        url: _secureUrl + "login/loginCheckJson.do",
    	        success: function(data) {
    	            
    	            //NetFunnel_Complete();    
    	            
    	        	console.log(JSON.stringify(data));
    	        	
    	        	if(!data.result){
    	        		//$(location).attr('href', _secureUrl + 'main/getSaleList.do?' + 'AAA');
    	        		$("#result").html("<p> next page </p>");
    	        	}
    	            
    	        },
    	        error : function(e) {
    	            
    	            NetFunnel_Complete();    
    	            
                    console.log("error: " + JSON.stringify(e));
                }
    	    });
	    });
	}
};