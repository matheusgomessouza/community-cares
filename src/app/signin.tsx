import { SafeAreaView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";

import Logo from "../../assets/logo.svg";
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
      console.log(code ,request, response)
      setIsUserAuthenticated(true);
    }
  }, [response]);

  return (
    <LinearGradient
      colors={["#EB841A", "#E69B00", "#FFFF"]}
      style={styles.linearGradient}
    >
      <SafeAreaView style={styles.container}>
        <Logo style={styles.logo} width={285} height={265} />
        <Text style={styles.brandName}>Community Cares</Text>
        {/* <TouchableOpacity style={styles.signInButton}>
          <Text style={styles.textSignButton}>Google</Text>
          <Icon name="google" size={16} color="#FFFF" />
        </TouchableOpacity> */}
        <TouchableOpacity
          disabled={!request}
          style={styles.signInButton}
          onPress={() => promptAsync()}
        >
          <Text style={styles.textSignButton}>Github</Text>
          <Icon name="github" size={16} color="#FFFF" />
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    padding: 24,
    paddingTop: 64,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 16,
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
