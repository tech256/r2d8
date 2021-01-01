const db = require( '../../../config/database' );
const databaseHelpers = require( '../databaseHelpers' );
const logger = require( '../../logger' );

describe( 'databaseHelpers', () => {
    describe( 'setupDB', () => {
        describe( 'calls', () => {
            beforeEach( async() => {
                db.authenticate = jest.fn().mockName( 'authenticate' );
                db.sync = jest.fn().mockName( 'sync' );
            } );
            it ( 'db.authenticate only once', async() => {
                await databaseHelpers.setupDB();
                expect( db.authenticate ).toHaveBeenCalledTimes( 1 );
            } );
            it ( 'db.sync only once', async() => {
                await databaseHelpers.setupDB();
                expect( db.sync ).toHaveBeenCalledTimes( 1 );
            } );
        } );
        describe( 'logs when', () => {
            beforeEach( async() => {
                logger.log = jest.fn().mockName( 'logger mock' );
            } );
            it( 'db.authenticate throws error', async() => {
                const authenticateError = new Error( 'authenticate error' );
                db.authenticate = jest.fn()
                    .mockImplementation( () => {throw authenticateError;} ).mockName( 'authenticate throws' );
                
                await databaseHelpers.setupDB();
                expect( logger.log ).toHaveBeenCalledTimes( 1 );
                expect( logger.log ).toHaveBeenCalledWith( 'error', authenticateError );
            } );
            it( 'db.sync throws Error', async() => {
                const syncError = new Error( 'sync error' );
                db.sync = jest.fn().mockName( 'sync throws' );
                db.authenticate = jest.fn()
                    .mockImplementation( () => {throw syncError;} ).mockName( 'sync throws' );
                
                await databaseHelpers.setupDB();
                expect( logger.log ).toHaveBeenCalledTimes( 1 );
                expect( logger.log ).toHaveBeenCalledWith( 'error', syncError );
            } );
        } );
    } );
} );
