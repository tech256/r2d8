const Phrase = require( '../../models/phrase' );
const logger = require( '../logger' );
const karmaHelpers = require( './karmaHelpers' );



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
            const dataValues = returnedObject[0][0];
            return dataValues.message + ': ' + dataValues.points;
        } catch ( err ) {
            logger.log( err );
        }
    } else {
        try {
            const newPhrase = await karmaHelpers.addPhrase( message, 1 );
            return newPhrase.message + ': ' + newPhrase.points;
        } catch ( err ) {
            logger.log( err );
        }
    }
};

const decrement = async( message ) => {
    const phrase = await karmaHelpers.getPhraseFromDatabase( message );

    if ( phrase.length > 0 ) {
        try {
            const returnedObject = await Phrase.decrement( 'points', {
                where: {
                    message: message
                },
                returning: true,
                plain: true
            } );

            const dataValues = returnedObject[0][0];
            return dataValues.message + ': ' + dataValues.points;
        } catch ( err ) {
            logger.log( err );
        }
    } else {
        try {
            const newPhrase = await karmaHelpers.addPhrase( message, -1 );
            return newPhrase.message + ': ' + newPhrase.points;
        } catch ( err ) {
            logger.log( err );
        }
    }
};

module.exports = {increment, decrement};
