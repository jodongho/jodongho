// 인기검색어, 내가찾은 검색어
function doKeyword(query) {    
    var searchForm = document.search; 
    searchForm.startCount.value = "0";
    searchForm.query.value = query;
    searchForm.collection.value = "ALL";
    doSearch();
}

function doMainKeyword(query) {  
    var searchForm = document.search; 
    searchForm.startCount.value = "0";
    searchForm.realQuery.value = query; 
    searchForm.collection.value = "ALL";
    searchForm.submit();
}

function doMainKeywordMain(){
    var qqq= $('#qqq').val(); 
    if (qqq == "") { 
        $('#qqq').focus();
        return;
    }
    all_init();

    var searchForm = document.search; 
    searchForm.startCount.value = "0";
    searchForm.realQuery.value = qqq;
    //searchForm.query.value = qqq; 
    searchForm.collection.value = "ALL";
    searchForm.submit();
}

// 쿠키값 조회
function getCookie_search(c_name) {
    var i,x,y,cookies=document.cookie.split(";");
    for (i=0;i<cookies.length;i++) {
        x=cookies[i].substr(0,cookies[i].indexOf("="));
        y=cookies[i].substr(cookies[i].indexOf("=")+1);
        x=x.replace(/^\s+|\s+$/g,"");
    
        if (x==c_name) {
            return unescape(y);
        }
    }
}

function getNowDate(){
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1
    var day = date.getDate();
    if(month < 10){
        month = "0"+month;
    }
    if(day < 10){
        day = "0"+day;
    }
 
    var today = year+""+month+""+day;
    return today;
}

// 쿠키값 설정
function setCookie_search(c_name,value,exdays) {
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString())+ ";";    
    c_value += "path=/;";
    document.cookie=c_name + "=" + c_value;
}

//내가 찾은 검색어 조회
function getMyKeyword(keyword, totCount) {
    
    var MYKEYWORD_COUNT = 21; //내가 찾은 검색어 갯수 + 1
    var myKeyword = getCookie_search("mykeyword");
    if( myKeyword== null) {
        myKeyword = "";
    }

    var myKeywords = myKeyword.split("^%");
    
    if (keyword != undefined && totCount != undefined && keyword != '') {

        //전체 검색결과 상관 없이, 최근검색어 저장 요청       
//        if( totCount > 0 ) {
            var existsKeyword = false;
            for( var i = 0; i < myKeywords.length; i++) {
                if( myKeywords[i] == keyword) {
                    myKeywords.splice(i,1);
                    myKeywords.push(keyword);
                    existsKeyword = true;
                    break;
                }
            }

            if( !existsKeyword ) {
                myKeywords.push(keyword);
                if( myKeywords.length == MYKEYWORD_COUNT) {
                    myKeywords = myKeywords.slice(1,MYKEYWORD_COUNT);
                }
            }
            setCookie_search("mykeyword", myKeywords.join("^%"), 365);
//        }
    }
    
    showMyKeyword(myKeywords.reverse());
}


// 내가 찾은 검색어 삭제
function removeMyKeyword(keyword) {
    var myKeyword = getCookie_search("mykeyword");
    if( myKeyword == null) {
        myKeyword = "";
    }

    var myKeywords = myKeyword.split("^%");

    var i = 0;
    while (i < myKeywords.length) {
        if (myKeywords[i] == keyword) {
            myKeywords.splice(i, 1);
        } else { 
            i++; 
        }
    }

    setCookie_search("mykeyword", myKeywords.join("^%"), 365);

    showMyKeyword(myKeywords.reverse());
}
 
// 내가 찾은 검색어 
function showMyKeyword(myKeywords) {
    var str = "";
    var myKeyword = getCookie_search("mykeyword");
    
    if(myKeywords.length < 0 || myKeyword == undefined || myKeyword.trim() == "" ){
        $("#mykeyword .sch_no_data").show();
        $("#mykeyword .search_list").hide();
    }else{
        $("#mykeyword .sch_no_data").hide();
        $("#mykeyword .search_list").show();
        
        for( var i = 0; i < myKeywords.length; i++) {
            if( myKeywords[i] == "") continue;
            
            //str += "<li class=\"searchkey\"><a href=\"#none\" onClick=\"javascript:doKeyword('"+myKeywords[i]+"');\">"+myKeywords[i]+"</a> <img src=\"images/ico_del.gif\" onClick=\"removeMyKeyword('"+myKeywords[i]+"');\"/></li>";
            str += "<li><div onClick=\"javascript:recentKeywordSearch('"+myKeywords[i]+"');\">"+myKeywords[i]+"</div><button onClick=\"removeMyKeyword('"+myKeywords[i]+"');\">검색기록삭제</button></li>";
        }
            str += "<li><button class='alldel' onclick='javascript:deleteCookies();'>전체삭제</button></li>";
        
        $("#mykeyword .search_list").html(str);
    }
}

//메인 - 최근검색어 검색
function recentKeywordSearch(recentKeyword){
	var giftYn = common._giftCardCheck(recentKeyword);
    location.href = _baseUrl+"search/getSearchMain.do?query=" + encodeURIComponent(recentKeyword)+"&typeChk="+$('#typeChk').val() + "&giftYn=" + giftYn;        
}

// 오타 조회
function getSpell(query) { 
     
    if (query != "") {
        var str = "";
        
        str += "<div class=\"n-keyword\">";
        str += "<p>혹시 이것을 찾으셨나요? <a href=\"#none\" onClick=\"javascript:doKeyword('"+query+"');\">'"+query+"'</a></p>";
        str += "</div>";    
       
        $("#spell").html(str);
        return true;
    } else {
        return false;
    }
}

// 오타 조회
function getSpellOld(query) { 
    $.ajax({
      type: "POST",
      url: "./popword/popword.jsp?target=spell&charset=",
      dataType: "xml",
      data: {"query" : query},
      success: function(xml) {
        if(parseInt($(xml).find("Return").text()) > 0) {
            var str = "<div class=\"resultall\">";

            $(xml).find("Data").each(function(){            
                if ($(xml).find("Word").text() != "0" && $(xml).find("Word").text() != query) {
                    str += "<span>이것을 찾으셨나요? </span><a href=\"javascript:;\" onClick=\"javascript:doKeyword('"+$(xml).find("Word").text()+"');\">" + $(xml).find("Word").text() + "</a>";
                }           
            });
            
            str += "</div>";

            $("#spell").html(str);
        }
      }
    });

    return true;
}

// 뷰 방식 전환 
function doView(view) { 
    var searchForm = document.search;
    searchForm.viewtype.value = view;
    searchForm.submit();
}


// 뷰 방식 전환 
function doSearchNormal() { 
    var searchForm = document.search; 
    searchForm.submit();
}


// 기간 설정
function setDate(range) {
    var startDate = "";
    var endDate = "";
    
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth() +1;
    var day = currentDate.getDate();

    if (parseInt(month) < 10) {
        month = "0" + month;
    }

    if (parseInt(day) < 10) {
        day = "0" + day;
    }

    var toDate = year + "." + month + "." + day;

    // 기간 버튼 이미지 초기화
    for (i = 1;i < 5 ;i++) {
        $("#range"+i).attr ("src", "images/btn_term" + i + ".gif");
    }
    
    // 기간 버튼 이미지 선택
    if (range == "D") {
        startDate = getAddDay(currentDate, -0);
        $("#range2").attr ("src", "images/btn_term22.gif");
    } else if (range == "W") {
        startDate = getAddDay(currentDate, -6);
        $("#range3").attr ("src", "images/btn_term32.gif");
    } else if (range == "M") {
        startDate = getAddDay(currentDate, -29);
        $("#range4").attr ("src", "images/btn_term42.gif");
    } else {
        startDate = "1970.01.01";
        endDate = toDate;
        $("#range1").attr ("src", "images/btn_term12.gif");
    }
    
    if (range != "A" && startDate != "") { 
        year = startDate.getFullYear();
        month = startDate.getMonth()+1; 
        day = startDate.getDate();

        if (parseInt(month) < 10) {
            month = "0" + month;
        }

        if (parseInt(day) < 10) {
            day = "0" + day;
        }

        startDate = year + "." + month + "." + day;             
        endDate = toDate;
    }
    
    $("#range").val(range);
    $("#startDate").val(startDate);
    $("#endDate").val(endDate);
}

// 날짜 계산
function getAddDay ( targetDate, dayPrefix )
{
    var newDate = new Date( );
    var processTime = targetDate.getTime ( ) + ( parseInt ( dayPrefix ) * 24 * 60 * 60 * 1000 );
    newDate.setTime ( processTime );
    return newDate;
}

// 정렬
function doSorting(sort) {
	// [3343897] DS영역분석 집계 누락 확인 요청(CHY)
    if(sort == 'RNK/DESC'){
        common.wlog("search_sort_popular");
    }else if(sort == 'DATE/DESC'){
        common.wlog("search_sort_recent");
    }else if(sort == 'SALE_QTY/DESC'){
        common.wlog("search_sort_popular");
    }else if(sort == 'GDAS_TOT_CNT/DESC'){
        common.wlog("search_sort_reputation");
    }else if(sort == 'SALE_PRC/ASC'){
        common.wlog("search_sort_lowprice");
    }else if(sort == 'SALE_PRC/DESC'){
        common.wlog("search_sort_highprice");
    }
}

function fieldInit() {

    var searchForm = document.search;
    if ( searchForm.category != null )
    {
        searchForm.category.value = "";
    }
    if ( searchForm.catename != null )
    {
        searchForm.catename.value = "";
    }
    if ( searchForm.catedepth != null )
    {
        searchForm.catedepth.value = "";
    }
    if ( searchForm.maxprice != null )
    {
        searchForm.maxprice.value = "";
    }
    if ( searchForm.minprice != null )
    {
        searchForm.minprice.value = "";
    }
    if ( searchForm.setMinPrice != null )
    {
        searchForm.setMinPrice.value = "";
    }
    if ( searchForm.setMaxPrice != null )
    {
        searchForm.setMaxPrice.value = "";
    }
        
}

// 검색
function doSearch() {
    var searchForm = document.search; 

    if (searchForm.query.value == "") {
        //alert("검색어를 입력하세요.");
        searchForm.query.focus();
        //return;
    }
     
    fieldInit();
    searchForm.tmp_requery.value = "";
    $("#search_tab_area").hide();
    
    searchForm.submit();
}

// 컬렉션별 검색
function doCollection(coll) {
    var searchForm = document.search; 
    searchForm.collection.value = coll;
    searchForm.rt.value = "2";
    searchForm.submit();
}
    
// 엔터 체크    
function pressCheck() {   
    if (event.keyCode == 13) {
        return doSearch();
    }else{
        return false;
    }
}

// 메인모바일 - 엔터체크
function pressCheckMainSearch() {   
    if (event.keyCode == 13) {
    	
    	var giftYn = common._giftCardCheck($("#query").val());
    	
        location.href = _baseUrl + "search/getSearchMain.do?query=" + encodeURIComponent($("#query").val())+"&typeChk="+$('#typeChk').val() + "&giftYn=" + giftYn;
        
    }else{
        return false;
    }
}



// 결과내 재검색
function checkReSearch() {
    var searchForm = document.search;

    if (document.getElementById("reChk").checked == true) {
        temp_query = searchForm.query.value;
        searchForm.rt.value = "1";
        searchForm.reQuery.value = "";
    } else {
        searchForm.rt.value = "";
    }
}

// 페이징
function doPaging(count) {
    var searchForm = document.search;
    searchForm.startCount.value = count;
    searchForm.rt.value = "2";
    searchForm.submit();
}

// 기간 적용
function doRange() {
    var searchForm = document.search;
    
    if($("#startDate").val() != "" || $("#endDate").val() != "") {
        if($("#startDate").val() == "") {
            alert("시작일을 입력하세요.");
            $("#startDate").focus();
            return;
        }

        if($("#endDate").val() == "") {
            alert("종료일을 입력하세요.");
            $("#endDate").focus();
            return;
        }

        if(!compareStringNum($("#startDate").val(), $("#endDate").val(), ".")) {
            alert("기간이 올바르지 않습니다. 시작일이 종료일보다 작거나 같도록 하세요.");
            $("#startDate").focus();
            return;
        }       
    }

    searchForm.startDate.value = $("#startDate").val();
    searchForm.endDate.value = $("#endDate").val();
    searchForm.range.value = $("#range").val();
    searchForm.rt.value = "2";
    searchForm.submit();
}

// 영역
function doSearchField(field) {
    var searchForm = document.search;
    searchForm.searchField.value = field;
    searchForm.rt.value = "2";
    searchForm.submit();
}

// 문자열 숫자 비교
function compareStringNum(str1, str2, repStr) {
    var num1 =  parseInt(replaceAll(str1, repStr, ""));
    var num2 = parseInt(replaceAll(str2, repStr, ""));

    if (num1 > num2) {
        return false;
    } else {
        return true;
    }
}

// Replace All
function replaceAll(str, orgStr, repStr) {
    return str.split(orgStr).join(repStr);
}

// 공백 제거
function trim(str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

//메인 - 인기검색어
function popkeyword() {
    var range = "W";
    var collection = "ALL";
    // 인기검색어 조회
    $.ajax({
        type: "POST",
        url: _baseUrl+"search/getPopwordAjax.do?target=popword",
        dataType: "json",
        data: {"range" : range, "collection" : collection},
        success: function(data) {
            var str = "";            
            var num = 0;
            
            $.each(data.Data.Query, function(i,item){
                //console.log(item.content);
                var temp = item.content;
                //if(temp.length > 3){ temp = temp.substring(0,3);}
               str+= "<li><div onclick=\"javascript:doPopkeyword('" +temp + "');\"><span>"+ item.id +"</span>"+ temp +"</div></li>";
               num ++;
            });
                     
            $("#popword .search_list").empty();
            $("#popword .search_list").html(str);
        }
    });
}

//메인 - 급상승검색어
function suddenKeyword() {
    var datatype = "json";
    
    // 인기검색어 조회
    $.ajax({
        type: "POST",
        url: _baseUrl+"search/getPopwordAjax.do?target=suddenkeyword",
        dataType: "json",
        data: {"datatype" : datatype},
        success: function(data) {                        
            var str = "";            
            var num = 0;
            if(data.Data.Word.length != undefined && data.Data.Word.length !='' ){ 
                $.each(data.Data.Word, function(i,item){
                   if(num < 3){
                       var temp = item.content;
                       //if(temp.length > 3){ temp = temp.substring(0,3)+'...';}
                       str+= "<li><div onclick=\"javascript:doPopkeyword('" +temp + "');\"><span><strong>"+ item.id +"</strong></span>"+ temp +"</div></li>";
                       num ++;
                   }else{
                       var temp = item.content;
                       //if(temp.length > 3){ temp = temp.substring(0,3)+'...';}
                       str+= "<li><div onclick=\"javascript:doPopkeyword('" +temp + "');\"><span>"+ item.id +"</span>"+ temp +"</div></li>";
                       num ++;
                   } 
                });
            }else{
                str+= "<li><div onclick=\"javascript:doPopkeyword('" +data.Data.Word.content + "');\"><span><strong>"+ data.Data.Word.id +"</strong></span>"+ data.Data.Word.content +"</div></li>";
            }        
            $("#popword .search_list").empty();
            $("#popword .search_list").html(str);
        }
    });
}

function doPopkeyword(popword){
    
	var giftYn = common._giftCardCheck(popword);
	
	// [3389141] (영역별 매출분석) 오특, 검색, 베스트, 메인 추가(CHY)
	location.href = _baseUrl+"search/getSearchMain.do?query=" + encodeURIComponent(popword)+"&typeChk="+$('#typeChk').val() + "&giftYn=" + giftYn + "&trackingCd=Search_Pop_PROD";
    
}

//검색 결과 없을 시, 인기검색어 노출
function noresult_popkeyword() {
    var range = "W";
    var collection = "ALL";
    var datatype = "json";
    // 인기검색어 조회
    $.ajax({
        type: "POST",
        url: _baseUrl+"search/getPopwordAjax.do?target=popword",
        dataType: "json",
        data: {"range" : range, "collection" : collection, "datatype" : datatype},
        success: function(data) {
           // alert('test');
            var str = "<div class='popular_box'>";
            str += "        <h2 class='tit'>인기검색어</h2>";                        
            str += "<ul class='search_list type2 popular'>";
            
            $.each(data.Data.Query, function(i,item){
                
                var temp = item.content;
               str += "<li><div onclick=\"javascript:doPopkeyword('" +temp + "');\"><span>" + item.id + "</span>" + temp +"</div></li>";
            });
            
            str += "</ul>";
            str += "</div>";            
            
            $("#noresult_popword").html(str);
        }
    });
}

//검색 결과 없을 시, 급상승검색어 노출
function noresult_suddenKeyword() {
    var datatype = "json";
    // 인기검색어 조회
    $.ajax({
        type: "POST",
        url: _baseUrl+"search/getPopwordAjax.do?target=suddenkeyword",
        dataType: "json",
        data: {"datatype" : datatype},
        success: function(data) {
           // alert('test');
            var str = "<div class='popular_box'>";
            str += "        <h2 class='tit'>인기검색어</h2>";                        
            str += "<ul class='search_list type2 popular'>";
            if(data.Data.Word.length != undefined && data.Data.Word.length !='' ){ 
                $.each(data.Data.Word, function(i,item){                               
                   str += "<li><div onclick=\"javascript:doPopkeyword('" +item.content + "');\"><span>" + item.id + "</span>" + item.content +"</div></li>";
                });
            }else{
                str += "<li><div onclick=\"javascript:doPopkeyword('" +data.Data.Word.content + "');\"><span>" + data.Data.Word.id + "</span>" + data.Data.Word.content +"</div></li>";
            }
            str += "</ul>";
            str += "</div>";            
            
            $("#noresult_popword").html(str);
        }
    });
}

function recommend(query) {
    var label = "_ALL_";
    //alert("xx");
    // 추천검색어 조회
    $.ajax({
        type: "POST",
        url: _baseUrl+"search/getRecommendAjax.do?target=recommend",
        dataType: "json",
        data: {"query" : query, "label" : label},
        success: function(data) {           
            
            var str = "";
            var num = 0;            
             
            if(data.Data.Return != 1){                         
                //연관 검색어 화면 그리기
                $("#mSearches").show();
                 
                //연관검색어 리스트 20개까지만 노출
                if(data.Data.Return == 0){                                           
                    for(var i=0; i<20 && i<data.Data.Word.length; i++) {
                        str += "<li class='swiper-slide' onclick=\"javascript:recentSearchdo('" + data.Data.Word[i] + "');\">" + data.Data.Word[i] + "</li>";
                    }                                                                
                }
            }
            
            $("#recommend").html(str);                           
            
           //슬라이드 jquery > 퍼블리싱 
            var mSubGnb_swiper = new Swiper('#mSearches', {
                initialSlide: 0,
                slidesPerView: 'auto',
                paginationClickable: true,
                spaceBetween: 0,
                loop: false
            });                        
        }
    });
}

function catesearch(name,id,depth) {
    document.search.catename.value = name;
    document.search.category.value = id;
    document.search.catedepth.value = depth;
    document.search.submit();
}

function number_format(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

var flag = false;

function viewMoreCategory(){
    if (!flag) {
        $("#pcategory").removeClass().addClass("pcategory_all");
        $("#categoryFlagBtn").html("");
        $("#categoryFlagBtn").html("<a href=\"javascript:viewMoreCategory();\">카테고리 닫기 </a>");
        flag = true;
    } else {
        $("#pcategory").removeClass().addClass("pcategory");
        $("#categoryFlagBtn").html("");
        $("#categoryFlagBtn").html("<a href=\"javascript:viewMoreCategory();\">카테고리 더보기</a>");
        flag = false;
    }
}

//페이지당 결과 출력
function ShowViewList(ViewCount){
    var searchForm = document.search; 
    searchForm.listnum.value = ViewCount;
    searchForm.submit();        
}

function all_init(){
    var searchForm = document.search;
  //만약 전체 선택 체크박스가 체크된상태일경우
      //해당화면에 모든 checkbox들의 체크를해제시킨다.
      $("input[type=checkbox]").prop("checked",false);
      //input 가격을 초기화 시킨다.
      $("#sale_below_price").prop("value","");
      $("#sale_over_price").prop("value","");
      $(".listOne li").not('.line').prop("class","");
      //카테고리 초기
      $('input[type=radio]').removeAttr("checked");
        
      //카테고리명, 값 초기화
     // $("#selCateName").html("");
      searchForm.cateId.value = "";
      searchForm.categoryDepthValue.value = "";
      searchForm.cateId2.value = "";
      searchForm.cateClasseName.value = "";
      searchForm.disPlayCateId.value = "";
      searchForm.catename.value = "";
      searchForm.attrCheck0.value = "";
      searchForm.attrCheck1.value = "";
      searchForm.attrCheck2.value = "";
      searchForm.attrCheck3.value = "";
      searchForm.attrCheck4.value = "";
     // $("#selectbox").prop("selectedIndex", 0);
      //searchForm.goods_sort.value = "RNK/DESC";
      searchForm.brandCheck.value = "";
      searchForm.authenticYn.value = "";
      searchForm.benefitCheck.value = "";

      //searchForm.typeChk.value = "";
      searchForm.onlyOneBrand.value = "";
      //브랜드명, 값 초기화
      $(".choiceds").html("");
     // $("#selCateName").html("");
      //키워드 상단 고정 유지
      searchForm.realQuery.value = $("input[name=realQuery]").val();
      searchForm.disBrandName.value = "";
                                     
      searchForm.cateChk.value = "";
      searchForm.disPlayBenefitName.value = "";
      searchForm.sale_below_price.value = "";
      searchForm.sale_over_price.value = "";
      $("input:checkbox[name=check_price]").removeAttr('checked')
      searchForm.quickYn.value = "N"; // 오늘드림여부초기화
      
}

function allcheck_init(){
   
    all_init();
    getDetailSearch();

}

//선택 해제 기능
$(function(){
        //상세검색 - 초기화
        $("#Allcheck_close").click(function(){
            allcheck_init();
                //searchForm.submit(); 
                //location.href = _baseUrl+"search/getSearchMain.do?query=" + $("#query").val() +"&detailChk="+$("#detailChk").val();
           
        })
         
        
    })
    

     

//결과 재 검색
function reSearch(){
    
    var reKeyword = document.getElementById("reChk").value; 
    var searchForm = document.search;
    
    if (document.getElementById("reChk").value != "") {             
        temp_query = searchForm.query.value;
        searchForm.rt.value = "1";
        searchForm.reQuery.value = reKeyword;
    } else {
        searchForm.rt.value = "";
    }
    searchForm.submit();
}

//가격대 검색
function Price_Search(){ 
    var searchForm = document.search;
    var selPriceName = "";
    var minPrice = $("#sale_below_price").val();
    var maxPrice = $("#sale_over_price").val();
    
    
    if(minPrice=="" && maxPrice==""){
        $('#selPriceName').text('');
        //return;
    }
    
    //가격 우측상단 남기기
    var selPriceName_min = minPrice;
    var selPriceName_max = maxPrice;
    if(minPrice!=""&&maxPrice==""){
        $('#selPriceName').text(selPriceName_min+" ~ ");
    }else if(minPrice=="" && maxPrice!=""){
        $('#selPriceName').text(" ~ "+selPriceName_max+" ");
    }else if(minPrice!="" && maxPrice!=""){
        $('#selPriceName').text(selPriceName_min+" ~ "+selPriceName_max+" ");
    }
    
    
    
    //원본
    /*var searchForm = document.search;
    var minPrice = $("#sale_below_price").val();
    var maxPrice = $("#sale_over_price").val();
    if(minPrice==""&&maxPrice==""){
        return;
    }*/
    
    
    //최소가격 & 최대가격 비교
    var minPrice_check = minPrice.replace(/,/gi,"");
    var maxPrice_check = maxPrice.replace(/,/gi,"");       
    
    if(parseInt(minPrice_check) > parseInt(maxPrice_check)){
        
        alert("최소가격이 최대가격보다 높게 입력 되었습니다.");
        $("#sale_over_price").prop("value","");
        return false;
    }   
    
    searchForm.sale_below_price.value = minPrice;
    //searchForm.minvalue.value = minPrice;
    searchForm.sale_over_price.value = maxPrice;
    $("input:checkbox[name=check_price]").attr('checked',true);
    common.wlog("search_detail_price"); 
    //searchForm.submit();
    getDetailSearch();
}

function quickOnclick(){
    var searchForm = document.search;  
    if(document.getElementById("check_view").checked == true){
        searchForm.quickYn.value = "Y";
        $('input:checkbox[id="check_view2"]').attr('checked', true);
    }else{
        searchForm.quickYn.value = "N";
        $('input:checkbox[id="check_view2"]').attr('checked', false);
    }
    
    
    
    /*if(document.getElementById("check_view").checked == true){
        $("#check_view").prop('checked', false);
        $("#check_view2").prop('checked', false);
    }else{
        $("#check_view").prop('checked', true);
        $("#check_view2").prop('checked', true);
    }*/
    getDetailSearch();
}

function quickOnclick2(){
    var searchForm = document.search;  
    if(document.getElementById("check_view2").checked == true){
        searchForm.quickYn.value = "Y";
        $('input:checkbox[id="check_view"]').attr('checked', true);
    }else{
        searchForm.quickYn.value = "N";
        $('input:checkbox[id="check_view"]').attr('checked', false);
    }
    
    //if(document.getElementById("check_view2").checked == true){
    //    $("#check_view").prop('checked', false);
    //    $("#check_view2").prop('checked', false);
   // }else{
   //     $("#check_view").prop('checked', true);
   //     $("#check_view2").prop('checked', true);
   // }
    getDetailSearch();
    //searchForm.submit();
}

function save_close(){ 
    var searchForm = document.search;
    
    
        $("#mykeyword").hide();
        searchForm.save_flag.value == "0";      
        //alert($("#save_flag").val());
        $(".aa").hide();
        $(".bb").show();
        //alert("1111232");
    //searchForm.submit();
}

function save_open(){ 
    var searchForm = document.search;   
    
        $("#mykeyword").show();
        $(".aa").show();
        $(".bb").hide();    
    //searchForm.submit();
}

function clickCate1Search(){
    
    var cateId1 = String($('input:radio[name="cate_01"]:checked').val());       
    $('#disPlayCateId').val(cateId1);
    
    var cateId2 = String($('input:radio[name="cate_02"]:checked').val());       
    var cateName = "";
    if(cateId2.indexOf(cateId1)==-1){
     
        $('#cateId2').val('');
        $('input:radio[name="cate_02"]').removeAttr("checked");
        $('#selCateName').text($('input:radio[name="cate_01"]:checked').next().find('em').text());
        //alert($('input:radio[name="cate_01"]:checked').next().find('em').text());
    }else{
        $('#selCateName').text($('input:radio[name="cate_01"]:checked').next().find('em').text()+ ' > '+$('input:radio[name="cate_02"]:checked').next().find('em').text());
    }
    common.wlog("search_detail_category");
    getDetailSearch();   
}

function clickCate2Search(){
     
    var cateId2 = String($('input:radio[name="cate_02"]:checked').val());       
    $('#cateId2').val(cateId2);
    
    var cateId1 = String($('input:radio[name="cate_01"]:checked').val());    
    if(cateId2.indexOf(cateId1)==-1){
   
        $('#disPlayCateId').val('');
        $('input:radio[name="cate_01"]').removeAttr("checked");
        
    }
    cateName = $('input:radio[name="cate_01"]:checked').next().find('em').text();
    if(cateName!=''){
        cateName += ' > ';
    }
    cateName += $('input:radio[name="cate_02"]:checked').next().find('em').text();
    $('#selCateName').text(cateName);
    common.wlog("search_detail_category");
    getDetailSearch();   
}

function clickBrandSearch(){
    var brandCheck = "";
    var selBrandName = "";
    $("input:checkbox[name=brand_check]").each(function() { 
       
        if ($(this).attr("checked")) {
            if (brandCheck !== "") {
                brandCheck += "|";
                selBrandName += " , ";
            }
            brandCheck += $(this).val();
            selBrandName += $(this).next().find('em').text();
        }
    });
   // alert(selBrandName);
    $('#selBrandName').text(selBrandName);
    $('#brandCheck').val(brandCheck);
    common.wlog("search_detail_brand"); 
    getDetailSearch();   
}

function clickAttrSearch(idx){
    var attrCheck = "";
    var selattrName = "";
    $('input:checkbox[name=attr_check'+idx+']').each(function() { 
       
        if ($(this).attr("checked")) {
            if (attrCheck !== ""){
                attrCheck += "|";
                selattrName += " , ";
            }
             attrCheck += $(this).val();
             selattrName += $(this).next().find('em').text();
        }
    });
      
    $('#attrCheck'+idx).val(attrCheck);
    $('#selAttrName'+idx).text(selattrName);
    common.wlog("search_detail_attr"+(idx+1)); 
    getDetailSearch();   
}

function clickbenefitSearch(check){
    var benefitCheck = "";
    var searchForm = document.search; 
    var selbenefitName = "";
    
    var allcheck=true;
    $("input:checkbox[name=benefit_check]").each(function() {                 
        if (!$(this).attr("disabled")) {
            if ($(this).attr("checked")) {
                if (benefitCheck !== "") {
                    benefitCheck += "|";
                    selbenefitName += " , ";
                }
                benefitCheck+= $(this).val();
                selbenefitName += $(this).next().find('em').text();
            }else{
                allcheck=false;
            }
        }
    });
    $('#selbenefitName').text(selbenefitName);
    if(allcheck){
        $("input:checkbox[id=BenefitsName_all]").prop("checked",true);
        searchForm.BenefitAll_CHECK.value = "BenefitAll";
    }else{
        $("input:checkbox[id=BenefitsName_all]").prop("checked",false);
        searchForm.BenefitAll_CHECK.value = "";
    }
    searchForm.benefitCheck.value=benefitCheck;
    common.wlog("search_detail_benefit"); 
    getDetailSearch();   
}

function benefitAllclick(){
    var searchForm = document.search;
        
    if(searchForm.BenefitAll_CHECK.value == ""){
        $("input[name=benefit_check]").prop("checked",true);
        //searchForm.BenefitAll_CHECK.value = "BenefitAll";
        searchForm.disPlayBenefitName.value = "전체,쿠폰상품,세일상품,1+1,2+1,증정상품,무료배송"; 
    }else{
        $("input[name=benefit_check]").prop("checked",false);
        //searchForm.BenefitAll_CHECK.value = "";            
        //searchForm.disPlayBenefitName.value = "";
    }   
    clickbenefitSearch();
}

function getDetailSearch(){ 
    common.showLoadingLayer(false);
    var query = $("#query").val();  
    
    var viewResultCount = parseInt($("#listnum").val());
    var totalCount = parseInt($("#totalCount").val());
    var cateId1           =$("#cateId1").val();     
    var pageNumber = 0; 
    var goods_sort        =$("#goods_sort").val();
    var disPlayCateId     =$("#disPlayCateId").val();           // 1카테고리 ID 
    var cateId2           =$("#cateId2").val();                     // 2카테고리 ID
    var sale_below_price = $("#sale_below_price").val();    //최소가격
    var sale_over_price  = $("#sale_over_price").val();     //최대가격
    var brandCheck       = $('#brandCheck').val();          //브랜드 ID
    var benefitCheck     = $("#benefitCheck").val();        //혜택 ID
    var attrCheck0     = $("#attrCheck0").val();      //혜택 ID
    var attrCheck1   = $("#attrCheck1").val();      //혜택 ID
    var attrCheck2   = $("#attrCheck2").val();      //혜택 ID
    var attrCheck3   = $("#attrCheck3").val();      //혜택 ID
    var attrCheck4   = $("#attrCheck4").val();      //혜택 ID
    var authenticYn      = $("#authenticYn").val();
    var typeChk          = $("#typeChk").val();
    var onlyOneBrand     = $("#onlyOneBrand").val();
    var quickYn          = $("#quickYn").val();
    var checkCount = 0;  
     
     //console.log('sale_below_price::'+sale_below_price);
     //console.log('sale_over_price::'+sale_over_price);
    
	var keywordCallFlag = false;
	if(checkCount == 20 && totalCount > 30) {
		keywordCallFlag = true;
	}
    
    var brndShowYn = "N";
    var kwdShowYn = "N";
    
    if(checkCount > totalCount){
       return;
    }else{
        $.ajax({
          type: "POST",
          url: _baseUrl+"search/mSearchMainAjax.do",
          //dataType: "xml",
          data: { "query" : query , "startCount": checkCount, "goods_sort": goods_sort, "disPlayCateId": disPlayCateId, "cateId2": cateId2, "sale_below_price": sale_below_price, "sale_over_price": sale_over_price , "brandCheck":brandCheck, "benefitCheck":benefitCheck , "attrCheck0":attrCheck0 , "attrCheck1":attrCheck1 , "attrCheck2":attrCheck2 , "attrCheck3":attrCheck3 , "attrCheck4":attrCheck4,"authenticYn":authenticYn,"typeChk":typeChk,"onlyOneBrand":onlyOneBrand, "quickYn":quickYn, "brndShowYn":brndShowYn, "kwdShowYn" : kwdShowYn},
          async: false,
          success: function(dHtml) {            
            $("#ajaxList").html(dHtml);
            common.wish.init(); 
            
			var alignClass = $(".btnOne").hasClass("on") ? "" : "vertical";
			if(brndShowYn == "Y") {
				$("#recomm_brand").addClass(alignClass).append($("#inner_cura_brand"));
            	$("#inner_cura_brand").show();
            }
            
            if(kwdShowYn == "Y") {
            	$("#recomm_keyword").addClass(alignClass).append($("#inner_cura_keyword"));
            	$("#inner_cura_keyword").show();
            }
          },
          complete: function() {
            //pageNumber = pageNumber+1;              
            $("#pageNumber").val(pageNumber);
            $("#totalCount").val($("#detailTotaCnt").text());
            $('.search_results').find('.data').text($("#detailTotaCnt").text())
            
            
            if($("#detailTotaCnt").text()==0){
                $("#noresult_popword").show();
                //if ($("#curation_area")) {
                //$("#curation_area").show();
                   // $("#noresult_popword").show();
               // }
                //tempGoodsNo = $("#tempGoodsNo").text()
                //noresult_suddenKeyword();
                // 옴니채널 큐레이션 개선으로 주석처리
                /*if(!recoball){ 
                    callRecobell(query,'');
                    recoball = true;
                }*/
            }else if($("#detailTotaCnt").text()<3){
                $("#noresult_popword").show();
                //if ($("#curation_area")) {
                
                // 옴니채널 큐레이션 개선으로 주석처리
                /*$("#curation_area").show();
                if(!recoball){
                    callRecobell(query,'');
                    recoball = true;
                }*/    
               // }
                //tempGoodsNo = $("#tempGoodsNo").text();
                //noresult_suddenKeyword();
                //callRecobell(query,tempGoodsNo);
                //callRecobell(query,'');
            }else{
                
                $("#noresult_popword").hide();
                $("#curation_area").hide();

            }
     
            common.loadPage.setPageIdx(pageNumber);
            
            setTimeout(function() {
                //페이지 로딩 처리 클릭 이벤트처리
                common.loadPage.bindEvent();

            }, 100);
             //loadingLayer
            common.hideLoadingLayer();
          }
        });     
    }   
}

function benefitOnclic11k(BenefitName){

    var searchForm = document.search;
    var disPlayBenefitName = $("input[name=disPlayBenefitName]").val();
    var tmp_BenefitName = "";    
    
    if(disPlayBenefitName == "" || disPlayBenefitName == undefined){
        tmp_BenefitName = BenefitName;                        
    }else if(disPlayBenefitName.length > 0){
        disPlayBenefitName = disPlayBenefitName + "," + BenefitName;
        
        //브랜드 초기화
        var arr = disPlayBenefitName.split(",");
        
        if(disPlayBenefitName.indexOf("전체") != -1){
            arr.splice(0,1);
        }
        
        var num = 0;
        
        for(var x=0; x < arr.length; x ++){
           //체크된 브랜드명 동일 요소 값 체크
           if(arr[x] == BenefitName){
               num = num + 1;
           }
           
           //동일한 브랜드가 2번 선택했을 시 해당 브랜드 요소들을 삭제한다.
           if(num == 2){                                                   
               arr = jQuery.grep(arr, function(value) { return value != BenefitName; });
               //alert("arr>>"+arr);                       
           }           
        }
        
        //남은 브랜드명들 콤마구분으로 string 변환
        var returnBenefitName = arr.join(',');
        tmp_BenefitName = returnBenefitName;
    }        
    $('#brandTop').val($('.menu-mSearches .mCarea').scrollTop());
    searchForm.disPlayBenefitName.value = tmp_BenefitName;
    //혜택 개별 클릭 시, 전체 선택 공백 처리
    searchForm.BenefitAll_CHECK.value = "";   
    common.wlog("search_detail_benefit"); 
    //searchForm.submit();
}



//쿠키 전체 삭제
function deleteCookies(){
    myKeywords = "";
    
    if(confirm("최근 검색어를 모두 삭제 하시겠습니까?") == true){                
        setCookie_search("mykeyword", '', '-1');
        //alert("-111");
        
        showMyKeyword(myKeywords);
        
    }else{ //취소
        
        return;
    }
}

//최근검색어 - 검색
function recentSearchdo(query) {       
	var giftYn = common._giftCardCheck(query);
    location.href = _baseUrl + "search/getSearchMain.do?query=" + encodeURIComponent(query)+"&typeChk="+$('#typeChk').val() + "&giftYn=" + giftYn;    
}

$("#sale_below_price").click(function(){
    $("#sale_below_price").prop("value","");    
})

//상세검색 - 가격관련 스크립트
 $(function() {
          $(document).on("keyup", "#sale_over_price", function() {
                             
              var str = $("#sale_over_price").val();
              var org_price = str;
              
              var re = /,/gi;                                        
              var str_end_check = str.substring(str.length-1,str.length);            
              if($.isNumeric(str_end_check) == false && str != "" && str_end_check.indexOf(",") == -1){
                  
                      alert("숫자만 입력이 가능합니다.");
                      $("#sale_over_price").prop("value","");
                      $(this).val( $(this).val().replace(/[^0-9]/gi,"") );       
                      return false;                    
                  
              }
              
              //가격이 10억원 넘었을 경우 처리
              org_price = org_price.replace(/,/gi,"");                                                        
              if(parseInt(org_price) > 100000000){
                  alert("입력 범위를 넘었습니다");                  
                  return $("#sale_over_price").prop("value","");                  
              } 
                           
              if(str.length > 11){                                   
                  alert("입력 범위를 넘었습니다");                  
                  str = str.substring(0,11);
                  $("#sale_over_price").prop("value","");
                  //return false;
              }else{
                  //천원 단위 콤마 구분
                  str = str.replaceAll(",","");                      
                  str = comma(str);
                  return $("#sale_over_price").prop("value",str); 
              }         
              
          });
          
          $(document).on("keyup", "#sale_below_price", function() {
              
              var str = $("#sale_below_price").val();
              var org_price = str;
              
              var re = /,/gi;                                        
              var str_end_check = str.substring(str.length-1,str.length);
              //alert("str_end_check>>"+str_end_check);
              
              if($.isNumeric(str_end_check) == false && str != "" && str_end_check.indexOf(",") == -1){
                  
                      alert("숫자만 입력이 가능합니다.");
                      $("#sale_below_price").prop("value","");
                      $(this).val( $(this).val().replace(/[^0-9]/gi,"") );       
                      return false;                    
                  
              }
              
              //가격이 10억원 넘었을 경우 처리
              org_price = org_price.replace(/,/gi,"");                                                        
              if(parseInt(org_price) > 100000000){
                  alert("입력 범위를 넘었습니다");                  
                  return $("#sale_below_price").prop("value","");                  
              } 
                           
              if(str.length > 11){                                   
                  alert("입력 범위를 넘었습니다");                  
                  str = str.substring(0,11);
                  $("#sale_below_price").prop("value","");
                  //return false;
              }else{
                  //천원 단위 콤마 구분
                  str = str.replaceAll(",","");                      
                  str = comma(str);
                  return $("#sale_below_price").prop("value",str); 
              }
      });                          
 });

function comma(num){
    var len, point, str;  
       
    num = num + "";  
    point = num.length % 3 ;
    len = num.length;  
   
    str = num.substring(0, point);  
    while (point < len) {  
        if (str != "") str += ",";  
        str += num.substring(point, point + 3);  
        point += 3;  
    }  
     
    return str;
 
}

Array.prototype.remove = function(idx) {
    return (idx<0 || idx>this.length) ? this : this.slice(0, idx).concat(this.slice(idx+1, this.length));
}

function texDupArr(arr) {// 배열내에 중복된 요소 제거함수
    for(var i=0; i<arr.length; i++) {
        var checkDobl = 0;
        for(var j=0; j<arr.length; j++) {
            if(arr[i] != arr[j]) {
                continue;
            } else {
                checkDobl++;
                if(checkDobl>1){
                    spliced = arr.splice(j,1);
                }
            }
        }
    }
    return arr;
}

$(document).ready(function() {
    setTimeout(function() {
        //웹로그 바인딩
        bindSearchWebLog();
    }, 700);

});

//웹로그 바인딩
function bindSearchWebLog() {
    
    $("#ark_brand").bind("click", function() {    
        common.wlog("home_header_search_brand"); 
    });
    
    $("div.listSel button.btnOne").bind("click", function() {    
        common.wlog("search_list_gallery"); 
    });
    
    $("div.listSel button.btnTwo").bind("click", function() {    
        common.wlog("search_list_list"); 
    });
    
    $("div.mlist-mSearches ul li").bind("click", function() {    
        common.wlog("search_brand"); 
    });
    
    
} 


function callRecobell(srchwNm, goodsNo) {
    var url = _baseUrl + "search/getRecobellApiAjax.do";
    var param = {
            srchwNm : srchwNm,
            lgcGoodsNo : "",
            goodsNo : goodsNo,
    };
    
    var _callBackGetRecoBellContsInfo = function(data) {
        $(".curation_area").html("");
        $(".curation_area").html(data);
        
        $("#srch_keyword").text(srchwNm);
        
        $(".loading_cont").remove();
    };
    
    common.Ajax.sendRequest("POST",url,param,_callBackGetRecoBellContsInfo);
    setTimeout(function() {
        common.wlog("home_curation_area");
        common.wlog("home_search_curation0");
    }, 1000);
}
