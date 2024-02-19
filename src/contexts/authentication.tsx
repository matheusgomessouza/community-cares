import { createContext, useState } from "react";
import * as interfaces from "../interfaces";

const AuthenticationContext =
  createContext<interfaces.AuthenticationContextProps>(
    {} as interfaces.AuthenticationContextProps
  );

export function AuthenticationProvider({
  children,
}: interfaces.AuthenticationProviderProps) {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  return (
    <AuthenticationContext.Provider
      value={{
        isUserAuthenticated,
        setIsUserAuthenticated,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}

export default AuthenticationContext;
