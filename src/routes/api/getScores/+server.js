import { json } from '@sveltejs/kit';
import * as database from '$lib/server/database.js';

export async function GET() {
	return database.getScores();
}
