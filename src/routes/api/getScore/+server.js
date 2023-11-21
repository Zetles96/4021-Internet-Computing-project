import { error, json } from '@sveltejs/kit';
import * as database from '$lib/server/database.js';

/**
 * Handle GET requests for retrieving a user's score.
 *
 * @param {Object} options - The options object.
 * @param {URL} options.url - The URL object representing the request URL.
 * @returns {Promise<{ status: number, body: { score: number } }>} A Promise resolving to an object containing the response status and body.
 * @throws {Error} Throws an error with status code and message if user is missing or not found.
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

	if (!database.userExists(user)) {
		/**
		 * @throws {Error} Throws an error with status code 404 and a message indicating user not found.
		 */
		throw error(404, 'User not found');
	}

	/**
	 * @type {number}
	 */
	const score = database.getScore(user);

	return json({ score });
}
