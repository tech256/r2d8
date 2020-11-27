const db = require( '../../config/database' );
const Phrase = require( '../../models/phrase' );

//TODO Add Karma Related Things in Here

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

module.exports = {addPhrase, incrementPoint};