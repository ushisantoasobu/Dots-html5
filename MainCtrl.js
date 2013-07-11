this.dots = this.dots || {};


(function(){

	var MainCtrl = {};


	//-----------------------------------
	// constant variables
	//-----------------------------------

	/** fps */
	MainCtrl.FPS = 60;

	/** row count */
	MainCtrl.ROW_COUNT = 4;

	/** colomun count */
	MainCtrl.COLUMN_COUNT = 4;

	/** explanation */
	MainCtrl.DOTS_DISTANCE = 50;

	/** touch range(radius) */
	MainCtrl.TOUCH_RANGE = 25;


	//-----------------------------------
	// variables
	//-----------------------------------

	/** canvas */
	MainCtrl.canvas;

	/** context */
	MainCtrl.ctx;

	/** count of delete total dots */
	MainCtrl._deleteDotsCount = 0;

	/** count of delete action */
	MainCtrl._deleteCount = 0;

	/** dots arrat */
	MainCtrl.dotsArray = [];

	//現在対象にインデックスの配列
	MainCtrl.currentTargetIndexArray = [];

	//
	MainCtrl.connectedLinesPointArray = [];

	/** 現在選択中の色 */
	MainCtrl.currentTargetColor = -1;

	//
	MainCtrl.playFlg = true;

	/**  */
	MainCtrl.touchStartPoint = {x:0, y:0};

	/** explanation */
 	MainCtrl.pointArray = [];

 	MainCtrl.scoreEvent;


	//-----------------------------------
	// function
	//-----------------------------------

	/**
	 * 初期状態セット
	 * 
	 * @param canvas
	 */
	MainCtrl.setInitialSetting = function(canvas){

		MainCtrl.canvas = canvas;
		MainCtrl.ctx = canvas.getContext('2d');

		//set up listeners
		MainCtrl.canvas.addEventListener('touchstart', MainCtrl.canvasTouchStartHandler, false);
		MainCtrl.canvas.addEventListener('touchmove', MainCtrl.canvasTouchMoveHandler, false);
		MainCtrl.canvas.addEventListener('touchend', MainCtrl.canvasTouchEndHandler, false);

		for (var i = 0; i < MainCtrl.ROW_COUNT; i++) {
			for (var j = 0; j < MainCtrl.COLUMN_COUNT; j++) {
				//set up pointArray
				MainCtrl.pointArray.push({	x:MainCtrl.DOTS_DISTANCE * (j + 1),
											y:MainCtrl.DOTS_DISTANCE * (i + 1)});
			}
		}

		var color = 0;
		for (var i = 0; i < MainCtrl.COLUMN_COUNT; i++) {
			for (var j = 0; j < MainCtrl.ROW_COUNT; j++) {
				//set up dotsArray
				color = parseInt(Math.random() * dots.Dot.COLORLIST.length);//5
				var dot = new dots.Dot(MainCtrl.ctx, color, 20, MainCtrl.pointArray[i * 4 + j]);
				MainCtrl.dotsArray.push(color);
			}
		}

		//set up events
		MainCtrl.scoreEvent = document.createEvent('Events');
		MainCtrl.scoreEvent.initEvent('mainctrl_score_event', true, true);
	};

	/**
	 * データを初期化
	 */
	MainCtrl.resetData = function(){
		MainCtrl.currentTargetColor = -1;
		MainCtrl.connectedLinesPointArray = [];
		MainCtrl.touchStartPoint = {x:0, y:0};
	}

	/**
	 * explanation
	 * 
	 * @param explanation
	 * @return explanation
	 */
	MainCtrl.drawDots = function() {
		for (var i = 0; i < MainCtrl.COLUMN_COUNT; i++) {
			for (var j = 0; j < MainCtrl.ROW_COUNT; j++) {
				var color = MainCtrl.dotsArray[i * 4 + j];
				if(color !== -1){
					var dot = new dots.Dot(MainCtrl.ctx, color, 20, MainCtrl.pointArray[i * 4 + j]);
				} else {
					console.log("asafsdafda");
				}
			}
		}
	};

	/**
	 * explanation
	 * 
	 * @param explanation
	 * @return explanation
	 */
	MainCtrl.drawConnectedLines = function() {
		for (var i = 0; i < MainCtrl.connectedLinesPointArray.length - 1; i++) {
			MainCtrl.drawLine(MainCtrl.pointArray[MainCtrl.connectedLinesPointArray[i]].x,
			 MainCtrl.pointArray[MainCtrl.connectedLinesPointArray[i]].y,
			 MainCtrl.pointArray[MainCtrl.connectedLinesPointArray[i + 1]].x,
			 MainCtrl.pointArray[MainCtrl.connectedLinesPointArray[i + 1]].y);
		};
	}

	/**
	 * explanation
	 * 
	 * @param explanation
	 * @return explanation
	 */
	MainCtrl.drawLine = function(fromX, fromY, toX, toY) {
		MainCtrl.ctx.strokeStyle = 'gray';
		MainCtrl.ctx.lineWidth = 5;
		MainCtrl.ctx.lineCap = 'round';
		MainCtrl.ctx.beginPath();
		MainCtrl.ctx.moveTo(fromX, fromY);
		MainCtrl.ctx.lineTo(toX, toY);
		MainCtrl.ctx.stroke();
	};

	/**
	 * 新しいドットを追加する
	 */
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

	/**
	 * ドットをつめる
	 */
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

	/**
	 * ドットを削除する
	 * 
	 * @param indexArray
	 */
	MainCtrl.removeDots = function(indexArray){
		for (var i = indexArray.length - 1; i >= 0; i--) {

			MainCtrl.dotsArray[indexArray[i]] = null;	
		}

		MainCtrl.closeDots();
	};

	/**
	 * ドットを下にずらす
	 * 
	 * @param target
	 * @param amount
	 */
	MainCtrl.fallDot = function(target, amount){
		//

		MainCtrl.addNewDots();
	};

	/**
	 * explanation
	 * 
	 * @param explanation
	 * @return explanation
	 */
	MainCtrl.canvasTouchStartHandler = function(e){

		if(!MainCtrl.playFlg){return;}

		MainCtrl.touchStartPoint.x = e.changedTouches[0].screenX - MainCtrl.canvas.offsetLeft;
		MainCtrl.touchStartPoint.y = e.changedTouches[0].screenY - MainCtrl.canvas.offsetTop;

		console.log('startX:' + MainCtrl.touchStartPoint.x);
		console.log('startY:' + MainCtrl.touchStartPoint.y);

		var len = MainCtrl.pointArray.length;
		for (var i = len - 1; i >= 0; i--) {
			if (MainCtrl.touchStartPoint.x > MainCtrl.pointArray[i].x - MainCtrl.TOUCH_RANGE && 
				MainCtrl.touchStartPoint.x < MainCtrl.pointArray[i].x + MainCtrl.TOUCH_RANGE && 
				MainCtrl.touchStartPoint.y > MainCtrl.pointArray[i].y - MainCtrl.TOUCH_RANGE &&
				MainCtrl.touchStartPoint.y < MainCtrl.pointArray[i].y + MainCtrl.TOUCH_RANGE ) {

				MainCtrl.touchStartPoint.x = MainCtrl.pointArray[i].x;
				MainCtrl.touchStartPoint.y = MainCtrl.pointArray[i].y;
				MainCtrl.currentTargetColor = MainCtrl.dotsArray[i];
				MainCtrl.connectedLinesPointArray.push(i);
				break;
			}
		}

		event.preventDefault();
	};

	/**
	 * explanation
	 * 
	 * @param explanation
	 * @return explanation
	 */
	MainCtrl.canvasTouchMoveHandler = function(e){

		if(!MainCtrl.playFlg){return;}

		//clear
		MainCtrl.ctx.clearRect(0,0,MainCtrl.canvas.width,MainCtrl.canvas.height);
		MainCtrl.drawDots();
		MainCtrl.drawConnectedLines();

		var len = MainCtrl.pointArray.length;
		for (var i = len - 1; i >= 0; i--) {
			var x = parseInt(e.changedTouches[0].screenX - MainCtrl.canvas.offsetLeft);	
			var y = parseInt(e.changedTouches[0].screenY - MainCtrl.canvas.offsetTop);	
			if (x > MainCtrl.pointArray[i].x - MainCtrl.TOUCH_RANGE && 
				x < MainCtrl.pointArray[i].x + MainCtrl.TOUCH_RANGE && 
				y > MainCtrl.pointArray[i].y - MainCtrl.TOUCH_RANGE &&
				y < MainCtrl.pointArray[i].y + MainCtrl.TOUCH_RANGE ) {

				if (MainCtrl.connectedLinesPointArray.length === 0) {

					MainCtrl.touchStartPoint.x = MainCtrl.pointArray[i].x;
					MainCtrl.touchStartPoint.y = MainCtrl.pointArray[i].y;
					MainCtrl.currentTargetColor = MainCtrl.dotsArray[i];
					MainCtrl.connectedLinesPointArray.push(i);	
					break;

				} else {

					if (MainCtrl.currentTargetColor === MainCtrl.dotsArray[i]){

						var flg = false;
						for (var j = MainCtrl.connectedLinesPointArray.length - 1; j >= 0; j--) {
							if(MainCtrl.connectedLinesPointArray[j] === i){
								flg = true;
								break;
							}
						}
						if (!flg) {

							var lastIndex = MainCtrl.connectedLinesPointArray[MainCtrl.connectedLinesPointArray.length - 1];
							if(i === lastIndex - 1 && MainCtrl.checkExistDotLeft(lastIndex)) {
								MainCtrl.touchStartPoint.x = MainCtrl.pointArray[i].x;
								MainCtrl.touchStartPoint.y = MainCtrl.pointArray[i].y;
								MainCtrl.connectedLinesPointArray.push(i);	
								break;
							} else if (i === lastIndex + 1 && MainCtrl.checkExistDotRight(lastIndex)) {
								MainCtrl.touchStartPoint.x = MainCtrl.pointArray[i].x;
								MainCtrl.touchStartPoint.y = MainCtrl.pointArray[i].y;
								MainCtrl.connectedLinesPointArray.push(i);	
								break;
							} else if (i === lastIndex - 4 && MainCtrl.checkExistDotTop(lastIndex)) {
								MainCtrl.touchStartPoint.x = MainCtrl.pointArray[i].x;
								MainCtrl.touchStartPoint.y = MainCtrl.pointArray[i].y;
								MainCtrl.connectedLinesPointArray.push(i);	
								break;
							} else if (i === lastIndex + 4 && MainCtrl.checkExistDotBottom(lastIndex)) {
								MainCtrl.touchStartPoint.x = MainCtrl.pointArray[i].x;
								MainCtrl.touchStartPoint.y = MainCtrl.pointArray[i].y;
								MainCtrl.connectedLinesPointArray.push(i);	
								break;		
							}
						}
					}
				}
			}
		}

		MainCtrl.drawLine(MainCtrl.touchStartPoint.x,
		 MainCtrl.touchStartPoint.y,
		 e.changedTouches[0].screenX - MainCtrl.canvas.offsetLeft,
		 e.changedTouches[0].screenY - MainCtrl.canvas.offsetTop)

		//１つでも選択してある状態であれば線を描画する

		//もしdotの上にきたら
		//すでに選択したものであれば無視
		//もしそのdotが最初に選択したdotと同じ色のものだったら

		event.preventDefault();
	}

	/**
	 * explanation
	 * 
	 * @param explanation
	 * @return explanation
	 */
	MainCtrl.checkExistDotLeft = function(index){
		var flg = true;
		if (index % 4 === 0) {
			flg = false;
		}
		return flg;
	};

	/**
	 * explanation
	 * 
	 * @param explanation
	 * @return explanation
	 */
	MainCtrl.checkExistDotRight = function(index){
		var flg = true;
		if (index % 4 === 3) {
			flg = false;
		}
		return flg;
	};

	/**
	 * explanation
	 * 
	 * @param explanation
	 * @return explanation
	 */
	MainCtrl.checkExistDotTop = function(index){
		var flg = true;
		if (index < 4) {
			flg = false;
		}
		return flg;
	};

	/**
	 * explanation
	 * 
	 * @param explanation
	 * @return explanation
	 */
	MainCtrl.checkExistDotBottom = function(index){
		var flg = true;
		if (index > 4 * (4 - 1)) {
			flg = false;
		}
		return flg;
	};

	/**
	 * explanation
	 * 
	 * @param explanation
	 * @return explanation
	 */
	MainCtrl.canvasTouchEndHandler = function(e){

		if(!MainCtrl.playFlg){return;}

		event.preventDefault();

		if(MainCtrl.connectedLinesPointArray.length > 1){

			//クリアするdotがあるとき

			MainCtrl.setPlayDisable();
			setTimeout(function(){

				// MainCtrl.removeDots(MainCtrl.connectedLinesPointArray);
				// MainCtrl.connectedLinesPointArray = []; //初期化

				for (var i = MainCtrl.connectedLinesPointArray.length - 1; i >= 0; i--) {
					MainCtrl.dotsArray[MainCtrl.connectedLinesPointArray[i]] = -1;	
				}

				//計算
				var tempArray = [];
				for (var i = 0; i < MainCtrl.COLUMN_COUNT * MainCtrl.ROW_COUNT; i++) {
					tempArray[i] = {color: -1, fallCount:0};
				}
				for (var j = 0; j < MainCtrl.dotsArray.length; j++) {
					var count = MainCtrl.getFallCount(j);
					var targetIndex = j + count * MainCtrl.COLUMN_COUNT;
					if(targetIndex < MainCtrl.COLUMN_COUNT * MainCtrl.ROW_COUNT) {
						tempArray[targetIndex] = {color:MainCtrl.dotsArray[j], fallCount:count};
					}
				}

				for (var k = 0; k < MainCtrl.COLUMN_COUNT * MainCtrl.ROW_COUNT; k++) {
					if(tempArray[k].color === -1) {
						var count = parseInt(Math.floor(k / MainCtrl.COLUMN_COUNT) + 1);
						tempArray[k] = {color:parseInt(Math.random() * 3), fallCount:count};//5;
					}
				}

				MainCtrl._deleteCount++;
				MainCtrl._deleteDotsCount += MainCtrl.connectedLinesPointArray.length;

				console.log("MainCtrl._deleteCount:" + MainCtrl._deleteCount); 
				console.log("MainCtrl._deleteDotsCount:" + MainCtrl._deleteDotsCount);
				document.dispatchEvent(MainCtrl.scoreEvent);

				MainCtrl.startFallAnimation(tempArray);

				MainCtrl.resetData();

			}, 1000 / MainCtrl.FPS * 8);

		} else {
			//クリアするdotがないとき
			MainCtrl.ctx.clearRect(0,0,MainCtrl.canvas.width,MainCtrl.canvas.height);
			MainCtrl.drawDots();

			MainCtrl.resetData();
		}
	};

	/**
	 * explanation
	 * 
	 * @param index
	 * @return count
	 */
	MainCtrl.getFallCount = function(index) {
		var count = 0;
		var div = Math.floor(index / MainCtrl.COLUMN_COUNT); 	//剰
		var remainder = index % MainCtrl.COLUMN_COUNT; 			//余
		for (var j = MainCtrl.ROW_COUNT; j > div; j--) {
			if(MainCtrl.dotsArray[(j - 1) * MainCtrl.COLUMN_COUNT + remainder] === -1) {
				count++;
			}
		}
		return count;
	};

	/**
	 * explanation
	 * 
	 * @param explanation
	 */
	MainCtrl.startFallAnimation = function(array) {

		var timeCount = 0;
		var timer = setInterval(function(){

			MainCtrl.ctx.clearRect(0,0,MainCtrl.canvas.width,MainCtrl.canvas.height);
			MainCtrl.drawAnimationDots(array, timeCount);

			if(timeCount === 30){
				console.log("タイマー削除");
				clearInterval(timer);
				for (var i = 0; i < MainCtrl.dotsArray.length; i++) {
					MainCtrl.dotsArray[i] = array[i].color;
				}
				MainCtrl.setPlayEnable();
			}
			timeCount++;
		}, 500 / MainCtrl.FPS); //1000 * 30 / 60
	};

	/**
	 * explanation
	 * 
	 * @param explanation
	 * @param explanation
	 */
	MainCtrl.drawAnimationDots = function(array, timeCount) {
		for (var i = 0; i < MainCtrl.COLUMN_COUNT; i++) {
			for (var j = 0; j < MainCtrl.ROW_COUNT; j++) {
				var color = array[i * 4 + j].color;
				var fallCount = array[i * 4 + j].fallCount;
				if(fallCount > 0){
					var pos = {
						x:MainCtrl.pointArray[i * 4 + j].x, 
						y:MainCtrl.pointArray[i * 4 + j].y - (30 - timeCount) / 30 * (fallCount * 50)
					};
					var dot = new dots.Dot(MainCtrl.ctx, color, 20, pos);
				} else {
					var dot = new dots.Dot(MainCtrl.ctx, color, 20, MainCtrl.pointArray[i * 4 + j]);
				}
			}
		}	
	};

	MainCtrl.getDeleteCount = function(){
		return MainCtrl._deleteCount;
	};

	MainCtrl.getDeleteDotsCount = function(){
		return MainCtrl._deleteDotsCount;
	}

	/**
	 * プレイ可能状態にする
	 */
	MainCtrl.setPlayEnable = function(){
		MainCtrl.playFlg = true;
	};

	/**
	 * プレイ不可能状態にする
	 */
	MainCtrl.setPlayDisable = function(){
		MainCtrl.playFlg = false;
	};

	dots.MainCtrl = MainCtrl;
})();