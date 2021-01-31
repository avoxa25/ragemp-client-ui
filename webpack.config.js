const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

let htmlComponents = [
  'Chat',
  'Home',
  'Speedometer'
];

var entryPoints = {};
entryPoints['index'] = path.resolve(__dirname, 'src', 'index.ts');
htmlComponents
  .map((c) => ({ folder: c, file: c.replace(/([A-Z]{1})/g, '-$1').toLocaleLowerCase().slice(1) }))
  .map((ep) => ({ module: `${ep.folder}/${ep.file}`, filename: path.resolve(__dirname, 'src', ep.folder, `${ep.file}.ts`) }))
  .forEach((ep) => entryPoints[ep.module] = ep.filename);

module.exports = {
  entry: entryPoints,
  output: {
    path: path.resolve(__dirname, 'src'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.ts']
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader' }
    ]
  },
  plugins: [
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3000,
      server: { baseDir: [path.resolve(__dirname, 'src')] }
    })
  ]
};
