export interface UsabilityContextProps {
  showMenu: boolean;
  setShowMenu: (value: boolean) => void;
}

export type UsabilityProviderProps = {
  children: React.ReactNode;
};

export interface AuthenticationContextProps {
  isUserAuthenticated: boolean;
  setIsUserAuthenticated(value: boolean): void;
}

export interface AuthenticationProviderProps {
  children: React.ReactNode;
}
