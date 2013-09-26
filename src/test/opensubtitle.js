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
	    {query: "Dexter"}
	], {limit:100}],
	onException:function(errorObj){
	    console.log(responseObj);
	},
	onComplete:function(responseObj){
	    console.log(responseObj);
	    subtitle = responseObj.result.data[0];
	}
    });
}

function ccc() {
    service.DownloadSubtitles({
	params: [token, [
	    subtitle.IDSubtitleFile
	]],
	onException:function(errorObj){
	    console.log(responseObj);
	},
	onComplete:function(responseObj){
	    console.log(responseObj);
	}
    });
}