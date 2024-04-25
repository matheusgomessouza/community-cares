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
  showSignInError: boolean;
  setShowSignInError(value: boolean): void;
  codeExchange(value: string): void;
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

export interface UserDataProps {
  name: string;
  avatar_url: string;
  bio: string;
  login?: string;
  location: string;
}
