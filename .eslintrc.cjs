module.exports = {
    root: true,

    env: {
        browser: true,
        es2021: true,
        node: true
    },
    globals: {
        __APP_VERSION__: 'readonly'
    },

    parser: 'vue-eslint-parser',

    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },

    extends: ['eslint:recommended', 'plugin:vue/recommended'],

    rules: {
        'no-unused-vars': [
            'warn',
            {
                argsIgnorePattern: '^_'
            }
        ],

        'no-console': 'off'
    }
};
