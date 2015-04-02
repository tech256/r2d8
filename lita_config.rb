Lita.configure do |config|
  # The name your robot will use.
  config.robot.name = "R2D8"

  # The locale code for the language to use.
  # config.robot.locale = :en

  # The severity of messages to log. Options are:
  # :debug, :info, :warn, :error, :fatal
  # Messages at the selected level and above will be logged.
  config.robot.log_level = :info

  # An array of user IDs that are considered administrators. These users
  # the ability to add and remove other users from authorization groups.
  # What is considered a user ID will change depending on which adapter you use.
  # config.robot.admins = ["1", "2"]

  if ENV["LITA_ENV"] == "production"
    config.redis[:url] = ENV.fetch("REDISTOGO_URL")
    config.http.port = ENV.fetch("PORT")
    config.robot.adapter = :slack
  else
    config.robot.adapter = :shell
  end

  config.adapters.slack.token = ENV.fetch("SLACK_TOKEN") { "NOPE" }

  config.handlers.karma.cooldown = nil
  config.handlers.karma.link_karma_threshold = nil
  config.handlers.memegen.command_only = false
  config.handlers.memegen.username = ENV["MEMEGEN_USER"]
  config.handlers.memegen.password = ENV["MEMEGEN_PASS"]
end
