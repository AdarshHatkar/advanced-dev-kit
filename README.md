# Advanced Development Kit

A comprehensive toolkit for modern development workflows with TypeScript CLI commands.

## Project Structure

```
advanced-dev-kit/
├── bin/
│   └── cli.ts            # Entry point for CLI commands
├── src/
│   ├── commands/
│   │   ├── do-task.ts    # Task execution command
│   │   ├── clean.ts      # Project cleanup command
│   │   └── gen.ts        # Code generation command
│   └── index.ts          # Main library exports
├── tsconfig.json         # TypeScript configuration
├── package.json          # Package configuration
├── tsup.config.ts        # Build configuration
└── README.md             # This file
```

## Installation

```bash
npm install
```

## Build

```bash
npm run build
```

## Development

```bash
npm run dev
```

## Usage

After building, you can use the CLI:

```bash
# Execute a task
npx adk do-task build
npx adk do-task test
npx adk do-task deploy

# Clean project artifacts
npx adk clean
npx adk clean --all

# Generate code
npx adk gen component
npx adk gen service
npx adk gen config --template basic
```

## Available Commands

### `do-task <task>`
Execute development tasks like build, test, or deploy.

### `clean [options]`
Clean project artifacts. Use `--all` to include node_modules.

### `gen <type> [options]`
Generate code templates for components, services, configs, or tests.

## Scripts

- `npm run build` - Build the project
- `npm run dev` - Build and watch for changes
- `npm run clean` - Clean build artifacts
- `npm run test` - Run tests
- `npm run lint` - Lint the code
- `npm run typecheck` - Check TypeScript types