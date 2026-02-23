# Contributing to AOForm

## Development setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the CLI locally:
   ```bash
   npm run build
   npm run aoform -- --help
   ```

## Architecture overview

- `bin/aoform.ts` only boots the CLI runtime.
- `src/cli/` owns command definitions and parsing.
- `src/commands/` adapts CLI options to core operations.
- `src/core/deploy/` contains deploy workflow modules (config/state IO, spawn, source deploy).
- `src/core/lua/` contains Lua package build logic.
- `src/templates/` contains template files copied by commands.

## Design principles for changes

- Keep command files thin; business logic belongs in `src/core/`.
- Keep modules focused (single responsibility over monolithic files).
- Prefer pure helper functions for deterministic logic and easier testing.
