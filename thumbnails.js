(function(){
	$.getJSON("https://raw.githubusercontent.com/lachlandk/physics-demos/master/resources/demos.json", function(demos){
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
			anchor.setAttribute("href", demo.url ? "https://physics-demos.js.org/view#demo=" + key : "javascript:void(0)");
			anchor.appendChild(image);
			anchor.appendChild(title);
			anchor.appendChild(description);

			let article = document.createElement("article");
			article.setAttribute("class", "thumbnail " + demo["tags"].join(" "));
			let container = document.createElement("div");
			container.setAttribute("class", "thumbnail-container");
			container.appendChild(anchor);
			article.appendChild(container);
			document.getElementById("demos").appendChild(article);
		});

		const category = $(".category");

		function categoryUpdate(){
			let hashString = location.hash.match(/category=([^&]+)/i);
			let categoryName = hashString && hashString[1] ? hashString[1] : "all";
			console.log(categoryName);
			category.css({"text-decoration": "none", "font-weight": "normal"});
			$("#" + categoryName).css({"text-decoration": "black underline", "font-weight": "bold"});
			$("#demos").isotope({
				itemSelector: ".thumbnail",
				filter: categoryName !== "all" ? "." + categoryName : "*"
			});
		}
		categoryUpdate();

		category.on("click", function(event){
			history.replaceState(null, null, event.target.id !== "all" ? "#category=" + event.target.id : location.href.split("#")[0]);
			categoryUpdate();
		});
		$(window).on("hashchange", function(){
			history.replaceState(null, null, location.href.split("#")[0]);
			categoryUpdate();
		});

		// TODO: click animation for demos
	});
})();
