(function () {
	"use strict"

	NS.load ( ['lib.Delegate'], classWrapper, this );

	function classWrapper() {

		var Delegate = NS.use('lib.Delegate');

		function Ajax(url, callbackFunction, errorFunction)
		{
			this.stateChange = function (object) {
				if (this.request.readyState==4)
					if (this.request.status === 200) {
						this.callbackFunction(this.request.responseText);
					} else {
						if (typeof this.errorFunction == 'function') this.errorFunction(this.request.statusText);
					}
			};
			this.postBody = (arguments[3] || "");
			this.callbackFunction=callbackFunction;
			this.errorFunction=errorFunction;
			this.url=url;
			this.request = NS.createXMLHTTPObject();

			if(this.request) {
				var req = this.request;
				req.onreadystatechange = Delegate(this.stateChange, this);

				if (this.postBody!=="") {
					req.open("POST", url, true);
					req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
					req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
					req.setRequestHeader('Connection', 'close');
				} else {
					req.open("GET", url, true);
				}

				req.send(this.postBody);
			}
		}

		var namespace = new NS ( 'lib' );
		namespace.Ajax = Ajax;

	}

})();
