$.namespace('mmypage.addInfoList');
mmypage.addInfoList = {
        _ajax : common.Ajax ,
        init : function(){
            mmypage.addInfoList.eventSet();
        },
        
        eventSet : function(){
            //부가정보 수집
            $('.radius_box_list label').on('click', function(){
            	
                var _this = $(this),
                    _input = _this.siblings('input');
                    _inputType = _input.attr('type');
                    _this_box = _this.parents('.type_box');
                    
                if(_inputType=='radio'){
                    if(_this.hasClass('on')){
                        _input.prop('checked', false);
                        _this.removeClass('on');
                    }else{
                        _this_box.find('input[type=radio]').prop('checked', false);
                        _this_box.find('label').removeClass('on');
                        _input.prop('checked', true);
                        _this.addClass('on');
                    }
                    
                    //라디오 버튼 컨트롤
                    var temp = _this.parents('.type_box').find('input[type=radio]:checked').val();
                    var tfType = $('input:radio[name="skin_type_1"]').is(":checked");
                    var tfTone = $('input:radio[name="skin_type_2"]').is(":checked");

                    //데이터 확인용
                    //alert(temp + "\nType = " + tfType + "\n" + "Tone = " + tfTone);
                    if(temp==null) temp = "0";
                    if(tfType == true){
                        temp = temp.substring(0, 1);
                        if(temp == "A"){
                            $("#compareType").val($(':radio[name="skin_type_1"]:checked').val());
                        }
                    } else {
                        $("#compareType").val("");
                    }
                    
                    if(tfTone == true){
                        temp = temp.substring(0, 1);
                        if(temp == "B"){
                            $("#compareTone").val($(':radio[name="skin_type_2"]:checked').val());
                        }
                    } else {
                        $("#compareTone").val("");
                    }
                }     
                
            }); 
            if($(".innerBox.agreed").length == 1) {
                $('.agreed .btnCheck').on('click', function(){
                    var _agreed = $(this).parents('.agreed');            
                    if(_agreed.hasClass('on')){
                        _agreed.removeClass('on');
                    }else{
                        _agreed.addClass('on');
                    }
                });     
            }
        },
        /*as-is 탑리뷰어_lsy_Start*/
        /*regMyConditionInfo : function(){
        	
            if($("#addInfoAgrYnVal").val()!="Y"){
                if($("[name='addInfoAgrYn']").is(":checked")){
                    $("#addInfoAgrYn").val("Y");
                } else {
                    alert("개인정보 수집 및 이용동의에 동의해주세요");
                    return;
                }
            }
            var param = $("#addInfoForm").serialize();


            common.Ajax.sendRequest("POST"
                    , _baseUrl + "mypage/registerAddInfo.do"
                    , param
                    , mmypage.addInfoList.regAddInfoCallback
            );
        },
        
        regAddInfoCallback : function(res) {
            alert("피부컨디션이 정상적으로 등록되었습니다.");
            $(location).attr('href', _baseUrl + 'mypage/getMySkinCondition.do');
        },
        
        getAddInfoAgrYnAjax : function(){
            if($("#addInfoAgrYnVal").val()=="Y"){
                if(!confirm("나의 피부컨디션에 대한 수집 및 이용동의를 철회하시겠습니까?")) return;
            }
            var param = {
                    addInfoAgrYn  : 'N',
                    addInfoOpenYnVal : 'N',
            }
            
            common.Ajax.sendRequest("POST"
                    , _baseUrl + "mypage/regAddInfoAgrYn.do"
                    , param
                    , mmypage.addInfoList.regAddInfoCallback2
            );
        },
        
        regAddInfoCallback2 : function(res) {
            $(location).attr('href', _baseUrl + 'mypage/getMySkinCondition.do');
        },*/
        /*as-is 탑리뷰어_lsy_End*/
        
        getMyConditionListPagingAjax : function (){ 
            PagingCaller.init({
                callback : function(){
                    //코드 완료 후 스토어 정보 조회
                    var param = {
                            dispCatNo  : $("#dispCatNo").val() ,
                            catDpthVal : $("#catDpthVal").val() ,
                            pageIdx    : PagingCaller.getNextPageIdx(),
                            prdSort    : $("#prdSort").val(),
                            isLogin    : sessionStorage.getItem("lCnt"),
                    }
                    common.Ajax.sendRequest(
                            "GET"
                            , _baseUrl + "mypage/getMySkinCondition.do"
                            , param
                            , mmypage.addInfoList.getMyConditionListPagingAjaxCallback,
                            false);

                    common.loadPage.setPageIdx(param.pageIdx);
                }
            ,startPageIdx : startIdx
            ,subBottomScroll : 700
            //초기화 시 최초 목록 call 여부
            ,initCall : (startIdx > 0) ? false : true
            });

        },

        getMyConditionListPagingAjaxCallback : function(res){
          //페이지당 20개, 5페이지 이상 조회 시 destroy
            if (res.trim() == '') {
                if (PagingCaller.getCurPageIdx() < 1) {
                    $("#ctgNoData").show();
                    $("#oneTwo-list").hide();
                }
                
                //응답 결과가 없을 경우 마지막 목록임- 스크롤 이벤트 제거
                PagingCaller.destroy();

            } else {
                $("#ctgNoData").hide();
                $("#oneTwo-list").show();

                //응답 결과가 있는 경우 append 처리 후 lazyload 처리
                $("#oneTwo-list").append(res);

                common.setLazyLoad();

                //찜 체크 처리.
                common.wish.checkWishList();

                setTimeout(function() {
                    //링크 처리
                    common.bindGoodsListLink();
                    //페이지 로딩 처리 클릭 이벤트처리
                    common.loadPage.bindEvent();

                }, 100);
            }

            //loadingLayer
            common.hideLoadingLayer();
        },
};

/*탑리뷰어_lsy*/
$.namespace('mmypage.profileInfo');
mmypage.profileInfo = {
		saveflag :true,
		nickNmCk : false,
		nickNmDpCk : false,
        init : function(){
        	
        	$('#myConditionSaveBtn').click(function(){
        		if(mmypage.profileInfo.saveflag){
        			mmypage.profileInfo.validationCk();
        		}
        	});
        	
        	if($('#mbrNickNm').val() != "" && $('#mbrNickNm').val().length != 0){
        		mmypage.profileInfo.nickNmDpCk = true;
        	}
        	
//        	if($('input[id="addInfoAgrYnVal"]').val() == 'Y'){
//        		$('.addInfoAgrY').show();
//        		$('.addInfoAgrN').hide();
//        	}else{
//        		$('.addInfoAgrY').hide();
//        		$('.addInfoAgrN').show();
//        	}
        	
        	// 큐레이션약관 동의 시
        	$('#addInfoAgrYn').click(function(){
                if($('#addInfoAgrYn').is(':checked')){
                	$('#addInfoAgrYnVal').val('Y');
            	}else{
            		$('#addInfoAgrYnVal').val('N');
            	}
        	});
        	
        	// 피부타입, 관심카테고리 선택 시
        	$('.radius_box_list input').click(function(){
        		if($('.radius_box_list input:checked').length > 0){
    				$('#addInfoOpenYn').prop('disabled',false);
        		}else{
    	           	$('#addInfoOpenYn').prop('disabled',true);
    				$('#addInfoOpenYn').prop('checked',false);
        		}
        	});
        	
        	// 화면 로딩 시 (나의 피부 컨디션 & 관심 카테고리 정보를 입력한 상태여야만 정보 비공개여부 설정 가능하다)
    		if($('.radius_box_list input:checked').length > 0){
				$('#addInfoOpenYn').prop('disabled',false);
    		}else{
	           	$('#addInfoOpenYn').prop('disabled',true);
    			$('#addInfoOpenYn').prop('checked',false);
    		}
        	
        	mmypage.profileInfo.profileImg.init();
        },
        bannerOpen : function(){
        	var param = {
				pageNm : 'getMySkinConditionInfoPop',
	        }
			common.Ajax.sendRequest("POST",_baseUrl + "mypage/getReviewerPop.do",param, mmypage.profileInfo.bannerOpenSuccessCallback);
        },
        bannerOpenSuccessCallback : function(data){
            $("#layerPop").html(data);
            common.popLayerOpen2("LAYERPOP01");
        },
        invalidNickNm : function(){
        	var temp=$("#mbrNickNm").val();
        	var re = /[~!@\#$%^&*\()\-=+_']/gi; 
        	 if(re.test(temp)){
        		 $("#mbrNickNm").val(temp.replace(re,"")); 
        	 }
        },
        nickNmValidationCk : function(type){
        	$('.txtinfo').hide();
        	$('.txtinfo').html('');
        	$('.txtinfo').removeClass('color01').removeClass('color02').removeClass('color03');
        	var mbrNickNm = $('#mbrNickNm').val();
        	var compare = $('#ordNickNm').val() == mbrNickNm;
        	if(!compare){
        		mmypage.profileInfo.nickNmDpCk = false;
        	}else{
        		mmypage.profileInfo.nickNmDpCk = true;
        	}
        	if(mbrNickNm != "" && !compare){
        		//글자 수 제한(2~12자리)
        		var textByte = mmypage.profileInfo.byteCheck(mbrNickNm);
        		if(textByte > 20 || textByte < 1){
        			$('.txtinfo').html('국문 10자 또는 영문 20자 이내로 작성해주세요');
        			$('.txtinfo').addClass('color02');
        			$('.txtinfo').show();
        			$('#mbrNickNm').focus();
        			mmypage.profileInfo.nickNmDpCk = false;
        			return false;
        		}
        		// 한글/영문(대/소문자)/숫자로만 작성가능 (특수문자, 공란 불가)
        		if(textByte  <= 20 || textByte >= 1){
	        		var compare_txt = mbrNickNm;
//	        		var deny_pattern = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\*]+$/
	        		var deny_pattern = /^[ㄱ-ㅎ가-힣a-zA-Z0-9]+$/;
	    			if(!deny_pattern.test(compare_txt)){
	    				$('.txtinfo').html('국문 10자 또는 영문 20자 이내로 작성해주세요');
	    				$('.txtinfo').addClass('color02');
	        			$('.txtinfo').show();
	    				$('#mbrNickNm').focus();
	    				return false;
	    			}
	        		mmypage.profileInfo.nickNmDpCk = false;
	        		mmypage.profileInfo.nickNmCk = true;
	        		return true;
        		}
        	}
        },
        byteCheck(textData){
            var codeByte = 0;
            for (var idx = 0; idx < textData.length; idx++) {
                var oneChar = escape(textData.charAt(idx));
                if ( oneChar.length == 1 ) {
                    codeByte ++;
                } else if (oneChar.indexOf("%u") != -1) {
                    codeByte += 2;
                } else if (oneChar.indexOf("%") != -1) {
                    codeByte ++;
                }
            }
            return codeByte;
        },
        nickNmDuplicateCk : function(type){
        	$('.txtinfo').hide();
        	$('.txtinfo').html('');
      	  	$('.txtinfo').removeClass('color01').removeClass('color02').removeClass('color03');
	      	if(!mmypage.profileInfo.nickNmValidationCk(type)){
	      		return false;
	      	}
	      	
	      	var temp=$("#mbrNickNm").val();
	      	var textByte = mmypage.profileInfo.byteCheck(temp);
        	var re = /[~!@\#$%^&*\()\-=+_']/gi;
        	
        	if(re.test(temp) || textByte > 20 || textByte < 1){
        		$('.txtinfo').html('국문 10자 또는 영문 20자 이내로 작성해주세요');
        		$('.txtinfo').addClass('color02');
        		$('.txtinfo').show();
        		mmypage.profileInfo.nickNmDpCk = false;
        		$('#mbrNickNm').focus();
      			returnValue = false;
        	}else{
        		mmypage.profileInfo.getMbrCheckAjax();
        	}
        },
        getMbrCheckAjax : function(){
        	var returnValue = '';
        	var param = {
    				mbrNickNm : $('#mbrNickNm').val(),
    		}
    		
    		common.Ajax.sendRequest(
                    "POST"
                  , _baseUrl + "mypage/getMbrNickNmDuplicateCk.do"
                  , param
                  , function(res) {
                      if(res.duplicate == 0 && res.abuse == 0){
                    	  	$('.txtinfo').html('사용 가능한 닉네임입니다');
  	    					$('.txtinfo').addClass('color03');
  	    					$('.txtinfo').show();
  	    					mmypage.profileInfo.nickNmDpCk = true;
  	    					returnValue = true;
                      }else{
                    	  if(res.duplicate > 0){
                    		  $('.txtinfo').html('다른 사용자가 이미 사용중입니다');
    	    				  $('.txtinfo').addClass('color01');
    	    				  $('.txtinfo').show();
                    		  mmypage.profileInfo.nickNmDpCk = false;
                    		  $('#mbrNickNm').focus();
                    		  returnValue = false;
                    	  }
                    	  if(res.abuse > 0){
                    		  $('.txtinfo').html('비속어가 포함되어 있습니다');
    	    				  $('.txtinfo').addClass('color01');
    	    				  $('.txtinfo').show();
                    		  mmypage.profileInfo.nickNmDpCk = false;
                    		  $('#mbrNickNm').focus();
                    		  returnValue = false;
                    	  }
                      }
                  }
                  , false
    		);
        	return returnValue;
        },
        
        validationCk : function(){
        	mmypage.profileInfo.saveflag = false;
        	
        	if(!mmypage.profileInfo.nickNmDpCk && $('#mbrNickNm').val().length != 0){
        		alert('닉네임 중복을 확인해주세요');
        		mmypage.profileInfo.saveflag = true;
        		return false;
        	};
        	
        	var mbrNickNm = $('#mbrNickNm').val();
        	var compare = $('#ordNickNm').val() == mbrNickNm;
        	
        	if(!compare){
        		var checkAgain = mmypage.profileInfo.getMbrCheckAjax();
	        	if(!checkAgain){
	        		alert('이미 사용중인 닉네임입니다. 다시 중복확인 해주세요.');
	        		mmypage.profileInfo.saveflag = true;
	        		return false;
	        	}
        	}
        	
        	$('.dim').css('display','block');
        	
        	common.showLoadingLayer(false);
        	
        	if($('#profileOpenYn').is(':checked')){
        		$("#profileOpenYnVal").val("N");
        	}else{
        		$("#profileOpenYnVal").val("Y");
        	}
        	
			if($('#addInfoOpenYn').is(':checked')){
				$("#addInfoOpenYnVal").val("N");
        	}else{
        		$("#addInfoOpenYnVal").val("Y");
        	}
			
			if(!mmypage.profileInfo.profileImg.imgCheck){
				mmypage.profileInfo.saveProfileInfo();
			}else{
				mmypage.profileInfo.profileImg.saveProfileImage();
			}
        },
        
        saveProfileInfo : function(){
        	
     		var param =  $("#addInfoForm").serialize();
        	common.Ajax.sendRequest("POST"
                    , _baseUrl + "mypage/registerAddInfo.do"
                    , param
                    , mmypage.profileInfo.saveProfileInfoSuccessCallback
            );
        },
        
        saveProfileInfoSuccessCallback : function(res){
		    /* 3200210  큐레이션 개선 관련 건-레코벨 데이터 송부
		     * 로그인 유저에 한해서 피부정보 조회(동의여부 기반 조회)
		     * 중복 호출을 막기 위해, localStorage 사용.
		     * updateSkinYn은 '프로필-나의 피부 컨디션 정보 변경 시, N으로 변경되며, 'N'에 해당 경우에만 DB를 호출하도록 변경
		     * 해당 케이스는 피부정보가 변경되었으므로, "updateSkinYn"을 'N'으로 변경
		    */	
        	if($('input[id="addInfoAgrYnVal"]').val() != 'N'){
        		localStorage.setItem("updateSkinYn", "N");	
        	}else{
        		localStorage.setItem("updateSkinYn", "Y");
        	}
        	       	
        	common.hideLoadingLayer();
        	$('.dim').css('display','none');
        	alert("변경사항이 정상적으로 저장되었습니다");
        	mmypage.profileInfo.saveflag = true;
            $(location).attr('href', _baseUrl + 'mypage/getMySkinCondition.do');
        },
        
//        getAddInfoAgrYnAjax : function(){
//        	if(mmypage.profileInfo.saveflag){
//        		mmypage.profileInfo.saveflag = false;
//        		if($("#addInfoAgrYnVal").val() == "Y"){
//        			if(confirm("나의 피부 컨디션 정보에 대한 정보 수집 및 이용동의를 철회하시겠습니까?")){
//        				var param = {
//        						addInfoAgrYn  : 'N',
//        						addInfoOpenYnVal : 'Y',
//        				}
//        				
//        				common.Ajax.sendRequest("POST"
//        						, _baseUrl + "mypage/regAddInfoAgrYn.do"
//        						, param
//        						, mmypage.profileInfo.regAddInfoCallback2
//        				);
//        			}else{
//        				mmypage.profileInfo.saveflag = true;
//        				$('#addInfoDisAgrYn').prop('checked',false);
//        				$('#addInfoAgrYnVal').val('Y');
//        				return false;
//        			}
//        		}
//        	}
//        },
        
        regAddInfoCallback2 : function(res) {
		    /* 3200210  큐레이션 개선 관련 건-레코벨 데이터 송부
		     * 로그인 유저에 한해서 피부정보 조회(동의여부 기반 조회)
		     * 중복 호출을 막기 위해, localStorage 사용.
		     * updateSkinYn은 '프로필-나의 피부 컨디션 정보 변경 시, N으로 변경되며, 'N'에 해당 경우에만 DB를 호출하도록 변경
		     * 업데이트 이후에는 중복 사항 호출을 막기 위해 updateSkinYn를 'Y'로 변경
		     * 해당 케이스는 정보 제공을 포기하므로, localStorage에서 제거
		    */
			if (localStorage)
				localStorage.removeItem("updateSkinYn"); 
		    	            	
        	mmypage.profileInfo.saveflag = true;
//        	$('.addInfoAgrN').show();
//        	$('.addInfoAgrY').hide();
        	$(".skin_choice_box input[type='radio'], .skin_choice_box input[type='checkbox']").each(function(e){
                $(this).prop('checked', false);
                $(this).siblings('label').removeClass('on');
            });
        	$('.skin_choice_box .innerBox').find('a.txt_link').hide();
//    		$('#addInfoOpenYn').prop('checked',false)
//    		$('#addInfoOpenYn').prop('disabled',true);
    		$('input[name="skin_type1"], input[name="skin_type2"]').val("");
//        	$("#addInfoAgrYn").val("N");
        	$("#addInfoAgrYnVal").val("N");
        	$('#addInfoOpenYnVal').val("Y");
//            $(location).attr('href', _baseUrl + 'mypage/getMySkinCondition.do');
        },
        
}

$.namespace('mmypage.profileInfo.profileImg');
mmypage.profileInfo.profileImg = {
		imgCheck : false,		
        init : function(){
        	//사진등록버튼 클릭
        	$('.add_profile_image').click(function(e){
                if (common.app.appInfo.isapp) {
                    //안드로이드 인 경우에만 스킴적용
                    if(common.app.appInfo.ostype=="20"){
                        common.app.callImgSelector();
                    }else{
                        $('#profileFile').click();  
                    }
                } else {
                    $('#profileFile').click();  
                }
            });
        	
        	//사진삭제버튼 클릭
        	$('.delete_profile_image').click(function(e){
        			$('#profileFile').val("");
        			$('#fileName').val("");
                    $('#appxFilePathNm').val("");
                    $('#appxFileNm').val("");
                    $('#useYn').val('N');
                    
        			$('.icon.profile').removeAttr('style');
        			$('.icon').removeClass('profile');
        			$('.icon').attr('src',_imgUrl+'comm/my_picture_base.jpg');
        			
        			//canvas에 선택한 이미지 draw
                    var canvas = document.getElementById('canvas');                
                    var ctx = canvas.getContext('2d');

                    // 픽셀 정리
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    // 컨텍스트 리셋
                    ctx.beginPath();
                    
//                    $('.delete_profile_image').css('display','none');
                    mmypage.profileInfo.profileImg.imgCheck = false;
                 
        	});
        	
        	//프로필 사진 변경_웹, IOS
            $("#profileFile").change(function(e){
				var file = $(".btnFileAdd")[0].files[0];
                var fileExt = /.(bmp|jpg|jpeg|gif|png)$/i;
                //5 * 1024 * 1024
                if(file.size > 5242880){
                    $(".btnFileAdd").val("");
                    alert("5MB미만의 이미지 파일만 첨부할 수 있습니다");
                    return;
                };
                if(!fileExt.test(file.name)){
                    $(".btnFileAdd").val("");
                    alert("등록할 수 없는 파일 형식입니다.");
                    return;
                };
                
                if(!common.isEmpty($(".btnFileAdd").val())){
                    $('#fileName').val(file.name);
                }
				
               	 var canvasImg = new Image();
                canvasImg.onload = function(e) {
                	//canvas에 선택한 이미지 draw
                    var canvas = document.getElementById('canvas');                
                    var ctx = canvas.getContext('2d');

                    //배율
                    var magnification = 1;

                    //700픽셀에 맞도록 배율 조정
                    var imageResizeWidth = 700;
                    if (this.width > imageResizeWidth) {
                        magnification = imageResizeWidth / this.width;
                    }

                    canvas.width = this.width * magnification;
                    canvas.height = this.height * magnification;

                    ctx.imageSmoothingEnabled = true;
                    ctx.mozImageSmoothingEnabled = true;
                     
                    ctx.drawImage(canvasImg, 0, 0, canvas.width, canvas.height);
                    //업로드 이미지 처리
                }
                
                var reader = new FileReader();

                reader.onload = function(e) {
                    try {
                        canvasImg.src = e.target.result;
                        
                        $('.icon').removeClass('profile');
                    	$('.icon').addClass('profile');
                    	$('.icon.profile').attr('src',e.target.result);
//        				$('.icon.profile').css({"background":"url("+e.target.result+")", 'background-repeat' : 'no-repeat', 'background-position':'center center', 'background-size':'contain'});
        				$('.delete_profile_image').css('display','block');
        				$('#useYn').val('Y');
        				mmypage.profileInfo.profileImg.imgCheck = true;
                    } catch (e) {
                    	
                    }
                }
                reader.readAsDataURL(this.files[0]);
                
            });
        	
            
          //앱 안드로이드 Callback
            common.app.callbackUploadImgBase64 = function(fileName, imgData) {
                if(fileName != ""){
             	 	$("#fileName").val(fileName);
             	 	$('#useYn').val('Y');
                }
                if (imgData != 'undefined' && imgData != null && imgData != "") {
                    try{
        	            var img = new Image();
        	            img.onload = function (e) {
        	                var canvas = document.getElementById("canvas");
        	                var ctx = canvas.getContext("2d");
        	                var uploadImg = canvas.toDataURL();
        	          
        	                //배율
        	                var magnification = 1;
        	          
        	                //500픽셀에 맞도록 배율 조정
        	                if (this.width > 500) {
        	                    magnification = 500 / this.width;
        	                }
        	          
        	                canvas.width = this.width * magnification;
        	                canvas.height = this.height * magnification;
        	
        	                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);  
        	                
        	                $('#canvas').css('display','none');
        	            }
        	            
        	            img.src = "data:image/png;base64," + imgData;
        	            $('.icon').removeClass('profile');
                    	$('.icon').addClass('profile');
                    	$('.icon.profile').attr('src',img.src);
//        	            $('.head_info .icon.profile').css({"background":"url("+img.src+")", 'background-repeat' : 'no-repeat', 'background-position':'center center', 'background-size':'contain'});
        	            mmypage.profileInfo.profileImg.imgCheck = true;
                    }catch(e){
                        alert('error>>>>',e);
                    }
                }
                common.app.callShowLoadingBar("N");
            };
        },
        saveProfileImage : function(){
        	var canvas = document.getElementById('canvas');   
        	var uploadImg = canvas.toDataURL();
        	var param = {
            		imgFile : uploadImg,
            		orgFileNm : $('#fileName').val()
        	}
        	
        	common.Ajax.sendRequest("POST"
                , _baseUrl + "mypage/profileImgUploadJson.do"
                , param
                , mmypage.profileInfo.profileImg.saveProfileImageSuccessCallback
                , false
            );
        },
        saveProfileImageSuccessCallback : function(res){
        	$('#appxFilePathNm').val(res.appxFilePathNm);
        	$('#appxFileNm').val(res.appxFileNm);
        	mmypage.profileInfo.saveProfileInfo();
        },
}

function captureReturnKey(e) { 
    if(e.keyCode==13 && e.srcElement.type != 'input') 
    return false; 
} 
