const { kotId } = require('../token')
const {logAction} = require("./generateLogs");

function sendMessageToSupportChat(
	chatId,
	messageText,
	mainMenu,
	bot,
	userState,
	msg,
	userName
) {
	const name =
		msg.from?.first_name ||
		msg.from?.last_name ||
		msg.from?.username ||
		msg.from?.id

	const lastName = msg.from?.last_name || msg.from?.username || ''

	bot.sendMessage(
		kotId,
		`Обращение пользователя ${name} ${lastName}: ${messageText}`
	).then(r => r)
	console.log(`Обращение пользователя ${userName}:`, ` ${name} ${lastName}`)
	bot.sendMessage(chatId, 'Сообщение отправлено 🫡', mainMenu).then(r => r)
	logAction(msg.from, 'Сообщение отправлено в чат для поддержки')
	userState[chatId].awaitingText = false
	userState[chatId].currentFunction = null
}

module.exports = {
	sendMessageToSupportChat,
}
