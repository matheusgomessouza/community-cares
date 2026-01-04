import { useContext } from "react";
import { router } from "expo-router";
import { Image } from "expo-image";
import * as SecureStore from "expo-secure-store";
import { StyleSheet, View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

import AuthenticationContext from "@contexts/authentication";
import UsabilityContext from "@contexts/usability";

const ACHIEVEMENTS: Array<{
  id: number;
  title: string;
  date: string;
  icon: React.ComponentProps<typeof Icon>["name"];
}> = [
  { id: 1, title: "Street Saint", date: "24/04/2023", icon: "walk" },
  { id: 2, title: "Guide", date: "21/05/2023", icon: "sign-direction" },
  { id: 3, title: "First Responder", date: "24/05/2023", icon: "medical-bag" },
  { id: 4, title: "Shelter Builder", date: "21/08/2023", icon: "home-group" },
  { id: 5, title: "Meal Provider", date: "24/05/2023", icon: "food" },
];

const RECENT_ACTIVITY = [
  {
    id: 1,
    title: "Donated clothes in Downtown",
    date: "22/07/2023",
    description: "Donated clothes in Downtown",
    image: "https://picsum.photos/seed/1/200",
  },
  {
    id: 2,
    title: "Served meals at Shelter",
    date: "24/04/2023",
    description: "Served meals at Shelter",
    image: "https://picsum.photos/seed/2/200",
  },
];

export default function ProfileScreen() {
  const { setIsUserAuthenticated, profileData } = useContext(
    AuthenticationContext
  );
  const { foreignUser } = useContext(UsabilityContext);

  return (
    <SafeAreaView style={styles.container}>
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={{ flex: 1 }}
      >
        <View style={styles.profileInfo}>
          <View style={styles.profileHeadlineContainer}>
            <Image
              style={styles.profilePicture}
              source={profileData?.avatar_url}
            />
            <View>
              <Text style={styles.profileName}>{profileData?.name}</Text>
              <Text
                style={styles.profileProfission}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {profileData?.bio}
              </Text>
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
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Icon name="trophy" size={20} color="#C76E16" />
              <Text style={styles.sectionTitle}>
                {foreignUser ? "Achievements" : "Conquistas"}
              </Text>
            </View>
            <Text style={styles.sectionSubtitle}>5 of 15</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.achievementsScroll}
          >
            {ACHIEVEMENTS.map((item) => (
              <View key={item.id} style={styles.achievementCard}>
                <View style={styles.achievementIconContainer}>
                  <Icon name={item.icon} size={32} color="#C76E16" />
                </View>
                <Text style={styles.achievementTitle}>{item.title}</Text>
                <Text style={styles.achievementDate}>{item.date}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionTitleContainer}>
            <Icon name="clock-outline" size={20} color="#C76E16" />
            <Text style={styles.sectionTitle}>Recent Activity</Text>
          </View>
          <View style={styles.activityList}>
            {RECENT_ACTIVITY.map((item) => (
              <View key={item.id} style={styles.activityCard}>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityTitle}>{item.title}</Text>
                  <Text style={styles.activityDate}>{item.date}</Text>
                  <Text style={styles.activityDescription}>
                    {item.description}
                  </Text>
                </View>
                <Image
                  source={{ uri: item.image }}
                  style={styles.activityImage}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionTitleContainer}>
            <Icon name="account-group" size={20} color="#C76E16" />
            <Text style={styles.sectionTitle}>My Impact</Text>
          </View>
          <View style={styles.impactContainer}>
            <View style={styles.impactItem}>
              <Text style={styles.impactLabel}>People Helped</Text>
              <Text style={styles.impactValue}>85</Text>
            </View>
            <View style={styles.impactDivider} />
            <View style={styles.impactItem}>
              <Text style={styles.impactLabel}>Hours Volunteered</Text>
              <Text style={styles.impactValue}>120</Text>
            </View>
            <View style={styles.impactDivider} />
            <View style={styles.impactItem}>
              <Text style={styles.impactLabel}>Projects Supported</Text>
              <Text style={styles.impactValue}>5</Text>
            </View>
          </View>
        </View>
      </ScrollView>

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
    backgroundColor: "#FFF8F0",
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  profileInfo: {
    marginTop: 8,
    marginBottom: 24,
  },
  profileHeadlineContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileName: {
    fontFamily: "Shrikhand_400Regular",
    fontSize: 20,
    color: "#C76E16",
  },
  profileProfission: {
    color: "#666",
    maxWidth: 200,
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    marginTop: 4,
  },
  userInfoWrapper: {
    gap: 4,
    marginTop: 8,
  },
  userInfoContainer: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  userInfo: {
    color: "#666",
    fontFamily: "Montserrat_400Regular",
    fontSize: 12,
  },
  sectionContainer: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 16,
    color: "#333",
  },
  sectionSubtitle: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 12,
    color: "#666",
  },
  achievementsScroll: {
    flexDirection: "row",
  },
  achievementCard: {
    alignItems: "center",
    marginRight: 16,
    width: 100,
  },
  achievementIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#EBCFB2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "#C76E16",
  },
  achievementTitle: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 12,
    textAlign: "center",
    color: "#333",
    marginBottom: 4,
  },
  achievementDate: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 10,
    textAlign: "center",
    color: "#666",
  },
  activityList: {
    gap: 12,
  },
  activityCard: {
    backgroundColor: "#EBCFB2",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activityInfo: {
    flex: 1,
    marginRight: 12,
  },
  activityTitle: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 14,
    color: "#000",
    marginBottom: 4,
  },
  activityDate: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 10,
    color: "#666",
    marginBottom: 8,
  },
  activityDescription: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 12,
    color: "#333",
  },
  activityImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  impactContainer: {
    backgroundColor: "#EBCFB2",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  impactItem: {
    alignItems: "center",
    flex: 1,
  },
  impactLabel: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 10,
    color: "#333",
    textAlign: "center",
    marginBottom: 4,
  },
  impactValue: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 20,
    color: "#000",
  },
  impactDivider: {
    width: 1,
    height: "80%",
    backgroundColor: "#C76E16",
    opacity: 0.3,
  },
  logOutButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 16,
  },
  logOutButtonText: {
    color: "#C76E16",
    fontFamily: "Montserrat_700Bold",
  },
});
