$.namespace("prvsuser.cyberAudit");
prvsuser.cyberAudit = {
    events : 'input paste change',
    totFileSize : 0,
    totTxtSize : 0,
    totSizeSum : 0,
    limitByte : 0,
    limitCnt : 0,
    limitTotByte : 0,

    init : function() {
        prvsuser.cyberAudit.limitByte = $("#limitByte").val();
        prvsuser.cyberAudit.limitCnt = $("#limitCnt").val();
        prvsuser.cyberAudit.limitTotByte = $("#limitByte").val();
        prvsuser.cyberAudit.bindEvent();
    },
    
    bindEvent : function(){
        var fileUploadHtml = "";
        
        $('.event_agree .tit > a').click(function(e){
            e.preventDefault();
            if($(this).parents('li').hasClass('on')){
                $(this).parents('li').removeClass('on');
            } else {
                $(this).parents('li').addClass('on').siblings().removeClass('on');
            }
        });
        
        $("#name").on(prvsuser.cyberAudit.events, function(event){
            prvsuser.cyberAudit.checkMaxSize($("#name"), 25);
        });
        
        /*
        $(".notHangle").keyup(function(){
            if($(this).val().match(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\~\`\넵!\@\#\$\%\^\&\*\(\)\+\=\{\}\[\]\\:\;\"\'\<\,\>\?\/]/g)){
                    alert("이메일주소는 영문 , 숫자 및 특수문자 .-_ 만 입력이 가능합니다.");
                }
                $(this).val( $(this).val().replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\~\`\!\@\#\$\%\^\&\*\(\)\+\=\{\}\[\]\\:\;\"\'\<\,\>\?\/]/g, "") );
            } 
        );
        */
        
        $("#emailAddr2").on(prvsuser.cyberAudit.events, function(){
            prvsuser.cyberAudit.checkMaxSize($("#emailAddr2"), 50);
        });

        $("#titleTxt").on(prvsuser.cyberAudit.events, function(){
            prvsuser.cyberAudit.checkMaxSize($("#titleTxt"), 50);
        });

        $(".textarea").find("#btnFile").bind('click', function() {
        	//2018.11.14 안드로이드 5.0미만 앱 접속시 첨부파일 등록 제한
            var androidCheck = 'N';
            
            if (common.app != undefined  && common.app.appInfo != undefined && common.app.appInfo.isapp) {
            	if (common.app.appInfo.ostype == "20") {
            		 // 안드로이드 5.0 미만에서만 스킴적용
            		if(common.app.appInfo.osver.indexOf(".") > -1){
            			var aosAppVersion = common.app.appInfo.osver.split(".")[0];
            			if(aosAppVersion < 5){
                        	androidCheck = 'Y';
                        }
                    }
            	}
            }

            if(androidCheck =='N' ){
            var fileCnt = $(".audit_01 .textarea").find("#fileList .btnFileAdd").length;

            for(var i = 0; i < fileCnt; i++) {
                if (common.isEmpty($(".audit_01 .textarea").find("#fileList .btnFileAdd").eq(i).val())) {
                    $("#fileList div").eq(i).remove();
                }
            }

            if(fileCnt == 0 || ((fileCnt > 0 && fileCnt < prvsuser.cyberAudit.limitCnt) && $(".audit_01 .textarea").find("#fileList .btnFileAdd").eq(fileCnt-1).val() != '')){
                fileUploadHtml = "<div><input type='file' id='inputFile"+fileCnt+"' name='auditFile' class='btnFileAdd' value='첨부파일' title='첨부파일 선택' accept='*/*'>";
                fileUploadHtml += "<span class='file mo_filename' id='fileName' style='display:inline-block;'><span></span><button type='button' id='btnFileDelete' name='btnFileDelete' class='ButtonDelete' style='display:none'>삭제</button></span></div>";
                $(".audit_01 .textarea").find("#fileList").append(fileUploadHtml);
            }else if(fileCnt == prvsuser.cyberAudit.limitCnt){
                alert("첨부파일은 10개 미만으로 첨부 가능하며, 제보 내용을 포함하여 최대 5MB까지 전송 가능합니다.");
                return;
            }

            fileCnt = $(".audit_01 .textarea").find(".file .btnFileAdd").length;

            if(fileCnt <= prvsuser.cyberAudit.limitCnt){
                setTimeout(function() {
                    // File Add
                    $(".audit_01 .textarea").find("#fileList .btnFileAdd").eq(fileCnt-1).click();
                }, 100);

                prvsuser.cyberAudit.fileAddEvent(fileCnt);
                prvsuser.cyberAudit.removeFileAdd(fileCnt);
            }
            }else{
            	alert("불편을 드려 죄송합니다. 안드로이드 5.0버전 이상에서만 작동하오니 첨부 필요 시 PC버전을 사용해주시기 바랍니다.");
            	}
        });

        $("#emailAddrSelect").change(function(){
            if($("#emailAddrSelect").val() == '-1') {
                $("#emailAddr2").val("");
                $("#emailAddr2").prop("disabled", false);
            }else{
                $("#emailAddr2").val($("#emailAddrSelect").val());
                $("#emailAddr2").prop("disabled", true);
            }
        });
        
        $("#cellTxnoNo, #cellEndNo").keyup(function(event) {
            prvsuser.cyberAudit.changeNumber($(this),event);
        });
        
        $("[name='auditCont']").keyup(function(){
            prvsuser.cyberAudit.checkByte();
        });
        
        $("#regBtn").bind('click', function(){
           prvsuser.cyberAudit.auditSubmit();
        });
        
        $("#cancelBtn").bind('click', function(){
           prvsuser.cyberAudit.cancelRegBtn(); 
        });
    },

    validChk : function() {
        if ($("[name='name']").val() == "") {
            alert("이름을 입력해 주세요")
            $("[name='name']").focus();
            return false;
        }
        
        if($("[name='emailAddr1']").val() == '' && $("[name='emailAddr2']").val() == ''){
            alert("이메일 주소를 입력해 주세요.");
            $("[name='emailAddr1']").focus();
            return false;
        }
        
        if($("[name='emailAddr2']").val() != '' && $("[name='emailAddr1']").val() == ''){
            alert("이메일 주소를 입력해 주세요.");
            $("[name='emailAddr1']").focus();
            return false;
        }
        
        if($("[name='emailAddr2']").val() == '' && $("[name='emailAddr1']").val() != ''){
            alert("이메일 도메인을 입력해 주세요.");
            $("[name='emailAddr2']").focus();
            return false;
        }

        if($("[name='emailAddr1']").val() != '' || $("[name='emailAddr2']").val() != ''){
            if ($("#emailAddrSelect").val() == "-1") {
                var regExp = /^[_0-9a-zA-Z-]+(\.[_0-9a-zA-Z-]+){1,2}$/;
                var emailAddr1= $("[name='emailAddr1']").val();
                var emailAddr2= $("[name='emailAddr2']").val();
                if($("[name='emailAddr1']").val().indexOf("@") != -1 || !emailAddr2.match(regExp)){
                    alert("올바른 이메일 형식이 아닙니다.");
                    return false;
                }
                $("[name='emailAddr']").val($("[name='emailAddr1']").val() +"@"+ $("[name='emailAddr2']").val());
                
            } else { // 직접입력이 아닌 경우
                if($("[name='emailAddr1']").val().indexOf("@") != -1){
                    alert("올바른 이메일 형식이 아닙니다.");
                    return false;
                }
                $("[name='emailAddr']").val($("[name='emailAddr1']").val() +"@"+ $("#emailAddrSelect").val());
            }
        }

        if ($("[name=cellTxnoNo]").val() == "") {
            alert("연락처를 입력해 주세요");
            $("[name=cellTxnoNo]").focus();
            return false;
        }
        
        if($("[name=cellTxnoNo]").val() == "") {
            alert("연락처 가운데 자리를 입력해 주세요");
            $("[name=cellTxnoNo]").focus();
            return false;
        }

        if($("[name=cellTxnoNo]").val().length < 3 ){
            alert("연락처 가운데 자리는 3자~4자까지만 입력가능합니다.");
            $("[name=cellTxnoNo]").focus();
            return false;
        }
        
        if($("[name=cellEndNo]").val() == "") {
            alert("연락처 마지막 4자리를 입력해 주세요");
            $("[name=cellEndNo]").focus();
            return false;
        }
        
        if($("[name=cellEndNo]").val().length < 4 ){
            alert("연락처 마지막 자리는 4자만 입력가능합니다.");
            $("[name=cellEndNo]").focus();
            return false;
        }

        if ($("[name=cellEndNo]").val() == "") {
            alert("연락처를 입력해 주세요");
            $("[name=cellEndNo]").focus();
            return false;
        }
        var phoneNum = $("[name=cellSctNo]").val() + "-" + $("[name=cellTxnoNo]").val() + "-" + $("[name=cellEndNo]").val();
        $("[name='cellNo']").val(phoneNum);
        
        if ($("[name='titleTxt']").val().length == 0 || $.trim($("[name='titleTxt']").val()) == "") {
            alert("제목을 입력해 주세요");
            $("[name='titleTxt']").focus();
            return false;
        }

        if ($("[name='auditCont']").val().length == 0 || $.trim($("[name='auditCont']").val()) == "") {
            alert("제보 내용을 입력해 주세요");
            $("[name='auditCont']").focus();
            return false;
        }
        
        fileCnt = $(".audit_01 .textarea").find(".file .btnFileAdd").length;
        for(var i = 0; i < fileCnt; i++) {
            if (common.isEmpty($(".audit_01 .textarea").find("#fileList .btnFileAdd").eq(i).val())) {
                $("#fileList div").eq(i).remove();
            }
        }
        fileCnt = $(".audit_01 .textarea").find(".file .btnFileAdd").length;

        if (prvsuser.cyberAudit.totFileSize > prvsuser.cyberAudit.limitTotByte) {
            alert("첨부파일은 10개 미만으로 첨부 가능하며, 제보 내용을 포함하여 최대 5MB까지 전송 가능합니다.");
            return;
        };

        if($("#inpChkAgree1").is(":checked") == false){
            alert("개인정보 수집 및 이용동의를 하셔야 제보 등록이 가능합니다.");
            return false;
        }

/*        if($("#inpChkAgree2").is(":checked") == false){
            alert("개인정보 제3자 제공동의를 하셔야 제보 등록이 가능합니다. ");
            return false;
        }
        */
        

        return true;
    },

    /**
     * 입력된 문자열을 사이즈만큼 잘라서 리턴
     */
    checkMaxSize : function(_input, size) {
        var str = _input.val();
        if(str.length > size) {
            alert("최대 " + size + "자까지 입력가능합니다.");
            var pos = _input[0].selectionEnd;
            var endStr = str.substring(pos, str.length);
            var startStr = str.substr(0, size-endStr.length);
            _input.val(startStr+endStr);
            _input[0].setSelectionRange(startStr.length,startStr.length);
        }
    },
    
    changeNumber : function (obj,event) {
        var pattern = /[^0-9]/g;
        var str = obj.val();

        if (pattern.test(str)) {
            var v_result = str.replace(pattern, '');
            obj.val(v_result);
            event.preventDefault();
        }
    },

    fileAddEvent : function(fileCnt){
        // 파일첨부시 파일명 노출
        $(".btnFileAdd").change(function() {
            var fileVal = "";
            var fileNm = "";
            var fileSize = "";

            if(navigator.appName=="Microsoft Internet Explorer"){
                fileVal =  $(".audit_01 .textarea").find("#fileList .btnFileAdd").eq(fileCnt-1).val().split("\\");
                fileNm = fileVal[fileVal.length-1];
                fileSize = $(".audit_01 .textarea").find("#fileList .btnFileAdd").eq(fileCnt-1).size;
            }else{
                if($(".audit_01 .textarea").find("#fileList .btnFileAdd")[fileCnt-1].files[0] != 'undefined') {
                    fileNm = $(".audit_01 .textarea").find("#fileList .btnFileAdd")[fileCnt-1].files[0].name;
                    fileSize = $(".audit_01 .textarea").find("#fileList .btnFileAdd")[fileCnt-1].files[0].size;
                }
            }
            
            var fileExt =/\.(doc|docx|xls|xlsx|ppt|pptx|pps|cell|nxl|nxt|show|hpt|hwp|hwpx|hwt|gul|pdf|txt|jpg|jpeg|gif|bmp|png|tiff|mp3||wmv|wav|asf|wma|ogg|mkv|mp4|avi|mov)$/i;

            if ( !common.isEmpty(fileNm) && !fileNm.match(fileExt)) {
                alert("등록할 수 없는 파일 형식입니다.");

                setTimeout(function() {
                    $("#fileList div").last().remove();
                }, 100);
                return;
            };

            prvsuser.cyberAudit.totFileSize = prvsuser.cyberAudit.totFileSize + fileSize;
            prvsuser.cyberAudit.totSizeSum = prvsuser.cyberAudit.totFileSize + prvsuser.cyberAudit.totTxtSize;
            //5 * 1024 * 1024
            if (prvsuser.cyberAudit.totSizeSum > prvsuser.cyberAudit.limitTotByte) {
                $(".audit_01 .textarea").find("#fileList .btnFileAdd").eq(fileCnt-1).val("");
                prvsuser.cyberAudit.totFileSize = prvsuser.cyberAudit.totFileSize - fileSize;
                prvsuser.cyberAudit.totSizeSum = prvsuser.cyberAudit.totFileSize + prvsuser.cyberAudit.totTxtSize;
                alert("첨부파일은 10개 미만으로 첨부 가능하며, 제보 내용을 포함하여 최대 5MB까지 전송 가능합니다.");
                return;
            }else if (fileSize > prvsuser.cyberAudit.limitByte) {
                $(".audit_01 .textarea").find("#fileList .btnFileAdd").eq(fileCnt-1).val("");
                prvsuser.cyberAudit.totFileSize = prvsuser.cyberAudit.totFileSize - fileSize;
                prvsuser.cyberAudit.totSizeSum = prvsuser.cyberAudit.totFileSize + prvsuser.cyberAudit.totTxtSize;
                alert("첨부파일은 10개 미만으로 첨부 가능하며, 제보 내용을 포함하여 최대 5MB까지 전송 가능합니다.");
                return;
            }

            if (!common.isEmpty($(".audit_01 .textarea").find("#fileList .btnFileAdd").eq(fileCnt-1).val())) {
                $(".audit_01 .textarea").find("#fileList #fileName span").eq(fileCnt-1).attr("style","visibility:visible");
                $(".audit_01 .textarea").find("#fileList #btnFileDelete").eq(fileCnt-1).attr("style","display:inline-block");
                $("span.file span").eq(fileCnt-1).text(fileNm);
            } else {
                $("#fileList div").eq(fileCnt-1).remove();
                
            }
        });
    },

    checkByte : function(){
        var totalByte = 0;
        var currentByte = 0;
        var auditCont = $("[name='auditCont']").val();
        var limitTxt = prvsuser.cyberAudit.limitTotByte - prvsuser.cyberAudit.totFileSize;
        var chgTxt = "";
        
        if(prvsuser.cyberAudit.totSizeSum >= prvsuser.cyberAudit.limitTotByte) { //5242880
            chgTxt = auditCont.substring(0,limitTxt);
            $("[name='auditCont']").val(chgTxt);
            alert("첨부파일은 10개 미만으로 첨부 가능하며, 제보 내용을 포함하여 최대 5MB까지 전송 가능합니다.");
        }
        
        auditCont = $("[name='auditCont']").val();
        for(var i =0; i < auditCont.length; i++) {
            currentByte = auditCont.charCodeAt(i);
            
            if(currentByte > 128) totalByte += 2;
            else totalByte++;
        }

        prvsuser.cyberAudit.totTxtSize = totalByte;
        prvsuser.cyberAudit.totSizeSum = prvsuser.cyberAudit.totFileSize + prvsuser.cyberAudit.totTxtSize;
    },

    removeFileAdd : function(fileCnt){
        $(".audit_01 .textarea").find(".ButtonDelete").eq(fileCnt-1).bind('click', function(){
            var fileSize = "";

            if(navigator.appName=="Microsoft Internet Explorer"){
                if($(".audit_01 .textarea").find("#fileList .btnFileAdd").eq(fileCnt-1).value.substring($(".btnFileAdd")[0]) != 'undefined'){
                    var fso = new ActiveXObject("Scripting.FileSystemObject");
                    var filepath = $(".audit_01 .textarea").find("#fileList .btnFileAdd").val();
                    var file = fso.getFile(filepath);
                    fileSize = file.size;
                }
            }else{
                if($(".audit_01 .textarea").find("#fileList .btnFileAdd")[fileCnt-1].files[0] != 'undefined') {
                    fileSize = $(".audit_01 .textarea").find("#fileList .btnFileAdd")[fileCnt-1].files[0].size;
                }
            }

            var idx =  $("#fileList .ButtonDelete").index(this);
            $("#fileList div").eq(idx).remove();
            prvsuser.cyberAudit.totFileSize = prvsuser.cyberAudit.totFileSize - fileSize;
            prvsuser.cyberAudit.totSizeSum = prvsuser.cyberAudit.totFileSize + prvsuser.cyberAudit.totTxtSize;
            
            $(".audit_01 .textarea").find(".ButtonDelete").unbind();
            var newLen = $(".audit_01 .textarea").find(".file .btnFileAdd").length;
            for(var i=0; i<newLen; i++){
                prvsuser.cyberAudit.removeFileAdd(i+1);
            }
        });
    },

    cancelRegBtn : function(){
        if(confirm("작성한 내용이 초기화 됩니다. 취소 하시겠습니까?")){
            location.href = _plainUrl + "prvsuser/getCjaudit.do?incode="+$("[name=incode]").val();
        }else{
            return false;
        }
    },

    auditSubmit : function(){
        if (prvsuser.cyberAudit.validChk()) {
            if(confirm("작성한 내용을 제출하시겠습니까?")){
                var form = $("#auditRegForm")[0];
                
                form.action = _secureUrl + "prvsuser/sendCyberAuditEmail.do?incode="+$("[name=incode]").val();
                form.submit();
            }else{
                return false;
            }
        }
    }
};