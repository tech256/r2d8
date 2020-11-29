require( 'dotenv' ).config();
const Phrase = require( '../../../models/phrase' );
const karma = require( '../karma.js' );
const db = require( '../../../config/database' );

describe( 'Karma', () => {
    describe( 'message', () => {
        beforeEach( async() => {
            db.authenticate = jest.fn().mockName( 'authenticate' );
            db.sync = jest.fn().mockName( 'sync' );
        } );
        it( 'exists', async() => {
            Phrase.findAll = jest.fn().mockResolvedValue( [{}] );
            const result = await karma.messageExists( 'this is a test' );
            expect( result ).toEqual( true );
        } );
        it( 'does not exist', async() => {
            Phrase.findAll = jest.fn().mockResolvedValue( [] );
            const result = await karma.messageExists( 'hello' );
            expect( result ).toEqual( false );
        } );
    } );
} );