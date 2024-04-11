import axios from "axios";
import * as SecureStore from "expo-secure-store";
import * as interfaces from "../interfaces";

const instance = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  },
});

async function retrieveStoreToken() {
  return await SecureStore.getItemAsync("github-token");
}

export async function getUserData(): Promise<
  interfaces.UserDataProps | undefined
> {
  try {
    const token = await retrieveStoreToken();

    if (typeof token === "string") {
      const { data } = await instance.get("/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    }
  } catch (error) {
    console.error("Unable to retrieve user data [getUserData]", error);
  }
}
