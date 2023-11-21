import { error, json } from '@sveltejs/kit';
import * as database from '$lib/server/database.js';

export async function GET({ url }) {
	const user = url.searchParams.get('user');

	if (!user) {
		throw error(400, 'Missing user argument');
	}
	const userExists = database.userExists(user);
	return json({ userExists });
}
