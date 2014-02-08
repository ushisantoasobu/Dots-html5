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
										20, 
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

							if(dot.positionIndex === lastIndex - 1 && self._checkExistDotLeft(lastIndex)) {
								self._didDotInTarget(dot);
								//線の描画
								self.drawLineFromDotToDot(lastDot, dot);
								break;
							} else if (dot.positionIndex === lastIndex + 1 && self._checkExistDotRight(lastIndex)) {
								self._didDotInTarget(dot);
								//線の描画
								self.drawLineFromDotToDot(lastDot, dot);
								break;
							} else if (dot.positionIndex === lastIndex - 4 && self._checkExistDotTop(lastIndex)) {
								self._didDotInTarget(dot);
								//線の描画
								self.drawLineFromDotToDot(lastDot, dot);
								break;
							} else if (dot.positionIndex === lastIndex + 4 && self._checkExistDotBottom(lastIndex)) {
								self._didDotInTarget(dot);
								//線の描画
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
			// for (var i = 0; i < self.COLUMN_COUNT; i++) {
			// 	removedIndexArray[i] = 0;
			// }

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
									200 * ((dot.positionIndex - previousIndex) / self.COLUMN_COUNT),
									function(){console.log("test");});
			}

			//新しく生成の必要なdotの位置インデックスを決定する
			var existFlg;
			var newIndexArray = [];
			for (var i = 0; i < self.ROW_COUNT * self.COLUMN_COUNT; i++) {
				existFlg = false;
				for (var j = 0; j < self.dotContainer.getNumChildren(); j++) {
					if(i === self.dotContainer.getChildAt(j).positionIndex){
						existFlg = true;
						break;
					}
				}
				if(existFlg === false){
					newIndexArray.push(i);
				}
			}

			//新しくdotを生成する
			for (var i = 0; i < newIndexArray.length; i++) {
				color = parseInt(Math.random() * dots.Dot.COLORLIST.length);
				var dot = new dots.Dot(	self.DOTS_DISTANCE * (newIndexArray[i] % self.COLUMN_COUNT + 1), 
										self.DOTS_DISTANCE * (Math.floor(newIndexArray[i] / self.COLUMN_COUNT) + 1), 
										20, 
										color);
				dot.positionIndex = newIndexArray[i];
				// columunIndex = dot.positionIndex % self.COLUMN_COUNT;
				self.dotContainer.addChild(dot);
				dot.startAnimation(	dot.x, 
									dot.y - self._getDeletedCountForColumn(dot.positionIndex, removedIndexArray) *  self.DOTS_DISTANCE,
									dot.x, 
									dot.y,
									self.FPS,
									200 * self._getDeletedCountForColumn(dot.positionIndex, removedIndexArray),
									function(){console.log("test");});
			}

			//点数の更新
			self._deleteCount++;
			self._deleteDotsCount += self.selectedDotsArray.length;

			document.dispatchEvent(self.scoreUpdateEvent);
			
			self._resetData();

		} else {
			//クリアするdotがないとき

			self._resetData();
		}

		event.preventDefault();
	};

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
	self._checkExistDotRight = function(index){
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
	self._checkExistDotTop = function(index){
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
	self._checkExistDotBottom = function(index){
		var flg = true;
		if (index > 4 * (4 - 1)) {
			flg = false;
		}
		return flg;
	};

	//このメソッドださいorz
	self._updateIndex = function(index, removedIndexArray){
		var count = 0;	
		for (var i = 0; i < removedIndexArray.length; i++) {
			//同じ列で　かつ自分よりも低いインデックスのもの
			if((index % self.COLUMN_COUNT === removedIndexArray[i] % self.COLUMN_COUNT) &&
				index < removedIndexArray[i] ){
				count++;
			}
		}

		return index + count * self.COLUMN_COUNT;
	};

	//このメソッドださいorz
	self._getDeletedCountForColumn = function(index, removedIndexArray){
		var count = 0;	
		for (var i = 0; i < removedIndexArray.length; i++) {
			//同じ列で　かつ自分よりも低いインデックスのもの
			if(index % self.COLUMN_COUNT === removedIndexArray[i] % self.COLUMN_COUNT){
				count++;
			}
		}

		return count;
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