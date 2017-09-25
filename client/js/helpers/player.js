SC.initialize({
	client_id: '3BimZt6WNvzdEFDGmj4oeCSZfgVPAoVc',
	redirect_uri: 'music.marisusis.me/auth'
});

var song = "https://soundcloud.com/monstercat/unlike-pluto-everything-black"

SC.resolve(song).then(function(track) {
	var songInfo = {
		title: track.title,
		artist: track.user.username,
		artworkURL: track.artwork_url
	}
	updateInfo(songInfo)
});

var audio = $("#audio")[0];

var SoundCloudLoader = function(client_id) {
	var self = this;
	this.cid = client_id;
	this.load = function(settings) {
		get('https://api.soundcloud.com/resolve?url=' + settings.track + '&client_id=' + this.cid, function(response) {
			var res = JSON.parse(response);
			self.streamurl = res.stream_url + '?client_id=' + client_id;
			if (settings.player.constructor == jQuery && jQuery) {
				settings.player[0].crossOrigin = "anonymous";
				settings.player[0].src = self.streamurl;
			} else if (typeof settings.player == 'string') {
				document.querySelector(settings.player).crossOrigin = "anonymous";
				document.querySelector(settings.player).src = self.streamurl;
				// document.querySelector(settings.player).play();
			}
		});
	}
}


function get(url, cb) {
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if (req.readyState === 4 && req.status === 200) {
			cb(req.responseText);
		}
	}
	req.open("GET", url, true);
	req.send(null);
}

var sc = new SoundCloudLoader('3BimZt6WNvzdEFDGmj4oeCSZfgVPAoVc');

sc.load({
	track: song,
	player: "#audio"
});

$(".slider-display").on('mousemove', function(e) {
	var pos = $(this).width() - e.pageX + $(".player-slider-wrap").position().left
	var pixels = normalize(pos / $(this).width() * 100, 100, 0, 0, $(this).width())
	var percent = normalize(pos / $(this).width() * 100, 100, 0, 0, 100);
	$(this).attr("data-hover-val", percent)
	$(this).children(".bar-hover").css({
		width: Math.floor(pixels) + "px"
	});
	var time = normalize(percent, 0, 100, 0, audio.duration);
	var timeFormatted = moment("2000-01-01 00:00:00").add(moment.duration(time * 1000)).format("mm:ss");
	$(this).children(".bar-hover").children(".hover-time-display").children("span").text(timeFormatted);
});

// $(".slider-display").mousedown(function() {
//   var percent = $(this).attr("data-hover-val");
// 	audio.currentTime = normalize(percent, 0, 100, 0, audio.duration);
// 		$(this).mousemove(function() {
//       var percent = $(this).attr("data-hover-val");
//     	audio.currentTime = normalize(percent, 0, 100, 0, audio.duration);
// 			console.log("OK Moved!");
// 		});
// 	})
// 	.mouseup(function() {
// 		$(this).unbind('mousemove');
// 	}).mouseout(function() {
// 		$(this).unbind('mousemove');
// 	}).mouseover(function() {
//
//   })




function updateBar(part, whole) {
	var newWidth = normalize(part, 0, whole, 0, $(".slider-display").width());
	$(".bar").css({
		width: newWidth
	});
}

function normalize(value, max, min, dmax, dmin) {
	return (dmax - dmin) / (max - min) * (value - max) + dmax
}

audio.ontimeupdate = function() {
	var timeDifference = this.duration - this.currentTime;
	var timeFormatted = moment("2000-01-01 00:00:00").add(moment.duration(this.currentTime * 1000)).format("mm:ss");
	$(".time-display").children("span").text(timeFormatted);
	updateBar(this.currentTime, this.duration)
};

$(".slider-display").on("mousedown", function(event) {
	console.log(event.button);
	var percent = $(this).attr("data-hover-val");
	audio.currentTime = normalize(percent, 0, 100, 0, audio.duration);
});


//Colors from https://github.com/caseif/vis.js/blob/gh-pages/js/util/helper/genre_helper.js
var MainColors = {
	//Actual colors
	'Trap': '#820028',
	'Drumstep': '#E20386',
	'Drum & Bass': '#E10304',
	'Trance': '#0584E3',
	'Electro': '#E2D904',
	'House': '#E28C06',
	'Hardcore': '#0DB104',
	'Glitch Hop': '#19925B',
	'Post Disco': '#29B8B2',
	'Dubstep': '#8D03E2',
	'Future Bass': '#9999FB',
	'EDM': '#C2C1C2',

	//Custom colors
	'Chillout': '#F4C2C2',
	'Rock': '#B4D7BF',
	'Pop': '#B3E234',
};

function updateColors(color) {
	$(".bar").css({
		"background": chroma(shadeBlendConvert(0.1, color))
	});
	$(".bar-hover").css({
		"background": chroma(shadeBlendConvert(-0.4, color)).alpha(0.8).css()
	});
	$(".control").children("span").css({
		"background": chroma(shadeBlendConvert(0.1, color)).css()
	});
	$(".control").hover(function() {
		$(this).css({
			"background": chroma(shadeBlendConvert(0.1, color)).css()
		});
	}, function() {
		$(this).css({
			"background": "#000"
		});
	});
}

updateColors(MainColors["Dubstep"])

function updateInfo(info) {
	$playerInfo = $(".player-info");
	$meta = $playerInfo.children(".meta");
	$artwork = $playerInfo.children(".artwork");
	var titleLength = function(t) {
		if (t.length > 25) {
			return "size-xl";
		} else if (t.length > 16) {
			return "size-l";
		} else if (t.length > 8) {
			return "size-m"
		} else {
			return "size-n";
		}
	}(info.meta.title);
	$meta.children(".title").text(info.meta.title);
	$meta.children(".artist").text(info.meta.artist);
	$artwork.children(".artwork-image").attr("src", info.albumArtworkURL);
	$meta.children(".title").attr("data-size", titleLength);
}

$(".control").on("click", function(event) {
	switch ($(this).attr('data-control')) {
		case "play":
			var state = $(this).attr("data-state")
			if (state == "paused") {
				$(this).attr("data-state", "playing");
				audio.play();
				$(this).children("span").removeClass("icon-music-play-button");
				$(this).children("span").addClass("icon-music-pause-button");
			} else if (state == "playing") {
				$(this).attr("data-state", "paused");
				audio.pause();
				$(this).children("span").removeClass("icon-music-pause-button");
				$(this).children("span").addClass("icon-music-play-button");

			}
			break;
		case "next":
			playNextSongInQueue();
	}

});

function shadeBlendConvert(p, from, to) {
	if (typeof(p) != "number" || p < -1 || p > 1 || typeof(from) != "string" || (from[0] != 'r' && from[0] != '#') || (typeof(to) != "string" && typeof(to) != "undefined")) return null; //ErrorCheck
	if (!this.sbcRip) this.sbcRip = (d) => {
		let l = d.length,
			RGB = new Object();
		if (l > 9) {
			d = d.split(",");
			if (d.length < 3 || d.length > 4) return null; //ErrorCheck
			RGB[0] = i(d[0].slice(4)), RGB[1] = i(d[1]), RGB[2] = i(d[2]), RGB[3] = d[3] ? parseFloat(d[3]) : -1;
		} else {
			if (l == 8 || l == 6 || l < 4) return null; //ErrorCheck
			if (l < 6) d = "#" + d[1] + d[1] + d[2] + d[2] + d[3] + d[3] + (l > 4 ? d[4] + "" + d[4] : ""); //3 digit
			d = i(d.slice(1), 16), RGB[0] = d >> 16 & 255, RGB[1] = d >> 8 & 255, RGB[2] = d & 255, RGB[3] = l == 9 || l == 5 ? r(((d >> 24 & 255) / 255) * 10000) / 10000 : -1;
		}
		return RGB;
	}
	var i = parseInt,
		r = Math.round,
		h = from.length > 9,
		h = typeof(to) == "string" ? to.length > 9 ? true : to == "c" ? !h : false : h,
		b = p < 0,
		p = b ? p * -1 : p,
		to = to && to != "c" ? to : b ? "#000000" : "#FFFFFF",
		f = this.sbcRip(from),
		t = this.sbcRip(to);
	if (!f || !t) return null; //ErrorCheck
	if (h) return "rgb(" + r((t[0] - f[0]) * p + f[0]) + "," + r((t[1] - f[1]) * p + f[1]) + "," + r((t[2] - f[2]) * p + f[2]) + (f[3] < 0 && t[3] < 0 ? ")" : "," + (f[3] > -1 && t[3] > -1 ? r(((t[3] - f[3]) * p + f[3]) * 10000) / 10000 : t[3] < 0 ? f[3] : t[3]) + ")");
	else return "#" + (0x100000000 + (f[3] > -1 && t[3] > -1 ? r(((t[3] - f[3]) * p + f[3]) * 255) : t[3] > -1 ? r(t[3] * 255) : f[3] > -1 ? r(f[3] * 255) : 255) * 0x1000000 + r((t[0] - f[0]) * p + f[0]) * 0x10000 + r((t[1] - f[1]) * p + f[1]) * 0x100 + r((t[2] - f[2]) * p + f[2])).toString(16).slice(f[3] > -1 || t[3] > -1 ? 1 : 3);
}
