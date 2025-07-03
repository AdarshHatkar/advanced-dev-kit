import { Command } from 'commander';
import chalk from 'chalk';
import { doTask } from '../src/commands/do-task.js';
import { clean } from '../src/commands/clean.js';
import { deployDev, deployProd } from '../src/commands/deploy.js';

const program = new Command();

program
  .name('adk')
  .description('Advanced Dev Kit CLI')
  .version('0.1.0');

program
  .command('do-task')
  .description('Run a custom dev task')
  .action(doTask);

program
  .command('clean')
  .description('Clean temporary folders/files')
  .action(clean);

// Deploy command with subcommands
const deployCommand = program
  .command('deploy')
  .description('Deployment commands');

deployCommand
  .command('dev')
  .description('Deploy to development environment (push to dev branch)')
  .action(deployDev);

deployCommand
  .command('prod')
  .description('Deploy to production environment with version management and PR creation')
  .action(deployProd);

program.parse(process.argv);
