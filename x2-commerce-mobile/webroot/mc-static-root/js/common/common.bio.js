$.namespace("common.bio");
common.bio = {
    //바이오인증 사용(가능) 여부
    isBiometric : function() {
        var isCheck = false;
        if (common.app.appInfo.isapp) {
            var isVer = common.app.appInfo.appver.replace(/\./gi, "");
            var isOS  = common.app.appInfo.ostype;
            if (isOS == "10" && parseInt(isVer) >= 217) {
                isCheck = true;
            } else if (isOS == "20" && parseInt(isVer) >= 215) {
                isCheck = true;
            }
        }
        return isCheck;
    },
        
    /* 바이오인증 안내 팝업 열기 */
    biometricLayerOpen : function() {
        if (common.app.appInfo.isapp) {
            var isBio   = common.bio.isBiometric();
            var asLogin = localStorage.getItem("isLoginPage");
            var isBiometrics = localStorage.getItem("isBiometrics");
            var isLogin = common.isLogin();
            var isOS    = common.app.appInfo.ostype;
            var isModel = common.app.appInfo.devicemodel.replace(/\s/gi, "").toLowerCase();
            
            var isFaceID = false;
            
            if (isBio && isBiometrics == "Y" && asLogin == "Y" && isLogin) {
                var isBiometricInfo = common.bio.biometricsInfoAjax();
                var isLayer = localStorage.getItem("biometricLayerHide_" + isBiometricInfo.mbrNo);
                
                if (isBiometricInfo.biometricYn == "N" && isLayer != "Y") {
                    setTimeout(function() {
                        if (isOS == "10") {
                            var NON_MODEL      = ["iPhone", "iPhone 3G", "iPhone 3GS", "iPhone 4", "iPhone 4S", "iPhone 5"];
                            var TOUCH_ID_MODEL = ["iPhone 5s", "iPhone 6", "iPhone 6 Plus", "iPhone SE", "iPhone 6s", "iPhone 6s Plus", 
                                                  "iPhone SE", "iPhone 7", "iPhone 7 Plus", "iPhone 8", "iPhone 8 Plus",
                                                  "iPad Air 2", "iPad 5", "iPad 6", "iPad Air 3", "iPad Mini 3", "iPad Mini 4",
                                                  "iPad Mini 5", "iPad Pro(12.9-inch)", "iPad Pro(9.7-inch)", "iPad Pro2(12.9-inch)", "iPadPro(10.5-inch)"];
                            var FACE_ID_MODEL  = ["iPhone X", "iPhone XR", "iPhone XS Max", "iPhone XS", "iPad Pro(11-inch)", "iPad Pro3(12.9-inch)"];
                            
                            for (var i=0; i<NON_MODEL.length; i++) {
                                var model = NON_MODEL[i].replace(/\s/gi, "").toLowerCase();
                                if (model == isModel) {
                                    // 바이오 로그인 팝업 띄우지 않는 경우 앱에 푸시 수신 동의 팝업 오픈 요청
                                    common.app.callBioLoginAgrCallBack();
                                    return;
                                }
                            }
                            
                            for (var i=0; i<FACE_ID_MODEL.length; i++) {
                                var model = FACE_ID_MODEL[i].replace(/\s/gi, "").toLowerCase();
                                if (model == isModel) {
                                    isFaceID = true;
                                    break;
                                }
                            }
                            
                            try {
                                if (parseInt(common.app.appInfo.osver) >= 13 && isModel.indexOf("iphone11") > -1) {
                                    isFaceID = true;
                                }
                            } catch (e) {}
                            
                            if (isFaceID) {
                                $("span#bio_txt_1").html("Face");
                                $("span#bio_txt_2").html("Face");
                            }
                        }
                        common.popLayerOpen("touchLogin");
                        $('.dim').show();
                    }, 500);
                }
            } else if(asLogin == "Y" && isLogin) {
            	common.app.callBioLoginAgrCallBack();
            }
            
            localStorage.removeItem("isLoginPage");
            localStorage.removeItem("isBiometrics");
        }
    },
        
    /* 바이오인증 안내 팝업 닫기 */
    biometricLayerClose : function() {
        if (common.app.appInfo.isapp) {
            common.popLayerClose('touchLogin');
            var isChecked = $("input[name='biometricHide']").is(":checked");
            if (isChecked) {
                common.bio.biometricLayerHide();
            }
        }
    },
        
    /* 바이오인증 안내 팝업 다시 보지 않기 */
    biometricLayerHide : function() {
        if (common.app.appInfo.isapp) {
            var isBiometricInfo = common.bio.biometricsInfoAjax();
            localStorage.setItem("biometricLayerHide_" + isBiometricInfo.mbrNo, "Y");
        }
    },
        
    /* 바이오인증 정보 조회 */
    biometricsInfoAjax : function() {
        if (common.app.appInfo.isapp) {
            var isBiometrics = {};
            var url = _baseUrl + "common/biometricsInfoAjax.do";
            $.ajax({
                type  : 'POST',
                url   : url,
                data  : {},
                cache : false,
                async : false,
                dataType : 'json',
                beforeSend : function() {
                },
                success : function(data) {
                    if (Object.keys(data).length === 0) {
                            isBiometrics = {
                                'biometricYn' : '',
                                'autoLoginYn' : '',
                                'mbrNo'       : ''
                            };
                    } else {
                        isBiometrics = {
                            'biometricYn' : data.biometricYn,
                            'autoLoginYn' : data.autoLoginYn,
                            'mbrNo'       : data.mbrNo
                        };
                    }
                    
                },
                complete : function() {
                },
                error : function () {
                }
            });
            return isBiometrics;
        }
    },
    
    /* 바이오인증 사용 여부 저장 */
    biometricsUpdate : function(param) {
        if (common.app.appInfo.isapp) {
            var url = _baseUrl + "common/updateBiometricsInfoAjax.do";
            var deviceInfo = {'biometricYn' : 'Y'};
            $.ajax({
                type  : 'POST',
                url   : url,
                data  : deviceInfo,
                cache : false,
                async : false,
                dataType : 'json',
                beforeSend : function() {
                },
                success : function(data) {
                    common.bio.biometricLayerClose();
                    $('#txt_fixed').show();
                    setTimeout(function() {
                        $('#txt_fixed').fadeOut();
                    }, 2000);
                },
                complete : function() {
                },
                error : function () {
                    common.bio.biometricLayerClose();
                }
            });
        }
    }
};