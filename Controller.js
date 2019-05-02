window.Controller = (function(){
	var arrTiles = [];
	var arrPlayerTiles = [];

	var currPosX = 0;
	var currPosY = 0;
	var currShapeIndex;
	var rotationType = 0;
	var fallInterval;

	var currUnicodeTile = 64;
	var view;

	function Controller(){
		view = new window.View();

		for(var i = 0; i < dimensions.h; i++){
			arrTiles.push(new Tile(0, i, ASSETS.wall, TILE_TYPES.WALL));
			arrTiles.push(new Tile(dimensions.w - 1, i, ASSETS.wall, TILE_TYPES.WALL));
		}

		for(var i = 1; i < dimensions.w - 1; i++)
			arrTiles.push(new Tile(i, dimensions.h - 1, ASSETS.wall, TILE_TYPES.FLOOR));

		createPlayerTiles();
		view.updateView(arrTiles);
		restartFall();
	}

	window.addEventListener('keydown', function(e){
		var key = e.which || e.keyCode;

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
		}

		view.updateView(arrTiles);
	}, false);

	function moveDown(){
		if(checkVerticalCollision()){
			createPlayerTiles();
		}
		else{
			currPosY++;
			updatePosition(KEYS.DOWN);
		}
	}

	function moveLeft(){
		if(!checkHorizontalCollision(KEYS.LEFT)){
			currPosX--;
			updatePosition(KEYS.LEFT);
		}
	}

	function moveRight(){
		if(!checkHorizontalCollision(KEYS.RIGHT)){
			currPosX++;
			updatePosition(KEYS.RIGHT);
		}
	}

	function restartFall(){
		clearInterval(fallInterval);
		fallInterval = setInterval(function(){
			moveDown();
			view.updateView(arrTiles);
		}, 1000);
	}

	function updatePosition(key){
		for(var i = 0, j = arrPlayerTiles.length; i < j; i++){
			var tile = arrPlayerTiles[i];

			switch(key){
				case KEYS.DOWN :
					tile.posY++; 
					break;
				case KEYS.LEFT : 
					tile.posX--;
					break;
				case KEYS.RIGHT : 
					tile.posX++;
					break;
			}
		}
	}

	/**
	 * Creates new falling tiles. 
	 */
	function createPlayerTiles(){
		arrPlayerTiles.splice(0, arrPlayerTiles.length);
		currPosX = Math.floor(dimensions.w / 2) - Math.floor(tileDim / 2);
		currPosY = 0;
		rotationType = 0;
		currShapeIndex = Math.floor(Math.random() * tileShapes.length);
		currUnicodeTile++;
		rotatePlayerTiles();
	}

	/**
	 * Rotates the falling tiles clockwise. 
	 */
	function rotatePlayerTiles(){
		for(var i = 0, j = arrTiles.length; i < j; i++){
			var tile = arrTiles[i];
			if(arrPlayerTiles.indexOf(tile) !== -1){
				arrTiles.splice(i, 1);
				i--;
				j--;
			}
		}

		var oldArrPlayerTiles = arrPlayerTiles.splice(0, arrPlayerTiles.length);

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
					var newTile = new Tile(col + currPosX, row + currPosY, String.fromCharCode(currUnicodeTile), TILE_TYPES.TILE);
					arrTiles.push(newTile);
					arrPlayerTiles.push(newTile);
				}
			}
		}

		var retryTimes = Math.ceil(tileDim / 2);
		var retryCount = 0;
		var retryType = 0;
		var rotateLegit = true;

		while(checkTileIntersection()){
			if(retryType === SIDES_LENGTH){
				rotateLegit = false;
				break;
			}

			if(retryCount < retryTimes){
				for(var i = 0, j = arrPlayerTiles.length; i < j; i++){
					var tile = arrPlayerTiles[i];

					if(typeof tile._posX === 'undefined' && typeof tile._posY === 'undefined'){
						tile._posX = tile.posX;
						tile._posY = tile.posY;
					}

					if(retryType === SIDES.LEFT)
						tile.posX--;
					else if(retryType === SIDES.RIGHT)
						tile.posX++;
					if(retryType === SIDES.UP)
						tile.posY--;
				}

				if(retryType === SIDES.LEFT)
					currPosX--;
				else if(retryType === SIDES.RIGHT)
					currPosX++;
				if(retryType === SIDES.UP)
					currPosY--;

				retryCount++;
			}
			else{
				retryCount = 0;
				retryType++;
				for(var i = 0, j = arrPlayerTiles.length; i < j; i++){
					var tile = arrPlayerTiles[i];
					tile.posX = tile._posX;
					tile.posY = tile._posY;
				}
			}
		}

		if(rotateLegit){
			for(var i = 0, j = arrPlayerTiles.length; i < j; i++){
				var tile = arrPlayerTiles[i];
				delete tile._posX;
				delete tile._posY;
			}
		}
		else
			arrPlayerTiles = oldArrPlayerTiles;
	}

	/**
	 * Checks whether one of falling tiles will collide with a tile beneath a falling tile. 
	 * @return {Boolean} True if collision happened, false otherwise.
	 */
	function checkVerticalCollision(){
		for(var ti = 0, tiLength = arrTiles.length; ti < tiLength; ti++){
			var tile = arrTiles[ti];
			if(arrPlayerTiles.indexOf(tile) !== -1)
				continue;

			for(var pti = 0, ptiLength = arrPlayerTiles.length; pti < ptiLength; pti++){
				var playerTile = arrPlayerTiles[pti];
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
			if(arrPlayerTiles.indexOf(tile) !== -1)
				continue;

			for(var pti = 0, ptiLength = arrPlayerTiles.length; pti < ptiLength; pti++){
				var playerTile = arrPlayerTiles[pti];
				var nextLeftPosX = playerTile.posX - 1;
				var nextRightPosX = playerTile.posX + 1;
				if(	tile.posY === playerTile.posY && 
					((key === KEYS.LEFT && tile.posX === nextLeftPosX) || (key === KEYS.RIGHT && tile.posX === nextRightPosX)))
					return true;
			}
		}
		return false;
	}

	function checkTileIntersection(){
		for(var ti = 0, tiLength = arrTiles.length; ti < tiLength; ti++){
			var tile = arrTiles[ti];
			if(arrPlayerTiles.indexOf(tile) !== -1)
				continue;

			for(var pti = 0, ptiLength = arrPlayerTiles.length; pti < ptiLength; pti++){
				var playerTile = arrPlayerTiles[pti];
				if(tile.posX === playerTile.posX && tile.posY === playerTile.posY)
					return true;
			}
		}
		return false;
	}

	return Controller;
}());