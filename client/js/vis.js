if (!window.AudioContext) {
	if (!window.webkitAudioContext) {
		alert('Could not get audio context! (Are you using IE?)');
	}
	window.AudioContext = window.webkitAudioContext;
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


function playSoundCloud(url) {
	centerContent();
	if (isPlaying) {
		bufferSource.stop();
		loading();
	}
	SC.resolve(url).then(function(track) {
		console.log(track);
		var s = new Song({
			title: track.title,
			artist: track.user.username,
			genre: "Trap",
			id: 123
		});

		loadSong(s);

		initGui(song);
		setupAudioNodes()
		loadSound(track.stream_url + "?client_id=3BimZt6WNvzdEFDGmj4oeCSZfgVPAoVc"); // music file


		centerContent();
	});
	$('#songinfo').css('padding-top', (blockSize - $('#songinfo').height()) / 2);
}
