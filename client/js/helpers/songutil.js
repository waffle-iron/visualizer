var Context = new AudioContext();
var audio = $("#audio")[0];
var SampleRate = Context.sampleRate
var Source;
var Analyser = Context.createAnalyser();
var GainNode = Context.createGain();
var AudioNode = Context.createScriptProcessor(BufferInterval, 1, 1)
var delayNode = Context.createDelay(1);

SC.initialize({
	client_id: '3BimZt6WNvzdEFDGmj4oeCSZfgVPAoVc',
	redirect_uri: 'music.marisusis.me/auth'
});

var queue = [];
var currentSong = {};
var queueSpot = -1;

var sc = new SoundCloudLoader("3BimZt6WNvzdEFDGmj4oeCSZfgVPAoVc");

var ArtistText = document.getElementById("Artist")
var SongNameText = document.getElementById("SongName")
var Title = document.getElementById("Title")

var StartTime = 0
var TimeLength = 0
var Playing = false


var AlbumRotations = []
var NextAlbumRotation = 0
var TextCycles = []
var NextTextCycle = 0

var GenreColor = "#FFFFFF"

var ArtistName = ""
var SongName = ""
var GenreName = ""
var SingleLineSongName = ""
var SingleLineArtistName = ""

var BackgroundWidth = 0
var BackgroundHeight = 0

var SongTextSize = 0.96
var SongNameSizeRatio = 0.6
var ArtistNameActualRatio = 0
var SongNameActualRatio = 0

var Albums = []
var LPSongNames = []
var AlbumBackgrounds = []
var SongBackgrounds = []
var ArtistBackgrounds = []

var ChangedEnvironments = []
var BaseEnvironments = []

var DefaultTextColor = "#FFFFFF"

var begun = false;

function Preload(ImageUrl) {
	var Img = new Image();
	Img.src = "/image/href?="+ImageUrl; // TODO: Change/Move to better place
}

var CachedAudio = []
var MaxCachedURLs = 5
var LastCachedURLs = []

function PushValues(NewValue) {
	var FirstValue = LastCachedURLs[0]
	for (var i = 0; i < MaxCachedURLs - 1; i++) {
		LastCachedURLs[i] = LastCachedURLs[i + 1]
	}
	LastCachedURLs[MaxCachedURLs - 1] = NewValue
	return FirstValue
}

function initNodes() {
	// CreateSourceBuffer()
	Source = Context.createMediaElementSource(audio);
	// Source.connect(GainNode);
	delayNode.delayTime.value = 0.3;

	muteGainNode = Context.createGain();
	muteGainNode.gain.value = -1;
	Source.connect(muteGainNode);
	muteGainNode.connect(Context.destination);
	Source.connect(GainNode);
	GainNode.connect(delayNode);
	Source.connect(delayNode);
	delayNode.connect(Context.destination);

	// Source.onended = function() {
	// 	if (Paused == false) {
	// 		stop()
	// 		playSong(Songs[SongSpot]);
	// 	}
	// }
	// Songs = new Array();
	AudioNode.onaudioprocess = HandleAudio
	Analyser.fftSize = FFTSize
	Analyser.smoothingTimeConstant = 0



	AudioNode.connect(Context.destination);

	Analyser.connect(AudioNode);
	Source.connect(Analyser);

	Source.connect(Context.destination)
}

var CachedAudio = []

function LoadSound(ArtistLogo, Album) {
  var currentSong = queue[queueSpot]; // TODO: Move to better place
	StartTime = false

	Stopped = false


	TimeLength = Math.round(audio.duration * 1000)
	StartTime = Date.now()
	Playing = true

	MainDiv.style.display = "block"
	LoadingDiv.style.display = "none"

	var AlbumImageLink = "img/albums/" + Album + ".png"
	Preload(MonstercatLogo.innerHTML)
	AlbumRotations[0] = [0.5 * 1000, "Open"]
	if (currentSong.meta.artistLogoURL != null) {
		Preload(currentSong.meta.artistLogoURL)
		AlbumRotations[AlbumRotations.length] = [15 * 1000, "Turn", ArtistLogo]
	}
	if (currentSong.meta.albumArtworkURL != undefined) {
		Preload(currentSong.meta.albumArtworkURL);
		AlbumRotations[AlbumRotations.length] = [30 * 1000, "Turn", AlbumImageLink]
		AlbumRotations[AlbumRotations.length] = [TimeLength - (30 * 1000), "Turn", ArtistLogo]
	}
	if (currentSong.meta.artistLogoURL != null) {
		AlbumRotations[AlbumRotations.length] = [TimeLength - (15 * 1000), "Turn"]
	}
	AlbumRotations[AlbumRotations.length] = [TimeLength - (0.5 * 1000), "Close"]

	var AlbumData = Albums[Album]
	var LPSongNameData = LPSongNames[SongName]

	if (LPSongNameData != null) {
		var StartSong = LPSongNameData[0]
		if (StartSong != null && StartSong[0] == 0) {
			TextCycles[0] = [1000, "Open", "Song", StartSong[1], StartSong[2]]
		} else {
			TextCycles[0] = [1000, "Open", "Song", ArtistName, SongName]
		}
	} else {
		TextCycles[0] = [1000, "Open", "Song", ArtistName, SongName]
	}

	if (LPSongNameData != null) {
		for (var i = 0; i < LPSongNameData.length; i++) {
			var CurrentSong = LPSongNameData[i]
			TextCycles[TextCycles.length] = [CurrentSong[0], "Change", "Song", CurrentSong[1], CurrentSong[2]]
		}
	} else if (AlbumData != undefined) {
		var TimeDivision = TimeLength * (1 / (AlbumData[1].length + 1))
		for (var i = 0; i < AlbumData[1].length; i++) {
			TextCycles[TextCycles.length] = [TimeDivision * (i + 1), "Change", "Album", AlbumData[0], AlbumData[1][i]]
		}
	}
	TextCycles[TextCycles.length] = [TimeLength - 1000, "Close"]

	if (GenreName != "") {
		document.title = "[" + GenreName + "] " + SingleLineArtistName + " - " + SingleLineSongName
	} else {
		document.title = SingleLineArtistName + " - " + SingleLineSongName
	}




	var NextSongSpot = SongSpot + 1
	if (NextSongSpot > Songs.length - 1) {
		NextSongSpot = 0
	}
	var NextSongData = Songs[0]
	// GetAudioSource(NextSongData[3], function() {})

}



function RemoveNewLines(String) {
	String = String.replace("<br/>", " ")
	String = String.replace("<br>", " ")
	String = String.replace("<Br/>", " ")
	String = String.replace("<Br>", " ")
	String = String.replace("<bR/>", " ")
	String = String.replace("<bR>", " ")
	String = String.replace("<BR/>", " ")
	String = String.replace("<BR>", " ")
	return String
}

function AddSong(ArtistName, SongName, GenreName, FileLocation, ArtistFile, AlbumName) {
	if (RemoveNewLines(SongName).toLowerCase().match(SongNameSearch) != null) {
		if (RemoveNewLines(ArtistName).toLowerCase().match(ArtistNameSearch) != null) {
			if (RemoveNewLines(GenreName).toLowerCase().match(GenreNameSearch) != null) {
				Songs[Songs.length] = [ArtistName, SongName, GenreName, FileLocation, ArtistFile, AlbumName]
			}
		}
	}
}

var addSong = function(source, data) {

}

function GetTableLength(Table) {
	var Total = 0

	for (var i = 0; i < Table.length; i++) {
		if (Table[i] != null) {
			Total++
		}
	}
	return Total
}

function GetRandomTableOfNumbers(Numbers) {
	var Table = []
	var ValuesLeft = []

	for (var i = 0; i < Numbers; i++) {
		ValuesLeft[i] = i
	}
	while (GetTableLength(ValuesLeft) > 0) {
		var Done = false
		while (Done == false) {
			var Random = Math.floor(Math.random() * Numbers)
			if (ValuesLeft[Random] != null) {
				Done = true
				Table[Table.length] = ValuesLeft[Random]
				ValuesLeft[Random] = null
			}
		}
	}
	return Table
}


function ForceStop() {
	Playing = false
	Paused = false
	CurrentTimeOffset = 0
	if (DownloadSongData == true) {
		var ModuleName = ArtistName + "_" + SongName
		CompiledSongData = '<roblox xmlns:xmime="http://www.w3.org/2005/05/xmlmime" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://www.roblox.com/roblox.xsd" version="4"> <External>null</External> <External>nil</External> <Item class="ModuleScript" referent="RBX040E8D154ACF48B48C3F54832CED08C8"><Properties> <Content name="LinkedSource"><null></null></Content> <string name="Name">' + ModuleName + '</string> <ProtectedString name="Source"><![CDATA[' + CompiledSongData;
		CompiledSongData = CompiledSongData + "\n}";
		CompiledSongData = CompiledSongData + ']]></ProtectedString> </Properties> </Item> </roblox>';
		var FileName = ArtistName + " - " + SongName + " Exported Song Data.rbxmx"
		download(CompiledSongData, FileName, "text/plain");
	}
	CompiledSongData = "return {"
	LastFrame = 0
	PlayRandomSong() //remove this so it just stops
}

function stop() {
	if (Stopped != true) {
		Stopped = true
		AlbumImage.style.width = "0px"
		AlbumImage.style.left = "0px"
		MonstercatLogo.style.width = "0px"
		MonstercatLogo.style.left = "0px"
		TextDiv.style.width = "0px"
		AlbumTextDiv.style.width = "0px"

		ParticleBackground.style.opacity = 0
		TimeLength = 0
		if (Source && Paused == false) {
			Source.stop()
		} else {
			Playing = false
			Paused = false
			CurrentTimeOffset = 0
			LastFrame = 0
		}
	}
}

function addToQueue(song) {
	queue.push(song);
  appendToQueue(song,queueSpot + 1);
}

function nextSongInQueue() {
	if (queueSpot + 1 >= queue.length) {
		queueSpot = 0;
	} else {
		queueSpot++;
	}
	currentSong = queue[queueSpot];
	switch (currentSong.type) {
		case "soundcloud":
			sc.load({
				track: currentSong.data.url,
				player: '#audio'
			});
			break;
		case "url":
			audio.src = currentSong.data.url;
			break;
		default:
			console.error("Unknown source: \"" + currentSong.type + "\"");
			break;
	}
}

function playCurrentSong() {
  setNowPlaying(queueSpot)
	audio.play().then(function() {
		$(".control.play").attr("data-state", "playing");
		$(".control.play").children("span").removeClass("icon-music-play-button");
		$(".control.play").children("span").addClass("icon-music-pause-button");

		ArtistName = currentSong.meta.artist;
		SongName = currentSong.meta.title;
		SingleLineSongName = RemoveNewLines(SongName)
		SingleLineArtistName = RemoveNewLines(ArtistName)
		GenreName = "Electro";
		var ArtistLogo = currentSong.albumArtworkURL; //Change to artist profile picture & move album art to separate variable
		var Album = currentSong.albumArtworkURL;


		GenreColor = GetColorFromGenre(GenreName)

    updateColors(GenreColor);
    updateInfo(currentSong);
		if (EncodeEnabledByDefault == true) {
			DownloadSongData = true
		} else {
			DownloadSongData = false
		}

		RevertCustomBackgroundChanges()

		var SongBackgroundOverride = SongBackgrounds[SingleLineSongName]
		var AlbumBackgroundOverride = AlbumBackgrounds[Album]
		var ArtistBackgroundOverride = ArtistBackgrounds[ArtistName]

		var FullBackgroundData
		if (SongBackgroundOverride) {
			if (SongBackgroundOverride[0]) {
				FullBackgroundData = SongBackgroundOverride[0]
			}
			if (SongBackgroundOverride[1]) {
				GenreColor = SongBackgroundOverride[1]
			}
			if (SongBackgroundOverride[2]) {
				SongBackgroundOverride[2]()
			}
		} else if (AlbumBackgroundOverride) {
			if (AlbumBackgroundOverride[0]) {
				FullBackgroundData = AlbumBackgroundOverride[0]
			}
			if (AlbumBackgroundOverride[1]) {
				GenreColor = AlbumBackgroundOverride[1]
			}
			if (AlbumBackgroundOverride[2]) {
				AlbumBackgroundOverride[2]()
			}
		} else if (ArtistBackgroundOverride) {
			if (ArtistBackgroundOverride[0]) {
				FullBackgroundData = ArtistBackgroundOverride[0]
			}
			if (ArtistBackgroundOverride[1]) {
				GenreColor = ArtistBackgroundOverride[1]
			}
			if (ArtistBackgroundOverride[2]) {
				ArtistBackgroundOverride[2]()
			}
		}


		if (FullBackgroundData) {
			DrawParticles = false
			var BackgroundData = FullBackgroundData[Math.floor(Math.random() * FullBackgroundData.length)]
			BackgroundImage.src = BackgroundData[0]
			BackgroundWidth = BackgroundData[1]
			BackgroundHeight = BackgroundData[2]
			ColorBackground.style.backgroundColor = BackgroundData[3]
		} else {
			DrawParticles = true
			BackgroundImage.src = "img/blankpixel.png"
			ColorBackground.style.backgroundColor = "#000000"
		}

		MainDiv.style.display = "none"
		LoadingDiv.style.display = "block"
		document.title = "Loading..."
		if (GenreName != "") {
			LoadingText.innerHTML = "Loading...<br>[" + GenreName + "] " + SingleLineArtistName + " - " + SingleLineSongName
		} else {
			LoadingText.innerHTML = "Loading...<br>" + SingleLineArtistName + " - " + SingleLineSongName
		}


		NextAlbumRotation = 0
		AlbumRotations = []
		NextTextCycle = 0
		TextCycles = []
		//Load sound
		LoadSound(ArtistLogo, Album)
		CreateNewFleck();
	});
}

function addSoundcloudToQueue(url) {
	SC.resolve(url).then(function(track) {
		var title = track.title;
		var artworkURL = track.artwork_url;
		var artist = track.user.username
		var stream = track.stream_url + "?client_id=3BimZt6WNvzdEFDGmj4oeCSZfgVPAoVc";
    var artistLogoURL = track.user.avatar_url;
		// addToQueue([artist, title, "Electro", stream, artworkURL, "4usingle"])
		if (artist == "Monstercat") {
			var trackData = title.split("-");
			artist = trackData[0];
			title = trackData[1];
		}
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
    } (title);
		addToQueue({
			type: "soundcloud",
			meta: {
				title: title,
				artist: artist,
				albumArtworkURL: artworkURL,
        size: titleLength,
        artistLogoURL: artistLogoURL
			},
			data: {
				url: url
			}
		});
		console.log(track);
	});
}

function addUrlToQueue(url, meta) {
	if (meta == null) {
		addToQueue({
			type: "url",
			meta: {
				title: "URL",
				artist: "SOURCE",
				albumArtworkURL: "none"
			},
			data: {
				url: url
			}
		});
	} else {
		addToQueue({
			type: "url",
			meta: meta,
			data: {
				url: url
			}
		});
	}
}
