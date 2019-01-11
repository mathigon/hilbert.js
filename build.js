import resolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'index.js',
  dest: 'build/hilbert.js',
  format: 'cjs',
  plugins: [
    resolve({
      module: true,
      preferBuiltins: false,
      modulesOnly: true
    })
  ]
};
