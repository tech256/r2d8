require('dotenv').config();
const SlackBot = require( 'slackbots' );
const logger = require( './logger' );

// declare the bot variable so we can use it later
let bot;

const startBot = () => {
    // setup the bot
    bot = new SlackBot( {
        token: process.env.SLACK_TOKEN,
        name: process.env.ROBOT_NAME
    } );

    // start handler
    bot.on( 'start', ( error ) => {
        if ( error ) {
            // login function is what actually starts the RTM connection. set retry to 10 secs if connection fails
            setTimeout( bot.login(), 10000 );
        }
        logger.log( 'info', `Bot ${process.env.ROBOT_NAME} has started.` );
    });

    // start handler
    bot.on( 'close', ( error ) => {
        try {
            // this will attempt to reconnect before failing the bot. Will also log the error that occurred.
            if ( error ) {
                // execute start function (includes creating bot again and refreshing RTM session
                startBot();
            }
        } catch ( error ) {
            // logs bot reconnect error
            logger.log( 'info', 'Websocket connection to Slack has been closed' );
            logger.log( 'info', `Bot ${process.env.ROBOT_NAME} has stopped.` );
            logger.log( 'error', `Bot crashed.. \n ${error}` );
        }
    });

    // error handler
    bot.on( 'error', ( error ) => logger.log( 'error', error ) );

    // message handler
    bot.on( 'message', ( event ) => {
        if( event.type !== 'message' ) {
            return;
        }

        // Ignore messages if they are deleted or if they are from bots
        if ( event.type === 'message' && ( event.subtype === 'message_deleted' || messageIsFromABot( event ) ) ) {
            return;
        }

        // Parse the message to see if the user used a commmand we support
        handleMessage( event );
    });
}

const handleMessage = function ( event ) {
    var message = event.text,
        response = '';

    // user example: where is R2D8?
    // user example: where's R2D8?
    // bot name is case sensitive
    if ( message.includes( `where is ${process.env.ROBOT_NAME}?`) || message.includes( `where's ${process.env.ROBOT_NAME}?` ) ) {
        response = `There is no ${process.env.ROBOT_NAME}. There is only Zuul.`;
    }
    // user example: thank you R2D8
    // user example: thanks R2D8
    // bot name is case sensitive
    else if ( message.includes( `thanks ${process.env.ROBOT_NAME}` ) || message.includes( `thank you ${process.env.ROBOT_NAME}` ) ) {
        response = `At your service.`;
    }
    // user example: top o. the mornin
    else if ( message.match( /\btop o.? the mornin/i ) ) {
        response = `And the rest of the day to yourself.`;
    }
    // user example: @channel
    else if ( message.match( /@channel/ ) ) {
        response = 'Please use `@here` for group notifications instead. This is a thoughtful alternative that avoids unnecessary notifications sent to inactive users. (Repeated `@channel` usage is considered a CoC violation.)';
    }
    // user example: !welcome
    else if ( message.match( /^!welcome/i ) && process.env.ENABLE_WELCOME_MESSAGE === 'true' ) {
        response = `Welcome to :256:!

If you haven't done so already, please upload an avatar and fill out your profile. We're a friendly group–we don't bite, promise!–but we are a community that likes to know our neighbors!

There are a lot of channels here that represent different topics (e.g. #code, #testing, #jobs, etc). A lot of silliness goes down in #random. You can see our full list of channels here: https://tech256.slack.com/archives.

One thing you’ll want to do is configure your notification settings. Otherwise, Slack will likely send you many more pings and emails than you’re comfortable with! Consider muting channels that you’re less interested in. We’d rather you stick around and be comfortable than leave because you’re overwhelmed with notifications. https://tech256.slack.com/account/notifications.

If you have any questions, reach out to our moderators (listed on tech256.com). We’re happy to help. Also, please review our Code of Conduct (https://github.com/tech256/CoC). Our goal is to support an open, inclusive North Alabama tech community — please help us make Tech256 a great place for everyone.`;
    }
    else {
        // user typed something that didn't match the inputs we expected so just ignore it
    }
    
    // Only log when the bot actually has something to say
    if ( response !== '' ) {
        logger.debug( `${process.env.ROBOT_NAME} says: ${response}` );
    }

    // let the bot speak man!
    bot.postMessage( event.channel, response, { as_user: true } );
}

const messageIsFromABot = function( event ) {
    if  ( event.type === 'message' && ( event.subtype === 'bot_message' || 
        ( event.bot_profile !== null && event.bot_profile !== undefined && event.bot_profile.name == 'bot' ) ) ) {
        return true;
    }
    return false;
}

module.exports = { startBot };