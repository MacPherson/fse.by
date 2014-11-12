(function() {

	var utils = {
		queryAll: function queryAll(selector, parent) {
			return (parent || document).querySelectorAll(selector)
		},
		addEvent: function addEvent(selector, typeEvent, cb, phase) {
			this.queryAll(selector)[0].addEventListener(typeEvent, cb, !!phase);
		}
	};

	var detect = {
		html5tags: function() {
			if (/msie 8.0/i.test(navigator.appVersion)) {
				['preenster', 'preensterb'].forEach(function(tag) {
					document.createElement(tag)
				});
			};
		}
	};

	var Devpack = Class.extend([utils, detect], {
		init: function() {
			this.html5tags();
		}
	});

	

	var devpack = new Devpack();

}());