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
					next();
				});
			} else {
				next(new Error('Authentication error'));
			}
		}).on('connection', function (socket) {
			// Connection now authenticated to receive further events
			socket.emit('message', 'Hello from the server, authenticated!');

			socket.on('getRoom', () => {
				socket.emit('message', `Joined room`);
				console.log(`Joined room ?`);
			});

			socket.on('joinRoom', (room) => {
				socket.join(room);
				socket.emit('eventFromServer', `Joined room ${room}`);
				console.log(`Joined room ${room}`);
			});

			socket.on('message', function (message) {
				io.emit('message', message);
			});
		});
	}
};