if(typeof Haggle !== 'undefined' && false) {
    mejs.$ = Haggle;
}
else if(typeof jQuery !== 'undefined') {
    mejs.$ = jQuery;
}