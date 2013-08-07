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
	MainCtrl.stage;

	/** explanation */
	MainCtrl.lineContainer;

	/** explanation */
	MainCtrl.dotContainer;

	/** count of delete total dots */
	MainCtrl._deleteDotsCount = 0;

	/** count of delete action */
	MainCtrl._deleteCount = 0;

	/** dots arrat */
	MainCtrl.dotsArray = [];

	//現在対象にインデックスの配列
	MainCtrl.currentTargetIndexArray = [];

	MainCtrl.selectedDotsArray = [];

	//
	//MainCtrl.connectedLinesPointArray = [];

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

		MainCtrl.stage = new dots.Stage(canvas);

		MainCtrl.lineContainer = new dots.Container();
		MainCtrl.dotContainer = new dots.Container();
		MainCtrl.stage.addChild(MainCtrl.dotContainer);
		MainCtrl.stage.addChild(MainCtrl.lineContainer);

		//setup listeners
		canvas.addEventListener('touchstart', MainCtrl.canvasTouchStartHandler, false);
		canvas.addEventListener('touchmove', MainCtrl.canvasTouchMoveHandler, false);
		canvas.addEventListener('touchend', MainCtrl.canvasTouchEndHandler, false);

		//setup dots
		var color = 0;
		for (var i = 0; i < MainCtrl.ROW_COUNT; i++) {
			for (var j = 0; j < MainCtrl.COLUMN_COUNT; j++) {

				color = parseInt(Math.random() * dots.Dot.COLORLIST.length);
				var dot = new dots.Dot(	MainCtrl.DOTS_DISTANCE * (j + 1), 
										MainCtrl.DOTS_DISTANCE * (i + 1), 
										20, 
										color);
				dot.positionIndex = i + MainCtrl.ROW_COUNT * j;
				MainCtrl.dotContainer.addChild(dot);
				MainCtrl.dotsArray.push(color);
			}
		}

		//set up events
		MainCtrl.scoreEvent = document.createEvent('Events');
		MainCtrl.scoreEvent.initEvent('mainctrl_score_event', true, true);

		setInterval(function(){
			MainCtrl.stage.update();
		}, 1000 / 60);
	};

	/**
	 * データを初期化
	 */
	MainCtrl.resetData = function(){
		MainCtrl.currentTargetColor = -1;
		MainCtrl.selectedDotsArray = [];
		MainCtrl.touchStartPoint = {x:0, y:0};
	}

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

		MainCtrl.touchStartPoint.x = e.changedTouches[0].screenX - MainCtrl.stage.getCanvas().offsetLeft;
		MainCtrl.touchStartPoint.y = e.changedTouches[0].screenY - MainCtrl.stage.getCanvas().offsetTop;

		var len = MainCtrl.dotContainer.getNumChildren();
		for (var i = len - 1; i >= 0; i--) {
			var dot = MainCtrl.dotContainer.getChildAt(i);
			if (MainCtrl.touchStartPoint.x > dot.x - MainCtrl.TOUCH_RANGE && 
				MainCtrl.touchStartPoint.x < dot.x + MainCtrl.TOUCH_RANGE && 
				MainCtrl.touchStartPoint.y > dot.y - MainCtrl.TOUCH_RANGE &&
				MainCtrl.touchStartPoint.y < dot.y + MainCtrl.TOUCH_RANGE ) {

				MainCtrl.touchStartPoint.x = dot.x;
				MainCtrl.touchStartPoint.y = dot.y;
				MainCtrl.currentTargetColor = dot.color;
				dot.selected = true;
				selectedDotsArray.push(dot);
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

		//線の描画は一旦削除
		var lineCount = MainCtrl.lineContainer.getNumChildren();
		if(lineCount > 0){
			MainCtrl.lineContainer.removeChildAt(lineCount - 1);
		}

		var len = MainCtrl.dotContainer.getNumChildren();
		for (var i = len - 1; i >= 0; i--) {
			var x = parseInt(e.changedTouches[0].screenX - MainCtrl.stage.getCanvas().offsetLeft);	
			var y = parseInt(e.changedTouches[0].screenY - MainCtrl.stage.getCanvas().offsetTop);
			var dot = MainCtrl.dotContainer.getChildAt(i);

			//いずれかのドットに触れたとき
			if (x > dot.x - MainCtrl.TOUCH_RANGE && 
				x < dot.x + MainCtrl.TOUCH_RANGE && 
				y > dot.y - MainCtrl.TOUCH_RANGE &&
				y < dot.y + MainCtrl.TOUCH_RANGE ) {

				var selectedDotsCount = MainCtrl.selectedDotsArray.length;
				if (selectedDotsCount === 0) {
					//まだいずれのドットも選択状態にないとき

					MainCtrl.touchStartPoint.x = dot.x;
					MainCtrl.touchStartPoint.y = dot.y;
					MainCtrl.currentTargetColor = dot.color;
					dot.selected = true;
					MainCtrl.selectedDotsArray.push(dot);	
					break;

				} else {
					//すでにいずれかのドットが選択状態にあるとき

					if (MainCtrl.currentTargetColor === dot.color){

						//まだ選択されたものでないとき
						if (dot.selected === false) {

							var lastDot = MainCtrl.selectedDotsArray[selectedDotsCount - 1];
							var lastIndex = lastDot.positionIndex;

							if(dot.positionIndex === lastIndex - 1 && MainCtrl.checkExistDotLeft(lastIndex)) {

								MainCtrl.touchStartPoint.x = dot.x;
								MainCtrl.touchStartPoint.y = dot.y;
								dot.selected = true;
								MainCtrl.selectedDotsArray.push(dot);

								//線の描画
								var lineCount = MainCtrl.lineContainer.getNumChildren();
								var line = MainCtrl.lineContainer.getChildAt(lineCount - 1);
								var line = new dots.Line(
									lastDot.x,
							 		lastDot.y,
							 		dot.x,
							 		dot.y
							 	);
							 	MainCtrl.lineContainer.addChild(line);

								break;
							} else if (dot.positionIndex === lastIndex + 1 && MainCtrl.checkExistDotRight(lastIndex)) {

								MainCtrl.touchStartPoint.x = dot.x;
								MainCtrl.touchStartPoint.y = dot.y;
								dot.selected = true;
								MainCtrl.selectedDotsArray.push(dot);

								//線の描画
								var lineCount = MainCtrl.lineContainer.getNumChildren();
								var line = MainCtrl.lineContainer.getChildAt(lineCount - 1);
								var line = new dots.Line(
									lastDot.x,
							 		lastDot.y,
							 		dot.x,
							 		dot.y
							 	);
							 	MainCtrl.lineContainer.addChild(line);

								break;
							} else if (dot.positionIndex === lastIndex - 4 && MainCtrl.checkExistDotTop(lastIndex)) {

								MainCtrl.touchStartPoint.x = dot.x;
								MainCtrl.touchStartPoint.y = dot.y;
								dot.selected = true;
								MainCtrl.selectedDotsArray.push(dot);

								//線の描画
								var lineCount = MainCtrl.lineContainer.getNumChildren();
								var line = MainCtrl.lineContainer.getChildAt(lineCount - 1);
								var line = new dots.Line(
									lastDot.x,
							 		lastDot.y,
							 		dot.x,
							 		dot.y
							 	);
							 	MainCtrl.lineContainer.addChild(line);

								break;
							} else if (dot.positionIndex === lastIndex + 4 && MainCtrl.checkExistDotBottom(lastIndex)) {

								MainCtrl.touchStartPoint.x = dot.x;
								MainCtrl.touchStartPoint.y = dot.y;
								dot.selected = true;
								MainCtrl.selectedDotsArray.push(dot);

								//線の描画
								var lineCount = MainCtrl.lineContainer.getNumChildren();
								var line = MainCtrl.lineContainer.getChildAt(lineCount - 1);
								var line = new dots.Line(
									lastDot.x,
							 		lastDot.y,
							 		dot.x,
							 		dot.y
							 	);
							 	MainCtrl.lineContainer.addChild(line);

								break;		
							}
						}
					}
				}
			}
		}


		var line = new dots.Line(
									MainCtrl.touchStartPoint.x,
							 		MainCtrl.touchStartPoint.y,
							 		e.changedTouches[0].screenX - MainCtrl.stage.getCanvas().offsetLeft,
							 		e.changedTouches[0].screenY - MainCtrl.stage.getCanvas().offsetTop
							 	);

		MainCtrl.lineContainer.addChild(line);


		//１つでも選択してある状態であれば線を描画する

		//もしdotの上にきたら
		//すでに選択したものであれば無視
		//もしそのdotが最初に選択したdotと同じ色のものだったら

		event.preventDefault();
	};

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


		MainCtrl.lineContainer.removeAllChildren();

		event.preventDefault();

		if(MainCtrl.selectedDotsArray.length > 1){

			//クリアするdotがあるとき

			MainCtrl.setPlayDisable();

			//選択したものは削除する
			for (var i = MainCtrl.dotContainer.getNumChildren() - 1; i >= 0; i--) {
				var dot = MainCtrl.dotContainer.getChildAt(i);
				if(dot.selected === true){
					MainCtrl.dotContainer.removeChildAt(i);
				}
			}
			

			/*
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


				MainCtrl.startFallAnimation(tempArray);


			}, 1000 / MainCtrl.FPS * 8);
			*/

			//点数の更新
			MainCtrl._deleteCount++;
			MainCtrl._deleteDotsCount += MainCtrl.selectedDotsArray.length;

			document.dispatchEvent(MainCtrl.scoreEvent);
			
			MainCtrl.resetData();

		} else {
			//クリアするdotがないとき

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

			MainCtrl.ctx.clearRect(0,0,MainCtrl.stage.getCanvas().width,MainCtrl.stage.getCanvas().height);
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
					var dot = new dots.Dot(pos.x, pos.y, 20, color);
				} else {
					var dot = new dots.Dot(MainCtrl.pointArray[i * 4 + j].x, MainCtrl.pointArray[i * 4 + j].y, 20, color);
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