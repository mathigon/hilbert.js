const typescript = require('rollup-plugin-typescript');

module.exports = {
  input: './index.ts',
  plugins: [typescript(require('./tsconfig.json').compilerOptions)],
  onwarn(e) {
    if (e.code !== 'CIRCULAR_DEPENDENCY') console.warn(e.message);
  },
  output: {
    file: 'dist/hilbert.js',
    format: 'cjs',
    name: 'app'
  }
};
