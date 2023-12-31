import jwt from 'jsonwebtoken';
import * as database from '$lib/server/database.js';

const secret = process.env.JWT_SECRET || 'secret';

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
	const token = cookies.get('token');

	if (!token) {
		return { user: null, token: null };
	}

	let user;
	try {
		user = jwt.verify(token, secret);
	} catch (e) {
		console.error(e);
		return { user: null };
	}

	// console.log(user);

	return { user, token };
}

/** @type {import('./$types').Actions} */
export const actions = {
	login: async ({ cookies, request }) => {
		const data = await request.formData();
		const username = data.get('username');
		const password = data.get('password');

		if (!username) {
			return { success: false, status: 400, error: 'Missing username argument' };
		}
		if (!password) {
			return { success: false, status: 400, error: 'Missing password argument' };
		}
		if (!(await database.userExists(username))) {
			return { success: false, status: 404, error: 'User not found' };
		}
		if (!(await database.checkUserCredentials(username, password))) {
			return { success: false, status: 401, error: 'Wrong password' };
		}

		const token = jwt.sign({ username }, secret, { expiresIn: '48h' });
		cookies.set('token', token);

		return { success: true, message: 'User logged in' };
	},
	register: async ({ request }) => {
		const data = await request.formData();
		const username = data.get('username');
		const password = data.get('password');

		if (!username || !password) {
			return { success: false, status: 400, error: 'Missing username or password' };
		}

		if (await database.userExists(username)) {
			return { success: false, status: 409, error: 'User already exists' };
		}

		await database.createUser(username, password);

		return { success: true, message: 'User created, you can now log in!' };
	},
	logout: async ({ cookies }) => {
		cookies.set('token', '');

		return { success: true, message: 'Logged out!' };
	}
};
