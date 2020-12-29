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
        logger.log( 'error',err );
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
        logger.log( 'error', err );
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
        logger.log( 'error', error );
    }
};

const getTopPhrases = async( maxNumberOfResults=5 ) => {
    return await getPhrases( maxNumberOfResults, true );
};

const getPhrases = async( maxNumberOfResults, isAscending ) => { 
    await dbHelpers.setupDB();
    
    let phrases = [];
    try {
        phrases = await Phrase.findAll( {
            limit: maxNumberOfResults,
            order: [isAscending ? ['points', 'DESC'] : ['points', 'ASC']],
        },
        {
            returning: true,
            plain: true
        } );
        console.log( JSON.stringify( phrases, null, 2 ) );
        
    } catch( err ) {
        console.log( 'IN CATCH' );
        console.log( 'err: ' + err );
        logger.log( 'error', err );
    }

    return phrases;
};

module.exports = {addPhrase, getPhraseFromDatabase, updatePhrase, getTopPhrases};