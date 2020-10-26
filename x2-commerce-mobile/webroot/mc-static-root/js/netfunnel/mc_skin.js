if(typeof NetFunnel == "object"){
	NetFunnel.SkinUtil.add('test',{
		prepareCallback:function(){
			var progress_print = document.getElementById("Progress_Print");
			//progress_print.innerHTML="0 % (0/0) - 0 sec";
			var btn_mv = document.getElementById("btn_mv");
			
			//main에서 호출할 경우 홈버튼 미노출 처리
			if(document.location.pathname.indexOf("main.do") > 0){
				btn_mv.style = "display:none";
			}
		},
		updateCallback:function(percent,nwait,totwait,timeleft){
			var progress_print = document.getElementById("Progress_Print");
			var prog=totwait - nwait;
			
			//프로그레스바 % 제어
			progress_print.style = "width:"+percent+"%";
			//progress_print.innerHTML=percent+" % ("+prog+"/"+totwait+") - "+timeleft+" sec";
		},
		htmlStr:'<!DOCTYPE html> \
				 <html lang="ko"> \
				 <head> \
					<meta charset="utf-8"> \
					<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no"> \
					<meta http-equiv="Content-Script-Type" content="text/javascript"> \
					<meta http-equiv="Content-Style-Type" content="text/css"> \
					<meta name="format-detection" content="telephone=no"> \
					<meta property="og:title" content="올리브영"><!-- 사이트 명 --> \
					<meta property="og:url" content="http://"><!-- 사이트 URL --> \
					<meta property="og:image" content=""><!-- 대표 이미지 URL --> \
					<meta property="og:description" content=""><!-- 사이트 설명 --> \
					<title>올리브영</title> \
				</head> \
				<body> \
			    <style> \
					@import url(//fonts.googleapis.com/css?family=Montserrat:300,400,700&display=swap); \
					@import url(//fonts.googleapis.com/css?family=Noto+Sans+KR:300,400,700&display=swap); \
        		    html, body {width:100%;height:100%;}\
                    body, h1, h2, h3, h4, h5, h6, div, p, span, strong, em, blockquote, pre, address,\
                    ul, ol, li, dl, dt, dd, form, fieldset, input, select, label, textarea, img, a {margin:0; padding:0; border:0;}\
                    body {color:#333;-webkit-text-size-adjust:none;font-family:"Montserrat", -apple-system, "Noto Sans KR", sans-serif;font-weight:300;}\
                    ul, ol {list-style:none;}\
                    table {border-spacing:0; border:0; border-collapse:collapse;}\
                    img, input, select, textarea, button {border:0; vertical-align:top; color:#666;}\
                    hr {display:none;}\
                    a {color:#666; text-decoration:none;}\
                    * {box-sizing:border-box;letter-spacing:-1px;}\
                    img {width:100%;font-size:0;line-height:0;text-indent:-9999px;}\
                    label, input.button, input.submit , input.image, button {cursor:pointer;}\
                    legend, #skip_navi {position:absolute; overflow:hidden; visibility:hidden; width:0; height:0; z-index:-1;}\
                    caption {width:0;height:0;text-indent:-9999px;}\
                    #NetFunnel_Loading_Popup{top:0 !important;left:0 !important;width:100%;height:100%;}\
		            .wrap{position:fixed;top:0;left:0;width:100%;height:100%;background:url(//image.oliveyoung.co.kr/uploads/contents/202002/20delay/mc_bg_er.png) no-repeat 0 0;background-size:100%;}\
                    .er_bg{padding:77px 49px 0;}\
                    .logo{width:120px;height:21px;background:url(//image.oliveyoung.co.kr/uploads/contents/202002/20delay/mc_logo.png) no-repeat 0 0;background-size:100%;}\
                    .txt_b{margin-top:20px;font-size:26px;color:#242424;letter-spacing:-2px;}\
                    .txt{margin:15px 0 100px 0;font-size:15px;color:#242424;}\
                    .txt_s{margin-top:9px;font-size:12px;color:#787878;text-align:center;}\
                    .info{margin-top:10px;}\
                    .info:after{content:"";display:block;clear:both;}\
                    .info dt{float:left;font-size:18px;color:#272727;font-weight:400;}\
                    .info dd{float:left;padding-left:5px;font-size:18px;font-weight:700;color:#272727}\
                    .info dd span{font-size:20px;color:#272727}\
                    .pbar{position:relative;margin-top:24px;}\
                    .pbar .bar{position:relative;height:2px;background-color:#e5e5e5;}\
                    .pbar .bar span{position:absolute;top:0;left:0;height:2px;background-color:#9bce26;}\
                    .pbar .flag{position:absolute;top:-35px;right:-20px;height:28px;padding:0 9px;line-height:28px;background-color:#9bce26;border-radius:14px;font-size:14px;font-weight:700;color:#fff;}\
                    .pbar .flag:after{content:"";display:block;width:6px;height:6px;background-color:#9bce26;position:absolute;bottom:-3px;left:50%;margin-left:-3px;transform:rotate(45deg)}\
                    .btn_c{text-align:center;}\
                    .btn_mv{display:inline-block;width:185px;height:42px;line-height:42px;font-size:14px;font-weight:700;color:#444;border:1px solid #aeaeae;border-radius:5px;}\
                    .fir{font-size:0;line-height:0;color:transparent;}\
                    .pos_btm{position:absolute;bottom:50px;left:49px;right:49px;}\
                    .pos_btm .txt_s{margin-bottom:40px;}\
                    #pop_iframe{opacity:1 !important;}\
                    @media screen and (max-width:340px) {\
                        .txt_b{font-size:20px;}\
                        .txt_s{font-size:11px;}\
                        .txt{margin:15px 0 70px 0;font-size:14px;}\
                        .btn_c{margin-top:30px;}\
                        .pos_btm{bottom:40px;}\
                    }\
				</style> \
				<div class="wrap" id="NetFunnel_Skin_Top"> \
				<div class="er_bg">	 \
					<h1 class="logo fir">올리브영</h1> \
					<p class="txt_b">현재 접속자가 많아<br>서비스 이용이 지연되는 점<br>양해 부탁드립니다.</p> \
					<p class="txt">잠시만 기다려주시면 <br>원활한 서비스 이용이 가능합니다.</p> \
					<div class="pos_btm"> \
						<dl class="info"> \
							<dt>예상 대기시간</dt> \
							<dd><span id="NetFunnel_Loading_Popup_TimeLeft" class="%02M분 %02S초^:^true"></dd> \
						</dl> \
						<dl class="info"> \
							<dt>대기 인원</dt> \
							<dd><span id="NetFunnel_Loading_Popup_Count"></span>명</dd> \
						</dl> \
						<div class="pbar"> \
							<p class="bar"><span id="Progress_Print"></span></p> \
							<p class="flag">접속</p> \
						</div> \
						<p class="txt_s">재접속/새로고침 시 대기시간이 늘어날 수 있습니다</p> \
						<p class="btn_c" id="btn_mv"><a href="/m/main/main.do" class="btn_mv">홈으로 이동</a></p> \
					</div> \
				</div>	\
				</body>	\
				</html>'

	},'normal');
}