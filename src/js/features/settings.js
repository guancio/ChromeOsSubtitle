function getFromSettings(name, def_value, cb) {
    if(packaged_app) {
        var obj = {};
        obj[name] = def_value;
        chrome.storage.sync.get(
            obj,
            function(obj) {
                res = obj[name];
                cb(res);
            });
    } else {
        if(localStorage.getItem(name))
            cb(localStorage.getItem(name));
        else
            cb(def_value);
    }
}

function setIntoSettings(name, value, cb) {
    if(packaged_app) {
        var obj = {};
        obj[name] = value;
        chrome.storage.sync.set(
            obj,
            cb);
    } else {
        localStorage.setItem(name, value);
        cb();
    }
}

(function($) {
    MediaElementPlayer.prototype.buildsettings = function() {
        var t = this;
        
        t.settings = {};
        
        var settingsPanel = $(
                '<div class="me-window" style="color:#fff;margin: auto;position: absolute;top: 0; left: 0; bottom: 0; right: 0;width:356px;display: table; height: auto;background: url(background.png);background: rgba(50,50,50,0.7);border: solid 1px transparent;padding: 10px;overflow: hidden;-webkit-border-radius: 0;-moz-border-radius: 0;border-radius: 0;font-size: 16px;visibility: hidden;">' +
                '<h2>Settings</h2>' +
                '<div><ul id="settings_list" style="list-style-type: none !important;padding-left:0px"></ul></div>' +
                '[Click outside the box to close the settings]</div>'
            )
            .appendTo(t.controls[0].parentElement);
            
        settingsPanel.keydown(function(e) {
            e.stopPropagation();
            return true;
        });
        
        function hide(e) {
            settingsPanel.css('visibility', 'hidden');
            
            e.preventDefault();
            e.stopPropagation();
            t.container.off("click", hide);
            
            $(document)
                .trigger("settingsClosed");
                
            return false;
        }
        
        settingsPanel.on("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        });
        
        t.openSettingsWindow = function() {
            $('.me-window')
                .css('visibility', 'hidden');
            settingsPanel.css('visibility', 'visible');
            
            t.container.click(hide);
        };
    }
    
    MediaElementPlayer.prototype.buildsettingsbutton = function() {
        var t = this,
            open =
            $('<div class="mejs-button mejs-settings-button mejs-settings" >' +
                '<button type="button" title="' + mejs.i18n.t('Settings...') + '" aria-label="' + mejs.i18n.t('Settings...') + '"></button>' +
                '</div>')
            .appendTo(t.controls)
            .click(function(e) {
                e.preventDefault();
                t.openSettingsWindow();
                return false;
            });
    }
})(mejs.$);
