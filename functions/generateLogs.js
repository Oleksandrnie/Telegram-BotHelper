const fs = require('fs');
const path = require('path');

function ensureDirectoryExistence(filePath) {
	const dirname = path.dirname(filePath);
	if (fs.existsSync(dirname)) {
		return true;
	}
	ensureDirectoryExistence(dirname);
	fs.mkdirSync(dirname, { recursive: true });
}

function logAction(user, action) {
	const logDirectory = path.join(__dirname, '..', 'temporary_files', 'logs_files');
	const logFilePath = path.join(logDirectory, 'logs.log');

	ensureDirectoryExistence(logFilePath);

	const logMessage = `Date: ${new Date().toISOString()}\nUser: ${
		user.username || 'no data'
	} (ID: ${user.id}, First Name: ${user.first_name || 'no data'}, Last Name: ${
		user.last_name || 'no data'
	})\nAction: ${action || 'no data'}\n\n`;

	fs.appendFile(logFilePath, logMessage, err => {
		if (err) {
			console.error('Error writing to log file:', err);
		}
	});
}

module.exports = {
	logAction,
};
