import { createContext, useState } from "react";
import * as interfaces from "../interfaces";

const UsabilityContext = createContext<interfaces.UsabilityContextProps>(
  {} as interfaces.UsabilityContextProps
);

export function UsabilityProvider({
  children
}: interfaces.UsabilityProviderProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <UsabilityContext.Provider
      value={{
        showMenu,
        setShowMenu
      }}
    >
      {children}
    </UsabilityContext.Provider>
  )
}

export default UsabilityContext;
