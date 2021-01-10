## PointOnePercent

Website for the 0.1% Steam community.

### How to set up production build

- clone the repository
- `yarn` | `npm install`
- `yarn run build` | `npm run build`
- `forever start -c 'yarn run prod-pop' build`

The last command allows us to run the `serve` command which requires path while still providing `forever` with required flag `path`.
