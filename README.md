beat
====

A method to synchronize timed events across two iframe/windows using localstorage.

The Problem
-----------

We are often asked about cross page animation for enhanced picture books on the iBooks platform. The problem is that the two separate pages are in fact two separate documents and loaded independently. Due to the variable time difference in between loading the left page and then the right page, it's not possible to get an element to cross the spine without seeing some kind of duplication.

So Beat?
--------

Beat effectively polls localStorage for the loading status of its partner page every 100ms. once both pages are loaded they both begin polling faster (every 10ms), and alternately swapping a variable between an on/off state. when both pages have consecutively swapped the variable 3 times it's assumed that both pages are now in sync (max 9ms offset (which is pretty damn close)) and a ready function is called.

Usage
-----

add the beat.js to the header of your html file:

	<script src="../beat.js" type="text/javascript"></script>

and intialise beat by adding this just before your closing body tag:

	<script type="text/javascript">
		beat.init();
	</script>

It will also take settings:

	<script type="text/javascript">
		beat.settings = {
			ident: 'thebeat123', // variable used in relation to a specific pair of beat scripts, change if you have multiple pairs running on the same page.
			loadClass: 'beat' // the class added by default to the body element of the page on beat executing.
		};
		beat.init();
	</script>

and/or a ready function:

	<script type="text/javascript">
		beat.init();
		beat.ready(function () {
			var output = document.getElementById("output")
			output.innerHTML = "READY!";
		});
	</script> 


Testing
-------

Testing in iBooks has yeilded a bug where by as the pages are loaded quickly to produce the preview thumbs, this also this inits the local storage before it's needed and doesn't complete propperly.
At the moment I have used a `localStorage.clear();` on the cover page to reset this untill I can work around this bug.
