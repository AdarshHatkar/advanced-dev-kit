#!/usr/bin/env node

/**
 * Demo script to showcase the beautiful ADK CLI features
 * Run this to see all the enhanced UI elements in action
 */

import chalk from 'chalk';
import boxen from 'boxen';
import gradient from 'gradient-string';
import figlet from 'figlet';
import { ui } from '../src/utils/ui-helpers.js';

console.clear();

// Welcome banner
console.log(gradient.rainbow(figlet.textSync('ADK Demo', { 
  font: 'ANSI Shadow',
  horizontalLayout: 'fitted' 
})));

console.log(boxen(
  chalk.cyan('🎨 ') + chalk.bold.white('Beautiful CLI Demo') + chalk.cyan(' 🎨\n\n') +
  chalk.gray('Showcasing enhanced UI features'),
  {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'magenta',
    backgroundColor: '#1a1a2e'
  }
));

async function demo() {
  // Section demo
  ui.section('🎯 Section Headers', 'Beautiful organized content sections');
  
  // Messages demo
  ui.success('Success message', 'Operation completed successfully');
  ui.info('Information message', 'Here\'s some useful information');
  ui.warning('Warning message', 'Please pay attention to this');
  ui.error('Error message', 'Something went wrong here');
  
  console.log('\n');
  
  // Spinner demo
  ui.section('⏳ Loading Animations', 'Beautiful progress indicators');
  const spinner = ui.createSpinner('Processing data...');
  spinner.start();
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  spinner.text = 'Finalizing...';
  await new Promise(resolve => setTimeout(resolve, 1000));
  spinner.stop();
  
  ui.success('Loading completed!');
  
  // Progress bar demo
  console.log('\n');
  ui.section('📊 Progress Visualization', 'Track progress with style');
  
  for (let i = 0; i <= 10; i++) {
    console.clear();
    console.log(gradient.rainbow(figlet.textSync('ADK Demo', { 
      font: 'ANSI Shadow',
      horizontalLayout: 'fitted' 
    })));
    
    console.log('\n📊 Progress Demo:\n');
    console.log('Installing packages: ' + ui.progressBar(i, 10, 30));
    
    if (i < 10) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }
  
  ui.success('Installation complete!');
  
  // Table demo
  console.log('\n');
  ui.section('📋 Data Tables', 'Organize information beautifully');
  
  ui.table([
    { key: 'Project Name', value: 'advanced-dev-kit' },
    { key: 'Version', value: '1.0.0' },
    { key: 'Dependencies', value: '15 packages' },
    { key: 'Build Time', value: '2.3s' },
    { key: 'Bundle Size', value: '28.6 KB' },
    { key: 'Status', value: '✅ Ready' }
  ]);
  
  // Confirmation boxes demo
  console.log('\n');
  ui.section('📦 Status Boxes', 'Highlight important information');
  
  ui.confirmBox('✅ All systems operational and ready for development!', 'success');
  ui.confirmBox('⚠️ Remember to update your dependencies regularly', 'warning');
  ui.confirmBox('❌ This is how error messages look in the new UI', 'error');
  ui.confirmBox('ℹ️ Pro tip: Use shortcuts for faster development workflow', 'info');
  
  // Gradient text demo
  console.log('\n');
  ui.section('🌈 Beautiful Text', 'Colorful and eye-catching typography');
  
  console.log(ui.gradientText('Beautiful gradient text effects!'));
  console.log(chalk.cyan('Cyan colored text'));
  console.log(chalk.bold.yellow('Bold yellow emphasis'));
  console.log(chalk.underline.green('Underlined green text'));
  
  // Final message
  console.log('\n');
  console.log(boxen(
    chalk.green('🎉 ') + chalk.bold.white('Demo Complete!') + chalk.green(' 🎉\n\n') +
    chalk.gray('Your ADK CLI now has beautiful, modern styling with:\n') +
    chalk.cyan('• ') + chalk.white('Animated loading spinners\n') +
    chalk.cyan('• ') + chalk.white('Progress bars and visualizations\n') +
    chalk.cyan('• ') + chalk.white('Colorful status messages\n') +
    chalk.cyan('• ') + chalk.white('Organized data tables\n') +
    chalk.cyan('• ') + chalk.white('Beautiful ASCII art headers\n') +
    chalk.cyan('• ') + chalk.white('Enhanced interactive prompts'),
    {
      padding: 1,
      margin: { top: 1, bottom: 1, left: 0, right: 0 },
      borderStyle: 'round',
      borderColor: 'green',
      backgroundColor: '#003300'
    }
  ));
  
  console.log(chalk.gray('\nRun ') + chalk.cyan('adk --help') + chalk.gray(' to see all available commands!'));
}

demo().catch(console.error);
