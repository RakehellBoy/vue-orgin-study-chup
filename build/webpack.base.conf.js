'use strict'
const utils = require('./utils')
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebapckPlugin = require('html-webpack-plugin')

const BaseWebpackConfig = {

  entry: {
    app: './src/main.js'
  },
  output: {
    path: utils.joinPath('dist'),
    filename: '[name].[chunkhash].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': utils.joinPath('src')
    }
  },
  module: {
    noParse: /jquery|lodash/,
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [utils.joinPath('src')],
        exclude: [utils.joinPath('node-modules')],
        options: {
          // formatter: require('eslint-friendly-formatter'),
          // emitWarning: true, // 将eslint error转化为warning显示 dev-server overly:true是 eslint的报错就不会在浏览器显示了
          // fix: true // 不提倡在这里配置, 因可能会编译两次，第一次正常启动，第二次因fix后检测到代码变动再次比编译
        }
      }, {
        test: /\.vue$/,
        loader: 'vue-loader'
      }, {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [utils.joinPath('src')],
        exclude: [utils.joinPath('node-modules')]
      }, { 
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      }, {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      }, {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
    new HtmlWebapckPlugin({
      template: 'index.html',
      filename: 'index.html'
    })
  ]
}

module.exports = BaseWebpackConfig