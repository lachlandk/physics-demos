function EquationObject(equationJSON) {
	this.name = equationJSON.name;
	this.description = equationJSON.description;
	this.wikipediaLink = equationJSON.wikipediaLink;

	this.element = document.createElement("div");
	this.element.innerText = `\\[${equationJSON.latex}\\]`;
	this.element.style.position = "absolute";
	this.element.style.visibility = "none";
	equationBackgroundContainer.appendChild(this.element);

	this.mouseOver = false;
	this.pos = {
		x: Math.random() * equationBackgroundContainer.offsetWidth, // pixels, measured from top to bottom, left to right
		y: Math.random() * equationBackgroundContainer.offsetHeight,
		theta: Math.random() * 90 - 45 // degrees, measured clockwise relative to the x-axis
	};
	this.velocity = {
		Vx: Math.random() * 200 - 100, // pixels per second
		Vy: Math.random() * 200 - 100,
		Vtheta: Math.random() * 10 - 5  // degrees per second
	};
	this.bounds = {
		xMax: equationBackgroundContainer.offsetWidth,
		yMax: equationBackgroundContainer.offsetHeight
	};

	this.initDisplay = () => {
		const svg = this.element.childNodes[0].childNodes[0];

		const scale = Math.random() + 1;
		this.element.style.width = scale * svg.width.baseVal.value + "px";
		this.element.style.height = scale * svg.height.baseVal.value + "px";
		svg.setAttribute("width", "100%");
		svg.setAttribute("height", "100%");

		this.element.childNodes[0].style.margin = "0";
		this.element.style.left = `-${this.element.offsetWidth / 2}px`;
		this.element.style.top = `-${this.element.offsetHeight / 2}px`;
		this.element.style.visibility = "visible";

		this.element.addEventListener("mouseenter", this.mouseEnter);
		this.element.addEventListener("mouseleave", this.mouseLeave);
	}

	this.animateStep = (dtSeconds) => {
		if (!this.mouseOver) {
			this.pos.theta += this.velocity.Vtheta * dtSeconds;
			if (this.pos.theta < -45 || this.pos.theta > 45) {
				this.velocity.Vtheta *= -1;
			}

			this.pos.x += this.velocity.Vx * dtSeconds;
			this.pos.y += this.velocity.Vy * dtSeconds;
			if (this.pos.x < 0 && this.velocity.Vx < 0) {
				this.velocity.Vx *= -1;
			} else if (this.pos.x > this.bounds.xMax && this.velocity.Vx > 0) {
				this.velocity.Vx *= -1;
			}
			if (this.pos.y < 0 && this.velocity.Vy < 0) {
				this.velocity.Vy *= -1;
			} else if (this.pos.y > this.bounds.yMax && this.velocity.Vy > 0) {
				this.velocity.Vy *= -1;
			}
		} else {
			// check if the object is rotating away from or towards zero
			if (this.pos.theta < 0 && this.velocity.Vtheta < 0) {
				this.velocity.Vtheta *= -1;

			} else if (this.pos.theta > 0 && this.velocity.Vtheta > 0) {
				this.velocity.Vtheta *= -1;
			}
			// TODO: replace with proper easing function
			this.pos.theta += Math.abs(this.pos.theta) * this.velocity.Vtheta * dtSeconds;
		}
		this.element.style.transform = `translate(${this.pos.x}px, ${this.pos.y}px) rotate(${this.pos.theta}deg)`;
	}

	this.mouseEnter = () => {
		this.mouseOver = true;
	}

	this.mouseLeave = () => {
		this.mouseOver = false;
	}
}

Promise.all([
	fetch("https://raw.githubusercontent.com/lachlandk/physics-demos/master/resources/equations.json").then(response => response.json()),
	MathJax.startup.promise
]).then(results => {
	equationBackgroundContainer = document.createElement("div");
	equationBackgroundContainer.setAttribute("id", "background-svg-container");
	document.body.style.position = "relative";
	equationBackgroundContainer.style.position = "absolute";
	equationBackgroundContainer.style.overflow = "hidden";
	equationBackgroundContainer.style.zIndex = "-1"; // change to enable mouse events
	equationBackgroundContainer.style.width = "100%";
	equationBackgroundContainer.style.height = "100%";
	document.body.appendChild(equationBackgroundContainer);
	window.addEventListener("resize", () => {
		equationObjects.forEach(equationObject => {
			equationObject.bounds = {
				xMax: equationBackgroundContainer.offsetWidth,
				yMax: equationBackgroundContainer.offsetHeight
			};
		});
	});

	const equationObjects = [];
	results[0].equations.forEach(equationJSON => {
		equationObjects.push(new EquationObject(equationJSON));
	});

	MathJax.typeset();
	equationObjects.forEach(equationObject => {equationObject.initDisplay();});

	let previousTimestamp;
	const animateEquationObjects = (currentTimestamp) => {
		let dt;
		if (!previousTimestamp || currentTimestamp - previousTimestamp > 1000) {
			dt = 0;
		} else {
			dt = currentTimestamp - previousTimestamp;
		}
		equationObjects.forEach(equationObject => {
			equationObject.animateStep(dt/1000);
		});
		previousTimestamp = currentTimestamp;
		window.requestAnimationFrame(animateEquationObjects);
	}
	window.requestAnimationFrame(animateEquationObjects);
});
