const fs = require('fs');
const path = require('path');

// Функция для обеспечения существования директории
function ensureDirectoryExistence(filePath) {
	const dirname = path.dirname(filePath);
	if (fs.existsSync(dirname)) {
		return true;
	}

	try {
		fs.mkdirSync(dirname, { recursive: true }); // Рекурсивное создание директорий, если их нет
		console.log(`Директория успешно создана: ${dirname}`);
		return true;
	} catch (err) {
		console.error(`Ошибка при создании директории ${dirname}:`, err);
		return false;
	}
}

// Путь для сохранения данных о пользователях
const userDataDir = path.join(__dirname, '..', 'temporary_files', 'bot_users');

// Функция для генерации имени файла
function generateFileName(userInfo) {
	const parts = [
		'user',
		userInfo.id,
		userInfo.first_name || '',
		userInfo.last_name || ''
	].filter(Boolean); // Удаляем пустые значения
	return `${parts.join('_')}.json`;
}

// Функция для сохранения информации о пользователе в файл
function saveUserInfo(userInfo) {
	ensureDirectoryExistence(userDataDir); // Убедимся, что директория существует

	const fileName = generateFileName(userInfo);
	const filePath = path.join(userDataDir, fileName);

	const dataToSave = {
		id: userInfo.id,
		first_name: userInfo.first_name || 'no data',
		last_name: userInfo.last_name || 'no data',
		username: userInfo.username || 'no data',
		dateOfBirth: userInfo.dateOfBirth || 'no data',
	};

	fs.writeFile(filePath, JSON.stringify(dataToSave, null, 2), err => {
		if (err) {
			console.error(`Ошибка при сохранении данных в файл ${filePath}:`, err);
		} else {
			console.log(`Данные успешно сохранены в файле: ${filePath}`);
		}
	});
}

// Функция для обновления информации о пользователе
function updateUserInfo(userId, contact) {
	const fileName = generateFileName({ id: userId, ...contact });
	const filePath = path.join(userDataDir, fileName);

	fs.readFile(filePath, 'utf8', (err, data) => {
		if (err) {
			if (err.code === 'ENOENT') {
				console.log('Файл не найден, создается новый файл.');
				const userInfo = {
					id: userId,
					first_name: contact.first_name || 'no data',
					last_name: contact.last_name || 'no data',
					username: contact.username || 'no data',
					dateOfBirth: contact.dateOfBirth || 'no data',
				};
				saveUserInfo(userInfo);
			} else {
				console.error(`Ошибка при чтении файла ${filePath}:`, err);
			}
		} else {
			const existingUserInfo = JSON.parse(data);
			updateUserInfoFields(existingUserInfo, contact, filePath);
		}
	});
}

// Функция для обновления полей информации о пользователе и сохранения файла
function updateUserInfoFields(userInfo, contact, filePath) {
	let updated = false;
	if (contact && contact.first_name && userInfo.first_name !== contact.first_name) {
		userInfo.first_name = contact.first_name;
		updated = true;
	}
	if (contact && contact.last_name && userInfo.last_name !== contact.last_name) {
		userInfo.last_name = contact.last_name;
		updated = true;
	}
	if (contact && contact.username && userInfo.username !== contact.username) {
		userInfo.username = contact.username;
		updated = true;
	}
	if (contact && contact.dateOfBirth && userInfo.dateOfBirth !== contact.dateOfBirth) {
		userInfo.dateOfBirth = contact.dateOfBirth;
		updated = true;
	}

	if (updated) {
		fs.writeFile(filePath, JSON.stringify(userInfo, null, 2), err => {
			if (err) {
				console.error(`Ошибка при обновлении данных в файле ${filePath}:`, err);
			} else {
				console.log(`Данные успешно обновлены в файле: ${filePath}`);
			}
		});
	} else {
		console.log('Данные пользователя не изменились, обновление не требуется.');
	}
}

// Функция для сохранения или обновления данных о пользователе после команды /start
function saveOrUpdateUser(userInfo) {
	const userId = userInfo.id;
	updateUserInfo(userId, userInfo);
}

module.exports = {
	saveOrUpdateUser,
};
