_ajax = common.Ajax;

$.namespace('mstore.storeReturn');
mstore.storeReturn = {
	usrLat : "",
	usrLng : "",
	geoFlag : "Y",
	searchType : "",
	isNearAvail : true,
	isFirstPopup : true,
	isGeoLocationCall : false,
	isGeoLocation : true,
	favorObj : null,
	isProcessing: false,
	dimClickCnt : 0,
	favorCount : 0,
	buttonStarClickCnt : 0, //관심매장 등록 클릭 수
    buttonStarClickPreStoreNo : "", //관심매장 등록 이전 클릭 매장번호
    
	init : function (){
		localStorage.setItem("useLoc", "Y");
		
		if(localStorage.getItem("searchType") != null){
			$("#searchType").val(localStorage.getItem("searchType"));
		}
		
		if(localStorage.getItem("tab") != null){
			$("#tabType").val(localStorage.getItem("tab"));
		}
		if(localStorage.getItem("searchWord") != null){
			$("#searchWord").val(localStorage.getItem("searchWord"));
		}
		localStorage.removeItem("tab");
		localStorage.removeItem("searchType");
		
		mstore.storeReturn.bindButtonInit();
		$("#searchAreaButton").click();
	},
	
	//팝업 관련 버튼 이벤트
	bindButtonInit : function (){
		//탭 이동
		$("#mTab > li > a").unbind("click").click(function(e){
			e.preventDefault();
			
			var id = $(this).attr("id");
			$("#flagSearch").val(id);
			
			$("#mTab > li > a").removeClass("on");
			$(this).addClass('on');
			
			$('.reShop_search:eq('+ $(this).parent().index() +')').show().siblings('.reShop_search').hide();
			$('.reShop_con:eq('+ $(this).parent().index() +')').show().siblings('.reShop_con').hide();
			
			// 지역검색, 직접검색 구분한다 
			if(id == "areaSearch"){
				mstore.storeReturn.searchStoreMain('area');
			}else if(id == "wordSearch"){
				mstore.storeReturn.searchStoreMain('word');
			}
		});
		
		// 지역검색 - 지역 선택시 이벤트
		$("#mainAreaList").change(function(e){
			e.preventDefault();
			mstore.storeReturn.getSubAreaListAjax();
		});
		// 지역검색 - 시/군/구 선택시 이벤트
		$("#subAreaList").change(function(e){
			if ($(this).val() != 'none'){
				$("#subAreaList").addClass("act");
			}
			else {
				$("#subAreaList").removeClass("act");
			}
		});
		// 직접검색 검색버튼 클릭
		$("#searchWordDiv .btn_sch").click(function(e){
			e.preventDefault();
			mstore.storeReturn.searchStoreMain('word');
		});
		// 지역검색 검색버튼 클릭
		$("#searchAreaButton").click(function(e){
			e.preventDefault();
			mstore.storeReturn.searchStoreMain('area');
		});
		//검색어 삭제 버튼 이벤트
        $('.sch_field4').find('.btn_sch_del').on({
            'click' : function(e){
                e.preventDefault();
                $(this).removeClass('on').parent().find('input[type="text"]').val('').focus();
                var _input = $(this).parent().find('input[type="text"]');
                mstore.storeReturn.fnSearchSet(_input);
            }
        });
        
        // 직접검색, 판매매장 찾기 검색바 이벤트
        $('.sch_field4').find('input[type="text"]').on({
            'keyup' : function(){
            	mstore.storeReturn.fnSearchSet($(this));
            },
            'focusin' : function(){
            	mstore.storeReturn.fnSearchSet($(this));
            }
        });
	},
	// 검색 이벤트 발생 시 type에 따라 분기하여 매장 리스트 불러오기
	searchStoreMain : function(type){
		
		PagingCaller.destroy();
		mstore.storeReturn.searchType = type;
		
		var searchWord = $("#searchWord").val();
		var rgn1 = $("#mainAreaList option:selected").val();
		var rgn2 = $("#subAreaList option:selected").val();
		var useLoc = localStorage.getItem("useLoc") == 'Y' ? true : false;
		
		var valitation = false; 
		if(type == "word" && common.isEmpty(searchWord)){
			valitation = true;
		}else if(type == "area" && rgn1 == 'none'){
			valitation = true;
		}
		
		if(valitation && useLoc){
			/*검색어 없을 시 전체 매장 조회*/
			if (navigator.geolocation) {
				mstore.storeReturn.isGeoLocationCall = true;
				navigator.geolocation.getCurrentPosition(mstore.storeReturn.onSuccessGeolocation, mstore.storeReturn.onErrorGeolocation, {timeout: 10000});
			} else {
				document.getElementById("map").innerHTML = "<p>사용자의 브라우저는 지오로케이션을 지원하지 않습니다.</p>";
			}
		}else{
			PagingCaller.init({
				callback : function(){
					var param = {
							pageIdx    : PagingCaller.getNextPageIdx(),
							searchType : type,
							searchWord : searchWord,
							rgn1 : rgn1,
							rgn2 : rgn2,
							usrLat : $("#usrLat").val(),
							usrLng : $("#usrLng").val(),
							strRetYn : "Y"
					}
					common.Ajax.sendJSONRequest(
							"GET"
							, _baseUrl + "store/getStoreListJson.do"
							, param
							, mstore.storeReturn._callbackSearchStoreListAjax);
				}
			,startPageIdx : 0
			,subBottomScroll : 700
			,initCall : true
			});
		}
		$('html, body').scrollTop(0);
	},
	//응답받은 데이터를 노출시킨다
	_callbackSearchStoreListAjax : function (strData){
		var type = mstore.storeReturn.searchType;
		
		if(strData.pageIdx == 1){
			if(type == 'word'){
				$("#searchWordDiv .reShop_result").remove();
			}else if(type == 'area'){
				$("#searchAreaDiv .reShop_result").remove();
			}
			
			var $dlResult = $("<dl>").addClass("reShop_result");
			$ddCount = $("<dd class='no_ico'>").text(strData.totalCount+_messageCount2);
			
			$dlResult.append($ddCount);
			
			if(type == 'word'){
				$("#searchWordDiv").append($dlResult);
				$("#storeListByWord").find(".mlist-reShop").empty();
			}else if(type == 'area'){
				$("#searchAreaDiv").append($dlResult);
				$("#storeListByArea").find(".mlist-reShop").empty();
			}
		}
		
		$("#noStoreList").hide();
		
		var length = 0; 
		if(!common.isEmpty(strData.storeList)){
			length = strData.storeList.length;
		}
		
		if(length > 0){
			if(type == 'word'){
				mstore.storeReturn.makeStoreList($("#storeListByWord").find(".mlist-reShop"),strData.storeList,type);
			}else if(type == 'area'){
				mstore.storeReturn.makeStoreList($("#storeListByArea").find(".mlist-reShop"),strData.storeList,type);
			}
		}else{ //조회된 리스트가 없는 경우 
			if(strData.pageIdx == 1){
				if(type == 'word'){
					$("#searchWordDiv").find(".reShop_result > dd").remove();
				}else if(type == 'area'){
					$("#searchAreaDiv").find(".reShop_result > dd").remove();
				}
				
				$("#noStoreList").css("display","block");
			}
			PagingCaller.destroy();
		}
	},
	// Ajax로 가져온 매장목록을 그려줌. (직접검색, 지역검색)
	makeStoreList :  function(area, list, type){
		var dispArea = area;
		var dispList = list;
		var dispType = type;
		
		$.each(dispList, function(index, element){
			
			var tmpDist;
			
			tmpDist = Number(element.dist) + "km";
			
			if(!mstore.storeReturn.isGeoLocation) {
				tmpDist = "";
			}
			
			var $li = $("<li>");
			var idNmTxt = [element.strNo]
			if(dispType == 'word'){
				idNmTxt.push("li_word");
			}else{
				idNmTxt.push("li_area");
			}
			$li.attr("id",idNmTxt.join(""));
			var $divReInner = $("<div>").addClass("li_reInner");
			
			var $h4Tit = $("<h4>").addClass("tit");
			var $a = $("<a>").attr("href","javascript:;").text(element.strNm);
			
			var $buttonMap = $("<button>").addClass("mapOp");
			$buttonMap.click(function(){mstore.storeReturn.storeMapInit(element.lat, element.lng, element.strNo, $(this), dispType)});
			$a.click(function(){mstore.storeReturn.storeMapInit(element.lat, element.lng, element.strNo, $buttonMap, dispType);});
			
			$h4Tit.append($a);
			$h4Tit.append($buttonMap);
			
			var $spanDist = $("<span>").addClass("reShop_way").text(tmpDist);
			$h4Tit.append($spanDist);
			$divReInner.append($h4Tit);
			
			var $pAddr = $("<p>").addClass("addr");
			if(!common.isEmpty(element.addr)){
				$pAddr.text(element.addr);
			}
			$divReInner.append($pAddr);
			
			var $divArea = $("<div>").addClass("area");
			$divReInner.append($divArea);
			
			var $divStoreTime = $("<div>").addClass("storeTime").text("영업시간 "+element.strBizInfo);
			$divArea.append($divStoreTime);
			
			if(!common.isEmpty(element.phon)){
				var $buttonCall = $("<button>").addClass("call").text(element.phon);
//				$buttonCall.click(function(){mstore.storeReturn.setCallEvent($(this));});
				$divArea.append($buttonCall);
			}
			
			if(!common.isEmpty(element.openYn)){
				var $divOpenYn;
				if(element.openYn == 'Y'){
					$divOpenYn = $("<div class='time on'>").text("영업중");
				}else{
					$divOpenYn = $("<div class='time'>").text("영업준비중");
				}
				$divArea.append($divOpenYn);
			}
			
			var $divMapArea = $("<div class='api_mapArea'>");
			$divMapArea.css('display', 'none');
			var $divStoreWay = $("<div class='store_wayP'>");
			if(dispType == 'word'){
				$divStoreWay.attr('id',element.strNo+'map_word');
			}else{
				$divStoreWay.attr('id',element.strNo+'map_area');
			}
			
			$divMapArea.append($divStoreWay);
			$divReInner.append($divMapArea);
			
			var $inputStrNo = $("<input>").attr("type","hidden").attr("name","storeNo").val(element.strNo);
			var $inputStrLat = $("<input>").attr("type","hidden").attr("name","strLat").val(element.lat);
			var $inputStrLng = $("<input>").attr("type","hidden").attr("name","strLng").val(element.lng);
			var $inputDist = $("<input>").attr("type","hidden").attr("name","strDist").val(tmpDist);
			
			$li.append($divReInner);
			$li.append($inputStrNo);
			$li.append($inputStrLat);
			$li.append($inputStrLng);
			$li.append($inputDist);
			
			dispArea.append($li);
		});
	},
	// 매장상세 페이지 이동
	setMapEvent : function(strNo, dist, openYn){
		var $tabList = $("#TabsOpenArea li");
		
		var mainAreaIdx = $("#mainAreaList option").index($("#mainAreaList option:selected"));
		var subAreaIdx = $("#subAreaList option").index($("#subAreaList option:selected"));
		
		if(mainAreaIdx != 0){
			sessionStorage.setItem("mainAreaIdx", mainAreaIdx);
		}
		if(subAreaIdx != 0){
			sessionStorage.setItem("subAreaIdx", subAreaIdx);
		}
		
		if($tabList.eq(0).find("a").hasClass("on")){
			localStorage.setItem("tab", "wordTab");
			localStorage.setItem("searchWord", $("#searchWord").val());
		}else if($tabList.eq(1).find("a").hasClass("on")){
			localStorage.setItem("tab", "areaTab");
		}else if($tabList.eq(2).find("a").hasClass("on")){
			localStorage.setItem("tab", "favorTab");
		}else{
			localStorage.setItem("tab", "itemTab");
		}
		
		localStorage.setItem("searchType", $("#searchType").val());
		
		localStorage.setItem("openYn", $("#openYn").val());
		localStorage.setItem("tcCd", $("#tcCd").val());
		localStorage.setItem("psCd", $("#psCd").val());
		
		common.link.moveStoreDetailPage(strNo, dist, openYn);
	},
	
	// 매장 위치 지도에서 확인하기 
	storeMapInit : function(lat, lng, strNo, obj, type) {
		var $listUl;
		var $divMap;
		if(type == 'word'){
			$listUl = $("#storeListByWord").find(".mlist-reShop");
			$divMap = $("#"+strNo + "map_word");
		}else{
			$listUl = $("#storeListByArea").find(".mlist-reShop");
			$divMap = $("#"+strNo + "map_area");
		}
		
        try {
            if (obj.hasClass("on")) {
            	$divMap.parent().slideToggle();
            }
            else {
                if($divMap.hasClass("load")) {
                    $(".mapOp", $listUl).removeClass("on");
                    $(".store_wayP", $listUl).parent().hide();
                    $divMap.parent().slideToggle();
                }
                else {
                    if(!common.isEmpty(lat) && !common.isEmpty(lng)) {
                        $(".mapOp", $listUl).removeClass("on");
                        $(".store_wayP", $listUl).parent().hide();
                        $divMap.parent().slideToggle();
                        var mapContainer = document.getElementById(strNo+'map_'+type) // 지도 영역
                        var mapOption = {
                            center: new daum.maps.LatLng(lat, lng), // 지도 중심좌표(위도,경도)
                            level: 2 // 지도 확대 레벨
                        };
                        var map = new daum.maps.Map(mapContainer, mapOption); // 지도 생성
                        var markerImage = new daum.maps.MarkerImage(_imgUrl + 'comm/point_way.png' , new daum.maps.Size(21, 31)); // 마커 이미지 생성
                        
                        var markerPosition = new daum.maps.LatLng(lat, lng); // 마커 위치
                        var marker = new daum.maps.Marker({
                            map: map, // 마커를 표시할 지도
                            position: markerPosition,
                            image : markerImage // 마커 이미지
                        }); // 마커 생성
                        marker.setMap(map); // 마커 표시
                        $divMap.addClass("load");
                    }
                }
            }
            obj.toggleClass("on");
        }
        catch(e) {
            console.log(e);
            $(".mapOp", $listUl).removeClass("on");
            $(".store_wayP", $listUl).parent().hide();
        }
    },
	
	// 매장 관심 등록/해제 이벤트
	setStarEvent : function(obj){
		var activeFlag = obj.hasClass('on');
		var strNo = obj.parent().nextAll("input[name*='storeNo']").val();
		if (activeFlag == true){
			mstore.storeReturn.delFavorStoreAjax(strNo , obj);
		}else{
			mstore.storeReturn.regFavorStoreAjax(strNo , obj);
		}
	},
	// 매장 관심 해제 Ajax
	delFavorStoreAjax : function(strNo , obj) {
		if(!mstore.storeReturn.logincheck(strNo)){
			return;
		}
		
		if(mstore.storeReturn.isProcessing) {
			mstore.storeReturn.isProcessing = true;
			return false;
		}
		
		mstore.storeReturn.favorObj = $(obj);
		
		common.Ajax.sendJSONRequest(
				"POST"
				, _baseUrl + "store/delFavorStoreJson.do"
				, "strNo="+ strNo
				, mstore.storeReturn._callback_delFavorStoreAjax
				, false);
	},
	
	//매장 관심 해제 Callback
	_callback_delFavorStoreAjax : function(strData) {
		if(strData.ret == "0"){
			common.gnb.callSlideMenuAjax();
			var onFlag = mstore.storeReturn.favorObj.hasClass("on");
			var favorCountObj = (mstore.storeReturn.favorObj.parent(".li_reInner").length > 0) ?
					mstore.storeReturn.favorObj.parent(".li_reInner").find(".fv_reShop_in").find("span") :
						mstore.storeReturn.favorObj.parents().find(".fv_reShop_in").find("span");
					if(onFlag) {
						var cnt = parseInt(replaceAll(favorCountObj.text(), ',', ''))-1;
						favorCountObj.text(cnt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
						mstore.storeReturn.favorObj.removeClass("on");
						mstore.storeReturn.favorObj.addClass("active");
					}
					
					mstore.storeReturn.favorCount --;
					
					if($(".reShop_favInner").length > 0 ) {
						var cnt = parseInt($(".reShop_favInner").find("span").find("b").text())-1;
						$(".reShop_favInner").find("span").find("b").text(cnt);
					}
		}else{
			common.loginChk();
		}
		mstore.storeReturn.isProcessing = false;
	},
	// 매장 관심 등록 Ajax
    regFavorStoreAjax : function(strNo, obj) {
        mstore.storeReturn.buttonStarClickPreStoreNo = strNo;
        
        if(mstore.storeReturn.isProcessing){
            mstore.storeReturn.isProcessing = true;
            return false;
        }
        
        if(!mstore.storeReturn.logincheck(strNo)){
            mstore.storeReturn.buttonStarClickCnt = 0;
            mstore.storeReturn.buttonStarClickPreStoreNo = "";
            return;
        }

        if(mstore.storeReturn.favorCount  >= 3){
            alert(_messageLimit);
            mstore.storeReturn.buttonStarClickCnt = 0;
            mstore.storeReturn.buttonStarClickPreStoreNo = "";
            return;
        }
        
        mstore.storeReturn.favorObj = $(obj);
        
        common.Ajax.sendJSONRequest(
                "POST"
                , _baseUrl + "store/regFavorStoreJson.do"
                , "strNo="+ strNo
                , mstore.storeReturn._callback_regFavorStoreAjax
                , false);
    },
    
    // 매장 관심 등록 Callback
    _callback_regFavorStoreAjax : function(strData) {
        if(strData.ret == "0" || strData.ret == "20" || strData.ret == "30"){
            common.gnb.callSlideMenuAjax();
        }else if(strData.ret == "40"){
            // 관심매장 쿠폰 첫 1회 발급
            mstore.storeReturn.dimClickCnt++;
            
            $("#linkUrl").prop('href', "javascript:common.link.commonMoveUrl('"+strData.linkUrl+"');");
            $("#layerPop").html($("#storeEvtLayer").html());
            $("#layerPop").removeClass('popInner');
            
            common.popLayerOpen("LAYERPOP01");
        }else if(strData.ret == "10") {
            var onFlag = mstore.storeReturn.favorObj.hasClass("active");
            var favorCountObj = (mstore.storeReturn.favorObj.parent(".li_reInner").length > 0) ?
                    mstore.storeReturn.favorObj.parent(".li_reInner").find(".fv_reShop_in").find("span") :
                    mstore.storeReturn.favorObj.parents().find(".fv_reShop_in").find("span");
            if(onFlag) {
                var cnt = parseInt(replaceAll(favorCountObj.text(), ',', ''))+1;
                favorCountObj.text(cnt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                mstore.storeReturn.favorObj.removeClass("active");
                mstore.storeReturn.favorObj.addClass("on");
            }
            
            mstore.storeReturn.favorCount ++;
            if($(".reShop_favInner").length > 0 ) {
                var cnt = parseInt($(".reShop_favInner").find("span").find("b").text())+1;
                $(".reShop_favInner").find("span").find("b").text(cnt);
            }
        } else{
            common.loginChk();
        }
        mstore.storeReturn.isProcessing = false;
    },
	// 전화 아이콘 클릭 이벤트
	setCallEvent :  function(obj){
		var phoneNum = obj.text();
		$(location).attr('href', "tel:"+ phoneNum);
	},
	// GPS 수신유무에 따른 매장목록 불러오기 Ajax
	storeListAjax : function(geoFlag , position){
		
		if(mstore.storeReturn.isGeoLocationCall){
			mstore.storeReturn.isGeoLocationCall = false;
		}else{
			return;
		}
		var lat = null;
		var lon = null;
		
		if(geoFlag) {
			lon=  position.coords.longitude;//경도
			lat = position.coords.latitude;//위도
			$("#usrLat").val(lat);
			$("#usrLng").val(lon);
		} else {
			localStorage.setItem("useLoc", "N");
			mstore.storeReturn.isGeoLocation = false;
			$(".useLocRecom").hide(); 
		}
		
		PagingCaller.destroy();
		
		PagingCaller.init({
			callback : function(){
				var param = {
						pageIdx    : PagingCaller.getNextPageIdx(),
						searchType : mstore.storeReturn.searchType,
						usrLat : $("#usrLat").val(),
						usrLng : $("#usrLng").val(),
						strRetYn : "Y"
				}
				_ajax.sendJSONRequest(
						"GET"
						, _baseUrl + "store/getStoreListJson.do"
						, param
						, mstore.storeReturn._callbackSearchStoreListAjax);
			}
		,startPageIdx : 0
		,subBottomScroll : 700
		,initCall : true
		});
	},
	// 직접검색 검색바 엔터 이벤트
	searchStoreList :  function(e){
		if (e.keyCode != 13) {
			return;
		}
		e.preventDefault();
		$("#searchWord").blur();
		$("#searchType").val("word");
		mstore.storeReturn.searchStoreMain('word');
	},
	// 지역검색 지역 선택시 Ajax
	getSubAreaListAjax : function() {
		var rgn1 = $("#mainAreaList option:selected").val();
		if (rgn1 != 'none'){
			$("#mainAreaList").addClass("act");
			common.Ajax.sendJSONRequest(
					"POST"
					, _baseUrl + "store/getStoreSubAreaListJson.do"
					, "rgn1="+ rgn1
					, mstore.storeReturn._callback_getSubAreaListAjax
					, false);
		}
		else {
			$("#mainAreaList").removeClass("act");
			$("#subAreaList").find("option:eq(0)").prop("selected", true);
			$("#subAreaList").find("option:eq(0)").siblings().remove();
		}
		$("#subAreaList").removeClass("act");
	},
	// 지역검색 지역 선택시 Callback
	_callback_getSubAreaListAjax : function(retData) {
		$('#subAreaList').attr('disabled', false);
		if(retData == ''){
			$('#subAreaList').attr('disabled', true);
		}
		mstore.storeReturn.makeSelectboxList($("#subAreaList"),_optionRgn2,retData);
	},
	// 서브지역 동적생성
	makeSelectboxList :  function(area, title, list){
		var dispArea = area;
		var dispList = list;
		var rgn2Selected = area.attr("data-rgn2");
		
		var $option = $("<option>");
		$option.val("none").text(title).prop("selected",true);
		
		dispArea.empty().append($option);
		
		$.each(dispList, function(index, element){
			$option = $("<option>");
			$option.val(element).text(element);
			$option.val(element).text(element);
			if(!common.isEmpty(rgn2Selected)){
				if(rgn2Selected == element){
					$option.prop("selected",true);
				}
			}
			dispArea.append($option);
		});
	},
	// 로그인 체크
	logincheck : function(strNo){
		if(common.isLogin() == false){
			
			if(!confirm(_messageLoginCheck)){
				return false;
			}else{
				common.link.moveLoginPage();
				return false;
			}
		}
		return true;
	},
	// 지오로케이션 사용O Calback
	onSuccessGeolocation : function(position) { //Geolocation succ
		setTimeout(function() { 
			mstore.storeReturn.storeListAjax(true,position);
		}, 500);
	},
	//지오로케이션 사용X Calback
	onErrorGeolocation : function(error) { //Geolocation error
		setTimeout(function() {
			mstore.storeReturn.storeListAjax(false,null);
		}, 500);
	},
	// 검색바 이벤트
    fnSearchSet : function (obj){
        if(obj.val() != '' && obj.val() != null){
            obj.parent().find('.btn_sch_del').addClass('on');
        }
        else{
            obj.parent().find('.btn_sch_del').removeClass('on');
        }
    }
};