WebMidi.enable(function(err) {
	if (err) {
		console.log("WebMidi could not be enabled.", err);

	} else {
		console.log("WebMidi enabled!");
		output = WebMidi.getOutputByName("Launchpad Pro Standalone Port");
		input = WebMidi.getInputByName("Launchpad Pro Standalone Port");
		input.on("controlchange", "all", function(event) {
			switch (event.data[1]) {
				case 89:
				case 79:
				case 69:
				case 59:
				case 49:
				case 39:
				case 29:
				case 19:
					var part = (event.data[1] - 9) / 10
					Volume = (100 / 8) * part;
					UpdateVolume();
					break;
				case 10:
					if (event.data[2] == 0) pauses();
					break;
				case 94:
					if (event.data[2] == 0) {
						playNextSongInQueue();
					}
					break;
				default:
					console.log("UNUSED: " + event.data);
					break;
			}
		});
		clearPad();
		output.playNote(10, 6, {
			velocity: 3,
			rawVelocity: true
		});
		UpdateVolume();
		for (var i = 0; i < 8; i++) {
			prev.push([0, 0, 0, 0, 0, 0, 0, 0]);
		}
		volPrev = [1, 1, 1, 1, 1, 1, 1, 1];
	}

});

var l = [0, 0, 0, 17, 18, 19, 13, 14, 15, 9, 10, 11, 5, 6, 7]

var spiral = [11, 21, 31, 41, 51, 61, 71, 81, 82, 83, 84, 85, 86, 87, 88, 78, 68, 58, 48, 38, 28, 18, 17, 16, 15, 14, 13, 12, 22, 32, 42, 52, 62, 72, 73, 74, 75, 76, 77, 67, 57, 47, 37, 27, 26, 25, 24,
	23, 33, 43, 53, 63, 64, 65, 66, 56, 46, 36, 35, 34, 44, 54, 55, 45
];

function clearPad() {
	for (var i = 0; i < 100; i++) {
		output.stopNote(i, "all");
	}
	for (var i = 0; i < 8; i++) {
		prev[i] = [0, 0, 0, 0, 0, 0, 0, 0];
	}
}

function displayVolume() {
	var level = math.floor(normalize(Volume, 0, 100, 0, 8));
	for (var i = 0; i < level; i++) {
		if (volPrev[i] !== 1) {
			volPrev[i] = 1;
			output.playNote(volMap[i], 6, {
				velocity: 7,
				rawVelocity: true
			});
		}
		if (i == level - 1) {
			volPrev[i] = 2;
			output.playNote(volMap[i], 6, {
				velocity: 4,
				rawVelocity: true
			});

		}
	}
	for (var i = level; i < 8; i++) {
		if (volPrev[i] !== 0) {
			volPrev[i] = 0;
			output.playNote(volMap[i], 6, {
				velocity: 0,
				rawVelocity: true
			});
		}
	}
}

function handlePad(array) {
	var bars = [];
	for (var i = 3; i < 63; i += 7) {
		var _avg = math.max(Array.from(array.slice(i, i + 7)))
		var avg = normalize(_avg, 0, 255, -1, 8);
		bars.push(math.round(avg));
	}
	var bars2 = experimentalTransform(bars, 7);
	var bars3 = bars2.map(function(a, b, c) {
		return Math.floor(a);
	})
	drawBars(bars3);
}

var map = [
	[11, 21, 31, 41, 51, 61, 71, 81],
	[12, 22, 32, 42, 52, 62, 72, 82],
	[13, 23, 33, 43, 53, 63, 73, 83],
	[14, 24, 34, 44, 54, 64, 74, 84],
	[15, 25, 35, 45, 55, 65, 75, 85],
	[16, 26, 36, 46, 56, 66, 76, 86],
	[17, 27, 37, 47, 57, 67, 77, 87],
	[18, 28, 38, 48, 58, 68, 78, 88]
];


var volMap = [19, 29, 39, 49, 59, 69, 79, 89];

var volPrev = [];
var prev = [];

function drawBars(levels) {
	messages = 0;
	for (var i in levels) {
		level = levels[i];
		section = map[i];
		for (var j in section) {
			if (j <= levels[i]) {
				if (prev[i][j] == 0) {
					prev[i][j] = 1;
					output.playNote(section[j], 6, {
						velocity: Number(i) + 60,
						rawVelocity: true
					});
					messages++;
				} else {

				}
			} else if (j > levels[i]) {
				if (prev[i][j] == 1) {
					prev[i][j] = 0;
					messages++;
					output.playNote(section[j], 6, {
						velocity: 0,
						rawVelocity: true
					});
				} else {

				}
			}
		}
	}
	$("#Link1").text(String(messages));
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
			}
		});
	}
}

$(document).ready(function() {
  var constraints = window.constraints = {
    audio: true,
    video: false
  };

  navigator.getUserMedia({audio:true},function(s) {
  console.log(s)
},function(s) {
    console.log(s);
  })
})
