(function() {
    var thumbnailVideo = document.createElement('video'),
        canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');
    
    MediaElementPlayer.prototype.thumbnail = function() {
        var timefloat = this.rail[0].getElementsByClassName('mejs-time-float')[0];
        
        canvas.width = 121;
        canvas.height = 96;
        
        timefloat.insertBefore(canvas, timefloat.getElementsByClassName('mejs-time-float-current')[0]);
        
        thumbnailVideo.addEventListener('seeked', function() {
            ctx.drawImage(thumbnailVideo, 0, 0, canvas.width, canvas.height);
        });
    };
    
    MediaElementPlayer.prototype.setThumbnailSrc = function(src) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        thumbnailVideo.src = src;
    };
    
    MediaElementPlayer.prototype.paintThumbnail = mejs.Utility.deBounce(function(time) {
        thumbnailVideo.currentTime = time;
    }, 100);
})();
