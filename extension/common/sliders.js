/*global  document,
          window
                    */
'use strict'; 

var sliders = (function(eq) {
	var canvas, context;
	var px = (window.devicePixelRatio > 1) ? 2 : 1;
	var prepareSliders = function() {
		canvas = document.createElement('canvas');
		canvas.width = px * 30;
		canvas.height = px * 120;
		context = canvas.getContext('2d');
		context.beginPath();
		context.strokeStyle = 'rgb(128,158,198)';
		//'rgb(170,170,170)';
		context.lineWidth = px * 1;
		var longer = [0, 59, 119];
		var shorter = [10, 20, 30, 40, 50, 70, 80, 90, 100, 110];
    var i;
		for (i = 0; i < longer.length; i++) {
			context.moveTo(px * 2, px * longer[i] + context.lineWidth / 2);
			context.lineTo(px * 10, px * longer[i] + context.lineWidth / 2);
			context.moveTo(px * 20, px * longer[i] + context.lineWidth / 2);
			context.lineTo(px * 28, px * longer[i] + context.lineWidth / 2);
		}
		for (i = 0; i < shorter.length; i++) {
			context.moveTo(px * 7, px * shorter[i] + context.lineWidth / 2);
			context.lineTo(px * 10, px * shorter[i] + context.lineWidth / 2);
			context.moveTo(px * 20, px * shorter[i] + context.lineWidth / 2);
			context.lineTo(px * 23, px * shorter[i] + context.lineWidth / 2);
		}
		context.stroke();
		context.closePath();
		var url = canvas.toDataURL('image/png');
		var head = document.getElementsByTagName('head')[0];
		var style = document.createElement('style');
		style.innerHTML += '.controls-sliders .slider{';
		style.innerHTML += 'background-image: url(' + url + ');';
		style.innerHTML += 'background-size: 30px 120px;';
		style.innerHTML += '}';
		head.appendChild(style);
	};
	return {
		prepareSliders : prepareSliders
	};
})();
