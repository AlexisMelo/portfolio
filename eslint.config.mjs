import globals from 'globals';
import prettier from 'eslint-plugin-prettier';
import parser from '@angular-eslint/template-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ['projects/**/*', 'node_modules/**/*', 'database.types.ts'],
    languageOptions: {
      globals: {
        ...globals.jasmine,
        ...globals.browser,
      },
    },
  },
  ...compat
    .extends(
      'eslint:recommended',
      'plugin:@angular-eslint/recommended',
      'plugin:@angular-eslint/template/process-inline-templates',
      'plugin:prettier/recommended',
      'plugin:@typescript-eslint/recommended'
    )
    .map(config => ({
      ...config,
      files: ['**/*.ts'],
    })),
  {
    files: ['**/*.ts'],

    plugins: {
      prettier,
    },

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',

      parserOptions: {
        project: ['tsconfig.json'],
        createDefaultProgram: true,
      },
    },

    rules: {
      '@angular-eslint/component-selector': [
        'error',
        {
          prefix: 'app',
          style: 'kebab-case',
          type: 'element',
        },
      ],

      '@angular-eslint/directive-selector': [
        'error',
        {
          prefix: 'app',
          style: 'camelCase',
          type: 'attribute',
        },
      ],

      'sort-imports': [
        'error',
        {
          ignoreCase: false,
          ignoreDeclarationSort: true,
          ignoreMemberSort: true,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
          allowSeparatedGroups: false,
        },
      ],

      'prettier/prettier': 'error',
    },
  },
  ...compat
    .extends(
      'plugin:@angular-eslint/template/recommended',
      'plugin:@angular-eslint/template/accessibility',
      'plugin:prettier/recommended'
    )
    .map(config => ({
      ...config,
      files: ['**/*.html'],
    })),
  {
    files: ['**/*.html'],

    languageOptions: {
      parser: parser,
    },

    rules: {
      '@angular-eslint/template/prefer-control-flow': 'error',
      'prettier/prettier': 'error',
    },
  },
  ...compat
    .extends(
      'plugin:@angular-eslint/template/recommended',
      'plugin:@angular-eslint/template/accessibility',
      'plugin:prettier/recommended'
    )
    .map(config => ({
      ...config,
      files: ['**/*.scss'],
    })),
  {
    files: ['*.scss'],

    plugins: {
      prettier,
    },

    extends: {},

    rules: {
      'prettier/prettier': 'error',
    },
  },
];
