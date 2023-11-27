<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import Cheats from './Cheats.svelte';
	import { io } from 'socket.io-client';
	import { Samurai, SamuraiArcher, SamuraiCommander } from '$lib/sprites/players.js';
	import {
		RedWerewolf,
		BlackWerewolf,
		WhiteWerewolf,
		Yurei,
		Gotoku,
		Onre
	} from '$lib/sprites/enemies.js';
	import { Coin, Potion } from '$lib/sprites/collectibles.js';
	// Ignore this error
	import { Entity, Collectible } from '$lib/sprites/sprites.js';

	import GrassTile from '$lib/images/grasstile.png';
	import GameOver from './GameOver.svelte';

	// jwt token from cookies
	/**
	 * @type {string | null | undefined}
	 */
	export let token;
	/**
	 * @type {{username: string, iat: number, exp: number}}
	 */
	export let user;

	const socket = io('http://localhost:8000', {
		query: { token }
	});

	socket.on('message', (data) => {
		console.debug('message: ', data);
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
	 * @typedef {{status: string, message: string, game_objects: {[key: string]: {name: string, position: number[], score: number, sprite: string, health: number, animation: string, direction: string}}}} GameState
	 */

	/**
	 * The raw gamestate from the server
	 * @type {GameState}
	 */
	let gameState = { status: 'loading', message: 'Loading game...', game_objects: {} };

	socket.on('gameState', (data) => {
		// console.debug('Received gamestate from ws: ', data);
		gameState = data;
	});

	// On initial load, join the game
	socket.emit('joinGame');

	/**
	 * Dictionary of all game objects with key being ID and value being the object
	 * @type {{[key: string]: Entity | Collectible}}
	 */
	let gameStateEntities = {};

	let gameID = 'game1';
	let playerID = 'player1';
	socket.on('joined', (data) => {
		console.debug('Joined game: ', data);
		playerID = data.player_id;
	});
	socket.on('joinedGameId', (gameId) => {
		console.debug('Game id: ', gameId);
		gameID = gameId;
	});
	let playerIsDead = false;
	let pressEscape = false;
	function playAgain() {
		if (socket.disconnected) {
			socket.connect();
		}

		if (gameID !== 'game1') {
			socket.emit('leave', gameID);
		}

		gameState = { status: 'loading', message: 'Loading game...', game_objects: {} };
		gameStateEntities = {};
		playerIsDead = false;
		pressEscape = false;

		socket.emit('joinGame');
	}

	let isPlaying = false;
	let showCheats = false;

	// Make canvasimagesource from grass tile image string
	const grassTile = new Image();
	grassTile.src = GrassTile;

	// Create background music
	const background_music = new Audio('/src/lib/sounds/background_music.mp3');
	// Create player sound effects
	const player_walk = new Audio('/src/lib/sounds/human/human-walking.mp3');
	const player_hurt = new Audio('/src/lib/sounds/human/human-hurt.mp3');
	const player_dead = new Audio('/src/lib/sounds/human/human-scream1.mp3');
	const player_attack = new Audio('/src/lib/sounds/effects/swoosh6.mp3');
	player_walk.loop = true;

	const werewolf_dead = new Audio('/src/lib/sounds/wolf/wolf-howl.mp3');
	const yurei_dead = new Audio('/src/lib/sounds/monsters/monster-screech4.mp3');
	const gotoku_dead = new Audio('/src/lib/sounds/monsters/monster_screech6.mp3');
	const onre_dead = new Audio('/src/lib/sounds/monsters/monster-screech1.mp3');

	const werewolf_attack = new Audio('/src/lib/sounds/effects/swoosh1.mp3');
	const yurei_attack = new Audio('/src/lib/sounds/effects/woosh6.mp3');
	const gotoku_attack = new Audio('/src/lib/sounds/effects/woosh5.mp3');
	const onre_attack = new Audio('/src/lib/sounds/effects/woosh2.mp3');

	const collect_coin = new Audio('/src/lib/sounds/items/coin.mp3');
	const collect_potion = new Audio('/src/lib/sounds/items/potion.mp3');

	// player is attacking
	socket.on('player_attack', () => {
		player_attack.volume = 0.5;
		player_attack.play();
	});
	// player died
	socket.on('player_dead', () => {
		player_dead.play();
	});
	// monster is attacking + player is attacked
	socket.on('monster_attack', (monster) => {
		player_hurt.play();
		switch (monster) {
			case 'redwerewolf':
			case 'whitewerewolf':
			case 'blackwerewolf':
				werewolf_attack.playbackRate = 1.5;
				werewolf_attack.play();
				break;
			case 'yurei':
				yurei_attack.playbackRate = 1.5;
				yurei_attack.play();
				break;
			case 'gotoku':
				gotoku_attack.playbackRate = 2;
				gotoku_attack.play();
				break;
			case 'onre':
				onre_attack.playbackRate = 1.5;
				onre_attack.play();
				break;
			default:
				break;
		}
	});
	// monster died
	socket.on('enemy_died', (monster) => {
		switch (monster) {
			case 'redwerewolf' || 'whitewerewolf' || 'blackwerewolf':
				werewolf_dead.play();
				break;
			case 'yurei':
				yurei_dead.play();
				break;
			case 'gotoku':
				gotoku_dead.play();
				break;
			case 'onre':
				onre_dead.play();
				break;
			default:
				break;
		}
	});
	// collected collectable (coin or potion)
	socket.on('collected', (type) => {
		switch (type) {
			case 'coin':
				collect_coin.play();
				break;
			case 'potion':
				collect_potion.play();
				break;
			default:
				break;
		}
	});

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
		if (gameID !== 'game1') {
			socket.emit('leave', gameID);
		}

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
		console.debug('Sending player action: ', action);
		socket.emit('input', action);
	}

	/**
	 * Update the game state from the server
	 * @param {CanvasRenderingContext2D} ctx
	 */
	function updateGameState(ctx) {
		if (ctx) {
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
						case 'coin':
							gameStateEntities[id] = new Coin(
								ctx,
								entity.position[0],
								entity.position[1]
							);
							break;
						case 'potion':
							gameStateEntities[id] = new Potion(
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

				if (id === playerID || entity.name === user.username) {
					player_pos[0] = entity.position[0];
					player_pos[1] = entity.position[1];

					if (entity.health <= 0 && !playerIsDead) {
						playerIsDead = true;
						player_dead.play();
					}

					// Ensure the player game object is at the last index of the game state array
					// such that it is drawn on top of all other game objects
					const playerGameObject = gameStateEntities[id];
					delete gameStateEntities[id];
					gameStateEntities[id] = playerGameObject;
				}

				gameStateEntities[id].setPosition(entity.position[0], entity.position[1]);
				if (gameStateEntities[id] instanceof Entity) {
					gameStateEntities[id].setHealth(entity.health);
					// animations might be given as strings like 'animation_direction', so we have to split them
					const animation = entity.animation.split('_');
					gameStateEntities[id].setAnimation(
						animation[0],
						entity.direction ? entity.direction : animation[1]
					);
				}
			}

			// Adjust all game state objects' locations to be fixed around the player
			for (const [id, gameObject] of Object.entries(gameStateEntities)) {
				// Check if the game state entity exists in the game state
				if (!gameState.game_objects[id]) {
					console.debug(
						'Game state object for id: ',
						id + ' does not exist in game state anymore - deleting it...'
					);
					delete gameStateEntities[id];
					continue;
				}

				// Update the game state object's position
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
		if (!showCheats) {
			// if cheats page is not open
			e.stopPropagation();

			// console.debug('Key pressed: ', e.key);
			currentKeysMap[e.key] = e.type === 'keydown';
			// console.debug("Keys pressed: ", currentKeysMap, e.type);

			if (currentKeysMap['Escape']) {
				pressEscape = true;
				isPlaying = false;
			} else if (currentKeysMap['c']) {
				// open cheats page
				showCheats = true;
				// clear the key presses (keyup doesn't trigger when cheat page opens?)
				Object.keys(currentKeysMap).forEach((key) => delete currentKeysMap[key]);
			}
			if (currentKeysMap[' ']) {
				sendPlayerAction('attack');
			}
			// Movement
			const player_move_distance = 5;
			if (currentKeysMap['ArrowUp'] || currentKeysMap['w'] || currentKeysMap['W']) {
				// If up and left
				if (currentKeysMap['ArrowLeft'] || currentKeysMap['a'] || currentKeysMap['A']) {
					sendPlayerAction('move_up_left');
					player_walk.play();
				}
				// If up and right
				else if (
					currentKeysMap['ArrowRight'] ||
					currentKeysMap['d'] ||
					currentKeysMap['D']
				) {
					sendPlayerAction('move_up_right');
					player_walk.play();
				} else {
					sendPlayerAction('move_up');
					player_walk.play();
				}
			} else if (currentKeysMap['ArrowDown'] || currentKeysMap['s'] || currentKeysMap['S']) {
				if (currentKeysMap['ArrowLeft'] || currentKeysMap['a'] || currentKeysMap['A']) {
					sendPlayerAction('move_down_left');
				} else if (
					currentKeysMap['ArrowRight'] ||
					currentKeysMap['d'] ||
					currentKeysMap['D']
				) {
					player_walk.play();
					sendPlayerAction('move_down_right');
					player_walk.play();
				} else {
					sendPlayerAction('move_down');
					player_walk.play();
				}
			} else if (currentKeysMap['ArrowLeft'] || currentKeysMap['a'] || currentKeysMap['A']) {
				sendPlayerAction('move_left');
				player_walk.play();
			} else if (currentKeysMap['ArrowRight'] || currentKeysMap['d'] || currentKeysMap['D']) {
				sendPlayerAction('move_right');
				player_walk.play();
			}
			if (e.type === 'keyup') {
				// disable player walk noise when stop
				player_walk.pause();
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

		// play background music
		background_music.currentTime = 2.5; // start at 2.5s
		background_music.loop = true; // loop endlessly
		background_music.volume = 0.5; // lower volume
		background_music.play();

		return () => {
			background_music.pause();
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
					// console.debug("Drawing grass tile at: ", [x, y]);
					ctx.drawImage(grassTile, x, y, w, h);

					if (y === y_mod) {
						// console.debug("y === player_pos[1] % canvas.height", y, y_mod);
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
	<div class="gamecontainer w-screen h-screen">
		<canvas bind:this={canvas} />
	</div>
	<div class="overlay w-screen h-screen flex flex-col items-center p-3">
		<p class="status">{gameState.message}</p>
		{#if showCheats}
			<Cheats
				on:close={() => (showCheats = false)}
				on:useCheat={(e) => sendPlayerAction('cheat_' + e.detail.cheat)}
			/>
		{:else if gameState.status === 'ended' || playerIsDead || pressEscape}
			<GameOver {gameState} on:close={toMenu} on:playAgain={playAgain} />
		{/if}
		<!-- <button class='backbutton' on:click={toMenu}>Back to Menu</button> -->
		<!--		<button class='gameOver' on:click={toGameOver}>Game Over</button>-->
		<!-- <button class='cheats' on:click={() => showCheats = true}>Cheats</button> -->
	</div>
</div>

<style lang="postcss">
	.overlay {
		position: absolute;
		right: 0;
		top: 0;
	}
</style>
