const { botTestToken, kotId, kittyId} = require('../token')
const {logAction} = require("./generateLogs");
// const {logAction} = require("./logs");


function sendMessageToCatChat(
	chatId,
	messageText,
	mainMenu,
	bot,
	userState,
	msg
) {
	if (bot?.token === botTestToken) {
		//TODO 1й if только для теста определяется по токену какой бот
		let recipientChatId = kotId
		bot.sendMessage(recipientChatId, `Служба заботы: ${messageText}`)
		bot.sendMessage(chatId, 'Сообщение отправлено.', mainMenu)
		logAction(msg.from, 'Сообщение отправлено в чат для котиков')
		userState[chatId].awaitingText = false
		userState[chatId].currentFunction = null
	} else {
		let recipientChatId = chatId === kittyId ? kotId : kittyId
		bot.sendMessage(recipientChatId, `Служба заботы: ${messageText}`)
		bot.sendMessage(chatId, 'Сообщение отправлено.', mainMenu)
		logAction(msg.from, 'Сообщение отправлено в чат для котиков')
		userState[chatId].awaitingText = false
		userState[chatId].currentFunction = null
	}
}

module.exports = {
	sendMessageToCatChat,
}
