import { json } from '@sveltejs/kit';
import * as database from '$lib/server/database.js';

export async function GET(user) {
	const score = database.getScore(user);
	return json({ score });
}
