require( 'dotenv' ).config();
const logger = require( './src/logger' );
const bot = require( './src/bot' );
const server = require( './src/server' );
const karma = require( './src/helpers/karma' );
//require database
const db = require( './config/database' );
const sequelize = require( 'sequelize' );

//testDB
db.authenticate()
    .then( () => console.log( 'database connected...' ) )
    .catch( ( err ) => console.log( 'Error ' + err ) );

const data = {
    message: 'this is a test',
    points: 32,
};

db.sync().then( () => {
    // karma.addPhrase();
    const result = karma.incrementPoint( data.message, data.points );
    console.log( result );
} );

// Start the bot
// bot.startBot();

// Start the server so we have a page we can load
// Without this the app will crash because Heroku would have nothing to load
// server.listen( process.env.PORT, function() {
//     logger.log( 'debug', `Server started running on port ${process.env.PORT}.` );
// } );