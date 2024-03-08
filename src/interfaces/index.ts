export interface UsabilityContextProps {
  showFilter: boolean;
  setShowFilter: (value: boolean) => void;
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

export interface ErrorGithubResponseProps {
  error: string;
  error_description: string;
  error_uri: string;
}

export interface SuccessGithubResponseProps {
  access_token: string;
  scope: string;
  token_type: string;
}
