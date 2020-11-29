require( 'dotenv' ).config();
const Phrase = require( '../../../models/phrase' );
const karma = require( '../karma.js' );
const db = require( '../../../config/database' );
const databaseHelpers = require( '../databaseHelpers' );

describe( 'Karma', () => {
    describe( 'getPhraseFromDatabase', () => {
        beforeEach( async() => {
            databaseHelpers.setupDB = jest.fn();
        } );
        describe( 'phrase', () => {
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
        } );
        it( 'calls setupDB only once', async() => {
            Phrase.findAll = jest.fn();

            await karma.getPhraseFromDatabase( 'foo bar baz' );
            expect( databaseHelpers.setupDB ).toHaveBeenCalledTimes( 1 );
        } );
    } );
} );