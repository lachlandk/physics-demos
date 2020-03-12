(function(){
	$.getJSON("https://raw.githubusercontent.com/lachlandk/physics-demos/master/demos.json", function(demos){
		Object.keys(demos).forEach(function(key){
			const demo = demos[key];

			let image = document.createElement("img");
			image.setAttribute("src", demo["thumbnail"] ? demo["thumbnail"] : "blank.png");
			image.setAttribute("alt", "Thumbnail");
			image.setAttribute("width", "854");
			image.setAttribute("height", "480");
			let title = document.createElement("h3");
			title.innerText = demo["title"];
			let description = document.createElement("p");
			description.innerText = demo["description"];

			let anchor = document.createElement("a");
			anchor.setAttribute("href", "https://lachlandk.github.io/physics-demos/view?demo=" + key);
			anchor.appendChild(image);
			anchor.appendChild(title);
			anchor.appendChild(description);

			let article = document.createElement("article");
			article.setAttribute("class", "thumbnail");
			let container = document.createElement("div");
			container.setAttribute("class", "thumbnail-container");
			container.appendChild(anchor);
			article.appendChild(container);
			document.getElementById("demos").appendChild(article);
		})
	});
})();
