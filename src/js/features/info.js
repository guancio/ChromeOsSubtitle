(function($) {
    MediaElementPlayer.prototype.buildinfo = function() {
        var
            t = this;
        var infoText =
            '<div class="mejs-window" style="width: 650px;"><img src="' + mediaelement_url + 'icon.png" style="width:80px;height: auto;"/>' +
            '<h2>Subtitle Videoplayer v1.12.0</h2>' +
            'Plase visit our project <a href="https://github.com/guancio/ChromeOsSubtitle">home page</a>.<br>Changeset in this release (thanks to vivekannan):';
        infoText = infoText + '<ul>';
        infoText = infoText + '<li>Contextmenu for those who hate keyboard shortcuts</li>';
        infoText = infoText + '<li>Major changes in design</li>';
        infoText = infoText + '<li>App is now more efficient resulting in improved battery life</li>';
        infoText = infoText + '</ul>';
        infoText = infoText +
            'This software is possible thank to several open source projects:<ul>' +
            '<li>The main media player component is a fork of <a id="link_mediaelement" href="http://mediaelementjs.com/">MediaelEment.js</a>, developed by John Dyer</li>' +
            '<li>Zip files are opened using <a href="http://gildas-lormeau.github.io/zip.js/" target="_blank">zip.js</a></li>';
        infoText = infoText + '<li>Subtitles service is powered by <a href="http://www.OpenSubtitles.org" target="_blank">www.OpenSubtitles.org</a>. More uploaded subs means more subs available. Please upload <a href="http://www.opensubtitles.org/upload" target="_blank">here</a> jour subs.<br/><a href="http://www.OpenSubtitles.org" target="_blank"><img src="' + mediaelement_url + 'opensubtitle.gif"/></a></li></ul><br>' +
            '[Click the box to close the info page]</div>';
        
        var info = $(infoText).appendTo(t.controls[0].parentElement);
        
        info.find("a").click(function(e) {
            window.open(this.href, '_blank');
            event.stopPropagation();
            return false;
        });
        
        t.toggleInfo = function() {
            info[0].style.visibility = info[0].style.visibility === 'visible' ? 'hidden' : 'visible';
        };

        info.on("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            t.toggleInfo();
            return false;
        });

        var open =
            $('<div class="mejs-button mejs-info-button mejs-info" >' +
                '<button type="button" title="' + mejs.i18n.t('About...') + '" aria-label="' + mejs.i18n.t('About...') + '"></button>' +
                '</div>')
            .appendTo(t.rightControls)
            .click(function(e) {
                e.preventDefault();
                t.toggleInfo();
                return false;
            });
    }
})(mejs.$);
