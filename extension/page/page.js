/**
 * Document content loaded
 */
document.addEventListener("DOMContentLoaded", function() {
    var videos, audios;
    var masterNode, filter32, filter64, filter125, filter250, filter500, filter1000, filter2000, filter4000, filter8000, filter16000;
    var eq = {};
    eq.init = function() {
        videos = document.getElementsByTagName('video');
        audios = document.getElementsByTagName('audio');
        var context = new webkitAudioContext();
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
        var source = false;
        for (var i = 0; i < audios.length; i++) {
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
        }
        for (var i = 0; i < videos.length; i++) {
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
        }
        chrome.runtime.sendMessage({
            action : 'get'
        }, function(response) {
            eq.set(response);
        });
        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
            console.log(request);
            if (request.action == 'set') {
                console.log('page.js', 'set', request.eqSettings);
                eq.set(request.eqSettings);
                sendResponse();
            }
            //return true;
        });
    };
    eq.set = function(options) {
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
    };
    eq.init();
}, false);
