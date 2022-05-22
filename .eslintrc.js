module.exports = {
  env: {
    node: true,
    es2021: true
  },
  extends: ['standard'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest'
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'no-console': 'warn'
  }
}
