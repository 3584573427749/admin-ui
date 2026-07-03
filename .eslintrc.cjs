module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true
    },

    globals: {
        __APP_VERSION__: 'readonly'
    },
    extends: ['eslint:recommended'],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    rules: {
        // Mallen ska vara permissiv
        'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        'no-console': 'off'
    }
};