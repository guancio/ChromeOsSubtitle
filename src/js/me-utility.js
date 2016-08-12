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
    
    timeCodeToSeconds: function(hh_mm_ss_ff) {
        var tc_array = hh_mm_ss_ff.split(":"),
            tc_hh = parseInt(tc_array[0], 10),
            tc_mm = parseInt(tc_array[1], 10),
            tc_ss = parseInt(tc_array[2], 10);
        
        return (tc_hh * 3600) + (tc_mm * 60) + tc_ss;
    },
    
    convertSMPTEtoSeconds: function(SMPTE) {
        if(typeof SMPTE != 'string')
            return false;
        
        SMPTE = SMPTE.replace(',', '.');
        
        var secs = 0,
            decimalLen = (SMPTE.indexOf('.') != -1) ? SMPTE.split('.')[1].length : 0,
            multiplier = 1;
        
        SMPTE = SMPTE.split(':').reverse();
        
        for(var i = 0; i < SMPTE.length; i++) {
            multiplier = 1;
            if(i > 0) {
                multiplier = Math.pow(60, i);
            }
            secs += Number(SMPTE[i]) * multiplier;
        }
        return Number(secs.toFixed(decimalLen));
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
    }
};