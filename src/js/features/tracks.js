zip.workerScriptsPath = 'lib/zipjs/WebContent/'
zip.useWebWorkers = packaged_app;

(function($) {
    // add extra default options 
    $.extend(mejs.MepDefaults, {
        // this will automatically turn on a <track>
        startLanguage: '',
        
        tracksText: mejs.i18n.t('Captions/Subtitles')
    });
    
    var encodings = ["utf-8", "ibm866", "iso-8859-2", "iso-8859-3", "iso-8859-4", "iso-8859-5", "iso-8859-6", "iso-8859-7", "iso-8859-8", "iso-8859-10", "iso-8859-13 ", "iso-8859-14", "iso-8859-15", "iso-8859-16", "koi8-r", "koi8-u", "windows-874", "windows-1250", "windows-1251", "windows-1252", "windows-1253", "windows-1254", "windows-1255", "windows-1256", "windows-1257", "windows-1258", "gbk", "gb18030", "euc-jp", "iso-2022-jp", "shift_jis", "euc-kr"],
        encoding_labels = ["UTF-8", "ibm866 Cyrillic", "iso-8859-2 Latin-2", "iso-8859-3 Latin-3", "iso-8859-4 Latin-4", "iso-8859-5 Cyrillic", "iso-8859-6 Arabic", "iso-8859-7 Greek", "iso-8859-8 Hebrew", "iso-8859-10 Latin-6", "iso-8859-13 ", "iso-8859-14", "iso-8859-15", "iso-8859-16", "koi8-r", "koi8-u", "windows-874", "windows-1250", "windows-1251", "windows-1252 US-ascii", "windows-1253", "windows-1254 Latin-5", "windows-1255", "windows-1256 Arabic", "windows-1257", "windows-1258", "gbk Chinese", "gb18030", "euc-jp", "iso-2022-jp", "shift_jis", "euc-kr"];
    
    MediaElementPlayer.prototype.tracks = function() {
        var t = this,
            i,
            options = '';
        
        t.subtitles = [];
        t.subIndex = null;
        
        t.captions =
            $('<div class="mejs-captions-layer mejs-layer"><div class="mejs-captions-position mejs-captions-position-hover"><span class="mejs-captions-text"></span></div></div>')
            .prependTo(t.layers).hide();
        t.captionsText = t.captions.find('.mejs-captions-text');
        
        var encodingText = '<li id="li_encoding">' +
            '<label style="width:78px;float: left;padding: 4px 0px 0px 5px;">Encoding</label>' +
            '<select style="width:70px" id="encoding-selector" disabled="disabled">';
        
        for(i = 0; i < encodings.length; i++) {
            encodingText = encodingText + '<option value="' + encodings[i] + '">' + encoding_labels[i] + '</option>';
        }
        
        encodingText = encodingText + '</select></il>';
        t.captionsButton = $('<div class="mejs-button mejs-captions-button mejs-captions-enabled">' +
                '<button type="button" title="' + t.options.tracksText + '" aria-label="' + t.options.tracksText + '"></button>' +
                '<div class="mejs-captions-selector skip">' +
                '<ul>' +
                '<li>' +
                '<input type="radio" name="_captions" id="_captions_none" value="none" checked="checked" />' +
                '<label for="_captions_none">' + mejs.i18n.t('None') + '</label>' +
                '</li>' +
                '<li class="mejs-captionload">' +
                '<input type="radio" name="_captions" id="_captions_fromfile" value="fromfile" disabled="disabled"/>' +
                '<div class="mejs-button  mejs-captionload" >' +
                '<button type="button" title="' + mejs.i18n.t('Load subtitle...') + '" aria-label="' + mejs.i18n.t('Load subtitle...') + '"></button>' +
                '</div>' +
                '<input style="display:none" type="file" id="opensrtfile_input"/>' +
                '<select id="select_srtname" style="padding: 0px 0px 0px 0px;text-overflow: ellipsis;width: 105px;height: 18px;overflow: hidden;white-space: nowrap;left:60px;position:absolute;visibility:hidden"/>' +
                '<label id="label_srtname" style="padding: 0px 0px 0px 0px;text-overflow: ellipsis;width: 105px;height: 18px;overflow: hidden;white-space: nowrap;left:60px;position:absolute;">No subtitle</label>' +
                '</li>' +
                encodingText +
                '</ul>' +
                '</div>' +
                '</div>')
            .appendTo(t.rightControls);
        
        t.captionEncodingSelect = t.captionsButton.find('#encoding-selector')[0];
        t.captionsButton.find('#encoding-selector').change(function(e) {
            $(document).trigger(
                "subtitleEncodingChanged",
                t.captionEncodingSelect.value
            );
            
            mejs.Utility.setIntoSettings("default_encoding", t.captionEncodingSelect.value, function(obj) {});
            
            var radios = t.controls.find('input[name="_captions"]');
            var selectedRadio = radios.filter(function(e) {
                return radios[e].checked
            })[0];
            
            var srcSelected = selectedRadio.value
        });
        
        t.captionsButton.find('.mejs-captionload button').click(function(e) {
            e.preventDefault();
            srtFileInputs[0].click();
            return false;
        });
        
        // hover
        t.captionsButton
        // handle clicks to the language radio buttons
        .on('click', 'input[type=radio]', function() {
            lang = this.value;
            //t.setTrack(lang);
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
        
        t.media.addEventListener('loadeddata', function() {
            $('#_captions_none').click();
            t.captionsButton
                .find('input[value=fromfile]')
                .prop('disabled', true);
            t.captionsButton
                .find('#encoding-selector')
                .prop('disabled', true);
            t.captionsButton
                .find('#label_srtname')[0]
                .textContent = "No subtitle";
            $('#label_srtname').css('visibility', 'inherit');
            $('#select_srtname').css('visibility', 'hidden');
        });
        
        t.capDelayValue = 0;
    };
    
    MediaElementPlayer.prototype.setEncoding = function(index) {
        mejs.Utility.setIntoSettings('default_encoding', encodings[parseInt(index)], function(obj) {});
        
        for(var i = 0; i < this.subtitles.length; i++) {
            this.subtitles[i].entries = null;
        }
    };
    
    MediaElementPlayer.prototype.setSubtitle = function(index) {
        if(index !== undefined) {
            this.subIndex = parseInt(index);
        }
        
        if(this.subtitles[this.subIndex].entries === []) {
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
                current.entries = mejs.Utility.webvvt(d);
            }
        };
        
        reader.onerror = function() {
            t.notify('The given Subtitle file is corrupted!', 2000);
        };
        
        mejs.Utility.getFromSettings('default_encoding', t.captionEncodingSelect.value, function(value) {
            t.captionEncodingSelect.value = value;
            reader.readAsText(current.file, value);
        });
    };
    
    MediaElementPlayer.prototype.displaySubtitles = function() {
        var t, entries, currtime, i;
        
        if(this.subIndex === null || this.subtitles[this.subIndex].entries === []) {
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
    
    mejs.language = {
        codes: {
            af: 'Afrikaans',
            sq: 'Albanian',
            ar: 'Arabic',
            be: 'Belarusian',
            bg: 'Bulgarian',
            ca: 'Catalan',
            zh: 'Chinese',
            'zh-cn': 'Chinese Simplified',
            'zh-tw': 'Chinese Traditional',
            hr: 'Croatian',
            cs: 'Czech',
            da: 'Danish',
            nl: 'Dutch',
            en: 'English',
            et: 'Estonian',
            tl: 'Filipino',
            fi: 'Finnish',
            fr: 'French',
            gl: 'Galician',
            de: 'German',
            el: 'Greek',
            ht: 'Haitian Creole',
            iw: 'Hebrew',
            hi: 'Hindi',
            hu: 'Hungarian',
            is: 'Icelandic',
            id: 'Indonesian',
            ga: 'Irish',
            it: 'Italian',
            ja: 'Japanese',
            ko: 'Korean',
            lv: 'Latvian',
            lt: 'Lithuanian',
            mk: 'Macedonian',
            ms: 'Malay',
            mt: 'Maltese',
            no: 'Norwegian',
            fa: 'Persian',
            pl: 'Polish',
            pt: 'Portuguese',
            //'pt-pt':'Portuguese (Portugal)',
            ro: 'Romanian',
            ru: 'Russian',
            sr: 'Serbian',
            sk: 'Slovak',
            sl: 'Slovenian',
            es: 'Spanish',
            sw: 'Swahili',
            sv: 'Swedish',
            tl: 'Tagalog',
            th: 'Thai',
            tr: 'Turkish',
            uk: 'Ukrainian',
            vi: 'Vietnamese',
            cy: 'Welsh',
            yi: 'Yiddish'
        }
    };
})(mejs.$);

    // MediaElementPlayer.prototype.enableTrackButton = function(lang, label) {
    //     var t = this;
        
    //     if(label === '') {
    //         label = mejs.language.codes[lang] || lang;
    //     }
        
    //     t.captionsButton
    //         .find('input[value=' + lang + ']')
    //         .prop('disabled', false);
    //     t.captionsButton
    //         .find('#encoding-selector')
    //         .prop('disabled', false);
            
    //     $('#_captions_' + lang).click();o
    // };
    
    // MediaElementPlayer.prototype.addTrackButton = function(lang, label) {
    //     var t = this;
    //     if(label === '') {
    //         label = mejs.language.codes[lang] || lang;
    //     }
        
    //     t.captionsButton.find('ul').append(
    //         $('<li>' +
    //             '<input type="radio" name="_captions" id="_captions_' + lang + '" value="' + lang + '" disabled="disabled" />' +
    //             '<label for="_captions_' + lang + '">' + label + ' (loading)' + '</label>' +
    //             '</li>')
    //     );
        
    //     // remove this from the dropdownlist (if it exists)
    //     t.container.find('.mejs-captions-translations option[value=' + lang + ']').remove();
    // };