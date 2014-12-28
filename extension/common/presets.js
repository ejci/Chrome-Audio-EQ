
var presets = (function() {
	var list = [];
	var current = false;
	var getByName = function(name) {

	};
	var set = function(p) {
		list = p;
	};
	var getCurrent = function(name) {
		if (current) {

		} else {
			current = getByName('Default');
		}
		return current;
	};
	var setCurrent = function(name) {

	};
	var getAll = function(name) {
		return list;
	};
	var sort = function() {
		//sort the presets by name (just because its more fun to do it on every clik... right?)
		list.sort(function(a, b) {
			a = ('' + a).toLowerCase();
			b = ('' + b).toLowerCase();
			if (a.name > b.name) {
				return 1;
			}
			if (a.name < b.name) {
				return -1;
			}
			return 0;
		});
	};
	return {
		getByName : getByName,
		getAll : getAll,
		set : set
	};
})(); 