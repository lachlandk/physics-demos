(function(){
	$.getJSON("https://raw.githubusercontent.com/lachlandk/physics-demos/master/demos.json", function(demos){
		const iframe = document.getElementById("demo");
		const demo = demos[location.hash.match(/demo=([^&]+)/i)[1]];
		iframe.setAttribute("src", demo["url"]);
	});
})();
