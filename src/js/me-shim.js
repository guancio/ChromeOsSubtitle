/*
Default options
*/
mejs.MediaElementDefaults = {
    // overrides the type specified, useful for dynamic instantiation
    type: ''
};

/*
Determines if a browser supports the <video> or <audio> element
and returns either the native element or a Flash/Silverlight version that
mimics HTML5 MediaElement
*/
mejs.MediaElement = function(el, o) {
    return mejs.HtmlMediaElementShim.create(el, o);
};

mejs.HtmlMediaElementShim = {
    create: function(el, o) {
        var
            options = mejs.MediaElementDefaults,
            htmlMediaElement = (typeof(el) == 'string') ? document.getElementById(el) : el,
            tagName = htmlMediaElement.tagName.toLowerCase(),
            isMediaTag = (tagName === 'audio' || tagName === 'video'),
            src = (isMediaTag) ? htmlMediaElement.getAttribute('src') : htmlMediaElement.getAttribute('href'),
            poster = htmlMediaElement.getAttribute('poster'),
            autoplay = htmlMediaElement.getAttribute('autoplay'),
            preload = htmlMediaElement.getAttribute('preload'),
            controls = htmlMediaElement.getAttribute('controls'),
            playback,
            prop;
        
        // extend options
        for(prop in o) {
            options[prop] = o[prop];
        }
        
        // clean up attributes
        src = (typeof src == 'undefined' || src === null || src == '') ? null : src;
        poster = (typeof poster == 'undefined' || poster === null) ? '' : poster;
        preload = (typeof preload == 'undefined' || preload === null || preload === 'false') ? 'none' : preload;
        autoplay = !(typeof autoplay == 'undefined' || autoplay === null || autoplay === 'false');
        controls = !(typeof controls == 'undefined' || controls === null || controls === 'false');
        
        // test for HTML5 and plugin capabilities
        playback = this.determinePlayback(htmlMediaElement, options, isMediaTag, src);
        playback.url = (playback.url !== null) ? mejs.Utility.absolutizeUrl(playback.url) : '';
        
        // second fix for android
        if(mejs.MediaFeatures.isBustedAndroid) {
            htmlMediaElement.src = playback.url;
            htmlMediaElement.addEventListener('click', function() {
                htmlMediaElement.play();
            }, false);
        }
        // add methods to native HTMLMediaElement
        
        return this.updateNative(playback, options, autoplay, preload);
    },
    
    determinePlayback: function(htmlMediaElement, options, isMediaTag, src) {
        var
            mediaFiles = [],
            i,
            j,
            k,
            l,
            n,
            type,
            result = {
                method: '',
                url: '',
                htmlMediaElement: htmlMediaElement,
                isVideo: (htmlMediaElement.tagName.toLowerCase() != 'audio')
            },
            pluginName,
            pluginVersions,
            pluginInfo,
            dummy,
            media;
        
        // STEP 1: Get URL and type from <video src> or <source src>
        
        // supplied type overrides <video type> and <source type>
        if(typeof options.type != 'undefined' && options.type !== '') {
            // accept either string or array of types
            if(typeof options.type == 'string') {
                mediaFiles.push({
                    type: options.type,
                    url: src
                });
            } else {
                for(i = 0; i < options.type.length; i++) {
                    mediaFiles.push({
                        type: options.type[i],
                        url: src
                    });
                }
            }
            // test for src attribute first
        } else if(src !== null) {
            type = this.formatType(src, htmlMediaElement.getAttribute('type'));
            mediaFiles.push({
                type: type,
                url: src
            });
            // then test for <source> elements
        } else {
            // test <source> types to see if they are usable
            for(i = 0; i < htmlMediaElement.childNodes.length; i++) {
                n = htmlMediaElement.childNodes[i];
                if(n.nodeType == 1 && n.tagName.toLowerCase() == 'source') {
                    src = n.getAttribute('src');
                    type = this.formatType(src, n.getAttribute('type'));
                    media = n.getAttribute('media');
                    
                    if(!media || !window.matchMedia || (window.matchMedia && window.matchMedia(media).matches)) {
                        mediaFiles.push({
                            type: type,
                            url: src
                        });
                    }
                }
            }
        }
        
        // in the case of dynamicly created players
        // check for audio types
        if(!isMediaTag && mediaFiles.length > 0 && mediaFiles[0].url !== null && this.getTypeFromFile(mediaFiles[0].url).indexOf('audio') > -1) {
            result.isVideo = false;
        }
        
        // STEP 2: Test for playback method
        
        // special case for Android which sadly doesn't implement the canPlayType function (always returns '')
        if(mejs.MediaFeatures.isBustedAndroid) {
            htmlMediaElement.canPlayType = function(type) {
                return(type.match(/video\/(mp4|m4v)/gi) !== null) ? 'maybe' : '';
            };
        }
        
        // test for native playback first
        if(options.mode === 'auto' || options.mode === 'auto_plugin' || options.mode === 'native') {
            if(!isMediaTag) {
                // create a real HTML5 Media Element 
                dummy = document.createElement(result.isVideo ? 'video' : 'audio');
                htmlMediaElement.parentNode.insertBefore(dummy, htmlMediaElement);
                htmlMediaElement.style.display = 'none';
                
                // use this one from now on
                result.htmlMediaElement = htmlMediaElement = dummy;
            }
            
            for(i = 0; i < mediaFiles.length; i++) {
                // normal check
                if(htmlMediaElement.canPlayType(mediaFiles[i].type).replace(/no/, '') !== ''
                    // special case for Mac/Safari 5.0.3 which answers '' to canPlayType('audio/mp3') but 'maybe' to canPlayType('audio/mpeg')
                    ||
                    htmlMediaElement.canPlayType(mediaFiles[i].type.replace(/mp3/, 'mpeg')).replace(/no/, '') !== '') {
                    result.method = 'native';
                    result.url = mediaFiles[i].url;
                    break;
                }
            }
            if(mediaFiles.length == 0) {
                result.method = 'native';
            }
            
            if(result.method === 'native') {
                if(result.url !== null) {
                    htmlMediaElement.src = result.url;
                }
                
                // if `auto_plugin` mode, then cache the native result but try plugins.
                if(options.mode !== 'auto_plugin') {
                    return result;
                }
            }
        }
        
        // what if there's nothing to play? just grab the first available
        if(result.method === '' && mediaFiles.length > 0) {
            result.url = mediaFiles[0].url;
        }
        
        return result;
    },
    
    formatType: function(url, type) {
        var ext;
        
        // if no type is supplied, fake it with the extension
        if(url && !type) {
            return this.getTypeFromFile(url);
        } else {
            // only return the mime part of the type in case the attribute contains the codec
            // see http://www.whatwg.org/specs/web-apps/current-work/multipage/video.html#the-source-element
            // `video/mp4; codecs="avc1.42E01E, mp4a.40.2"` becomes `video/mp4`
            
            if(type && ~type.indexOf(';')) {
                return type.substr(0, type.indexOf(';'));
            } else {
                return type;
            }
        }
    },
    
    getTypeFromFile: function(url) {
        url = url.split('?')[0];
        var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
        return(/(mp4|m4v|ogg|ogv|webm|webmv|flv|wmv|mpeg|mov)/gi.test(ext) ? 'video' : 'audio') + '/' + this.getTypeFromExtension(ext);
    },
    
    getTypeFromExtension: function(ext) {
        switch(ext) {
            case 'mp4':
            case 'm4v':
                return 'mp4';
            case 'webm':
            case 'webma':
            case 'webmv':
                return 'webm';
            case 'ogg':
            case 'oga':
            case 'ogv':
                return 'ogg';
            default:
                return ext;
        }
    },
    
    updateNative: function(playback, options, autoplay, preload) {
        var htmlMediaElement = playback.htmlMediaElement,
            m;
        
        // add methods to video object to bring it into parity with Flash Object
        for(m in mejs.HtmlMediaElement) {
            htmlMediaElement[m] = mejs.HtmlMediaElement[m];
        }
        
        // fire success code
        options.success(htmlMediaElement, htmlMediaElement);
        
        return htmlMediaElement;
    }
};

window.mejs = mejs;
window.MediaElement = mejs.MediaElement;