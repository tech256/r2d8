const Phrase = require( '../../models/phrase' );
const karma = require( '../karma' );
const karmaHelpers = require( '../helpers/karmaHelpers' );
const databaseHelpers = require( '../helpers/databaseHelpers' );
const logger = require( '../logger' );

describe( 'Karma', () => {
    beforeEach( async() => {
        databaseHelpers.setupDB = jest.fn();
    } );
    describe( 'increment', () => {
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
                    //simulate Phrase.increment internally throws and catches its error
                    Phrase.increment = jest.fn().mockResolvedValue( undefined );
                    
                    logger.log = jest.fn().mockName( 'increment error' );

                    await karma.increment( 'foobarbaz' );
                    expect( logger.log ).toHaveBeenCalledTimes( 1 );

                    const expectedError = new TypeError( 'Cannot read property \'0\' of undefined' );
                    expect( logger.log ).toHaveBeenCalledWith( 'error', expectedError );
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
                    const returnedMessage = {
                        message: 'foo bar baz',
                        points: 33
                    };
                    karmaHelpers.addPhrase = jest.fn().mockResolvedValue( returnedMessage );
                    
                    const message = 'test message';
                    await karma.increment( message );
                    
                    expect( karmaHelpers.addPhrase ).toHaveBeenCalledTimes( 1 );
                    expect( karmaHelpers.addPhrase ).toHaveBeenCalledWith( message, 1 );
                } );
                test( 'throws error', async() => {
                    //simulate karma.addPhrase internally throws and catches its error
                    karmaHelpers.addPhrase = jest.fn().mockResolvedValue( undefined );

                    logger.log = jest.fn();

                    await karma.increment( 'any message' );
                    expect( logger.log ).toHaveBeenCalledTimes( 1 );

                    const expectedError = new TypeError( 'Cannot read property \'message\' of undefined' );
                    expect( logger.log ).toHaveBeenCalledWith( 'error', expectedError );
                } );
            } );
        } );
    } );
    describe( 'decrement', () => {
        test( 'calls getPhraseFromDatabase once', async() => {
            karmaHelpers.getPhraseFromDatabase = jest.fn().mockResolvedValue( ['45 Savage'] );
            Phrase.increment = jest.fn().mockResolvedValue( 'a' );
            const phrase = 'foobarbaz';
            await karma.decrement( phrase );
            
            await expect( karmaHelpers.getPhraseFromDatabase ).toHaveBeenCalledTimes( 1 );
            await expect( karmaHelpers.getPhraseFromDatabase ).toHaveBeenCalledWith( phrase );
        } );

        describe( 'message exists in database', () => {
            describe( 'Phrase.decrement', () => {
                beforeEach( async() => {
                    karmaHelpers.getPhraseFromDatabase = jest.fn().mockResolvedValue( ['not a real return value'] );
                } );
                test( 'is called once', async() => {
                    Phrase.decrement = jest.fn().mockResolvedValue( 'a' ).mockName( 'increment mock' );
    
                    await karma.decrement( 'foo' );
                    expect( Phrase.decrement ).toHaveBeenCalledTimes( 1 );
    
                    const foo = {
                        plain: true,
                        returning: true,
                        where: {
                            message: 'foo'
                        }
                    };
                    expect( Phrase.decrement ).toHaveBeenCalledWith( 'points', foo );
                } );
                test( 'returns "phrase: pointValue"', async() => {
                    const annoyingReturnObject = [
                        [{
                            message: 'bye bye love',
                            points: '-5'
                        }]
                    ];
                    Phrase.decrement = jest.fn().mockResolvedValue( annoyingReturnObject ).mockName( 'increment mock' );
    
                    const returnedString = await karma.decrement( 'foo' );
                    expect( returnedString ).toEqual( 'bye bye love: -5' );
                } );

                test( 'logs error on throw', async() => {
                    // simulate Phras.decrement internally threw and caught erro
                    Phrase.decrement = jest.fn().mockResolvedValue( undefined );
                    
                    logger.log = jest.fn();

                    await karma.decrement( 'foobarbaz' );
                    expect( logger.log ).toHaveBeenCalledTimes( 1 );

                    const expectedError = TypeError( 'Cannot read property \'0\' of undefined' );
                    expect( logger.log ).toHaveBeenCalledWith( 'error',  expectedError );
                } );
            } );
        } );
        describe( 'message does not exist in database', () => {
            test( 'returns "message: points"', async() => {
                karmaHelpers.getPhraseFromDatabase = jest.fn().mockResolvedValue( [] );
                karmaHelpers.addPhrase = jest.fn().mockResolvedValue( {message: 'a message', points: 33} );

                const returnValue = await karma.decrement( 'some message' );
                expect( returnValue ).toEqual( 'a message: 33' );
            } );
            describe( 'karmaHelpers.addPhrase', () => {
                beforeEach( async() => {
                    karmaHelpers.getPhraseFromDatabase = jest.fn().mockResolvedValue( [] );
                } );
                test( 'is called once', async() => {
                    karmaHelpers.addPhrase = jest.fn();
                    const message = 'test message';
                    await karma.decrement( message );
                    
                    expect( karmaHelpers.addPhrase ).toHaveBeenCalledTimes( 1 );
                    expect( karmaHelpers.addPhrase ).toHaveBeenCalledWith( message, -1 );
                } );
                test( 'throws error', async() => {
                    // simulate karmaHelpers.addPhrase throwing and catching an error internally
                    karmaHelpers.addPhrase = jest.fn().mockResolvedValue( undefined );
                    logger.log = jest.fn();

                    await karma.decrement( 'any message' );
                    expect( logger.log ).toHaveBeenCalledTimes( 1 );

                    const expectedError = TypeError( 'Cannot read property \'message\' of undefined' );
                    expect( logger.log ).toHaveBeenCalledWith( 'error', expectedError );
                } );
            } );
        } );
    } );
} );