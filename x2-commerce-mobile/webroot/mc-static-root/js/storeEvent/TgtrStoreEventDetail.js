$.namespace("TgtrStoreEventDetail.detail");
TgtrStoreEventDetail.detail = {
	_ajax : common.Ajax,
	offstorePageIdx : 1,
	searchYn : 'N',
	rgn2Etc : 'Y',
	btnYn : "N",
	rgn1 : '',
	rgn2 : '',

      initEvNo : function(){
      	TgtrStoreEventDetail.detail.evtNo = $("#evtNo").val();
      },
      
      init : function(){
    	var searchTgtrStrPageIdx = sessionStorage.getItem("searchTgtrStrPageIdx");
        var searchTgtrStrRgn1 = sessionStorage.getItem("searchTgtrStrRgn1");
        var searchTgtrStrRgn2 = sessionStorage.getItem("searchTgtrStrRgn2");  
    	
        sessionStorage.removeItem("searchTgtrStrPageIdx");
    	sessionStorage.removeItem("searchTgtrStrRgn1");
    	sessionStorage.removeItem("searchTgtrStrRgn2");
    	
      	if(document.location.hash != '#search'){
	        //페이지 초기 세팅.
	   		var $mainAreaList = $("#mainAreaList");
	   		if( common.isEmpty($mainAreaList.attr("data-rgn1")) ){
	   			$mainAreaList.find("option:eq(0)").prop("selected",true);
	   		}
	   		 
	   		var $subAreaList = $("#subAreaList");
	   		if( common.isEmpty($subAreaList.attr("data-rgn2")) ){
	   			$subAreaList.find("option:eq(0)").prop("selected",true);
	   		}
    	}   
      	
      	//매장 상세보기에서 뒤로가기로 넘어온 경우.   
       
        if(searchTgtrStrPageIdx != undefined && searchTgtrStrPageIdx != null && searchTgtrStrPageIdx > 0 
        		&& searchTgtrStrRgn1 != undefined && searchTgtrStrRgn1 != null && searchTgtrStrRgn1 != ''
            	&& searchTgtrStrRgn2 != undefined && searchTgtrStrRgn2 != null && searchTgtrStrRgn2 != ''){
        	TgtrStoreEventDetail.detail.offstorePageIdx = Number(searchTgtrStrPageIdx);
        	
        	//select box 재지정
        	$("#mainAreaList").val(searchTgtrStrRgn1);
        	$("#mainAreaList").attr('data-rgn1',searchTgtrStrRgn1);
        	$("#subAreaList").val(searchTgtrStrRgn2);
        	$("#subAreaList").attr('data-rgn2',searchTgtrStrRgn2);
        	
        	TgtrStoreEventDetail.detail.getSubAreaListList();
        	TgtrStoreEventDetail.detail.getSearchStoreList(searchTgtrStrPageIdx);
        	
        } else {
        	TgtrStoreEventDetail.detail.offstorePageIdx = 1;
        }
		
         $(".prd_view_more").click(function(){
        	 if ( TgtrStoreEventDetail.detail.searchYn == 'N' ){
             	TgtrStoreEventDetail.detail.searchYn = 'Y';
             	TgtrStoreEventDetail.detail.btnYn = 'Y';
                TgtrStoreEventDetail.detail.getSearchStoreList(TgtrStoreEventDetail.detail.offstorePageIdx);
             }else{
                 alert("현재 매장 검색 중입니다. 잠시만 기다려주시기 바랍니다.");
             }
         });
	},
    getSubAreaListList : function(){
    	
    	var rgn1 = $("#mainAreaList option:selected").val();
        if (rgn1 != 'none'){
        	$.ajaxSetup({async: false});
            var sRgn1  =  encodeURIComponent(rgn1);
            this._ajax.sendJSONRequest(
                    "POST"
                    , _baseUrl + "storeEvent/getStoreSubAreaListJson.do"
                    , "rgn1="+ sRgn1
                    , this._callback_getSubAreaListAjax);
        }
    },
    _callback_getSubAreaListAjax : function(retData) {
        $('#subAreaList').attr('disabled', false);
        if(retData == ''){
        	if($("#mainAreaList").val()== "세종특별자치시"){
        		TgtrStoreEventDetail.detail.rgn2Etc = 'N'; //세종특별자치시 -> 하위 시/군/구 없음
        		if ( TgtrStoreEventDetail.detail.searchYn == 'N' ){
        			TgtrStoreEventDetail.detail.searchYn = 'Y';
                	TgtrStoreEventDetail.detail.getSearchStoreList(1);    
                }else{
                    alert("현재 매장 검색 중입니다. 잠시만 기다려주시기 바랍니다.");
                }
        	}
        	$('#subAreaList').attr('disabled', true);
        }
        TgtrStoreEventDetail.detail.makeSelectboxList($("#subAreaList"),_optionRgn2,retData);
        
    },    
    makeSelectboxList :  function(area, title, list){
        var dispArea = area;
        var dispList = list;
        var rgn2Selected = area.attr("data-rgn2");

        dispArea.find("option:gt(0)").remove();

        $.each(dispList, function(index, element){
            $option = $("<option>");

            $option.val(element).text(element);
            if(!common.isEmpty(rgn2Selected)){
                if(rgn2Selected == element){
                    $option.prop("selected",true);
                }
            }

            dispArea.append($option);
        });
    },
    getSearchStoreList : function(pageIdx){
    	
    	PagingCaller.destroy();
    	
       var selectRgn1 = $("#mainAreaList").val();
       var selectRgn2 = $("#subAreaList").val();
       
       if(pageIdx == 1){
    	   TgtrStoreEventDetail.detail.offstorePageIdx = 1;
       }
       
       if(selectRgn1 == 'none'){
           alert(_messageSelect);
           return;
       }
 
       if(selectRgn1 != "세종특별자치시"){
           if(selectRgn2 == 'none'){
               alert(_messageSelect);
               return;
           }
       }
       
       if(selectRgn1 == null){
    	   selectRgn1 = $("#mainAreaList").attr('data-rgn1');
       }

       if(selectRgn1 == "세종특별자치시" && TgtrStoreEventDetail.detail.rgn2Etc == 'N'){
		   selectRgn2 = 'none';
	   }else{
		   if(selectRgn2 == null){
	    	   selectRgn2 = $("#subAreaList").attr('data-rgn2');
		   }
	   }
       
       TgtrStoreEventDetail.detail.rgn1 = selectRgn1;
       TgtrStoreEventDetail.detail.rgn2 = selectRgn2;

        var param = {
        	evtNo : $("input[id='evtNo']:hidden").val()
            , pageIdx : pageIdx
            , rgn1 : selectRgn1
			, rgn2 : selectRgn2
        };
        
        //jsTemplet
        this._ajax.sendRequest("POST"
            , _ajaxUrl + "storeEvent/getTgtrStoreListJson.do"
            , param
            , TgtrStoreEventDetail.detail._callBackGetSearchStoreList
        );
    },
    _callBackGetSearchStoreList : function(res){
    	
    	$("#searchStockList>.mlist-v1").html("");
    	$("#searchStockList>.mlist-v1").html(res);
    	
        var totCnt = $("#searchStockList").find("#totCnt").val();
        
        if ( totCnt !=undefined && totCnt != '' && totCnt > 0){
            $("#searchStockNoEmpty").hide();
            $("#searchStockList>.mlist-v1").show();
            $("#js-btn-wrap").show();
            
            TgtrStoreEventDetail.detail.offstorePageIdx = TgtrStoreEventDetail.detail.offstorePageIdx + 1;
            

            if (totCnt == $("#searchStockList>.mlist-v1").find("li").length) {
                $("#js-btn-wrap").hide();
            }
        }else{
        	$("#searchStockNoEmpty").show();
            $("#searchStockList>.mlist-v1").hide();
            $("#js-btn-wrap").hide();
        }
    	
        TgtrStoreEventDetail.detail.btnYn = 'N';
        TgtrStoreEventDetail.detail.searchYn = 'N';
        
        $("#mainAreaList").attr('data-rgn1','');
        $("#subAreaList").attr('data-rgn2','');
    },
    storeDetailInfo : function(strNo){
    	sessionStorage.setItem("searchTgtrStrPageIdx", TgtrStoreEventDetail.detail.offstorePageIdx-1);
    	sessionStorage.setItem("searchTgtrStrRgn1", TgtrStoreEventDetail.detail.rgn1);
    	sessionStorage.setItem("searchTgtrStrRgn2", TgtrStoreEventDetail.detail.rgn2);
    	
    	document.location.hash = "#search"
    		
    	common.link.moveStoreDetailPage(strNo);
    }
};