import Sprite from '$lib/javascript/sprite.js';

/**
 * Creates a player character.
 * @param {CanvasRenderingContext2D} ctx - A canvas rendering context for drawing.
 * @param {number} x - The initial x position of the player.
 * @param {number} y - The initial y position of the player.
 * @param {string} spritesheet - The source of the player sprite sheet (URL).
 * @returns {Player} A player object with methods for movement and rendering.
 */
export function Player(ctx, x, y, spritesheet) {
	/**
	 * This is the sprite sequences of the player facing different directions.
	 * It contains the idling sprite sequences `idleLeft`, `idleUp`, `idleRight` and `idleDown`,
	 * and the moving sprite sequences `moveLeft`, `moveUp`, `moveRight` and `moveDown`.
	 *
	 * @typedef {Object} PlayerSequences
	 * */
	const sequences = {
		/* Idling sprite sequences for facing different directions */
		idle: {x: 0, y: 128*0, width: 128, height: 128, count: 6, timing: 200, loop: true},
		attack_1: {x: 0, y: 128*1, width: 128, height: 128, count: 4, timing: 50, loop: true},
		attack_2: {x: 0, y: 128*2, width: 128, height: 128, count: 5, timing: 50, loop: true},
		attack_3: {x: 0, y: 128*3, width: 128, height: 128, count: 4, timing: 50, loop: true},
		dead: {x: 0, y: 128*4, width: 128, height: 128, count: 6, timing: 50, loop: true},
		hurt: {x: 0, y: 128*5, width: 128, height: 128, count: 3, timing: 50, loop: true},
		jump: {x: 0, y: 128*6, width: 128, height: 128, count: 9, timing: 50, loop: true},
		protection: {x: 128*7, y: 0, width: 128, height: 128, count: 2, timing: 50, loop: true},
		run: {x: 0, y: 128*8, width: 128, height: 128, count: 8, timing: 50, loop: true},
		walk: {x: 0, y: 128*9, width: 128, height: 128, count: 9, timing: 100, loop: true},
	};

	/**
	 * This is the sprite object of the player created from the Sprite module.
	 * @type {Sprite} The sprite object of the player.
	 */
	const sprite = Sprite(ctx, x, y);

	// The sprite object is configured for the player sprite here.
	sprite.setSequence(sequences.idle)
		.setScale(1)
		.setShadowScale({x: 0.25, y: 0.20})
		.useSheet(spritesheet);

	/**
	 * This is the moving direction, which can be a number from 0 to 4:
	 * - `0` - not moving
	 * - `1` - moving to the left
	 * - `2` - moving up
	 * - `3` - moving to the right
	 * - `4` - moving down
	 * @type {number} The moving direction.
	 */
	let direction = 0;

	/**
	 * This function sets the player's moving direction.
	 * @param {number} dir - The moving direction (1: Left, 2: Up, 3: Right, 4: Down)
	 * @returns {void}
	 */
	const move = function (dir) {
		if (dir >= 1 && dir <= 4 && dir !== direction) {
			switch (dir) {
				case 1:
					sprite.setSequence(sequences.walk);
					sprite.setFlipped(true);
					break;
				case 2:
					// sprite.setSequence(sequences.moveUp);
					break;
				case 3:
					sprite.setSequence(sequences.walk);
					sprite.setFlipped(false);
					break;
				case 4:
					// sprite.setSequence(sequences.moveDown);
					break;
			}
			direction = dir;
		}
	};

	/**
	 * This function sets the position of the player.
	 * @param {number} x
	 * @param {number} y
	 */
	const setPosition = function (x, y) {
		sprite.setXY(x, y);
	};

	/**
	 * This function stops the player from moving.
	 * @param {number} dir The moving direction when the player is stopped (1: Left, 2: Up, 3: Right, 4: Down)
	 */
	const stop = function (dir) {
		sprite.setSequence(sequences.idle);
		// if (direction === dir) {
		// 	switch (dir) {
		// 		case 1:
		// 			sprite.setSequence(sequences.idleLeft);
		// 			break;
		// 		case 2:
		// 			sprite.setSequence(sequences.idleUp);
		// 			break;
		// 		case 3:
		// 			sprite.setSequence(sequences.idleRight);
		// 			break;
		// 		case 4:
		// 			sprite.setSequence(sequences.idleDown);
		// 			break;
		// 	}
		// 	direction = 0;
		// }
	};


	/**
	 * This function updates the player depending on his movement.
	 * @param {number} time The timestamp when this function is called
	 */
	const update = function (time) {
		/* Update the sprite object */
		sprite.update(time);
	};

	// The methods are returned as an object here.
	return {
		move: move,
		stop: stop,
		setPosition: setPosition,
		getBoundingBox: sprite.getBoundingBox,
		draw: sprite.draw,
		update: update
	};
}
