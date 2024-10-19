const fs = require('fs')

function toLowerTextAndSave(text, filePath) {
	const lowerCaseText = text.toLowerCase()
	fs.writeFileSync(filePath, lowerCaseText)
	return lowerCaseText // Возвращаем текст для возможного дальнейшего использования
}

module.exports = { toLowerTextAndSave }
