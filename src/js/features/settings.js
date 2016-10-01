(function() {
    MediaElementPlayer.prototype.settings = function() {
        var t = this;
        
        $('<div class="mejs-button mejs-settings-button mejs-settings" >' +
                '<button type="button" title="' + mejs.i18n.t('Settings') + '" aria-label="' + mejs.i18n.t('Settings') + '"></button>' +
                '<div class="mejs-settings-selector skip">' +
                '<ul id="settings_list"></ul>' +
                '</div>' +
            '</div>').appendTo(t.rightControls);
    };
})();
