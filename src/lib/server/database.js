import { json } from '@sveltejs/kit';
import userData from './usersData.json';
import { writeFileSync, readFileSync } from 'fs';

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
export function getScores() {
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
export function getScore(name) {
	const users = userData;
	return users[name].score;
}

/**
 * Check if a user exists.
 *
 * @param {string} name - The name of the user.
 * @returns {boolean} True if the user exists, false otherwise.
 */
export function userExists(name) {
	const users = userData;
	return name in users;
}

/**
 * Create a new user with the specified name and password.
 *
 * @param {string} name - The name of the new user.
 * @param {string} password - The password for the new user.
 */
export function createUser(name, password) {
	const users = userData;
	users[name] = { password: password, score: 0 };
	writeFileSync(userDataPath, JSON.stringify(users));
}

/**
 * Set the score for a specific user.
 *
 * @param {string} name - The name of the user.
 * @param {number} score - The new score for the user.
 */
export function setScore(name, score) {
	const users = userData;
	users[name].score = score;
	writeFileSync(userDataPath, JSON.stringify(users));
}
