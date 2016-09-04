(function($) {
    var thumbnailVideo = $('<video>'),
        canvas = $('<canvas>'),
        ctx = canvas.getContext('2d');
    
    MediaElementPlayer.prototype.thumbnail = function() {
        var timefloat = this.rail.find('.mejs-time-float');
        
        canvas.width = 121;
        canvas.height = 96;
        
        canvas.appendTo(timefloat);
        canvas.insertBefore(timefloat.find('.mejs-time-float-current'));
        
        thumbnailVideo.on('seeked', function() {
            ctx.drawImage(thumbnailVideo, 0, 0, canvas.width, canvas.height);
        });
    };
    
    MediaElementPlayer.prototype.setThumbnailSrc = function(src) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        thumbnailVideo.el.src = src;
    };
    
    MediaElementPlayer.prototype.paintThumbnail = mejs.Utility.deBounce(function(time) {
        thumbnailVideo.el.currentTime = time;
    }, 100);
})(mejs.$);
