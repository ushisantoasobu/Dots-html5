this.dots = this.dots || {};


(function(){

	var MainCtrl = {};

	/*
	0	6
	1 	7
	2	8
	3
	4
	5
	*/

	//
	MainCtrl.FPS = 60;

	//
	MainCtrl.ROW_COUNT = 4;

	//
	MainCtrl.COLUMN_COUNT = 4;

	//キャンバス
	MainCtrl.canvas;

	//コンテクスト
	MainCtrl.ctx;

	//得点
	MainCtrl.score = 0;

	//ドットの配列
	MainCtrl.dotsArray = [],

	//現在対象にインデックスの配列
	MainCtrl.currentTargetIndexArray = [];

	//
	MainCtrl.connectedLinesPointArray = [];

	//
	MainCtrl.playFlg = true;

	/**  */
	MainCtrl.touchStartPoint = {x:0, y:0};

	MainCtrl.testPointArray = [	{x:50*1, y:50*1},{x:50*2, y:50*1},{x:50*3, y:50*1},{x:50*4, y:50*1},
								{x:50*1, y:50*2},{x:50*2, y:50*2},{x:50*3, y:50*2},{x:50*4, y:50*2},
								{x:50*1, y:50*3},{x:50*2, y:50*3},{x:50*3, y:50*3},{x:50*4, y:50*3},
								{x:50*1, y:50*4},{x:50*2, y:50*4},{x:50*3, y:50*4},{x:50*4, y:50*4}
							];

	//初期状態セット
	MainCtrl.setInitialSetting = function(canvas){
		MainCtrl.canvas = canvas;
		MainCtrl.ctx = canvas.getContext('2d');
		MainCtrl.canvas.addEventListener('touchstart', MainCtrl.canvasTouchStartHandler, false);
		MainCtrl.canvas.addEventListener('touchmove', MainCtrl.canvasTouchMoveHandler, false);
		MainCtrl.canvas.addEventListener('touchend', MainCtrl.canvasTouchEndHandler, false);

		var canvasRect = canvas.getBoundingClientRect();

		var color = 0;
		for (var i = 0; i < MainCtrl.COLUMN_COUNT; i++) {
			for (var j = 0; j < MainCtrl.ROW_COUNT; j++) {
				color = parseInt(Math.random() * 5);
				console.log(parseInt(i  / 4) * 4 + j);
				var dot = new dots.Dot(MainCtrl.ctx, color, 20, MainCtrl.testPointArray[i * 4 + j]);
				MainCtrl.dotsArray.push(color);
			}
		}
	};

	MainCtrl.drawDots = function() {
		for (var i = 0; i < MainCtrl.COLUMN_COUNT; i++) {
			for (var j = 0; j < MainCtrl.ROW_COUNT; j++) {
				var color = MainCtrl.dotsArray[i * 4 + j];
				var dot = new dots.Dot(MainCtrl.ctx, color, 20, MainCtrl.testPointArray[i * 4 + j]);
			}
		}	
	};

	MainCtrl.drawConnectedLines = function() {
		for (var i = 0; i < MainCtrl.connectedLinesPointArray.length - 1; i++) {
			MainCtrl.ctx.strokeStyle = 'black';
			MainCtrl.ctx.lineWidth = 10;
			MainCtrl.ctx.lineCap = 'round';
			MainCtrl.ctx.beginPath();
			MainCtrl.ctx.moveTo(MainCtrl.testPointArray[MainCtrl.connectedLinesPointArray[i]].x, MainCtrl.testPointArray[MainCtrl.connectedLinesPointArray[i]].y);
			MainCtrl.ctx.lineTo(MainCtrl.testPointArray[MainCtrl.connectedLinesPointArray[i + 1]].x, MainCtrl.testPointArray[MainCtrl.connectedLinesPointArray[i + 1]].y);
			MainCtrl.ctx.stroke();
		};
	}

	//新しいドットを追加する
	MainCtrl.addNewDots = function(){
		var createCount = 0;
		for (var i = 0; i < MainCtrl.COLUMN_COUNT; i++) {
			createCount = 0;
			for (var j = 0; j < MainCtrl.ROW_COUNT; j++) {
				if(MainCtrl.dotsArray[i * MainCtrl.ROW_COUNT + j] === null){
					createCount++;
				}
			}

			for (var k = 0; k < createCount; k++) {
				//dotを生成して配置する	
			}
		}

		MainCtrl.setPlayEnable();
	};

	//ドットをつめる
	MainCtrl.closeDots = function(){
		var checkCount = 0;
		var nullCount = 0;
		for (var i = 0; i < MainCtrl.COLUMN_COUNT; i++) {
			for (var j = 0; j < MainCtrl.ROW_COUNT; j++) {
				checkCount = MainCtrl.ROW_COUNT - j - 1; //-1は自分自身
				nullCount = 0;
				for (var k = 0; k < checkCount; k++) {
					if (true) {
						nullCount++;
					}
				}
				MainCtrl.fallDot(MainCtrl.dotsArray[i * MainCtrl.ROW_COUNT + j], nullCount);
				//TODO:配列も入れ替える
			}
		}
	};

	//ドットを削除する
	MainCtrl.removeDots = function(indexArray){
		for (var i = indexArray.length - 1; i >= 0; i--) {

			MainCtrl.dotsArray[indexArray[i]] = null;	
		}

		MainCtrl.closeDots();
	};

	//ドットを下にずらす
	MainCtrl.fallDot = function(target, amount){
		//

		MainCtrl.addNewDots();
	};

	MainCtrl.canvasTouchStartHandler = function(e){
		/*
		MainCtrl.touchStartPoint.x = e.changedTouches[0].screenX;
		MainCtrl.touchStartPoint.y = e.changedTouches[0].screenY;
		console.log('startX:' + MainCtrl.touchStartPoint.x);
		console.log('startY:' + MainCtrl.touchStartPoint.y);
		*/
		if(!MainCtrl.playFlg){return;}
		//もしドットの上であれば選択したものとする

		MainCtrl.connectedLinesPointArray = [];

		event.preventDefault();
	};

	MainCtrl.canvasTouchMoveHandler = function(e){
		console.log('move');
		if(!MainCtrl.playFlg){return;}

		//clear
		MainCtrl.ctx.clearRect(0,0,MainCtrl.canvas.width,MainCtrl.canvas.height);
		MainCtrl.drawDots();
		MainCtrl.drawConnectedLines();

		var len = MainCtrl.testPointArray.length;
		for (var i = len - 1; i >= 0; i--) {
			var x = parseInt(e.changedTouches[0].screenX);	
			var y = parseInt(e.changedTouches[0].screenY);	
			if (x > MainCtrl.testPointArray[i].x && 
				x < MainCtrl.testPointArray[i].x + 20 && 
				y > MainCtrl.testPointArray[i].y &&
				y < MainCtrl.testPointArray[i].y + 20 ) {
				MainCtrl.touchStartPoint.x = MainCtrl.testPointArray[i].x;
				MainCtrl.touchStartPoint.y = MainCtrl.testPointArray[i].y;
				console.log('startX:' + x);
				console.log('startY:' + y);

				MainCtrl.connectedLinesPointArray.push(i);

				break;
			}
		}

		MainCtrl.ctx.strokeStyle = 'black';
		MainCtrl.ctx.lineWidth = 10;
		MainCtrl.ctx.lineCap = 'round';
		MainCtrl.ctx.beginPath();
		MainCtrl.ctx.moveTo(MainCtrl.touchStartPoint.x, MainCtrl.touchStartPoint.y);
		MainCtrl.ctx.lineTo(e.changedTouches[0].screenX, e.changedTouches[0].screenY);
		MainCtrl.ctx.stroke();

		//１つでも選択してある状態であれば線を描画する

		//もしdotの上にきたら
		//すでに選択したものであれば無視
		//もしそのdotが最初に選択したdotと同じ色のものだったら

		event.preventDefault();
	}

	MainCtrl.canvasTouchEndHandler = function(e){
		console.log('end');
		if(!MainCtrl.playFlg){return;}
		if(MainCtrl.currentTargetIndexArray.length > 1){
			MainCtrl.setPlayDisable();
			MainCtrl.removeDots(MainCtrl.currentTargetIndexArray);
			MainCtrl.currentTargetIndexArray = []; //初期化
		}

		event.preventDefault();
	};

	MainCtrl.setPlayEnable = function(){
		MainCtrl.playFlg = true;
	};

	MainCtrl.setPlayDisable = function(){
		MainCtrl.playFlg = false;
	};

	dots.MainCtrl = MainCtrl;
})();