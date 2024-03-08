import { createContext, useState } from "react";
import * as interfaces from "../interfaces";

const UsabilityContext = createContext<interfaces.UsabilityContextProps>(
  {} as interfaces.UsabilityContextProps
);

export function UsabilityProvider({
  children,
}: interfaces.UsabilityProviderProps) {
  const [showFilter, setShowFilter] = useState(false);

  return (
    <UsabilityContext.Provider
      value={{
        showFilter,
        setShowFilter
      }}
    >
      {children}
    </UsabilityContext.Provider>
  );
}

export default UsabilityContext;
