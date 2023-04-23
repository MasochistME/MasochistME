# Masochist.ME SDK

SDK abstracting communication with the [Masochist.ME API](https://github.com/MasochistME/masochist-api).

→ [Documentation](https://masochistme.github.io/masochist-sdk)

→ [NPM package](https://www.npmjs.com/package/@masochistme/sdk)

→ [GitHub repository](https://github.com/MasochistME/masochist-sdk)

## Usage

We recommend using the latest version of the SDK as it is still under rapid development:

```sh
yarn add @masochistme/sdk@latest
```

To be able to use the MasochistSDK in your application, you will need to pass a configuration file to the SDK instance with two parameters:

- `host` - the basic path to the MasochistAPI (usually `http://masochist.me:3002`)
- `accessToken` - your personal API token

```ts
import { SDK } from "@masochistme/sdk/dist/v1/sdk";

const config = {
  host:        "http://masochist.me:3002",
  accessToken: "your_super_secret_access_token",
};

const sdk = new SDK(config);
```

You can use the SDK without having the personal access token, but you will be limited to only use selected endpoints. To get one, contact Arcyvilk#6666.

## Modules

MasochistSDK allows you to retrieve and manipulate data from the following categories:

- [members](https://masochistme.github.io/masochist-sdk/modules/Members.html)
- [games](https://masochistme.github.io/masochist-sdk/modules/Games.html)
- [badges](https://masochistme.github.io/masochist-sdk/modules/Badges.html)
- [races](https://masochistme.github.io/masochist-sdk/modules/Races.html)
- [seasons](https://masochistme.github.io/masochist-sdk/modules/Seasons.html)
- [tiers](https://masochistme.github.io/masochist-sdk/modules/Tiers.html)