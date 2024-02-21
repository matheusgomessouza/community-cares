import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import BackgroundImage from "../../assets/background-login-fix.svg";
import { useContext, useEffect } from "react";
import AuthenticationContext from "../contexts/authentication";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";

// Endpoint
const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
  revocationEndpoint: `https://github.com/settings/connections/applications/${process.env.EXPO_PUBLIC_CLIENT_ID}`,
};

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const { setIsUserAuthenticated } = useContext(AuthenticationContext);

  const [request, response, promptAsync] = useAuthRequest(
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

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      console.log(code, request, response);
      setIsUserAuthenticated(true);
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
          onPress={() => promptAsync()}
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
    zIndex: 3
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
