<?php
include('user_agent.php'); 
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"> 
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en"> 
	<head> 
		<title>Tomasino.org</title> 
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta name="viewport" content="user-scalable=no, width=device-width" />

		<link href="http://tomasino.mp" rel="openid.delegate" />
		<link href="http://tomasino.mp" rel="openid2.local_id" />
		<link href="https://secure.mp/s/tomasino.mp/server" rel="openid.server" />
		<link href="https://secure.mp/s/tomasino.mp/server" rel="openid2.provider" />

		<script type="text/javascript" src="scripts/swfobject.js"></script> 

		<script type="text/javascript"> 
			swfobject.registerObject("flsh", "9.0.0");
		</script> 
		<style type="text/css"> 
		
		/* hide from ie on mac \*/
		html {
			height: 100%;
			overflow: hidden;
		}
		
		#flashcontent {
			height: 100%;
		}
		/* end hide */
 
		body {
			height: 100%;
			margin: 0;
			padding: 0;
			background: #FFFFFF;
		}

		#noflash {
			width: 300px;
			margin: 0 auto;
			border: 1px solid #ccc;
			padding: 10px;
		}

		#noflash img {
			margin 5px 0;
		}
 
	</style> 
	</head> 
	<body> 
		<div id="flashcontent"> 
			<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%" id="flsh" align="top"> 
				<param name="movie" value="swfs/tomasino-org.swf" /> 
				<param name="menu" value="false" /> 
				<param name="quality" value="best" /> 
				<param name="salign" value="TL" /> 
				<param name="scale" value="noscale" /> 
				<param name="wmode" value="transparent" /> 
				<param name="allowfullscreen" value="true" /> 
				<param name="allowscriptaccess" value="always" />
				<param name="base" value="." />
				<!--[if !IE]>--> 
				<object type="application/x-shockwave-flash" id='flsh2' data="swfs/tomasino-org.swf" width="100%" height="100%" align="top"> 
					<param name="base" value="." />
					<param name="menu" value="false" /> 
					<param name="quality" value="best" /> 
					<param name="salign" value="TL" /> 
					<param name="scale" value="noscale" /> 
					<param name="wmode" value="transparent" /> 
					<param name="allowfullscreen" value="true" /> 
					<param name="allowscriptaccess" value="always" /> 
				<!--<![endif]--> 
					<div id="noflash">
						This version of the site requires the Adobe Flash Plugin. You can install it at the link below, or try the <a href="http://m.tomasino.org">mobile version</a>.
						<a href="http://www.adobe.com/go/getflashplayer"> 
							<img src="http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif" alt="Get Adobe Flash player" /> 
						</a>
					</div>
				<!--[if !IE]>--> 
				</object> 
				<!--<![endif]--> 
			</object> 
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
		</script>

	</body> 
</html> 
		
