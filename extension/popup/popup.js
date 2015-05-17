/**
 * I need to clean this mess...
 */

var eq = CONST.EQ;
var config = CONST.CONFIG;
var version = CONST.version;

var init = function(prs) {
	try {
		var canvas, context, inputs;

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
			try {
				chrome.runtime.sendMessage({
					action : 'set',
					eq : eq,
					config : config,
					selected : presets.getSelected(),
					version : version
				});
			} catch(e) {
				//	throw e;
				chrome.runtime.sendMessage({
					action : 'error',
					source : 'popup.js',
					error : e
				});
			}

		};

		function onchange() {
			console.log('onchange');
			var slider = this.getAttribute('eq');
			if (slider === 'master') {
				//master volume change
				eq[0].gain = getValue('ch-eq-slider-0');
			} else {
				//eq settings change
				var index = getEqIndex(slider);
				var diff = this.value - eq[index].gain;
				eq[index].gain = this.value;
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
				chart.prepareChart(eq);
			}

			propagateData();
		};

		inputs = document.querySelectorAll('input[type="range"]');
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
			console.log('userPresets', userPresets);
			console.log('predefinedPresets', predefinedPresets);
			console.log('selectedPreset', selectedPreset);
			var userPresetsSelect = document.getElementById('presetsSelectUser');
			var predefinedPresetsSelect = document.getElementById('presetsSelectPredefined');
			userPresetsSelect.innerHTML = '';
			if (selectedPreset.default == true) {
				document.getElementById('preset_delete').setAttribute('disabled', 'disabled');
			} else {
				document.getElementById('preset_delete').removeAttribute('disabled');
			}
			for (var l = userPresets.length, i = 0; i < l; i++) {
				var option = document.createElement("option");
				option.text = userPresets[i].name;
				option.setAttribute('value', 'preset::my::' + option.text);
				if (presets.isSelected(userPresets[i])) {
					option.setAttribute('selected', 'selected');
				}
				userPresetsSelect.appendChild(option, null);
			}
			predefinedPresetsSelect.innerHTML = '';
			for (var l = predefinedPresets.length, i = 0; i < l; i++) {
				var option = document.createElement("option");
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
				chart.prepareChart(eq);
				propagateData();

			};
			switch (ev.target.value) {
			case 'action::save':
				modal.confirm('Do you want to save "' + selected.name + '" preset?', function() {
					selected.gains[0] = getValue('ch-eq-slider-1');
					selected.gains[1] = getValue('ch-eq-slider-2');
					selected.gains[2] = getValue('ch-eq-slider-3');
					selected.gains[3] = getValue('ch-eq-slider-4');
					selected.gains[4] = getValue('ch-eq-slider-5');
					selected.gains[5] = getValue('ch-eq-slider-6');
					selected.gains[6] = getValue('ch-eq-slider-7');
					selected.gains[7] = getValue('ch-eq-slider-8');
					selected.gains[8] = getValue('ch-eq-slider-9');
					selected.gains[9] = getValue('ch-eq-slider-10');
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
		try {
			chart.prepareChart(eq);
			sliders.prepareSliders(eq);

			if (chrome.runtime) {
				chrome.runtime.sendMessage({
					action : 'get'
				}, function(response) {
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
			}

		} catch(e) {
			//	throw e;
			chrome.runtime.sendMessage({
				action : 'error',
				source : 'popup.js',
				error : e
			});
			// Psssst! Dont tell anyone :)
			throw e;
		}
	} catch(e) {
		//	throw e;
		chrome.runtime.sendMessage({
			action : 'error',
			source : 'popup.js',
			error : e
		});
		throw e;
	}
};

//LOAD
window.addEventListener("load", function() {
	if (chrome && chrome.storage) {
		chrome.storage.sync.get('presets', function(data) {
			console.log('popup.js', 'presets', data);
			if (data.presets) {
				presets.setAll(data.presets);
				chrome.storage.local.get('selected', function(data) {
					console.log('popup.js', 'selected', data);
					if (data.selected) {
						presets.setSelected(data.selected.name);
					}
					init();

				});

			} else {
				presets.setAll();
				init();
				//store it for next time
				chrome.storage.sync.set({
					presets : presets.getAll()
				});
			}
		});
	} else {
		presets.setAll();
		init();

	}
});
