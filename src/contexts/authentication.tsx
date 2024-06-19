import axios from "axios";
import { createContext, useState } from "react";
import * as interfaces from "../interfaces";
import * as SecureStore from "expo-secure-store";

const AuthenticationContext =
  createContext<interfaces.AuthenticationContextProps>(
    {} as interfaces.AuthenticationContextProps
  );

export function AuthenticationProvider({
  children,
}: interfaces.AuthenticationProviderProps) {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [showSignInError, setShowSignInError] = useState<boolean>(false);
  const [profileData, setProfileInfo] = useState<
    interfaces.UserDataProps | undefined
  >({} as interfaces.UserDataProps | undefined);

  async function codeExchange(code: string): Promise<void> {
    try {
      const { data } = await axios.post<interfaces.SuccessGithubResponseProps>(
        `https://community-cares-server.onrender.com/authenticate`,
        {
          code: code,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      await SecureStore.setItemAsync("github-token", data.access_token);

      if (await SecureStore.getItemAsync("github-token")) {
        setIsUserAuthenticated(true);
      }
    } catch (error) {
      console.error(
        "Unable to perform code exchange with Community Cares server",
        error
      );
      setShowSignInError(true);
    }
  }

  return (
    <AuthenticationContext.Provider
      value={{
        profileData,
        setProfileInfo,
        isUserAuthenticated,
        setIsUserAuthenticated,
        showSignInError,
        setShowSignInError,
        codeExchange,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}

export default AuthenticationContext;
