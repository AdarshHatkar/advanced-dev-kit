// Main entry point for the advanced development kit
export * from './commands/do-task';
export * from './commands/clean';

// Version information
export const VERSION = '1.0.0';

// Utility functions
export function getToolkitInfo() {
  return {
    name: 'Advanced Development Kit',
    version: VERSION,
    description: 'A comprehensive toolkit for modern development workflows'
  };
}
