import { error, json } from '@sveltejs/kit';
import * as database from '$lib/server/database.js';

/**
 * Handle GET requests for checking if a user exists.
 *
 * @param {Object} options - The options object.
 * @param {URL} options.url - The URL object representing the request URL.
 * @returns {Promise<{ status: number, body: { userExists: boolean } }>} A Promise resolving to an object containing the response status and body indicating whether the user exists.
 * @throws {Error} Throws an error with status code 400 and a message if the user argument is missing.
 */
export async function GET({ url }) {
	/**
	 * @type {string}
	 */
	const user = url.searchParams.get('user');

	if (!user) {
		/**
		 * @throws {Error} Throws an error with status code 400 and a message indicating missing user argument.
		 */
		throw error(400, 'Missing user argument');
	}

	/**
	 * @type {boolean}
	 */
	const userExists = database.userExists(user);

	return json({ userExists });
}
