const messageHelper = require("../messageHelper");
const constants = require("../constants")

describe('messageHelper', () => {
    describe('messageIsFromABot', () => {

        let event;

        beforeEach(() => {
            event = {
                type: 'message'
            }
        })

        test('subtype is "bot_message"', () => {
            event.subtype = 'bot_message'
            expect(messageHelper.messageIsFromABot(event)).toEqual(true);
        })

        test('subtype is not "bot_message"', () => {
            event.subtype = 'not bot_message'
            expect(messageHelper.messageIsFromABot(event)).toEqual(false);
        })

        test('bot_profile.name is "bot"', () => {
            event.subtype = 'not bot_message'
            event.bot_profile = {
                name: 'bot'
            }

            expect(messageHelper.messageIsFromABot(event)).toEqual(true);
        })

        test('bot_profile.name is not "bot"', () => {
            event.subtype = 'not bot_message'

            event.bot_profile = {
                name: 'not bot'
            }

            expect(messageHelper.messageIsFromABot(event)).toEqual(false);
        })

        test('bot_profile.name is undefined', () => {
            event.subtype = 'not bot_message'

            event.bot_profile = {
                name: undefined
            }

            expect(messageHelper.messageIsFromABot(event)).toEqual(false);
        })

        test('bot_profile.name is null', () => {
            event.subtype = 'not bot_message'

            event.bot_profile = {
                name: null
            }

            expect(messageHelper.messageIsFromABot(event)).toEqual(false);
        })
    })

    describe('getMessageResponse', () => {
        const OLD_ENV = process.env;
        const botName = 'bot bot';
        const onlyZuul = `There is no ${botName}. There is only Zuul.`;
        const atYourService = 'At your service.';
        
        let event = {};
        
        beforeEach(() => {
            jest.resetModules() // this is important - it clears the cache
            process.env = {
                ...OLD_ENV,
                ROBOT_NAME: botName
            };
            delete process.env.NODE_ENV;
            
            event.text = '';
        });
        
        afterEach(() => {
            process.env = OLD_ENV;
        });
        
        describe('where is', () => {
            test('lowercase', () => {
                event.text = 'where is ' + botName.toLowerCase() + '?';
                expect(messageHelper.getMessageResponse(event)).toEqual(onlyZuul);
            })
            
            test('uppercase', () => {
                event.text = 'where is ' + botName.toUpperCase() + '?';
                expect(messageHelper.getMessageResponse(event)).toEqual(onlyZuul);
            })

            test('user id', () => {
                process.env.BOT_ID = "12345";
                event.text = `Where is <@${process.env.BOT_ID}>`;
                expect(messageHelper.getMessageResponse(event)).toEqual(onlyZuul)
            })
        })
        
        describe(`where's`, () => {
            test(`lowercase`, () => {
                event.text = `where's ${botName.toLowerCase()}?`;
                expect(messageHelper.getMessageResponse(event)).toEqual(onlyZuul);
            })
            
            test(`uppercase`, () => {
                event.text = `where's ${botName.toUpperCase()}?`;
                expect(messageHelper.getMessageResponse(event)).toEqual(onlyZuul);
            })
        })
        
        describe(`thanks`, () => {
            test(`lowercase`, () => {
                event.text = `thanks ${botName.toLowerCase()}?`;
                expect(messageHelper.getMessageResponse(event)).toEqual(atYourService);
            })
            
            test(`uppercase`, () => {
                event.text = `thanks ${botName.toUpperCase()}?`;
                expect(messageHelper.getMessageResponse(event)).toEqual(atYourService);
            })
        })
        
        describe('thank you', () => {
            test(`lowercase`, () => {
                event.text = `thank you ${botName.toLowerCase()}?`;
                expect(messageHelper.getMessageResponse(event)).toEqual(atYourService);
            })
            
            test(`uppercase`, () => {
                event.text = `thank you ${botName.toUpperCase()}?`;
                expect(messageHelper.getMessageResponse(event)).toEqual(atYourService);
            })
            
        })
        
        describe('top', () => {
            const restOfDay = 'And the rest of the day to yas.'
            
            test(`o the morn`, () => {
                event.text = `top o the morn`;
                expect(messageHelper.getMessageResponse(event)).toEqual(restOfDay);
            })
            
            test(`of the morn`, () => {
                event.text = `top of the morn`;
                expect(messageHelper.getMessageResponse(event)).toEqual(restOfDay);
            })
            
            test(`o the mornin`, () => {
                event.text = `top o the mornin`;
                expect(messageHelper.getMessageResponse(event)).toEqual(restOfDay);
            })
            
            test(`of the mornin`, () => {
                event.text = `top of the mornin`;
                expect(messageHelper.getMessageResponse(event)).toEqual(restOfDay);
            })
            
            test(`o the morning`, () => {
                event.text = `top o the mornin`;
                expect(messageHelper.getMessageResponse(event)).toEqual(restOfDay);
            })
            
            test(`of the morning`, () => {
                event.text = `top of the mornin`;
                expect(messageHelper.getMessageResponse(event)).toEqual(restOfDay);
            })
        })
        
        describe('@channel', () => {
            test(`HERE INSTEAD`, () => {
                const event = {
                    text: "@channel fa la la"
                }
                expect(messageHelper.getMessageResponse(event)).toEqual(constants.USE_HERE_INSTEAD);
            })
        })

        describe('Code of Conduct', () => {
            beforeEach(() => {
                jest.resetModules() // this is important - it clears the cache
                process.env = {
                    ...OLD_ENV,
                };
                delete process.env.NODE_ENV;
                
                event.text = '';
            });
            
            afterEach(() => {
                process.env = OLD_ENV;
            });

            test(`ENABLE_WELCOME_MESSAGE != 'true' || true`, () => {
                process.env.ENABLE_WELCOME_MESSAGE = undefined;
                event.text = '!welcome @foobar';
                expect(messageHelper.getMessageResponse(event)).toEqual('');
            })

            describe(`ENABLE_WELCOME_MESSAGE == 'true'`, () => {
                beforeEach(() => {
                    process.env.ENABLE_WELCOME_MESSAGE = 'true';
                })

                test('lowercase', () => {
                    event.text = '!welcome @foobar'.toLowerCase();
                    expect(messageHelper.getMessageResponse(event)).toEqual(constants.COC);
                })

                test('uppercase', () => {
                    event.text = '!welcome @foobar'.toUpperCase();
                    expect(messageHelper.getMessageResponse(event)).toEqual(constants.COC);
                })
            })

            describe(`ENABLE_WELCOME_MESSAGE == true`, () => {
                beforeEach(() => {
                    process.env.ENABLE_WELCOME_MESSAGE = true;
                })

                test('lowercase', () => {
                    event.text = '!welcome @foobar'.toLowerCase();
                    expect(messageHelper.getMessageResponse(event)).toEqual(constants.COC);
                })

                test('uppercase', () => {
                    event.text = '!welcome @foobar'.toUpperCase();
                    expect(messageHelper.getMessageResponse(event)).toEqual(constants.COC);
                })
            })
        })
    })
})