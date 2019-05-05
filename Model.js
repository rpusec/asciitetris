(function(){

	function Tile(posX, posY, type){
		this.posX = posX;
		this.posY = posY;
		this.type = type;
	}

	function TileGroup(){
		var self = this;

		self.list = [];

		self._prevX = 0;
		self._prevY = 0;

		var _posX;
		var _posY;

		Object.defineProperty(self, 'posX', {
			set: function(posX){
				_posX = posX;
				updatePosition.call(self);
				self._prevX = posX;
			},
			get: function(){
				return _posX;
			},
		});

		Object.defineProperty(self, 'posY', {
			set: function(posY){
				_posY = posY;
				updatePosition.call(self);
				self._prevY = posY;
			},
			get: function(){
				return _posY;
			},
		});
	}

	function updatePosition(){
		var distX = this.posX - this._prevX;
		var distY = this.posY - this._prevY;

		for(var i = 0, j = this.list.length; i < j; i++){
			var tile = this.list[i];
			tile.posX += distX;
			tile.posY += distY;
		}
	}

	window.Tile = Tile;
	window.TileGroup = TileGroup;

}());