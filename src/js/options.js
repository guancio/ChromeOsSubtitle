(function() {
    mejs.MepDefaults = {
        // initial volume when the player starts (overrided by user cookie)
        startVolume: 0.8,
        
        // features to show
        features: ['contextmenu', 'notification', 'playlist', 'source', 'playpause', 'stopButton', 'progress', 'current', 'duration', 'tracks', 'subdelay', 'subsize', 'volume', 'settings', 'info', 'help', 'fullscreen', 'drop', 'stats', 'opensubtitle', 'autosrt', 'shortcuts', 'thumbnail'],
        
        mediaExts: ['aac', 'mp4', 'm4a', 'mp1', 'mp2', 'mp3', 'mpg', 'mpeg', 'oga', 'ogg', 'wav', 'webm', 'm4v', 'ogv', 'mkv'],
        
        subExts: ['srt', 'sub', 'txt', 'ass', 'dfxp'],
        
        success: function(mediaElement) {
            mainMediaElement = mediaElement;
            chrome.app.window.get('master').show();
            $(document).trigger('appStarted');
            
            var t = mainMediaElement,
                temp = [];
            
            if(!window.launchData || !window.launchData.items || !window.launchData.items.length) {
                t.filterFiles([]);
                t.toggleInfo();
                return;
            }
            
            mejs.Utility.waterfall(window.launchData.items, function(e, i, next) {
                e.entry.file(function(file) {
                    file.fileEntry = e.entry;
                    temp.push(file);
                    
                    if(i === window.launchData.items.length - 1) {
                        t.filterFiles(temp, true);
                    }
                    
                    next();
                });
            });
        },
        
        // array of keyboard actions such as play pause
        keyActions: [
            {
                keys: [
                    32, // SPACE
                    179 // GOOGLE play/pause button
                ],
                action: function(player, keyCode, activeModifiers) {
                    if(player.isPaused() || player.isEnded()) {
                        player.play();
                    }
                    else {
                        player.pause();
                    }
                }
            },
            {
                keys: [38], // UP
                action: function(player, keyCode, activeModifiers) {
                    if(activeModifiers.ctrl && activeModifiers.shift) {
                        player.moveCaptions(38);
                    }
                    else if(activeModifiers.ctrl) {
                        player.setVolume(Math.min(player.getVolume() + 0.1, player.options.maximumVolume));
                    }
                    else if(activeModifiers.shift) {
                        player.changeBrightness(true);
                    }
                }
            },
            {
                keys: [40], // DOWN
                action: function(player, keyCode, activeModifiers) {
                    if(activeModifiers.ctrl && activeModifiers.shift) {
                        player.moveCaptions(40);
                    }
                    else if(activeModifiers.ctrl) {
                        player.setVolume(Math.max(player.getVolume() - 0.1, 0));
                    }
                    else if(activeModifiers.shift) {
                        player.changeBrightness(false);
                    }
                }
            },
            {
                keys: [
                    37, // LEFT
                    227 // Google TV rewind
                ],
                action: function(player, keyCode, activeModifiers) {
                    if(activeModifiers.ctrl && activeModifiers.shift) {
                        player.moveCaptions(37);
                    }
                    else if(player.getSrc()) {
                        var seekDuration = (activeModifiers.shift && -3) ||
                                           (activeModifiers.alt && -10) ||
                                           (activeModifiers.ctrl && -60);
                        
                        if(seekDuration) {
                            player.seek(seekDuration);
                            
                            player.showControls();
                            player.startControlsTimer();
                        }
                    }
                }
            },
            {
                keys: [
                    39, // RIGHT
                    228 // Google TV forward
                ],
                action: function(player, keyCode, activeModifiers) {
                    if(activeModifiers.ctrl && activeModifiers.shift) {
                        player.moveCaptions(39);
                    }
                    else if(player.getSrc()) {
                        var seekDuration = (activeModifiers.shift && 3) ||
                                           (activeModifiers.alt && 10) ||
                                           (activeModifiers.ctrl && 60);
                        
                        if(seekDuration) {
                            player.seek(seekDuration);
                            
                            player.showControls();
                            player.startControlsTimer();
                        }
                    }
                }
            },
            {
                keys: [70], // f
                action: function(player, keyCode, activeModifiers) {
                    if(activeModifiers.ctrl) {
                        player.toggleFullscreen();
                    }
                }
            },
            {
                keys: [79], // o
                action: function(player, keyCode, activeModifiers) {
                    if(activeModifiers.ctrl) {
                        player.openFileForm();
                    }
                }
            },
            {
                keys: [189],  // -
                action: function(player, keyCode, activeModifiers) {
                    if(activeModifiers.ctrl) {
                        player.decCaptionSize();
                    }
                }
            },
            {
                keys: [187],  // +
                action: function(player, keyCode, activeModifiers) {
                    if(activeModifiers.ctrl) {
                        player.incCaptionSize();
                    }
                }
            },
            {
                keys: [90],  // z
                action: function(player, keyCode, activeModifiers) {
                    if(activeModifiers.ctrl) {
                        player.decCaptionDelay();
                    }
                }
            },
            {
                keys: [88],  // x
                action: function(player, keyCode, activeModifiers) {
                    if(activeModifiers.ctrl) {
                        player.incCaptionDelay();
                    }
                }
            },
            {
                keys: [190],  // .
                action: function(player, keyCode, activeModifiers) {
                    if(activeModifiers.ctrl && activeModifiers.shift) {
                        player.incPlaybackRate(1);
                    }
                    else if(activeModifiers.ctrl) {
                        player.incPlaybackRate();
                    }
                    else if(activeModifiers.alt) {
                        player.changeAudioDelay(true);
                    }
                }
            },
            {
                keys: [188],  // ,
                action: function(player, keyCode, activeModifiers) {
                    if(activeModifiers.ctrl && activeModifiers.shift) {
                        player.decPlaybackRate(1);
                    }
                    else if(activeModifiers.ctrl) {
                        player.decPlaybackRate();
                    }
                    else if(activeModifiers.alt) {
                        player.changeAudioDelay(false);
                    }
                }
            },
            {
                keys: [191],  // /
                action: function(player, keyCode, activeModifiers) {
                    if(activeModifiers.ctrl) {
                        player.resetPlaybackRate();
                    }
                }
            },
            {
                keys: [76],  // l
                action: function(player, keyCode, activeModifiers) {
                    if(activeModifiers.ctrl) {
                        player.toggleLoop();
                    }
                }
            },
            {
                keys: [68], // d
                action: function(player, keyCode, activeModifiers) {
                    if(activeModifiers.ctrl) {
                        player.openSubtitleLogIn();
                    }
                }
            },
            {
                keys: [65], // a
                action: function(player, keyCode, activeModifiers) {
                    if(activeModifiers.ctrl) {
                        player.cycleAspectRatio();
                    }
                }
            },
            {
                keys: [73], // i
                action: function(player, keyCode, activeModifiers) {
                    if(activeModifiers.ctrl) {
                        player.toggleInfo();
                    }
                }
            },
            {
                keys: [72], // h
                action: function(player, keyCode, activeModifiers) {
                    if(activeModifiers.ctrl) {
                        player.openHelp();
                    }
                }
            },
            {
                keys: [221],  // ]
                action: function(player, keyCode, activeModifiers) {
                    if(activeModifiers.ctrl) {
                        player.next();
                    }
                }
            },
            {
                keys: [219],  // [
                action: function(player, keyCode, activeModifiers) {
                    if(activeModifiers.ctrl) {
                        player.previous();
                    }
                }
            },
            {
                keys: [81],  // q
                action: function(player, keyCode, activeModifiers) {
                    if(activeModifiers.ctrl) {
                        player.cyclePlayType();
                    }
                }
            }
        ]
    };
})();
