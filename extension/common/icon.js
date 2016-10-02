/**
 * Icon for backround page.
 */
/* global  window,
 document,
 chrome
 */
'use strict';

var icon = (function() {
	var canvas, context, w, h;
	var px = (window.devicePixelRatio > 1) ? 2 : 1;
	h = w = px * 19;

	canvas = document.createElement('canvas');
	canvas.width = w;
	canvas.height = h;
	context = canvas.getContext('2d');

	/**
	 * Replace icon
	 */
	var replaceIcon = function() {
		//console.log(canvas.toDataURL('image/png'));
		if (chrome.browserAction) {
			chrome.browserAction.setIcon({
				path : canvas.toDataURL('image/png')
			});
		}
	};

	/**
	 * Size
	 */
	var size = function(value) {
		return Math.round((value / 4) * (w / 8));
	};
	/**
	 * Generate icon by values
	 * @param {Object} values
	 */
	var generate = function(eq, status) {
		var val, i, values = [];

		for ( i = 0; i < 3; i++) {
			val = (parseFloat(eq[i * 3 + 1].gain, 10) + parseFloat(eq[i * 3 + 2].gain, 10) + parseFloat(eq[i * 3 + 3].gain, 10));
			val = (val !== 0) ? val / 3 : 0;
			val = Math.floor((val / 12) * 10);
			values.push(val);
		}
		//clear icon
		//console.log(values, eq);
		context.beginPath();
		context.clearRect(0, 0, size(32), size(32));
		context.closePath();
		//draw value by value
		var lines = [5, 15, 25];

		for ( i = 0; i < values.length; i++) {
			val = values[i];
			context.beginPath();
			context.fillStyle = (status == 'off' ? 'rgb(160, 160, 160)' : 'rgb(120, 120, 120)');
			context.fillRect(size(lines[i]), size(0), size(3), size(11 - val));
			context.fill();
			context.closePath();

			context.beginPath();
			context.fillStyle = (status == 'off' ? 'rgb(160, 160, 160)' : 'rgb(120, 120, 120)');
			context.fillRect(size(lines[i]), size(22 - val), size(3), size(10 + val));
			context.fill();
			context.closePath();

			context.beginPath();
			context.fillStyle = (status == 'off' ? 'rgb(140, 140, 140)' : 'rgb(50,90,140)');
			context.fillRect(size(lines[i] - 2), size(13 - val), size(7), size(7));
			context.fill();
			context.closePath();

		}

		//replace icon
		replaceIcon();
	};

	//public methods
	return {
		generate : generate,
	};
})();
