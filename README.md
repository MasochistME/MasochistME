# Data Delivery Service (DDS)

Microservice responsible for serving data to all PointOnePercent related clients, currently being masochist.me website and Dr. Fetus bot.

## Configuration

Create a ``config.json``file in the main directory and give it following structure:

```
{
    "PORT" : <port you want your microservice to use>,
    "DATABASE_URL": "mongodb://DB_USERNAME:DB_PWD@DB_HOST_NAME:DB_HOST_PORT/DB_NAME?authSource=DB_AUTH",
    "STEAM_KEY": <steam token>,
    "CORS": "http://masochist.me",
    "AUTH": <authorization token HASH>
}
```

## Dependencies

To function properly, you need to have MongoDB database set up. The needed strutures will be documented soonTM.

## Setting up

- clone the repository - ``git clone https://github.com/PointOnePercent/pop-dds``
- install all dependencies - ``npm install``
- set up the MongoDB database (data structure will be released soon)
- set up the ``config.json`` file
- to start the microservice, use the ``npm run dds`` command
- it is recommended to use ``forever`` CLI tool to run the microserive continuously on your host with the use of ``forever start -c 'npm run dds' ./`` command, run in the main directory
