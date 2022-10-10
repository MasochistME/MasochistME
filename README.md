# @masochistme/api

Microservice responsible for serving data to all PointOnePercent related clients, currently being masochist.me website and Dr. Fetus bot.

## Configuration

Create an ``.env``file in the main directory and give it following structure:

```
  DATABASE_URL=mongodb://DB_USERNAME:DB_PWD@DB_HOST_NAME:DB_HOST_PORT/DB_NAME?authSource=DB_AUTH
  STEAM_KEY=yoursupersecretsteamkeyhere
  AUTH=yoursupersecretauthenticationtokenhere
  HASH_TEMP_ACCESS_TOKEN=yoursupersecrethashtempaccesstokenhere
```

## Dependencies

To function properly, you need to have MongoDB database set up. The needed strutures will be documented soonTM.

## Setting up

- clone the repository - ``git clone https://github.com/MasochistME/masochist-api``
- install all dependencies - ``yarn``
- set up the MongoDB database (data structure will be released soon)
- set up the ``.env`` file
- to start the microservice in watch mode, use the ``yarn api:prod:watch`` command (you can replace `prod` with `dev` if you're in dev environment)
- it is recommended to use ``forever`` CLI tool to run the microserive continuously on your host with the use of ``forever start -c 'yarn api:prod' ./`` command, run in the main directory