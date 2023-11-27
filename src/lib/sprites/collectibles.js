import CoinSpreadsheet from '$lib/images/items/coin.png';
import PotionsSpreadsheet from '$lib/images/items/potions.png';
import { Collectible } from '$lib/sprites/sprites.js';

/**
 * Creates a Samurai player character.
 * @param {CanvasRenderingContext2D} ctx - A canvas rendering context for drawing.
 * @param {number} x - The initial x position of the player.
 * @param {number} y - The initial y position of the player.
 * @returns {Coin} A coin object.
 */
class Coin extends Collectible {
	constructor(ctx, x, y) {
		super(ctx, x, y, CoinSpreadsheet);

		this.sequences = {
			default: { x: 0, y: 0, width: 170, height: 170, count: 6, timing: 200, loop: true}
		};

		this.sprite.setSequence(this.sequences.default).setScale(0.20);
	}
}

/**
 * Creates a Samurai player character.
 * @param {CanvasRenderingContext2D} ctx - A canvas rendering context for drawing.
 * @param {number} x - The initial x position of the player.
 * @param {number} y - The initial y position of the player.
 * @returns {Potion} A potion object.
 */
class Potion extends Collectible {
	constructor(ctx, x, y) {
		super(ctx, x, y, PotionsSpreadsheet);

		// The potion spritesheet is oriented along the y-axis.
		this.sprite.setAlongX(false);

		// Generate a random sprite from the spritesheet.
		// We have 15 different sprites along the y-axis.
		const sprite_y = Math.floor(Math.random() * 15) * 16;

		this.sequences = {
			default: { x: 3*16, y: sprite_y, width: 16, height: 16, count: 1, timing: 1, loop: false}
		};

		this.sprite.setSequence(this.sequences.default).setScale(1.5);
	}
}

export { Coin, Potion };
