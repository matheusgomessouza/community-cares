import "@testing-library/jest-dom";

process.env.EXPO_PUBLIC_CLIENT_ID = "test_client_id";
process.env.EXPO_PUBLIC_GOOGLE_API_KEY = "test_google_key";
process.env.EXPO_PUBLIC_API = "https://test-api.com";

jest.mock("expo-font", () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn(() => true),
}));

jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  return {
    MaterialIcons: (props: any) => React.createElement("View", props, props.children),
  };
});

jest.mock("react-native-vector-icons/MaterialIcons", () => {
  const React = require("react");
  return (props: any) => React.createElement("View", props, props.children);
});

jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock("expo-cellular", () => ({
  getIsoCountryCodeAsync: jest.fn(),
}));

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useSegments: jest.fn(() => []),
  useLocalSearchParams: jest.fn(() => ({})),
  Slot: jest.fn(() => null),
  Stack: jest.fn(() => null),
}));

jest.mock("react-native-maps", () => {
  const React = require("react");
  const MockMapView = (props: any) => React.createElement("View", props, props.children);
  const MockMarker = (props: any) => React.createElement("View", props, props.children);
  const MockCallout = (props: any) => React.createElement("View", props, props.children);
  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
    Callout: MockCallout,
  };
});
