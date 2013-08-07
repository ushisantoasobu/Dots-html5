this.dots = this.dots || {};


(function(){

	var Line = function(fromX, fromY, toX, toY){
		this.initialize(fromX, fromY, toX, toY);
	};

	var p = Line.prototype;

	p.fromX;

	p.fromY;
	
	p.toX;
	
	p.toY;

	
	p.initialize = function(fromX, fromY, toX, toY){
		this.fromX = fromX;
		this.fromY = fromY;
		this.toX = toX;
		this.toY = toY;
	};

	p.update = function(ctx){
		ctx.strokeStyle = 'gray';
		ctx.lineWidth = 5;
		ctx.lineCap = 'round';
		ctx.beginPath();
		ctx.moveTo(this.fromX, this.fromY);
		ctx.lineTo(this.toX, this.toY);
		ctx.stroke();
	};


	dots.Line = Line;
})();