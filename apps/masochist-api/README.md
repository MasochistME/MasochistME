# @masochistme/api

Service responsible for serving data to all PointOnePercent related clients, including masochist.me website and Dr. Fetus bot.

## Configuration

Create an ``.env``file in the main directory and give it following structure:

```
  DATABASE_URL=mongodb://DB_USERNAME:DB_PWD@DB_HOST_NAME:DB_HOST_PORT/DB_NAME?authSource=DB_AUTH
  STEAM_KEY=yoursupersecretsteamkeyhere
  AUTH=yoursupersecretauthenticationtokenhere
  HASH_TEMP_ACCESS_TOKEN=yoursupersecrethashtempaccesstokenhere
```

You can get a STEAM_KEY by visiting this website: https://steamcommunity.com/dev/apikey
For the remaining two tokens and database access contact Arcyvilk.

## Setting up

- clone the repository - ``git clone https://github.com/MasochistME/masochist-api``
- install all dependencies - ``yarn``
- set up the MongoDB database (data structure will be released soon)
- set up the ``.env`` file
- to start the service locally in watch mode, use the ``yarn api:dev:watch`` command (you can replace `dev` with `prod` if you want to test the production environment, but it's usually a poor idea)
- it is recommended to use ``forever`` CLI tool to run the service continuously on your host with the use of ``forever start -c 'yarn api:prod' ./`` command, run in the main directory
