import { useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import * as Cellular from "expo-cellular";

import SignInScreen from "./signin";
import MapScreen from "./map";
import AuthenticationContext from "@contexts/authentication";
import UsabilityContext from "@contexts/usability";

export default function Redirect() {
  const { isUserAuthenticated } = useContext(AuthenticationContext);
  const { setForeignUser } = useContext(UsabilityContext);
  const [hasToken, setHasToken] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  async function getUserToken() {
    try {
      const response = await SecureStore.getItemAsync("github-token");
      setHasToken(!!response);
    } catch (error) {
      console.error("Error retrieving token:", error);
    } finally {
      setIsLoading(false);
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
        "Unable to retrieve MCC (Mobile Country Code) /getUserCountry",
        error
      );
    }
  }

  useEffect(() => {
    getUserToken();
    getUserCountry();
  }, [isUserAuthenticated]);

  if (isLoading) {
    return null;
  }
  console.log("hasToken", hasToken);
  return hasToken ? <MapScreen /> : <SignInScreen />;
}
