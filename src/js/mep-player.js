var packaged_app = (window.location.origin.indexOf("chrome-extension") == 0);

(function($) {
    // wraps a MediaElement object in player controls
    mejs.MediaElementPlayer = function(node, o) {
        // enforce object, even without "new" (via John Resig)
        if(!(this instanceof mejs.MediaElementPlayer)) {
            return new mejs.MediaElementPlayer(node, o);
        }
        
        var t = this;
        
        // these will be reset after the MediaElement.success fires
        t.$media = t.$node = $(node);
        t.node = t.media = t.$media[0];
        
        // check for existing player
        if(typeof t.node.player != 'undefined') {
            return t.node.player;
        } else {
            // attach player to DOM node for reference
            t.node.player = t;
        }
        
        // try to get options from data-mejsoptions
        if(typeof o == 'undefined') {
            o = t.$node.data('mejsoptions');
        }
        
        // extend default options
        t.options = $.extend({}, mejs.MepDefaults, o);
        
        // start up
        t.init();
        
        return t;
    };
    
    // actual player
    mejs.MediaElementPlayer.prototype = {
        controlsAreVisible: true,
        
        init: function() {
            var t = this,
                mf = mejs.MediaFeatures,
                // options for MediaElement (shim)
                meOptions = $.extend(true, {}, t.options, {
                    success: function(media, domNode) {
                        t.meReady(media, domNode);
                    },
                    error: function(e) {
                        t.handleError(e);
                    }
                }),
                tagName = t.media.tagName.toLowerCase();
                
            t.isDynamic = (tagName !== 'audio' && tagName !== 'video');
            
            if(t.isDynamic) {
                // get video from src or href?
                t.isVideo = t.options.isVideo;
            } else {
                t.isVideo = (tagName !== 'audio' && t.options.isVideo);
            }
            
            // use native controls in Android	
            if(mf.isAndroid && t.options.AndroidUseNativeControls) {
                // leave default player
                
            } else {
                // DESKTOP: use MediaElementPlayer controls
                
                // remove native controls
                t.media.controls = false;
                
                // build container
                t.container =
                    $('<div class="mejs-container svg">' +
                        '<div class="mejs-inner">' +
                            '<div class="mejs-mediaelement"></div>' +
                            '<div class="mejs-layers"></div>' +
                            '<div class="mejs-controls"></div>' +
                            '<div class="mejs-clear"></div>' +
                        '</div>' +
                    '</div>')
                    .addClass(t.media.className)
                    .insertBefore(t.$media);
                    
                // add classes for user and content
                t.container.addClass(
                    (mf.isAndroid ? 'mejs-android ' : '') +
                    (t.isVideo ? 'mejs-video ' : 'mejs-audio ')
                );
                
                // move the <video/video> tag into the right spot
                t.container.find('.mejs-mediaelement').append(t.$media);
                
                // find parts
                t.controls = t.container.find('.mejs-controls');
                t.layers = t.container.find('.mejs-layers');
                
                // determine the size
                
                /* size priority:
                   (1) videoWidth (forced), 
                   (2) style="width;height;"
                   (3) width attribute,
                   (4) defaultVideoWidth (for unspecified cases)
                */
                
                var tagType = (t.isVideo ? 'video' : 'audio'),
                    capsTagName = tagType.substring(0, 1).toUpperCase() + tagType.substring(1);
                
                if(t.options[tagType + 'Width'] > 0 || t.options[tagType + 'Width'].toString().indexOf('%') > -1) {
                    t.width = t.options[tagType + 'Width'];
                } else if(t.media.style.width !== '' && t.media.style.width !== null) {
                    t.width = t.media.style.width;
                } else if(t.media.getAttribute('width') !== null) {
                    t.width = t.$media.attr('width');
                } else {
                    t.width = t.options['default' + capsTagName + 'Width'];
                }
                
                if(t.options[tagType + 'Height'] > 0 || t.options[tagType + 'Height'].toString().indexOf('%') > -1) {
                    t.height = t.options[tagType + 'Height'];
                } else if(t.media.style.height !== '' && t.media.style.height !== null) {
                    t.height = t.media.style.height;
                } else if(t.$media[0].getAttribute('height') !== null) {
                    t.height = t.$media.attr('height');
                } else {
                    t.height = t.options['default' + capsTagName + 'Height'];
                }
                
                // create MediaElementShim
                meOptions.pluginWidth = t.height;
                meOptions.pluginHeight = t.width;
            }
            
            // create MediaElement shim
            mejs.MediaElement(t.$media[0], meOptions);
            
            if(typeof(t.container) != 'undefined') {
                // controls are shown when loaded
                t.container.trigger('controlsshown');
            }
        },
        
        showControls: function() {
            var t = this;
            
            if(t.controlsAreVisible)
                return;
            
            t.controls
                .css('visibility', 'visible')
                .stop(true, true).fadeIn(200, function() {
                    t.controlsAreVisible = true;
                    t.container.trigger('controlsshown');
                });
                
            // any additional controls people might add and want to hide
            t.container.find('.mejs-control')
                .css('visibility', 'visible')
                .stop(true, true).fadeIn(200, function() {
                    t.controlsAreVisible = true;
                });
            
            t.setControlsSize();
        },
        
        hideControls: function() {
            var t = this;
            
            if(!t.controlsAreVisible)
                return;
            
            // fade out main controls
            t.controls.stop(true, true).fadeOut(200, function() {
                $(this)
                    .css('visibility', 'hidden')
                    .css('display', 'block');
                    
                t.controlsAreVisible = false;
                t.container.trigger('controlshidden');
            });
            
            // any additional controls people might add and want to hide
            t.container.find('.mejs-control').stop(true, true).fadeOut(200, function() {
                $(this)
                    .css('visibility', 'hidden')
                    .css('display', 'block');
            });
        },
        
        controlsTimer: null,
        
        startControlsTimer: function(timeout) {
            var t = this;
            
            timeout = timeout || 1500;
            
            t.killControlsTimer('start');
            
            t.controlsTimer = setTimeout(function() {
                //console.log('timer fired');
                t.hideControls();
                t.killControlsTimer('hide');
            }, timeout);
        },
        
        killControlsTimer: function(src) {
            var t = this;
            
            if(t.controlsTimer !== null) {
                clearTimeout(t.controlsTimer);
                delete t.controlsTimer;
                t.controlsTimer = null;
            }
        },
        
        // Sets up all controls and events
        meReady: function(media, domNode) {
            var t = this,
                mf = mejs.MediaFeatures,
                autoplayAttr = domNode.getAttribute('autoplay'),
                autoplay = !(typeof autoplayAttr == 'undefined' || autoplayAttr === null || autoplayAttr === 'false'),
                featureIndex,
                feature;
                
            // make sure it can't create itself again if a plugin reloads
            if(t.created)
                return;
            else
                t.created = true;
            
            t.media = media;
            t.domNode = domNode;
            
            if(!(mf.isAndroid && t.options.AndroidUseNativeControls)) {
                // built in feature
                t.buildoverlays(t, t.controls, t.layers, t.media);
                
                // grab for use by features
                t.findTracks();
                
                // add user-defined features/controls
                for(featureIndex in t.options.features) {
                    feature = t.options.features[featureIndex];
                    if(t['build' + feature]) {
                        try {
                            t['build' + feature](t, t.controls, t.layers, t.media);
                            console.log('Loaded:', feature);
                        } catch(e) {
                            // TODO: report control error
                            //throw e;
                            //console.log('error building ' + feature);
                            console.log('Load Failed:', feature);
                            console.log(e);
                        }
                    }
                }
                
                t.container.trigger('controlsready');
                
                // reset all layers and controls
                t.setControlsSize();
                
                // controls fade
                if(t.isVideo) {
                    if(mejs.MediaFeatures.hasTouch) {
                        // for touch devices (iOS, Android)
                        // show/hide without animation on touch
                        
                        t.$media.bind('touchstart', function() {
                            // toggle controls
                            if(t.controlsAreVisible) {
                                t.hideControls(false);
                            } else {
                                t.showControls(false);
                            }
                        });
                    } else {
                        // show/hide controls
                        t.container
                            .bind('mouseenter mouseover', function() {
                                if(!t.options.alwaysShowControls) {
                                    t.killControlsTimer('enter');
                                    t.showControls();
                                    t.startControlsTimer(2500);
                                }
                            })
                            .bind('mousemove', function() {
                                if(!t.controlsAreVisible) {
                                    t.showControls();
                                }
                                //t.killControlsTimer('move');
                                if(!t.options.alwaysShowControls) {
                                    t.startControlsTimer(2500);
                                }
                            })
                            .bind('mouseleave', function() {
                                if(!t.isPaused() && !t.options.alwaysShowControls) {
                                    t.startControlsTimer(1000);
                                }
                            });
                    }
                    
                    // check for autoplay
                    if(autoplay && !t.options.alwaysShowControls) {
                        t.hideControls();
                    }
                    
                    // resizer
                    if(t.options.enableAutosize) {
                        t.media.addEventListener('loadedmetadata', function(e) {
                            // if the <video height> was not set and the options.videoHeight was not set
                            // then resize to the real dimensions
                            if(t.options.videoHeight <= 0 && t.domNode.getAttribute('height') === null && !isNaN(e.target.videoHeight)) {
                                t.setControlsSize();
                            }
                        }, false);
                    }
                }
                
                // EVENTS
                
                // ended for all
                t.media.addEventListener('ended', function(e) {
                    if(t.options.autoRewind) {
                        try {
                            t.setCurrentTime(0);
                        } catch(exp) {
                        
                        }
                    }
                    t.pause();
                    
                    if(t.setProgressRail)
                        t.setProgressRail();
                    if(t.setCurrentRail)
                        t.setCurrentRail();
                        
                    if(t.options.loop) {
                        t.play();
                    } else if(!t.options.alwaysShowControls) {
                        t.showControls();
                    }
                }, false);
                
                // resize on the first play
                t.media.addEventListener('loadedmetadata', function(e) {
                    t.updateDuration();
                    t.updateCurrent();
                    
                    if(!t.isFullScreen) {
                        t.setControlsSize();
                    }
                }, false);
                
                // webkit has trouble doing this without a delay
                setTimeout(function() {
                    t.setControlsSize();
                }, 50);
                
                // adjust controls whenever window sizes (used to be in fullscreen only)
                t.globalBind('resize', function() {
                    // always adjust controls
                    t.setControlsSize();
                    t.resizeVideo();
                });
            }
            
            if(t.options.success) {
                if(typeof t.options.success == 'string') {
                    window[t.options.success](t.media, t.domNode, t);
                } else {
                    t.options.success(t.media, t.domNode, t);
                }
            }
        },
        
        setControlsSize: function() {
            var t = this,
                usedWidth = 0,
                railWidth = 0,
                rail = t.controls.find('.mejs-time-rail'),
                total = t.controls.find('.mejs-time-total'),
                current = t.controls.find('.mejs-time-current'),
                loaded = t.controls.find('.mejs-time-loaded'),
                others = rail.siblings();
                
            // allow the size to come from custom CSS
            if(t.options && !t.options.autosizeProgress) {
                // Also, frontends devs can be more flexible 
                // due the opportunity of absolute positioning.
                railWidth = parseInt(rail.style.width);
            }
            
            // attempt to autosize
            if(railWidth === 0 || !railWidth) {
                // find the size of all the other controls besides the rail
                others.each(function() {
                    var $this = $(this);
                    if(this.style.position != 'absolute' && $this.is(':visible')) {
                        usedWidth += $(this).outerWidth(true);
                    }
                });
                
                // fit the rail into the remaining space
                railWidth = t.controls.width() - usedWidth - (rail.outerWidth(true) - rail.width()) - 1;
            }
            
            // outer area
            rail.width(railWidth);
            // dark space
            total.width(railWidth - (total.outerWidth(true) - total.width()));
            
            if(t.setProgressRail)
                t.setProgressRail();
            if(t.setCurrentRail)
                t.setCurrentRail();
        },
        
        buildoverlays: function() {
            var t = this;
            
            if(!t.isVideo)
                return;
            
            var loading =
                $('<div class="mejs-overlay mejs-layer">' +
                    '<div class="mejs-overlay-loading">' +
                        '<div class="sk-circle">' +
                            '<div class="sk-circle1"></div><div class="sk-circle2"></div><div class="sk-circle3"></div><div class="sk-circle4"></div><div class="sk-circle5"></div><div class="sk-circle6"></div><div class="sk-circle7"></div><div class="sk-circle8"></div><div class="sk-circle9"></div><div class="sk-circle10"></div><div class="sk-circle11"></div><div class="sk-circle12"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>')
                .hide() // start out hidden
                .appendTo(t.layers);
            
            // this needs to come last so it's on top
            $('<div class="mejs-overlay mejs-layer mejs-overlay-play"></div>')
                .appendTo(t.layers)
                .click(function() {
                    if(t.isPaused()) {
                        t.play();
                    } else {
                        t.pause();
                    }
                });
            
            // show/hide big play button
            t.media.addEventListener('play', function() {
                loading.hide();
                t.controls.find('.mejs-time-buffering').hide();
            }, false);
            
            t.media.addEventListener('playing', function() {
                loading.hide();
                t.controls.find('.mejs-time-buffering').hide();
            }, false);
            
            t.media.addEventListener('seeking', function() {
                loading.show();
                t.controls.find('.mejs-time-buffering').show();
                
                t.showControls();
                t.startControlsTimer();
            }, false);
            
            t.media.addEventListener('seeked', function() {
                loading.hide();
                t.controls.find('.mejs-time-buffering').hide();
            }, false);
            
            t.media.addEventListener('waiting', function() {
                loading.show();
                t.controls.find('.mejs-time-buffering').show();
            }, false);
            
            // show/hide loading
            t.media.addEventListener('loadeddata', function() {
                loading.show();
                t.controls.find('.mejs-time-buffering').show();
                t.play();
                t.resizeVideo();
            }, false);
            
            t.media.addEventListener('canplay', function() {
                loading.hide();
                t.controls.find('.mejs-time-buffering').hide();
            }, false);
            
            // error handling
            t.media.addEventListener('error', function(e) {
                if(t.getSrc() === '')
                    return;
                
                loading.hide();
                t.controls.find('.mejs-time-buffering').hide();
                t.setNotification('Cannot play the given file!', 3000);
            }, false);
        },
        
        findTracks: function() {
            var t = this,
                tracktags = t.$media.find('track');
            
            // store for use by plugins
            t.tracks = [];
            tracktags.each(function(index, track) {
                track = $(track);
                
                t.tracks.push({
                    srclang: (track.attr('srclang')) ? track.attr('srclang').toLowerCase() : '',
                    src: track.attr('src'),
                    kind: track.attr('kind'),
                    label: track.attr('label') || '',
                    entries: [],
                    isLoaded: false
                });
            });
        },
        
        changeSkin: function(className) {
            this.container[0].className = 'mejs-container ' + className;
            this.setControlsSize();
        },
        
        isEnded: function() {
            return this.media.ended;
        },
        
        isPaused: function() {
            return this.media.paused;
        },
        
        play: function() {
            if(this.media.readyState === 0) {
                this.openFileForm();
                return;
            }
            
            this.setNotification('▶');
            $('.mejs-play').removeClass('mejs-play').addClass('mejs-pause');
            this.media.play();
        },
        
        pause: function() {
            this.setNotification('￰⏸');
            $('.mejs-pause').removeClass('mejs-pause').addClass('mejs-play');
            this.media.pause();
        },
        
        stop: function() {
            this.setNotification('￰■');
            
            if(!this.isPaused()) {
                this.media.pause();
                $('.mejs-pause').removeClass('mejs-pause').addClass('mejs-play');
            }
            
            this.setCurrentTime(0);
        },
        
        load: function() {
            this.media.load();
        },
        
        isMuted: function() {
            return this.media.muted;
        },
        
        setMuted: function(muted) {
            this.media.muted = muted;
        },
        
        getDuration: function() {
            return this.media.duration;
        },
        
        setCurrentTime: function(time) {
            this.media.currentTime = time;
        },
        
        seek: function(duration) {
            this.setNotification('Seeking ' + duration + 's.');
            this.setCurrentTime(Math.max(0, Math.min(this.getCurrentTime() + duration, this.getDuration())))
        },
        
        getCurrentTime: function() {
            return this.media.currentTime;
        },
        
        setVolume: function(volume) {
            this.media.volume = volume;
        },
        
        getVolume: function() {
            return this.media.volume;
        },
        
        setSrc: function(src) {
            this.media.src = src;
            document.title = this.openedFile.name;
        },
        
        getSrc: function() {
            return this.media.currentSrc;
        },
        
        resetPlaybackRate: function() {
            this.media.playbackRate = 1.0;
            this.setNotification('Playback Rate: x1.00');
        },
        
        incPlaybackRate: function() {
            this.media.playbackRate += 0.05;
            this.setNotification('Playback Rate: x' + this.media.playbackRate.toPrecision(3));
        },
        
        decPlaybackRate: function() {
            this.media.playbackRate = Math.max(0.05, this.media.playbackRate - 0.05);
            this.setNotification('Playback Rate: x' + this.media.playbackRate.toPrecision(3));
        },
        
        toggleLoop: function() {
            this.media.loop = !this.media.loop;
            this.setNotification('Loop O' + (this.media.loop ? 'n.' : 'ff.'));
        },
        
        currentAspectRatio: 0,
        
        resizeVideo: function() {
            var targetAspectRatio,
                wH = window.innerHeight,
                wW = window.innerWidth;
            
            if(this.currentAspectRatio === 0) {
                targetAspectRatio = this.media.videoWidth / this.media.videoHeight;
            }
            
            else {
                targetAspectRatio = this.options.aspectRatios[this.currentAspectRatio];
            }
            
            if(wH * targetAspectRatio <= wW) {
                //$(this.media).css('-webkit-transform', 'scale(' + (wH * targetAspectRatio) / this.media.videoWidth + ',' + wH / this.media.videoHeight + ')');
                this.media.style.width = wH * targetAspectRatio;
                this.media.style.height = wH;
            }
            else {
                //$(this.media).css('-webkit-transform', 'scale(' + wW / this.media.videoWidth + ',' + wW / (targetAspectRatio * this.media.videoHeight) + ')');
                this.media.style.width = wW;
                this.media.style.height = wW / targetAspectRatio;
            }
        },
        
        changeAspectRatio: function() {
            this.currentAspectRatio = (this.currentAspectRatio + 1) % this.options.aspectRatios.length;
            this.resizeVideo();
            this.setNotification('Aspect Ratio: ' + this.options.aspectRatiosText[this.currentAspectRatio]);
        },
        
        moveCaptions: function(keyCode) {
            var c = document.getElementsByClassName('mejs-captions-position')[0];
            
            switch(keyCode) {
                case 37:
                    c.style.left = mejs.Utility.addToPixel(c.style.left, -8);
                    break;
                case 38:
                    c.style.bottom = mejs.Utility.addToPixel(c.style.bottom, 8);
                    break;
                case 39:
                    c.style.left = mejs.Utility.addToPixel(c.style.left, 8);
                    break;
                case 40:
                    c.style.bottom = mejs.Utility.addToPixel(c.style.bottom, -8);
                    break;
            }
        }
    };
    
    (function() {
        var rwindow = /^((after|before)print|(before)?unload|hashchange|message|o(ff|n)line|page(hide|show)|popstate|resize|storage)\b/;
        
        function splitEvents(events, id) {
            // add player ID as an event namespace so it's easier to unbind them all later
            var ret = {
                d: [],
                w: []
            };
            $.each((events || '').split(' '), function(k, v) {
                ret[rwindow.test(v) ? 'w' : 'd'].push(v + '.' + id);
            });
            ret.d = ret.d.join(' ');
            ret.w = ret.w.join(' ');
            return ret;
        }
        
        mejs.MediaElementPlayer.prototype.globalBind = function(events, data, callback) {
            var t = this;
            events = splitEvents(events, t.id);
            if(events.d) $(document).bind(events.d, data, callback);
            if(events.w) $(window).bind(events.w, data, callback);
        };
        
        mejs.MediaElementPlayer.prototype.globalUnbind = function(events, callback) {
            var t = this;
            events = splitEvents(events, t.id);
            if(events.d) $(document).unbind(events.d, callback);
            if(events.w) $(window).unbind(events.w, callback);
        };
    })();
    
    // turn into jQuery plugin
    if(typeof jQuery != 'undefined') {
        jQuery.fn.mediaelementplayer = function(options) {
            if(options === false) {
                this.each(function() {
                    var player = jQuery(this).data('mediaelementplayer');
                    if(player) {
                        player.remove();
                    }
                    jQuery(this).removeData('mediaelementplayer');
                });
            } else {
                this.each(function() {
                    jQuery(this).data('mediaelementplayer', new mejs.MediaElementPlayer(this, options));
                });
            }
            return this;
        };
    }
    
    document.addEventListener('ready', function() {
        // auto enable using JSON attribute
        $('.mejs-player').mediaelementplayer();
    });
    
    // push out to window
    window.MediaElementPlayer = mejs.MediaElementPlayer;
})(mejs.$);