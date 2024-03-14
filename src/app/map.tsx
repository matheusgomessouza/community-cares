import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView from "react-native-maps";
import { router } from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import MenuOverlayComponent from "../../src/components/MenuOverlay";
import UsabilityContext from "../contexts/usability";
import { getUserData } from "services/github";
import * as interfaces from "../interfaces";
import { Image } from "expo-image";

export default function MapScreen() {
  const { showFilter, setShowFilter } = useContext(UsabilityContext);

  const [profileData, setProfileInfo] = useState<
    interfaces.UserDataProps | undefined
  >({} as interfaces.UserDataProps | undefined);

  useEffect(() => {
    const response = getUserData();

    response
      .then((res: interfaces.UserDataProps | undefined) => {
        setProfileInfo(res);
      })
      .catch((err: unknown) => {
        console.error("Failed to retrieve profile data", err);
      });
  }, []);

  return (
    <View style={styles.container}>
      {showFilter && <MenuOverlayComponent />}
      <View style={styles.navigationComponent}>
        <Icon
          name=""
          size={24}
          color="#FFFF"
          onPress={() => {
            router.navigate("profile");
          }}
          style={[styles.navigationButton, { padding: 6 }]}
        >
          <Image
            source={profileData?.avatar_url}
            style={styles.profilePicture}
          />
        </Icon>
        <Text
          style={{
            fontFamily: "Montserrat_900Black",
            color: "#EB841A",
          }}
        >
          Community Cares
        </Text>
        <Icon
          name="magnify"
          size={24}
          color="#FFFF"
          onPress={() => {
            setShowFilter(true);
          }}
          style={styles.navigationButton}
        />
      </View>
      <MapView style={styles.map} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  navigationComponent: {
    zIndex: 50,
    width: "80%",
    height: 56,
    backgroundColor: "#FFFF",
    borderRadius: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 32,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  navigationButton: {
    backgroundColor: "#EB841A",
    borderRadius: 100,
    padding: 8,
    position: "relative",
  },
  profilePicture: {
    width: 32,
    height: 32,
    borderRadius: 100,
    position: "absolute",
  },
});
