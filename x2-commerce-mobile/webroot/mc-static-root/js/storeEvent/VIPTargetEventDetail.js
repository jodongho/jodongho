$.namespace("VIPEvent.detail");
VIPEvent.detail = {
	_ajax : common.Ajax,
	snsInitYn : "N",
    mbrInfoUseAgrYn : "N",
    mbrInfoThprSupAgrYn : "N",

	init : function(){
		if($("input[id='reCommend']:hidden").val() != ""){
			if(!VIPEvent.detail.checkLogin()){
				return;
			}

		}
		
		if($("input[id='targetNum']:hidden").val() != ""){
			$('.grade-info-area').attr('style','display:block');
			$('.btn-area').attr('style','display:none');
			
			var percent = 0; //포인트바 퍼센트 표시
			var point = 0;   //포인트바 퍼센트 계산을 위한 포인트 가져옴
			var memPoint = 0; //포인트 3자리수 , 표시를 위함
			point = $("input[id='mbrPoint']:hidden").val(); 
			memPoint = $("input[id='mbrPoint']:hidden").val(); 

			//1.포인트 3자리수 , 표시
			memPoint = memPoint.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

			$("#memPoint").text(memPoint);
			//2. 포인트바 퍼센트 계산
			if(point > 8000){
				percent = (point-8000)/(25000-8000) * 100;
				$('.point-grade.vip').find('span').css('width', '100%');
				$('.point-grade.vvip').find('span').css('width', percent+'%');
			
			}else{
				percent = (point)/(8000) * 100;
				$('.point-grade.vip').find('span').css('width', percent+'%');
			}
		}
		
		$('.event_agree .tit > a').click(function(e){
			e.preventDefault();
			if($(this).parents('li').hasClass('on')){
				$(this).parents('li').removeClass('on');
			} else {
				$(this).parents('li').addClass('on').siblings().removeClass('on');
			}
		});
	},
	checkLogin : function(){
        if(common.isLogin() == false){

            if(!confirm("해당 서비스는 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?")){
                return false;
            }else{
                common.link.moveLoginPage();
                return false;
            }
        }

        return true;
    }
};