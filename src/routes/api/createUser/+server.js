import { error, json } from '@sveltejs/kit';
import * as database from '$lib/server/database.js';

/**
 * Handle POST requests for creating a new user.
 *
 * @param {import('@sveltejs/kit').Request.locals} request.locals - Locals object containing session data.
 * @param {FormData} request.body - The parsed body of the request containing user data.
 *
 * @returns {import('@sveltejs/kit').Response} The HTTP response object.
 *
 * @throws {Error} Throws an error with status code 400 if username or password is missing.
 * @throws {Error} Throws an error with status code 409 if the user already exists.
 * @param requestEvent
 */
export async function POST(requestEvent) {
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
	if (!username || !password) {
		/**
		 * @throws {Error} Throws an error with status code 400 and a message indicating missing username or password.
		 */
		throw error(400, 'Missing username or password');
	}

	if (await database.userExists(username)) {
		/**
		 * @throws {Error} Throws an error with status code 409 and a message indicating user already exists.
		 */
		throw error(409, 'User already exists');
	}

	await database.createUser(username, password);
	return json({ success: true });
}
