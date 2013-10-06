/**
 * Document content loaded
 */
//if (window != window.top) {
if (false) {
    console.log('iframe element');
} else {
    document.addEventListener("DOMContentLoaded", function() {
        var videos, audios;
        var context, masterNode, filter32, filter64, filter125, filter250, filter500, filter1000, filter2000, filter4000, filter8000, filter16000;
        var initialized = false;
        var eq = {};
        eq.init = function() {
            try {
                context = new webkitAudioContext();
                masterNode = context.createGainNode();
                masterNode.gain.value = 1;
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
                filter32 = createFilter(32, 3);
                filter64 = createFilter(64, 5);
                filter125 = createFilter(125, 5);
                filter250 = createFilter(250, 5);
                filter500 = createFilter(500, 5);
                filter1000 = createFilter(1000, 5);
                filter2000 = createFilter(2000, 5);
                filter4000 = createFilter(4000, 5);
                filter8000 = createFilter(8000, 5);
                filter16000 = createFilter(16000, 4);
                // Change frequency to test
                //console.log("videoTag", videoTag);
                initialized = true;
                console.log('eq.init', 'done');
                //eq.attach();
            } catch(e) {
                console.error('eq.init', e);
                //eate exception :)
                //throw e;
            }

        };
        eq.attach = function() {
            //console.log('initialized', initialized);
            if (!initialized) {
                return;
            }
            try {
                videos = document.getElementsByTagName('video');
                audios = document.getElementsByTagName('audio');
                /*var iframes = document.getElementsByTagName('iframe');
                 for (var i = 0; i < iframes.length; i++) {
                 var v = iframes[i].contentWindow.document.getElementsByTagName('video');
                 var a = iframes[i].contentWindow.document.getElementsByTagName('audio');
                 console.log(v, a);
                 audios = (a.length > 0) ? audios.concat(a) : audios;
                 videos = (v.length > 0) ? videos.concat(v) : videos;
                 }*/
                console.log('eq.attach', videos, audios);

                //console.log('eq.attach', 'audios', audios);
                var source = false;
                var count = 0;
                for (var i = 0; i < audios.length; i++) {
                    if (audios[i].getAttribute('eq-attached') !== 'true') {
                        source = context.createMediaElementSource(audios[i]);
                        console.log(audios[i], source);
                        source.connect(masterNode);
                        masterNode.connect(filter32);
                        filter32.connect(filter64);
                        filter64.connect(filter125);
                        filter125.connect(filter250);
                        filter250.connect(filter500);
                        filter500.connect(filter1000);
                        filter1000.connect(filter2000);
                        filter2000.connect(filter4000);
                        filter4000.connect(filter8000);
                        filter8000.connect(filter16000);
                        filter16000.connect(context.destination);
                        audios[i].setAttribute('eq-attached', 'true');
                        count++;
                    }
                }
                source = false;
                //console.log('eq.attach', 'videos', videos);
                for (var i = 0; i < videos.length; i++) {
                    if (videos[i].getAttribute('eq-attached') !== 'true') {
                        source = context.createMediaElementSource(videos[i]);
                        console.log(videos[i], source);
                        source.connect(masterNode);
                        masterNode.connect(filter32);
                        filter32.connect(filter64);
                        filter64.connect(filter125);
                        filter125.connect(filter250);
                        filter250.connect(filter500);
                        filter500.connect(filter1000);
                        filter1000.connect(filter2000);
                        filter2000.connect(filter4000);
                        filter4000.connect(filter8000);
                        filter8000.connect(filter16000);
                        filter16000.connect(context.destination);
                        videos[i].setAttribute('eq-attached', 'true');
                        count++;
                    }
                }
                if (count > 0) {
                    console.log('eq.attach', 'Attached to ' + count + ' video/audio sources.');
                }
            } catch(e) {
                //console.error('eq.attach', e);
                //throw e;
            }
        };
        eq.set = function(options) {
            try {
                if (masterNode) {
                    masterNode.gain.value = options.masterVolume;
                    filter32.gain.value = options.filter32;
                    filter64.gain.value = options.filter64;
                    filter125.gain.value = options.filter125;
                    filter500.gain.value = options.filter500;
                    filter1000.gain.value = options.filter1000;
                    filter2000.gain.value = options.filter2000;
                    filter4000.gain.value = options.filter4000;
                    filter8000.gain.value = options.filter8000;
                    filter16000.gain.value = options.filter16000;
                }
            } catch(e) {
                console.error(e);
            }
        };
        chrome.runtime.sendMessage({
            action : 'get'
        }, function(response) {
            eq.set(response);
        });
        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
            //console.log(request);
            if (request.action == 'set') {
                //console.log('page.js', 'set', request.eqSettings);
                eq.set(request.eqSettings);
                sendResponse();
            }
            //return true;
        });

        //observe DOM
        //http://stackoverflow.com/questions/3219758/detect-changes-in-the-dom
        //TODO: optimize for chrome (remove FF,IE support)
        var observeDOM = (function() {
            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver, eventListenerSupported = window.addEventListener;

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
                    // have the observer observe foo for changes in children
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

        eq.init();

    }, false);
}