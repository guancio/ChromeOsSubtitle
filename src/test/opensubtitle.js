var token = null;
   var service = new rpc.ServiceProxy("http://api.opensubtitles.org/xml-rpc", {
     sanitize: false,
     protocol: "XML-RPC",
       asynchronous: true,
       methods: ["ServerInfo", "LogIn", "SearchSubtitles", "DownloadSubtitles"]
   });

function aaa() {
   service.ServerInfo({
      params: null,
      onException:function(errorObj){
      },
      onComplete:function(responseObj){
	  console.log(responseObj);
	  service.LogIn({
	      params: ["", "", "", "ChromeSubtitleVideoplayer"],
	      onException:function(errorObj){
		  console.log(responseObj);
	      },
	      onComplete:function(responseObj){
		  console.log(responseObj);
		  token = responseObj.result.token;
		  bbb();
	      }
	  });
      }
   });
}


// SearchSubtitles( $token, array(array('sublanguageid' => $sublanguageid, 'moviehash' => $moviehash, 'moviebytesize' => $moviesize, imdbid => $imdbid, query => 'movie name', "season" => 'season number', "episode" => 'episode number', 'tag' => tag ),array(...)), array('limit' => 500))

var subtitle = null;

function bbb() {
    service.SearchSubtitles({
	params: [token, [
	    // {query: "Dexter.S08E08.HDTV.x264-ASAP.mp4",
	    //  sublanguageid: "eng"}
	    {query: "DexterS08E08.HDTV.x264.mkv",
	     sublanguageid: "eng"}
	], {limit:100}],
	onException:function(errorObj){
	    console.log(responseObj);
	},
	onComplete:function(responseObj){
	    console.log(responseObj);
	    subtitle = responseObj.result.data[0];
	    ccc();
	}
    });
}

var content = null;

function ccc() {
    service.DownloadSubtitles({
	params: [token, [
	    subtitle.IDSubtitleFile
	]],
	onException:function(errorObj){
	    console.log(responseObj);
	},
	onComplete:function(responseObj){
	    content = responseObj.result.data[0].data;
	    console.log(responseObj);
	    ddd();
	}
    });
}


var res = null;
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
    res = byteArrays;
    return blob;
}

var blob = null;
function ddd() {
    blob = b64toBlob(content, "text/plain");
    eee();
    return;
    chrome.fileSystem.chooseEntry({type: 'saveFile'}, function(theFileEntry) {
	theFileEntry.createWriter(function(writer) {
	    writer.onwriteend = function(trunc) {
		writer.onwriteend = null;
		writer.write(blob);
	    };
	    writer.seek(0);
	    writer.truncate(0);
	}, function(writer) {
	    console.log("error 1");
	});
    });
}

var xxx;
function eee() {
    zip.createReader(new zip.BlobReader(blob), function(reader) {
	reader.gunzip(new zip.TextWriter(), function(writer){
	    xxxx = writer;
	});
    });
}