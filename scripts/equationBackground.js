function EquationObject(equationJSON, backgroundContainer) {
	this.name = equationJSON.name;
	this.description = equationJSON.description;
	this.wikipediaLink = equationJSON.wikipediaLink;

	this.container = document.createElement("div");
	this.container.innerText = `\\[${equationJSON.latex}\\]`;
	this.container.style.position = "absolute";
	this.container.style.visibility = "none";
	backgroundContainer.appendChild(this.container);

	this.initialPos = {
		x: Math.random() * backgroundContainer.offsetWidth, // pixels, measured from top to bottom, left to right
		y: Math.random() * backgroundContainer.offsetHeight,
		theta: Math.random() * 90 - 45 // degrees, measured clockwise relative to the x-axis
	};
	this.velocity = {
		Vx: Math.random() * 200 - 100, // pixels per second
		Vy: Math.random() * 200 - 100,
		Vtheta: Math.random() * 10 - 5  // degrees per second
	};
	this.velocity.magnitude = Math.sqrt(this.velocity.Vx**2 + this.velocity.Vy**2);
	this.bounds = {
		maxX: backgroundContainer.offsetWidth,
		maxY: backgroundContainer.offsetHeight
	};

	this.initDisplay = () => {
		this.subContainer = this.container.childNodes[0];
		this.svg = this.subContainer.childNodes[0];

		const scale = Math.random() + 0.5;
		this.container.style.width = scale * this.svg.width.baseVal.value + "px";
		this.container.style.height = scale * this.svg.height.baseVal.value + "px";
		this.svg.setAttribute("width", "100%");
		this.svg.setAttribute("height", "100%");

		this.subContainer.style.margin = "0";
		this.container.style.left = `-${this.container.offsetWidth / 2}px`;
		this.container.style.top = `-${this.container.offsetHeight / 2}px`;
		this.container.style.visibility = "visible";

		this.subContainer.addEventListener("mouseenter", this.mouseEnter);
		this.subContainer.addEventListener("mouseleave", this.mouseLeave);

		this.translationAnimation = this.startTranslationAnimation();
		this.rotationAnimation = this.startRotationAnimation();
	}

	this.getCurrentAngle = () => {
		let matrix = window.getComputedStyle(this.subContainer).transform
		if (matrix !== "none") {
			matrix = matrix.split("(")[1].split(")")[0].split(",");
			return Math.asin(matrix[1]) * (180 / Math.PI);
		} else {
			return 0;
		}
	}

	this.startRotationAnimation = () => {
		const direction = Math.sign(this.velocity.Vtheta);
		const rotationAnimation = this.subContainer.animate([
			{transform: `rotate(${this.initialPos.theta}deg)`},
			{transform: `rotate(${45 * direction}deg)`}
		], {
			duration: 1000 * (Math.abs(45 * direction - this.initialPos.theta) / Math.abs(this.velocity.Vtheta)),
			fill: "forwards"
		});
		rotationAnimation.onfinish = () => {
			this.initialPos.theta = 45 * direction;
			this.velocity.Vtheta *= -1;
			this.rotationAnimation = this.startRotationAnimation();
		}
		return rotationAnimation;
	}

	this.startTranslationAnimation = () => {
		let yBoundaryPos;
		let xBoundaryPos;
		const gradient = this.velocity.Vy / this.velocity.Vx;
		const inverse_gradient = this.velocity.Vx / this.velocity.Vy;
		if (this.velocity.Vx < 0) {
			yBoundaryPos = this.initialPos.y - gradient * this.initialPos.x;
		} else {
			yBoundaryPos = this.initialPos.y + gradient * (this.bounds.maxX - this.initialPos.x);
		}
		if (yBoundaryPos < 0) {
			yBoundaryPos = 0;
			xBoundaryPos = this.initialPos.x - inverse_gradient * this.initialPos.y;
			this.velocity.Vy *= -1;
		} else if (yBoundaryPos > this.bounds.maxY) {
			yBoundaryPos = this.bounds.maxY;
			xBoundaryPos = inverse_gradient * (this.bounds.maxY - this.initialPos.y) + this.initialPos.x;
			this.velocity.Vy *= -1;
		} else {
			this.velocity.Vx > 0 ? xBoundaryPos = this.bounds.maxX : xBoundaryPos = 0;
			this.velocity.Vx *= -1;
		}
		const totalDistance = Math.sqrt(Math.abs(this.initialPos.x - xBoundaryPos)**2 + Math.abs(this.initialPos.y - yBoundaryPos)**2);
		const translationAnimation = this.container.animate([
			{transform: `translate(${this.initialPos.x}px, ${this.initialPos.y}px)`},
			{transform: `translate(${xBoundaryPos}px, ${yBoundaryPos}px)`}
		], {
			duration: 1000 * (totalDistance / this.velocity.magnitude),
			fill: "forwards"
		});
		translationAnimation.onfinish = () => {
			this.initialPos.x = xBoundaryPos;
			this.initialPos.y = yBoundaryPos;
			this.translationAnimation = this.startTranslationAnimation();
		}
		return translationAnimation;
	}

	this.mouseEnter = () => {
		this.velocity.Vtheta *= -1;
		this.initialPos.theta = this.getCurrentAngle();
		this.rotationAnimation.cancel();
		this.translationAnimation.pause();
		this.rotationAnimation = this.subContainer.animate([
			{transform: `rotate(${this.initialPos.theta}deg)`},
			{transform: `rotate(0deg)`}
		], {
			duration: 1000,
			easing: "ease-out"
		});
		this.rotationAnimation.onfinish = () => {
			this.initialPos.theta = 0;
		}
	}

	this.mouseLeave = () => {
		this.initialPos.theta = this.getCurrentAngle();
		this.rotationAnimation.cancel();
		this.rotationAnimation = this.startRotationAnimation();
		this.translationAnimation.play();
	}
}

function createEquationBackground(equationNumber, containerElement = document.body) {
	const equationBackgroundContainer = document.createElement("div");
	Promise.all([
		fetch("https://raw.githubusercontent.com/lachlandk/physics-demos/master/resources/equations.json").then(response => response.json()),
		MathJax.startup.promise
	]).then(results => {
		equationBackgroundContainer.setAttribute("id", "background-svg-container");
		containerElement.style.position = "relative";
		equationBackgroundContainer.style.position = "absolute";
		equationBackgroundContainer.style.overflow = "hidden";
		equationBackgroundContainer.style.zIndex = "-1"; // change to enable mouse events
		equationBackgroundContainer.style.width = "100%";
		equationBackgroundContainer.style.height = "100%";
		containerElement.appendChild(equationBackgroundContainer);

		const equationObjects = [];
		let equationsList = results[0].equations;
		for (let i = 0; i < equationNumber; i++) {
			let randomIndex = Math.random() * equationsList.length | 0;
			equationObjects.push(new EquationObject(equationsList.splice(randomIndex, 1)[0], equationBackgroundContainer));
		}

		MathJax.typeset();
		equationObjects.forEach(equationObject => {equationObject.initDisplay();});

		const backgroundResizeObserver = new ResizeObserver(entries => {
			for (let object of equationObjects) {
				object.bounds = {
					maxX: equationBackgroundContainer.offsetWidth,
					maxY: equationBackgroundContainer.offsetHeight
				};
			}
		});
		backgroundResizeObserver.observe(equationBackgroundContainer);

		// Imperfections
		// - Sometimes on mouseover the rotation is not set to zero at the end
		// - No immediate reaction if the page size is changed
		// - Elements that are on top of each other can "steal" mouse events
		// - Occasionally when javascript is busy there can be a small delay on bounce
		// 		- Could we append keyframes to existing animations? This would be better for calculating the wall bounces in advance
	});
	return equationBackgroundContainer;
}
