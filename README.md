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

### Local Development
```bash
npm install
```

### Global Installation
```bash
npm install -g advanced-dev-kit
```

After global installation, you can use `adk` directly instead of `npx adk`.

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

### With npx (local installation):
```bash
# Execute a task
npx adk do-task build
npx adk do-task test
npx adk do-task deploy

# Clean project artifacts
npx adk clean

# Deployment commands
npx adk deploy dev          # Deploy to development environment
npx adk deploy prod         # Deploy to production with version management
```

### With global installation:
```bash
# Execute a task
adk do-task build
adk do-task test
adk do-task deploy

# Clean project artifacts
adk clean

# Deployment commands
adk deploy dev          # Deploy to development environment
adk deploy prod         # Deploy to production with version management
```

## Available Commands

### `do-task`
Execute custom development tasks.

### `clean`
Clean temporary folders and files.

### `deploy`
Deployment commands with subcommands:

#### `deploy dev`
Deploy to development environment by pushing the main branch to dev branch with force.

#### `deploy prod`
Deploy to production environment with comprehensive workflow:
- Pulls latest changes from stable branch
- Checks for uncommitted changes
- Ensures you're on the main branch
- Auto-increments version if needed (using internal helper function)
- Creates deployment commit with timestamp
- Pushes changes to main branch
- Creates pull request from main to stable
- Opens PR in browser

## Deployment Workflow

The deployment system uses a `deploy.json` file to track deployment history:

```json
{
  "last_deploy": "2025-07-03 14:30:00",
  "hash": "abc123def456",
  "version": "1.2.3"
}
```

The `deploy prod` command includes automatic version management - it will increment the patch version automatically if the current version matches the last deployed version.

### Prerequisites for Production Deployment

1. **Git Repository**: Must be a git repository with `main` and `stable` branches
2. **GitHub CLI**: Install and authenticate with `gh auth login` for PR creation
3. **Clean Working Directory**: No uncommitted changes
4. **Main Branch**: Must be on main branch for production deployment

## Scripts

- `npm run build` - Build the project
- `npm run dev` - Build and watch for changes
- `npm run clean` - Clean build artifacts
- `npm run deploy:dev` - Deploy to development (alias for `adk deploy dev`)
- `npm run deploy:prod` - Deploy to production (alias for `adk deploy prod`)