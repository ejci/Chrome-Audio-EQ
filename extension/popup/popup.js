document.addEventListener("DOMContentLoaded", function() {
    //logger.log('popup.js');
    var eq = CONST.EQ;
    var canvas, context;
    //logger.log(eq);

    function getValue(id) {
        return document.getElementById(id).value;
    }

    function setValue(id, val) {
        document.getElementById(id).value = val;
    }

    function getEqIndex(f) {
        for (var l = eq.length, i = 0; i < l; i++) {
            if (eq[i].f && eq[i].f + '' === f) {
                return i;
            }
        }
        return false;
    }

    var prepareChart = function() {
        canvas = document.getElementById('ch-eq-chart');
        //330x40
        canvas.width = 330;
        canvas.height = 40;
        context = canvas.getContext('2d');
        context.beginPath();
        context.moveTo(17, 20);
        context.lineTo(314, 20);
        context.lineWidth = 0.2;
        context.strokeStyle = 'rgb(200,200,200)';
        context.stroke();
        context.beginPath();
        context.beginPath();
        for (var l = eq.length, i = 0; i < l; i++) {
            context.moveTo((i * 33) + 17, 5);
            context.lineTo((i * 33) + 17, 35);
        }
        context.lineWidth = 0.2;
        context.strokeStyle = 'rgb(200,200,200)';
        context.stroke();
        context.beginPath();
        context.stroke();
        context.font = '6px Arial';
        context.textAlign = 'right';
        context.fillStyle = 'rgb(50,90,140)';
        context.fillText('+12', 14, 6 + 3);
        context.fillText('-12', 14, 40 - 3);
        context.textAlign = 'left';
        context.fillText('+12', 316, 6 + 3);
        context.fillText('-12', 316, 40 - 3);
        context.closePath();

        refreshChart();
    };
    var refreshChart = function() {
        var points = [];
        for (var l = eq.length, i = 1; i < l; i++) {
            points.push({
                x : ((i - 1) * 33) + 17,
                y : 20 - (15 / 12) * eq[i].gain,
                xc : 0,
                xy : 0
            });
        }
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        for ( i = 1; i < points.length - 2; i++) {
            var xc = (points[i].x + points[i + 1].x) / 2;
            var yc = (points[i].y + points[i + 1].y) / 2;
            context.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        context.quadraticCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
        context.lineWidth = 0.5;
        //context.strokeStyle = 'rgb(180,180,180)';
        context.strokeStyle = 'rgb(50,90,140)';
        context.stroke();
    };

    function onchange() {
        var slider = this.getAttribute('eq');
        if (slider === 'master') {
            //master volume change
            eq[0].gain = getValue('ch-eq-slider-0');
        } else {
            //eq settings change
            var index = getEqIndex(slider);
            var diff = this.value - eq[index].gain;
            eq[index].gain = this.value;
            //logger.log(slider, diff, index);

            for (var i = 1; i < 10; i++) {
                diff = diff / 2;
                if (eq[index - i] && eq[index - i].f) {
                    eq[index - i].gain = parseFloat(eq[index - i].gain, 10) + diff;
                }
                if (eq[index + i] && eq[index + i].f) {
                    eq[index + i].gain = parseFloat(eq[index + i].gain, 10) + diff;
                }
            }

            setValue('ch-eq-slider-1', eq[1].gain);
            setValue('ch-eq-slider-2', eq[2].gain);
            setValue('ch-eq-slider-3', eq[3].gain);
            setValue('ch-eq-slider-4', eq[4].gain);
            setValue('ch-eq-slider-5', eq[5].gain);
            setValue('ch-eq-slider-6', eq[6].gain);
            setValue('ch-eq-slider-7', eq[7].gain);
            setValue('ch-eq-slider-8', eq[8].gain);
            setValue('ch-eq-slider-9', eq[9].gain);
            setValue('ch-eq-slider-10', eq[10].gain);
            prepareChart();
        }

        //send message
        try {
            //logger.log('popup.js', eq);
            if (chrome.runtime) {
                chrome.runtime.sendMessage({
                    action : 'set',
                    eq : eq
                });
            } else {
                //fallback for demo page
                //TODO:
                icon.generate(eq);
            }
        } catch(e) {
            // Psssst! Dont tell anyone :)
        }
    };
    var inputs = document.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
        //logger.log(inputs);
        inputs[i].onchange = onchange;
    }
    //TODO: dont repeat yor self!
    document.getElementById('reset').onclick = function() {
        for (var i = 0; i < eq.length; i++) {
            if (eq[i].f) {
                eq[i].gain = 0;
            } else {
                eq[i].gain = 1;
            }
        }
        setValue('ch-eq-slider-0', eq[0].gain);
        setValue('ch-eq-slider-1', eq[1].gain);
        setValue('ch-eq-slider-2', eq[2].gain);
        setValue('ch-eq-slider-3', eq[3].gain);
        setValue('ch-eq-slider-4', eq[4].gain);
        setValue('ch-eq-slider-5', eq[5].gain);
        setValue('ch-eq-slider-6', eq[6].gain);
        setValue('ch-eq-slider-7', eq[7].gain);
        setValue('ch-eq-slider-8', eq[8].gain);
        setValue('ch-eq-slider-9', eq[9].gain);
        setValue('ch-eq-slider-10', eq[10].gain);

        //send message
        try {
            //logger.log('popup.js', eqSettings);
            if (chrome.runtime) {
                chrome.runtime.sendMessage({
                    action : 'set',
                    eq : eq
                });
            } else {
                //fallback for demo page
                //TODO:

            }
        } catch(e) {
            // :)
        }
    };

    try {
        if (chrome.storage) {
            //console.log('chrome.storage', chrome.storage);
            chrome.storage.local.get(function(items) {
                //logger.log(items, items['eq']);
                eq = items['eq'];
                setValue('ch-eq-slider-0', eq[0].gain);
                setValue('ch-eq-slider-1', eq[1].gain);
                setValue('ch-eq-slider-2', eq[2].gain);
                setValue('ch-eq-slider-3', eq[3].gain);
                setValue('ch-eq-slider-4', eq[4].gain);
                setValue('ch-eq-slider-5', eq[5].gain);
                setValue('ch-eq-slider-6', eq[6].gain);
                setValue('ch-eq-slider-7', eq[7].gain);
                setValue('ch-eq-slider-8', eq[8].gain);
                setValue('ch-eq-slider-9', eq[9].gain);
                setValue('ch-eq-slider-10', eq[10].gain);
                prepareChart();

            });
        } else {
            //fallback for demo page
            eq = CONST.EQ;
            setValue('ch-eq-slider-0', eq[0].gain);
            setValue('ch-eq-slider-1', eq[1].gain);
            setValue('ch-eq-slider-2', eq[2].gain);
            setValue('ch-eq-slider-3', eq[3].gain);
            setValue('ch-eq-slider-4', eq[4].gain);
            setValue('ch-eq-slider-5', eq[5].gain);
            setValue('ch-eq-slider-6', eq[6].gain);
            setValue('ch-eq-slider-7', eq[7].gain);
            setValue('ch-eq-slider-8', eq[8].gain);
            setValue('ch-eq-slider-9', eq[9].gain);
            setValue('ch-eq-slider-10', eq[10].gain);
            prepareChart();
        }
    } catch(e) {
        // Psssst! Dont tell anyone :)
    }
});
