/*global  ChromeAudioEQ,
 chrome,
 icon,
 console,
 CONST
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

	if (request.action === 'status') {
		if (request.status == 'enabled') {
			chrome.contextMenus.update('eqStatusEnable', {
				enabled : false
			});
			chrome.contextMenus.update('eqStatusDisable', {
				enabled : true
			});

		} else {
			chrome.contextMenus.update('eqStatusEnable', {
				enabled : true
			});
			chrome.contextMenus.update('eqStatusDisable', {
				enabled : false
			});
		}
	}
	//error logger
	if (request.action === 'error') {
		//for now just forward to console
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

chrome.tabs.onActivated.addListener(function(active) {
	chrome.tabs.sendMessage(active.tabId, {
		action : 'status'
	}, function(status) {
		if (status == 'enabled') {
			chrome.contextMenus.update('eqStatusEnable', {
				enabled : false
			});
			chrome.contextMenus.update('eqStatusDisable', {
				enabled : true
			});

		} else {
			chrome.contextMenus.update('eqStatusEnable', {
				enabled : true
			});
			chrome.contextMenus.update('eqStatusDisable', {
				enabled : false
			});
		}
	});
});
//MENUS
var menu = {};
menu.root = chrome.contextMenus.create({
	title : "Audio EQ",
	contexts : ['page']
});
menu.eqStatusEnable = chrome.contextMenus.create({
	id : 'eqStatusEnable',
	title : "Enable for this domain",
	enabled : false,
	parentId : menu.root,
	onclick : function() {
		chrome.tabs.query({
			active : true
		}, function(tabs) {
			for (var i = 0, l = tabs.length; i < l; i++) {
				var tab = tabs[i];
				chrome.contextMenus.update('eqStatusEnable', {
					enabled : false
				});
				chrome.contextMenus.update('eqStatusDisable', {
					enabled : true
				});
				chrome.tabs.sendMessage(tab.id, {
					action : 'enable'
				}, function() {
					chrome.tabs.reload(tab.id);

				});
			}
		});
	}
});
menu.eqStatusDisable = chrome.contextMenus.create({
	id : 'eqStatusDisable',
	title : "Disable for this domain",
	enabled : true,
	parentId : menu.root,
	onclick : function() {
		chrome.tabs.query({
			active : true
		}, function(tabs) {
			for (var i = 0, l = tabs.length; i < l; i++) {
				var tab = tabs[i];
				chrome.contextMenus.update('eqStatusEnable', {
					enabled : true
				});
				chrome.contextMenus.update('eqStatusDisable', {
					enabled : false
				});
				chrome.tabs.sendMessage(tab.id, {
					action : 'disable'
				}, function() {
					chrome.tabs.reload(tab.id);

				});
			}
		});
	}
});
