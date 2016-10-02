//manipulate headers to sort out crossorigin issues
//not very happy with the idea of manipulating headers but its good for user experience
//TODO: explain in readme and page why extension needs to manipulate headers for transparency
var chrome = chrome ? chrome : null;
chrome.webRequest.onHeadersReceived.addListener(function (details) {
	//console.log(details);
	//check for content-type video/... or audio/...
	var contentTypeVideoOrAudio = false;
	var accessControlAllowOrigin = false;
	for (var i = 0; i < details.responseHeaders.length; i++) {
		if (details.responseHeaders[i].name === 'Content-Type' && (/\bvideo\b/.test(details.responseHeaders[i].value) || /\audio\b/.test(details.responseHeaders[i].value))) {
			contentTypeVideoOrAudio = true;
		}
		if (details.responseHeaders[i].name === 'Access-Control-Allow-Origin') {
			accessControlAllowOrigin = true;
		}
	}
	//console.log(contentTypeVideoOrAudio);
	//if there is video or audio then manipulate or add Access-Control-Allow-Origin: * header
	//contentTypeVideoOrAudio=true;
	if (contentTypeVideoOrAudio && !accessControlAllowOrigin) {
		//console.log(details);
		//var responseHeaders=JSON.parse(JSON.stringify(details.responseHeaders));
		details.responseHeaders.push({
			name: 'Access-Control-Allow-Origin',
			value: '*'
		});
		details.responseHeaders.push({
			name: 'chrome-audio-eq',
			value: 'enabled'
		});
		console.log(details.url, details.responseHeaders);
	}
	return {
		responseHeaders: details.responseHeaders
	};
}, {
		urls: ["<all_urls>"],
		types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
	}, ['blocking', 'responseHeaders']);


chrome.webRequest.onBeforeSendHeaders.addListener(function (details) {
	//This is not the best thing as I would rather only manipulate request headers for video & audio files...
	//But at request time its impossible to know what kind of response you will get (its completely server side)
	//There could be a way to add specific parameters to each audio/video tags and then detect it bu it think that would be a mess
	//So if you managed to get to this source code and you understand what this is doing feel free to suggest better way
	//console.log('onBeforeSendHeaders',details);
	var origin = false;
	var host = '';
	console.log(details.requestHeaders);
	for (var i = 0; i < details.requestHeaders.length; ++i) {
		if (details.requestHeaders[i].name === 'Origin') {
			origin = true;
		}
		if (details.requestHeaders[i].name === 'Host') {
			host = details.requestHeaders[i].value;
		}
		/*if (details.requestHeaders[i].name === 'Referer') {
			var matches = (details.requestHeaders[i].value).match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
			host = matches && matches[1];
		}*/
	}


	if (!origin) {
		details.requestHeaders.push({
			name: 'Origin',
			value: host
		});
	}

	return {
		requestHeaders: details.requestHeaders
	};
}, {
		urls: ["<all_urls>"],
		types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
	}, ["blocking", "requestHeaders"]);