import axios from "axios";
import { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import Icon from "react-native-vector-icons/FontAwesome";
import IconMaterial from "react-native-vector-icons/MaterialIcons";

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
  const [showSignInError, setShowSignInError] = useState<boolean>(false);

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
        Object.hasOwn(githubTokenData, "access_token")
      ) {
        await SecureStore.setItemAsync(
          "github-token",
          githubTokenData.access_token
        );
      }
    } catch (error) {
      console.error("Unable to perform code exchange", error);
      setShowSignInError(true);
    }
  }

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;

      codeExchange(code);
    }
  }, []);

  return (
    <>
      {showSignInError && (
        <View style={styles.errorModalOverlay}>
          <View style={styles.errorModal}>
            <IconMaterial name="error" size={32} color="#EB841A" />
            <Text style={styles.errorModalText}>
              Unable to sign in, try again.
            </Text>
            <Pressable
              onPress={() => setShowSignInError(false)}
              style={{
                marginLeft: "auto",
              }}
            >
              <Text style={styles.errorModalConfirmButton}>OK</Text>
            </Pressable>
          </View>
        </View>
      )}
      <View style={styles.container}>
        <BackgroundImage width={"100%"} height={"100%"} />
        <View style={styles.signInContainer}>
          {/* <TouchableOpacity style={styles.signInButton}>
            <Text style={styles.textSignButton}>Google</Text>
            <Icon name="google" size={16} color="#FFFF" />
          </TouchableOpacity> */}
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
    </>
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
  errorModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    position: "absolute",
    zIndex: 4,
    width: "100%",
    height: "100%",
  },
  errorModal: {
    borderRadius: 20,
    zIndex: 5,
    position: "absolute",
    bottom: "45%",
    left: "25%",
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
    backgroundColor: "#FFFF",
    padding: 16,
    height: 150,
    width: "50%",
  },
  errorModalText: {
    fontFamily: "Montserrat_400Regular",
    color: "#9F9B9B",
    fontSize: 12,
  },
  errorModalConfirmButton: {
    fontFamily: "Montserrat_700Bold",
    color: "#EB841A",
  },
});
