var NS = window.NS;

NS.baseURL = 'js/';

var libs = [ 'lib.Ajax', 'lib.Delegate', 'lib.DOM', 'lib.Analytics', 'lib.Template' ];

function main () {

	// Imports
	var Ajax = NS.use('lib.Ajax');
	var Analytics = NS.use('lib.Analytics');
	var Delegate = NS.use('lib.Delegate');
	var DOM = NS.use('lib.DOM');
	var Template = NS.use('lib.Template');

	// Paths
	var dataPath = 'data/data.json';
	var templatePath = 'template/data.template';

	this.data = null;
	this.template = null;
	this.mainWrapper = DOM.find('#links');

	function onDataLoad ( data ) {
		this.data = JSON.parse(data);

		if (this.data && this.template)
			this.mainWrapper.appendChild( DOM.create( Template(this.template, this.data) ) );
	}

	function onTemplateLoad ( template ) {
		// Remove newlines for the regex to parse properly
		this.template = String(template).replace(/\n/g,'');

		if (this.data && this.template)
			this.mainWrapper.appendChild( DOM.create( Template(this.template, this.data) ) );
	}

	function onDataFail ( error ) {
		var errorString = '<h1 class="error">There was an error loading site data.</h1>';
		this.mainWrapper.appendChild( DOM.create(errorString) );
	}

	// Delegate Callbacks
	var dataLoadDelegate = Delegate(onDataLoad, this);
	var dataFailDelegate = Delegate(onDataFail, this);
	var templateLoadDelegate = Delegate(onTemplateLoad, this);

	// Load Data & Template
	var dataAjax = new Ajax(dataPath, dataLoadDelegate, dataFailDelegate);
	var templateAjax = new Ajax(templatePath, templateLoadDelegate, dataFailDelegate);

	// Set up Analytics
	var analytics = new Analytics ( 'UA-18127227-1' );
}

NS.load ( libs, main, this );
