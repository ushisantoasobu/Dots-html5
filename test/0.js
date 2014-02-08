describe('0', function() {

  //test
  it('trueが返ってくるか確認する', function() {
    expect(dots.MainCtrl.testTestem()).to.eql(true);
  });

  it('gameoverになる', function(){
	var m = dots.MainCtrl;
	m.dotContainer = new dots.Container();
	var arr = [	0, 1, 0, 1,
				1, 0, 1, 0,
				0, 1, 0, 1,
				1, 0, 1, 0];
	for (var i = 0; i < arr.length; i++) {
		m.dotContainer.addChild(new dots.Dot(0, 0, 0, arr[i]));
	}
  	expect(m._isGameOver()).to.eql(true);
  });

  it('gameoverにならない', function(){
	var m = dots.MainCtrl;
	m.dotContainer = new dots.Container();
	var arr = [	0, 1, 0, 1,
				1, 0, 1, 0,
				0, 1, 0, 1,
				1, 2, 1, 1];
	for (var i = 0; i < arr.length; i++) {
		m.dotContainer.addChild(new dots.Dot(0, 0, 0, arr[i]));
	}
  	expect(m._isGameOver()).to.eql(false);
  });

  it('gameoverにならない', function(){
	var m = dots.MainCtrl;
	m.dotContainer = new dots.Container();
	var arr = [	1, 2, 3, 4,
				5, 6, 7, 8,
				1, 2, 7, 4,
				5, 6, 7, 8];
	for (var i = 0; i < arr.length; i++) {
		m.dotContainer.addChild(new dots.Dot(0, 0, 0, arr[i]));
	}
  	expect(m._isGameOver()).to.eql(false);
  });

});