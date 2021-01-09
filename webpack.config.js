const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
    'src/Chat/chat': '/src/Chat/chat.ts',
    'src/Speedometer/speedometer': '/src/Speedometer/speedometer.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.ts']
  },
  plugins: [
    new CleanWebpackPlugin()
  ],
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader' }
    ]
  }
};