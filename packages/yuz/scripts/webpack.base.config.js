  
const path = require('path');
const nodeExternals = require('webpack-node-externals');

const srcResolve = function (file) {
  return path.join(__dirname, '..', 'src', file);
};

const distResolve = function (file) {
  return path.join(__dirname, '..', 'dist', file);
};

module.exports = {
  target: 'node',
  entry: {
    'bin/yuz': srcResolve('bin/index.ts'),
    'index': srcResolve('index.ts'),
  },
  output: {
    path: distResolve(''),
    filename: '[name].js'
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: "ts-loader"
      }
    ]
  },
  externals: [nodeExternals()],
  plugins: [
   
  ],
  optimization: {}
};