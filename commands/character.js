const logger = require('../logger.js');
const { characters, getCharacterForUser } = require('../database.js');
const Character = require('../classes/Character.js');

module.exports = {
	name: 'character',
	description: 'Retrieves the user\'s character or creates one if the user does not have one yet.',
	execute(message) {
		logger.debug('Executing character (not like that)');
		if(!characters.has(message.author.id)){
			logger.debug('Creating non-existent character for user');
			characters.set(message.author.id, new Character(message.author.id));
		}
		
		const usersCharacter = characters.get(message.author.id);
		message.reply(`Here is your character! ${usersCharacter.userId}`)
		//TODO: create character creation questionnaire.
	}
}