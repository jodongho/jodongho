var customFileUpload = {
	
	uploadFile : function(elementId, buttonId){
		var fileName = $("#"+elementId).val();
		if(fileName == '') {
			alert('파일을 선택한 후 업로드하시기 바랍니다.');
			return false;
		}
		
		$("#loading").ajaxStart(function(){
			$(this).show();
		})
		.ajaxComplete(function(){
			$(this).hide();
		});

		$.ajaxFileUpload({
				url: _baseUrl + 'common/uploadFile.do',
				secureuri: false,
				fileElementId: elementId,
				dataType: 'json',
				success: function (data, status){
					if(buttonId != null && buttonId != ''){
						$("#"+buttonId).trigger("onUploadFinished", [data, status]);
					}else{
						alert(data);
						alert(status);
					}
				},
				error: function (data, status, e){
					alert("파일 전송 오류 : "+e);
				}
			}
		);
		return false;
	},
	
	removeTempFile : function(savedFileName, callback){
		commerce.mobile.common.Ajax.sendRequest(
        		"POST"
        	   ,_baseUrl + "common/removeTempFile.do"
        	   ,"savedFileName="+savedFileName
        	   ,callback
        );
	}
};