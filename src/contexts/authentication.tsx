import { createContext, useState } from "react";
import * as interfaces from "../interfaces";
import * as SecureStore from "expo-secure-store";
import * as Services from "@services/index";

const AuthenticationContext =
  createContext<interfaces.AuthenticationContextProps>(
    {} as interfaces.AuthenticationContextProps
  );

export function AuthenticationProvider({
  children,
}: interfaces.AuthenticationProviderProps) {
  const [isUserAuthenticated, setIsUserAuthenticated] =
    useState<boolean>(false);
  const [showSignInError, setShowSignInError] = useState<boolean>(false);
  const [profileData, setProfileInfo] = useState<
    interfaces.UserDataProps | undefined
  >({} as interfaces.UserDataProps | undefined);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  async function codeExchange(code: string): Promise<void> {
    try {
      setIsAuthenticating(true);
      const response =
        await Services.CommunityCaresService.postAuthenticateUser(code);

      if (response) {
        await SecureStore.setItemAsync(
          "github-token",
          response.data.access_token
        );
      }
      const savedToken = await SecureStore.getItemAsync("github-token");

      if (savedToken) setIsUserAuthenticated(true);
      
    } catch (error) {
      setIsAuthenticating(false);
      console.error(
        "Unable to perform code exchange with Community Cares server",
        error
      );
      setShowSignInError(true);
    } finally {
      setIsAuthenticating(false);
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
        isAuthenticating,
        setIsAuthenticating,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}

export default AuthenticationContext;
