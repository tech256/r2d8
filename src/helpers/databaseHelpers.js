const db = require( '../../config/database' );

const setupDB = async() => {
    try {
        // console.log( 'in SetupDB' );
        await db.authenticate();
    } catch ( err ) {
        //TODO hook up to Winston
        console.log( 'Error ' + err );
    }
    try {
        // console.log( 'in dbSync' );
        await db.sync();
    } catch ( err ) {
        //TODO hook up to Winston
        console.log( 'Error ' + err );
    }
};

module.exports = {setupDB};