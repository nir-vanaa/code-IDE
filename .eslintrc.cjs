/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.app.json',
    tsconfigRootDir: __dirname,
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: [
    'react',
    'react-hooks',
    'jsx-a11y',
    '@typescript-eslint',
    'prettier',
    'react-refresh'
  ],
  extends: [
    'airbnb',
    'airbnb-typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
    'prettier'
  ],
  env: {
    browser: true,
    node: true,
    es2020: true
  },
  settings: {
    react: {
      version: 'detect'
    },
    'import/resolver': {
      typescript: {
        project: './tsconfig.app.json'
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    }
  },
  rules: {
    // ✅ Clean, working rules only
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

    // Airbnb overrides
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off',
    'import/prefer-default-export': 'off',

    // Base ESLint formatting rules
    'lines-between-class-members': ['error', 'always'],
    'no-throw-literal': 'error',
    'brace-style': ['error', '1tbs'],
    'comma-dangle': ['error', 'only-multiline'],
    'comma-spacing': ['error', { before: false, after: true }],
    'func-call-spacing': ['error', 'never'],
    'indent': ['error', 4],
    'keyword-spacing': ['error', { before: true, after: true }],
    'no-extra-semi': 'error',
    'space-before-blocks': ['error', 'always'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'always'
      }
    ],
    'space-infix-ops': 'error',
    'object-curly-spacing': ['error', 'always'],
    'prettier/prettier': ['error'],
    // "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-floating-promises": "off",
    'jsx-a11y/no-static-element-interactions': "off",
    'jsx-a11y/click-events-have-key-events': "off",
    "@typescript-eslint/no-misused-promises": ["error", {
      checksVoidReturn: false,
    }],
  },
  ignorePatterns: [
    'dist/**/*',
    'node_modules/**/*',
    'public/**/*',
    '*.config.js',
    '*.config.ts',
    '.eslintrc.cjs'
  ]
};
