const fs = require('fs')

// Функция для форматирования текста для Instagram
function formatInstagramText(text) {
	let formattedText = text.replace(/_([^_]+)_/g, '<u>$1</u>')
	formattedText = formattedText.replace(/-([^---]+)-/g, '<s>$1</s>')
	return formattedText
}

function instagramText(text, filePath) {
	const formattedText = formatInstagramText(text)
	fs.writeFileSync(filePath, formattedText)
	return formattedText
}

module.exports = { instagramText }
