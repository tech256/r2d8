const karma = require( '../karma' );
const { isEmpty } = require( './helpers' );
const helpers = require( './helpers' );

const handleKarma = async( event ) => {
    const message = event.text;
    
    const topKarma = new RegExp( '^!karma --top$|^!karma -t$' );
    const bottomKarma = new RegExp( '^!karma --bottom$|^!karma -b$' );
    const points = new RegExp( '^!karma .+$' );
  
    // !karma @userName/"some phrase"/'some phrase'/(some phrase)
    // !karma --top || !karma -t
    // !karma --bottom || !karma -b
    // const phraseKarma = new RegExp( '^!karma ' );
  
    let response = '';
  
    response = await handleIncrement( message );
    if ( !( isEmpty( response ) ) ) {
        return response;
    }
    
    response = await handleDecrement( message );
    if ( !( isEmpty( response ) ) ) {
        return response;
    }
    
};

const handleIncrement = async( message ) => {
    let response = '';
  
    const addKarma = new RegExp( '(\\w*[+][+]|^[\'].+[\'][+][+]|^["].+["][+][+]|^[(].+[)][+][+])' );
    const matched = message.match ( addKarma );

    if ( !( isEmpty( matched ) ) ) {
        // if we match, then we get back an array of matches. we only care about the first match
        const phrase = matched[0];

        // pull ++ off end of string
        const noIncrementString = phrase.substring( 0, phrase.length - 2 );
        
        // remove surrounding single or double quotes OR parentheses
        const extracted = extractAsNeeded( noIncrementString );

        // we're empty only if none of the above
        // enclosing punctuations were stripped off
        if( !( isEmpty( extracted ) ) ) {
            response = await karma.increment( extracted );
        } else {
            response = await karma.increment( noIncrementString );
        }
        return response;
    }
};

const handleDecrement = async( message ) => {
    let response = '';
  
    const subtractKarma = RegExp( '(\\w*[-][-]|^[\'].+[\'][-][-]|^["].+["][-][-]|^[(].+[)][-][-])' );
    const matched = message.match( subtractKarma );
    
    if ( !( isEmpty( matched ) ) ) {
        // if we match, then we get back an array of matches. we only care about the first match
        const phrase = matched[0];

        // pull -- off end of string
        const noDecrementString = phrase.substring( 0, phrase.length - 2 );
      
        // remove surrounding single or double quotes OR parentheses
        const extracted = extractAsNeeded( noDecrementString );

        // we're empty only if none of the above
        // enclosing punctuations were stripped off
        if( !( isEmpty( extracted ) ) ) {
            response = await karma.decrement( extracted );
        } else {
            response = await karma.decrement( noDecrementString );
        }
        return response;
    }
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

    return phrase;
};

module.exports = {handleKarma, extractAsNeeded};