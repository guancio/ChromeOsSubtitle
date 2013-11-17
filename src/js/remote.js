var address = null;

var stringToUint8Array = function(string) {
    var buffer = new ArrayBuffer(string.length);
    var view = new Uint8Array(buffer);
    for(var i = 0; i < string.length; i++) {
	view[i] = string.charCodeAt(i);
    }
    return view;
};

var arrayBufferToString = function(buffer) {
    var str = '';
    var uArrayVal = new Uint8Array(buffer);
    for(var s = 0; s < uArrayVal.length; s++) {
	str += String.fromCharCode(uArrayVal[s]);
    }
    return str;
};

var writeErrorResponse = function(socketId, errorCode, keepAlive) {
    var file = { size: 0 };
    console.info("writeErrorResponse:: begin... ");
    console.info("writeErrorResponse:: file = " + file);
    var contentType = "text/plain"; //(file.type === "") ? "text/plain" : file.type;
    var contentLength = file.size;
    var header = stringToUint8Array("HTTP/1.0 " + errorCode + " Not Found\nContent-length: " + file.size + "\nContent-type:" + contentType + ( keepAlive ? "\nConnection: keep-alive" : "") + "\n\n");
    console.info("writeErrorResponse:: Done setting header...");
    var outputBuffer = new ArrayBuffer(header.byteLength + file.size);
    var view = new Uint8Array(outputBuffer)
    view.set(header, 0);
    console.info("writeErrorResponse:: Done setting view...");
    chrome.socket.write(socketId, outputBuffer, function(writeInfo) {
	console.log("WRITE", writeInfo);
	if (keepAlive) {
            readFromSocket(socketId);
	} else {
            chrome.socket.destroy(socketId);
            chrome.socket.accept(socketInfo.socketId, onAccept);
	}
    });
    console.info("writeErrorResponse::filereader:: end onload...");

    console.info("writeErrorResponse:: end...");
};

var write200Response = function(socketId, keepAlive, content, contentType) {
    var contentType = (contentType) ? contentType : "text/plain";
    var contentLength = content.length;
    var header = stringToUint8Array("HTTP/1.0 200 OK\nContent-length: " + content.length + "\nContent-type:" + contentType + ( keepAlive ? "\nConnection: keep-alive" : "") + "\n\n");
    var outputBuffer = new ArrayBuffer(header.byteLength + content.length);
    var view = new Uint8Array(outputBuffer)
    view.set(header, 0);

    view.set(stringToUint8Array(content), header.byteLength);
    chrome.socket.write(socketId, outputBuffer, function(writeInfo) {
        console.log("WRITE", writeInfo);
        if (keepAlive) {
	    readFromSocket(socketId);
        } else {
	    chrome.socket.destroy(socketId);
	    chrome.socket.accept(socketInfo.socketId, onAccept);
        }
    });
};

// Do not discover localhost
chrome.socket.getNetworkList(function(interfaces) {
    for(var i in interfaces) {
	var iface = interfaces[i];
	console.log(iface.name + " - " + iface.address);
    }
    address = interfaces[0].address;
    startServer(address);
});

var socketInfo = null;
var startServer = function (add) {
    chrome.socket.create("tcp", {}, function(_socketInfo) {
	socketInfo = _socketInfo;
	chrome.socket.listen(socketInfo.socketId, add, 9999, 50, function(result) {
            console.log("LISTENING:", result);
            chrome.socket.accept(socketInfo.socketId, onAccept);
	});
    });
}

var onAccept = function(acceptInfo) {
    console.log("ACCEPT", acceptInfo)
    readFromSocket(acceptInfo.socketId);
};

var readFromSocket = function(socketId) {
    //  Read in the data
    chrome.socket.read(socketId, function(readInfo) {
	console.log("READ", readInfo);
      // Parse the request.
	var data = arrayBufferToString(readInfo.data);
	console.log("DATA", data)
	if(data.indexOf("GET ") != 0) {
	    chrome.socket.destroy(socketId);
	    return;
	}
	    
        var keepAlive = false;
        if (data.indexOf("Connection: keep-alive") != -1) {
	    //keepAlive = true;
        }

        // we can only deal with GET requests
        var uriEnd =  data.indexOf(" ", 4);
        if(uriEnd < 0) { /* throw a wobbler */ return; }
        var uri = data.substring(4, uriEnd);
        // strip qyery string
        var q = uri.indexOf("?");
        if (q != -1) {
	    uri = uri.substring(0, q);
        }
	console.log("URI", uri);
	
	if (uri.indexOf("/static") == 0) {
	    serveStaticResource(uri, socketId, keepAlive);
	    return;
	}

        var handler = uriMap[uri];
        if(!!handler == false) {
	    console.warn("Handler does not exist..." + uri);
	    writeErrorResponse(socketId, 404, keepAlive);
	    return;
        }
	handler(socketId, keepAlive);
    });
};

var serveStaticResource = function (uri, socketId,  keepAlive) {
    var request = new XMLHttpRequest();
    request.onload = function () {
	console.log(this);
	write200Response(socketId, keepAlive, this.responseText, "text/html");
    };
    request.onabort = function () {
	writeErrorResponse(socketId, 404, keepAlive);
    };
    request.onerror = function () {
	writeErrorResponse(socketId, 404, keepAlive);
    };
    request.ontimeout = function () {
	writeErrorResponse(socketId, 404, keepAlive);
    };

    request.open("GET", uri, true);
    request.send();
}

var uriMap = {};

(function($) {
    $.extend(MediaElementPlayer.prototype, {
	buildremote: function(player, controls, layers, media) {
	    
	    uriMap = {
"/play": function (socketId,  keepAlive) {
    if (media.readyState == 4) {
	if (media.paused || media.ended) {
	    media.play();	
	} else {
	    media.pause();
	}
    }
    var res = "success";
    write200Response(socketId, keepAlive, res, "text/html");
}
	    }
	}
    });
})(mejs.$);