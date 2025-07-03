import { Command } from 'commander';
import chalk from 'chalk';
import { doTask } from '../src/commands/do-task.js';
import { clean } from '../src/commands/clean.js';

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

program.parse(process.argv);
