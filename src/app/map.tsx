import { Image } from "expo-image";
import { router } from "expo-router";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import MenuOverlayComponent from "../../src/components/MenuOverlay";
import UsabilityContext from "../contexts/usability";
import { getUserData } from "services/github";
import * as interfaces from "../interfaces";

type MapScreenProps = {
  access?: string
}

export default function MapScreen({ access }: MapScreenProps) {
  const { showFilter, setShowFilter } = useContext(UsabilityContext);
  const [profileData, setProfileInfo] = useState<
    interfaces.UserDataProps | undefined
  >({} as interfaces.UserDataProps | undefined);
  const [errorMsg, setErrorMsg] = useState<null | string>(null);
  const [location, setLocation] = useState<null | Location.LocationObject>(
    null
  );
  
  const circumference = (40075 / 360) * 1000;
  const oneDegreeOfLongitudeInMeters = 111.32 * 1000;
  let latDelta;
  let lonDelta;

  if (location?.coords.accuracy) {
    latDelta =
      location?.coords.accuracy *
      (1 / (Math.cos(location?.coords.latitude) * circumference));
    lonDelta = location?.coords.accuracy / oneDegreeOfLongitudeInMeters;
  }

  useEffect(() => {
    const response = getUserData(access);
    response
      .then((res: interfaces.UserDataProps | undefined) => {
        setProfileInfo(res);
      })
      .catch((err: unknown) => {
        console.error("Failed to retrieve profile data", err);
      });

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
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
