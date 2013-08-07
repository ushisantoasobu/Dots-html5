this.dots = this.dots || {};


(function(){

	var Stage = function(canvas){
		this.initialize(canvas);
	};

	var p = Stage.prototype = new dots.Container();

	p._canvas;

	p._ctx;

	
	p.initialize = function(canvas){
		this._canvas = canvas;
		this._ctx = canvas.getContext('2d');
	};

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

	}

	p.getCanvas = function(){
		return this._canvas;
	};


	dots.Stage = Stage;
})();