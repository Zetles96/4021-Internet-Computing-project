import WhiteWerewolfSpritesheet from '$lib/images/White_Werewolf/Spritesheet.png';
import BlackWerewolfSpritesheet from '$lib/images/Black_Werewolf/Spritesheet.png';
import RedWerewolfSpritesheet from '$lib/images/Red_Werewolf/Spritesheet.png';
import GotokuSpritesheet from '$lib/images/Gotoku/Spritesheet.png';
import OnreSpritesheet from '$lib/images/Onre/Spritesheet.png';
import YureiSpritesheet from '$lib/images/Yurei/Spritesheet.png';

import { Enemy } from '$lib/sprites/sprites.js';

/**
 * Creates a White Werewolf enemy.
 * @param {CanvasRenderingContext2D} ctx - A canvas rendering context for drawing.
 * @param {number} x - The initial x position of the enemy.
 * @param {number} y - The initial y position of the enemy.
 * @param {string} name - The name of the enemy.
 * @returns {Enemy} An enemy object with methods for movement and rendering.
 */
class WhiteWerewolf extends Enemy {
	constructor(ctx, x, y, name = 'WhiteWerewolf') {
		super(ctx, x, y, WhiteWerewolfSpritesheet, name);

		this.sequences = {
			idle: { x: 0, y: 128 * 0, width: 128, height: 128, count: 8, timing: 200, loop: true },
			attack_1: {
				x: 0,
				y: 128 * 1,
				width: 128,
				height: 128,
				count: 6,
				timing: 50,
				loop: true
			},
			attack_2: {
				x: 0,
				y: 128 * 2,
				width: 128,
				height: 128,
				count: 4,
				timing: 50,
				loop: true
			},
			attack_3: {
				x: 0,
				y: 128 * 3,
				width: 128,
				height: 128,
				count: 5,
				timing: 50,
				loop: true
			},
			dead: { x: 0, y: 128 * 4, width: 128, height: 128, count: 2, timing: 50, loop: false },
			hurt: { x: 0, y: 128 * 5, width: 128, height: 128, count: 2, timing: 50, loop: true },
			jump: { x: 0, y: 128 * 6, width: 128, height: 128, count: 11, timing: 50, loop: true },
			misc: { x: 0, y: 0, width: 0, height: 0, count: 0, timing: 0, loop: false },
			run: { x: 0, y: 128 * 8, width: 128, height: 128, count: 9, timing: 50, loop: true },
			walk: { x: 0, y: 128 * 9, width: 128, height: 128, count: 11, timing: 100, loop: true }
		};
	}
}

/**
 * Creates a Black Werewolf enemy.
 * @param {CanvasRenderingContext2D} ctx - A canvas rendering context for drawing.
 * @param {number} x - The initial x position of the enemy.
 * @param {number} y - The initial y position of the enemy.
 * @param {string} name - The name of the enemy.
 * @returns {Enemy} An enemy object with methods for movement and rendering.
 */
class BlackWerewolf extends Enemy {
	constructor(ctx, x, y, name = 'BlackWerewolf') {
		super(ctx, x, y, BlackWerewolfSpritesheet, name);

		this.sequences = {
			idle: { x: 0, y: 128 * 0, width: 128, height: 128, count: 8, timing: 200, loop: true },
			attack_1: {
				x: 0,
				y: 128 * 1,
				width: 128,
				height: 128,
				count: 6,
				timing: 50,
				loop: true
			},
			attack_2: {
				x: 0,
				y: 128 * 2,
				width: 128,
				height: 128,
				count: 4,
				timing: 50,
				loop: true
			},
			attack_3: {
				x: 0,
				y: 128 * 3,
				width: 128,
				height: 128,
				count: 5,
				timing: 50,
				loop: true
			},
			dead: { x: 0, y: 128 * 4, width: 128, height: 128, count: 2, timing: 50, loop: false },
			hurt: { x: 0, y: 128 * 5, width: 128, height: 128, count: 2, timing: 50, loop: true },
			jump: { x: 0, y: 128 * 6, width: 128, height: 128, count: 11, timing: 50, loop: true },
			misc: { x: 0, y: 0, width: 0, height: 0, count: 0, timing: 0, loop: false },
			run: { x: 0, y: 128 * 8, width: 128, height: 128, count: 9, timing: 50, loop: true },
			walk: { x: 0, y: 128 * 9, width: 128, height: 128, count: 11, timing: 100, loop: true }
		};
	}
}

/**
 * Creates a Red Werewolf enemy.
 * @param {CanvasRenderingContext2D} ctx - A canvas rendering context for drawing.
 * @param {number} x - The initial x position of the enemy.
 * @param {number} y - The initial y position of the enemy.
 * @param {string} name - The name of the enemy.
 * @returns {Enemy} An enemy object with methods for movement and rendering.
 */
class RedWerewolf extends Enemy {
	constructor(ctx, x, y, name = 'RedWerewolf') {
		super(ctx, x, y, RedWerewolfSpritesheet, name);

		this.sequences = {
			idle: { x: 0, y: 128 * 0, width: 128, height: 128, count: 8, timing: 200, loop: true },
			attack_1: {
				x: 0,
				y: 128 * 1,
				width: 128,
				height: 128,
				count: 6,
				timing: 50,
				loop: true
			},
			attack_2: {
				x: 0,
				y: 128 * 2,
				width: 128,
				height: 128,
				count: 4,
				timing: 50,
				loop: true
			},
			attack_3: {
				x: 0,
				y: 128 * 3,
				width: 128,
				height: 128,
				count: 5,
				timing: 50,
				loop: true
			},
			dead: { x: 0, y: 128 * 4, width: 128, height: 128, count: 2, timing: 50, loop: false },
			hurt: { x: 0, y: 128 * 5, width: 128, height: 128, count: 2, timing: 50, loop: true },
			jump: { x: 0, y: 128 * 6, width: 128, height: 128, count: 11, timing: 50, loop: true },
			misc: { x: 0, y: 0, width: 0, height: 0, count: 0, timing: 0, loop: false },
			run: { x: 0, y: 128 * 8, width: 128, height: 128, count: 9, timing: 50, loop: true },
			walk: { x: 0, y: 128 * 9, width: 128, height: 128, count: 11, timing: 100, loop: true }
		};
	}
}

/**
 * Creates a Gotoku enemy.
 * @param {CanvasRenderingContext2D} ctx - A canvas rendering context for drawing.
 * @param {number} x - The initial x position of the enemy.
 * @param {number} y - The initial y position of the enemy.
 * @param {string} name - The name of the enemy.
 * @returns {Enemy} An enemy object with methods for movement and rendering.
 */
class Gotoku extends Enemy {
	constructor(ctx, x, y, name = 'Gotoku') {
		super(ctx, x, y, GotokuSpritesheet, name);

		this.sequences = {
			idle: { x: 0, y: 128 * 0, width: 128, height: 128, count: 5, timing: 200, loop: true },
			attack_1: {
				x: 0,
				y: 128 * 1,
				width: 128,
				height: 128,
				count: 4,
				timing: 50,
				loop: true
			},
			attack_2: {
				x: 0,
				y: 128 * 2,
				width: 128,
				height: 128,
				count: 4,
				timing: 50,
				loop: true
			},
			attack_3: {
				x: 0,
				y: 128 * 3,
				width: 128,
				height: 128,
				count: 4,
				timing: 50,
				loop: true
			},
			dead: { x: 0, y: 128 * 4, width: 128, height: 128, count: 6, timing: 50, loop: false },
			hurt: { x: 0, y: 128 * 5, width: 128, height: 128, count: 3, timing: 50, loop: true },
			jump: { x: 0, y: 128 * 6, width: 128, height: 128, count: 8, timing: 50, loop: true },
			misc: { x: 0, y: 128 * 7, width: 128, height: 128, count: 4, timing: 50, loop: false },
			run: { x: 0, y: 128 * 8, width: 128, height: 128, count: 7, timing: 50, loop: true },
			walk: { x: 0, y: 128 * 9, width: 128, height: 128, count: 6, timing: 100, loop: true }
		};
	}
}

/**
 * Creates a Onre enemy.
 * @param {CanvasRenderingContext2D} ctx - A canvas rendering context for drawing.
 * @param {number} x - The initial x position of the enemy.
 * @param {number} y - The initial y position of the enemy.
 * @param {string} name - The name of the enemy.
 * @returns {Enemy} An enemy object with methods for movement and rendering.
 */
class Onre extends Enemy {
	constructor(ctx, x, y, name = 'Onre') {
		super(ctx, x, y, OnreSpritesheet, name);

		this.sequences = {
			idle: { x: 0, y: 128 * 0, width: 128, height: 128, count: 6, timing: 200, loop: true },
			attack_1: {
				x: 0,
				y: 128 * 1,
				width: 128,
				height: 128,
				count: 5,
				timing: 50,
				loop: true
			},
			attack_2: {
				x: 0,
				y: 128 * 2,
				width: 128,
				height: 128,
				count: 4,
				timing: 50,
				loop: true
			},
			attack_3: {
				x: 0,
				y: 128 * 3,
				width: 128,
				height: 128,
				count: 4,
				timing: 50,
				loop: true
			},
			dead: { x: 0, y: 128 * 4, width: 128, height: 128, count: 7, timing: 50, loop: false },
			hurt: { x: 0, y: 128 * 5, width: 128, height: 128, count: 3, timing: 50, loop: true },
			jump: { x: 0, y: 128 * 6, width: 128, height: 128, count: 6, timing: 50, loop: true },
			misc: { x: 0, y: 128 * 7, width: 128, height: 128, count: 7, timing: 50, loop: false },
			run: { x: 0, y: 128 * 8, width: 128, height: 128, count: 7, timing: 50, loop: true },
			walk: { x: 0, y: 128 * 9, width: 128, height: 128, count: 7, timing: 100, loop: true }
		};
	}
}

/**
 * Creates a Yurei enemy.
 * @param {CanvasRenderingContext2D} ctx - A canvas rendering context for drawing.
 * @param {number} x - The initial x position of the enemy.
 * @param {number} y - The initial y position of the enemy.
 * @param {string} name - The name of the enemy.
 * @returns {Enemy} An enemy object with methods for movement and rendering.
 */
class Yurei extends Enemy {
	constructor(ctx, x, y, name = 'Yurei') {
		super(ctx, x, y, YureiSpritesheet, name);

		this.sequences = {
			idle: { x: 0, y: 128 * 0, width: 128, height: 128, count: 5, timing: 200, loop: true },
			attack_1: {
				x: 0,
				y: 128 * 1,
				width: 128,
				height: 128,
				count: 4,
				timing: 50,
				loop: true
			},
			attack_2: {
				x: 0,
				y: 128 * 2,
				width: 128,
				height: 128,
				count: 4,
				timing: 50,
				loop: true
			},
			attack_3: {
				x: 0,
				y: 128 * 3,
				width: 128,
				height: 128,
				count: 7,
				timing: 50,
				loop: true
			},
			dead: { x: 0, y: 128 * 4, width: 128, height: 128, count: 5, timing: 50, loop: false },
			hurt: { x: 0, y: 128 * 5, width: 128, height: 128, count: 3, timing: 50, loop: true },
			jump: { x: 0, y: 0, width: 128, height: 128, count: 0, timing: 50, loop: true },
			misc: { x: 0, y: 128 * 7, width: 128, height: 128, count: 4, timing: 50, loop: false },
			run: { x: 0, y: 128 * 8, width: 128, height: 128, count: 5, timing: 50, loop: true },
			walk: { x: 0, y: 128 * 9, width: 128, height: 128, count: 6, timing: 100, loop: true }
		};
	}
}

export {
	WhiteWerewolf,
	BlackWerewolf,
	RedWerewolf,
	Gotoku,
	Onre,
	Yurei
};