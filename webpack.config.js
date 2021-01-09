const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let components = [
  'Chat',
  'Speedometer'
];

var entryPoints = {};
components
  .map((c) => ({ module: `${c}/${c.toLocaleLowerCase()}`, filename: path.resolve(__dirname, 'src', c, `${c.toLocaleLowerCase()}.ts`) }))
  .forEach((ep) => entryPoints[ep.module] = ep.filename);

let plugins = [new CleanWebpackPlugin()];
let htmlWebpackPlugins = components
  .map((c) => ({ input: path.resolve(__dirname, 'src', c, `${c.toLocaleLowerCase()}.html`), output: path.resolve(__dirname, 'dist', c, `${c.toLocaleLowerCase()}.html`) }))
  .map((c) => new HtmlWebpackPlugin({ template: c.input, filename: c.output }));
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