module.exports = {
  root: true, 
  parserOptions: {
    parser: 'babel-eslint',  //默认使用Espree作为其解析器  @typescript-eslint/parser -
    ecmaVersion: 6,
    sourceType:  'module'// "script" (默认) 或 "module"
  },
  env: {
    browser: true, 
    node: true,
    es6: true
  },
  // eslint:recommended 或 eslint:all
  extends: ['plugin:vue/essential', 'standard'],// 继承第三方已有配置,后面覆盖前面
  /** 插件可以提供处理器。处理器可以从另一种文件中提取 JavaScript 代码，然后让 ESLint 检测 JavaScript 代码。或者处理器可以在预处理中转换 JavaScript 代码。
      若要在配置文件中指定处理器，请使用 processor 键，并使用由插件名和处理器名组成的串接字符串加上斜杠。例如，下面的选项启用插件 a-plugin 提供的处理器 a-processor*/
  plugins: [
    'vue'
  ],
  rules: {
    // "prettier/prettier": "error",
    'generator-star-spacing': 'off',
    // 'space-before-function-paren': 'off',
    'vue/script-indent': 'off',
    'no-debugger': process.env.NODE_ENV === 'production'? 'error': 'off'
  },
  // 在 overrides.files 且不在 overrides.excludedFiles 的 文件，overrides.rules 中的规则会覆盖 rules 中的同名规则。
  "overrides": [
    {
        "files": ["*.vue"],
        "rules": {
            "indent": "off",
            "vue/script-indent": ["error", 4, {"baseIndent": 4}]
        }
    }
]
}
