import "@testing-library/jest-dom";

jest.mock("expo-font", () => ({
  loadAsync: jest.fn(),
}));
