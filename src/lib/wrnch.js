/*
Utility methods
*/
wrnch = {
    noop: function() {
        return undefined;
    },
    
    extend: function(o1, o2) {
        for(var prop in o2) {
            if(o2.hasOwnProperty(prop)) {
                o1[prop] = o2[prop];
            }
        }
        
        return o1;
    },
    
    b64toBlob: function(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 1024;
        
        function charCodeFromCharacter(c) {
            return c.charCodeAt(0);
        }
        
        var byteCharacters = atob(b64Data),
            byteArrays = [];
        
        for(var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            byteArrays.push(new Uint8Array(Array.prototype.map.call(byteCharacters.slice(offset, offset + sliceSize), charCodeFromCharacter)));
        }
        
        return new Blob(byteArrays, {
            type: contentType
        });
    },
    
    secondsToTimeCode: function(time) {
        var hours = Math.floor(time / 3600) % 24,
            minutes = Math.floor(time / 60) % 60,
            seconds = Math.floor(time % 60);
        
        return (hours ? ('0' + hours).slice(-2) + ':' : '') +
                ('0' + minutes).slice(-2) + ':' +
                ('0' + seconds).slice(-2);
    },
    
    timeCodeToSeconds: function(hh_mm_ss) {
        var tc_array = hh_mm_ss.replace(',', '.').split(':'),
            tc_hh = parseInt(tc_array[0], 10),
            tc_mm = parseInt(tc_array[1], 10),
            tc_ss = parseFloat(tc_array[2]);
        
        return (tc_hh * 3600) + (tc_mm * 60) + tc_ss;
    },
    
    addToPixel: function(pixelString, addValue) {
        return (parseFloat(pixelString) || 0) + addValue;
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
    
    storage: {
        get: function(key, def_value, cb) {
            var temp = {};
            temp[key] = def_value;
            
            chrome.storage.sync.get(temp, function(obj) {
                cb(obj[key]);
            });
        },
        
        set: function(key, value, cb) {
            var temp = {};
            temp[key] = value;
            
            chrome.storage.sync.set(temp, cb);
        }
    },
    
    unzip: function(zipFile, cb) {
        zip.createReader(new zip.BlobReader(zipFile), function(reader) {
            var temp = [];
            
            reader.getEntries(function(entries) {
                wrnch.forEachSync(entries, function(entry, i, next) {
                    entry.getData(new zip.BlobWriter(), function(data) {
                        temp.push(new File([data], entry.filename));
                        
                        if(i === entries.length - 1) {
                            cb(temp);
                        }
                        
                        next();
                    });
                });
            });
        }, function() {
            cb([]);
        });
    },
    
    gunzip: function(data, cb) {
        zip.createGZipReader(new zip.BlobReader(wrnch.b64toBlob(data)), function(reader) {
            reader.gunzip(new zip.BlobWriter(), function(data) {
                cb(data);
            });
        });
    },
    
    forEachSync: function(array, action) {
        var i = -1,
            len = array.length,
            next = function() {
                if(++i === len) {
                    return;
                }
                
                action(array[i], i, next);
            };
        
        next();
    },
    
    webvvt: function(trackText) {
        // match start 'chapter-' (or anythingelse)
        var pattern_identifier = /^([a-zA-z]+-)?[0-9]+$/,
            pattern_timecode = /^([0-9]{2}:[0-9]{2}:[0-9]{2}([,.][0-9]{1,3})?) --\> ([0-9]{2}:[0-9]{2}:[0-9]{2}([,.][0-9]{3})?)(.*)$/;
        
        var i,
            lines = trackText.split(/\r?\n/),
            entries = {
                text: [],
                times: []
            },
            timecode,
            text;
        
        for(i = 0; i < lines.length; i++) {
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
                    
                    while(lines[i]) {
                        text += '\n' + lines[i++];
                    }
                    
                    // Text is in a different array so I can use .join
                    entries.text.push(text);
                    entries.times.push({
                        start: wrnch.timeCodeToSeconds(timecode[1]),
                        stop: wrnch.timeCodeToSeconds(timecode[3]),
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
                    start: wrnch.timeCodeToSeconds(line[1]),
                    stop: wrnch.timeCodeToSeconds(line[2])
                });
            }
        }
        
        return entries;
    },
    
    dfxp: function(trackText) {
        var pattern = /<p begin="(.*?)" end="(.*?)">(.*?)<\/p>/gi,
            match,
            entries = {
                text: [],
                times: []
            };
        
        while(match = pattern.exec(trackText)) {
            entries.text.push(match[3]);
            entries.times.push({
                start: wrnch.timeCodeToSeconds(match[1]),
                stop: wrnch.timeCodeToSeconds(match[2])
            });
        }
        
        return entries;
    },
    
    smi: function(trackText) {
        var pattern = /<SYNC START=(\d+?)><P Class=.*?>((?:.|\s)+?)<SYNC START=(\d+?)><P Class=.*?>/gi,
            match,
            entries = {
                text: [],
                times: []
            };
        
        while(match = pattern.exec(trackText)) {
            entries.text.push(match[2]);
            entries.times.push({
                start: parseInt(match[1]) / 1000,
                stop: parseInt(match[3]) / 1000
            });
        }
        
        return entries;
    }
};
