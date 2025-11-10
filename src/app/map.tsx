import { Image } from "expo-image";
import { router } from "expo-router";
import * as Location from "expo-location";
import { AppleMaps, GoogleMaps } from "expo-maps";
import { GoogleMapsMarker as GoogleMapsViewProps } from "expo-maps/build/google/GoogleMaps.types";
import React, { useContext, useEffect, useState, useRef } from "react";
import { Platform, StyleSheet, Pressable, Text, View } from "react-native";
import MaterialCommunityIcon from "@expo/vector-icons/MaterialCommunityIcons";

import { MenuOverlayComponent } from "@components/MenuOverlayComponent";
import UsabilityContext from "@contexts/usability";
import * as interfaces from "@interfaces/index";
import AuthenticationContext from "@contexts/authentication";
import * as Services from "@services/index";

export default function MapScreen() {
  const { showFilter, setShowFilter } = useContext(UsabilityContext);
  const { profileData, setProfileInfo } = useContext(AuthenticationContext);
  const [errorMsg, setErrorMsg] = useState<null | string>(null);
  const [location, setLocation] = useState<null | Location.LocationObject>(
    null
  );
  const [locations, setLocations] = useState<GoogleMapsViewProps[]>([]);
  const mapRef = useRef(null);
  const locationSubscriptionRef = useRef<Location.LocationSubscription | null>(null);

  async function requestLocationPermission() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
  
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
  
      // Clean up any existing subscription before creating a new one
      if (locationSubscriptionRef.current) {
        locationSubscriptionRef.current.remove();
      }
  
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.LocationAccuracy.Highest,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (location) => {
          setLocation(location);
        }
      );
      
      locationSubscriptionRef.current = subscription;
    } catch (error) {
      console.error("Error requesting location permission:", error);
      setErrorMsg("Not authorized to use location services.");
    }
  }

  async function getAllLocations() {
    try {
      const response = await Services.CommunityCaresService.getLocations();
      const locationsMarkers: GoogleMapsViewProps[] =
        response?.data.payload.map((loc: interfaces.LocationsProps) => ({
          id: String(loc.id),
          title: loc.name,
          snippet: loc.address,
          coordinates: {
            latitude: parseFloat(loc.coords.latitude),
            longitude: parseFloat(loc.coords.longitude),
          },
        }));
      setLocations(locationsMarkers);
    } catch (error) {
      console.error("Unable to retrieve Locations /getAllLocations", error);
    }
  }

  async function getGitHubUserData() {
    await Services.GitHubService.getUserData()
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
  }

  useEffect(() => {
    getAllLocations();
    getGitHubUserData();
    requestLocationPermission();

    // Cleanup function to remove the location subscription when component unmounts
    return () => {
      if (locationSubscriptionRef.current) {
        locationSubscriptionRef.current.remove();
      }
    };
  }, []);

  if (Platform.OS === "ios") {
    return <AppleMaps.View style={{ flex: 1 }} />;
  } else if (Platform.OS === "android") {
    if (typeof errorMsg === "string") {
      <View style={styles.errorMessageWrapper}>
        <Text style={styles.errorMessageText}>{errorMsg}</Text>
      </View>;
    }

    return (
      <>
        {showFilter && <MenuOverlayComponent />}
        <Pressable
          style={styles.locationCenterButton}
          onPress={() => {}}
        >
          <MaterialCommunityIcon
            size={24}
            color="#EB841A"
            name="navigation-variant"
          />
        </Pressable>
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
          <Text style={styles.navigationComponentBrand}>Community Cares</Text>
          <Pressable
            style={styles.navigationButton}
            onPress={() => {
              setShowFilter(true);
            }}
          >
            <MaterialCommunityIcon name="magnify" size={24} color="#FFFF" />
          </Pressable>
        </View>
        <GoogleMaps.View
          ref={mapRef}
          cameraPosition={{
            zoom: 12,
            coordinates: {
              latitude: location?.coords.latitude || 37.78825,
              longitude: location?.coords.longitude || -122.4324,
            },
          }}
          style={StyleSheet.absoluteFill}
          markers={locations}
        />
      </>
    );
  } else {
    return <Text>Maps are only available on Android and iOS</Text>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingLocationComponent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  navigationComponent: {
    zIndex: 1,
    width: "80%",
    height: 56,
    backgroundColor: "#FFF",
    borderRadius: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 64,
    alignItems: "center",
    paddingHorizontal: 16,
    marginInline: "auto",
    alignSelf: "center",
    alignContent: "center",
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
  navigationComponentBrand: {
    fontFamily: "Montserrat_900Black",
    color: "#EB841A",
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
  locationCenterButton: {
    borderRadius: 100,
    backgroundColor: "#FFF",
    position: "absolute",
    bottom: 128,
    left: 24,
    width: 40,
    height: 40,
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  markerContainer: {
    padding: 16,
    alignItems: "center",
    borderRadius: 100,
  },
  establishmentHeadlineWrapper: {
    flexDirection: "row",
    gap: 16,
    borderRadius: 12,
  },
  establishmentIcon: {
    borderRadius: 100,
    backgroundColor: "#EB841A",
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  establishmentName: {
    fontFamily: "Shrikhand_400Regular",
    fontSize: 12,
    color: "#EB841A",
  },
  establishmentAddress: {
    fontSize: 8,
    color: "#9F9B9B",
    flexWrap: "wrap",
    width: "80%",
  },
  establishmentHeadline: {},
  establishmentContactWrapper: {
    marginTop: 24,
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
  },
  establishmentContactInfo: {
    flexDirection: "column",
  },
  establishmentContactText: {
    fontFamily: "Montserrat_800ExtraBold",
    color: "#9F9B9B",
  },
  setDirectionsButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  setDirectionsButtonText: {
    color: "#EB841A",
    fontFamily: "Montserrat_200ExtraLight",
    fontSize: 8,
  },
  errorMessageWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorMessageText: {
    fontSize: 18,
    textAlign: "center",
  },
});
