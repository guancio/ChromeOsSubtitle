(function() {
    var playTypes = ['Normal', 'Repeat', 'Shuffle'],
        playType = 0;
    
    MediaElementPlayer.prototype.buildplaylist = function() {
        this.playlist = [];
        this.playIndex = null;
    };
    
    MediaElementPlayer.prototype.next = function() {
        if(this.playIndex === null) {
            return;
        }
        
        if(playType === 0) {
            if(this.playIndex === this.playlist.length - 1) {
                return;
            }
            
            this.playIndex++;
        }
        else if(playType === 1) {
            this.playIndex = (this.playIndex + 1) % this.playlist.length;
        }
        else {
            this.playIndex = Math.floor(Math.random() * this.playlist.length);
        }
        
        this.setSrc(this.playlist[this.playIndex]);
    };
    
    MediaElementPlayer.prototype.previous = function() {
        if(this.playIndex === null) {
            return;
        }
        
        if(playType === 0) {
            if(this.playIndex === 0) {
                return;
            }
            
            playIndex--;
        }
        else if(playType === 1) {
            this.playIndex = (this.playlist.length + this.playIndex - 1) % this.playlist.length;
        }
        else {
            this.playIndex = Math.floor(Math.random() * this.playlist.length);
        }
        
        this.setSrc(this.playlist[this.playIndex]);
    };
    
    MediaElementPlayer.prototype.changePlayType = function() {
        playType = (playType + 1) % 3;
        this.setNotification('Playlist Navigation: ' + playTypes[playType]);
    };
})();
