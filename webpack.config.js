const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let components = [
  './src/Chat/chat',
  './src/Speedometer/speedometer'
];

let plugins = [new CleanWebpackPlugin()];
let htmlWebpackPlugins = components.map((component) => new HtmlWebpackPlugin({ filename: component.replace('./src/', '').concat('.html'), template: `${component}.html` }));
plugins = plugins.concat(htmlWebpackPlugins);

module.exports = {
  entry: {
    'Chat/chat': './src/Chat/chat.ts',
    'Speedometer/speedometer': './src/Speedometer/speedometer.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.ts']
  },
  plugins: plugins,
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader' }
    ]
  }
};