﻿package org.tomasino.site{	import flash.events.Event;	import flash.display.Sprite;		import org.tomasino.site.MenuItem;		import org.tomasino.tracking.TrackingManager;	import org.tomasino.tracking.types.GoogleType;	import org.tomasino.tracking.TrackingEvent;		public class TomasinoORG extends Sprite	{		private var _tracker:TrackingManager;						function TomasinoORG()		{			// constructor code			if (this.stage)			{				onAdd(null);			}			else			{				addEventListener( Event.ADDED_TO_STAGE, onAdd );			}		}		function onAdd( e:Event ):void		{			// Begin Tracking			_tracker = TrackingManager.instance;			var googleType:GoogleType = new GoogleType ();			_tracker.init ( googleType );			stage.addEventListener ( TrackingEvent.TRACK, _tracker.track );						new MenuItem ('amazon', 'http://www.amazon.com/gp/registry/wishlist/13LCYOWDIUHZF', amazon );			new MenuItem ('linkedin', 'http://www.linkedin.com/in/jamestomasino', linkedin );			new MenuItem ('facebook', 'http://www.facebook.com/james.tomasino?p', facebook );			new MenuItem ('flickr', 'http://www.flickr.com/photos/tomasino', flickr );			new MenuItem ('goodreads', 'http://www.goodreads.com/user/show/1204542-james', goodreads );			new MenuItem ('chess', 'http://www.chessatwork.com/profile/playerprofile.php?uid=365425', chess );			new MenuItem ('portfolio', 'http://www.jamestomasino.com/', portfolio );			new MenuItem ('reader', 'http://www.google.com/reader/shared/04204636476658866346', reader );			new MenuItem ('tumblr', 'http://tumblr.tomasino.org/', tumblr );			new MenuItem ('twitter', 'http://www.twitter.com/jamesmouth', twitter );			new MenuItem ('vimeo', 'http://www.vimeo.com/jamestomasino', vimeo );			new MenuItem ('youtube', 'http://www.youtube.com/user/jamestomasino', youtube );			new MenuItem ('blog', 'http://labs.tomasino.org/', blog );			new MenuItem ('vittana', 'http://vittana.org/users/2759', vittana );			new MenuItem ('kiva', 'http://www.kiva.org/lender/tomasino', kiva );			new MenuItem ('dopplr', 'http://www.dopplr.com/traveller/tomasino', dopplr );						new MenuItem ('get glue', 'http://getglue.com/tomasino', getglue );			new MenuItem ('pandora', 'http://www.pandora.com/people/pandora71265', pandora );			new MenuItem ('last.fm', 'http://www.last.fm/user/jamestomasino', lastfm );			new MenuItem ('yelp', 'http://tomasino.yelp.com', yelp );			new MenuItem ('foursquare', 'http://foursquare.com/jamesmouth', foursquare );			new MenuItem ('delicious', 'http://www.delicious.com/jamestomasino', delicious );			new MenuItem ('picasa', 'http://picasaweb.google.com/107807838448525082027', picasa );			new MenuItem ('chi.mp', 'http://tomasino.mp', chimp );			new MenuItem ('experts', 'http://www.experts-exchange.com/M_5926046.html', expertsexchange );		}	}}