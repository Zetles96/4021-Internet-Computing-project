import { Server } from 'socket.io';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const webSocketServer = {
	name: 'webSocketServer',
	configureServer(server) {
		server.listen().then(({ server: httpServer }) => {
			const io = new Server(httpServer);

			io.on('connection', (socket) => {
				socket.emit('eventFromServer', 'Hello from the server!');
			});
		});
	}
};

export default defineConfig({
	server: {
		port: 8000
	},
	plugins: [sveltekit()]
});
