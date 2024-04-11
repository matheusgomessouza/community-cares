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
  const [githubTokenData, setGithubTokenData] =
    useState<interfaces.SuccessGithubResponseProps>(
      {} as interfaces.SuccessGithubResponseProps
    );

  async function saveToken(
    accessToken: string,
    scope: string,
    tokenType: string
  ) {
    setGithubTokenData({
      ...githubTokenData,
      access_token: accessToken,
      scope: scope,
      token_type: tokenType,
    });
  }

  async function codeExchange(code: string): Promise<void> {
    try {
      const { data } = await axios.post<interfaces.SuccessGithubResponseProps>(
        `https://community-cares-server.vercel.app/authenticate`,
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

      await saveToken(data.access_token, data.scope, data.token_type);

      if (githubTokenData.access_token !== undefined) {
        setIsUserAuthenticated(true);
        await SecureStore.setItemAsync(
          "github-token",
          githubTokenData.access_token
        );
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
        isUserAuthenticated,
        setIsUserAuthenticated,
        githubTokenData,
        setGithubTokenData,
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
