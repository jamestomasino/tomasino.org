(function (NS) {
	"use strict"

	function t ( s, d ) {
		for(var p in d)
			s=s.replace(new RegExp('{'+p+'}','g'), d[p]);
		return s;
	}

	var namespace = new NS ( 'lib' );
	namespace.Template = t;
})(window.NS);
