const Phrase = require( '../models/phrase' );
const logger = require( './logger' );
const karmaHelpers = require( './helpers/karmaHelpers' );



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
            logger.log( 'error', err );
        }
    } else {
        try {
            const newPhrase = await karmaHelpers.addPhrase( message, 1 );
            return newPhrase.message + ': ' + newPhrase.points;
        } catch ( err ) {
            logger.log( 'error', err );
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
            logger.log( 'error', err );
        }
    } else {
        try {
            const newPhrase = await karmaHelpers.addPhrase( message, -1 );
            return newPhrase.message + ': ' + newPhrase.points;
        } catch ( err ) {
            logger.log( 'error', err );
        }
    }
};

const pointsForMessage = async( message ) => {
    try {
        const phrase = await karmaHelpers.getPhraseFromDatabase( message );
    
        if ( phrase.length > 0 ) {
            return phrase[0].message + ': ' + phrase[0].points;
        }
        return message + ': 0';
    } catch( err ) {
        logger.log( 'error', err );
    }
};

const formatPhrase = ( phrase ) => {
    return phrase.message + ': ' + phrase.points;
};

const extremesOutput = ( phrases ) => {
    if( phrases.length === 0 ) {
        return 'no phrases in database';
    } else if( phrases.length > 0 ) {
        const formattedPhrases = phrases.map( formatPhrase );
        return formattedPhrases.join( '\n' );
    }
};

const topPhrases = async() => {
    let phrases = [];
    
    try {
        phrases = await karmaHelpers.getTopPhrases();
    } catch( err ) {
        logger.log( 'error', err );
        return;
    }

    return extremesOutput( phrases );
};

const bottomPhrases = async() => {
    let phrases = [];
    
    try {
        phrases = await karmaHelpers.getBottomPhrases();
    } catch( err ) {
        logger.log( 'error', err );
        return;
    }

    return extremesOutput( phrases );
};

module.exports = {increment, decrement, pointsForMessage, topPhrases, bottomPhrases};
