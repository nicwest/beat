var beat = {
	init: function () {
		if(window.addEventListener){
		    window.addEventListener('load',beat.setup,false);
		}
		else{
		    window.attachEvent('onload',beat.beat.setup);
		}
		this.readyFuncs.push(function () {
			var d = document.getElementsByTagName("body")[0];
			d.className = d.className + " beat";
		});
	},
	storage: {},
	settings: {
		ident: 'thebeat123',
		loadClass: 'beat'
	},
	readyFuncs: [],
	first: false,
	timer: false,
	counter: 0,
	setup: function () {
		if (localStorage.beat) {
			beat.get();
		} else {
			var newStorage = {}
			beat.storage = newStorage;
			beat.set();
		}

		if (beat.settings.ident in beat.storage) {
			// states:
			// 0: page is loaded and waiting for response from partner
			// 1: partner is loaded and waiting to sync
			// 2: first pages sync value
			// 3: seconds pages sync value
			// 4: sync complete stop polling and load ready()
			if (beat.storage[beat.settings.ident] > 1){
				beat.first = true;
				beat.storage[beat.settings.ident] = 0;
				beat.set();
			} 
		} else {
				beat.first = true;
				beat.storage[beat.settings.ident] = 0;
				beat.set();
		}
		beat.timer = window.setInterval(beat.check, 100);
	},
	check: function () {
		beat.get();
		var status = beat.storage[beat.settings.ident];
		if (status == 0 && !beat.first){
			window.clearInterval(beat.timer);
			beat.storage[beat.settings.ident] = 1;
			beat.set();
			beat.timer = window.setInterval(beat.sync, 10); 
		}
		if (status == 1 && beat.first){
			window.clearInterval(beat.timer);
			beat.timer = window.setInterval(beat.sync, 10);
		}
	},
	sync: function () {
		beat.get();
		var status = beat.storage[beat.settings.ident];
		if (status == 1 && beat.first) {
			beat.storage[beat.settings.ident] = 2;
			beat.set();
		} else if (status == 3 && beat.first) {
			beat.storage[beat.settings.ident] = 2;
			beat.set();
			beat.counter++;
		} else if(status == 2 && !beat.first) {
			beat.storage[beat.settings.ident] = 3;
			beat.set();
			beat.counter++;
		} else {
			beat.counter = 0;
		}

		if (beat.counter > 3 || status == 4) {
			window.clearInterval(beat.timer);
			beat.storage[beat.settings.ident] = 4;
			beat.set();
			beat.execute();
		}
	},
	get: function () {
			beat.storage = JSON.parse(localStorage.beat);
	},
	set: function () {
			localStorage.beat = JSON.stringify(beat.storage);
	},
	execute: function () {
		for (i=0; i < beat.readyFuncs.length; i++) {
			beat.readyFuncs[i].apply();
		}
	},
	ready: function (inFunc) {
		if (typeof(inFunc)!=='undefined'){
			beat.readyFuncs.push(inFunc);
		}
	}
}

