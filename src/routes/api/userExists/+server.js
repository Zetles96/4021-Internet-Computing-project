import { json } from '@sveltejs/kit';
import * as database from '$lib/server/database.js';

export async function get(user) {
	const userExists = database.userExists(user);
	return json({ userExists });
}
