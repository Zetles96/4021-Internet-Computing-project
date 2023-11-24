<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import { Player } from './sprites.js';
	import Cheats from './Cheats.svelte'; // TEMP

	// import grass tile from lib
	import GrassTile from '$lib/images/grasstile.png';
	import SamuraiSpritesheet from '$lib/images/Samurai/Spritesheet.png';

	const dispatch = createEventDispatcher();

	/**
	 * @type {HTMLCanvasElement}
	 */
	let canvas;
	/**
	 * @type {CanvasRenderingContext2D | null}
	 */
	let ctx;

	/**
	 * @type {Player | null}
	 */
	let player;

	const player_pos = [0, 0];

	let isPlaying = false;
	let showCheats = false; // TEMP

	// Make canvasimagesource from grass tile image string
	const grassTile = new Image();
	grassTile.src = GrassTile;

	/**
	 * For some reason JavaScript makes negative input negative output for modulo...
	 * https://stackoverflow.com/a/17323608/12418245
	 * @param {number} n
	 * @param {number} m
	 * @returns {number}
	 */
	function mod(n, m) {
		return ((n % m) + m) % m;
	}

	function toMenu() {
		dispatch('back');
	}

	function toGameOver() { 
		dispatch('gameover');
	}

	const resizeCanvas = () => {
		if (ctx) {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			requestAnimationFrame(draw);
		}
	};

	/**
	 * @type {{[key: string]: boolean}}
	 */
	const currentKeysMap = {};

	/**
	 * Keymap idea is taken from https://stackoverflow.com/a/12444641/12418245
	 * @param {KeyboardEvent} e
	 */
	const handleKeys = (e) => {
	
		if (!showCheats) { // if cheats page is not open
			e.stopPropagation();

			console.log("Key pressed: ", e.key);
			currentKeysMap[e.key] = e.type === 'keydown';
			// console.log("Keys pressed: ", currentKeysMap);

			// TODO: replace these with calls to backend of current player action
			if (currentKeysMap['Escape']) {
				isPlaying = false;
				toMenu();
			} else if (currentKeysMap['c']) { // open cheats page
				showCheats = true;
				// clear the key presses (keyup doesn't trigger when cheat page opens?)
				Object.keys(currentKeysMap).forEach(key => delete currentKeysMap[key]);
			}

			// Movement
			const player_move_distance = 5;
			if (currentKeysMap['ArrowUp'] || currentKeysMap['w'] || currentKeysMap['W']) {
				player_pos[1] -= player_move_distance;
				// If up and left
				if (currentKeysMap['ArrowLeft'] || currentKeysMap['a'] || currentKeysMap['A']) {
					if (player) player.move(1);
					player_pos[0] -= player_move_distance;
				}
				// If up and right
				else if (currentKeysMap['ArrowRight'] || currentKeysMap['d'] || currentKeysMap['D']) {
					if (player) player.move(3);
					player_pos[0] += player_move_distance;
				}
				else {
					if (player) player.move(2);
				}
			}
			else if (currentKeysMap['ArrowDown'] || currentKeysMap['s'] || currentKeysMap['S']) {
				player_pos[1] += player_move_distance;
				if (currentKeysMap['ArrowLeft'] || currentKeysMap['a'] || currentKeysMap['A']) {
					if (player) player.move(1);
					player_pos[0] -= player_move_distance;
				}
				else if (currentKeysMap['ArrowRight'] || currentKeysMap['d'] || currentKeysMap['D']) {
					if (player) player.move(3);
					player_pos[0] += player_move_distance;
				}
				else {
					if (player) player.move(4);
				}
			}
			else if (currentKeysMap['ArrowLeft'] || currentKeysMap['a'] || currentKeysMap['A']) {
				if (player) player.move(1);
				player_pos[0] -= player_move_distance;
			}
			else if (currentKeysMap['ArrowRight'] || currentKeysMap['d'] || currentKeysMap['D']) {
				if (player) player.move(3);
				player_pos[0] += player_move_distance;
			}
			else {
				if (player) player.move(0);
			}
		}
	};

	// When the component is mounted, set the canvas width and height
	onMount(() => {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		ctx = canvas.getContext("2d");

		// Add event listener for resize
		window.addEventListener('resize', resizeCanvas);

		// Keydown event listener is initialized in $: if(ctx) {}

		return () => {
			window.removeEventListener('resize', resizeCanvas);
			// Remove event listener for keydown
			window.removeEventListener('keydown', handleKeys);
			window.removeEventListener('keyup', handleKeys);
		}
	});

	$ : if(ctx) {
		ctx.imageSmoothingEnabled = false;

		player = Player(ctx, 0, 0, SamuraiSpritesheet);

		// Only use the images after they are loaded
		grassTile.onload = () => {
			// Start game
			isPlaying = true;
			requestAnimationFrame(draw);

			// Add event listener for keydown
			window.addEventListener('keydown', handleKeys);
			window.addEventListener('keyup', handleKeys);
		};
	}

	/**
	 * Draw the character
	 * @param {number} now The current timestamp
	 */
	function drawCharacter(now) {
		if (ctx && player) {
			player.setPosition(canvas.width/2, canvas.height/2)
			player.update(now);
			player.draw();
		}
	}

	/**
	 * Draw the background
	 */
	function drawBackground() {
		if(ctx && grassTile.complete) {
			// https://stackoverflow.com/a/17247032/12418245
			let w = 32;
			let h = 32;

			const x_mod = mod(player_pos[0], canvas.width);
			const y_mod = mod(player_pos[1], canvas.height);
			let x = x_mod+w;
			let y = y_mod+h;

			while (true) {
				y = y_mod+h;
				while (true) {
					// console.log("Drawing grass tile at: ", [x, y]);
					ctx.drawImage(grassTile, x, y, w, h);

					if (y === y_mod) {
						// console.log("y === player_pos[1] % canvas.height", y, y_mod);
						break;
					}
					else if (y+h > canvas.height) {
						// We have to calculate the new y to draw from beginning of canvas (or before)
						// and add height enough times to get to player_pos[1] % canvas.height
						y = y_mod - h * Math.ceil(y_mod / h);
					}
					else {
						y += h;
						y = mod(y, canvas.height);
					}
				}

				if (x === x_mod) {
					break;
				}
				else if (x+w > canvas.width) {
					// We have to calculate the new x to draw from beginning of canvas (or before)
					// and add width enough times to get to player_pos[0] % canvas.width
					x = x_mod - w * Math.ceil(x_mod / w);
				}
				else {
					x += w;
					x = mod(x, canvas.width);
				}
			}
		}
	}

	/**
	 * The main drawing of the game
	 * @param {number} now The current timestamp
	 */
	function draw(now) {
		if(ctx && canvas) {
			// console.clear();

			// console.log("Drawing with player position: ", player_pos);

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// Draw the background
			drawBackground();

			// Draw the character
			drawCharacter(now);

			// If still playing, draw again
			if (isPlaying) {
				requestAnimationFrame(draw);
			}
		}
	}
</script>

<div>
	<div class='gamecontainer w-screen h-screen'>
		<canvas bind:this={canvas}></canvas>
	</div>
	<div class='overlay w-screen h-screen flex flex-col items-center p-3'>
		<p class='status'>Playing...</p>
		{#if showCheats}
			<Cheats on:close={() => showCheats = false} />
		{/if}
		<!-- <button class='backbutton' on:click={toMenu}>Back to Menu</button> -->
		<button class='gameOver' on:click={toGameOver}>Game Over</button>
		<!-- <button class='cheats' on:click={() => showCheats = true}>Cheats</button> -->
	</div>
</div>

<style lang='postcss'>
	.overlay {
		position: absolute;
		right: 0;
		top: 0;
	}
</style>