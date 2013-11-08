(function($) {
    $.extend(MediaElementPlayer.prototype, {
	buildopensubtitle_uploader: function(player, controls, layers, media) {
	    var 
	    t = this;
	    
	    var minPerc = 0.001;
	    // var minPerc = 0.80;
	    
	    function searchIMDB() {
		t.opensubtitleService.service.SearchMoviesOnIMDB({
		    params: [
			t.opensubtitleService.token,
			t.openedFile.name
		    ],
		    onException:function(errorObj){
			console.log("SearchIMDB Failed");
			console.log(errorObj);
		    },
		    onComplete:function(responseObj){
			console.log(responseObj);
		    }
		});
	    }

	    function checkMovieHash(subhash, hash) {
		t.opensubtitleService.service.CheckMovieHash({
		    params: [
			t.opensubtitleService.token,
			[hash]
		    ],
		    onException:function(errorObj){
			console.log("CheckMovieHash Failed");
			console.log(errorObj);
		    },
		    onComplete:function(responseObj){
			var movieID = null;
			if (!responseObj.result.data ||
			   responseObj.result.data[hash].length == 0) {
			    console.log("IMDB search not implemented");
			    return;
			}
			movieID = responseObj.result.data[hash].MovieImdbID;
			console.log(movieID);
		    }
		});
	    }

	    function tryUpload(subhash, hash) {
		t.opensubtitleService.service.TryUploadSubtitles({
		    params: [
			t.opensubtitleService.token,
			{cd1: {
			    subhash:subhash,
			    subfilename:player.selectedTrack.file.name,
			    moviehash:hash,
			    moviebytesize:t.openedFile.size,
			    moviefilename:t.openedFile.name
			}}
		    ],
		    onException:function(errorObj){
			console.log("TryUpload Failed");
			console.log(errorObj);
		    },
		    onComplete:function(responseObj){
			console.log("tried");
			console.log(responseObj);
			if (responseObj.result.alreadyindb == 1) {
			    console.log("Already in DB");
			    return;
			}
			console.log("Not in DB");
			checkMovieHash(subhash, hash);
		    }
		});
	    }

	    function md5subtitle(hash) {
		var reader = new FileReader();
		reader.onloadend = function(evt) {
		    var d = evt.target.result;
		    tryUpload(md5(d), hash);
		}
		//reader.readAsText(selectedTrack.file, t.captionEncodingSelect.value);
		reader.readAsText(player.selectedTrack.file);
	    };

	    function movieHash() {
		OpenSubtitlesHash(t.openedFile, function(hash){
		    md5subtitle(hash);
		});
	    };

	    function upload() {
		t.opensubtitleService.uploader.uploadAttempts = 1;
		player.resetOpenSubUploader();
		t.opensubtitleService.service.LogIn({
		    params: [t.opensubtitleService.uploader.username,
			     t.opensubtitleService.uploader.pwd,
			     "", "ChromeSubtitleVideoplayer"],
		    onException:function(errorObj){
			console.log(errorObj);
			console.log("Authentiation failed");
		    },
		    onComplete:function(responseObj){
			console.log(responseObj);
			t.opensubtitleService.token = responseObj.result.token;
			console.log("logged");
			movieHash();
		    }
		});
	    }


	    player.resetOpenSubUploader = function() {
		var secs = Math.ceil(media.duration?media.duration:1);
		var watched = new Array(secs+1);
		for (var i=0; i<=secs; i++) {
		    watched[i] = false;
		}
		t.opensubtitleService.uploader.watched =  watched;
		t.opensubtitleService.uploader.lastSec = 0;
		t.opensubtitleService.uploader.lastCheck = 0;		
	    };

	    t.opensubtitleService.uploader = {
		watched: [],
		lastSec: 0,
		lastCheck: 0,
		username: "",
		pwd: "",
		autoUpload: true,
		uploadAttempts: 0
	    };

	    player.resetOpenSubUploader();

	    media.addEventListener('loadeddata',function() {
		player.resetOpenSubUploader();
		t.opensubtitleService.uploader.uploadAttempts = 0;
	    });
	    
	    $(document).bind("subtitleChanged", function() {
		player.resetOpenSubUploader();
		t.opensubtitleService.uploader.uploadAttempts = 0;
	    });

	    media.addEventListener('timeupdate', function(e) {
		if (t.opensubtitleService.uploader.uploadAttempts > 0)
		    return;

		var state = t.opensubtitleService.uploader;
		var sec = Math.floor(media.currentTime);

		var oldLastSec = state.lastSec;
		state.lastSec = sec;
		

		if (player.selectedTrack == null)
		    return;

		if (player.selectedTrack.srclang != "fromfile")
		    return;

		if (t.capDelayValue != 0) {
		    player.resetOpenSubUploader();
		    return;
		}

		if (Math.abs(sec - oldLastSec) < 5)
		    state.watched[sec] = true;

		if (Math.abs(sec - state.lastCheck) >= 5) {
		    var nWatched = 0;
		    for (var i=0; i<Math.ceil(media.duration); i++) {
			if (state.watched[i])
			    nWatched += 1;
		    }
		    console.log(sec);
		    console.log(nWatched);
		    state.lastCheck = sec;
		    console.log(nWatched / Math.ceil(media.duration)*100);

		    if (nWatched / media.duration > minPerc) {
			console.log("To upload");
			upload();
		    }
		}
	    }, false);



	    var settingsList = $('#settings_list')[0];
	    $('<li/>')
    		.appendTo(settingsList)
    		.append($('<label style="width:250px; float:left;">Automatic opensubtitle.org upload</label>'))
    		.append($('<input type="checkbox" id="autoOpenSubtitleUpload" checked="true" name="autoOpenSubtitleUpload" value="yes"/>'));
	    var checkBox = $('#autoOpenSubtitleUpload')[0];
	    
	    $('<li/>')
    		.appendTo(settingsList)
    		.append($('<label style="width:250px; float:left;">Opensubtitle username</label>'))
    		.append($('<input id="usernameOpenSubtitle" style="width:100px;background-color: transparent; color: white;"/>'));
	    $('#usernameOpenSubtitle').keydown(function (e) {
		e.stopPropagation();
		return true;
	    });

	    $('<li/>')
    		.appendTo(settingsList)
    		.append($('<label style="width:250px; float:left;">Opensubtitle password</label>'))
    		.append($('<input id="pwdOpenSubtitle" type="password" style="width:100px;background-color: transparent; color: white;"/>'));
	    $('#pwdOpenSubtitle').keydown(function (e) {
		e.stopPropagation();
		return true;
	    });

	    t.opensubtitleService.uploader;

	    if (localStorage.getItem('opensubtitle_username')) {
		t.opensubtitleService.uploader.username =
		    localStorage.getItem('opensubtitle_username');
		$("#usernameOpenSubtitle")[0].value =
		    t.opensubtitleService.uploader.username;
	    }
	    if (localStorage.getItem('opensubtitle_pwd')) {
		t.opensubtitleService.uploader.pwd = localStorage.getItem('opensubtitle_pwd');
		$("#pwdOpenSubtitle")[0].value =
		    t.opensubtitleService.uploader.pwd;
	    }

	    $(document).bind("settingsClosed", function() { 
		t.opensubtitleService.uploader.username =
		    $("#usernameOpenSubtitle")[0].value;
		localStorage.setItem(
		    'opensubtitle_username',
		    t.opensubtitleService.uploader.username);

		t.opensubtitleService.uploader.pwd =
		    $("#pwdOpenSubtitle")[0].value;
		localStorage.setItem(
		    'opensubtitle_pwd',
		    t.opensubtitleService.uploader.pwd);
	    });


	    // if (localStorage.getItem('default_opensubtitle_lang')) {
	    // 	settingsLang = localStorage.getItem('default_opensubtitle_lang');
	    // }
	    
	    // $(selectDefault).val(settingsLang);
	    // $('#select_opensubtitle_lang').val(settingsLang);

	    // $(document).bind("settingsClosed", function() { 
	    // 	var defaultValue = selectDefault.value;
	    // 	localStorage.setItem('default_opensubtitle_lang', defaultValue);
	    // 	$('#select_opensubtitle_lang').val(defaultValue);
	    // });
	}
    });
})(mejs.$);

