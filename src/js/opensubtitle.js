function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 1024;

    function charCodeFromCharacter(c) {
        return c.charCodeAt(0);
    }

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);
        var byteNumbers = Array.prototype.map.call(slice, charCodeFromCharacter);
        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
}

(function($) {
    $.extend(MediaElementPlayer.prototype, {
	buildopensubtitle: function(player, controls, layers, media) {
	    var 
	    t = this;

	    var service = new rpc.ServiceProxy("http://api.opensubtitles.org/xml-rpc", {
		sanitize: false,
		protocol: "XML-RPC",
		asynchronous: true,
		methods: ["ServerInfo", "LogIn", "SearchSubtitles", "DownloadSubtitles"]
	    });
	    t.opensubtitleService = {token:null, service:service, lastSubtitles : []};
	    
	    var prec = $('#li_encoding');
	    $('<li class="mejs-captionload"/>')
		.append($('<input type="radio" name="' + player.id + '_captions" id="' + player.id + '_captions_opensubtitle" value="opensubtitle" disabled="disabled"/>'))
		.append($('<div id="opensubtitle_button" class="mejs-button  mejs-captionload" > <button type="button" aria-controls="' + t.id + '" title="' + mejs.i18n.t('Download subtitles from OpenSubtitles.org') + '" aria-label="' + mejs.i18n.t('Download subtitles from OpenSubtitles.org') + '"></button></div>'))
		.append($('<select id="select_opensubtitle" style="padding: 0px 0px 0px 0px;text-overflow: ellipsis;width: 105px;height: 18px;overflow: hidden;white-space: nowrap;left:60px;position:absolute;visibility:hidden"/>'))
		.append($('<label id="label_opensubtitle" style="padding: 0px 0px 0px 0px;text-overflow: ellipsis;width: 105px;height: 18px;overflow: hidden;white-space: nowrap;left:60px;position:absolute;">No subtitle</label>'))
		.insertBefore(prec);

	    player.controls.find
	    ('input[id="'+player.id + '_captions_opensubtitle"]').click(function() {
		lang = this.value;
		player.setTrack(lang);
	    });


	    function info(text) {
		$('#label_opensubtitle')[0].textContent=text;
	    };

	    function openSubtitle(content, sub) {
		info("5/6 Opening...");
		var blob = b64toBlob(content, "text/plain");
		zip.createReader(new zip.BlobReader(blob),function(reader) {
		    reader.gunzip(new zip.BlobWriter(), function(data){
			info(sub.SubFileName);

			if (t.opensubtitleService.lastSubtitles.length > 1) {
			    $('#select_opensubtitle').css('visibility','inherit');
			    $('#label_opensubtitle').css('visibility','hidden');
			}
			

			$('#encoding-selector').val("UTF-8");

			t.tracks = t.tracks.filter(function (el) {
			    return el.srclang != 'opensubtitle';
			});
			t.tracks.push({
			    srclang: 'opensubtitle',
			    file: data,
			    kind: 'subtitles',
			    label: 'OpenSubtitle',
			    entries: [],
			    isLoaded: false
			});

			var trackIdx = t.findTrackIdx("opensubtitle")
			t.tracks[trackIdx].file = data;
			t.tracks[trackIdx].isLoaded = false;
			t.loadTrack(trackIdx);
		    });
		});
	    }

	    function downloadSubtitle(sub) {
		info("4/6 Downloading...");
		service.DownloadSubtitles({
		    params: [t.opensubtitleService.token, [
			sub.IDSubtitleFile
		    ]],
		    onException:function(errorObj){
			info("Download failed...");
		    },
		    onComplete:function(responseObj){
			var content = responseObj.result.data[0].data;
			openSubtitle(content, sub);
		    }
		});
	    }

	    function searchSubtitle(hash) {
		// var lang = "ita";
		var lang = "eng";
		// var lang = "ell";
		info("3/6 Searching...");
		service.SearchSubtitles({
		    params: [t.opensubtitleService.token, [
			{query: t.openedFile.name,
			 sublanguageid: lang},
			{moviehash: hash,
			 moviebytesize: t.openedFile.size,
			 sublanguageid: lang}
		    ], {limit:100}],
		    onException:function(errorObj){
			info("Search failed");
		    },
		    onComplete:function(responseObj){
			// Check that at leat a subtitle has been found
			console.log(responseObj);
			$('#select_opensubtitle')
				.find('option')
				.remove()
				.end();
			var subtitles = responseObj.result.data;
			for (var i=0; i<subtitles.length; i++) {
			    $('#select_opensubtitle')
				.append('<option value="'+
					i+'">'+
					subtitles[i].SubFileName+
					'</option>');
			}
			$('#select_opensubtitle').val(0);
			t.opensubtitleService.lastSubtitles = subtitles;

			$('#select_opensubtitle').off( "change");
			$('#select_opensubtitle').change(function(e) {
			    $('#label_opensubtitle').css('visibility','inherit');
			    $('#select_opensubtitle').css('visibility','hidden');
			    downloadSubtitle(
				subtitles[Number($('#select_opensubtitle')[0].value)]
			    );
			});

			downloadSubtitle(subtitles[0]);
		    }
		});
	    };

	    function movieHash() {
		info("2/6 Hashing...");
		OpenSubtitlesHash(t.openedFile, function(hash){
		    searchSubtitle(hash);
		});
	    };

	    function logIn() {
		info("1/6 Authenticating...");
		service.LogIn({
		    params: ["", "", "", "ChromeSubtitleVideoplayer"],
		    onException:function(errorObj){
			info("Authentiation failed");
		    },
		    onComplete:function(responseObj){
			t.opensubtitleService.token = responseObj.result.token;
			movieHash();
		    }
		});
	    };

	    $('#opensubtitle_button').click(function (e) {
		$('#label_opensubtitle').css('visibility','inherit');
		$('#select_opensubtitle').css('visibility','hidden');
		logIn();
	    });

	    media.addEventListener('loadeddata',function() {
		t.captionsButton
		    .find('input[value=opensubtitle]')
		    .prop('disabled',true);
		info("No subtitle");
		$('#label_opensubtitle').css('visibility','inherit');
		$('#select_opensubtitle').css('visibility','hidden');
		t.opensubtitleService.lastSubtitles = [];
	    });
	}
    });
})(mejs.$);

