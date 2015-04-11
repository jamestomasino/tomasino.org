var NS = window.NS;

NS.baseURL = 'js/';

var libs = [ 'lib.Ajax', 'lib.Delegate', 'lib.DOM', 'lib.Analytics', 'lib.Template' ];

function main () {

	var Ajax = NS.use('lib.Ajax');
	var Analytics = NS.use('lib.Analytics');
	var Delegate = NS.use('lib.Delegate');
	var DOM = NS.use('lib.DOM');
	var Template = NS.use('lib.Template');

	this.data = null;
	this.template = null;

	function onDataLoad ( data ) {
		this.data = JSON.parse(data);

		if (this.data && this.template)
			buildDOM(this.template, this.data);
	}

	function onTemplateLoad ( template ) {
		// Remove newlines for the regex to parse properly
		this.template = String(template).replace(/\n/g,'');

		if (this.data && this.template)
			buildDOM(this.template, this.data);
	}

	function onDataFail ( error ) {
		var mainWrapper = DOM.find('#links');
		var DOMtestEl = DOM.create('<h1 class="error">There was an error loading site data.</h1>');
		mainWrapper.appendChild(DOMtestEl);
	}

	function buildDOM ( template, data ) {
		var outputHTML = Template(template, data);
		var mainWrapper = DOM.find('#links');
		var domEL = DOM.create(outputHTML);
		mainWrapper.appendChild(domEL);
	}

	var analytics = new Analytics ( 'UA-18127227-1' );

	var dataPath = 'data/data.json';
	var dataAjax = new Ajax(dataPath, Delegate(onDataLoad, this), onDataFail);

	var templatePath = 'template/data.template';
	var templateAjax = new Ajax(templatePath, Delegate(onTemplateLoad, this), onDataFail);

}

NS.load ( libs, main, this );
