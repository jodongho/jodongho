$.namespace("monthEvent.detail");
monthEvent.detail = {
    currentDay : null,
    init : function(){
        monthEvent.detail.currentDay = $("input[id='imgUrlConnectDay']:hidden").val();
        monthEvent.detail.getStampList1();
        monthEvent.detail.getStampList2();
        monthEvent.detail.getStampList3();
    },

    /* 로그인한 회원 출석 현황 조회 */
    getStampList1 : function(){
        var evtNo = "";

        if($("#profile").val() == "prod"){
            evtNo = '00000000006543';
        }else{
            evtNo = '00000000005827';
        }

        var param = {
            evtNo : evtNo,
            startDate : "20190901",
            fvrSeq : "34"
        }

        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20190901_1/getStampList.do"
              , param
              , monthEvent.detail._callback_getStampList1
        );
    },

    _callback_getStampList1 : function(json){
        if(json.ret == "0"){
            var html = "<table>";
            html += "<caption align='top' style='width:auto;height:auto;text-indent:0px;margin-bottom:5px;'><h3>9월</h3></caption>";
            html += "<tr>";
            html += "<td>일자</td>";
            html += "<td>건수</td>";
            html += "</tr>";

            $.each(json.stampList, function(idx, obj){
                html += "<tr>";
                html += "<td>" + obj.sDtime + "</td>";
                html += "<td align='right'>" + obj.winCnt + "</td>";
                html += "</tr>";
            });
            html += "</table>";

            $("#divStamp1").html(html);
        }
    },

    /* 로그인한 회원 출석 현황 조회 */
    getStampList2 : function(){
        var evtNo = "";

        if($("#profile").val() == "prod"){
            evtNo = '00000000006599';
        }else{
            evtNo = '00000000005832';
        }

        var param = {
            evtNo : evtNo,
            startDate : "20191001",
            fvrSeq : "35"
        }

        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20190901_1/getStampList.do"
              , param
              , monthEvent.detail._callback_getStampList2
        );
    },

    _callback_getStampList2 : function(json){
        if(json.ret == "0"){
            var html = "<table>";
            html += "<caption align='top' style='width:auto;height:auto;text-indent:0px;margin-bottom:5px;'><h3>10월</h3></caption>";
            html += "<tr>";
            html += "<td>일자</td>";
            html += "<td>건수</td>";
            html += "</tr>";

            $.each(json.stampList, function(idx, obj){
                html += "<tr>";
                html += "<td>" + obj.sDtime + "</td>";
                html += "<td align='right'>" + obj.winCnt + "</td>";
                html += "</tr>";
            });
            html += "</table>";

            $("#divStamp2").html(html);
        }
    },

    /* 로그인한 회원 출석 현황 조회 */
    getStampList3 : function(){
        var evtNo = "";

        if($("#profile").val() == "prod"){
            evtNo = '00000000006639';
        }else{
            evtNo = '00000000005928';
        }

        var param = {
            evtNo : evtNo,
            startDate : "20191101",
            fvrSeq : "34"
        }

        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20190901_1/getStampList.do"
              , param
              , monthEvent.detail._callback_getStampList3
        );
    },

    _callback_getStampList3 : function(json){
        if(json.ret == "0"){
            var html = "<table>";
            html += "<caption align='top' style='width:auto;height:auto;text-indent:0px;margin-bottom:5px;'><h3>11월</h3></caption>";
            html += "<tr>";
            html += "<td>일자</td>";
            html += "<td>건수</td>";
            html += "</tr>";

            $.each(json.stampList, function(idx, obj){
                html += "<tr>";
                html += "<td>" + obj.sDtime + "</td>";
                html += "<td align='right'>" + obj.winCnt + "</td>";
                html += "</tr>";
            });
            html += "</table>";

            $("#divStamp3").html(html);
        }
    }
}