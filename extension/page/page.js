document.addEventListener("DOMContentLoaded", function() {
	var eq = (function() {
		var audioContext = false;
		var targets = [];
		var filters = [];

		var init = function() {
			collectTargets();
			if (targets.length > 0) {
				//As there is a limitation for how many audio context can be run on same page
				//I need to check if there is a need to create on (if there are audio/vide elements)
				//it was causing "crack" sound -> https://github.com/ejci/Chrome-Audio-EQ/issues/18
				audioContext = (audioContext) ? audioContext : new webkitAudioContext();
			}
			if (!audioContext) {
				//no audio context? dont continue...
				//throw new Error("EQ was not initialized correctly!");
				return;
			} else {
				//console.log('Audio EQ init', document.location.hostname, targets);
			}
			CONST.EQ.forEach(function(node, index) {
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

		var createFilter = function(freq, type, gainValue) {
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

		var attach = function() {
			var source = false;
			if (!audioContext) {
				init();
				//throw new Error("EQ was not initialized correctly!");
			}
			collectTargets();
			//console.log('targets', targets);
			targets.forEach(function(target, index) {
				//console.log('target', target, index);
				if (target.getAttribute("eq-attached") !== "true") {
					source = audioContext.createMediaElementSource(target);
					//read the source channel count
					filters[0]._defaultChannelCount = (source.channelCount) ? source.channelCount : 2;

					source.connect(filters[0]);
					var totalFilters = filters.length, index = 0, node;
					for ( index = 0; index < totalFilters; index++) {
						node = filters[index + 1];
						if (node) {
							filters[index].connect(node);
						}
					}
					filters[filters.length - 1].connect(audioContext.destination);
					target.setAttribute("eq-attached", "true");
				}
			});
		};

		/**
		 * Collect all video and audio tags
		 */
		var collectTargets = function() {
			var videos = document.getElementsByTagName('video'), audios = document.getElementsByTagName('audio');

			function collect(total, collection) {
				var index;
				if (total > 0) {
					for ( index = 0; index < total; index++) {
						targets.push(collection[index]);
					}
				}
			}

			collect(videos.length, videos);
			collect(audios.length, audios);

		};

		/**
		 *
		 * @param {Object} options
		 */
		var set = function(options) {
			if (filters.length !== 0 && options && options.eq) {
				if (options.config && options.config.mono && options.config.mono === true) {
					filters[0].channelCount = 1;
				} else {
					filters[0].channelCount = filters[0]._defaultChannelCount;
				}
				filters.forEach(function(filter, index) {
					filter.gain.value = options.eq[index].gain;
				});
			}
		};

		init();

		return {
			init : init,
			createFilter : createFilter,
			attach : attach,
			collectTargets : collectTargets,
			set : set
		};
	})();

	/**
	 * Check for DOM changes
	 */
	try {
		var handleMutation = false, observer = false;
		//Get default values
		chrome.runtime.sendMessage({
			action : 'get'
		}, function(response) {
			eq.set({
				eq : response.eq,
				config : response.config
			});
		});
		//Listen to changes
		chrome.runtime.onMessage.addListener(function(request, sender, cb) {
			if (request.action == 'set') {
				eq.set({
					eq : request.eq,
					config : request.config
				});
				cb();
			}
		});

		/**
		 * Handle DOM mutation
		 * @param {Object} mutations
		 * @param {Object} observer
		 */
		handleMutation = function(mutations, observer) {
			if (mutations[0].addedNodes.length) {
				try {
					eq.attach();
				} catch(e) {
					//do nothing
				}
			}
		};

		observer = new MutationObserver(handleMutation);
		observer.observe(window.document.body, {
			childList : true,
			subtree : true
		});

	} catch (e) {
		//	throw e;
	}

});
