module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    'no-useless-escape': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-duplicate-enum-values': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        varsIgnorePattern: '_',
        ignoreRestSiblings: true,
      },
    ],
    'prettier/prettier': [
      'warn',
      {
        arrowParens: 'avoid',
        bracketSpacing: true,
        endOfLine: 'lf',
        jsxBracketSameLine: true,
        quoteProps: 'consistent',
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'all',
        useTabs: false,
      },
    ],
  },
};
