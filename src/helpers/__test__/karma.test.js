const Phrase = require( '../../../models/phrase' );
const karma = require( '../karma' );
const karmaHelpers = require( '../karmaHelpers' );
const databaseHelpers = require( '../databaseHelpers' );
const logger = require( '../../logger' );

describe( 'Karma', () => {
    describe( 'increment', () => {
        beforeEach( async() => {
            databaseHelpers.setupDB = jest.fn();
        } );
        test( 'calls getPhraseFromDatabase once', async() => {
            karmaHelpers.getPhraseFromDatabase = jest.fn().mockResolvedValue( ['45 Savage'] );
            Phrase.increment = jest.fn().mockResolvedValue( 'a' );
            const phrase = 'foobarbaz';
            await karma.increment( phrase );
            
            await expect( karmaHelpers.getPhraseFromDatabase ).toHaveBeenCalledTimes( 1 );
            await expect( karmaHelpers.getPhraseFromDatabase ).toHaveBeenCalledWith( phrase );
        } );
        describe( 'message exists in database', () => {
            describe( 'Phrase.increment', () => {
                beforeEach( async() => {
                    karmaHelpers.getPhraseFromDatabase = jest.fn().mockResolvedValue( ['not a real return value'] );
                } );
                test( 'is called once', async() => {
                    Phrase.increment = jest.fn().mockResolvedValue( 'a' ).mockName( 'increment mock' );
    
                    await karma.increment( 'foo' );
                    expect( Phrase.increment ).toHaveBeenCalledTimes( 1 );
    
                    const foo = {
                        plain: true,
                        returning: true,
                        where: {
                            message: 'foo'
                        }
                    };
                    expect( Phrase.increment ).toHaveBeenCalledWith( 'points', foo );
                } );
                test( 'returns "phrase: pointValue"', async() => {
                    const annoyingReturnObject = [
                        [{
                            message: 'bye bye love',
                            points: '-5'
                        }]
                    ];
                    Phrase.increment = jest.fn().mockResolvedValue( annoyingReturnObject ).mockName( 'increment mock' );
    
                    const returnedString = await karma.increment( 'foo' );
                    expect( returnedString ).toEqual( 'bye bye love: -5' );
                } );

                test( 'logs error on throw', async() => {
                    const incrementError = new Error( 'increment' );
                    Phrase.increment = jest.fn().mockImplementation( () => {
                        throw incrementError;
                    } );
                    
                    logger.log = jest.fn();

                    await karma.increment( 'foobarbaz' );
                    expect( logger.log ).toHaveBeenCalledTimes( 1 );
                    expect( logger.log ).toHaveBeenCalledWith( incrementError );
                } );
            } );
        } );
        describe( 'message does not exist in database', () => {
            test( 'returns "message: points"', async() => {
                karmaHelpers.getPhraseFromDatabase = jest.fn().mockResolvedValue( [] );
                karmaHelpers.addPhrase = jest.fn().mockResolvedValue( {message: 'a message', points: 33} );

                const returnValue = await karma.increment( 'some message' );
                expect( returnValue ).toEqual( 'a message: 33' );
            } );
            describe( 'karmaHelpers.addPhrase', () => {
                beforeEach( async() => {
                    karmaHelpers.getPhraseFromDatabase = jest.fn().mockResolvedValue( [] );
                } );
                test( 'is called once', async() => {
                    karmaHelpers.addPhrase = jest.fn();
                    const message = 'test message';
                    await karma.increment( message );
                    
                    expect( karmaHelpers.addPhrase ).toHaveBeenCalledTimes( 1 );
                    expect( karmaHelpers.addPhrase ).toHaveBeenCalledWith( message, 1 );
                } );
                test( 'throws error', async() => {
                    const addError = new Error( 'add error' );
                    karmaHelpers.addPhrase = jest.fn().mockImplementation( () => {
                        throw addError;
                    } );

                    logger.log = jest.fn();

                    await karma.increment( 'any message' );
                    expect( logger.log ).toHaveBeenCalledTimes( 1 );
                    expect( logger.log ).toHaveBeenCalledWith( addError );
                } );
            } );
        } );
    } );
} );