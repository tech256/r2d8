require( 'dotenv' ).config();
const logger = require( './src/logger' );
const bot = require( './src/bot' );
const server = require( './src/server' );

// Start the bot
bot.startBot();

// Start the server so we have a page we can load
// Without this the app will crash because Heroku would have nothing to load
server.listen( process.env.PORT, function() {
    logger.log( 'debug', `Server started running on port ${process.env.PORT}.` );
} );