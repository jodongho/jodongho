$.namespace("monthEvent.detail");
monthEvent.detail = {
    init : function(){
        monthEvent.detail.getCpnInfo();

        $('.eventView').append("<a href='javascript:monthEvent.detail.apply();'>임의 응모</a>");

        $(".span_search").click(function(){
            monthEvent.detail.getCpnInfo();
        });

        $("#cpnDiv4, #cpnDiv5, #cpnDiv6, .test:eq(1)").hide();

        $(".span_detail").click(function(){
            $("#cpnDiv4, #cpnDiv5, #cpnDiv6, .test").toggle();
        });
    },

    apply : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }
        var evtNo = "";
        if($("#profile").val() == "prod"){
            evtNo = "00000000006541";   //운영번호!!!!!!
        }else{
            evtNo = "00000000005829";   //QA
        }

        var param = {
                evtNo : evtNo
        }
        common.Ajax.sendRequest(
                "GET"
              , _baseUrl + "event/20190830_2/indexApply.do"
              , param
              , monthEvent.detail._callback_apply
        );
    },

    _callback_apply : function(json){
        if(json.ret == "0"){
            alert("완료");
        }else {
            alert(json.message);
        }
    },

    getCpnInfo : function(){
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
        }
        common.Ajax.sendRequest(
                "GET"
              , _baseUrl + "event/20190830_2/getCpnInfo.do"
              , param
              , monthEvent.detail._callback_getCpnInfo
        );
    },

    _callback_getCpnInfo : function(json){
        var cdList = json.cdList;
        var cpnLimitList = json.cpnLimitList;
        var cpnDownList = json.cpnDownList;
        var cpnTotalList = json.cpnTotalList;
        var text1 = "";
        var text2 = "";
        var text3 = "";
        var text4 = "";
        var text5 = "";
        var text6 = "";

        text1 += "<table border='1' style='width:95%;border-color:#333333'>";
        text1 += "<caption align='top' style='width:auto;height:auto;text-indent:0px;margin-bottom:5px;'><h3>코드정보 EVT111</h3></caption>";
        text1 += "<colgroup>";
        text1 += "<col width='15%'>";
        text1 += "<col width='19%'>";
        text1 += "<col width='19%'>";
        text1 += "<col width='20%'>";
        text1 += "<col width='*'>";
        text1 += "</colgroup>";
        text1 += "<tr bgcolor='#B0E0E6' height='25px' valign='middle'>";
        text1 += "<td align='center'><b>코드</b></td>";
        text1 += "<td align='center'><b>시작</b></td>";
        text1 += "<td align='center'><b>종료</b></td>";
        text1 += "<td align='center'><b>현재값</b></td>";
        text1 += "<td align='center'><b>수정할값</b></td>";
        text1 += "</tr>";

        var today = new Date();
        var hours = today.getHours();;
        var cd = "";

        if(hours < 6){
            cd = "01";
        }else if(hours >= 6 && hours < 12){
            cd = "02";
        }else if(hours >= 12 && hours < 18){
            cd = "03";
        }else if(hours >= 18){
            cd = "04";
        }

        $.each(cdList, function(idx, obj){
            text1 += "<tr height='25px' valign='middle'>";
            text1 += "<td align='center'>" + obj.cd + "</td>";
            text1 += "<td align='center'>" + obj.ref1Val + "</td>";
            text1 += "<td align='center'>" + obj.ref2Val + "</td>";
            text1 += "<td align='center'>" + obj.mrkNm + "</td>";
            if(obj.cd == cd){
                text1 += "<td align='center'>발급중</td>";
            }else{
                text1 += "<td align='center'>" + obj.total + "</td>";
            }
            text1 += "</tr>";
        });
        text1 += "</table>";
        text1 += "<h4>수정 할 값 = 선착순 설정 수량 + 쿠폰 누적 발급 수량</h4><br>";
        text1 += "<h4>조회시 시작시간과 종료시간에 포함되면</h4>";
        text1 += "<h4>쿠폰 발급중이므로 종료시간 후에 설정!!!</h4>";
        text1 += "<h4>수정할 값으로 공통코드 수정 필수!!!</h4>";
        $("#cpnDiv1").html(text1);

        text2 += "<table border='1' style='width:95%;border-color:#333333'>";
        text2 += "<caption align='top' style='width:auto;height:auto;text-indent:0px;margin-bottom:5px;'><h3>쿠폰 선착순 설정</h3></caption>";
        text2 += "<colgroup>";
        text2 += "<col width='*'>";
        text2 += "<col width='33%'>";
        text2 += "<col width='33%'>";
        text2 += "</colgroup>";
        text2 += "<tr bgcolor='#B0E0E6' height='25px' valign='middle'>";
        text2 += "<td align='center'><b>시작</b></td>";
        text2 += "<td align='center'><b>종료</b></td>";
        text2 += "<td align='center'><b>수량</b></td>";
        text2 += "</tr>";

        $.each(cpnLimitList, function(idx, obj){
            if(obj.RW == "2"){
                text2 += "<tr height='25px' valign='middle'>";
                text2 += "<td align='center'>" + obj.APLY_STRT_TIME + "</td>";
                text2 += "<td align='center'>" + obj.APLY_END_TIME + "</td>";
                text2 += "<td align='center'>" + obj.DD1_DNLD_PSB_CNT + "</td>";
                text2 += "</tr>";

            }
            if(obj.RW == "3"){
                text2 += "<tr height='25px' valign='middle' bgcolor='#FFFF7E'>";
                text2 += "<td colspan='2' align='center'>총합</td>";
                text2 += "<td align='center'>"+obj.DD1_DNLD_PSB_CNT+"</td>";
                text2 += "</tr>";
            }

        });

        text2 += "</table>";
        $("#cpnDiv2").html(text2);

        text3 += "<table border='1' style='width:95%;border-color:#333333'>";
        text3 += "<caption align='top' style='width:auto;height:auto;text-indent:0px;margin-bottom:5px;'><h3>쿠폰 발급 수량</h3></caption>";
        text3 += "<colgroup>";
        text3 += "<col width='*'>";
        text3 += "<col width='33%'>";
        text3 += "<col width='33%'>";
        text3 += "</colgroup>";
        text3 += "<tr bgcolor='#B0E0E6' height='25px' valign='middle'>";
        text3 += "<td align='center'><b>시작</b></td>";
        text3 += "<td align='center'><b>종료</b></td>";
        text3 += "<td align='center'><b>수량</b></td>";
        text3 += "</tr>";

        $.each(cpnTotalList, function(idx, obj){

            if(obj.RW == "2"){
                text3 += "<tr height='25px' valign='middle'>";
                text3 += "<td align='center'>" + obj.APLY_STRT_TIME + "</td>";
                text3 += "<td align='center'>" + obj.APLY_END_TIME + "</td>";
                text3 += "<td align='center'>" + obj.DOWN_NUM + "</td>";
                text3 += "</tr>";
            }
            if(obj.RW == "3"){
                text3 += "<tr height='25px' valign='middle' bgcolor='#FFFF7E'>";
                text3 += "<td colspan='2' align='center'>총합</td>";
                text3 += "<td align='center'>"+obj.DOWN_NUM+"</td>";
                text3 += "</tr>";
            }

        });

        text3 += "</table>";
        $("#cpnDiv3").html(text3);

        text4 += "<table border='1' style='width:95%;border-color:#333333'>";
        text4 += "<caption align='top' style='width:auto;height:auto;text-indent:0px;margin-bottom:5px;'><h3>쿠폰 선착순 설정</h3></caption>";
        text4 += "<colgroup>";
        text4 += "<col width='*'>";
        text4 += "<col width='15%'>";
        text4 += "<col width='15%'>";
        text4 += "<col width='15%'>";
        text4 += "<col width='15%'>";
        text4 += "<col width='15%'>";
        text4 += "</colgroup>";
        text4 += "<tr bgcolor='#B0E0E6' height='25px' valign='middle'>";
        text4 += "<td align='center'><b>쿠폰번호</b></td>";
        text4 += "<td align='center'><b>할인율</b></td>";
        text4 += "<td align='center'><b>시작</b></td>";
        text4 += "<td align='center'><b>종료</b></td>";
        text4 += "<td align='center'><b>일수량</b></td>";
        text4 += "<td align='center'><b>기간내</b></td>";
        text4 += "</tr>";

        $.each(cpnLimitList, function(idx, obj){

            if(obj.RW == "1"){
                text4 += "<tr height='25px' valign='middle'>";
                text4 += "<td align='center'>" + obj.CPN_NO + "</td>";
                text4 += "<td align='center'>" + obj.RT_AMT_VAL + "</td>";
                text4 += "<td align='center'>" + obj.APLY_STRT_TIME + "</td>";
                text4 += "<td align='center'>" + obj.APLY_END_TIME + "</td>";
                text4 += "<td align='center'>" + obj.DD1_DNLD_PSB_CNT + "</td>";
                text4 += "<td align='center'>" + obj.DNLD_PSB_CNT + "</td>";
                text4 += "</tr>";
            }else if(obj.RW == "2"){
                text4 += "<tr height='25px' valign='middle' bgcolor='#ADFFA6'>";
                text4 += "<td colspan='4'  align='center'>소계("+obj.APLY_STRT_TIME+"~"+obj.APLY_END_TIME+")</td>";
                text4 += "<td align='center'>"+obj.DD1_DNLD_PSB_CNT+"</td>";
                text4 += "<td align='center'>"+obj.DNLD_PSB_CNT+"</td>";
                text4 += "</tr>";
            }else if(obj.RW == "3"){
                text4 += "<tr height='25px' valign='middle' bgcolor='#FFFF7E'>";
                text4 += "<td colspan='4' align='center'>총합</td>";
                text4 += "<td align='center'>"+obj.DD1_DNLD_PSB_CNT+"</td>";
                text4 += "<td align='center'>"+obj.DNLD_PSB_CNT+"</td>";
                text4 += "</tr>";
            }

        });

        text4 += "</table>";
        $("#cpnDiv4").html(text4);

        text5 += "<table border='1' style='width:95%;border-color:#333333'>";
        text5 += "<caption align='top' style='width:auto;height:auto;text-indent:0px;margin-bottom:5px;'><h3>쿠폰 다운로드 수량</h3></caption>";
        text5 += "<colgroup>";
        text5 += "<col width='*'>";
        text5 += "<col width='25%'>";
        text5 += "<col width='25%'>";
        text5 += "<col width='25%'>";
        text5 += "</colgroup>";
        text5 += "<tr bgcolor='#B0E0E6' height='25px' valign='middle'>";
        text5 += "<td align='center'><b>일자</b></td>";
        text5 += "<td align='center'><b>시작</b></td>";
        text5 += "<td align='center'><b>종료</b></td>";
        text5 += "<td align='center'><b>수량</b></td>";
        text5 += "</tr>";

        $.each(cpnTotalList, function(idx, obj){
            if(obj.RW == "1"){
                text5 += "<tr height='25px' valign='middle'>";
                text5 += "<td align='center'>" + obj.ISSU_DTIME + "</td>";
                text5 += "<td align='center'>" + obj.APLY_STRT_TIME + "</td>";
                text5 += "<td align='center'>" + obj.APLY_END_TIME + "</td>";
                text5 += "<td align='center'>" + obj.DOWN_NUM + "</td>";
                text5 += "</tr>";
            }else if(obj.RW == "2"){
                text5 += "<tr height='25px' valign='middle' bgcolor='#ADFFA6'>";
                text5 += "<td colspan='3' align='center'>소계("+obj.APLY_STRT_TIME+"~"+obj.APLY_END_TIME+")</td>";
                text5 += "<td align='center'>"+obj.DOWN_NUM+"</td>";
                text5 += "</tr>";
            }else if(obj.RW == "3"){
                text5 += "<tr height='25px' valign='middle' bgcolor='#FFFF7E'>";
                text5 += "<td colspan='3' align='center'>총합</td>";
                text5 += "<td align='center'>"+obj.DOWN_NUM+"</td>";
                text5 += "</tr>";
            }

        });

        text5 += "</table>";
        $("#cpnDiv5").html(text5);

        text6 += "<table border='1' style='width:95%;border-color:#333333'>";
        text6 += "<caption align='top' style='width:auto;height:auto;text-indent:0px;margin-bottom:5px;'><h3>쿠폰 다운로드 수량(상세)</h3></caption>";
        text6 += "<colgroup>";
        text6 += "<col width='15%'>";
        text6 += "<col width='*'>";
        text6 += "<col width='25%'>";
        text6 += "<col width='15%'>";
        text6 += "<col width='15%'>";
        text6 += "<col width='15%'>";
        text6 += "</colgroup>";
        text6 += "<tr bgcolor='#B0E0E6' height='25px' valign='middle'>";
        text6 += "<td align='center'><b>일자</b></td>";
        text6 += "<td align='center'><b>쿠폰번호</b></td>";
        text6 += "<td align='center'><b>할인율</b></td>";
        text6 += "<td align='center'><b>시작</b></td>";
        text6 += "<td align='center'><b>종료</b></td>";
        text6 += "<td align='center'><b>수량</b></td>";
        text6 += "</tr>";

        $.each(cpnDownList, function(idx, obj){

            if(obj.RW == "1"){
                text6 += "<tr height='25px' valign='middle'>";
                text6 += "<td align='center'>" + obj.ISSU_DTIME + "</td>";
                text6 += "<td align='center'>" + obj.CPN_NO + "</td>";
                text6 += "<td align='center'>" + obj.RT_AMT_VAL + "</td>";
                text6 += "<td align='center'>" + obj.APLY_STRT_TIME + "</td>";
                text6 += "<td align='center'>" + obj.APLY_END_TIME + "</td>";
                text6 += "<td align='center'>" + obj.DOWN_NUM + "</td>";
                text6 += "</tr>";
            }else if(obj.RW == "2"){
                text6 += "<tr height='25px' valign='middle' bgcolor='#ADFFA6'>";
                text6 += "<td align='center'>" + obj.ISSU_DTIME + "</td>";
                text6 += "<td colspan='4' align='center'>소계("+obj.APLY_STRT_TIME+"~"+obj.APLY_END_TIME+")</td>";
                text6 += "<td align='center'>"+obj.DOWN_NUM+"</td>";
                text6 += "</tr>";
            }else if(obj.RW == "3"){
                text6 += "<tr bgcolor='#FAE0D4' height='25px' valign='middle'>";
                text6 += "<td align='center'>" + obj.ISSU_DTIME + "</td>";
                text6 += "<td colspan='4' align='center'>합계</td>"
                text6 += "<td align='center'>"+obj.DOWN_NUM+"</td>";
                text6 += "</tr>";
            }else if(obj.RW == "4"){
                text6 += "<tr bgcolor='#FFFF7E' height='25px' valign='middle'>";
                text6 += "<td colspan='5' align='center'>총합</td>"
                text6 += "<td align='center'>"+obj.DOWN_NUM+"</td>";
                text6 += "</tr>";
            }
        });
        text6 += "</table>";
        $("#cpnDiv6").html(text6);
    }
}
