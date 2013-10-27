//console.log('background.js');

//collect logs from others js files that use logger.js
logger.collect();
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    //console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
    //console.log(request);
    function getValue(id) {
        //console.log(id, document.getElementById(id).value);
        return document.getElementById(id).value;
    };
    //get setting from page
    if (request.action == 'get') {
        chrome.storage.local.get(function(items) {
            sendResponse({
                eq : items['eq']
            });
        });

    }
    //set settings from popup
    if (request.action == 'set') {
        var items = {};
        items['eq'] = request.eq;
        //console.log('set', items['eq']);
        chrome.storage.local.set(items);

        chrome.tabs.query({
        }, function(tabs) {
            for (var i = 0; i < tabs.length; i++) {
                chrome.tabs.sendMessage(tabs[i].id, request, function(response) {
                    // console.log('tab response', response);
                });
            }
        });
        icon.generate(items['eq']);
    }
    return true;
});

chrome.storage.local.get(function(items) {
    //console.log(items, items['eq']);
    //Default value
    if (!items['eq']) {
        items['eq'] = CONST.EQ;
        chrome.storage.local.set(items);

    }
    icon.generate(items['eq']);
});

