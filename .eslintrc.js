module.exports = {
    root: true,
    env: {
        commonjs: true,
        es6: true,
        node: true,
        mocha: true
    },
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: {},
        createDefaultProgram: true // Tempory solution for IDE.
    },
    extends: [
        'standard',
        'eslint:recommended'
    ],
    plugins: [
        'import',
        'node'
    ],
    rules: {
        indent: ['error', 4, { SwitchCase: 1 }],
        semi: ['error', 'always'],
        'no-var': ['error'],
        'one-var': ['error', 'never'],
        'require-jsdoc': 'error',
        camelcase: ['error'],
        'eol-last': ['error', 'always'],
        curly: ['error', 'multi-or-nest'],
        eqeqeq: ['error', 'always', { null: 'ignore' }],
        'brace-style': ['error', 'stroustrup'],
        'no-return-await': 'off',
        'no-useless-constructor': 'off',
        'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
        'space-before-function-paren': ['error', {
            anonymous: 'never',
            named: 'never',
            asyncArrow: 'always'
        }],
        'import/order': [
            'error',
            {
                'newlines-between': 'never',
                alphabetize: { order: 'asc', caseInsensitive: true },
                groups: ['builtin', 'external', 'internal', 'index', 'sibling', 'parent', 'object', 'type']
            }
        ],
        'no-console': 'error',
        'no-throw-literal': 'warn',
        'no-empty': 'warn',
        'no-unused-expressions': ['error', { allowTernary: true }],
        'no-use-before-define': 'off'
    },
    overrides: [{
        files: ['**/*.ts'],
        parser: '@typescript-eslint/parser',
        parserOptions: {
            project: './tsconfig.json'
        },
        extends: [
            'plugin:@typescript-eslint/eslint-recommended',
            'plugin:@typescript-eslint/recommended'
        ],
        plugins: [
            '@typescript-eslint'
        ],
        rules: {
            'no-undef': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-array-constructor': 'error',
            '@typescript-eslint/type-annotation-spacing': ['error', { before: false, after: true, overrides: { arrow: { before: true, after: true } } }],
            '@typescript-eslint/explicit-function-return-type': [
                'error',
                {
                    allowExpressions: true
                }
            ],
            '@typescript-eslint/no-unused-vars': ['error', { args: 'none' }],
            '@typescript-eslint/no-empty-interface': 'off',
            '@typescript-eslint/no-use-before-define': 'error',
            '@typescript-eslint/no-namespace': 'warn',
            '@typescript-eslint/naming-convention': [
                'error',
                {
                    selector: 'default',
                    format: ['camelCase']
                },
                {
                    selector: 'memberLike',
                    modifiers: ['private'],
                    format: ['camelCase'],
                    leadingUnderscore: 'require'
                },
                {
                    selector: 'memberLike',
                    format: ['camelCase', 'UPPER_CASE']
                },
                {
                    selector: 'parameter',
                    format: ['camelCase'],
                    leadingUnderscore: 'allow'
                },
                {
                    selector: 'variableLike',
                    format: ['camelCase', 'UPPER_CASE']
                },
                {
                    selector: 'variable',
                    format: ['camelCase', 'UPPER_CASE']
                },
                {
                    selector: 'variable',
                    types: ['boolean'],
                    format: ['PascalCase', 'UPPER_CASE'],
                    prefix: ['is', 'should', 'has', 'can', 'did', 'will', 'enable', 'IS_', 'SHOULD_', 'HAS_', 'CAN_', 'DID_', 'WILL_', 'ENABLE_']
                },
                {
                    selector: 'enumMember',
                    format: ['PascalCase']
                },
                {
                    selector: 'typeParameter',
                    format: ['PascalCase'],
                    prefix: ['T']
                },
                {
                    selector: 'interface',
                    format: ['PascalCase'],
                    custom: {
                        regex: '^I[A-Z]',
                        match: true
                    }
                },
                {
                    selector: 'typeLike',
                    format: ['PascalCase']
                }
            ]
        }
    }]
};
