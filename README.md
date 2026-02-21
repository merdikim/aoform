# AOForm

> This repository is a fork of AOForm originally developed by [AF (Autonomous Finance)](https://autonomous.finance).
> It is maintained independently and includes additional/custom functionality beyond the original project.

AOForm is a tool to deploy a set of processes to AO. These can be defined in a `processes.yaml` file. It uses a statefile to keep track of deployed processes and only updates code when needed.

## Project structure

```text
bin/
  aoform.js                 # executable entrypoint
src/
  cli/                      # command registration and CLI runner
  commands/                 # command handlers (`deploy`, `init`)
  core/
    deploy/                 # deployment workflow modules
    lua/                    # Lua packing utilities
  templates/                # starter templates (used by `init`)
```

### Key files

- `src/cli/createProgram.js`: defines commands and options.
- `src/core/deploy/index.js`: high-level deploy orchestration.
- `src/core/deploy/spawnProcess.js`: process spawn behavior with retries.
- `src/core/deploy/deploySource.js`: source upload and eval flow.
- `src/core/lua/packLua.js`: Lua dependency packing.

## Installation

```bash
npm install --save-dev aoform
```

## Usage

1. Install in your AO project
2. Create a config file in your project root (`npx aoform init --name my-processes`)
3. Set your wallet (`export WALLET_JSON="$(cat ~/.aos.json)"`)
4. Run the deploy script (`npx aoform deploy`)

## Configuration

The configuration for the deploy script is defined in the `processes.yaml` file. This file is located in the root of your AO project.

## Example processes.yaml

```yaml
- name: My-App-V2
  file: build/output.lua
  prerun: reset-modules.lua
  resetModules: true
  scheduler: _GQ33BkPtZrqxA84vM8Zk-N2aO0toNNu_C-l-rawrBA
  module: cNlipBptaF9JeFAf4wUmpi43EojNanIBos3EfNrEOWo
  tags:
    - name: Process-Type
      value: My App 
    - name: Cron-Interval
      value: 10-minute
    - name: Cron-Tag-Action
      value: Cron-Minute-Tick
```

## Options

- `name`: Name of the process
- `file`: Relative path to the main file to deploy
- `prerun`: Relative path to a script that gets executed before the main file
- `scheduler`: ID of the scheduler
- `module`: ID of the module
- `tags`: List of tags to spawn the process with
- `resetModules`: If true, all modules except the standard ao library will be unloaded before your code is eval'ed (default: true)
- `directory`: If true, the `aoform.directory` package will be enabled. This returns a table with process names as the keys, and process ids as the values. (default: false)

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contributor setup and architecture notes.

## Original Developer

Originally developed by [AF (Autonomous Finance)](https://autonomous.finance).
