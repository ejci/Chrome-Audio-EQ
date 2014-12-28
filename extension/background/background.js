//console.log('background.js');

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	//console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
	function getValue(id) {
		//console.log(id, document.getElementById(id).value);
		return document.getElementById(id).value;
	};
	//get setting from page
	if (request.action === 'get') {
		chrome.storage.local.get(function(items) {
			sendResponse({
				eq : items['eq'],
				config : items['config']
			});
		});

	}
	//set settings from popup
	if (request.action === 'set') {
		var items = {};
		items['eq'] = request.eq;
		items['config'] = request.config;
		chrome.storage.local.set(items);

		chrome.tabs.query({
		}, function(tabs) {
			for (var i = 0; i < tabs.length; i++) {
				chrome.tabs.sendMessage(tabs[i].id, request, function(response) {
					//console.log('tab response', response);
				});
			}
		});
		icon.generate(items['eq']);
	}
	return true;
});

chrome.storage.local.get(function(storage) {
	//Default values
	if (storage['version'] !== CONST.VERSION) {
		storage['eq'] = CONST.EQ;
		storage['config'] = CONST.CONFIG;
		storage['version'] = CONST.VERSION;
	};

	chrome.storage.local.set(storage);
	icon.generate(storage['eq']);
});
