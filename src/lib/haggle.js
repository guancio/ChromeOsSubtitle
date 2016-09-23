(function() {
    function Haggle(el) {
        if(!(this instanceof Haggle))
            return new Haggle(el);
        
        if(el instanceof HTMLElement || el === document) {
            this.el = el;
            return this;
        }
        
        if(el.charAt(0) !== '<') {
            this.el = document.querySelector(el);
            
            if(this.el === null) {
                return undefined;
            }
        }
        else {
            var temp = document.createElement('div');
            temp.innerHTML = el;
            
            this.el = temp.firstChild;
        }
        
        return this;
    }
    
    Haggle.extend = function(o1, o2) {
        for(var prop in o2) {
            if(o2.hasOwnProperty(prop)) {
                o1[prop] = o2[prop];
            }
        }
        
        return o1;
    };
    
    Haggle.prototype.appendTo = function(el) {
        if(el instanceof Haggle) {
            el.el.appendChild(this.el);
            return this;
        }
        else if(el instanceof HTMLElement) {
            el.appendChild(this.el);
            return this;
        }
        else {
            return undefined;
        }
    };
    
    Haggle.prototype.append = function(el) {
        if(el instanceof Haggle) {
            this.el.appendChild(el.el);
            
            return this;
        }
        else if(el instanceof HTMLElement) {
            this.el.appendChild(el);
            
            return this;
        }
        else {
            return undefined;
        }
    };
    
    Haggle.prototype.css = function(arg) {
        if(arg instanceof Object) {
            Haggle.extend(this.el.style, arg);
            
            return this;
        }
        else {
            return this.el.style[arg];
        }
    };
    
    Haggle.prototype.find = function(query) {
        if(query.charAt(0) === '.') {
            return new Haggle(this.el.getElementsByClassName(query.slice(1))[0]);
        }
        else if(query.charAt(0) === '#') {
            var tempEl = document.getElementById(query.slice(1));
            
            return this.el.contains(tempEl) ? new Haggle(tempEl) : undefined;
        }
        else {
            return new Haggle(this.el.getElementsByTagName(query)[0]);
        }
    };
    
    Haggle.prototype.addClass = function(cl) {
        this.el.classList.add(cl);
        
        return this;
    };
    
    Haggle.prototype.removeClass = function(cl) {
        this.el.classList.remove(cl);
        
        return this;
    };
    
    Haggle.prototype.toggleClass = function(cl) {
        this.el.classList.toggle(cl);
        
        return this;
    };
    
    Haggle.prototype.on = function(events, handler, useCapture) {
        events = events.split(' ');
        
        for(var i = 0; i < events.length; i++) {
            if(events[i] !== '') {
                this.el.addEventListener(events[i], handler, useCapture);
            }
        }
        
        return this;
    };
    
    Haggle.prototype.off = function(events, handler) {
        events = events.split(' ');
        
        for(var i = 0; i < events.length; i++) {
            if(events[i] !== '') {
                this.el.removeEventListener(events[i], handler);
            }
        }
        
        return this;
    };
    
    Haggle.prototype.text = function(text) {
        this.el.innerText = text;
        
        return this;
    };
    
    Haggle.prototype.html = function(html) {
        this.el.innerHTML = html;
        
        return this;
    };
    
    Haggle.prototype.hide = function(useOpacity) {
        return this.css(useOpacity ? { 'opacity': 0 } : { 'visibility': 'hidden' });
    };
    
    Haggle.prototype.show = function(useOpacity) {
        return this.css(useOpacity ? { 'opacity': 1 } : { 'visibility': 'visible' });
    };
    
    Haggle.prototype.parent = function() {
        return this.el.parentElement;
    };
    
    Haggle.prototype.attr = function(arg) {
        if(typeof arg === 'object') {
            for(var prop in arg) {
                if(arg.hasOwnProperty(prop)) {
                    this.el[prop] = arg[prop];
                }
            }
            
            return this;
        }
        else {
            return this.el[arg];
        }
    };
    
    Haggle.prototype.insertBefore = function(el) {
        this.parent().insertBefore(this.el, el instanceof Haggle ? el.el : el);
        
        return this;
    };
    
    Haggle.prototype.get = function() {
        return this.el;
    };
    
    //Thanks to http://youmightnotneedjquery.com/
    Haggle.prototype.offset = function() {
        var rect = this.el.getBoundingClientRect();
        
        return {
          top: rect.top + document.body.scrollTop,
          left: rect.left + document.body.scrollLeft
        };
    };
    
    Haggle.prototype.outerWidth = function() {
        return this.el.offsetWidth;
    };
    
    Haggle.prototype.trigger = function(event, data) {
        this.el.dispatchEvent(new CustomEvent(event, {
            detail: data
        }));
        
        return this;
    };
    
    window.$ = Haggle;
})();
