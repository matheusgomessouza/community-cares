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

export async function getUserData(
  access?: string
): Promise<interfaces.UserDataProps | undefined> {
  try {
    if (access) {
      const response = await instance.get("/user", {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      console.log(response.data);
      return response.data;
    } else {
      const token = await SecureStore.getItemAsync("github-token");

      if (token) {
        const response = await instance.get("/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        return response.data;
      }
    }
  } catch (error) {
    console.error("Unable to retrieve user data [getUserData]", error);
  }
}
