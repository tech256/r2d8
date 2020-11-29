const db = require( '../../../config/database' );
const databaseHelpers = require( '../databaseHelpers' );

describe( 'databaseHelpers', () => {
    describe( 'setupDB', () => {
        beforeEach( async() => {
            db.authenticate = jest.fn().mockName( 'authenticate' );
            db.sync = jest.fn().mockName( 'sync' );
        } );
        it ( 'calls db.authenticate only once', async() => {
            await databaseHelpers.setupDB();
            expect( db.authenticate ).toHaveBeenCalledTimes( 1 );
        } );
        it ( 'calls db.sync only once', async() => {
            await databaseHelpers.setupDB();
            expect( db.sync ).toHaveBeenCalledTimes( 1 );
        } );
    } );
} );