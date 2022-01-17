module.exports = {
  root: true,
  env: {
    commonjs: true,
    es6: true,
    node: true,
    mocha: true,
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {},
    createDefaultProgram: true, // Tempory solution for IDE.
  },
  plugins: ['prettier', 'import'],
  extends: ['prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    semi: ['error', 'always'],
    eqeqeq: ['error', 'always', { null: 'ignore' }],
    camelcase: ['error'],
    'no-var': ['error'],
    'no-empty': 'warn',
    'no-console': 'warn',
    'no-return-await': 'off',
    'no-useless-constructor': 'off',
    'one-var': ['error', 'never'],
    'require-jsdoc': 'warn',
    'eol-last': ['error', 'always'],
    'brace-style': ['error', 'stroustrup'],
    'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
    'import/newline-after-import': 'error',
    'import/order': [
      'error',
      {
        'newlines-between': 'never',
        alphabetize: { order: 'asc', caseInsensitive: true },
        groups: ['builtin', 'external', 'internal', 'index', 'sibling', 'parent', 'object', 'type'],
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
      },
      plugins: ['@typescript-eslint'],
      extends: ['plugin:@typescript-eslint/eslint-recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
      rules: {
        curly: 'error',
        'no-undef': 'off',
        '@typescript-eslint/no-namespace': 'warn',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-empty-interface': 'warn',
        '@typescript-eslint/no-use-before-define': 'error',
        '@typescript-eslint/no-array-constructor': 'error',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-unused-vars': ['error', { args: 'none' }],
        '@typescript-eslint/no-unused-expressions': ['error', { allowTernary: true }],
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'default',
            format: ['camelCase'],
          },
          {
            selector: 'memberLike',
            modifiers: ['private'],
            format: ['camelCase'],
            leadingUnderscore: 'require',
          },
          {
            selector: 'memberLike',
            format: ['camelCase', 'UPPER_CASE'],
          },
          {
            selector: 'memberLike',
            leadingUnderscore: 'allow',
            format: ['camelCase'],
            filter: {
              regex: '_id',
              match: true,
            },
          },
          {
            selector: 'parameter',
            format: ['camelCase'],
            leadingUnderscore: 'allow',
          },
          {
            selector: 'variableLike',
            format: ['camelCase', 'UPPER_CASE'],
          },
          {
            selector: 'variable',
            format: ['camelCase', 'UPPER_CASE'],
          },
          {
            selector: 'variable',
            types: ['boolean'],
            format: ['PascalCase', 'UPPER_CASE'],
            prefix: ['is', 'should', 'has', 'can', 'did', 'will', 'enable', 'IS_', 'SHOULD_', 'HAS_', 'CAN_', 'DID_', 'WILL_', 'ENABLE_'],
          },
          {
            selector: 'enumMember',
            format: ['PascalCase'],
          },
          {
            selector: 'typeParameter',
            format: ['PascalCase'],
            prefix: ['T'],
          },
          {
            selector: 'interface',
            format: ['PascalCase'],
            custom: {
              regex: '^I[A-Z]',
              match: true,
            },
          },
          {
            selector: 'typeLike',
            format: ['PascalCase'],
          },
        ],
      },
    },
  ],
};
