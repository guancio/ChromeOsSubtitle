var host = "https://api.opensubtitles.org/xml-rpc";

function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 1024;
    
    function charCodeFromCharacter(c) {
        return c.charCodeAt(0);
    }
    
    var byteCharacters = atob(b64Data);
    var byteArrays = [];
    
    for(var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var byteNumbers = Array.prototype.map.call(byteCharacters.slice(offset, offset + sliceSize), charCodeFromCharacter);
        
        byteArrays.push(new Uint8Array(byteNumbers));
    }
    
    return new Blob(byteArrays, {
        type: contentType
    });
}

var openSubsLang = [
    ["alb", "Albanian"],
    ["ara", "Arabic"],
    ["baq", "Basque"],
    ["pob", "Brazilian"],
    ["bul", "Bulgarian"],
    ["cat", "Catalan"],
    ["chi", "Chinese"],
    ["cze", "Czech"],
    ["dan", "Danish"],
    ["dut", "Dutch"],
    ["eng", "English"],
    ["est", "Estonian"],
    ["fin", "Finnish"],
    ["fre", "French"],
    ["geo", "Georgian"],
    ["ger", "German"],
    ["glg", "Galician"],
    ["ell", "Greek"],
    ["heb", "Hebrew"],
    ["hin", "Hindi"],
    ["hrv", "Croatian"],
    ["hun", "Hungarian"],
    ["ice", "Icelandic"],
    ["ind", "Indonesian"],
    ["ita", "Italian"],
    ["jpn", "Japanese"],
    ["khm", "Khmer"],
    ["kor", "Korean"],
    ["mac", "Macedonian"],
    ["may", "Malay"],
    ["nor", "Norwegian"],
    ["oci", "Occitan"],
    ["per", "Persian"],
    ["pol", "Polish"],
    ["por", "Portuguese"],
    ["rum", "Romanian"],
    ["rus", "Russian"],
    ["scc", "Serbian"],
    ["sin", "Sinhalese"],
    ["slo", "Slovak"],
    ["slv", "Slovenian"],
    ["spa", "Spanish"],
    ["swe", "Swedish"],
    ["tgl", "Tagalog"],
    ["tha", "Thai"],
    ["tur", "Turkish"],
    ["ukr", "Ukrainian"],
    ["vie", "Vietnamese"]
];

(function($) {
    MediaElementPlayer.prototype.opensubtitle = function() {
        var t = this,
            service = new rpc.ServiceProxy(host, {
                sanitize: false,
                protocol: "XML-RPC",
                asynchronous: true,
                methods: ["ServerInfo", "LogIn", "SearchSubtitles", "DownloadSubtitles", "TryUploadSubtitles", "CheckMovieHash", "SearchMoviesOnIMDB", "UploadSubtitles"]
            });
        
        t.opensubtitleService = {
            token: null,
            service: service,
            lastSubtitles: [],
            username: "",
            pwd: ""
        };
        
        var prec = $('#li_encoding'),
            line1 = $('<li class="mejs-captionload"/>')
                .append($('<input type="radio" name="_captions" id="_captions_opensubtitle" value="opensubtitle" disabled="disabled"/>'))
                .append($('<div id="opensubtitle_button" class="mejs-button  mejs-captionload" > <button type="button" title="' + mejs.i18n.t('Download subtitles from OpenSubtitles.org') + '" aria-label="' + mejs.i18n.t('Download subtitles from OpenSubtitles.org') + '"></button></div>'))
                .append($('<select id="select_opensubtitle_lang" style="padding: 0px 0px 0px 0px;text-overflow: ellipsis;width: 105px;height: 18px;overflow: hidden;white-space: nowrap;left:60px;position:absolute"/>'));
        
        line1.insertBefore(prec)
        
        var selectLang = $('#select_opensubtitle_lang')[0];
        
        openSubsLang.forEach(function(e) {
            $('<option value="' + e[0] + '">' + e[1] + '</option>').appendTo(selectLang);
        });
        
        var line2 =$('<li class="mejs-captionload"/>')
                .append($('<div class="mejs-button  mejs-captionload"/>'))
                .append($('<select id="select_opensubtitle" style="padding: 0px 0px 0px 0px;text-overflow: ellipsis;width: 105px;height: 18px;overflow: hidden;white-space: nowrap;left:60px;position:absolute;visibility:hidden"/>'))
                .append($('<label id="label_opensubtitle" style="padding: 0px 0px 0px 0px;text-overflow: ellipsis;width: 105px;height: 18px;overflow: hidden;white-space: nowrap;left:60px;position:absolute;">No subtitle</label>'))
                .insertAfter(line1);
        
        $('#select_opensubtitle_lang').val("eng");
        
        t.controls.find('input[id="_captions_opensubtitle"]').click(function() {
            lang = this.value;
            t.setTrack(lang);
        });
        
        function info(text) {
            $('#label_opensubtitle')[0].textContent = text;
        }
        
        function openSubtitle(content, subs) {
            var temp = [];
            info("5/6 Opening...");
            console.log(content);
            content.result.data.forEach(function(e, i) {
                mejs.Utility.gunzip(b64toBlob(e.data), function(data) {
                    if(i === 0) {
                        info(subs[i].SubFileName);
                        t.notify(subs[i].SubFileName + ' downloaded.', 3000);
                        
                        // if(t.opensubtitleService.lastSubtitles.length > 1) {
                        //     $('#select_opensubtitle').css('visibility', 'inherit');
                        //     $('#label_opensubtitle').css('visibility', 'hidden');
                        // }
                        
                        $('#encoding-selector').val("iso-8859-16");
                    }
                    
                    temp.push(new File([data], subs[i].SubFileName));
                    
                    if(i === content.result.data.length - 1) {
                        t.filterFiles(temp);
                    }
                });
            });
        }
        
        function downloadSubtitle(subs) {
            info("4/6 Downloading...");
            service.DownloadSubtitles({
                params: [t.opensubtitleService.token, 
                    subs.map(function(e) { return e.IDSubtitleFile; })
                ],
                onException: function(errorObj) {
                    info("Download failed...");
                    t.notify('Subtitle download failed.');
                },
                onComplete: function(responseObj) {
                    openSubtitle(responseObj, subs);
                }
            });
        }
        
        function searchSubtitle(hash) {
            var lang = "eng";
            lang = $('#select_opensubtitle_lang')[0].value;
            // var lang = "ell";
            info("3/6 Searching...");
            
            service.SearchSubtitles({
                params: [t.opensubtitleService.token, [{
                    query: t.playlist[t.playIndex].name,
                    sublanguageid: lang
                }, {
                    moviehash: hash,
                    moviebytesize: t.playlist[t.playIndex].size,
                    sublanguageid: lang
                }], {
                    limit: 5
                }],
                onException: function(errorObj) {
                    info("Search failed");
                    t.notify('Subtitle search failed. Please try later.', 2000);
                },
                onComplete: function(responseObj) {
                    console.log(responseObj);
                    // Check that at leat a subtitle has been found
                    $('#select_opensubtitle')
                        .find('option')
                        .remove()
                        .end();
                    var subtitles = responseObj.result.data;
                    for(var i = 0; i < subtitles.length; i++) {
                        $('#select_opensubtitle')
                            .append('<option value="' +
                                i + '">' +
                                subtitles[i].SubFileName +
                                '</option>');
                    }
                    $('#select_opensubtitle').val(0);
                    t.opensubtitleService.lastSubtitles = subtitles;
                    
                    $('#select_opensubtitle').off("change");
                    $('#select_opensubtitle').change(function(e) {
                        $('#label_opensubtitle').css('visibility', 'inherit');
                        $('#select_opensubtitle').css('visibility', 'hidden');
                        downloadSubtitle(
                            subtitles[Number($('#select_opensubtitle')[0].value)]
                        );
                    });
                    
                    downloadSubtitle(subtitles);
                }
            });
        }
        
        function movieHash() {
            info("2/6 Hashing...");
            subtitleHash(t.playlist[t.playIndex], function(hash) {
                searchSubtitle(hash);
            });
        }
        
        function logIn() {
            if(!t.getSrc()) {
                t.notify('Please load media.', 2000);
                return;
            }
            
            $(document).trigger("opensubtitlesDownload");
            
            info("1/6 Authenticating...");
            service.LogIn({
                params: [t.opensubtitleService.username, t.opensubtitleService.pwd, "", "ChromeSubtitleVideoplayer"],
                onException: function(errorObj) {
                    info("Authentiation failed");
                    t.notify('Opensubtitles.org authentication failed!', 2000);
                },
                onComplete: function(responseObj) {
                    t.opensubtitleService.token = responseObj.result.token;
                    movieHash();
                }
            });
        }
        
        t.openSubtitleLogIn = logIn;
        
        $('#opensubtitle_button').click(function(e) {
            $('#label_opensubtitle').css('visibility', 'inherit');
            $('#select_opensubtitle').css('visibility', 'hidden');
            
            logIn();
        });
        
        // on load a new video
        t.media.addEventListener('loadeddata', function() {
            t.captionsButton
                .find('input[value=opensubtitle]')
                .prop('disabled', true);
            info("No subtitle");
            
            $('#label_opensubtitle').css('visibility', 'inherit');
            $('#select_opensubtitle').css('visibility', 'hidden');
            t.opensubtitleService.lastSubtitles = [];
            var defaultValue = selectDefault.value;
            $('#select_opensubtitle_lang').val(defaultValue);
        });
        var settingsList = $('#settings_list')[0];
        $('<li/>')
            .appendTo(settingsList)
            .append($('<label style="width:250px; float:left;">Default opensubtitle.org language</label>'))
            .append($('<select id="defaultOpenSubtitleLang" style="width:100px"/>'));
        var selectDefault = $('#defaultOpenSubtitleLang')[0];
        
        $('<li/>')
            .appendTo(settingsList)
            .append($('<label style="width:250px; float:left;">Opensubtitls.org username</label>'))
            .append($('<input id="usernameOpenSubtitle" style="width:100px;background-color: transparent; color: white;"/>'));
        $('#usernameOpenSubtitle').keydown(function(e) {
            e.stopPropagation();
            return true;
        });
        
        $('<li/>')
            .appendTo(settingsList)
            .append($('<label style="width:250px; float:left;">Opensubtitls.org password</label>'))
            .append($('<input id="pwdOpenSubtitle" type="password" style="width:100px;background-color: transparent; color: white;"/>'));
        $('#pwdOpenSubtitle').keydown(function(e) {
            e.stopPropagation();
            return true;
        });
        
        openSubsLang.forEach(function(e) {
            $('<option value="' + e[0] + '">' + e[1] + '</option>').appendTo(selectDefault);
        });
        
        mejs.Utility.getFromSettings(
            'default_opensubtitle_lang',
            "eng",
            function(value) {
                $(selectDefault).val(value);
                $('#select_opensubtitle_lang').val(value);
            }
        );
        mejs.Utility.getFromSettings(
            'opensubtitle_username',
            "",
            function(value) {
                t.opensubtitleService.username = value;
                $("#usernameOpenSubtitle")[0].value = value
            }
        );
        mejs.Utility.getFromSettings(
            'opensubtitle_pwd',
            "",
            function(value) {
                t.opensubtitleService.pwd = value;
                $("#pwdOpenSubtitle")[0].value = value
            }
        );
        
        $(document).bind("settingsClosed", function() {
            var defaultValue = selectDefault.value;
            $('#select_opensubtitle_lang').val(defaultValue);
            mejs.Utility.setIntoSettings(
                'default_opensubtitle_lang',
                defaultValue,
                function() {}
            );
            
            t.opensubtitleService.username =
                $("#usernameOpenSubtitle")[0].value;
            mejs.Utility.setIntoSettings(
                'opensubtitle_username',
                t.opensubtitleService.username,
                function() {}
            );
            
            t.opensubtitleService.pwd =
                $("#pwdOpenSubtitle")[0].value;
            mejs.Utility.setIntoSettings(
                'opensubtitle_pwd',
                t.opensubtitleService.pwd,
                function() {}
            );
        });
    };
})(mejs.$);