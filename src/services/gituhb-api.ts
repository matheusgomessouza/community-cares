import axios from "axios";
import * as interfaces from "../interfaces";
import * as SecureStore from "expo-secure-store";

export const githubInstance = axios.create({
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

    if (deviceToken) {
      const { data } = await githubInstance.get("/user", {
        headers: {
          Authorization: `Bearer ${deviceToken}`,
        },
      });

      return data;
    }
  } catch (error) {
    console.error("Unable to retrieve user data [getUserData]", error);
  }
}
