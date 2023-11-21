import { json } from '@sveltejs/kit';
import userData from './usersData.json';
import { writeFileSync, readFileSync } from 'fs';
import bcrypt from 'bcrypt';

const userDataPath = './usersData.json';
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
 * @returns {UsersData} Object containing user scores.
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
 * @returns {number} The user's score.
 */
export async function getScore(name) {
	const users = userData;
	return users[name].score;
}

/**
 * Check if a user exists.
 *
 * @param {string} name - The name of the user.
 * @returns {boolean} True if the user exists, false otherwise.
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
	writeFileSync(userDataPath, JSON.stringify(users));
}

/**
 * Check if a password is correct for a specific user.
 *
 * @param {string} username - The name of the user.
 * @param {string} password - The password to check.
 * @returns {boolean} True if the password is correct, false otherwise.
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
