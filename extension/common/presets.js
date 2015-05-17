var presets = (function() {
	var list = [];
	var selected = false;

	var getByName = function(name, presetList) {
		presetList = presetList ? presetList : list;
		name = (name) ? '' + name : '';
		for (var i = 0, l = presetList.length; i < l; i++) {
			if (presetList[i].name.toLowerCase() === name.toLowerCase()) {
				return presetList[i];
			}
		}
		return false;
	};

	var removeByName = function(name) {
		name = (name) ? '' + name : '';
		for (var i = 0, l = list.length; i < l; i++) {
			if (list[i].name.toLowerCase() === name.toLowerCase() && list[i].default !== true) {
				list.splice(i, 1);
				selected = false;
				getSelected();
				return true;
			}
		}
		return false;
	};

	var setAll = function(p) {
		list = (p) ? JSON.parse(JSON.stringify(p)) : JSON.parse(JSON.stringify(CONST.PRESETS));
		console.log('presets.setAll', list);
	};

	var getSelected = function() {
		if (!selected) {
			selected = getByName('default');
		}
		return selected;
	};
	var isSelected = function(preset) {
		var selected = getSelected();
		if (preset.name == selected.name && preset.default == selected.default) {
			return true;
		}
		return false;
	};

	var setSelected = function(name) {
		selected = getByName(name);
		var ret = getSelected();
		console.log('presets.setSelected', selected, ret);
		return ret;
	};
	var setPreset = function(preset) {
		for (var i = 0, l = list.length; i < l; i++) {
			if (list[i].name == preset.name) {
				list[i] = preset;
			}
		}
	};
	var setNewPreset = function(preset) {
		delete preset['default'];
		list.push(preset);
		console.log(list);
	};
	var getUsers = function() {
		var retList = [];
		for (var i = 0, l = list.length; i < l; i++) {
			if (list[i].default !== true) {
				console.log(i);
				retList.push(list[i]);
			}
		}
		console.log('retList', list, retList);
		return sort(retList);
	};

	var getPredefined = function() {
		var retList = [];
		for (var i = 0, l = list.length; i < l; i++) {
			if (list[i].default === true) {
				retList.push(list[i]);
			}
		}
		return retList;
	};

	var getAll = function(name) {
		return list;
	};

	var reset = function(name) {
		var oldPreset = getByName(name, JSON.parse(JSON.stringify(CONST.PRESETS)));
		//var preset = getByName(name);
		for (var i = 0, l = list.length; i < l; i++) {
			if (list[i].name == name) {
				list[i] = oldPreset;
			}
		}
		return oldPreset;
	};

	var resetAll = function() {
		list = JSON.parse(JSON.stringify(CONST.PRESETS));
		console.log('list', list);
		selected = false;
	};

	var sort = function(list) {
		//sort the presets by name (just because its more fun to do it on every clik... right?)
		list.sort(function(a, b) {
			if (a.name.toLowerCase() > b.name.toLowerCase()) {
				return 1;
			}
			if (a.name.toLowerCase() < b.name.toLowerCase()) {
				return -1;
			}
			return 0;
		});
		return list;
	};
	return {
		getByName : getByName,
		removeByName : removeByName,
		getSelected : getSelected,
		setSelected : setSelected,
		setNewPreset : setNewPreset,
		setPreset : setPreset,
		isSelected : isSelected,
		getUsers : getUsers,
		getPredefined : getPredefined,
		getAll : getAll,
		setAll : setAll,
		reset : reset,
		resetAll : resetAll

	};
})();
