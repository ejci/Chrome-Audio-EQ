/**
 * Script injected into to page
 */
/* global window,
 chrome,
 document,
 CONST
 */

document.addEventListener("DOMContentLoaded", function onDocLoad() {
	'use strict';

	var eqStatus = null;
	try {
		eqStatus = (localStorage ? localStorage.getItem('eq-status') : null);
	} catch (e) {
		//eat it! in case there are issues with allow-same-origin
		//TODO: Maybe I should the blacklistng info to chrome.storage in background.js per domain.
	}
	eqStatus = (eqStatus == null) ? 'enabled' : eqStatus;
	//console.log('EQ init...', document.location.hostname);
	if (eqStatus === 'enabled') {

		var eq = (function () {
			var audioContext = false;
			var targets = [];
			var filters = [];

			var init = function () {
				collectTargets();
				if (targets.length > 0) {
					//As there is a limitation for how many audio context can be run on same page
					//I need to check if there is a need to create on (if there are audio/video elements)
					//it was causing "crack" sound on page load -> https://github.com/ejci/Chrome-Audio-EQ/issues/18
					audioContext = new AudioContext();
				}
				if (!audioContext) {
					//no audio context? dont continue...
					//throw new Error("EQ was not initialized correctly!");
					return;
				} else {
					//console.log('Audio EQ init', document.location.hostname, targets);
				}
				filters = [];
				CONST.EQ.forEach(function (node, index) {
					var filter = false;
					if (node.f) {
						// Filter node
						filter = createFilter(node.f, node.type);
					} else {
						// Gain node
						filter = audioContext.createGain();
						filter.gain.value = 1;
						filter.channelCountMode = "explicit";
					}
					filters.push(filter);
				});
				attach();
			};

			function getHostName(url) {
				if ('blob:' == url.substring(0, 5)) {
					url = url.replace('blob:', '');
					url = unescape(url);
				}
				var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
				if (match !== null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
					return match[2];
				} else {
					return null;
				}
			}

			var createFilter = function (freq, type, gainValue) {
				if (!audioContext) {
					return;
				}
				var filter = audioContext.createBiquadFilter();
				filter.type = type || CONST.FT.LOWPASS;
				filter.gain.value = gainValue || 0;
				filter.Q.value = 1;
				filter.frequency.value = freq || 0;
				return filter;
			};

			var attach = function () {
				var source = false;
				if (!audioContext) {
					init();
					//throw new Error("EQ was not initialized correctly!");
				} else {

				}
				collectTargets();
				targets.forEach(function (target, index) {
					//console.log('target', target, index, target.getAttribute("eq-attached"));
					if (target.getAttribute("eq-attached") !== "true") {
						//this is a nasty hack
						//as some videos dont have crossorigin attribute im forcing the atribute
						//and then I need to force "reload" the src. its f***ed up but (kind off) it works :/
						//of course this will only work if the video src has Access-Control-Allow-Origin header set :(
						//Access-Control-Allow-Origin header is set by extension in headers.js
						//https://code.google.com/p/chromium/issues/detail?id=477364
						//in case media tags are using source tags we need to check for currentSrc instead of src attribute
						var src = (target.src ? target.src : target.currentSrc);

						var crossorigin = target.getAttribute('crossorigin');
						//console.log(target);
						if (src) {
							//console.log('src', src);
							//only reload if domains are not the same (so crossorigin attribute can kick in)
							//console.log(src, getHostName(src), document.location.hostname, (crossorigin ? crossorigin : 'anonymous'));
							if (document.location.hostname != getHostName(src) && 'blob:' != src.substring(0, 5) && !crossorigin) {
								target.setAttribute('crossorigin', (crossorigin ? crossorigin : 'anonymous'));
								//target.setAttribute('preload', 'auto');
								//force "reload" so addedd crossorigin attribute can kick in
								if (target.src) {
									target.src = '' + target.src;
									//target.load();
								} else {
									if (target.currentSrc) {
										if (!target.paused) {
											target.load();
										}

									}
								}
							}
							//setTimeout(function(){
							//	console.dir(target);
							//},2000)
							//console.log(target.src)
							//console.log(target.currentSrc)
							//console.dir(target);

							source = audioContext.createMediaElementSource(target);
							//read the source channel count
							filters[0]._defaultChannelCount = (source.channelCount) ? source.channelCount : 2;
							source.connect(filters[0]);
							var totalFilters = filters.length;
							var node;
							for (var i = 0; i < totalFilters; i++) {
								node = filters[i + 1];
								if (node) {
									filters[i].connect(node);
								}
							}

							filters[filters.length - 1].connect(audioContext.destination);
							target.setAttribute("eq-attached", "true");
						} else {
							//probably element is not initialized on creation so observer attribute changes
							//vimeo.com works like that. on load ther is only empty video tag <video preload></video>
							//TODO: probably should also destroy the observer once its initialized...
							var elementObserver = new MutationObserver(function (mutations, observer) {
								try {
									eq.attach();
								} catch (e) {
									//do nothing
									console.error(e);
									chrome.runtime.sendMessage({
										action: 'error',
										page: document.location.hostname,
										source: 'page.js',
										error: e
									});

								}
							});
							elementObserver.observe(target, {
								childList: false,
								subtree: false,
								attributes: true,
								characterData: false
							});
						}
					}
				});
			};

			/**
			 * Collect all video and audio tags
			 */
			var collectTargets = function () {
				var videos = document.getElementsByTagName('video');
				var audios = document.getElementsByTagName('audio');

				function collect(total, collection) {

					var index;
					if (total > 0) {
						for (index = 0; index < total; index++) {
							targets.push(collection[index]);
						}
					}
				}

				targets = [];
				collect(videos.length, videos);
				collect(audios.length, audios);

			};

			/**
			 *
			 * @param {Object} options
			 */
			var set = function (options) {
				//return;
				//console.log(filters, options);
				if (filters.length !== 0 && options && options.eq) {
					if (options.config && options.config.mono && options.config.mono === true) {
						filters[0].channelCount = 1;
					} else {
						filters[0].channelCount = (filters[0]._defaultChannelCount) ? filters[0]._defaultChannelCount : 2;
					}
					filters.forEach(function (filter, index) {
						filter.gain.value = options.eq[index].gain;
					});
				}
			};
			init();
			return {
				init: init,
				createFilter: createFilter,
				attach: attach,
				collectTargets: collectTargets,
				set: set
			};
		})();
		//console.log('eqStatus', eqStatus);

		/**
		 * Check for DOM changes
		 */
		try {
			var handleMutation, observer;
			//Get default values
			chrome.runtime.sendMessage({
				action: 'get'
			}, function (response) {
				eq.set({
					eq: response.eq,
					config: response.config
				});
			});
			//Listen to changes
			chrome.runtime.onMessage.addListener(function (request, sender, cb) {
				if (request.action == 'set') {
					eq.set({
						eq: request.eq,
						config: request.config
					});
					cb();
				}
				if (request.action == 'enable') {
					localStorage.setItem('eq-status', 'enabled');
					cb();
				}
				if (request.action == 'disable') {
					localStorage.setItem('eq-status', 'disabled');
					cb();
				}
			});

			/**
			 * Handle DOM mutation
			 * @param {Object} mutations
			 * @param {Object} observer
			 */
			handleMutation = function (mutations, observer) {
				//console.log(mutations[0])
				if (mutations[0].addedNodes.length) {
					try {
						eq.attach();
					} catch (e) {
						//do nothing
						console.error(e);
						chrome.runtime.sendMessage({
							action: 'error',
							page: document.location.hostname,
							source: 'page.js',
							error: e
						});

					}
				}
			};

			observer = new MutationObserver(handleMutation);
			observer.observe((document.body ? document.body : document), {
				childList: true,
				subtree: true,
				attributes: false,
				characterData: false
			});

		} catch (e) {
			//	throw e;
			console.error(e);
			chrome.runtime.sendMessage({
				action: 'error',
				page: document.location.hostname,
				source: 'page.js',
				error: e
			});
		}
	}
	//Listen to enable/disable event
	chrome.runtime.onMessage.addListener(function (request, sender, cb) {
		if (request.action == 'enable') {
			localStorage.setItem('eq-status', 'enabled');
			cb();
		}
		if (request.action == 'disable') {
			localStorage.setItem('eq-status', 'disabled');
			cb();
		}
		if (request.action == 'status') {
			cb(eqStatus);
		}
	});
	chrome.runtime.sendMessage({
		action: 'status',
		domain: document.location.hostname,
		status: eqStatus
	});

});
