/*
 * Calculate OpenSubtitles hash
 * (Oscar Brito - aetheon@gmail.com)
 *
 * @param {File} file - a File obj contained on a DataTransfer
 * @param {Function} onComplete - the result callback
 */
var OpenSubtitlesHash = function(file, onComplete) {
    var HASH_CHUNK_SIZE = 64 * 1024;
    if(file.size < HASH_CHUNK_SIZE)
        HASH_CHUNK_SIZE = file.size;
    
    // sum chunk long values
    var sumChunk = function(arrayBuffer) {
        
        var view = new DataView(arrayBuffer);
        var hNumber = new dcodeIO.Long();
        
        for(var i = 0; i < arrayBuffer.byteLength; i += 8) {
            var low = view.getUint32(i, true);
            var high = view.getUint32(i + 4, true);
            
            var n = new dcodeIO.Long(low, high);
            hNumber = hNumber.add(n);
        }
        
        return hNumber;
    };
    
    // read chunk
    var readChunk = function(start, end, callback) {
        var reader = new FileReader();
        reader.onload = function(e) {
            // sum all long values on the chunk
            var number = sumChunk(e.currentTarget.result);
            
            if(callback)
                callback(number);
        }
        
        var blob = file.slice(start, end);
        reader.readAsArrayBuffer(blob);
    };
    
    // read the first chunk
    readChunk(0, HASH_CHUNK_SIZE, function(head) {
        // read the tail chunk
        var start = file.size - HASH_CHUNK_SIZE;
        if(start < 0)
            start = 0;
        
        readChunk(start, file.size, function(tail) {
            // sum all values            
            var sum = head.add(tail).add(new dcodeIO.Long(file.size));
            // convert to hex
            var sumHex = sum.toString(16);
            
            if(onComplete)
                onComplete(sumHex);
        });
    });
};