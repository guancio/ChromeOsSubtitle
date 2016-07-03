var myURL = window.URL || window.webkitURL;

var packaged_app = (window.location.origin.indexOf("chrome-extension") == 0);

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
        mainMediaElement.player.container
            .width('100%')
            .height('100%');

        var t = mainMediaElement.player;
        if(mainMediaElement.player.pluginType === 'native') {
            t.$media
                .width('100%')
                .height('100%');
        } else {
            t.container.find('.mejs-shim')
                .width('100%')
                .height('100%');

            //if (!mejs.MediaFeatures.hasTrueNativeFullScreen) {
            t.media.setVideoSize($(window).width(), $(window).height());
            //}
        }

        t.layers.children('div')
            .width('100%')
            .height('100%');

        t.setControlsSize();


        function openCmdLineVideo() {
            if(!window.launchData)
                return false;
            if(!window.launchData.items)
                return false;
            if(window.launchData.items.length != 1)
                return false;
            entry = window.launchData.items[0].entry;
            if(entry == null)
                return false;

            mainMediaElement.stop();
            entry.file(function fff(file) {
                mainMediaElement.player.openedFile = file;
                mainMediaElement.player.openedFileEntry = entry;

                var path = window.URL.createObjectURL(file);
                mainMediaElement.setSrc(path);
                mainMediaElement.play();
            });
            return true;
        }

        $(document).trigger("appStarted");

        if(!openCmdLineVideo())
            mediaElement.player.openInfoWindow();
    }
});