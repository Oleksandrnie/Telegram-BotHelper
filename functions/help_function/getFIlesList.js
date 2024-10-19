const fs = require('fs');
const path = require('path');

function getFilesList(directory) {
	return fs.readdirSync(directory).map(file => path.basename(file));
}

module.exports = { getFilesList };
