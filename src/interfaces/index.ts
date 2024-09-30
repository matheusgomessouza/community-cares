export interface UsabilityContextProps {
  showFilter: boolean;
  setShowFilter: (value: boolean) => void;
  foreignUser: boolean;
  setForeignUser: (value: boolean) => void;
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
  profileData: UserDataProps | undefined;
  setProfileInfo(value: UserDataProps): void;
  isAuthenticating: boolean;
  setIsAuthenticating(value: boolean): void;
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

export interface LocationsProps {
  address: string;
  contact: string;
  coords: {
    latitude: string;
    longitude: string;
  };
  id: number;
  name: string;
  type: string;
}

export enum EstablishmentTypeProps {
  CommunityKitchen = "community-kitchen",
  SolidarityKitchen = "solidarity-kitchen",
  Shelter = "shelter",
  Hospital = "hospital",
}
