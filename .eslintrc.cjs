module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  ignorePatterns: [
    '**/ignore/*.js',
    '.eslintrc.cjs',
    '*.d.ts',
    'public',
    'node_modules',
    '**/ExperienceEditor/configs/*',
    '**/ExperienceEditor/stories/*',
    '**/build/*',
    '**/*.config.js',
    'dist',
    'vite.config.*',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
    ecmaFeatures: {
      jsx: true,
    },
    project: './tsconfig.app.json',
    tsconfigRootDir: __dirname,
  },
  env: {
    browser: true,
    es2020: true,
  },
  globals: {
    browser: true,
  },
  plugins: [
    '@typescript-eslint',
    'react-hooks',
    'react-refresh',
    'react-compiler',
    'prettier',
  ],
  rules: {
    'react-compiler/react-compiler': 'error',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/jsx-filename-extension': [
      1,
      { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    ],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/react-in-jsx-scope': 'off',
    'semi': ['error', 'always'],
    'import/extensions': [
      'off',
      'ignorePackages',
      {
        js: 'ignorePackages',
        ts: 'ignorePackages',
        jsx: 'ignorePackages',
        tsx: 'ignorePackages',
        scss: 'always',
      },
    ],
  },
};
