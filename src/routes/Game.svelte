<script>
	import { createEventDispatcher, onMount } from 'svelte';

	// import grass tile from lib
	import GrassTile from '$lib/images/grasstile.png';
	import Player from '$lib/images/Samurai/Walk.png';


	const dispatch = createEventDispatcher();

	/**
	 * @type {HTMLCanvasElement}
	 */
	let canvas;
	/**
	 * @type {CanvasRenderingContext2D | null}
	 */
	let ctx;

	const player_pos = [0, 0];

	// Make canvasimagesource from grass tile image string
	const grassTile = new Image();
	grassTile.src = GrassTile;

	// Player image
	const player = new Image();
	player.src = Player;

	/**
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

	const resizeCanvas = () => {
		if (ctx) {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			draw();
		}
	};

	/**
	 * @param {KeyboardEvent} e
	 */
	const handleKeydown = (e) => {
		console.log("Key pressed: ", e.key);
		if (e.key === 'Escape') {
			toMenu();
		}
		if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') {
			player_pos[1] -= 16;
			draw();
		}
		if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') {
			player_pos[1] += 16;
			draw();
		}
		if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
			player_pos[0] -= 16;
			draw();
		}
		if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
			player_pos[0] += 16;
			draw();
		}
	};


	// onmount set canvas size
	onMount(() => {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		ctx = canvas.getContext("2d");

		// Add event listener for resize
		window.addEventListener('resize', resizeCanvas);

		return () => {
			window.removeEventListener('resize', resizeCanvas);
			// Remove event listener for keydown
			window.removeEventListener('keydown', handleKeydown);
		}
	});

	$ : if(ctx) {
		ctx.imageSmoothingEnabled = false;

		// Only use the images after they are loaded
		grassTile.onload = () => {
			draw();

			// Add event listener for keydown
			window.addEventListener('keydown', handleKeydown);
		};
	}

	function drawCharacter() {
		if (ctx) {
			if (player.complete) {
				ctx.drawImage(player, 0, 0, 128, 128, canvas.width/2 - 128 / 2, canvas.height/2 - 128 / 2, 128, 128);
			}
			else {
				player.onload = () => {
					drawCharacter();
				}
			}
		}
	}


	function draw() {
		if(ctx && grassTile.complete) {
			// console.clear();

			console.log("Drawing with player position: ", player_pos);

			ctx.clearRect(0, 0, canvas.width, canvas.height);

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

			// Draw the character
			drawCharacter();
		}
	}
</script>

<div>
	<div class='gamecontainer w-screen h-screen'>
		<canvas bind:this={canvas}></canvas>
	</div>
	<div class='overlay w-screen h-screen flex flex-col justify-between items-center p-3'>
		<p class='status'>Playing...</p>
		<button class='backbutton' on:click={toMenu}>Back to Menu</button>
	</div>
</div>

<style lang='postcss'>
	.overlay {
		position: absolute;
		right: 0;
		top: 0;
	}
</style>