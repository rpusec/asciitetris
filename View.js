window.View = (function(){
	const ASSETS = {
		BG: '&nbsp;',
		NEW_LINE: '<br/>',
		WALL: '#',
	};

	var elemScreen;
	var currUnicodeTile = 0;
	var countUnicodeTile = 0;
	var baseUnicodeTile = 65;
	var fallTileChar = null;

	function View(){
		elemScreen = document.getElementsByTagName('body')[0];
	}

	View.prototype.updatePlayerTileSkin = function(){
		currUnicodeTile = baseUnicodeTile + countUnicodeTile;
		if(countUnicodeTile < 25)
			countUnicodeTile++;
		else
			countUnicodeTile = 0;
		fallTileChar = String.fromCharCode(currUnicodeTile);
	}

	View.prototype.updateView = function(arrTiles){
		var res = "";

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
			res += ASSETS.NEW_LINE;
		}

		elemScreen.innerHTML = res;
	}

	return View;
}());