console.log('background.js');

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    //console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
    console.log(request);
    function getValue(id) {
        console.log(id, document.getElementById(id).value);
        return document.getElementById(id).value;
    };
    //get setting from page
    if (request.action == 'get') {
        chrome.storage.local.get(function(items) {
            console.log('get', items['eqSettings']);
            sendResponse(items['eqSettings']);
        });

    }
    //set settings from popup
    if (request.action == 'set') {
        var items = {};
        items['eqSettings'] = request.eqSettings;
        console.log('set', items['eqSettings']);
        chrome.storage.local.set(items);
        chrome.tabs.query({
        }, function(tabs) {
            for (var i = 0; i < tabs.length; i++) {
                chrome.tabs.sendMessage(tabs[i].id, request, function(response) {
                    console.log('tab response', response);
                });
            }
        });
    }
    return true;
});

chrome.storage.local.get(function(items) {
    console.log(items, items['eqSettings']);
    if (!items['eqSettings']) {
        items['eqSettings'] = {
            masterVolume : 1,
            filter32 : -12,
            filter64 : -12,
            filter125 : -12,
            filter250 : -12,
            filter500 : 0,
            filter1000 : 0,
            filter2000 : 0,
            filter4000 : 0,
            filter8000 : 0,
            filter16000 : 0
        };
        chrome.storage.local.set(items);
    }
});

