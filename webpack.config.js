// DEV:
// ./node_modules/.bin/webpack -d --watch
// ./node_modules/.bin/webpack -p

const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  entry: './build/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env']
          }
        }
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'less-loader']
        })
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'img/icons',
              name: '[name].[ext]',
          },
          },
        ],
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'app.css',
      allChunks: true
    }),
    new VueLoaderPlugin()
  ],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js'
    }
  }
};