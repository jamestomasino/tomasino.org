 var tl;
 function onLoad() {
   var eventSource = new Timeline.DefaultEventSource();
   
   var theme = Timeline.ClassicTheme.create(); // create the theme
            theme.event.bubble.width = 350;   // modify it
            theme.event.bubble.height = 300;
            theme.event.track.height = 15;
            theme.event.tape.height = 8;
	   // theme.timeline_start = new Date(Date.UTC(1979,0,1));

   var bandInfos = [
     Timeline.createBandInfo({
         eventSource:    eventSource,
         date:           "Jul 06 1980 00:00:00 GMT",
         width:          "90%", 
         intervalUnit:   Timeline.DateTime.MONTH, 
         intervalPixels: 50,
	 theme:		 theme
     }),
     Timeline.createBandInfo({
	 overview:	 true,
         eventSource:    eventSource,
         date:           "Jul 06 1980 00:00:00 GMT",
         width:          "10%", 
         intervalUnit:   Timeline.DateTime.YEAR, 
         intervalPixels: 100,
	 theme:		 theme
     })
   ];

   bandInfos[1].syncWith = 0;
   bandInfos[1].highlight = true;
 
   tl = Timeline.create(document.getElementById("my-timeline"), bandInfos);
   Timeline.loadXML("data.xml", function(xml, url) { eventSource.loadXML(xml, url); });
 }

 
 var resizeTimerID = null;
 function onResize() {
     if (resizeTimerID == null) {
         resizeTimerID = window.setTimeout(function() {
             resizeTimerID = null;
             tl.layout();
         }, 500);
     }
 }