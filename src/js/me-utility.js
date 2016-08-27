/*
Utility methods
*/
mejs.Utility = {
    secondsToTimeCode: function(time) {
        var hours = Math.floor(time / 3600) % 24,
            minutes = Math.floor(time / 60) % 60,
            seconds = Math.floor(time % 60);
        
        return (hours ? ('0' + hours).slice(-2) + ':' : '') +
                ('0' + minutes).slice(-2) + ':' +
                ('0' + seconds).slice(-2);
    },
    
    timeCodeToSeconds: function(hh_mm_ss) {
        var tc_array = hh_mm_ss.replace(',', '.').split(":"),
            tc_hh = parseInt(tc_array[0], 10),
            tc_mm = parseInt(tc_array[1], 10),
            tc_ss = parseFloat(tc_array[2]);
        
        return (tc_hh * 3600) + (tc_mm * 60) + tc_ss;
    },
    
    addToPixel: function(pixelString, addValue) {
        return (parseFloat(pixelString) || 0) + addValue;
    },
    
    createNestedElement: function(content) {
        var temp = document.createElement('div');
        temp.innerHTML = content;
        
        return temp.firstChild;
    },
    
    deBounce: function(func, timeout) {
        var timer = null;
        
        return function() {
            var a = Array.prototype.slice.call(arguments);
            
            if(timer !== null) {
                clearTimeout(timer);
            }
            
            timer = setTimeout(function() {
                func.apply(null, a);
                timer = null;
            }, timeout || 500);
        };
    },
    
    getFromSettings: function(name, def_value, cb) {
        if(packaged_app) {
            var obj = {};
            obj[name] = def_value;
            chrome.storage.sync.get(
                obj,
                function(obj) {
                    res = obj[name];
                    cb(res);
                });
        } else {
            if(localStorage.getItem(name))
                cb(localStorage.getItem(name));
            else
                cb(def_value);
        }
    },
    
    setIntoSettings: function(name, value, cb) {
        if(packaged_app) {
            var obj = {};
            obj[name] = value;
            chrome.storage.sync.set(
                obj,
                cb);
        } else {
            localStorage.setItem(name, value);
            cb();
        }
    },
    
    unzip: function(zipFile, cb) {
        zip.createReader(new zip.BlobReader(zipFile), function(reader) {
            var temp = [];
            
            reader.getEntries(function(entries) {
                entries.forEach(function(entry, i) {
                    entry.getData(new zip.BlobWriter(), function(data) {
                        temp.push(new File([data], entry.filename));
                        
                        if(i === entries.length - 1) {
                            cb(temp);
                        }
                    })
                })
                
                return;
                // if(srt_entries.length > 1) {
                //     $('#label_srtname').css('visibility', 'hidden');
                //     $('#select_srtname').css('visibility', 'inherit');
                //     $('#select_srtname')
                //         .find('option')
                //         .remove()
                //         .end();
                //     for(var i = 0; i < srt_entries.length; i++) {
                //         $('#select_srtname')
                //             .append('<option value="' +
                //                 i + '">' +
                //                 srt_entries[i].filename +
                //                 '</option>');
                //     }
                //     $('#select_srtname').val('0');
                // }
                // $('#select_srtname').off("change");
                // $('#select_srtname').change(function(e) {
                //     loadZippedSrt(
                //         srt_entries[Number($('#select_srtname')[0].value)]
                //     );
                // });
            });
        }, function(error) {
            cb([]);
        });
    },
    
    gunzip: function(blob, cb) {
        zip.createGZipReader(new zip.BlobReader(blob), function(reader) {
            reader.gunzip(new zip.BlobWriter(), function(data) {
                cb(data);
            });
        });
    },
    
    webvvt: function(trackText) {
        // match start "chapter-" (or anythingelse)
        var pattern_identifier = /^([a-zA-z]+-)?[0-9]+$/,
            pattern_timecode = /^([0-9]{2}:[0-9]{2}:[0-9]{2}([,.][0-9]{1,3})?) --\> ([0-9]{2}:[0-9]{2}:[0-9]{2}([,.][0-9]{3})?)(.*)$/;
        
        var i = 0,
            lines = trackText.split(/\r?\n/),
            entries = {
                text: [],
                times: []
            },
            timecode,
            text;
        
        for(; i < lines.length; i++) {
            // check for the line number
            if(pattern_identifier.exec(lines[i])) {
                // skip to the next line where the start --> end time code should be
                i++;
                timecode = pattern_timecode.exec(lines[i]);
                
                if(timecode && i < lines.length) {
                    i++;
                    // grab all the (possibly multi-line) text that follows
                    text = lines[i];
                    i++;
                    
                    while(lines[i] !== '' && i < lines.length) {
                        text = text + '\n' + lines[i];
                        i++;
                    }
                    
                    // Text is in a different array so I can use .join
                    entries.text.push(text);
                    entries.times.push({
                        start: (mejs.Utility.timeCodeToSeconds(timecode[1]) == 0) ? 0.200 : mejs.Utility.timeCodeToSeconds(timecode[1]),
                        stop: mejs.Utility.timeCodeToSeconds(timecode[3]),
                        settings: timecode[5]
                    });
                }
            }
        }
        
        return entries;
    },
    
    ass: function(trackText) {
        var i,
            line,
            temp,
            lines = trackText.split(/\r?\n/),
            entries = {
                text: [],
                times: []
            };
        
        for(i = 0; i < lines.length; i++) {
            line = lines[i];
            
            if(line.startsWith('Dialogue: ')) {
                line = line.slice(10).split(',');
                
                if(line.length > 10) {
                    line.push(line.splice(9).join(','));
                }
                
                entries.text.push(line.pop().replace('\\N', '\n').replace(/\{.*?\}/g, ''));
                entries.times.push({
                    start: mejs.Utility.timeCodeToSeconds(line[1]),
                    stop: mejs.Utility.timeCodeToSeconds(line[2])
                });
            }
        }
        
        return entries;
    },
    
    // Thanks to Justin Capella: https://github.com/johndyer/mediaelement/pull/420
    dfxp: function(trackText) {
        trackText = $(trackText).filter("tt");
        
        var i = 0,
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
            var style,
                _temp_times = {
                    start: null,
                    stop: null,
                    style: null
                };
            
            if(lines.eq(i).attr("begin")) _temp_times.start = mejs.Utility.timeCodeToSeconds(lines.eq(i).attr("begin"));
            if(!_temp_times.start && lines.eq(i - 1).attr("end")) _temp_times.start = mejs.Utility.timeCodeToSeconds(lines.eq(i - 1).attr("end"));
            if(lines.eq(i).attr("end")) _temp_times.stop = mejs.Utility.timeCodeToSeconds(lines.eq(i).attr("end"));
            if(!_temp_times.stop && lines.eq(i + 1).attr("begin")) _temp_times.stop = mejs.Utility.timeCodeToSeconds(lines.eq(i + 1).attr("begin"));
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
};