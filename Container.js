this.dots = this.dots || {};


(function(){

	var Container = function(){
		this.initialize();
	};

	var p = Container.prototype;

	
	p._children;

	p.x;

	p.y;

	
	p.initialize = function(){
		this._children = [];
		this.x = 0;
		this.y = 0;
	};

	p.update = function(ctx){
		//
		for (var i = 0; i < this._children.length; i++) {
			var obj = this._children[i];
			obj.update(ctx, this.x, this.y);
		}

	}

	p.addChild = function(obj){
		
		if(obj == null){
			return;
		}

		this._children.push(obj);
	};

	p.getChildAt = function(index){
		return this._children[index];
	};

	p.removeChildAt = function(index){
		if(this._children.length === 0){
			return;
		}

		if(index > this._children.length - 1){
			return;
		}

		this._children.splice(index, 1);
	};

	p.removeAllChildren = function(){
		this._children = [];
	}

	p.getNumChildren = function(){
		return this._children.length;
	};


	dots.Container = Container;
})();