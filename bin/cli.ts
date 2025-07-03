import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { doTask } from '../src/commands/do-task.js';
import { clean } from '../src/commands/clean.js';
import { deployDev, deployProd } from '../src/commands/deploy.js';
import { doctor } from '../src/commands/doctor.js';

// Get package.json version
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'));
const version = packageJson.version;

const program = new Command();

program
  .name('adk')
  .description('Advanced Dev Kit CLI')
  .version(version);

program
  .command('do-task')
  .description('Run a custom dev task')
  .action(doTask);

program
  .command('clean')
  .description('Clean temporary folders/files')
  .action(clean);

program
  .command('doctor')
  .description('Check if ADK is working correctly')
  .action(doctor);

// Deploy command with subcommands
const deployCommand = program
  .command('deploy')
  .description('Deployment commands')
  .action(async () => {
    // Interactive prompt when deploy is called without subcommands
    const { environment } = await inquirer.prompt([
      {
        type: 'list',
        name: 'environment',
        message: 'Select deployment environment:',
        choices: [
          { name: 'Development (dev)', value: 'dev' },
          { name: 'Production (prod)', value: 'prod' }
        ],
        default: 'dev'
      }
    ]);

    if (environment === 'dev') {
      await deployDev();
    } else {
      await deployProd();
    }
  });

deployCommand
  .command('dev')
  .description('Deploy to development environment (push to dev branch)')
  .action(deployDev);

deployCommand
  .command('prod')
  .description('Deploy to production environment with version management and PR creation')
  .action(deployProd);

program.parse(process.argv);
