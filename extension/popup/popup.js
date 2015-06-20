/*global  window,
          document,
          ChromeAudioEQ,
          chrome,
          CONST,
          chart,
          console,
          modal,
          sliders,
          presets
                        */
'use strict';

var init = function(prs) {
  var eq = CONST.EQ
    , version = CONST.VERSION
    , config = CONST.CONFIG;

  // pulled  all function defs out of the try/catch
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

  function setAllEqSliders () {
    for (var i = 0; i < eq.length; i++)
      setValue('ch-eq-slider-' + i, eq[i].gain);
  }

  function onchange(evt) {
    console.log('onchange');
    var slider = evt.target.getAttribute('eq');
    if (slider === 'master') {
      //master volume change
      eq[0].gain = getValue('ch-eq-slider-0');
    } else {
      //eq settings change
      var index = getEqIndex(slider);
      var diff = evt.target.value - eq[index].gain;
      eq[index].gain = evt.target.value;
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
      setAllEqSliders();
      chart.prepareChart(eq);
    }
    propagateData();
  }

	var propagateData = function() {
		//send message
		chrome.runtime.sendMessage({
			action : 'set',
			eq : eq,
			config : config,
			selected : presets.getSelected(),
			version : version
		});
	};

	var inputs = document.querySelectorAll('input[type="range"]');
	for (var i = 0; i < inputs.length; i++) {
		inputs[i].onchange = onchange;
		inputs[i].oninput = onchange;
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

    setAllEqSliders();
		// When user presses reset, change it back to default value (stereo)
		config.mono = false;
		document.getElementById('channels').classList.remove('on');
		presets.setSelected();
		chart.prepareChart(eq);
		propagateData();

	};

	document.getElementById('channels').onclick = function(ev) {
		config.mono = !config.mono;
		if (config.mono === true) {
			document.getElementById('channels').classList.add('on');
		} else {
			document.getElementById('channels').classList.remove('on');
		}
		propagateData();
	};

	document.getElementById('snap').onclick = function(ev) {
		config.snap = !config.snap;
		if (config.snap === true) {
			document.getElementById('snap').classList.add('on');
		} else {
			document.getElementById('snap').classList.remove('on');
		}
		propagateData();
	};

	document.getElementById('presets').onclick = function(ev) {

		//load EQ presets
		var userPresets = presets.getUsers();
		var predefinedPresets = presets.getPredefined();
		var selectedPreset = presets.getSelected();
		// console.log('userPresets', userPresets);
		// console.log('predefinedPresets', predefinedPresets);
		// console.log('selectedPreset', selectedPreset);
		var userPresetsSelect = document.getElementById('presetsSelectUser');
		var predefinedPresetsSelect = document.getElementById('presetsSelectPredefined');
		userPresetsSelect.innerHTML = '';
		if (selectedPreset.default === true) {
			document.getElementById('preset_delete').setAttribute('disabled', 'disabled');
		} else {
			document.getElementById('preset_delete').removeAttribute('disabled');
		}
    var option, i;
		for (i = 0; i < userPresets.length; i++) {
			option = document.createElement("option");
			option.text = userPresets[i].name;
			option.setAttribute('value', 'preset::my::' + option.text);
			if (presets.isSelected(userPresets[i])) {
				option.setAttribute('selected', 'selected');
			}
			userPresetsSelect.appendChild(option, null);
		}
		predefinedPresetsSelect.innerHTML = '';
		for (i = 0; i < predefinedPresets.length; i++) {
			option = document.createElement("option");
			option.text = predefinedPresets[i].name;
			option.setAttribute('value', 'preset::default::' + option.text);
			if (presets.isSelected(predefinedPresets[i])) {
				option.setAttribute('selected', 'selected');
			}
			predefinedPresetsSelect.appendChild(option, null);
		}

		var mousedownEvent = document.createEvent("MouseEvent");
		mousedownEvent.initMouseEvent("mousedown");
		document.getElementById('presetsSelect').dispatchEvent(mousedownEvent);
	};

	document.getElementById('presetsSelect').onchange = function(ev) {
		//console.log('ev.target', ev.target);
		//console.log('val', ev.target.value);
		var selected = presets.getSelected();
		var updateEq = function() {
			for (var i = 0; i < 10; i++) {
				eq[i + 1].gain = selected.gains[i];
			}

      setAllEqSliders();

			chart.prepareChart(eq);
			propagateData();

		};
		switch (ev.target.value) {
		case 'action::save':
			modal.confirm('Do you want to save "' + selected.name + '" preset?', function() {
        for (var i = 0; i < selected.gains.length; i++)
          selected.gains[i] = getValue('ch-eq-slider-' + (i + 1))
				console.log('action::save', selected);
				presets.setPreset(selected);
				chrome.storage.sync.set({
					presets : presets.getAll()
				});
			});

			break;
		case 'action::save_as':
			modal.prompt('New preset name', function(name) {
				if (name && name.length > 0) {
					var preset = JSON.parse(JSON.stringify(selected));
					preset.name = name;
					presets.setNewPreset(preset);
					chrome.storage.sync.set({
						presets : presets.getAll()
					});
				}
			}, function() {
			});
			break;
		case 'action::delete':
			modal.confirm('Do you want to delete "' + selected.name + '" preset?', function() {
				presets.removeByName(selected.name);
				chrome.storage.sync.set({
					presets : presets.getAll()
				});
			});
			break;
		case 'action::reset':
			modal.confirm('Do you want to reset "' + selected.name + '" preset?', function() {
				presets.reset(selected.name);
				presets.setSelected();
				selected = presets.getSelected();
				chrome.storage.sync.set({
					presets : presets.getAll()
				});
				updateEq();
			});

			break;
		case 'action::reset_all':
			modal.confirm('Do you want to reset all presets to default state?', function() {
				presets.resetAll();
				presets.setSelected();
				selected = presets.getSelected();
				chrome.storage.sync.set({
					presets : presets.getAll()
				});
				updateEq();
			});
			break;
		default:
			var val = (ev.target.value).split('::');
			presets.setSelected(val[2]);
			selected = presets.getSelected();
			chrome.storage.local.set({
				selected : selected.name
			});
			updateEq();
		}
	};

	//intialization
	chart.prepareChart(eq);
	sliders.prepareSliders(eq);

	chrome.runtime.sendMessage({
		action : 'get'
	}, function(response) {
		eq = response.eq;
		setAllEqSliders();

		config = response.config;
		// CUSTOM: make sure toggle is checked
		if (config.mono) {
			document.getElementById('channels').classList.add('on');
		} else {
			document.getElementById('channels').classList.remove('on');
		}
		if (config.snap) {
			document.getElementById('snap').classList.add('on');
		} else {
			document.getElementById('snap').classList.remove('on');
		}
		chart.prepareChart(eq);

	});
};

//LOAD
window.addEventListener("load", function() {
	chrome.storage.sync.get('presets',
    function(data) {
  		// console.log('popup.js', 'presets', data);
  		if (data.presets) {
  			presets.setAll(data.presets);
  			chrome.storage.local.get('selected', function(data) {
  				// console.log('popup.js', 'selected', data);
  				if (data.selected) {
  					presets.setSelected(data.selected.name);
  				}
  			});

  		} else {
  			presets.setAll();
  			//store it for next time
  			chrome.storage.sync.set({
  				presets : presets.getAll()
  			});
  		}
      init();
  	}
  );
});

// currently unsused
function forwardErrToBackground(e){
  chrome.runtime.sendMessage({
    action : 'error',
    source : 'popup.js',
    error : e
  });
}
