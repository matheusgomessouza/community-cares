import { Image } from "expo-image";
import { router } from "expo-router";
import * as Location from "expo-location";
import MapView, { Marker, enableLatestRenderer } from "react-native-maps";
import { useContext, useEffect, useState, useRef } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import MenuOverlayComponent from "../components/MenuOverlay";
import UsabilityContext from "../contexts/usability";
import { getUserData } from "services/gituhb-api";
import * as interfaces from "../interfaces";
import AuthenticationContext from "contexts/authentication";

export default function MapScreen() {
  enableLatestRenderer();
  const { showFilter, setShowFilter } = useContext(UsabilityContext);
  const { profileData, setProfileInfo } = useContext(AuthenticationContext);
  const [errorMsg, setErrorMsg] = useState<null | string>(null);
  const [location, setLocation] = useState<null | Location.LocationObject>(
    null
  );
  const mapRef = useRef<MapView>(null);

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
    if (!location.coords.longitude && !location.coords.latitude) {
      setErrorMsg("Error during location calculation");
    }
  }

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

  useEffect(() => {
    requestLocationPermission();
  }, [location]);

  useEffect(() => {
    Location.watchPositionAsync(
      {
        accuracy: Location.LocationAccuracy.Highest,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (response) => {
        setLocation(response);
        mapRef.current?.animateCamera({
          center: response.coords,
        });
      }
    );
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" translucent />

      {showFilter && <MenuOverlayComponent />}
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
          {location ? (
            <MapView
              ref={mapRef}
              region={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
              style={styles.map}
            >
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                // image={require("../../assets/map-marker.png")}
              />
            </MapView>
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
    bottom: 64,
    alignItems: "center",
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
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
