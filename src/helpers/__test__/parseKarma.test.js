const parseKarma = require( '../parseKarma' );
const karma = require( '../../karma' );
const { KARMA_HELP_MENU } = require( '../constants' );

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

            describe( 'middle of string', () => {
                test( 'happy path', async() => {
                    event.text = 'this is the foo++ song that never ends';
                    
                    karma.increment = jest.fn().mockResolvedValue( 'scooby-dooby-do' );
                    
                    await parseKarma.handleKarma( event );
                    expect( karma.increment ).toHaveBeenCalledTimes( 1 );
                    expect( karma.increment ).toHaveBeenCalledWith( 'foo' );
                } );

                describe( 'C', () => {
                    test( 'bare', async() => {
                        event.text = 'foo C++ bar';
                            
                        karma.increment = jest.fn().mockResolvedValue( 'C by itself' );
                            
                        await parseKarma.handleKarma( event );
                        expect( karma.increment ).toHaveBeenCalledTimes( 0 );
                    } );
                    describe( 'surrounded by', () => {
                        test.each`
                        input         | expected    |  testName
                        ${'(C)'}      | ${0}        | ${'parens'}
                        ${'\'C\''}    | ${0}        | ${'single quote'}
                        ${'"C"'}      | ${0}        | ${'double quote'}
                        `( '$testName', async( {input, expected, testName} ) => {
                            event.text = `foo ${input}++ bar`;

                            karma.increment = jest.fn().mockResolvedValue( `${testName} parens` );
                                
                            await parseKarma.handleKarma( event );
                            expect( karma.increment ).toHaveBeenCalledTimes( expected );
                        } );
                    } );
                    
                } );
                describe( 'c', () => {
                    test( 'bare', async() => {
                        event.text = 'foo c++ bar';
                        
                        karma.increment = jest.fn().mockResolvedValue( 'c by itself' );
                        
                        await parseKarma.handleKarma( event );
                        expect( karma.increment ).toHaveBeenCalledTimes( 0 );
                    } );
                    describe( 'surrounded by', () => {
                        test.each`
                        input         | expected    |  testName
                        ${'(c)'}      | ${0}        | ${'parens'}
                        ${'\'c\''}    | ${0}        | ${'single quote'}
                        ${'"c"'}      | ${0}        | ${'double quote'}
                        `( '$testName', async( {input, expected, testName} ) => {
                            event.text = `foo ${input}++ bar`;
        
                            karma.increment = jest.fn().mockResolvedValue( `${testName} parens` );
                                
                            await parseKarma.handleKarma( event );
                            expect( karma.increment ).toHaveBeenCalledTimes( expected );
                        } );
                    } );
                } );
                describe( 'C++', () => {
                    test( 'bare', async() => {
                        event.text = 'foo C++++ bar';
                        
                        karma.increment = jest.fn().mockResolvedValue( 'C++ by itself' );
                        
                        await parseKarma.handleKarma( event );
                        expect( karma.increment ).toHaveBeenCalledTimes( 0 );
                    } );
                    describe( 'surrounded by', () => {
                        test.each`
                        input         | expected    |  testName
                        ${'(C++)'}      | ${0}        | ${'parens'}
                        ${'\'C++\''}    | ${0}        | ${'single quote'}
                        ${'"C++"'}      | ${0}        | ${'double quote'}
                        `( '$testName', async( {input, expected, testName} ) => {
                            event.text = `foo ${input}++ bar`;
        
                            karma.increment = jest.fn().mockResolvedValue( `${testName} parens` );
                                
                            await parseKarma.handleKarma( event );
                            expect( karma.increment ).toHaveBeenCalledTimes( expected );
                        } );
                    } );
                } );
                describe( 'c++', () => {
                    test( 'bare', async() => {
                        event.text = 'foo c++++ bar';
                        
                        karma.increment = jest.fn().mockResolvedValue( 'c++ by itself' );
                        
                        await parseKarma.handleKarma( event );
                        expect( karma.increment ).toHaveBeenCalledTimes( 0 );
                    } );
                    describe( 'surrounded by', () => {
                        test.each`
                        input         | expected    |  testName
                        ${'(c++)'}      | ${0}        | ${'parens'}
                        ${'\'c++\''}    | ${0}        | ${'single quote'}
                        ${'"c++"'}      | ${0}        | ${'double quote'}
                        `( '$testName', async( {input, expected, testName} ) => {
                            event.text = `foo ${input}++ bar`;
        
                            karma.increment = jest.fn().mockResolvedValue( `${testName} parens` );
                                
                            await parseKarma.handleKarma( event );
                            expect( karma.increment ).toHaveBeenCalledTimes( expected );
                        } );
                    } );
                } );
            } );


            test( 'formatted user id', async() => {
                const formattedUserId = '<@ABC123>';
                event.text = `${formattedUserId}++`;
                karma.increment = jest.fn().mockResolvedValue( 'irrelevent' );

                await parseKarma.handleKarma( event );
                expect( karma.increment ).toHaveBeenCalledTimes( 1 );
                expect( karma.increment ).toHaveBeenCalledWith( formattedUserId );
            } );
        } );

        test( 'empty string after parsing', async() => {
            event.text = '++';
            karma.increment = jest.fn().mockResolvedValue( 'irrelevent' );

            await parseKarma.handleKarma( event );
            expect( karma.increment ).toHaveBeenCalledTimes( 0 );
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

        describe( 'entire line', () => {
            describe( 'C', () => {
                test( 'bare', async() => {
                    event.text = 'C++';
                        
                    karma.increment = jest.fn().mockResolvedValue( 'C by itself' );
                        
                    await parseKarma.handleKarma( event );
                    expect( karma.increment ).toHaveBeenCalledTimes( 1 );
                } );
                describe( 'surrounded by', () => {
                    test.each`
                    input         | expected    |  testName
                    ${'(C)'}      | ${0}        | ${'parens'}
                    ${'\'C\''}    | ${0}        | ${'single quotes'}
                    ${'"C"'}      | ${0}        | ${'double quotes'}
                    `( '$testName', async( {input, expected, testName} ) => {
                        event.text = `${input}++`;

                        karma.increment = jest.fn().mockResolvedValue( `C ${testName}` );
                            
                        await parseKarma.handleKarma( event );
                        expect( karma.increment ).toHaveBeenCalledTimes( expected );
                    } );
                } );

            } );
            describe( 'c', () => {
                test( 'bare', async() => {
                    event.text = 'c++';
                        
                    karma.increment = jest.fn().mockResolvedValue( 'c by itself' );
                        
                    await parseKarma.handleKarma( event );
                    expect( karma.increment ).toHaveBeenCalledTimes( 1 );
                } );
                describe( 'surrounded by', () => {
                    test.each`
                    input         | expected    |  testName
                    ${'(c)'}      | ${0}        | ${'parens'}
                    ${'\'c\''}    | ${0}        | ${'single quote'}
                    ${'"c"'}      | ${0}        | ${'double quote'}
                    `( '$testName', async( {input, expected, testName} ) => {
                        event.text = `${input}++`;

                        karma.increment = jest.fn().mockResolvedValue( `c ${testName}` );
                            
                        await parseKarma.handleKarma( event );
                        expect( karma.increment ).toHaveBeenCalledTimes( expected );
                    } );
                } );
            } );
            describe( 'C++', () => {
                test( 'bare', async() => {
                    event.text = 'C++++';
                        
                    karma.increment = jest.fn().mockResolvedValue( 'C++ by itself' );
                        
                    await parseKarma.handleKarma( event );
                    expect( karma.increment ).toHaveBeenCalledTimes( 0 );
                } );
                describe( 'surrounded by', () => {
                    test.each`
                    input           | expected    |  testName
                    ${'(C++)'}      | ${1}        | ${'parens'}
                    ${'\'C++\''}    | ${1}        | ${'single quotes'}
                    ${'"C++"'}      | ${1}        | ${'double quotes'}
                    `( '$testName', async( {input, expected, testName} ) => {
                        event.text = `${input}++`;

                        karma.increment = jest.fn().mockResolvedValue( `C++ ${testName}` );
                            
                        await parseKarma.handleKarma( event );
                        expect( karma.increment ).toHaveBeenCalledTimes( expected );
                    } );
                } );
            } );
            describe( 'c++', () => {
                test( 'bare', async() => {
                    event.text = 'c++++';
                        
                    karma.increment = jest.fn().mockResolvedValue( 'c++ by itself' );
                        
                    await parseKarma.handleKarma( event );
                    expect( karma.increment ).toHaveBeenCalledTimes( 0 );
                } );
                describe( 'surrounded by', () => {
                    test.each`
                    input           | expected    |  testName
                    ${'(c++)'}      | ${1}        | ${'parens'}
                    ${'\'c++\''}    | ${1}        | ${'single quotes'}
                    ${'"c++"'}      | ${1}        | ${'double quotes'}
                    `( '$testName', async( {input, expected, testName} ) => {
                        event.text = `${input}++`;

                        karma.increment = jest.fn().mockResolvedValue( `c++ ${testName}` );
                            
                        await parseKarma.handleKarma( event );
                        expect( karma.increment ).toHaveBeenCalledTimes( expected );
                    } );
                } );
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

            test( 'formatted user id', async() => {
                const formattedUserId = '<@ABC123>';
                event.text = `${formattedUserId}--`;
                karma.decrement = jest.fn().mockResolvedValue( 'irrelevent' );

                await parseKarma.handleKarma( event );
                expect( karma.decrement ).toHaveBeenCalledTimes( 1 );
                expect( karma.decrement ).toHaveBeenCalledWith( formattedUserId );
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

        test( 'empty string after parsing', async() => {
            event.text = '--';
            karma.decrement = jest.fn().mockResolvedValue( 'irrelevent' );

            await parseKarma.handleKarma( event );
            expect( karma.decrement ).toHaveBeenCalledTimes( 0 );
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

        test( 'nothing surrounding phrase', () => {
            const phrase = 'this is the song that never ends';
            const returnedPhrase = parseKarma.extractAsNeeded( phrase );
            expect( returnedPhrase ).toEqual( phrase );
        } );
    } );

    describe( 'handlePointCheck', () => {
        describe( 'karma.pointsForMessage returns', () => {
            beforeEach( async() => {
                karma.pointsForMessage = jest.fn();
                karma.pointsForMessage.mockRestore();
            } );
            test( 'a string', async() => {
                const expectedString = 'abc 123';
                karma.pointsForMessage = jest.fn().mockResolvedValue( expectedString );
                
                event.text = '!karma this is the song that never ends';

                const result = await parseKarma.handleKarma( event );
                expect( result ).toEqual( expectedString );
            } );

            test( 'empty string', async() => {
                karma.pointsForMessage = jest.fn().mockResolvedValue( '' );
                
                event.text = '!karma this is the song that never ends';
                
                const result = await parseKarma.handleKarma( event );
                expect( result ).toEqual( undefined );
            } );

        } );

        describe( 'extracts from', () => {
            beforeEach( async() => {
                karma.pointsForMessage = jest.fn();
            } );
            test( 'single quotes', async() => {
                event.text = '!karma \'fooey bary bazy\'';
                await parseKarma.handleKarma( event );
                expect( karma.pointsForMessage ).toHaveBeenCalledTimes( 1 );
                expect( karma.pointsForMessage ).toHaveBeenCalledWith( 'fooey bary bazy' );
            } );

            test( 'double quotes', async() => {
                event.text = '!karma "larry curly moe"';
                await parseKarma.handleKarma( event );
                expect( karma.pointsForMessage ).toHaveBeenCalledTimes( 1 );
                expect( karma.pointsForMessage ).toHaveBeenCalledWith( 'larry curly moe' );
            } );

            test( 'parentheses', async() => {
                event.text = '!karma (Grandpa was a carpenter)';
                await parseKarma.handleKarma( event );
                expect( karma.pointsForMessage ).toHaveBeenCalledTimes( 1 );
                expect( karma.pointsForMessage ).toHaveBeenCalledWith( 'Grandpa was a carpenter' );
            } );
        } );
    } );

    describe( 'top', () => {
        describe( 'triggered by', () => {
            test( '--top', async() => {
                karma.topPhrases = jest.fn().mockResolvedValue( 'returned result' );
                event.text = '!karma --top';

                await parseKarma.handleKarma( event );
                expect( karma.topPhrases ).toHaveBeenCalledTimes( 1 );
            } );

            test( '-t', async() => {
                karma.topPhrases = jest.fn().mockResolvedValue( 'returned result' );
                event.text = '!karma -t';

                await parseKarma.handleKarma( event );
                expect( karma.topPhrases ).toHaveBeenCalledTimes( 1 );
            } );
        } );

        test( 'has bold header', async() => {
            karma.topPhrases = jest.fn().mockResolvedValue( 'returned result' );
            event.text = '!karma --top';

            const result = await parseKarma.handleKarma( event );
            expect( result ).toEqual( '*top karma*:\nreturned result' );
        } );
    } );

    describe( 'bottom', () => {
        describe( 'triggered by', () => {
            test( '--bottom', async() => {
                karma.bottomPhrases = jest.fn().mockResolvedValue( 'returned result' );
                event.text = '!karma --bottom';

                await parseKarma.handleKarma( event );
                expect( karma.bottomPhrases ).toHaveBeenCalledTimes( 1 );
            } );

            test( '-b', async() => {
                karma.bottomPhrases = jest.fn().mockResolvedValue( 'returned result' );
                event.text = '!karma -b';

                await parseKarma.handleKarma( event );
                expect( karma.bottomPhrases ).toHaveBeenCalledTimes( 1 );
            } );
        } );

        test( 'has bold header', async() => {
            karma.bottomPhrases = jest.fn().mockResolvedValue( 'returned result' );
            event.text = '!karma --bottom';

            const result = await parseKarma.handleKarma( event );
            expect( result ).toEqual( '*bottom karma*:\nreturned result' );
        } );
    } );

    describe( 'help menu', () => {
        describe( 'triggered by', () => {
            test( '--help', async() => {
                event.text = '!karma --help';

                const result = await parseKarma.handleKarma( event );
                expect( result ).toEqual( KARMA_HELP_MENU );
            } );

            test( '-h', async() => {
                event.text = '!karma -h';

                const result = await parseKarma.handleKarma( event );
                expect( result ).toEqual( KARMA_HELP_MENU );
            } );
        } );
    } );
} );