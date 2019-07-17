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
    eslint-config-prettier  为了让 eslint 跟 prettier 兼容，关闭 prettier 跟 eslint 冲突的rules
    eslint-plugin-prettier  为了 eslint 跟 prettier 可以联合使用
    






## Git 常用命令列表
$ git fetch origin                                                # 从远程库获取代码

# 创建版本库
$ git clone <url>                 # 克隆远程版本库
$ git init                        # 初始化本地版本库
#  修改和提交
$ git status                      # 查看状态
$ git diff                        # 查看变更内容
$ git add .                       # 跟踪所有改动过的文件
$ git add <file>                  # 跟踪指定的文件
$ git mv <old> <new>              # 文件改名
$ git rm <file>                   # 删除文件
$ git rm --cached <file>          # 停止跟踪文件但不删除
$ git commit -m “commit message”  # 提交所有更新过的文件
$ git commit --amend              # 修改最后一次提交

# 查看提交历史
$ git log                         # 查看提交历史
$ git log -p <file>               # 查看指定文件的提交历史
$ git blame <file>                # 以列表方式查看指定文件的提交历史
# 撤消
$ git reset --hard HEAD           # 撤消工作目录中所有未提交文件的修改内容
$ git reset --hard <version>      # 撤销到某个特定版本
$ git checkout HEAD <file>        # 撤消指定的未提交文件的修改内容
$ git checkout -- <file>          # 同上一个命令
$ git revert <commit>             # 撤消指定的提交
#分支与标签
$ git branch                      # 显示所有本地分支
$ git checkout <branch/tag>       # 切换到指定分支或标签
$ git branch <new-branch>         # 创建新分支
$ git branch -d <branch>          # 删除本地分支
$ git tag                         # 列出所有本地标签
$ git tag <tagname>               # 基于最新提交创建标签
$ git tag -a "v1.0" -m "一些说明"  # -a指定标签名称，-m指定标签说明
$ git tag -d <tagname>            # 删除标签

$ git checkout dev                # 合并特定的commit到dev分支上
$ git cherry-pick 62ecb3
8 合并与衍合
$ git merge <branch>              # 合并指定分支到当前分支
$ git merge --abort               # 取消当前合并，重建合并前状态
$ git merge dev -Xtheirs          # 以合并dev分支到当前分支，有冲突则以dev分支为准
$ git rebase <branch>             # 衍合指定分支到当前分支
$ git merge master                      # 合并master分支
$ git push -u origin master             # 上传代码