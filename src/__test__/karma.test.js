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

    describe( 'pointsForMessage', () => {
        describe( 'getPhraseFromDatabase', () => {
            describe( 'throws error', () => {
                test( 'and logs to logger', async() => {
                    logger.log = jest.fn().mockName( 'logger mock' );

                    const mockError = Error( 'foo bar baz' );
                    karmaHelpers.getPhraseFromDatabase = jest.fn().mockImplementation( () => {
                        throw mockError;
                    } );

                    await karma.pointsForMessage( 'one two three' );
                    expect( logger.log ).toHaveBeenCalledWith( 'error', mockError );
                } );

                test( 'and returns undefined', async() => {
                    const mockError = Error( 'foo bar baz' );
                    karmaHelpers.getPhraseFromDatabase = jest.fn().mockImplementation( () => {
                        throw mockError;
                    } );

                    const result = await karma.pointsForMessage( 'ichi ni san' );
                    expect( result ).toEqual( undefined );
                } );

            } );

            describe( 'returns', () => {
                test( 'well-formed object', async() => {
                    const mockPhrase = {
                        message: 'round the rugged rock, the ragged rascle ran',
                        points: 33
                    };
                    const mockResponse = [ mockPhrase ];
                    karmaHelpers.getPhraseFromDatabase = jest.fn().mockResolvedValue( mockResponse );
    
                    const result = await karma.pointsForMessage( 'foo bar baz' );
                    expect( result ).toEqual( mockPhrase.message + ': '  + mockPhrase.points );
                } );
                
                test( 'empty array', async() => {
                    const mockResponse = [];
                    karmaHelpers.getPhraseFromDatabase = jest.fn().mockResolvedValue( mockResponse );
        
                    const message = 'ha ba cha';
                    const result = await karma.pointsForMessage( message );
                    expect( result ).toEqual( message + ': 0' );
                } );
            } );
        } );
    } );

    describe( 'topPhrases', () => {
        describe( 'karmaHelpers.getTopPhrases()', () => {
            describe( 'throws error', () => {
                test( 'logs error', async() => {
                    const mockError = Error( 'some error' );
                    
                    karmaHelpers.getTopPhrases = jest.fn().mockImplementation( () => {
                        throw mockError;
                    } );

                    logger.log = jest.fn();

                    await karma.topPhrases();
                    expect( logger.log ).toHaveBeenCalledTimes( 1 );
                    expect( logger.log ).toHaveBeenCalledWith( 'error', mockError );
                } );

                test( 'returns undefined', async() => {
                    const mockError = Error( 'some error' );
                    
                    karmaHelpers.getTopPhrases = jest.fn().mockImplementation( () => {
                        throw mockError;
                    } );

                    const result = await karma.topPhrases();
                    expect( result ).toEqual( undefined );
                } );
            } );

            describe( 'returns', () => {
                test( 'empty array', async() => {
                    karmaHelpers.getTopPhrases = jest.fn().mockResolvedValue( [] );
                    const result = await karma.topPhrases();
                    expect( result ).toEqual( 'no phrases in database' );
                } );

                test( 'non-empty array', async() => {
                    const phrases = [ {
                        message: 'abc',
                        points: 123
                    },
                    {
                        message: 'hakunamatatta',
                        points: 33
                    }
                    ];

                    karmaHelpers.getTopPhrases = jest.fn().mockResolvedValue( phrases );
                    const result = await karma.topPhrases();
                    expect( result ).toEqual( 'abc: 123\nhakunamatatta: 33' );
                } );

            } );
        } );
    } );
} );