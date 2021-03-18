window.addEventListener("load", () => {
	fetch("https://raw.githubusercontent.com/lachlandk/physics-demos/master/resources/demos.json")
		.then(response => response.json())
		.then(demos => {
			let categoryList = [];
			let tagList = [];

			Object.keys(demos).forEach(key => {
				const demo = demos[key];
				categoryList.push(demo.category);
				tagList.push(...demo.tags.map(tag => `${demo.category}-${tag}`));

				let image = document.createElement("img");
				image.setAttribute("src", demo.thumbnail ? demo.thumbnail : "blank.png");  // TODO move to resources
				image.setAttribute("alt",  `Thumbnail for ${demo.title} demo`);
				let title = document.createElement("h3");
				title.innerText = demo.title;
				let description = document.createElement("p");
				description.innerText = demo.description;
				let anchor = document.createElement("a");
				if (demo.url) {
					anchor.setAttribute("href", `https://physics-demos.js.org/view#demo=${key}`);
				}
				anchor.appendChild(image);
				anchor.appendChild(title);
				anchor.appendChild(description);

				let article = document.createElement("article");
				article.setAttribute("class", `thumbnail ${demo.category} ${demo.tags.join(" ")}`);
				let container = document.createElement("div");
				container.setAttribute("class", "thumbnail-container");
				container.appendChild(anchor);
				article.appendChild(container);
				document.getElementById("demos").appendChild(article);
			});

			categoryList = categoryList.filter((category, index) => categoryList.indexOf(category) == index);
			categoryList.unshift("all");
			tagList = tagList.filter((tag, index) => tagList.indexOf(tag) === index);

			const nav = document.getElementById("categories");
			let categoryElementList = [];
			categoryList.forEach(category => {
				let categoryAnchor = document.createElement("a");
				categoryAnchor.setAttribute("class", "nav-link category");
				categoryAnchor.setAttribute("id", category);
				categoryAnchor.innerText = `> ${category.split("-").join(" ").replace(/\b\w/g, c => c.toUpperCase())}`;
				let tagDiv = document.createElement("div");
				tagDiv.setAttribute("class", "tags-block");

				tagList.filter(tag => tag.split("-")[0] === category).forEach(tag => {
					let tagAnchor = document.createElement("a");
					let tagTitle = tag.split("-").slice(1).join("-");
					tagAnchor.setAttribute("class", "nav-link tag");
					tagAnchor.setAttribute("id", tagTitle);
					tagAnchor.innerText = `> ${tagTitle.split("-").join(" ").replace(/\b\w/g, c => c.toUpperCase())}`;
					tagDiv.appendChild(tagAnchor);
				});

				nav.appendChild(categoryAnchor);
				nav.appendChild(tagDiv);
				categoryElementList.push(categoryAnchor);
			});

			const navLinkElementList = Array.from(document.getElementsByClassName("nav-link"));
			const isotope = new Isotope("#demos", {
				itemSelector: ".thumbnail"
			});
			const categoryUpdate = () => {
				const categoryHash = location.hash.match(/category=([^&]+)/i);
				const tagHash = location.hash.match(/tag=([^&]+)/i);
				navLinkElementList.forEach(element => {element.classList.remove("selected-category")});
				categoryElementList.forEach(element => {element.nextElementSibling.style.maxHeight = "0px"});
				if (categoryHash) {
					const categoryElement = document.getElementById(categoryHash[1]);
					categoryElement.classList.add("selected-category");
					categoryElement.nextElementSibling.style.maxHeight = `${categoryElement.nextElementSibling.scrollHeight}px`;
					if (tagHash) {
						document.getElementById(tagHash[1]).classList.add("selected-category");
					}
					isotope.arrange({
						filter: tagHash ? `.${categoryHash[1]}.${tagHash[1]}` : `.${categoryHash[1]}`
					});
				} else {
					document.getElementById("all").classList.add("selected-category");
					isotope.arrange({
						filter: "*"
					});
				}
			}

			navLinkElementList.forEach(element => {
				element.addEventListener("click", event => {
					if (event.target.classList.contains("tag")) {
						const parentCategory = event.target.parentElement.previousSibling.id;
						history.replaceState(null, "", `#category=${parentCategory}&tag=${event.target.id}`)
					} else {
						history.replaceState(null, "", event.target.id !== "all" ? `#category=${event.target.id}` : location.href.split("#")[0]);
					}
					categoryUpdate();
				});
			});

			window.addEventListener("hashchange", () => {
				history.replaceState(null, "", location.href.split("#")[0]);
				categoryUpdate();
			});

			categoryUpdate();
  		});
});
