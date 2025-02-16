import React from "react";
import { useContext, useEffect } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import GitHubIcon from "react-native-vector-icons/FontAwesome";
import LoadingIcon from "react-native-vector-icons/MaterialCommunityIcons";
import ErrorIcon from "react-native-vector-icons/MaterialIcons";

import BackgroundImage from "../../assets/background-login-fix.svg";
import AuthenticationContext from "@contexts/authentication";
import { env } from "../../env";

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
  revocationEndpoint: `https://github.com/settings/connections/applications/${env.EXPO_PUBLIC_CLIENT_ID}`,
};

export default function SignInScreen() {
  const {
    codeExchange,
    showSignInError,
    setShowSignInError,
    isAuthenticating,
  } = useContext(AuthenticationContext);
  const [, response, signInWithGithub] = useAuthRequest(
    {
      clientId: env.EXPO_PUBLIC_CLIENT_ID ? env.EXPO_PUBLIC_CLIENT_ID : "",
      scopes: ["user"],
      redirectUri: makeRedirectUri({
        scheme: "community-cares",
      }),
    },
    discovery
  );
  const sv = useSharedValue<number>(0);
  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      if (code) codeExchange(code);
    }
  }, [response]);

  useEffect(() => {
    sv.value = withRepeat(
      withTiming(1, {
        duration: 2000,
        easing: Easing.bezier(0.25, -0.5, 0.25, 1),
      }),
      -1 // -1 means infinite loop
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sv.value * 360}deg` }],
  }));

  return (
    <>
      {showSignInError && (
        <View style={styles.errorModalOverlay}>
          <View style={styles.errorModal}>
            <ErrorIcon name="error" size={32} color="#EB841A" />
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
          <TouchableOpacity
            disabled={isAuthenticating}
            style={styles.signInButton}
            onPress={() => signInWithGithub()}
          >
            {isAuthenticating ? (
              <>
                <Text style={styles.textSignButton}>Authenticating</Text>
                <Animated.View style={animatedStyle}>
                  <LoadingIcon name="dots-circle" size={16} color="#FFFF" />
                </Animated.View>
              </>
            ) : (
              <>
                <Text style={styles.textSignButton}>Github</Text>
                <GitHubIcon name="github" size={16} color="#FFFF" />
              </>
            )}
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
