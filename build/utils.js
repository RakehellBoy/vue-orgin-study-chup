'use strict'
const path = require('path')

const utils = {
  joinPath: function(__path) {
    return path.join(__dirname, '..', __path)
  },

  assetsPath: function (_path) {
    return path.posix.join('static', _path)
  }
}

module.exports = utils