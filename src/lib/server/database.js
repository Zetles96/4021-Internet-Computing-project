import { json } from '@sveltejs/kit';
import { writeFileSync, readFileSync } from 'fs';

// Create usersData.json if it doesn't exist
try {
	readFileSync('./src/lib/server/usersData.json');
}
catch (error) {
	writeFileSync('./src/lib/server/usersData.json', '{}');
}

import userData from '/src/lib/server/usersData.json';
import bcrypt from 'bcrypt';

const userDataPath = './src/lib/server/usersData.json';
/**
 * @typedef {Object} UserData
 * @property {number} score - The user's score.
 * @property {string} password - The user's password.
 */

/**
 * @typedef {Object.<string, UserData>} UsersData
 */

/**
 * Get all user scores.
 *
 * @returns {Promise[UsersData]} A Promise resolving to an object containing all user scores.
 */
export async function getScores() {
	const users = userData;
	const output = {};

	for (const user in users) {
		const score = users[user].score;
		output[user] = { score };
	}

	return output;
}

/**
 * Get the score for a specific user.
 *
 * @param {string} name - The name of the user.
 * @returns {Promise[number]} The score for the user.
 */
export async function getScore(name) {
	if (!(await userExists(name))) {
		return -1;
	}

	const users = userData;

	if (users[name] === undefined || users[name].score === undefined) {
		return -1;
	}
	return users[name].score;
}

/**
 * Check if a user exists.
 *
 * @param {string} name - The name of the user.
 * @returns {Promise[boolean]} True if the user exists, false otherwise.
 */
export async function userExists(name) {
	const users = userData;
	return name in users;
}

/**
 * Create a new user with the specified name and password.
 *
 * @param {string} username - The name for the new user.
 * @param {string} password - The password for the new user.
 */
export async function createUser(username, password) {
	const users = userData;
	const hashedPassword = await bcrypt.hash(password, 12);
	users[username] = { password: hashedPassword, score: 0 };
	try {
		await writeFileSync(userDataPath, JSON.stringify(users));
	} catch (error) {
		console.error('Error writing to file:', error);
	}
}

/**
 * Check if a password is correct for a specific user.
 *
 * @param {string} username - The name of the user.
 * @param {string} password - The password to check.
 * @returns {Promise[boolean]} True if the password is correct, false otherwise.
 */
export async function checkUserCredentials(username, password) {
	const users = userData;
	const user = users[username];
	if (userExists(username)) {
		return await bcrypt.compare(password, user.password);
	} else {
		// wastes some time to prevent timing attacks
		await bcrypt.hash(password, 12);
		return false;
	}
}

/**
 * Set the score for a specific user.
 *
 * @param {string} name - The name of the user.
 * @param {number} score - The new score for the user.
 */
export async function setScore(name, score) {
	const users = userData;
	users[name].score = score;
	writeFileSync(userDataPath, JSON.stringify(users));
}
