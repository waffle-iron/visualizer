/*function Song(rawData) {
	if (rawData != '' && !rawData.match('^#')) { // check it's not a comment or an empty line
		var data = rawData.split('\|');
		if (data.length < 4) {
			throw 'Invalid song data';
		}
		this.id = data[0];
		this.artist = data[1];
		this.title = data[2];
		this.genre = data[3];
	} else {
		throw 'non-song';
	}
}*/

function Song(data) {
	this.id = data.id;
	this.artist = data.artist;
	this.title = data.title;
	this.genre = data.genre;
}

Song.prototype.getId = function() {
	return this.id;
}

Song.prototype.getArtist = function() {
	return this.artist;
}

Song.prototype.getTitle = function() {
	return this.title;
}

Song.prototype.getGenre = function() {
	return this.genre;
}
