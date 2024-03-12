import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

import SignInPage from "./signin";
import MapScreen from "./map";

export default function App() {
  const [authToken, setAuthToken] = useState<string | null>(null);

  async function getStorageToken() {
    const token = await SecureStore.getItemAsync("github-token");

    if (token) {
      setAuthToken(token);
    }
  }

  useEffect(() => {
    getStorageToken();
  }, []);

  return authToken ? <MapScreen /> : <SignInPage />;
}
