import { error, json } from '@sveltejs/kit';
import * as database from '$lib/server/database.js';

const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'secret';

export async function GET({ body }) {
	const username = body.get('username');
	const password = body.get('password');

	if (!username) {
		throw error(400, 'Missing username argument');
	}
	if (!password) {
		throw error(400, 'Missing password argument');
	}
	if (!database.userExists(username)) {
		throw error(404, 'User not found');
	}
	if (!database.checkPassword(username, password)) {
		throw error(401, 'Wrong password');
	}

	const token = jwt.sign({ username }, secret, { expiresIn: '1h' });
	return json({ token });
}
