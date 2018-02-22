function uselessWebButton( button, popup ) {

	// UI elements
	var buttonElement = button;
	var popupElement = popup;

	var initialClick = false;
	var randomRange = 6;

	// Useless websites: url | uses flash 
	// Commented out websites which have crashed.
	var sitesList = [
		['http://heeeeeeeey.com/',                                    false],
		['http://thatsthefinger.com/',                                false],
		['http://cant-not-tweet-this.com/',                           false],
		['http://eelslap.com/',                                       false],
		['http://www.staggeringbeauty.com/',                          false],
 		['http://burymewithmymoney.com/',                             true],
		['http://www.fallingfalling.com/',                            true],
		['https://just-shower-thoughts.tumblr.com/',                   false],
		['http://ducksarethebest.com/',                               false],
		['http://www.trypap.com/',                                    false],
		['http://www.republiquedesmangues.fr/',                       false],
		['http://www.movenowthinklater.com/',                         false],
		['http://www.partridgegetslucky.com/',                        false],
		['http://www.rrrgggbbb.com/',                                 true],
		['http://beesbeesbees.com/',                                  false],
		['http://www.sanger.dk/',                                     true],
		['http://www.koalastothemax.com/',                            false],
		['http://www.everydayim.com/',                                false],
		['http://www.leduchamp.com/',                                 true],
		['http://grandpanoclothes.com/',                              false],
		['http://www.haneke.net/',                                    false],
		['http://r33b.net/',                                          true],
		['http://randomcolour.com/',                                  false],
		['http://cat-bounce.com/',                                    true],
		['http://www.sadforjapan.com/',                               true],
		['http://www.taghua.com/',                                    true],
		['http://chrismckenzie.com/',                                  true],
		['http://hasthelargehadroncolliderdestroyedtheworldyet.com/', false],
		['http://ninjaflex.com/',                                     false],
		['http://iloveyoulikeafatladylovesapples.com/',               true],
		['http://ihasabucket.com/',                                   false],
		['http://corndogoncorndog.com/',                              false],
		['http://giantbatfarts.com/',                                 true],
		['http://www.ringingtelephone.com/',                          true],
		['http://www.pointerpointer.com/',                            false],
		['http://www.pleasedonate.biz/',                              false],
		['http://imaninja.com/',                                      false],
		['http://willthefuturebeaweso.me/',                           false],
		['http://salmonofcapistrano.com/',                            false],
		['http://www.ismycomputeron.com/',                            false],
		['http://www.wwwdotcom.com/',                                 false],
		['http://www.nullingthevoid.com/',                            true],
		['http://www.muchbetterthanthis.com/',                        true],
		['http://www.ouaismaisbon.ch/',                               true],
		['http://iamawesome.com/',                                    false],
		['http://www.pleaselike.com/',                                false],
		['http://crouton.net/',                                       false],
		['http://corgiorgy.com/',                                     false],
		['http://www.electricboogiewoogie.com/',                      true],
		['http://www.nelson-haha.com/',                               false],
		['http://www.wutdafuk.com/',                                  false],
		['http://unicodesnowmanforyou.com/',                          false],
		['http://tencents.info/',                                     false],
		['http://intotime.com/',                                      true],
		['http://leekspin.com/',                                      true],
		['http://minecraftstal.com/',                                 false],
		['http://www.patience-is-a-virtue.org/',                      false],
		['http://whitetrash.nl/',                                     false],
		['http://www.theendofreason.com/',                            false],
		['http://zombo.com',                                          true],
		['http://secretsfornicotine.com/',                            true],
		['http://pixelsfighting.com/',                                false],
		['http://crapo.la/',                                          false],
		['http://baconsizzling.com/',                                 false],
		['http://isitwhite.com/',                                     false],
		['http://noot.space/',                                        false],
		['http://tomsdog.com/',                                       false],
		['http://hardcoreprawnlawn.com/',                             false],
		['http://www.omfgdogs.com/',                                  false],
		['http://thefo.nz/',                                          false],
		['http://oct82.com/',                                         false],
		['http://semanticresponsiveillustration.com/',                true]
	];

	var sites = null;

	// Prepares and binds the button
	var init = function() {

		button.onclick = onButtonClick;

		// If the browser doesn't support flash. Remove flash websites from the list.
		if ( !swfobject.hasFlashPlayerVersion("1") ) {
			removeFlashWebsites();
		}

		sites = sitesList.slice(0);

		// If the Browser supports html5 storage
		if ( supportsHtmlStorage() === true ) {

			// Check for past data
			if ( localStorage[ 'sites' ] !== undefined ) {
				loadSites();
			}
		}
	};

	// Removes flash websites from the list
	var removeFlashWebsites = function() {
		
		var i, site;
		var newList = [];

		for ( i = 0; i < sitesList.length; i++ ) {
			
			site = sitesList[i];
			if ( site[1] === false ) {
				newList.push( site )
			}
		}

		sitesList = newList;
	};

	// Selects and removes the next website from the list
	var selectWebsite = function() {

		var site, range, index;
		
		range = randomRange > sites.length ? sites.length : randomRange;
		index = Math.floor( Math.random() * range );

		site = sites[index];
		sites.splice( index, 1 );

		return site;
	};

	// Opens the given url in a new window
	var openSite = function( url ) {
		window.open( url );
	};

	var onButtonClick = function() {

		// Track click count.
		_gaq.push(['_trackEvent', 'user', 'clicks', 'button']);

		// Change text from "TO A"
		if ( initialClick === false ) {
			document.getElementById( 'joint' ).innerHTML = 'TO ANOTHER';
			initialClick = true;
		}

		var url = selectWebsite()[0];
    	openSite( url );

    	// User has visited ALL the sites... refresh the list.
    	if ( sites.length == 0 ) {

    		// If the browser doesn't support flash. Remove flash websites from the list.
			if ( !swfobject.hasFlashPlayerVersion("1") ) {
				removeFlashWebsites();
			}

			sites = sitesList.slice(0);
    	}

    	storeSites();
	};

	// Save the current list of sites for the new user.
	var storeSites = function() {
		localStorage[ 'sites' ] = JSON.stringify( sites );
	}

	// Load the list of sites, so new users see new sites.
	var loadSites = function() {
		sites = JSON.parse( localStorage['sites'] );
	};

	init();
}
function supportsHtmlStorage() {
	try {
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch (e) {
		return false;
	}
}
