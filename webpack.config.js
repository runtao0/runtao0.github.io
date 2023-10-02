const path = require('path');

module.exports = {
  entry: './lib/main.js',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'bundle.js',
  },
  // module: {
  //   loaders: [
  //     {
  //       test: [/\.js?$/],
  //       exclude: /(node_modules)/,
  //       loader: 'babel',
  //       query: {
  //         presets: ['es2015']
  //       }
  //     }
  //   ]
  // },
  // devtool: 'source-map',
  // resolve: {
  //   extensions: ['', '.js']
  // },
  // debug: true,
};
