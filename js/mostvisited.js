function m() {
	chrome.runtime.sendMessage({
		topSites: !0
	}, function(e) {
		var t = 0;
		if (null != e) {
			console.log("topsites", e.length);
			for (var o = 0; o < e.length && ($("#topsites_menu").append($("<hr>")), $("#topsites_menu").append($('<li><a href="' + e[o].url + '"><i style="background-image:url(\'https://www.google.com/s2/favicons?domain=' + encodeURIComponent(e[o].url) + "');background-size:cover;\"></i>" + e[o].title + "</a></li>")), !(++t >= 10)); o++);
		}
	})
}

m();