require('dotenv').config();
const http = require( 'http' );
const SlackBot = require( 'slackbots' );
const winston = require( 'winston' );

// setup the logger to log to the console
let logger = winston.createLogger( {
    level: process.env.LOG_LEVEL,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf( info => {
            return `${info.timestamp} ${info.level.toUpperCase()} - ${info.message}`;
        } )
    )
} );

logger.add( new winston.transports.Console() );

// setup the bot
const bot = new SlackBot( {
    token: process.env.SLACK_TOKEN,
    name: process.env.ROBOT_NAME
} );

// start handler
bot.on( 'start', () => {
    logger.log( 'info', `Bot ${process.env.ROBOT_NAME} has started.` );
});

// start handler
bot.on( 'close', () => {
    logger.log( 'info', 'Websocket connection to Slack has been closed' );
    logger.log( 'info', `Bot ${process.env.ROBOT_NAME} has stopped.` );
});

// error handler
bot.on( 'error', ( error ) => logger.log( 'error', error ) );

// message handler
bot.on( 'message', ( event ) => {
    if( event.type !== 'message' ) {
        return;
    }

    // Ignore messages if they are deleted or if they are from bots
    if ( event.type === 'message' && ( event.subtype === 'message_deleted' || event.subtype === 'bot_message' ) ) {
        return;
    }

    // Parse the message to see if the user used a commmand we support
    handleMessage( event );
});

function handleMessage( event ) {
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
    else if ( message.match( /^!welcome/i ) ) {
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
    bot.postMessage( event.channel, response );
}

//create a server object:
http.createServer( function( request, response ) {
    response.writeHead( 200, { 'Content-Type': 'text/html' } ); // http header

    var url = request.url;
    if( url ==='/info' ) {
        response.write( `${process.env.ROBOT_NAME} is currently operational.` );
        response.end();
    }
    else {
        response.write( `<h1>${process.env.ROBOT_NAME}</h1>` );
        response.end();
    }
} ).listen( process.env.PORT, function() {
   logger.log( 'debug', `Server started running on port ${PROCESS.ENV.PORT}.` ); 
} );