window.Controller = (function(){
	var arrTiles = [];
	var playerTiles;
	var currShapeIndex = 0;
	var rotationType = 0;
	var fallInterval;
	var view;
	var gameOver = false;
	var arrNextTiles = null;

	function Controller(){
		view = new window.View(this);

		playerTiles = new TileGroup();

		for(var i = 0; i < dimensions.h; i++){
			arrTiles.push(new Tile(0, i, TILE_TYPES.WALL));
			arrTiles.push(new Tile(dimensions.w - 1, i, TILE_TYPES.WALL));
		}

		for(var i = 1; i < dimensions.w - 1; i++)
			arrTiles.push(new Tile(i, dimensions.h - 1, TILE_TYPES.WALL));

		restartGame();
	}

	Controller.prototype.isGameOver = function(){
		return gameOver;
	}

	Controller.prototype.getArrTiles = function(){
		return arrTiles;
	}

	Controller.prototype.getArrNextTiles = function(){
		return arrNextTiles;
	}

	window.addEventListener('keydown', function(e){
		var key = e.which || e.keyCode;

		if(gameOver){
			restartGame();
			return;
		}

		switch(key){
			case KEYS.UP : 
				rotationType = (rotationType + 1) % (MAX_ROTATE_TYPE + 1);
				rotatePlayerTiles();
				break;
			case KEYS.DOWN : 
				moveDown();
				restartFall();
				break;
			case KEYS.LEFT : 
				moveLeft();
				break;
			case KEYS.RIGHT : 
				moveRight();
				break;
			case KEYS.SPACE : 
				moveRapidDownwards();
				break;
		}

		view.updateView();
	}, false);

	function restartGame(){
		currShapeIndex = 0;
		rotationType = 0;
		gameOver = false;
		eraseAllTilesExceptWall();
		shuffle(tileShapes);
		createPlayerTiles();
		view.updateView();
		restartFall();
	}

	function moveDown(){
		if(checkVerticalCollision())
			createPlayerTiles();
		else
			playerTiles.posY++;
	}

	function moveLeft(){
		if(!checkHorizontalCollision(KEYS.LEFT))
			playerTiles.posX--;
	}

	function moveRight(){
		if(!checkHorizontalCollision(KEYS.RIGHT))
			playerTiles.posX++;
	}

	function restartFall(){
		clearInterval(fallInterval);
		if(gameOver)
			return;

		fallInterval = setInterval(function(){
			moveDown();
			view.updateView();
		}, 1000);
	}

	/**
	 * Creates new falling tiles. 
	 */
	function createPlayerTiles(){
		playerTiles.list.splice(0, playerTiles.list.length);
		playerTiles.posX = Math.floor(dimensions.w / 2) - Math.floor(tileDim / 2);
		playerTiles.posY = 0;
		rotationType = 0;

		currShapeIndex = getNextShapeIndex();
		if(getNextShapeIndex() === 0)
			shuffle(tileShapes);

		arrNextTiles = tileShapes[getNextShapeIndex()];

		view.updatePlayerTileSkin();
		if(!rotatePlayerTiles()){
			gameOver = true;
			arrNextTiles = null;
			erasePlayerTiles();
			view.updateView();
			restartFall();
		}
		else
			removeTilesFromCompleteRows();
	}

	function getNextShapeIndex(){
		return (currShapeIndex + 1) % tileShapes.length;
	}

	/**
	 * Rotates the falling tiles clockwise. 
	 * @return {Boolean} True if the player tiles rotated successfully, false otherwise. 
	 */
	function rotatePlayerTiles(){
		if(gameOver)
			return false;

		erasePlayerTiles();
		var oldplayerTiles = playerTiles.list.splice(0, playerTiles.list.length);

		var arrShape = tileShapes[currShapeIndex];
		for(var row = 0; row < tileDim; row++)
		{
			for(var col = 0; col < tileDim; col++)
			{
				var int = 0;
				switch(rotationType){
					case 0 : 
						int = arrShape[col + row * tileDim];
						break;
					case 1 : 
						int = arrShape[(tileDim - row - 1) + (col * tileDim)];
						break;
					case 2 : 
						int = arrShape[((tileDim - row) * tileDim - col) - 1];
						break;
					case 3 : 
						int = arrShape[((tileDim - col - 1) * tileDim) + row];
						break;
				}
				if(int === 1){
					var newTile = new Tile(col + playerTiles.posX, row + playerTiles.posY, TILE_TYPES.TILE);
					arrTiles.push(newTile);
					playerTiles.list.push(newTile);
				}
			}
		}

		var retryTimes = tileDim;
		var retryCount = 0;
		var retryType = 0;
		var rotateLegit = true;

		var colTile;
		var tempPosX = null;
		var tempPosY = null;
		var centerX;
		var centerY;

		while((colTile = checkTileIntersection())){
			if(retryType === SIDES_LENGTH){
				rotateLegit = false;
				break;
			}

			if(retryCount < retryTimes){
				if(tempPosX === null && tempPosY === null){
					tempPosX = playerTiles.posX;
					tempPosY = playerTiles.posY;
				}

				centerX = tempPosX + Math.ceil(tileDim / 2);
				centerY = tempPosY + Math.ceil(tileDim / 2);

				if(retryType === SIDES.LEFT && colTile.posX >= centerX)
					playerTiles.posX--;
				else if(retryType === SIDES.RIGHT && colTile.posX < centerX)
					playerTiles.posX++;
				else if(retryType === SIDES.UP && colTile.posY >= centerY)
					playerTiles.posY--;
				else if(retryType === SIDES.DOWN && colTile.posY < centerY)
					playerTiles.posY++;

				retryCount++;
			}
			else{
				retryCount = 0;
				retryType++;
				playerTiles.posX = tempPosX;
				playerTiles.posY = tempPosY;
			}
		}

		if(!rotateLegit){
			erasePlayerTiles();
			playerTiles.list = oldplayerTiles;
			arrTiles = arrTiles.concat(playerTiles.list);
		}

		return rotateLegit;
	}

	/**
	 * Removes player tiles from the tile array. 
	 */
	function erasePlayerTiles(){
		for(var i = 0, j = arrTiles.length; i < j; i++){
			var tile = arrTiles[i];
			if(playerTiles.list.indexOf(tile) !== -1){
				arrTiles.splice(i, 1);
				i--;
				j--;
			}
		}
	}

	function eraseAllTilesExceptWall(){
		for(var i = 0, j = arrTiles.length; i < j; i++){
			var tile = arrTiles[i];
			if(tile.type !== TILE_TYPES.WALL){
				arrTiles.splice(i, 1);
				i--;
				j--;
			}
		}
	}

	/**
	 * Checks whether one of falling tiles will collide with a tile beneath a falling tile. 
	 * @return {Boolean} True if collision happened, false otherwise.
	 */
	function checkVerticalCollision(){
		for(var ti = 0, tiLength = arrTiles.length; ti < tiLength; ti++){
			var tile = arrTiles[ti];
			if(playerTiles.list.indexOf(tile) !== -1)
				continue;

			for(var pti = 0, ptiLength = playerTiles.list.length; pti < ptiLength; pti++){
				var playerTile = playerTiles.list[pti];
				var nextPosY = playerTile.posY + 1;
				if(tile.posX === playerTile.posX && tile.posY === nextPosY)
					return true;
			}
		}
		return false;
	}

	/**
	 * Checks whether a falling tile will collide with another tile on the left or right side
	 * @param  {Integer} key Can be either KEYS.LEFT to check for possible collision on the left side, or KEYS.RIGHT for the right side. 
	 * @return {Boolean} True if collision happened, false otherwise.
	 */
	function checkHorizontalCollision(key){
		for(var ti = 0, tiLength = arrTiles.length; ti < tiLength; ti++){
			var tile = arrTiles[ti];
			if(playerTiles.list.indexOf(tile) !== -1)
				continue;

			for(var pti = 0, ptiLength = playerTiles.list.length; pti < ptiLength; pti++){
				var playerTile = playerTiles.list[pti];
				var nextLeftPosX = playerTile.posX - 1;
				var nextRightPosX = playerTile.posX + 1;
				if(	tile.posY === playerTile.posY && 
					((key === KEYS.LEFT && tile.posX === nextLeftPosX) || (key === KEYS.RIGHT && tile.posX === nextRightPosX)))
					return true;
			}
		}
		return false;
	}

	/**
	 * Checks if a falling tile was intersected with another Tile, in the sense that a 
	 * particular falling tile has the same coordinates as an immobile tile. 
	 * @return {Tile} Intersected Tile, otherwise null. 
	 */
	function checkTileIntersection(){
		for(var ti = 0, tiLength = arrTiles.length; ti < tiLength; ti++){
			var tile = arrTiles[ti];
			if(playerTiles.list.indexOf(tile) !== -1)
				continue;

			for(var pti = 0, ptiLength = playerTiles.list.length; pti < ptiLength; pti++){
				var playerTile = playerTiles.list[pti];
				if(tile.posX === playerTile.posX && tile.posY === playerTile.posY)
					return tile;
			}
		}
		return null;
	}

	/**
	 * Moves the falling tiles downwards until it collides 
	 * with immobile tiles underneath. 
	 */
	function moveRapidDownwards(){
		restartFall();
		while(!checkVerticalCollision()){
			playerTiles.posY++;
		}
		createPlayerTiles();
	}

	function removeTilesFromCompleteRows(){
		if(gameOver)
			return;

		var arrClearedRows = [];
		for(var row = dimensions.h - 1; row >= 0; row--){
			var tilesToRemove = [];
			for(var col = dimensions.w - 1; col >= 0; col--){
				var tile = getTileByCoord(col, row);
				if(tile === null)
					break;

				if(tile.type === TILE_TYPES.TILE)
					tilesToRemove.push(tile);
			}
			if(tilesToRemove.length === dimensions.w - 2){
				arrTiles = arrTiles.filter(function(tile){
					return tilesToRemove.indexOf(tile) === -1;
				});
				arrClearedRows.push(row);
			}
		}

		while(arrClearedRows.length > 0){
			/*
				We're using "-1" so that we can select 
				the tiles above the cleared row.
			*/
			for(var row = arrClearedRows[0] - 1; row >= 0; row--){
				for(col = dimensions.w - 1; col >= 0; col--){
					var tile = getTileByCoord(col, row);
					tile !== null && tile.type === TILE_TYPES.TILE && tile.posY++;
				}
			}
			arrClearedRows.shift();
			for(var i = 0, j = arrClearedRows.length; i < j; i++)
				arrClearedRows[i]++;
		}
	}

	function getTileByCoord(posX, posY){
		for(var ti = 0, tiLength = arrTiles.length; ti < tiLength; ti++){
			var tile = arrTiles[ti];
			if(playerTiles.list.indexOf(tile) !== -1)
				continue;

			if(tile.posX === posX && tile.posY === posY)
				return tile;
		}
		return null;
	}

	/**
	 * Shuffles the items within an array. 
	 * @param  {Array} array Array to shuffle.
	 * @return {Array}       Shuffled array.
	 * @see https://bost.ocks.org/mike/shuffle/
	 */
	function shuffle(array) {
		var m = array.length, t, i;

		// While there remain elements to shuffle???
		while (m) {

			// Pick a remaining element???
			i = Math.floor(Math.random() * m--);

			// And swap it with the current element.
			t = array[m];
				array[m] = array[i];
				array[i] = t;
		}

		return array;
	}

	return Controller;
}());