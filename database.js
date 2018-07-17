const Enmap = require('enmap');
const SQLite = require('enmap-sqlite');

const charTable = new Enmap({provider: new SQLite({name: 'characters'})});

module.exports = {
	characters: charTable,
	getCharacterForUser: (userId) => {
		charTable.get(userId);
	}
}