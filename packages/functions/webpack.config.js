// @ts-check

const package = require('./package.json');
const path = require('path');

/** @type {import('webpack').Configuration} */
const config = {
  mode: 'production',
  target: 'node',
  entry: './src/index.ts',
  output: {
    filename: 'index.js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: { projectReferences: true },
        },
        include: path.resolve(__dirname, 'src'),
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.css'],
  },
  externals: Object.keys(package.dependencies),
};

module.exports = config;
