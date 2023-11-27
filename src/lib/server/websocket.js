import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { Game } from './gamelogic.js';

const secret = process.env.JWT_SECRET || 'secret';

/**
 *
 * @type {{key: string, value: Game}}
 */
const games = {};

export const webSocketServer = {
	name: 'webSocketServer',
	configureServer(server) {
		if (!server.httpServer) return;

		const io = new Server(server.httpServer);

		io.use(function (socket, next) {
			if (socket.handshake.query && socket.handshake.query.token) {
				jwt.verify(socket.handshake.query.token, secret, function (err, decoded) {
					if (err) return next(new Error('Authentication error'));
					socket.decoded = decoded;
					socket.username = decoded.username;
					next();
				});
			} else {
				next(new Error('Authentication error'));
			}
		}).on('connection', function (socket) {
			// Connection now authenticated to receive further events
			socket.emit('message', `Hello from the server, ${socket.username}!`);

			socket.on('joinGame', () => {
				let game = null;
				for (const game_obj in games) {
					if (
						games[game_obj].status === 'waiting' &&
						games[game_obj].players.length < 4
					) {
						game = games[game_obj];
						break;
					}
				}

				if (!game) {
					game = new Game(io);
					games[game.id] = game;
				}

				// Add player to game and room
				game.addPlayer(socket);
				socket.join(game.id);

				socket.emit('message', `Joined game ${game.id}`);
				console.log(`Player '${socket.username}' joined game ${game.id}`);
			});

			socket.on('message', function (message) {
				io.emit('message', message);
			});
		});
	}
};
