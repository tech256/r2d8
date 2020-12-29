const Phrase = require( '../../../models/phrase' );
const karmaHelpers = require( '../karmaHelpers' );
const databaseHelpers = require( '../databaseHelpers' );
const logger = require( '../../logger' );

describe( 'karmaHelpers', () => {
    describe( 'getPhraseFromDatabase', () => {
        beforeEach( async() => {
            databaseHelpers.setupDB = jest.fn();
        } );
        describe( 'phrase', () => {
            test( 'exists', async() => {
                Phrase.findAll = jest.fn().mockResolvedValue( [{}] );
                const result = await karmaHelpers.getPhraseFromDatabase( 'this is a test' );
                expect( result ).toEqual( [{}] );
            } );
            test( 'does not exist', async() => {
                Phrase.findAll = jest.fn().mockResolvedValue( [] );
                const result = await karmaHelpers.getPhraseFromDatabase( 'hello' );
                expect( result ).toEqual( [] );
            } );
        } );
        test( 'calls setupDB only once', async() => {
            Phrase.findAll = jest.fn();
            await karmaHelpers.getPhraseFromDatabase( 'foo bar baz' );
            expect( databaseHelpers.setupDB ).toHaveBeenCalledTimes( 1 );
        } );
        test( 'calls logger on error', async() => {
            const getPhraseError = new Error( 'getPhraseFromDatabase Error' );
            Phrase.findAll = jest.fn().mockImplementation( () => { throw getPhraseError;} );

            logger.log = jest.fn().mockName( 'logger mock' );

            await karmaHelpers.getPhraseFromDatabase( 'fa la la' );
            expect( logger.log ).toHaveBeenCalledTimes( 1 );
            expect( logger.log ).toHaveBeenCalledWith( 'error', getPhraseError );
        } );
    } );
    describe( 'addPhrase', () => {
        describe( 'calls Phrase.create', () => {
            beforeEach( async() => {
                Phrase.create = jest.fn();
            } );
            test( 'once', async() => {
                await karmaHelpers.addPhrase( 'foobar', 33 );
                expect( Phrase.create ).toHaveBeenCalledTimes( 1 );
            } );
            test( 'with message and points', async() => {
                await karmaHelpers.addPhrase( 'foobar', 33 );

                const expectedObject1 = {
                    message: 'foobar',
                    points: 33
                };
                const expectedObject2 = {
                    returning: true,
                    plain: true
                };
                expect( Phrase.create ).toHaveBeenCalledWith( expectedObject1, expectedObject2 );
            } );
        } );
        test( 'logs error', async() => {
            const expectedError = Error( 'foobar' );
            Phrase.create = jest.fn().mockImplementation( () => {
                throw  expectedError;
            } )
                .mockName( 'Phrase.create throws error mock' );
    
            logger.log = jest.fn().mockName( 'logger mock' );
    
            await karmaHelpers.addPhrase( 'foobar', 33 );
            expect( logger.log ).toHaveBeenCalledTimes( 1 );
            expect( logger.log ).toHaveBeenCalledWith( 'error', expectedError );
        } );
        test( 'returns object from Phrase.create', async() => {
            Phrase.create = jest.fn().mockResolvedValue( {foo: 'bar'} );
            const returnValue = await karmaHelpers.addPhrase( 'some message' );
            expect( returnValue ).toEqual( {foo: 'bar'} );
        } );
    } );
    describe( 'updatePhrase', () => {
        test( 'calls Phrase.update', async() => {
            Phrase.update = jest.fn();
            const message = 'this is the song that never ends';
            const points = 33;

            const columnToUpdate = {
                points: points
            };

            const where = {
                message: message
            };

            const options = {
                plain: true,
                returning: true,
                where: where
            };
          
            await karmaHelpers.updatePhrase( message, points );
            expect( Phrase.update ).toHaveBeenCalledTimes( 1 );
            expect( Phrase.update ).toHaveBeenCalledWith( columnToUpdate, options );
        } );

        test( 'returns object', async() => {
            const mockObject =
              [null,
                  {
                      dataValues: {
                          'id': 1,
                          'message': 'this is a test',
                          'points': 32,
                      }
                  }]
            ;

            Phrase.update = jest.fn().mockResolvedValue( mockObject );
            const returnedObject = await karmaHelpers.updatePhrase( mockObject.message, mockObject.points );
            expect( returnedObject ).toEqual( mockObject[1].dataValues );
        } );

        test( 'logs error', async() => {
            const updateError = new Error( 'updateError' );
            Phrase.update = jest.fn().mockImplementation( () => {
                throw updateError;
            } )
                .mockName( 'error mock' );

            logger.log = jest.fn().mockName( 'logger mock' );

            await karmaHelpers.updatePhrase( 'foobar', 666 );
            expect( logger.log ).toHaveBeenCalledTimes( 1 );
            expect( logger.log ).toHaveBeenCalledWith( 'error', updateError );
        } );
    } );

    describe( 'getTopPhrases', () => {
        describe( 'Phrase.findAll', () => {
            describe( 'returns', () => {
                test( 'elements', async() => {
                    const mockPhrases = [{
                        message: 'this is the song that never ends',
                        points: 33
                    },
                    {
                        message: 'round the rugged rock',
                        points: 666
                    }
                    ];
                    
                    Phrase.findAll = jest.fn().mockResolvedValue( mockPhrases );
                    
                    const result = await karmaHelpers.getTopPhrases();
                    expect( result ).toEqual( mockPhrases );
                } );
        
                test( 'NO elements', async() => {
                    Phrase.findAll = jest.fn().mockResolvedValue( [] );
                    
                    const result = await karmaHelpers.getTopPhrases();
                    expect( result ).toEqual( [] );
                } );
            } );

            describe( 'throws error', () => {
                test( 'logs error', async() => {
                    const mockError = Error( 'This is a test of the emergency broadcast system' );
    
                    Phrase.findAll = jest.fn().mockImplementation( () => {
                        throw mockError;
                    } );

                    logger.log = jest.fn();

                    await karmaHelpers.getTopPhrases();
                    expect( logger.log ).toHaveBeenCalledTimes( 1 );
                    expect( logger.log ).toHaveBeenCalledWith( 'error', mockError );
                } );

            } );

            describe( 'is called with', () => {
                test( 'default points, DESC order returning true, plain true', async() => {
                    Phrase.findAll = jest.fn();

                    const firstObject = {
                        limit: 5,
                        order: [['points', 'DESC']]
                    };

                    const secondObject = {
                        returning: true,
                        plain: true
                    };

                    await karmaHelpers.getTopPhrases();
                    expect( Phrase.findAll ).toHaveBeenCalledTimes( 1 );
                    expect( Phrase.findAll ).toHaveBeenCalledWith( firstObject, secondObject );
                } );
            } );
        } );
    } );

} );