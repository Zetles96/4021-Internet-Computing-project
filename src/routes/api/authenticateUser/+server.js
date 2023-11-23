import { error, json } from '@sveltejs/kit';
import * as database from '$lib/server/database.js';

import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'secret';

/**
 * Handles POST requests for user authentication.
 * @param {import('@sveltejs/kit').RequestEvent} requestEvent - The request event.
 * @returns {import('@sveltejs/kit').Response} The response containing a JWT token on successful authentication.
 * @throws {import('@sveltejs/kit').Error} Throws an error with the appropriate status code and message if authentication fails.
 */
export async function POST(requestEvent) {
	const { request } = requestEvent;

	/**
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
		/**
		 * @throws {Error} Throws an error with status code 400 and a message indicating missing username.
		 */
		throw error(400, 'Missing username argument');
	}
	if (!password) {
		/**
		 * @throws {Error} Throws an error with status code 400 and a message indicating missing password.
		 */
		throw error(400, 'Missing password argument');
	}
	if (!(await database.userExists(username))) {
		/**
		 * @throws {Error} Throws an error with status code 404 and a message indicating user not found.
		 */
		throw error(404, 'User not found');
	}
	if (!(await database.checkUserCredentials(username, password))) {
		/**
		 * @throws {Error} Throws an error with status code 401 and a message indicating wrong password.
		 */
		throw error(401, 'Wrong password');
	}

	const token = jwt.sign({ username }, secret, { expiresIn: '1h' });
	return json({ token });
}
