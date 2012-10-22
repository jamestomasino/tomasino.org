//= require lib/jquery-1.8.2
//= require lib/handlebars-1.0.rc.1
//= require lib/l10n

window.console||(window.console={log:function(){}});

// Load Handlebars templates and json data
var sectionTemplatePath = 'templates/section.handlebars';
var dataPath = 'data/data.json';

$.when (
	$.ajax ( sectionTemplatePath ),
	$.getJSON ( dataPath ),
	$(document).ready()
).then( onDataLoad, onDataFail );

function onDataLoad ( section, data ) {
	var sectionHTML = section[0];
	var sectionTemplate  = Handlebars.compile(sectionHTML);
	var jsonData = data[0];

	var html = $(sectionTemplate(jsonData));
	$('#links').append(html);
}

function onDataFail ( error ) {
	$('#links').html('<h1 class="error">There was an error loading site data.</h1>')
}
