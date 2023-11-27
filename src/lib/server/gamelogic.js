const TPS = 20;
const GAME_TIME = 60*2; // 2 minutes
const WAIT_TIME = 10;


class Entity {
	constructor(x, y, radius) {
		this.x = x;
		this.y = y;
		this.radius = radius;
	}

}

class Player extends Entity {
	constructor(socket) {
		super(0, 0, 10);
		this.socket = socket;
		this.doAttack = false;
		this.direction = { x: 0, y: 0 };

		this.socket.emit('joined', {
			id: this.socket.id,
			player_id: this.socket.username
		});
	}

	update() {
		this.x += this.direction.x * 16;
		this.y += this.direction.y * 16;
	}
}

class Enemy extends Entity {
	constructor(x, y, radius) {
		super(x, y, radius);
	}

	update() {
		this.x += Math.random() * 16;
		this.y += Math.random() * 16;
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
		setInterval(this.update.bind(this), 1000 / 60);
	}

	getGameObjects() {
		return {
			player1: {
				name: 'player1',
				position: [0, 0],
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
	}

	getGameState() {
		return {
			status: this.status,
			message: this.message,
			game_objects: this.getGameObjects(),
		};
	}

	addPlayer(socket) {
		this.players[socket.id] = new Player(socket);

		socket.on('input', (action) => {
			this.handleInput(socket, action);
		});
	}

	removePlayer(socket) {
		delete this.players[socket.id];
	}

	handleInput(socket, action) {
		if (this.players[socket.id]) {
			console.log(`Player '${socket.username}' performed action '${action}'`)
			switch (action) {
				case 'move_left':
					this.players[socket.id].direction = { x: -1, y: 0 };
					break;
				case 'move_right':
					this.players[socket.id].direction = { x: 1, y: 0 };
					break;
				case 'move_up':
					this.players[socket.id].direction = { x: 0, y: -1 };
					break;
				case 'move_up_left':
					this.players[socket.id].direction = { x: -1, y: -1 };
					break;
				case 'move_up_right':
					this.players[socket.id].direction = { x: 1, y: -1 };
					break;
				case 'move_down':
					this.players[socket.id].direction = { x: 0, y: 1 };
					break;
				case 'move_down_left':
					this.players[socket.id].direction = { x: -1, y: 1 };
					break;
				case 'move_down_right':
					this.players[socket.id].direction = { x: 1, y: 1 };
					break;
				case 'attack':
					this.players[socket.id].doAttack = true;
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
			this.enemies.forEach((e) => e.update());
		}

		this.sendUpdate();
	}
}