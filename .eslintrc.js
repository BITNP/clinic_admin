module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "@vue/prettier"],
  rules: {
    "*": "off"
  },
  parserOptions: {
    parser: "@typescript-eslint/parser"
  }
};
