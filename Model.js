(function(){

	function Tile(posX, posY, char, type){
		this.posX = posX;
		this.posY = posY;
		this.char = char;
		this.type = type;
	}

	function TileGroup(){
		this.list = [];
		this.posX = 0;
		this.posY = 0;
	}

	TileGroup.prototype.moveDown = function(){
		this.posY++;
		updatePosition.call(this, KEYS.DOWN);
	}

	TileGroup.prototype.moveLeft = function(){
		this.posX--;
		updatePosition.call(this, KEYS.LEFT);
	}

	TileGroup.prototype.moveRight = function(){
		this.posX++;
		updatePosition.call(this, KEYS.RIGHT);
	}

	function updatePosition(key){
		for(var i = 0, j = this.list.length; i < j; i++){
			var tile = this.list[i];

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

	window.Tile = Tile;
	window.TileGroup = TileGroup;

}());