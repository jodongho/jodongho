/**
 * <pre>
 * NumberCheck
 * 빈공간을 허용한다.
 * </pre>
 * @param field form.element
 * @param error_msg 에러 message
 * @return boolean
 */
function isNumber(field, error_msg){
	var val = field.value;

	if(checkDigitOnly(val, false) ) {
		return true;
	} else {
		if(error_msg.length > 0) {
			alert(error_msg);
			field.focus();
			field.select();
		}
		return false;
	}
}

/**
 * <pre>
 * NumberCheck
 * 숫자인지 여부체크.
 * </pre>
 * @param field form.element
 * @param error_msg 에러 message
 * @return boolean
 */
function isNumberVal(val){

	if(checkDigitOnly(val, false) ) {
		return true;
	} else {
		return false;
	}
}

/**
 * <pre>
 * 숫자인지 아닌지  검사한다.
 * 검사할 값이 "" 일 경우 true를 리턴하고 싶으면, space인수에 true를 넣으면 된다.
 * </pre>
 * @param digitChar 검사할 string
 * @param space ""일 때 허용여부(true||false)
 * @return boolean
 */
function checkDigitOnly( digitChar, space ) {
	if(!space){
		if ( digitChar == null || digitChar=='' ){
    		return false ;
    	}
	}

	for(var i=0;i<digitChar.length;i++){
    	var c=digitChar.charCodeAt(i);
       	if( !(  0x30 <= c && c <= 0x39 ) ) {
       		return false ;
       	}
     }

    return true ;
}

/**
 * <pre>
 * 숫자나 문자열을 통화(Money) 형식으로 만든다.( 쉼표(,) 찍는다는 소리.. )
 * &lt;input type="text" name="test" value="" onkeyup="this.value=toCurrency(this.value);"&gt;
 * or
 * var num = toCurrency(document.form[0].text.value);
 * </pre>
 * @param	amount	"1234567"
 * @return	currencyString "1,234,567"
 */
function toCurrency(amount){
	amount = String(amount);

	var data = amount.split('.');

	var sign = "";

	var firstChar = data[0].substr(0,1);
	if(firstChar == "-"){
		sign = firstChar;
		data[0] = data[0].substring(1, data[0].length);
	}

	data[0] = data[0].replace(/\D/g,"");
	if(data.length > 1){
		data[1] = data[1].replace(/\D/g,"");
	}

	firstChar = data[0].substr(0,1);

	//0으로 시작하는 숫자들 처리
	if(firstChar == "0"){
		if(data.length == 1){
			return sign + parseFloat(data[0]);
		}
	}

	var comma = new RegExp('([0-9])([0-9][0-9][0-9][,.])');

	data[0] += '.';
	do {
		data[0] = data[0].replace(comma, '$1,$2');
	} while (comma.test(data[0]));

	if (data.length > 1) {
		return sign + data.join('');
	} else {
		return sign + data[0].split('.')[0];
	}
}

/**
 * <pre>
 * 숫자나 문자열을 통화(Money) 형식으로 만든다.( 쉼표(,) 찍는다는 소리.. )
 * 단, 양수만 허용한다.
 * &lt;input type="text" name="test" value="" onkeyup="this.value=toCurrency(this.value);"&gt;
 * or
 * var num = toCurrency(document.form[0].text.value);
 * </pre>
 * @param	amount	"1234567"
 * @return	currencyString "1,234,567"
 * @see #toCurrency(amount)
 */
function toCurrencyPositive(amount){
	var firstChar = amount.substr(0,1);
	if(firstChar == "-"){
		amount = amount.substring(1, amount.length);
	}
	return toCurrency(amount);
}

/**
 * <pre>
 * 0인경우 Empty String
 * </pre>
 * @param	amount	"1234567"
 * @param	unit	"원"
 * @return	currencyString "1,234,567 원"
 * @see #toCurrency(amount)
 */
function toCurrencyEmpty(amount, unit){
	if (String(amount) == "0") return "";
	return toCurrency(amount) + " " + unit;
}

/**
 * <pre>
 * 0인경우 0
 * </pre>
 * @param	amount	"1234567"
 * @param	unit	"원"
 * @return	currencyString "1,234,567 원"
 * @see #toCurrency(amount)
 */
function toCurrencyZero(amount, unit){
	if (String(amount) == "0" || String(amount) == "") {
		return "0 "+ unit;
	}else{
		return toCurrency(amount) + " " + unit;
	}
}

/**
 * 주어진 값(val)을 소수점이하 num자리수에서 반올림한값을 리턴한다.
 *
 * @param val 반올림할 값
 * @param num 반올림할 자리수
 * @return number
 */
function round(val, num){
	val = val * Math.pow(10, num - 1);
	val = Math.round(val);
	val = val / Math.pow(10, num - 1);
	return val;
}

/**
 * ,이 있는 숫자를 순수한 숫자로 바꿔준다. (+), (-) 허용
 *
 * @param num
 * @return number
 */
function toNormalNum( num ) {
    num = num.replace(/,/g, '');
    var args = Number(num);
	return args;
}

/**
 * 숫자가 해당 범위를 벗어나는지 검사
 * 벗어나면 에러 메세지를 보여주고 true를 리턴한다.
 *
 * @param field form.element
 * @param min int 최소값
 * @param max int 최대값
 * @param error_msg string 에러 메세지
 * @return boolean
 */
function isOutOfNumericRange(field, min, max, error_msg) {
	if(field.value < min || field.value > max) {
		alert(error_msg);
		field.focus();
		field.select();
		return true;
	}
	return false;
}

function filterNum(str){
	return str.replace(/^\$|,/g, "");
}

function filterNum2(obj){
	var temp = "";
	if(obj == null || obj == undefined || obj == "") return temp;
	else return filterNum(obj.value);
}

function filterNumValue(obj){
	var temp = "";
	if(obj == null || obj == undefined || obj == "") return temp;
	else return obj;
}

//숫자 체크
function num_check_call(){
	var keyCode = event.keyCode;
    if (keyCode < 48 || keyCode > 57){
        event.returnValue=false;
    }
}
function float_num_check_call(){
	var keyCode = event.keyCode;
	if (keyCode < 48 || keyCode > 57){
		if(keyCode != 46){
			event.returnValue=false;
		}
	}
}

function comma_call(id){
	var obj = document.getElementById(id);
	var num = obj.value;
	if(isNaN(filterNum(num))){
		alert("문자는 사용할 수 없습니다.");
		obj.value = "";
		return;
	}
	if(num == 0){
		obj.value = "";
		return;
	}
	if (obj.value.length >= 4){
		re = /^$|,/g;
		num = Number(num.replace(re, ""));
		fl="";
		if(num < 0){
			num=num*(-1);
			fl="-";
		}
		else{
			num=num*1; //처음 입력값이 0부터 시작할때 이것을 제거한다.
		}
		num = new String(num);
		temp="";
		co=3;
		num_len=num.length;
		while (num_len>0){
			num_len=num_len-co;
			if(num_len<0){
				co=num_len+co;
				num_len=0;
			}
			temp=","+num.substr(num_len,co)+temp;
		}
		obj.value = fl+temp.substr(1);
	}
}


/**
 * 숫자만 입력 가능
 * @param event
 * $("#phone").keypress(function(event){
 * 		inputNumber(event);
 * }
 */
function inputNumber(event){
	//alert(event.which);
	//if (event.which && (event.which  > 47 && event.which  < 58 || event.which == 8)) {
	if (event.which && ((event.which  > 47 && event.which  < 58) || (event.which  > 95 && event.which  < 106) || event.which == 8 || event.which == 46)) {
	    //alert('숫자임!');
	} else {
	    //alert('숫자아님!');
	    event.preventDefault();
	}
}
