const path = require('path');

module.exports = {
  entry: {
    'src/Chat/chat': '/src/Chat/chat.ts',
    'src/Speedometer/speedometer': '/src/Speedometer/speedometer.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  }
};