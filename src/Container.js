this.dots = this.dots || {};


(function(){

	var Container = function(){
		this.initialize();
	};

	var p = Container.prototype;

	/** 子オブジェクト格納配列 */
	p._children;

	/** x座標 */
	p.x;

	/** y座標 */
	p.y;

	/**
	 * 初期処理
	 * 
	 */
	p.initialize = function(){
		this._children = [];
		this.x = 0;
		this.y = 0;
	};

	/**
	 * 更新処理
	 * 
	 * @param ctx
	 */
	p.update = function(ctx){
		for (var i = 0; i < this._children.length; i++) {
			var obj = this._children[i];
			obj.update(ctx, this.x, this.y);
		}
	}

	/**
	 * 子を追加する
	 * 
	 * @param obj
	 */
	p.addChild = function(obj){
		
		if(obj == null){
			return;
		}

		this._children.push(obj);
	};

	/**
	 * インデックスを指定して子を取得する
	 * 
	 * @param index
	 */
	p.getChildAt = function(index){
		return this._children[index];
	};

	/**
	 * インデックスを指定して子を削除する
	 * 
	 * @param index
	 */
	p.removeChildAt = function(index){
		if(this._children.length === 0){
			return;
		}

		if(index > this._children.length - 1){
			return;
		}

		this._children.splice(index, 1);
	};

	/**
	 * 子をすべて削除する
	 * 
	 */
	p.removeAllChildren = function(){
		this._children = [];
	}

	/**
	 * 子の数を取得する
	 * 
	 * @return 子の数
	 */
	p.getNumChildren = function(){
		return this._children.length;
	};


	dots.Container = Container;
})();