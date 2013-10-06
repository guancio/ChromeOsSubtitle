
zip.workerScriptsPath = "lib/";

(function($) {

	// add extra default options 
	$.extend(mejs.MepDefaults, {
		// this will automatically turn on a <track>
		startLanguage: '',

		tracksText: mejs.i18n.t('Captions/Subtitles'),
		
		// option to remove the [cc] button when no <track kind="subtitles"> are present
		hideCaptionsButtonWhenEmpty: true,

		// If true and we only have one track, change captions to popup
		toggleCaptionsButtonWhenOnlyOne: false,

		// #id or .class		
		slidesSelector: ''
	});

	$.extend(MediaElementPlayer.prototype, {
	
		hasChapters: false,

		buildtracks: function(player, controls, layers, media) {
			var t = this, 
				i, 
				options = '';

			player.chapters = 
					$('<div class="mejs-chapters mejs-layer"></div>')
						.prependTo(layers).hide();
			player.captions = 
					$('<div class="mejs-captions-layer mejs-layer"><div class="mejs-captions-position mejs-captions-position-hover"><span class="mejs-captions-text"></span></div></div>')
						.prependTo(layers).hide();
			player.captionsText = player.captions.find('.mejs-captions-text');

		    var encodings = [
			"utf-8",
			"ibm866",
			"iso-8859-2",
			"iso-8859-3",
			"iso-8859-4",
			"iso-8859-5",
			"iso-8859-6",
			"iso-8859-7",
			"iso-8859-8",
			"iso-8859-10",
			"iso-8859-13 ",
			"iso-8859-14",
			"iso-8859-15",
			"iso-8859-16",
			"koi8-r",
			"koi8-u",
			"windows-874",
			"windows-1250",
			"windows-1251",
			"windows-1252",
			"windows-1253",
			"windows-1254",
			"windows-1255",
			"windows-1256",
			"windows-1257",
			"windows-1258",
			"gbk",
			"gb18030",
			"euc-jp",
			"iso-2022-jp",
			"shift_jis",
			"euc-kr"];
		    var encoding_labels = [
			"UTF-8",
			"ibm866 Cyrillic",
			"iso-8859-2 Latin-2",
			"iso-8859-3 Latin-3",
			"iso-8859-4 Latin-4",
			"iso-8859-5 Cyrillic",
			"iso-8859-6 Arabic",
			"iso-8859-7 Greek",
			"iso-8859-8 Hebrew",
			"iso-8859-10 Latin-6",
			"iso-8859-13 ",
			"iso-8859-14",
			"iso-8859-15",
			"iso-8859-16",
			"koi8-r",
			"koi8-u",
			"windows-874",
			"windows-1250",
			"windows-1251",
			"windows-1252 US-ascii",
			"windows-1253",
			"windows-1254 Latin-5",
			"windows-1255",
			"windows-1256",
			"windows-1257",
			"windows-1258",
			"gbk Chinese",
			"gb18030",
			"euc-jp",
			"iso-2022-jp",
			"shift_jis",
			"euc-kr"];

		    var encodingText = '<li>'+
			'<label style="width:78px;float: left;padding: 4px 0px 0px 5px;">Encoding</label>'+
			'<select style="width:70px" id="encoding-selector" disabled="disabled">';
		    for (i=0; i<encodings.length; i++) {
			encodingText = encodingText + '<option value="'+encodings[i]+'">'+encoding_labels[i]+'</option>';
		    }
		    encodingText = encodingText +'</select></il>';



			player.captionsButton = 
					$('<div class="mejs-button mejs-captions-button mejs-captions-enabled">'+
						'<button type="button" aria-controls="' + t.id + '" title="' + t.options.tracksText + '" aria-label="' + t.options.tracksText + '"></button>'+
						'<div class="mejs-captions-selector">'+
							'<ul>'+
								'<li>'+
									'<input type="radio" name="' + player.id + '_captions" id="' + player.id + '_captions_none" value="none" checked="checked" />' +
									'<label for="' + player.id + '_captions_none">' + mejs.i18n.t('None') +'</label>'+
								'</li>'	+
								'<li class="mejs-captionload">'+
									'<input type="radio" name="' + player.id + '_captions" id="' + player.id + '_captions_enabled" value="enabled" disabled="disabled"/>' +
					  '<div class="mejs-button  mejs-captionload" >' +
					  '<button type="button" aria-controls="' + t.id + '" title="' + mejs.i18n.t('Load subtitle...') + '" aria-label="' + mejs.i18n.t('Load subtitle...') + '"></button>' +
 '</div>'+
'<input style="display:none" type="file" id="opensrtfile_input"/>' +
'<select id="select_srtname" style="padding: 0px 0px 0px 0px;text-overflow: ellipsis;width: 105px;height: 18px;overflow: hidden;white-space: nowrap;left:60px;position:absolute;visibility:hidden"/>'+
// '<select style="width:83px"><option>hello.srt</option><option>hjgfdshfjsdghfsjgfdsjgfsdjgfh.srt</option></select>'+ 
'<label id="label_srtname" style="padding: 0px 0px 0px 0px;text-overflow: ellipsis;width: 105px;height: 18px;overflow: hidden;white-space: nowrap;left:60px;position:absolute;">No subtitle</label>'+
'</li>'	+
					  encodingText +

							'</ul>'+
						'</div>'+
					'</div>')
						.appendTo(controls);

		    
		    player.captionEncodingSelect = player.captionsButton.find('#encoding-selector')[0];
		    player.captionsButton.find('#encoding-selector').change(function(e) {
			if (player.tracks.length == 0)
			    return;
			player.tracks[0].isLoaded = false;
			player.loadTrack(0);
		    });
		    var srtFileInputs = player.captionsButton.find('#opensrtfile_input');
		    srtFileInputs.change(function (e) {
			e.preventDefault();
			if (srtFileInputs[0].files.length != 1)
			    return false;
			
			player.openSrtEntry(srtFileInputs[0].files[0]);
			return false;
		    });
		    player.captionsButton.find('.mejs-captionload button').click(function(e) {
			e.preventDefault();
			srtFileInputs[0].click();
			return false;
		    });

				// hover
				player.captionsButton.hover(function() {
					$(this).find('.mejs-captions-selector').css('visibility','visible');

				}, function() {
					$(this).find('.mejs-captions-selector').css('visibility','hidden');
				})

				// handle clicks to the language radio buttons
				.on('click','input[type=radio]',function() {
					lang = this.value;
					player.setTrack(lang);
				});
		    
		    player.captionsButton.find('.mejs-captions-selector').bind('mouseenter mouseover mousemove',  function(event) {
			player.killControlsTimer('enter');
			event.stopPropagation();
		    });


		    

			if (!player.options.alwaysShowControls) {
				// move with controls
				player.container
					.bind('controlsshown', function () {
						// push captions above controls
						player.container.find('.mejs-captions-position').addClass('mejs-captions-position-hover');

					})
					.bind('controlshidden', function () {
						if (!media.paused) {
							// move back to normal place
							player.container.find('.mejs-captions-position').removeClass('mejs-captions-position-hover');
						}
					});
			} else {
				player.container.find('.mejs-captions-position').addClass('mejs-captions-position-hover');
			}

			player.trackToLoad = -1;
			player.selectedTrack = null;
			player.isLoadingTrack = false;

			
			// add to list
			for (i=0; i<player.tracks.length; i++) {
				if (player.tracks[i].kind == 'subtitles') {
					player.addTrackButton(player.tracks[i].srclang, player.tracks[i].label);
				}
			}

			// start loading tracks
			player.loadNextTrack();


			media.addEventListener('timeupdate',function(e) {
				player.displayCaptions();
			}, false);
			
			if (player.options.slidesSelector != '') {
				player.slidesContainer = $(player.options.slidesSelector);

				media.addEventListener('timeupdate',function(e) {
					player.displaySlides();	
				}, false);
			
			}

			media.addEventListener('loadedmetadata', function(e) {
				player.displayChapters();
			}, false);

			player.container.hover(
				function () {
					// chapters
					if (player.hasChapters) {
						player.chapters.css('visibility','visible');
						player.chapters.fadeIn(200).height(player.chapters.find('.mejs-chapter').outerHeight());
					}
				},
				function () {
					if (player.hasChapters && !media.paused) {
						player.chapters.fadeOut(200, function() {
							$(this).css('visibility','hidden');
							$(this).css('display','block');
						});
					}
				});
				
			// check for autoplay
			if (player.node.getAttribute('autoplay') !== null) {
				player.chapters.css('visibility','hidden');
			}

		    media.addEventListener('loadeddata',function() {
			if (player.tracks.length == 0) {
			    $('#' + t.id + '_captions_none').click();
			    t.captionsButton
				.find('input[value=enabled]')
				.prop('disabled',true);
			    t.captionsButton
				.find('#encoding-selector')
				.prop('disabled',true);
			    t.captionsButton
				.find('#label_srtname')[0]
				.textContent = "No subtitle";
			    $('#label_srtname').css('visibility','inherit');
			    $('#select_srtname').css('visibility','hidden');
			}
		    });

		    player.adjustLanguageBox();
		    player.capDelayValue = 0;
		},

	    openSrtEntry: function(file) {
		var t = this;
		$('#encoding-selector').val("UTF-8");
		t.tracks = [];
		t.tracks.push({
		    srclang: 'enabled',
		    file: file,
		    kind: 'subtitles',
		    label: 'Enabled',
		    entries: [],
		    isLoaded: false
		});
		$('#label_srtname').css('visibility','inherit');
		$('#select_srtname').css('visibility','hidden');

		if (file.name.lastIndexOf(".zip") != file.name.length - 4) {
		    $('#label_srtname')[0].textContent = file.name;
		    t.loadTrack(0);
		    return;
		}
				
		t.tracks[0].zipFile = file;
		zip.createReader(new zip.BlobReader(file), function(reader) {
		    // get all entries from the zip
		    reader.getEntries(function(entries) {
			if (entries.length == 0) {
			    return;
			}
			var srt_entries = [];
			for (var i=0; i<entries.length; i++) {
			    if (entries[i].filename.lastIndexOf(".srt") == entries[i].filename.length - 4)
				srt_entries.push(entries[i]);
			}
			if (srt_entries.length == 0) {
			    return;
			}
			if (srt_entries.length > 1) {
			    $('#label_srtname').css('visibility','hidden');
			    $('#select_srtname').css('visibility','inherit');
			    $('#select_srtname')
				.find('option')
				.remove()
				.end();
			    for (var i=0; i<srt_entries.length; i++) {
				$('#select_srtname')
				    .append('<option value="'+
					    i+'">'+
					    srt_entries[i].filename+
					    '</option>');
			    }
			    $('#select_srtname').val('0');
			}

			function loadZippedSrt(entry) {
			    // get first entry content as text
			    entry.getData(new zip.BlobWriter(), function(data) {
				// text contains the entry data as a blob
				t.tracks[0].file = data;
				t.tracks[0].isLoaded = false;
				
				$('#label_srtname')[0].textContent = entry.filename;
				t.loadTrack(0);
				
				// close the zip reader
				reader.close(function() {
				    // onclose callback
				});
			    }, function(current, total) {
				// onprogress callback
			    })
			};
			loadZippedSrt(srt_entries[0]);
			
			$('#select_srtname').off( "change");
			$('#select_srtname').change(function(e) {
			    loadZippedSrt(
				srt_entries[Number($('#select_srtname')[0].value)]
			    );
			});
		    });
		}, function(error) {
		    // onerror callback
		});
	    },
		
		setTrack: function(lang){
		
			var t = this,
				i;
		
			if (lang == 'none') {
				t.selectedTrack = null;
			} else {
				for (i=0; i<t.tracks.length; i++) {
					if (t.tracks[i].srclang == lang) {
						t.selectedTrack = t.tracks[i];
						t.captions.attr('lang', t.selectedTrack.srclang);
						t.displayCaptions();
						break;
					}
				}
			}
		},

		loadNextTrack: function() {
			var t = this;

			t.trackToLoad++;
			if (t.trackToLoad < t.tracks.length) {
				t.isLoadingTrack = true;
				t.loadTrack(t.trackToLoad);
			} else {
				// add done?
				t.isLoadingTrack = false;
				
				t.checkForTracks();	
			}
		},

		loadTrack: function(index){
			var
				t = this,
				track = t.tracks[index],
				after = function() {
					track.isLoaded = true;
					// create button
					//t.addTrackButton(track.srclang);
					t.enableTrackButton(track.srclang, track.label);
					t.loadNextTrack();
				};
		    var reader = new FileReader();
		    reader.onloadend = function(evt) {
			// parse the loaded file
			var d = evt.target.result;
			if (typeof d == "string" && (/<tt\s+xml/ig).exec(d)) {
			    track.entries = mejs.TrackFormatParser.dfxp.parse(d);					
			} else {	
			    track.entries = mejs.TrackFormatParser.webvvt.parse(d);
			}
			after();
			if (track.kind == 'chapters') {
			    t.media.addEventListener('play', function(e) {
				if (t.media.duration > 0) {
				    t.displayChapters(track);
				}
			    }, false);
			}
			if (track.kind == 'slides') {
			    t.setupSlides(track);
			}					
		    };
		    reader.onerror = function() {
			t.loadNextTrack();
		    };
		    reader.readAsText(track.file, t.captionEncodingSelect.value);
		},

		enableTrackButton: function(lang, label) {
			var t = this;
			
			if (label === '') {
				label = mejs.language.codes[lang] || lang;
			}			

			t.captionsButton
				.find('input[value=enabled]')
					.prop('disabled',false);
		        t.captionsButton
			.find('#encoding-selector')
			.prop('disabled',false);


		        $('#' + t.id + '_captions_enabled').click();

			t.adjustLanguageBox();
		},

		addTrackButton: function(lang, label) {
			var t = this;
			if (label === '') {
				label = mejs.language.codes[lang] || lang;
			}

			t.captionsButton.find('ul').append(
				$('<li>'+
					'<input type="radio" name="' + t.id + '_captions" id="' + t.id + '_captions_' + lang + '" value="' + lang + '" disabled="disabled" />' +
					'<label for="' + t.id + '_captions_' + lang + '">' + label + ' (loading)' + '</label>'+
				'</li>')
			);

			t.adjustLanguageBox();

			// remove this from the dropdownlist (if it exists)
			t.container.find('.mejs-captions-translations option[value=' + lang + ']').remove();
		},

		adjustLanguageBox:function() {
		    return;
			var t = this;
			// adjust the size of the outer box
			t.captionsButton.find('.mejs-captions-selector').height(
				t.captionsButton.find('.mejs-captions-selector ul').outerHeight(true) +
				t.captionsButton.find('.mejs-captions-translations').outerHeight(true)
			);
		},
		
		checkForTracks: function() {
			var
				t = this,
				hasSubtitles = false;
			
			// check if any subtitles
			if (t.options.hideCaptionsButtonWhenEmpty) {
				for (i=0; i<t.tracks.length; i++) {
					if (t.tracks[i].kind == 'subtitles') {
						hasSubtitles = true;
						break;
					}
				}	
					
				if (!hasSubtitles) {
					t.captionsButton.hide();
					t.setControlsSize();
				}													
			}		
		},

		displayCaptions: function() {

			if (typeof this.tracks == 'undefined')
				return;

			var
				t = this,
				i,
				track = t.selectedTrack;

		    var currTime = t.media.currentTime - t.capDelayValue;

			if (track != null && track.isLoaded) {
				for (i=0; i<track.entries.times.length; i++) {
					if (currTime >= track.entries.times[i].start && currTime <= track.entries.times[i].stop){
						t.captionsText.html(track.entries.text[i]);
						t.captions.show().height(0);
						return; // exit out if one is visible;
					}
				}
				t.captions.hide();
			} else {
				t.captions.hide();
			}
		},
		
		setupSlides: function(track) {
			var t = this;
				
			t.slides = track;
			t.slides.entries.imgs = [t.slides.entries.text.length];
			t.showSlide(0);
			
		},
		
		showSlide: function(index) {
			if (typeof this.tracks == 'undefined' || typeof this.slidesContainer == 'undefined') {
				return;			
			}
								
			var t = this,
				url = t.slides.entries.text[index],
				img = t.slides.entries.imgs[index];
				
			if (typeof img == 'undefined' || typeof img.fadeIn == 'undefined') {

				t.slides.entries.imgs[index] = img = $('<img src="' + url + '">')
						.on('load', function() {
							img.appendTo(t.slidesContainer)
								.hide()
								.fadeIn()
								.siblings(':visible')
									.fadeOut();							
						
						});
			
			} else {
			
				if (!img.is(':visible') && !img.is(':animated')) {
				
					console.log('showing existing slide');			
					
					img.fadeIn()
						.siblings(':visible')
							.fadeOut();			
				}
			}
				
		},
		
		displaySlides: function() {
		
			if (typeof this.slides == 'undefined')
				return;	
				
			var 
				t = this,
				slides = t.slides,
				i;				
		
			for (i=0; i<slides.entries.times.length; i++) {
				if (t.media.currentTime >= slides.entries.times[i].start && t.media.currentTime <= slides.entries.times[i].stop){
				
					t.showSlide(i);
					
					return; // exit out if one is visible;
				}
			}
		},

		displayChapters: function() {
			var 
				t = this,
				i;

			for (i=0; i<t.tracks.length; i++) {
				if (t.tracks[i].kind == 'chapters' && t.tracks[i].isLoaded) {
					t.drawChapters(t.tracks[i]);
					t.hasChapters = true;
					break;
				}
			}
		},

		drawChapters: function(chapters) {
			var 
				t = this,
				i,
				dur,
				//width,
				//left,
				percent = 0,
				usedPercent = 0;

			t.chapters.empty();

			for (i=0; i<chapters.entries.times.length; i++) {
				dur = chapters.entries.times[i].stop - chapters.entries.times[i].start;
				percent = Math.floor(dur / t.media.duration * 100);
				if (percent + usedPercent > 100 || // too large
					i == chapters.entries.times.length-1 && percent + usedPercent < 100) // not going to fill it in
					{
					percent = 100 - usedPercent;
				}
				//width = Math.floor(t.width * dur / t.media.duration);
				//left = Math.floor(t.width * chapters.entries.times[i].start / t.media.duration);
				//if (left + width > t.width) {
				//	width = t.width - left;
				//}

				t.chapters.append( $(
					'<div class="mejs-chapter" rel="' + chapters.entries.times[i].start + '" style="left: ' + usedPercent.toString() + '%;width: ' + percent.toString() + '%;">' + 
						'<div class="mejs-chapter-block' + ((i==chapters.entries.times.length-1) ? ' mejs-chapter-block-last' : '') + '">' + 
							'<span class="ch-title">' + chapters.entries.text[i] + '</span>' + 
							'<span class="ch-time">' + mejs.Utility.secondsToTimeCode(chapters.entries.times[i].start) + '&ndash;' + mejs.Utility.secondsToTimeCode(chapters.entries.times[i].stop) + '</span>' + 
						'</div>' +
					'</div>'));
				usedPercent += percent;
			}

			t.chapters.find('div.mejs-chapter').click(function() {
				t.media.setCurrentTime( parseFloat( $(this).attr('rel') ) );
				if (t.media.paused) {
					t.media.play(); 
				}
			});

			t.chapters.show();
		}
	});



	mejs.language = {
		codes:  {
			af:'Afrikaans',
			sq:'Albanian',
			ar:'Arabic',
			be:'Belarusian',
			bg:'Bulgarian',
			ca:'Catalan',
			zh:'Chinese',
			'zh-cn':'Chinese Simplified',
			'zh-tw':'Chinese Traditional',
			hr:'Croatian',
			cs:'Czech',
			da:'Danish',
			nl:'Dutch',
			en:'English',
			et:'Estonian',
			tl:'Filipino',
			fi:'Finnish',
			fr:'French',
			gl:'Galician',
			de:'German',
			el:'Greek',
			ht:'Haitian Creole',
			iw:'Hebrew',
			hi:'Hindi',
			hu:'Hungarian',
			is:'Icelandic',
			id:'Indonesian',
			ga:'Irish',
			it:'Italian',
			ja:'Japanese',
			ko:'Korean',
			lv:'Latvian',
			lt:'Lithuanian',
			mk:'Macedonian',
			ms:'Malay',
			mt:'Maltese',
			no:'Norwegian',
			fa:'Persian',
			pl:'Polish',
			pt:'Portuguese',
			//'pt-pt':'Portuguese (Portugal)',
			ro:'Romanian',
			ru:'Russian',
			sr:'Serbian',
			sk:'Slovak',
			sl:'Slovenian',
			es:'Spanish',
			sw:'Swahili',
			sv:'Swedish',
			tl:'Tagalog',
			th:'Thai',
			tr:'Turkish',
			uk:'Ukrainian',
			vi:'Vietnamese',
			cy:'Welsh',
			yi:'Yiddish'
		}
	};

	/*
	Parses WebVVT format which should be formatted as
	================================
	WEBVTT
	
	1
	00:00:01,1 --> 00:00:05,000
	A line of text

	2
	00:01:15,1 --> 00:02:05,000
	A second line of text
	
	===============================

	Adapted from: http://www.delphiki.com/html5/playr
	*/
	mejs.TrackFormatParser = {
		webvvt: {
			// match start "chapter-" (or anythingelse)
			pattern_identifier: /^([a-zA-z]+-)?[0-9]+$/,
			pattern_timecode: /^([0-9]{2}:[0-9]{2}:[0-9]{2}([,.][0-9]{1,3})?) --\> ([0-9]{2}:[0-9]{2}:[0-9]{2}([,.][0-9]{3})?)(.*)$/,

			parse: function(trackText) {
				var 
					i = 0,
					lines = mejs.TrackFormatParser.split2(trackText, /\r?\n/),
					entries = {text:[], times:[]},
					timecode,
					text;
				for(; i<lines.length; i++) {
					// check for the line number
					if (this.pattern_identifier.exec(lines[i])){
						// skip to the next line where the start --> end time code should be
						i++;
						timecode = this.pattern_timecode.exec(lines[i]);				

						if (timecode && i<lines.length){
							i++;
							// grab all the (possibly multi-line) text that follows
							text = lines[i];
							i++;
							while(lines[i] !== '' && i<lines.length){
								text = text + '\n' + lines[i];
								i++;
							}
							text = $.trim(text).replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, "<a href='$1' target='_blank'>$1</a>");
							// Text is in a different array so I can use .join
							entries.text.push(text);
							entries.times.push(
							{
								start: (mejs.Utility.convertSMPTEtoSeconds(timecode[1]) == 0) ? 0.200 : mejs.Utility.convertSMPTEtoSeconds(timecode[1]),
								stop: mejs.Utility.convertSMPTEtoSeconds(timecode[3]),
								settings: timecode[5]
							});
						}
					}
				}
				return entries;
			}
		},
		// Thanks to Justin Capella: https://github.com/johndyer/mediaelement/pull/420
		dfxp: {
			parse: function(trackText) {
				trackText = $(trackText).filter("tt");
				var 
					i = 0,
					container = trackText.children("div").eq(0),
					lines = container.find("p"),
					styleNode = trackText.find("#" + container.attr("style")),
					styles,
					begin,
					end,
					text,
					entries = {text:[], times:[]};


				if (styleNode.length) {
					var attributes = styleNode.removeAttr("id").get(0).attributes;
					if (attributes.length) {
						styles = {};
						for (i = 0; i < attributes.length; i++) {
							styles[attributes[i].name.split(":")[1]] = attributes[i].value;
						}
					}
				}

				for(i = 0; i<lines.length; i++) {
					var style;
					var _temp_times = {
						start: null,
						stop: null,
						style: null
					};
					if (lines.eq(i).attr("begin")) _temp_times.start = mejs.Utility.convertSMPTEtoSeconds(lines.eq(i).attr("begin"));
					if (!_temp_times.start && lines.eq(i-1).attr("end")) _temp_times.start = mejs.Utility.convertSMPTEtoSeconds(lines.eq(i-1).attr("end"));
					if (lines.eq(i).attr("end")) _temp_times.stop = mejs.Utility.convertSMPTEtoSeconds(lines.eq(i).attr("end"));
					if (!_temp_times.stop && lines.eq(i+1).attr("begin")) _temp_times.stop = mejs.Utility.convertSMPTEtoSeconds(lines.eq(i+1).attr("begin"));
					if (styles) {
						style = "";
						for (var _style in styles) {
							style += _style + ":" + styles[_style] + ";";					
						}
					}
					if (style) _temp_times.style = style;
					if (_temp_times.start == 0) _temp_times.start = 0.200;
					entries.times.push(_temp_times);
					text = $.trim(lines.eq(i).html()).replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, "<a href='$1' target='_blank'>$1</a>");
					entries.text.push(text);
					if (entries.times.start == 0) entries.times.start = 2;
				}
				return entries;
			}
		},
		split2: function (text, regex) {
			// normal version for compliant browsers
			// see below for IE fix
			return text.split(regex);
		}
	};
	
	// test for browsers with bad String.split method.
	if ('x\n\ny'.split(/\n/gi).length != 3) {
		// add super slow IE8 and below version
		mejs.TrackFormatParser.split2 = function(text, regex) {
			var 
				parts = [], 
				chunk = '',
				i;

			for (i=0; i<text.length; i++) {
				chunk += text.substring(i,i+1);
				if (regex.test(chunk)) {
					parts.push(chunk.replace(regex, ''));
					chunk = '';
				}
			}
			parts.push(chunk);
			return parts;
		}
	}	

})(mejs.$);
