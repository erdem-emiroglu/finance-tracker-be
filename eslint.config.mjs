// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'eslint.config.mjs',
      'dist/**/*',
      'node_modules/**/*',
      'coverage/**/*',
      '**/*.min.js',
      '**/*.d.ts',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      // TypeScript specific rules - Supabase and third-party library friendly
      '@typescript-eslint/no-explicit-any': 'off', // Allow any for third-party libraries
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-unsafe-argument': 'off', // Supabase responses use any
      '@typescript-eslint/no-unsafe-assignment': 'off', // Supabase responses use any
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'off', // Allow unsafe access for Supabase
      '@typescript-eslint/no-unsafe-return': 'off', // Allow unsafe return for Supabase
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/prefer-as-const': 'error',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',

      // General ESLint rules - Development friendly
      'no-unused-vars': 'off', // Handled by @typescript-eslint/no-unused-vars
      'no-console': 'warn', // Allow console for development
      'no-debugger': 'warn', // Allow debugger for development
      'no-var': 'warn',
      'prefer-const': 'warn',
      'prefer-arrow-callback': 'warn',
      'no-duplicate-imports': 'error',
      'no-multiple-empty-lines': ['warn', { max: 2 }], // Allow 2 empty lines
      'no-trailing-spaces': 'warn',
      'eol-last': 'warn',
      quotes: ['warn', 'single', { avoidEscape: true }],
      semi: ['warn', 'always'],

      // NestJS specific rules
      'class-methods-use-this': 'off', // NestJS services often don't use 'this'
      'max-classes-per-file': 'off', // NestJS allows multiple classes per file
      'no-empty-function': 'off', // NestJS has many empty lifecycle methods
    },
  },
);
