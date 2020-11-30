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
    } );
} );