import { json } from '@sveltejs/kit';
import * as database from '$lib/server/database.js';

/**
 * Handle GET requests for retrieving all user scores.
 *
 * @returns {Promise<{ status: number, body: import('$lib/server/database').UsersData }>} A Promise resolving to an object containing the response status and body with user scores.
 */
export async function GET() {
	return json(await database.getScores());
}
