# aoform-toolkit

`aoform-toolkit` is a CLI for deploying AO processes from YAML config files.
It keeps a local state file and only re-sends source code when content changes.

This project is a fork of AOForm originally developed by [AF (Autonomous Finance)](https://autonomous.finance), maintained independently with custom functionality.

## Install

```bash
npm install --save-dev aoform-toolkit
```

Use with `npx`:

```bash
npx aoform --help
```

## Quick Start

1. Create a config file:

```bash
npx aoform init
```

2. Provide a wallet (any one of these):

```bash
# Option A: explicit env var
WALLET_JSON="your_wallet_json"

# Option B: local wallet.json in your project
./wallet.json #at the root of your project
```

3. Deploy processes:

```bash
npx aoform deploy
```

## CLI Commands

`aoform init`
- Creates `processes.yaml` in the current directory.
- Option: `-n, --name <name>` to create a custom YAML filename.

`aoform deploy`
- Deploys or updates processes from YAML config.
- Options:
  - `-f, --file <path>` custom YAML file path.
  - `-u, --url <url>` custom HyperBEAM node URL.
  - `-s, --scheduler <scheduler>` custom scheduler.
  - `--wallet-path <path>` custom wallet JSON file path.

## Configuration (`processes.yaml`)

Top-level value must be an array of process entries.

```yaml
- name: My-App-V2
  file: build/output.lua
  resetModules: true
  module: cNlipBptaF9JeFAf4wUmpi43EojNanIBos3EfNrEOWo
  tags:
    - name: Process-Type
      value: My-App
```

Fields:
- `name` (required): logical process name used in state tracking.
- `file` (required): Lua source file path.
- `resetModules` (optional): unload modules before eval.
- `module` (optional): AO module id.
- `tags` (optional): spawn tags as `{ name, value }`.

## Wallet Resolution Order

When running `aoform deploy`, wallet JSON is resolved in this order:

1. `--wallet-path <path>`
2. `./wallet.json` in the current working directory
3. `WALLET_JSON` environment variable

Example:

```bash
export WALLET_JSON="$(cat ~/.aos.json)"
```

Alternatively, use a `.env` file:

```bash
# .env
WALLET_JSON={"address":"...","privateKey":"..."}
```


## State Files

- Default state file: `state.yaml`
- With a custom deploy file (for example `-f my-processes.yaml`): `state-my-processes.yaml`

The state file stores process IDs and code hashes so unchanged processes are skipped on future deploys.

## Local Development

```bash
npm install
npm run build
npm run aoform -- --help
```

## License

MIT. See [LICENSE](LICENSE).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
