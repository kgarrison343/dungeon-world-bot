const logger = require('../logger.js');
const { characters, getCharacterForUser } = require('../database.js');
const Character = require('../classes/Character.js');

module.exports = {
	name: 'character',
	description: 'Retrieves the user\'s character or creates one if the user does not have one yet.',
	execute(message) {
		logger.debug('Executing character (not like that)');
		let newChar = false;
		if(!characters.has(message.author.id)){
			logger.debug('Creating non-existent character for user');
			characters.set(message.author.id, new Character(message.author.id));
			newChar = true;
		}
		
		const usersCharacter = characters.get(message.author.id);
		
		if(!newChar){
			//TODO: make a embed that displays character information.
			message.reply(`Here is your character! ${usersCharacter.userId}`)
		}
		else {
			//TODO: Lets put the character creation commands in separate files and write this to 
			message.reply('Welcome! Please start creating your character with the following commands. I suggest starting with chooseCharacter!');
		}
	}
}