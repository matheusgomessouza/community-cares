import { useContext, useEffect, useRef, useState } from "react";
import { router } from "expo-router";
import { Image } from "expo-image";
import * as SecureStore from "expo-secure-store";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import IconF from "react-native-vector-icons/FontAwesome";
import { getUserData } from "services/gituhb-api";
import * as interfaces from "../interfaces";
import AuthenticationContext from "contexts/authentication";

export default function ProfileScreen() {
  const { setIsUserAuthenticated } = useContext(
    AuthenticationContext
  );
  const [profileData, setProfileInfo] = useState<
    interfaces.UserDataProps | undefined
  >({} as interfaces.UserDataProps | undefined);

  useEffect(() => {
    (async () => {
      await getUserData()
        .then((res: interfaces.UserDataProps | undefined) => {
          if (res) {
            setProfileInfo({
              name: res.name,
              avatar_url: res.avatar_url,
              bio: res.bio,
              login: res.login,
              location: res.location,
            });
          }
        })
        .catch((err: unknown) => {
          console.error("Failed to retrieve profile data", err);
        });
    })();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Icon
          name="arrow-left"
          size={24}
          color="#C76E16"
          onPress={() => {
            router.navigate("map");
          }}
        />
        <IconF name="gear" size={24} color="#C76E16" onPress={() => {}} />
      </View>
      <View style={styles.profileInfo}>
        <View style={styles.profileHeadlineContainer}>
          <Image
            style={styles.profilePicture}
            source={profileData?.avatar_url}
          />
          <View>
            <Text style={styles.profileName}>{profileData?.name}</Text>
            <Text style={styles.profileProfission}>{profileData?.bio}</Text>
            <View style={styles.userInfoWrapper}>
              {profileData?.login && (
                <View style={styles.userInfoContainer}>
                  <Icon name="account" color="#C76E16" size={16} />
                  <Text style={styles.userInfo}>{profileData?.login}</Text>
                </View>
              )}
              <View style={styles.userInfoContainer}>
                <Icon name="web" color="#C76E16" size={16} />
                <Text style={styles.userInfo}>{profileData?.location}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.achievementsLabelContainer}>
          <Icon name="trophy" size={16} color="#C76E16" />
          <Text style={styles.achievementsLabel}>Achievements</Text>
        </View>
        <View style={styles.achievementsContainer}></View>
      </View>
      <Pressable
        style={styles.logOutButtonContainer}
        onPress={async () => {
          await SecureStore.deleteItemAsync("github-token");
          setIsUserAuthenticated(false);
          router.replace("signin");
        }}
      >
        <Icon name="power" size={24} color="#C76E16" />
        <Text style={styles.logOutButtonText}>Log out</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  profileInfo: {
    marginTop: 24,
  },
  profileHeadlineContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 100,
  },
  profileName: {
    fontFamily: "Shrikhand_400Regular",
    fontSize: 16,
    color: "#C76E16",
  },
  profileProfission: {
    color: "#9F9B9B",
  },
  userInfoWrapper: {
    gap: 6,
    marginTop: 16,
  },
  userInfoContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  userInfo: {
    color: "#9F9B9B",
    fontFamily: "Montserrat_700Bold",
    fontSize: 12,
  },
  achievementsLabelContainer: {
    marginTop: 32,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  achievementsLabel: {
    fontFamily: "Montserrat_700Bold",
    color: "#9F9B9B",
  },
  achievementsContainer: {
    width: "100%",
    height: 196,
    backgroundColor: "rgba(199,110,22, 0.4)",
    borderRadius: 25,
    marginTop: 16,
  },
  logOutButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: "auto",
  },
  logOutButtonText: {
    color: "#C76E16",
    fontFamily: "Montserrat_700Bold",
  },
});
