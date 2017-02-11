(function() {
    MediaElementPlayer.prototype.shortcuts = function() {
        var t = this,
            keyAction;
        
        // listen for key presses
        $(window).on('keydown', function(e) {
            // find a matching key
            for(var i = 0, il = t.keyActions.length; i < il; i++) {
                keyAction = t.keyActions[i];
                
                for(var j = 0, jl = keyAction.keys.length; j < jl; j++) {
                    if(e.keyCode === keyAction.keys[j]) {
                        e.preventDefault();
                        keyAction.action(t, {
                            shift: e.shiftKey,
                            alt: e.altKey,
                            ctrl: e.ctrlKey
                        });
                    }
                }
            }
        });
    };
})();
