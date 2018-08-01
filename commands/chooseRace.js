const logger = require('../logger.js');
const {
  characters
} = require('../database.js');
const Character = require('../classes/Character.js');

module.exports = {
  name: 'chooseRace',
  description: 'Use this method to choose a race for your character. Not available if you have already chosen a race.',
  execute(message) {
    logger.debug('Executing chooseRace');
    const key = message.author.id;

    if (!characters.has(message.author.id)) {
      logger.debug('Creating non-existent character for user');
      characters.set(message.author.id, new Character(key));
    }
    const usersCharacter = characters.get(key);

    if (usersCharacter.race) {
      return message.reply(`You have already selected a race! You are a(n) ${usersCharacter.race.name}.`);
    }

    let raceListString = usersCharacter.charClass ? usersCharacter.charClass.recommendedRaces : 'You haven\'t chosen a character class yet! You can input a race now if you like, but I recommend doing that first.';

    message.reply(`Please choose a race or input a race of your own choosing.\n${raceListString}`).then(() => {
      message.channel.awaitMessages(m => m.author.id === message.author.id, {
        maxMatches: 1,
        time: 30000,
        errors: ['time']
      })
        .then(collected => {
          logger.debug(`Message collected: ${collected.first().content}`);

          usersCharacter.race = { name: collected.first().content, ability: '' };
          characters.set(key, usersCharacter);
          //TODO: Add ability selection.
          message.channel.send(`You have chosen ${usersCharacter.race.name}. Talk with the GM about what your ability should be...(TODO: allow setting the ability?)`);
        }).catch((error) => {
          logger.debug(error);
          message.reply('Oops! you\'ve run out of time to select!');
        });
    });
  }
};
