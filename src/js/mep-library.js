var mejs = {};

if(typeof Haggle !== 'undefined' && true) {
    mejs.$ = Haggle;
}
else if(typeof jQuery !== 'undefined') {
    mejs.$ = jQuery;
}