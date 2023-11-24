import Sprite from '$lib/javascript/sprite.js';
import SamuraiSpritesheet from '$lib/images/Samurai/Spritesheet.png';
import SamuraiArcherSpritesheet from '$lib/images/Samurai_Archer/Spritesheet.png';
import SamuraiCommanderSpritesheet from '$lib/images/Samurai_Commander/Spritesheet.png';
import WhiteWerewolfSpritesheet from '$lib/images/White_Werewolf/Spritesheet.png';
import BlackWerewolfSpritesheet from '$lib/images/Black_Werewolf/Spritesheet.png';
import RedWerewolfSpritesheet from '$lib/images/Red_Werewolf/Spritesheet.png';

/**
 * Creates a player character.
 * @param {CanvasRenderingContext2D} ctx - A canvas rendering context for drawing.
 * @param {number} x - The initial x position of the entity.
 * @param {number} y - The initial y position of the entity.
 * @param {string} spritesheet - The source of the entity sprite sheet (URL).
 * @param {string} name - The name of the entity.
 * @property {function(number): void} move - Sets the moving direction of the entity.
 * @property {function(number): void} stop - Stops the entity from moving.
 * @property {function(number, number): void} setPosition - Sets the position of the entity.
 * @property {function(string, string): void} setAnimation - Sets the animation of the entity.
 * @property {function(): Sprite} sprite - Gets the sprite of the entity.
 * @property {function(): void} draw - Draws the entity on the canvas.
 * @property {function(number): void} update - Updates the entity's position and animation.
 * @returns {Entity} An entity object with methods for movement and rendering.
 */
class Entity {
	constructor(ctx, x, y, spritesheet, name = 'Entity') {
		this.ctx = ctx;
		this.spritesheet = spritesheet;
		this.name = name;

		/**
		 * This is the sprite sequences of the player facing different directions.
		 * It contains the idling sprite sequences `idleLeft`, `idleUp`, `idleRight` and `idleDown`,
		 * and the moving sprite sequences `moveLeft`, `moveUp`, `moveRight` and `moveDown`.
		 *
		 * @typedef {Object} AnimationSequences
		 * */
		this.sequences = {
			idle: { x: 0, y: 128 * 0, width: 128, height: 128, count: 6, timing: 200, loop: true },
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
			hurt: { x: 0, y: 128 * 5, width: 128, height: 128, count: 3, timing: 50, loop: true },
			jump: { x: 0, y: 128 * 6, width: 128, height: 128, count: 9, timing: 50, loop: true },
			protection: {
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

		/**
		 * This is the sprite object of the player created from the Sprite module.
		 * @type {Sprite} The sprite object of the player.
		 */
		this.sprite = Sprite(this.ctx, x, y);

		// The sprite object is configured for the player sprite here.
		this.sprite
			.setSequence(this.sequences.idle)
			.setScale(1)
			.setShadowScale({ x: 0.25, y: 0.2 })
			.useSheet(this.spritesheet);

		/**
		 * This is the moving direction, which can be a number from 0 to 4:
		 * - `0` - not moving
		 * - `1` - moving to the left
		 * - `2` - moving up
		 * - `3` - moving to the right
		 * - `4` - moving down
		 * @type {number} The moving direction.
		 */
		this.direction = 0;
	}

	/**
	 * This function sets the player's moving direction.
	 * @param {number} dir - The moving direction (1: Left, 2: Up, 3: Right, 4: Down)
	 * @returns {void}
	 */
	move(dir) {
		if (dir >= 1 && dir <= 4 && dir !== this.direction) {
			switch (dir) {
				case 1:
					this.sprite.setSequence(this.sequences.walk);
					this.sprite.setFlipped(true);
					break;
				case 2:
					// this.sprite.setSequence(this.sequences.moveUp);
					break;
				case 3:
					this.sprite.setSequence(this.sequences.walk);
					this.sprite.setFlipped(false);
					break;
				case 4:
					// this.sprite.setSequence(this.sequences.moveDown);
					break;
			}
			this.direction = dir;
		}
	}

	setAnimation(animation, direction = 'none') {
		// Set direction
		if (direction === 'left') {
			this.sprite.setFlipped(true);
		} else {
			this.sprite.setFlipped(false);
		}

		// Set animation
		switch (animation) {
			case 'idle':
				this.sprite.setSequence(this.sequences.idle);
				break;
			case 'attack':
				if (
					this.sprite.getSequence() === this.sequences.attack_1 ||
					this.sprite.getSequence() === this.sequences.attack_2 ||
					this.sprite.getSequence() === this.sequences.attack_3
				) {
					break;
				}
				// Pick a random attack animation
				const random = Math.floor(Math.random() * 3) + 1;
				this.sprite.setSequence(this.sequences[`attack_${random}`]);
				break;
			case 'dead':
				this.sprite.setSequence(this.sequences.dead);
				break;
			case 'hurt':
				this.sprite.setSequence(this.sequences.hurt);
				break;
			case 'jump':
				this.sprite.setSequence(this.sequences.jump);
				break;
			case 'protection':
				this.sprite.setSequence(this.sequences.protection);
				break;
			case 'run':
				this.sprite.setSequence(this.sequences.run);
				break;
			case 'walk':
				this.sprite.setSequence(this.sequences.walk);
				break;
			default:
				this.sprite.setSequence(this.sequences.idle);
				break;
		}
	}

	/**
	 * This function sets the position of the player.
	 * @param {number} x
	 * @param {number} y
	 */
	setPosition(x, y) {
		this.sprite.setXY(x, y);
	}

	/**
	 * This function stops the player from moving.
	 * @param {number} dir The moving direction when the player is stopped (1: Left, 2: Up, 3: Right, 4: Down)
	 */
	stop(dir) {
		this.sprite.setSequence(this.sequences.idle);
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
	}

	/**
	 * This function updates the player depending on his movement.
	 * @param {number} time The timestamp when this function is called
	 */
	update(time) {
		/* Update the sprite object */
		this.sprite.update(time);
	}

	/**
	 * This function draws the player on the canvas.
	 */
	draw() {
		this.sprite.draw();

		// Add text with player name under the player
		this.ctx.save();
		this.ctx.font = '16px Arial';
		this.ctx.fillStyle = 'black';
		this.ctx.textAlign = 'center';
		this.ctx.fillText(
			name,
			this.sprite.getXYCanvas().x,
			this.sprite.getXYCanvas().y + this.sprite.getDisplaySize().height / 2 + 16
		);
		this.ctx.restore();
	}
}

/**
 * Creates a player character.
 * @param {CanvasRenderingContext2D} ctx - A canvas rendering context for drawing.
 * @param {number} x - The initial x position of the player.
 * @param {number} y - The initial y position of the player.
 * @param {string} spritesheet - The source of the player sprite sheet (URL).
 * @param {string} name - The name of the player.
 * @returns {Entity} An entity object with methods for movement and rendering.
 */
class Player extends Entity {
	constructor(ctx, x, y, spritesheet, name = 'Player') {
		super(ctx, x, y, spritesheet, name);
	}
}

/**
 * Creates an enemy entity.
 * @param {CanvasRenderingContext2D} ctx - A canvas rendering context for drawing.
 * @param {number} x - The initial x position of the enemy.
 * @param {number} y - The initial y position of the enemy.
 * @param {string} spritesheet - The source of the enemy sprite sheet (URL).
 * @param {string} name - The name of the enemy.
 * @returns {Entity} An entity object with methods for movement and rendering.
 */
class Enemy extends Entity {
	constructor(ctx, x, y, spritesheet, name = 'Enemy') {
		super(ctx, x, y, spritesheet, name);
	}
}

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
			hurt: { x: 0, y: 128 * 5, width: 128, height: 128, count: 3, timing: 50, loop: true },
			jump: { x: 0, y: 128 * 6, width: 128, height: 128, count: 9, timing: 50, loop: true },
			protection: {
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
			protection: { x: 0, y: 0, width: 0, height: 0, count: 0, timing: 0, loop: false },
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
			protection: {
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
			protection: { x: 0, y: 0, width: 0, height: 0, count: 0, timing: 0, loop: false },
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
			protection: { x: 0, y: 0, width: 0, height: 0, count: 0, timing: 0, loop: false },
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
			protection: { x: 0, y: 0, width: 0, height: 0, count: 0, timing: 0, loop: false },
			run: { x: 0, y: 128 * 8, width: 128, height: 128, count: 9, timing: 50, loop: true },
			walk: { x: 0, y: 128 * 9, width: 128, height: 128, count: 11, timing: 100, loop: true }
		};
	}
}

export {
	Entity,
	Samurai,
	SamuraiArcher,
	SamuraiCommander,
	WhiteWerewolf,
	BlackWerewolf,
	RedWerewolf
};
