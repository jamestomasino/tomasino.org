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

	DOM.remove = function ( el ) {
		el = (typeof el === 'string') ? DOM.find(el) : el;
		if (el) {
			if (el.length) {
				var i = el.length; while (i--);
				if (el[i] && el[i].parentNode)
					el[i].parentNode.removeChild(el[i]);
			} else {
				el.parentNode.removeChild(el);
			}
		}
	};

	DOM.removeClass = function ( el, classname ) {
		el = (typeof el === 'string') ? DOM.find(el) : el;
		if (el) {
			var exp1 = /(?:^|\s)/;
			var exp2 = /(?!\S)/g;
			var exp  = new RegExp(exp1.source + classname + exp2.source);
			if (el.length) {
				var i=el.length; while (i--) {
					el[i].className = el[i].className.replace( exp, '' );
				}
			} else {
				el.className = el.className.replace( exp, '' );
			}
		}
	};

	DOM.addClass = function ( el, classname ) {
		el = (typeof el === 'string') ? DOM.find(el) : el;
		if (el) {
			if (el.length) {
				var i=el.length; while (i--) {
					if (el[i].className.indexOf(classname) === -1)
						el[i].className = (el[i].className === "") ? classname : el[i].className + " " + classname;
				}
			} else {
				if (el.className.indexOf(classname) === -1)
					el.className = (el.className === "") ? classname : el.className + " " + classname;
			}
		}
	}

	var namespace = new NS ( 'lib' );
	namespace.DOM = DOM;

})(window.NS);
