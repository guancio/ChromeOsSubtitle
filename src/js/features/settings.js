(function($) {
    MediaElementPlayer.prototype.settings = function() {
        var t = this;
        
        t.settings = {};
        
        var settingsPanel = $(
                '<div class="mejs-window" style="width: 356px;">' +
                '<h2>Settings</h2>' +
                '<div><ul id="settings_list" style="list-style-type: none !important;padding-left:0px"></ul></div>' +
                '[Click the box to close the settings]</div>'
            )
            .appendTo(t.controls[0].parentElement);
            
        settingsPanel.keydown(function(e) {
            e.stopPropagation();
            return true;
        });
        
        function hide(e) {
            settingsPanel.css('visibility', 'hidden');
            
            $(document)
                .trigger("settingsClosed");
                
            return false;
        }
        
        settingsPanel.on("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            hide()
            return false;
        });
        
        t.openSettingsWindow = function() {
            $('.mejs-window')
                .css('visibility', 'hidden');
            settingsPanel.css('visibility', 'visible');
        };
    }
    
    MediaElementPlayer.prototype.settingsbutton = function() {
        var t = this,
            open =
            $('<div class="mejs-button mejs-settings-button mejs-settings" >' +
                '<button type="button" title="' + mejs.i18n.t('Settings...') + '" aria-label="' + mejs.i18n.t('Settings...') + '"></button>' +
                '</div>')
            .appendTo(t.rightControls)
            .click(function(e) {
                e.preventDefault();
                t.openSettingsWindow();
                return false;
            });
    }
})(mejs.$);
