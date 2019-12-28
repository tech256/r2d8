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

module.exports = logger;