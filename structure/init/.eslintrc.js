module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true,
        "jquery": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "linebreak-style": "error",
        "semi": ["error", "always"],
        "no-undef": 2,
        "no-unused-vars": "off",
        "no-console": "off",
        "no-control-regex": "off",
        "no-multi-spaces": "error",
        "array-bracket-spacing": "error",
        "comma-dangle": "error",
        "comma-spacing": "error",
        "computed-property-spacing": "error",
        "indent": "error",
        "jsx-quotes": "error",
        "quotes": ["error", "single"],
        "key-spacing": "error",
        "keyword-spacing": "error",
        "no-multiple-empty-lines": ["error", {
            "max": 1,
            "maxEOF": 0,
            "maxBOF": 0
        }],
        "no-trailing-spaces": "error",
        "no-whitespace-before-property": "error",
        "object-curly-newline": "error",
        "object-curly-spacing": "error",
        "padded-blocks": ["error", "never"],
        "semi-spacing": "error",
        "space-before-blocks": "error",
        "space-before-function-paren": "error",
        "space-in-parens": "error",
        "space-infix-ops": "error",
        "space-unary-ops": "error",
        "spaced-comment": "error"
    }
};