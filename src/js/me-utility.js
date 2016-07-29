/*
Utility methods
*/
mejs.Utility = {
    encodeUrl: function(url) {
        return encodeURIComponent(url);
    },
    
    escapeHTML: function(s) {
        return s.toString().split('&').join('&amp;').split('<').join('&lt;').split('"').join('&quot;');
    },
    
    absolutizeUrl: function(url) {
        var el = document.createElement('div');
        el.innerHTML = '<a href="' + this.escapeHTML(url) + '">x</a>';
        
        return el.firstChild.href;
    },
    
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
    }
};