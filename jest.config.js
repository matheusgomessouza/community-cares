/* eslint-env node */
// eslint-disable-next-line no-undef
module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["./setupTests.ts"],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)",
  ],
  moduleNameMapper: {
    "^@components/(.*)$": "<rootDir>/src/components/$1",
    "^@services/(.*)$": "<rootDir>/src/services/$1",
    "^@contexts/(.*)$": "<rootDir>/src/contexts/$1",
    "^@hooks/(.*)$": "<rootDir>/src/hooks/$1",
    "^@interfaces/(.*)$": "<rootDir>/src/interfaces/$1"
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/coverage/**",
    "!**/node_modules/**",
    "!**/.expo/**",
    "!**/babel.config.js",
    "!**/metro.config.js",
    "!**/jest.setup.js",
    "!**/jest.config.js",
    "!**/env.ts",
    "!**/setupTests.ts",
    "!**/interfaces/**",
    "!**/types/**"
  ],
};
