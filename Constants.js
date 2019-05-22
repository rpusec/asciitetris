const dimensions = {
	w: 15,
	h: 20,
};
const maxTilesAmount = dimensions.w * dimensions.h;
const tileDim = 4;
const tileShapes = [
	[
		0,0,1,0,
		0,0,1,0,
		0,0,1,0,
		0,0,1,0,
	],
	[
		0,1,0,0,
		0,1,1,0,
		0,0,1,0,
		0,0,0,0,
	],
	[
		0,0,1,0,
		0,1,1,0,
		0,1,0,0,
		0,0,0,0,
	],
	[
		0,0,0,0,
		0,1,1,0,
		0,1,1,0,
		0,0,0,0,
	],
	[
		0,0,1,0,
		0,0,1,0,
		0,1,1,0,
		0,0,0,0,
	],
	[
		0,0,0,0,
		0,0,1,0,
		0,1,1,0,
		0,0,0,0,
	],
	[
		0,0,0,0,
		0,0,1,0,
		0,1,1,1,
		0,0,0,0,
	],
];
const KEYS = {
	UP: 38,
	DOWN: 40,
	LEFT: 37,
	RIGHT: 39,
	SPACE: 32,
};
const SIDES = {
	LEFT: 0,
	RIGHT: 1,
	UP: 2,
	DOWN: 3,
};
const SIDES_LENGTH = Object.keys(SIDES).length;
const MAX_ROTATE_TYPE = 3;
const TILE_TYPES = {
	WALL: 0,
	TILE: 1,
};