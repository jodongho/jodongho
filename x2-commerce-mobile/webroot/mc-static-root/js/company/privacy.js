    callPrivacyPage96 = function(){
        location.href =  _baseUrl + "company/privacyVer96.do";
    };
    callPrivacyPage95 = function(){
        location.href =  _baseUrl + "company/privacyVer95.do";
    };
	callPrivacyPage94 = function(){
        location.href =  _baseUrl + "company/privacyVer94.do";
    };
    callPrivacyPage93 = function(){
    	location.href =  _baseUrl + "company/privacyVer93.do";
    };
	callPrivacyPage92 = function(){
        location.href =  _baseUrl + "company/privacyVer92.do";
    };
    callPrivacyPage91 = function(){
        location.href =  _baseUrl + "company/privacyVer91.do";
    };
    callPrivacyPage90 = function(){
        location.href =  _baseUrl + "company/privacyVer90.do";
    };
    callPrivacyPage85 = function(){
        location.href =  _baseUrl + "company/privacyVer85.do";
    }; 
    callPrivacyPage84 = function(){
        location.href =  _baseUrl + "company/privacyVer84.do";
    }; 
    callPrivacyPage83 = function(){
        location.href =  _baseUrl + "company/privacyVer83.do";
    };    
    callPrivacyPage82 = function(){
        location.href =  _baseUrl + "company/privacyVer82.do";
    };
    callPrivacyPage81 = function(){
        location.href =  _baseUrl + "company/privacyVer81.do";
    };
    callPrivacyPage80 = function(){
        location.href =  _baseUrl + "company/privacyVer80.do";
    };
    callPrivacyPage79 = function(){
        location.href =  _baseUrl + "company/privacyVer79.do";
    };
    callPrivacyPage78 = function(){
        location.href =  _baseUrl + "company/privacyVer78.do";
    };
    callPrivacyPage77 = function(){
        location.href =  _baseUrl + "company/privacyVer77.do";
    };
    callPrivacyPage76 = function(){
        location.href =  _baseUrl + "company/privacyVer76.do";
    };
    callPrivacyPage75 = function(){
        location.href =  _baseUrl + "company/privacyVer75.do";
    };
    callPrivacyPage74 = function(){
		location.href =  _baseUrl + "company/privacyVer74.do";
	};
	callPrivacyPage73 = function(){
        location.href =  _baseUrl + "company/privacyVer73.do";
    };
    callPrivacyPage72 = function(){
        location.href =  _baseUrl + "company/privacyVer72.do";
    };
    callPrivacyPage71 = function(){
        location.href =  _baseUrl + "company/privacyVer71.do";
    };
    callPrivacyPage7 = function(){
        location.href =  _baseUrl + "company/privacyVer7.do";
    };
    
    popScrollMove = function(obj){
        var _objtop = $('#'+obj).offset().top;
        $('html, body').scrollTop(_objtop);
    }
    
    popLayerOpen = function (){ 
        if($("#LAYERPOP01").find(".popContainer tr.entr01").size() == 0){
            var url = _baseUrl + "company/getEntrListAjax.do";
            var data = {};
            common.Ajax.sendRequest("POST", url, data, _callBackEntrList); 
        }else{
            common.popLayerOpen('LAYERPOP01');
        }

    };
    
    _callBackEntrList = function (data){
        var res = (typeof data !== 'object') ? $.parseJSON(data) : data;
        var listCnt = res.etEntrListCnt;
        var str = "<div class ='partnerList'>"
            + "<table><caption>협력사 목록 표</caption>"
            + "<tbody>";
        
        if(listCnt > 0){
            var listSize = res.etEntrList.length;
            
            for(i = 0; i < listSize; i ++){
               if(i%2 == 0 &&!common.isEmpty(res.etEntrList[i].entrNm)){
                   str += "<tr class='entr01'>"
                            + "<td>"+res.etEntrList[i].entrNm+"</td>";
               }else if(i%2 == 1&&!common.isEmpty(res.etEntrList[i].entrNm)){
                   str += "<td>"+res.etEntrList[i].entrNm+"</td>"
                        + "</tr>";
               } 
            }
        }else{
            str += "<tr class='entr01'><td>-</td><td>-</tr></tr>";
        }
        str += "</tbody></table>";
        $("#LAYERPOP01").find(".popContainer").html(str);
        if(listCnt%2 == 1){
            $("#LAYERPOP01").find(".popContainer").find("tr:last-child").append("<td>-</td>");
        }
        common.popLayerOpen('LAYERPOP01');
        $("#LAYERPOP01-title").text("협력사 리스트");
    };
    
    popLayerClose = function (){
        var popLayer = $("#privacyEntr");
        $(popLayer).hide().parents('body').css({'overflow-y' : 'auto'});
        $('.dim').hide();
    };

    popLayerEtcOpen = function() {
        
        if($("#LAYERPOP01").find(".popContainer tr.entr02").size() == 0){
            var url = _baseUrl + "company/getEntrEtcListAjax.do";
            var data = {};
            common.Ajax.sendRequest("POST", url, data, _callBackEntrEtcList); 
        }else{
            common.popLayerOpen('LAYERPOP01');
        }
    
    };

    _callBackEntrEtcList = function (data) {
        var res = (typeof data !== 'object') ? $.parseJSON(data) : data;
       
        var listCnt = res.etEntrEtcListCnt;
        
        var str = "<div class ='partnerList'>"
            + "<table><caption>그 외 협력사 목록 표</caption>"
            + "<tbody>";
        
        if(listCnt > 0){
            var listSize = res.etEntrEtcList.length;
            
            for(i = 0; i < listSize; i ++){
               if(i%2 == 0 &&!common.isEmpty(res.etEntrEtcList[i].entrNm)){
                   str += "<tr class='entr02'>"
                            + "<td>"+res.etEntrEtcList[i].entrNm+"</td>";
               }else if(i%2 == 1&&!common.isEmpty(res.etEntrEtcList[i].entrNm)){
                   str += "<td>"+res.etEntrEtcList[i].entrNm+"</td>"
                        + "</tr>";
               } 
            }
        }else{
            str += "<tr class='entr02'><td>-</td><td>-</tr></tr>";
        }
        
        str += "</tbody></table>";
        
        $("#LAYERPOP01").find(".popContainer").html(str);
        if(listCnt%2 == 1){
            $("#LAYERPOP01").find(".popContainer").find("tr:last-child").append("<td>-</td>");
        }
        common.popLayerOpen('LAYERPOP01');
        $("#LAYERPOP01-title").text("그 외 협력사 리스트");
    };
    