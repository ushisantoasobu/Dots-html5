this.dots = this.dots || {};


(function(){

	var Dot = function(ctx, color, size, pos){
		this._ctx = ctx;
		this._color = color;
		this._radius = size;
		this._pos = pos;
		this.initialize(ctx);
	};

	Dot.COLORLIST = [	'rgb(128, 100, 162)', 
						'rgb(255, 200, 62)', 
						'rgb(48, 230, 92)'];/*, 
						'rgb(200, 200, 111)', 
						'rgb(28, 111, 192)', ];*/

	var p = Dot.prototype;

	p._ctx;
	/**  */
	p._color = 0;
	/**  */
	p._radius = 0;
	/**  */
	p._pos = {x:0, y:0};

	
	p.initialize = function(ctx){
		this._ctx.beginPath();
		this._ctx.arc(this._pos.x, this._pos.y, this._radius, 0, Math.PI*2, false);
		ctx.fillStyle = Dot.COLORLIST[this._color];
		this._ctx.fill();
		this._ctx.save();
	}

	Dot.removeAction = function(){
		//
	};

	dots.Dot = Dot;
})();