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
            const result = await karma.getPhraseFromDatabase( 'this is a test' );
            expect( result ).toEqual( [{}] );
        } );
        it( 'does not exist', async() => {
            Phrase.findAll = jest.fn().mockResolvedValue( [] );
            const result = await karma.getPhraseFromDatabase( 'hello' );
            expect( result ).toEqual( [] );
        } );
        it ( 'calls db.authenticate only once', async() => {
            Phrase.findAll = jest.fn();
            await karma.getPhraseFromDatabase( 'foo bar baz' );
            expect( db.authenticate ).toHaveBeenCalledTimes( 1 );
        } );
        it ( 'calls db.sync only once', async() => {
            Phrase.findAll = jest.fn();
            await karma.getPhraseFromDatabase( 'foo bar baz' );
            expect( db.sync ).toHaveBeenCalledTimes( 1 );
        } );
    } );
} );