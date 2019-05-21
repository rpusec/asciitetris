window.View = (function(){
	const ASSETS = {
		BG: '&nbsp;',
		NEW_LINE: '<br/>',
		WALL: '#',
		GAME_OVER: 'GAME OVER',
	};
	const SCOREBOARD_DIST = 5;

	var elemScreen;
	var currUnicodeTile = 0;
	var countUnicodeTile = 0;
	var baseUnicodeTile = 65;
	var fallTileChar = null;
	var nextFallTileChar = null;
	var controller;

	function View(_controller){
		controller = _controller;
		elemScreen = document.getElementsByTagName('body')[0];
	}

	View.prototype.updatePlayerTileSkin = function(){
		fallTileChar = String.fromCharCode(baseUnicodeTile + countUnicodeTile);
		nextFallTileChar = getNextUnicodeCharCode();
	}

	View.prototype.updateView = function(){
		var res = "";
		var arrTiles = controller.getArrTiles();

		for(var row = 0; row < dimensions.h; row++)
		{
			for(var col = 0; col < dimensions.w; col++)
			{
				var targetTile = null;
				for(var i = 0, j = arrTiles.length; i < j; i++)
				{
					var tile = arrTiles[i];
					if(tile.posX === col && tile.posY === row){
						targetTile = tile;
						break;
					}
				}
				if(targetTile !== null){
					if(targetTile.type === TILE_TYPES.WALL){
						res += ASSETS.WALL;
					}
					else{
						if(typeof targetTile.char !== 'string')
							targetTile.char = fallTileChar;
						res += targetTile.char;
					}
				}
				else
					res += ASSETS.BG;
			}

			res = drawScoreBoardByRow(res, row);
			res += ASSETS.NEW_LINE;
		}

		if(controller.isGameOver()){
			var dist = Math.floor(dimensions.w / 2) - Math.floor(ASSETS.GAME_OVER.length / 2);
			for(var i = 0; i < dist; i++)
				res += ASSETS.BG;
			res += ASSETS.GAME_OVER;
		}

		elemScreen.innerHTML = res;
	}

	function getNextUnicodeCharCode(){
		if(countUnicodeTile < 25)
			countUnicodeTile++;
		else
			countUnicodeTile = 0;
		return baseUnicodeTile + countUnicodeTile;
	}

	function drawScoreBoardByRow(res, row){
		var offBounceAmount = tileDim + 1;
		if(row > offBounceAmount)
			return res;

		var arrNextTiles = controller.getArrNextTiles();

		for(var i = 0; i < SCOREBOARD_DIST; i++)
			res += ASSETS.BG;

		if(row === 0 || row === offBounceAmount){
			for(var i = 0; i <= offBounceAmount; i++)
				res += ASSETS.WALL;
		}
		else{
			for(var i = 0; i <= offBounceAmount; i++){
				if((i === 0) || (i === offBounceAmount)){
					res += ASSETS.WALL;
				}
				else{
					var ind = (i - 1) + row * tileDim;
					var tile = arrNextTiles[ind];
					res += tile === 1 ? String.fromCharCode(nextFallTileChar) : ASSETS.BG;
				}
			}
		}

		return res;
	}

	return View;
}());