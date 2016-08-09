package {
    import flash.display.*;
    import flash.events.*;
    import flash.media.*;
    import flash.net.*;
    import flash.text.*;
    import flash.system.*;

    import flash.media.Video;
    import flash.net.NetConnection;
    import flash.net.NetStream;

    import flash.geom.ColorTransform;

    import flash.filters.DropShadowFilter;
    import flash.external.ExternalInterface;
    import flash.geom.Rectangle;

    import htmlelements.IMediaElement;
    import htmlelements.VideoElement;

    [SWF(backgroundColor="0x000000")] // Set SWF background color
    public class FlashMediaElement extends MovieClip {

        private var _mediaUrl:String;
        private var _debug:Boolean = false;
        private var _video:DisplayObject;
        private var _enableSmoothing:Boolean;
        private var _allowedPluginDomain:String;
        private var _isFullScreen:Boolean = false;
        private var _streamer:String = "";
        private var _enablePseudoStreaming:Boolean;
        private var _pseudoStreamingStartQueryParam:String;
        private var _fill:Boolean;

        // native video size (from meta data)
        private var _nativeVideoWidth:Number = 0;
        private var _nativeVideoHeight:Number = 0;

        // visual elements
        private var _mediaElementDisplay:FlashMediaElementDisplay = new FlashMediaElementDisplay();
        private var _output:TextField;

        // media
        private var _mediaElement:IMediaElement;

        // connection to fullscreen
        private var _connection:LocalConnection;
        private var _connectionName:String;
        
        // security checkes
        private var securityIssue:Boolean = false; // When SWF parameters contain illegal characters
        private var directAccess:Boolean = false; // When SWF visited directly with no parameters (or when security issue detected)
        
        public function FlashMediaElement() {
            
            if (isIllegalQuerystring()) {
                return;
            }
            
            // allows this player to be called from a different domain than the HTML page hosting the player
            CONFIG::cdnBuild {
                Security.allowDomain("*");
                Security.allowInsecureDomain('*');
            }
            
            var params:Object = LoaderInfo(this.root.loaderInfo).parameters;
            
            CONFIG::debugBuild {
                _debug = (params['debug'] != undefined) ? (String(params['debug']) == "true") : false;
            }
            if (_debug) {
                // add debug output
                var _outputFormat:TextFormat = new TextFormat();
                _outputFormat.size = 14;
                _outputFormat.bold = true;
                _output = new TextField();
                _output.defaultTextFormat = _outputFormat;
                _output.textColor = 0xeeeeee;
                _output.width = stage.stageWidth;
                _output.height = stage.stageHeight;
                _output.multiline = true;
                _output.wordWrap = true;
                _output.border = false;
                _output.filters = [new DropShadowFilter(1, 0x000000, 45, 1, 2, 2, 1)];
                _output.text = "Initializing Flash...\n";
                _output.visible = _debug;
                addChild(_output);
            }
            _mediaUrl = (params['file'] != undefined) ? String(params['file']) : "";
            _enableSmoothing = (params['smoothing'] != undefined) ? (String(params['smoothing']) == "true") : false;
            _enablePseudoStreaming = (params['pseudostreaming'] != undefined) ? (String(params['pseudostreaming']) == "true") : false;
            _pseudoStreamingStartQueryParam = (params['pseudostreamstart'] != undefined) ? (String(params['pseudostreamstart'])) : "start";
            _streamer = (params['flashstreamer'] != undefined) ? (String(params['flashstreamer'])) : "";
            _fill = (params['fill'] != undefined) ? (String(params['fill']) == "true") : false;
            
            // setup stage and player sizes/scales
            stage.align = StageAlign.TOP_LEFT;
            stage.scaleMode = StageScaleMode.NO_SCALE;
            this.addChild(_mediaElementDisplay);
            stage.addChild(this);

            // create media element
            _mediaElement = new VideoElement(this, _autoplay, _preload, _timerRate, _startVolume, _streamer);
            _video = (_mediaElement as VideoElement).video;
            _video.width = stage.stageWidth;
            _video.height = stage.stageHeight;
            (_video as Video).smoothing = _enableSmoothing;
            (_mediaElement as VideoElement).setReference(this);
            (_mediaElement as VideoElement).setPseudoStreaming(_enablePseudoStreaming);
            (_mediaElement as VideoElement).setPseudoStreamingStartParam(_pseudoStreamingStartQueryParam);
            //_video.scaleMode = VideoScaleMode.MAINTAIN_ASPECT_RATIO;
            addChild(_video);
            
            logMessage("stage: " + stage.stageWidth + "x" + stage.stageHeight);
            logMessage("file: " + _mediaUrl);
            logMessage("autoplay: " + _autoplay.toString());
            logMessage("preload: " + _preload.toString());
            logMessage("isvideo: " + _isVideo.toString());
            logMessage("smoothing: " + _enableSmoothing.toString());
            logMessage("timerrate: " + _timerRate.toString());
            logMessage("displayState: " +(stage.hasOwnProperty("displayState")).toString());

            // attach javascript
            logMessage("ExternalInterface.available: " + ExternalInterface.available.toString());
            logMessage("ExternalInterface.objectID: " + ((ExternalInterface.objectID != null) ? ExternalInterface.objectID.toString() : "null"));

            if (_mediaUrl != "") {
                _mediaElement.setSrc(_mediaUrl);
            }

            if (_output != null) {
                addChild(_output);
            }

            if (ExternalInterface.available) {
                try {
                    if (ExternalInterface.objectID != null && ExternalInterface.objectID.toString() != "") {
                        // add HTML media methods
                        ExternalInterface.addCallback("play", playMedia);
                        ExternalInterface.addCallback("load", loadMedia);
                        ExternalInterface.addCallback("pause", pauseMedia);
                        ExternalInterface.addCallback("stop", stopMedia);

                        ExternalInterface.addCallback("setSrc", setSrc);
                        ExternalInterface.addCallback("setCurrentTime", setCurrentTime);
                        ExternalInterface.addCallback("setVolume", setVolume);
                        ExternalInterface.addCallback("setMuted", setMuted);
                        
                        ExternalInterface.addCallback("setFullscreen", setFullscreen);
                        ExternalInterface.addCallback("setVideoSize", setVideoSize);
                        
                        // fire init method
                        ExternalInterface.call(ExternalInterface.objectID + '_init');
                        logMessage("Init js function \"" + ExternalInterface.objectID + '_init' + "\" successfully called.");
                    }
                    else {
                        logMessage("ExternalInterface has no object id:");
                    }
                } catch (error:SecurityError) {
                    logMessage("A SecurityError occurred: " + error.message);
                } catch (error:Error) {
                    logMessage("An Error occurred: " + error.message);
                }
            }

            // listen for resize
            stage.addEventListener(Event.RESIZE, resizeHandler);
            // resize
            stage.addEventListener(FullScreenEvent.FULL_SCREEN, stageFullScreenChanged);
        }

        public function logMessage(txt:String):void {
            if (!_debug) {
                return;
            }
            
            ExternalInterface.call("console.log", txt);
            
            if (_output != null) {
                _output.appendText(txt + "\n");
                if (ExternalInterface.objectID != null && ExternalInterface.objectID.toString() != "") {
                    var pattern:RegExp = /'/g; //'
                    ExternalInterface.call("setTimeout", ExternalInterface.objectID + "_event('message','" + txt.replace(pattern, "’") + "')", 0);
                }
            }
        }

        private function isIllegalQuerystring():Boolean {
            var query:String = '';
            var pos:Number = root.loaderInfo.url.indexOf('?') ;
            
            if ( pos > -1 ) {
                query = root.loaderInfo.url.substring( pos );
                if ( ! /^\?\d+$/.test( query ) ) {
                    return true;
                }
            }           
            
            return false;
        }

        private static function trim(str:String) : String {
            if (!str) {
                return str;
            }

            return str.toString().replace(/^\s*/, '').replace(/\s*$/, '');
        }

        public function toggleVolume(event:MouseEvent):void {
            //logMessage(event.currentTarget.name);
            switch(event.currentTarget.name) {
                case "muted_mc":
                    setMuted(false);
                    break;
                case "unmuted_mc":
                    setMuted(true);
                    break;
            }
        }
        // END: Controls
        
        public function resizeHandler(e:Event):void {
            repositionVideo();
        }
        
        // START: Fullscreen
        private function enterFullscreen():void {
            logMessage("enterFullscreen()");
            
            var screenRectangle:Rectangle = new Rectangle(0, 0, stage.fullScreenWidth, stage.fullScreenHeight);
            stage.fullScreenSourceRect = screenRectangle;
            
            stage.displayState = StageDisplayState.FULL_SCREEN;

            repositionVideo();

            _isFullScreen = true;
        }

        private function exitFullscreen():void {
            stage.displayState = StageDisplayState.NORMAL;

            repositionVideo();

            _isFullScreen = false;
        }

        public function setFullscreen(gofullscreen:Boolean):void {

            logMessage("setFullscreen: " + gofullscreen.toString());

            try {
                if (gofullscreen) {
                    enterFullscreen();
                } else {
                    exitFullscreen();
                }
            } catch (error:Error) {

                _isFullScreen = false;

                logMessage("error setting fullscreen: " + error.message.toString());
            }
        }

        public function stageFullScreenChanged(e:FullScreenEvent):void {
            logMessage("fullscreen event: " + e.fullScreen.toString());

            _isFullScreen = e.fullScreen;
            
            repositionVideo();
            hideFullscreenButton();

            sendEvent(HtmlMediaEvent.FULLSCREENCHANGE, "isFullScreen:" + e.fullScreen );


        }
        // END: Fullscreen

        // START: external interface
        public function playMedia():void {
            logMessage("play");
            _mediaElement.play();
        }

        public function loadMedia():void {
            logMessage("load");
            _mediaElement.load();
        }

        public function pauseMedia():void {
            logMessage("pause");
            _mediaElement.pause();
        }

        public function setSrc(url:String):void {
            logMessage("setSrc: " + url);
            _mediaElement.setSrc(url);
        }

        public function stopMedia():void {
            logMessage("stop");
            _mediaElement.stop();
        }

        public function setCurrentTime(time:Number):void {
            logMessage("seek: " + time.toString());
            _mediaElement.setCurrentTime(time);
        }

        public function setVolume(volume:Number):void {
            logMessage("volume: " + volume.toString());
            _mediaElement.setVolume(volume);
            toggleVolumeIcons(volume);
        }

        public function setMuted(muted:Boolean):void {
            logMessage("muted: " + muted.toString());
            _mediaElement.setMuted(muted);
            toggleVolumeIcons(_mediaElement.getVolume());
        }

        public function setVideoSize(width:Number, height:Number):void {
            logMessage("setVideoSize: " + width.toString() + "," + height.toString());

            if (_video != null) {
                _nativeVideoWidth = width;
                _nativeVideoHeight = height;
                repositionVideo();
                positionControls();
                logMessage("result: " + _video.width.toString() + "," + _video.height.toString());
            }
        }

        // END: external interface

        private function repositionVideo():void {
            var fill:Boolean = _fill;
            var contWidth:Number;
            var contHeight:Number;
            if (_isFullScreen) {
                contWidth = stage.fullScreenWidth;
                contHeight = stage.fullScreenHeight;
            } else {
                contWidth = stage.stageWidth;
                contHeight = stage.stageHeight;
            }

            logMessage("Positioning video ("+stage.displayState+"). Container size: "+contWidth+"x"+contHeight+".");

            if (_mediaElement is VideoElement || _mediaElement is HLSMediaElement) {
                if (_isFullScreen && fill) {
                    fill = false;
                }
                if (isNaN(_nativeVideoWidth) || isNaN(_nativeVideoHeight) || _nativeVideoWidth <= 0 || _nativeVideoHeight <= 0) {
                    logMessage("Positionning: video's native dimension not found, using stage size.");
                    fill = true;
                }
                // calculate ratios
                var stageRatio:Number, nativeRatio:Number;
                _video.x = 0;
                _video.y = 0;
                if (fill) {
                    _mediaElement.setSize(contWidth, contHeight);
                } else {
                    stageRatio = contWidth/contHeight;
                    nativeRatio = _nativeVideoWidth/_nativeVideoHeight;
                    // adjust size and position
                    if (nativeRatio > stageRatio) {
                        _mediaElement.setSize(contWidth, _nativeVideoHeight * contWidth / _nativeVideoWidth);
                        _video.y = contHeight/2 - _video.height/2;
                    } else if (stageRatio > nativeRatio) {
                        _mediaElement.setSize(_nativeVideoWidth * contHeight / _nativeVideoHeight, contHeight);
                        _video.x = contWidth/2 - _video.width/2;
                    } else if (stageRatio == nativeRatio) {
                        _mediaElement.setSize(contWidth, contHeight);
                    }
                }
            } else if (_mediaElement is YouTubeElement || _mediaElement is DailyMotionElement) {
                _mediaElement.setSize(contWidth, contHeight);
            }
            positionControls();
        }

        // SEND events to JavaScript
        public function sendEvent(eventName:String, eventValues:String):void {

            // special video event
            if (eventName == HtmlMediaEvent.LOADEDMETADATA && _isVideo) {

                logMessage("Metadata received:");

                try {
                    if (_mediaElement is VideoElement) {
                        _nativeVideoWidth = (_mediaElement as VideoElement).videoWidth;
                        _nativeVideoHeight = (_mediaElement as VideoElement).videoHeight;
                    } else if (_mediaElement is HLSMediaElement) {
                        _nativeVideoWidth = (_mediaElement as HLSMediaElement).videoWidth;
                        _nativeVideoHeight = (_mediaElement as HLSMediaElement).videoHeight;

                        // Can not get video dimensions from HLS stream, use parameters in FlashVars instead.
                        if (isNaN(_nativeVideoWidth) || isNaN(_nativeVideoHeight) || _nativeVideoWidth <= 0 || _nativeVideoHeight <= 0) {
                            _nativeVideoWidth = _paramVideoWidth;
                            _nativeVideoHeight = _paramVideoHeight;
                        }
                    }
                } catch (e:Error) {
                    logMessage("    No resolution: " + e.toString());
                }

                logMessage("    Resolution: " + _nativeVideoWidth.toString() + "x" + _nativeVideoHeight.toString());

                if (_isFullScreen) {
                    setVideoSize(_nativeVideoWidth, _nativeVideoHeight);
                }
                repositionVideo();
            }

            //trace((_mediaElement.duration()*1).toString() + " / " + (_mediaElement.currentTime()*1).toString());
            //trace("CurrentProgress:"+_mediaElement.currentProgress());

            if (ExternalInterface.objectID != null && ExternalInterface.objectID.toString() != "") {
                //logMessage("event:" + eventName + " : " + eventValues);
                //trace("event", eventName, eventValues);

                if (eventValues == null)
                    eventValues == "";

                if (_isVideo) {
                    eventValues += (eventValues != "" ? "," : "") + "isFullScreen:" + _isFullScreen;
                }

                eventValues = "{" + eventValues + "}";

                // use set timeout for performance reasons
                ExternalInterface.call("setTimeout", ExternalInterface.objectID + '_event' + "('" + eventName + "'," + eventValues + ")", 0);
            }
        }
        
        // START: utility
        private function secondsToTimeCode(seconds:Number):String {
            var timeCode:String = "";
            seconds = Math.round(seconds);
            var minutes:Number = Math.floor(seconds / 60);
            timeCode = (minutes >= 10) ? minutes.toString() : "0" + minutes.toString();
            seconds = Math.floor(seconds % 60);
            timeCode += ":" + ((seconds >= 10) ? seconds.toString() : "0" + seconds.toString());
            return timeCode; //minutes.toString() + ":" + seconds.toString();
        }

        private function applyColor(item:Object, color:String):void {
            var myColor:ColorTransform = new ColorTransform(0, 0, 0, 1);
            var components:Array = color.split(",");
            switch (components.length) {
                case 4:
                    myColor.redOffset = components[0];
                    myColor.greenOffset = components[1];
                    myColor.blueOffset = components[2];
                    myColor.alphaMultiplier = components[3];
                    break;
                case 3:
                    myColor.redOffset = components[0];
                    myColor.greenOffset = components[1];
                    myColor.blueOffset = components[2];
                    break;
                default:
                    myColor.color = Number(color);
                    break;
            }
            //trace("Length: "+components.length+" String: "+color+" transform: "+myColor.toString());
            item.transform.colorTransform = myColor;
        }
        // END: utility
    }
}