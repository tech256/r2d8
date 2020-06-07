const constants = require( './constants.js' );
const logger = require( '../logger' );

const messageIsFromABot = function( event ) {
    const botName = new RegExp( process.env.ROBOT_NAME, 'i' );

    if ( event.type === 'message' && ( event.subtype === 'bot_message' ||
      ( !isEmpty( event.bot_profile ) && event.bot_profile.name.match( botName ) != null ) ) ) {
        return true;
    }
    return false;
};

const getMessageResponse = function( event ) {
    logger.log( 'debug', `event: ${JSON.stringify( event, null, 4 )}` );

    const message = event.text;
    let response = '';

    if( isEmpty( message ) || messageIsFromABot( event ) ) {
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

/**
 * Returns true if the value is empty, otherwise it returns false. The value is deemed to be empty if it is either:
 *
 * null
 * undefined
 * a zero-length array
 * a zero-length string
 */
const isEmpty = function( obj ) {
    return ( obj == null ) || ( obj === '' ) || ( Array.isArray( obj ) && obj.length === 0 );
};

module.exports = {
    messageIsFromABot,
    getMessageResponse
};