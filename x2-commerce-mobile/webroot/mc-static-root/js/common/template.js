/**
 * dynamic html 구현을 위해 ajax등으로 넘겨받은 json데이터를 이용해 간편하게 목록등의 화면을 구현할 수 있도록 한다.
 * 템플릿으로 이용되는 html에 대해서는 script등으로 wrapping한 후 해당 html에 대해서 템플릿 타입 지정을 하도록 한다. (script 권장, 기본적으로 화면 표시안됨)
 * 템플릿 타입 지정 예는 다음과 같다.
 * 예) <script id="test" type="html-template" style="display:none">
 * 
 * 지정된 템플릿은 wrapper tag에 따라 다르겠지만 기본적으로 display:none 처리되는 것을 권장한다. 
 * template.js를 include 시 자동으로 hide 처리하지만 네트워크 속도가 느릴 경우 해당영역이 노출되었다가 사라지는 깜빡임이 있을 수 있다. 
 * 
 * 템플릿과 json 데이터를 이용하여 append 하는 코드는 다음과 같다.
 * $.template($("#temp"), jsonData).appendTo("#list")
 * 
 * <script id="temp" type="html-template" style="display:none">
 * <tr> 
 *   <td colspan='2'>${Name}</td>
 *   <td>Released: ${ReleaseYear}</td>
 *   <td>Director: ${Director}</td>
 * </tr>
 * </script>
 * 
 * var movies = [
 *   { Name: "The Red Violin", ReleaseYear: "1998", Director: "François Girard" }, 
 *   { Name: "Eyes Wide Shut", ReleaseYear: "1999", Director: "Stanley Kubrick" },
 *   { Name: "The Inheritance", ReleaseYear: "1976", Director: "Mauro Bolognini" }
 * ];   
 *   
 */
//로딩 시 템플릿으로 지정된 html object에 대해 find하여 hide 처리한다.
$(document).ready(function() {
	$("[type='html-template']").hide();
});

/**
 * json으로 수신받은 데이터에 대해 html에 키값으로 설정된 부분을 매핑하여 치환 처리.
 * 처리 완료된 문자는 appendTo로 원하는 object에 붙여넣기 하여 처리하도록 한다.
 * 
 * @param src append하기 위한 소스 html 또는 html object
 * @param jsonData src에 주입시키기 위한 데이터
 * @return 변환된 문자열 
 */
$.template = function(src, jsonData) {
	var srcHtml = src;
	
	if (typeof src == "object" ) {
		//원본이 jquery object일 경우
		var tmpHtml = src.innerHTML;
		if (tmpHtml == undefined) {
			//원본이 jquery object일 경우
			srcHtml = src.html();
		} else {
			srcHtml = tmpHtml;
		}
	}
	
	var sb = new StringBuilder();
	var dstHtml = srcHtml;
	
	if (jsonData.length == undefined) {
		//치환
		Object.keys(jsonData).forEach(function(key) {
			var regex = new RegExp("\\$\\{" + key + "\\}");
			
			dstHtml = dstHtml.replaceAll(regex, jsonData[key]);
		});
		
		sb.append(dstHtml);
	} else {
		for (var i = 0; i < jsonData.length; i++) {
			dstHtml = srcHtml;
			//치환
			Object.keys(jsonData[i]).forEach(function(key) {
				var regex = new RegExp("\\$\\{" + key + "\\}");
				
				var val = convertSystemToJsonStrHtml(JSON.stringify(jsonData[i][key]));
				dstHtml = dstHtml.replaceAll(regex, val);
			});
			
			sb.append(dstHtml);
		}
	}	
	
	return $(sb.toString());
};

//Initializes a new instance of the StringBuilder class
//and appends the given value if supplied
function StringBuilder(value) {
	this.strings = new Array("");
	this.append(value);
}

//Appends the given value to the end of this instance.
StringBuilder.prototype.append = function (value) {
	if (value) {
		this.strings.push(value);
	}
}

//Clears the string buffer
StringBuilder.prototype.clear = function () {
	this.strings.length = 1;
}

//Converts this instance to a String.
StringBuilder.prototype.toString = function () {
	return this.strings.join("");
}

function convertSystemToJsonStrHtml(str){
    if(str){
        str = str.replace(/</g,"&lt;");
        str = str.replace(/>/g,"&gt;");
        str = str.replace(/^\"/g,"");
        str = str.replace(/\"$/,"");
        str = str.replace(/\\"/gi, '"');
        str = str.replace(/\\r\\n/gi, "<br/>");
        str = str.replace(/\\n/gi, "<br/>");
        return str;
    }
}