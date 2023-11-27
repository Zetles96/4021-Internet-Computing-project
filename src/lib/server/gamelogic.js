export class Game {
	constructor() {
		this.players = {};
		this.bullets = [];
		this.lastUpdateTime = Date.now();
		this.shouldSendUpdate = false;
		setInterval(this.update.bind(this), 1000 / 60);
	}

	addPlayer(socket, data) {
		this.players[socket.id] = new Player(socket, data);
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
			socket.emit('update', pack);
		}
	}
}