const constants = require('./constants.js');

const messageIsFromABot = function (event) {
  if (event.type === 'message' && (event.subtype === 'bot_message' ||
      (event.bot_profile !== null && event.bot_profile !== undefined && event.bot_profile.name == 'bot'))) {
    return true;
  }
  return false;
}

const getMessageResponse = function (event) {
  // console.debug(JSON.stringify(event, null, 2))
  // console.debug(process.env.ROBOT_NAME);
  const message = event.text;

  const whereIs = new RegExp(`where is ${process.env.ROBOT_NAME}`, 'i')
  const wheres = new RegExp(`where's ${process.env.ROBOT_NAME}`, 'i')
  const thanks = new RegExp(`thanks ${process.env.ROBOT_NAME}`, 'i')
  const thankYou = new RegExp(`thank you ${process.env.ROBOT_NAME}`, 'i')
  const welcome = new RegExp(`^!welcome`, 'i')


  let response = '';

  // user example: where is R2D8?
  // user example: where's R2D8?
  if (message.match(whereIs) != null || message.match(wheres) != null) {
    response = `There is no ${process.env.ROBOT_NAME}. There is only Zuul.`;
  }

  // user example: thank you R2D8
  // user example: thanks R2D8
  else if (message.match(thanks) != null || message.match(thankYou) != null) {
    response = `At your service.`;
  }

  // user example: top o the morn
  // user example: top of the morn
  // user example: top o the mornin
  // user example: top of the mornin
  // user example: top o the morning
  // user example: top of the morning
  else if (message.match(/\btop o.? the (morn|mornin)/i) != null) {
    response = `And the rest of the day to yas.`;
  }
  // user example: @channel
  else if (message.match(/@channel/)) {
    // response = 'Please use `@here` for group notifications instead. This is a thoughtful alternative that avoids unnecessary notifications sent to inactive users. (Repeated `@channel` usage is considered a CoC violation.)';
    response = constants.USE_HERE_INSTEAD;
  }
  // user example: !welcome
  else if ((message.match(welcome) != null) && 
      (process.env.ENABLE_WELCOME_MESSAGE === 'true' || process.env.ENABLE_WELCOME_MESSAGE === true)) {
    response = constants.COC;
  }

  // console.info(`response: ${response}`)
  return response;
}

module.exports = {
  messageIsFromABot,
  getMessageResponse
};