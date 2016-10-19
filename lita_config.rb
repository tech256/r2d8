Lita.configure do |config|
  # The name your robot will use.
  config.robot.name = "R2D8"

  # The locale code for the language to use.
  # config.robot.locale = :en

  # The severity of messages to log. Options are:
  # :debug, :info, :warn, :error, :fatal
  # Messages at the selected level and above will be logged.
  config.robot.log_level = ENV.fetch("LOG_LEVEL", :info)

  # An array of user IDs that are considered administrators. These users
  # the ability to add and remove other users from authorization groups.
  # What is considered a user ID will change depending on which adapter you use.
  config.robot.admins = [
    "U043SBPU9", # @jay
  ]

  if ENV["LITA_ENV"] == "production"
    config.redis[:url] = ENV.fetch("REDIS_URL")
    config.http.port = ENV.fetch("PORT")
    config.robot.adapter = :slack
  else
    config.robot.adapter = :shell
  end

  config.adapters.slack.token = ENV.fetch("SLACK_TOKEN") { "NOPE" }

  normalized_karma_user_term = ->(user_id, user_name) {
    "@#{user_id} (#{user_name})" #=> @UUID (Liz Lemon)
  }

  config.handlers.slack_karma_sync.user_term_normalizer = normalized_karma_user_term
  config.handlers.karma.cooldown = nil
  config.handlers.karma.link_karma_threshold = nil
  config.handlers.karma.term_pattern = /[<:][^>:]+[>:]|[\[\]\p{Word}\._|\{\}]{2,}/
  config.handlers.karma.term_normalizer = lambda do |full_term|
    term = full_term.to_s.strip.sub(/[<:]([^>:]+)[>:]/, '\1')
    user = Lita::User.fuzzy_find(term.sub(/\A@/, ''))

    if user
      normalized_karma_user_term.call(user.id, user.name)
    else
      term.downcase
    end
  end

  config.handlers.imgflip.command_only = false
  config.handlers.imgflip.username = ENV['IMGFLIP_USER']
  config.handlers.imgflip.password = ENV['IMGFLIP_PASSWORD']
  config.handlers.tinysong.api_key = ENV["TINYSONG_KEY"]
  config.handlers.static_meme.mapping = {
    /^where('| i)s #{config.robot.name}[?]?$/i => "There is no #{config.robot.name}. There is only Zuul.",
    /^thank(s| ?you)\s#{config.robot.name}/i => "At your service.",
    /top .* the mornin/i => "And the rest of the day to yourself.",
    /@channel/ => "Please use `@here` for group notifications instead. This is a thoughtful alternative that avoids unnecessary notifications sent to inactive users. (Repeated `@channel` usage is considered a CoC violation.)",
    /^!welcome/i => <<MSG,
Welcome to :256:!

If you haven't done so already, please upload an avatar and fill out your profile. We're a friendly group–we don't bite, promise!–but we are a community that likes to know our neighbors!

There are a lot of channels here that represent different topics (e.g. #code, #testing, #jobs, etc). A lot of silliness goes down in #random. You can see our full list of channels here: https://tech256.slack.com/archives.

One thing you’ll want to do is configure your notification settings. Otherwise, Slack will likely send you many more pings and emails than you’re comfortable with! Consider muting channels that you’re less interested in. We’d rather you stick around and be comfortable than leave because you’re overwhelmed with notifications. https://tech256.slack.com/account/notifications.

If you have any questions, reach out to our moderators (listed on tech256.com). We’re happy to help. Also, please review our Code of Conduct (https://github.com/tech256/CoC). Our goal is to support an open, inclusive North Alabama tech community — please help us make Tech256 a great place for everyone.
MSG
  }
end
