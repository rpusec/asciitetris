const dimensions = {
	w: 20,
	h: 20,
};
const maxTilesAmount = dimensions.w * dimensions.h;
const tileDim = 4;
const tileShapes = [
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
		0,0,1,0,
		0,0,1,0,
		0,0,1,0,
		0,0,1,0,
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
];
const KEYS = {
	UP: 38,
	DOWN: 40,
	LEFT: 37,
	RIGHT: 39,
};
const MAX_ROTATE_TYPE = 3;