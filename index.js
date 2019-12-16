require('dotenv').config();
const SlackBot = require( 'slackbots' );

const bot = new SlackBot( {
    token: process.env.SLACK_TOKEN,
    name: process.env.ROBOT_NAME
} );

//start handler
bot.on( 'start', () => {
    console.log( `Bot has started.` );
});

//error handler
bot.on( 'error', ( error ) => console.log( error ) );

//message handler
bot.on( 'message', ( event ) => {
    if( event.type !== 'message' ) {
        return;
    }

    handleMessage( event );
});

function handleMessage( event ) {
    var message = event.text,
        response = "";

    // Ignore messages if they are deleted
    if ( event.type === "message" && event.subtype === "message_deleted" ) {
        return;
    }

    if ( message.includes( `where is ${process.env.ROBOT_NAME}?`) || message.includes( `where's ${process.env.ROBOT_NAME}?` ) ) {
        response = `There is no ${process.env.ROBOT_NAME}. There is only Zuul.`;
    }
    else if ( message.includes( `thanks ${process.env.ROBOT_NAME}` ) || message.includes( `thank you ${process.env.ROBOT_NAME}` ) ) {
        response = `At your service.`;
    }
    else if ( message.match( /\btop o.? the mornin/i ) ) {
        response = `And the rest of the day to yourself.`;
    }
    else if ( message.match( /@channel/ ) ) {
        response = "Please use `@here` for group notifications instead. This is a thoughtful alternative that avoids unnecessary notifications sent to inactive users. (Repeated `@channel` usage is considered a CoC violation.)";
    }
    else if ( message.match( /^!welcome/i ) ) {
        response = `Welcome to :256:!

        If you haven't done so already, please upload an avatar and fill out your profile. We're a friendly group–we don't bite, promise!–but we are a community that likes to know our neighbors!

        There are a lot of channels here that represent different topics (e.g. #code, #testing, #jobs, etc). A lot of silliness goes down in #random. You can see our full list of channels here: https://tech256.slack.com/archives.

        One thing you’ll want to do is configure your notification settings. Otherwise, Slack will likely send you many more pings and emails than you’re comfortable with! Consider muting channels that you’re less interested in. We’d rather you stick around and be comfortable than leave because you’re overwhelmed with notifications. https://tech256.slack.com/account/notifications.

        If you have any questions, reach out to our moderators (listed on tech256.com). We’re happy to help. Also, please review our Code of Conduct (https://github.com/tech256/CoC). Our goal is to support an open, inclusive North Alabama tech community — please help us make Tech256 a great place for everyone.`;
    }
    else {
        response = "Command not available.";
    }

    // ignore messages by bots
    if ( event.type === "message" && event.subtype === undefined )
        bot.postMessage( event.channel, response );
}
