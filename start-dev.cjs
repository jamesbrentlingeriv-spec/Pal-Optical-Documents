const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Pal Optical Forms in Development Mode...');

// Determine shell for Windows platform compatibility
const shell = process.platform === 'win32' ? true : false;

// 1. Start Webpack compiler in watch mode
console.log('Starting Webpack compiler in watch mode...');
const webpackProcess = spawn('npx', ['webpack', '--config', 'webpack.config.cjs', '--watch'], {
  stdio: 'inherit',
  shell: shell
});

// 2. Start node static server
console.log('Starting local web server...');
const serverProcess = spawn('node', ['server.cjs'], {
  stdio: 'inherit',
  shell: shell
});

// 3. Process lifecycle coordination
process.on('SIGINT', () => {
  console.log('\nStopping development processes...');
  webpackProcess.kill();
  serverProcess.kill();
  process.exit();
});

process.on('exit', () => {
  webpackProcess.kill();
  serverProcess.kill();
});
