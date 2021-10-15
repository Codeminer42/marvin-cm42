# Marvin

Marvin is a chat bot built on the Hubot framework.
You can find more information about Hubot in the [documentation](https://hubot.github.com/docs/).

## Table of content

- [Purpose](#purpose)
- [How to contribute](#how-to-contribute)
- [Dependencies](#dependencies)
- [Install](#install)
- [Unit tests](#unit-tests)
- [Running Marvin Locally](#running-marvin-locally)
  - [Hubot Console](#hubot-console)
  - [Connect to Discord](#connect-to-discord)
  - [Connect to Gmail](#connect-to-gmail)
  - [Allow users to use the `!streamyard` command](#allow-users-to-use-the-streamyard-command)

## Purpose

Marvin is mainly used by Codeminer42 team to get information faster.
Some of the most used commands are described below:

| COMMAND   | DESCRIPTION                                     |
| --------- | ----------------------------------------------- |
| !brownbag | Give instructions on how to schedule a brownbag |
| !calendar | List upcoming events                            |
| !list     | Returns a list with dynamic created commands    |
| !test     | Display all tests links                         |

You can find more available commands typing `marvin help`.

To learn how to run them, please check [Running Marvin Locally](#running-marvin-locally).

## How to contribute

If you want to contribute with this project, please check the open issues.

## Dependencies

- Node.js `v14.15.x`

## Install

Clone this repository, then run:

    npm install

## Unit tests

    npm test

## Running Marvin Locally

### Hubot Console

You can start Marvin locally by running:

    npm start

You'll see some start up output and a prompt:

    [Sat Feb 28 2015 12:38:27 GMT+0000 (GMT)] INFO Using default redis on localhost:6379
    marvin>

Then you can interact with Marvin by typing `marvin help`.

    marvin> marvin help
    marvin animate me <query> - The same thing as `image me`, except adds [snip]
    marvin help - Displays all of the help commands that marvin knows about.
    ...

### Connect to Discord

You can start Marvin as a local server to connect to Discord.

1.  Ask for the `HUBOT_DISCORD_TOKEN` for someone in the team.
2.  Run:

        HUBOT_DISCORD_TOKEN='the token you received' bin/hubot -a discord

### Connect to Gmail

1. access [Google Cloud Platform](https://console.developers.google.com)
2. Create a project
3. Click on `Enable APIS and services`
4. Search for gmail and enable it
5. Search for calendar and enable it
6. Search for youtube and enable it
7. Go to Credentials tab (it may ask you to configure consent screen, you should do that)
8. While you do that, set an email as test user so you can login with on step 15.
9. Click on `Create Credentials` then `OAuth Client ID`
10. Select the application type `Desktop app` and give it a cool name.
11. After that you will be prompted with the `Client Secret` and `Client ID` You don't need to save that. They will be in a file.
12. The created OAuth credential will appear in a list called `OAuth 2.0 Client IDs`. Click in the arrow down and download the file.
13. Download the Json and fill the enviroment variables client id and client secret and the first item from redirect uris
14. Execute `node lib/google/gmailConnector.js`
15. Access the URL that appears in the console
16. Login in with Marvin email or you personal email that have test user role
17. Allow marvin-gmail-connector access
18. Copy the token and paste it back into the console (token.json file will be created)
19. Fill the environment variables with the data from token.json and then delete the file.<br>
    Tip: in the `GMAIL_SCOPE` variable you have to put content inside quotes and apart by space
20. Run marvin normally
21. To use the calendar command you need to fill the variable with an calendar id.
22. Go to google calendar, in the left tab, select your calendar or create one. To select, click in the vertical threed dots.
23. In `Settings and sharing` you will find a `Calendar ID` in the bottom of the page. Fill the variable.

### Allow users to use the `!streamyard` command

To allow an user to use the `!streamyard` command to login into streamyard.com,
add the Discord user ids to the `ALLOWED_STREAMYARD_USERS` env var, separated by commas.

To get a Discord User Id, check [Where can I find my User/Server/Message ID?](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-).
