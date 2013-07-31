var myURL = window.URL || window.webkitURL;

MediaElementPlayer.prototype.buildsubsize = function(player, controls, layers, media) {
    var captionSelector = player.captionsButton.find('.mejs-captions-selector');
    var
    t = this;
    // create the buttons
    var dec =
        $('<div class="mejs-button mejs-reduce-button mejs-reduce" >' +
	  '<button type="button" aria-controls="' + t.id + '" title="' + mejs.i18n.t('Decrease caption size') + '" aria-label="' + mejs.i18n.t('Decrease caption size') + '"></button>' +  '</div>')
	.click(function() {
	    $('.mejs-captions-layer').css({
		"line-height":function( index, value ) {
		    return ( parseFloat( value )/ 1.2) + "px";
		},
		"font-size":function( index, value ) {
		    return ( parseFloat( value )/1.2) + "px";
		}
	    });
	}); 
    var inc = 
	$('<div class="mejs-button mejs-increase-button mejs-increase" >' +
	  '<button type="button" aria-controls="' + t.id + '" title="' + mejs.i18n.t('Increase caption size') + '" aria-label="' + mejs.i18n.t('Increase caption size') + '"></button>' +  '</div>')
	.click(function() {
	    $('.mejs-captions-layer').css({
		"line-height":function( index, value ) {
		    return ( parseFloat( value )* 1.2) + "px";
		},
		"font-size":function( index, value ) {
		    return ( parseFloat( value )*1.2) + "px";
		}
	    });
	});  

    var line =
	$('<li class="mejs-captionsize"></li>')
	.append(dec)
	.append(inc)
	.append($('<label>Caption size</label>'));
    captionSelector.find('ul').prepend(line);
};


(function($) {
    $.extend(MediaElementPlayer.prototype, {
	buildsource: function(player, controls, layers, media) {
	    var 
	    t = this,
	    open  = 
		$('<div class="mejs-button mejs-source-button mejs-source" >' +
		  '<button type="button" aria-controls="' + t.id + '" title="' + mejs.i18n.t('Open video...') + '" aria-label="' + mejs.i18n.t('Open video...') + '"></button>' +
		  '</div>')
		.appendTo(controls)
		.click(function(e) {
		    e.preventDefault();
		    
		    chrome.fileSystem.chooseEntry({type: 'openFile'}, function(theFileEntry) {
			if (theFileEntry == null)
			    return;
			mainMediaElement.stop();
			theFileEntry.file(function fff(file) {
			    var path = window.URL.createObjectURL(file);
			    mainMediaElement.setSrc(path);
			});
		    });
		    return false;
		});
	}
    });
})(mejs.$);



var myURL = window.URL || window.webkitURL;

var mainMediaElement = null;

$('#main').append('<video width="1024" height="590" id="player" controls="controls"></video>');
$('#player').mediaelementplayer({
    startLanguage:'en',
    isVideo:true,
    hideCaptionsButtonWhenEmpty:false,
    mode:"native",
    features: ['source', 'playpause','progress','current','duration', 'tracks','subsize','volume','fullscreen'],
    success: function (mediaElement, domObject) { 
	mainMediaElement = mediaElement;
    }
});
