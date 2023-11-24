import { writeFileSync, existsSync } from 'fs';

const userDataPath = './src/lib/server/usersData.json';

// Create usersData.json in the src/lib/server directory.
// Check if it exists before creating it.
// If it does not exist, create it with an empty object.
if (!existsSync(userDataPath)) {
	writeFileSync(userDataPath, '{}');
}
