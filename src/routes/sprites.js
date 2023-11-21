import Sprite from '$lib/javascript/sprite.js';

/**
 * Represents a player character.
 * @typedef {Object} Player
 * @property {function(number): void} move - Sets the moving direction of the player.
 * @property {function(number): void} stop - Stops the player from moving.
 * @property {function(number, number): void} setPosition - Sets the position of the player.
 * @property {function(string): void} setAnimation - Sets the animation of the player.
 * @property {function(): BoundingBox} getBoundingBox - Gets the bounding box of the player.
 * @property {function(): Sprite} getSprite - Gets the sprite of the player.
 * @property {function(): void} draw - Draws the player on the canvas.
 * @property {function(number): void} update - Updates the player's position and animation.
 */

/**
 * Creates a player character.
 * @param {CanvasRenderingContext2D} ctx - A canvas rendering context for drawing.
 * @param {number} x - The initial x position of the player.
 * @param {number} y - The initial y position of the player.
 * @param {string} spritesheet - The source of the player sprite sheet (URL).
 * @param {string} name - The name of the player.
 * @returns {Player} A player object with methods for movement and rendering.
 */
export function Player(ctx, x, y, spritesheet, name = 'Player') {
	/**
	 * This is the sprite sequences of the player facing different directions.
	 * It contains the idling sprite sequences `idleLeft`, `idleUp`, `idleRight` and `idleDown`,
	 * and the moving sprite sequences `moveLeft`, `moveUp`, `moveRight` and `moveDown`.
	 *
	 * @typedef {Object} PlayerSequences
	 * */
	const sequences = {
		/* Idling sprite sequences for facing different directions */
		idle: { x: 0, y: 128 * 0, width: 128, height: 128, count: 6, timing: 200, loop: true },
		attack_1: { x: 0, y: 128 * 1, width: 128, height: 128, count: 4, timing: 50, loop: true },
		attack_2: { x: 0, y: 128 * 2, width: 128, height: 128, count: 5, timing: 50, loop: true },
		attack_3: { x: 0, y: 128 * 3, width: 128, height: 128, count: 4, timing: 50, loop: true },
		dead: { x: 0, y: 128 * 4, width: 128, height: 128, count: 6, timing: 50, loop: true },
		hurt: { x: 0, y: 128 * 5, width: 128, height: 128, count: 3, timing: 50, loop: true },
		jump: { x: 0, y: 128 * 6, width: 128, height: 128, count: 9, timing: 50, loop: true },
		protection: { x: 128 * 7, y: 0, width: 128, height: 128, count: 2, timing: 50, loop: true },
		run: { x: 0, y: 128 * 8, width: 128, height: 128, count: 8, timing: 50, loop: true },
		walk: { x: 0, y: 128 * 9, width: 128, height: 128, count: 9, timing: 100, loop: true }
	};

	/**
	 * This is the sprite object of the player created from the Sprite module.
	 * @type {Sprite} The sprite object of the player.
	 */
	const sprite = Sprite(ctx, x, y);

	// The sprite object is configured for the player sprite here.
	sprite
		.setSequence(sequences.idle)
		.setScale(1)
		.setShadowScale({ x: 0.25, y: 0.2 })
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

	const setAnimation = function (animation) {
		switch (animation) {
			case 'idle':
				sprite.setSequence(sequences.idle);
				break;
			case 'attack':
				if (sprite.getSequence() === sequences.attack_1 || sprite.getSequence() === sequences.attack_2 || sprite.getSequence() === sequences.attack_3) {
					break;
				}
				// Pick a random attack animation
				const random = Math.floor(Math.random() * 3) + 1;
				sprite.setSequence(sequences[`attack_${random}`]);
				break;
			case 'dead':
				sprite.setSequence(sequences.dead);
				break;
			case 'hurt':
				sprite.setSequence(sequences.hurt);
				break;
			case 'jump':
				sprite.setSequence(sequences.jump);
				break;
			case 'protection':
				sprite.setSequence(sequences.protection);
				break;
			case 'run':
				sprite.setSequence(sequences.run);
				break;
			case 'walk':
				sprite.setSequence(sequences.walk);
				break;
			case 'walk_left':
				sprite.setSequence(sequences.walk);
				sprite.setFlipped(true);
				break;
			case 'walk_right':
				sprite.setSequence(sequences.walk);
				sprite.setFlipped(false);
				break;
			default:
				sprite.setSequence(sequences.idle);
				break;
		}
	}

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

	/**
	 * This function draws the player on the canvas.
	 */
	const draw = function () {
		sprite.draw();

		// Add text with player name under the player
		ctx.save();
		ctx.font = '16px Arial';
		ctx.fillStyle = 'black';
		ctx.textAlign = 'center';
		ctx.fillText(
			name,
			sprite.getXYCanvas().x,
			sprite.getXYCanvas().y + sprite.getDisplaySize().height / 2 + 16
		);
		ctx.restore();
	};

	/**
	 * This function returns the sprite of the player.
	 * @returns {Sprite}
	 */
	const getSprite = function () {
		return sprite;
	};

	// The methods are returned as an object here.
	return {
		move: move,
		stop: stop,
		setPosition: setPosition,
		setAnimation: setAnimation,
		getBoundingBox: sprite.getBoundingBox,
		getSprite: getSprite,
		draw: draw,
		update: update
	};
}
