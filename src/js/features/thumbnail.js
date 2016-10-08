(function() {
    var CANVAS_WIDTH = 121,
        CANVAS_HEIGHT = 96;
    
    var thumbnailVideo = $('<video>'),
        canvas = $('<canvas>'),
        ctx = canvas
                .get()
                .getContext('2d');
    
    MediaElementPlayer.prototype.thumbnail = function() {
        var timefloat = this.rail.find('.mejs-time-float');
        
        canvas
            .attr({
                'width': CANVAS_WIDTH,
                'height': CANVAS_HEIGHT
            })
            .insertBefore(timefloat.find('.mejs-time-float-current'));
        
        thumbnailVideo.on('seeked', function() {
            ctx.drawImage(thumbnailVideo.get(0), 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        });
    };
    
    MediaElementPlayer.prototype.setThumbnailSrc = function(src) {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        thumbnailVideo.attr({ 'src': src });
    };
    
    MediaElementPlayer.prototype.paintThumbnail = wrnch.deBounce(function(time) {
        thumbnailVideo.attr({ 'currentTime': time });
    }, 100);
})();
