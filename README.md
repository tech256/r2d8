# R2-D8

[![Build Status](https://circleci.com/gh/tech256/r2d8.svg?style=svg)](https://app.circleci.com/pipelines/github/tech256/r2d8)
[![Build Status](https://travis-ci.org/tech256/r2d8.svg?branch=master)](https://travis-ci.org/tech256/r2d8)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

A bot for the people of [tech256][tech256]. The name is a pretty awful play
on [R2-D2][r2d2] where in we replaced the last 2 with an 8 because 256 is
2^8 `¯\_(ツ)_/¯`. The bot is based on [slackbots][slackbots].

# How to Run
You will need to have Docker installed on your machine to run the application. To get started run the command below to start the bot.

```bash
yarn docker
```

# How to update a Docker image
Occasionally you will want to update the docker image. When you're ready to do this, you'll need ot perform the following steps.

## Updating the Node container
1. You will begin by updating the Dockerfile in the root directory of this project. This Dockerfile is how we create the container for the Node app.
2. Once you have updated the Dockerfile and are ready to update the container image you can run the following command to update it.

```bash
yarn build
```

3. Once you have updated the container you may or may not have to update the `docker-compose.yml` file. Update this as necessary based on what changes you have made to the Node Dockerfile.

# Contributors

This project was built and is currently maintained by developers within the tech256 community.

[tech256]: http://tech256.com
[r2d2]: http://en.wikipedia.org/wiki/R2-D2
[slackbots]: https://github.com/mishk0/slack-bot-api
