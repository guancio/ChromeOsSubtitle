(function() {
    MediaElementPlayer.prototype.settings = function() {
        var t = this;
        
        $('<div class="mejs-button mejs-settings" >' +
            '<button type="button" title="' + chrome.i18n.getMessage('settings') + '"></button>' +
            '<div class="mejs-settings-selector">' +
            '<ul id="settings_list"></ul>' +
            '</div>' +
        '</div>').appendTo(t.rightControls);
    };
})();
