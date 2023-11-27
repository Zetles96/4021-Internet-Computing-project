const TPS = 20;
const GAME_TIME = 60*2; // 2 minutes
const WAIT_TIME = 30;

const PLAYER_TYPES = ['samurai', 'samuraiarcher', 'samuraicommander'];
const ENEMY_TYPES = ['whitewerewolf', 'redwerewolf', 'blackwerewolf', 'gotoku', 'onre', 'yurei'];

class ServerEntity {
	constructor(id, x, y, type) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.type = type;
		this.animation = 'idle';
	}
}

class ServerInteractable extends ServerEntity {
	constructor(id, name, x, y, type) {
		super(id, x, y, type);
		this.name = name;
		this.maxHealth = 100;
		this.health = this.maxHealth;
		this.damage = 10;
		this.direction = { x: 0, y: 0 };
		this.lastAttack = Date.now();
		this.attackCooldown = 1000;
		this.range = 16;
		this.speed = 16;
	}
}

class ServerPlayer extends ServerInteractable {
	constructor(socket) {
		super(
			socket.id,
			socket.username,
			Math.floor(Math.random() * (50 - -50) + -50),
			Math.floor(Math.random() * (50 - -50) + -50),
			PLAYER_TYPES[Math.floor(Math.random() * PLAYER_TYPES.length)]
		);
		this.socket = socket;

		this.score = 0;

		this.doAttack = false;
		this.doMove = false;
		this.lastAction = Date.now();
		this.damage = 100 / 3;
		this.range = 64;
		this.attackCooldown = 300;

		this.socket.emit('joined', {
			id: this.socket.id,
			player_id: this.id
		});
	}

	update(enemies) {
		if (this.health <= 0) {
			this.animation = 'dead';
			return;
		}

		if (this.doMove) {
			this.doMove = false;
			this.animation = 'walk';
			this.x += this.direction.x * this.speed;
			this.y += this.direction.y * this.speed;
			this.lastAction = Date.now();
		}

		if (this.doAttack) {
			this.doAttack = false;
			this.animation = 'attack';
			this.lastAction = Date.now();

			// Attack every enemy in range
			enemies.forEach((e) => {
				e.health -= this.damage;
				if (e.health <= 0) {
					e.health = 0;
					e.animation = 'dead';
					this.score += e.worth;
				}
			});
		}

		if (Date.now() - this.lastAction > this.attackCooldown) {
			this.animation = 'idle';
		}
	}
}

class ServerEnemy extends ServerInteractable {
	constructor(x, y) {
		super(
			Math.random().toString(36).substring(7),
			'',
			x,
			y,
			ENEMY_TYPES[Math.floor(Math.random() * ENEMY_TYPES.length)]
		);

		switch (this.type) {
			case 'yurei':
			case 'onre':
			case 'gotoku':
				this.damage = 10;
				this.worth = 15;
				break;
			default:
				this.damage = 5;
				this.worth = 10;
				break;
		}
		this.simulation_distance = 300;
		// generate random speed between 2 and 8
		this.speed = Math.random() * (8 - 2) + 2;
	}

	/**
	 * Updates enemy, making it move and attack the player given.
	 * @param {ServerPlayer} player - The player to attack.
	 */
	update(player) {
		// if own health is 0, we don't do anything
		if (this.health <= 0) {
			this.animation = 'dead';
			return;
		}

		if (!player) {
			this.animation = 'idle';
			return;
		}

		const distance = Math.sqrt((this.x - player.x) ** 2 + (this.y - player.y) ** 2);

		// If we are outside of simulation distance, we don't do anything
		if (distance > this.simulation_distance) {
			this.animation = 'idle';
			return;
		}

		this.direction = { x: 0, y: 0 };
		if (this.x < player.x) {
			this.direction.x = 1;
		} else if (this.x > player.x) {
			this.direction.x = -1;
		}
		if (this.y < player.y) {
			this.direction.y = 1;
		} else if (this.y > player.y) {
			this.direction.y = -1;
		}

		// if we are within range, we attack
		if (distance < this.range) {
			this.animation = 'attack';
			const now = Date.now();

			// If we are within attack cooldown, we don't attack
			if (now - this.lastAttack < this.attackCooldown) {
				return;
			}

			this.lastAttack = now;
			player.health -= this.damage;
			if (player.health <= 0) {
				player.health = 0;
				player.animation = 'dead';
			}
			return;
		}

		// We move towards the player
		this.animation = 'walk';
		this.x += this.direction.x * this.speed;
		this.y += this.direction.y * this.speed;
	}
}

class ServerCollectible extends ServerEntity {
	constructor(x, y, type) {
		super(
			Math.random().toString(36).substring(7),
			x,
			y,
			type
		);

		this.animation = 'default';
		this.pickupRange = 32;
		this.used = false;
	}

	/**
	 * Handles the pickup of the collectible.
	 * @param {ServerPlayer} player - The player that picked up the collectible.
	 */
	doPickup(player) {}

	/**
	 * Updates the collectible based on closest player.
	 * @param player
	 */
	update(player) {
		if (this.used) return;
		if (!player) return;
		if (player.health <= 0) return;

		// Check if player is within pickup range
		const distance = Math.sqrt((this.x - player.x) ** 2 + (this.y - player.y) ** 2);
		if (distance < this.pickupRange) {
			this.used = true;
			this.doPickup(player);
		}
	}
}

class ServerCoin extends ServerCollectible {
	constructor(x, y) {
		super(x, y, 'coin');
		this.worth = 10;
	}

	doPickup(player) {
		player.score += this.worth;
	}
}

class ServerPotion extends ServerCollectible {
	constructor(x, y) {
		super(x, y, 'potion');
		this.health = 20;
	}

	doPickup(player) {
		player.health += this.health;
		if (player.health > player.maxHealth) {
			player.health = player.maxHealth;
		}
	}
}

export class Game {
	constructor(io) {
		this.id = Math.random().toString(36).substring(7);
		this.io = io;
		this.status = 'waiting';
		this.message = `Waiting for players: ${WAIT_TIME} seconds remaining`;
		/**
		 * @type {{[id: string]: ServerPlayer}}
		 */
		this.players = {};
		/**
		 * @type {ServerEnemy[]}
		 */
		this.enemies = [];
		/**
		 * @type {ServerCollectible[]}
		 */
		this.collectibles = [];
		this.startTime = Date.now();
		this.lastUpdateTime = this.startTime;

		this.spawn(3, 500, "enemy");
		this.spawn(10, 1000, "enemy");
		this.spawn(100, 5000, "enemy");
		// this.spawnEnemies(100, 10000);

		this.spawn(50, 2500, "coin");
		this.spawn(50, 2500, "potion");

		this.updateSchedule = setInterval(this.update.bind(this), 10);
	}

	spawn(amount, range, type="enemy") {
		for (let i = 0; i < amount; i++) {
			let x = 0;
			let y = 0;

			while (x < 50 && x > -50) {
				x = Math.floor(Math.random() * (range - -range) + -range);
			}
			while (y < 50 && y > -50) {
				y = Math.floor(Math.random() * (range - -range) + -range);
			}

			if (type === "enemy") {
				this.enemies.push(new ServerEnemy(x, y));
			}
			else if (type === "coin") {
				this.collectibles.push(new ServerCoin(x, y));
			}
			else if (type === "potion") {
				this.collectibles.push(new ServerPotion(x, y));
			}
			else {
				console.error("Invalid type");
			}
		}
	}

	getGameObjects() {
		// Return a list of all game objects
		const gameObjects = {};
		for (const id in this.players) {
			const player = this.players[id];
			gameObjects[id] = {
				name: player.name,
				position: [player.x, player.y],
				score: player.score,
				sprite: player.type,
				health: player.health,
				animation: player.animation,
				direction: player.direction.x > 0 ? 'right' : 'left'
			};
		}

		this.enemies.forEach((e) => {
			gameObjects[e.id] = {
				name: e.name,
				position: [e.x, e.y],
				score: -1,
				sprite: e.type,
				health: e.health,
				animation: e.animation,
				direction: e.direction.x > 0 ? 'right' : 'left'
			};
		});

		this.collectibles.forEach((c) => {
			if (c.used) return;

			gameObjects[c.id] = {
				name: "",
				position: [c.x, c.y],
				score: -1,
				sprite: c.type,
				health: -1,
				animation: c.animation,
				direction: 'right'
			};
		});

		return gameObjects;
	}

	getGameState() {
		return {
			status: this.status,
			message: this.message,
			game_objects: this.getGameObjects()
		};
	}

	addExistingPlayerToSocket(socket, player) {
		delete Object.assign(this.players, {[socket.id]: this.players[player.socket.id] })[player.socket.id];
		player.socket = socket;
		player.id = socket.id;

		socket.on('input', (action) => {
			this.handleInput(socket, action);
		});
	}

	addPlayer(socket) {
		this.players[socket.id] = new ServerPlayer(socket);

		socket.on('input', (action) => {
			this.handleInput(socket, action);
		});
	}

	removePlayer(socket) {
		delete this.players[socket.id];
	}

	handleInput(socket, action) {
		const player = this.players[socket.id];
		// Only allow if player is alive
		if (player && player.health > 0) {
			switch (action) {
				case 'move_left':
					player.direction = { x: -1, y: 0 };
					player.doMove = true;
					break;
				case 'move_right':
					player.direction = { x: 1, y: 0 };
					player.doMove = true;
					break;
				case 'move_up':
					player.direction = { x: 0, y: -1 };
					player.doMove = true;
					break;
				case 'move_up_left':
					player.direction = { x: -1, y: -1 };
					player.doMove = true;
					break;
				case 'move_up_right':
					player.direction = { x: 1, y: -1 };
					player.doMove = true;
					break;
				case 'move_down':
					player.direction = { x: 0, y: 1 };
					player.doMove = true;
					break;
				case 'move_down_left':
					player.direction = { x: -1, y: 1 };
					player.doMove = true;
					break;
				case 'move_down_right':
					player.direction = { x: 1, y: 1 };
					player.doMove = true;
					break;
				case 'attack':
					if (player.animation === 'attack') return;
					player.doAttack = true;
					break;
				case 'cheat_inc_spd':
					player.speed += 16;
					break;
				case 'cheat_inc_hp':
					player.maxHealth += 10;
					player.health = player.maxHealth;
					break;
				case 'cheat_inc_dmg':
					player.damage += 10;
					break;
				case 'cheat_inc_range':
					player.range += 16;
					break;
				case 'cheat_instakill':
					player.damage = Infinity;
					break;
				case 'cheat_godmode':
					player.maxHealth = 9999999999999;
					player.health = 9999999999999;
					break;
				default:
					console.log('Unknown action: ' + action);
					break;
			}
		}
	}

	/**
	 * Send an update to all players in the game.
	 */
	sendUpdate() {
		this.io.to(this.id).emit('gameState', this.getGameState());
	}

	update() {
		const now = Date.now();

		// Don't update game state if we are within the same tick
		if (now - this.lastUpdateTime < 1000 / TPS) {
			return;
		}
		this.lastUpdateTime = now;

		const seconds = (now - this.startTime) / 1000;

		if (this.status === 'waiting') {
			if (seconds > WAIT_TIME) {
				this.status = 'playing';
				this.message = `${Math.floor(GAME_TIME+WAIT_TIME-seconds)} seconds remaining...`;
			} else {
				this.message = `Waiting for players: ${Math.floor(
					WAIT_TIME - seconds
				)} seconds remaining`;
			}
		} else if (seconds > GAME_TIME + WAIT_TIME) {
			this.status = 'ended';
			this.message = 'Game ended';
			this.sendUpdate();

			// Close game and websocket connection
			for (const id in this.players) {
				const player = this.players[id];
				player.socket.leave(this.id);
			}
			// stop update schedule
			clearInterval(this.updateSchedule);

			return;
		} else {
			this.message = `${Math.floor(GAME_TIME+WAIT_TIME-seconds)} seconds remaining...`;
			// Update players
			for (const id in this.players) {
				const player = this.players[id];
				let enemiesToAttack = [];
				if (player.doAttack) {
					// Find the closest enemy
					this.enemies.forEach((e) => {
						// If enemy is dead, do not target
						if (e.health <= 0) return;

						const distance = Math.sqrt((e.x - player.x) ** 2 + (e.y - player.y) ** 2);
						if (distance < player.range) {
							enemiesToAttack.push(e);
						}
					});
				}
				player.update(enemiesToAttack);

				// Update enemies
				this.enemies.forEach((e) => {
					// Find the closest player
					let closestPlayer = null;
					let closestDistance = Infinity;
					for (const id in this.players) {
						const player = this.players[id];

						// If player is dead, do not target
						if (player.health <= 0) continue;

						const distance = Math.sqrt((e.x - player.x) ** 2 + (e.y - player.y) ** 2);
						if (distance < closestDistance) {
							closestDistance = distance;
							closestPlayer = player;
						}
					}
					e.update(closestPlayer);
				});

				// Update collectibles
				this.collectibles.forEach((c) => {
					// Find the closest player
					let closestPlayer = null;
					let closestDistance = Infinity;
					for (const id in this.players) {
						const player = this.players[id];

						// If player is dead, do not target
						if (player.health <= 0) continue;

						const distance = Math.sqrt((c.x - player.x) ** 2 + (c.y - player.y) ** 2);
						if (distance < closestDistance) {
							closestDistance = distance;
							closestPlayer = player;
						}
					}
					c.update(closestPlayer);
				});
			}
		}
		this.sendUpdate();
	}
}
