if (!window.AudioContext) {
	if (!window.webkitAudioContext) {
		alert('Could not get audio context! (Are you using IE?)');
	}
	window.AudioContext = window.webkitAudioContext;
}
var output;
var input;



function getParameterByName(name, url) {
	if (!url) {
		url = window.location.href;
	}
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

SC.initialize({
	client_id: '3BimZt6WNvzdEFDGmj4oeCSZfgVPAoVc',
	redirect_uri: 'http://music.marisusis.me/auth'
});

var color;

var initialHeight = $('#songinfo').height();

var spectrumWidth = 1568 * resRatio;
spectrumSpacing = 7 * resRatio;
var barWidth = (spectrumWidth + spectrumSpacing) / spectrumSize - spectrumSpacing;
spectrumWidth = (barWidth + spectrumSpacing) * spectrumSize - spectrumSpacing;

var spectrumHeight = spectrumWidth / spectrumDimensionScalar;
var marginDecay = 1.6; // I admittedly forget how this works but it probably shouldn't be changed from 1.6
// margin weighting follows a polynomial slope passing through (0, minMarginWeight) and (marginSize, 1)
var headMarginSlope = (1 - minMarginWeight) / Math.pow(headMargin, marginDecay);
var tailMarginSlope = (1 - minMarginWeight) / Math.pow(tailMargin, marginDecay);

var velMult = 0;
var particleSize = minParticleSize;

var begun = false;
var ended = false;
var isPlaying = false;
var bufferInterval = 1024;
var started = 0;
var currentTime = 0;
var minProcessPeriod = 18; // ms between calls to the process function

var lastMouseMove = Date.now();
var lastVolumeChange = Date.now();
var textHidden = false;
var volumeHidden = false;

updateCanvas();

function centerContent() {
	resRatio = $(window).width() / 1920;

	$('.content').css({
		width: (1568 * resRatio) + "px",
		marginTop: (196 * resRatio) + "px"
	});
	$('#canvas').attr("width", 1568 * resRatio);
}

$(window).resize(() => {
	centerContent()
});
centerContent();
song = new Song({
	title: "NEED TO FIX",
	artist: "NEED TO FIX",
	genre: "Trap",
	id: 123
});

initGui(song);


centerContent();


$('html').mousemove(event => {
	if (textHidden) {
		$('.hide').stop(false, true);
		$('.hide').show();
		textHidden = false;
	}
	lastMouseMove = Date.now();
});
$('#artist').css('font-size', $('#artist').css('font-size').replace('px', '') * resRatio + 'px');
$('#title').css('font-size', $('#title').css('font-size').replace('px', '') * resRatio + 'px');
setupAudioNodes()
initSpectrumHandler();


function playSoundCloud(url, genre) {
	centerContent();
	if (isPlaying) {
		bufferSource.stop();
		loading();
	}
	SC.resolve(url).then(function(track) {
		console.log(track);
		if (track.user.username == "Monstercat") {
			var t = track.title;
			var d = t.split(" - ");
			track.title = d[1];
			track.user.username = d[0];
		}
		if (genre) {
			var s = new Song({
				title: track.title,
				artist: track.user.username,
				genre: genre,
				id: 123
			});
		} else {
			var s = new Song({
				title: track.title,
				artist: track.user.username,
				genre: "EDM",
				id: 123
			});
		}
		// window.history.pushState("Update", "Title", "?url=" + url);


		loadSong(s);
		updateStyles();
		initGui(song);
		setupAudioNodes()
		loadSound(track.stream_url + "?client_id=3BimZt6WNvzdEFDGmj4oeCSZfgVPAoVc"); // music file


		centerContent();

	});
	$('#songinfo').css('padding-top', (blockSize - $('#songinfo').height()) / 2);
}

function playUrl(url, data) {
	centerContent();
	if (isPlaying) {
		bufferSource.stop();
		loading();
	}
	var s = new Song(data);

	loadSong(s);

	updateStyles();

	initGui(song);
	setupAudioNodes()
	loadSound(url);

	centerContent();
	$('#songinfo').css('padding-top', (blockSize - $('#songinfo').height()) / 2);
}

var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.prepend(stats.domElement)

$(document).ready(function() {
	var gui = new dat.GUI();
	gui.add(opt, 'resistance', 0, 10).onChange(function(e) {
		window.experimentalTransform = function(a) {
			return function(array) {
				var resistance = a; // magic constant
				var newArr = [];
				for (var i = 0; i < array.length; i++) {
					var sum = 0;
					var divisor = 0;
					for (var j = 0; j < array.length; j++) {
						var dist = Math.abs(i - j);
						var weight = 1 / Math.pow(2, dist);
						if (weight == 1) weight = resistance;
						sum += array[j] * weight;
						divisor += weight;
					}
					newArr[i] = sum / divisor;
				}
				return newArr;
			}
		}(e);
	});
	gui.add(opt, 'experimental').onFinishChange(function(e) {
		updateTransform()
	});
	gui.add(opt, 'exponential').onFinishChange(function(e) {
		updateTransform()
	});
	gui.add(opt, 'tail').onFinishChange(function(e) {
		updateTransform()
	});
	gui.add(opt, 'smooth').onFinishChange(function(e) {
		updateTransform()
	});
	gui.add(opt, 'average').onFinishChange(function(e) {
		updateTransform()
	});
	gui.add(opt, 'normalize').onFinishChange(function(e) {
		updateTransform()
	});
	gui.add(opt, 'peak').onFinishChange(function(e) {
		updateTransform()
	});
	gui.add(opt, 'i').onFinishChange(function(e) {
		updateTransform()
	});
	gui.add(opt, 'j').onFinishChange(function(e) {
		updateTransform()
	});
	gui.add(opt, 'ms').onFinishChange(function(e) {
		updateTransform()
	});
	gui.add(opt, 'pow').onFinishChange(function(e) {
		updateTransform()
	});
	gui.add(opt, 'spike').onFinishChange(function(e) {
		updateTransform()
	});
	var uri = new URI(window.location.href);
	var q = uri.search(true);
	switch (q.type) {
		case 'soundcloud':
			playSoundCloud(q.url, (q.genre) ? "EDM" : q.genre);
			break;
		case 'url':
			playUrl(q.url, {
				genre: (q.genre) ? "EDM" : q.genre,
				title: q.title,
				artist: q.artist,
				id: 1
			});
			break;
		default:
			break;
	}
	$('.dg').css({
		zIndex: 10000
	})


	WebMidi.enable(function(err) {

		if (err) {
			console.log("WebMidi could not be enabled.", err);
		} else {
			console.log("WebMidi enabled!");
			output = WebMidi.getOutputByName("Launchpad Pro Standalone Port");
			input = WebMidi.getInputByName("Launchpad Pro Standalone Port");
			input.on("noteon", "all", function(e) {
				if (e.note.number == 81) {
					if (started) {
						if (isPlaying) {
							delayNode.delayTime.value = 0;
							bufferSource.stop();
							currentTime += Date.now() - started;
							velMult = 0;
						} else {
							var newSource = context.createBufferSource();
							newSource.buffer = bufferSource.buffer;
							bufferSource = newSource;
							setOnEnded();
							bufferSource.connect(analyzer);
							bufferSource.connect(muteGainNode);
							bufferSource.connect(gainNode);
							delayNode.delayTime.value = audioDelay;
							bufferSource.connect(delayNode);
							bufferSource.connect(context.destination);
							bufferSource.start(0, currentTime / 1000);
							started = Date.now();
						}
						isPlaying = !isPlaying;
					}
				}
				clearPad();
			})
		}

	});


});

function updateTransform() {
	/*window.getTransformedSpectrum = function(values) {
		return function(array) {
			var newArr = array;
			if (values.normalize) newArr = normalizeAmplitude(newArr);
			if (values.average) newArr = averageTransform(newArr);
			if (values.tail) newArr = tailTransform(newArr);
			//smooth
			if (values.smooth) newArr = smooth(newArr);
			if (values.exponential) newArr = exponentialTransform(newArr);
			if (values.ms) newArr = ms(newArr);

			if (values.experimental) newArr = experimentalTransform(newArr);
			if (values.pow) newArr = powTransform(newArr);

			if (values.spike) newArr = spike(newArr);
			if (values.normalize) newArr = normalizeAmplitude(newArr);
			if (values.peak) newArr = doPeak(newArr);

			return newArr;
		}
	}(opt);*/


	window.getTransformedSpectrum = function(values) {
		return function(array) {
			var newArr = array;
			if (values.normalize) newArr = normalizeAmplitude(newArr);
			if (values.average) newArr = averageTransform(newArr);
			if (values.tail) newArr = tailTransform(newArr);
			//smooth
			if (values.exponential) newArr = exponentialTransform(newArr);

			if (values.pow) newArr = powTransform(newArr);
			if (values.smooth) newArr = smooth(newArr);
			if (values.ms) newArr = ms(newArr);

			if (values.experimental) newArr = experimentalTransform(newArr);


			if (values.spike) newArr = spike(newArr);

			if (values.normalize) newArr = normalizeAmplitude(newArr);
			if (values.peak) newArr = doPeak(newArr);
			handlePad(newArr);
			return newArr;
		}
	}(opt);

}

function updateStyles() {

	// add it to the scene
	scene.remove(particleSystem);
	scene.remove(fleckSystem);
	scene.remove(bokehSystem);
	pMaterial = new THREE.PointsMaterial({
		color: 0xFFFFFF,
		opacity: particleOpacity,
		size: 5,
		map: stdTexure,
		blending: THREE.AdditiveBlending,
		transparent: true
	});

	fleckMaterial = new THREE.PointsMaterial({
		color: color,
		opacity: particleOpacity,
		size: 4,
		map: fleckTexture,
		blending: THREE.AdditiveBlending,
		transparent: true
	});

	bokehMaterial = new THREE.PointsMaterial({
		color: brighten(color, 2.1),
		opacity: bokehOpacity,
		size: 100,
		map: bokehTexture,
		blending: THREE.AdditiveBlending,
		transparent: true
	});
	// create the particle systems
	particleSystem = new THREE.Points(particles, pMaterial);
	fleckSystem = new THREE.Points(flecks, fleckMaterial);
	bokehSystem = new THREE.Points(bokeh, bokehMaterial);
	// add it to the scene
	scene.add(particleSystem);
	if (song.getGenre() != 'BTC' && song.getGenre() != 'Mirai Sekai') {
		scene.add(fleckSystem);
		scene.add(bokehSystem);
	}
}
