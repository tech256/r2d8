const USE_HERE_INSTEAD = 'Please use `@here` for group notifications instead. This is a thoughtful alternative that avoids unnecessary notifications sent to inactive users. (Repeated `@channel` usage is considered a CoC violation.)';

const WELCOME_MESSAGE = `Welcome to :256:!

If you haven't done so already, please upload an avatar and fill out your profile. We're a friendly group–we don't bite, promise!–but we are a community that likes to know our neighbors!

There are a lot of channels here that represent different topics (e.g. #code, #jobs, etc). A lot of silliness goes down in #random. You can see our full list of channels here: https://tech256.slack.com/archives.

One thing you’ll want to do is configure your notification settings. Otherwise, Slack will likely send you many more pings and emails than you’re comfortable with! Consider muting channels that you’re less interested in. We’d rather you stick around and be comfortable than leave because you’re overwhelmed with notifications. https://tech256.slack.com/account/notifications.

If you have any questions, reach out to our moderators (listed on tech256.com). We’re happy to help. Also, please review our Code of Conduct (https://github.com/tech256/CoC). Our goal is to support an open, inclusive North Alabama tech community — please help us make Tech256 a great place for everyone.`;


const KARMA_HELP_MENU = '`karma --help` or `karma -h` returns this menu\n'
+ 'Ending a message with `++` will add one karma point to a phrase\n'
+ 'Ending a message with `--` will subtract one karma point from a phrase\n'
+ '`!karma phrase` returns number of points for the given phrase. '
+ 'Phrase may be enclosed in single or double quotes or parentheses\n'
+ '`!karma --top` or `!karma -t` shows the top 5 phrases sorted by their karma points\n'
+ '`!karma --bottom` or `!karma -b` shows the bottom 5 phrases sorted by their karma points\n';

module.exports = {USE_HERE_INSTEAD, WELCOME_MESSAGE, KARMA_HELP_MENU};