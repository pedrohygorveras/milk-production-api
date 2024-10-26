import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";
import prettierPlugin from "eslint-plugin-prettier";
import unusedImports from "eslint-plugin-unused-imports";

/**
 * Configures the ESLint setup using a flat configuration system.
 * Integrates Prettier for consistent formatting and adds plugins for handling
 * unused imports and stricter code quality rules.
 * The configuration is designed to align with ECMAScript 2021 standards,
 * allowing for clear and maintainable code practices.
 */

// Configure __filename and __dirname to support ESModules syntax in Node.js
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize FlatCompat to support legacy .eslintrc configurations
const compat = new FlatCompat({
  baseDirectory: __dirname, // Sets base directory for resolving relative paths
});

export default [
  {
    files: ["**/*.js"], // Targets all JavaScript files in the project
    languageOptions: {
      ecmaVersion: 2021, // Ensures ECMAScript 2021 standard compliance for latest syntax support
      sourceType: "module", // Enables ES module syntax (import/export)
      globals: {
        browser: true, // Supports browser-specific globals
        node: true, // Supports Node.js-specific globals
      },
    },

    plugins: {
      prettier: prettierPlugin, // Integrates Prettier for automatic code formatting
      "unused-imports": unusedImports, // Identifies and removes unused imports
    },

    /**
     * Rules Configuration:
     * - Applies Prettier and unused import handling to enhance code quality and consistency.
     * - Enforces best practices by setting strict coding rules and encouraging cleaner code structures.
     */
    rules: {
      "prettier/prettier": "error", // Flags Prettier issues as errors, enforcing formatting consistency
      "no-console": "warn", // Warns against console.log usage, recommending a cleaner codebase
      eqeqeq: "error", // Enforces strict equality (===) to prevent type-coercion bugs
      "no-var": "error", // Disallows var declarations, encouraging let/const usage for clarity and scope control
      "prefer-const": "error", // Suggests const usage for variables that are not reassigned, promoting immutability

      // Disables the default no-unused-vars rule in favor of the unused-imports plugin
      "no-unused-vars": "off",

      // Configures unused-imports plugin to clean up unused imports and variables
      "unused-imports/no-unused-imports": "error", // Marks unused imports as errors for cleaner dependency management
      "unused-imports/no-unused-vars": [
        "error",
        {
          vars: "all", // Applies to all variables, making no exceptions
          varsIgnorePattern: "^_", // Ignores variables prefixed with "_" for conventionally ignored items
          args: "after-used", // Enforces rule only on args that appear after used args, preventing premature warnings
          argsIgnorePattern: "^_", // Ignores arguments prefixed with "_", often used for placeholder args
        },
      ],
    },
  },

  // Compatibility for eslint-config-prettier to avoid formatting conflicts
  ...compat.extends("prettier"),
];
