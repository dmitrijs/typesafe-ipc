module.exports = {
  "env": {
    "browser": true
  },
  "parser": "@typescript-eslint/parser",
  "plugins": [
    "@typescript-eslint"
  ],
  "overrides": [
    {
      "files": ["*.ts"], // Your TypeScript files extension
      "extends": [
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking"
      ],
      "rules": {
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-floating-promises": "off",
        "@typescript-eslint/quotes": [
          "error",
          "single"
        ],
        "@typescript-eslint/restrict-template-expressions": "off",
      },
      "parserOptions": {
        "project": ["tsconfig.json", "examples/basic/tsconfig.json"],
        "sourceType": "module"
      },
    }
  ]
};
