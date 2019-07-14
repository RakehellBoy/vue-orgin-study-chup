# const { CleanWebpackPlugin } = require('clean-webpack-plugin')  =>  new CleanWebpackPlugin()

# webpack  webpack-cli  webpack-dev-server  webpack-merge 四件套

# vue 使用 vue-loader vue-template-compiler加载模板; 
# vue-style-loader css-loader加载css样式; 
# vue-style-loader css-loader stylus stylus-loader 加载stylus样式 以此类推解决sass scss等
# url-loader file-loader 解决文件图片等资源加载
# babel-loader配合@babel/core  @babel/preset-env 加一个.babelrc配置文件解决ES6语法解析

## babel preset state
     // Stage 0
    "@babel/plugin-proposal-function-bind",

    // Stage 1
    "@babel/plugin-proposal-export-default-from",
    "@babel/plugin-proposal-logical-assignment-operators",
    ["@babel/plugin-proposal-optional-chaining", { "loose": false }],
    ["@babel/plugin-proposal-pipeline-operator", { "proposal": "minimal" }],
    ["@babel/plugin-proposal-nullish-coalescing-operator", { "loose": false }],
    "@babel/plugin-proposal-do-expressions",

    // Stage 2
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    "@babel/plugin-proposal-function-sent",
    "@babel/plugin-proposal-export-namespace-from",
    "@babel/plugin-proposal-numeric-separator",
    "@babel/plugin-proposal-throw-expressions",

    // Stage 3
    "@babel/plugin-syntax-dynamic-import", 动态import引入支持
    "@babel/plugin-syntax-import-meta",
    ["@babel/plugin-proposal-class-properties", { "loose": true }],
    "@babel/plugin-proposal-json-strings" -->

# @babel/plugin-transform-async-to-generator async函数使用

## ESLint，可将 静态代码分析 和 问题代码协助修复 集成到 编码、提交 和 打包 过程中，及早发现并协助修复代码中：

   * 有语法错误的部分
   * 不符合约定的样式准则的部分
   * 不符合约定的最佳实践的部分

   * 在项目开发中获得如下收益：
   * 在执行代码之前发现并修复语法错误，减少调试耗时和潜在 bug
   * 保证项目的编码风格统一，提高可维护性
   * 督促团队成员在编码时遵守约定的最佳实践，提高代码质量
# 1. 多次指定同一选项，每次接收一个不同的参数
    eslint --ext .jsx --ext .js lib/

# 2. 将参数列表用逗号分隔，一次传给选项
    eslint --ext .jsx,.js lib/

# 配置文件格式
    JavaScript - use .eslintrc.js 文件导出一个包含配置信息的对象
    JSON - 使用 .eslintrc.json 定义配置信息，JSON 文件中支持 JavaScript 注释。
    package.json - 在 package.json 文件中增加一个 eslintConfig 字段，在该字段中定义配置信息。
    .eslintrc - 已废弃
#如果在同一个目录中有多个配置文件，则它们中间只有一个是有效的，优先级如下：

    .eslintrc.js
    .eslintrc.yaml
    .eslintrc.yml
    .eslintrc.json
    .eslintrc
    .package.json
# 可在文件中使用注释配置禁用全部规则或指定规则：


块级禁用
    /* eslint-disable */
    alert('foo');
    console.log('bar');
    /* eslint-enable no-alert, no-console */


在指定行中禁用
    alert('foo'); // eslint-disable-line no-alert, quotes, semi
    alert('foo'); /* eslint-disable-line no-alert, quotes, semi   */

#   babel-eslint perser解析器
    eslint
    eslint-config-standard 官方自己的基础校验规则
    eslint-friendly-formatter 错误提示友好
    eslint-loader 加载
    eslint-plugin-import
    eslint-plugin-node
    eslint-plugin-promise
    eslint-plugin-standard
    eslint-plugin-vue
    eslint-config-prettier 使用perttier
    eslint-plugin-prettier
    

    
    