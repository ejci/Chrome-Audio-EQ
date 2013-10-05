document.addEventListener("DOMContentLoaded", function() {
    console.log('popup.js');
    var eq = [{
        label : '32',
        f : 32,
        gain : 0
    }, {
        label : '64',
        f : 64,
        gain : 0
    }, {
        label : '125',
        f : 125,
        gain : 0
    }, {
        label : '250',
        f : 250,
        gain : 0
    }, {
        label : '500',
        f : 500,
        gain : 0
    }, {
        label : '1k',
        f : 1000,
        gain : 0
    }, {
        label : '2k',
        f : 2000,
        gain : 0
    }, {
        label : '4k',
        f : 4000,
        gain : 0
    }, {
        label : '8k',
        f : 8000,
        gain : 0
    }, {
        label : '16k',
        f : 16000,
        gain : 0
    }];
    var eqSettings = {
        masterVolume : 1,
        filter32 : 0,
        filter64 : 0,
        filter125 : 0,
        filter250 : 0,
        filter500 : 0,
        filter1000 : 0,
        filter2000 : 0,
        filter4000 : 0,
        filter8000 : 0,
        filter16000 : 0
    };
    console.log(eq);
    function getValue(id) {
        return document.getElementById(id).value;
    }

    function setValue(id, val) {
        document.getElementById(id).value = val;
    }

    function getEqIndex(f) {
        for (var l = eq.length, i = 0; i < l; i++) {
            if (eq[i].f + '' === f) {
                return i;
            }
        }
        return false;
    }

    function onchange() {
        var slider = this.getAttribute('eq');
        //console.log(slider);
        if (slider === 'master') {
            //master volume change
            eqSettings.masterVolume = getValue('ch-eq-slider-master');
        } else {
            //eq settings change
            var index = getEqIndex(slider);
            var diff = this.value - eq[index].gain;
            eq[index].gain = this.value;
            console.log(slider, diff, index);
            for (var i = 1; i < 9; i++) {
                diff = diff / 2;
                if (eq[index - i]) {
                    eq[index - i].gain = parseFloat(eq[index - i].gain, 10) + diff;
                }
                if (eq[index + i]) {
                    eq[index + i].gain = parseFloat(eq[index + i].gain, 10) + diff;
                }
            }
            setValue('ch-eq-slider-32', eq[0].gain);
            setValue('ch-eq-slider-64', eq[1].gain);
            setValue('ch-eq-slider-125', eq[2].gain);
            setValue('ch-eq-slider-250', eq[3].gain);
            setValue('ch-eq-slider-500', eq[4].gain);
            setValue('ch-eq-slider-1000', eq[5].gain);
            setValue('ch-eq-slider-2000', eq[6].gain);
            setValue('ch-eq-slider-4000', eq[7].gain);
            setValue('ch-eq-slider-8000', eq[8].gain);
            setValue('ch-eq-slider-16000', eq[9].gain);

            eqSettings.filter32 = getValue('ch-eq-slider-32');
            eqSettings.filter64 = getValue('ch-eq-slider-64');
            eqSettings.filter125 = getValue('ch-eq-slider-125');
            eqSettings.filter250 = getValue('ch-eq-slider-250');
            eqSettings.filter500 = getValue('ch-eq-slider-500');
            eqSettings.filter1000 = getValue('ch-eq-slider-1000');
            eqSettings.filter2000 = getValue('ch-eq-slider-2000');
            eqSettings.filter4000 = getValue('ch-eq-slider-4000');
            eqSettings.filter8000 = getValue('ch-eq-slider-8000');
            eqSettings.filter16000 = getValue('ch-eq-slider-16000');
            eq[0].gain = eqSettings.filter32;
            eq[1].gain = eqSettings.filter64;
            eq[2].gain = eqSettings.filter125;
            eq[3].gain = eqSettings.filter250;
            eq[4].gain = eqSettings.filter500;
            eq[5].gain = eqSettings.filter1000;
            eq[6].gain = eqSettings.filter2000;
            eq[7].gain = eqSettings.filter4000;
            eq[8].gain = eqSettings.filter8000;
            eq[9].gain = eqSettings.filter16000;

        }

        //send message
        try {
            //console.log('popup.js', eqSettings);
            chrome.runtime.sendMessage({
                action : 'set',
                eqSettings : eqSettings
            });
        } catch(e) {
            // :)
        }
    };
    var inputs = document.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
        //console.log(inputs);
        inputs[i].onchange = onchange;
    }
    try {
        chrome.storage.local.get(function(items) {
            console.log(items, items['eqSettings']);
            var eqSettings = items['eqSettings'];
            setValue('ch-eq-slider-master', eqSettings.masterVolume);
            setValue('ch-eq-slider-32', eqSettings.filter32);
            setValue('ch-eq-slider-64', eqSettings.filter64);
            setValue('ch-eq-slider-125', eqSettings.filter125);
            setValue('ch-eq-slider-250', eqSettings.filter250);
            setValue('ch-eq-slider-500', eqSettings.filter500);
            setValue('ch-eq-slider-1000', eqSettings.filter1000);
            setValue('ch-eq-slider-2000', eqSettings.filter2000);
            setValue('ch-eq-slider-4000', eqSettings.filter4000);
            setValue('ch-eq-slider-8000', eqSettings.filter8000);
            setValue('ch-eq-slider-16000', eqSettings.filter16000);
        });
    } catch(e) {
        // :)
    }
});
