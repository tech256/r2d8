const karma = require( '../karma' );
const { isEmpty } = require( './helpers' );
const helpers = require( './helpers' );

const handleKarma = async( event ) => {
    const message = event.text;
    
    const addKarma = new RegExp( '\\w*[+][+]' );
    const subtractKarma = new RegExp( '\\w*[-][-]' );
    const topKarma = new RegExp( '^!karma --top$|^!karma -t$' );
    const bottomKarma = new RegExp( '^!karma --bottom$|^!karma -b$' );
    const points = new RegExp( '^!karma .+$' );
  
    // !karma @userName/"some phrase"/'some phrase'/(some phrase)
    // !karma --top || !karma -t
    // !karma --bottom || !karma -b
    // const phraseKarma = new RegExp( '^!karma ' );
  
    let response = '';
  
    if ( message.match( addKarma ) ) {
        // pull ++ off end of string
        let noIncrementString = message.substring( 0, message.length - 2 );
        // TODO: remove '', "", or ()
        response = await karma.increment( noIncrementString );
    }
      
    else if( message.match( subtractKarma ) ) {
        // pull -- off end of string
        let noDecrementString = message.substring( 0, message.length - 2 );
        // TODO: remove '', "", or ()
          
        response = await karma.decrement( noDecrementString );
    }

    return response;
};

const extractAsNeeded = ( phrase ) => {
    const singleQuoteExtractionResult = helpers.extractFromSingleQuotes( phrase );
    if ( !( isEmpty( singleQuoteExtractionResult ) ) ) {
        return singleQuoteExtractionResult;
    }

    const doubleQuoteExtractionResult = helpers.extractFromDoubleQuotes( phrase );
    if( !( isEmpty( doubleQuoteExtractionResult ) ) ) {
        return doubleQuoteExtractionResult;
    }

    const parenthesesExtractionResult = helpers.extractFromParentheses( phrase );
    if( !( isEmpty( parenthesesExtractionResult ) ) ) {
        return parenthesesExtractionResult;
    }
};

module.exports = {handleKarma, extractAsNeeded};