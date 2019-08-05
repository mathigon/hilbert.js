import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'index.js',
  output: {
    file: 'build/hilbert.js',
    format: 'cjs'
  },
  plugins: [
    resolve({
      module: true,
      preferBuiltins: false,
      modulesOnly: true
    })
  ]
};
