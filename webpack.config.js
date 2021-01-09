const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let components = [
  'Chat',
  'Speedometer'
];

var entryPoints = {};
components
  .map((c) => ({ module: path.resolve(__dirname, 'src', c, c.toLocaleLowerCase()), outputFile: `${c.toLocaleLowerCase()}.ts` }))
  .forEach((ep) => entryPoints[ep.module] = ep.outputFile);

let plugins = [new CleanWebpackPlugin()];
let htmlWebpackPlugins = components
  .map((c) => ({ filename: path.resolve(__dirname, 'src', c, `${c.toLocaleLowerCase()}.html`), template: `${c}.html` }))
  .map((c) => new HtmlWebpackPlugin({ filename: c.filename, template: c.template }));
plugins = plugins.concat(htmlWebpackPlugins);

module.exports = {
  entry: entryPoints,
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