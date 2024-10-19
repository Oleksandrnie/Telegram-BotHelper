const { kotId } = require('../token')
const { logAction } = require('./generateLogs')

function scheduleCompliments(bot) {
	const timeToNotification = 3.23 * 60 * 60 * 1000 // 3 hours 23 minutes

	setInterval(() => {
		bot.sendMessage(kotId, 'Кот, отправь кисе комплимент 🥰')
		logAction(kotId, 'Напоминание о комплименте отправлено в чат')
		console.log(`Напоминание о комплименте отправлено в чат ${kotId}`)
	}, timeToNotification)
}

module.exports = { scheduleCompliments }
