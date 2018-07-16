module.exports = {
  name: 'roll',
  description: 'Roll 2d6 to determine success or failure of an action.',
  usage: '[+/-<modifier>]',
  handleErrors: true,
  execute(message, args) {
    const modifier = determineModifier(args);

    if (Number.isNaN(modifier)) {
      return {
        success: false,
        reason: 'Invalid Arguments'
      };
    }

    const result = rollForSuccess(modifier);
    message.channel.send(`Message: ${result.message}\nRoll: ${result.rollResult}`);
    return {
      success: true
    };
  }
};

function rollForSuccess(modifier) {
  const rollResult = generateRandomNumber(6) + generateRandomNumber(6) + modifier;
  let message = '';
  if (rollResult <= 6) {
    message = 'Mark XP and the GM decides what happens!';
  } else if (rollResult < 10) {
    message = 'You do it, but complications occur!';
  } else {
    message = 'No sweat!';
  }

  return {
    rollResult,
    message
  };
}

function determineModifier(args) {
  // No arguments, no modifier
  if (!args.length) {
    return 0;
  }

  // If there's only one argument it had better be a number!
  if (args.length === 1) {
    return parseInt(args[0]);
  }

  // If there are 2 arguments, then the first must be '+' or '-', otherwise the
  // command is invalid.
  if (args.length === 2) {
    let inverter = 1;

    if (args[0] === '-') {
      inverter = -1;
    } else if (args[0] !== '+') {
      return NaN;
    }
    return parseInt(args[1]) * inverter;
  }
  // If there are more than 2 argmuments, the command is invalid.
  return NaN;
}

//Generates a random int with a minimum of 1 and a max of the provided argument
function generateRandomNumber(max) {
  return Math.floor(Math.random() * Math.floor(max)) + 1;
}
