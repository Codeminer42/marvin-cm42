# Marvin

Marvin is a chat bot built on the [Hubot](https://hubot.github.com/) framework.

## Dependencies

- Node.js `v14.15.x`

## Install

Clone this repository, then run:

```
npm install
```

## Unit tests

```
npm test
```

## Running Marvin Locally

### Hubot Console

You can start Marvin locally by running:

```
npm start
```

You'll see some start up output and a prompt:

```
[Sat Feb 28 2015 12:38:27 GMT+0000 (GMT)] INFO Using default redis on localhost:6379
marvin>
```

Then you can interact with Marvin by typing `marvin help`.

```
marvin> marvin help
marvin animate me <query> - The same thing as `image me`, except adds [snip]
marvin help - Displays all of the help commands that marvin knows about.
...
```

### Connect to Discord

You can start Marvin as a local server to connect to Discord.

1. Ask for the `HUBOT_DISCORD_TOKEN` for someone in the team.
2. Run:

    ```
    HUBOT_DISCORD_TOKEN='the token you received' bin/hubot -a discord
    ```

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
20. Repeat steps 14 to 19 to login into youtube account and fill the YOUTUBE_ env vars.
21. Run marvin normally
22. To use the calendar command you need to fill the variable with an calendar id.
23. Go to google calendar, in the left tab, select your calendar or create one. To select, click in the vertical threed dots.
24. In `Settings and sharing` you will find a `Calendar ID` in the bottom of the page. Fill the variable.

### Including calendars on Google Calendar

If you're running Marvin on your organization, by default it has access to Google Calendar. However, if you can't see or access calendars when running `!calendar`, go to the Google Calendar **Configuration Menu** > **Integrate Calendar** and add the respective Calendar ID. After that, you should see the events of the calendar on Marvin's account, and `!calendar` should work as intended. 

### Allow users to use the `!streamyard` command

To allow an user to use the `!streamyard` command to login into streamyard.com,
add the Discord user ids to the `ALLOWED_STREAMYARD_USERS` env var, separated by commas
and fill the `STREAMYARD_USER_EMAIL` env var with the streamyard account e-mail.

To get a Discord User Id, check [Where can I find my User/Server/Message ID?](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-).
