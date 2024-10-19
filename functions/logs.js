const fs = require('fs')
const path = require('path')

function logAction(user, action) {
	const logDirectory = path.join(__dirname, '..', 'temporary_files')
	const logFilePath = path.join(logDirectory, 'log.txt')

	if (!fs.existsSync(logDirectory)) {
		fs.mkdirSync(logDirectory, { recursive: true })
	}

	const logMessage = `Date: ${new Date().toISOString()}\nUser: ${
		user.username
	} (ID: ${user.id}, First Name: ${user.first_name}, Last Name: ${
		user.last_name
	})\nAction: ${action}\n\n`

	fs.appendFile(logFilePath, logMessage, err => {
		if (err) {
			console.error('Error writing to log file:', err)
		}
	})
}

module.exports = {
	logAction,
}
