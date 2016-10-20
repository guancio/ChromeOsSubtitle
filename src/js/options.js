(function() {
    wrnch.extend(MediaElementPlayer.prototype, {
        startVolume: 0.8,
        
        maximumVolume: 2,
        
        muteText: chrome.i18n.getMessage('mute'),
        
        brightness: 1.0,
        
        // features to show
        features: ['contextmenu', 'notification', 'playlist', 'source', 'playpause', 'stopButton', 'progress', 'current', 'duration', 'tracks', 'subdelay', 'subsize', 'volume', 'settings', 'info', 'help', 'fullscreen', 'drop', 'stats', 'opensubtitle', 'autosrt', 'shortcuts', 'thumbnail'],
        
        mediaExts: ['aac', 'mp4', 'm4a', 'mp1', 'mp2', 'mp3', 'mpg', 'mpeg', 'oga', 'ogg', 'wav', 'webm', 'm4v', 'ogv', 'mkv'],
        
        subExts: ['srt', 'sub', 'txt', 'ass', 'dfxp', 'smi'],
        
        success: function() {
            var temp = [],
                mainMediaElement = t = this;
            
            chrome.app.window
                            .get('master')
                            .show();
            
            if(!window.launchData.items || !window.launchData.items.length) {
                t.filterFiles([]);
                t.toggleInfo();
                return;
            }
            
            wrnch.forEachSync(window.launchData.items, function(e, i, next) {
                e.entry.file(function(file) {
                    file.fileEntry = e.entry;
                    temp.push(file);
                    next();
                });
            }, function() {
                t.filterFiles(temp, true);
            });
        },
        
        // array of keyboard actions such as play pause
        keyActions: [
            {
                keys: [
                    32, // SPACE
                    179 // GOOGLE play/pause button
                ],
                action: function(player, activeModifiers) {
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
                action: function(player, activeModifiers) {
                    if(activeModifiers.ctrl && activeModifiers.shift) {
                        player.moveCaptions(38);
                    }
                    else if(activeModifiers.ctrl) {
                        player.setVolume(Math.min(player.getVolume() + 0.1, player.maximumVolume));
                    }
                    else if(activeModifiers.shift) {
                        player.changeBrightness(true);
                    }
                }
            },
            {
                keys: [40], // DOWN
                action: function(player, activeModifiers) {
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
                action: function(player, activeModifiers) {
                    var seekDuration;
                    
                    if(activeModifiers.ctrl && activeModifiers.shift) {
                        player.moveCaptions(37);
                    }
                    else if(player.getSrc()) {
                        seekDuration = (activeModifiers.shift && -3) ||
                                       (activeModifiers.alt && -10) ||
                                       (activeModifiers.ctrl && -60);
                        
                        if(seekDuration) {
                            player.seek(seekDuration);
                        }
                    }
                }
            },
            {
                keys: [
                    39, // RIGHT
                    228 // Google TV forward
                ],
                action: function(player, activeModifiers) {
                    var seekDuration;
                    
                    if(activeModifiers.ctrl && activeModifiers.shift) {
                        player.moveCaptions(39);
                    }
                    else if(player.getSrc()) {
                        seekDuration = (activeModifiers.shift && 3) ||
                                       (activeModifiers.alt && 10) ||
                                       (activeModifiers.ctrl && 60);
                        
                        if(seekDuration) {
                            player.seek(seekDuration);
                        }
                    }
                }
            },
            {
                keys: [70], // f
                action: function(player, activeModifiers) {
                    if(activeModifiers.ctrl) {
                        player.toggleFullscreen();
                    }
                }
            },
            {
                keys: [79], // o
                action: function(player, activeModifiers) {
                    if(activeModifiers.ctrl) {
                        player.openFileForm();
                    }
                }
            },
            {
                keys: [189],  // -
                action: function(player, activeModifiers) {
                    if(activeModifiers.ctrl) {
                        player.changeSubtitleSize(true);
                    }
                }
            },
            {
                keys: [187],  // +
                action: function(player, activeModifiers) {
                    if(activeModifiers.ctrl) {
                        player.changeSubtitleSize();
                    }
                }
            },
            {
                keys: [90],  // z
                action: function(player, activeModifiers) {
                    if(activeModifiers.ctrl) {
                        player.changeSubtitleDelay(true);
                    }
                }
            },
            {
                keys: [88],  // x
                action: function(player, activeModifiers) {
                    if(activeModifiers.ctrl) {
                        player.changeSubtitleDelay();
                    }
                }
            },
            {
                keys: [190],  // .
                action: function(player, activeModifiers) {
                    if(activeModifiers.ctrl) {
                        player.incPlaybackRate(activeModifiers.shift && 1);
                    }
                    else if(activeModifiers.alt) {
                        player.changeAudioDelay(true);
                    }
                }
            },
            {
                keys: [188],  // ,
                action: function(player, activeModifiers) {
                    if(activeModifiers.ctrl) {
                        player.decPlaybackRate(activeModifiers.shift && 1);
                    }
                    else if(activeModifiers.alt) {
                        player.changeAudioDelay();
                    }
                }
            },
            {
                keys: [191],  // /
                action: function(player, activeModifiers) {
                    if(activeModifiers.ctrl) {
                        player.resetPlaybackRate();
                    }
                }
            },
            {
                keys: [76],  // l
                action: function(player, activeModifiers) {
                    if(activeModifiers.ctrl) {
                        player.toggleLoop();
                    }
                }
            },
            {
                keys: [68], // d
                action: function(player, activeModifiers) {
                    if(activeModifiers.ctrl) {
                        player.openSubtitleLogIn();
                    }
                }
            },
            {
                keys: [65], // a
                action: function(player, activeModifiers) {
                    if(activeModifiers.ctrl) {
                        player.cycleAspectRatio();
                    }
                }
            },
            {
                keys: [73], // i
                action: function(player, activeModifiers) {
                    if(activeModifiers.ctrl) {
                        player.toggleInfo();
                    }
                }
            },
            {
                keys: [72], // h
                action: function(player, activeModifiers) {
                    if(activeModifiers.ctrl) {
                        player.openHelp();
                    }
                }
            },
            {
                keys: [221],  // ]
                action: function(player, activeModifiers) {
                    if(activeModifiers.ctrl) {
                        player.next();
                    }
                }
            },
            {
                keys: [219],  // [
                action: function(player, activeModifiers) {
                    if(activeModifiers.ctrl) {
                        player.previous();
                    }
                }
            },
            {
                keys: [81],  // q
                action: function(player, activeModifiers) {
                    if(activeModifiers.ctrl) {
                        player.cyclePlayType();
                    }
                }
            }
        ]
    });
})();
