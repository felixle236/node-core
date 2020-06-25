module.exports = {
    extends: 'standard',
    parser: '@typescript-eslint/parser',
    env: {
        commonjs: true,
        es6: true,
        node: true,
        mocha: true
    },
    parserOptions: {
        ecmaVersion: 8,
        sourceType: 'module',
        ecmaFeatures: {},
        project: './tsconfig.json',
        // createDefaultProgram: true
    },
    plugins: ['@typescript-eslint'],
    overrides: [{
        files: ['**/*.ts'],
        rules: {
            'no-undef': 'off',
            '@typescript-eslint/no-unused-vars': [2, { args: 'none' }],
            '@typescript-eslint/no-array-constructor': 'error',
            '@typescript-eslint/type-annotation-spacing': ['error', { before: false, after: true }],
            "@typescript-eslint/naming-convention": [
                "error",
                {
                    "selector": "default",
                    "format": ["camelCase"]
                },
                {
                    "selector": "memberLike",
                    "modifiers": ["private"],
                    "format": ["camelCase"],
                    "leadingUnderscore": "require"
                },
                {
                    "selector": "memberLike",
                    "format": ["camelCase", "UPPER_CASE"]
                },
                {
                    "selector": "variableLike",
                    "format": ["camelCase", "UPPER_CASE"]
                },
                {
                    "selector": "variable",
                    "format": ["camelCase", "UPPER_CASE"]
                },
                {
                    "selector": "variable",
                    "types": ["boolean"],
                    "format": ["PascalCase", "UPPER_CASE"],
                    "prefix": ["is", "should", "has", "can", "did", "will", "enable", "IS_", "SHOULD_", "HAS_", "CAN_", "DID_", "WILL_", "ENABLE_"]
                },
                {
                    "selector": "typeParameter",
                    "format": ["PascalCase"],
                    "prefix": ["T"]
                },
                {
                    "selector": "interface",
                    "format": ["PascalCase"],
                    "custom": {
                        "regex": "^I[A-Z]",
                        "match": true
                    }
                },
                {
                    "selector": "typeLike",
                    "format": ["PascalCase"]
                }
            ]
        }
    }],
    rules: {
        'indent': ['error', 4],
        'semi': ['error', 'always'],
        'no-var': ['error'],
        'one-var': ['error', 'never'],
        'require-jsdoc': 'error',
        'camelcase': ['error'],
        'eol-last': ['error', 'always'],
        'curly': ['error', 'multi-or-nest'],
        'eqeqeq': ['error', 'always', { 'null': 'ignore' }],
        'brace-style': ['error', 'stroustrup'],
        'no-return-await': 'off',
        'no-useless-constructor': 'off',
        'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
        'space-before-function-paren': ['error', {
            anonymous: 'never',
            named: 'never',
            asyncArrow: 'always'
        }],
        'sort-imports': ['error', {
            'ignoreCase': false,
            'ignoreMemberSort': false,
            'ignoreDeclarationSort': false,
            'memberSyntaxSortOrder': ['none', 'all', 'multiple', 'single']
        }]
    }
};
