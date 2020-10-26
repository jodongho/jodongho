$.namespace("mgoods.stock");
/** 재입고 알림 팝업 * */
mgoods.stock = {

    init : function() {

        mgoods.stock.bindButtonInit();
        mgoods.stock.setMemberEmail();

    },

    bindButtonInit : function() {

        // 확인 클릭 시
        $("button[name=stockBtnGreen]").click(function() {
        	
        	//SR 3358034
        	if (common.loginChk()) {
                
	            var url = _baseUrl + "goods/regAlertStockJson.do";
	    
	            var goodsNo = _goodsNo;
	            
	            if ( $("#optionYn").val() != undefined && $("#optionYn").val() == 'Y' ){
	                var itemInfo = $('#itemOpt option:selected').val();
	                
	                var goodsArr = itemInfo.split("|");
	                var goodsNo = goodsArr[0];
	                var itemNo = goodsArr[1];
	                
	            }else{
	                var itemNo = $('#goodsItemNo').val();    
	            }
	            
	            var emailOpt = $('#emailOpt option:selected').val();
	            
	            var emailInput = $("#emailId").val();
	            var emailAddr = "";
	            
	            //  이메일 세팅
	            if ( emailOpt == '00' ){
	                emailAddr = emailInput;
	            }else{
	                emailAddr = emailInput + emailOpt;
	            }
	            
	            var alimCd = $(':radio[name="alim"]:checked').val();
	            var emailRcvYn = "N";
	            var pushMsgRcvYn = "N";
	            
	            
	            //  옵션이 존재하지만 선택하지 않았을 경우 
	            if ( $("#optionYn").val() != undefined && $("#optionYn").val() == 'Y'){
	                if ( itemNo == undefined || itemNo == '' || itemNo == '00' ){
	                    alert("상품옵션을 선택해주시기 바랍니다.");
	                    $("#itemOpt").focus();
	                    return;
	                }
	            }
	            
	            //  라디오 버튼에 따른 YN 세팅
	            if (alimCd == "10") {
	                if ( emailInput == undefined || emailInput == '' ){
	                    alert("이메일을 입력해주셔야 됩니다.");
	                    $("#emailId").focus();
	                    return;
	                }else{
	                    //  이메일 형식이 올바르지 않을 때
	                    //var regex=/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
	                    var regex=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/; //Mantis 0000834에 의해 -와 _ 허용토록 변경(20180315)
	                    if ( regex.test(emailAddr) == false ){
	                        alert("이메일 형식이 올바르지 않습니다. 다시 입력해주시기 바랍니다.");
	                        $("#emailId").focus();
	                        return;
	                    }
	                }
	                emailRcvYn = "Y";
	            } else {
	                pushMsgRcvYn = "Y";
	                emailAddr = "";
	            }
	            
	            var data = {
	                goodsNo : goodsNo,
	                itemNo : itemNo,
	                emailRcvYn : emailRcvYn,
	                pushMsgRcvYn : pushMsgRcvYn,
	                emailAddr : emailAddr
	            };
	    
	            common.Ajax.sendRequest("POST", url, data, mgoods.stock._callBackStockResult);
	            
        	}else{
        		common.link.moveLoginPage();
        	}

        });

        // 취소 클릭 시
        $("button[name=stockBtnGray]").click(function() {
            common.popFullClose();
            //상품상세 화면 swiper update MJH
            tabContsWrap.update();
        });
        
        //  옵션 변경시
        $("#emailOpt").change(function(){
            if( $(this).val() != '00' ){
                var mbrEmailAddr = $("#mbrEmailAddr").val();
                
                $("#emailId").val(mbrEmailAddr.substring(0,mbrEmailAddr.indexOf("@")));
            }
        });
        
        
    },

    _callBackStockResult : function(res) {
        alert(res);
        common.popFullClose();
        //상품상세 화면 swiper update MJH
        tabContsWrap.update();
        
    },
    
    setMemberEmail : function(){
        
        var mbrEmailAddr = $("#mbrEmailAddr").val();
        var optionSize = $("#emailOpt option").size();
        var emailId = "";
        var emailSite = "";
        var emailArr ="";
        //  고객 이메일 ID와 이메일사이트를 구분
        if ( mbrEmailAddr != undefined && mbrEmailAddr != ''){
            emailArr = mbrEmailAddr.split("@");
            emailId = emailArr[0];
            emailSite = "@" + emailArr[1];
        }
        
        //  선택 여부
        var selected = false;
        //  이메일 같은게 있다면 선택
        $("#emailOpt option").each(function() {
            $(this).removeAttr("selected");
            if ( $(this).val() == emailSite ){
                $(this).attr("selected", true);
                selected = true;
            }
        });
        
        //  이메일 아이디 세팅
        if ( selected ){
            $("#emailId").val(emailId);
        }else{
            $("#emailId").val(mbrEmailAddr);
        }
        
    }

}