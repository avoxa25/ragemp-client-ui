const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const htmlComponents = [
  'Character/SpawnSelect',
  'Character/Creator',
  'Chat',
  'HUD/Location',
  'Speedometer'
];

const entryPoints = {};
entryPoints['index'] = path.resolve(__dirname, 'src', 'index.ts');

htmlComponents
  .map((c) => ({ folder: c, file: c.replace(/^[\w\d\/]*\//g, '') }))
  .map((ep) => ({ folder: ep.folder, file: ep.file.replace(/([A-Z]{1})/g, '-$1').toLocaleLowerCase().slice(1) }))
  .map((ep) => ({ module: `${ep.folder}/${ep.file}`, filename: path.resolve(__dirname, 'src', ep.folder, `${ep.file}.ts`) }))
  .forEach((ep) => entryPoints[ep.module] = ep.filename);

module.exports = (env, argv) => {
  const config = {
    mode: argv.mode,
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
    ],
    optimization: {
      minimize: argv.mode === 'production',
      nodeEnv: argv.mode
    }
  };

  return config;
};
