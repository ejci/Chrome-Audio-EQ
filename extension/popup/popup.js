document.addEventListener("DOMContentLoaded", function() {
    logger.log('popup.js');
    var eq = CONST.EQ;
    logger.log(eq);

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
            logger.log(slider, diff, index);

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

        }

        //send message
        try {
            logger.log('popup.js', eq);
            chrome.runtime.sendMessage({
                action : 'set',
                eq : eq
            });
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
            chrome.runtime.sendMessage({
                action : 'set',
                eq : eq
            });
        } catch(e) {
            // :)
        }
    };

    try {
        chrome.storage.local.get(function(items) {
            logger.log(items, items['eq']);
            var eq = items['eq'];
        });
    } catch(e) {
        // Psssst! Dont tell anyone :)
    }
});
