const fs = require('fs');
const Discord = require('discord.js');
const logger = require('./logger.js');
const auth = require('./auth.json');
const {
  prefix
} = require('./config.json');

const bot = new Discord.Client();
bot.commands = new Discord.Collection();


const commandFiles = fs.readdirSync('./commands')
  .filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  logger.debug(`${command.name.toLowerCase()}`);
  //add the command to the list of commands
  bot.commands.set(command.name.toLowerCase(), command);
}

logger.info('initialized. logging in...');
bot.login(auth.token);

bot.on('ready', function() {
  logger.info('connected.');
  logger.info('logged in as: ' + bot.user.username + ' - (' + bot.user.id + ')');
});

bot.on('message', function(message) {
  if (message.content.substring(0, prefix.length) !== prefix || message.author.bot) {
    return;
  }

  let args = message.content.substring(prefix.length).split(/ +/);

  const commandName = args.shift().toLowerCase();

  if (!bot.commands.has(commandName)) return;

  const command = bot.commands.get(commandName);

  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!\n` + generateUsageString(command);

    return message.channel.send(reply);
  }

  try {
    const result = command.execute(message, args);
    if (command.handleErrors && result.success === false) {
      message.reply(generateErrorMessage(command, result));
    }
  } catch (error) {
    logger.error(error);
    message.reply('There was an error trying to execute that command!');
  }
});

function generateUsageString(command) {
  if (command.usage) {
    return `Usage: ${prefix}${command.name} ${command.usage}`;
  }

  return '';
}

function generateErrorMessage(command, result) {
  return `${result.reason}: ` + generateUsageString(command);
}
