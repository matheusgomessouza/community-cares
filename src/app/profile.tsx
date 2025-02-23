import { useContext } from "react";
import { router } from "expo-router";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import * as SecureStore from "expo-secure-store";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

import AuthenticationContext from "@contexts/authentication";
import UsabilityContext from "@contexts/usability";

export default function ProfileScreen() {
  const { setIsUserAuthenticated, profileData } = useContext(
    AuthenticationContext
  );
  const { foreignUser } = useContext(UsabilityContext);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Icon
          name="chevron-left"
          size={24}
          color="#C76E16"
          onPress={() => {
            router.navigate("map");
          }}
        />
        <Icon
          name="help-circle-outline"
          size={24}
          color="#C76E16"
          onPress={() => router.navigate("faq")}
        />
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
          <View style={styles.achievementsLabelSubContainer}>
            <Icon name="trophy" size={16} color="#C76E16" />
            <Text style={styles.achievementsLabel}>
              {foreignUser ? "Achievements" : "Conquistas"}
            </Text>
          </View>
          <Text style={styles.achievementsTracker}>{0} of 15</Text>
        </View>
        <View style={styles.achievementsContainer}></View>
        <Pressable style={styles.seeMoreContainer}>
          <Text style={styles.seeMoreButton}>See more</Text>
        </Pressable>
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
    justifyContent: "space-between",
    gap: 8,
  },
  achievementsLabelSubContainer: {
    flexDirection: "row",
    gap: 8,
  },
  achievementsTracker: {
    color: "#9F9B9B",
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
  },
  achievementsLabel: {
    fontFamily: "Montserrat_700Bold",
    color: "#9F9B9B",
  },
  achievementsContainer: {
    width: "100%",
    height: 72,
    backgroundColor: "rgba(199,110,22, 0.4)",
    borderRadius: 10,
    marginTop: 16,
  },
  seeMoreContainer: {
    marginLeft: "auto",
    marginTop: 8,
  },
  seeMoreButton: {
    color: "#C76E16",
    fontFamily: "Montserrat_700Bold",
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
