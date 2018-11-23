const logger = require('../logger.js');
const fs = require('fs');
const {
  characters
} = require('../database.js');
const Character = require('../classes/Character.js');
const Discord = require('discord.js');

module.exports = {
  name: 'chooseClass',
  description: 'Use this method to choose a class for your character. Not available if you have already chosen a class.',
  execute(message) {
    logger.debug('Executing chooseClass');
    const key = message.author.id;

    if (!characters.has(message.author.id)) {
      logger.debug('Creating non-existent character for user');
      characters.set(message.author.id, new Character(key));
    }

    const usersCharacter = characters.get(key);

    if (usersCharacter.charClass) return message.reply('You have already selected a character class!');

    let classList = [];
    let classListString = '';
    let classNumber = 1;
    const classFiles = fs.readdirSync('./character_classes')
      .filter(file => file.endsWith('.json'));

    for (const file of classFiles) {
      const charClass = require(`../character_classes/${file.toLowerCase()}`);

      //add the class to the list of classes
      classList.push(charClass);
      classListString += '\n' + classNumber + ') ' + charClass.name;
      classNumber++;
    }

    message.reply(`Please choose a character class! Enter the corresponding number to select your class.${classListString}`).then(() => {
      message.channel.awaitMessages(m => m.author.id === message.author.id, {
        maxMatches: 1,
        time: 30000,
        errors: ['time']
      })
        .then(collected => {
          logger.debug(`Message collected: ${collected.first().content}`);
          let responseNumber = parseInt(collected.first());
          if (!responseNumber) return message.reply('that isn\'t a valid class! Please try again.');
          const selection = classList[responseNumber - 1];

          message.channel.send(displayClass(selection)).then(() => {
            awaitConfirmResponse(message, () => {
              usersCharacter.charClass = selection;
              characters.set(key, usersCharacter);
              message.reply(`Ok, you have chosen to be a ${selection.name}`);
            });
          });
        }).catch(() => {
          message.reply('Oops! you\'ve run out of time to select!');
        });
    });
  }
};

function displayClass(charClass){
  const classEmbed = new Discord.RichEmbed()
    .setColor('#0099ff')
    .setAuthor('Choose Class?')
    .setTitle(charClass.name)
    .setDescription(charClass.description)
    .addField('Recommended Races', charClass.recommendedRaces, true)
    .addField('Recommended Names', charClass.recommendedNames, true)
    .setFooter('Respond with yes to select this class!');

  return classEmbed;
}

function awaitConfirmResponse(message, confirmCallback){
  message.channel.awaitMessages(m => m.author.id === message.author.id, {
    maxMatches: 1,
    time: 30000,
    errors: ['time']
  }).then(collected => {
    let response = collected.first().content;
    logger.debug(`Message collected ${response}`);
    if(response.toLowerCase() === 'yes'){
      confirmCallback();
    } else if (response.toLowerCase() === 'no'){
      message.reply('Ok, your selection is cancelled');
    } else {
      message.reply('Sorry, I don\'t understand, please say Yes or No.');
      awaitConfirmResponse(message, confirmCallback);
    }
  }).catch(() => { message.reply('Oops! you\'ve run out of time to select!'); });
}
