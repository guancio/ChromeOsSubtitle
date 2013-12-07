var packaged_app = (window.location.origin.indexOf("chrome-extension") == 0);

(function($) {
    $.extend(MediaElementPlayer.prototype, {
	buildinfo: function(player, controls, layers, media) {
	    var 
	    t = this;
	    var infoText = 
		'<div class="me-window" style="color:#fff;margin: auto;position: absolute;top: 0; left: 0; bottom: 0; right: 0;width:650px;display: table; height: auto;background: url(background.png);background: rgba(50,50,50,0.7);border: solid 1px transparent;padding: 10px;overflow: hidden;-webkit-border-radius: 0;-moz-border-radius: 0;border-radius: 0;font-size: 16px;visibility: hidden;"><img src="'+mediaelement_url+'icon.png" style="width:80px;height: auto;"/>'+
		    '<h2>Subtitle Videoplayer v1.7.0</h2>' +
		'Plase visit our project <a href="https://github.com/guancio/ChromeOsSubtitle">home page</a>. You can donate to this project via <a href="https://flattr.com/submit/auto?user_id=guancio&url=https://github.com/guancio/ChromeOsSubtitle&title=ChromeOsSubtitle&language=&tags=github&category=software"><img src="'+mediaelement_url+'flattr.png"></a><br>Changeset in this release:';
	    infoText = infoText + '<ul>';
	    infoText = infoText + '<li>Automatically load the subtitle with the same file name of the video <ul>';
	    if (packaged_app)
		infoText = infoText +   '<li>to enable the functionality open the settings window and select the folder (Enable auto-srt) where the VideoPlayer is allowed to search for srt files</li>';
	    else
		infoText = infoText +   '<li>not available in the hosted version</li>';
	    infoText = infoText + ' </ul>';
	    infoText = infoText + '</ul>';


	    infoText = infoText +
		'This software is possible thank to several open source projects:<ul>'+
		'<li>The main madia player component is a fork of <a id="link_mediaelement" href="http://mediaelementjs.com/">MediaelEment.js</a>, developed by John Dyer</li>'+
		'<li>Zip files are opened using <a href="http://gildas-lormeau.github.io/zip.js/" target="_blank">zip.js</a></li>';
	    infoText = infoText + '<li>Subtitles service powered by <a href="http://www.OpenSubtitles.org" target="_blank">www.OpenSubtitles.org</a>. More uploaded subs means more subs available. Please upload <a href="http://www.opensubtitles.org/upload" target="_blank">here</a> jour subs.<br/><a href="http://www.OpenSubtitles.org" target="_blank"><img src="'+mediaelement_url+'opensubtitle.gif"/></a></li>';
	    infoText = infoText + '</ul>[Click the box to close the info window]</div>'

	    var info = $(infoText
	    ).appendTo(controls[0].parentElement);

	    info.find("a").click(function (e) {
		window.open(this.href,'_blank');
		event.stopPropagation();
		return false;
	    });

	    function hideInfo(e) {
		info.css('visibility','hidden');
		if (player.media.paused)
		    $(".mejs-overlay-play").show();
		
		e.preventDefault();
		e.stopPropagation();
		player.container.off("click", hideInfo);
		return false;
	    }

	    t.openInfoWindow = function() {
		$('.me-window').css('visibility','hidden');
		info.css('visibility','visible');
		$(".mejs-overlay-play").hide();
		player.container.click(hideInfo);
	    };

	    var open  = 
		$('<div class="mejs-button mejs-info-button mejs-info" >' +
		  '<button type="button" aria-controls="' + t.id + '" title="' + mejs.i18n.t('About...') + '" aria-label="' + mejs.i18n.t('About...') + '"></button>' +
		  '</div>')
		.appendTo(controls)
		.click(function(e) {
		    e.preventDefault();
		    t.openInfoWindow();
		    return false;
		});
	}
    });
})(mejs.$);

