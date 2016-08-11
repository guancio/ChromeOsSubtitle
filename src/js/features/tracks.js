zip.workerScriptsPath = 'lib/zipjs/WebContent/'
zip.useWebWorkers = packaged_app;

(function($) {
    // add extra default options 
    $.extend(mejs.MepDefaults, {
        // this will automatically turn on a <track>
        startLanguage: '',
        
        tracksText: mejs.i18n.t('Captions/Subtitles')
    });
    
    MediaElementPlayer.prototype.buildtracks = function() {
        var t = this,
            i,
            options = '';
        
        t.subtitles = [];
        t.subIndex = null;
        
        t.captions =
            $('<div class="mejs-captions-layer mejs-layer"><div class="mejs-captions-position mejs-captions-position-hover"><span class="mejs-captions-text"></span></div></div>')
            .prependTo(t.layers).hide();
        t.captionsText = t.captions.find('.mejs-captions-text');
        
        var encodings = [
            "utf-8",
            "ibm866",
            "iso-8859-2",
            "iso-8859-3",
            "iso-8859-4",
            "iso-8859-5",
            "iso-8859-6",
            "iso-8859-7",
            "iso-8859-8",
            "iso-8859-10",
            "iso-8859-13 ",
            "iso-8859-14",
            "iso-8859-15",
            "iso-8859-16",
            "koi8-r",
            "koi8-u",
            "windows-874",
            "windows-1250",
            "windows-1251",
            "windows-1252",
            "windows-1253",
            "windows-1254",
            "windows-1255",
            "windows-1256",
            "windows-1257",
            "windows-1258",
            "gbk",
            "gb18030",
            "euc-jp",
            "iso-2022-jp",
            "shift_jis",
            "euc-kr"
        ];
        var encoding_labels = [
            "UTF-8",
            "ibm866 Cyrillic",
            "iso-8859-2 Latin-2",
            "iso-8859-3 Latin-3",
            "iso-8859-4 Latin-4",
            "iso-8859-5 Cyrillic",
            "iso-8859-6 Arabic",
            "iso-8859-7 Greek",
            "iso-8859-8 Hebrew",
            "iso-8859-10 Latin-6",
            "iso-8859-13 ",
            "iso-8859-14",
            "iso-8859-15",
            "iso-8859-16",
            "koi8-r",
            "koi8-u",
            "windows-874",
            "windows-1250",
            "windows-1251",
            "windows-1252 US-ascii",
            "windows-1253",
            "windows-1254 Latin-5",
            "windows-1255",
            "windows-1256 Arabic",
            "windows-1257",
            "windows-1258",
            "gbk Chinese",
            "gb18030",
            "euc-jp",
            "iso-2022-jp",
            "shift_jis",
            "euc-kr"
        ];
        
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
            
            if(t.tracks.length == 0)
                return;
            
            var radios = t.controls.find('input[name="_captions"]');
            var selectedRadio = radios.filter(function(e) {
                return radios[e].checked
            })[0];
            
            var srcSelected = selectedRadio.value;
            
            if(srcSelected == 'none')
                return;
                
            var selectedIdx = t.findTrackIdx(srcSelected);
            
            t.tracks[selectedIdx].isLoaded = false;
            t.loadTrack(selectedIdx);
        });
        
        var srtFileInputs = t.captionsButton.find('#opensrtfile_input');
        
        srtFileInputs.change(function(e) {
            e.preventDefault();
            
            if(e.files.length === 0)
                return;
            
            t.subtitles[t.playIndex] = {
                file: e.files[0],
                entries: null,
                isCorrupt: false
            };
            
            t.loadSubtitles();
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
            t.setTrack(lang);
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
        
        // add to list
        for(i = 0; i < t.tracks.length; i++) {
            t.addTrackButton(t.tracks[i].srclang, t.tracks[i].label);
        }
        
        t.media.addEventListener('timeupdate', function(e) {
            t.displayCaptions();
        }, false);
        
        t.media.addEventListener('loadeddata', function() {
            if(t.tracks.length == 0) {
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
            }
        });
        
        t.capDelayValue = 0;
    };
    
    MediaElementPlayer.prototype.setSubtitles = function(index) {
        var t = this,
            t.subIndex = parseInt(index) || t.subIndex
            current = t.subtitles[t.subIndex];
        
        if(current.entries === null) {
            t.parseSubtitles(function() {
                t.setSubtitles();
            });
        }
        else if(current.isCorrupt) {
            t.notify('The given Subtitle file is corrupted!', 2000);
        }
        else {
            t.displaySubtitles();
        }
    };
    
    MediaElementPlayer.prototype.parseSubtitles = function(cb) {
        var t = this,
            current = t.subtitles[t.subIndex],
            reader = new FileReader();
        
        reader.onloadend = function(evt) {
            // parse the loaded file
            var d = evt.target.result;
            
            if(typeof d === "string" && (/<tt\s+xml/ig).exec(d)) {
                current.entries = mejs.TrackFormatParser.dfxp.parse(d);
            } else {
                current.entries = mejs.TrackFormatParser.webvvt.parse(d);
            }
            
            cb();
        };
        
        reader.onerror = function() {
            current.isCorrupt = true;
            cb();
        };
        
        mejs.Utility.getFromSettings('default_encoding', t.captionEncodingSelect.value, function(value) {
            t.captionEncodingSelect.value = value;
            reader.readAsText(track.file, value);
        });
    };
    
    MediaElementPlayer.prototype.displaySubtitles = function() {
        var t, entries, currtime, i;
        
        if(this.subIndex === null) {
            return;
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
    
    /*
    Parses WebVVT format which should be formatted as
    ================================
    WEBVTT
	
    1
    00:00:01,1 --> 00:00:05,000
    A line of text
    
    2
    00:01:15,1 --> 00:02:05,000
    A second line of text
	
    ===============================
    
    Adapted from: http://www.delphiki.com/html5/playr
    */
    mejs.TrackFormatParser = {
        webvvt: {
            // match start "chapter-" (or anythingelse)
            pattern_identifier: /^([a-zA-z]+-)?[0-9]+$/,
            pattern_timecode: /^([0-9]{2}:[0-9]{2}:[0-9]{2}([,.][0-9]{1,3})?) --\> ([0-9]{2}:[0-9]{2}:[0-9]{2}([,.][0-9]{3})?)(.*)$/,
            
            parse: function(trackText) {
                var
                    i = 0,
                    lines = mejs.TrackFormatParser.split2(trackText, /\r?\n/),
                    entries = {
                        text: [],
                        times: []
                    },
                    timecode,
                    text;
                for(; i < lines.length; i++) {
                    // check for the line number
                    if(this.pattern_identifier.exec(lines[i])) {
                        // skip to the next line where the start --> end time code should be
                        i++;
                        timecode = this.pattern_timecode.exec(lines[i]);
                        
                        if(timecode && i < lines.length) {
                            i++;
                            // grab all the (possibly multi-line) text that follows
                            text = lines[i];
                            i++;
                            while(lines[i] !== '' && i < lines.length) {
                                text = text + '\n' + lines[i];
                                i++;
                            }
                            text = $.trim(text).replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, "<a href='$1' target='_blank'>$1</a>");
                            // Text is in a different array so I can use .join
                            entries.text.push(text);
                            entries.times.push({
                                start: (mejs.Utility.convertSMPTEtoSeconds(timecode[1]) == 0) ? 0.200 : mejs.Utility.convertSMPTEtoSeconds(timecode[1]),
                                stop: mejs.Utility.convertSMPTEtoSeconds(timecode[3]),
                                settings: timecode[5]
                            });
                        }
                    }
                }
                return entries;
            }
        },
        // Thanks to Justin Capella: https://github.com/johndyer/mediaelement/pull/420
        dfxp: {
            parse: function(trackText) {
                trackText = $(trackText).filter("tt");
                var
                    i = 0,
                    container = trackText.children("div").eq(0),
                    lines = container.find("p"),
                    styleNode = trackText.find("#" + container.attr("style")),
                    styles,
                    begin,
                    end,
                    text,
                    entries = {
                        text: [],
                        times: []
                    };
                    
                if(styleNode.length) {
                    var attributes = styleNode.removeAttr("id").get(0).attributes;
                    if(attributes.length) {
                        styles = {};
                        for(i = 0; i < attributes.length; i++) {
                            styles[attributes[i].name.split(":")[1]] = attributes[i].value;
                        }
                    }
                }
                
                for(i = 0; i < lines.length; i++) {
                    var style;
                    var _temp_times = {
                        start: null,
                        stop: null,
                        style: null
                    };
                    if(lines.eq(i).attr("begin")) _temp_times.start = mejs.Utility.convertSMPTEtoSeconds(lines.eq(i).attr("begin"));
                    if(!_temp_times.start && lines.eq(i - 1).attr("end")) _temp_times.start = mejs.Utility.convertSMPTEtoSeconds(lines.eq(i - 1).attr("end"));
                    if(lines.eq(i).attr("end")) _temp_times.stop = mejs.Utility.convertSMPTEtoSeconds(lines.eq(i).attr("end"));
                    if(!_temp_times.stop && lines.eq(i + 1).attr("begin")) _temp_times.stop = mejs.Utility.convertSMPTEtoSeconds(lines.eq(i + 1).attr("begin"));
                    if(styles) {
                        style = "";
                        for(var _style in styles) {
                            style += _style + ":" + styles[_style] + ";";
                        }
                    }
                    if(style) _temp_times.style = style;
                    if(_temp_times.start == 0) _temp_times.start = 0.200;
                    entries.times.push(_temp_times);
                    text = $.trim(lines.eq(i).html()).replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, "<a href='$1' target='_blank'>$1</a>");
                    entries.text.push(text);
                    if(entries.times.start == 0) entries.times.start = 2;
                }
                return entries;
            }
        },
        split2: function(text, regex) {
            // normal version for compliant browsers
            // see below for IE fix
            return text.split(regex);
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