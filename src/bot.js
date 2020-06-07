require( 'dotenv' ).config();
const SlackBot = require( 'slackbots' );
const logger = require( './logger' );
const messageHelper = require( './helpers/messageHelper' );

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

        // For tech256, the bot's name is "bot", but this code should otherwise be agnostic and shouldn't care about the string "bot"
        bot.getUserId( `${bot.name}` ).then( ( uid ) => {
            process.env.BOT_ID = uid;
            logger.log( 'debug', `BOT_ID = ${uid}`);
        } );
    } );

    // close handler
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
    } );

    // error handler
    bot.on( 'error', ( error ) => logger.log( 'error', error ) );

    // message handler
    bot.on( 'message', ( event ) => {
        if ( event.type !== 'message' ) {
            return;
        }

        // Ignore messages if they are deleted or if they are from bots
        if ( event.type === 'message' && ( event.subtype === 'message_deleted' || messageHelper.messageIsFromABot( event ) ) ) {
            return;
        }

        // Parse the message to see if the user used a commmand we support
        const response = messageHelper.getMessageResponse( event );

        // Only log when the bot actually has something to say
        if ( response !== '' ) {
            logger.log( 'debug', `${process.env.ROBOT_NAME} says: ${response}` );

            // let the bot speak man!
            bot.postMessage( event.channel, response, {
                as_user: true
            } );
        }
    } );
};

module.exports = {
    startBot
};
