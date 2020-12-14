// TODO: possible future thing, separate axes and phasors into separate canvases
// TODO: make scale of resultant phasor change relative to the amplitude of constituent phasors
// TODO: replace date object with custom stopwatch so phase always starts at zero
// TODO: possible future features, lissajou figures, standing waves
// TODO: add tracing for resultant phasor?
// TODO: add arrows at the end of phasors

function Phasor(id){
	this.id = id;
	this.canvas = document.getElementById(this.id + "-phasor");
	this.dimensions = this.canvas.parentElement.offsetHeight * window.devicePixelRatio;
	this.canvas.height = this.dimensions;
	this.canvas.width = this.dimensions;
	this.phasor = this.canvas.getContext("2d");
	this.phasor.scale(window.devicePixelRatio, window.devicePixelRatio);
	this.amplitudeLabel = document.getElementById(this.id + "-amplitude-label");
	this.frequencyLabel = document.getElementById(this.id + "-frequency-label");
	this.phase = 0;

	this.amplitude = function () {
		let control = document.getElementById(this.id + "-amplitude-control");
		return (control !== null ? parseFloat(control.value) : undefined);
	};
	this.frequency = function () {
		let control = document.getElementById(this.id + "-frequency-control");
		return (control !== null ? parseFloat(control.value) : undefined);
	};


	this.drawAxes = function () {
		this.phasor.save();
		this.phasor.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.phasor.translate((this.canvas.width / 2) + 0.5, (this.canvas.height / 2) + 0.5);
		this.phasor.beginPath();
		this.phasor.strokeStyle = "rgba(0, 0, 0, 1)";
		this.phasor.lineWidth = 1;
		this.phasor.moveTo(-(this.canvas.width / 2), 0);
		this.phasor.lineTo(this.canvas.width, 0);
		this.phasor.moveTo(0, -(this.canvas.height / 2));
		this.phasor.lineTo(0, this.canvas.height);
		this.phasor.stroke();
		this.phasor.restore();
	};


	this.draw = function(){
		this.drawAxes();

		this.phasor.save();
		this.phasor.translate((this.canvas.width / 2) + 0.5, (this.canvas.height / 2)) + 0.5;

		if (animate){
			let time = new Date();
			this.phase = 2*Math.PI*this.frequency()*time.getSeconds() + 2*Math.PI*(this.frequency()/1000)*time.getMilliseconds();
		} else {
			this.phase = 0;
		}

		// draw vector
		this.phasor.beginPath();
		this.phasor.strokeStyle = "rgb(50, 71, 255)";
		this.phasor.lineWidth = 3;
		this.phasor.moveTo(0, 0);
		this.phasor.lineTo(this.amplitude()*((this.canvas.width/2) / 2.1)*Math.cos(this.phase), -this.amplitude()*((this.canvas.width/2) / 2.1)*Math.sin(this.phase));
		this.phasor.stroke();

		this.phasor.restore();

		if (animate){
			this.update();
		}
	};


	this.update = function(){
		this.amplitudeLabel.innerHTML = "A = " + this.amplitude().toFixed(2);
		this.frequencyLabel.innerHTML = "f = " + this.frequency().toFixed(2);
		let _this = this;
		window.requestAnimationFrame(function(){
			_this.draw();
		});
	};
}

function ResultantPhasor(osc_1, osc_2){
	Phasor.call(this, "resultant");
	this.osc_1 = osc_1;
	this.osc_2 = osc_2;

	this.amplitude = function(){ // resultant amplitude
		return this.osc_1.amplitude() + this.osc_2.amplitude();
	};
	this.frequency = function(){ // beat frequency
		return parseFloat(Math.abs(this.osc_1.frequency() - this.osc_2.frequency()).toPrecision(2));
	};


	this.draw = function(){
		this.drawAxes();

		this.phasor.save();
		this.phasor.translate((this.canvas.width / 2) + 0.5, (this.canvas.height / 2) + 0.5);

		let Ax = this.osc_1.amplitude()*((this.canvas.width/2) / 4.1)*Math.cos(this.osc_1.phase),
			Ay = -this.osc_1.amplitude()*((this.canvas.width/2) / 4.1)*Math.sin(this.osc_1.phase),
			Bx = this.osc_2.amplitude()*((this.canvas.width/2) / 4.1)*Math.cos(this.osc_2.phase),
			By = -this.osc_2.amplitude()*((this.canvas.width/2) / 4.1)*Math.sin(this.osc_2.phase);

		//draw resultant vector
		this.phasor.beginPath();
		this.phasor.strokeStyle = "rgba(102, 102, 102, 0.5)";
		this.phasor.lineWidth = 3;
		this.phasor.moveTo(0, 0);
		this.phasor.lineTo(Ax + Bx, Ay + By);
		this.phasor.stroke();

		// draw constituent vectors
		this.phasor.beginPath();
		this.phasor.strokeStyle = "rgb(50, 71, 255)";
		this.phasor.lineWidth = 3;
		this.phasor.lineJoin = "round";
		this.phasor.moveTo(0, 0);
		this.phasor.lineTo(Ax, Ay);
		this.phasor.lineTo(Ax + Bx, Ay + By);
		this.phasor.stroke();

		this.phasor.restore();

		if (animate){
			this.update();
		}
	};


	this.update = function(){
		this.amplitudeLabel.innerHTML = "maxmimum A = " + this.amplitude().toFixed(2);
		this.frequencyLabel.innerHTML = "beat frequency = " + this.frequency().toFixed(2);
		let _this = this;
		window.requestAnimationFrame(function(){
			_this.draw();
		});
	};
}
