import axios from "axios";
import * as SecureStore from "expo-secure-store";
import * as interfaces from "@interfaces/index";
import { env } from "../env";

interface ValidationError {
  message: string;
  errors: Record<string, string[]>;
}

const communityCaresServerInstance = axios.create({
  baseURL: env.EXPO_PUBLIC_API,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export async function getLocations() {
  try {
    const response = await communityCaresServerInstance.get(`/locations`);
    return response;
  } catch (error) {
    console.error("Unable to retrieve Locations data /getLocations", error);
  }
}

export async function postAchievements({
  username,
  provider,
  achievements,
}: interfaces.UserAchievementServiceProps) {
  try {
    const gitHubToken = await SecureStore.getItemAsync("github-token");

    if (gitHubToken) {
      await communityCaresServerInstance.post(
        "/achievements",
        {
          username,
          achievements,
          provider,
        },
        {
          headers: {
            Authorization: `Bearer ${gitHubToken}`,
          },
        }
      );
    }
  } catch (error) {
    console.error(
      "Unable to save achievements progress /postAchievement",
      error
    );
  }
}

export async function postAuthenticateUser(code: string, codeVerifier: string) {
  try {
    const response =
      await communityCaresServerInstance.post<interfaces.SuccessGithubResponseProps>(
        `/users/authenticate/github`,
        {
          code: code,
          code_verifier: codeVerifier,
          env: "mobile",
        }
      );
    return response;
  } catch (error) {
    if (axios.isAxiosError<ValidationError>(error)) {
      console.error(
        `Unable to authenticate, please try again /postAuthenticateUser | Data: ${error.response?.data} | Message: ${error.message}`
      );
    } else {
      console.error("Unexpected error:", error);
    }
  }
}
