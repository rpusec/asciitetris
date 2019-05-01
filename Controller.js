window.Controller = (function(){
	const arrTiles = [];
	const arrPlayerTiles = [];

	var posX = 0;
	var posY = 0;
	var currShapeIndex = Math.floor(Math.random() * tileShapes.length);
	var rotationType = 0;

	var currUnicodeTile = 65;
	var view;

	function Controller(){
		view = new window.View();

		for(var i = 0; i < dimensions.h; i++){
			arrTiles.push(new Tile(0, i, assets.wall));
			arrTiles.push(new Tile(dimensions.w, i, assets.wall));
		}

		createPlayerTiles();

		view.updateView(arrTiles);
	}

	window.addEventListener('keydown', function(e){
		var key = e.which || e.keyCode;

		switch(key){
			case KEYS.UP : 
				rotationType = (rotationType + 1) % (MAX_ROTATE_TYPE + 1);
				rotatePlayerTiles();
				break;
			case KEYS.DOWN : 
				moveDown(key);
				break;
			case KEYS.LEFT : 
				moveLeft(key);
				break;
			case KEYS.RIGHT : 
				moveRight(key);
				break;
		}

		view.updateView(arrTiles);
	}, false);

	function moveDown(key){
		posY++;
		updatePosition(key);
	}

	function moveLeft(key){
		posX--;
		updatePosition(key);
	}

	function moveRight(key){
		posX++;
		updatePosition(key);
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

	function createPlayerTiles(){
		posX = Math.floor(dimensions.w / 2) - Math.floor(tileDim / 2);
		rotationType = 0;
		rotatePlayerTiles();
	}

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
					newTile = null;
				}
			}
		}
	}

	return Controller;
}());