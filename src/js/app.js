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
            if(!window.launchData || !window.launchData.items || !window.launchData.items.length)
                return false;
            
            entry = window.launchData.items[0].entry;
            
            if(entry === null)
                return false;
            
            t.pause();
            entry.file(function fff(file) {
                t.playlist.push(file);
                t.playIndex = 0;
                
                t.setSrc(t.playlist[t.playIndex]);
            });
            
            return true;
        }
        
        $(document).trigger("appStarted");
        
        if(!openCmdLineVideo())
            t.toggleInfo();
    }
});
