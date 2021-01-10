const path = require('path');

let htmlComponents = [
  'Chat',
  'Speedometer'
];

var entryPoints = {};
entryPoints['index'] = path.resolve(__dirname, 'src', `index.ts`);
htmlComponents
  .map((c) => ({ module: `${c}/${c.toLocaleLowerCase()}`, filename: path.resolve(__dirname, 'src', c, `${c.toLocaleLowerCase()}.ts`) }))
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
  }
};