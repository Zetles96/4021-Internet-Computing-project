import { json } from '@sveltejs/kit';
import { userData, userDataPath } from '$lib/server/usersData.json';
import { writeFileSync } from 'fs';

export function getScores() {
	const users = userData();
	// Convert the userData object into an array of objects with user and score properties
	const scoresArray = Object.keys(users).map((user) => ({
		user,
		score: users[user].score
	}));

	// Sort the array by score in descending order
	scoresArray.sort((a, b) => b.score - a.score);

	// Return the sorted scoresArray
	return json(scoresArray);
}

export function getScore(name) {
	const users = userData();
	// get score
	return users[name].score;
}

export function userExists(name) {
	const users = userData();
	// check if user exists
	return name in users;
}

export function createUser(name, password) {
	const users = userData();
	// create user
	users[name] = { password: password, score: 0 };
	// write to the json file
	writeFileSync(userDataPath, JSON.stringify(users));
}

export function updateScore(name, score) {
	const users = userData();
	// update score
	users[name].score = score;
	// write to the json file
	writeFileSync(userDataPath, JSON.stringify(users));
}
