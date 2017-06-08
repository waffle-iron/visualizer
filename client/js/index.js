WebMidi.enable(function(err) {
	if (err) {
		console.log("WebMidi could not be enabled.", err);

	} else {
		console.log("WebMidi enabled!");
		output = WebMidi.getOutputByName("Launchpad Pro Standalone Port");
		input = WebMidi.getInputByName("Launchpad Pro Standalone Port");
	}

});

var l = [0, 0, 0, 17, 18, 19, 13, 14, 15, 9, 10, 11, 5, 6, 7]

var spiral = [11, 21, 31, 41, 51, 61, 71, 81, 82, 83, 84, 85, 86, 87, 88, 78, 68, 58, 48, 38, 28, 18, 17, 16, 15, 14, 13, 12, 22, 32, 42, 52, 62, 72, 73, 74, 75, 76, 77, 67, 57, 47, 37, 27, 26, 25, 24,
	23, 33, 43, 53, 63, 64, 65, 66, 56, 46, 36, 35, 34, 44, 54, 55, 45];

function clearPad() {
	for (var i = 0; i < 100; i++) {
		output.stopNote(i, "all");
	}
}

function handlePad(array) {
	for (var i = 0; i < 63; i += 9) {
		var avg = math.max(Array.from(array.slice(i, i + 9)))
		var _i = normalize(avg, 255, 0, l.length - 1, 0);
		var li = l[Math.floor(_i)];
		var __i = normalize(li, 127, 0, 1, 0);
		for (var j = 0; j < 8; j++) {
			output.playNote(Math.floor(normalize(i, 63, 0, 18, 11)) + (j * 10), "all", {
				velocity: __i
			});
		}
	}
}
