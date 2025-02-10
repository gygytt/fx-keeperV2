
## prerequisite

- yarn: `1.22.22`
- node: run `nvm use`

## Bots

- f(x) bots: use `yarn bot:fx --help` for help. add `-d` for dry run.

### f(x) 2.0 Rebalance/Liquidate Bot

```bash
# dry run
yarn bot:fx rebalance -s <directory for state> -r <Rpc Url> -p <private key> -d
# real run
yarn bot:fx rebalance -s <directory for state> -r <Rpc Url> -p <private key>
```