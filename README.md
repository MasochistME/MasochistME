# MasochistME - monorepo

This is a monorepo holding projects related to the MasochistME app: website, backend server, bot and SDK.
Monorepo is based on [turborepo]().

## Subrepositories

- [masochist-web]() - website hosted on [masochist.me](masochist.me) domain
- [masochist-api]() - backend server
- [masochist-sdk]() - SDK for easy API access [[DOCS](https://masochistme.github.io/MasochistME)]
- [dr-fetus]() - Dr. Fetus bot serving on the MME Discord

## Running the monorepo locally

You will need to clone this repository and run `yarn` in the root directory. This should install dependencies for all the workspaces inside the monorepo.

Next steps:

- `yarn build:sdk` - builds the local version of the SDK (other repos base on the local one, you can lock to a specific version in package.json if you want to use NPM package),
- `yarn api:dev:watch` - this command runs the backend server - it's necessary for the website to work locally,
- `yarn maso:start` - runs the website.
