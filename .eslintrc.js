module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
    mocha: true,
    amd: true,
    serviceworker: true
  },
  globals: {
    PRODUCTION: 'readonly',
    NODE_ENV: 'readonly',
    APP: 'readonly'
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'airbnb'],
  plugins: [
    'react',
    'react-hooks',
    'import',
    'jsx-a11y',
    '@typescript-eslint',
    'html',
    '@emotion'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    jsxPragma: 'React',
    ecmaVersion: 'latest',
    projectFolderIgnoreList: ['**/node_modules/**'],
    sourceType: 'module'
  },
  rules: {
    // 代码长度
    'max-len': [
      'error',
      {
        code: 1000,
        ignoreComments: true,
        ignoreUrls: true,
        ignoreTemplateLiterals: true
      }
    ],
    'semi': ['error', 'never'],
    'comma-dangle': ['error', 'never'],
    'func-names': 'off',
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-plusplus': 'off',
    'camelcase': 'off',
    'import/extensions': 'off',
    'no-use-before-define': 'off',
    'no-var-requires': 'off',
    'import/no-commonjs': 'off',
    'no-continue': 'off',
    'no-param-reassign': 'off',
    // 控制逗号前后的空格
    'comma-spacing': [2, { before: false, after: true }],
    // 控制逗号在行尾出现还是在行首出现
    // http://eslint.org/docs/rules/comma-style
    'comma-style': [2, 'last'],
    // 圈复杂度
    'complexity': [2, 12],
    // 文件末尾强制换行
    'eol-last': 2,
    'no-alert': 0, // 禁止使用alert confirm prompt
    'no-array-constructor': 2, // 禁止使用数组构造器
    'no-bitwise': 0, // 禁止使用按位运算符
    'no-caller': 1, // 禁止使用arguments.caller或arguments.callee
    'no-catch-shadow': 2, // 禁止catch子句参数与外部作用域变量同名
    'no-class-assign': 2, // 禁止给类赋值
    'no-cond-assign': 2, // 禁止在条件表达式中使用赋值语句
    'no-const-assign': 2, // 禁止修改const声明的变量
    'no-constant-condition': 2, // 禁止在条件中使用常量表达式 if(true) if(1)
    'no-dupe-keys': 2, // 在创建对象字面量时不允许键重复 {a:1,a:1}
    'no-dupe-args': 2, // 函数参数不能重复
    'no-duplicate-case': 2, // switch中的case标签不能重复
    'no-else-return': 2, // 如果if语句里面有return,后面不能跟else语句
    'quote-props': ['warn', 'consistent'],
    'react/no-unstable-nested-components': 'off',
    // 定义未使用
    'no-unused-vars': 'off',
    // 禁止标识符下划线
    'no-underscore-dangle': 'off',
    // 导入多次
    'import/no-duplicates': 0,
    'import/prefer-default-export': 0,
    // 禁止promise 使用async
    'no-async-promise-executor': 0,
    // image元素必须有alt标签
    'jsx-a11y/alt-text': 0,
    // 变量作用域
    'no-shadow': 'off',
    // 不允许嵌套的三元表达式
    'no-nested-ternary': 'off',
    'no-await-in-loop': 'off',
    'react/no-danger': 'off',
    'class-methods-use-this': 'off',
    'prefer-promise-reject-errors': ['error', { allowEmptyReject: true }],
    // 对象/数组 解构
    'prefer-destructuring': [
      'error',
      {
        array: true,
        object: true
      },
      {
        enforceForRenamedProperties: false
      }
    ],
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-shadow': 'error',
    '@emotion/jsx-import': 'off',
    '@emotion/no-vanilla': 'warn',
    '@emotion/import-from-emotion': 'off',
    '@emotion/styled-import': 'warn',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react/jsx-no-useless-fragment': 'off',
    'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],
    'react-hooks/exhaustive-deps': 'off',
    'react/require-default-props': 'off',
    'react/function-component-definition': ['error', { namedComponents: 'arrow-function', unnamedComponents: 'arrow-function' }],
    'react/no-unknown-property': 'off',
    '@typescript-eslint/no-use-before-define': ['warn'],
    'react/jsx-filename-extension': [
      'warn',
      {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    ]
  }
}
