var myURL = window.URL || window.webkitURL;

var mainMediaElement = null;

$('#main').append('<video id="player" controls="controls"></video>');

$('#player').mediaelementplayer({
    startLanguage: 'en',
    isVideo: true,
    mode: "native",
    success: function(mediaElement, domObject) {
        mainMediaElement = mediaElement;
        
        mainMediaElement.player.container
            .addClass('mejs-container-fullscreen');
        
        var t = mainMediaElement.player,
            temp;
        
        if(!window.launchData || !window.launchData.items || !window.launchData.items.length) {
            t.filterFiles([]);
            t.toggleInfo();
            return;
        }
        
        window.launchData.items.forEach(function(e, i) {
            e.entry.file(function(file) {
                temp.push(file);
                
                if(i === window.launchData.items.length - 1) {
                    t.filterFiles(temp);
                    
                    if(t.playlist.length > 0) {
                        t.tracks = [];
                        t.playIndex = 0;
                        t.setSrc();
                    }
                }
            });
        });
        
        $(document).trigger("appStarted");
    }
});
