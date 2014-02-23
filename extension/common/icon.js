/**
 * Icon for backround page.
 */
var icon = (function() {
	var canvas, context, w, h;
	h = w = 128;
	var px = (window.devicePixelRatio > 1) ? 2 : 1;

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
		} else {
			//fallback for demo page
			document.getElementById('chrome.popup.icon').setAttribute('src', canvas.toDataURL('image/png'));
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
	var generate = function(eq) {
		var values = [];
		for (var i = 0; i < 3; i++) {
			var val = (parseFloat(eq[i * 3 + 1].gain, 10) + parseFloat(eq[i * 3 + 2].gain, 10) + parseFloat(eq[i * 3 + 3].gain, 10));
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
		for ( l = values.length, i = 0; i < l; i++) {
			var val = values[i];
			context.beginPath();
			context.fillStyle = 'rgb(120,120,120)';
			context.fillRect(size(lines[i]), size(0), size(3), size(11 - val));
			context.fill();
			context.closePath();

			context.beginPath();
			context.fillStyle = 'rgb(120,120,120)';
			context.fillRect(size(lines[i]), size(22 - val), size(3), size(10 + val));
			context.fill();
			context.closePath();

			context.beginPath();
			context.fillStyle = 'rgb(50,90,140)';
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
