const helpers = require( '../helpers.js' );

describe( 'Helpers', () => {

    describe( 'isEmpty', () => {
        describe( 'value', () => {
            test( 'null', () => {
                expect( helpers.isEmpty( null ) ).toEqual( true );
            } );

            test( 'undefined', () => {
                expect( helpers.isEmpty( undefined ) ).toEqual( true );
            } );

            test( 'empty string', () => {
                expect( helpers.isEmpty( '' ) ).toEqual( true );
            } );

            test( 'empty array', () => {
                expect( helpers.isEmpty( [] ) ).toEqual( true );
            } );

            test( 'non-empty array', () => {
                expect( helpers.isEmpty( [ 1 ] ) ).toEqual( false );
            } );
        } );
    } );
    describe( 'strippers', () => {
        test( 'surrounded by single quotes', () => {
            const foo = '\'foo\'';
            const returned = helpers.extractFromSingleQuotes( foo );
            expect( returned ).toEqual( 'foo' );
        } );

        test( 'surrounded by double quotes', () => {
            const foo = '"foo"';
            const returned = helpers.extractFromDoubleQuotes( foo );
            expect( returned ).toEqual( 'foo' );
        } );

        test( 'surrounded by parentheses', () => {
            const foo = '(foo)';
            const returned = helpers.extractFromParentheses( foo );
            expect( returned ).toEqual( 'foo' );
        } );
    } );
} );