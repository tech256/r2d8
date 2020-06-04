const constants = require( './constants.js' );

const messageIsFromABot = function( event ) {
    if ( event.type === 'message' && ( event.subtype === 'bot_message' ||
      ( event.bot_profile !== null && event.bot_profile !== undefined && event.bot_profile.name == process.env.ROBOT_NAME ) ) ) {
        return true;
    }
    return false;
};

const getMessageResponse = function( event ) {
    const message = event.text;
    let response = '';

    if( message === null || message === undefined || messageIsFromABot( event ) ) {
        return response;
    }

    const whereIs = new RegExp( `where is ${process.env.ROBOT_NAME}`, 'i' );
    const whereIsUserId = new RegExp( `where is <@${process.env.BOT_ID}>`, 'i' );
  
    const wheres = new RegExp( `where.s ${process.env.ROBOT_NAME}`, 'i' );
    const wheresUserId = new RegExp( `where.s <@${process.env.BOT_ID}>`, 'i' );

    const thanks = new RegExp( `thanks ${process.env.ROBOT_NAME}`, 'i' );
    const thanksUserId = new RegExp( `thanks <@${process.env.BOT_ID}>`, 'i' );

    const thankYou = new RegExp( `thank you ${process.env.ROBOT_NAME}`, 'i' );
    const thankYouUserId = new RegExp( `thank you <@${process.env.BOT_ID}>`, 'i' );

    const welcome = new RegExp( '^!welcome', 'i' );

    // user example: where is R2D8?
    // user example: where's R2D8?
    if ( message.match( whereIs ) != null || message.match( wheres ) != null
        || message.match( whereIsUserId ) || message.match( wheresUserId ) != null ) {
        response = `There is no ${process.env.ROBOT_NAME}. There is only Zuul.`;
    }

    // user example: thank you R2D8
    // user example: thanks R2D8
    else if ( message.match( thanks ) != null || message.match( thankYou ) != null
      || message.match( thanksUserId ) != null || message.match( thankYouUserId ) ) {
        response = 'At your service.';
    }

    // user example: top o the morn
    // user example: top of the morn
    // user example: top o the mornin
    // user example: top of the mornin
    // user example: top o the morning
    // user example: top of the morning
    else if ( message.match( /\btop o.? the (morn|mornin)/i ) != null ) {
        response = 'And the rest of the day to yas.';
    }
    // On 6.2.2020, typing "@channel" in Slack gets sent to the bot as "!channel"
    // we'll cover both cases in case Slack changes its mind.

    // user example: @channel
    else if ( message.match( /(@|!)channel/ ) ) {
    // response = 'Please use `@here` for group notifications instead. This is a thoughtful alternative that avoids unnecessary notifications sent to inactive users. (Repeated `@channel` usage is considered a CoC violation.)';
        response = constants.USE_HERE_INSTEAD;
    }
    // user example: !welcome
    else if ( ( message.match( welcome ) != null ) && 
      ( process.env.ENABLE_WELCOME_MESSAGE === 'true' || process.env.ENABLE_WELCOME_MESSAGE === true ) ) {
        response = constants.WELCOME_MESSAGE;
    }

    return response;
};

module.exports = {
    messageIsFromABot,
    getMessageResponse
};