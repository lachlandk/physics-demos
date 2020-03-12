(function(){
	$.getJSON("https://raw.githubusercontent.com/lachlandk/physics-demos/master/demos.json", function(data){
		const demos = JSON.parse(data);
		console.log(demos);
	});
})();
