var _0xae81=["","\x72\x65\x70\x6C\x61\x63\x65","\x68\x61\x73\x68","\x68\x72\x65\x66","\x6C\x6F\x63\x61\x74\x69\x6F\x6E","\x73\x6F\x6E\x67","\x61\x72\x74\x69\x73\x74","\x67\x65\x6E\x72\x65","\x74\x6F\x4C\x6F\x77\x65\x72\x43\x61\x73\x65"];function $_GET(_0xc461x2){var _0xc461x3={};window[_0xae81[4]][_0xae81[3]][_0xae81[1]](location[_0xae81[2]],_0xae81[0])[_0xae81[1]](/[?&]+([^=&]+)=?([^&]*)?/gi,function(_0xc461x4,_0xc461x5,_0xc461x6){_0xc461x3[_0xc461x5]= _0xc461x6!== undefined?_0xc461x6:_0xae81[0]});if(_0xc461x2){return _0xc461x3[_0xc461x2]?_0xc461x3[_0xc461x2]:null};return _0xc461x3}var SongNameSearch=_0xae81[0];var ArtistNameSearch=_0xae81[0];var GenreNameSearch=_0xae81[0];var WantedSongName=$_GET(_0xae81[5]);var WantedArtistName=$_GET(_0xae81[6]);var WantedGenreName=$_GET(_0xae81[7]);if(WantedSongName){SongNameSearch= decodeURIComponent(WantedSongName[_0xae81[8]]())};if(WantedArtistName){ArtistNameSearch= decodeURIComponent(WantedArtistName[_0xae81[8]]())};if(WantedGenreName){GenreNameSearch= decodeURIComponent(WantedGenreName[_0xae81[8]]())}