import pkg from './package.json';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default [
  {
    input: 'index.js',
    output: {
      file: pkg.browser,
      format: 'umd'
    },
    plugins: [resolve(), commonjs()]
  },
  {
    input: 'index-interactive.js',
    output: {
      file: pkg.browser_interactive,
      format: 'umd'
    },
    plugins: [resolve(), commonjs()]
  },
  {
    input: 'index-interactive-cols.js',
    output: {
      file: pkg.browser_interactive_cols,
      format: 'umd'
    },
    plugins: [resolve(), commonjs()]
  },
  {
    input: 'index-pattern.js',
    output: {
      file: pkg.browser_pattern,
      format: 'umd'
    },
    plugins: [resolve(), commonjs()]
  },
  {
    input: 'index-poisson.js',
    output: {
      file: pkg.browser_poisson,
      format: 'umd'
    },
    plugins: [resolve(), commonjs()]
  },
  {
    input: 'index-img.js',
    output: {
      file: pkg.browser_img,
      format: 'umd'
    },
    plugins: [resolve(), commonjs()]
  }
];
