/*	global
 	window,
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

var init = function (prs) {

	var eq = CONST.EQ;
	var version = CONST.VERSION;
	var config = CONST.CONFIG;

	function getValue(id) {
		return document.getElementById(id).value;
	}

	function setValue(id, val) {
		document.getElementById(id).value = val;
	}

	function setAllEqSliders() {
		for (var i = 0; i < eq.length; i++)
			setValue('ch-eq-slider-' + i, eq[i].gain);
	}

	function getEqIndex(f) {
		for (var i = 0; i < eq.length; i++) {
			if (eq[i].f && eq[i].f + '' === f) {
				return i;
			}
		}
		return false;
	}

	function loadPresets(){
		//load EQ presets
		if (presets.getSelected().default === true) {
			document.getElementById('preset_delete').setAttribute('disabled', 'disabled');
		} else {
			document.getElementById('preset_delete').removeAttribute('disabled');
		}

		function appendPreset(preset, presetsSelect, section) {
			var option = document.createElement("option");
			option.text = preset.name;
			option.setAttribute('value', ['preset', section, option.text].join('::'));
			if (presets.isSelected(preset)) {
				option.setAttribute('selected', 'selected');
			}
			presetsSelect.appendChild(option, null);
		}


		var userPresets = presets.getUsers();
		var userPresetsSelect = document.getElementById('presetsSelectUser');
		var predefinedPresets = presets.getPredefined();
		var predefinedPresetsSelect = document.getElementById('presetsSelectPredefined');

		userPresetsSelect.innerHTML = '';
		for (var i = 0; i < userPresets.length; i++) {
			appendPreset(userPresets[i], userPresetsSelect, 'my');
		}

		predefinedPresetsSelect.innerHTML = '';
		for (var i = 0; i < predefinedPresets.length; i++) {
			appendPreset(predefinedPresets[i], predefinedPresetsSelect, 'default')
		}
	}

	function propagateData() {
		//send message
		chrome.runtime.sendMessage({
			action: 'set',
			eq: eq,
			config: config,
			selected: presets.getSelected(),
			version: version
		});
	}

	function snapSliders(index, diff) {
		for (var i = 1; i < 10; i++) {
			console.log('snap', i)
			diff = diff / 2;
			if (eq[index - i] && eq[index - i].f) {
				console.log('minus', parseFloat(eq[index - i].gain, 10) + diff)
				eq[index - i].gain = parseFloat(eq[index - i].gain, 10) + diff;
			}
			if (eq[index + i] && eq[index + i].f !== undefined) {
				console.log('plus', parseFloat(eq[index + i].gain, 10) + diff)
				eq[index + i].gain = parseFloat(eq[index + i].gain, 10) + diff;
			}
		}
	}

	function onSliderChange(evt) {
		// console.log('onchange');
		var slider = evt.target.getAttribute('eq');
		if (slider === 'master') {
			eq[0].gain = getValue('ch-eq-slider-0');
		} else {
			//eq settings
			var index = getEqIndex(slider);

			var diff = evt.target.value - eq[index].gain;
			eq[index].gain = evt.target.value;
			if (config.snap)
				snapSliders(index, diff);
			setAllEqSliders();
			chart.prepareChart(eq);
		}
		propagateData();
	}

	var sliderInputs = document.querySelectorAll('input[type="range"]');
	for (var i = 0; i < sliderInputs.length; i++) {
		sliderInputs[i].onchange = onSliderChange;
		sliderInputs[i].oninput = onSliderChange;
	}

	document.getElementById('reset').onclick = function reset() {
		for (var i = 0; i < eq.length; i++) {
			eq[i].gain = 0;
			if (!eq[i].f) {
				eq[i].gain = 1;
				// master
			}
		}
		setAllEqSliders();

		// return to default (stereo)
		config.mono = false;
		document.getElementById('channels').classList.remove('on');

		presets.setSelected();
		chart.prepareChart(eq);
		propagateData();
	};

	document.getElementById('channels').onchange = function (ev) {
		config.mono = ev.target.checked;
		propagateData();
	};

	document.getElementById('snap').onchange = function (ev) {
		config.snap = ev.target.checked;
		propagateData();
	};

	// TODO: Should only need to build this one time,
	//        but will need to append new saved presets.
	document.getElementById('presets').onclick = function (ev) {
		//loadPresets();

	};

	// TODO: This doesn't handle re-selecting the current preset
	//        after making some slider changes.
	document.getElementById('presetsSelect').onchange = function (ev) {
		//console.log('ev.target', ev.target);
		//console.log('val', ev.target.value);
		var selected = presets.getSelected();
		var updateEq = function () {
			for (var i = 0; i < 10; i++) {
				eq[i + 1].gain = selected.gains[i];
			}
			setAllEqSliders();
			chart.prepareChart(eq);
			propagateData();
		};
		switch (ev.target.value) {
			case 'action::save':
				modal.confirm('Do you want to save "' + selected.name + '" preset?', function () {
					for (var i = 0; i < selected.gains.length; i++) {
						selected.gains[i] = getValue('ch-eq-slider-' + (i + 1));
					}
					console.log('action::save', selected);
					presets.setPreset(selected);
				});

				break;
			case 'action::save_as':
				modal.prompt('New preset name', function (name) {
					if (name && name.length > 0) {
						var preset = JSON.parse(JSON.stringify(selected));
						for (var i = 0; i < preset.gains.length; i++) {
							preset.gains[i] = getValue('ch-eq-slider-' + (i + 1));
						}
						preset.name = name;
						presets.setNewPreset(preset);
						presets.setSelected(name);

					}
				}, function () {
				});
				break;
			case 'action::delete':
				modal.confirm('Do you want to delete "' + selected.name + '" preset?', function () {
					presets.removeByName(selected.name);
				});
				break;
			case 'action::reset':
				modal.confirm('Do you want to reset "' + selected.name + '" preset?', function () {
					presets.reset(selected.name);
					presets.setSelected();
					// setSelected calls getSelected internally, so no need calling again
					updateEq();
				});
				break;
			case 'action::reset_all':
				modal.confirm('Do you want to reset all presets to default state?', function () {
					presets.resetAll();
					presets.setSelected();
					updateEq();
				});
				break;
			default:
				var val = (ev.target.value).split('::');
				presets.setSelected(val[2]);
				selected = presets.getSelected();
				chrome.storage.local.set({
					selected: selected.name
				});
				updateEq();
				loadPresets();
		}
		chrome.storage.sync.set({
			presets: presets.getAll()
		});
	};

	//intialization
	chart.prepareChart(eq);
	sliders.prepareSliders(eq);

	chrome.runtime.sendMessage({
		action: 'get'
	}, function (response) {
		eq = response.eq;
		setAllEqSliders();
		loadPresets();
		config = response.config;
		document.getElementById('channels').checked = config.mono;
		document.getElementById('snap').checked = config.snap;
		chart.prepareChart(eq);
	});
};

//LOAD
window.addEventListener("load", function () {
	chrome.storage.sync.get('presets', function (data) {
		// console.log('popup.js', 'presets', data);
		if (data.presets) {
			presets.setAll(data.presets);
			chrome.storage.local.get('selected', function (data) {
				// console.log('popup.js', 'selected', data);
				if (data.selected) {
					presets.setSelected(data.selected.name);
				}
			});

		} else {
			presets.setAll();
			//store it for next time
			chrome.storage.sync.set({
				presets: presets.getAll()
			});
		}
		init();
	});
});

//request tab capture (needed for background_v2.js)
chrome.runtime.sendMessage({
	action: 'eq-init'
});
