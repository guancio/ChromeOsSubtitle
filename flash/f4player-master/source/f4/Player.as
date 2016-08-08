/*
   ═ f4.Player ═════════════════════════════════════════════════════════════
   Software: f4.Player - flash video player
   Version: 1.3.5
   Support: http://gokercebeci.com/dev/f4player
   Author: goker.cebeci
   Contact: http://gokercebeci.com
   -------------------------------------------------------------------------
   License: Distributed under the GNU General Public License (GPLv3)
   http://www.gnu.org/copyleft/gpl.html
   This program is distributed in the hope that it will be useful - WITHOUT
   ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
   FITNESS FOR A PARTICULAR PURPOSE.
 ═══════════════════════════════════════════════════════════════════════════ */
package f4
{
	
	import flash.display.MovieClip;
	import flash.display.Loader;
	import flash.display.Stage;
	import flash.display.StageDisplayState;
	import flash.display.Bitmap;
	import flash.display.BitmapData;
	
	import flash.net.URLLoader;
	import flash.net.URLRequest;
	import flash.media.Video;
	import flash.media.SoundTransform
	import flash.events.NetStatusEvent;
	import flash.events.TimerEvent;
	import flash.events.Event;
	import flash.events.SecurityErrorEvent;
	import flash.events.AsyncErrorEvent;
	import flash.geom.Matrix;
	import flash.utils.Timer;
	
	import flash.external.ExternalInterface;
	import flashx.textLayout.formats.Float;
	
	public class Player extends MovieClip implements PlayerInterface
	{
		
		public var body:MovieClip;
		private var nc:NetConnection;
		private var v:Video;
		private var st:SoundTransform;
		private var togglepause:Boolean = false;
		private var volcache:Number = 0;
		private var duration:int;
		private var videoWidth:int;
		private var videoHeight:int;
		private var status:String;
		public var callback:Function;
		
		public var autoplay:String;
		
		public function Player()
		{
			
			body = new MovieClip();
			body.graphics.drawRoundRect(0, 0, 160, 90, 0, 0);
			
			nc = new NetConnection();
			nc.addEventListener(NetStatusEvent.NET_STATUS, nsEvent);
			nc.addEventListener(SecurityErrorEvent.SECURITY_ERROR, securityError);
			
			ExternalInterface.addCallback('pause', Pause);
			ExternalInterface.addCallback('play', Play);
		}
		
		// EVENTS
		// =============================================================
		public function nsEvent(e:NetStatusEvent):void
		{
			Log("NetStatusEvent: " + e.info.code);
			if (status != e.info.code)
			{
				switch (e.info.code)
				{
					case "NetConnection.Connect.Success": 
						Log('NetConnection connected to ' + stream);
						ns = new PlayerNetStream(nc);
						ns.addEventListener(NetStatusEvent.NET_STATUS, nsEvent);
						ns.bufferTime = 5; // buffer time 5 sec.
						ns.onMetaData = metaDataEvent;
						st = new SoundTransform();
						break;
				}
				status = e.info.code;
				if (callback != null)
					callback(Info());
			}
		}
		
		public function securityError(e:SecurityErrorEvent):void
		{
			this.Log("NetStatusEvent: " + e.text);
		}
		
		public function metaDataEvent(i:Object):void
		{
			this.Log('MetaData');
			duration = i.duration;
			videoWidth = i.width;
			videoHeight = i.height;
		}
		// =============================================================
		// =============================================================
		public function Callback(callback:Function):void
		{
			this.callback = callback;
			var timer:Timer = new Timer(100);
			var timerEvent = function(e:TimerEvent):void
			{
				var info:Object = Info();
				if (info.progress >= 100)
					timer.stop();
				if (nc.connected)
					callback(info);
			}
			timer.addEventListener(TimerEvent.TIMER, timerEvent);
			timer.start();
		}
		
		private function Info():Object
		{
			var playing:Number = ns ? (ns.time / duration).toFixed(2) : 0;
			return {'width': videoWidth, 'height': videoHeight, 'total': ns ? ns.bytesTotal : 0, 'loaded': ns ? ns.bytesLoaded : 0, 'progress': ns ? (ns.bytesLoaded / ns.bytesTotal).toFixed(2) : 0, 'duration': duration, 'time': ns ? ns.time : 0, 'playing': (playing > 1 ? 1 : playing), 'status': status};
		}
		
		public function Movie(w:int, h:int):Video
		{
			this.Log('Video dimensions: ' + w.toString() + 'x' + h.toString());
			v = new Video(w, h);
			v.smoothing = true;
			this.Log('NetConnection is: ' + nc.connected);
			v.attachNetStream(ns);
			return v;
		}
		
		public function Play(file:String):Boolean
		{
			if (nc.connected)
			{
					this.Log("Play file: " + file);
					ns.play(file);
			}
			else
			{
				nc.connect(null);
				nc.client = this;
			}
			return true;
		}
		
		public function Pause():Boolean
		{
			this.Log('Pause');
			if (togglepause)
			{
				togglepause = false;
				ns.resume();
			}
			else
			{
				togglepause = true;
				ns.pause();
			}
			return togglepause;
		}
		
		public function Volume(vol:Number)
		{
			this.Log('Volume: ' + vol.toString());
			st.volume = vol;
			ns.soundTransform = st;
		}
		
		public function Mute():Number
		{
			if (volcache)
			{
				this.Log('VolumeCache: ' + volcache.toString());
				st.volume = volcache;
				ns.soundTransform = st;
				volcache = 0;
			}
			else
			{
				this.Log('Mute');
				volcache = st.volume;
				st.volume = 0;
				ns.soundTransform = st;
			}
			return st.volume;
		}
		
		public function Fullscreen(stage:Stage):Boolean
		{
			this.Log('Fullscreen: ' + !(stage.displayState == StageDisplayState.FULL_SCREEN));
			if (stage.displayState == StageDisplayState.FULL_SCREEN)
			{
				stage.displayState = StageDisplayState.NORMAL;
				return false;
			}
			else
			{
				stage.displayState = StageDisplayState.FULL_SCREEN;
				return true;
			}
		}
		
		public function Seek(point:int):int
		{
			this.Log('Seek: ' + point.toString());
			ns.seek(point);
		}
		
		public function Log(log:String):void
		{
			trace(log);
			ExternalInterface.call("console.log", log);
		}
	}
}
