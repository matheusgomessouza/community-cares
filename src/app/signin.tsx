import axios from "axios";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import Icon from "react-native-vector-icons/FontAwesome";

import * as interfaces from "../interfaces/";
import BackgroundImage from "../../assets/background-login-fix.svg";

const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
  revocationEndpoint: `https://github.com/settings/connections/applications/${process.env.EXPO_PUBLIC_CLIENT_ID}`,
};

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const [githubTokenData, setGithubTokenData] =
    useState<interfaces.SuccessGithubResponseProps>(
      {} as interfaces.SuccessGithubResponseProps
    );

  const [request, response, signInWithGithub] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_CLIENT_ID
        ? process.env.EXPO_PUBLIC_CLIENT_ID
        : "",
      scopes: ["identity"],
      redirectUri: makeRedirectUri({
        scheme: "community-cares",
      }),
    },
    discovery
  );

  async function codeExchange(code: string) {
    try {
      const response = await axios.post(
        `http://${process.env.EXPO_PUBLIC_WSL_SERVER_IP}:8080/authenticate`,
        {
          code: code,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      setGithubTokenData(response.data);

      if (
        response.status === 200 &&
        githubTokenData.access_token !== undefined
      ) {
        await SecureStore.setItemAsync("github-token", githubTokenData.access_token);
      } else {
        return
      }
    } catch (error) {
      console.error("Unable to perform code exchange", error);
    }
  }

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;

      codeExchange(code);
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <BackgroundImage width={"100%"} height={"100%"} />
      <View style={styles.signInContainer}>
        <TouchableOpacity style={styles.signInButton}>
          <Text style={styles.textSignButton}>Google</Text>
          <Icon name="google" size={16} color="#FFFF" />
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!request}
          style={styles.signInButton}
          onPress={() => signInWithGithub()}
        >
          <Text style={styles.textSignButton}>Github</Text>
          <Icon name="github" size={16} color="#FFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    zIndex: 2,
  },
  logo: {
    marginBottom: 16,
  },
  brandName: {
    fontSize: 24,
    fontFamily: "Shrikhand_400Regular",
    color: "#FFFF",
    marginBottom: "auto",
  },
  signInContainer: {
    position: "absolute",
    bottom: 16,
    zIndex: 3,
  },
  signInButton: {
    backgroundColor: "#EB841A",
    height: 40,
    width: 250,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  textSignButton: {
    color: "#FFFF",
    fontSize: 16,
    fontFamily: "Montserrat_700Bold",
    marginRight: 8,
  },
});
