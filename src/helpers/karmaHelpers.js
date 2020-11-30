const Phrase = require( '../../models/phrase' );
const logger = require( '../logger' );
const dbHelpers = require( './databaseHelpers' );


const addPhrase = async( message, points ) => {
    try {
        // TODO: return created object to calling function
        const phrase = await Phrase.create( {
            message: message,
            points: points,
        }, {
            returning: true,
            plain: true
        } );
        return phrase;
    } catch ( err ) {
        logger.log( err );
    }
};

const updatePhrase = async( message, points ) => {
    try {
        const phrase = await Phrase.update( {
            points: points
        }, {
            where: {
                message: message
            },
            returning: true,
            plain: true
        } );
        return phrase[1].dataValues;
    } catch ( err ) {
        logger.log( err );
    }
};

//Precheck for inc, dec, create - does the phrase exist in our DB?
const getPhraseFromDatabase = async( message ) => {
    await dbHelpers.setupDB();
    try {
        const phrase = await Phrase.findAll( {
            where: {
                message: message
            }
        } );
        // console.log( JSON.stringify( phrase, null, 4 ) );
        return phrase;
    } catch ( error ) {
        logger.log( error );
    }
};

module.exports = {addPhrase, getPhraseFromDatabase, updatePhrase};