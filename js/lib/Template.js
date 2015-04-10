(function (NS) {
	"use strict"

	if (!Array.isArray) {
		Array.isArray = function(arg) {
			return Object.prototype.toString.call(arg) === '[object Array]';
		};
	}

	var matcheach = /\{\{\s*\#each\s*(.*?)\}\}(.*)\{{\s*\/\s*each\s*\1\}\}/ig;
	var matchpre = /\{\{\s*/;
	var matchsuf = /\s*\}\}/;

	function t(template,data) {

		function r(template,obj,prefix) {

			for (var k in obj) {
				if (Array.isArray(obj[k])) {
					continue;
				} else if (typeof obj[k] === "object" && obj[k] !== null) {
					template=r( template, obj[k], (prefix) ? prefix + '\.' + k : k );
				} else {
					if (!obj.hasOwnProperty(k)) continue;
					var match = (prefix) ? prefix + '\.' + k : k;
					template=template.replace(new RegExp(matchpre.source + match + matchsuf.source,'g'), obj[k]);
				}
			}
			return template;
		}

		function e(template,data) {

			var each = matcheach.exec(template);
			var trim = template.replace(matcheach, '{{TEMPLATE-$1}}');
			var output = '';

			if (each && each.length) {
				each.shift();
				var keys = [];
				var patterns = [];
				var results = [];
				while (each.length) {
					keys.push( each.shift() );
					patterns.push ( each.shift() );
				}
				for (var i=0; i < keys.length; i++) {
					var subdata = data[keys[i]];
					results[i] = '';
					if (subdata) {
						if (Array.isArray(subdata)) {
							for (var j=0; j<subdata.length; ++j) {
								results[i] += e(patterns[i], subdata[j]);
							}
						} else {
							results[i] += e(patterns[i], subdata);
						}
						var match = 'TEMPLATE-' + keys[i];
						trim=trim.replace(new RegExp(matchpre.source + match + matchsuf.source,'g'), results[i]);
					}
				}
			}

			output += r(trim, data, "");
			return output;
		}

		return e(template, data);

	}

	var namespace = new NS ( 'lib' );
	namespace.Template = t;

})(window.NS);
