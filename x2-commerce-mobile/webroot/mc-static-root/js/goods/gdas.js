$.namespace("mgoods.gdas");
mgoods.gdas = {
       goodsNo : $('#goodsNo').val(),
       gdasSeq : $('#gdasSeq').val(),
       fileSeq : $('#fileSeq').val(),
       //gdasSort : $('#gdasSort').val() == null ? '02' : $('#gdasSort').val(),//## 리뷰 고도화 1차 ##
       gdasSort : $('#gdasSort').val() == null ? '05' : $('#gdasSort').val(),//## 리뷰 고도화 1차 ##
       //onOffSort : $('#onOffSort').val() == null ? 'all' : $('#onOffSort').val(),//## 리뷰 고도화 1차 : 제거 ##
       pageIdx : 1,
       filterOn : false,
       changeSort : false,
       //changeOnOff : false,//## 리뷰 고도화 1차 ## : 제거 - 전체구매/온라인몰/매장구매 옵션
       colData : '',
       cTypeLength: 0,
       photoPageIdx : 1,
       init: function(){

    	   //console.log("### mgoods.gdas.init #### ");

           PagingCaller.destroy();
           //상품평 집계 호출
           mgoods.gdas.eval.getGdasSummary();
           //상품전체 목록 호출
          mgoods.gdas.initGdasList();

          //## 리뷰 고도화 1차 ## : 제거
          //$('.banner_ex').click(function(e){
          //	  common.wlog("goods_oy_banner");
          //	  mgoods.gdas.bannerOpen(this);
          //});
       },
       bannerOpen : function(obj){
    	   var scrollValue = $(document).scrollTop();
           $('#pop-full-title').html("올영체험단 소개");
           $('body').css({'background-color' : '#fff'}); /* 2016-12-12 퍼블리싱 수정 반영 */
           $('#oyExperienceInfoPop').hide();
           $('#pop-full-wrap').empty().html($('#oyExperienceInfoPop').html());
           $('.popFullWrap').show();
           $('#mWrapper').hide();
   		   
           closeBtnAction = function(obj){
           
   			  setTimeout(function(){$('html, body').scrollTop(scrollValue);}, 100);
        	   $('html, body').scrollTop(scrollValue);
  	 	       $('#pop-full-wrap').empty().hide();
  	 	       $('.popFullWrap').hide();
  	 	       $('#oyExperienceInfoPop').hide();
//  	 	       $('#webBanner_detail').show();
  	 	       $('#mWrapper').css('display','block');
  	 	       $('.gdasPopCont').css('display','none');
  	 	       $('.gdasPopCont').empty();
  	 	       $('body').removeClass('bgb').removeClass('bgw');
   	       }
   		   
   		   $('button[name=appPushBtn]').click(function(){
	           if (common.app.appInfo == undefined || !common.app.appInfo.isapp) {
	               if(confirm('모바일앱 설치 후 APP PUSH 수신동의 해주세요!')){
                         common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=main/getOllyoungList.do");
                   }else{
                       return;
                   }
	           } else {
	               location.href = "oliveyoungapp://settings"; 
	           } 
  		   });
   		   
   		   $('button[name=smsBtn]').click(function(){
	  		   var loginCheck = common.loginChk();
	  		   if(loginCheck){
	  		      common.link.moveMemberInfoChangePage();
	  		   }else{
	  		     common.link.moveLoginPage("N", location.href);
	  		   }	
  		   });
       },
       initGdasList : function(){

    	   //console.log("### mgoods.gdas.initGdasList #### ");

           var colData = '', cTypeLength = 0;
           //프로필 필터 Set
           if(sessionStorage.getItem('set_filter_profile') != '' && sessionStorage.getItem('set_filter_profile') != null && typeof sessionStorage.getItem('set_filter_profile') != 'null'){
               colData = sessionStorage.getItem("set_filter_profile");
               var tmpColData = colData.split(",");
               for(var i = 0; i < tmpColData.length; i++){
                 if(tmpColData[i].substr(0,1) == 'C'){
                     cTypeLength ++;
                 }
               }
               mgoods.gdas.pageIdx  = 1;
               mgoods.gdas.colData = colData;
               mgoods.gdas.cTypeLength = cTypeLength;
           }
           //정렬 필터 Set
           if(sessionStorage.getItem("gdasSort") != '' && sessionStorage.getItem("gdasSort") != null &&  typeof sessionStorage.getItem("gdasSort") != 'null'){
               mgoods.gdas.gdasSort = sessionStorage.getItem("gdasSort");
           }
           var url = _baseUrl + "goods/getGdasListFormAjax.do";
           var param = {
                   goodsNo : mgoods.gdas.goodsNo, 
                   gdasSort : mgoods.gdas.gdasSort,
                   //onOffSort : mgoods.gdas.onOffSort,//## 리뷰 고도화 1차 ## : 제거
                   itemNo : $('#gdasItemNo').val(),
                   pageIdx : mgoods.gdas.pageIdx, // 페이징 인덱스
                   colData : mgoods.gdas.colData,
                   cTypeLength : mgoods.gdas.cTypeLength,
           }

           //console.log("### mgoods.gdas.initGdasList param #### " + JSON.stringify(param));

           common.Ajax.sendRequest("POST",url,param, mgoods.gdas._callBackGdasListForm,false);
           mgoods.gdas.initGdasListPaging(mgoods.gdas.pageIdx);
     },
     _callBackGdasListForm : function(data){

    	 //console.log("### mgoods.gdas.initGdasList _callBackGdasListForm #### ");
    	 //console.log("#### .review_thum" + $('.review_thum').length);
    	 //console.log("#### .txtNoCate" + $('.txtNoCate').length);
             common.hideLoadingLayer();
             if($('.review_thum').length ==0){
            	 if($('.txtNoCate').length == 0 ){
            		 $('.review_option').after(data);//## 리뷰 고도화 1차 ## : 변경 및 하위 추가
            	 }else{
            		 $('.txtNoCate').after(data);//## 리뷰 고도화 1차 ## : 변경 및 하위 추가
            	 }

             }else{
            	 $('.review_thum').after(data);//## 리뷰 고도화 1차 ## : 변경 및 하위 추가
             }

       },
       /**상품평 전체 리스트 호출**/
       initGdasListPaging : function(page, hideLoadingLayer){

    	   //console.log("### mgoods.gdas.initGdasListPaging #### ");
    	   //console.log("### mgoods.gdas.initGdasListPaging  page #### " + page);
    	   //console.log("### sessionStorage.getItem('set_filter_profile') #### " +  sessionStorage.getItem('set_filter_profile'));
    	   //console.log("### mgoods.gdas.initGdasListPaging hideLoadingLayer #### " + hideLoadingLayer);


           if( ! hideLoadingLayer)
               common.showLoadingLayer(false);
           var colData = '', cTypeLength = 0;
           //프로필 필터 Set
           if(sessionStorage.getItem('set_filter_profile') != '' && sessionStorage.getItem('set_filter_profile') != null && typeof sessionStorage.getItem('set_filter_profile') != 'null'){
               colData = sessionStorage.getItem("set_filter_profile");
               var tmpColData = colData.split(",");
               for(var i = 0; i < tmpColData.length; i++){
                 if(tmpColData[i].substr(0,1) == 'C'){
                     cTypeLength ++;
                 }
               }
               //console.log("### 11111111 sessionStorage.getItem('set_filter_profile') #### " +  sessionStorage.getItem('set_filter_profile'));
              // sessionStorage.removeItem("set_filter_profile");
               //console.log("### 22222222 sessionStorage.getItem('set_filter_profile') #### " +  sessionStorage.getItem('set_filter_profile'));
               mgoods.gdas.pageIdx  = 1;
               mgoods.gdas.filterOn = true;
               mgoods.gdas.colData = colData;
               mgoods.gdas.cTypeLength = cTypeLength;
           }else{
               mgoods.gdas.filterOn = false;
           }
           
           console.log("### mgoods.gdas.colData #### " +  mgoods.gdas.gdasSort );
           console.log("### mgoods.gdas.colData #### " +  sessionStorage.getItem("gdasSort") );
           //정렬 필터 Set
           if(sessionStorage.getItem("gdasSort") != '' && sessionStorage.getItem("gdasSort") != null && typeof sessionStorage.getItem("gdasSort") != 'null'){
               mgoods.gdas.gdasSort = sessionStorage.getItem("gdasSort");
               sessionStorage.removeItem("gdasSort");
           }

           console.log("### mgoods.gdas.colData #### " +  mgoods.gdas.gdasSort );

           //## 리뷰 고도화 1차 ## : 제거
           //if(sessionStorage.getItem("onOffSort") != '' && sessionStorage.getItem("onOffSort") != null && typeof sessionStorage.getItem("onOffSort") != 'null'){
           //    mgoods.gdas.onOffSort = sessionStorage.getItem("onOffSort");
           //    sessionStorage.removeItem("onOffSort");
           //}
           PagingCaller.init({
               callback : function(){
                   var param = {
                           goodsNo : mgoods.gdas.goodsNo, 
                           gdasSort : mgoods.gdas.gdasSort,
                           //onOffSort : mgoods.gdas.onOffSort,//## 리뷰 고도화 1차 ## : 제거
                           itemNo : $('#gdasItemNo').val(),
                           pageIdx : mgoods.gdas.pageIdx, // 페이징 인덱스
                           colData : mgoods.gdas.colData,
                           cTypeLength : mgoods.gdas.cTypeLength,
                   }
                   common.Ajax.sendRequest(
                           "POST"
                           , _baseUrl + "goods/getGdasNewListJson.do"
                           , param
                           , mgoods.gdas._callBackGetGdasListPaging
                           , false);
               }
           ,startPageIdx : page
           ,subBottomScroll : 700
           ,initCall : ( mgoods.gdas.pageIdx > 1 ) ? false : true
           });
       },
       /**상품평 상세 호출**/
       initDetail: function(){
           mgoods.gdas.gdasPhotoDetail();
       },
       /**상품평 전체 목록 paging JSON**/
       _callBackGetGdasListPaging : function(res){

    	   //console.log("### mgoods.gdas.initGdasListPaging _callBackGetGdasListPaging #### ");

           common.hideLoadingLayer();
//           if(mgoods.gdas.colData != undefined && mgoods.gdas.colData != null && mgoods.gdas.colData != ''){
//               var param ={ cdArr : mgoods.gdas.colData }
//               var resultData = mgoods.gdas.filter.getNowFilter(param);
//               var string=[];
//               for(var i in resultData){
//                   if(typeof resultData[i].mrkNm != "undefined"){
//                       string.push(resultData[i].mrkNm);
//                   }
//               }
//               var tmp_cd = mgoods.gdas.colData.split(',');
//               for(var i in tmp_cd){
//                   if(tmp_cd[i] == '10' || tmp_cd[i] == '20' || tmp_cd[i] == '30'){
//                       string.push(tmp_cd[i]+'대');
//                   }else if(tmp_cd[i] == '40'){
//                       string.push(tmp_cd[i]+'대 이상');
//                   }else if(tmp_cd[i] == 'M'){
//                       string.push('남성');
//                   }else if(tmp_cd[i] == 'F'){
//                       string.push('여성');
//                   }
//               }
//               $('.txtfilter').html(string.join(','))
//           }else{
//               $('.txtfilter').html('')
//           }
           
           if(mgoods.gdas.colData != ''){
               mgoods.gdas.filterOn = true;
               $('#filterBtn').addClass('on')
           }else{
               mgoods.gdas.filterOn = false;
               $('#filterBtn').removeClass('on')
           }

           //console.log("### mgoods.gdas.initGdasListPaging _callBackGetGdasListPaging #### " + $.trim(res.gdasList).length );
           if($.trim(res.gdasList).length == 0){
        	   //console.log("### $.trim(res.gdasList).length == 0  #### ");
        	   //console.log("### $.trim(res.gdasList).length == 0 mgoods.gdas.filterOn 맟춤필터  #### " + mgoods.gdas.filterOn);
        	   //console.log("### $.trim(res.gdasList).length == 0 mgoods.gdas.changeSort 정렬 #### " + mgoods.gdas.changeSort);
        	   //console.log("### $.trim(res.gdasList).length == 0 mgoods.gdas.changeOption 상품 옵션 변경 #### " + mgoods.gdas.eval.changeOption);

               var noHtml = '';
               //## 리뷰 고도화 1차 ## : mgoods.gdas.changeOnOff 제거 - 전체구매/온라인몰/매장구매 옵션
               //if(!mgoods.gdas.filterOn && !mgoods.gdas.changeOnOff && !mgoods.gdas.changeSort && !mgoods.gdas.eval.changeOption){
               if(!mgoods.gdas.filterOn && !mgoods.gdas.changeSort && !mgoods.gdas.eval.changeOption){

            	   //console.log("### 데이터 없을경우  #### ");

            	   //console.log("### 데이터 없을경우  #### " +$('#gdasList').find('li').length );
            	   //console.log("### 데이터 없을경우  #### " + $('.product_rating_none').length );

                   //처음 로드 상태
                   if($('#gdasList').find('li').length < 1 && $('.product_rating_none').length != 1){
                	   //## 리뷰 고도화 1차 ## 제거 및 변경
                       //noHtml += '<div class="product_rating_none">';
                       //noHtml += '    <div class="icon_txt">';
                       //noHtml += '        <em>등록 된 리뷰가 없습니다.</em>';
                       //noHtml += '       <p class="txt">리뷰를 등록 해주세요.<br>등록 시 최대 CJ ONE <span class="txt_en">'+_gdasMaxPoint+'</span>P를<br>적립 해드립니다.</p>';
                       //noHtml += '</div>';
                       //noHtml += '</div>';
                	   noHtml += '<div class="product_rating_none">';
                	   noHtml += '	<div class="icon_txt">';
                	   noHtml += '		<!-- 리뷰 고도화 1차 : 문구 변경 -->';
                	   noHtml += '		<em>등록된 리뷰가 아직 없어요 :(</em>';
                	   noHtml += '		<p class="txt">얼리 리뷰를 작성하시면 기본 100P + 추가 50P를 드려요!</p>';
                	   noHtml += '		<!-- // 리뷰 고도화 1차 : 문구 변경 -->';
                	   noHtml += '	</div>';
                	   noHtml += '	<ul class="rw-point-data">';
                	   noHtml += '		<li>';
                	   noHtml += '			<span class="label">기본 작성</span>';
                	   noHtml += '			<span class="detail">100P<br>(상세 리뷰 작성 제한 상품 : 10P)</span>';
                	   noHtml += '		</li>';
                	   noHtml += '		<li>';
                	   noHtml += '			<span class="label">얼리 리뷰<br>(상품의 1~10번째 리뷰)</span>';
                	   noHtml += '			<span class="detail">+ 50P<br>(상세 리뷰 작성 제한 상품 제외)</span>';
                	   noHtml += '		</li>';
                	   noHtml += '		<li>';
                	   noHtml += '			<span class="label">활동 포인트<br>(‘도움이 돼요’ 받은 수)</span>';
                	   noHtml += '			<span class="detail">x 5P<br>(인당 월 최대 2,000P 지급)</span>';
                	   noHtml += '		</li>';
                	   noHtml += '	</ul>';
                	   noHtml += '	<div class="rw-point-comment">';
                	   noHtml += '		<p>상세 리뷰 작성 제한 상품 : 일반/건강식품, 의료기기, 성인용품</p>';
                	   noHtml += '		<p>활동포인트는 당월 1일~말일까지의 기준으로 익월 10일 지급</p>';
                	   noHtml += '	</div>';
                	   noHtml += '</div>';

                       //## 리뷰 고도화 1차 ## 제거 및 변경
                       //$('.review_option, .sel_option_box').remove();
                       //$('.product_rating_area').remove();
                       //$('.oy_top_banner').after(noHtml);

                	   $('.sel_option_box').remove();
                       $('.review_option').remove();
                       $('#gdasList').empty();
                       $("#regGdasBtn").parent().after(noHtml);
                   }

               //## 리뷰 고도화 1차 ## : mgoods.gdas.changeOnOff 제거 - 전체구매/온라인몰/매장구매 옵션
               //}else if(mgoods.gdas.changeOnOff && mgoods.gdas.filterOn){
               //    //온/오프라인&맞춤필터 변경
               //    console.log('온/오프라인&맞춤필터 변경');
               //    noHtml += '<div class="filter_none">';
               //    noHtml += '    <div class="txt">선택하신 조건에 맞는 리뷰가 없습니다</div>';
               //    noHtml += '</div>';
               //    if($('#gdasList').find('li').length >= 0 && mgoods.gdas.pageIdx == 1 && $('.filter_none').length != 1){
               //        $('.review_list_wrap').hide();
               //        $('.review_option').after(noHtml);
               //    }
               //}else if(mgoods.gdas.changeOnOff && !mgoods.gdas.filterOn){
               //    //온/오프라인 변경
               //    console.log('온/오프라인 변경');
               //    noHtml += '<div class="filter_none">';
               //    noHtml += '    <div class="txt">선택하신 조건에 맞는 리뷰가 없습니다</div>';
               //    noHtml += '</div>';
               //    if($('#gdasList').find('li').length >= 0 && mgoods.gdas.pageIdx == 1  && $('.filter_none').length != 1){
               //        $('.review_list_wrap').hide();
               //        $('.review_option').after(noHtml);
               //    }
               //
               }else if(mgoods.gdas.filterOn){
                   //맞춤필터 변경
                   console.log('맞춤필터 변경');
                   noHtml += '<div class="filter_none">';
                   noHtml += '    <div class="txt">선택하신 조건에 맞는 리뷰가 없습니다</div>';
                   noHtml += '</div>';

                   //console.log('맞춤필터 변경 : mgoods.gdas.pageIdx' + mgoods.gdas.pageIdx);
                   //console.log('맞춤필터 변경 : mgoods.gdas.filterOn ' + mgoods.gdas.filterOn);
                   //console.log('맞춤필터 변경 :mgoods.gdas.colData ' + mgoods.gdas.colData);
                   //console.log('맞춤필터 변경 :sessionStorage.getItem("set_filter_profile") ' + sessionStorage.getItem("set_filter_profile"));
                   if(mgoods.gdas.pageIdx == 1){
                       $('.review_list_wrap').hide();
                       $('.review_thum').hide();//## 리뷰고도화 1차 ## : 추가
                       $('.review_option').after(noHtml);
                   }
               }else{
                   //무언가 동작함
                   console.log('무언가 동작함')
                   noHtml += '<div class="filter_none">';
                   noHtml += '    <div class="txt">선택하신 조건에 맞는 리뷰가 없습니다</div>';
                   noHtml += '</div>';
                   
                   if($('#gdasList').find('li').length < 1 && $('.product_rating_none').length != 1){
                       $('.review_list_wrap').hide();
                       $('.review_option').after(noHtml);
                   }
               }
               tabContsWrap.update();
               //응답 결과가 없을 경우 마지막 목록임- 스크롤 이벤트 제거
               PagingCaller.destroy();
               return;
           }else{

        	   //console.log("### mgoods.gdas.pageIdx #### " + mgoods.gdas.pageIdx);

               //상품평 목록 템플릿 APPEND
               if(mgoods.gdas.pageIdx == 1 ){
                   $('#gdasList').empty();
                   $('.filter_none').remove();
               }

              $('.review_list_wrap').show();
               var html = '';
               //console.log(res.gdasList)
               for(var i  in res.gdasList){
            	   var data = res.gdasList[i]
            	   if(data.gdasSeq != undefined){
            		   //## gdasList Start ##
            		html += '<li>';
       					html += '	<div class="review_summary list">';
       					html += '		<div class="user_area clrfix">';
       					html += '			<div class="thum">';
       					html += '				<a href="javascript:;" onClick="mgoods.gdas.goReviewerProfile('+data.gdasSeq+')">';
       					html += '					<span class="bg"></span>';
       					if(data.profileImg != 'null' && data.profileImg != null && data.profileImg != '' && data.profileOpenYn == 'Y'){
       						html += '					<img src="'+_profileImgUploadUrl+data.profileImg+'" alt="">';
       					}else{
       						html += '					<img src="'+_imgUrl+'comm/my_picture_base.jpg" alt="">';
       					}
       					html += '				</a>';
       					html += '			</div>';
       					html += '			<div class="uid">';
       					html += '				<!-- 리뷰 고도화 1차 : 마크업 수정 -->';
       					html += '				<p>';
       					// 아이디 및 닉네임
       					if(data.mbrNickNm != null && data.mbrNickNm != ''){
       						html += '					<a href="javascript:;" class="id" onClick="mgoods.gdas.goReviewerProfile('+data.gdasSeq+')">' + data.mbrNickNm + '</a>';
       					}else{
       						html += '					<a href="javascript:;" class="id" onClick="mgoods.gdas.goReviewerProfile('+data.gdasSeq+')">' + data.mbrId + '</a>';
       					}

       					//console.log("### _baseUrl " + _baseUrl );
       					//top ranking
       					if(data.topRvrRnkGroup != 'null' && data.topRvrRnkGroup != null && data.topRvrRnkGroup != ''){
       						html += '					<a href="'+ _baseUrl +'/mypage/getReviewerLounge.do" class="icon_topRate">TOP '+data.topRvrRnkGroup+'</a><!-- 리뷰 고도화 1차 : p 추가 -->';
       					}
       					html += '				</p>';
       					html += '				<!-- 리뷰 고도화 1차 : 위치 변경 및 문구 수정, 마크업 수정 | 삭제 -->';

       					// [3272911] 리뷰 제한 카테고리> 리뷰 리스트 노출관련 추가 작업(CHY)
	            		if(data.showFilter == 'Y' && $('#gdasPrhbCatCnt').val() == 0){
	            			if(data.addInfoNm != null && data.addInfoNm != '' && data.addInfoNm != 'null'){
	            				var tmpAddInfoNm = data.addInfoNm;
            				    var addInfoCnt = 0;
            				    var troubleCnt = 0;
            				    for(var j = 0; j < tmpAddInfoNm.length; j++){
	            					   if(tmpAddInfoNm[j].colDataCd.substr(0,1) == 'C'){
	            						   troubleCnt++;
	            						   //trouble 코드 2개이상일 경우 나머지 제거
	            						   if(troubleCnt == 2){
	            							   tmpAddInfoNm.splice(j+1, tmpAddInfoNm.length-1)
	            						   }
	            					   }
	            				   }

	            				html += '				<p class="txt_tag">';
	            				for(j in tmpAddInfoNm){
	            					   if(tmpAddInfoNm[j].mrkNm != undefined){
	            						   if(tmpAddInfoNm[j].selectedCd == 'selected'){
	            							   html += '<em class="on"><span>'+tmpAddInfoNm[j].mrkNm+'</span></em>';
	            						   }else{
	            							   html += '<em><span>'+tmpAddInfoNm[j].mrkNm+'</span></em>	';
	            						   }

	            					   }
	            				   }

		       					html += '				</p>';
	            			}

	            		}
       					html += '			</div>';//div-uid
       					html += '		</div>';//div-user_area
       					html += '		<div class="review_infos clrfix">';
       					html += '			<div class="star_box clrfix">';
       					html += '				<p class="review_stat type2">';
       					// 별점
       					html += '					<span class="point pt'+data.gdasScrVal/2+'">&gt;'+data.gdasScrVal/2+'점</span>';
       					html += '				</p>';
       					html += '			</div>';
       					html += '			<div class="icon_data">';
       					html += '				<span class="data">'+data.dispRegDate+'</span>';
       					//뷰티테스터/올영체험단/매장구매  ## 리뷰 고도화 1치 ## 뷰티테스터 표기 제외
       					//if(data.gdasSctCd == '30'){
       					//	html += '				<span class="flag">뷰티테스터</span><!-- 리뷰고도화 1차 : class 변경 -->';
       					//}
       					if(data.gdasSctCd == '50'){
       						html += '				<span class="flag">올영체험단</span><!-- 리뷰고도화 1차 : class 변경 -->';
       					}
       					if(data.gdasSctCd == '60'){
       						html += '				<span class="flag">매장구매</span><!-- 리뷰고도화 1차 : class 변경 -->';
       					}
       					html += '			</div>';
       					html += '		</div>';
       					html += '		<div class="box_accordion">';
       					html += '			<div class="box_open">';
       					html += '				<div class="txt_area">';
       					//옵션
       					if(data.gdasSctCd != '30' && data.gdasSctCd != '50'){
       						if(data.itemNm != null && $.trim(data.itemNm) != ''){
       							html += '					<p class="item_option">[옵션] '+data.itemNm+'</p>';
       						}

       					}
       				// [3272911] 리뷰 제한 카테고리> 리뷰 리스트 노출관련 추가 작업(CHY)
             		   if($('#gdasPrhbCatCnt').val() == 0){
             			  //한출 리뷰
             			  if(data.shrtGdasCont != null && data.shrtGdasCont != ''){
             				 html += '					<p class="txt_oneline">'+data.shrtGdasCont+'</p>';
             			  }
             			  //리뷰
             			  if(data.gdasCont != null && data.gdasCont != ''){
             				 var tmpCont = unescape(data.gdasCont);
	          				   	 tmpCont = tmpCont.replace(/<img(.*?)>/gi,"");   //이미지 태그 제거
	          				   	 tmpCont = tmpCont.replaceAll("\r\n","<br/>");
	          				   	 tmpCont = tmpCont.replaceAll(" ","&nbsp;");
	          				   	 tmpCont = tmpCont.replace(/(<h1 style(.*?)>|<h1>|<h1\/>|<\/h1>|<h2 style(.*?)>|<h2>|<h2\/>|<\/h2>|<h3 style(.*?)>|<h3>|<h3\/>|<\/h3>)/g, '');   //h1,h2, h3 태그 제거
	          				   	 tmpCont = tmpCont.replace(/(<span style(.*?)>|<span>|<\/span>|<strong style(.*?)>|<strong>|<\/strong>)/g, '');   //strong, span태그 제거
	          				   	 tmpCont = tmpCont.replace(/(<em style(.*?)>|<em>|<\/em>|<u style(.*?)>|<u>|<\/u>|<s style(.*?)>|<s>|<\/s>)/g, '');   //em, u, s태그 제거

	          				   	html += '					<div class="txt_inner txt_show">';
	          				   	//재구매
	          				   	if(data.firstGdasYn == 'N'){
	          				   		html += '						<span class="point_flag">재구매</span>';
	          				   	}
	          				   	//한달사용리뷰
	          				   	if(data.used1mmGdasYn == 'Y'){
	          				   		html += '						<span class="point_flag">한달 사용 리뷰</span>';
	          				   	}

	         					html += tmpCont;
	         					html += '					</div>';
             			  }

             		   }

       					html += '				</div>';//div-txt_area
       					html += '			</div>';//div-box_open

       				// [3233037] 리뷰작성 제한 카테고리 수정 요청 건 - 사진 미노출 (CHY)
             		   if(data.photoList != null && data.photoList != '' && $('#gdasPrhbCatCnt').val() == 0){
             			  if(data.photoList.length > 0){
             				  	html += '			<!-- 리뷰 고도화 1차 : 후기글 하단으로 이미지 영역 위치 변경 -->';
            					html += '			<div class="box_cont">';
            					html += '				<div class="thum_area_s">';
            					html += '					<div class="thum_swipe">';
            					html += '						<ul class="inner clrfix swiper-wrapper">';
            					//'<!-- 리뷰 고도화 1차 : 이미지가 1건일 경우 이미지 솔루션 수치 제거 및 a 태그 span으로 변경 -->';
            					if(data.photoList.length==1){
            						if(data.photoList[0].gdasSeq != undefined){
            							html += '				<li class="swiper-slide"><span class="item"><img src="'+_gdasImgUploadUrl+data.photoList[0].appxFilePathNm+'"    class="thum" alt="" data-value="'+data.photoList[0].gdasSeq+'_'+data.photoList[0].fileSeq+'" ></span></li>';
            						}
            					}else{
            						 for(var j in data.photoList){
              						   if(data.photoList[j].gdasSeq != undefined){
              							 html += '		<li class="swiper-slide"><a href="javascript:;" class="item"><img src="'+_gdasImgUploadUrl+data.photoList[j].appxFilePathNm+'" onload="common.imgLoads(this,165);"   class="thum" alt="" data-value="'+data.photoList[j].gdasSeq+'_'+data.photoList[j].fileSeq+'" onError="common.errorResizeImg(this,165)"></a></li>';
              						   }
            						 }
            					}


            					html += '						</ul>';
            					html += '					</div>';//div-thum_swipe
            					html += '				</div>';//div-thum_area_s

            					if(data.photoList.length >1){
            						html += '<div class="photo-view" style="display:none">';
            						html += '	<div class="photo-swiper">';
            						html += '		<ul class="swiper-wrapper">';
	    									 for(var j in data.photoList){
	    										 if(data.photoList[j].gdasSeq != undefined){
	    											 html += '		<li class="swiper-slide"><img src="'+_gdasImgUploadUrl+data.photoList[j].appxFilePathNm+'" class="thum" alt="" data-value="'+data.photoList[j].gdasSeq+'_'+data.photoList[j].fileSeq+'" onError="common.errorResizeImg(this,165)"/></li>';
	    										 }

	    									 }

	    							html += '		</ul>';
	    							html += '		<button type="button" class="btn-swipe swiper-button-prev" role="button"><img src="'+_imgUrl+'/comm/btn_arrow_prev.png" alt="이전"></button>';
	    							html += '		<button type="button" class="btn-swipe swiper-button-next" role="button"><img src="'+_imgUrl+'/comm/btn_arrow_next.png" alt="다음"></button>';
	    							html += '		<div class="paging"></div>';
	    							html += '	</div>';//photo-swiper
	    							html += '</div>';//photo-view
            					}

            					html += '			</div>';//div-box_cont

             			  }
             		   }

             		  if(data.gdasSctCd == '50'){
 						 html += '			<!-- 리뷰 고도화 1차 : 위치 변경 -->';
      					 html += '			<p class="beauty_info txt_en">* 본 상품 후기는 올영체험단으로 선정되어 CJ올리브영으로부터 위 상품을 무료로 제공받아 작성한 것입니다. </p>';
 					 }

             		  //console.log("####### data.gdasSctCd 1111 " + data.gdasSctCd);
       					html += '		</div>';//div-box_accordion

       				 //console.log("####### data.hshTag 1111 " + data.hshTag);
             		   if(data.hshTag != null && data.hshTag != 'null' && data.hshTag != 'undefined'){
             			    html += '		<!-- 리뷰 고도화 1차 : 태그 추가 -->';
         					html += '		<div class="review_tag">';

         					for(var h = 0 ; h < data.hshTag.split(",").length;h++){
             				  html += '<span>' + data.hshTag.split(",")[h]+ '</span>';
         					}

             			  	html += '		</div>';
             		   }


             		   //제한 카테고리일 경우  - 도움 및 신고 안보이게 처리 ## 리뷰 고도화 1차 ##
             		   if($('#gdasPrhbCatCnt').val() == 0){
             			  html += '		<div class="recom_area clrfix">';
         					//도움
         					if(data.myRecommYn == 'Y'){
         						html += '			<button type="button" class="btn_recom on" id="gdas_'+data.gdasSeq+'" onClick="mgoods.gdas.setRecommGdasToggle(\''+data.gdasSeq+'\',  \''+data.myRevYn+'\');">이 리뷰가 도움이 돼요! ';

         					}else{
         						html += '			<button type="button" class="btn_recom" id="gdas_'+data.gdasSeq+'" onClick="mgoods.gdas.setRecommGdasToggle(\''+data.gdasSeq+'\',  \''+data.myRevYn+'\');">이 리뷰가 도움이 돼요! ';
         					}

         					//도움수
         					html += '		 		<span>';
         					if(data.recommCnt > 999){
     							html += '999';
     						}else{
     							html += data.recommCnt;
     						}
         					html += '		 		</span>';
         					html += '<input type="hidden" name="recommCnt_'+data.gdasSeq+'" value="'+data.recommCnt+'"/>';
     						html += '</button><!-- 리뷰 고도화 1차 : 문구 변경 및 마크업 변경 -->';

         					//신고
         					html += '			<button type="button" class="btn_dec" onClick="mgoods.gdas.goGdasReportPop(\''+data.gdasSeq+'\', \''+data.goodsNo+'\', \''+data.itemNo+'\', \''+data.myRevYn+'\');">신고하기</button><!-- 리뷰 고도화 1차 : 문구 변경 -->';
         					html += '		</div>';//div-recom_area
             		   }


       					html += '	</div>';//div-review_summary
       					html += '</li>';
					//## gdasList End ##
            	   }
               }


               $('#gdasList').append(html);
//               $("#gdasListTemplate").tmpl(res.gdasList).appendTo("#gdasList");
               $('#gdasSort').val(res.gdasSort).prop(true);
               mgoods.gdas.gdasSort = res.gdasSort;

               //$('#onOffSort').val(res.onOffSort).prop(true); //## 리뷰 고도화 1차 ## : 제거
               //mgoods.gdas.onOffSort = res.onOffSort; //## 리뷰 고도화 1차 ## : 제거
               //  페이지 증가
               mgoods.gdas.pageIdx = mgoods.gdas.pageIdx + 1;
               
             //상품평 썸네일 슬라이드   
               var _thum_area_s = $('.thum_area_s');
               _thum_area_s.each(function(){
                   var _this = $(this);
                   var _thisw = _this.width();
                   var _thum_swipe = _this.find('.thum_swipe');
                   var _thum_li = _thum_swipe.find('ul.inner > li');
                   var _thum_liw = _thum_li.outerWidth()+1;
                   var _thum_length = _thum_li.length;
                   var _thum_w = _thum_liw*_thum_length;
                   
                   if(_thisw<_thum_w){
                       var list_view = new Swiper(_thum_swipe, {
                           observer: true, 
                           observeParents: true,
                           slidesPerView: 'auto',
                       });
                   }
               });

               /*$(".thum_area_s li.swiper-slide").click(function(e){
                   e.preventDefault();
                   var data_value = $(this).find('img.thum').attr('data-value').split('_');
                   var type = 'photoPlDetail';
                   mgoods.gdas.photo.getGdasPhotoPage(type, data_value);
               });*/

             //## 리뷰고도화 1차 ## 포토 이미지 클릭 시 슬라이드 노출
	           	$('.thum_swipe a.item').on('click', function(e){
	           		e.preventDefault();

	           		var $parent = $(this).parents('.thum_area_s'),
	           			idx = $(this).parent('li').index(),
	           			$target = $parent.next('.photo-view');

	           		$parent.remove();
	           		$target.show();

	           		// 리뷰고도화 1차 : 포토 이미지 크게 보기 slide
	           		setTimeout(function() {
	           			var photoViewSwiper = new Swiper($target.find('.photo-swiper'), {
	           				initialSlide: idx,
	           				nextButton: '.swiper-button-next',
	           				prevButton: '.swiper-button-prev',
	           				pagination: '.paging',
	           				loop: true
	           			});
	           		}, 50);
	           	});


	           //상품상세 화면 사이즈 MJH
//               console.log("사이즈");
               tabContsWrap.update();


           }
           tabContsWrap.update();
       },
       /**도움이돼요 Toggle**/
       setRecommGdasToggle : function(seq, myRevYn){
           var loginCheck = common.loginChk();
           //도움이 돼요 액션
           if(loginCheck){
               if(myRevYn == 'Y'){
//                   alert("본인이 작성한 리뷰는 추천할 수 없습니다.");
            	   alert("내가 쓴 리뷰는 추천할 수 없어요");
                   return;
               }else{
                   var param = {
                           gdasSeq : seq,
                           useYn : ($('#gdas_'+seq).hasClass('on') ? 'N' : 'Y')
                   }
                   var resultData = mgoods.gdas.setRecommGdas(param);
                   var result = resultData.trim();
                   //console.log("#### result ####" + result);
                   if ( result == '000' ){
                       var tmp_recommCnt = parseInt($('input[name=recommCnt_'+seq+']').val());
                       if($('#gdas_'+seq).hasClass('on')){
                           $('#gdas_'+seq).removeClass('on');
                           tmp_recommCnt = tmp_recommCnt - 1;
                           if(tmp_recommCnt > 999){
                               $('#gdas_'+seq).find('span').html('999+');
                           }else if(tmp_recommCnt < 0){
                               $('#gdas_'+seq).find('span').html('0');
                               $('input[name=recommCnt_'+seq+']').val('0');
                           }else{
                               $('#gdas_'+seq).find('span').html(tmp_recommCnt);
                           }
                           $('input[name=recommCnt_'+seq+']').val(tmp_recommCnt);
                       }else if( !($('#gdas_'+seq).hasClass('on'))){
                           $('#gdas_'+seq).addClass('on');
                           tmp_recommCnt = tmp_recommCnt + 1;
                           $('input[name=recommCnt_'+seq+']').val(tmp_recommCnt);
                           $('#gdas_'+seq).find('span').html(tmp_recommCnt);
                           if(tmp_recommCnt > 999){
                               $('#gdas_'+seq).find('span').html('999+');
                           }
                       }
                   }
               }
           }else{
               common.link.moveLoginPage();
           }
       },
       setRecommGdas : function(param){
           if (param.gdasSeq == undefined || param.gdasSeq == "" ) {
               alert("등록이 실패하였습니다.\n 리뷰 정보가 없습니다.");
               return;
           }
           var callBackResult = "";
           common.Ajax.sendRequest(
                     "POST"
                   , _baseUrl + "goods/setRecommGdasAjax.do"
                   , param
                   , function(res) {
                       callBackResult = res;
                   }
                   , false
           );
           return callBackResult;
       },
       backBtnAction : function(){
           $('#mWrapper').css('display','block');
           $('.gdasPopCont').css('display','none');
           $('.gdasPopCont').empty();
           $('body').removeClass('bgb').removeClass('bgw');
           
           if( $(location).attr('href').indexOf('&gdasFilter=Y')  > -1  || $(location).attr('href').indexOf('getGdasFilterPop.do') > -1){
               history.back();    
               PagingCaller.destroy();
           }else  if( $(location).attr('href').indexOf('&gdasReport=Y')  > -1){
               history.back();
           }else  if( $(location).attr('href').indexOf('&photoList=Y')  > -1  || $(location).attr('href').indexOf('getGdasPhotoListPop.do') > -1){
               PagingCaller.destroy();
               history.back();
           }else if($(location).attr('href').indexOf('&photoPlDetail=Y')  > -1){
               history.back();
           }else if( $(location).attr('href').indexOf('&photoDetail=Y')  > -1 ){
               history.back();
               tabContsWrap.update();
           }else if($(location).attr('href').indexOf('viewType=all')  > -1 ){
               history.back();
           }else if($(location).attr('href').indexOf('viewType=mypage')  > -1 ){
               history.back();
           }
       },
       goGdasReportPop : function(gdasSeq, goodsNo, itemNo, myRevYn){
           var loginCheck = common.loginChk();
           //신고하기 팝업
           if(loginCheck){
               // [상품평개편] 클릭 지표 추가 - 2019.4.11
               // 상품상세 > [탭] 상품평 > 신고
               if(myRevYn == 'Y'){
//                   alert("본인이 작성한 리뷰는 신고할 수 없습니다.");
            	   alert("내가 쓴 리뷰는 신고할 수 없어요");
               }else{
                   try{                    
                       common.wlog("goods_reports");
                   }catch(e){}
                   //TODO
                   
                   if($(location).attr('href').indexOf('&gdasReport=Y') < 0){
                       history.pushState(null, null, window.location.href + '&gdasReport=Y');
                   }
                   $('.gdasPopCont').css('display','block');
                   
                   setTimeout(function(){
                       $('#mWrapper').css('display','none');
                   }, 100)
                   
                   var url = _baseUrl + "goods/getGdasReportPop.do";
                   var data ={
                           gdasSeq : gdasSeq,
                           goodsNo : goodsNo,
                           itemNo : itemNo,
                           pageIdx : mgoods.gdas.pageIdx
                   }
                   common.Ajax.sendRequest("GET",url,data, mgoods.gdas.dcl._callBackgetGdasDclList);
               }
           }else{
               common.link.moveLoginPage();
           }
       },
       goReviewerProfile : function(gdasSeq){
	       	sessionStorage.setItem("gdasSession", true);
	       	location.href= _baseUrl+"mypage/getReviewerProfile.do?key="+gdasSeq;
       },
}

$.namespace("mgoods.gdas.eval");
mgoods.gdas.eval = {
        goodsNo : $('#goodsNo').val(),
        changeOption : false,
        init: function(){
        	//console.log("### mgoods.gdas.eval.init #### ");
        	//console.log("###gdasPossibleSize #### " +   $('#gdasPossibleSize').val());
        	//########### 리뷰 고도화 1차 #############
        	// 1. 비로그인시 작성버튼 숨김처리
        	// 2. 구매 대상 상품이 아닐경우 숨김처리
        	// 3. 구매 이후 , 90 일 지난경우 숨김처리
        	//###################################
        	if ( !common.isLogin() ){
        		$(".btnOne.bg").hide();
        	}

        	if ( $('#gdasPossibleSize').val()==0 ){
        		$(".btnOne.bg").hide();
        	}

//            var frstTabIdx3 = 'N'
//            $("#gdasInfo > .goods_reputation").bind("click", function(){
//                if(frstTabIdx3 =="N"){
//
//                	//console.log("### mgoods.gdas.eval.init 클릭 #### ");
//
//                    mgoods.gdas.eval.initGdasEval();
//                    frstTabIdx3 = 'Y';
//                }else{
//                    mgoods.gdas.initGdasListPaging(mgoods.gdas.pageIdx, true);
//                }
//            });
        },
        /**상품평 요약 init**/
        initGdasEval : function(){
        	//console.log("### mgoods.gdas.eval.initGdasEval #### ");
        	//console.log("#### mbrNo ####" +$('#mbrNo').val() );
            var url = _baseUrl + "goods/getGdasNewListAjax.do";
            var data ={
                    goodsNo:mgoods.gdas.eval.goodsNo,
                    gdasSort : mgoods.gdas.gdasSort,
            };

            //console.log("### mgoods.gdas.eval.initGdasEval data #### " + JSON.stringify(data));

            common.Ajax.sendRequest("POST",url,data,mgoods.gdas.eval._callBackGdasEval);
        },
        /**상품평 요약 callBack**/
        _callBackGdasEval : function(data){
        	//console.log("###### _callBackGdasEval ######");
            $('#gdasWrap').append(data);
//            상품상세 사이즈 MJH
            tabContsWrap.update();
            
            mgoods.gdas.init();
            
          //스와이프 정지, CSS 스크롤 사용
			$('.review_thum').on('touchstart, touchmove', function(){
//				console.log("aa");
			    tabContsWrap.disableTouchControl();
			});
			$('.review_thum').on('touchend', function(){
//				console.log("bb");
				tabContsWrap.enableTouchControl();
			});
			
			
        },
        getGdasSummary : function(){

        	//console.log("### mgoods.gdas.eval.getGdasSummary #### ");

            var url = _baseUrl + "goods/getGdasSummaryAjax.do";
            var data ={
                    goodsNo:mgoods.gdas.goodsNo,
                    gdasSeq  : '',
                    fileSeq : '',
                    gdasSort : mgoods.gdas.gdasSort,
                    itemNo : $('#gdasItemNo').val()
            }

            //console.log("### mgoods.gdas.eval.getGdasSummary data #### "+JSON.stringify(data));

            common.Ajax.sendRequest("POST",url,data,mgoods.gdas.eval._callBackgetGdasSummary);
        },
        _callBackgetGdasSummary : function(data){

        	//console.log("### mgoods.gdas.eval.getGdasSummary _callBackgetGdasSummary  #### "+JSON.stringify(data));

            if($('.product_rating_area').length > 0){
                $('.product_rating_area').remove();
            }

            //## 리뷰 고도화 1차 ## : 제거
            //if($('.review_thum').length > 0){
            //    $('.review_thum').remove();
            //}

            if($('.poll_result').length > 0){
                $('.poll_result').remove();
            }

            //## 리뷰 고도화 1차 ## : 제거
           // if($('.txtNoCate').length > 0){
           //    $('.txtNoCate').remove();
           // }
            //## 리뷰 고도화 1차 ## : 제거 및 변경
            //$('.banner_ex').before(data);
            $('.review_option').before(data);

            //console.log("### mgoods.gdas.eval.changeOption  #### "+ mgoods.gdas.eval.changeOption);
            if(mgoods.gdas.eval.changeOption){
            	//console.log("######>>>>" + $('#selectedNum').val());
                //$('.product_rating_area .inner .star_area .total em').html($('.review_wrap.renew .sel_option_box .item em').html());
                $('.product_rating_area .inner .star_area .total em').html($('#selectedNum').val());//## 리뷰 고도화 1차 ## 추가
            }
         },
}

$.namespace("mgoods.gdas.photo");
mgoods.gdas.photo = {
        photoPageIdx : 1,
        gdasSeq : $('#gdasSeqPhoto').val(),
        goodsNo : $('#goodsNoPhoto').val(),
        fileSeq : $('#fileSeqPhoto').val(),
        itemNo : $('#gdasItemNo').val(),
        /**상품 포토 목록 호촐***/
        initList : function(){
            mgoods.gdas.photo.getPhotoListPaging(mgoods.gdas.photoPageIdx);
        },
        /**상품 포토 목록 호출**/
        getPhotoListPaging : function(page){
          //연속키 방식
            common.showLoadingLayer(false);
            PagingCaller.init({
                callback : function(){
                    var param = {
                            goodsNo : mgoods.gdas.goodsNo,
                            itemNo : $('#gdasItemNo').val(),
                            pageIdx : mgoods.gdas.photo.photoPageIdx, // 페이징 인덱스
                    }
                    common.Ajax.sendRequest(
                            "GET"
                            , _baseUrl + "goods/getGdasPhotoListJson.do"
                            , param
                            , mgoods.gdas.photo._callBackGetPhotoListListPaging
                            , false);
                }
            ,startPageIdx : page
            ,subBottomScroll : 700
            ,initCall : ( mgoods.gdas.photo.photoPageIdx > 1 ) ? false : true
            });
        },
        /**상품 포토 목록 paging JSON**/
        _callBackGetPhotoListListPaging : function(res){
            common.hideLoadingLayer();
            if($.trim(res).length == 0){
                //포토 목록이 존재하지 않을때
                if($('#photoList').find('li').length < 1){
                    var noHtml = '<li>등록된 상품사진이 존재하지 않습니다.</li>';
                    $('#photoList').html(noHtml);
                }
                //응답 결과가 없을 경우 마지막 목록임- 스크롤 이벤트 제거
                PagingCaller.destroy();
                return;
            }else{
                //포토 목록 템플릿 APPEND
                $('#photoListTemplate').tmpl(res).appendTo('#photoList');
                $(document).scrollTop(0);
            }
            
            $('#photoList li').click(function(e){
                e.preventDefault();
                var type = 'photoADetail';
                var data_value = $(this).find('img.review_img').attr('data-value').split('_');
                sessionStorage.setItem("gdasSession", true);
                window.location.href = _baseUrl + "goods/getGdasPhotoDetailPop.do?viewType=all&goodsNo="+mgoods.gdas.goodsNo+"&gdasSeq="+data_value[0]+"&fileSeq="+data_value[1];
            });
            
            mgoods.gdas.photo.photoPageIdx = mgoods.gdas.photo.photoPageIdx + 1;
        },
        /**상품 상세 Ajax 호출***/
        initGdasDetail : function(newGdasSeq){
            var url = _baseUrl + "goods/getGdasDetailJson.do";
            var param ={goodsNo:$('#goodsNoPhoto').val(), gdasSeq  : newGdasSeq, fileSeq : mgoods.gdas.fileSeq};
            common.Ajax.sendRequest("POST",url,param,mgoods.gdas.photo._callBackGetGdasDetail);
        },
        /**상품 상세 데이터 render**/
        _callBackGetGdasDetail : function(res){
            var tmpCont = '' ;
            if(res.gdasCont != null && res.gdasCont != ''){
                tmpCont = unescape(res.gdasCont);
                tmpCont = tmpCont.replace(/<img(.*?)>/gi,"");   //이미지 태그 제거
                tmpCont = tmpCont.replaceAll("\r\n","<br/>");
                tmpCont = tmpCont.replaceAll(" ","&nbsp;");
                tmpCont = tmpCont.replace(/(<h1 style(.*?)>|<h1>|<h1\/>|<\/h1>|<h2 style(.*?)>|<h2>|<h2\/>|<\/h2>|<h3 style(.*?)>|<h3>|<h3\/>|<\/h3>)/g, '');   //h1,h2, h3 태그 제거
                tmpCont = tmpCont.replace(/(<span style(.*?)>|<span>|<\/span>|<strong style(.*?)>|<strong>|<\/strong>)/g, '');   //strong, span태그 제거
                tmpCont = tmpCont.replace(/(<em style(.*?)>|<em>|<\/em>|<u style(.*?)>|<u>|<\/u>|<s style(.*?)>|<s>|<\/s>)/g, '');   //em, u, s태그 제거
                res.gdasCont = tmpCont;
            }
            if(res.addInfoNm != [] && res.addInfoNm != null &&  res.addInfoNm != 'null'){
         	   var tmpAddInfoNm = res.addInfoNm;
         	   var addInfoCnt = 0;
         	   var troubleCnt = 0;
         	   for(var j = 0; j < tmpAddInfoNm.length; j++){
         		   if(tmpAddInfoNm[j].colDataCd.substr(0,1) == 'C'){
         			   troubleCnt++;
         			   //trouble 코드 2개이상일 경우 나머지 제거
         			   if(troubleCnt == 2){
         				   tmpAddInfoNm.splice(j+1, tmpAddInfoNm.length-1)
         			   }
         		   }
         	   }
         	   res.addInfoNm = tmpAddInfoNm;
            }
            
            if(res.shrtGdasCont != '' && res.shrtGdasCont !=  null){
            	res.typeClass = 'type2';
            }else{
            	res.typeClass = 'type1';
            }
            $('#photoDetail').empty();
            $('#gdasPhotoDetailTemplate').tmpl(res).appendTo('#photoDetail');
            if(res.itemNm != undefined && res.itemNm != null && res.itemNm.trim() != '' ){
                $('.pageFullWrap').addClass('option');
            }else{
                $('.pageFullWrap').removeClass('option');
            }
            
            //열고 닫히는 스크립트 실행
            var pageFullWrap = $('.pageFullWrap');
            review_summary = $('#photoDetail.review_summary'),
            txt_over = review_summary.find('.txt_area .txt_over'),
            txt_show = review_summary.find('.txt_area .txt_show'),
            txt_height = txt_show.height(),
            btn_toggle = $('.review_summary .btn_toggle'),
            photo_view = $('.photo_view'),
            photo_dim = '<div class="photo_dim"></div>',
            baseHeight = '42px',
            speed = 100;
            btn_toggle.hide();
            txt_show.hide();
            if(pageFullWrap.hasClass('option')){
                if(txt_height > 42){btn_toggle.show();}
            }else{
                if(txt_height > 54){btn_toggle.show();}
            }
            var review_summary_h = $('.review_summary.photo').outerHeight();
            pageFullWrap.css('padding-bottom', review_summary_h);
            btn_toggle.on('click', function(){
                if(review_summary.hasClass('open')){
                    txt_show.stop(0).animate({
                        height:baseHeight,
                    }, speed);
                    txt_show.delay(5000).hide();
                    txt_over.delay(10000).show();
                    photo_view.find('.photo_dim').remove();
                    review_summary.removeClass('open');
                    btn_toggle.html('더보기');
                }else{
                    txt_over.hide();
                    txt_show.css('height', 'auto');
                    var th = txt_show.height();
                    txt_show.show().stop(0).animate({
                        height:th,
                    }, speed).scrollTop(0);
                    photo_view.append(photo_dim);
                    review_summary.addClass('open');
                    btn_toggle.html('접기');
                }
            });
        },
        getGdasPhotoPage : function(type, data_value){
            var url = '', viewType='';
            common.showLoadingLayer(false);
            if($(location).attr('href').indexOf('&'+type) < 0){
                history.pushState(null, null, window.location.href + '&'+type+'=Y');
            }
            $('.gdasPopCont').css('display','block');
            
            setTimeout(function(){
                $('#mWrapper').css('display','none');
            }, 100)
            
            if(type == 'photoList'){
                url =  _baseUrl + "goods/getGdasPhotoListPop.do";
                viewType = '';
                $('body').addClass('bgw');
            }else if(type == 'photoDetail'){
                url = _baseUrl + "goods/getGdasPhotoDetailPop.do";
                viewType = 'summary_thumb'
            }else if(type == 'photoPlDetail'){
                url = _baseUrl + "goods/getGdasPhotoDetailPop.do";
                viewType = 'personal'
            }else if(type == 'photoADetail'){
                url = _baseUrl + "goods/getGdasPhotoDetailPop.do";
                viewType = 'all'
            }
            
            var data ={
                    goodsNo : viewType == 'personal' ? '' : mgoods.detail.goodsNo,
                    gdasSeq : data_value[0],
                    fileSeq : data_value[1],
                    itemNo :$('#gdasItemNo').val(),
                    viewType : viewType
            }
            common.Ajax.sendRequest("POST",url,data,mgoods.gdas.photo._callBackgetGdasPhotoPage);
            
        },
        _callBackgetGdasPhotoPage : function(data){
            common.hideLoadingLayer();
            $('.gdasPopCont').html(data);
            swiperSlider();
        }
}

$.namespace("mgoods.gdas.dcl");
mgoods.gdas.dcl  = {
       goodsNo : $('#goodsNo').val(),
       init : function(){
           mgoods.gdas.pageIdx = $("#currentPageIdx").val();
           /**상품평 신고 등록**/
           $('#regBtn').click(function(e){
               e.preventDefault();
               var dclCont = $('.txtarea_report textarea').val().trim();
               if($('input[name="report_type"]:checked').val() == undefined){
                   alert('신고 사유를 선택해 주세요.');
                   return;
               }
               if(dclCont.length > 1000){
                   alert("최대 1,000자까지 입력 가능합니다.");
                   return;
               }
               $('#dclCont').val(dclCont);
               $('#dclCausCd').val($('input[name="report_type"]:checked').val());
               
               var param = {
                       gdasSeq : $('#gdasDclSeq').val(),
                       goodsNo : $('#goodsNo').val(),
                       itemNo : $('#gdasItemNo').val(),
                       dclCausCd : $('#dclCausCd').val(),
                       dclCont : $('#dclCont').val()
               }
               common.Ajax.sendRequest("POST"
                       , _baseUrl + "goods/registGdasDcl.do"
                       , param
                       , mgoods.gdas.dcl.regGdasDclCallBack
               );
           });
           
           $('#cxlBtn').click(function(e){
               mgoods.gdas.backBtnAction();

           })
       },
       _callBackgetGdasDclList : function(data){
           $('body').addClass('bgw');
           $('.gdasPopCont').html(data);
       },
       regGdasDclCallBack : function(res){
           if(res == '000'){
               alert('신고 내용이 접수 되었습니다.');
               mgoods.gdas.backBtnAction();

           }else{
               alert('리뷰 신고 도중 문제가 발생하였습니다.\n 다시 작성해주세요');
               return;
           }
       },
       chkTxtCnt : function(obj, maxByte){
           
           var strValue = obj.value;
           var strLen = strValue.length;
           var totalByte = 0;
           var len = 0;
           var oneChar = "";
           var str2 = "";

           for (var i = 0; i < strLen; i++) {
               oneChar = strValue.charAt(i);
               if (escape(oneChar).length > 4) {
                   totalByte += 2;
               } else {
                   totalByte++;
               }
    
               // 입력한 문자 길이보다 넘치면 잘라내기 위해 저장
               if (totalByte <= maxByte) {
                   len = i + 1;
               }
           }
    
           // 넘어가는 글자는 자른다.
           if (totalByte > maxByte) {
               alert("최대 "+maxByte+"자까지 입력 가능합니다.");
               str2 = strValue.substr(0, len);
               obj.value = str2;
               mgoods.gdas.dcl.chkTxtCnt(obj, maxByte);
           }
       },
       
}

$.namespace("mgoods.gdas.filter");
mgoods.gdas.filter  = {
        myProfile : false,
        goodsNo : $('#goodsNo').val(),
       init : function(){
           sessionStorage.setItem("gdasSession", true);
           //console.log("#####???" + sessionStorage.getItem("gdasSession"));
           //console.log("#####???" +sessionStorage.getItem('set_filter_profile'));
           if(sessionStorage.getItem('set_filter_profile') != '' && sessionStorage.getItem('set_filter_profile') != null && typeof sessionStorage.getItem('set_filter_profile') != 'null'){
        	   //alert(sessionStorage.getItem("set_filter_profile"));
               var profileList = sessionStorage.getItem("set_filter_profile").split(",");
               $(".skin_choice_box input[type='radio'], .skin_choice_box input[type='checkbox']").each(function(e){
                   for(var i in profileList){
                       if($(this).val() == profileList[i]){
                           $(this).prop('checked', true);
                           $(this).siblings('label').addClass('on');
                       }
                   };
               });
           }
           if(sessionStorage.getItem('myPfCk') != '' && sessionStorage.getItem('myPfCk') != null && sessionStorage.getItem('myPfCk') != undefined &&  typeof sessionStorage.getItem('myPfCk') != 'null'){
               var myProfile = sessionStorage.getItem('myPfCk') ;
               if(myProfile == 'Y'){
                   $('#my_profile').prop('checked',true);
                   mgoods.gdas.filter.myProfile = true;
               }else{
                   $('#my_profile').prop('checked',false);
                   mgoods.gdas.filter.myProfile = false;
               }
              sessionStorage.removeItem("myPfCk");
           }
           $('#my_profile').click(function(){
               try{
                   // [상품평개편] 클릭 지표 추가 - 2019.4.11
                   // 상품상세 > [탭] 상품평 > 내 프로필 맞춤
                   common.wlog("goods_profile_fit");
               }catch(e){}
               
               var loginCheck = common.loginChk();
               if(loginCheck){
                   if($(this).is(":checked")){
                      mgoods.gdas.filter.profileCheck();
                   }else{
                       $(".skin_choice_box input[type='radio'], .skin_choice_box input[type='checkbox']").each(function(e){
                           $(this).prop('checked', false);
                           $(this).siblings('label').removeClass('on');
                       });
                   }
               }else{
                   sessionStorage.setItem("gdasSession", true);
                   common.link.moveLoginPage();
               }
           });
           
           $('#modiBtn').click(function(e){
               try{
                   // [상품평개편] 클릭 지표 추가 - 2019.4.11
                   // 상품상세 > [탭] 상품평 > 내 프로필 설정
                   common.wlog("goods_profile_setting");
               }catch(e){}
               
               e.preventDefault();
               var loginCheck = common.loginChk();
               if(loginCheck){
                   window.location.href = _baseUrl + "mypage/getMySkinCondition.do ";
               }else{
                   common.link.moveLoginPage();
               }
           });
           
           $('#resetBtn').click(function(e){
               e.preventDefault();
               var ck_confirm = confirm('필터를 초기화 하시겠습니까?');
               if(ck_confirm){
                     $(".skin_choice_box input[type='radio'], .skin_choice_box input[type='checkbox']").each(function(e){
                         $(this).prop('checked', false);
                         $(this).siblings('label').removeClass('on');
                     });
                     mgoods.gdas.filter.myProfile = false;
                     $('#btnConfirm').click();
               }else{
                   return false;
               }
           });
           
           $('#btnConfirm').click(function(e){
               // [상품평개편] 클릭 지표 추가 - 2019.4.11
               // 상품상세 > [탭] 상품평 > (상품평 필터) 적용
               try{    
                   common.wlog("goods_filter_sumit");
               }catch(e){}  
               
               e.preventDefault();
               var checkCd =  jQuery.map($('input[name="sati_type1"]:checked,input[name="sati_type2"]:checked, :checkbox[name="sati_type3"]:checked, input[name="sati_type4"]:checked, input[name="sati_type5"]:checked'), function (n, i) {
                 return n.value;
                 }).join(',');
               if(mgoods.gdas.filter.myProfile){
                   sessionStorage.setItem('myPfCk', 'Y');
               }else{
                   sessionStorage.setItem('myPfCk', 'N');
               }

               //alert(checkCd);
               //alert($('#retUrl').val());
               sessionStorage.setItem("set_filter_profile", checkCd );
               location.href=$('#retUrl').val();
           });
           
           $('.skin_choice_box input[type=radio]').on('click',function(){
               var _this = $(this),
               _label = _this.siblings('label');
               
               if(_label.hasClass('on')){
                   _this.prop('checked',false);
                   _label.removeClass('on');
               }else{
                   _this.parent().parent().find('input[type=radio]').prop('checked',false);
                   _this.parent().parent().find('label').removeClass('on');
                   _this.prop('checked', true);
                   _label.addClass('on');
               }
               mgoods.gdas.filter.myProfile = false;
               $('#my_profile').prop('checked',false);
           });
           
           $('.skin_choice_box input[type=checkbox]').on('click',function(){
               mgoods.gdas.filter.myProfile = false;
               $('#my_profile').prop('checked',false);
           });
           
       },
       getNowFilter : function(param){
           if (param.cdArr == undefined || param.cdArr == "" ) {
               return;
           }else{
               var callBackResult = "";
               common.Ajax.sendRequest(
                       "POST"
                       , _baseUrl + "goods/getNowFilter.do"
                       , param
                       , function(res) {
                           callBackResult = res;
                       }
                       , false
               );
               return callBackResult;
           }
       },
       getMyProfile : function(){
           var callBackResult = "";
           var param = {};
           common.Ajax.sendRequest(
                     "POST"
                   , _baseUrl + "goods/getMyProfileAjax.do"
                   , param
                   , function(res) {
                       callBackResult = res;
                   }
                   , false
           );
           return callBackResult;
       },
       profileCheck : function(){
           var resultData = mgoods.gdas.filter.getMyProfile();
           if(resultData.retCode = '000'){
               $(".skin_choice_box input[type='radio'], .skin_choice_box input[type='checkbox']").each(function(e){
                   $(this).prop('checked', false);
                   $(this).siblings('label').removeClass('on');
               });
               if(resultData.profileCnt > 0){
                   $(".skin_choice_box input[type='radio'], .skin_choice_box input[type='checkbox']").each(function(e){
                       for(var i in resultData.profileList){
                           if($(this).val() == resultData.profileList[i].colDataCd){
                               $(this).siblings('label').addClass('on');
                               $(this).prop('checked', true);
                           }
                       };
                       mgoods.gdas.filter.myProfile = true;
                   });
               }else{
                   $('#my_profile').prop('checked', false);
                   var ck_confirm = confirm('등록된 프로필이 없습니다. 내 프로필을 등록 하시겠어요?');
                   if(ck_confirm){
                       window.location.href = _baseUrl + "mypage/getMySkinCondition.do ";
                   }else{
                       return false;
                   }
               }
           }
       },
}

function swiperSlider(){
    var slideIdx = parseInt($('#slideIdx').val());
    var viewType = $('#viewType').val();
    var photoListLength = parseInt($('#photoListLength').val());
    var photoView_swiper = new Swiper('#photoView', {
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        loop:   (photoListLength == 1) ? false : true,
        initialSlide: slideIdx,
        pagination : ($('#photoDetail').length > 0) ? '' : '.paging',
        paginationClickable : ($('#photoDetail').length > 0) ? false : true,
        observer: true,
        observeParents: true,
        onInit: function(){
          if((photoListLength == 1) && viewType != 'personal'){
              mgoods.gdas.photo.initGdasDetail($('#photoView .swiper-slide.swiper-slide-active').find('img').attr('name'));
          }
        },
        onSlideChangeStart: function(swiper){
            if($('#photoDetail').length > 0){
                var prev_gdas_seq = 0, prev_file_seq = 0, after_gdas_seq = 0, after_file_seq = 0, now_gdas_seq = 0;
                var data_value = $('#photoView .swiper-slide.swiper-slide-active').find('img').attr('data-value');
                if(data_value != undefined && data_value != null && data_value != ''){
                    var tmp_data = $('#photoView .swiper-slide.swiper-slide-active').find('img').attr('data-value').split('_');
                    prev_gdas_seq = tmp_data[0], prev_file_seq = tmp_data[1], after_gdas_seq = tmp_data[2], after_file_seq = tmp_data[3];
                    now_gdas_seq = $('#photoView .swiper-slide.swiper-slide-active').find('img').attr('name');
                    if(now_gdas_seq != prev_gdas_seq || now_gdas_seq != after_gdas_seq){
                    	if($('#photoDetail').html().length > 0){
                    		mgoods.gdas.photo.initGdasDetail(now_gdas_seq);
                    	}
                    }
                    if($('#photoDetail').html().length == 0){
                        mgoods.gdas.photo.initGdasDetail(now_gdas_seq);
                    }
                }
            }
         },
         
    });
    
}

//상품평 등록
$("#regGdasBtn").click(function(){
    var param = '';
    param = 'goodsNo=' + mgoods.gdas.goodsNo + '&retUrl=' + $(location).attr('href');
    
    try{
        // [상품평개편] 상품평쓰기 클릭 지표 추가 - 2019.4.11
        // 상품상세 > 상품평쓰기
        common.wlog("goods_gdas_write");
    }catch(e){}
    
    if ( common.isLogin() ){
        param = {
            goodsNo : mgoods.gdas.goodsNo,
        };

        common.showLoadingLayer(false);
        common.Ajax.sendRequest("POST", _baseUrl + "mypage/getGdasEdasPossibeCount.do", param,
                getGdasEdasPossibeCountCallback);
    }else{
        common.link.moveLoginPage();
    }
});

getGdasEdasPossibeCountCallback = function(jsonObj) {
    var param = '';
    param = 'goodsNo=' + mgoods.gdas.goodsNo + '&retUrl=' + $(location).attr('href');
    
    //loadingLayer
    common.hideLoadingLayer();
    json = jsonObj;
    
    if( json.possibleSize  > 0 ){
        
        window.location.href = _baseUrl + 'mypage/getGdasList.do?'+ param;
        
    }else{
        alert('리뷰 작성 가능한 상품을 마이페이지에서 확인해주세요');
//        alert('상품 구매 후 리뷰를 작성해주세요');
//        alert('구매 후 리뷰를 작성하시기 바랍니다.');
        return false;
    }
    
};

//상품 상세 높이 수정
function zoomSet_h(){
    var _tContsWrap = $('#tabContsWrap'),
    	_tContWrapper = _tContsWrap.children('.tab-wrapper'),
    	_tContInxs = _tContWrapper.children('.swiper-slide-active').attr('data-menu-index');
    	_tContActive_h = _tContWrapper.children('.swiper-slide-active').height();
    	_tContWrapper_h = _tContWrapper.height(),
    	_zoomHolder = $('.zoomHolder'),
    	_zoomHolder_h = _zoomHolder.height(),
    	_th = _tContWrapper_h+_zoomHolder_h;
    	
    /* console.log(_tContWrapper_h);
    console.log(_zoomHolder_h);
    console.log(_th);
    console.log(_tContInxs); */
    if(_tContInxs == 1){
        _tContWrapper.css('height', _th);    
    }else{
        _tContWrapper.css('height', _tContActive_h);
    }
    					    
}

