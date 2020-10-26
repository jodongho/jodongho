$.namespace("common.Top");
common.Top = {
	logout : function() {
		window.location.replace(_baseUrl + "logout.do");
	},
	toIndexPage : function() {
		window.location.replace(_baseUrl + "main/main.do");
	},
	toLoginPage : function() {
		window.location.replace(_secureUrl + "login/loginForm.do");
	},
	toRegistrationPage : function() {
        document.frmJoin.submit();
        //window.location.replace(_secureUrl + "customer/registerForm.do");
    },
	toUpdateForm : function() {
		window.location.replace(_secureUrl + "customer/updateForm.do");
	},
	withdraw : function() {
		window.location.replace(_secureUrl + "customer/withdraw.do");
	},
	changeLocale : function(locale) {
		window.location.replace(_baseUrl + "common/changeLocale.do?_locale="
				+ locale);
	}
};