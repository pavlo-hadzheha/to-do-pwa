/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,

  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    'standard'
  ],

  ignorePatterns: ['dts/*.d.ts'],

  rules: {
    'max-len': ['error', {
      code: 120,
      ignoreComments: true,
      ignoreTrailingComments: true,
      ignoreUrls: true,
      ignoreStrings: true,
      ignoreRegExpLiterals: true
    }],
    'no-undef': 'off',
    'no-prototype-builtins': 'off',
    'array-callback-return': 'off',
    'vue/require-default-prop': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/no-v-html': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/v-slot-style': ['error', {
      atComponent: 'shorthand',
      default: 'shorthand',
      named: 'shorthand'
    }],
    'vue/valid-attribute-name': 'off',
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/script-setup-uses-vars': 'error',
    'vue/attribute-hyphenation': 'off',
    'vue/v-on-event-hyphenation': 'off',
    'vue/first-attribute-linebreak': ['error', {
      singleline: 'ignore',
      multiline: 'below'
    }],
    'vue/custom-event-name-casing': 'off',
    'vue/max-attributes-per-line': ['error', {
      singleline: {
        max: 1
      },
      multiline: {
        max: 1
      }
    }],
    'func-call-spacing': 'off'
  }
}
