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

	//

	it('次のdotになれる', function(){
		var dot = new dots.Dot(0, 0, 0, 0);
		dot.positionIndex = 0;
		var lastIndex = 1;
	  	expect(m.isAbleToBeNextDot(dot, lastIndex)).to.eql(true);
	});

	it('次のdotになれる', function(){
		var dot = new dots.Dot(0, 0, 0, 0);
		dot.positionIndex = 2;
		var lastIndex = 6;
	  	expect(m.isAbleToBeNextDot(dot, lastIndex)).to.eql(true);
	});

	it('次のdotになれる', function(){
		var dot = new dots.Dot(0, 0, 0, 0);
		dot.positionIndex = 11;
		var lastIndex = 7;
	  	expect(m.isAbleToBeNextDot(dot, lastIndex)).to.eql(true);
	});

	it('次のdotになれる', function(){
		var dot = new dots.Dot(0, 0, 0, 0);
		dot.positionIndex = 7;
		var lastIndex = 6;
	  	expect(m.isAbleToBeNextDot(dot, lastIndex)).to.eql(true);
	});

	it('次のdotになれない', function(){
		var dot = new dots.Dot(0, 0, 0, 0);
		dot.positionIndex = 3;
		var lastIndex = 4;
	  	expect(m.isAbleToBeNextDot(dot, lastIndex)).to.eql(false);
	});

	it('次のdotになれない', function(){
		var dot = new dots.Dot(0, 0, 0, 0);
		dot.positionIndex = 0;
		var lastIndex = 2;
	  	expect(m.isAbleToBeNextDot(dot, lastIndex)).to.eql(false);
	});

	//

	it('indexを9に更新する', function(){
		var beforeIndex = 1;
		var removedIndexArray = [5, 6, 7, 9, 10, 11, 12];
		expect(m._updateIndex(beforeIndex, removedIndexArray)).to.eql(9);
	});

	it('indexが1のままであること', function(){
		var beforeIndex = 1;
		var removedIndexArray = [2, 3, 4, 6, 7, 8, 10, 11, 12];
		expect(m._updateIndex(beforeIndex, removedIndexArray)).to.eql(1);
	});

	//

	it('３つのドットが消えることになる', function(){
		var beforeIndex = 0;
		var removedIndexArray = [2, 3, 4, 6, 7, 8, 10, 11, 12];
		expect(m._getDeletedCountForColumn(beforeIndex, removedIndexArray)).to.eql(3);
	});

	it('２つのドットが消えることになる', function(){
		var beforeIndex = 11;
		var removedIndexArray = [1, 2, 3, 7, 8, 13, 14];
		expect(m._getDeletedCountForColumn(beforeIndex, removedIndexArray)).to.eql(2);
	});

	//

	it('次に生成されるドットのインデックスの配列', function(){
		m.dotContainer.removeAllChildren(); //一旦削除
		var positionIndexList = [0, 1, 2, 3, 8, 9, 10, 11],
			len = positionIndexList.length,
			i,
			dot;

		for (i = 0; i < len; i++) {
			var dot = new dots.Dot(0, 0, 0, 0);
			dot.positionIndex = positionIndexList[i];
			m.dotContainer.addChild(dot);
		}
		expect(m._createNextBornIndexArray()).to.eql([4 ,5 ,6 ,7 ,12 ,13 ,14 ,15]);
	});

});