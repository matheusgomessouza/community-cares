import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

import SignInPage from "./signin";
import MapScreen from "./map";

export default function Redirect() {
  const [authToken, setAuthToken] = useState<string | null>(null);

  async function getStorageToken() {
    try {
      const token = await SecureStore.getItemAsync("github-token");
      if (token) setAuthToken(token);
    } catch (error) {
      console.error("Unable to retrieve token from SecureStore", error);
    }
  }

  useEffect(() => {
    getStorageToken();
  }, []);

  return authToken ? <MapScreen /> : <SignInPage />;
}
