var myURL = window.URL || window.webkitURL;

var mainMediaElement = null;

$('#main').append('<video id="player" controls="controls"></video>');

$('#player').mediaelementplayer({
    startLanguage: 'en',
    isVideo: true,
    hideCaptionsButtonWhenEmpty: false,
    mode: "native",
    success: function(mediaElement, domObject) {
        mainMediaElement = mediaElement;
        
        mainMediaElement.player.container
            .addClass('mejs-container-fullscreen');
        
        var t = mainMediaElement.player;
        
        function openCmdLineVideo() {
            var temp;
            
            if(!window.launchData || !window.launchData.items || !window.launchData.items.length)
                return false;
            
            window.launchData.items.forEach(function(e, i) {
                e.entry.file(function(file) {
                    temp.push(file);
                    
                    if(i === window.launchData.items.length - 1) {
                        t.filterFiles(temp);
                        
                        if(t.playlist.length > 0) {
                            t.tracks = [];
                            t.playIndex = 0;
                            t.setSrc(t.playlist[t.playIndex]);
                        }
                    }
                });
            });
            
            return true;
        }
        
        $(document).trigger("appStarted");
        
        if(!openCmdLineVideo())
            t.toggleInfo();
    }
});
