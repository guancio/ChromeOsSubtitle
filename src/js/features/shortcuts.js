(function($) {
    MediaElementPlayer.prototype.buildshortcuts = function(player, controls, layers, media) {
        var t = this;
        
        // listen for key presses
        t.globalBind('keydown', function(e) {
            // find a matching key
            for(var i = 0, il = player.options.keyActions.length; i < il; i++) {
                var keyAction = player.options.keyActions[i];
                
                for(var j = 0, jl = keyAction.keys.length; j < jl; j++) {
                    if(e.keyCode == keyAction.keys[j]) {
                        e.preventDefault();
                        keyAction.action(player, media, e.keyCode, { 'shift': e.shiftKey, 'alt': e.altKey, 'ctrl': e.ctrlKey });
                        return false;
                    }
                }
            }
            
            return true;
        });
    }
})(mejs.$);