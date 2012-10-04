<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"> 
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en"> 
	<head> 
		<title>Tomasino.org</title> 
		<link rel="stylesheet" href="screen.css" type="text/css" />
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> 
		<meta name="viewport" content="user-scalable=no, width=device-width" />
		<meta name="apple-mobile-web-app-capable" content="yes" />
		<script type="text/javascript" src="jquery.js"></script>
		<script type="text/javascript" src="iphone.js"></script>
	</head> 
	<body> 
	<div id="container">
		<div id="header">
			<h1><a href="./">Tomasino</a></h1>

<?php
$xmlurl = 'http://www.tomasino.org/links.xml'; 
	$xmlstr = file_get_contents($xmlurl);
	$xml = simplexml_load_string($xmlstr);
	if($xml ===  FALSE) 
	{ 
		//deal with error 
		print 'Error Parsing XML';
	} 
	else 
	{
		foreach ($xml->cat as $cat)
		{
			$attr = $cat->attributes();
			$id = $attr["id"];
			
			print '<div id="'. $id .'">';
			print '<ul>';
			print '<li>' . $id . '</li>';

			foreach ($cat->item as $item)
			{
				$id = $item->id;
				$image = $item->image;
				$url = $item->url;
				$title = $item->title;

				print '<li>';
				print '<a href="'. $url . '" onClick="recordOutboundLink(this, \'Outbound Links\', \'mobile/' . $id . '\');return false;">' . $title . '</a>';
				print '<img src="'. $image . '" alt="' . $title . '" />'; 
				print '</li>';
			}

			print '</ul>';
			print '</div>';
		} 		
	}
?>
		</div>
	
		<div id="content">
			<h2>About</h2>
				<p>James Tomasino is a Senior Interactive Developer who specializes in RIAs and experience design. His presence in the Flash community can be seen in a scattershot of blogs, expert reviews and portfolio work.</p>

				<p>A Gypsy born in Virginia in 1980, he has since lived in Maryland, New Jersey, Illinois, South Carolina, New Jersey again, Indiana, Alaska, Georgia, Pennsylvania, New Jersey one more time, and New York (in that order). With a little love from the man upstairs, he’ll get to see a whole lot of new exciting places around the world.</p>
		<div id="fullsite"><a href="http://www.tomasino.org/?force=true">Switch to Full Site</a></div>
		</div>

		<script type="text/javascript"> 
			var _gaq = _gaq || [];
			_gaq.push(['_setAccount', 'UA-18127227-1']);
			_gaq.push(['_trackPageview']);
 
  			(function() 
			{
				var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
				ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    				var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  			})();

			function recordOutboundLink(link, category, action) {
			  try {
			    var myTracker = _gat._getTrackerByName();
			    _gaq.push(['myTracker._trackEvent', ' + category + ', ' + action + ']);
			    setTimeout('document.location = "' + link.href + '"', 100)
			  }catch(err){}
			}

		</script> 

	</body> 
</html> 
