document.addEventListener("DOMContentLoaded", function () {

    var _defaultChannelCount = 2;

    function EQ() {
        this.targets = [];
        this.AudioContext = null;
        this.filters = [];
        this.initialized = false;

        this.init();
    }

    EQ.prototype = {};
    EQ.prototype.init = function () {
        //console.log("[EQ]", "Initialization...");
        var self = this;
        this.AudioContext = new webkitAudioContext();
        this.filters = [];
        CONST.EQ.forEach(function (node, index) {
            if (node.hasOwnProperty("f")) { // Filter node
                self.filters.push(self.createFilter(node.f, node.type));
            } else { // Gain node
                self.filters.push(self.AudioContext.createGain());
            }
        });
        this.filters[0].gain.value = 1;
        this.filters[0].channelCountMode = "explicit";
        this.initialized = true;
        //console.log("[EQ]", "Initialization completed.");

        this.attach();
    };

    EQ.prototype.createFilter = function (freq, type, gainValue) {
        if (!this.AudioContext) return;
        var filter = this.AudioContext.createBiquadFilter();
        filter.type = type || CONST.FT.LOWPASS;
        filter.gain.value = gainValue || 0;
        filter.Q.value = 1;
        filter.frequency.value = freq || 0;
        return filter;
    };

    EQ.prototype.attach = function () {
        //console.log("[EQ]", "Attaching...");

        if (!this.initialized || !this.AudioContext) {
            throw new Error("EQ was not initialized correctly!");
        }

        this.collectTargets();

        var source = false,
            count = 0,
            self = this;
        this.targets.forEach(function (target, _index) {
            if (target.getAttribute("eq-attached") !== "true") {
                source = self.AudioContext.createMediaElementSource(target);
                channelCount = source.channelCount;
                source.connect(self.filters[0]);
                var totalFilters = self.filters.length,
                    index = 0, node;
                for (index = 0; index < totalFilters; index++) {
                    node = self.filters[index + 1];
                    if (node) {
                        self.filters[index].connect(node);
                    }
                }
                self.filters[self.filters.length - 1].connect(self.AudioContext.destination);
                target.setAttribute("eq-attached", "true");
                count++;
            }
        });
        /*if (count > 0) {
            console.info("[EQ]", count, " attached elements!");
        } else {
            console.info("[EQ]", "No elements where attached!");
        }*/
    };

    /**
     * Collect all video and audio tags
    */
    EQ.prototype.collectTargets = function () {
        var targets = [],
            videos = document.getElementsByTagName('video'),
            audios = document.getElementsByTagName('audio');

        function collect(total, collection) {
            var index;
            if (total > 0) {
                for (index = 0; index < total; index++) {
                    targets.push(collection[index]);
                }
            }
        }

        collect(videos.length, videos);
        collect(audios.length, audios);

        //console.log("[EQ]", "Targets collected. Total: ", targets.length);
        this.targets = targets;
        return this;
    };

    /**
     * @param {Object}
    */
    EQ.prototype.set = function (options) {
        if (this.filters.length === 0 ||
            !options.hasOwnProperty("eq")) {
            return;
        }

        if (options.hasOwnProperty("config")) {
            if (options.config.hasOwnProperty("mono") &&
                options.config.mono === true) {
                this.filters[0].channelCount = 1;
            } else {
                this.filters[0].channelCount = _defaultChannelCount;
            }
        }
        if (options.hasOwnProperty("config")) {
            if (options.config.hasOwnProperty("multi51") &&
                options.config.multi51 === true) {
                this.filters[0].channelCount = 6;
                this.filters[0].channelInterpretation = Speakers;
                this.filters[0].output.L = input.L;
                this.filters[0].output.R = input.R;
                this.filters[0].output.C = 0.5 * (input.L + input.R);
                this.filters[0].output.LFE = 0.5 * (input.L + input.R);
                this.filters[0].output.SL = input.L;
                this.filters[0].output.SR = input.R;
                
            } else {
                this.filters[0].channelCount = _defaultChannelCount;
            }
        }

        this.filters.forEach(function (filter, index) {
            filter.gain.value = options.eq[index].gain;
        });
    };

    try {
        var eq = new EQ();

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
        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
            if (request.action == 'set') {
                eq.set({
                    eq : request.eq,
                    config : request.config
                });
                sendResponse();
            }
        });

        //http://stackoverflow.com/questions/3219758/detect-changes-in-the-dom
        var ObserveDOM = (function() {
            var MutationObserver = window.MutationObserver,
                eventListenerSupported = window.addEventListener;
            return function(obj, callback) {
                if (MutationObserver) {
                    var obs = new MutationObserver(function(mutations, observer) {
                        if (mutations[0].addedNodes.length ||
                            mutations[0].removedNodes.length) {
                            try {
                                callback();
                            } catch(e) {
                                //...
                            }
                        }
                    });
                    obs.observe(obj, {
                        childList : true,
                        subtree : true
                    });
                } else if (eventListenerSupported) {
                    obj.addEventListener('DOMNodeInserted', callback, false);
                    obj.addEventListener('DOMNodeRemoved', callback, false);
                }
            };
        })();

        ObserveDOM(window.document.body, function () {
            eq.attach();
        });

    } catch (e) {
        //console.error("[EQ]", e);
        throw e;
    }

});
