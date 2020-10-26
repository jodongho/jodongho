/**
 * 이벤트명 : 오늘드림 소문내기
 */
$.namespace("monthEvent.detail");
monthEvent.detail = {
    snsInitYn : "N",
    layerPolice : false,

    init : function(){

        $('.evtCon03 .shareToday input:text').prop('placeholder', '친구 ID를 입력해주세요.').prop('maxlength', 20);

        $('.evtCon03 .shareToday .btn_submit').on('click', function(){
            monthEvent.detail.kakaoApply();
        });

        $('.todayTime span.counter').attr('data-count', $('#evtTodayTime').val());
        $('.todayUser span.counter').attr('data-count', $('#evtTodayUser').val());
        $('.todayItem span.counter').attr('data-count', $('#evtTodayItem').val());

    },

    /* 공유하기 */
    kakaoShareSns : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }

        var evtNo = $("input[id='shareEvtNo']:hidden").val();
        var reCommend = encodeURIComponent($("input[id='targetNum']:hidden").val());
        var imgUrl = "http:" + _cdnImgUrl + "contents/202001/01todayNews/banner_kakao.jpg";
        //var title = " 올해는 오늘드림 모르는 사람 없게 해주세요🙏🏻";
        var title = " 이벤트"
            +"\n"+ "친구 아이디 입력하면 너도 나도 아이패드 득템🎁"
            +"\n"+ "친구 아이디 : ";
        if(!common.isEmpty($('#evtMbrId').val()) && "null" != $('#evtMbrId').val()){
            title += $('#evtMbrId').val()
        }

        // 배너 이미지 체크
        var bnrImgUrlAddr = $("#bnrImgUrlAddr").val();
        if(bnrImgUrlAddr == undefined || bnrImgUrlAddr == null || bnrImgUrlAddr == ""){
            bnrImgUrlAddr = "";
        } else if($.trim(bnrImgUrlAddr).indexOf(_fileUploadUrl) == -1){
            bnrImgUrlAddr = _fileUploadUrl + bnrImgUrlAddr;
        }

        // 이미지가 없을 경우만 배너로 교체
        if(imgUrl == undefined || imgUrl == null || imgUrl == ""){
            imgUrl = bnrImgUrlAddr;
        }

        var snsShareUrl = _baseUrl + "KE.do?evtNo=" + evtNo + "&reCommend=" + reCommend;

        /* sns common init 시키기 위해서 한번만 실행 */
        if(monthEvent.detail.snsInitYn == "N"){
            common.sns.initKakaoEvt(imgUrl, title, snsShareUrl);
            monthEvent.detail.snsInitYn = "Y";
        }

        common.sns.doShareKakaoEvt("kakaotalk");
    },

    /* 경품 응모 */
    kakaoApply : function() {
        if(!mevent.detail.checkLogin()){
            return;
        }
        if(common.isEmpty($('.evtCon03 .shareToday input:text').val().trim())){
            alert('공유해준 친구 아이디를 정확히 입력해주세요.');
            return;
        }

        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
                , reCommend : decodeURIComponent($("input[id='reCommend']:hidden").val())
                , inputTxt : $('.evtCon03 .shareToday input:text').val()
        };
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20200101_2/kakaoApply.do"
              , param
              , monthEvent.detail._callback_kakaoApply
        );
    },
    _callback_kakaoApply : function(json) {
        if(json.ret == "050"){
            alert('본인 아이디는 입력할 수 없어요. 주변 친구들에게 공유해주세요!');
        }else if(json.ret == "0"){
            alert('참여 완료 되셨어요!');
        }else{
            alert(json.message);
        }
    },

    rollingNumber : function() {
        $('.counter').each(function() {
            var $this = $(this),
            countTo = $this.attr('data-count').replace(/,/g, '');
    
        $({ countNum: $this.text() }).animate({
            countNum: countTo}, 
            {
                duration: 1000,
                easing: 'linear',
                step: function() {
                $this.text(monthEvent.detail.numberWithCommas(Math.floor(this.countNum)));
            },
                complete: function() {
                $this.text(monthEvent.detail.numberWithCommas(this.countNum));
            }
            });
        });
    },

    numberWithCommas : function(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

};

//스크롤 다운시 활성화
$(window).scroll( function(){
    if($('.counter:eq(0)').text() == '0'){
      $('.evtCon01').each( function(){
          var bottom_of_object = $(this).offset().top + $(this).outerHeight()-($(this).outerHeight()/2);
          var bottom_of_window = $(window).scrollTop() + $(window).height(); 
          if( bottom_of_window > bottom_of_object ){
              monthEvent.detail.rollingNumber();
          } else {  
          }
      });
    }
});