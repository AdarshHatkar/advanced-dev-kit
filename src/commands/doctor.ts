import chalk from 'chalk';
import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface HealthCheck {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  message: string;
}

export async function doctor(): Promise<void> {
  console.log(chalk.blue.bold('\n🔍 ADK Health Check\n'));
  console.log(chalk.gray('Checking if Advanced Dev Kit is properly installed and configured...\n'));
  
  const checks: HealthCheck[] = [];
  
  // Check ADK installation
  try {
    const packageJsonPath = join(__dirname, '../../package.json');
    if (existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
      checks.push({
        name: 'ADK Installation',
        status: 'pass',
        message: `ADK v${packageJson.version} is installed correctly`
      });
    } else {
      checks.push({
        name: 'ADK Installation',
        status: 'fail',
        message: 'ADK package files not found'
      });
    }
  } catch (error) {
    checks.push({
      name: 'ADK Installation',
      status: 'fail',
      message: 'ADK installation appears corrupted'
    });
  }

  // Check Node.js version compatibility
  try {
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (majorVersion >= 18) {
      checks.push({
        name: 'Node.js Compatibility',
        status: 'pass',
        message: `Node.js ${nodeVersion} is compatible`
      });
    } else if (majorVersion >= 16) {
      checks.push({
        name: 'Node.js Compatibility',
        status: 'warn',
        message: `Node.js ${nodeVersion} works but v18+ recommended`
      });
    } else {
      checks.push({
        name: 'Node.js Compatibility',
        status: 'fail',
        message: `Node.js ${nodeVersion} is too old (minimum v16 required)`
      });
    }
  } catch (error) {
    checks.push({
      name: 'Node.js Compatibility',
      status: 'fail',
      message: 'Unable to detect Node.js version'
    });
  }

  // Check npm availability (required for some ADK features)
  try {
    execSync('npm --version', { stdio: 'pipe' });
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    checks.push({
      name: 'npm Availability',
      status: 'pass',
      message: `npm v${npmVersion} is available`
    });
  } catch (error) {
    checks.push({
      name: 'npm Availability',
      status: 'fail',
      message: 'npm not found (required for some ADK features)'
    });
  }

  // Check git availability (required for deploy commands)
  try {
    execSync('git --version', { stdio: 'pipe' });
    const gitVersion = execSync('git --version', { encoding: 'utf8' }).trim();
    checks.push({
      name: 'Git for Deploy Commands',
      status: 'pass',
      message: `${gitVersion} is available`
    });
  } catch (error) {
    checks.push({
      name: 'Git for Deploy Commands',
      status: 'warn',
      message: 'Git not found (deploy commands will not work)'
    });
  }

  // Check if current directory is a project (has package.json)
  const currentDir = process.cwd();
  const projectPackageJson = join(currentDir, 'package.json');
  
  if (existsSync(projectPackageJson)) {
    try {
      const projectPkg = JSON.parse(readFileSync(projectPackageJson, 'utf8'));
      checks.push({
        name: 'Current Project',
        status: 'pass',
        message: `Working in project: ${projectPkg.name || 'unnamed project'}`
      });
    } catch (error) {
      checks.push({
        name: 'Current Project',
        status: 'warn',
        message: 'package.json found but invalid format'
      });
    }
  } else {
    checks.push({
      name: 'Current Project',
      status: 'warn',
      message: 'Not in a Node.js project directory (some features may be limited)'
    });
  }

  // Check if we're in a git repository (for deploy commands)
  try {
    execSync('git rev-parse --git-dir', { stdio: 'pipe', cwd: currentDir });
    checks.push({
      name: 'Git Repository Status',
      status: 'pass',
      message: 'Current directory is a git repository (deploy commands available)'
    });
  } catch (error) {
    checks.push({
      name: 'Git Repository Status',
      status: 'warn',
      message: 'Not in a git repository (deploy commands will not work here)'
    });
  }

  // Test basic ADK commands availability
  try {
    // Check if ADK commands are accessible (basic smoke test)
    const adkCommands = ['do-task', 'clean', 'deploy'];
    const commandsPath = join(__dirname, '../commands');
    const availableCommands = adkCommands.filter(cmd => 
      existsSync(join(commandsPath, `${cmd}.js`)) || existsSync(join(commandsPath, `${cmd}.ts`))
    );

    if (availableCommands.length === adkCommands.length) {
      checks.push({
        name: 'ADK Commands',
        status: 'pass',
        message: 'All ADK commands are available'
      });
    } else {
      checks.push({
        name: 'ADK Commands',
        status: 'fail',
        message: `Some ADK commands are missing: ${adkCommands.filter(cmd => !availableCommands.includes(cmd)).join(', ')}`
      });
    }
  } catch (error) {
    checks.push({
      name: 'ADK Commands',
      status: 'fail',
      message: 'Unable to verify ADK commands availability'
    });
  }

  // Display results
  let hasErrors = false;
  let hasWarnings = false;

  checks.forEach(check => {
    const icon = check.status === 'pass' ? '✅' : check.status === 'warn' ? '⚠️' : '❌';
    const color = check.status === 'pass' ? chalk.green : check.status === 'warn' ? chalk.yellow : chalk.red;
    
    console.log(`${icon} ${chalk.bold(check.name)}: ${color(check.message)}`);
    
    if (check.status === 'fail') hasErrors = true;
    if (check.status === 'warn') hasWarnings = true;
  });

  // Summary
  console.log('\n' + chalk.blue.bold('Summary:'));
  
  if (!hasErrors && !hasWarnings) {
    console.log(chalk.green.bold('🎉 ADK is working perfectly! All features are ready to use.'));
    console.log(chalk.green('You can now use all ADK commands:'));
    console.log(chalk.gray('  • npx adk do-task   - Run custom development tasks'));
    console.log(chalk.gray('  • npx adk clean     - Clean temporary files'));
    console.log(chalk.gray('  • npx adk deploy    - Deploy your project'));
  } else if (!hasErrors && hasWarnings) {
    console.log(chalk.yellow.bold('⚠️  ADK is working but some features may be limited.'));
    console.log(chalk.yellow('Review the warnings above to enable all features.'));
  } else {
    console.log(chalk.red.bold('❌ ADK has installation issues that need attention.'));
    console.log(chalk.red('Please fix the errors above or reinstall ADK:'));
    console.log(chalk.gray('  npm install -g advanced-dev-kit'));
  }

  console.log('\n' + chalk.gray('Need help? Visit: https://github.com/AdarshHatkar/advanced-dev-kit'));
  console.log(chalk.gray('Report issues: https://github.com/AdarshHatkar/advanced-dev-kit/issues\n'));
}
