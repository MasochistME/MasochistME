# MasochistME - monorepo

This is a monorepo holding projects related to the MasochistME app: website, backend server, bot and SDK.
Monorepo is based on [turborepo]().

## Subrepositories

- [masochist-web]() - website hosted on [masochist.me](masochist.me) domain
- [masochist-api]() - backend server
- [masochist-sdk]() - SDK for easy API access [[DOCS](https://masochistme.github.io/MasochistME)]
- [dr-fetus]() - Dr. Fetus bot serving on the MME Discord

## Running the monorepo locally

First, you will obviously need to clone this repository.

`apps/dr-fetus` and `apps/masochist-api` rely on `.env` files being populated in their root directories. Navigate there and create those files based on those packages' README files and existing `.env.example`.

`apps/masochist-web` relies on an `src/config.json` file. Navigate to its directory and populate that file based on the package's README.

Next, run the following commands in the root directory:

- `yarn` - to install dependencies for all workspaces inside the monorepo,
- `yarn build:sdk` - builds the local version of the SDK (other repos base on the local one, you can lock to a specific version in package.json if you want to use NPM package),
- `yarn dev` - this command runs the backend server - it's necessary for the website to work locally,
- `yarn maso:start` - runs the website on port 3000.

You might need to add a `--force` flag at the end of the command if Turbo caching prevents you from running it.