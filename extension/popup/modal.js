/* global document */
'use strict';

var modal = (function() {
	var confirm = function confirm(message, ok, notok) {
		ok = ok ? ok : function() {
		};
		notok = notok ? notok : function() {
		};
		document.querySelector('#modal-confirm').style.display = 'block';
		document.querySelector('#content').style['-webkit-filter'] = 'blur(2px)';
		document.querySelector('#modal-confirm .modal-message').innerHTML = message;
		document.querySelector('#modal-confirm .ok').onclick = function() {
			document.querySelector('#modal-confirm').style.display = 'none';
			document.querySelector('#content').style['-webkit-filter'] = '';
			ok();
		};
		document.querySelector('#modal-confirm .notok').onclick = function() {
			document.querySelector('#modal-confirm').style.display = 'none';
			document.querySelector('#content').style['-webkit-filter'] = '';
			notok();
		};

	};

	var prompt = function prompt(message, ok, notok) {
		ok = ok ? ok : function() {
		};
		notok = notok ? notok : function() {
		};
		document.querySelector('#modal-prompt').style.display = 'block';
		document.querySelector('#content').style['-webkit-filter'] = 'blur(2px)';
		document.querySelector('#modal-prompt .modal-message').innerHTML = message;
		document.querySelector('#modal-prompt .input').value='';
		document.querySelector('#modal-prompt .input').focus();
		document.querySelector('#modal-prompt .ok').onclick = function() {
			document.querySelector('#modal-prompt').style.display = 'none';
			document.querySelector('#content').style['-webkit-filter'] = '';
			var val = document.querySelector('#modal-prompt .input').value;
			ok(val);
		};
		document.querySelector('#modal-prompt .notok').onclick = function() {
			document.querySelector('#modal-prompt').style.display = 'none';
			document.querySelector('#content').style['-webkit-filter'] = '';
			notok();
		};

	};

	return {
		confirm : confirm,
		prompt : prompt
	};
})();
