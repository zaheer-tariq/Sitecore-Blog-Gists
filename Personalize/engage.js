var engage = undefined;
var s = document.createElement("script");
s.type = "text/javascript";
s.async = true;
s.src = "https://d1mj578wat5n4o.cloudfront.net/sitecore-engage-v.1.4.3.min.js";
var x = document.querySelector("script");
x.parentNode.insertBefore(s, x);
s.addEventListener("load", async () => {
	var settings = {
		clientKey: "9c2b453d24564147a5bd72eeeacc9050", // In Sitecore Personalize, on the navigation pane, click  > Company information > Client key.
		targetURL: "https://api-engage-us.sitecorecloud.io",
		pointOfSale: "demo",
		cookieDomain: "",   // Leave blank for testing, on production this can be .yourdomain.com
		cookieExpiryDays: 365,
		forceServerCookieMode: false,
		includeUTMParameters: true,
		webPersonalization: true
	};

	window.Engage.init(settings).then(function (result) {
		engage = result;
		var event = {
			channel: "Web",
			language: "EN",   // For multi-lingual site this should be dynamic, you can have your app store it in cookie and you read it from cookies here
			currency: "USD",  // This should be dynamic, you can have your app store it in cookie and you read it from cookies here
			page: window.location.pathname
		};
		engage.pageView(event);
	});

});