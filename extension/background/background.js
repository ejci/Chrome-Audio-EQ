/*global  ChromeAudioEQ,
          chrome,
          icon,
          console
                          */
'use strict';

// console.log('background.js');
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	//console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
	//get setting from page
	if (request.action === 'get') {
		chrome.storage.local.get(function(items) {
			//console.log('background.js', 'chrome.storage.local.get', items);
			sendResponse({
				eq : items.eq,
				config : items.config,
				selected : items.selected,
				version : items.version
			});
		});

	}
	//set settings from popup
	if (request.action === 'set') {
		var items = {};
		items.config = request.config;
		items.eq = request.eq;
		items.selected = request.selected;
		items.version = request.version;

		chrome.storage.local.set(items);
		//console.log(request);
		chrome.tabs.query({
		}, function(tabs) {
      function onTabMsgResp(response) {
          //console.log('tab response', response);
        }
			for (var i = 0; i < tabs.length; i++) {
				chrome.tabs.sendMessage(tabs[i].id, request, onTabMsgResp);
			}
		});
		icon.generate(items.eq);
	}

	//error logger
	if (request.action === 'error') {
		//for now just forward do console
		console.error(request.source, request.error, request.page);
	}

	return true;
});

chrome.storage.local.get(function(storage) {
	//Default values
	//console.log('background.js init', 'chrome.storage.local.get', storage);
	if (storage.version !== CONST.VERSION) {
		storage.eq = CONST.EQ;
		storage.config = CONST.CONFIG;
		storage.version = CONST.VERSION;
	}

	chrome.storage.local.set(storage, function() {
		//console.log('background.js init', 'chrome.storage.local.set');
	});
	icon.generate(storage.eq);
});
