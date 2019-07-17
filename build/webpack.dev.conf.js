'use strict'
const BaseWebpackConfig = require('./webpack.base.conf')
const devServer = require('./devServer')
const merge = require('webpack-merge')

const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const smp = new SpeedMeasurePlugin();

const DevWebpackConfig = merge(BaseWebpackConfig, {
  mode: 'development',
  devServer: devServer,
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.styl(us)?$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'stylus-loader'
        ]
      }
    ]
  }
})

module.exports = smp.wrap(DevWebpackConfig);