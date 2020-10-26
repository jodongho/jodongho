/**
* 배포일자 : 2020-04-02
* 오픈일자 : 2020-04-06
* 이벤트명 : 4월 APP페스티벌 럭키드로우
* */
$.namespace("monthEvent.detail");
monthEvent.detail = {
	currentDay : null,
	layerPolice : false,
	appPushIng : false,
	init : function(){
		monthEvent.detail.currentDay = $("input[id='imgUrlConnectDay']:hidden").val();
		//이벤트 2차
		if(monthEvent.detail.currentDay >= $("input[id='strtDtime2']:hidden").val() && monthEvent.detail.currentDay <= $("input[id='endDtime2']:hidden").val()){
			$(".mc_visual1").addClass("off");
			$(".mc_visual2").removeClass("off");
			
			$(".mc_menu1").addClass("off");
			$(".mc_menu2").removeClass("off");
			
			//띠배너
			$('.usemapDiv:last .imgBox:eq(0)').addClass('off');
			$('.usemapDiv:last .imgBox:eq(1)').removeClass('off');
		}

		/* app push 수신동의 현황 조회 */
		common.app.getTmsPushConfig();
		
		//경품응모
		$(".btnLucky").click(function(){
			monthEvent.detail.checkGiftApply();
		});
		
		$('.btn_check4_2').on('click', function(){
			if(common.app.appInfo == undefined || !common.app.appInfo.isapp) {
				if(confirm("APP 에서만 참여 가능합니다.")){
					common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/20200406_4/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
				}else{
					return;
				}
            }else{
                if(!mevent.detail.checkLogin()){
                    return;
                }else if(monthEvent.detail.appPushVer()){
                    if(!monthEvent.detail.appPushIng){
                        monthEvent.detail.appPushIng = true;
                        common.app.setTmsPushConfig('Y');
                        var appCheckTimer = setInterval(function(){
                            if('N' == common.app.pushConfigResult){
                                //수신동의 처리 실패
                                clearInterval(appCheckTimer);
                                monthEvent.detail.appPushIng = false;
                            }else if(!common.isEmpty(common.app.pushConfigResult) || !monthEvent.detail.appPushIng){
                                //처리 성공
                                clearInterval(appCheckTimer);
                                monthEvent.detail.appPushIng = false;
                            }
                        }, 300);
                    }
                }else{
                    common.app.callSettings();
                }
            }
        });
		
		// 나의 당첨내역
        $("div#eMylist").click(function(){
             if(!mevent.detail.checkLogin()){
                 return;
             }
             /* 당첨이력조회 */
             monthEvent.detail.getStmpMyWinList();
        });
        
        //직접 X(닫기) 클릭 or 레이어팝업 이외 영역 클릭 시, 알럿
        $('#eventDimLayer, #eventLayerPolice .eventHideLayer').click(function(){
            if(monthEvent.detail.layerPolice){
                alert('동의 후 참여 가능합니다.');

                monthEvent.detail.layerPolice = false;
                mevent.detail.eventCloseLayer();

                //초기화
                $(':radio[name="argee1"]:input[value="N"]').attr("checked", true);
                $(':radio[name="argee2"]:input[value="N"]').attr("checked", true);
            }
        });
	},
	
	checkGiftApply : function(){
		if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
			if(confirm("APP 에서만 참여 가능합니다.")){
				common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/20200406_4/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
			}else{
				return;
			}
		}else{
			if(!mevent.detail.checkLogin()){
				return;
			}
			var param = {
					evtNo : $("input[id='evtNo']:hidden").val()
			}
			common.Ajax.sendRequest(
					"GET"
					, _baseUrl + "event/20200406_4/checkGiftApply.do"
					, param
					, function(json){
						$(':radio[name="argee1"]:checked').attr("checked", false);
						$(':radio[name="argee2"]:checked').attr("checked", false);
						if(json.ret == "0"){
							$("div#Confirmlayer1").attr("onclick", "monthEvent.detail.giftApply();");
							mevent.detail.eventShowLayer('eventLayerPolice');
							monthEvent.detail.layerPolice = true;
							$(".agreeCont")[0].scrollTop = 0;
						}else{
							if(json.ret == "-1"){
								if(confirm("해당 서비스는 로그인이 필요합니다.로그인 페이지로 이동하시겠습니까?")){
					        		common.link.moveLoginPage();
					        		return false;
					            }
							}else{								
								alert(json.message);
							}
						}
					}
			);
		}
	},
	
	giftApply : function(){
		if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
			if(confirm("APP에서만 참여 가능합니다.")){
				common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/20200406_4/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
			}else{
				return;
			}
		}else{
			if(!mevent.detail.checkLogin()){
				return;
			}
    
			var mbrInfoUseAgrYn =  $(':radio[name="argee1"]:checked').val();
			var mbrInfoThprSupAgrYn =  $(':radio[name="argee2"]:checked').val();
    
			if("Y" != $(':radio[name="argee1"]:checked').val() || "Y" != $(':radio[name="argee2"]:checked').val()){
				alert("2가지 모두 동의 후 참여 가능합니다.");
				return;
			}

			if("Y" != mbrInfoUseAgrYn){
				monthEvent.detail.layerPolice = false;
				mevent.detail.eventCloseLayer();
				return;
			}
			if("Y" != mbrInfoThprSupAgrYn){
				monthEvent.detail.layerPolice = false;
				mevent.detail.eventCloseLayer();
				return;
			}
			monthEvent.detail.layerPolice = false;
			mevent.detail.eventCloseLayer();
			var param = {
					evtNo : $("input[id='evtNo']:hidden").val()
					, mbrInfoUseAgrYn : mbrInfoUseAgrYn
					, mbrInfoThprSupAgrYn :mbrInfoThprSupAgrYn
			};
			common.Ajax.sendJSONRequest(
					"GET"
					, _baseUrl + "event/20200406_4/giftApply.do"
					, param
					, monthEvent.detail._callback_giftApply
			);
		}
	},

	_callback_giftApply : function(json){
		if(json.ret == "0"){
			$(".win_number").text('('+json.tgtrSeq+')');
			var fvrSeq = json.fvrSeq;
			if(json.fvrSeq == "5"){
				fvrSeq = "1";
			}else if(json.fvrSeq == "4"){
				fvrSeq = "2";
			}else if(json.fvrSeq == "2"){
				fvrSeq = "4";
			}else if(json.fvrSeq == "1"){
				fvrSeq = "5";
			}
			mevent.detail.eventShowLayer('layWiner0'+fvrSeq);
		}else{
			if(json.ret == "-1"){
				if(confirm("해당 서비스는 로그인이 필요합니다.로그인 페이지로 이동하시겠습니까?")){
	        		common.link.moveLoginPage();
	        		return false;
	            }
			}else{								
				alert(json.message);
			}
		}
	},
	
	/* 당첨내역 확인 */
    getStmpMyWinList : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
        }
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/getStmpMyWinListJson.do"
              , param
              , monthEvent.detail._callback_getStmpMyWinListJson
        );
    },

    _callback_getStmpMyWinListJson : function(json){
        if(json.ret == "0"){
            var myWinListHtml = "";
            if(json.myEvtWinList.length <= 0){
                myWinListHtml = "<tr><td colspan='2' class='no'>당첨이력이<br/> 없습니다.</td></tr>";
            }else{
                for(var i=0 ; i<json.myEvtWinList.length ; i++){
                    myWinListHtml += "<tr><td>" + json.myEvtWinList[i].strSbscSgtDtime + "</td><td>" + json.myEvtWinList[i].evtGoodsNm + "</td></tr>";
                }
            }
            $("#evtPopWinDetail tbody").html(myWinListHtml);

            mevent.detail.eventShowLayer('evtPopWinDetail');
        }else{
            alert(json.message);
        }
    },

    /* 앱 최신버전 체크 */
    appPushVer : function(){
        if(common.isLogin()){
            var tempCompareVersion = "";
            if (common.app.appInfo.ostype == "10") { // ios
                tempCompareVersion = '2.2.1';
            }else if(common.app.appInfo.ostype == "20"){ // android
                tempCompareVersion = '2.1.8';
            }
            if(common.app.appInfo.isapp && common.app.compareVersion(common.app.appInfo.appver, tempCompareVersion) !=  "<"){
                return true;
            }
        }
        return false;
    }
}