var chart = (function() {
	var canvas, context;
	var px = (window.devicePixelRatio > 1) ? 2 : 1;
	var prepareChart = function(eq) {

		canvas = document.getElementById('chart');
		//330x40
		canvas.style.width = 315 + 'px';
		canvas.style.height = 40 + 'px';
		canvas.width = px * 315;
		canvas.height = px * 40;
		context = canvas.getContext('2d');
		context.beginPath();
		context.moveTo(px * 12, px * 20);
		context.lineTo(px * 300, px * 20);
		context.lineWidth = px * 1;
		context.strokeStyle = 'rgb(229,229,229)';
		context.stroke();
		context.beginPath();
		for (var l = eq.length, i = 0; i < l; i++) {
			context.moveTo(px * ((i * 32) + 12), px * 5);
			context.lineTo(px * ((i * 32) + 12), px * 35);
		}
		context.lineWidth = px * 1;
		context.strokeStyle = 'rgb(229,229,229)';
		context.stroke();
		context.beginPath();
		context.stroke();
		context.font = px * 8 + 'px Rationale';
		context.textAlign = 'right';
		context.fillStyle = 'rgb(50,90,140)';
		context.fillText('+12', px * 8, px * (6 + 3));
		context.fillText('-12', px * 8, px * (40 - 3));
		context.textAlign = 'left';
		context.fillText('+12', px * 303, px * (6 + 3));
		context.fillText('-12', px * 303, px * (40 - 3));
		context.closePath();
		refreshChart(eq);
	};
	var refreshChart = function(eq) {
		var points = [];
		for (var l = eq.length, i = 1; i < l; i++) {
			points.push({
				x : ((i - 1) * 32) + 12,
				y : 20 - (15 / 12) * eq[i].gain,
				xc : 0,
				xy : 0
			});
		}
		context.beginPath();
		context.moveTo(px * points[0].x, px * points[0].y);
		for ( i = 1; i < points.length - 2; i++) {
			var xc = (points[i].x + points[i + 1].x) / 2;
			var yc = (points[i].y + points[i + 1].y) / 2;
			context.quadraticCurveTo(px * points[i].x, px * points[i].y, px * xc, px * yc);
		}
		context.quadraticCurveTo(px * points[i].x, px * points[i].y, px * points[i + 1].x, px * points[i + 1].y);
		context.lineWidth = px * 1;
		context.strokeStyle = 'rgb(50,90,140)';
		context.stroke();

	};
	return {
		prepareChart : prepareChart,
		refreshChart : refreshChart
	};
})();
