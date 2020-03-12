/* @flow */

import { toArray } from '../util/index'

export function initUse (Vue: GlobalAPI) {
  Vue.use = function (plugin: Function | Object) {
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    // 判断插件是否已经注册
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // vue.use(plugin arg1, arg2), 将arguments转换成数组，并根据传入的数去掉指定的开头前n个，默认为0
    const args = toArray(arguments, 1) // toArray(arguments, 2) => [arg2], 去掉了前面两个 plugin 和 arg1
    args.unshift(this) // 将this(及构造函数Vue)作为数组第一个数

    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args) // args主要用于拼接install需要的参数,Vue构造函数作为一个参数
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    installedPlugins.push(plugin)
    return this
  }
}
