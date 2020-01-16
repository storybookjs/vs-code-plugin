module.exports = {
  extends: [
    "airbnb"
  ],
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
  },
  rules: {
    "consistent-return": "off",
    "func-names": "off",
    "no-console": "off",
    "curly": "off",
    "react/destructuring-assignment": "off",
    "react/jsx-filename-extension": "off",
    "react/prop-types": "off",
    "react/jsx-wrap-multilines": "off",
    "react/jsx-one-expression-per-line": "off",
    "react/jsx-closing-tag-location": "off",
  }
}