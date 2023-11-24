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
 * @returns {Sprite} Returns a Sprite object.
 */
const Sprite = function(ctx, x, y) {

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
	const useSheet = function(spriteSheet) {
		sheet.src = spriteSheet;
		return this;
	};

	/**
	 * Gets the current position of the sprite.
	 * @returns {{x: number, y: number}} The current position of the sprite.
	 */
	const getXY = function() {
		return { x, y };
	};

	/**
	 * Gets the current position of the sprite.
	 * @returns {{x: number, y: number}} The current position of the sprite.
	 */
	const getXYCanvas = function() {
		return { x: x + ctx.canvas.width / 2, y: y + ctx.canvas.height / 2 };
	};

	/**
	 * Sets the position of the sprite.
	 * @param {number} xvalue - The new x position.
	 * @param {number} yvalue - The new y position.
	 * @returns {Sprite} The current Sprite object for method chaining.
	 */
	const setXY = function(xvalue, yvalue) {
		[x, y] = [xvalue, yvalue];
		return this;
	};

	/**
	 * Sets the flipped state of the sprite.
	 * @param {boolean} value - The new flipped state.
	 * @returns {Sprite}
	 */
	const setFlipped = function(value) {
		flipped = value;
		return this;
	};

	/**
	 * Sets the sprite sequence.
	 * @param {{x: number, y: number, width: number, height: number, count: number, timing: number, loop: boolean}} newSequence - The new sprite sequence to be used by the sprite.
	 * @returns {Sprite} The current Sprite object for method chaining.
	 */
	const setSequence = function(newSequence) {
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
	const getSequence = function() {
		return sequence;
	};

	/**
	 * Sets the scaling factor of the sprite.
	 * @param {number} value - The new scaling factor.
	 * @returns {Sprite} The current Sprite object for method chaining.
	 */
	const setScale = function(value) {
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
	const setShadowScale = function(value) {
		shadowScale = value;
		return this;
	};

	/**
	 * Gets the display size of the sprite.
	 * @returns {{width: number, height: number}} The display size of the sprite.
	 */
	const getDisplaySize = function() {
		/* Find the scaled width and height of the sprite */
		const scaledWidth = sequence.width * scale;
		const scaledHeight = sequence.height * scale;
		return { width: scaledWidth, height: scaledHeight };
	};

	/**
	 * Gets the bounding box of the sprite.
	 * @returns {BoundingBox} The bounding box of the sprite.
	 */
	const getBoundingBox = function() {
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
	const isReady = function() {
		return sheet.complete && sheet.naturalHeight !== 0;
	};

	/**
	 * Draws shadow underneath the sprite.
	 * @returns {void}
	 */
	const drawShadow = function() {
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
		ctx.ellipse(pos.x, pos.y + size.height / 2,
			shadowWidth / 2, shadowHeight / 2, 0, 0, 2 * Math.PI);
		ctx.fill();

		/* Restore saved settings */
		ctx.restore();
	};

	/**
	 * Draws the sprite.
	 * @returns {void}
	 */
	const drawSprite = function() {
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
		ctx.drawImage(sheet, sequence.x + index * sequence.width, sequence.y, sequence.width, sequence.height, pos.x - size.width / 2, pos.y - size.height / 2, size.width, size.height);

		/* Restore saved settings */
		ctx.restore();
	};

	/**
	 * Draws the shadow and the sprite.
	 * @returns {Sprite} The current Sprite object for method chaining.
	 */
	const draw = function() {
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
	const update = function(time) {
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
		setFlipped: setFlipped
	};
};

export default Sprite;