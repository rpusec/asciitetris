window.Controller = (function(){
	const arrTiles = [];
	const arrPlayerTiles = [];

	var posX = 0;
	var currShapeIndex = Math.floor(Math.random() * tileShapes.length);
	var rotationType = 0;

	var currUnicodeTile = 65;
	var view;

	function Controller(){
		view = new window.View();

		for(var i = 0; i < dimensions.h; i++){
			arrTiles.push(new Tile(0, i, '#'));
			arrTiles.push(new Tile(dimensions.w, i, '#'));
		}

		createPlayerTiles();

		window.addEventListener('keydown', function(e){
			var key = e.which || e.keyCode;

			for(var i = 0, j = arrPlayerTiles.length; i < j; i++){
				var tile = arrPlayerTiles[i];

				switch(key){
					case KEYS.UP : 
						break;
					case KEYS.DOWN : 
						break;
					case KEYS.LEFT : 
						tile.posX--;
						break;
					case KEYS.RIGHT : 
						tile.posX++;
						break;
				}
			}

			switch(key){
				case KEYS.UP : 
					rotationType = (rotationType + 1) % (MAX_ROTATE_TYPE + 1);
					rotatePlayerTiles();
					break;
				case KEYS.DOWN : 
					break;
				case KEYS.LEFT : 
					posX--;
					break;
				case KEYS.RIGHT : 
					posX++;
					break;
			}

			view.updateView(arrTiles);
		}, false);

		view.updateView(arrTiles);
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
					var newTile = new Tile(col + posX, row, String.fromCharCode(currUnicodeTile));
					arrTiles.push(newTile);
					arrPlayerTiles.push(newTile);
					newTile = null;
				}
			}
		}
	}

	return Controller;
}());