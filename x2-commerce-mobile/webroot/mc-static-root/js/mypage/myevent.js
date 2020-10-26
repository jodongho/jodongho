$.namespace("mmypage.event");
mmypage.event = {

    termType : -1,
    _ajax : common.Ajax,

    init : function(){

        mmypage.event.checkTermType();
        $("#term").change(function(){
            mmypage.event.termType = $("#term option:selected").val();
            location.href = _baseUrl + "mypage/getMyEventList.do?termType="+ mmypage.event.termType;
        });
    },

    checkTermType : function(){
        var termType = $("#termType").val();

        if(common.isEmpty(termType)){
            termType = -1;
        }

        mmypage.event.termType = termType;
        mmypage.event.getMyEventListAjax();
    },

    getMyEventListAjax : function(){

        PagingCaller.destroy(); // 기존 페이징 해지

        PagingCaller.init({
            callback : function(){
                var param = {
                    pageIdx : PagingCaller.getNextPageIdx(),
                    termType : mmypage.event.termType
                }

                common.Ajax.sendJSONRequest(
                        "GET"
                        , _baseUrl + "mypage/getMyEventListJson.do"
                        , param
                        , mmypage.event._callback_getMyEventListAjax);
            }
            ,startPageIdx : 0
            ,subBottomScroll : 700
            ,initCall :  true
        });


    },

    _callback_getMyEventListAjax : function(strData){

        if(strData.ret == -1){
            common.loginChk();
        }else{
            mmypage.event.dispMyEventList(strData);
        }
    },

    dispMyEventList : function(strData){

        var dispArea = $(".inBox5");

        var myEventList = strData.myEventList;
        var listCount = myEventList.length;
        var pageIdx = strData.pageIdx;
        var term = strData.termType;

        if(pageIdx == 1){
           dispArea.empty();
        }

        if(listCount <= 0 ){
            if(pageIdx == 1){
                var $divNo = $("<div>").addClass("sch_no_data2 pdzero");
                var $p = $("<p>");
                $p.text("참여하신 이벤트가 없습니다");
                $divNo.append($p);
                dispArea.append($divNo);
            }else{
                PagingCaller.destroy();
            }

        }else {
            var $ulEvent = $("<ul>").addClass("myEventList");
            dispArea.append($ulEvent);

            $.each(myEventList, function(index, element){
                var $li = $("<li>");
                $ulEvent.append($li);

                var $aTag = $("<a>").attr("href","javascript:;");
                $li.append($aTag);

                var $span = $("<span>").addClass("type");
                $aTag.append($span);


                var $spanTag = $("<span>").addClass(element.evtPrgsStatClssName).text(element.evtPrgsStatName);
                $span.append($spanTag);
                var $spanTime = $("<span>").addClass("data").append(element.eDtime).append(element.sDtime);
                $span.append($spanTime);

                var $strong = $("<strong>").text(element.evtNm);
                $aTag.append($strong);

                if(element.evtPrgsStatClssName == 'ing'){
                    $aTag.click(function(){
                        if(!common.isEmpty(element.frdmCmpsUrlAddr)){
                            common.link.commonMoveUrl(element.frdmCmpsUrlAddr);
                        }else{
                            common.link.moveEventDetailPage(element.evtNo);
                        }
                    });
                }


                if(element.evtPrgsStatClssName == 'end'){

                    var $divBtn = $("<div>").addClass("btnBox");

                    if(element.ntcSeq !=null && element.ntcSeq !=""){
	                    var $buttonWin = $("<button>").addClass("btnGrayH30")
	                                              .attr("type","button")
	                                              .text("당첨자 발표");
	                    $buttonWin.click(function(){
	                        if(common.isEmpty(element.ntcSeq)){
	                            alert("당첨자 발표 페이지가 없습니다");
	                            return;
	                        }
	                        common.link.moveNtcDetail('',element.ntcSeq);
	                    });
                    }

	                $divBtn.append($buttonWin);

                    $li.append($divBtn);
                }

            });
        }

    }


};



