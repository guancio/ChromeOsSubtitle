var packaged_app = (window.location.origin.indexOf("chrome-extension") == 0);

(function($) {
    // wraps a MediaElement object in player controls
    mejs.MediaElementPlayer = function(node, o) {
        // enforce object, even without "new" (via John Resig)
        if(!(this instanceof mejs.MediaElementPlayer)) {
            return new mejs.MediaElementPlayer(node, o);
        }
        
        // these will be reset after the MediaElement.success fires
        this.media = node;
        this.media.player = this;
        
        // extend default options
        this.options = $.extend({}, mejs.MepDefaults, o);
        
        // start up
        this.init();
    };
    
    // actual player
    mejs.MediaElementPlayer.prototype = {
        controlsAreVisible: true,
        
        init: function() {
            var t = this;
            
            // DESKTOP: use MediaElementPlayer controls
            // remove native controls
            t.media.controls = false;
            
            // build container
            t.container = $('<div class="mejs-container">' +
                                '<div class="mejs-mediaelement"></div>' +
                                '<div class="mejs-layers"></div>' +
                                '<div class="mejs-controls">' +
                                    '<div id="left" class="skip"></div>' +
                                    '<div id="right" class="skip"></div>' +
                                    '<div id="middle" class="skip"></div>' +
                                '</div>' +
                            '</div>')
                            .insertBefore(t.media);
            
            // move the <video/video> tag into the right spot
            t.container.find('.mejs-mediaelement').append(t.media);
            
            // find parts
            t.controls = t.container.find('.mejs-controls');
            t.leftControls = t.controls.find('#left');
            t.rightControls = t.controls.find('#right');
            t.middleControls = t.controls.find('#middle');
            t.layers = t.container.find('.mejs-layers');
            
            t.meReady();
            
            // controls are shown when loaded
            t.container.trigger('controlsshown');
        },
        
        timeupdate: function() {
            //This function is called by an eventlistener on
            //the <video>. Hence the need for this.player
            this.player.updateCurrent();
            this.player.setCurrentRail();
        },
        
        showControls: function() {
            var t = this;
            
            if(t.controlsAreVisible) {
                return;
            }
            
            t.media.addEventListener('timeupdate', t.timeupdate, false);
            
            t.controls.css('opacity', '1');
            t.controlsAreVisible = true;
            t.container.trigger('controlsshown');
        },
        
        hideControls: function() {
            var t = this;
            
            if(!t.controlsAreVisible) {
                return;
            }
            
            // fade out main controls
            t.controls.css('opacity', '0');
            t.controlsAreVisible = false;
            t.container.trigger('controlshidden');
            
            t.media.removeEventListener('timeupdate', t.timeupdate, false);
        },
        
        controlsTimer: null,
        
        startControlsTimer: function(timeout) {
            var t = this;
            
            if(t.controlsTimer !== null) {
                clearTimeout(t.controlsTimer);
            }
            
            t.controlsTimer = setTimeout(function() {
                t.hideControls();
                t.controlsTimer = null;
            }, timeout || 1500);
        },
        
        // Sets up all controls and events
        meReady: function() {
            var t = this,
                mf = mejs.MediaFeatures,
                featureIndex,
                feature;
            
            // built in feature
            t.buildoverlays();
            
            // add user-defined features/controls
            for(featureIndex in t.options.features) {
                feature = t.options.features[featureIndex];
                if(t['build' + feature]) {
                    try {
                        t['build' + feature]();
                        console.log('Loaded:', feature);
                    } catch(e) {
                        // TODO: report control error
                        console.error('Load Failed:', feature);
                        console.error(e);
                    }
                }
            }
            
            // controls fade
            if('ontouchstart' in window) {
                // for touch devices (iOS, Android)
                // show/hide without animation on touch
                t.media.addEventListener('touchstart', function() {
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
                    .bind('mousemove', function() {
                        if(!t.controlsAreVisible) {
                            t.showControls();
                        }
                        
                        t.startControlsTimer(2500);
                    })
                    .bind('mouseleave', function() {
                        if(!t.isPaused()) {
                            t.startControlsTimer(1000);
                        }
                    });
            }
            
            // EVENTS
            
            // ended for all
            t.media.addEventListener('ended', function(e) {
                t.next();
                
                if(t.isPaused()) {
                    $('.mejs-pause').removeClass('mejs-pause').addClass('mejs-play');
                }
            }, false);
            
            // resize on the first play
            t.media.addEventListener('loadedmetadata', function(e) {
                t.updateDuration();
                t.updateCurrent();
            }, false);
            
            t.options.success(t);
        },
        
        buildoverlays: function() {
            var t = this,
                loading = $('<div class="mejs-overlay mejs-layer">' +
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
                    t.isPaused() ? t.play() : t.pause();
                });
            
            t.media.addEventListener('seeking', function() {
                loading.show();
                t.railBar[0].classList.add('mejs-buffering');
                
                t.showControls();
                t.startControlsTimer();
            }, false);
            
            t.media.addEventListener('seeked', function() {
                loading.hide();
                t.railBar[0].classList.remove('mejs-buffering');
            }, false);
            
            t.media.addEventListener('waiting', function() {
                loading.show();
                t.railBar[0].classList.add('mejs-buffering');
            }, false);
            
            // show/hide loading
            t.media.addEventListener('loadeddata', function() {
                loading.show();
                t.resizeVideo();
                t.railBar[0].classList.add('mejs-buffering');
                t.media.addEventListener('timeupdate', t.timeupdate, false);
                t.play();
            }, false);
            
            t.media.addEventListener('play', function() {
                loading.hide();
                t.railBar[0].classList.remove('mejs-buffering');
            }, false);
            
            // error handling
            t.media.addEventListener('error', function(e) {
                if(t.getSrc() === '')
                    return;
                
                loading.hide();
                t.railBar[0].classList.remove('mejs-buffering');
                t.notify('Cannot play the given file!', 3000);
            }, false);
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
            
            this.notify('▶');
            $('.mejs-play').removeClass('mejs-play').addClass('mejs-pause');
            this.media.play();
        },
        
        pause: function() {
            this.notify('￰⏸');
            $('.mejs-pause').removeClass('mejs-pause').addClass('mejs-play');
            this.media.pause();
        },
        
        stop: function() {
            this.notify('￰■');
            
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
            this.notify('Seeking ' + duration + 's.');
            this.setCurrentTime(Math.max(0, Math.min(this.getCurrentTime() + duration, this.getDuration())))
        },
        
        getCurrentTime: function() {
            return this.media.currentTime;
        },
        
        getVolume: function() {
            return this.gainNode.gain.value > 1 ? this.gainNode.gain.value : this.media.volume;
        },
        
        setVolume: function(volume) {
            if(volume <= 1) {
                this.media.volume = volume;
                this.gainNode.gain.value = 1;
                this.setMuted(volume === 0);
            }
            else {
                this.media.volume = 1;
                this.gainNode.gain.value = volume;
                //trigger volume change event.
                this.media.dispatchEvent(new Event('volumechange'));
            }
            
            this.notify('Volume: ' + (this.getVolume() * 100).toFixed() + '%');
        },
        
        setSrc: function(index) {
            if(this.getDuration()) {
                this.stop();
            }
            
            if(index !== undefined) {
                this.playIndex = parseInt(index)
            }
            
            this.media.src = window.URL.createObjectURL(this.playlist[this.playIndex]);
            document.title = this.playlist[this.playIndex].name;
            
            this.setThumbnailSrc(this.media.src);
        },
        
        getSrc: function() {
            return this.media.currentSrc;
        },
        
        getPlaybackRate: function(value) {
            return this.media.playbackRate;
        },
        
        setPlaybackRate: function(value) {
            this.media.playbackRate = parseFloat(value);
            this.notify('Playback Rate: x' + this.media.playbackRate.toFixed(2));
        },
        
        resetPlaybackRate: function() {
            this.setPlaybackRate(1);
        },
        
        incPlaybackRate: function(amount) {
            this.setPlaybackRate(this.getPlaybackRate() + (amount || 0.05));
        },
        
        decPlaybackRate: function(amount) {
            this.setPlaybackRate(Math.max(0.05, this.getPlaybackRate() - (amount || 0.05)));
        },
        
        toggleLoop: function() {
            this.media.loop = !this.media.loop;
            this.notify('Loop O' + (this.media.loop ? 'n.' : 'ff.'));
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
        },
        
        brightness: 1.0,
        
        changeBrightness: function(inc) {
            this.brightness = Math.min(Math.max(0.5, this.brightness + (inc ? 0.1 : -0.1)), 2);
            this.media.style.webkitFilter = 'brightness(' + this.brightness + ')';
            this.notify('Brightness x' + this.brightness.toFixed(1));
        },
        
        changeAudioDelay: function(inc) {
            this.delayNode.delayTime.value = Math.min(Math.max(0, (this.delayNode.delayTime.value + (inc ? 0.05 : -0.05))), 2);
            this.notify('Audio Delay: ' + (this.delayNode.delayTime.value * 1000).toFixed() + 'ms.');
        },
        
        filterFiles: function(files, overwrite) {
            var i, ext,
                tempPlay = [],
                tempSubs = [],
                t = this;
            
            for(i = 0; i < files.length; i++) {
                ext = files[i].name.split('.').pop().toLowerCase();
                
                if(t.options.mediaExts.indexOf(ext) !== -1) {
                    tempPlay.push(files[i]);
                }
                else if(t.options.subExts.indexOf(ext) !== -1) {
                    tempSubs.push({
                        file: files[i],
                        entries: null
                    });
                }
                else if(ext === 'zip') {
                    mejs.Utility.unzip(files[i], function(entries) {
                        t.filterFiles(entries, false);
                    });
                    
                }
            }
            
            if(tempSubs.length) {
                t.subIndex = t.subtitles.length;
                t.subtitles = t.subtitles.concat(tempSubs);
                
                chrome.contextMenus.remove('setSubtitle', function() {
                    chrome.contextMenus.create({ 'title': 'Select', 'parentId': 'subtitles', 'id': 'setSubtitle' });
                        chrome.contextMenus.create({ 'title': 'None', 'type': 'Select', 'type': 'radio', 'parentId': 'setSubtitle', 'id': 'subNull', 'checked': true });
                        for(i = 0; i < t.subtitles.length; i++) {
                            chrome.contextMenus.create({ 'title': t.subtitles[i].file.name, 'type': 'radio', 'parentId': 'setSubtitle', 'id': i + 's', 'checked': i === t.subIndex });
                        }
                });
            }
            
            if(tempPlay.length) {
                if(overwrite) {
                    t.playlist = tempPlay;
                    t.playIndex = 0;
                }
                else {
                    t.playIndex = t.playlist.length;
                    t.playlist = t.playlist.concat(tempPlay);
                }
                
                chrome.contextMenus.remove('setSrc', function() {
                    chrome.contextMenus.create({ 'title': 'Select', 'parentId': 'playlist', 'id': 'setSrc' });
                        for(i = 0; i < t.playlist.length; i++) {
                            chrome.contextMenus.create({ 'title': t.playlist[i].name, 'type': 'radio', 'parentId': 'setSrc', 'id': i + 'm', 'checked': i === t.playIndex });
                        }
                    
                    t.setSrc();
                });
            }
        }
    };
    
    // push out to window
    window.MediaElementPlayer = mejs.MediaElementPlayer;
})(mejs.$);
