export interface UsabilityContextProps {
  showMenu: boolean;
  setShowMenu: (value: boolean) => void;
}

export type UsabilityProviderProps = {
  children: React.ReactNode
}
