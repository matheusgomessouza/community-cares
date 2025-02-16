import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pkg from 'eslint-plugin-react';
import pluginReact from 'eslint-plugin-react';
const { rules } = pkg;


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  rules, {
    'react/react-in-jsx-scope': 'off'
  }
];