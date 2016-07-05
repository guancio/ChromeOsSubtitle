/*
Utility methods
*/
mejs.Utility = {
    encodeUrl: function(url) {
        return encodeURIComponent(url); //.replace(/\?/gi,'%3F').replace(/=/gi,'%3D').replace(/&/gi,'%26');
    },
    
    escapeHTML: function(s) {
        return s.toString().split('&').join('&amp;').split('<').join('&lt;').split('"').join('&quot;');
    },
    
    absolutizeUrl: function(url) {
        var el = document.createElement('div');
        el.innerHTML = '<a href="' + this.escapeHTML(url) + '">x</a>';
        
        return el.firstChild.href;
    },
    
    getScriptPath: function(scriptNames) {
        var
            i = 0,
            j,
            codePath = '',
            testname = '',
            slashPos,
            filenamePos,
            scriptUrl,
            scriptPath,
            scriptFilename,
            scripts = document.getElementsByTagName('script'),
            il = scripts.length,
            jl = scriptNames.length;
        
        // go through all <script> tags
        for(; i < il; i++) {
            scriptUrl = scripts[i].src;
            slashPos = scriptUrl.lastIndexOf('/');
            if(slashPos > -1) {
                scriptFilename = scriptUrl.substring(slashPos + 1);
                scriptPath = scriptUrl.substring(0, slashPos + 1);
            } else {
                scriptFilename = scriptUrl;
                scriptPath = '';
            }
            
            // see if any <script> tags have a file name that matches the 
            for(j = 0; j < jl; j++) {
                testname = scriptNames[j];
                filenamePos = scriptFilename.indexOf(testname);
                if(filenamePos > -1) {
                    codePath = scriptPath;
                    break;
                }
            }
            
            // if we found a path, then break and return it
            if(codePath !== '') {
                break;
            }
        }
        
        // send the best path back
        return codePath;
    },
    
    secondsToTimeCode: function(time, forceHours) {
        var hours = Math.floor(time / 3600) % 24,
            minutes = Math.floor(time / 60) % 60,
            seconds = Math.floor(time % 60),
            result = ((forceHours || hours > 0) ? (hours < 10 ? '0' + hours : hours) + ':' : '') +
                (minutes < 10 ? '0' + minutes : minutes) + ':' +
                (seconds < 10 ? '0' + seconds : seconds);
        
        return result;
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
    }
};