import axios from "axios";
import * as interfaces from "../interfaces";
import * as SecureStore from "expo-secure-store";

const githubApiInstance = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  },
});

export async function getUserData(): Promise<
  interfaces.UserDataProps | undefined
> {
  try {
    const deviceToken = await SecureStore.getItemAsync("github-token");

    if (!deviceToken) {
      return undefined;
    }

    const { data } = await githubApiInstance.get<interfaces.UserDataProps>(
      "/user",
      {
        headers: {
          Authorization: `Bearer ${deviceToken}`,
        },
      }
    );

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `Axios error fetching user data: ${error.response?.status} ${error.message}`
      );
    } else {
      console.error("Unexpected error in getUserData:", error);
    }
    // Depending on application needs, you might want to re-throw the error
    // throw error;
    return undefined;
  }
}
