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
        ecmaFeatures: {}
    },
    plugins: ['@typescript-eslint'],
    overrides: [{
        files: ['**/*.ts'],
        rules: {
            'no-undef': 'off',
            '@typescript-eslint/no-unused-vars': [2, { args: 'none' }],
            '@typescript-eslint/class-name-casing': 'error',
            '@typescript-eslint/interface-name-prefix': ['error', 'always'],
            '@typescript-eslint/no-array-constructor': 'error',
            '@typescript-eslint/type-annotation-spacing': ['error', { before: false, after: true }]
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
