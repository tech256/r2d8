const parseKarma = require( '../parseKarma' );
const karma = require( '../../karma' );

describe( 'parseKarma', () => {
    let event = {};

    beforeEach( async() => {
        event.text = '';
    } );
    describe( 'increment', () => {
        const expectedString = 'foo: 1';
        karma.increment = jest.fn().mockResolvedValue( expectedString );
        test( 'calls karma.increment and returns its result ', async() => {
            event.text = 'foo++';
            
            const result = await parseKarma.handleKarma( event );
            expect( karma.increment ).toHaveBeenCalledTimes( 1 );
            expect( result ).toEqual( expectedString );
        } );
    } );
    describe( 'decrement', () => {
        const expectedString = 'foo: -1';
        karma.decrement = jest.fn().mockResolvedValue( expectedString );
        test( 'calls karma.decrement and returns its result ', async() => {
            event.text = 'foo--';
            
            const result = await parseKarma.handleKarma( event );
            expect( karma.decrement ).toHaveBeenCalledTimes( 1 );
            expect( result ).toEqual( expectedString );
        } );
    } );
} );