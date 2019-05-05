const dimensions = {
	w: 20,
	h: 25,
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
};
const SIDES = {
	LEFT: 0,
	RIGHT: 1,
	UP: 2,
	DOWN: 3,
};
const SIDES_LENGTH = Object.keys(SIDES).length;
const MAX_ROTATE_TYPE = 3;
const ASSETS = {
	bg: '&nbsp;',
	newline: '<br/>',
	wall: '#',
};
const TILE_TYPES = {
	WALL: 0,
	FLOOR: 1,
	TILE: 2,
};