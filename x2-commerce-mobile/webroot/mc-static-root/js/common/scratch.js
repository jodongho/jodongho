    //<![CDATA[
        $(function(){

	$('#scratch').wScratchPad({
	    bg: '//qa.oliveyoung.co.kr/uploads/contents/201805/30today/today_scratch_congra.png', //성공
		//bg: '//qa.oliveyoung.co.kr/uploads/contents/201805/30today/today_scratch_fail.png', //실패
		fg: '//qa.oliveyoung.co.kr/uploads/contents/201805/30today/today_scratch_cover.png',
		size: '20',
		scratchMove: function (e, percent) {
			$('#demo2-percent').html(percent);

			if (percent > 70) {
			  this.clear();
			}
		}
	});
 });

//]]>