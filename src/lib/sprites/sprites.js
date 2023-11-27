/**
 * Creates a new Sprite object.
 * @param {CanvasRenderingContext2D} ctx - A canvas context for drawing.
 * @param {number} x - The initial x position of the sprite.
 * @param {number} y - The initial y position of the sprite.
 * @property {function(string): Sprite} useSheet - Sets the sprite sheet image source.
 * @property {function(): {x: number, y: number}} getXY - Gets the current position of the sprite.
 * @property {function(): {x: number, y: number}} getXYCanvas - Gets the current position of the sprite but on canvas.
 * @property {function(number, number): Sprite} setXY - Sets the position of the sprite.
 * @property {function({x: number, y: number, width: number, height: number, count: number, timing: number, loop: boolean}): Sprite} setSequence - Sets the sprite sequence information.
 * @property {function(): {x: number, y: number, width: number, height: number, count: number, timing: number, loop: boolean}} getSequence - Gets the sprite sequence information.
 * @property {function(number): Sprite} setScale - Sets the scaling factor of the sprite.
 * @property {function({x: number, y: number}): Sprite} setShadowScale - Sets the scaling factor of the sprite shadow.
 * @property {function(): {width: number, height: number}} getDisplaySize - Gets the display size of the sprite.
 * @property {function(): BoundingBox} getBoundingBox - Gets the bounding box of the sprite.
 * @property {function(): boolean} isReady - Checks if the sprite sheet image is loaded and ready to use.
 * @property {function(): void} draw - Draws the sprite and its shadow.
 * @property {function(number): Sprite} update - Updates the sprite animation based on the timestamp.
 * @property {function(boolean): Sprite} setFlipped - Sets the sprite flipped state.
 * @property {function(boolean): Sprite} setAlongX - Sets the sprite flipped state.
 * @returns {Sprite} Returns a Sprite object.
 */
const Sprite = function (ctx, x, y) {
	/**
	 * The image object for the sprite sheet.
	 * @type {HTMLImageElement}
	 */
	const sheet = new Image();

	/**
	 * Object containing the sprite sequence information used by the sprite.
	 * @type {{x: number, y: number, width: number, height: number, count: number, timing: number, loop: boolean}}
	 */
	let sequence = { x: 0, y: 0, width: 20, height: 20, count: 1, timing: 0, loop: false };

	/**
	 * Index indicating the current sprite image used in the sprite sequence.
	 * @type {number}
	 */
	let index = 0;

	/**
	 * Scaling factor for drawing the sprite.
	 * @type {number}
	 */
	let scale = 1;

	/**
	 * Whether the sprite is flipped horizontally.
	 * @type {boolean}
	 */
	let flipped = false;

	/**
	 * Whether the sprite is flipped horizontally (by default go through the x axis).
	 * @type {boolean} Whether the sprite is flipped horizontally.
	 */
	let alongX = true;

	/**
	 * Scaling factor to determine the size of the shadow, relative to the scaled sprite image size.
	 * @type {{x: number, y: number}}
	 */
	let shadowScale = { x: 1, y: 0.25 };

	/**
	 * Updated time of the current sprite image, used to determine the timing to switch to the next sprite image.
	 * @type {number}
	 */
	let lastUpdate = 0;

	/**
	 * Sets the sprite sheet image source.
	 * @param {string} spriteSheet - The source of the sprite sheet (URL).
	 * @returns {Sprite} The current Sprite object for method chaining.
	 */
	const useSheet = function (spriteSheet) {
		sheet.src = spriteSheet;
		return this;
	};

	/**
	 * Gets the current position of the sprite.
	 * @returns {{x: number, y: number}} The current position of the sprite.
	 */
	const getXY = function () {
		return { x, y };
	};

	/**
	 * Gets the current position of the sprite.
	 * @returns {{x: number, y: number}} The current position of the sprite.
	 */
	const getXYCanvas = function () {
		return { x: x + ctx.canvas.width / 2, y: y + ctx.canvas.height / 2 };
	};

	/**
	 * Sets the position of the sprite.
	 * @param {number} xvalue - The new x position.
	 * @param {number} yvalue - The new y position.
	 * @returns {Sprite} The current Sprite object for method chaining.
	 */
	const setXY = function (xvalue, yvalue) {
		[x, y] = [xvalue, yvalue];
		return this;
	};

	/**
	 * Sets the flipped state of the sprite.
	 * @param {boolean} value - The new flipped state.
	 * @returns {Sprite}
	 */
	const setFlipped = function (value) {
		flipped = value;
		return this;
	};

	/**
	 * Sets the flipped state of the sprite.
	 * @param {boolean} value - The new flipped state.
	 * @returns {setAlongX}
	 */
	const setAlongX = function (value) {
		alongX = value;
		return this;
	};

	/**
	 * Sets the sprite sequence.
	 * @param {{x: number, y: number, width: number, height: number, count: number, timing: number, loop: boolean}} newSequence - The new sprite sequence to be used by the sprite.
	 * @returns {Sprite} The current Sprite object for method chaining.
	 */
	const setSequence = function (newSequence) {
		// Do nothing if the new sequence is the same as the current sequence.
		if (newSequence === sequence) return this;

		sequence = newSequence;
		index = 0;
		lastUpdate = 0;
		return this;
	};

	/**
	 * Gets the sprite sequence.
	 * @returns {{x: number, y: number, width: number, height: number, count: number, timing: number, loop: boolean}}
	 */
	const getSequence = function () {
		return sequence;
	};

	/**
	 * Sets the scaling factor of the sprite.
	 * @param {number} value - The new scaling factor.
	 * @returns {Sprite} The current Sprite object for method chaining.
	 */
	const setScale = function (value) {
		scale = value;
		return this;
	};

	/**
	 * Sets the scaling factor of the sprite shadow.
	 * @param {{x: number, y: number}} value - The new scaling factor as an object.
	 * @param {number} value.x - The x scaling factor.
	 * @param {number} value.y - The y scaling factor.
	 * @returns {Sprite} The current Sprite object for method chaining.
	 */
	const setShadowScale = function (value) {
		shadowScale = value;
		return this;
	};

	/**
	 * Gets the display size of the sprite.
	 * @returns {{width: number, height: number}} The display size of the sprite.
	 */
	const getDisplaySize = function () {
		/* Find the scaled width and height of the sprite */
		const scaledWidth = sequence.width * scale;
		const scaledHeight = sequence.height * scale;
		return { width: scaledWidth, height: scaledHeight };
	};

	/**
	 * Gets the bounding box of the sprite.
	 * @returns {BoundingBox} The bounding box of the sprite.
	 */
	const getBoundingBox = function () {
		/* Get the display size of the sprite */
		const size = getDisplaySize();

		/* Find the box coordinates */
		const top = y - size.height / 2;
		const left = x - size.width / 2;
		const bottom = y + size.height / 2;
		const right = x + size.width / 2;

		return BoundingBox(ctx, top, left, bottom, right);
	};

	/**
	 * Checks if the sprite sheet image is loaded and ready to use.
	 * @returns {boolean} True if the sprite sheet image is ready, false otherwise.
	 */
	const isReady = function () {
		return sheet.complete && sheet.naturalHeight !== 0;
	};

	/**
	 * Draws shadow underneath the sprite.
	 * @returns {void}
	 */
	const drawShadow = function () {
		/* Save the settings */
		ctx.save();

		/* Get the display size of the sprite */
		const size = getDisplaySize();
		const pos = getXYCanvas();

		/* Find the scaled width and height of the shadow */
		const shadowWidth = size.width * shadowScale.x;
		const shadowHeight = size.height * shadowScale.y;

		/* Draw a semi-transparent oval */
		ctx.fillStyle = 'black';
		ctx.globalAlpha = 0.6;
		ctx.beginPath();
		ctx.ellipse(
			pos.x,
			pos.y + size.height / 2,
			shadowWidth / 2,
			shadowHeight / 2,
			0,
			0,
			2 * Math.PI
		);
		ctx.fill();

		/* Restore saved settings */
		ctx.restore();
	};

	/**
	 * Draws the sprite.
	 * @returns {void}
	 */
	const drawSprite = function () {
		/* Save the settings */
		ctx.save();

		/* Get the display size of the sprite */
		const size = getDisplaySize();
		const pos = getXYCanvas();

		if (flipped) {
			// Flip the sprite horizontally
			ctx.translate(pos.x, pos.y);
			ctx.scale(-1, 1);
			ctx.translate(-pos.x, -pos.y);
		}

		/* Draw the sprite */
		ctx.imageSmoothingEnabled = false;
		ctx.drawImage(
			sheet,
			sequence.x + (alongX ? index * sequence.width : 0),
			sequence.y + (alongX ? 0 : index * sequence.height),
			sequence.width,
			sequence.height,
			pos.x - size.width / 2,
			pos.y - size.height / 2,
			size.width,
			size.height
		);

		/* Restore saved settings */
		ctx.restore();
	};

	/**
	 * Draws the shadow and the sprite.
	 * @returns {Sprite} The current Sprite object for method chaining.
	 */
	const draw = function () {
		if (isReady()) {
			// drawShadow();
			drawSprite();
		}
		return this;
	};

	/**
	 * Updates the sprite animation based on the timestamp.
	 * @param {number} time - The timestamp when this function is called.
	 * @returns {Sprite} The current Sprite object for method chaining.
	 */
	const update = function (time) {
		if (lastUpdate === 0) lastUpdate = time;

		// Move to the next sprite when the timing is right.
		if (time - lastUpdate > sequence.timing) {
			if (index < sequence.count - 1) {
				index++;
			} else if (sequence.loop) {
				index = 0;
			}
			lastUpdate = time;
		}

		return this;
	};

	return {
		useSheet: useSheet,
		getXY: getXY,
		getXYCanvas: getXYCanvas,
		setXY: setXY,
		setSequence: setSequence,
		getSequence: getSequence,
		setScale: setScale,
		setShadowScale: setShadowScale,
		getDisplaySize: getDisplaySize,
		getBoundingBox: getBoundingBox,
		isReady: isReady,
		draw: draw,
		update: update,
		setFlipped: setFlipped,
		setAlongX: setAlongX
	};
};

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
		this.health = 100;

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

	setHealth(health) {
		this.health = health;
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
			case 'misc':
				this.sprite.setSequence(this.sequences.misc);
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

	getText() {
		return this.name + (this.health > 0 ? ' [' + Math.floor(this.health) + ']' : '');
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
			this.getText(),
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

	getText() {
		return this.health > 0 ? '[' + Math.floor(this.health) + ']' : '';
	}
}

/**
 * Creates a player character.
 * @param {CanvasRenderingContext2D} ctx - A canvas rendering context for drawing.
 * @param {number} x - The initial x position of the entity.
 * @param {number} y - The initial y position of the entity.
 * @param {string} spritesheet - The source of the entity sprite sheet (URL).
 * @property {function(): Sprite} sprite - Gets the sprite of the entity.
 * @property {function(): void} draw - Draws the entity on the canvas.
 * @property {function(number): void} update - Updates the entity's position and animation.
 * @returns {Collectible} A collectible object
 */
class Collectible {
	constructor(ctx, x, y, spritesheet) {
		this.ctx = ctx;
		this.spritesheet = spritesheet;

		/**
		 * This is the sprite sequences of the player facing different directions.
		 * It contains the idling sprite sequences `idleLeft`, `idleUp`, `idleRight` and `idleDown`,
		 * and the moving sprite sequences `moveLeft`, `moveUp`, `moveRight` and `moveDown`.
		 *
		 * @typedef {Object} AnimationSequences
		 * */
		this.sequences = {
			default: { x: 0, y: 128, width: 128, height: 128, count: 6, timing: 200, loop: true }
		};

		/**
		 * This is the sprite object of the player created from the Sprite module.
		 * @type {Sprite} The sprite object of the player.
		 */
		this.sprite = Sprite(this.ctx, x, y);

		// The sprite object is configured for the player sprite here.
		this.sprite
			.setSequence(this.sequences.default)
			.setScale(1)
			.setShadowScale({ x: 0.25, y: 0.2 })
			.useSheet(this.spritesheet);
	}

	/**
	 * This function sets the position of the collectible.
	 * @param {number} x
	 * @param {number} y
	 */
	setPosition(x, y) {
		this.sprite.setXY(x, y);
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
	}
}

export { Sprite, Entity, Player, Enemy, Collectible };
