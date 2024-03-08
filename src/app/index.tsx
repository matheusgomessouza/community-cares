import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

import SignInPage from "./signin";
import MapScreen from "./map";
import ProfileScreen from "./profile";

export default function App() {
  const [hasAuthToken, setHasAuthToken] = useState<boolean>(false);

  async function getStorageToken() {
    try {
      const response = await SecureStore.getItemAsync("github-token");
      if (response) setHasAuthToken(true);
    } catch (error) {
      console.error("Unable to retrieve SecureStorage data", error);
    }
  }

  useEffect(() => {
    getStorageToken();
  }, []);

  return hasAuthToken ? <MapScreen /> : <SignInPage />;
}
