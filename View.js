window.View = (function(){
	var elemScreen;

	function View(){
		elemScreen = document.getElementsByTagName('body')[0];
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
				res += targetTile !== null ? targetTile.char : ASSETS.bg;
			}

			res += ASSETS.newline;
		}

		elemScreen.innerHTML = res;
	}

	return View;
}());