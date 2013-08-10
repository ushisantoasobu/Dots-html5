this.dots = this.dots || {};


(function(){

	var Stage = function(canvas){
		this.initialize(canvas);
	};

	var p = Stage.prototype = new dots.Container();

	/** キャンバス */
	p._canvas;

	/** コンテクスト */
	p._ctx;

	/**
	 * 初期処理
	 * 
	 * @param canvas
	 */
	p.initialize = function(canvas){
		this._canvas = canvas;
		this._ctx = canvas.getContext('2d');
	};

	/**
	 * 更新処理
	 * 
	 */
	p.update = function(){
		//
		this._ctx.clearRect(0,0,this._canvas.width,this._canvas.height);

		//
		for (var i = 0; i < this._children.length; i++) {
			var obj = this._children[i];
			if(obj.update !== undefined){
				obj.update(this._ctx, 0, 0);//bad??
			}	
		}

	};

	/**
	 * キャンバスを取得する
	 * 
	 */
	p.getCanvas = function(){
		return this._canvas;
	};


	dots.Stage = Stage;
})();