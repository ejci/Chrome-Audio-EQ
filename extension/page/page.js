/**
 * Document content loaded
 */

document.addEventListener("DOMContentLoaded", function() {
    var videos, audios;
    var context, masterNode, filter32, filter64, filter125, filter250, filter500, filter1000, filter2000, filter4000, filter8000, filter16000;
    var initialized = false;
    var eq = {};
    var filters = [];
    eq.init = function() {
        try {
            context = new webkitAudioContext();
            //masterNode = context.createGainNode();
            //masterNode.gain.value = 1;
            //mastervolume
            //32,64,125,250,500,1K,2K,4K,8K,16K
            var createFilter = function(f, t, g) {
                f = (f) ? f : 0;
                t = (t) ? t : 5;
                g = (g) ? g : 0;
                var filter = context.createBiquadFilter();
                filter.type = t;
                filter.gain.value = g;
                filter.Q.value = 1;
                filter.frequency.value = f;
                return filter;
            };

            for (var l = CONST.EQ.length, i = 0; i < l; i++) {
                if (CONST.EQ[i].f) {
                    //filter node
                    filters.push(createFilter(CONST.EQ[i].f, CONST.EQ[i].type));
                } else {
                    //gain node
                    filters.push(context.createGainNode());
                    //filters[i].gain.value = 1;
                }
            }
            filters[0].gain.value = 1;

            initialized = true;
            //console.log('eq.init', 'done');
        } catch(e) {
            //console.error('eq.init', e);
        }

    };
    eq.attach = function() {
        //console.log('initialized', initialized);
        //console.log('eq.attach', 'start');
        if (!initialized) {
            return;
        }
        try {
            videos = document.getElementsByTagName('video');
            audios = document.getElementsByTagName('audio');
            var tags = [];
            //stupid I know :(
            for (var l = audios.length, i = 0; i < l; i++) {
                tags.push(audios[i]);
            }
            for (var l = videos.length, i = 0; i < l; i++) {
                tags.push(videos[i]);
            }
            //console.log('eq.attach', tags, videos, audios);
            var source = false;
            var count = 0;
            for (var l = tags.length, i = 0; i < l; i++) {
                //connect filters in chain
                //console.log(tags[i], tags[i].getAttribute('eq-attached'));
                if (tags[i].getAttribute('eq-attached') !== 'true') {
                    source = context.createMediaElementSource(tags[i]);
                    source.connect(filters[0]);
                    for (var fl = filters.length, j = 0; j < fl - 1; j++) {
                        //console.log(filters[j], filters[j+1]);
                        filters[j].connect(filters[j + 1]);
                    }
                    filters[filters.length - 1].connect(context.destination);
                    //set attribute to tag that it is already connected
                    tags[i].setAttribute('eq-attached', 'true');
                    count++;
                }
            }
            //console.log('eq.attach', 'done');
            if (count > 0) {
                //console.log('eq.attach', 'Attached to ' + count + ' video/audio sources.');
            }
        } catch(e) {
            console.error('eq.attach', e);
            //throw e;
        }
    };
    /**
     * Set filter values based on new options
     * @param {Object} options
     */
    eq.set = function(options) {
        try {
            if (filters[0]) {
                // console.log(options);
                filters[0].channelCountMode = 'explicit';
                filters[0].channelCount = options.eq[0].channelCount;
                for (var l = filters.length, i = 0; i < l; i++) {
                    //console.log(filters[i].gain.value + ' --> ' + options.eq[i].gain);
                    filters[i].gain.value = options.eq[i].gain;
                }
            }
        } catch(e) {
            //console.error(e);
        }
    };
    //Get default values
    chrome.runtime.sendMessage({
        action : 'get'
    }, function(response) {
        eq.set({
            eq : response.eq
        });
    });
    //Listen to changes
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        //console.log(request);
        if (request.action == 'set') {
            //console.log('page.js', 'set', request.eqSettings);
            eq.set({
                eq : request.eq
            });
            sendResponse();
        }
        //return true;
    });

    //observe DOM
    //http://stackoverflow.com/questions/3219758/detect-changes-in-the-dom
    var observeDOM = (function() {
        var MutationObserver = window.MutationObserver, eventListenerSupported = window.addEventListener;
        return function(obj, callback) {
            if (MutationObserver) {
                // define a new observer
                var obs = new MutationObserver(function(mutations, observer) {
                    if (mutations[0].addedNodes.length || mutations[0].removedNodes.length) {
                        try {
                            callback();
                        } catch(e) {
                            //nasty hack... :( ... eat exception
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

    // Observe a specific DOM element:
    observeDOM(document.getElementsByTagName('body')[0], function() {
        var newVideos = document.getElementsByTagName('video');
        var newAudios = document.getElementsByTagName('audio');
        //console.log('observeDOM', newVideos.length, newAudios.length);
        //if (newVideos.length !== videos.length || newAudios.length !== audios.length) {
        eq.attach();
        //}
    });

    //auto init

    eq.init();
    //eq.attach();
}, false);
