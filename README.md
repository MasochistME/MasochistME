## MasochistME

Website for the MasochistME Steam community.

### How to run the website locally

First, you will need to add a configuration file. In the `src` directory, create a `config.json` file with the following stucture:
```
  // TODO I will add this later (◡‿◡✿)
```

- clone the repository
- check out the `release-dev` branch
- `yarn` | `npm install`
- `yarn maso:start`

The locally ran website is able to connect only to local backend, so to make it work fully, clone also the masochist-api repository, set it up as in its README and run it with `yarn api:dev:watch` command. It will automatically fetch the staging data so feel free to do whatever you want, at worst it will break staging. 

### How to release a new production build

There is no automated production release - you need to log into the remote server, pull and build the newest version of `main` branch. Since it's not a particularly collaboration-friendly way to do it for now I'm just doing it manually.
