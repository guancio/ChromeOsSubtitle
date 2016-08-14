var myURL = window.URL || window.webkitURL;

var mainMediaElement = null;

$('#main').append('<video id="player" controls="controls"></video>');

MediaElementPlayer(document.getElementById('player'), {
    startLanguage: 'en',
    mode: "native",
    success: function(mediaElement) {
        mainMediaElement = mediaElement;
        
        mainMediaElement.container
            .addClass('mejs-container-fullscreen');
        
        var t = mainMediaElement,
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
                    t.filterFiles(temp, true);
                }
            });
        });
        
        $(document).trigger("appStarted");
    }
});
