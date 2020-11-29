const db = require( '../../config/database' );
const logger = require( '../logger' );

const setupDB = async() => {
    try {
        await db.authenticate();
        
        try {
            await db.sync();
        } catch ( err ) {
            logger.log( err );
        }
    } catch ( err ) {
        logger.log( err );
    }
};

module.exports = {setupDB};