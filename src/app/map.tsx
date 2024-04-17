import { Image } from "expo-image";
import { router } from "expo-router";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { useContext, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import MenuOverlayComponent from "../components/MenuOverlay";
import UsabilityContext from "../contexts/usability";
import { githubInstance } from "services/api";
import * as interfaces from "../interfaces";
import AuthenticationContext from "contexts/authentication";

export default function MapScreen() {
  const { showFilter, setShowFilter } = useContext(UsabilityContext);
  const { githubTokenData } = useContext(AuthenticationContext);
  const [profileData, setProfileInfo] = useState<
    interfaces.UserDataProps | undefined
  >({} as interfaces.UserDataProps | undefined);
  const [errorMsg, setErrorMsg] = useState<null | string>(null);
  const [location, setLocation] = useState<null | Location.LocationObject>(
    null
  );

  let latDelta;
  let lonDelta;

  function calculateCurrentPositionDeltas() {
    const circumference = (40075 / 360) * 1000;
    const oneDegreeOfLongitudeInMeters = 111.32 * 1000;

    if (location?.coords.accuracy) {
      latDelta =
        location?.coords.accuracy *
        (1 / (Math.cos(location?.coords.latitude) * circumference));
      lonDelta = location?.coords.accuracy / oneDegreeOfLongitudeInMeters;
    }
  }

  async function requestLocationPermission() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  }

  async function getUserData(): Promise<interfaces.UserDataProps | undefined> {
    try {
      if (typeof githubTokenData.access_token === "string") {
        const { data } = await githubInstance.get("/user", {
          headers: {
            Authorization: `Bearer ${githubTokenData.access_token}`,
          },
        });
        return data;
      }
    } catch (error) {
      console.error("Unable to retrieve user data [getUserData]", error);
    }
  }

  async function setPayloadUserData() {
    const payload = await getUserData()
      .then((response: interfaces.UserDataProps | undefined) => {
        setProfileInfo(response);
      })
      .catch((err: unknown) => {
        console.error("Failed to retrieve profile data", err);
      });
    console.log("github-api-user-payload", payload);
  }

  useEffect(() => {
    calculateCurrentPositionDeltas();
    requestLocationPermission();
    setPayloadUserData();
  }, []);

  return (
    <View style={styles.container}>
      {showFilter && <MenuOverlayComponent />}
      {typeof errorMsg === "string" && (
        <View>
          <Text>{errorMsg}</Text>
        </View>
      )}
      <View style={styles.navigationComponent}>
        <Pressable
          onPress={() => {
            router.navigate("profile");
          }}
          style={styles.navigationButton}
        >
          <Image
            source={profileData?.avatar_url}
            style={styles.profilePicture}
          />
        </Pressable>
        <Text
          style={{
            fontFamily: "Montserrat_900Black",
            color: "#EB841A",
          }}
        >
          Community Cares
        </Text>
        <Pressable
          style={styles.navigationButton}
          onPress={() => {
            setShowFilter(true);
          }}
        >
          <Icon name="magnify" size={24} color="#FFFF" />
        </Pressable>
      </View>
      <MapView
        initialRegion={{
          latitude: location?.coords.latitude ?? 37.78825,
          longitude: location?.coords.longitude ?? -122.4324,
          latitudeDelta: latDelta ?? 0.0922,
          longitudeDelta: lonDelta ?? 0.421,
        }}
        style={styles.map}
      />
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
    zIndex: 1,
    width: "80%",
    height: 56,
    backgroundColor: "#FFFF",
    borderRadius: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 32,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  navigationButton: {
    backgroundColor: "#EB841A",
    borderRadius: 100,
    padding: 8,
    position: "relative",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  profilePicture: {
    zIndex: 2,
    width: 28,
    height: 28,
    borderRadius: 100,
  },
});
