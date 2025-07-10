import chalk from 'chalk';
import ora from 'ora';
import { execSync } from 'child_process';
import { existsSync, readFileSync, mkdirSync, copyFileSync } from 'fs';
import { join } from 'path';
import boxen from 'boxen';
import gradientString from 'gradient-string';

// Helper function to get app name from app.json
function getAppName(): string {
  try {
    const appJsonPath = join(process.cwd(), 'app.json');
    if (existsSync(appJsonPath)) {
      const appJson = JSON.parse(readFileSync(appJsonPath, 'utf8'));
      return appJson.name || appJson.displayName || 'ReactNativeApp';
    }
    
    // Fallback to package.json if app.json doesn't exist
    const packageJsonPath = join(process.cwd(), 'package.json');
    if (existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
      return packageJson.name || 'ReactNativeApp';
    }
    
    return 'ReactNativeApp';
  } catch (error) {
    return 'ReactNativeApp';
  }
}

// Helper function to generate timestamp in format: DD_MM_YYYY_HH_MM
function getTimestamp(): string {
  const now = new Date();
  const day = now.getDate().toString().padStart(2, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const year = now.getFullYear();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  
  return `${day}_${month}_${year}_${hours}_${minutes}`;
}

// Helper function to copy APK to organized folder
function copyApkToBuildsFolder(buildType: string = 'release'): string | null {
  try {
    const appName = getAppName();
    const timestamp = getTimestamp();
    const apkBuildsDir = join(process.cwd(), 'apk_builds');
    
    // Create apk_builds directory if it doesn't exist
    if (!existsSync(apkBuildsDir)) {
      mkdirSync(apkBuildsDir, { recursive: true });
    }
    
    // Source APK path
    const sourceApkPath = join(process.cwd(), 'android', 'app', 'build', 'outputs', 'apk', buildType, `app-${buildType}.apk`);
    
    // Destination APK path with organized naming
    const destinationFileName = `${appName}_${buildType}_${timestamp}.apk`;
    const destinationPath = join(apkBuildsDir, destinationFileName);
    
    if (existsSync(sourceApkPath)) {
      copyFileSync(sourceApkPath, destinationPath);
      return destinationPath;
    }
    
    return null;
  } catch (error) {
    console.error('Error copying APK:', error);
    return null;
  }
}

// Helper function to handle Windows file locking issues
async function handleWindowsFileLocks() {
  console.log(boxen(
    chalk.yellow('⚠️  Windows File Lock Detected') + '\n' +
    chalk.gray('To fix this issue:') + '\n' +
    chalk.white('1. Close VS Code/Android Studio') + '\n' +
    chalk.white('2. Close Windows Explorer in project folder') + '\n' +
    chalk.white('3. Run: ') + chalk.cyan('taskkill /f /im java.exe') + '\n' +
    chalk.white('4. Try the build again'),
    {
      padding: { top: 0, bottom: 0, left: 1, right: 1 },
      borderStyle: 'round',
      borderColor: 'yellow',
      backgroundColor: '#1a1a00'
    }
  ));
}

export async function buildAndroidRelease(skipClean: boolean = false, buildType: string = 'release') {
  console.log(boxen(
    gradientString('green', 'blue')('📱 React Native Android Build') + '\n' +
    chalk.gray(`Building ${buildType} APK...`),
    {
      padding: { top: 0, bottom: 0, left: 1, right: 1 },
      margin: { top: 1, bottom: 1, left: 0, right: 0 },
      borderStyle: 'round',
      borderColor: 'green',
      backgroundColor: '#0a1a0a'
    }
  ));

  // Check if we're in a React Native project
  const androidDir = join(process.cwd(), 'android');
  if (!existsSync(androidDir)) {
    console.log(boxen(
      chalk.red('❌ Error: ') + chalk.white('No Android directory found\n') +
      chalk.gray('Make sure you\'re in a React Native project root'),
      {
        padding: { top: 0, bottom: 0, left: 1, right: 1 },
        borderStyle: 'round',
        borderColor: 'red',
        backgroundColor: '#1a0000'
      }
    ));
    return;
  }

  const gradlewPath = join(androidDir, 'gradlew.bat');
  const hasGradlewBat = existsSync(gradlewPath);
  
  if (!hasGradlewBat) {
    console.log(boxen(
      chalk.red('❌ Error: ') + chalk.white('gradlew.bat not found in android directory\n') +
      chalk.gray('Make sure your React Native project is properly set up'),
      {
        padding: { top: 0, bottom: 0, left: 1, right: 1 },
        borderStyle: 'round',
        borderColor: 'red',
        backgroundColor: '#1a0000'
      }
    ));
    return;
  }

  try {
    // Step 1: Clean (if not skipped)
    if (!skipClean) {
      const cleanSpinner = ora({
        text: chalk.cyan('Cleaning Android project...'),
        spinner: 'dots12',
        color: 'cyan'
      }).start();

      try {
        // First try to force delete build directory using PowerShell
        try {
          execSync('powershell -Command "if (Test-Path android\\app\\build) { Remove-Item -Path android\\app\\build -Recurse -Force }"', { 
            stdio: 'pipe',
            cwd: process.cwd()
          });
        } catch (e) {
          // If PowerShell fails, continue with gradle clean
        }

        execSync('cd android && gradlew.bat clean', { 
          stdio: 'pipe',
          cwd: process.cwd()
        });
        cleanSpinner.succeed(chalk.green('✓ Android project cleaned'));
      } catch (error: any) {
        // If clean fails, warn but continue with build
        cleanSpinner.warn(chalk.yellow('⚠ Clean had issues, proceeding with build...'));
        console.log(chalk.gray('Note: Some files may be locked by Windows Explorer or other processes'));
        
        // Check if it's the specific Windows file lock error
        if (error.message && error.message.includes('Unable to delete directory')) {
          await handleWindowsFileLocks();
        }
      }
    } else {
      console.log(chalk.gray('⏭ Skipping clean step'));
    }

    // Step 2: Build Release
    const buildSpinner = ora({
      text: chalk.cyan(`Building ${buildType} APK... (this may take a while)`),
      spinner: 'dots12',
      color: 'cyan'
    }).start();

    try {
      const buildCommand = buildType === 'debug' ? 'assembleDebug' : 'assembleRelease';
      execSync(`cd android && gradlew.bat ${buildCommand}`, { 
        stdio: 'pipe',
        cwd: process.cwd()
      });
      buildSpinner.succeed(chalk.green(`✓ ${buildType.charAt(0).toUpperCase() + buildType.slice(1)} APK built successfully`));
    } catch (error) {
      buildSpinner.fail(chalk.red(`✗ Failed to build ${buildType} APK`));
      throw error;
    }

    // Success message
    console.log(boxen(
      chalk.green('🎉 Build Complete!') + '\n' +
      chalk.gray(`Your ${buildType} APK is ready at:`) + '\n' +
      chalk.cyan(`android/app/build/outputs/apk/${buildType}/app-${buildType}.apk`),
      {
        padding: { top: 0, bottom: 0, left: 1, right: 1 },
        margin: { top: 1, bottom: 0, left: 0, right: 0 },
        borderStyle: 'round',
        borderColor: 'green',
        backgroundColor: '#0a1a0a'
      }
    ));

    // Copy APK to organized builds folder
    const copySpinner = ora({
      text: chalk.cyan('Organizing APK in builds folder...'),
      spinner: 'dots12',
      color: 'cyan'
    }).start();

    const copiedApkPath = copyApkToBuildsFolder(buildType);
    
    if (copiedApkPath) {
      copySpinner.succeed(chalk.green('✓ APK copied to builds folder'));
      console.log(boxen(
        chalk.blue('📦 APK Organized!') + '\n' +
        chalk.gray('Copied to:') + '\n' +
        chalk.cyan(copiedApkPath.replace(process.cwd(), '.')),
        {
          padding: { top: 0, bottom: 0, left: 1, right: 1 },
          margin: { top: 1, bottom: 0, left: 0, right: 0 },
          borderStyle: 'round',
          borderColor: 'blue',
          backgroundColor: '#0a0a1a'
        }
      ));
    } else {
      copySpinner.warn(chalk.yellow('⚠ Could not copy APK to builds folder'));
    }

  } catch (error: any) {
    console.log(boxen(
      chalk.red('💥 Build Failed') + '\n' +
      chalk.white(error.message || 'Unknown error occurred'),
      {
        padding: { top: 0, bottom: 0, left: 1, right: 1 },
        borderStyle: 'round',
        borderColor: 'red',
        backgroundColor: '#1a0000'
      }
    ));
    throw error;
  }
}

// Wrapper function for debug builds
export async function buildAndroidDebug(skipClean: boolean = false) {
  return await buildAndroidRelease(skipClean, 'debug');
}
