var debug = (process.env.NODE_ENV !== 'production');
var webpack = require('webpack');

module.exports = {
  context: __dirname,
  entry: './src/stepper/stepper.js',
  output: {
    path: __dirname,
    filename: debug ? 'stepper.js' : 'stepper.min.js',
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  },
  plugins: debug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      mangle: false,
      sourcemap: false
    }),
  ],
};