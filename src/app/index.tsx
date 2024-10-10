import { useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import * as Cellular from "expo-cellular";

import SignInPage from "./signin";
import MapScreen from "./map";
import AuthenticationContext from "contexts/authentication";
import UsabilityContext from "contexts/usability";

export default function Redirect() {
  const { isUserAuthenticated } = useContext(AuthenticationContext);
  const { setForeignUser } = useContext(UsabilityContext);
  const [hasToken, setHasToken] = useState<boolean>(false);

  async function getUserToken() {
    try {
      const response = await SecureStore.getItemAsync("github-token");
      if (response) setHasToken(true);
    } catch (error) {
      return;
    }
  }

  async function getUserCountry() {
    try {
      const countryCode = await Cellular.getIsoCountryCodeAsync();

      if (countryCode && countryCode !== "br") {
        setForeignUser(true);
      }
    } catch (error) {
      console.error(
        "Unable to retrieve MCC (Mobile Country Code) /getUserCountry"
      );
    }
  }

  useEffect(() => {
    getUserToken();
    getUserCountry();
  }, [isUserAuthenticated]);

  return hasToken || (isUserAuthenticated && hasToken) ? (
    <MapScreen />
  ) : (
    <SignInPage />
  );
}
