const Phrase = require( '../../../models/phrase' );
const karma = require( '../karma.js' );
const databaseHelpers = require( '../databaseHelpers' );
const logger = require( '../../logger' );

describe( 'Karma', () => {
    describe( 'getPhraseFromDatabase', () => {
        beforeEach( async() => {
            databaseHelpers.setupDB = jest.fn();
        } );
        describe( 'phrase', () => {
            test( 'exists', async() => {
                Phrase.findAll = jest.fn().mockResolvedValue( [{}] );
                const result = await karma.getPhraseFromDatabase( 'this is a test' );
                expect( result ).toEqual( [{}] );
            } );
            test( 'does not exist', async() => {
                Phrase.findAll = jest.fn().mockResolvedValue( [] );
                const result = await karma.getPhraseFromDatabase( 'hello' );
                expect( result ).toEqual( [] );
            } );
        } );
        test( 'calls setupDB only once', async() => {
            Phrase.findAll = jest.fn();
            await karma.getPhraseFromDatabase( 'foo bar baz' );
            expect( databaseHelpers.setupDB ).toHaveBeenCalledTimes( 1 );
        } );
    } );
    describe( 'addPhrase', () => {
        describe( 'calls Phrase.create', () => {
            beforeEach( async() => {
                Phrase.create = jest.fn();
            } );
            test( 'once', async() => {
                await karma.addPhrase( 'foobar', 33 );
                expect( Phrase.create ).toHaveBeenCalledTimes( 1 );
            } );
            test( 'with message and points', async() => {
                await karma.addPhrase( 'foobar', 33 );

                const expectedObject = {
                    message: 'foobar',
                    points: 33
                };
                expect( Phrase.create ).toHaveBeenCalledWith( expectedObject );
            } );
        } );
        test( 'logs error', async() => {
            const expectedError = Error( 'foobar' );
            Phrase.create = jest.fn().mockImplementation( () => { throw  expectedError;} )
                .mockName( 'Phrase.create throws error mock' );
    
            logger.log = jest.fn().mockName( 'logger mock' );
    
            await karma.addPhrase( 'foobar', 33 );
            expect( logger.log ).toHaveBeenCalledTimes( 1 );
            expect( logger.log ).toHaveBeenCalledWith( expectedError );
        } );
    } );
} );