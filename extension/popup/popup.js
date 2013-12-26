document.addEventListener("DOMContentLoaded", function() {
    try {
        //logger.log('popup.js');
        var eq = CONST.EQ;
        var config = CONST.config;
        var presets = PRESETS;

        var canvas, context, inputs;
        //logger.log(eq);

        function getValue(id) {
            return document.getElementById(id).value;
        };

        function setValue(id, val) {
            document.getElementById(id).value = val;
        };

        function getEqIndex(f) {
            for (var l = eq.length, i = 0; i < l; i++) {
                if (eq[i].f && eq[i].f + '' === f) {
                    return i;
                }
            }
            return false;
        };

        var propagateData = function() {
            //send message
            logger.log('popup.js', eq, config);
            try {
                chrome.runtime.sendMessage({
                    action : 'set',
                    eq : eq,
                    config : config
                });
            } catch(e) {
                // :)
            }

        };
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

                if (config.snap) {
                    for (var i = 1; i < 10; i++) {
                        diff = diff / 2;
                        if (eq[index - i] && eq[index - i].f) {
                            eq[index - i].gain = parseFloat(eq[index - i].gain, 10) + diff;
                        }
                        if (eq[index + i] && eq[index + i].f) {
                            eq[index + i].gain = parseFloat(eq[index + i].gain, 10) + diff;
                        }
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

            propagateData();
        };

        inputs = document.getElementsByTagName('input');
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

            // When user presses reset, change it back to default value (stereo)
            eq[0].channelCount = CONST.EQ[0].channelCount;
            prepareChart();
            //document.getElementById('presetsSelect').options[0].selected = 'selected';

            propagateData();

        };

        document.getElementById('channels').onclick = function(ev) {
            config.mono = !config.mono;
            if (config.mono === true) {
                document.getElementById('channels').childNodes[0].classList.add('on');
            } else {
                document.getElementById('channels').childNodes[0].classList.remove('on');
            }
            //logger.log(config);
            propagateData();
        };

        document.getElementById('snap').onclick = function(ev) {
            config.snap = !config.snap;
            if (config.snap === true) {
                document.getElementById('snap').childNodes[0].classList.add('on');
            } else {
                document.getElementById('snap').childNodes[0].classList.remove('on');
            }
            //logger.log(config);
            propagateData();
        };

        document.getElementById('presets').onclick = function(ev) {
            var mousedownEvent = document.createEvent("MouseEvent");
            mousedownEvent.initMouseEvent("mousedown");
            document.getElementById('presetsSelect').dispatchEvent(mousedownEvent);
        };
        document.getElementById('presetsSelect').onchange = function(ev) {
            var preset = presets[parseInt(ev.target.value, 10)];
            console.log(preset);
            for (var l = eq.length, i = 1; i < l; i++) {
                eq[i].gain = preset.gains[i - 1];
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
            propagateData();
        };

        //intialization
        try {
            if (chrome.runtime) {
                chrome.runtime.sendMessage({
                    action : 'get'
                }, function(response) {
                    logger.log('popup.js', 'response', response);
                    eq = response.eq;
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

                    config = response.config;
                    // CUSTOM: make sure toggle is checked
                    if (config.mono) {
                        document.getElementById('channels').childNodes[0].classList.add('on');
                    } else {
                        document.getElementById('channels').childNodes[0].classList.remove('on');
                    }
                    if (config.snap) {
                        document.getElementById('snap').childNodes[0].classList.add('on');
                    } else {
                        document.getElementById('snap').childNodes[0].classList.remove('on');
                    }

                    //load EQ presets
                    for (var l = presets.length, i = 0; i < l; i++) {
                        var option = document.createElement("option");
                        option.text = presets[i].name;
                        option.setAttribute('value', i);
                        document.getElementById('presetsSelect').add(option, null);
                    }

                });
            }
        } catch(e) {
            // Psssst! Dont tell anyone :)
        }
    } catch(e) {
        logger.error('popup.js', e);
    }
});
