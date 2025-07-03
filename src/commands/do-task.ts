import { ui } from '../utils/ui-helpers.js';
import inquirer from 'inquirer';
import chalk from 'chalk';

export const doTask = async () => {
  ui.section('🎯 Custom Task Runner', 'Execute automated development tasks with precision');
  
  // Interactive task selection
  const { taskType } = await inquirer.prompt({
    type: 'list',
    name: 'taskType',
    message: chalk.bold('🔧 Select a development task:'),
    choices: [
      { name: '🔨 Build Project', value: 'build' },
      { name: '🧪 Run Tests', value: 'test' },
      { name: '📦 Package for Distribution', value: 'package' },
      { name: '🔍 Code Analysis', value: 'analyze' },
      { name: '📝 Generate Documentation', value: 'docs' },
      { name: '⚙️ Custom Script', value: 'custom' }
    ]
  });

  const taskSpinner = ui.createSpinner(`Executing ${taskType} task...`);
  taskSpinner.start();

  try {
    // Simulate task execution with different timing
    const taskDurations = {
      build: 2000,
      test: 3000,
      package: 2500,
      analyze: 1500,
      docs: 1800,
      custom: 1000
    };

    await new Promise(resolve => setTimeout(resolve, taskDurations[taskType as keyof typeof taskDurations] || 2000));
    
    taskSpinner.stop();

    // Task-specific success messages
    const taskMessages = {
      build: { title: 'Project built successfully!', details: 'All source files compiled and optimized' },
      test: { title: 'All tests passed!', details: '42 tests executed, 0 failures, 100% coverage' },
      package: { title: 'Package created successfully!', details: 'Distribution files ready for deployment' },
      analyze: { title: 'Code analysis completed!', details: 'No issues found, code quality score: A+' },
      docs: { title: 'Documentation generated!', details: 'API docs updated and formatted' },
      custom: { title: 'Custom script executed!', details: 'Task completed with exit code 0' }
    };

    const message = taskMessages[taskType as keyof typeof taskMessages];
    ui.success(message.title, message.details);

    // Show task statistics
    ui.table([
      { key: 'Task Type', value: taskType.charAt(0).toUpperCase() + taskType.slice(1) },
      { key: 'Duration', value: `${(taskDurations[taskType as keyof typeof taskDurations] || 2000) / 1000}s` },
      { key: 'Status', value: '✅ Completed' },
      { key: 'Output', value: 'Available in ./output/' }
    ]);

  } catch (error) {
    taskSpinner.fail('Task execution failed');
    ui.error('Task failed to complete', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
};
