const Phrase = require( '../../models/phrase' );
const logger = require( '../logger' );
const karmaHelpers = require ( './karmaHelpers' );



//EDIT RECORD
const increment = async( message ) => {
    const phrase = await karmaHelpers.getPhraseFromDatabase( message );

    if ( phrase.length > 0 ) {
        try {
            const returnedObject = await Phrase.increment( 'points', {
                where: {
                    message: message
                },
                returning: true,
                plain: true
            } );
            // console.log( 'back from inc: ' + JSON.stringify( returnedObject, null, 2 ) );
            // console.log( 'keys: ' + Object.keys( returnedObject ) );
            const dataValues = returnedObject[0][0];
            return dataValues.message + ': ' + dataValues.points;
        } catch ( err ) {
            logger.log( err );
        }

        // update
    } else {
        // add to db
    }
    
    // return message + points

    
};

module.exports = {increment};
