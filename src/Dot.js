this.dots = this.dots || {};


(function(){

	var Dot = function(x ,y, radius, colorId){
		this.initialize(x ,y, radius, colorId);
	};

	Dot.COLORLIST = [	'rgb(138, 199, 222)', 
						'rgb(217, 235, 82)', 
						'rgb(242, 107, 122)'];/*, 
						'rgb(200, 200, 111)', 
						'rgb(28, 111, 192)', ];*/

	var p = Dot.prototype = new dots.Circle();

	/** 色ID */
	p.colorId = 0;

	/** 選択状態かどうか */
	p.selected;

	/** 位置インデックス */
	p.positionIndex;

	/** 現在アニメーション中かどうか */
	p._isAnimation;

	/** explanation */
	p.Circle_initialize = p.initialize;

	/** explanation */
	p.Circle_update = p.update;
	

	/**
	 * 初期処理
	 * 
	 * @param x
	 * @param y
	 * @param radiu
	 * @param color
	 */
	p.initialize = function(x ,y, radius, colorId){
		// p.Circle_initialize(x ,y, radius, null);//TODO:なぜうまくいかない？？
		this.x = x;
		this.y = y;
		this.radius = radius;

		this.colorId = colorId;
		this.selected = false;
		this.positionIndex = 0;
		this._animation = false;
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
		ctx.fillStyle = Dot.COLORLIST[this.colorId];
		ctx.fill();

		this._drawRipple(ctx, addX, addY);
	};

	/**
	 * 移動アニメーション開始
	 * 
	 * @param fromX
	 * @param fromY
	 * @param toX
	 * @param toY
	 * @param fps
	 * @param duration
	 * @param callback
	 */
	p.startAnimation = function(fromX, fromY, toX, toY, fps, duration, callback){

		var that = this;

		if(duration === 0){
			that.x = toX;
			that.y = toY;
			if(callback){
				callback();
			}
			return;
		}

		this._isAnimation = true;
		var totalCount = fps * duration / 1000;
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
	};

	/**
	 * 波紋アニメーションをする	
	 * 
	 * @param 
	 * @return 
	 */
	p.rippleAnimation = function(){
		this._isRipple = true;
	};


	p._rippleCount = 0;

	p._isRipple = false;

	var ANIM_FRAME = 30;
	p._drawRipple = function(ctx, addX, addY){
		if(this._isRipple === true){
			if(this._rippleCount === ANIM_FRAME){
				this._isRipple = false;
				this._rippleCount = 0;
			} else {
				ctx.beginPath();
				ctx.arc(this.x + addX, this.y + addY, this.radius + this.radius * (this._rippleCount / ANIM_FRAME), 0, Math.PI * 2, false);
				ctx.strokeStyle = this._setAlpha(Dot.COLORLIST[this.colorId], 1 - this._rippleCount / ANIM_FRAME);
				ctx.lineWidth = 6;
				ctx.stroke();
			}
			this._rippleCount++;
		}
	}

	p._setAlpha = function(rgb, alpha){
		//surely, this is bad source
		if(typeof rgb !== "string"){
			return;
		}
		// if(){

		// }
		var ret;
		ret = rgb.replace("rgb", "rgba");
		ret = ret.replace(")", ", " + alpha + ")");
		return ret;
	};
	


	dots.Dot = Dot;
})();