zip.workerScriptsPath = 'lib/zipjs/WebContent/'
zip.useWebWorkers = packaged_app;

(function($) {
    // add extra default options 
    $.extend(mejs.MepDefaults, {
        tracksText: mejs.i18n.t('Captions/Subtitles')
    });
    
    var encodings = ['utf-8', 'ibm866', 'iso-8859-2', 'iso-8859-3', 'iso-8859-4', 'iso-8859-5', 'iso-8859-6', 'iso-8859-7', 'iso-8859-8', 'iso-8859-10', 'iso-8859-13 ', 'iso-8859-14', 'iso-8859-15', 'iso-8859-16', 'koi8-r', 'koi8-u', 'windows-874', 'windows-1250', 'windows-1251', 'windows-1252', 'windows-1253', 'windows-1254', 'windows-1255', 'windows-1256', 'windows-1257', 'windows-1258', 'gbk', 'gb18030', 'euc-jp', 'iso-2022-jp', 'shift_jis', 'euc-kr'],
        encoding_labels = ['UTF-8', 'ibm866 Cyrillic', 'iso-8859-2 Latin-2', 'iso-8859-3 Latin-3', 'iso-8859-4 Latin-4', 'iso-8859-5 Cyrillic', 'iso-8859-6 Arabic', 'iso-8859-7 Greek', 'iso-8859-8 Hebrew', 'iso-8859-10 Latin-6', 'iso-8859-13 ', 'iso-8859-14', 'iso-8859-15', 'iso-8859-16', 'koi8-r', 'koi8-u', 'windows-874', 'windows-1250', 'windows-1251', 'windows-1252 US-ascii', 'windows-1253', 'windows-1254 Latin-5', 'windows-1255', 'windows-1256 Arabic', 'windows-1257', 'windows-1258', 'gbk Chinese', 'gb18030', 'euc-jp', 'iso-2022-jp', 'shift_jis', 'euc-kr'];
    
    MediaElementPlayer.prototype.tracks = function() {
        var t = this,
            i,
            options = '';
        
        t.subtitles = [];
        t.subIndex = -1;
        
        t.captions = $('<div class="mejs-captions-layer mejs-layer"><div class="mejs-captions-position mejs-captions-position-hover"><span class="mejs-captions-text"></span></div></div>')
            .prependTo(t.layers).hide();
        t.captionsText = t.captions.find('.mejs-captions-text');
        
        var encodingText = '<li id="li_encoding">' +
            '<label style="width:55px;float: left;padding: 4px 0px 0px 5px;">Encoding</label>' +
            '<select style="width:115px" id="encoding-selector">';
        
        for(i = 0; i < encodings.length; i++) {
            encodingText += '<option value="' + i + '">' + encoding_labels[i] + '</option>';
        }
        
        encodingText += '</select></il>';
        
        t.captionsButton = mejs.Utility.createNestedElement('<div class="mejs-button mejs-captions-button mejs-captions-enabled">' +
                '<button type="button" title="' + t.options.tracksText + '" aria-label="' + t.options.tracksText + '"></button>' +
                '<div class="mejs-captions-selector skip">' +
                '<ul>' +
                '<li class="mejs-captionload">' +
                '<div class="mejs-button  mejs-captionload" >' +
                '<button type="button" title="' + mejs.i18n.t('Load subtitle...') + '" aria-label="' + mejs.i18n.t('Load subtitle...') + '"></button>' +
                '</div>' +
                '<select id="select_sub" style="padding: 0px 0px 0px 0px;text-overflow: ellipsis;width:150px;height: 18px;overflow: hidden;white-space: nowrap;left:40px;position:absolute;">' +
                    '<option value="-1">None</option>' +
                '</select>' +
                '</li>' +
                encodingText +
                '</ul>' +
                '</div>' +
                '</div>');
        
        t.rightControls[0].appendChild(t.captionsButton);
        t.captionEncodingSelect = document.getElementById('encoding-selector');
        
        mejs.Utility.getFromSettings('default_encoding', 6, function(value) {
            t.captionEncodingSelect.value = value;
        });
        
        t.captionEncodingSelect.addEventListener('change', function(e) {
            $(document).trigger('subtitleEncodingChanged', e.target.value);
            t.setEncoding(e.target.value, true);
        });
        
        document.getElementById('select_sub').addEventListener('change', function(e) {
            t.setSubtitle(e.target.value, true);
        });
        
        t.captionsButton.querySelector('.mejs-captionload button').addEventListener('click', function(e) {
            e.preventDefault();
            
            if(packaged_app) {
                chrome.fileSystem.chooseEntry({
                    type: 'openFile',
                    acceptsMultiple: true,
                    acceptsAllTypes: false,
                    accepts: [
                                {
                                    extensions: t.options.subExts
                                }
                    ]
                }, function(entries) {
                    var temp = [];
                    
                    if(typeof entries === 'undefined') {
                        return;
                    }
                    
                    entries.forEach(function(entry, i) {
                        entry.file(function(file) {
                            temp.push(file);
                            
                            if(i === entries.length - 1) {
                                t.filterFiles(temp);
                            }
                        });
                    });
                });
            }
        });
        
        // move with controls
        t.container
            .bind('controlsshown', function() {
                // push captions above controls
                t.container.find('.mejs-captions-position').addClass('mejs-captions-position-hover');
                
            })
            .bind('controlshidden', function() {
                if(!t.isPaused()) {
                    // move back to normal place
                    t.container.find('.mejs-captions-position').removeClass('mejs-captions-position-hover');
                }
            });
        
        t.media.addEventListener('timeupdate', function(e) {
            t.displaySubtitles();
        }, false);
        
        t.capDelayValue = 0;
    };
    
    MediaElementPlayer.prototype.setEncoding = function(index) {
        mejs.Utility.setIntoSettings('default_encoding', parseInt(index));
        
        //Force subtitles to be re-parsed with new encoding.
        for(var i = 0; i < this.subtitles.length; i++) {
            this.subtitles[i].entries = null;
        }
    };
    
    MediaElementPlayer.prototype.setSubtitle = function(index) {
        if(index !== undefined) {
            this.subIndex = parseInt(index);
            this.captions.hide();
        }
        
        if(this.subIndex !== -1 && this.subtitles[this.subIndex].entries === []) {
            this.notify('The given Subtitle file is corrupted!', 2000);
        }
    };
    
    MediaElementPlayer.prototype.parseSubtitles = function() {
        var t = this,
            current = t.subtitles[t.subIndex],
            reader = new FileReader();
        
        current.entries = [];
        
        reader.onloadend = function(evt) {
            // parse the loaded file
            var d = evt.target.result;
            
            if((/<tt\s+xml/ig).exec(d)) {
                current.entries = mejs.Utility.dfxp(d);
            }
            else if(/\[Script Info\]/.exec(d)) {
                current.entries = mejs.Utility.ass(d);
            }
            else {
                console.log('re parsing...');
                current.entries = mejs.Utility.webvvt(d);
                
            }
        };
        
        reader.onerror = function() {
            t.notify('The given Subtitle file is corrupted!', 2000);
        };
        
        mejs.Utility.getFromSettings('default_encoding', t.captionEncodingSelect.value, function(value) {
            t.captionEncodingSelect.value = value;
            reader.readAsText(current.file, encodings[value]);
        });
    };
    
    MediaElementPlayer.prototype.displaySubtitles = function() {
        var t, entries, currtime, i;
        
        if(this.subIndex === -1 || this.subtitles[this.subIndex].entries === []) {
            return;
        }
        
        if(this.subtitles[this.subIndex].entries === null) {
            return this.parseSubtitles();
        }
        
        t = this;
        entries = t.subtitles[t.subIndex].entries;
        currTime = t.getCurrentTime() - t.capDelayValue;
        
        for(i = 0; i < entries.times.length; i++) {
            if(currTime >= entries.times[i].start && currTime <= entries.times[i].stop) {
                t.captionsText.html(entries.text[i]);
                t.captions.show().height(0);
                return; // exit out if one is visible;
            }
        }
        
        t.captions.hide();
    };
})(mejs.$);
