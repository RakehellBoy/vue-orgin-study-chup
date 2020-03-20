/* @flow */

import config from '../config'
import { warn } from './debug'
import { set } from '../observer/index'
import { unicodeRegExp } from './lang'
import { nativeWatch, hasSymbol } from './env'

import {
  ASSET_TYPES,
  LIFECYCLE_HOOKS
} from 'shared/constants'

import {
  extend,
  hasOwn,
  camelize,
  toRawType,
  capitalize,
  isBuiltInTag,
  isPlainObject
} from 'shared/util'

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
const strats = config.optionMergeStrategies

/**
 * Options with restrictions  
 */
if (process.env.NODE_ENV !== 'production') {
  // 默认策略: 子有取子 否则取父
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        `option "${key}" can only be used during instance ` +
        'creation with the `new` keyword.'
      )
    }
    return defaultStrat(parent, child)  // child定义直接取child,不需要合并(parent/child取其中之一)
  }
}

/**
 * Helper that recursively merges two data objects together.
 * data/provide 数据合并: 子中没有父中有, 将父copy到子中; 子父都有,判断子父是否 不相等 且 都为Object, 是进行深层mergeData
 * 即取变量就像: 先找子, 在到父中找。
 */
function mergeData(to: Object, from: ?Object): Object {
  if (!from) return to
  let key, toVal, fromVal

  const keys = hasSymbol ? Reflect.ownKeys(from) : Object.keys(from)

  for (let i = 0; i < keys.length; i++) {
    key = keys[i]
    // in case the object is already observed...
    if (key === '__ob__') continue  // 父中__ob__属性忽略
    toVal = to[key]
    fromVal = from[key]
    if (!hasOwn(to, key)) {
      set(to, key, fromVal)
    } else if (toVal !== fromVal && isPlainObject(toVal) && isPlainObject(fromVal)) {
      mergeData(toVal, fromVal)
    }
  }
  return to
}

/**
 * Data
 */
export function mergeDataOrFn(parentVal: any, childVal: any, vm?: Component): ?Function {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) { return parentVal } // 子没有 直接返回父
    if (!parentVal) { return childVal } // 父没有 直接返回子
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn() {
      // 如果子父为function 先执行函数; 最终想要的是mergeData(Obj1, Obj2)
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn() {
      // instance merge
      const instanceData = typeof childVal === 'function' ? childVal.call(vm, vm) : childVal
      const defaultData = typeof parentVal === 'function' ? parentVal.call(vm, vm) : parentVal
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (parentVal: any, childVal: any, vm?: Component): ?Function {
  if (!vm) {
    //mixin / extend扩展组件构造器中调用mergeOptions 未传入vm, 如data不是function则会提示以下错误
    //即除了 new Vue({...})中的data值可以不是function;  mixin,组件中定义data都要为function
    if (childVal && typeof childVal !== 'function') {
      process.env.NODE_ENV !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      )
      return parentVal // 非 new Vue({...})调用且data不是function  直接报错 返回parentVal
    }
    return mergeDataOrFn(parentVal, childVal)  // mixin/ 组件构造器中extend调用
  }
  return mergeDataOrFn(parentVal, childVal, vm) // new Vue({ data: ...})
}

/**
 * Hooks and props are merged as arrays. 
 * 生命周期钩子函数的合并策略 beforeCreate/created/beforeMount/mounted等 12个
 * 子父合并成一个数组: created: [pCreated, cCreated]; 父在前,即子父中都定义了, 两个created都执行; 先执行父 在执行子
 * 会对合并后的数组 去重(可能函数是变量引用的方法)
 */
function mergeHook(parentVal: ?Array<Function>, childVal: ?Function | ?Array<Function>): ?Array<Function> {
  // parentVal如果存在一定是个数组(parentVal若存在  就在其自身options合并时转化为数组)
  // parentVal, childVal都存在使用concat连接; childVal不存在取parentVal; childVal存在parentVal不存在 取数组形式 childVal
  const res = childVal ? parentVal ? parentVal.concat(childVal) : Array.isArray(childVal) ? childVal : [childVal] : parentVal
  // res是个一维数组; dedupeHooks去重(父子created 都指向同一个定义的函数)
  return res ? dedupeHooks(res) : res
}

function dedupeHooks(hooks) {
  const res = []
  for (let i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i])
    }
  }
  return res
}

LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook
})

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance options and parent options.
 * 将父作为prototype创建对象:components/directives/filters
 * childVal若存在 直接往新建对象res copy属性
 */
function mergeAssets(parentVal: ?Object, childVal: ?Object, vm?: Component, key: string): Object {
  const res = Object.create(parentVal || null) // parentVal可能undefined就去 null
  if (childVal) {
    process.env.NODE_ENV !== 'production' && assertObjectType(key, childVal, vm)
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets
})

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 * 子无 返回一个Object.create(parentVal || null), 父在 以父为prototype
 * 父无 返回childVal
 * 父子都有: parent 复制到 ret = {}, 在遍历childVal, 如果父子都存在 将父变为数组concat(child), 没有直接[child]
 * p:{ arg1: p1, arg2: p2 } c: { arg2: c2, arg3: c3 }   ==> ret:{ arg1: p1, arg2: [p2, c2], arg3: [c3] } 
 */
strats.watch = function (
  parentVal: ?Object,
  childVal: ?Object,
  vm?: Component,
  key: string
): ?Object {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) parentVal = undefined
  if (childVal === nativeWatch) childVal = undefined
  /* istanbul ignore if */
  if (!childVal) return Object.create(parentVal || null)
  if (process.env.NODE_ENV !== 'production') {
    assertObjectType(key, childVal, vm)
  }
  if (!parentVal) return childVal
  const ret = {}
  extend(ret, parentVal)
  for (const key in childVal) {
    let parent = ret[key]
    const child = childVal[key]
    if (parent && !Array.isArray(parent)) {
      parent = [parent]
    }
    ret[key] = parent ? parent.concat(child) : Array.isArray(child) ? child : [child]
  }
  return ret
}

/**
 * Other object hashes.
 * 父为空 返回子
 * 父有 复制父到 新对象ret; 子存在 直接用子属性覆盖ret
 * p: {v1: p1, v2: p2}   c: { v1: c1, v3: c3} ==> ret: { v1: c1: v2: p2, v3: c3 } 
 */
strats.props =
  strats.methods =
  strats.inject =
  strats.computed = function (
    parentVal: ?Object,
    childVal: ?Object,
    vm?: Component,
    key: string
  ): ?Object {
    if (childVal && process.env.NODE_ENV !== 'production') {
      assertObjectType(key, childVal, vm)  // 判断childVal是否是一个 纯对象 不是报错
    }
    if (!parentVal) return childVal
    const ret = Object.create(null)
    extend(ret, parentVal)
    if (childVal) extend(ret, childVal)
    return ret
  }
strats.provide = mergeDataOrFn

/**
 * Default strategy.
 * 默认合并策略: childVal有直接取childVal; childVal无(undefined)取parentVal(可能未定义,反正childVal未定义了)
 */
const defaultStrat = function (parentVal: any, childVal: any): any {
  return childVal === undefined ? parentVal : childVal
}

/**
 * Validate component names
 */
function checkComponents(options: Object) {
  for (const key in options.components) {
    validateComponentName(key)
  }
}

export function validateComponentName(name: string) {
  if (!new RegExp(`^[a-zA-Z][\\-\\.0-9_${unicodeRegExp.source}]*$`).test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'should conform to valid custom element name in html5 specification.'
    )
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    )
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 * 
 * props: {
 *   name: {
 *     type: null/String
 *     ... default  
 *   }
 * }
 */
function normalizeProps(options: Object, vm: ?Component) {
  const props = options.props
  if (!props) return
  const res = {}
  let i, val, name
  if (Array.isArray(props)) {
    i = props.length
    while (i--) {
      val = props[i]
      if (typeof val === 'string') {
        name = camelize(val)
        res[name] = { type: null }
      } else if (process.env.NODE_ENV !== 'production') {
        warn('props must be strings when using array syntax.')
      }
    }
  } else if (isPlainObject(props)) {
    for (const key in props) {
      val = props[key]
      name = camelize(key)
      res[name] = isPlainObject(val)
        ? val
        : { type: val }
    }
  } else if (process.env.NODE_ENV !== 'production') {
    warn(
      `Invalid value for option "props": expected an Array or an Object, ` +
      `but got ${toRawType(props)}.`,
      vm
    )
  }
  options.props = res
}

/**
 * Normalize all injections into Object-based format
 * 
 * inject: {
 *  foo: {
 *    from: xxx
 *    ...default
 *  } 
 * }
 */
function normalizeInject(options: Object, vm: ?Component) {
  const inject = options.inject
  if (!inject) return
  const normalized = options.inject = {}
  if (Array.isArray(inject)) {
    for (let i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] }
    }
  } else if (isPlainObject(inject)) {
    for (const key in inject) {
      const val = inject[key]
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val }
    }
  } else if (process.env.NODE_ENV !== 'production') {
    warn(
      `Invalid value for option "inject": expected an Array or an Object, ` +
      `but got ${toRawType(inject)}.`,
      vm
    )
  }
}

/**
 * Normalize raw function directives into object format.
 * 
 * directives: {
 *  filterName: {
 *    bind: func
 *    update: func
 *    ...
 *  }
 * }
 */
function normalizeDirectives(options: Object) {
  const dirs = options.directives
  if (dirs) {
    for (const key in dirs) {
      const def = dirs[key]
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def }
      }
    }
  }
}

function assertObjectType(name: string, value: any, vm: ?Component) {
  if (!isPlainObject(value)) {
    warn(
      `Invalid value for option "${name}": expected an Object, ` +
      `but got ${toRawType(value)}.`,
      vm
    )
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
export function mergeOptions(
  parent: Object,
  child: Object,
  vm?: Component
): Object {
  if (process.env.NODE_ENV !== 'production') {
    checkComponents(child)
  }

  if (typeof child === 'function') {
    child = child.options
  }

  normalizeProps(child, vm) // props: { name: { type: String, ...} }
  normalizeInject(child, vm) // inject: { foo: { from: xx, ... } }
  normalizeDirectives(child) // directives: { show: { bind: fun, update: fun, ...}}

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  if (!child._base) {
    if (child.extends) {  //child中的extends是个对象和 Vue.mixin 传入的对象一样 
      parent = mergeOptions(parent, child.extends, vm)
    }
    if (child.mixins) { // child中的mixins是一个mixin数组
      for (let i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm)
      }
    }
  }

  const options = {}
  let key
  for (key in parent) {
    mergeField(key)
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key)
    }
  }
  function mergeField(key) {
    const strat = strats[key] || defaultStrat
    options[key] = strat(parent[key], child[key], vm, key)
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 * components/directives/filters 查找已注册的内容, 将传入的 字符串依次 正常/小驼峰/大驼峰查找
 */
export function resolveAsset(
  options: Object,
  type: string,
  id: string,
  warnMissing?: boolean
): any {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  const assets = options[type]
  // check local registration variations first
  if (hasOwn(assets, id)) return assets[id]
  const camelizedId = camelize(id)
  if (hasOwn(assets, camelizedId)) return assets[camelizedId]
  const PascalCaseId = capitalize(camelizedId)
  if (hasOwn(assets, PascalCaseId)) return assets[PascalCaseId]
  // fallback to prototype chain
  // 上面 使用hasOwn只是在assets本身查找; 下方是进入prototype原型链查找
  const res = assets[id] || assets[camelizedId] || assets[PascalCaseId]
  if (process.env.NODE_ENV !== 'production' && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    )
  }
  return res
}
