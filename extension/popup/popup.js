
document.addEventListener("DOMContentLoaded", function() {
    console.log('popup.js');
    function getValue(id) {
        return document.getElementById(id).value;
    }

    function setValue(id, val) {
        document.getElementById(id).value = val;
    }

    function onchange() {

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
        eqSettings.masterVolume = getValue('ch-eq-slider-master');
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
        console.log('popup.js', eqSettings);
        //send message
        chrome.runtime.sendMessage({
            action : 'set',
            eqSettings : eqSettings
        });
    };
    var inputs = document.getElementsByTagName('input');
    console.log(inputs);
    for (var i = 0; i < inputs.length; i++) {
        console.log(inputs);
        inputs[i].onchange = onchange;
    }
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
});
