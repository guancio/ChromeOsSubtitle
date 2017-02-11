zip.workerScriptsPath = 'lib/zipjs/WebContent/';
zip.useWebWorkers = true;

(function() {
    // add extra default options 
    var tracksText = chrome.i18n.getMessage('openSubs');
    
    var timeUpdateHandler = function() {
        //This function is called by an eventlistener on
        //the <video>. Hence the need for this.player
        this.player.displaySubtitles();
    };
    
    var encodings = ['utf-8', 'ibm866', 'iso-8859-2', 'iso-8859-3', 'iso-8859-4', 'iso-8859-5', 'iso-8859-6', 'iso-8859-7', 'iso-8859-8', 'iso-8859-10', 'iso-8859-13 ', 'iso-8859-14', 'iso-8859-15', 'iso-8859-16', 'koi8-r', 'koi8-u', 'windows-874', 'windows-1250', 'windows-1251', 'windows-1252', 'windows-1253', 'windows-1254', 'windows-1255', 'windows-1256', 'windows-1257', 'windows-1258', 'gbk', 'gb18030', 'euc-jp', 'iso-2022-jp', 'shift_jis', 'euc-kr'],
        encoding_labels = ['UTF-8', 'ibm866 Cyrillic', 'iso-8859-2 Latin-2', 'iso-8859-3 Latin-3', 'iso-8859-4 Latin-4', 'iso-8859-5 Cyrillic', 'iso-8859-6 Arabic', 'iso-8859-7 Greek', 'iso-8859-8 Hebrew', 'iso-8859-10 Latin-6', 'iso-8859-13 ', 'iso-8859-14', 'iso-8859-15', 'iso-8859-16', 'koi8-r', 'koi8-u', 'windows-874', 'windows-1250', 'windows-1251', 'windows-1252 US-ascii', 'windows-1253', 'windows-1254 Latin-5', 'windows-1255', 'windows-1256 Arabic', 'windows-1257', 'windows-1258', 'gbk Chinese', 'gb18030', 'euc-jp', 'iso-2022-jp', 'shift_jis', 'euc-kr'];
    
    MediaElementPlayer.prototype.tracks = function() {
        var i,
            t = this,
            options = '';
        
        t.subIndex = -1;
        t.subtitles = [];
        
        t.captions = $('<div class="mejs-captions-layer mejs-layer">' + 
                            '<div class="mejs-captions-position">' + 
                                '<span class="mejs-captions-text"></span>' + 
                            '</div>' + 
                        '</div>').insertBefore(t.controls).hide();
        t.captionsText = t.captions.find('.mejs-captions-text');
        
        var encodingText = '<li id="li_encoding">' +
            '<label style="width:55px;float: left;padding: 4px 0px 0px 5px;">Encoding</label>' +
            '<select style="width:115px" id="encoding-selector">';
        
        for(i = 0; i < encodings.length; i++) {
            encodingText += '<option value="' + i + '">' + encoding_labels[i] + '</option>';
        }
        
        encodingText += '</select></il>';
        
        t.captionsButton = $('<div class="mejs-button mejs-captions mejs-captions-enabled">' +
                '<button type="button" title="' + tracksText + '" aria-label="' + tracksText + '"></button>' +
                '<div class="mejs-captions-selector">' +
                '<ul>' +
                '<li>' +
                '<div class="mejs-button  mejs-captionload" >' +
                '<button type="button" title="' + chrome.i18n.getMessage('Load Subtitle') + '" aria-label="' + chrome.i18n.getMessage('Load Subtitle') + '"></button>' +
                '</div>' +
                '<select id="select_sub" style="width:150px;height: 18px;overflow: hidden;left:40px;position:absolute;">' +
                    '<option value="-1">None</option>' +
                '</select>' +
                '</li>' +
                encodingText +
                '</ul>' +
                '</div>' +
                '</div>').appendTo(t.rightControls);
        
        t.captionEncodingSelect = $(document).find('#encoding-selector').on('change', function(e) {
            wrnch.storage.get('default_encoding', 6, function(value) {
                chrome.contextMenus.update(value + 'e', { checked: false });
                $(document).trigger('subtitleEncodingChanged', e.target.value);
                t.setEncoding(e.target.value);
                chrome.contextMenus.update(e.target.value + 'e', { checked: true });
            });
        });
        
        wrnch.storage.get('default_encoding', 6, function(value) {
            t.captionEncodingSelect.attr({ value: value });
        });
        
        t.subSelect = $(document).find('#select_sub').on('change', function(e) {
            chrome.contextMenus.update(t.subIndex + 's', { checked: false });
            t.setSubtitle(e.target.value);
            chrome.contextMenus.update(t.subIndex + 's', { checked: true });
        });
        
        t.captionsButton.find('.mejs-captionload').find('button').on('click', function(e) {
            e.preventDefault();
            
            chrome.fileSystem.chooseEntry({
                type: 'openFile',
                acceptsMultiple: true,
                acceptsAllTypes: false,
                accepts: [
                    {
                        extensions: t.subExts
                    }
                ]
            }, function(entries) {
                if(chrome.runtime.lastError) {
                    return;
                }
                
                var temp = [];
                
                wrnch.forEachSync(entries, function(entry, i, next) {
                    entry.file(function(file) {
                        temp.push(file);
                        next();
                    });
                }, function() {
                    t.filterFiles(temp);
                });
            });
        });
    };
    
    MediaElementPlayer.prototype.setEncoding = function(index) {
        wrnch.storage.set('default_encoding', parseInt(index));
        this.captionEncodingSelect.attr({ value: parseInt(index) });
        
        //Force subtitles to be re-parsed with new encoding.
        for(var i = 0; i < this.subtitles.length; i++) {
            this.subtitles[i].entries = null;
        }
    };
    
    MediaElementPlayer.prototype.setSubtitle = function(index) {
        this.subIndex = parseInt(index);
        this.captions.hide();
        this.subSelect.attr({ value: this.subIndex });
        
        this.media.removeEventListener('timeupdate', timeUpdateHandler);
        
        if(this.subIndex !== -1) {
            if(this.subtitles[this.subIndex].entries && this.subtitles[this.subIndex].entries.text.length === 0) {
                this.notify('The given Subtitle file is corrupted!', 3000);
            }
            else {
                this.media.addEventListener('timeupdate', timeUpdateHandler);
                this.notify(this.subtitles[this.subIndex].file.name + ' loaded.', 3000);
            }
        }
    };
    
    MediaElementPlayer.prototype.parseSubtitles = function() {
        var t = this,
            reader = new FileReader(),
            current = t.subtitles[t.subIndex];
        
        // Prevent displaySubtitles from calling parseSubtitles too many times.
        current.entries = {};
        
        reader.onloadend = function(evt) {
            // parse the loaded file
            var d = evt.target.result;
            
            if((/<tt\s+xml/ig).exec(d)) {
                current.entries = wrnch.dfxp(d);
            }
            else if(d.startsWith('[Script Info]')) {
                current.entries = wrnch.ass(d);
            }
            else if(d.startsWith('<SAMI>')) {
                current.entries = wrnch.smi(d);
            }
            else {
                current.entries = wrnch.webvvt(d);
            }
        };
        
        reader.onerror = function() {
            t.notify('The given Subtitle file is corrupted!', 2000);
        };
        
        wrnch.storage.get('default_encoding', t.captionEncodingSelect.attr('value'), function(value) {
            reader.readAsText(current.file, encodings[value]);
        });
    };
    
    MediaElementPlayer.prototype.displaySubtitles = function() {
        var i,
            t,
            currTime,
            entries = this.subtitles[this.subIndex].entries;
        
        if(entries === null) {
            return this.parseSubtitles();
        }
        
        t = this;
        currTime = t.getCurrentTime() - t.capDelayValue;
        
        for(i = 0; i < entries.times.length; i++) {
            if(currTime >= entries.times[i].start) {
                if(currTime <= entries.times[i].stop) {
                    t.captionsText.html(entries.text[i]);
                    t.captions.show();
                    return; // exit out if one is visible;
                }
            }
            else {
                break;
            }
        }
        
        t.captions.hide();
    };
})();
