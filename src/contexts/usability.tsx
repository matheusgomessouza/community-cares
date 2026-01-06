import { createContext, useState } from "react";
import * as interfaces from "../interfaces";

const UsabilityContext = createContext<interfaces.UsabilityContextProps>(
  {} as interfaces.UsabilityContextProps
);

export function UsabilityProvider({
  children,
}: interfaces.UsabilityProviderProps) {
  const [showFilter, setShowFilter] = useState(false);
  const [foreignUser, setForeignUser] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  return (
    <UsabilityContext.Provider
      value={{
        showFilter,
        setShowFilter,
        foreignUser,
        setForeignUser,
        selectedFilters,
        setSelectedFilters,
      }}
    >
      {children}
    </UsabilityContext.Provider>
  );
}

export default UsabilityContext;
