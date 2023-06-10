module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true,
        jest: true,
    },
    ignorePatterns: ["./src/static/*", './public/*'],
    parser: "@babel/eslint-parser",
    parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: {
            jsx: true,
        },
    },
    settings: {
        "import/resolver": {
            typescript: {}
        },
        "react": {
            version: "detect"
        }
    },
    plugins: [
        "jsx-a11y",
        "eslint-comments",
        "jest",
        "promise",
        "unicorn",
        "react-hooks",
    ],
    extends: [
        "eslint:recommended",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:react-hooks/recommended",
        "plugin:react/recommended",
        "plugin:eslint-comments/recommended",
        "plugin:jest/recommended",
        "plugin:promise/recommended",
        "plugin:unicorn/recommended",
        "airbnb-base",
        "prettier"
    ],
    rules: {
        "react/function-component-definition": 0,
        "unicorn/prefer-module": "off",
        "react/boolean-prop-naming": 0,
        "react/prop-types": 0,
        "promise/param-names": "warn",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "react/react-in-jsx-scope": 0,
        "no-unused-vars": 1,
        "react/display-name": [0],
        "import/extensions": [
            "error",
            "ignorePackages",
            {
                "ts": "never",
                "tsx": "never"
            }
        ],
        "unicorn/filename-case": "off"
    },

    // Override Typescript files
    overrides: [
        {
            files: ["**/*.{ts,tsx}"],
            env: {
                browser: true,
                es6: true,
                node: true,
                jest: true,
            },
            parser: "@typescript-eslint/parser",
            parserOptions: {
                project: "./tsconfig.json",
            },
            plugins: [
                "jsx-a11y",
                "@typescript-eslint",
                "eslint-comments",
                "jest",
                "promise",
                "unicorn",
            ],
            settings: {
                "import/resolver": {
                    typescript: {}
                }
            },
            // Extend Other Configs
            extends: [
                "eslint:recommended",
                "plugin:@typescript-eslint/recommended",
                "plugin:@typescript-eslint/recommended-requiring-type-checking",
                "plugin:import/errors",
                "plugin:import/warnings",
                "plugin:react-hooks/recommended",
                "plugin:react/recommended",
                "plugin:eslint-comments/recommended",
                "plugin:jest/recommended",
                "plugin:promise/recommended",
                "plugin:unicorn/recommended",
                "airbnb-typescript",
                "prettier",
            ],

            rules: {
                "react/react-in-jsx-scope": "off",
                "react/prop-types": [0],
                // temp allowing during TS migration
                // Too restrictive, writing ugly code to defend against a very unlikely scenario: https://eslint.org/docs/rules/no-prototype-builtins
                "no-prototype-builtins": "off",
                // https://basarat.gitbooks.io/typescript/docs/tips/defaultIsBad.html
                "import/prefer-default-export": "off",
                "import/no-default-export": "off",
                // Too restrictive: https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/destructuring-assignment.md
                "react/destructuring-assignment": "off",
                // No jsx extension: https://github.com/facebook/create-react-app/issues/87#issuecomment-234627904
                "react/jsx-filename-extension": "off",
                // Use function hoisting to improve code readability
                "no-use-before-define": [
                    "error",
                    { functions: false, classes: true, variables: true },
                ],
                // Allow most functions to rely on type inference. If the function is exported, then `
                // @typescript-eslint/explicit-module-boundary-types` will ensure it's typed.
                "@typescript-eslint/explicit-function-return-type": "off",
                "@typescript-eslint/no-use-before-define": [
                    "error",
                    { functions: false, classes: true, variables: true, typedefs: true },
                ],
                // Common abbreviations are known and readable
                "unicorn/prevent-abbreviations": "off",
                // Airbnb prefers forEach
                "unicorn/no-array-for-each": "off",
                // It's not accurate in the monorepo style
                "unicorn/no-useless-undefined": "warn",
                "unicorn/filename-case": "off",
                "import/no-extraneous-dependencies": "off",
                "@typescript-eslint/ban-ts-comment": [
                    "error",
                    {
                        "ts-ignore": "allow-with-description",
                        minimumDescriptionLength: 4,
                    },
                ],
                "@typescript-eslint/no-floating-promises": "warn",
                "promise/always-return": "warn",
                "@typescript-eslint/no-misused-promises": "warn",
                "@typescript-eslint/no-unused-vars": "warn",
                "no-promise-executor-return": "warn",
                "import/order": "warn",
                "no-param-reassign": "off",
                "unicorn/no-null": "warn"
            },
        },
    ],
};