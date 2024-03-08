import { useEffect } from "react";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function ProfileScreen() {
  async function getGithubProfileData() {}

  useEffect(() => {
    getGithubProfileData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Icon
          name="arrow-left"
          size={24}
          color="#EB7100"
          onPress={() => {
            router.navigate("map");
          }}
        />
        <Icon name="menu" size={24} color="#EB7100" onPress={() => {}} />
      </View>
      <View style={styles.profileInfo}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
          }}
        >
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 100,
              backgroundColor: "#EB7100",
            }}
          />
          <View>
            <Text
              style={{
                fontFamily: "Shrikhand_400Regular",
                fontSize: 16,
                color: "#EB7100",
              }}
            >
              Matheus Souza
            </Text>
            <Text
              style={{
                color: "#9F9B9B",
              }}
            >
              Software Developer
            </Text>
          </View>
        </View>
        <View
          style={{
            gap: 6,
            marginTop: 24,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              alignItems: "center",
            }}
          >
            <Icon name="email" color="#9F9B9B" size={16} />
            <Text
              style={{
                color: "#9F9B9B",
                fontFamily: "Montserrat_400Regular",
                fontSize: 12,
              }}
            >
              matheus_souza@mail.com
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              alignItems: "center",
            }}
          >
            <Icon name="map-marker" color="#9F9B9B" size={16} />
            <Text
              style={{
                color: "#9F9B9B",
                fontFamily: "Montserrat_400Regular",
                fontSize: 12,
              }}
            >
              Brazil
            </Text>
          </View>
        </View>
        <View
          style={{
            marginTop: 32,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Icon name="medal" size={24} color={"#EB7100"} />
          <Text
            style={{
              fontFamily: "Montserrat_400Regular",
              color: "#9F9B9B",
            }}
          >
            Achievements
          </Text>
        </View>
        <View
          style={{
            width: "100%",
            height: 196,
            backgroundColor: "#DDDDDD",
            borderRadius: 25,
            marginTop: 16,
          }}
        ></View>
      </View>
      <Pressable
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
          marginTop: "auto",
        }}
        onPress={async () => {
          await SecureStore.deleteItemAsync("github-token");
          router.replace("signin");
        }}
      >
        <Icon name="power" size={24} color="#EB7100" />
        <Text
          style={{
            color: "#EB7100",
            fontFamily: "Montserrat_700Bold",
          }}
        >
          Log out
        </Text>
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
});
