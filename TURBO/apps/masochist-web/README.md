## MasochistME

Website for the MasochistME Steam community.

### How to run the website locally

First, you will need to add a configuration file. In the `src` directory, create a `config.json` file with the following stucture:
```
{
  "PORT": 8081,
  "API": "http://localhost:3081",
  "MIXPANEL_TOKEN": "SUPER_SECRET_MIXPANEL_TOKEN"
}
```

This is a development environment configuration - you will need to host the server locally as well to be able to use the staging data. To do so, clone the [masochist-api](https://github.com/MasochistME/masochist-api) repository, set it up as in its README and run it with `yarn api:dev:watch` command. It will automatically fetch the staging data so feel free to do whatever you want in local, at worst it will break staging. 

After that, you can run the website:

- clone the repository
- check out the `release-dev` branch
- `yarn` | `npm install`
- `yarn maso:start`

### How to release a new production build

There is no automated production release - you need to log into the remote server, pull and build the newest version of `main` branch. Since it's not a particularly collaboration-friendly way to do it for now I'm just doing it manually.
