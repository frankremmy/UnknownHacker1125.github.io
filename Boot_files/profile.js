




/*
     FILE ARCHIVED ON 14:11:27 Dec 6, 2016 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 22:51:35 Jan 10, 2017.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
function Profile(){
    this.info = null;
    this.loggedIn = false;
 
    
    //this.login = function(user, pass, JSONProfile, onComplete) {
    //    notify('.response.lresp','Logging in...','info fadeout');
    //    profile.info = JSONProfile ? JSON.parse(JSONProfile) : [];
    //    if (Object.keys(profile.info).length > 1) {
    //        profile.loggedI n = true;
    //        loggedIn();
    //    } else {
    //        $.get(hub+'api/?get=login&user='+user+'&pass='+pass).done(function(e){
    //            profile.info = e ? JSON.parse(e) : [];
    //            if (Object.keys(profile.info).length > 1) {
    //                profile.loggedIn = true;
    //                loggedIn();
    //                if(!onComplete === false) onComplete();
    //            } else {
    //                profile.loggedIn = false;
    //                notify('.response.lresp','Incorrect login!','error fadeout');
    //            }
    //            
    //        });
    //    }
    //}
    
    this.login = function(user, pass, responseId) {
	notify(responseId, 'logging in please wait...', 'loading');
	$.post(api('login'), {user: user, pass: pass}, function(e){
	    var response = e ? JSON.parse(e) : [];
            if (Object.keys(response).length > 0) {
		notify(responseId, response.details, 'success');
		if (response.success) {
                    profile.loggedIn = true;
                    profile.info = response.profile ? JSON.parse(response.profile) : [];
		    update_page_loggedin(true);
                    if (is_purchasing) {
                        //changeTab('choose-payment-method');
                        changePaymentStep(2);
                    }
		}
		
	    }
             
	    
	});
    }
    
    this.signup = function(user, pass, pass2, email, captcha, responseLocation, loginOnComplete){
        notify(responseLocation,'Creating account...','info');
        if (user == null || pass == null || pass2 == null || email == null || captcha == null) {
            notify(responseLocation,'Please fill out all fields!','error');
        }else if (pass != pass2) {
            notify(responseLocation,'Passwords don\'t match!','error');
        } else {
            $.post(api('signup'), {user: user, email: email, pass: pass, pass2: pass2, captcha: captcha}, function(e){
                var response = e ? JSON.parse(e) : [];
                if (Object.keys(response).length > 0 && response.success == true) {
                    notify(responseLocation,'Profile created!','success');
                    if (loginOnComplete) {
                        loginOnComplete();
                    }
                } else {
                    errors = '';
                    //response.errors.forEach(function(item){
                    //    errors += item + "<br/>"; 
                    //});
                    notify(responseLocation,response.errors[0],'error');
                    refreshCaptcha();
                }
            });    
        }
        
    }
    
    this.logout = function(onComplete){
        profile.loggedIn = false;
        $.get(api('logout')).done(function(){
	    update_page_loggedin(false);
	});
    }
}
var profile = new Profile();


 