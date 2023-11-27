
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
		this.direction = 'right';
	}

	update(dt) {
		this.x += this.direction.x * dt * 200;
		this.y += this.direction.y * dt * 200;
	}
}

class Enemy extends Entity {
	constructor(x, y, radius) {
		super(x, y, radius);
	}

	update(dt) {
		this.x += Math.random() * 100 * dt;
		this.y += Math.random() * 100 * dt;
	}
}


export class Game {
	constructor() {
		this.id = Math.random().toString(36).substring(7);
		this.status = 'waiting';
		this.message = 'Waiting for players';
		this.players = {};
		this.bullets = [];
		this.lastUpdateTime = Date.now();
		this.shouldSendUpdate = false;
		// setInterval(this.update.bind(this), 1000 / 60);
	}

	getGameState() {
		return {
			status: this.status,
			message: this.message,
			game_objects: this.players,
		};
	}

	addPlayer(socket) {
		this.players[socket.id] = new Player(socket);
	}

	removePlayer(socket) {
		delete this.players[socket.id];
	}

	handleInput(socket, dir) {
		if (this.players[socket.id]) {
			this.players[socket.id].direction = dir;
		}
	}

	update() {
		const now = Date.now();
		const dt = (now - this.lastUpdateTime) / 1000;
		this.lastUpdateTime = now;

		for (const id in this.players) {
			const player = this.players[id];
			player.update(dt);
		}

		this.bullets = this.bullets.filter((b) => !b.shouldRemove);
		this.bullets.forEach((b) => b.update(dt));

		const pack = {
			players: this.players,
			bullets: this.bullets.reduce((acc, b) => {
				acc[b.id] = {
					x: b.x,
					y: b.y
				};
				return acc;
			}, {})
		};

		for (const id in this.players) {
			const socket = this.players[id].socket;
			// socket.emit('update', pack);
		}
	}
}