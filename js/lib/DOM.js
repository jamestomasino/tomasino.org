(function (NS) {

	var DOM = {};

	// Usage:
	// var el = DOM.create('<h1>hello world!</h1>');
	// document.body.appendChild(el);

	DOM.create = function( str ) {
		var frag = document.createDocumentFragment();
		var elem = document.createElement('div');
		elem.innerHTML = str;
		while (elem.childNodes[0]) {
			frag.appendChild(elem.childNodes[0]);
		}
		return frag;
	};

	// Usage:
	// var el = DOM.find('#someid');
	// var els = DOM.find('.someclass');
	// var els = DOM.find('li', someContextElement);

	DOM.find = function( a, b ){
		var c = a.match(/^(\W)?(.*)/);
		var o;
		var select = "getElement" + ( c[1] ? c[1] === "#" ? "ById" : "sByClassName" : "sByTagName");

		if (select === "getElementsByClassName" && ! document.getElementsByClassName) {
			o = ( b || document )["querySelectorAll"]( a );
			if ( /[\ \>]/.test(a) ) {
				console.log('WARNING: Using IE8 querySelectorAll fallback. This only supports simple selectors, not descendants.');
			}
		} else {
			o = ( b || document )[select]( c[2] )
		}
		return o;
	};

	var namespace = new NS ( 'lib' );
	namespace.DOM = DOM;

})(window.NS);
