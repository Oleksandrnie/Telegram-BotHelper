// массив с пользователями которые имеют доступ к разделу Базы знаний

const { chatId } = require('../../indexTest')
const { kotId, kittyId } = require('../../token')

function checkAccess() {
	const arr = [kotId, kittyId]

	const result = arr.forEach(idx => idx === chatId)
	console.log(result)

	return result
}

module.exports = { checkAccess }
