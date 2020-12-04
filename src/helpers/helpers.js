/**
 * Returns true if the value is empty, otherwise it returns false. The value is deemed to be empty if it is either:
 *
 * null
 * undefined
 * a zero-length array
 * a zero-length string
 */
const isEmpty = function( obj ) {
    return ( obj == null ) || ( obj === '' ) || ( Array.isArray( obj ) && obj.length === 0 );
};

const extractFromSingleQuotes = ( phrase ) => {
    const regEx = new RegExp( '^[\'].*[\']$' );
    let stringToReturn = '';

    if( phrase.match( regEx ) ) {
        stringToReturn = phrase.substr( 1, phrase.length );
        stringToReturn = stringToReturn.substr( 0, phrase.length - 2 );
    }

    return stringToReturn;
};

const extractFromDoubleQuotes = ( phrase ) => {
    const regEx = new RegExp( '^["].*["]$' );
    let stringToReturn = '';

    if( phrase.match( regEx ) ) {
        stringToReturn = phrase.substr( 1, phrase.length );
        stringToReturn = stringToReturn.substr( 0, phrase.length - 2 );
    }

    return stringToReturn;
};

const extractFromParentheses = ( phrase ) => {
    const regEx = new RegExp( '^[(].*[)]$' );
    let stringToReturn = '';

    if( phrase.match( regEx ) ) {
        stringToReturn = phrase.substr( 1, phrase.length );
        stringToReturn = stringToReturn.substr( 0, phrase.length - 2 );
    }

    return stringToReturn;
};

module.exports = {
    isEmpty,
    extractFromSingleQuotes,
    extractFromDoubleQuotes,
    extractFromParentheses
};