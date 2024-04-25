import { Image } from "expo-image";
import { router } from "expo-router";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { useContext, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useWindowDimensions } from "react-native";
import { StatusBar } from "expo-status-bar";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import MenuOverlayComponent from "../components/MenuOverlay";
import UsabilityContext from "../contexts/usability";
import { getUserData } from "services/gituhb-api";
import * as interfaces from "../interfaces";

export default function MapScreen() {
  const { showFilter, setShowFilter } = useContext(UsabilityContext);
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<null | string>(null);
  const [location, setLocation] = useState<null | Location.LocationObject>(
    null
  );
  const [latDelta, setLatDelta] = useState<number>();
  const [lonDelta, setLonDelta] = useState<number>();
  const { width, height } = useWindowDimensions();

  function calculateCurrentPositionDeltas() {
    const desiredVerticalSpan = 0.04;
    const desiredHorizontalSpan = 0.05;

    if (location?.coords.accuracy) {
      const latDeltaCalculated = Math.round(width) / desiredVerticalSpan;
      setLatDelta(latDeltaCalculated);
      const lonDeltaCalculated = Math.round(height) / desiredHorizontalSpan;
      setLonDelta(lonDeltaCalculated);
    }
  }

  async function requestLocationPermission() {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({
      accuracy: 4,
    });

    if (location) setLocation(location);
    if (location.coords.longitude && location.coords.latitude) {
      calculateCurrentPositionDeltas();
    } else {
      setErrorMsg("Error during location calculation");
    }
  }

  async function setPayloadUserData() {
    await getUserData()
      .then((response: interfaces.UserDataProps | undefined) => {
        if (response) setProfilePicture(response?.avatar_url);
      })
      .catch((err: unknown) => {
        console.error("Failed to retrieve profile data", err);
      });
  }

  useEffect(() => {
    setPayloadUserData();
  }, []);

  useEffect(() => {
    requestLocationPermission();
  }, [location]);

  return (
    <View style={styles.container}>
      <StatusBar style="inverted" />

      {showFilter && <MenuOverlayComponent />}
      <View style={styles.navigationComponent}>
        <Pressable
          onPress={() => {
            router.navigate("profile");
          }}
          style={styles.navigationButton}
        >
          <Image source={profilePicture} style={styles.profilePicture} />
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

      {typeof errorMsg === "string" ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              textAlign: "center",
            }}
          >
            {errorMsg}
          </Text>
        </View>
      ) : (
        <>
          {location && latDelta && lonDelta ? (
            <MapView
              region={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: latDelta,
                longitudeDelta: lonDelta,
              }}
              style={styles.map}
            />
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>Loading coordinates...</Text>
            </View>
          )}
        </>
      )}
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
