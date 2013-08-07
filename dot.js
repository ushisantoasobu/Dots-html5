this.dots = this.dots || {};


(function(){

	var Dot = function(x ,y, radius, color){
		this.initialize(x ,y, radius, color);
	};

	Dot.COLORLIST = [	'rgb(128, 100, 162)', 
						'rgb(255, 200, 62)', 
						'rgb(48, 230, 92)'];/*, 
						'rgb(200, 200, 111)', 
						'rgb(28, 111, 192)', ];*/

	var p = Dot.prototype;


	/**  */
	p.x = 0;

	/**  */
	p.y = 0;

	/**  */
	p._radius = 0;

	/**  */
	p.color = 0;

	/** 選択状態かどうか */
	p.selected;

	/**  */
	p.positionIndex;

	p._isAnimation;
	


	
	p.initialize = function(x ,y, radius, color){
		this.x = x;
		this.y = y;
		this._radius = radius;
		this.color = color;

		this.selected = false;

		this.positionIndex = 0;

		this._animation = false;
	};

	p.update = function(ctx, addX, addY){
		ctx.beginPath();
		ctx.arc(this.x + addX, this.y + addY, this._radius, 0, Math.PI*2, false);
		ctx.fillStyle = Dot.COLORLIST[this.color];
		ctx.fill();
	};


	p.startAnimation = function(fromX, fromY, toX, toY, fps, ms, callback){
		
		var that = this;

		this._isAnimation = true;
		var totalCount = fps * ms / 1000;
		var count = 0;
		var interval = setInterval(function(){
			
			that.x = fromX + (toX - fromX) * count / totalCount;
			that.y = fromY + (toY - fromY) * count / totalCount;

			count++;

			if(count === totalCount){
				clearInterval(interval);
				that._isAnimation = false;
				that.x = toX;
				that.y = toY;
				if(callback){
					callback();
				}
			}
		}, 1000 / fps);
	}


	dots.Dot = Dot;
})();