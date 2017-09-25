SC.initialize({
  client_id: '3BimZt6WNvzdEFDGmj4oeCSZfgVPAoVc',
  redirect_uri: 'music.marisusis.me/auth'
});

var mySongs = ["https://soundcloud.com/haywyre/insight","https://soundcloud.com/monstercat/snavs-time","https://soundcloud.com/monstercat/unlike-pluto-everything-black","https://soundcloud.com/monstercat/wrld-chase-it","https://soundcloud.com/monstercat/volant-full-circle","https://soundcloud.com/monstercat/stonebank-feel-it","https://soundcloud.com/monstercat/stonebank-droppin-low","https://soundcloud.com/monstercat/volant-minty","https://soundcloud.com/monstercat/draper-inertia","https://soundcloud.com/monstercat/subtact-restart","https://soundcloud.com/monstercat/wrld-drowning"];

var myPlaylist = "https://soundcloud.com/calibermusic/sets/haywyre-encompassing-ep";

function loadPlaylist(playlist) {
  var urls = [];
  var promises = [];
  new function () {
    return new Promise(function(resolve,reject) {
      SC.resolve(playlist).then(function(list) {
        $(list.tracks).each(function (i, obj) {
          urls.push(obj.uri);
          // console.log(i);
        });
        resolve();
      });
    });

  } ().then(function() {
    console.log(urls)
    loadSongs(urls);
  });
}

function loadSongs(songs) {
  var promises = [];
  $(songs).each(function(i,obj) {
    var queueItem;
    var deferred = $.Deferred();
    SC.resolve(obj).then(function(track) {
      if (track.title.split("-").length > 1) {
        var infoArray = track.title.split("-");
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
        } (infoArray[1]);
        deferred.resolve([
          {artworkURL:track.artwork_url, title: infoArray[1], artist: infoArray[0], size: titleLength,index:i }
        ].map(Item).join(''));
      } else {
        var titleLength = function(t) {
          if (t.length > 25) {
            return "size-xl";
          } else if (t.length > 16) {
            return "size-l";
          } else if (t.length > 10) {
            return "size-m"
          } else {
            return "size-n";
          }
        } (track.title);
        deferred.resolve([
          {artworkURL:track.artwork_url, title: track.title, artist: track.user.username, size: titleLength,index:i }
        ].map(Item).join(''));
      }

    });
    promises.push(deferred);
  });

  return $.when.apply(undefined,promises).promise().done(function(a) {
    $(arguments).each(function(i, obj) {
      $(".queue-list").append(obj);
    });
    $(".queue-item:first").addClass("now-playing");

  });

}

function createQueueElement(title,artist,artworkURL) {
  $queueElement = $("")
}


function appendToQueue(info,i) {
  info.meta.titleLength = function(t) {
    if (t.length > 25) {
      return "size-xl";
    } else if (t.length > 16) {
      return "size-l";
    } else if (t.length > 8) {
      return "size-m"
    } else {
      return "size-n";
    }
  } (info.meta.title);
  $('.queue-list').append([
    {artworkURL:info.meta.albumArtWorkUrl, title: info.meta.title, artist: info.meta.artist, size: info.meta.titleLength,index:i }
  ].map(Item).join(''));
}
const Item = ({ artworkURL, title, artist,size,index }) => `
<div class="queue-item" data-index="${index}">
<div class="artwork">
<img class="artwork-image" src="${artworkURL}"/>
</div>
<div class="meta">
<div class="title"><span class="title ${size}">${title}</span></div>
<div class="artist"><span class="artist">${artist}</span></div>
</div>
</div>
`;


$(".queue-arrow").click(function() {
  $(".queue-wrap").toggleClass("closed");
  $(".queue-arrow").toggleClass("closed");
  $(".player-wrap").toggleClass("shift");
  $(this).children("span").toggleClass("icon-arrow-left")
  $(this).children("span").toggleClass("icon-arrow-right");
});

$(".queue-arrow").mouseover(function() {
  if (!$(".queue-wrap").hasClass("closed")) {
    $(".queue-wrap").css({width: "320px"});
    $(".queue-arrow").css({width: "40px"});
  }
});

$(".queue-arrow").mouseleave(function() {
  if (!$(".queue-wrap").hasClass("closed")) {
    $(".queue-wrap").css({width: "300px"});
    $(".queue-arrow").css({width: "20px"});
  }
});

$(".queue-item").click(function() {
  console.log("CLICK!")
  $(".queue-item").not(this).removeClass("now-playing");
  $(this).addClass("now-playing");
});

// loadSongs()

// loadSongs(mySongs);

function setNowPlaying(id) {
  $(".queue-item").not("[data-index="+id+"]").removeClass("now-playing");
  $("[data-index="+id+"]").addClass("now-playing");
}
