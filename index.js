const TelegramBot = require('node-telegram-bot-api')
const path = require('path')
const { botToken, kotId, kittyId } = require('./token')
const { instagramText } = require('./functions/instagramTextEdit')
const { sendMessageToCatChat } = require('./functions/catsChat')
const { sendMessageToSupportChat } = require('./functions/supportChat')
const { scheduleCompliments } = require('./functions/compliments')
const {
	switchFunctionsBot,
} = require('./functions/help_function/switchFunctionsBot')
const { toLowerTextAndSave } = require('./functions/textEdit')
const { saveOrUpdateUser } = require('./functions/getUsersData')
const { logAction } = require('./functions/generateLogs')

const initializeBot = () => {
	const bot = new TelegramBot(botToken, { polling: true })

	bot.on('polling_error', error => {
		console.error('[polling_error]', error.code, error.message)
		if (error.code === 'EFATAL') {
			console.error('Fatal error, restarting bot...')
			setTimeout(() => initializeBot(), 10000) // Перезапуск бота через 10 секунд
		}
	})

	const mainMenu = {
		reply_markup: {
			keyboard: [['База знаний', 'Редакция', 'Что умеет бот ?']],
			resize_keyboard: true,
		},
	}

	const cancelKey = {
		reply_markup: {
			keyboard: [['Ой, передумала💅🏼']],
			resize_keyboard: true,
		},
	}

	bot.onText('/start', msg => {
		const chatId = msg.chat.id
		const userName = msg.from.first_name || msg.from.username

		bot.sendMessage(chatId, `Привет ${userName} 🙌🏼`, mainMenu).then(r => r)
		bot.sendMessage(
			chatId,
			'Выбери нужную функции или посмотри раздел помощи /help 😊'
		)

		logAction(msg.from, '/start')
		saveOrUpdateUser(msg.from)
	})

	const userState = {}

	function resetUserState(chatId) {
		userState[chatId] = {
			awaitingText: false,
			currentFunction: null,
			currentSection: null,
		}
	}

	bot.on('message', msg => {
		const chatId = msg.chat.id
		const messageText = msg.text
		const userName = msg.from.first_name || msg.from.username

		const functionsMenu = {
			reply_markup: {
				keyboard: [
					['Текст в нижний регистр', 'Для инсты'],
					[chatId === kotId ? 'Чат с кисой❤️‍🔥' : ''],
					['Ой, передумала💅🏼'],
				].filter(row => row.some(button => button !== '')),
				resize_keyboard: true,
			},
		}

		const baseOnKnowledgeMenu = {
			reply_markup: {
				keyboard: [['Арканы', 'Каналы'], ['Ой, передумала💅🏼']],
				resize_keyboard: true,
			},
		}

		if (!userState[chatId]) {
			resetUserState(chatId)
		}

		if (userState[chatId].awaitingText) {
			if (messageText === 'Ой, передумала💅🏼') {
				resetUserState(chatId)
				bot.sendMessage(chatId, 'Действие отменено.', mainMenu)
				logAction(msg.from, 'Отмена операции')
				return
			}

			// проверяем выбранную функцию юзера
			if (userState[chatId].currentFunction === 'lowerCase') {
				const filePath = path.join(
					__dirname,
					'temporary_files',
					'измененный_текст.txt'
				)

				toLowerTextAndSave(messageText, filePath)

				bot.sendDocument(chatId, filePath, {
					contentType: 'text/plain',
					caption: 'Ваш текст в нижнем регистре в файле 🙌🏼',
				})
			} else if (userState[chatId].currentFunction === 'instagramText') {
				const filePath = path.join(
					__dirname,
					'temporary_files',
					'instaText.txt'
				)
				const formattedText = instagramText(messageText, filePath)
				bot.sendMessage(chatId, formattedText, { parse_mode: 'HTML' })
			} else if (userState[chatId].currentFunction === 'forkitty') {
				sendMessageToCatChat(chatId, messageText, mainMenu, bot, userState, msg)
			} else if (userState[chatId].currentFunction === 'support') {
				sendMessageToSupportChat(
					chatId,
					messageText,
					mainMenu,
					bot,
					userState,
					msg,
					kotId,
					kittyId,
					userName
				)
			}

			return
		}

		switchFunctionsBot(
			bot,
			msg,
			chatId,
			mainMenu,
			userState,
			cancelKey,
			messageText,
			functionsMenu,
			baseOnKnowledgeMenu,
			resetUserState
		)
		module.exports = { chatId }
	})

	scheduleCompliments(bot)

	module.exports = { bot }
}

initializeBot()

module.exports = { switchFunctionsBot }
