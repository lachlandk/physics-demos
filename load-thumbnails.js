(function(){
	$.getJSON("/demos.json", function(data){
		const demos = JSON.parse(data);
		console.log(demos);
	});
})();
