import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { webSocketServer } from './src/lib/server/websocket.js';

export default defineConfig({
	server: {
		port: 8000,
		hmr: false
	},
	plugins: [sveltekit(), webSocketServer]
});
