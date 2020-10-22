# kcmo-potholes

kcmo-potholes is a bot that pulls open pothole requests from data.kcmo.org and posts them to Twitter.

The data is from this dataset: [data.kcmo.org](https://data.kcmo.org/311/All-Pothole-Requests-Closed-and-Currently-Open/r2pb-6ie8)

## Installation

If you would like to run the bot yourself you will need to get api keys from Opendata KC and Twitter.

Create a .env file in the /app directory with these keys in the following format:

```
OPENDATA_TOKEN=
TWITTER_API_KEY=
TWITTER_API_SECRET_KEY=
TWITTER_ACCESS_TOKEN=
TWITTER_ACCESS_SECRET=
```

Run `npm install` in the /app directory.

## Starting the bot

You can run the bot directly or within a docker container.

`npm start` from the /app folder

or

`docker-compose up -d` from the project root directory

## Running tests

`npm test` from /app folder
