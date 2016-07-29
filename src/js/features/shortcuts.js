(function($) {
    MediaElementPlayer.prototype.buildshortcuts = function() {
        var t = this;
        
        // listen for key presses
        t.globalBind('keydown', function(e) {
            // find a matching key
            for(var i = 0, il = t.options.keyActions.length; i < il; i++) {
                var keyAction = t.options.keyActions[i];
                
                for(var j = 0, jl = keyAction.keys.length; j < jl; j++) {
                    if(e.keyCode === keyAction.keys[j]) {
                        e.preventDefault();
                        keyAction.action(t, e.keyCode, { 'shift': e.shiftKey, 'alt': e.altKey, 'ctrl': e.ctrlKey });
                        return false;
                    }
                }
            }
            
            return true;
        });
    }
})(mejs.$);