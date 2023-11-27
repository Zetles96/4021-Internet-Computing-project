import SamuraiSpritesheet from '$lib/images/Samurai/Spritesheet.png';
import SamuraiArcherSpritesheet from '$lib/images/Samurai_Archer/Spritesheet.png';
import SamuraiCommanderSpritesheet from '$lib/images/Samurai_Commander/Spritesheet.png';
import { Player } from '$lib/sprites/sprites.js';

/**
 * Creates a Samurai player character.
 * @param {CanvasRenderingContext2D} ctx - A canvas rendering context for drawing.
 * @param {number} x - The initial x position of the player.
 * @param {number} y - The initial y position of the player.
 * @param {string} name - The name of the player.
 * @returns {Player} A player object with methods for movement and rendering.
 */
class Samurai extends Player {
	constructor(ctx, x, y, name = 'SamuraiPlayer') {
		super(ctx, x, y, SamuraiSpritesheet, name);

		this.sequences = {
			idle: { x: 0, y: 128 * 0, width: 128, height: 128, count: 6, timing: 200, loop: true },
			attack_1: {
				x: 0,
				y: 128 * 1,
				width: 128,
				height: 128,
				count: 4,
				timing: 50,
				loop: false
			},
			attack_2: {
				x: 0,
				y: 128 * 2,
				width: 128,
				height: 128,
				count: 5,
				timing: 50,
				loop: false
			},
			attack_3: {
				x: 0,
				y: 128 * 3,
				width: 128,
				height: 128,
				count: 4,
				timing: 50,
				loop: false
			},
			dead: { x: 0, y: 128 * 4, width: 128, height: 128, count: 6, timing: 50, loop: false },
			hurt: { x: 0, y: 128 * 5, width: 128, height: 128, count: 3, timing: 50, loop: true },
			jump: { x: 0, y: 128 * 6, width: 128, height: 128, count: 9, timing: 50, loop: true },
			misc: {
				x: 128 * 7,
				y: 0,
				width: 128,
				height: 128,
				count: 2,
				timing: 50,
				loop: true
			},
			run: { x: 0, y: 128 * 8, width: 128, height: 128, count: 8, timing: 50, loop: true },
			walk: { x: 0, y: 128 * 9, width: 128, height: 128, count: 9, timing: 100, loop: true }
		};
	}
}

/**
 * Creates a Samurai Archer player character.
 * @param {CanvasRenderingContext2D} ctx - A canvas rendering context for drawing.
 * @param {number} x - The initial x position of the player.
 * @param {number} y - The initial y position of the player.
 * @param {string} name - The name of the player.
 * @returns {Player} A player object with methods for movement and rendering.
 */
class SamuraiArcher extends Player {
	constructor(ctx, x, y, name = 'SamuraiArcher') {
		super(ctx, x, y, SamuraiArcherSpritesheet, name);

		this.sequences = {
			/* Idling sprite sequences for facing different directions */
			idle: { x: 0, y: 128 * 0, width: 128, height: 128, count: 9, timing: 200, loop: true },
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
				count: 5,
				timing: 50,
				loop: true
			},
			attack_3: {
				x: 0,
				y: 128 * 3,
				width: 128,
				height: 128,
				count: 6,
				timing: 50,
				loop: true
			},
			dead: { x: 0, y: 128 * 4, width: 128, height: 128, count: 5, timing: 50, loop: false },
			hurt: { x: 0, y: 128 * 5, width: 128, height: 128, count: 3, timing: 50, loop: true },
			jump: { x: 0, y: 128 * 6, width: 128, height: 128, count: 9, timing: 50, loop: true },
			misc: { x: 0, y: 0, width: 0, height: 0, count: 0, timing: 0, loop: false },
			run: { x: 0, y: 128 * 8, width: 128, height: 128, count: 8, timing: 50, loop: true },
			walk: { x: 0, y: 128 * 9, width: 128, height: 128, count: 8, timing: 100, loop: true }
		};
	}
}

/**
 * Creates a Samurai Commander player character.
 * @param {CanvasRenderingContext2D} ctx - A canvas rendering context for drawing.
 * @param {number} x - The initial x position of the player.
 * @param {number} y - The initial y position of the player.
 * @param {string} name - The name of the player.
 * @returns {Player} A player object with methods for movement and rendering.
 */
class SamuraiCommander extends Player {
	constructor(ctx, x, y, name = 'SamuraiCommander') {
		super(ctx, x, y, SamuraiCommanderSpritesheet, name);

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
				count: 5,
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
			hurt: { x: 0, y: 128 * 5, width: 128, height: 128, count: 2, timing: 50, loop: true },
			jump: { x: 0, y: 128 * 6, width: 128, height: 128, count: 7, timing: 50, loop: true },
			misc: {
				x: 128 * 7,
				y: 0,
				width: 128,
				height: 128,
				count: 2,
				timing: 50,
				loop: true
			},
			run: { x: 0, y: 128 * 8, width: 128, height: 128, count: 8, timing: 50, loop: true },
			walk: { x: 0, y: 128 * 9, width: 128, height: 128, count: 9, timing: 100, loop: true }
		};
	}
}

export { Samurai, SamuraiArcher, SamuraiCommander };
