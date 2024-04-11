import { useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

import SignInPage from "./signin";
import MapScreen from "./map";
import AuthenticationContext from "contexts/authentication";

export default function Redirect() {
  const { isUserAuthenticated } = useContext(AuthenticationContext);
  const [hasToken, setHasToken] = useState<boolean>(false);

  async function getUserToken() {
    try {
      const response = await SecureStore.getItemAsync("github-token");
      if (response) setHasToken(true);
    } catch (error) {
      return;
    }
  }

  useEffect(() => {
    getUserToken();
  }, [isUserAuthenticated, hasToken]);

  return isUserAuthenticated && hasToken ? <MapScreen /> : <SignInPage />;
}
