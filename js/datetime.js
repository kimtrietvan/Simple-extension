var r = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		c = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

	function d() {
		var e = new Date,
			t = e.getHours(),
			a = e.getMinutes() < 10 ? "0" + e.getMinutes() : e.getMinutes(),
			o = e.getSeconds() < 10 ? "0" + e.getSeconds() : e.getSeconds(),
			s = c[e.getDay()] + ", " + r[e.getMonth()] + " " + e.getDate() + ", " + e.getFullYear();
		chrome.storage.local.get(["timeformat"], (function(s) {
			"12h" == s.timeformat ? ($("#weather-container #hours").text(e.getHours() > 12 ? e.getHours() - 12 : e.getHours()), $("#ampm").text(e.getHours() >= 12 ? "PM" : "AM")) : ($("#weather-container #hours").text(t), $("#ampm").text("")), $("#minutes").text(a), $("#seconds").text(o)
		})), $("#date").text(s)
	}
	d(), window.setInterval(d, 1e3), $("#bg-opener").click((function() {
		$("#bg-container").addClass("opened"), $("#overlay").addClass("opened")
	})), $("#bg-closer").click((function() {
		$("#bg-container").removeClass("opened"), $("#overlay").removeClass("opened")
	})), $("#overlay").click((function() {
		$("#bg-closer").trigger("click")
	}));
	

	$("#datetime").click((function() {
		chrome.storage.local.get(["timeformat"], (function(e) {
			"24h" == e.timeformat && chrome.storage.local.set({
				timeformat: "12h"
			}), "12h" == e.timeformat && chrome.storage.local.set({
				timeformat: "24h"
			})
		}))
	}))
