(function(NS){
	"use strict";

	var namespace = new NS ( 'lib' );
	namespace.Delegate = function(fn, context) {
		return function() {
			fn.apply(context, arguments);
		};
	};

})(window.NS);
