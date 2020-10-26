$.namespace("mcounsel");
mcounsel = {
        init : function(){
            //문의하기 & 문의내역 탭이동
            $(".twoSet li").click(function(){
                mcounsel.reg.tabSelect($(this).attr("id"));
            });
            
            $("#"+idx).click();
        },
        
        back : function(){
            if($("#mTab").find("li.on").attr("id") == "qnaForm"){
                if(confirm("문의를 취소하시겠습니까?\n작성중인 글은 삭제됩니다.")){
                    history.back();
                    return false;
                }
            }else{
                history.back();
            }
            return false;
        }
};

$.namespace("mcounsel.reg");
mcounsel.reg = {
        init : function(){
            //고객기본eamil setting
            mcounsel.reg.emailSet();
            
            $("#cnslSubmit").on();
            
            //고객 기본 hp setting
            if($("#cellSctNo").val()!=undefined &&$("#cellSctNo").val() != ""){
                $("#rgnNoSelect").val($("#cellSctNo").val()).attr("selected","selected")
            }
            
            $(".sms").removeAttr("disabled");
            $("[name='emailAddr1']").bind("keyup", function() {
                var reg = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g;
                if($(this).val().match(reg)){
                    $(this).val($(this).val().replace(reg, ""));
                    alert("한글은 입력할 수 없습니다.");
                }
            });
            
            $("[name='inqCont']").bind("keyup", function() {
                if($("[name='inqCont']").val().length > 2000) {
                    alert("최대 2000자까지 입력 가능합니다.");
                    $("[name='inqCont']").val($("[name='inqCont']").val().substr(0,2000));
                    $("[name='inqCont']").focus();

                    return false;
                }
            });
            
            $(".chkSmall").click(function(){
                if($(this).is(":checked")){
                    if($(this).attr("name")=="emailRcvYn"){
                        $(".email").removeAttr("disabled"); 
                    }else if($(this).attr("name")=="smsRcvYn"){
                        $(".sms").removeAttr("disabled"); 
                    }
                }else{
                    if($(this).attr("name")=="emailRcvYn"){
                        $(".email").attr("disabled","disabled");
                    }else if($(this).attr("name")=="smsRcvYn"){
                        $(".sms").attr("disabled","disabled");
                    }
                }
            });
            
            //추천FAQ 숨김
            $(".sch_rst_area2").hide();
            
            //상품선택 숨김
            //이미 등록된 문의 승계경우  
            if(common.isEmpty($("#cnslSeq").val())){
                $("#cnslGoodsSelect").hide();
            }else{
                if($("#goodsYn").val()=="N"){
                    $("#cnslGoodsSelect").hide();
                }
            }
            
            $("#emailAddrSelect").change(function(){
                if($("#emailAddrSelect").val()!= "-1"){
                    $("[name='emailAddr1']").val($("[name='emailAddr']").val().split("@")[0]);
                }
            });
            
            //1차 문의유형 카테고리
            $("#cnslLrgCate").change(function(){
                var lrgCate = $("#cnslLrgCate").val();
                $(".sch_rst_area2").hide();
                $(".faq_list").empty();
                if(common.isEmpty($("#cnslSeq").val())){
                    $("#cnslGoodsSelect").hide();
                }else{
                    if($("#goodsYn").val()=="N"){
                        $("#cnslGoodsSelect").hide();
                    }
                }
                $(".inquiryBox").attr("style","border-top: 1px solid #ddd;");
                
                if(lrgCate != undefined && lrgCate != "" ){
                    //카테고리ajax수정부분
                    var url =_baseUrl+"counsel/getFaqCateJson.do";
                    
                    $.ajax({
                        type   : "POST"
                       ,url    : url
                       ,data   : {grpSctCd :lrgCate}
                       ,dataType : "json"
                       ,success: function(data){
                           var str = "";
                           if(data.length > 0){
                               var size =data.length;
                               for(i = 0; size > i; i++){
                                   str+="<option value='"+data[i].cd+"' name='"+data[i].grpSctCd+"'>"+data[i].mMrkNm+"</option>";
                               }
                               
                               $("#cnslMidCate").html(str);
                               
                               $("#cnslMidCate").removeAttr("disabled");
                               $("#cnslMidCate option").eq(0).show();
                               $("#cnslMidCate option").eq(0).prop("selected", true);
                               
                               var faqUrl = $("#cnslLrgCate").val();
                               var midCate = $("#cnslMidCate option").eq(0).val();
                               
                               
                               var faqUrl = _baseUrl +"counsel/getRecommFAQ.do";
                               var data = {faqLrclCd : lrgCate , faqMdclCd : midCate}
                                  
                               common.Ajax.sendRequest("POST", faqUrl, data, mcounsel.reg._callBackGetFaqList);
                               
                               //10:주문결제 20:배송 30:교환/반품/환불
                               if((lrgCate == "10" && midCate != "11") || lrgCate == "20" || (lrgCate == "30" && midCate != "17")) {
                                   $("#cnslGoodsSelect").show();
                               }else{
                                   if(common.isEmpty($("#cnslSeq").val())){
                                       $("#cnslGoodsSelect").hide();
                                   }else{
                                       if($("#goodsYn").val()=="N"){
                                           $("#cnslGoodsSelect").hide();
                                       }
                                   }    
                               }
                           }
                        }
                     });
                    

                }else{
                    $("#cnslMidCate").html("<option value=''>선택해주세요</option>");
                    $("#cnslMidCate").attr("disabled",true);
                }

            });
            
            //2차 문의유형 카테고리
            $("#cnslMidCate").change(function(){
                var lrgCate = $("#cnslLrgCate").val();
                var midCate = $("#cnslMidCate").val();
                
                if(lrgCate != "" && midCate !=""){
                    var url = _baseUrl +"counsel/getRecommFAQ.do";
                    var data = {faqLrclCd : lrgCate , faqMdclCd : midCate}
                   
                    common.Ajax.sendRequest("POST", url, data, mcounsel.reg._callBackGetFaqList);
                };
                //10:주문결제 20:배송 30:교환/반품/환불
                if((lrgCate == "10" && midCate != "11") || lrgCate == "20" || (lrgCate == "30" && midCate != "17")) {

                    $("#cnslGoodsSelect").show();
                }else{
                    if(common.isEmpty($("#cnslSeq").val())){
                        $("#cnslGoodsSelect").hide();
                    }else{
                        if($("#goodsYn").val()=="N"){
                            $("#cnslGoodsSelect").hide();
                        }
                    }
                }
            });
            
            //파일첨부 웹에서 테스트시 필요. 추후 앱 변경시 삭제예정
            $(".btnFile").click(function(){
                if(!common.isEmpty($(".btnFileAdd").val())){
                    alert("파일은 1개만 등록 가능합니다.");
                }else{
                    if (common.app.appInfo.isapp) {
                        //안드로이드 인 경우에만 스킴적용
                        if(common.app.appInfo.ostype=="20"){
                            common.app.callImgSelector();
                        }else{
                            $(".btnFileAdd").click();
                        }
                    } else {
                        $(".btnFileAdd").click();
                    }
                }   
            });
            
            
            
            //파일첨부시 파일명 노출
            $(".btnFileAdd").change(function(){
                var file = $(".btnFileAdd")[0].files[0];
                var fileExt = /.(bmp|jpg|jpeg|gif|png)$/i;
                //5 * 1024 * 1024
                if(file.size > 5242880){
                    $(".btnFileAdd").val("");
                    alert("5MB미만의 이미지 파일만 첨부할 수 있습니다.");
                    return;
                };
                //TO-DO 파일사이즈체크 정의 필요
                if(!fileExt.test(file.name)){
                    $(".btnFileAdd").val("");
                    alert("등록할 수 없는 파일 형식입니다.");
                    return;
                };
                
                if(!common.isEmpty($(".btnFileAdd").val())){
                    $(".fileName").show();
                    $(".fileName span").html(file.name);
                }else{
                    $(".fileName").hide();
                }
                
                var canvasImg = new Image();
                
                canvasImg.onload = function(e) {
                    //canvas에 선택한 이미지 draw
                    var canvas = document.getElementById('canvas');                
                    var ctx = canvas.getContext('2d');

                    //배율
                    var magnification = 1;

                    //500픽셀에 맞도록 배율 조정
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
                    } catch (e) {
                        imgCheck = true;
                    }
                }

                try {
                    reader.readAsDataURL(file);
                } catch (e) {
                    imgCheck = true;
                }
                    
            });
            

            //파일삭제
            $(".btnDelete").click(function(){
                if(confirm("첨부파일을 삭제하시겠습니까?")){
                    $(".btnFileAdd").val("");
                    $(".fileName").hide();
                    $(".fileName span").html("");

                    //canvas에 선택한 이미지 draw
                    var canvas = document.getElementById('canvas');                
                    var ctx = canvas.getContext('2d');

                    // 픽셀 정리
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    // 컨텍스트 리셋
                    ctx.beginPath();
                }
            });

            //1:1문의 등록
            $("#cnslSubmit").click(function(){
                if ($(".fileName span").text() != "") {
                    //canvas에 선택한 이미지 draw
                    var canvas = document.getElementById('canvas');                
                    var ctx = canvas.getContext('2d');
                    var uploadImg = canvas.toDataURL();
                    
                    var param = {
                        orgFileNm : $(".fileName span").text(),
                        imgFile : uploadImg
                    };
                    common.Ajax.sendRequest("POST"
                        , _baseUrl + "counsel/qnaImgUploadJson.do"
                        , param
                        , function(res) {
                            if (res.trim() != "") {
                                $("#cnslFileName").val($(".fileName span").text());
                                $("#cnslFileUrl").val(res.trim());
                            }
                        }
                        , false
                    );
                }
                
                mcounsel.reg.cnslSubmit();
            });
            
            //연락처 숫자체크
            $("[name='cellTxnoNo'],[name='cellEndNo']").bind("keyup",function(){
                $(this).val( $(this).val().replace(/[^0-9]/g,""));
            });
 
            //상품선택레이어팝업
            if(common.isEmpty($("#cnslSeq").val())){
                $("#cnslGoodsSelect").click(function(){
                    mcounsel.list.pagingInit("cnslOrdFlt","-1");
                });
            }else{
                if($("#goodsYn").val()=="N"){
                    $("#cnslGoodsSelect").click(function(){
                        mcounsel.list.pagingInit("cnslOrdFlt","-1");
                    });
                }
            }
            
            //문의내용 글자수
            $("[name='inqCont']").bind("input",function(){
                if($("[name='inqCont']").val().length > 2000){
                    alert("최대 2000자까지 입력 가능합니다.");
                    $("[name='inqCont']").val($("[name='inqCont']").val().substr(0,2000));
                    $(".review_editor .byte").html("("+$("[name='inqCont']").val().length+"/2000자)");  
                    $("[name='inqCont']").focus();
                    return false;
                }else{
                    $(".review_editor .byte").html("("+$("[name='inqCont']").val().length+"/2000자)");  
                }
            });

        },
        
        emailSet : function(){
            if($("[name='emailAddr']").val() != undefined && $("[name='emailAddr']").val() != "" && $("[name='emailAddr']").val().indexOf("@") > 0){
                if($("#emailAddrSelect option").is("[value='@"+$("[name='emailAddr']").val().split("@")[1]+"']")){
                    $("[name='emailAddr1']").val($("[name='emailAddr']").val().split("@")[0]);
                    $("#emailAddrSelect").val("@"+$("[name='emailAddr']").val().split("@")[1]).attr("selected","selected"); 
                }else{
                    $("[name='emailAddr1']").val($("[name='emailAddr']").val());
                }
               
            }
        },

        tabSelect : function(id, idx, goodsNm){
            
           //BI Renewal. 20190918. nobbyjin. - 1:1문의 작성시에는 유틸바 hidden 
           if(id == "qnaForm"){
               $("#footerTab").addClass("fhide");
               $("#footerTab").hide();
           } else {
               $("#footerTab").removeClass("fhide");
               $("#footerTab").show();
           }
            
           if(id=="qnaList" && $("#qnaForm").attr("class") =="on"){
               if(!confirm("문의를 취소하시겠습니까?\n작성중인 글은 삭제됩니다.")){
                   return false;
               }
           }
           if($("#"+id).attr("class")!="on"){
               $("#"+id).attr("class","on");
               $("#"+id).attr("title","현재 선택된 메뉴");
               $("#"+id).siblings().removeAttr("class");
               $("#"+id).siblings().removeAttr("title");
               var param = "";
               if(!common.isEmpty(idx)){
                   if(!common.isEmpty(goodsNm)){
                       param = "?cnslSeq="+idx+"&goodsNm="+goodsNm; 
                   }else{
                       param = "?cnslSeq="+idx;
                   }
               }else{
                   if(!common.isEmpty(goodsNm)){
                       param = "?goodsNm="+goodsNm;
                   }
               }

               var onTab = $(".twoSet li.on").attr("id");
               if(onTab == "qnaForm"){
                   var url = _baseUrl + "counsel/getQnaFormAjax.do"+param;;
                   if(common.loginChk()){
                       common.Ajax.sendRequest("POST",url,'',mcounsel.reg._callBackQnaAjax); 
                   }
               }else {
                   var url = _baseUrl + "counsel/getQnaListAjax.do"+param;
                   if(common.loginChk()){
                       common.Ajax.sendRequest("POST",url,'',mcounsel.reg._callBackQnaAjax);
                   }
               }
           }
        },

        //상품선택 레이어팝업 콜백
        _callBackGoodsLayerOpen : function(data) {
            if($.trim(data).length == 0){
                PagingCaller.destroy();
                if($(".orderPrdList").find("li").length==0){
                    $(".sch_no_data").show();
                    $("#cnslGoodsSet").hide();
                    $(".orderPrdList").hide();
                }
                if($("#pop-full-wrap").css("display") =="none"){
                    $("#pop-full-contents").html($("#cnslOrdListPop").html());
                    common.popFullOpen("문의상품 선택", mcounsel.reg.cnslOrdPopupClose);  
                }
            }else{
                $(".orderPrdList").append(data);
                $(".sch_no_data").hide();
                $("#cnslGoodsSet").show();
                if($("#pop-full-wrap").css("display") =="none"){
                    $("#pop-full-contents").html($("#cnslOrdListPop").html());
                    common.popFullOpen("문의상품 선택", mcounsel.reg.cnslOrdPopupClose);  
                }
            }
            $("#cnslOrdListPop .orderPrdList").empty();
        },
        //상품선택
        orderGoodsSelect : function(){
            if($(".orderPrdList").find("[type='radio']:checked").size() > 0){
                $(".ordTit").text($(".orderPrdList").find("[type='radio']:checked").siblings(".nm").attr("value"));
                $("[name='ordNo']").val($(".orderPrdList").find("[type='radio']:checked").closest(".ordList").attr("id"));
                $("[name='goodsNo']").val();
                $("[name='goodsSeq']").val();
                
                //상품인경우
                if($(".orderPrdList").find("[type='radio']:checked").parent().is(".prd_chk")){
                    $("[name='ordNo']").val();
                    $("[name='goodsNo']").val($(".orderPrdList").find("[type='radio']:checked").val());
                    $("[name='goodsSeq']").val($(".orderPrdList").find("[type='radio']:checked").attr("seq"));
                }
            }else{
                alert("선택된 상품이 없습니다.");
                return false;
            }
            common.popFullClose();
        },
        cnslOrdPopupClose : function(){
            if($('#pop-full-wrap').css("display")== "none"){
                PagingCaller.destroy(); 
            }
        },

        //주문상품선택 기간조회
        cnslOrdSelect : function(val){
            var value = val;
            $(".orderPrdList").empty();
            mcounsel.list.pagingInit("cnslOrdFlt", value);
        },
        
        //주문 상세상품 조회
        orderInfoClick : function(chk){
            if($(chk).hasClass('more') && $(chk).next('.order_detail').length > 0){
                if($(chk).parent().hasClass('open')){
                    $(chk).parent().removeClass('open');
                    $(chk).text('상품선택');
                    $('.orderPrdList').find('.order_chk input[type="radio"]').removeAttr('disabled');
                    $('.orderPrdList').find('.order_info').removeClass('disabled');
                }else{
                    $(chk).parent().addClass('open').siblings().removeClass('open');
                    $('.orderPrdList').find('.more').text('상품선택');
                    $(chk).text('주문선택');
                    $('.orderPrdList').find('.order_chk input[type="radio"]').attr('disabled','disabled').removeAttr('checked');
                    $('.orderPrdList').find('.order_info').addClass('disabled');
                }
            }
        },

        validChk : function(){
            var cnslLrgCate = $("#cnslLrgCate").val();
            var cnslMidCate = $("#cnslMidCate").val();
            if(common.isEmpty(cnslLrgCate)||common.isEmpty(cnslMidCate)){
                alert("문의유형을 선택하세요");
                $("#"+cnslLrgCate).focus();
                return false;
            }
            
            if($("[name='inqCont']").val().length==0 ||$.trim($("[name='inqCont']").val())==""){
                alert("문의내용을 입력하세요");
                $("[name='inqCont']").focus();
                return false;
            }

            if($("[name='smsRcvYn']").is(":checked")){
                if($("[name=cellTxnoNo]").val()==""){
                    alert($("[name=cellTxnoNo]").attr("title"));
                    $("[name=cellTxnoNo]").focus();
                    return false;
                }
                if($("[name=cellTxnoNo]").val().length < 3 ){
                    alert("3자~4자까지만 입력가능합니다.");
                    $("[name=cellTxnoNo]").focus();
                    return false;
                }
                if($("[name=cellEndNo]").val().length < 4 ){
                    alert("4자만 입력가능합니다.");
                    $("[name=cellEndNo]").focus();
                    return false;
                }
                if($("[name=cellEndNo]").val()==""){
                    alert($("[name=cellEndNo]").attr("title"));
                    $("[name=cellEndNo]").focus();
                    return false;
                }
                
            }
            
            if($("[name='emailRcvYn']").is(":checked")){
                if($("[name='emailAddr1']").val()==""){
                    alert("이메일 주소를 입력해 주세요")
                    $("[name='emailAddr1']").focus();
                    return false;
                }
                //직접입력인경우
                if($("#emailAddrSelect").val()=="-1"){
                    var regExp = /[0-9a-zA-Z][_0-9a-zA-Z-]*@[_0-9a-zA-Z-]+(\.[_0-9a-zA-Z-]+){1,2}$/;
                    var emailAddr1= $("[name='emailAddr1']").val();
                    if(!emailAddr1.match(regExp)){
                        alert("올바른 이메일 형식이 아닙니다.")
                        return false;
                    }
                    $("[name='emailAddr']").val(emailAddr1);
                }else{ //직접입력이 아닌 경우
                    if($("[name='emailAddr1']").val().indexOf("@") != -1){
                        alert("올바른 이메일 형식이 아닙니다.")
                        return false;
                    }
                    $("[name='emailAddr']").val($("[name='emailAddr1']").val()+$("#emailAddrSelect").val());
                }
                
                
            }
            return true;
        },
        
        //Submit
        cnslSubmit : function(){
            if(mcounsel.reg.validChk()){
                var param = $("#cnslRegForm").serialize();
                
                common.Ajax.sendRequest(                       
                        "POST"
                        , _baseUrl + "counsel/regQnaAjax.do"
                        , param
                        , mcounsel.reg._callBackCnslRegAjax
                        , false);
            }; 
        },
        
        _callBackCnslRegAjax : function(data){
            var idx = data.idx;
            alert(data.showMessage);
            //$("#mTab").find("li").removeClass("on");

            setTimeout(function(){
//                mcounsel.init();
//                $("#mContainer #titConts").scrollTop(0);
                common.link.moveCounselListPage();
            }, 100);
        },
        
        _callBackQnaAjax : function(data){
            $("#tab_contents").html("");
            $("#tab_contents").html(data);
            $("#cnslLrgCate").focus();
            
            //BI Renewal. 20190918. nobbyjin. - 1:1문의 작성시에는 유틸바 hidden 
            var onTab = $(".twoSet li.on").attr("id");
            if(onTab == "qnaForm"){
                $("#footerTab").addClass("fhide");
                $("#footerTab").hide();
            } else {
                $("#footerTab").removeClass("fhide");
                $("#footerTab").show();
            }
        },
        
        _callBackGetFaqList : function(data){
            //임시처리
            /*var lrgCate = $("#cnslLrgCate").val();
            var midCate = $("#cnslMidCate").val();
            if(lrgCate == "20"  && midCate == "12"){
                alert("3/4~3/10 브랜드 세일 진행시 예상을 크게 상회한 대량주문으로 인해 현재 배송이 지연되고 있습니다. \n빠른 배송될 수 있도록 노력중이니, 많은 양해 부탁드립니다.");
            }*/
            
            var faqList = "";
            if(data != null && data.length > 0){
                for(i = 0; i < data.length ; i ++){
                    $(".faq_list").html("");
                    faqList += "<li>" +
                    		        "<div class=\"faq_tit\">" +
                    		            "<span>Q</span><a href=\"#\" title=\"답변 열기/닫기\">"+data[i].inqTitNm+"</a>" +
                    		        "</div>" +
                    		        "<div class=\"faq_cont\">" +
                    		            "<div class=\"inner_cont\">"+
                    		                data[i].ansCont +
                    		            "</div>" +
                    		         "</div>" +   
                    		    "</li>"           
                }
                $(".faq_list").append(faqList);
                $(".inquiryBox").removeAttr("style");
                $(".sch_rst_area2").show();
                $(".faq_list").show();
                
                
                //FAQ 답변보기
                $('.faq_list .faq_tit > a').click(function(e){
                    e.preventDefault();
                    if($(this).parents('li').hasClass('on')){
                        $(this).parents('li').removeClass('on');
                    }else{
                        $(this).parents('li').addClass('on').siblings().removeClass('on');
                    }
                });
            }else{
                $(".inquiryBox").attr("style","border-top: 1px solid #ddd;");
                $(".faq_list").html("");
                $(".sch_rst_area2").hide();
            }
        }

        
};

$.namespace("mcounsel.list");
mcounsel.list = {

        init : function(){
            $("#cnslFltDate").change(function(){
                var id =$(this).attr("id");
                var value = $(this).val();
                $(".ask_list").empty();
                mcounsel.list.pagingInit(id, value);
            })

        },
        pagingInit : function(id,value){
          //페이징
            PagingCaller.init({
                callback : function(){
                    if(value == null){
                       value =-1;
                    }

                    //코드 완료 후 정보 조회
                    mcounsel.list.getCnslListPaging(PagingCaller.getNextPageIdx(), id, value);
                }
                ,subBottomScroll : 700
                //초기화 시 최초 목록 call 여부
                ,initCall : true 
            });
        },
        
        getCnslListPaging : function(pageIdx, id, value) {
            var param = {
                    pageIdx : pageIdx,
                    id : value
                };

            //주문상품리스트
            if(common.loginChk()){
                if(id =="cnslOrdFlt"){
                    var param = {
                            pageIdx : pageIdx,
                            cnslOrdFlt : value
                        };
                    common.Ajax.sendRequest("POST"
                            , _baseUrl + "counsel/getQnaGoodsListAjax.do"
                            , param
                            , mcounsel.reg._callBackGoodsLayerOpen
                        );
                    
                //문의내역리스트    
                }else if(id== "cnslFltDate"){
                    var param = {
                            pageIdx : pageIdx,
                            cnslFltDate : value
                        };
                    common.Ajax.sendRequest("POST"
                            , _baseUrl + "counsel/getMyCnslListJson.do"
                            , param
                            , mcounsel.list._callBackgetCnslListPaging
                        );
                }
            }   
        },
        
        _callBackgetCnslListPaging : function (res){
             var str = "";
             if ($.trim(res).length == 0) {
                 PagingCaller.destroy();
                 if($(".ask_list").find("li").length==0){
                     $(".sch_no_data").show();
                 }
                 return;
             }else{
                 
                 for(i=0; i < res.length; i++){
                     str += '<li>';
                     str +=     '<div class="ask_tit">';
                     str +=         '<div class="area" onClick="javascript:mcounsel.list.viewAnswer(this, ' + res[i].cnslSeq + ');">';
                     if(res[i].cnslProcStatCd == '40'){
                         str +=         '<span class="prc_tp end">답변완료</span>';
                     }else if(res[i].cnslProcStatCd == '10'){
                         str +=         '<span class="prc_tp ing">답변대기</span>';
                     } else {
                         str +=         '<span class="prc_tp ing" style="background:#f27370">답변중</span>';
                     }
                     str +=             '<span class="tit_date">'+res[i].cnslRegDtime+'</span>';
                     str +=             '<p>'+res[i].inqTitNm+'</p>';
                     str +=         '</div>';
                     str +=     '</div>';
                     str +=     '<div class="ask_cont">';
                     str +=         '<div class="ask_info">';
                     str +=             '<div class="cont_info">';
                     str +=                 '<span class="tit">문의</span>';
                     if((res[i].offlineYn != null && res[i].offlineYn == "Y")
                             || (res[i].ordRegDtime != null && res[i].ordRegDtime != ""||(res[i].ordRegDtime != null && res[i].ordRegDtime != "" )||(res[i].fileNm != null && res[i].fileNm != ""))){
                         str +=             '<ul>';
                         if(res[i].offlineYn != null && res[i].offlineYn == "Y"){
                             str +=             '<li class="offline">오프라인 매장 문의</li>';
                         }
                         if(res[i].ordRegDtime != null && res[i].ordRegDtime != ""){
                             str +=             '<li><span class="date">주문일자</span>'+res[i].ordRegDtime+'</li>';
                         }
                         if(res[i].ordNo != null && res[i].ordNo != ""){
                             str +=             '<li><span class="date">문의상품</span>'+res[i].goodsNm+'</li>';
                         }
                         if(res[i].fileNm != null && res[i].fileNm != ""){
                             str +=             '<li><span>첨부파일</span>'+res[i].fileNm+'</li>';
                         }
                         str +=             '</ul>';
                     }
                     str +=             '</div>';
                     str +=             '<div class="order_cont">' + common.convertSystemToJtmpl(res[i].inqCont) + '</div>';
                     str +=         '</div>';
                     /*
                     if(res[i].cnslProcStatCd == '40'){
                         str+='<div class="ask_answer">' +
                                  '<div class="cont_info"><span class="tit">답변</span> <span class="date">'+res[i].ansRegDtime+'</span></div>' +
                                  '<div class="txt_answer">' +
                                       common.convertSystemToJtmpl(res[i].mbrGdCont) +
                                  '</div>' +
                                  '<div class="more_ask">' +
                                      '<p>문의에 대한 답변이 부족하거나 추가 문의가 있으시다면 <span>새로운 문의</span>를 등록해주세요.</p>' +
                                      '<button type="button" onClick="javascript:mcounsel.reg.tabSelect(\'qnaForm\','+res[i].cnslSeq+',\''+res[i].goodsNm+'\');"><span>새로운 문의하기</span></button>' +
                                  '</div>' +
                               '</div>';             
                     }
                     */
                     str +=     '</div>';
                     str += '</li>' ;   
                 }
                 //$("#myCnslListTemplate").tmpl(res).appendTo(".ask_list");
                 
                 $(".ask_list").append(str);
                 $(".sch_no_data").hide();
                 return;
             }
        },
        viewAnswer : function (that, cnslSeq){
            if($(that).parents('li').hasClass('on')){
                $(that).parents('li').removeClass('on');
            }else{
                $(that).parents('li').addClass('on').siblings().removeClass('on');
                if($(that).parents('li').children('.ask_cont').data('openFlag') != "Y") {
                    mcounsel.list.getCounselReplyListJson($(that).parents('li').children('.ask_cont'), cnslSeq);
                }
            }
        },
        getCounselReplyListJson : function(that, cnslSeq) {
            var url = _baseUrl +"counsel/getCounselReplyListJson.do";
            $.ajax({
                type   : "POST"
               ,url    : url
               ,data   : {cnslSeq :cnslSeq}
               ,dataType : "json"
               ,success: function(data){
                   $.each(data, function(idx, obj) {
                       var strTag = '<div class="ask_answer">';
                       strTag +=        '<div class="cont_info">';
                       if(obj.cnslProcStatCd == "15" || obj.cnslProcStatCd == "20") {
                           strTag +=        '<span class="tit">' + obj.cnslProcStatNm + '</span>';
                       } else if(obj.cnslProcStatCd == "40") {
                           strTag +=        '<span style="color:#9bce26">' + obj.cnslProcStatNm + '</span>';
                       } else {
                           strTag +=        '<span style="color:#888">' + obj.cnslProcStatNm + '</span>';
                       }
                       strTag +=        '<span class="date">' + obj.cnslRegDtime + '</span></div>';  
                       strTag +=        '<div class="txt_answer">' + common.convertSystemToJtmpl(obj.replCont) + '</div>';
                       if(obj.cnslProcStatCd == "40") {
                           var strGoodsNm = "";
                           if(obj.goodsNm != null) {
                               strGoodsNm = obj.goodsNm;
                           }
                           strTag +=    '<div class="more_ask">';
                           strTag +=        '<p>문의에 대한 답변이 부족하거나 추가 문의가 있으시다면 <span>새로운 문의</span>를 등록해주세요.</p>';
                           strTag +=        '<button type="button" onClick="javascript:mcounsel.reg.tabSelect(\'qnaForm\',' + obj.cnslSeq + ', \'' + strGoodsNm + '\');"> <span>새로운 문의하기</span></button>';
                           strTag +=    '</div>';
                       }
                       strTag +=    '</li>';
                       $(that).append(strTag);
                       $(that).data('openFlag', 'Y');
                   });
               }
            });
        }
        
};