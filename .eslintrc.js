module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
      'plugin:prettier/recommended',
      'plugin:jsx-a11y/recommended',
      'plugin:import/errors',
      'plugin:import/warnings',
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended',
    ],
    plugins: [
      'prettier',
      'babel',
      'import',
      'jsx-a11y',
      'react',
      'react-hooks',
      '@typescript-eslint',
    ],
    env: {
      browser: true,
      node: true,
      jasmine: true,
      jest: true,
      es6: true,
    },
    parserOptions: {
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
        modules: true,
      },
    },
    overrides: [
      {
        files: ['**/*.tsx'],
        rules: {
          'react/prop-types': 'off',
        },
      },
    ],
    settings: {
      ecmascript: 6,
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        // use <root>/path/to/folder/tsconfig.json
        typescript: {
          directory: './tsconfig.json',
        },
      },
      react: {
        version: 'detect',
      },
    },
    rules: {
      "indent": "off",
      'react-hooks/rules-of-hooks': 'error',
      // 'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/explicit-function-return-type': 0,
      'import/default': 2,
      'import/no-unresolved': [
        2,
        {
          commonjs: true,
          amd: true,
        },
      ],
      "@typescript-eslint/indent": "off",
      "@typescript-eslint/ban-ts-ignore":"off",
      'import/named': 'off',
      'import/namespace': 2,
      'import/export': 2,
      'import/no-duplicates': 0,
      'import/imports-first': 2,
      '@typescript-eslint/interface-name-prefix': 0,
      'react/display-name': 0,
      '@typescript-eslint/no-explicit-any': 0,
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          trailingComma: 'all',
        },
      ],
    },
  };
  