const parseKarma = require( '../parseKarma' );
const karma = require( '../../karma' );

describe( 'parseKarma', () => {
    let event = {};

    beforeEach( async() => {
        event.text = '';
    } );
    describe( 'increment', () => {
        describe( 'single word', () => {
            test( 'simple case', async() => {
                event.text = 'racecar++';

                karma.increment = jest.fn().mockResolvedValue( 'inconsequental to this test' );
            
                await parseKarma.handleKarma( event );
                expect( karma.increment ).toHaveBeenCalledTimes( 1 );
                expect( karma.increment ).toHaveBeenCalledWith( 'racecar' );
            } );
            test( 'in middle of string ', async() => {
                event.text = 'this is the foo++ song that never ends';
                
                karma.increment = jest.fn().mockResolvedValue( 'scooby-dooby-do' );
                
                await parseKarma.handleKarma( event );
                expect( karma.increment ).toHaveBeenCalledTimes( 1 );
                expect( karma.increment ).toHaveBeenCalledWith( 'foo' );
            } );
        } );
          
        describe( 'phrase', () => {
            test( 'surrounded by single quotes', async()=> {
                event.text = '\'round the rugged rock the ragged rascal ran\'++';
              
                const expectedString = 'round the rugged rock the ragged rascal ran';
                karma.increment = jest.fn()
                    .mockResolvedValue( 'in the middle of the night' )
                    .mockName( 'ki' );
            
                await parseKarma.handleKarma( event );
                expect( karma.increment ).toHaveBeenCalledTimes( 1 );
                expect( karma.increment ).toHaveBeenCalledWith( expectedString );
            } );

            test( 'surrounded by double quotes', async()=> {
                event.text = '"double bubble double trouble"++';
              
                const expectedString = 'double bubble double trouble';
                karma.increment = jest.fn().mockResolvedValue( 'everybody plays the fool' );
            
                await parseKarma.handleKarma( event );
                expect( karma.increment ).toHaveBeenCalledTimes( 1 );
                expect( karma.increment ).toHaveBeenCalledWith( expectedString );
            } );

            test( 'surrounded by parentheses', async()=> {
                event.text = '(your mamas on crack rock)++';
              
                const expectedString = 'your mamas on crack rock';
                karma.increment = jest.fn().mockResolvedValue( 'I bet you weren\'t expecting this' );
            
                await parseKarma.handleKarma( event );
                expect( karma.increment ).toHaveBeenCalledTimes( 1 );
                expect( karma.increment ).toHaveBeenCalledWith( expectedString );

            } );
        } );
    } );
    describe( 'decrement', () => {
        describe( 'single word', () => {
            test( 'simple case ', async() => {
                event.text = 'foo--';
        
                karma.decrement = jest.fn().mockResolvedValue( 'don\'t care' );
            
                await parseKarma.handleKarma( event );
                expect( karma.decrement ).toHaveBeenCalledTimes( 1 );
                expect( karma.decrement ).toHaveBeenCalledWith( 'foo' );
            } );
            test( 'in middle of string ', async() => {
                event.text = 'this is the oof-- that never ends';
            
                const expectedString = 'oof';
                karma.decrement = jest.fn().mockResolvedValue( 'I\'ll have a blue Christmas' );
            
                await parseKarma.handleKarma( event );
                expect( karma.decrement ).toHaveBeenCalledTimes( 1 );
                expect( karma.decrement ).toHaveBeenCalledWith( expectedString );
            } );
        } );

        describe( 'phrase', () => {
            test( 'surrounded by single quotes', async()=> {
                event.text = '\'I am the monarch of the sea\'--';
            
                const expectedString = 'I am the monarch of the sea';
                karma.decrement = jest.fn().mockResolvedValue( 'fa la la la la' );
          
                await parseKarma.handleKarma( event );
                expect( karma.decrement ).toHaveBeenCalledTimes( 1 );
                expect( karma.decrement ).toHaveBeenCalledWith( expectedString );
            } );

            test( 'surrounded by double quotes', async()=> {
                event.text = '"Good King Wenceslas looked out On the Feast of Stephen"--';
            
                const expectedString = 'Good King Wenceslas looked out On the Feast of Stephen';
                karma.decrement = jest.fn().mockResolvedValue( 'foo better best' );
          
                await parseKarma.handleKarma( event );
                expect( karma.decrement ).toHaveBeenCalledTimes( 1 );
                expect( karma.decrement ).toHaveBeenCalledWith( expectedString );
            } );

            test( 'surrounded by parentheses', async()=> {
                event.text = '(that dont impress me much)--';
            
                const expectedString = 'that dont impress me much';
                karma.decrement = jest.fn().mockResolvedValue( expectedString );
          
                await parseKarma.handleKarma( event );
                expect( karma.decrement ).toHaveBeenCalledTimes( 1 );
                expect( karma.decrement ).toHaveBeenCalledWith( expectedString );
            } );
        } );
    } );

    describe( 'extractAsNeeded', () => {
        test( 'phrase surrounded by single quotes', () => {
            const phrase = '\'fooey\'';
            const returnedPhrase = parseKarma.extractAsNeeded( phrase );
            expect( returnedPhrase ).toEqual( 'fooey' );
        } );

        test( 'phrase surrounded by double quotes', () => {
            const phrase = '"fooby"';
            const returnedPhrase = parseKarma.extractAsNeeded( phrase );
            expect( returnedPhrase ).toEqual( 'fooby' );
        } );

        test( 'phrase surronded by parentheses', () => {
            const phrase = '(phooey)';
            const returnedPhrase = parseKarma.extractAsNeeded( phrase );
            expect( returnedPhrase ).toEqual( 'phooey' );
        } );
    } );
} );