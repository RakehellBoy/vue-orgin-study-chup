module.exports = {
  root: true, 
  parserOptions: {
    parser: 'babel-eslint',  //默认使用Espree作为其解析器  @typescript-eslint/parser -
    ecmaVersion: 6,
    sourceType:  'module',// "script" (默认) 或 "module"
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    browser: false
    // node: true,
    // es6: true
  },
  globals: {
    "$": "readonly"
  },
  // eslint:recommended 或 eslint:all
  extends: ['plugin:vue/essential', 'standard'],// 继承第三方已有配置,后面覆盖前面
  plugins: [
    'vue'
  ],
  rules: {
    // "prettier/prettier": "error",
    'generator-star-spacing': 'off',
    // 'space-before-function-paren': 'off',
    'vue/script-indent': 'off',
    'no-console': "error",
    'no-debugger': process.env.NODE_ENV === 'production'? 'error': 'off'
  },
  // 在 overrides.files 且不在 overrides.excludedFiles 的 文件，overrides.rules 中的规则会覆盖 rules 中的同名规则。
  "overrides": [
    {
      "files": ["src/App.vue"],
      "excludedFiles": "*.test.js",
      "rules": {
        "indent": 1
      }
    }
  ]
}
