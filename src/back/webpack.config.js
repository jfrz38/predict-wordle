const path = require('path');

module.exports = {
  entry: './wordle.ts',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'lib'),
    libraryTarget: 'var',
    library: 'PredictWordle'
  },
};
