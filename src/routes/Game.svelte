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
		if (e.key === 'Escape') {
			toMenu();
		}
		// TODO: this crashes the game, for some reason, gotta fix
		// if (e.key === 'ArrowUp') {
		// 	player_pos[1] -= 16;
		// 	draw();
		// }
		// if (e.key === 'ArrowDown') {
		// 	player_pos[1] += 16;
		// 	draw();
		// }
		// if (e.key === 'ArrowLeft') {
		// 	player_pos[0] -= 16;
		// 	draw();
		// }
		// if (e.key === 'ArrowRight') {
		// 	player_pos[0] += 16;
		// 	draw();
		// }
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
		draw();

		// Add event listener for keydown
		window.addEventListener('keydown', handleKeydown);
	}

	function drawCharacter() {
		if (ctx) {
			const player = new Image();
			player.src = Player;

			player.onload = () => {
				if (!ctx) return;
				ctx.drawImage(player, 0, 0, 128, 128, canvas.width/2 - 128 / 2, canvas.height/2 - 128 / 2, 128, 128);
			}
		}
	}


	function draw() {
		if(ctx) {
			console.log("Drawing with player position: ", player_pos);

			// Make canvasimagesource from grass tile image string
			const grassTile = new Image();
			grassTile.src = GrassTile;

			// Only use the image after it's loaded
			grassTile.onload = () => {
				if (!ctx) return;
				// https://stackoverflow.com/a/17247032/12418245
				let w = 32;
				let h = 32;

				let x = player_pos[0] % canvas.width;
				let y = player_pos[1] % canvas.height;

				// the following line needs to exist, otherwise the canvas will be blank until
				// player position, for some reason..?
				ctx.drawImage(grassTile, 0, 0, w, h);
				// console.clear();
				// console.log(x, y);
				ctx.drawImage(grassTile, x, y, w, h);
				x += w;
				x = x % canvas.width;
				y += h;
				y = y % canvas.height;

				while (x !== (player_pos[0] % canvas.width)) {
					// console.log(x, y);
					while (y !== (player_pos[1] % canvas.height)) {
						ctx.drawImage(grassTile, x, y, w, h);
						y += h;
						y = y % canvas.height;
					}
					x += w;
					x = x % canvas.width;
				}

				//draw once
				ctx.drawImage(grassTile, player_pos[0], player_pos[1], w, h);

				while (w < canvas.width) {
					ctx.drawImage(canvas, w, 0);
					w <<= 1;  // shift left 1 = *2 but slightly faster
				}
				while (h < canvas.height) {
					ctx.drawImage(canvas, 0, h);
					h <<= 1;
				}

				// // Fill background with grasstile
				// const pattern = context.createPattern(grassTile, "repeat");
				// if (!pattern) {
				// 	console.log('pattern is null');
				// 	return;
				// }
				// context.fillStyle = pattern;
				// context.fillRect(0, 0, canvas.width, canvas.height);

				// Draw the character
				drawCharacter();
			};
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