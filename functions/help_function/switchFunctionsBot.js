// const { logAction } = require("../logs");
const { botFunctionsFAQ } = require('./whatCanTheBotDo')
const { getFilesList } = require('./getFilesList')
const path = require('path')
const fs = require('fs')
const { kotId, kittyId } = require('../../token')
const { logAction } = require('../generateLogs')

function switchFunctionsBot(
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
) {
	switch (messageText) {
		case 'База знаний':
			bot.sendMessage(chatId, '✨Выберите нужный раздел✨', baseOnKnowledgeMenu)
			logAction(msg.from, 'Открытие базы знаний')
			resetUserState(chatId)
			break

		case 'Арканы':
			if (chatId !== kotId && chatId !== kittyId) {
				bot.sendMessage(chatId, 'Нет доступа ⛔️🤷‍♀️')
			} else {
				userState[chatId].currentSection = 'arcany'
				const arcanyFilesList = getFilesList(
					path.join(__dirname, '..', '..', 'db_arcans_channels', 'arcany')
				)
				const arcanyFilesButtons = arcanyFilesList.map(file => [
					path.basename(file),
				])
				bot.sendMessage(chatId, 'Выберите файл:', {
					reply_markup: {
						keyboard: arcanyFilesButtons.concat([['Ой, передумала💅🏼']]),
						resize_keyboard: true,
					},
				})
			}

			break

		case 'Каналы':
			if (chatId !== kotId && chatId !== kittyId) {
				bot.sendMessage(chatId, 'Нет доступа ⛔️🤷‍♀️')
			} else {
				userState[chatId].currentSection = 'channels'
				const channelsFilesList = getFilesList(
					path.join(__dirname, '..', '..', 'db_arcans_channels', 'channels')
				)
				const channelsFilesButtons = channelsFilesList.map(file => [
					path.basename(file),
				])
				bot.sendMessage(chatId, 'Выберите файл:', {
					reply_markup: {
						keyboard: channelsFilesButtons.concat([['Ой, передумала💅🏼']]),
						resize_keyboard: true,
					},
				})
			}
			break

		case 'Редакция':
			bot.sendMessage(chatId, '✨Ваше действие✨', functionsMenu)
			logAction(msg.from, 'Выбор раздела "Редакция"')
			resetUserState(chatId)
			break

		case 'Текст в нижний регистр':
			bot.sendMessage(
				chatId,
				'Отправь текст для преобразования в маленький👇🏼',
				cancelKey
			)
			userState[chatId].awaitingText = true
			userState[chatId].currentFunction = 'lowerCase'
			logAction(msg.from, 'Выбор функции в нижний регистр')
			break

		case 'Для инсты':
			bot.sendMessage(chatId, 'Введи текст необходимый для инсты 👇🏼', cancelKey)
			userState[chatId].awaitingText = true
			userState[chatId].currentFunction = 'instagramText'
			logAction(msg.from, 'Выбор функции редактирования текста для инсты')
			break

		case 'Что умеет бот ?':
		case '/help':
			let helpMessage = '🤖 <b>Что умеет этот бот?</b>\n\n'
			Object.keys(botFunctionsFAQ).forEach(key => {
				if (Array.isArray(botFunctionsFAQ[key])) {
					helpMessage += `\n<b>Раздел - ${key}</b>\n`
					botFunctionsFAQ[key].forEach(item => {
						helpMessage += `${item['Текст']}\n`
					})
				} else {
					helpMessage += `<b>${key}</b>: ${botFunctionsFAQ[key]}\n`
				}
			})
			bot.sendMessage(chatId, helpMessage, { parse_mode: 'HTML' })
			logAction(msg.from, 'Запрос помощи')
			resetUserState(chatId)
			break

		case 'Чат с кисой❤️‍🔥':
		case '/forkitty':
			bot.sendMessage(
				chatId,
				'Введите текст для отправки в чат котиков 👇🏼',
				cancelKey
			)
			userState[chatId].awaitingText = true
			userState[chatId].currentFunction = 'forkitty'
			logAction(msg.from, 'Начало ввода текста для котиков')
			break

		case '/support':
			bot.sendMessage(
				chatId,
				'Скажите об этом нашей службе заботы 👇🏼',
				cancelKey
			)
			userState[chatId].awaitingText = true
			userState[chatId].currentFunction = 'support'
			logAction(msg.from, 'Обращение в поддержку')
			break

		case 'Ой, передумала💅🏼':
			resetUserState(chatId)
			bot.sendMessage(chatId, 'Действие отменено ⛔️', mainMenu)
			logAction(msg.from, 'Отмена операции')
			break

		default:
			const currentSection = userState[chatId].currentSection
			if (currentSection) {
				const filePath = path.join(
					__dirname,
					'..',
					'..',
					'db_arcans_channels',
					currentSection,
					messageText
				)
				if (fs.existsSync(filePath)) {
					bot.sendDocument(chatId, filePath, {
						caption: `Файл ${messageText}`,
					})
				} else {
					bot.sendMessage(chatId, 'Файл не найден.')
				}
			}
			break
	}
}

module.exports = { switchFunctionsBot }
