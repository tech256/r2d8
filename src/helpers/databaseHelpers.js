const db = require( '../../config/database' );
const logger = require( '../logger' );

const setupDB = async() => {
    try {
        await db.authenticate();
        
        try {
            await db.sync();
        } catch ( err ) {
            logger.log( 'error', err );
        }
    } catch ( err ) {
        logger.log( 'error', err );
    }
};

module.exports = {setupDB};