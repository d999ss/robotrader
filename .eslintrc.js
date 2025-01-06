module.exports = {
  extends: [
    '@vercel/style-guide/eslint/node',
    '@vercel/style-guide/eslint/typescript',
    '@vercel/style-guide/eslint/browser',
    '@vercel/style-guide/eslint/react',
  ],
  parserOptions: {
    project: true,
  },
  globals: {
    React: true,
    JSX: true,
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: ['./tsconfig.json'],
      },
    },
  },
  ignorePatterns: ['node_modules/', 'dist/', 'build/'],
  rules: {
    // Custom rule overrides
    'import/no-default-export': 'off', // Allow default exports for pages/components
    '@typescript-eslint/explicit-function-return-type': 'off', // Not required for React components
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
  },
};
