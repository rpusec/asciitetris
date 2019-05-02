window.Controller = (function(){
	const arrTiles = [];
	const arrPlayerTiles = [];

	var posX = 0;
	var posY = 0;
	var currShapeIndex;
	var rotationType = 0;
	var fallInterval;

	var currUnicodeTile = 64;
	var view;

	function Controller(){
		view = new window.View();

		for(var i = 0; i < dimensions.h; i++){
			arrTiles.push(new Tile(0, i, assets.wall));
			arrTiles.push(new Tile(dimensions.w - 1, i, assets.wall));
		}

		for(var i = 1; i < dimensions.w - 1; i++)
			arrTiles.push(new Tile(i, dimensions.h - 1, assets.wall));

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
			posY++;
			updatePosition(KEYS.DOWN);
		}
	}

	function moveLeft(){
		if(!checkHorizontalCollision(KEYS.LEFT)){
			posX--;
			updatePosition(KEYS.LEFT);
		}
	}

	function moveRight(){
		if(!checkHorizontalCollision(KEYS.RIGHT)){
			posX++;
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
		posX = Math.floor(dimensions.w / 2) - Math.floor(tileDim / 2);
		posY = 0;
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

		arrPlayerTiles.splice(0, arrPlayerTiles.length);

		var arrShape = tileShapes[currShapeIndex];
		for(var row = 0; row <= tileDim; row++)
		{
			for(var col = 0; col <= tileDim; col++)
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
					var newTile = new Tile(col + posX, row + posY, String.fromCharCode(currUnicodeTile));
					arrTiles.push(newTile);
					arrPlayerTiles.push(newTile);
				}
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
	 * Checjs whether a falling tile will collide with another tile on the left or right side
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

	return Controller;
}());