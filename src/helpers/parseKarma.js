const karma = require( '../karma' );
const { KARMA_HELP_MENU } = require( './constants' );
const { isEmpty } = require( './helpers' );
const helpers = require( './helpers' );

const handleKarma = async( event ) => {
    const message = event.text;
    
    let response = '';
  
    // handleTop and handleBottom have to come before handleDecrement
    // because --top and --bottom will otherwise trigger a decrement operation
    response = await handleTop( message );
    if ( !( isEmpty( response ) ) ) {
        return response;
    }

    response = await handleBottom( message );
    if ( !( isEmpty( response ) ) ) {
        return response;
    }

    response = handleHelpMenu( message );
    if ( !( isEmpty( response ) ) ) {
        return response;
    }
    
    response = await handleIncrement( message );
    if ( !( isEmpty( response ) ) ) {
        return response;
    }
    
    response = await handleDecrement( message );
    if ( !( isEmpty( response ) ) ) {
        return response;
    }

    response = await handlePointCheck( message );
    if ( !( isEmpty( response ) ) ) {
        return response;
    }
    
};

const handleIncrement = async( message ) => {
    let response = '';
  
    const addKarma = new RegExp( '(^<@\\w+>[+][+]$|\\w*[+][+]|^[\'].+[\'][+][+]|^["].+["][+][+]|^[(].+[)][+][+])' );
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
        }

        return response;
    }
};

const handleDecrement = async( message ) => {
    let response = '';
  
    const subtractKarma = RegExp( '(^<@\\w+>[-][-]$|\\w*[-][-]|^[\'].+[\'][-][-]|^["].+["][-][-]|^[(].+[)][-][-])' );
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
        } 

        return response;
    }
};

const handlePointCheck = async( message ) => {
    const pointCheck = new RegExp( '^!karma .+$' );
    const matched = message.match( pointCheck );

    if ( !( isEmpty( matched ) ) ) {
        // if we match, then we get back an array of matches. There should only be one match based on the regex
        const phrase = matched[0];

        // strip off '!karma '
        const noBangKarmaSpaceString = phrase.substring( 7, phrase.length );
        const extractedString = extractAsNeeded( noBangKarmaSpaceString );
        return await karma.pointsForMessage( extractedString );
    }
};

const handleTop = async( message ) => {
    const topKarma = new RegExp( '^!karma --top$|^!karma -t$' );
    const matched = message.match( ( topKarma ) );

    if ( !( isEmpty( matched ) ) ) {
        return '*top karma*:\n' + await karma.topPhrases();
    }
};

const handleBottom = async( message ) => {
    const bottomKarma = new RegExp( '^!karma --bottom$|^!karma -b$' );
    const matched = message.match( ( bottomKarma ) );

    if ( !( isEmpty( matched ) ) ) {
        return '*bottom karma*:\n' + await karma.bottomPhrases();
    }
};

const handleHelpMenu = ( message ) => {
    const bottomKarma = new RegExp( '^!karma --help$|^!karma -h$' );
    const matched = message.match( ( bottomKarma ) );

    if ( !( isEmpty( matched ) ) ) {
        return KARMA_HELP_MENU;
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