(function() {
    function properString(e) {
        return ((typeof e === 'string' || (e instanceof String)) && e !== '');
    }
    
    function Haggle(el) {
        if(!(this instanceof Haggle))
            return new Haggle(el);
        
        if(el instanceof HTMLElement) {
            this.el = el;
            return this;
        }
        
        if(!properString(el)) {
            return undefined;
        }
        
        if(el.charAt(0) !== '<') {
            this.el = Array.prototype.slice.call(document.querySelector(el));
            
            if(this.el === null){
                return undefined;
            }
        }
        else {
            var temp = document.createElement('div');
            temp.innerHTML = el;
            
            this.el = temp.children;
        }
        
        return this;
    }
    
    Haggle.extend = function(o1, o2) {
        if(!(o1 instanceof Object) || !(o2 instanceof Object)) {
            return undefined;
        }
        else {
            for(var prop in o2) {
                if(o2.hasOwnProperty(prop)) {
                    o1[prop] = o2[prop];
                }
            }
            
            return o1;
        }
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
        else if(e instanceof HTMLElement) {
            this.el.appendChild(el);
            return this;
        }
        else {
            return undefined;
        }
    };
    
    Haggle.prototype.css = function(arg) {
        if(properString(arg)) {
            return this.el.style[arg];
        }
        else if(arg instanceof Array) {
            var temp = {};
            
            for(var i = 0; i < arg.length; i++) {
                temp[arg[i]] = this.el.style[arg[i]];
            }
            
            return temp;
        }
        else if(arg instanceof Object) {
            for(var prop in arg) {
                if(arg.hasOwnProperty(prop)){
                    this.el.style[prop] = arg[prop];
                }
            }
            
            return this;
        }
        else {
            return undefined;
        }
    };
    
    Haggle.prototype.find = function(query) {
        if(!properString(query)) {
            return undefined;
        }
        
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
        if(!properString(cl)) {
            return undefined;
        }
        
        this.el.classList.add(cl);
        
        return this;
    };
    
    Haggle.prototype.removeClass = function(cl) {
        if(!properString(cl)) {
            return undefined;
        }
        
        this.el.classList.remove(cl);
        
        return this;
    };
    
    Haggle.prototype.on = function(events, handler, useCapture) {
        if(!properString(events)) {
            return undefined;
        }
        
        events = events.split(' ');
        
        for(var i = 0; i < events.length; i++) {
            if(events[i] !== '') {
                this.el.addEventListener(events[i], handler, useCapture);
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
    
    window.Haggle = Haggle;
})();