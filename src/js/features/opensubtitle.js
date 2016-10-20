(function() {
    var host = 'https://api.opensubtitles.org/xml-rpc',
        openSubsLang = {
            'alb': 'Albanian',
            'ara': 'Arabic',
            'baq': 'Basque',
            'pob': 'Brazilian',
            'bul': 'Bulgarian',
            'cat': 'Catalan',
            'chi': 'Chinese',
            'cze': 'Czech',
            'dan': 'Danish',
            'dut': 'Dutch',
            'eng': 'English',
            'est': 'Estonian',
            'fin': 'Finnish',
            'fre': 'French',
            'geo': 'Georgian',
            'ger': 'German',
            'glg': 'Galician',
            'ell': 'Greek',
            'heb': 'Hebrew',
            'hin': 'Hindi',
            'hrv': 'Croatian',
            'hun': 'Hungarian',
            'ice': 'Icelandic',
            'ind': 'Indonesian',
            'ita': 'Italian',
            'jpn': 'Japanese',
            'khm': 'Khmer',
            'kor': 'Korean',
            'mac': 'Macedonian',
            'may': 'Malay',
            'nor': 'Norwegian',
            'oci': 'Occitan',
            'per': 'Persian',
            'pol': 'Polish',
            'por': 'Portuguese',
            'rum': 'Romanian',
            'rus': 'Russian',
            'scc': 'Serbian',
            'sin': 'Sinhalese',
            'slo': 'Slovak',
            'slv': 'Slovenian',
            'spa': 'Spanish',
            'swe': 'Swedish',
            'tgl': 'Tagalog',
            'tha': 'Thai',
            'tur': 'Turkish',
            'ukr': 'Ukrainian',
            'vie': 'Vietnamese'
        },
        subtitleHistory = {};
    
    MediaElementPlayer.prototype.opensubtitle = function() {
        var t = this,
            lang,
            service = new rpc.ServiceProxy(host, {
                sanitize: false,
                protocol: 'XML-RPC',
                asynchronous: true,
                methods: ['ServerInfo', 'LogIn', 'SearchSubtitles', 'DownloadSubtitles']
            });
        
        t.opensubtitleService = {
            token: null,
            service: service
        };
        
        var prec = $('#li_encoding');
        
        $('<li>')
            .append($('<div id="opensubtitle_button" class="mejs-button  mejs-openload" > <button type="button" title="' + chrome.i18n.getMessage('downSubs') + '" aria-label="' + chrome.i18n.getMessage('downSubs') + '"></button></div>'))
            .append($('<select id="select_opensubtitle_lang" style="padding: 0px 0px 0px 0px;text-overflow:ellipsis;width: 150px;height:18px;overflow: hidden;white-space: nowrap;left:40px;position:absolute"/>'))
            .insertBefore(prec.find('label'));
        
        var selectLang = $('#select_opensubtitle_lang');
        
        wrnch.storage.get('default_opensubtitle_lang', 'eng', function(value) {
            Object.keys(openSubsLang).forEach(function(key) {
                $('<option value="' + key + '"' + (key === value ? 'selected' : '') + '>' + openSubsLang[key] + '</option>').appendTo(selectLang);
            });
            lang = value;
        });
        
        selectLang.on('change', function(e) {
            wrnch.storage.set('default_opensubtitle_lang', e.target.value);
            lang = e.target.value;
        });
        
        function unzipSubtitles(content, subs) {
            var temp = [];
            
            t.notify('Unzipping subtitles...', 5000);
            
            wrnch.forEachSync(content.result.data, function(e, i, next) {
                wrnch.gunzip(e.data, function(data) {
                    temp.push(new File([data], subs[i].SubFileName));
                    next();
                    
                    if(i === content.result.data.length - 1) {
                        t.filterFiles(temp);
                    }
                });
            });
        }
        
        function downloadSubtitle(subs) {
            service.DownloadSubtitles({
                params: [
                    t.opensubtitleService.token,
                    subs.map(function(e) {
                        return e.IDSubtitleFile;
                    })
                ],
                onException: function() {
                    t.notify('Subtitle download failed.');
                },
                onComplete: function(responseObj) {
                    if(subtitleHistory[lang] === undefined) {
                        subtitleHistory[lang] = [ t.playlist[t.playIndex].name ];
                    }
                    else {
                        subtitleHistory[lang].push(t.playlist[t.playIndex].name);
                    }
                    unzipSubtitles(responseObj, subs);
                }
            });
        }
        
        function searchSubtitle(hash) {
            service.SearchSubtitles({
                params: [t.opensubtitleService.token, [{
                    query: t.playlist[t.playIndex].name,
                    sublanguageid: lang
                }, {
                    moviehash: hash,
                    moviebytesize: t.playlist[t.playIndex].size,
                    sublanguageid: lang
                }], {
                    limit: 8
                }],
                onException: function() {
                    t.notify('Subtitle search failed. Please try later.', 2000);
                },
                onComplete: function(responseObj) {
                    downloadSubtitle(responseObj.result.data);
                }
            });
        }
        
        t.openSubtitleLogIn = function() {
            if(!t.getSrc()) {
                t.notify('Please load media.', 2000);
                return;
            }
            
            if(subtitleHistory[lang] && subtitleHistory[lang].indexOf(t.playlist[t.playIndex].name) !== -1) {
                t.notify('Already downloaded subtitles for the loaded media.', 3000);
                return;
            }
            
            $(document).trigger('opensubtitlesDownload');
            t.notify('Searching for subtitles...', 5000);
            
            if(t.opensubtitleService.token !== null) {
                subtitleHash(t.playlist[t.playIndex], function(hash) {
                    searchSubtitle(hash);
                });
            }
            else {
                service.LogIn({
                    params: ['', '', '', 'ChromeSubtitleVideoplayer'],
                    onException: function() {
                        t.notify('Opensubtitles.org authentication failed!', 2000);
                    },
                    onComplete: function(responseObj) {
                        t.opensubtitleService.token = responseObj.result.token;
                        subtitleHash(t.playlist[t.playIndex], function(hash) {
                            searchSubtitle(hash);
                        });
                    }
                });
            }
        };
        
        $('#opensubtitle_button').on('click', function(e) {
            t.openSubtitleLogIn();
        });
    };
})();
