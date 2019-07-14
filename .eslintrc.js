module.exports = {
  root: true, 
  parserOptions: {
    parser: 'babel-eslint'  //默认使用Espree作为其解析器
  },
  env: {
    browser: true, 
    node: true
  },
  // eslint:recommended 或 eslint:all
  extends: ['standard', 'plugin:vue/recommended', 'plugin:prettier/recommended'], // 继承第三方已有配置,后面覆盖前面
  plugins: [   // 插件是第三方定制的规则集合，plugins 参数用于指定第三方插件，eslint-plugin- 前缀省略
    // 'vue'
  ],
  rules: {
    "prettier/prettier": "error",
    'generator-star-spacing': 'off',
    // 'space-before-function-paren': 'off',
    // 'vue/require-v-for-key': 'off',
    'no-debugger': process.env.NODE_ENV === 'production'? 'error': 'off'
  },
  // 在 overrides.files 且不在 overrides.excludedFiles 的 文件，overrides.rules 中的规则会覆盖 rules 中的同名规则。
  overrides: [
    {
      "files": ["*-test.js","*.spec.js"],
      "excludedFiles": "*.test.js",
      "rules": {
        "no-unused-expressions": "off"
      }
    }
  ]
}
