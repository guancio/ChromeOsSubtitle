(function() {
    var host = 'https://api.opensubtitles.org/xml-rpc',
        openSubsLang = [ ['alb', 'Albanian'], ['ara', 'Arabic'], ['baq', 'Basque'], ['pob', 'Brazilian'], ['bul', 'Bulgarian'], ['cat', 'Catalan'], ['chi', 'Chinese'], ['cze', 'Czech'], ['dan', 'Danish'], ['dut', 'Dutch'], ['eng', 'English'], ['est', 'Estonian'], ['fin', 'Finnish'], ['fre', 'French'], ['geo', 'Georgian'], ['ger', 'German'], ['glg', 'Galician'], ['ell', 'Greek'], ['heb', 'Hebrew'], ['hin', 'Hindi'], ['hrv', 'Croatian'], ['hun', 'Hungarian'], ['ice', 'Icelandic'], ['ind', 'Indonesian'], ['ita', 'Italian'], ['jpn', 'Japanese'], ['khm', 'Khmer'], ['kor', 'Korean'], ['mac', 'Macedonian'], ['may', 'Malay'], ['nor', 'Norwegian'], ['oci', 'Occitan'], ['per', 'Persian'], ['pol', 'Polish'], ['por', 'Portuguese'], ['rum', 'Romanian'], ['rus', 'Russian'], ['scc', 'Serbian'], ['sin', 'Sinhalese'], ['slo', 'Slovak'], ['slv', 'Slovenian'], ['spa', 'Spanish'], ['swe', 'Swedish'], ['tgl', 'Tagalog'], ['tha', 'Thai'], ['tur', 'Turkish'], ['ukr', 'Ukrainian'], ['vie', 'Vietnamese'] ];
    
    MediaElementPlayer.prototype.opensubtitle = function() {
        var t = this,
            service = new rpc.ServiceProxy(host, {
                sanitize: false,
                protocol: 'XML-RPC',
                asynchronous: true,
                methods: ['ServerInfo', 'LogIn', 'SearchSubtitles', 'DownloadSubtitles', 'TryUploadSubtitles', 'CheckMovieHash', 'SearchMoviesOnIMDB', 'UploadSubtitles']
            });
        
        t.opensubtitleService = {
            token: null,
            service: service,
            username: '',
            pwd: ''
        };
        
        var prec = $('#li_encoding'),
            line1 = $('<li class="mejs-captionload"/>')
                .append($('<div id="opensubtitle_button" class="mejs-button  mejs-captionload" > <button type="button" title="' + mejs.i18n.t('Download subtitles from OpenSubtitles.org') + '" aria-label="' + mejs.i18n.t('Download subtitles from OpenSubtitles.org') + '"></button></div>'))
                .append($('<select id="select_opensubtitle_lang" style="padding: 0px 0px 0px 0px;text-overflow:ellipsis;width: 150px;height:18px;overflow: hidden;white-space: nowrap;left:40px;position:absolute"/>'));
        
        line1.appendTo(prec).insertBefore(prec.find('label'));
        
        var selectLang = $('#select_opensubtitle_lang');
        
        mejs.Utility.getFromSettings('default_opensubtitle_lang', 'eng', function(value) {
            openSubsLang.forEach(function(e) {
                $('<option value="' + e[0] + '"' + (e[0] === value ? 'selected' : '') + '>' + e[1] + '</option>').appendTo(selectLang);
            });
        });
        
        selectLang.on('change', function(e) {
            mejs.Utility.setIntoSettings('default_opensubtitle_lang', e.target.value);
        });
        
        function unzipSubtitles(content, subs) {
            var temp = [];
            
            mejs.Utility.waterfall(content.result.data, function(e, i, next) {
                mejs.Utility.gunzip(e.data, function(data) {
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
                params: [t.opensubtitleService.token, 
                    subs.map(function(e) { return e.IDSubtitleFile; })
                ],
                onException: function(errorObj) {
                    t.notify('Subtitle download failed.');
                },
                onComplete: function(responseObj) {
                    unzipSubtitles(responseObj, subs);
                }
            });
        }
        
        function searchSubtitle(hash) {
            var lang = $('#select_opensubtitle_lang').attr('value');
            
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
                onException: function(errorObj) {
                    t.notify('Subtitle search failed. Please try later.', 2000);
                },
                onComplete: function(responseObj) {
                    console.log(responseObj);
                    downloadSubtitle(responseObj.result.data);
                }
            });
        }
        
        t.openSubtitleLogIn = function() {
            if(!t.getSrc()) {
                t.notify('Please load media.', 2000);
                return;
            }
            
            $(document).trigger('opensubtitlesDownload');
            t.notify('Searching for subtitles.', 2000);
            
            service.LogIn({
                params: [t.opensubtitleService.username, t.opensubtitleService.pwd, '', 'ChromeSubtitleVideoplayer'],
                onException: function(errorObj) {
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
        
        $('#opensubtitle_button').on('click', function(e) {
            t.openSubtitleLogIn();
        });
        
        // on load a new video
        var settingsList = $('#settings_list');
        
        $('<li/>')
            .appendTo(settingsList)
            .append($('<label style="width:250px; float:left;">Opensubtitles.org username</label>'))
            .append($('<input id="usernameOpenSubtitle" style="width:100px;background-color: transparent; color: white;"/>'));
        $('#usernameOpenSubtitle').on('keydown', function(e) {
            e.stopPropagation();
        });
        
        $('<li/>').appendTo(settingsList)
            .append($('<label style="width:250px; float:left;">Opensubtitles.org password</label>'))
            .append($('<input id="pwdOpenSubtitle" type="password" style="width:100px;background-color: transparent; color: white;"/>'));
        $('#pwdOpenSubtitle').on('keydown', function(e) {
            e.stopPropagation();
        });
        
        mejs.Utility.getFromSettings('opensubtitle_username', '', function(value) {
            t.opensubtitleService.username = value;
            $('#usernameOpenSubtitle').attr({ 'value': value });
        });
        
        mejs.Utility.getFromSettings('opensubtitle_pwd', '', function(value) {
            t.opensubtitleService.pwd = value;
            $('#pwdOpenSubtitle').attr({ 'value': value });
        });
        
        $(document).on('settingsClosed', function() {
            t.opensubtitleService.username = $('#usernameOpenSubtitle').attr('value');
            mejs.Utility.setIntoSettings('opensubtitle_username', t.opensubtitleService.username);
            
            t.opensubtitleService.pwd = $('#pwdOpenSubtitle').attr('value');
            mejs.Utility.setIntoSettings('opensubtitle_pwd', t.opensubtitleService.pwd);
        });
    };
})();