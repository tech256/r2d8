const db = require( '../../config/database' );
const Phrase = require( '../../models/phrase' );
const logger = require( '../logger' );

//TODO Authenticate/Close
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

//ADD RECORD
const addPhrase = () => {
    Phrase.create( {
        message: 'this is a test',
        points: 50,
    } )
        .then( ( phrase ) => console.log( phrase ) )
        .catch( ( err ) => console.log( 'error ' + err ) );
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
    await setupDB();
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
