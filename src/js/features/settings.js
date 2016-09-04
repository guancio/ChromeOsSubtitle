(function() {
    MediaElementPlayer.prototype.settings = function() {
        var t = this;
        
        t.settings = {};
        
        var settingsPanel = $('<div class="mejs-window" style="width: 356px;">' +
                '<h2>Settings</h2>' +
                '<div><ul id="settings_list" style="list-style-type: none !important;padding-left:0px"></ul></div>' +
                '[Click the box to close the settings]</div>')
                    .appendTo(t.container)
                    .on('keydown', function(e) {
                        e.stopPropagation();
                        return true;
                    })
                    .on("click", function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        t.toggleSettings();
                        return false;
                    });
        
        t.toggleSettings = function() {
            settingsPanel.css('visibility') === 'visible' ? settingsPanel.hide() : settingsPanel.show();
            $(document).trigger("settingsClosed");
        };
        
        $('<div class="mejs-button mejs-settings-button mejs-settings" >' +
                '<button type="button" title="' + mejs.i18n.t('Settings...') + '" aria-label="' + mejs.i18n.t('Settings...') + '"></button>' +
                '</div>')
            .appendTo(t.rightControls)
            .on('click', function(e) {
                e.preventDefault();
                t.toggleSettings();
            });
    }
})();
