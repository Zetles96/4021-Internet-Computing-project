<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import Cheats from './Cheats.svelte'; // TEMP
	import { io } from 'socket.io-client';
	import {
		Samurai,
		SamuraiArcher,
		SamuraiCommander,
	} from '$lib/javascript/players.js';
	import {
		RedWerewolf,
		BlackWerewolf,
		WhiteWerewolf,
		Yurei,
		Gotoku,
		Onre
	} from '$lib/javascript/enemies.js';
	// Ignore this error
	import { Entity } from '$lib/javascript/sprites.js';

	import GrassTile from '$lib/images/grasstile.png';
	import GameOver from './GameOver.svelte';

	const socket = io('http://localhost:8000');

	socket.emit('joinRoom', 'room1');

	socket.on('eventFromServer', (data) => {
		console.log(data);
	});

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
	 * The game state
	 * @typedef {{status: string, message: string, game_objects: {[key: string]: {name: string, position: number[], sprite: string, health: number, animation: string, direction: string}}}} GameState
	 */

	/**
	 * The raw gamestate from the server
	 * @type {GameState}
	 */
	let gameState = { status: 'loading', message: 'Loading game...', game_objects: {} };

	/**
	 * Dictionary of all game objects with key being ID and value being the object
	 * @type {{[key: string]: Entity}}
	 */
	let gameStateEntities = {};

	// TODO: fetch this from server
	let playerID = 'player1';

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
		// console.debug('Sending player action: ', action);
	}

	// TODO: fetch this from server
	/**
	 * Get the game state from the server
	 * @returns {GameState}
	 */
	function getServerGameState() {
		return {
			status: 'playing',
			message: '2:00 left!',
			game_objects: {
				player1: {
					name: 'player1',
					position: player_pos,
					sprite: 'samurai',
					health: 100,
					animation: 'walk',
					direction: 'left'
				},
				player2: {
					name: 'player2',
					position: [100, 100],
					sprite: 'samuraiarcher',
					health: 100,
					animation: 'idle',
					direction: 'right'
				},
				player3: {
					name: 'player3',
					position: [200, 0],
					sprite: 'samuraicommander',
					health: 100,
					animation: 'idle',
					direction: 'left'
				},
				enemy1: {
					name: 'enemy1',
					position: [300, 150],
					sprite: 'whitewerewolf',
					health: 50,
					animation: 'idle',
					direction: 'right'
				},
				enemy2: {
					name: 'enemy2',
					position: [-200, -250],
					sprite: 'redwerewolf',
					health: 80,
					animation: 'run',
					direction: 'right'
				}
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
			gameState = getServerGameState();
			for (const [id, entity] of Object.entries(gameState.game_objects)) {
				if (!gameStateEntities[id]) {
					console.debug(
						'No game state object for id: ',
						id + ' - trying to create it...'
					);
					switch (entity.sprite) {
						case 'samurai':
							gameStateEntities[id] = new Samurai(
								ctx,
								entity.position[0],
								entity.position[1],
								entity.name
							);
							break;
						case 'samuraiarcher':
							gameStateEntities[id] = new SamuraiArcher(
								ctx,
								entity.position[0],
								entity.position[1],
								entity.name
							);
							break;
						case 'samuraicommander':
							gameStateEntities[id] = new SamuraiCommander(
								ctx,
								entity.position[0],
								entity.position[1],
								entity.name
							);
							break;
						case 'redwerewolf':
							gameStateEntities[id] = new RedWerewolf(
								ctx,
								entity.position[0],
								entity.position[1]
							);
							break;
						case 'blackwerewolf':
							gameStateEntities[id] = new BlackWerewolf(
								ctx,
								entity.position[0],
								entity.position[1]
							);
							break;
						case 'whitewerewolf':
							gameStateEntities[id] = new WhiteWerewolf(
								ctx,
								entity.position[0],
								entity.position[1]
							);
							break;
						case 'yurei':
							gameStateEntities[id] = new Yurei(
								ctx,
								entity.position[0],
								entity.position[1]
							);
							break;
						case 'gotoku':
							gameStateEntities[id] = new Gotoku(
								ctx,
								entity.position[0],
								entity.position[1]
							);
							break;
						case 'onre':
							gameStateEntities[id] = new Onre(
								ctx,
								entity.position[0],
								entity.position[1]
							);
							break;
						default:
							console.error('Unknown sprite type: ', entity.sprite);
					}

					// Check again if the game state object was created
					if (!gameStateEntities[id]) {
						console.error('Failed to create game state object for id: ', id);
						continue;
					}
				}

				if (id === playerID) {
					player_pos[0] = entity.position[0];
					player_pos[1] = entity.position[1];

					// Ensure the player game object is at the last index of the game state array
					// such that it is drawn on top of all other game objects
					const playerGameObject = gameStateEntities[id];
					delete gameStateEntities[id];
					gameStateEntities[id] = playerGameObject;
				}

				gameStateEntities[id].setPosition(entity.position[0], entity.position[1]);
				// animations might be given as strings like 'animation_direction', so we have to split them
				const animation = entity.animation.split('_');
				gameStateEntities[id].setAnimation(animation[0], entity.direction ? entity.direction : animation[1]);
			}

			// Adjust all game state objects' locations to be fixed around the player
			for (const [id, gameObject] of Object.entries(gameStateEntities)) {
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
		if (!showCheats) { // if cheats page is not open
			e.stopPropagation();

			// console.debug('Key pressed: ', e.key);
			currentKeysMap[e.key] = e.type === 'keydown';
			// console.debug("Keys pressed: ", currentKeysMap);

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
				sendPlayerAction('move_down_right');
				player_pos[0] += player_move_distance;
			}
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
			for (const [id, gameObject] of Object.entries(gameStateEntities)) {
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

			// console.debug('GameState: ', gameStateEntities);

			// console.debug('Drawing with player position: ', player_pos);

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
	<div class='overlay w-screen h-screen flex flex-col items-center p-3'>
		<p class='status'>{gameState.message}</p>
		{#if showCheats}
			<Cheats on:close={() => showCheats = false} />
		{:else if gameState.status === 'game_over'}
			<GameOver
				on:close={toMenu}
				on:playAgain={toMenu}
			/>
		{/if}
		<!-- <button class='backbutton' on:click={toMenu}>Back to Menu</button> -->
		<!--		<button class='gameOver' on:click={toGameOver}>Game Over</button>-->
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
