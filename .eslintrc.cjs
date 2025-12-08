module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs", ".eslintrc.json"],
  parser: "@typescript-eslint/parser",
  parserOptions: { 
    ecmaVersion: "latest", 
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["@typescript-eslint"],
  settings: { react: { version: "18.2" } },
  rules: {
    "react/prop-types": 0,
    "react/no-unescaped-entities": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "react-hooks/exhaustive-deps": "warn",
    "react/jsx-no-target-blank": "warn",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  },
}
