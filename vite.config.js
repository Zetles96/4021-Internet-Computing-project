import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { Server } from 'socket.io';

const webSocketServer = {
	name: 'webSocketServer',
	configureServer(server) {
		if (!server.httpServer) return;

		const io = new Server(server.httpServer);

		io.on('connection', (socket) => {
			socket.emit('eventFromServer', 'Hello from the server');
			socket.on('joinRoom', (room) => {
				socket.join(room);
				socket.emit('eventFromServer', `Joined room ${room}`);
				console.log(`Joined room ${room}`);
			});
		});
	}
};

export default defineConfig({
	server: {
		port: 8000
	},
	plugins: [sveltekit(), webSocketServer]
});
