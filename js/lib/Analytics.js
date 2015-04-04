(function () {
	"use strict";

	/*************************************************************************/
	/***************************** Analytics *********************************/
	/*************************************************************************/

	/* This lib is a bit of overkill if you're only using a single analytics
	* toolset, like GoogleAnalytics. If you are using multiple, you can
	* connect them here and use the same methods to drive each. */

	var Analytics = function ( google_id ) {

		// Add Google Analytics script tag
		(function (win, doc, o, url, r, a, m) {
			win.GoogleAnalyticsObject = r;
			win[r] = win[r] || function () {
				(win[r].q = win[r].q || []).push(arguments);
			};
			win[r].l = 1 * new Date();
			a = doc.createElement(o);
			m = doc.getElementsByTagName(o)[0];
			a.async = 1;
			a.src = url;
			m.parentNode.insertBefore(a, m);
		})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

		// Set up Tracking object (allow localhost testing)
		if (/localhost/i.test(document.location.origin)) {
			window.ga('create', google_id, {
				'cookieDomain': 'none'
			});
		} else {
			window.ga('create', google_id);
		}
		window.ga('send', 'pageview');

		// Automatically hijack exit links
		if (window.addEventListener)
			document.body.addEventListener("click",this.onBodyClick,false);
		else
			document.body.attachEvent("onclick",this.onBodyClick);
	};

	var p = Analytics.prototype;

	p.onBodyClick = function (event) {
		var el = event.srcElement || event.target;

		/* Loop up the DOM tree through parent elements if clicked element is not a link (eg: an image inside a link) */
		while(el && (typeof el.tagName == 'undefined' || el.tagName.toLowerCase() != 'a' || !el.href)){
			el = el.parentNode;
		}

		if(el && el.href){
			var link = el.href;
			if(link.indexOf(location.host) == -1 && !link.match(/^javascript\:/i)) {
				var hitBack = function(link, target){
					target ? window.open(link, target) : window.location.href = link;
				};
				var target = (el.target && !el.target.match(/^_(self|parent|top)$/i)) ? el.target : false;
				ga(
					"send", "event", "Exit Link", link,
					document.location.pathname + document.location.search,
					{"hitCallback": hitBack(link, target)}
				);

				event.preventDefault ? event.preventDefault() : event.returnValue = false;
			}
		}
	};

	p.trackTime = function ( category, variable, value, label) {
		var trackObj = {
			'timingCategory': category,
			'timingVar': variable
		};

		if (typeof value == 'number') trackObj.timingValue = value;
		if (typeof label !== 'undefined') trackObj.timingLabel = label;

		ga('send', 'timing', trackObj );
	};

	p.trackEvent = function ( category, action, label, value ) {
		var trackObj = {
			'hitType': 'event',
			'eventCategory': category,
			'eventAction': action
		};

		if (typeof label !== 'undefined') trackObj.eventLabel = label;
		if (typeof value == 'number' && value >= 0) trackObj.eventValue = value;

		ga('send', trackObj, {'nonInteraction': 1});
	};

	var namespace = new NS ( 'lib' );
	namespace.Analytics = Analytics;

})();
