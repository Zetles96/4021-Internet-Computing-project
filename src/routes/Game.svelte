<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import {
		Entity,
		Samurai,
		SamuraiArcher,
		SamuraiCommander,
		RedWerewolf,
		BlackWerewolf,
		WhiteWerewolf
	} from './sprites.js';

	import GrassTile from '$lib/images/grasstile.png';

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
	 * The player's current position - this is used to decide where to draw the canvas and other elements
	 */
	const player_pos = [0, 0];

	/**
	 * Dictionary of all game objects with key being ID and value being the object
	 * @type {{[key: string]: Entity}}
	 */
	let gameState = {};

	// TODO: fetch this from server
	let playerID = 'player1';

	let isPlaying = false;

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
	 * Send the player action to the backend
	 * @param {string} action
	 */
	function sendPlayerAction(action) {
		// TODO: replace these with calls to backend of current player action
		console.debug('Sending player action: ', action);
	}

	// TODO: fetch this from server
	function getServerGameState() {
		return {
			player1: {
				position: player_pos,
				sprite: 'samurai',
				health: 100,
				animation: 'walk_left'
			},
			player2: {
				position: [100, 100],
				sprite: 'samuraiarcher',
				health: 100,
				animation: 'idle'
			},
			player3: {
				position: [200, 0],
				sprite: 'samuraicommander',
				health: 100,
				animation: 'idle'
			},
			enemy1: {
				position: [300, 150],
				sprite: 'whitewerewolf',
				health: 50,
				animation: 'idle'
			},
			enemy2: {
				position: [-200, -250],
				sprite: 'redwerewolf',
				health: 80,
				animation: 'run_right'
			}
		};
	}

	/**
	 * Update the game state from the server
	 * @param {CanvasRenderingContext2D} ctx
	 */
	function updateGameState(ctx) {
		if (ctx) {
			// Update game state from server
			const serverGameState = getServerGameState();
			for (const [id, player] of Object.entries(serverGameState)) {
				if (!gameState[id]) {
					console.debug(
						'No game state object for id: ',
						id + ' - trying to create it...'
					);
					switch (player.sprite) {
						case 'samurai':
							gameState[id] = new Samurai(
								ctx,
								player.position[0],
								player.position[1],
								id
							);
							break;
						case 'samuraiarcher':
							gameState[id] = new SamuraiArcher(
								ctx,
								player.position[0],
								player.position[1],
								id
							);
							break;
						case 'samuraicommander':
							gameState[id] = new SamuraiCommander(
								ctx,
								player.position[0],
								player.position[1],
								id
							);
							break;
						case 'redwerewolf':
							gameState[id] = new RedWerewolf(
								ctx,
								player.position[0],
								player.position[1],
								id
							);
							break;
						case 'blackwerewolf':
							gameState[id] = new BlackWerewolf(
								ctx,
								player.position[0],
								player.position[1],
								id
							);
							break;
						case 'whitewerewolf':
							gameState[id] = new WhiteWerewolf(
								ctx,
								player.position[0],
								player.position[1],
								id
							);
							break;
						default:
							console.error('Unknown sprite type: ', player.sprite);
					}

					// Check again if the game state object was created
					if (!gameState[id]) {
						console.error('Failed to create game state object for id: ', id);
						continue;
					}
				}

				if (id === playerID) {
					player_pos[0] = player.position[0];
					player_pos[1] = player.position[1];

					// Ensure the player game object is at the last index of the game state array
					// such that it is drawn on top of all other game objects
					const playerGameObject = gameState[id];
					delete gameState[id];
					gameState[id] = playerGameObject;
				}

				gameState[id].setPosition(player.position[0], player.position[1]);
				// animations are given as strings like 'animation_direction', so we have to split them
				const animation = player.animation.split('_');
				gameState[id].setAnimation(animation[0], animation[1]);
			}

			// Adjust all game state objects' locations to be fixed around the player
			for (const [id, gameObject] of Object.entries(gameState)) {
				const obj_pos = gameObject.sprite.getXY();
				if (obj_pos && player_pos) {
					gameObject.sprite.setXY(obj_pos.x - player_pos[0], obj_pos.y - player_pos[1]);
				}
			}
		}
	}

	/**
	 * @type {{[key: string]: boolean}}
	 */
	const currentKeysMap = {};

	/**
	 * Keymap idea is taken from https://stackoverflow.com/a/12444641/12418245
	 * @param {KeyboardEvent} e
	 */
	const handleKeys = (e) => {
		console.debug('Key pressed: ', e.key);
		currentKeysMap[e.key] = e.type === 'keydown';
		console.debug('Keys pressed: ', currentKeysMap);

		if (e.key === 'Escape') {
			isPlaying = false;
			sendPlayerAction('stop');
			toMenu();
		}

		// Movement
		const player_move_distance = 5;
		if (currentKeysMap['ArrowUp'] || currentKeysMap['w'] || currentKeysMap['W']) {
			player_pos[1] -= player_move_distance;
			// If up and left
			if (currentKeysMap['ArrowLeft'] || currentKeysMap['a'] || currentKeysMap['A']) {
				sendPlayerAction('move_up_left');
				player_pos[0] -= player_move_distance;
			}
			// If up and right
			else if (currentKeysMap['ArrowRight'] || currentKeysMap['d'] || currentKeysMap['D']) {
				sendPlayerAction('move_up_right');
				player_pos[0] += player_move_distance;
			} else {
				sendPlayerAction('move_up');
			}
		} else if (currentKeysMap['ArrowDown'] || currentKeysMap['s'] || currentKeysMap['S']) {
			player_pos[1] += player_move_distance;
			if (currentKeysMap['ArrowLeft'] || currentKeysMap['a'] || currentKeysMap['A']) {
				sendPlayerAction('move_down_left');
				player_pos[0] -= player_move_distance;
			} else if (currentKeysMap['ArrowRight'] || currentKeysMap['d'] || currentKeysMap['D']) {
				sendPlayerAction('move_down_right');
				player_pos[0] += player_move_distance;
			} else {
				sendPlayerAction('move_down');
			}
		} else if (currentKeysMap['ArrowLeft'] || currentKeysMap['a'] || currentKeysMap['A']) {
			sendPlayerAction('move_left');
			player_pos[0] -= player_move_distance;
		} else if (currentKeysMap['ArrowRight'] || currentKeysMap['d'] || currentKeysMap['D']) {
			sendPlayerAction('move_right');
			player_pos[0] += player_move_distance;
		}
	};

	// When the component is mounted, set the canvas width and height
	onMount(() => {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		ctx = canvas.getContext('2d');

		// Add event listener for resize
		window.addEventListener('resize', resizeCanvas);

		// Keydown event listener is initialized in $: if(ctx) {}

		return () => {
			window.removeEventListener('resize', resizeCanvas);
			// Remove event listener for keydown
			window.removeEventListener('keydown', handleKeys);
			window.removeEventListener('keyup', handleKeys);
		};
	});

	$: if (ctx) {
		ctx.imageSmoothingEnabled = false;

		// Update game state
		updateGameState(ctx);

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
	function drawGameState(now) {
		if (ctx) {
			for (const [id, gameObject] of Object.entries(gameState)) {
				gameObject.update(now);
				gameObject.draw();
			}
		}
	}

	/**
	 * Draw the background
	 */
	function drawBackground() {
		if (ctx && grassTile.complete) {
			// https://stackoverflow.com/a/17247032/12418245
			let w = 32;
			let h = 32;

			const x_mod = mod(-player_pos[0], canvas.width);
			const y_mod = mod(-player_pos[1], canvas.height);
			let x = x_mod + w;
			let y = y_mod + h;

			while (true) {
				y = y_mod + h;
				while (true) {
					// console.log("Drawing grass tile at: ", [x, y]);
					ctx.drawImage(grassTile, x, y, w, h);

					if (y === y_mod) {
						// console.log("y === player_pos[1] % canvas.height", y, y_mod);
						break;
					} else if (y + h > canvas.height) {
						// We have to calculate the new y to draw from beginning of canvas (or before)
						// and add height enough times to get to player_pos[1] % canvas.height
						y = y_mod - h * Math.ceil(y_mod / h);
					} else {
						y += h;
						y = mod(y, canvas.height);
					}
				}

				if (x === x_mod) {
					break;
				} else if (x + w > canvas.width) {
					// We have to calculate the new x to draw from beginning of canvas (or before)
					// and add width enough times to get to player_pos[0] % canvas.width
					x = x_mod - w * Math.ceil(x_mod / w);
				} else {
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
		if (ctx && canvas) {
			// console.clear();

			// Update game state
			updateGameState(ctx);

			console.debug('GameState: ', gameState);

			console.debug('Drawing with player position: ', player_pos);

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// Draw the background
			drawBackground();

			// Draw the game state
			drawGameState(now);

			// If still playing, draw again
			if (isPlaying) {
				requestAnimationFrame(draw);
			}
		}
	}
</script>

<div>
	<div class='gamecontainer w-screen h-screen'>
		<canvas bind:this={canvas} />
	</div>
	<div class='overlay w-screen h-screen flex flex-col justify-between items-center p-3'>
		<p class='status'>Playing...</p>
		<!-- <button class='backbutton' on:click={toMenu}>Back to Menu</button> -->
		<button class='gameOver' on:click={toGameOver}>Game Over</button>
	</div>
</div>

<style lang='postcss'>
    .overlay {
        position: absolute;
        right: 0;
        top: 0;
    }
</style>
