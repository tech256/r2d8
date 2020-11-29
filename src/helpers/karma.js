const Phrase = require( '../../models/phrase' );
const logger = require( '../logger' );
const dbHelpers = require( './databaseHelpers' );

//ADD RECORD
const addPhrase = async( message, points ) => {
    try {
        // TODO: return created object to calling function
        await Phrase.create( {
            message: message,
            points: points,
        } );
    } catch( err ) {
        logger.log( err );
    }
};

//EDIT RECORD
const incrementPoint = ( message, points ) => {
    const newPoints = points + 1;
    Phrase.update( {
        points: newPoints
    }, {
        where: {
            message: message
        },
        returning: true,
        plain: true
    } )
        .then( ( phrase ) =>{
            console.log( phrase[1].dataValues );
            return phrase;
        } )
        .catch( ( err ) => console.log( 'error ' + err ) );
};

//Precheck for inc, dec, create - does the phrase exist in our DB?
const getPhraseFromDatabase = async( message ) => {
    // console.log( 'in getPhraseFromDatabase' );
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

module.exports = {addPhrase, incrementPoint, getPhraseFromDatabase};
