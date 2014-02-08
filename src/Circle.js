this.dots = this.dots || {};


(function(){

	var Circle = function(x ,y, radius, color){
		this.initialize(x ,y, radius, color);
	};

	var p = Circle.prototype;


	/** x座標 */
	p.x = 0;

	/** y座標 */
	p.y = 0;

	/** 半径 */
	p.radius = 0;

	/** 色 */
	p.color = 0;
	

	/**
	 * 初期処理
	 * 
	 * @param x
	 * @param y
	 * @param radiu
	 * @param color
	 */
	p.initialize = function(x ,y, radius, color){
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;
	};

	/**
	 * 更新処理　TODO:drawのほうがよい？？
	 * 
	 * @param ctx
	 * @param addX 親の位置座標反映用
	 * @param addY 親の位置座標反映用
	 */
	p.update = function(ctx, addX, addY){
		ctx.beginPath();
		ctx.arc(this.x + addX, this.y + addY, this.radius, 0, Math.PI*2, false);
		ctx.fillStyle = this.color;
		ctx.fill();
	};

	dots.Circle = Circle;
})();