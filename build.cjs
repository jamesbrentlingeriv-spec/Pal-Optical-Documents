const { exec } = require('child_process');
const rollup = require('rollup');
const resolve = require('@rollup/plugin-node-resolve').default;
const commonjs = require('@rollup/plugin-commonjs');
const replace = require('@rollup/plugin-replace');
const fs = require('fs');
const path = require('path');

function compileTS() {
  return new Promise((resolvePromise, reject) => {
    console.log('Compiling TypeScript to JS...');
    exec('npx tsc -p tsconfig.build.json', (err, stdout, stderr) => {
      if (err) {
        console.error('TS Compilation failed:');
        console.error(stdout);
        console.error(stderr);
        // Do not reject immediately so we can see the errors
        reject(err);
      } else {
        console.log('TypeScript compiled successfully.');
        resolvePromise();
      }
    });
  });
}

async function bundle() {
  console.log('Bundling with Rollup...');
  try {
    const bundleInstance = await rollup.rollup({
      input: 'out-tsc/src/main.js',
      plugins: [
        resolve({
          browser: true,
          preferBuiltins: false,
          extensions: ['.js', '.jsx', '.json']
        }),
        commonjs(),
        replace({
          preventAssignment: true,
          'process.env.NODE_ENV': JSON.stringify('development')
        })
      ],
      // Suppress circular dependency warnings from React/motion packages
      onwarn: (warning, warn) => {
        if (warning.code === 'CIRCULAR_DEPENDENCY') return;
        warn(warning);
      }
    });

    // Ensure dist directory exists
    if (!fs.existsSync('dist')) {
      fs.mkdirSync('dist');
    }

    await bundleInstance.write({
      file: 'dist/bundle.js',
      format: 'iife',
      name: 'PalOpticalApp',
      sourcemap: true
    });
    console.log('Bundling completed: dist/bundle.js');
  } catch (err) {
    console.error('Rollup bundling failed:', err);
    throw err;
  }
}

async function main() {
  try {
    await compileTS();
    await bundle();
    console.log('Build finished successfully at', new Date().toLocaleTimeString());
  } catch (err) {
    console.error('Build process failed.');
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main };
