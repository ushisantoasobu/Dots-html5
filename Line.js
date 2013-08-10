this.dots = this.dots || {};


(function(){

	var Line = function(fromX, fromY, toX, toY){
		this.initialize(fromX, fromY, toX, toY);
	};

	var p = Line.prototype;

	/** 開始位置x */
	p.fromX;

	/** 開始位置y */
	p.fromY;
	
	/** 終着位置x */
	p.toX;
	
	/** 終着位置y */
	p.toY;

	/**
	 * 初期処理
	 * 
	 * @param fromX
	 * @param fromY
	 * @param toX
	 * @param toY
	 */
	p.initialize = function(fromX, fromY, toX, toY){
		this.fromX = fromX;
		this.fromY = fromY;
		this.toX = toX;
		this.toY = toY;
	};

	/**
	 * 更新処理
	 * 
	 * @param ctx
	 */
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