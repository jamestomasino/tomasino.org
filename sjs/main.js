// Example of library includes
//= require lib/modernizr
//= require lib/jquery-1.8.2
//= require lib/handlebars-1.0.rc.1
//= require lib/l10n

window.console||(window.console={log:function(){}});

// Load Handlebars templates and json data
var sectionTemplatePath = 'templates/section.handlebars';
var itemTemplatePath = 'templates/item.handlebars';
var dataPath = 'data/data.json';

$.when (
	$.ajax ( sectionTemplatePath ),
	$.ajax ( itemTemplatePath ),
	$.getJSON ( dataPath ),
	$(document).ready()
).then( onDataLoad, onDataFail );

function onDataLoad ( section, item, data ) {
	var sectionHTML = section[0];
	var itemHTML = item[0];
	var jsonData = data[0];
	var sectionTemplate  = Handlebars.compile(sectionHTML);
	var itemTemplate     = Handlebars.compile(itemHTML);

	// Process Data
	$.each ( jsonData.section, function ( index, data) {
		var html = $(sectionTemplate(data));
		var items = html.find('.items');

		$.each ( data.item, function ( index, data ) {
			var itemHTML = $(itemTemplate(data));
			items.append(itemHTML);
		} );

		$('#links').append(html);
	} );
}

function onDataFail ( error ) {
	$('#links').html('<h1 class="error">There was an error loading site data.</h1>')
}
