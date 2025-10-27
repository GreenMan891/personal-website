// --- Use require() instead of import ---
const dts = require('rollup-plugin-dts').default;
const typescript = require('@rollup/plugin-typescript');
const commonjs = require('@rollup/plugin-commonjs');
const resolve = require('@rollup/plugin-node-resolve');
const peerDepsExternal = require('rollup-plugin-peer-deps-external');
const copy = require('rollup-plugin-copy');

const packageJson = require('./package.json');

// Change the export to be an array of configurations
module.exports = [
  // --- CONFIGURATION FOR JAVASCRIPT BUNDLES ---
  {
    input: 'src/Hexa.tsx',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
      copy({
        targets: [
          { src: 'src/assets', dest: 'dist/assets' } // Corrected destination
        ]
      })
    ],
  },
  
  // --- NEW CONFIGURATION FOR BUNDLING TYPES ---
  {
    input: 'dist/types/Hexa.d.ts', // The entry point for our generated types
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()],
  },
];