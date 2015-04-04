var NS = window.NS;

NS.baseURL = 'js/';

var libs = [ 'lib.Ajax', 'lib.DOM', 'lib.Analytics' ];

// Templating. Make smarter and a lib
function t ( s, d ) {
	for(var p in d)
		s=s.replace(new RegExp('{'+p+'}','g'), d[p]);
	return s;
}

function main () {

	var Ajax = NS.use('lib.Ajax');
	var Analytics = NS.use('lib.Analytics');
	var DOM = NS.use('lib.DOM');

	function onDataLoad ( data ) {
		buildDOM(JSON.parse(data));
	}

	function onDataFail ( error ) {
		var mainWrapper = DOM.find('#links');
		var DOMtestEl = DOM.create('<h1 class="error">There was an error loading site data.</h1>');
		mainWrapper.appendChild(DOMtestEl);
	}

	function buildDOM ( data ) {

		var categoryStartTemplate = '<div class="category"><h1>{id}</h1><div class="items">'
		var categoryEndTemplate = '</div></div>'
		var itemTemplate = '<div class="item" id="{id}"><a href="{url}"><img src="{image}" alt="{id}" /><h2>{title}</h2></a></div>';

		var outputHTML = '';
		var sections = data.section;
		for (var i=0; i < sections.length; i++) {
			outputHTML += t(categoryStartTemplate, sections[i]);
			var items = sections[i].item;
			for (var j=0; j < items.length; j++) {
				outputHTML += t(itemTemplate, items[j]);
			}
			outputHTML += categoryEndTemplate;
		}

		var mainWrapper = DOM.find('#links');
		var domEL = DOM.create(outputHTML);
		mainWrapper.appendChild(domEL);
	}

	var analytics = new Analytics ( 'UA-18127227-1' );
	var dataPath = 'data/data.json';
	var ajax = new Ajax(dataPath, onDataLoad, onDataFail);

}

NS.load ( libs, main, this );
