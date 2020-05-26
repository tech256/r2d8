const messageHelper = require("../messageHelper");

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
})