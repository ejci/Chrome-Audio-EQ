/*
Experiment for chrome.tabCapture.capture

Pros:
	- manipulate all audio types (html5, flash,...)
	- everything is done in background script = no need for hacky page scripts
Cons:
	- chrome.tabCapture.capture needs to be called from popup.html context manualy
	- cant automaticaly add filter when opening new tab (becaue of ^)
	
Im not sure about performance. But I guess it should be the same

*/

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log('chrome.runtime.onMessage.addListener');	
	if (request.action === 'eq-init') {
		chrome.tabCapture.capture({
			audio : true,
			video : false
		}, function(stream) {
			console.log('stream', stream);
			//I can attach all my filter here...
		});
	}
});
