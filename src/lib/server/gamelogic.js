const TPS = 20;
const GAME_TIME = 60*2; // 2 minutes
const WAIT_TIME = 10;

const PLAYER_TYPES = ["samurai", "samuraiarcher", "samuraicommander"]
const ENEMY_TYPES = ["whitewerewolf", "redwerewolf", "blackwerewolf", "gotoku", "onre", "yurei"]


class ServerEntity {
	constructor(id, name, x, y, type) {
		this.id = id;
		this.name = name;
		this.x = x;
		this.y = y;
		this.type = type;
		this.health = 100;
		this.animation = "idle";
		this.direction = { x: 0, y: 0 };
	}
}

class ServerPlayer extends ServerEntity {
	constructor(socket) {
		super(socket.id, socket.username, 0, 0, PLAYER_TYPES[Math.floor(Math.random() * PLAYER_TYPES.length)]);
		this.socket = socket;

		this.doAttack = false;
		this.doMove = false;

		this.socket.emit('joined', {
			id: this.socket.id,
			player_id: this.id
		});
	}

	update() {
		if (this.doMove) {
			this.animation = "walk";
			this.x += this.direction.x * 16;
			this.y += this.direction.y * 16;
			this.doMove = false;
		}
		else {
			this.animation = "idle";
		}
	}
}

class ServerEnemy extends ServerEntity {
	constructor(x, y) {
		super(Math.random().toString(36).substring(7), "", x, y, ENEMY_TYPES[Math.floor(Math.random() * ENEMY_TYPES.length)]);
		switch (this.type) {
			case "yurei":
			case "onre":
			case "gotoku":
				this.damage = 20;
				break;
			default:
				this.damage = 10;
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
		const distance = Math.sqrt((this.x - player.x) ** 2 + (this.y - player.y) ** 2);

		// If we are outside of simulation distance, we don't do anything
		if (distance > this.simulation_distance) {
			this.animation = "idle";
			return;
		}

		this.direction = { x: 0, y: 0 };
		if (this.x < player.x) {
			this.direction.x = 1;
		}
		else if (this.x > player.x) {
			this.direction.x = -1;
		}
		if (this.y < player.y) {
			this.direction.y = 1;
		}
		else if (this.y > player.y) {
			this.direction.y = -1;
		}

		// if we are within range, we attack
		if (distance < 16) {
			this.animation = "attack";
			player.health -= this.damage;
			return;
		}

		// We move towards the player
		this.animation = "walk";
		this.x += this.direction.x * this.speed;
		this.y += this.direction.y * this.speed;
	}
}


export class Game {
	constructor(io) {
		this.id = Math.random().toString(36).substring(7);
		this.io = io;
		this.status = 'waiting';
		this.message = `Waiting for players: ${WAIT_TIME} seconds remaining`;
		this.players = {};
		this.enemies = [];
		this.startTime = Date.now();
		this.lastUpdateTime = this.startTime;

		this.spawnEnemies(3, 500);
		this.spawnEnemies(10, 1000);
		this.spawnEnemies(100, 5000);
		// this.spawnEnemies(100, 10000);
		setInterval(this.update.bind(this), 1000 / 60);
	}

	spawnEnemies(amount, range) {
		for (let i = 0; i < amount; i++) {
			let x = 0;
			let y = 0;

			while (x < 50 && x > -50) {
				x = Math.random() * (range - -range) + -range;
			}
			while (y < 50 && y > -50) {
				y = Math.random() * (range - -range) + -range;
			}

			this.enemies.push(new ServerEnemy(x, y));
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
				sprite: e.type,
				health: e.health,
				animation: e.animation,
				direction: e.direction.x > 0 ? 'right' : 'left'
			};
		});

		return gameObjects;
	}

	getGameState() {
		return {
			status: this.status,
			message: this.message,
			game_objects: this.getGameObjects(),
		};
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
		if (player) {
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
					player.doAttack = true;
					break;
				default:
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
		if ((now - this.lastUpdateTime) < 1000 / TPS) {
			return;
		}
		this.lastUpdateTime = now;

		const seconds = (now - this.startTime) / 1000;

		if (this.status === 'waiting') {
			if (seconds > WAIT_TIME) {
				this.status = 'playing';
				this.message = 'Game started';
			}
			else {
				this.message = `Waiting for players: ${Math.floor(WAIT_TIME - seconds)} seconds remaining`;
			}
		}
		else if (seconds > GAME_TIME + WAIT_TIME) {
			this.status = 'ended';
			this.message = 'Game ended';
			this.sendUpdate();
			return;
		}
		else {
			for (const id in this.players) {
				const player = this.players[id];
				player.update();
			}
			this.enemies.forEach((e) => {
				// Find the closest player
				let closestPlayer = null;
				let closestDistance = Infinity;
				for (const id in this.players) {
					const player = this.players[id];
					const distance = Math.sqrt((e.x - player.x) ** 2 + (e.y - player.y) ** 2);
					if (distance < closestDistance) {
						closestDistance = distance;
						closestPlayer = player;
					}
				}
				e.update(closestPlayer);
			});
		}

		this.sendUpdate();
	}
}