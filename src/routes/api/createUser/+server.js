import { error, json } from '@sveltejs/kit';
import * as database from '$lib/server/database.js';

/**
 * Handle POST requests for creating a new user.
 *
 * @param {Object} request - The HTTP request object.
 * @param {import('@sveltejs/kit').Request.locals} request.locals - Locals object containing session data.
 * @param {FormData} request.body - The parsed body of the request containing user data.
 *
 * @returns {import('@sveltejs/kit').Response} The HTTP response object.
 *
 * @throws {Error} Throws an error with status code 400 if username or password is missing.
 * @throws {Error} Throws an error with status code 409 if the user already exists.
 */
export async function POST(request) {
	const { body } = request;
	console.log('Request Body:', body);

	/**
	 * @type {string}
	 */
	const username = body['username'];

	/**
	 * @type {string}
	 */
	const password = body['password'];

	if (!username || !password) {
		/**
		 * @throws {Error} Throws an error with status code 400 and a message indicating missing username or password.
		 */
		throw error(400, 'Missing username or password');
	}

	if (database.userExists(username)) {
		/**
		 * @throws {Error} Throws an error with status code 409 and a message indicating user already exists.
		 */
		throw error(409, 'User already exists');
	}

	await database.createUser(username, password);
	return json({ success: true });
}
