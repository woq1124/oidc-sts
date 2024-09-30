module.exports = {
    env: {
        es6: true,
        node: true,
    },
    extends: [
        'airbnb-base',
        'plugin:import/recommended',
        'plugin:prettier/recommended', // includes plugin: prettier
    ],
    rules: {
        'prettier/prettier': 'error',
        eqeqeq: 'error',
        'spaced-comment': ['error', 'always', { markers: ['/'] }],
        'no-shadow': 'off',
        'no-console': 'off',
        'no-unused-vars': 'warn',
        'import/prefer-default-export': 'off',
        'import/extensions': 'off',
        'no-param-reassign': 'off',
    },
};
