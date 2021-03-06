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
				image.setAttribute("src", demo.thumbnail ? demo.thumbnail : "resources/blank.png");
				image.setAttribute("alt",  `Thumbnail for ${demo.title} demo`);
				let container = document.createElement("div");
				container.setAttribute("class", "thumbnail-container");
				container.style.backgroundImage = `url(resources/thumbnail-backgrounds/${demo.category}.svg)`;
				container.appendChild(image);
				let title = document.createElement("h3");
				title.innerText = demo.title;
				let description = document.createElement("p");
				description.innerText = demo.description;
				let anchor = document.createElement("a");
				if (demo.url) {
					anchor.setAttribute("href", `https://physics-demos.js.org/view?demo=${key}`);
				}

				let article = document.createElement("article");
				article.setAttribute("class", `thumbnail ${demo.category} ${demo.tags.join(" ")}`);
				anchor.appendChild(container);
				anchor.appendChild(title);
				anchor.appendChild(description);
				article.appendChild(anchor);
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
				categoryElementList.forEach(element => {
					element.nextElementSibling.style.maxHeight = "0px";
					element.nextElementSibling.style.visibility = "hidden";
					// TODO: see if we can replace with scale-y
				});
				if (categoryHash) {
					const categoryElement = document.getElementById(categoryHash[1]);
					categoryElement.classList.add("selected-category");
					categoryElement.nextElementSibling.style.maxHeight = `${categoryElement.nextElementSibling.scrollHeight}px`;
					categoryElement.nextElementSibling.style.visibility = "visible";
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
				element.addEventListener("click", function () {
					if (this.classList.contains("tag")) {
						const parentCategory = this.parentElement.previousSibling.id;
						history.replaceState(null, "", `#category=${parentCategory}&tag=${this.id}`)
					} else {
						history.replaceState(null, "", this.id !== "all" ? `#category=${this.id}` : location.href.split("#")[0]);
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
