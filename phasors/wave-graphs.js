function Wave(id, phasor){
	this.id = id;
	this.canvas = document.getElementById(id + "-wave");
	this.canvas.width = this.canvas.parentElement.offsetWidth * window.devicePixelRatio;
	this.canvas.height = this.canvas.parentElement.offsetHeight * window.devicePixelRatio;
	this.wave = this.canvas.getContext("2d");
	this.wave.scale(window.devicePixelRatio, window.devicePixelRatio);
	this.phase = 0;
	if (phasor !== null){
		this.A = phasor.amplitude;
		this.f = phasor.frequency;
	}

	this.drawAxes = function(){
		this.wave.save();
		this.wave.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.wave.translate(30.5, (this.canvas.height / 2) + 0.5);
		this.wave.beginPath();
		this.wave.strokeStyle = "rgba(0, 0, 0, 1)";
		this.wave.lineWidth = 1;
		this.wave.moveTo(-30, 0);
		this.wave.lineTo(this.canvas.width - 30, 0);
		this.wave.moveTo(0, -(this.canvas.height / 2));
		this.wave.lineTo(0, this.canvas.height);
		this.wave.stroke();
		this.wave.restore();
	};


	this.draw = function(){
		this.drawAxes();

		this.wave.save();
		this.wave.translate(30.5, (this.canvas.height / 2) + 0.5);

		if (animate){
			let time = new Date();
			this.phase = 2*Math.PI*this.f()*time.getSeconds() + 2*Math.PI*(this.f()/1000)*time.getMilliseconds();
		} else {
			this.phase = 0;
		}

		// draw wave
		this.wave.beginPath();
		this.wave.strokeStyle = "rgb(50,71,255)";
		this.wave.lineWidth = 2;
		this.wave.moveTo(0, -this.A()*((this.canvas.height/2) / 2.1)*Math.cos(this.phase));
		for (let i=0; i<100; i++){
			this.wave.lineTo((i/100)*(this.canvas.width - 30), -this.A()*((this.canvas.height/2) / 2.1)*Math.cos(this.f()*(i/100)*(4*Math.PI) - this.phase))
		}
		this.wave.stroke();

		this.wave.restore();

		if (animate){
			this.update();
		}
	};


	this.update = function(){
		let _this = this;
		window.requestAnimationFrame(function(){
			_this.draw();
		});
	}
}

function ResultantWave(){
	Wave.call(this, "resultant", null);
	this.A1 = osc_1_phasor.amplitude();
	this.A2 = osc_2_phasor.amplitude();
	this.f1 = osc_1_phasor.frequency();
	this.f2 = osc_2_phasor.frequency();

	this.draw = function(){
		this.drawAxes();

		this.wave.save();
		this.wave.translate(30.5, (this.canvas.height / 2) + 0.5);

		// draw resultant wave
		this.wave.beginPath();
		this.wave.strokeStyle = "rgb(50,71,255)";
		this.wave.lineWidth = 2;
		this.wave.moveTo(0, -(this.A1*((this.canvas.height/2) / 4.1)*Math.cos(osc_1_wave.phase) + this.A2*((this.canvas.height/2) / 4.1)*Math.cos(osc_2_wave.phase)));
		for (let i=0; i<100; i++){
			this.wave.lineTo((i/100)*(this.canvas.width - 30), -(this.A1*((this.canvas.height/2) / 4.1)*Math.cos(this.f1*(i/100)*(4*Math.PI) - osc_1_wave.phase) + this.A2*((this.canvas.height/2) / 4.1)*Math.cos(this.f2*(i/100)*(4*Math.PI) - osc_2_wave.phase)))
		}
		this.wave.stroke();

		this.wave.restore();

		if (animate){
			this.update();
		}
	};


	this.update = function(){
		this.A1 = osc_1_phasor.amplitude();
		this.A2 = osc_2_phasor.amplitude();
		this.f1 = osc_1_phasor.frequency();
		this.f2 = osc_2_phasor.frequency();
		let _this = this;
		window.requestAnimationFrame(function(){
			_this.draw();
		});
	}
}
