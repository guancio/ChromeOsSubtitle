(function() {
    var playTypes = ['Normal', 'Repeat', 'Shuffle'],
        playType = 0;
    
    mejs.Utility.getFromSettings('playType', 0, function(v) {
        playType = v;
    });
    
    MediaElementPlayer.prototype.playlist = function() {
        this.playlist = [];
        this.playIndex = null;
    };
    
    MediaElementPlayer.prototype.next = function(previous) {
        var temp = this.playIndex;
        
        if(this.playIndex === null) {
            return;
        }
        
        if(playType === 0) {
            if((previous && (this.playIndex === 0)) ||
                this.playIndex === this.playlist.length - 1) {
                return;
            }
            
            this.playIndex = this.playIndex + (previous ? -1 : 1);
        }
        else if(playType === 1) {
            this.playIndex = (this.playlist.length + this.playIndex + (previous ? -1 : 1)) % this.playlist.length;
        }
        else {
            this.playIndex = Math.floor(Math.random() * this.playlist.length);
        }
        
        chrome.contextMenus.update(temp + 'm', { 'checked': false });
        chrome.contextMenus.update(this.playIndex + 'm', { 'checked': true });
        this.setSrc();
    };
    
    MediaElementPlayer.prototype.previous = function () {
        this.next(true);
    };
    
    MediaElementPlayer.prototype.setPlayType = function(value) {
        chrome.contextMenus.update(playType + 'p', { 'checked': false });
        
        playType = parseInt(value);
        
        chrome.contextMenus.update(playType + 'p', { 'checked': true });
        
        mejs.Utility.setIntoSettings('playType', playType);
        this.notify('Playlist Navigation: ' + playTypes[playType]);
    };
    
    MediaElementPlayer.prototype.cyclePlayType = function() {
        this.setPlayType((playType + 1) % 3);
    };
})();
