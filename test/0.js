describe('0', function() {

	var m = dots.MainCtrl;

	//以下gameover関連

	it('gameoverになる', function(){
		// var m = dots.MainCtrl;
		m.dotContainer = new dots.Container();
		var arr = [	0, 1, 0, 1,
					1, 0, 1, 0,
					0, 1, 0, 1,
					1, 0, 1, 0];
		for (var i = 0; i < arr.length; i++) {
			var dot = new dots.Dot(0, 0, 0, arr[i]);
			dot.positionIndex = i;
			m.dotContainer.addChild(dot);
		}
	  	expect(m._isGameOver()).to.eql(true);
	});

	it('gameoverになる', function(){
		// var m = dots.MainCtrl;
		m.dotContainer = new dots.Container();
		var arr = [	0, 1, 2, 0,
					1, 0, 1, 2,
					0, 1, 0, 1,
					2, 0, 2, 0];
		for (var i = 0; i < arr.length; i++) {
			var dot = new dots.Dot(0, 0, 0, arr[i]);
			dot.positionIndex = i;
			m.dotContainer.addChild(dot);
		}
	  	expect(m._isGameOver()).to.eql(true);
	});

	it('gameoverにならない', function(){
		// var m = dots.MainCtrl;
		m.dotContainer = new dots.Container();
		var arr = [	0, 1, 0, 1,
					1, 0, 1, 0,
					0, 1, 0, 1,
					1, 2, 1, 1];
		for (var i = 0; i < arr.length; i++) {
			var dot = new dots.Dot(0, 0, 0, arr[i]);
			dot.positionIndex = i;
			m.dotContainer.addChild(dot);
		}
	  	expect(m._isGameOver()).to.eql(false);
	});

	it('gameoverにならない', function(){
		// var m = dots.MainCtrl;
		m.dotContainer = new dots.Container();
		var arr = [	1, 2, 3, 4,
					5, 6, 7, 8,
					1, 2, 3, 4,
					5, 6, 6, 8];
		for (var i = 0; i < arr.length; i++) {
			var dot = new dots.Dot(0, 0, 0, arr[i]);
			dot.positionIndex = i;
			m.dotContainer.addChild(dot);
		}
	  	expect(m._isGameOver()).to.eql(false);
	});

	//

	it('対象のdotに触れたことになる', function(){
		var point = {x:-24, y:24};
		var dot = new dots.Dot(0, 0, m.DOT_RADIUS, 0); //colorIdはなんでも良い
	  	expect(m._checkTouchInTargetDot(point, dot)).to.eql(true);
	});

	it('対象のdotに触れたことにならない', function(){
		var point = {x:25, y:0};
		var dot = new dots.Dot(0, 0, m.DOT_RADIUS, 0); //colorIdはなんでも良い
	  	expect(m._checkTouchInTargetDot(point, dot)).to.eql(false);
	});

});