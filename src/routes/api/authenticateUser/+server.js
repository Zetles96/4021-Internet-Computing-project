import { error, json } from '@sveltejs/kit';
import * as database from '$lib/server/database.js';
import { checkUserCredentials } from '$lib/server/database.js';

const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'secret';

export async function GET({ requestEvent }) {
	console.log('i have been called')
	const { request } = requestEvent;
	/**
	 *
	 * @type {Object}
	 */
	const data = await request.json();
	/**
	 * @type {string}
	 */
	const { username } = data;
	/**
	 * @type {string}
	 */
	const { password } = data;

	if (!username) {
		throw error(400, 'Missing username argument');
	}
	if (!password) {
		throw error(400, 'Missing password argument');
	}
	if (!(await database.userExists(username))) {
		throw error(404, 'User not found');
	}
	if (!(await database.checkUserCredentials(username, password))) {
		throw error(401, 'Wrong password');
	}

	const token = jwt.sign({ username }, secret, { expiresIn: '1h' });
	return json({ token });
}
