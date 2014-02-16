this.dots = this.dots || {};


(function(){

	var MainCtrl = {};


	//-----------------------------------
	// constant variables
	//-----------------------------------

	/** fps */
	self.FPS = 60;

	/** row count */
	self.ROW_COUNT = 4;

	/** colomun count */
	self.COLUMN_COUNT = 4;

	/** explanation */
	self.DOTS_DISTANCE = 50;

	/** touch range(radius) */
	self.TOUCH_RANGE = 25;

	/** radius of dot */
	self.DOT_RADIUS = 20;

	/** explanation */
	self.DOT_FALL_DURATION = 100;


	//-----------------------------------
	// variables
	//-----------------------------------

	//display
	/** canvas */
	self.stage;

	/** explanation */
	self.lineContainer;

	/** explanation */
	self.dotContainer;

	//data
	/** 現在選択中のdotの配列 */
	self.selectedDotsArray = [];

	/** タッチ開始座標 */
	self.touchStartPoint = {x:0, y:0};
	
	/** 現在選択中の色 */
	self.currentTargetColor = -1;

	/** プレイ可能かどうか */
	self.playFlg = true;

	//game-data
	/** count of delete total dots */
	self._deleteDotsCount = 0;

	/** count of delete action */
	self._deleteCount = 0;

	//event
	/** スコア更新イベント */
 	self.scoreUpdateEvent;


	//-----------------------------------
	// function
	//-----------------------------------

	/**
	 * 初期状態セット
	 * 
	 * @param canvas
	 */
	self.setInitialSetting = function(canvas){

		self.stage = new dots.Stage(canvas);

		self.lineContainer = new dots.Container();
		self.dotContainer = new dots.Container();
		self.stage.addChild(self.dotContainer);
		self.stage.addChild(self.lineContainer);

		//setup listeners
		canvas.addEventListener('touchstart', self._canvasTouchStartHandler, false);
		canvas.addEventListener('touchmove', self._canvasTouchMoveHandler, false);
		canvas.addEventListener('touchend', self._canvasTouchEndHandler, false);

		//setup dots
		self._setupInitialDots(self.dotContainer);

		//set up events
		self.scoreUpdateEvent = document.createEvent('Events');
		self.scoreUpdateEvent.initEvent('dot_score_update_event', true, true);

		//tick
		setInterval(function(){
			self.stage.update();
		}, 1000 / 60);
	};

	/**
	 * データを初期化
	 */
	self._resetData = function(){
		self.currentTargetColor = -1;
		self.selectedDotsArray = [];
		self.touchStartPoint = {x:0, y:0};
	};

	/**
	 * 任意のコンテイナーに初期ドットをセットする
	 * 
	 * @param container
	 */
	self._setupInitialDots = function(container){
		var color = 0,
			i,
			j,
			dot;

		for (i = 0; i < self.ROW_COUNT; i++) {
			for (j = 0; j < self.COLUMN_COUNT; j++) {

				color = parseInt(Math.random() * dots.Dot.COLORLIST.length, 10);
				dot = new dots.Dot(	self.DOTS_DISTANCE * (j + 1), 
										self.DOTS_DISTANCE * (i + 1), 
										self.DOT_RADIUS, 
										color);
				dot.positionIndex = j + self.ROW_COUNT * i;
				container.addChild(dot);
			}
		}
	};

	/**
	 * キャンバスタッチ開始イベント
	 * 
	 * @param e
	 */
	self._canvasTouchStartHandler = function(e){

		var len, i, dot;

		if(!self.playFlg){
			return;
		}

		self.touchStartPoint.x = e.changedTouches[0].pageX - self.stage.getCanvas().offsetLeft;
		self.touchStartPoint.y = e.changedTouches[0].pageY - self.stage.getCanvas().offsetTop;

		len = self.dotContainer.getNumChildren();
		for (i = len - 1; i >= 0; i--) {
			dot = self.dotContainer.getChildAt(i);

			if (self._checkTouchInTargetDot(self.touchStartPoint, dot)) {
				self._didDotInFirstTarget(dot);
				break;
			}
		}

		event.preventDefault();
	};

	/**
	 * キャンバスタッチ時イベント
	 * 
	 * @param e
	 */
	self._canvasTouchMoveHandler = function(e){

		if(!self.playFlg){
			return;
		}

		//線の描画は一旦削除
		var lineCount = self.lineContainer.getNumChildren();
		if(lineCount > 0){
			self.lineContainer.removeChildAt(lineCount - 1);
		}

		var len = self.dotContainer.getNumChildren();
		for (var i = len - 1; i >= 0; i--) {
			var point = {};
			point.x = parseInt(e.changedTouches[0].pageX - self.stage.getCanvas().offsetLeft);	
			point.y = parseInt(e.changedTouches[0].pageY - self.stage.getCanvas().offsetTop);
			var dot = self.dotContainer.getChildAt(i);

			//いずれかのドットに触れたとき
			if (self._checkTouchInTargetDot(point, dot)) {

				var selectedDotsCount = self.selectedDotsArray.length;
				if (selectedDotsCount === 0) {
					//まだいずれのドットも選択状態にないとき

					self._didDotInFirstTarget(dot);
					break;

				} else {
					//すでにいずれかのドットが選択状態にあるとき

					if (self.currentTargetColor === dot.colorId){

						//まだ選択されたものでないとき
						if (dot.selected === false) {

							var lastDot = self.selectedDotsArray[selectedDotsCount - 1];
							var lastIndex = lastDot.positionIndex;

							if(self.isAbleToBeNextDot(dot, lastIndex) === true){
								self._didDotInTarget(dot);
								self.drawLineFromDotToDot(lastDot, dot);
								break;
							}
						}
					}
				}
			}
		}


		var line = new dots.Line(
									self.touchStartPoint.x,
							 		self.touchStartPoint.y,
							 		e.changedTouches[0].pageX - self.stage.getCanvas().offsetLeft,
							 		e.changedTouches[0].pageY - self.stage.getCanvas().offsetTop
							 	);

		self.lineContainer.addChild(line);


		//１つでも選択してある状態であれば線を描画する

		//もしdotの上にきたら
		//すでに選択したものであれば無視
		//もしそのdotが最初に選択したdotと同じ色のものだったら

		event.preventDefault();
	};

	/**
	 * キャンバスタッチ終了イベント
	 * 
	 * @param e
	 */
	self._canvasTouchEndHandler = function(e){

		if(!self.playFlg){
			return;
		}


		self.lineContainer.removeAllChildren();

		if(self.selectedDotsArray.length > 1){

			//クリアするdotがあるとき

			// self._setPlayDisable();

			// var columunIndex;
			//更新するまえに位置インデックス
			var previousIndex;

			var removedIndexArray = [];

			//選択したものは削除する
			for (var i = self.dotContainer.getNumChildren() - 1; i >= 0; i--) {
				var dot = self.dotContainer.getChildAt(i);
				if(dot.selected === true){
					removedIndexArray.push(dot.positionIndex);
					self.dotContainer.removeChildAt(i);
				}
			}

			//削除されなかったものについて、位置インデックスの更新と位置移動アニメーション
			for (var i = self.dotContainer.getNumChildren() - 1; i >= 0; i--) {
				var dot = self.dotContainer.getChildAt(i);
				// columunIndex = dot.positionIndex % self.COLUMN_COUNT;
				previousIndex = dot.positionIndex;
				dot.positionIndex = self._updateIndex(dot.positionIndex, removedIndexArray);
				dot.startAnimation(	dot.x, 
									dot.y, 
									dot.x, 
									dot.y + (dot.positionIndex - previousIndex) / self.COLUMN_COUNT * self.DOTS_DISTANCE,
									self.FPS,
									self.DOT_FALL_DURATION * ((dot.positionIndex - previousIndex) / self.COLUMN_COUNT));
			}

			//新しく生成の必要なdotの位置インデックスを決定する
			var newIndexArray = self._createNextBornIndexArray();

			//新しくdotを生成する
			for (var i = 0; i < newIndexArray.length; i++) {
				color = parseInt(Math.random() * dots.Dot.COLORLIST.length);
				var dot = new dots.Dot(	self.DOTS_DISTANCE * (newIndexArray[i] % self.COLUMN_COUNT + 1), 
										self.DOTS_DISTANCE * (Math.floor(newIndexArray[i] / self.COLUMN_COUNT) + 1), 
										self.DOT_RADIUS, 
										color);
				dot.positionIndex = newIndexArray[i];
				// columunIndex = dot.positionIndex % self.COLUMN_COUNT;
				self.dotContainer.addChild(dot);
				dot.startAnimation(	dot.x, 
									dot.y - self._getDeletedCountForColumn(dot.positionIndex, removedIndexArray) *  self.DOTS_DISTANCE,
									dot.x, 
									dot.y,
									self.FPS,
									self.DOT_FALL_DURATION * self._getDeletedCountForColumn(dot.positionIndex, removedIndexArray));
			}

			//点数の更新
			self._deleteCount++;
			self._deleteDotsCount += self.selectedDotsArray.length;

			document.dispatchEvent(self.scoreUpdateEvent);
			
			self._resetData();

			if (self._isGameOver()) {
				alert("gameover"); //test
			}	

		} else {
			//クリアするdotがないとき
			self._resetData();
		}

		event.preventDefault();
	};

	/**
	 * 次に生まれるドットのインデックスの配列を生成する
	 * 
	 * @return newBornIndexArray
	 */
	self._createNextBornIndexArray = function(){ //self.dotContainerは引数にする？
		var existFlg,
			newBornIndexArray = [],
			i,
			j;

		for (i = 0; i < self.ROW_COUNT * self.COLUMN_COUNT; i++) {
			existFlg = false;
			for (j = 0; j < self.dotContainer.getNumChildren(); j++) {
				if(i === self.dotContainer.getChildAt(j).positionIndex){
					existFlg = true;
					break;
				}
			}
			if(existFlg === false){
				newBornIndexArray.push(i);
			}
		}

		return newBornIndexArray;
	}

	/**
	 * explanation
	 * 
	 * @param explanation
	 * @return explanation
	 */
	self._checkTouchInTargetDot = function(touchPoint, dot){
		return (touchPoint.x > dot.x - self.TOUCH_RANGE && 
				touchPoint.x < dot.x + self.TOUCH_RANGE && 
				touchPoint.y > dot.y - self.TOUCH_RANGE &&
				touchPoint.y < dot.y + self.TOUCH_RANGE );
	};

	/**
	 * explanation
	 * 
	 * @param explanation
	 * @return explanation
	 */
	self._didDotInFirstTarget = function(dot){
		self._didDotInTarget(dot);
		self.currentTargetColor = dot.colorId;
	};

	/**
	 * explanation
	 * 
	 * @param explanation
	 * @return explanation
	 */
	self._didDotInTarget = function(dot){
		self.touchStartPoint.x = dot.x;
		self.touchStartPoint.y = dot.y;
		dot.selected = true;
		dot.rippleAnimation();
		self.selectedDotsArray.push(dot);
	};

	/**
	 * あるドットからドットへ線を引く
	 * 
	 * @param explanation
	 * @return explanation
	 */
	self.drawLineFromDotToDot = function(fromDot, toDot){
		var line = new dots.Line(
			fromDot.x,
			fromDot.y,
			toDot.x,
			toDot.y
		);
		self.lineContainer.addChild(line);
	};

	/**
	 * explanation
	 * 
	 * @param explanation
	 * @return explanation
	 */
	self._checkExistDotLeft = function(index){
		var flg = true;
		if (index % self.COLUMN_COUNT === 0) {
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
	self._checkExistDotRight = function(index){
		var flg = true;
		if (index % self.COLUMN_COUNT === self.COLUMN_COUNT - 1) {
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
	self._checkExistDotTop = function(index){
		var flg = true;
		if (index < self.COLUMN_COUNT) {
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
	self._checkExistDotBottom = function(index){
		var flg = true;
		if (index > self.COLUMN_COUNT * (self.ROW_COUNT - 1)) {
			flg = false;
		}
		return flg;
	};

	//このメソッドださいorz

	/**
	 * 削除する配列をもとに、インデックスを更新する
	 * 
	 * @param beforeIndex beforeIndex
	 * @param removedIndexArray removedIndexArray
	 * @return index
	 */
	self._updateIndex = function(beforeIndex, removedIndexArray){
		var count = 0,
			i;	
		for (i = 0; i < removedIndexArray.length; i++) {
			//同じ列で　かつ自分よりも低いインデックスのもの
			if((beforeIndex % self.COLUMN_COUNT === removedIndexArray[i] % self.COLUMN_COUNT) &&
				beforeIndex < removedIndexArray[i] ){
				count++;
			}
		}

		return beforeIndex + count * self.COLUMN_COUNT;
	};

	/**
	 * 削除する配列をもとに、同カラムで削除されるドットの数を返す
	 * 
	 * @param index index
	 * @param removedIndexArray removedIndexArray
	 * @return count
	 */
	self._getDeletedCountForColumn = function(index, removedIndexArray){
		var count = 0,
			i;
		for (i = 0; i < removedIndexArray.length; i++) {
			if(index % self.COLUMN_COUNT === removedIndexArray[i] % self.COLUMN_COUNT){
				count++;
			}
		}

		return count;
	};

	/**
	 * 対象のdotが次の選択dotになりうるか調べる
	 * 
	 * @param dot dot
	 * @param lastIndex lastIndex
	 * @return boolean
	 */
	self.isAbleToBeNextDot = function(dot, lastIndex){
		if(dot.positionIndex === lastIndex - 1 && self._checkExistDotLeft(lastIndex)) {
			return true;
		} else if (dot.positionIndex === lastIndex + 1 && self._checkExistDotRight(lastIndex)) {
			return true;
		} else if (dot.positionIndex === lastIndex - self.COLUMN_COUNT && self._checkExistDotTop(lastIndex)) {
			return true;
		} else if (dot.positionIndex === lastIndex + self.COLUMN_COUNT && self._checkExistDotBottom(lastIndex)) {
			return true;		
		}

		return false
	};

	/**
	 * ゲームオーバ（１つもドットを消せない状態）かを返す
	 * 
	 * @return boolean
	 */
	self._isGameOver = function(){

		var tempArr = [];
		for (var i = 0; i < self.dotContainer.getNumChildren(); i++) {
			var dot = self.dotContainer.getChildAt(i);
			tempArr[dot.positionIndex] = dot;
		}

		for (var i = 0; i < self.ROW_COUNT; i++) {
			for (var j = 0; j < self.COLUMN_COUNT; j++) {
				var index = j + i * self.COLUMN_COUNT;

				var dot = tempArr[index];
				var rightDot = tempArr[index + 1];
				var bottomDot = tempArr[index + self.COLUMN_COUNT];

				if (i === self.ROW_COUNT - 1 && j === self.COLUMN_COUNT - 1) {
					//
				} else if (i === self.ROW_COUNT - 1) {
					if (dot.colorId === rightDot.colorId){
						return false;
					}
				} else if (j === self.COLUMN_COUNT - 1) {
					if (dot.colorId === bottomDot.colorId) {
						return false;
					}
				} else {
					if (dot.colorId === rightDot.colorId ||
						dot.colorId === bottomDot.colorId) {
						return false;
					}
				}
			}
		}
		return true;
	};

	/**
	 * プレイ可能状態にする
	 */
	self._setPlayEnable = function(){
		self.playFlg = true;
	};

	/**
	 * プレイ不可能状態にする
	 */
	self._setPlayDisable = function(){
		self.playFlg = false;
	};


	//-------------------------------------
	// public
	//-------------------------------------

	/**
	 * explanation
	 * 
	 * @param explanation
	 * @return explanation
	 */
	self.getDeleteCount = function(){
		return self._deleteCount;
	};

	/**
	 * explanation
	 * 
	 * @param explanation
	 * @return explanation
	 */
	self.getDeleteDotsCount = function(){
		return self._deleteDotsCount;
	}


	dots.MainCtrl = self;
})();